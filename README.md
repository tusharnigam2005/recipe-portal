# RecipeVerse

A recipe discovery client built with Node.js, Express and EJS. RecipeVerse stores 30
recipes as JSON and securely pushes them to an external Search Console API for
indexing — all outbound calls happen server-side, never from the browser.

## Stack

- Node.js + Express.js
- EJS templates
- Vanilla HTML5 / CSS3 / JavaScript
- JSON recipe storage (`public/data/recipes.json`)
- Axios for the outbound Search Console push

## Getting started

```bash
npm install
cp .env.example .env
npm start
```

The app runs at `http://localhost:3000` by default (configurable via `PORT` in `.env`).

## Project structure

```
recipe-portal/
├── public/
│   ├── css/style.css        # Design system + all page styles
│   ├── js/main.js           # Nav toggle, live search, category filter, toasts
│   ├── js/console.js        # Developer Console push logic (streams /push)
│   ├── images/
│   └── data/recipes.json    # 30 recipes
├── views/
│   ├── partials/            # head, navbar, footer
│   ├── index.ejs            # Homepage
│   ├── recipe.ejs           # Recipe detail page
│   ├── about.ejs            # About page
│   ├── console.ejs          # Developer Console
│   └── 404.ejs
├── routes/
│   ├── index.js             # Home, about, console pages
│   ├── recipe.js            # Recipe detail route
│   └── push.js              # POST /push — the Search Console integration
├── build-recipes.js         # One-off generator script that produced recipes.json
├── server.js
└── .env.example
```

## The Developer Console & `/push`

1. Open **Developer Console** in the nav.
2. Enter your **Search Console Endpoint** (a full URL) and **API Token**.
3. Click **Push All Recipes**.
4. The browser POSTs those two values to our own `/push` route — it never talks to
   your external API directly.
5. `routes/push.js` loads `recipes.json`, splits it into batches of 5, and calls your
   endpoint with Axios for each batch:
   - `Authorization: Bearer <API_TOKEN>`
   - A configurable request timeout (`PUSH_TIMEOUT_MS`, default 15s)
   - Structured error handling for timeouts, non-2xx responses, and network errors
6. Progress is streamed back to the browser as newline-delimited JSON events, so the
   progress bar and console log update batch-by-batch in real time. On completion you'll
   see a summary: recipes indexed, total, and time taken.

## Environment variables

See `.env.example`:

- `PORT` — server port (default `3000`)
- `SEARCH_CONSOLE_ENDPOINT` / `SEARCH_CONSOLE_API_TOKEN` — optional fallback values;
  the Developer Console form always takes priority
- `PUSH_TIMEOUT_MS` — timeout for each outbound batch request

## Deployed on Render
https://recipe-portal-bo3p.onrender.com
