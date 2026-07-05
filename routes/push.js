const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const router = express.Router();

const recipesPath = path.join(__dirname, "..", "public", "data", "recipes.json");
const BATCH_SIZE = 5;
const TIMEOUT_MS = Number(process.env.PUSH_TIMEOUT_MS) || 15000;

function loadRecipes() {
  const raw = fs.readFileSync(recipesPath, "utf-8");
  return JSON.parse(raw);
}

function chunk(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * POST /push
 *
 * The frontend NEVER talks to the external Search Console API directly.
 * It sends the endpoint + token here, and this route does the actual
 * outbound call server-side, using axios, a request timeout, and batched
 * progress reporting streamed back to the browser as newline-delimited JSON.
 *
 * Expected body: { endpoint: string, apiToken: string }
 */
router.post("/", async (req, res) => {
  const endpoint = (req.body.endpoint || process.env.SEARCH_CONSOLE_ENDPOINT || "").trim();
  const apiToken = (req.body.apiToken || process.env.SEARCH_CONSOLE_API_TOKEN || "").trim();

  if (!endpoint) {
    return res.status(400).json({ ok: false, message: "Search Console Endpoint is required." });
  }
  if (!apiToken) {
    return res.status(400).json({ ok: false, message: "API Token is required." });
  }

  let endpointUrl;
  try {
    endpointUrl = new URL(endpoint);
  } catch (err) {
    return res.status(400).json({ ok: false, message: "The Search Console Endpoint is not a valid URL." });
  }

  let recipes;
  try {
    recipes = loadRecipes();
  } catch (err) {
    return res.status(500).json({ ok: false, message: "Could not read recipes.json on the server." });
  }

  const batches = chunk(recipes, BATCH_SIZE);
  const total = recipes.length;
  const startedAt = Date.now();

  // Stream newline-delimited JSON progress events back to the browser.
  res.writeHead(200, {
    "Content-Type": "application/x-ndjson; charset=utf-8",
    "Cache-Control": "no-cache",
    "Transfer-Encoding": "chunked",
  });

  const sendEvent = (event) => {
    res.write(JSON.stringify(event) + "\n");
  };

  sendEvent({ type: "start", total, batches: batches.length, endpoint: endpointUrl.hostname });

  let indexed = 0;

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    try {
      // eslint-disable-next-line no-await-in-loop
      await axios.post(
        endpointUrl.toString(),
        {
          source: "RecipeVerse",
          batch: i + 1,
          totalBatches: batches.length,
          recipes: batch,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiToken}`,
          },
          timeout: TIMEOUT_MS,
        }
      );

      indexed += batch.length;

      sendEvent({
        type: "progress",
        batch: i + 1,
        totalBatches: batches.length,
        indexed,
        total,
      });
    } catch (err) {
      let message = "Unexpected error while contacting the Search Console API.";

      if (err.code === "ECONNABORTED") {
        message = `Request timed out after ${TIMEOUT_MS}ms while pushing batch ${i + 1}.`;
      } else if (err.response) {
        message = `Search Console API responded with status ${err.response.status} on batch ${i + 1}.`;
      } else if (err.request) {
        message = `No response received from the Search Console API (batch ${i + 1}). Check the endpoint URL.`;
      } else if (err.message) {
        message = err.message;
      }

      sendEvent({
        type: "error",
        batch: i + 1,
        indexed,
        total,
        message,
      });

      return res.end();
    }
  }

  const timeTakenMs = Date.now() - startedAt;

  sendEvent({
    type: "done",
    indexed,
    total,
    timeTakenMs,
  });

  res.end();
});

module.exports = router;
