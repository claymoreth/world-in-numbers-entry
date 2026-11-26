// Page views. Each function takes the shared state and returns the HTML
// for one page. No view fetches anything: every figure comes from data.js.
import { COUNTRIES, INDICATORS, SOURCES, WORLD, YEARS, formatNumber, gdpOf, top10GdpShare } from "./data.js";
import { barChart, lineChart, PALETTE } from "./charts.js";

function sourceLine(text) {
  return `<p class="source">Source: ${text}</p>`;
}

function yearSelect(year) {
  const options = YEARS.map(
    (y) => `<option value="${y}"${y === year ? " selected" : ""}>${y}</option>`,
  ).join("");
  return `<label class="year-picker">Year <select id="year-select" aria-label="Choose year">${options}</select></label>`;
}

// ---- Home ---------------------------------------------------------------

export function viewHome(state) {
  const year = state.year;
  const share = top10GdpShare(2025);
  const largest = COUNTRIES[0];
  const mostPopulous = [...COUNTRIES].sort((a, b) => b.populationM - a.populationM)[0];
  const bestHdi = [...COUNTRIES].sort((a, b) => b.hdi - a.hdi)[0];
  const lowestUnemp = [...COUNTRIES].sort((a, b) => a.unemployment - b.unemployment)[0];

  const cards = [
    { value: `$${formatNumber(WORLD.gdpTn, 2)}tn`, label: "World GDP, 2025", source: "IMF, WEO Oct 2026" },
    { value: `${formatNumber(WORLD.populationM / 1000, 2)}bn`, label: "World population, 2025", source: "World Bank WDI" },
    { value: `$${formatNumber(WORLD.gdpPerCapita, 0)}`, label: "World GDP per capita, 2025", source: "World Bank WDI" },
    { value: `${formatNumber(share.share, 1)}%`, label: "Top 10 share of world GDP, 2025", source: "Calculated from IMF WEO Oct 2026" },
    { value: largest.name, label: `Largest economy — $${formatNumber(gdpOf(largest, 2025), 2)}tn, 2025`, source: "IMF, WEO Oct 2026" },
    { value: mostPopulous.name, label: `Most populous — ${formatNumber(mostPopulous.populationM, 2)}m people, 2025`, source: "World Bank WDI" },
    { value: bestHdi.name, label: `Highest HDI — ${formatNumber(bestHdi.hdi, 3)}, 2023`, source: "UNDP HDR 2025" },
    { value: lowestUnemp.name, label: `Lowest unemployment — ${formatNumber(lowestUnemp.unemployment, 1)}%, 2025`, source: "IMF, WEO Oct 2026" },
  ];

  const gdpRows = [...COUNTRIES]
    .sort((a, b) => (gdpOf(b, year) ?? 0) - (gdpOf(a, year) ?? 0))
    .map((c) => ({ label: c.name, value: gdpOf(c, year) ?? 0 }));

  const top3 = COUNTRIES.slice(0, 3);
  const trend = top3.map((c, i) => ({
    label: c.name,
    color: [PALETTE.AMBER, PALETTE.TEAL, PALETTE.TEAL_LIGHT][i],
    values: YEARS.map((y) => gdpOf(c, y) ?? 0),
  }));

  const miniRows = [...COUNTRIES]
    .sort((a, b) => (gdpOf(b, 2025) ?? 0) - (gdpOf(a, 2025) ?? 0))
    .slice(0, 5)
    .map((c, i) => {
      const g = gdpOf(c, 2025);
      return `<tr><td>${i + 1}</td><td>${c.name}</td><td class="num">$${formatNumber(g, 2)}tn</td><td class="num">${formatNumber(c.gdpPerCapita, 0)}</td></tr>`;
    })
    .join("");

  return `
  <section class="hero">
    <p class="kicker">Ten economies. One world. Every figure sourced.</p>
    <h1>The World in Numbers</h1>
    <p class="lede">The ten largest economies on Earth, compared side by side on the figures that matter: output, income, people, prices, work and wellbeing. All figures are from the IMF, the World Bank and UNDP — with the source and year beside every number.</p>
    <p class="hero-meta">Latest year: 2025 for GDP, population and prices · 2023 for human development</p>
  </section>

  <section aria-label="World headlines">
    <h2>The world at a glance</h2>
    <div class="cards">
      ${cards.map((c) => `<article class="card"><p class="card-value">${c.value}</p><p class="card-label">${c.label}</p><p class="card-source">${c.source}</p></article>`).join("")}
    </div>
  </section>

  <section aria-label="GDP chart">
    <div class="section-head">
      <h2>GDP of the ten largest economies</h2>
      ${yearSelect(year)}
    </div>
    <p class="section-note">Nominal GDP in current US dollars. Change the year to redraw the chart — the series runs 2020 to 2025.</p>
    <div class="chart">${barChart(gdpRows, (v) => `$${formatNumber(v, 2)}tn`, { ariaLabel: `GDP by country, ${year}`, highlight: 0 })}</div>
    ${sourceLine(`${SOURCES.gdp}, ${year}.`)}
  </section>

  <section aria-label="GDP trend">
    <h2>The top three, 2020–2025</h2>
    <p class="section-note">Nominal GDP, trillion current US$. The United States widened its lead after 2022; Japan fell back as the yen weakened.</p>
    <div class="chart">${lineChart(trend, YEARS, (v) => `$${formatNumber(v, 2)}tn`, { ariaLabel: "GDP trend of the three largest economies, 2020 to 2025" })}</div>
    <p class="legend"><span class="dot" style="background:${PALETTE.AMBER}"></span>United States <span class="dot" style="background:${PALETTE.TEAL}"></span>China <span class="dot" style="background:${PALETTE.TEAL_LIGHT}"></span>Germany</p>
    ${sourceLine(SOURCES.gdp + ".")}
  </section>

  <section aria-label="Top five">
    <h2>Top five economies, 2025</h2>
    <table class="data-table">
      <thead><tr><th>#</th><th>Country</th><th class="num">GDP</th><th class="num">GDP per capita</th></tr></thead>
      <tbody>${miniRows}</tbody>
    </table>
    <p class="more-link"><a href="#/countries">See all ten countries →</a></p>
    ${sourceLine(`${SOURCES.gdp}, 2025. ${SOURCES.gdpPerCapita}.`)}
  </section>`;
}

// ---- Countries ----------------------------------------------------------

export function viewCountries(state) {
  const year = state.year;
  const rows = [...COUNTRIES]
    .sort((a, b) => (gdpOf(b, year) ?? 0) - (gdpOf(a, year) ?? 0))
    .map((c, i) => {
      const g = gdpOf(c, year);
      return `<tr>
        <td>${i + 1}</td><td><strong>${c.name}</strong><br><span class="region">${c.region}</span></td>
        <td class="num">$${formatNumber(g, 2)}tn</td>
        <td class="num">$${formatNumber(c.gdpPerCapita, 0)}</td>
        <td class="num">${formatNumber(c.populationM, 2)}m</td>
        <td class="num">${formatNumber(c.inflation, 1)}%</td>
        <td class="num">${formatNumber(c.unemployment, 1)}%</td>
        <td class="num">${formatNumber(c.hdi, 3)}</td>
      </tr>`;
    })
    .join("");

  const pcRows = [...COUNTRIES]
    .sort((a, b) => b.gdpPerCapita - a.gdpPerCapita)
    .map((c) => ({ label: c.name, value: c.gdpPerCapita }));

  return `
  <section>
    <h1>Countries</h1>
    <p class="lede">All ten economies on one table. GDP follows the year you pick; the other indicators are the latest verified year for each (2025, except HDI, 2023).</p>
    <div class="section-head">
      <h2>Comparison table</h2>
      ${yearSelect(year)}
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>#</th><th>Country</th><th class="num">GDP ($tn, ${year})</th><th class="num">GDP per capita ($)</th><th class="num">Population (m)</th><th class="num">Inflation (%)</th><th class="num">Unemployment (%)</th><th class="num">HDI</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    ${sourceLine(`${SOURCES.gdp}. ${SOURCES.gdpPerCapita}. ${SOURCES.population}. ${SOURCES.inflation}. ${SOURCES.unemployment}. ${SOURCES.hdi}.`)}
  </section>

  <section aria-label="GDP per capita chart">
    <h2>Income per person, 2025</h2>
    <p class="section-note">GDP per capita, current US$. The United States earns more than six times China per person, even though China is the second-largest economy overall.</p>
    <div class="chart">${barChart(pcRows, (v) => `$${formatNumber(v, 0)}`, { ariaLabel: "GDP per capita by country, 2025", highlight: 0 })}</div>
    ${sourceLine(SOURCES.gdpPerCapita + ".")}
  </section>`;
}

// ---- Rankings -----------------------------------------------------------

const RANK_COLUMNS = [
  { key: "gdp", label: "GDP ($tn)", get: (c) => gdpOf(c, 2025) ?? 0, format: (v) => `$${formatNumber(v, 2)}` },
  { key: "gdpPerCapita", label: "GDP per capita ($)", get: (c) => c.gdpPerCapita, format: (v) => `$${formatNumber(v, 0)}` },
  { key: "populationM", label: "Population (m)", get: (c) => c.populationM, format: (v) => formatNumber(v, 2) },
  { key: "inflation", label: "Inflation (%)", get: (c) => c.inflation, format: (v) => `${formatNumber(v, 1)}%` },
  { key: "unemployment", label: "Unemployment (%)", get: (c) => c.unemployment, format: (v) => `${formatNumber(v, 1)}%` },
  { key: "hdi", label: "HDI", get: (c) => c.hdi, format: (v) => formatNumber(v, 3) },
];

export function viewRankings(state) {
  const sortKey = state.sortKey ?? "gdp";
  const sortDir = state.sortDir ?? "desc";
  const col = RANK_COLUMNS.find((c) => c.key === sortKey) ?? RANK_COLUMNS[0];

  const sorted = [...COUNTRIES].sort((a, b) => {
    const diff = col.get(a) - col.get(b);
    return sortDir === "desc" ? -diff : diff;
  });

  const headers = RANK_COLUMNS.map((c) => {
    const active = c.key === sortKey;
    const arrow = active ? (sortDir === "desc" ? " ↓" : " ↑") : "";
    return `<th class="num"><button class="sort-btn${active ? " active" : ""}" data-sort="${c.key}" aria-sort="${active ? (sortDir === "desc" ? "descending" : "ascending") : "none"}">${c.label}${arrow}</button></th>`;
  }).join("");

  const rows = sorted
    .map((c, i) => {
      const cells = RANK_COLUMNS.map((cc) => `<td class="num${cc.key === sortKey ? " sorted-col" : ""}">${cc.format(cc.get(c))}</td>`).join("");
      return `<tr><td>${i + 1}</td><td><strong>${c.name}</strong></td>${cells}</tr>`;
    })
    .join("");

  return `
  <section>
    <h1>Rankings</h1>
    <p class="lede">Every ranking on one table. Click any column heading to re-sort all ten countries by that indicator — click again to flip the order. The highlighted column is the one you are sorting by. All figures are 2025, except HDI (2023).</p>
    <div class="table-wrap">
      <table class="data-table" id="rankings-table">
        <thead><tr><th>#</th><th>Country</th>${headers}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p class="section-note">Sorting now: <strong>${col.label}</strong>, ${sortDir === "desc" ? "highest first" : "lowest first"}.</p>
    ${sourceLine(`${SOURCES.gdp}, 2025. ${SOURCES.gdpPerCapita}. ${SOURCES.population}. ${SOURCES.inflation}. ${SOURCES.unemployment}. ${SOURCES.hdi}.`)}
  </section>

  <section aria-label="Reading the rankings">
    <h2>What the rankings show</h2>
    <ul class="read-list">
      <li><strong>Size is not income:</strong> India is the 6th-largest economy but 10th of 10 on GDP per capita ($2,702).</li>
      <li><strong>People are not output:</strong> India has the most people (1,463.87m) and China is second (1,406.59m) — together, 35% of humanity.</li>
      <li><strong>Prices bite unevenly:</strong> Brazil's inflation (5.0%) is the highest of the ten; France's (0.9%) the lowest.</li>
      <li><strong>Work is tightest in Japan:</strong> 2.5% unemployment, the lowest of the ten; France is highest at 7.7%.</li>
      <li><strong>Wellbeing leads in Germany:</strong> HDI 0.959, the highest of the ten; India is lowest at 0.685.</li>
    </ul>
  </section>`;
}

// ---- People -------------------------------------------------------------

export function viewPeople(state) {
  const popRows = [...COUNTRIES]
    .sort((a, b) => b.populationM - a.populationM)
    .map((c) => ({ label: c.name, value: c.populationM }));
  const hdiRows = [...COUNTRIES]
    .sort((a, b) => b.hdi - a.hdi)
    .map((c) => ({ label: c.name, value: c.hdi }));

  const rows = [...COUNTRIES]
    .sort((a, b) => b.populationM - a.populationM)
    .map((c, i) => `<tr>
      <td>${i + 1}</td><td><strong>${c.name}</strong></td>
      <td class="num">${formatNumber(c.populationM, 2)}m</td>
      <td class="num">${formatNumber(c.hdi, 3)}</td>
      <td class="num">${formatNumber(c.lifeExpectancy, 1)} yrs</td>
    </tr>`)
    .join("");

  const top10Pop = COUNTRIES.reduce((acc, c) => acc + c.populationM, 0);

  return `
  <section>
    <h1>People</h1>
    <p class="lede">The ten economies hold ${formatNumber(top10Pop, 2)} million people — ${formatNumber((top10Pop / WORLD.populationM) * 100, 1)}% of everyone on Earth. This page is about them: how many, how long they live, and how developed their societies are.</p>
  </section>

  <section aria-label="Population chart">
    <h2>Population, 2025</h2>
    <p class="section-note">Midyear population, millions. India passed China as the world's most populous country in 2023; the gap is now about 57 million.</p>
    <div class="chart">${barChart(popRows, (v) => `${formatNumber(v, 2)}m`, { ariaLabel: "Population by country, 2025", highlight: 0 })}</div>
    ${sourceLine(SOURCES.population + ".")}
  </section>

  <section aria-label="HDI chart">
    <h2>Human development, 2023</h2>
    <p class="section-note">Human Development Index, 0 to 1. Germany leads the ten at 0.959; India trails at 0.685 — the only one of the ten below "high" development.</p>
    <div class="chart">${barChart(hdiRows, (v) => formatNumber(v, 3), { ariaLabel: "Human Development Index by country, 2023", highlight: 0 })}</div>
    ${sourceLine(SOURCES.hdi + ".")}
  </section>

  <section aria-label="People table">
    <h2>People at a glance</h2>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>#</th><th>Country</th><th class="num">Population (2025)</th><th class="num">HDI (2023)</th><th class="num">Life expectancy (2023)</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    ${sourceLine(`${SOURCES.population}. ${SOURCES.hdi}. ${SOURCES.lifeExpectancy}.`)}
  </section>`;
}

// ---- Archive ------------------------------------------------------------

export function viewArchive(state) {
  const query = (state.archiveQuery ?? "").trim().toLowerCase();
  const rows = [];
  const worldRows = [
    { country: "World", indicator: "GDP", value: `$${formatNumber(WORLD.gdpTn, 2)}tn`, year: 2025, source: WORLD.gdpSource },
    { country: "World", indicator: "Population", value: `${formatNumber(WORLD.populationM, 2)}m`, year: 2025, source: WORLD.populationSource },
    { country: "World", indicator: "GDP per capita", value: `$${formatNumber(WORLD.gdpPerCapita, 0)}`, year: 2025, source: WORLD.gdpPerCapitaSource },
    { country: "World", indicator: "Human Development Index", value: formatNumber(WORLD.hdi, 3), year: 2023, source: WORLD.hdiSource },
  ];
  for (const r of worldRows) rows.push(r);
  for (const c of COUNTRIES) {
    for (const y of YEARS) {
      rows.push({
        country: c.name,
        indicator: `GDP (${y})`,
        value: `$${formatNumber(gdpOf(c, y), 2)}tn`,
        year: y,
        source: "IMF, World Economic Outlook, October 2026",
      });
    }
    rows.push({ country: c.name, indicator: "GDP per capita", value: `$${formatNumber(c.gdpPerCapita, 0)}`, year: 2025, source: "World Bank, World Development Indicators" });
    rows.push({ country: c.name, indicator: "Population", value: `${formatNumber(c.populationM, 2)}m`, year: 2025, source: "World Bank, World Development Indicators" });
    rows.push({ country: c.name, indicator: "Inflation", value: `${formatNumber(c.inflation, 1)}%`, year: 2025, source: "IMF, World Economic Outlook, October 2026" });
    rows.push({ country: c.name, indicator: "Unemployment", value: `${formatNumber(c.unemployment, 1)}%`, year: 2025, source: "IMF, World Economic Outlook, October 2026" });
    rows.push({ country: c.name, indicator: "Human Development Index", value: formatNumber(c.hdi, 3), year: 2023, source: "UNDP, Human Development Report 2025, Table 1" });
    rows.push({ country: c.name, indicator: "Life expectancy", value: `${formatNumber(c.lifeExpectancy, 1)} years`, year: 2023, source: "UNDP, Human Development Report 2025, Table 1 / World Bank WDI" });
  }

  const visible = rows.filter((r) =>
    !query ||
    `${r.country} ${r.indicator} ${r.value} ${r.year} ${r.source}`.toLowerCase().includes(query),
  );

  const body = visible
    .map((r) => `<tr><td>${r.country}</td><td>${r.indicator}</td><td class="num">${r.value}</td><td class="num">${r.year}</td><td>${r.source}</td></tr>`)
    .join("");

  return `
  <section>
    <h1>Archive</h1>
    <p class="lede">Every figure on this site, in one place, with its source and year. Search for a country, an indicator or a source to filter the table.</p>
    <div class="archive-tools">
      <label class="search-box">Search the archive
        <input id="archive-search" type="search" placeholder="Try “Japan”, “inflation” or “UNDP”…" value="${state.archiveQuery ?? ""}" autocomplete="off">
      </label>
      <p class="archive-count" id="archive-count">${visible.length} of ${rows.length} figures shown</p>
    </div>
    <div class="table-wrap">
      <table class="data-table" id="archive-table">
        <thead><tr><th>Country</th><th>Indicator</th><th class="num">Value</th><th class="num">Year</th><th>Source</th></tr></thead>
        <tbody id="archive-body">${body}</tbody>
      </table>
    </div>
    <p class="section-note">Figures verified 26 November 2026. GDP uses one vintage — IMF World Economic Outlook, October 2026 — for every country and every year, so years compare like with like. Where a figure could not be verified from an official source it is not shown at all.</p>
  </section>`;
}

export { INDICATORS };
