## Work in progress e-learning website.
Built with NextJS and NodeJS. A simple website for teachers, not intended for practical use but rather created as a personal project to experiment.
The design is entirely made by me.

## Features
 - User accounts
 - Tasks with file upload
 - Questions & Answers

## Not yet implemented
 - Account creation
 - Questions & Answers
 - The UI for teachers. (creation of tasks and replies to questions)

## Screenshots
![Screenshot](https://raw.githubusercontent.com/Alex23582/eLearning/main/screenshots/1.PNG)
![Screenshot](https://raw.githubusercontent.com/Alex23582/eLearning/main/screenshots/2.PNG)
![Screenshot](https://raw.githubusercontent.com/Alex23582/eLearning/main/screenshots/3.PNG)
![Screenshot](https://raw.githubusercontent.com/Alex23582/eLearning/main/screenshots/4.PNG)
![Screenshot](https://raw.githubusercontent.com/Alex23582/eLearning/main/screenshots/5.PNG)

## How to run
If you want to run it. Download the repo and start the frontent with `npm run dev` in the client directory and `node main` in the server directory.
You have to create an account manually. Open the `server/db.sql` with an sqlite3 browser and create a user account.
The password is stored as a salted sha2 hash in this format: `sha2(plaintext_password + salt) = sql_password_row`.
Example: `salt="123"`. `actual password="123"`. password inside the database is `"96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6ca0a1e" = sha2("123123")`.
To create courses, and to create tasks just insert a row inside the corresponding table.
