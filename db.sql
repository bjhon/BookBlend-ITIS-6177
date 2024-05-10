CREATE DATABASE IF NOT EXISTS db;

USE db;

CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    review TEXT NOT NULL
);

INSERT INTO reviews (id, review) VALUES
(1, 'The book was great! I loved the main character.'),
(2, 'I found the characters in the book to be very engaging.'),
(3, 'The plot of the book was a bit predictable, but overall it was enjoyable.'),
(4, 'I didn''t like the writing style of the book; it felt too simplistic.');
