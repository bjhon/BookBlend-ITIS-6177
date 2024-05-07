/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - review
 *       properties:
 *         review:
 *           type: string
 *           description: The user will input the text of the review for the book they read The review may contain spoilers.
 *           example: "The book was great! I loved the main character."
 *         id:
 *           type: integer
 *           description: The ID of the review.
 *           example: 1
 */

const express = require("express");
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const mariadb = require("mariadb");
const app = express();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const apiKey = process.env.TEXT_ANALYTICS_API_KEY; // set environment variables from .env
const endpoint = process.env.ENDPOINT; // set environment variables from .env

// Enable CORS for all routes
app.use(cors());

app.use(express.json());
// load the .env file for key and endpoint url
require("dotenv").config();

// Swagger JSDoc configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Reviews',
      version: '1.0.0',
      description: 'API documentation using Swagger JSDoc',
    },
  },
  apis: ['./server.js'],
};

// Generate Swagger JSON
const swaggerSpec = swaggerJsdoc(options);
// Serve Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "db",
  connectionLimit: 5
});

async function analyzeSentiment(reviewText) {
  const client = new TextAnalyticsClient(endpoint, new AzureKeyCredential(apiKey));

  const documents = [{ text: reviewText, id: "0", language: "en" }];
  const results = await client.analyzeSentiment(documents, { includeOpinionMining: true });

  return results[0];
}

/**
 * @swagger
 * /analyze-sentiment:
 *   post:
 *     summary: Analyze sentiment of a review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: This is when the user has submitted a review and it goes to the 'BookBlend' Sentiment analysis process powered by Azure. The review will be flagged with the sentiment analysis result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sentiment:
 *                   type: string
 *                   description: Outcome of the overall sentiment of the review posted by the user.
 *                   example: "positive"
 *                 confidenceScores:
 *                   type: object
 *                   description: The confidence scores for the sentiment analysis based on evaluated review text. There is 3 'levels' to the sentiment, positive, neutral, and negative, each being scored more than 0 and less than 1.
 *                   example: {"positive": 0.92, "neutral": 0.05, "negative": 0.03}
 *                 sentences:
 *                   type: array
 *                   description: Breaks down the review into sentences and shows the sentiment analysis result.
 *                   items:
 *                     type: object
 *                     properties:
 *                       text:
 *                         type: string
 *                         description: Breaks down the review into sentences.
 *                         example: "The book was great! I loved the main character."
 *                       sentiment:
 *                         type: string
 *                         description: shows the sentiment analysis result.
 *                         example: "positive"
 *                       confidenceScores:
 *                         type: object
 *                         description: The confidence scores for the sentiment analysis based on evaluated review text. There is 3 'levels' to the sentiment, positive, neutral, and negative, each being scored more than 0 and less than 1.
 *                         example: {"positive": 0.92, "neutral": 0.05, "negative": 0.03}
 *                       opinions:
 *                         type: array
 *                         description: User's review is evaluated and opinions/assessments are showed in the sentence.
 *                         items:
 *                           type: object
 *                           properties:
 *                             target:
 *                               type: object
 *                               description: This shows the target of the assessment based on the analysis of the text.
 *                               properties:
 *                                 text:
 *                                   type: string
 *                                   description: The part of text that is identified and the target.
 *                                   example: "book"
 *                                 sentiment:
 *                                   type: string
 *                                   description: Shows the sentiment result of the targeted part of the text.
 *                                   example: "positive"
 *                                 confidenceScores:
 *                                   type: object
 *                                   description: The confidence scores for the sentiment analysis based on evaluated review text. There is 3 'levels' to the sentiment, positive, neutral, and negative, each being scored more than 0 and less than 1.
 *                                   example: {"positive": 0.95, "neutral": 0.02, "negative": 0.03}
 *                             assessments:
 *                               type: array
 *                               description: Assessments of the target.
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   text:
 *                                     type: string
 *                                     description: The text of the assessment.
 *                                     example: "great"
 *                                   sentiment:
 *                                     type: string
 *                                     description: Sentiment of the assessment.
 *                                     example: "positive"
 */

// Endpoint to analyze sentiment and print the result
app.post("/analyze-sentiment", async (req, res) => {
  const { review } = req.body;
  const sentimentAnalysisResult = await analyzeSentiment(review);
  res.json(sentimentAnalysisResult);
});

/**
 * @swagger
 * /new-review:
 *   post:
 *     summary: Enter a new review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: this displays the review and will show the sentiment analysis result
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "Review: The book was great! I loved the main character.<br><br>Sentiment Analysis Result: { sentiment: 'positive', confidenceScores: { positive: 0.92, neutral: 0.05, negative: 0.03 }, ... }"
 */

// Endpoint to enter a review
app.post("/new-review", async (req, res) => {
  const review = req.body.review;
  const sentimentAnalysisResult = await analyzeSentiment(review);
  res.send(`Review: ${review}<br><br>Sentiment Analysis Result: ${JSON.stringify(sentimentAnalysisResult, null, 2)}`);
});

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       500:
 *         description: Failed to delete review
 */

// Endpoint to delete a review
app.delete("/reviews/:id", async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("DELETE FROM reviews WHERE id = ?", [id]);
    res.send(`Deleted review with ID ${id}`);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete review" });
  } finally {
    if (conn) conn.release();
  }
});

/**
 * @swagger
 * /reviews:
 *   delete:
 *     summary: Delete all reviews
 *     responses:
 *       200:
 *         description: All reviews deleted successfully
 *       500:
 *         description: Failed to delete reviews
 */

// Endpoint to delete all reviews
app.delete("/reviews", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("DELETE FROM reviews");
    res.send("Deleted review");
  } catch (error) {
    res.status(500).json({ error: "Failed to delete review" });
  } finally {
    if (conn) conn.release();
  }
});

/**
 * @swagger
 * /reviews/{id}:
 *   patch:
 *     summary: Update a review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       500:
 *         description: Failed to update review
 */

// Endpoint to update a review
app.patch("/reviews/:id", async (req, res) => {
  const { id } = req.params;
  const { review } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("UPDATE reviews SET review = ? WHERE id = ?", [review, id]);
    res.send(`Updated review with ID ${id}`);
  } catch (error) {
    res.status(500).json({ error: "Failed to update review" });
  } finally {
    if (conn) conn.release();
  }
});

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Failed to get reviews
 */

// Endpoint to get all reviews
app.get("/reviews", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM reviews");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to get reviews" });
  } finally {
    if (conn) conn.release();
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});