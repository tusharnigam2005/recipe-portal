// ==========================================================================
// RecipeVerse — shared front-end behaviour (nav, search, filtering, toasts)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initLiveSearchAndFilter();
});

/* ------------------------------ Nav toggle ------------------------------ */
function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ------------------------- Live search & filtering ----------------------- */
function initLiveSearchAndFilter() {
  const grid = document.getElementById("recipeGrid");
  if (!grid) return; // Not on a page with the recipe grid

  const searchInput = document.getElementById("searchInput");
  const heroSearchInput = document.getElementById("heroSearchInput");
  const pills = document.querySelectorAll(".filter-pill");
  const emptyState = document.getElementById("emptyState");
  const cards = Array.from(grid.querySelectorAll(".recipe-card"));

  let activeCategory = "All";
  let query = "";

  function applyFilters() {
    let visibleCount = 0;

    cards.forEach((card) => {
      const title = card.dataset.title.toLowerCase();
      const category = card.dataset.category;
      const tags = (card.dataset.tags || "").toLowerCase();

      const matchesQuery = !query || title.includes(query) || tags.includes(query);
      const matchesCategory = activeCategory === "All" || category === activeCategory;
      const isVisible = matchesQuery && matchesCategory;

      card.style.display = isVisible ? "" : "none";
      if (isVisible) visibleCount += 1;
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? "block" : "none";
    }
  }

  function setQuery(value) {
    query = value.trim().toLowerCase();
    if (searchInput && searchInput.value !== value) searchInput.value = value;
    if (heroSearchInput && heroSearchInput.value !== value) heroSearchInput.value = value;
    applyFilters();
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => setQuery(e.target.value));
  }
  if (heroSearchInput) {
    heroSearchInput.addEventListener("input", (e) => setQuery(e.target.value));
    const heroSearchForm = document.getElementById("heroSearchForm");
    if (heroSearchForm) {
      heroSearchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        setQuery(heroSearchInput.value);
        document.getElementById("recipes")?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((p) => p.classList.remove("is-active"));
      pill.classList.add("is-active");
      activeCategory = pill.dataset.category;
      applyFilters();
    });
  });

  // Category chips on the homepage also drive the same filter
  document.querySelectorAll(".category-chip[data-category]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const targetPill = document.querySelector(
        `.filter-pill[data-category="${CSS.escape(chip.dataset.category)}"]`
      );
      if (targetPill) targetPill.click();
      document.getElementById("recipes")?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

/* --------------------------------- Toasts -------------------------------- */
function showToast({ type = "success", title, message }) {
  let stack = document.querySelector(".toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    document.body.appendChild(stack);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span class="toast__icon">${type === "success" ? "✅" : "⚠️"}</span>
    <div>
      <div class="toast__title">${title}</div>
      <div class="toast__msg">${message}</div>
    </div>
  `;
  stack.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(30px)";
    toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

window.showToast = showToast;
