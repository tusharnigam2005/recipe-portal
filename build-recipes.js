// One-off generator script used to build public/data/recipes.json
// Run with: node build-recipes.js
const fs = require("fs");
const path = require("path");

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const raw = [
  {
    title: "Butter Chicken",
    category: "Indian",
    country: "India",
    difficulty: "Medium",
    cookTime: "45 mins",
    rating: 4.8,
    description: "Tender chicken simmered in a velvety tomato-butter gravy, finished with cream and warm garam masala.",
    ingredients: [
      "500g boneless chicken thighs, cubed",
      "1 cup plain yogurt",
      "2 tbsp ginger-garlic paste",
      "2 tsp garam masala",
      "1 tsp Kashmiri red chili powder",
      "3 tbsp butter",
      "1 large onion, finely chopped",
      "400g tomato puree",
      "1/2 cup heavy cream",
      "1 tsp kasuri methi (dried fenugreek leaves)",
      "Salt to taste"
    ],
    instructions: [
      "Marinate the chicken in yogurt, ginger-garlic paste, garam masala and chili powder for at least 1 hour.",
      "Grill or pan-sear the marinated chicken until lightly charred, then set aside.",
      "Melt butter in a pan and saute the onion until golden.",
      "Add tomato puree and cook until the oil separates from the masala.",
      "Stir in the seared chicken and simmer for 10 minutes.",
      "Finish with cream and kasuri methi, then simmer for 5 more minutes before serving."
    ],
    nutrition: { calories: 420, protein: 32, fat: 26, carbs: 12 },
    tags: ["chicken", "curry", "dinner", "spicy"]
  },
  {
    title: "Chicken Biryani",
    category: "Indian",
    country: "India",
    difficulty: "Hard",
    cookTime: "1 hr 30 mins",
    rating: 4.9,
    description: "Fragrant basmati rice layered with spiced chicken and saffron, slow-cooked to smoky perfection.",
    ingredients: [
      "2 cups basmati rice, soaked 30 mins",
      "600g chicken, bone-in pieces",
      "2 onions, thinly sliced and fried crisp",
      "1 cup yogurt",
      "2 tbsp biryani masala",
      "A pinch of saffron soaked in warm milk",
      "4 tbsp ghee",
      "Whole spices: bay leaf, cinnamon, cloves, cardamom",
      "Fresh mint and coriander leaves",
      "Salt to taste"
    ],
    instructions: [
      "Marinate chicken with yogurt, biryani masala and half the fried onions for 1 hour.",
      "Par-boil the soaked rice with whole spices until 70% cooked, then drain.",
      "Cook the marinated chicken in a heavy pot until nearly done.",
      "Layer the par-boiled rice over the chicken, top with saffron milk, remaining fried onions, mint and coriander.",
      "Cover with a tight lid and cook on low heat (dum) for 25-30 minutes.",
      "Gently fluff and serve hot with raita."
    ],
    nutrition: { calories: 520, protein: 30, fat: 20, carbs: 55 },
    tags: ["chicken", "rice", "dinner", "festive"]
  },
  {
    title: "Paneer Butter Masala",
    category: "Indian",
    country: "India",
    difficulty: "Easy",
    cookTime: "35 mins",
    rating: 4.6,
    description: "Soft paneer cubes in a rich, mildly sweet tomato-cashew gravy - a north Indian classic.",
    ingredients: [
      "250g paneer, cubed",
      "3 tomatoes, pureed",
      "10 cashews, soaked",
      "1 tbsp ginger-garlic paste",
      "2 tbsp butter",
      "1 tsp red chili powder",
      "1/2 tsp garam masala",
      "2 tbsp fresh cream",
      "Salt and sugar to taste"
    ],
    instructions: [
      "Blend soaked cashews with tomato puree until smooth.",
      "Heat butter and saute ginger-garlic paste until fragrant.",
      "Add the tomato-cashew puree and cook until thick.",
      "Season with chili powder, garam masala, salt and a pinch of sugar.",
      "Add paneer cubes and simmer for 5 minutes.",
      "Finish with cream and serve with naan or rice."
    ],
    nutrition: { calories: 380, protein: 16, fat: 27, carbs: 18 },
    tags: ["paneer", "vegetarian", "curry", "dinner"]
  },
  {
    title: "Palak Paneer",
    category: "Indian",
    country: "India",
    difficulty: "Medium",
    cookTime: "40 mins",
    rating: 4.5,
    description: "Silky pureed spinach simmered with aromatic spices and soft paneer cubes.",
    ingredients: [
      "500g spinach leaves, blanched",
      "200g paneer, cubed",
      "1 onion, chopped",
      "2 tomatoes, chopped",
      "1 tbsp ginger-garlic paste",
      "1 tsp cumin seeds",
      "2 tbsp cream",
      "Salt and spices to taste"
    ],
    instructions: [
      "Blend the blanched spinach into a smooth puree.",
      "Saute cumin seeds, onion and ginger-garlic paste until golden.",
      "Add tomatoes and cook until soft, then add the spinach puree.",
      "Simmer for 10 minutes, season with salt and spices.",
      "Add paneer cubes and cream, simmer for 5 more minutes.",
      "Serve hot with roti or steamed rice."
    ],
    nutrition: { calories: 310, protein: 15, fat: 20, carbs: 14 },
    tags: ["paneer", "vegetarian", "healthy", "curry"]
  },
  {
    title: "Masala Dosa",
    category: "Indian",
    country: "India",
    difficulty: "Medium",
    cookTime: "50 mins (plus fermentation)",
    rating: 4.7,
    description: "Crisp fermented rice-lentil crepe folded over a spiced potato filling, served with chutney and sambar.",
    ingredients: [
      "2 cups dosa batter (fermented rice and urad dal)",
      "3 potatoes, boiled and mashed",
      "1 onion, sliced",
      "1 tsp mustard seeds",
      "A few curry leaves",
      "1/2 tsp turmeric",
      "Oil as needed",
      "Salt to taste"
    ],
    instructions: [
      "Temper mustard seeds and curry leaves in oil, then saute onions until translucent.",
      "Add turmeric and mashed potatoes, mix well to make the filling.",
      "Heat a griddle and spread a ladle of dosa batter into a thin circle.",
      "Drizzle oil around the edges and cook until golden and crisp.",
      "Place the potato filling in the center and fold the dosa.",
      "Serve hot with coconut chutney and sambar."
    ],
    nutrition: { calories: 300, protein: 7, fat: 9, carbs: 48 },
    tags: ["breakfast", "vegetarian", "south-indian", "crispy"]
  },
  {
    title: "Idli Sambar",
    category: "Indian",
    country: "India",
    difficulty: "Easy",
    cookTime: "30 mins (plus fermentation)",
    rating: 4.4,
    description: "Steamed rice cakes served with a tangy, vegetable-packed lentil sambar.",
    ingredients: [
      "2 cups idli batter",
      "1 cup toor dal, cooked",
      "Mixed vegetables (carrot, drumstick, pumpkin)",
      "2 tbsp sambar powder",
      "Tamarind pulp",
      "Mustard seeds and curry leaves for tempering",
      "Salt to taste"
    ],
    instructions: [
      "Grease idli molds and pour in the batter, then steam for 10-12 minutes.",
      "Cook mixed vegetables with tamarind pulp and sambar powder in the dal.",
      "Simmer until the vegetables are tender and the sambar thickens slightly.",
      "Temper mustard seeds and curry leaves in oil and pour over the sambar.",
      "Serve the steamed idlis hot alongside the sambar."
    ],
    nutrition: { calories: 240, protein: 10, fat: 4, carbs: 42 },
    tags: ["breakfast", "vegetarian", "south-indian", "healthy"]
  },
  {
    title: "Chicken Momos",
    category: "Fast Food",
    country: "Nepal",
    difficulty: "Medium",
    cookTime: "1 hr",
    rating: 4.6,
    description: "Juicy steamed dumplings filled with spiced minced chicken, served with a fiery red chutney.",
    ingredients: [
      "2 cups all-purpose flour",
      "300g minced chicken",
      "1 onion, finely chopped",
      "1 tbsp ginger-garlic paste",
      "1 tbsp soy sauce",
      "Salt and pepper to taste",
      "Water as needed"
    ],
    instructions: [
      "Knead flour with water into a smooth, firm dough and rest for 20 minutes.",
      "Mix minced chicken with onion, ginger-garlic paste, soy sauce, salt and pepper.",
      "Roll the dough into thin small circles.",
      "Place filling in the center and pleat the edges to seal each momo.",
      "Steam the momos for 12-15 minutes until translucent.",
      "Serve hot with spicy tomato chutney."
    ],
    nutrition: { calories: 260, protein: 18, fat: 6, carbs: 32 },
    tags: ["chicken", "steamed", "snack", "street-food"]
  },
  {
    title: "Classic Cheeseburger",
    category: "Fast Food",
    country: "USA",
    difficulty: "Easy",
    cookTime: "25 mins",
    rating: 4.7,
    description: "A juicy beef patty stacked with melted cheddar, crisp lettuce and tangy pickles in a toasted bun.",
    ingredients: [
      "2 beef patties",
      "2 slices cheddar cheese",
      "2 burger buns",
      "Lettuce leaves",
      "Tomato slices",
      "Pickles",
      "Ketchup and mustard",
      "Salt and pepper"
    ],
    instructions: [
      "Season the beef patties generously with salt and pepper.",
      "Sear the patties on a hot griddle for 3-4 minutes per side.",
      "Add a cheese slice on top during the last minute to melt.",
      "Toast the burger buns lightly on the griddle.",
      "Assemble with lettuce, tomato, pickles, patty and sauces.",
      "Serve immediately with fries."
    ],
    nutrition: { calories: 560, protein: 28, fat: 32, carbs: 38 },
    tags: ["beef", "burger", "fast-food", "dinner"]
  },
  {
    title: "Crispy Beef Tacos",
    category: "Mexican",
    country: "Mexico",
    difficulty: "Easy",
    cookTime: "30 mins",
    rating: 4.6,
    description: "Crunchy taco shells packed with seasoned beef, fresh salsa and melted cheese.",
    ingredients: [
      "400g ground beef",
      "8 taco shells",
      "1 packet taco seasoning",
      "1 cup shredded lettuce",
      "1/2 cup diced tomatoes",
      "1/2 cup shredded cheddar",
      "Sour cream to serve"
    ],
    instructions: [
      "Brown the ground beef in a skillet, breaking it into crumbles.",
      "Stir in taco seasoning and a splash of water, simmer for 5 minutes.",
      "Warm the taco shells in the oven until crisp.",
      "Fill each shell with beef, lettuce, tomatoes and cheese.",
      "Top with a dollop of sour cream and serve immediately."
    ],
    nutrition: { calories: 410, protein: 24, fat: 22, carbs: 28 },
    tags: ["beef", "mexican", "dinner", "spicy"]
  },
  {
    title: "Chicken Quesadilla",
    category: "Mexican",
    country: "Mexico",
    difficulty: "Easy",
    cookTime: "20 mins",
    rating: 4.4,
    description: "Toasted tortillas oozing with melted cheese and smoky shredded chicken.",
    ingredients: [
      "2 large flour tortillas",
      "1 cup shredded cooked chicken",
      "1 cup shredded Monterey Jack cheese",
      "1/2 bell pepper, sliced",
      "1 tsp smoked paprika",
      "Butter for the pan"
    ],
    instructions: [
      "Toss the shredded chicken with smoked paprika.",
      "Layer cheese, chicken and bell pepper over half of each tortilla, then fold.",
      "Butter a pan and cook the quesadilla until golden and crisp on both sides.",
      "Cut into wedges and serve with salsa and guacamole."
    ],
    nutrition: { calories: 430, protein: 26, fat: 24, carbs: 30 },
    tags: ["chicken", "mexican", "quick", "snack"]
  },
  {
    title: "Margherita Pizza",
    category: "Italian",
    country: "Italy",
    difficulty: "Medium",
    cookTime: "40 mins",
    rating: 4.8,
    description: "A classic Neapolitan pizza with fresh mozzarella, basil and San Marzano tomato sauce.",
    ingredients: [
      "1 pizza dough ball",
      "1/2 cup San Marzano tomato sauce",
      "125g fresh mozzarella, torn",
      "Fresh basil leaves",
      "2 tbsp olive oil",
      "Salt to taste"
    ],
    instructions: [
      "Preheat the oven with a pizza stone to its highest setting.",
      "Stretch the dough into a thin round base.",
      "Spread tomato sauce evenly, leaving a border for the crust.",
      "Scatter torn mozzarella over the sauce.",
      "Bake for 8-10 minutes until the crust is charred and blistered.",
      "Top with fresh basil and a drizzle of olive oil before serving."
    ],
    nutrition: { calories: 300, protein: 13, fat: 12, carbs: 36 },
    tags: ["vegetarian", "pizza", "italian", "dinner"]
  },
  {
    title: "Lasagna al Forno",
    category: "Italian",
    country: "Italy",
    difficulty: "Hard",
    cookTime: "1 hr 30 mins",
    rating: 4.7,
    description: "Layers of pasta, rich meat ragu and creamy bechamel baked until golden and bubbling.",
    ingredients: [
      "12 lasagna sheets",
      "500g ground beef",
      "1 onion, diced",
      "2 cups tomato passata",
      "3 cups bechamel sauce",
      "1 cup grated parmesan",
      "2 tbsp olive oil",
      "Salt, pepper and Italian herbs"
    ],
    instructions: [
      "Brown the ground beef with onion in olive oil, then stir in passata and herbs; simmer 30 minutes to make the ragu.",
      "Cook the lasagna sheets according to package directions.",
      "Layer sheets, ragu and bechamel in a baking dish, repeating until ingredients are used.",
      "Top with parmesan and bake at 190C for 30 minutes until golden.",
      "Rest for 10 minutes before slicing and serving."
    ],
    nutrition: { calories: 540, protein: 30, fat: 28, carbs: 42 },
    tags: ["beef", "italian", "baked", "dinner"]
  },
  {
    title: "Pasta Alfredo",
    category: "Italian",
    country: "Italy",
    difficulty: "Easy",
    cookTime: "25 mins",
    rating: 4.5,
    description: "Silky fettuccine tossed in a rich butter, cream and parmesan sauce.",
    ingredients: [
      "300g fettuccine pasta",
      "3 tbsp butter",
      "1 cup heavy cream",
      "1 cup grated parmesan",
      "2 garlic cloves, minced",
      "Salt and black pepper to taste"
    ],
    instructions: [
      "Cook the fettuccine in salted boiling water until al dente, then drain, reserving some pasta water.",
      "Melt butter and saute garlic until fragrant.",
      "Pour in the cream and simmer gently for 3-4 minutes.",
      "Stir in parmesan until the sauce is smooth, loosening with pasta water if needed.",
      "Toss the pasta through the sauce and season with black pepper before serving."
    ],
    nutrition: { calories: 620, protein: 18, fat: 36, carbs: 54 },
    tags: ["vegetarian", "pasta", "italian", "creamy"]
  },
  {
    title: "Caprese Salad",
    category: "Italian",
    country: "Italy",
    difficulty: "Easy",
    cookTime: "10 mins",
    rating: 4.3,
    description: "A refreshing plate of ripe tomatoes, fresh mozzarella and basil drizzled with balsamic glaze.",
    ingredients: [
      "3 ripe tomatoes, sliced",
      "200g fresh mozzarella, sliced",
      "Fresh basil leaves",
      "2 tbsp extra virgin olive oil",
      "1 tbsp balsamic glaze",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Arrange alternating slices of tomato and mozzarella on a platter.",
      "Tuck basil leaves between the slices.",
      "Drizzle with olive oil and balsamic glaze.",
      "Season with salt and freshly cracked pepper before serving."
    ],
    nutrition: { calories: 220, protein: 12, fat: 16, carbs: 8 },
    tags: ["vegetarian", "salad", "italian", "healthy"]
  },
  {
    title: "Chocolate Fudge Cake",
    category: "Desserts",
    country: "International",
    difficulty: "Medium",
    cookTime: "1 hr",
    rating: 4.9,
    description: "A deeply rich, moist chocolate cake layered with silky fudge frosting.",
    ingredients: [
      "2 cups all-purpose flour",
      "2 cups sugar",
      "3/4 cup cocoa powder",
      "2 eggs",
      "1 cup buttermilk",
      "1/2 cup vegetable oil",
      "1 tsp baking soda",
      "1 cup hot coffee",
      "2 cups chocolate fudge frosting"
    ],
    instructions: [
      "Preheat the oven to 175C and grease two cake pans.",
      "Whisk together flour, sugar, cocoa and baking soda.",
      "Add eggs, buttermilk and oil, then mix until smooth.",
      "Stir in hot coffee until the batter is thin and glossy.",
      "Divide between the pans and bake for 30-35 minutes.",
      "Cool completely, then layer and frost with chocolate fudge frosting."
    ],
    nutrition: { calories: 480, protein: 6, fat: 20, carbs: 68 },
    tags: ["dessert", "chocolate", "baking", "sweet"]
  },
  {
    title: "Fudgy Brownies",
    category: "Desserts",
    country: "USA",
    difficulty: "Easy",
    cookTime: "40 mins",
    rating: 4.8,
    description: "Dense, chewy brownies with a crackly top and deep chocolate flavor.",
    ingredients: [
      "200g dark chocolate, melted",
      "1 cup butter, melted",
      "1.5 cups sugar",
      "3 eggs",
      "1 cup all-purpose flour",
      "1/2 cup cocoa powder",
      "1 tsp vanilla extract"
    ],
    instructions: [
      "Preheat the oven to 180C and line a baking pan with parchment.",
      "Whisk melted chocolate, butter and sugar together until glossy.",
      "Beat in the eggs one at a time, then stir in vanilla.",
      "Fold in flour and cocoa powder until just combined.",
      "Pour into the pan and bake for 25-30 minutes until the top is set.",
      "Cool completely before slicing into squares."
    ],
    nutrition: { calories: 350, protein: 4, fat: 18, carbs: 44 },
    tags: ["dessert", "chocolate", "baking", "sweet"]
  },
  {
    title: "Classic Pancakes",
    category: "Desserts",
    country: "USA",
    difficulty: "Easy",
    cookTime: "20 mins",
    rating: 4.5,
    description: "Fluffy buttermilk pancakes stacked high and drizzled with maple syrup.",
    ingredients: [
      "1.5 cups all-purpose flour",
      "1 tbsp sugar",
      "1 tbsp baking powder",
      "1.25 cups buttermilk",
      "1 egg",
      "2 tbsp melted butter",
      "Maple syrup to serve"
    ],
    instructions: [
      "Whisk together flour, sugar and baking powder in a bowl.",
      "In another bowl, whisk buttermilk, egg and melted butter.",
      "Combine the wet and dry ingredients until just mixed, a few lumps are fine.",
      "Pour small circles of batter onto a hot greased griddle.",
      "Flip once bubbles form on the surface and cook until golden.",
      "Stack and serve warm with maple syrup and butter."
    ],
    nutrition: { calories: 320, protein: 8, fat: 10, carbs: 50 },
    tags: ["breakfast", "sweet", "vegetarian", "quick"]
  },
  {
    title: "Vegan Buddha Bowl",
    category: "Vegan",
    country: "International",
    difficulty: "Easy",
    cookTime: "30 mins",
    rating: 4.6,
    description: "A colorful, nourishing bowl of roasted vegetables, quinoa and creamy tahini dressing.",
    ingredients: [
      "1 cup cooked quinoa",
      "1 cup roasted sweet potato",
      "1 cup roasted chickpeas",
      "1 cup shredded purple cabbage",
      "1 avocado, sliced",
      "2 tbsp tahini",
      "1 tbsp lemon juice",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Toss sweet potato and chickpeas with oil and spices, then roast at 200C for 20 minutes.",
      "Whisk tahini with lemon juice and a splash of water to make the dressing.",
      "Arrange quinoa, roasted vegetables, cabbage and avocado in a bowl.",
      "Drizzle generously with tahini dressing before serving."
    ],
    nutrition: { calories: 420, protein: 14, fat: 18, carbs: 52 },
    tags: ["vegan", "healthy", "bowl", "lunch"]
  },
  {
    title: "Vegan Lentil Curry",
    category: "Vegan",
    country: "India",
    difficulty: "Easy",
    cookTime: "35 mins",
    rating: 4.5,
    description: "A comforting, protein-rich lentil curry simmered with tomatoes and warming spices.",
    ingredients: [
      "1 cup red lentils, rinsed",
      "1 onion, chopped",
      "2 tomatoes, chopped",
      "1 tbsp ginger-garlic paste",
      "1 tsp turmeric",
      "1 tsp cumin seeds",
      "1 cup coconut milk",
      "Fresh coriander to garnish"
    ],
    instructions: [
      "Saute cumin seeds and onion until golden.",
      "Add ginger-garlic paste and tomatoes, cook until soft.",
      "Stir in turmeric and lentils, then add 3 cups of water.",
      "Simmer for 20 minutes until the lentils are soft and creamy.",
      "Stir in coconut milk and simmer for 5 more minutes.",
      "Garnish with coriander and serve with rice."
    ],
    nutrition: { calories: 340, protein: 16, fat: 12, carbs: 44 },
    tags: ["vegan", "healthy", "curry", "dinner"]
  },
  {
    title: "Grilled Chicken Caesar Salad",
    category: "Healthy",
    country: "USA",
    difficulty: "Easy",
    cookTime: "25 mins",
    rating: 4.4,
    description: "Crisp romaine tossed in a light Caesar dressing, topped with juicy grilled chicken and croutons.",
    ingredients: [
      "2 chicken breasts",
      "1 head romaine lettuce, chopped",
      "1/2 cup parmesan shavings",
      "1 cup croutons",
      "1/3 cup Caesar dressing",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Season chicken breasts with salt and pepper, then grill until cooked through.",
      "Let the chicken rest for 5 minutes, then slice.",
      "Toss the romaine lettuce with Caesar dressing.",
      "Top with sliced chicken, croutons and parmesan shavings.",
      "Serve immediately while the chicken is warm."
    ],
    nutrition: { calories: 360, protein: 34, fat: 18, carbs: 14 },
    tags: ["chicken", "salad", "healthy", "lunch"]
  },
  {
    title: "Quinoa Power Bowl",
    category: "Healthy",
    country: "International",
    difficulty: "Easy",
    cookTime: "25 mins",
    rating: 4.5,
    description: "A protein-packed bowl of quinoa, grilled vegetables and a zesty lemon vinaigrette.",
    ingredients: [
      "1 cup quinoa, cooked",
      "1 zucchini, grilled and sliced",
      "1 cup cherry tomatoes, halved",
      "1/2 cup crumbled feta",
      "2 tbsp olive oil",
      "1 tbsp lemon juice",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Whisk olive oil and lemon juice together with a pinch of salt for the dressing.",
      "Combine cooked quinoa, grilled zucchini and cherry tomatoes in a bowl.",
      "Toss with the lemon dressing.",
      "Top with crumbled feta and a crack of black pepper before serving."
    ],
    nutrition: { calories: 380, protein: 13, fat: 16, carbs: 46 },
    tags: ["vegetarian", "healthy", "bowl", "lunch"]
  },
  {
    title: "Baked Salmon with Vegetables",
    category: "Healthy",
    country: "International",
    difficulty: "Easy",
    cookTime: "30 mins",
    rating: 4.7,
    description: "Flaky oven-baked salmon fillets with roasted seasonal vegetables and lemon.",
    ingredients: [
      "2 salmon fillets",
      "1 cup broccoli florets",
      "1 cup baby carrots",
      "2 tbsp olive oil",
      "1 lemon, sliced",
      "Salt, pepper and herbs to taste"
    ],
    instructions: [
      "Preheat the oven to 200C.",
      "Arrange salmon and vegetables on a baking tray, drizzle with olive oil.",
      "Season with salt, pepper and herbs, then top with lemon slices.",
      "Bake for 15-18 minutes until the salmon flakes easily.",
      "Serve immediately with the roasted vegetables."
    ],
    nutrition: { calories: 410, protein: 36, fat: 22, carbs: 14 },
    tags: ["seafood", "healthy", "dinner", "gluten-free"]
  },
  {
    title: "Classic Spring Rolls",
    category: "Chinese",
    country: "China",
    difficulty: "Medium",
    cookTime: "45 mins",
    rating: 4.4,
    description: "Crispy golden rolls packed with stir-fried vegetables and glass noodles.",
    ingredients: [
      "12 spring roll wrappers",
      "2 cups shredded cabbage",
      "1 carrot, julienned",
      "1/2 cup glass noodles, soaked",
      "2 tbsp soy sauce",
      "1 tsp sesame oil",
      "Oil for frying"
    ],
    instructions: [
      "Stir-fry cabbage and carrot with soy sauce and sesame oil until just tender.",
      "Mix in the soaked glass noodles and let the filling cool.",
      "Place filling on each wrapper and roll tightly, sealing the edges with water.",
      "Deep fry the rolls until golden and crisp.",
      "Drain on paper towels and serve with sweet chili sauce."
    ],
    nutrition: { calories: 280, protein: 6, fat: 14, carbs: 32 },
    tags: ["vegetarian", "chinese", "snack", "crispy"]
  },
  {
    title: "Chicken Chow Mein",
    category: "Chinese",
    country: "China",
    difficulty: "Easy",
    cookTime: "30 mins",
    rating: 4.5,
    description: "Stir-fried noodles tossed with tender chicken and crisp vegetables in a savory sauce.",
    ingredients: [
      "250g noodles, boiled",
      "200g chicken breast, sliced",
      "1 cup mixed bell peppers, sliced",
      "1 cup cabbage, shredded",
      "3 tbsp soy sauce",
      "1 tbsp oyster sauce",
      "2 tbsp oil",
      "2 garlic cloves, minced"
    ],
    instructions: [
      "Stir-fry chicken in hot oil until cooked through, then set aside.",
      "Saute garlic, bell peppers and cabbage in the same pan until crisp-tender.",
      "Return the chicken to the pan and add the boiled noodles.",
      "Pour in soy sauce and oyster sauce, tossing everything together.",
      "Stir-fry for 2-3 minutes until well combined and serve hot."
    ],
    nutrition: { calories: 450, protein: 26, fat: 14, carbs: 54 },
    tags: ["chicken", "chinese", "noodles", "dinner"]
  },
  {
    title: "Veg Fried Rice",
    category: "Chinese",
    country: "China",
    difficulty: "Easy",
    cookTime: "25 mins",
    rating: 4.3,
    description: "Wok-tossed rice with crunchy vegetables and a hint of smoky soy sauce.",
    ingredients: [
      "2 cups cooked rice, chilled",
      "1/2 cup carrots, diced",
      "1/2 cup peas",
      "1/2 cup spring onions, chopped",
      "2 tbsp soy sauce",
      "1 tbsp sesame oil",
      "2 tbsp oil"
    ],
    instructions: [
      "Heat oil in a wok and stir-fry carrots and peas until just tender.",
      "Add the chilled rice, breaking up any clumps.",
      "Drizzle in soy sauce and sesame oil, tossing everything on high heat.",
      "Stir in spring onions and cook for 1-2 more minutes.",
      "Serve hot as a side or light main."
    ],
    nutrition: { calories: 320, protein: 7, fat: 10, carbs: 50 },
    tags: ["vegetarian", "chinese", "rice", "quick"]
  },
  {
    title: "Classic Ramen",
    category: "Chinese",
    country: "Japan",
    difficulty: "Hard",
    cookTime: "2 hrs",
    rating: 4.8,
    description: "A deeply savory pork broth ramen topped with soft-boiled egg, chashu and scallions.",
    ingredients: [
      "4 cups pork or chicken bone broth",
      "2 tbsp miso paste",
      "2 servings ramen noodles",
      "2 soft-boiled eggs, halved",
      "150g chashu pork, sliced",
      "2 spring onions, sliced",
      "1 sheet nori, cut into strips"
    ],
    instructions: [
      "Simmer the broth with miso paste until fully dissolved and fragrant.",
      "Cook the ramen noodles according to package directions and drain.",
      "Divide noodles between bowls and ladle the hot broth over them.",
      "Top each bowl with chashu slices, a soft-boiled egg, scallions and nori.",
      "Serve immediately while piping hot."
    ],
    nutrition: { calories: 520, protein: 28, fat: 22, carbs: 50 },
    tags: ["pork", "noodles", "japanese", "comfort-food"]
  },
  {
    title: "Classic Sushi Rolls",
    category: "Chinese",
    country: "Japan",
    difficulty: "Hard",
    cookTime: "1 hr",
    rating: 4.7,
    description: "Hand-rolled sushi with seasoned rice, fresh fish and crisp vegetables wrapped in nori.",
    ingredients: [
      "2 cups sushi rice, cooked and seasoned",
      "4 nori sheets",
      "150g fresh salmon or tuna, sliced",
      "1 cucumber, julienned",
      "1 avocado, sliced",
      "Soy sauce and pickled ginger to serve"
    ],
    instructions: [
      "Lay a nori sheet on a bamboo mat and spread an even layer of sushi rice.",
      "Arrange fish, cucumber and avocado in a line across the rice.",
      "Roll tightly using the bamboo mat, sealing the edge with a little water.",
      "Slice into bite-sized pieces with a sharp, wet knife.",
      "Serve with soy sauce, wasabi and pickled ginger."
    ],
    nutrition: { calories: 380, protein: 18, fat: 12, carbs: 48 },
    tags: ["seafood", "japanese", "raw", "light"]
  },
  {
    title: "Tom Yum Soup",
    category: "Healthy",
    country: "Thailand",
    difficulty: "Medium",
    cookTime: "35 mins",
    rating: 4.6,
    description: "A hot and sour Thai soup bursting with lemongrass, chili and fresh shrimp.",
    ingredients: [
      "300g shrimp, peeled",
      "4 cups chicken or vegetable stock",
      "2 stalks lemongrass, bruised",
      "4 kaffir lime leaves",
      "3 tbsp fish sauce",
      "2 tbsp lime juice",
      "1 cup mushrooms, halved",
      "2-3 Thai chilies, crushed"
    ],
    instructions: [
      "Bring the stock to a boil with lemongrass and kaffir lime leaves.",
      "Add mushrooms and simmer for 5 minutes.",
      "Stir in fish sauce and crushed chilies.",
      "Add the shrimp and cook until just pink and opaque.",
      "Remove from heat and stir in lime juice before serving hot."
    ],
    nutrition: { calories: 180, protein: 22, fat: 4, carbs: 10 },
    tags: ["seafood", "thai", "soup", "spicy"]
  },
  {
    title: "Chana Masala",
    category: "Indian",
    country: "India",
    difficulty: "Easy",
    cookTime: "35 mins",
    rating: 4.5,
    description: "Hearty chickpeas simmered in a tangy, spiced onion-tomato masala.",
    ingredients: [
      "2 cups chickpeas, boiled",
      "1 onion, finely chopped",
      "2 tomatoes, pureed",
      "1 tbsp ginger-garlic paste",
      "2 tsp chana masala powder",
      "1/2 tsp turmeric",
      "2 tbsp oil",
      "Fresh coriander to garnish"
    ],
    instructions: [
      "Saute onions in oil until golden brown.",
      "Add ginger-garlic paste and cook until fragrant.",
      "Stir in tomato puree, turmeric and chana masala powder, cooking until thick.",
      "Add the boiled chickpeas and a splash of water, simmer for 15 minutes.",
      "Garnish with coriander and serve with rice or bhature."
    ],
    nutrition: { calories: 320, protein: 14, fat: 10, carbs: 44 },
    tags: ["vegan", "vegetarian", "curry", "dinner"]
  },
  {
    title: "Vegetable Hakka Noodles",
    category: "Chinese",
    country: "China",
    difficulty: "Easy",
    cookTime: "25 mins",
    rating: 4.3,
    description: "Wok-tossed noodles with crunchy julienned vegetables in a savory soy-garlic sauce.",
    ingredients: [
      "250g hakka noodles, boiled",
      "1 carrot, julienned",
      "1 cup cabbage, shredded",
      "1 bell pepper, julienned",
      "3 garlic cloves, minced",
      "2 tbsp soy sauce",
      "1 tsp vinegar",
      "2 tbsp oil"
    ],
    instructions: [
      "Heat oil in a hot wok and stir-fry garlic until fragrant.",
      "Add the julienned vegetables and stir-fry on high heat for 2-3 minutes.",
      "Toss in the boiled noodles, soy sauce and vinegar.",
      "Stir-fry everything together for another 2 minutes.",
      "Serve immediately while hot and glossy."
    ],
    nutrition: { calories: 340, protein: 8, fat: 10, carbs: 54 },
    tags: ["vegetarian", "chinese", "noodles", "quick"]
  }
];

const recipes = raw.map((r, i) => {
  const id = i + 1;
  const slug = slugify(r.title);
  return {
    id,
    title: r.title,
    slug,
    category: r.category,
    country: r.country,
    difficulty: r.difficulty,
    cookTime: r.cookTime,
    rating: r.rating,
    description: r.description,
    ingredients: r.ingredients,
    instructions: r.instructions,
    nutrition: r.nutrition,
    image: `https://picsum.photos/seed/${slug}/640/480`,
    tags: r.tags,
    chefTip: "For the best flavor, let the dish rest for a few minutes before serving so the spices settle."
  };
});

const outPath = path.join(__dirname, "public", "data", "recipes.json");
fs.writeFileSync(outPath, JSON.stringify(recipes, null, 2));
console.log(`Wrote ${recipes.length} recipes to ${outPath}`);
