# BookBlend-ITIS-6177

<picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://t3.ftcdn.net/jpg/00/53/73/42/360_F_53734293_rs3bkrl9n1EJZBj2CdogkmeF6W5aOhy5.jpg">
 <source media="(prefers-color-scheme: light)" srcset="https://t3.ftcdn.net/jpg/00/53/73/42/360_F_53734293_rs3bkrl9n1EJZBj2CdogkmeF6W5aOhy5.jpg">
 <img alt="3 stacked books" src="https://t3.ftcdn.net/jpg/00/53/73/42/360_F_53734293_rs3bkrl9n1EJZBj2CdogkmeF6W5aOhy5.jpg" width="300" >
</picture>

### About BookBlend
Hi, I am Bianca Jhonson. This is my ITIS 6177 final project. I needed to use Azure's AI Language, the "Sentiment Analysis". So I decided I will create a book review application with swagger ui documentation to explain the endpoints needed/used for my application.

Use `npm install` to install all dependancy files that are needed for the application.

To see **full interactive documentation** please <a href="http://161.35.48.83:3001/docs/">click here</a>

<details>
<summary>/analyze-sentiment</summary>

This endpoint will analyze sentiment and print the result. The way this is analyzed is using Azure's AI Sentiment Analysis API

</details>


<details>
<summary>/new-review</summary>

POST request:
This displays the review and will show the sentiment analysis result

</details>


<details>
<summary>/reviews/:id</summary>

DELETE request:
This deletes a specific book review by review ID

</details>


<details>
<summary>/reviews</summary>

DELETE request:
This endpoint redirects to delete all reviews

</details>


<details>
<summary>/reviews/:id</summary>

PATCH request:
Leads to update a review by the review ID

</details>


<details>
<summary>/reviews</summary>

GET request:
List of all the reviews added by user or already in database

</details>
