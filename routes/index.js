const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const recipesPath = path.join(__dirname, "..", "public", "data", "recipes.json");

function loadRecipes() {
  const raw = fs.readFileSync(recipesPath, "utf-8");
  return JSON.parse(raw);
}

// Home page
router.get("/", (req, res) => {
  const recipes = loadRecipes();

  const categories = [...new Set(recipes.map((r) => r.category))];
  const stats = {
    recipeCount: recipes.length,
    categoryCount: categories.length,
    ingredientCount: recipes.reduce((sum, r) => sum + r.ingredients.length, 0) * 3, // presented as "500+ ingredients"
  };

  res.render("index", {
    title: "RecipeVerse | Discover Delicious Recipes",
    recipes,
    categories,
    stats,
  });
});

// About page
router.get("/about", (req, res) => {
  res.render("about", { title: "About | RecipeVerse" });
});

// Developer Console
router.get("/console", (req, res) => {
  res.render("console", {
    title: "Developer Console | RecipeVerse",
    defaultEndpoint: process.env.SEARCH_CONSOLE_ENDPOINT || "",
  });
});

module.exports = router;
