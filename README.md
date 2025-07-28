Blog Web Application
A lightweight and stylish blog web application built with Node.js, Express.js, and EJS. This application provides a seamless experience for creating, reading, updating, and deleting blog posts. The design focuses on a clean, minimalist, and responsive layout, ensuring an excellent user experience on both desktop and mobile devices.

This project was developed as a practical exercise in building a full-stack application from scratch, handling server-side logic with Node/Express and dynamically rendering content with EJS.

Features
🏠 Home Page: Displays all created blog posts in a clean, reverse chronological list.

✍️ Create Posts: A dedicated /compose page with a simple form to write and submit new blog posts.

✏️ Edit Posts: Ability to select any existing post to edit its title and content.

🗑️ Delete Posts: Easily remove posts with a single click.

📱 Responsive Design: A mobile-first design that looks great on any screen size, built with modern CSS.

Tech Stack
Backend: Node.js, Express.js

Templating Engine: EJS (Embedded JavaScript)

Styling: CSS (with Flexbox/Grid for layout)

Dependencies: express, ejs, body-parser (or express.urlencoded)

Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
Make sure you have Node.js and npm installed on your system.

node -v
npm -v

Installation & Setup
Clone the repository:

git clone <your-repository-url>

Navigate to the project directory:

cd <project-folder-name>

Install NPM packages:

npm install

Run the application:

node app.js

You can also add a start script to your package.json for convenience:

"scripts": {
  "start": "node app.js"
}

And then run it with:

npm start

View the application in your browser at http://localhost:3000.

Project Structure
/
├── public/
│   └── css/
│       └── styles.css      # Main stylesheet
├── views/
│   ├── partials/           # EJS partials (header, footer)
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── home.ejs            # Main page to display all posts
│   └── compose.ejs         # Page for the new post form
│   └── edit.ejs            # Page for editing an existing post
├── app.js                  # Main server file (Express setup, routes)
├── package.json
└── README.md

Routes
The application uses the following routes to handle functionality:

GET /: Renders the home page and displays all posts.

GET /compose: Renders the page with the post creation form.

POST /compose: Handles the submission of a new post.

GET /posts/:id/edit: Renders the edit page for a specific post.

POST /posts/:id/edit: Handles the update submission for a specific post.

POST /posts/:id/delete: Handles the deletion of a specific post.
