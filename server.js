require("dotenv").config();

const express = require("express");
const path = require("path");

const indexRoutes = require("./routes/index");
const recipeRoutes = require("./routes/recipe");
const pushRoutes = require("./routes/push");

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parsing (JSON payloads from the Developer Console)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static assets (css, js, images, recipes.json)
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRoutes);
app.use("/recipe", recipeRoutes);
app.use("/push", pushRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Something went wrong on the server.");
});

app.listen(PORT, () => {
  console.log(`RecipeVerse is running at http://localhost:${PORT}`);
});
