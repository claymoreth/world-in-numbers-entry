// views.js — renders each page from data.js. All words are our own;
// all numbers come from data.js (see the DATA SPEC for their sources).

import {
  COUNTRIES, TOP10_TOTAL, REGIONS, CALENDAR, DEMO_SUMMARY, TRAJECTORY,
  PYRAMID_2025, PYRAMID_1950, LAYERS, buildArchive, countryByCode,
  layerValue, regionLayerValue,
} from './data.js';
import { lineChart, sparkline, pyramid, worldMap, barRow } from './charts.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmtInt = (n) => n.toLocaleString('en-US');

function kpiCard(label, value, note, src, sparkValues) {
  return `<div class="kpi"><div class="k-label">${esc(label)}</div>
    <div class="k-value">${esc(value)}</div>
    <div class="k-note">${esc(note)}</div>
    ${sparkValues ? sparkline(sparkValues) : ''}
    <div class="k-src">${esc(src)}</div></div>`;
}

// ---------------- Overview ----------------
export function viewOverview(state) {
  const series =
    state.chartTab === 'usa' ? { values: COUNTRIES[0].gdp, label: 'United States GDP', color: '#0f3d3e',
      annotations: [{ yearIndex: 0, text: '2020 $21.38tn — pandemic year low' }] } :
    state.chartTab === 'china' ? { values: COUNTRIES[1].gdp, label: 'China GDP', color: '#2f6f8f', annotations: [] } :
    { values: TOP10_TOTAL, label: 'Top-10 GDP total', color: '#e8a317',
      annotations: [{ yearIndex: 0, text: '2020 $58.59tn' }, { yearIndex: 5, text: '2025 $78.51tn' }] };
  const tab = (key, label) => `<button class="pill${state.chartTab === key ? ' active' : ''}" data-chart-tab="${key}">${label}</button>`;
  const regionBars = REGIONS.map((r) =>
    barRow(r.name, r.share.toFixed(1) + '%', r.share, r.name === 'Asia',
      `GDP $${r.gdp.toFixed(2)}tn · growth ${r.growth === null ? 'n/a' : '+' + r.growth.toFixed(1) + '%'}`)).join('');
  const cal = CALENDAR.map((c) =>
    `<div class="cal-item"><div class="pub">${esc(c.publisher)}</div><div class="ttl">${esc(c.title)}</div><div class="cad">${esc(c.cadence)}</div></div>`).join('');
  return `
  <div class="page-head">
    <div><h1>United States tops $30.86 trillion as India passes China as the most populous nation</h1>
    <p class="dek">The ten largest economies now produce two-thirds of world output. This reference
    edition gathers their GDP, population and development figures in one place, drawn from the
    IMF, the World Bank, UNDP and the United Nations — so any comparison on this site can be
    traced back to its official release.</p></div>
    <div class="edition-label"><strong>2025 Annual Reference</strong>Published October 2026</div>
  </div>
  <section class="kpis" aria-label="Key figures">
    ${kpiCard('World GDP', '$118.50tn', 'Top 10 hold 66.3%', 'IMF WEO, October 2026')}
    ${kpiCard('World population', '8.22bn', 'India most populous at 1,463.87m', 'World Bank WDI, 2025')}
    ${kpiCard('World GDP per capita', '$14,406', 'USA highest at $90,027; India lowest at $2,702', 'WDI, 2025')}
    ${kpiCard('Top-10 share of world GDP', '66.3%', 'Top-10 total $78.51tn', 'Calculated from IMF WEO Oct 2026', TOP10_TOTAL)}
    ${kpiCard('USA GDP', '$30.86tn', '+5.0% vs 2024', 'IMF WEO, October 2026', COUNTRIES[0].gdp)}
    ${kpiCard('India population', '1,463.87m', '57.28m more than China', 'World Bank WDI, 2025')}
  </section>
  <div class="grid-main">
    <section class="panel">
      <div class="panel-head"><h2>Nominal GDP, 2020–2025</h2>
        <a class="btn" href="#/rankings">Open Full Explorer</a></div>
      <p class="panel-sub">Trillions of US dollars, nominal. Switch series below.</p>
      <div class="pills" role="tablist" aria-label="Chart series">
        ${tab('usa', 'USA GDP')}${tab('china', 'China GDP')}${tab('top10', 'Top-10 GDP')}
      </div>
      <div id="home-chart">${lineChart(series)}</div>
      <p class="src">Source: IMF, World Economic Outlook, October 2026. Top-10 total is calculated from the ten country series. USA grew +5.0% in 2025 (from $29.38tn to $30.86tn, calculated).</p>
    </section>
    <div>
      <section class="panel">
        <h2>Regional Output Share (2025)</h2>
        <p class="panel-sub">Share of world GDP, calculated from the country figures.</p>
        ${regionBars}
        <p><a href="#/regions">Open Map &rarr;</a></p>
      </section>
      <section class="panel">
        <h2>Official Release Calendar</h2>
        <p class="panel-sub">When the figures on this site are published.</p>
        ${cal}
      </section>
    </div>
  </div>`;
}

// ---------------- Rankings (sortable table, reused on Regions) ----------------
export function sortedCountries(key, dir) {
  const val = (c) => (key === 'gdp' ? c.gdp[5] : key === 'name' ? c.name : c[key]);
  return [...COUNTRIES].sort((a, b) => {
    const va = val(a), vb = val(b);
    const cmp = typeof va === 'string' ? va.localeCompare(vb) : va - vb;
    return dir === 'asc' ? cmp : -cmp;
  });
}
export function rankingsTable(state, idPrefix) {
  const rows = sortedCountries(state.sortKey, state.sortDir);
  const arrow = (key) => (state.sortKey === key ? (state.sortDir === 'desc' ? ' ▼' : ' ▲') : '');
  const th = (key, label) => `<th class="sortable num" data-sort="${key}" tabindex="0" role="button" aria-label="Sort by ${label}">${label}${arrow(key)}</th>`;
  const body = rows.map((c, i) => `<tr${i === 0 ? ' class="top-row"' : ''}>
    <td>${esc(c.name)}</td><td class="num">$${c.gdp[5].toFixed(2)}tn</td>
    <td class="num">$${fmtInt(c.gdpPerCapita)}</td><td class="num">${fmtInt(c.population)}m</td>
    <td class="num">${c.inflation.toFixed(1)}%</td><td class="num">${c.unemployment.toFixed(1)}%</td>
    <td class="num">${c.hdi.toFixed(3)}</td></tr>`).join('');
  return `<table id="${idPrefix}-table"><thead><tr>
    <th class="sortable" data-sort="name" tabindex="0" role="button">Country${arrow('name')}</th>
    ${th('gdp', 'GDP')}${th('gdpPerCapita', 'GDP per capita')}${th('population', 'Population')}
    ${th('inflation', 'Inflation')}${th('unemployment', 'Unemployment')}${th('hdi', 'HDI')}
    </tr></thead><tbody>${body}</tbody></table>`;
}
export function viewRankings(state) {
  // Note shown on the page, per the brief: all figures 2025 except HDI (2023).
  return `
  <div class="page-head">
    <div><h1>Rankings — the ten largest economies</h1>
    <p class="dek">Click any column header to sort. The United States leads on GDP; Germany leads on
    human development; Japan has the lowest unemployment of the ten.</p></div>
    <div class="edition-label"><strong>All figures 2025</strong>except HDI (2023)</div>
  </div>
  <section class="panel">
    <p class="panel-sub">GDP is nominal, in trillions of US dollars (IMF WEO, October 2026). GDP per capita and population are World Bank WDI 2025. Inflation and unemployment are IMF WEO October 2026. HDI is UNDP Human Development Report 2025 (2023).</p>
    ${rankingsTable(state, 'rankings')}
  </section>`;
}

// ---------------- Demographics ----------------
export function viewDemographics(state) {
  const year = state.pyramidYear;
  const bands = year === 1950 ? PYRAMID_1950 : PYRAMID_2025;
  const s = DEMO_SUMMARY[year];
  const pill = (y) => `<button class="pill${year === y ? ' active' : ''}" data-pyramid-year="${y}">${y}${y === 2025 ? ' (projection)' : ''}</button>`;
  const brackets = year === 2025
    ? `<span>0–14: 24.4%</span><span>15–64: 65.2% (calculated)</span><span>65+: 10.4%</span>`
    : `<span>Under 20: 44.3%</span><span>20–64: 50.6%</span><span>65+: 5.1%</span>`;
  const traj = TRAJECTORY.map((t) => `<tr><td>${t.year}</td><td class="num">${t.medianAge.toFixed(1)}</td>
    <td class="num">${t.under20.toFixed(1)}%</td><td class="num">${t.age2064.toFixed(1)}%</td>
    <td class="num">${t.over65.toFixed(1)}%</td><td class="num">${t.oldPer100}</td></tr>`).join('');
  return `
  <div class="page-head">
    <div><h1>Demographics — a world growing older, and still growing</h1>
    <p class="dek">In 1950 the world held 2.5 billion people with a median age of 22.2. By 2025 it holds
    8.23 billion, and the median age has risen to 30.9 years. The pyramid below shows how the
    age structure shifted across 75 years.</p></div>
    <div class="edition-label"><strong>2025 Snapshot</strong>Latest Official Release</div>
  </div>
  <div class="grid-2">
    <section class="panel">
      <div class="panel-head"><h2>Age-Sex Population Pyramid, ${year === 2025 ? '2025 (UN projection)' : '1950'}</h2>
      <div class="pills">${pill(1950)}${pill(2025)}</div></div>
      <div class="pyramid-legend"><span><span class="dot m"></span>Male</span><span><span class="dot f"></span>Female</span><span>Values in millions</span></div>
      <div class="pyramid-wrap" id="pyramid-chart">${pyramid(bands, s.note)}</div>
      <div class="brackets">${brackets}</div>
      <p class="src">Source: UN World Population Prospects 2024 (medium variant); 2025 is a projection.</p>
    </section>
    <div>
      <section class="panel">
        <h2>Key Demographic Indicators (2025)</h2>
        <div class="stat-grid">
          <div class="stat-cell"><div class="s-val">8.23bn</div><div class="s-lab">Total population</div></div>
          <div class="stat-cell"><div class="s-val">30.9 years</div><div class="s-lab">Median age</div></div>
          <div class="stat-cell"><div class="s-val">32.4%</div><div class="s-lab">Under 20</div></div>
          <div class="stat-cell"><div class="s-val">10.4%</div><div class="s-lab">65 and over</div></div>
          <div class="stat-cell"><div class="s-val">37.4</div><div class="s-lab">Child dependency (per 100 aged 15–64)</div></div>
          <div class="stat-cell"><div class="s-val">16.0</div><div class="s-lab">Old-age dependency (per 100 aged 15–64)</div></div>
        </div>
        <p>One person in three is under 20, yet the share aged 65 and over has doubled since 1950.
        The world is still young in absolute numbers, but its centre of weight keeps moving upward.</p>
      </section>
      <section class="panel">
        <h2>Demographic Trajectory</h2>
        <table><thead><tr><th>Year</th><th class="num">Median age</th><th class="num">Under 20</th>
        <th class="num">20–64</th><th class="num">65+</th><th class="num">65+ per 100 aged 20–64</th></tr></thead>
        <tbody>${traj}</tbody></table>
        <p class="src">Source: UN World Population Prospects 2024 (medium variant); 2025 is a projection.</p>
      </section>
    </div>
  </div>`;
}

// ---------------- Regions ----------------
export function viewRegions(state) {
  const layer = LAYERS.find((l) => l.key === state.mapLayer);
  const tabs = LAYERS.map((l) =>
    `<button class="pill${state.mapLayer === l.key ? ' active' : ''}" data-map-layer="${l.key}">${l.label}</button>`).join('');
  const sel = countryByCode(state.selectedCode);
  const regionRows = REGIONS.filter((r) => regionLayerValue(state.mapLayer, r) !== null);
  const rmax = Math.max(...regionRows.map((r) => regionLayerValue(state.mapLayer, r)));
  const ranking = regionRows.map((r) => {
    const v = regionLayerValue(state.mapLayer, r);
    const txt = state.mapLayer === 'gdp' ? '$' + v.toFixed(2) + 'tn'
      : state.mapLayer === 'gdpPerCapita' ? '$' + fmtInt(v)
      : state.mapLayer === 'population' ? fmtInt(v) + 'm' : v.toFixed(3);
    return barRow(r.name, txt, (v / rmax) * 100);
  }).join('');
  const compare = state.compareCode && state.compareCode !== sel.code
    ? (() => {
      const o = countryByCode(state.compareCode);
      const diff = (sel.gdp[5] - o.gdp[5]);
      const more = diff >= 0 ? 'larger' : 'smaller';
      return `<div class="compare-box"><strong>${esc(sel.name)}</strong> has a GDP of $${sel.gdp[5].toFixed(2)} trillion, ` +
        `${Math.abs(diff).toFixed(2)} trillion ${more} than <strong>${esc(o.name)}</strong> ($${o.gdp[5].toFixed(2)} trillion). ` +
        `${esc(sel.name)} has ${fmtInt(sel.population)} million people against ${fmtInt(o.population)} million in ${esc(o.name)}.</div>`;
    })() : '';
  const options = COUNTRIES.map((c) =>
    `<option value="${c.code}"${state.compareCode === c.code ? ' selected' : ''}>${esc(c.name)}</option>`).join('');
  return `
  <div class="page-head">
    <div><h1>Regions — the world, layer by layer</h1>
    <p class="dek">Switch layers to recolour the map and the ranking. Click a country marker — or a
    continent — to inspect it. Regional totals are calculated from the ten country figures.</p></div>
    <div><button class="btn amber" id="export-csv">Export Regional CSV</button></div>
  </div>
  <div class="pills" style="margin-bottom:12px" role="tablist" aria-label="Map layer">${tabs}</div>
  <div class="grid-2">
    <section class="panel">
      <h2>World Map — ${esc(layer.label)}</h2>
      <p class="panel-sub">Equirectangular projection — simplified continent outlines. Active layer: ${esc(layer.label)} (click any country to inspect).</p>
      <div class="map-wrap" id="world-map">${worldMap(state.mapLayer, state.selectedCode)}</div>
      <p class="src">Sources: IMF WEO October 2026 (GDP); World Bank WDI 2025 (population, GDP per capita); UNDP HDR 2025 (HDI, 2023). Marker labels show the active layer value.</p>
    </section>
    <div>
      <section class="panel">
        <div class="detail-name">${esc(sel.name)}</div>
        <div class="detail-region">${esc(sel.region)} · Population ${fmtInt(sel.population)} million (2025)</div>
        <div class="stat-grid">
          <div class="stat-cell"><div class="s-val">$${sel.gdp[5].toFixed(2)}tn</div><div class="s-lab">GDP (2025)</div></div>
          <div class="stat-cell"><div class="s-val">$${fmtInt(sel.gdpPerCapita)}</div><div class="s-lab">GDP per capita (2025)</div></div>
          <div class="stat-cell"><div class="s-val">${sel.hdi.toFixed(3)}</div><div class="s-lab">HDI (2023)</div></div>
          <div class="stat-cell"><div class="s-val">${sel.unemployment.toFixed(1)}%</div><div class="s-lab">Unemployment (2025)</div></div>
        </div>
        <h3 style="margin-top:12px">Region Ranking — ${esc(layer.label)}</h3>
        ${ranking}
        <div class="compare-box"><label for="compare-select"><strong>Compare country:</strong></label>
        <select id="compare-select"><option value="">Choose a country…</option>${options}</select></div>
        ${compare}
      </section>
    </div>
  </div>
  <section class="panel">
    <h2>Benchmark Countries — Sortable Comparison (2025)</h2>
    <p class="panel-sub">Click any column header to sort. All figures 2025 except HDI (2023).</p>
    ${rankingsTable(state, 'benchmark')}
  </section>`;
}

// ---------------- Data Tables (Archive) ----------------
export function viewArchive(state) {
  const all = buildArchive();
  const q = state.archiveQuery.trim().toLowerCase();
  const rows = q ? all.filter((r) =>
    (r.country + ' ' + r.indicator + ' ' + r.value + ' ' + r.year + ' ' + r.source).toLowerCase().includes(q)) : all;
  const body = rows.map((r) => `<tr><td>${esc(r.country)}</td><td>${esc(r.indicator)}</td>
    <td class="num">${esc(r.value)}</td><td class="num">${r.year}</td><td>${esc(r.source)}</td></tr>`).join('');
  return `
  <div class="page-head">
    <div><h1>Data Tables — the full archive</h1>
    <p class="dek">Every figure on this site, in one searchable table: world aggregates, six years of
    GDP for each of the ten countries, and six further indicators per country.</p></div>
    <div class="edition-label"><strong>124 figures</strong>4 world · 60 GDP series · 60 indicators</div>
  </div>
  <section class="panel">
    <div class="archive-tools">
      <input id="archive-search" type="search" placeholder="Search the archive — try “Japan” or “HDI”…" value="${esc(state.archiveQuery)}" aria-label="Search the archive">
      <span id="archive-count">${rows.length} of 124 figures shown</span>
    </div>
    <div style="overflow-x:auto"><table><thead><tr><th>Country</th><th>Indicator</th><th class="num">Value</th><th class="num">Year</th><th>Source</th></tr></thead>
    <tbody id="archive-body">${body}</tbody></table></div>
  </section>`;
}

// ---------------- Sources ----------------
export function viewSources() {
  const items = [
    { pub: 'IMF — World Economic Outlook, October 2026', use: 'Nominal GDP 2020–2025, inflation and unemployment for the ten countries; world GDP of $118.50 trillion.' },
    { pub: 'World Bank — World Development Indicators, July 2026', use: 'Population and GDP per capita for the ten countries; world population of 8,215.43 million and world GDP per capita of $14,406.' },
    { pub: 'UNDP — Human Development Report 2025', use: 'Human Development Index and life expectancy, 2023; world HDI of 0.756.' },
    { pub: 'UN — World Population Prospects 2024 (medium variant)', use: 'World age structure, median age and dependency ratios; the 2025 pyramid is a projection.' },
  ];
  return `
  <div class="page-head">
    <div><h1>Sources</h1>
    <p class="dek">Every number on this site comes from one of four official publications below.
    Regional totals, shares and growth rates are calculated from those country figures and are
    labelled “calculated” wherever they appear.</p></div>
  </div>
  <section class="panel"><ul class="source-list">
    ${items.map((s) => `<li><div class="s-pub">${esc(s.pub)}</div><div class="s-use">${esc(s.use)}</div></li>`).join('')}
  </ul></section>`;
}
