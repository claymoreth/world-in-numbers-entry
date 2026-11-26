// The World in Numbers — router, one global state object, and the wiring
// for every control on the site. No network, no storage, no cookies.
import { viewArchive, viewCountries, viewHome, viewPeople, viewRankings } from "./views.js";

// One state object for the whole site. Every control reads and writes it,
// and every render starts from it.
const state = {
  route: "home",
  year: 2025,
  sortKey: "gdp",
  sortDir: "desc",
  archiveQuery: "",
};

const ROUTES = {
  home: { render: viewHome, title: "The World in Numbers — the ten largest economies, compared" },
  countries: { render: viewCountries, title: "Countries — The World in Numbers" },
  rankings: { render: viewRankings, title: "Rankings — The World in Numbers" },
  people: { render: viewPeople, title: "People — The World in Numbers" },
  archive: { render: viewArchive, title: "Archive — The World in Numbers" },
};

const app = document.getElementById("app");
const menuButton = document.getElementById("menu-button");
const nav = document.getElementById("site-nav");

function routeFromHash() {
  const hash = window.location.hash.replace(/^#\/?/, "").split("/")[0];
  return ROUTES[hash] ? hash : "home";
}

function render() {
  const page = ROUTES[state.route];
  app.innerHTML = page.render(state);
  document.title = page.title;
  document.querySelectorAll("#site-nav a").forEach((a) => {
    const href = a.getAttribute("href") ?? "";
    const name = href.replace(/^#\/?/, "").split("/")[0] || "home";
    if (name === state.route) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  wireControls();
  window.scrollTo(0, 0);
}

function wireControls() {
  const yearSelect = document.getElementById("year-select");
  if (yearSelect) {
    yearSelect.addEventListener("change", () => {
      const next = Number(yearSelect.value);
      if (Number.isInteger(next) && next >= 2020 && next <= 2025) {
        state.year = next;
        render();
      }
    });
  }

  document.querySelectorAll(".sort-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.getAttribute("data-sort");
      if (!key) return;
      if (state.sortKey === key) {
        state.sortDir = state.sortDir === "desc" ? "asc" : "desc";
      } else {
        state.sortKey = key;
        state.sortDir = "desc";
      }
      render();
    });
  });

  const search = document.getElementById("archive-search");
  if (search) {
    search.addEventListener("input", () => {
      state.archiveQuery = search.value;
      filterArchive(search.value);
    });
    // Keep the caret where the reader left it after a re-render.
    search.focus();
    search.setSelectionRange(search.value.length, search.value.length);
  }
}

// Live archive filter: hides rows in place so the search box never loses
// focus or its text while the reader types.
function filterArchive(query) {
  const needle = query.trim().toLowerCase();
  const body = document.getElementById("archive-body");
  const count = document.getElementById("archive-count");
  if (!body) return;
  let shown = 0;
  let total = 0;
  body.querySelectorAll("tr").forEach((row) => {
    total += 1;
    const match = !needle || row.textContent.toLowerCase().includes(needle);
    row.style.display = match ? "" : "none";
    if (match) shown += 1;
  });
  if (count) count.textContent = `${shown} of ${total} figures shown`;
}

function onHashChange() {
  state.route = routeFromHash();
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  render();
}

menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

window.addEventListener("hashchange", onHashChange);
state.route = routeFromHash();
render();
