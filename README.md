# Project Manager Application

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Environment Variables](#environment-variables)
5. [Running the Project](#running-the-project)
6. [Contributing](#contributing)
7. [License](#license)

## Introduction

The Project Manager Application is a full-stack web application built using the MERN (MongoDB, Express, React, Node.js) stack. It enables users to efficiently manage their projects by allowing them to create, edit, and delete projects, tasks, comments, and attachments. The application also features user authentication, email verification, and password reset functionality.

## Features

- **User Authentication**: Register, login, and logout functionality with secure password management.
- **Profile Management**: Update profile details including name, email, and password.
- **Project Management**: Create, update, view, and delete projects.
- **Task Management**: Add, edit, mark as complete, and delete tasks within a project.
- **Commenting System**: Add, view, and delete comments on projects.
- **File Attachments**: Upload and delete attachments associated with projects.
- **Email Verification**: Verify user email addresses during registration.
- **Password Reset**: Reset forgotten passwords via email link.

## Technologies Used

### Frontend:
- **React.js**: JavaScript library for building user interfaces.
- **React Router**: For navigation within the app.
- **Bootstrap**: For responsive and modern UI components.
- **Axios**: For making HTTP requests to the backend API.

### Backend:
- **Node.js**: JavaScript runtime for building the backend.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing user, project, task, comment, and attachment data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JWT (JSON Web Tokens)**: For secure authentication.
- **Multer**: Middleware for handling file uploads.
- **AWS S3**: For storing file attachments.
- **Nodemailer**: For sending emails (used in password reset and email verification).
- **Dotenv**: For managing environment variables.

### Dev Tools:
- **Nodemon**: For automatically restarting the server during development.
- **ESLint**: For identifying and reporting on patterns found in ECMAScript/JavaScript code.
