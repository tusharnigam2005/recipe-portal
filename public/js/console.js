// ==========================================================================
// RecipeVerse Developer Console — talks ONLY to our own /push backend route.
// The backend is the one that calls the external Search Console API.
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pushForm");
  if (!form) return;

  const pushBtn = document.getElementById("pushBtn");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const progressPercent = document.getElementById("progressPercent");
  const consoleLog = document.getElementById("consoleLog");
  const summary = document.getElementById("consoleSummary");
  const summaryIndexed = document.getElementById("summaryIndexed");
  const summaryTotal = document.getElementById("summaryTotal");
  const summaryTime = document.getElementById("summaryTime");

  function logLine(text, variant) {
    const line = document.createElement("div");
    line.className = `console-log__line${variant ? ` console-log__line--${variant}` : ""}`;
    line.textContent = text;
    consoleLog.appendChild(line);
    consoleLog.scrollTop = consoleLog.scrollHeight;
  }

  function resetConsole() {
    consoleLog.innerHTML = "";
    progressFill.style.width = "0%";
    progressText.textContent = "0 / 0 Recipes Indexed";
    progressPercent.textContent = "0%";
    summary.style.display = "none";
  }

  function setProgress(indexed, total) {
    const pct = total > 0 ? Math.round((indexed / total) * 100) : 0;
    progressFill.style.width = `${pct}%`;
    progressText.textContent = `${indexed} / ${total} Recipes Indexed`;
    progressPercent.textContent = `${pct}%`;
  }

  function formatTime(ms) {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const endpoint = document.getElementById("endpointInput").value.trim();
    const apiToken = document.getElementById("tokenInput").value.trim();

    if (!endpoint || !apiToken) {
      showToast({
        type: "error",
        title: "Missing fields",
        message: "Please provide both the Search Console Endpoint and an API Token.",
      });
      return;
    }

    resetConsole();
    pushBtn.disabled = true;
    pushBtn.classList.add("is-loading");
    pushBtn.dataset.originalText = pushBtn.textContent;
    pushBtn.textContent = "Uploading...";

    logLine("$ Initializing secure push to Search Console API...", "muted");

    const startedAt = Date.now();

    try {
      const response = await fetch("/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint, apiToken }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.message || `Server responded with status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Read newline-delimited JSON progress events streamed from /push
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop(); // keep the last (possibly incomplete) line

        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line);
          handleEvent(event);
        }
      }

      if (buffer.trim()) {
        handleEvent(JSON.parse(buffer));
      }
    } catch (err) {
      logLine(`✖ ${err.message}`, "error");
      showToast({
        type: "error",
        title: "Push failed",
        message: err.message || "Could not reach the Search Console API.",
      });
    } finally {
      pushBtn.disabled = false;
      pushBtn.classList.remove("is-loading");
      pushBtn.textContent = pushBtn.dataset.originalText || "Push All Recipes";
    }

    function handleEvent(event) {
      if (event.type === "start") {
        logLine(`$ Connected to ${event.endpoint} — ${event.total} recipes across ${event.batches} batches.`);
        setProgress(0, event.total);
      } else if (event.type === "progress") {
        logLine(
          `✓ Batch ${event.batch}/${event.totalBatches} indexed (${event.indexed}/${event.total} total)`,
          "success"
        );
        setProgress(event.indexed, event.total);
      } else if (event.type === "error") {
        logLine(`✖ ${event.message}`, "error");
        setProgress(event.indexed, event.total);
        showToast({ type: "error", title: "Push failed", message: event.message });
      } else if (event.type === "done") {
        const elapsed = Date.now() - startedAt;
        logLine(`$ Done. ${event.indexed}/${event.total} recipes indexed in ${formatTime(event.timeTakenMs || elapsed)}.`);
        setProgress(event.indexed, event.total);

        summary.style.display = "grid";
        summaryIndexed.textContent = `${event.indexed}/${event.total}`;
        summaryTotal.textContent = event.total;
        summaryTime.textContent = formatTime(event.timeTakenMs || elapsed);

        showToast({
          type: "success",
          title: "Recipes indexed",
          message: `${event.indexed} of ${event.total} recipes were pushed successfully.`,
        });
      }
    }
  });
});
