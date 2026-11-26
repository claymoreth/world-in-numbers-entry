// main.js — bootstrap: hash router, shared header, page state, event binding.
// Static only: no fetch, no network, no eval.

import { REGIONS } from './data.js';
import { viewOverview, viewRankings, viewDemographics, viewRegions, viewArchive, viewSources } from './views.js';

const state = {
  route: '/',
  chartTab: 'usa',
  pyramidYear: 2025,
  mapLayer: 'gdp',
  selectedCode: 'USA',
  compareCode: '',
  sortKey: 'gdp',
  sortDir: 'desc',
  archiveQuery: '',
};

const NAV = [
  ['/', 'Overview'], ['/rankings', 'Rankings'], ['/regions', 'Regions'],
  ['/demographics', 'Demographics'], ['/archive', 'Data Tables'], ['/sources', 'Sources'],
];

function renderHeader() {
  const links = NAV.map(([href, label]) =>
    `<a href="#${href}" class="${state.route === href ? 'active' : ''}">${label}</a>`).join('');
  document.getElementById('site-header').innerHTML = `
    <div class="topbar"><span>The World in Numbers — Open World Accounts &amp; Reference Series (2020–2025)</span>
    <span class="tag">Reference Edition | IMF WEO / World Bank WDI</span></div>
    <div class="masthead">
      <a class="brand" href="#/"><span class="mark">W</span><span><span class="name">The World in Numbers</span><br>
      <span class="sub">A reference atlas of the world's ten largest economies</span></span></a>
      <form class="searchbox" id="site-search" role="search">
        <input id="site-search-input" type="search" placeholder="Search GDP, China, HDI..." aria-label="Search the archive">
        <button type="submit">Search</button>
      </form>
      <nav class="tabs" aria-label="Sections">${links}</nav>
    </div>`;
  document.getElementById('site-search').addEventListener('submit', (e) => {
    e.preventDefault();
    state.archiveQuery = document.getElementById('site-search-input').value;
    location.hash = '#/archive';
  });
}

function render() {
  renderHeader();
  const app = document.getElementById('app');
  const view =
    state.route === '/rankings' ? viewRankings(state) :
    state.route === '/regions' ? viewRegions(state) :
    state.route === '/demographics' ? viewDemographics(state) :
    state.route === '/archive' ? viewArchive(state) :
    state.route === '/sources' ? viewSources() :
    viewOverview(state);
  app.innerHTML = view;
  bind(app);
  window.scrollTo(0, 0);
}

function bindSort(scope) {
  scope.querySelectorAll('[data-sort]').forEach((el) => {
    const go = () => {
      const key = el.dataset.sort;
      if (state.sortKey === key) state.sortDir = state.sortDir === 'desc' ? 'asc' : 'desc';
      else { state.sortKey = key; state.sortDir = key === 'name' ? 'asc' : 'desc'; }
      render();
    };
    el.addEventListener('click', go);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
}

function bind(app) {
  bindSort(app);

  // Overview chart series tabs.
  app.querySelectorAll('[data-chart-tab]').forEach((b) =>
    b.addEventListener('click', () => { state.chartTab = b.dataset.chartTab; render(); }));

  // Demographics year pills.
  app.querySelectorAll('[data-pyramid-year]').forEach((b) =>
    b.addEventListener('click', () => { state.pyramidYear = Number(b.dataset.pyramidYear); render(); }));

  // Regions layer tabs.
  app.querySelectorAll('[data-map-layer]').forEach((b) =>
    b.addEventListener('click', () => { state.mapLayer = b.dataset.mapLayer; render(); }));

  // Map markers + continent polygons select a country / region.
  app.querySelectorAll('.marker').forEach((m) => {
    const pick = () => { state.selectedCode = m.dataset.country; render(); };
    m.addEventListener('click', pick);
    m.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
  });
  app.querySelectorAll('.map-svg polygon').forEach((p) =>
    p.addEventListener('click', () => {
      const first = { 'North America': 'USA', 'Europe': 'DEU', 'Asia': 'CHN', 'South America': 'BRA' }[p.dataset.region];
      if (first) { state.selectedCode = first; render(); }
    }));

  // Compare dropdown.
  const cmp = app.querySelector('#compare-select');
  if (cmp) cmp.addEventListener('change', () => { state.compareCode = cmp.value; render(); });

  // Regional CSV export (Blob download, no network).
  const exp = app.querySelector('#export-csv');
  if (exp) exp.addEventListener('click', () => {
    const head = 'Region,GDP ($ trillion),Share of world GDP (%),Population (million),GDP per capita ($),GDP growth 2024-2025 (%),HDI\n';
    const lines = REGIONS.map((r) => [
      r.name, r.gdp.toFixed(2), r.share.toFixed(1),
      r.population === null ? '' : r.population.toFixed(2),
      r.gdpPerCapita === null ? '' : r.gdpPerCapita,
      r.growth === null ? '' : r.growth.toFixed(1),
      r.hdi === null ? '' : r.hdi.toFixed(3),
    ].join(',')).join('\n');
    const blob = new Blob([head + lines + '\n'], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'regional-output-2025.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  // Archive live search.
  const search = app.querySelector('#archive-search');
  if (search) {
    search.addEventListener('input', () => {
      state.archiveQuery = search.value;
      const pos = search.selectionStart;
      render();
      const again = document.getElementById('archive-search');
      if (again) { again.focus(); again.setSelectionRange(pos, pos); }
    });
  }
}

function route() {
  // Unknown hashes fall back to the Overview instead of a blank page.
  const hash = location.hash.replace(/^#/, '') || '/';
  state.route = NAV.some(([h]) => h === hash) ? hash : '/';
  render();
}

window.addEventListener('hashchange', route);
route();
