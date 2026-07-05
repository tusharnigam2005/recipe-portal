const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const recipesPath = path.join(__dirname, "..", "public", "data", "recipes.json");

function loadRecipes() {
  const raw = fs.readFileSync(recipesPath, "utf-8");
  return JSON.parse(raw);
}

// Single recipe detail page
router.get("/:slug", (req, res) => {
  const recipes = loadRecipes();
  const recipe = recipes.find((r) => r.slug === req.params.slug);

  if (!recipe) {
    return res.status(404).render("404", { title: "Recipe Not Found" });
  }

  const related = recipes
    .filter((r) => r.category === recipe.category && r.id !== recipe.id)
    .slice(0, 4);

  res.render("recipe", {
    title: `${recipe.title} | RecipeVerse`,
    recipe,
    related,
  });
});

module.exports = router;
