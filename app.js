const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for blog posts
let posts = [
  {
    id: 1,
    title: "Welcome to My Blog",
    content:
      "This is my first blog post. Welcome to my personal blog where I share my thoughts and experiences.",
    author: "Blog Admin",
    date: new Date("2024-01-15"),
  },
  {
    id: 2,
    title: "Getting Started with Node.js",
    content:
      "Node.js is a powerful runtime for building server-side applications. In this post, I'll share some tips for beginners.",
    author: "Blog Admin",
    date: new Date("2024-01-20"),
  },
];

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Home route - will show all posts (once we create the template)
app.get("/", (req, res) => {
  res.render("index", { posts: posts });
});
// Add these routes after your existing routes

// Show edit form
app.get("/posts/:id/edit", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).send("Post not found");
  }
  res.render("edit", { post: post });
});

// Update post
app.put("/posts/:id", (req, res) => {
  const postIndex = posts.findIndex((p) => p.id === parseInt(req.params.id));
  if (postIndex === -1) {
    return res.status(404).send("Post not found");
  }

  posts[postIndex] = {
    ...posts[postIndex],
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: posts[postIndex].date, // Keep original date
  };

  res.redirect(`/posts/${req.params.id}`);
});

// Delete post
app.delete("/posts/:id", (req, res) => {
  posts = posts.filter((p) => p.id !== parseInt(req.params.id));
  res.redirect("/");
});

// Add these routes after your home route (app.get('/', ...))

// Show individual post
app.get("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).send("Post not found");
  }
  res.render("post", { post: post });
});

// Show create form
app.get("/create", (req, res) => {
  res.render("create");
});

// Create new post
app.post("/posts", (req, res) => {
  const newPost = {
    id: posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author || "Anonymous",
    date: new Date(),
  };
  posts.unshift(newPost); // Add to beginning of array
  res.redirect("/");
});
// Add this before app.listen()

// 404 Handler
app.use((req, res) => {
  res.status(404).render("error", {
    error: {
      status: 404,
      message: "Page not found",
    },
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render("error", {
    error: {
      status: err.status || 500,
      message: err.message || "Something went wrong!",
    },
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
