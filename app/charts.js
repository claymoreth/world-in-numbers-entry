// charts.js — hand-built SVG charts. No libraries, no network.
// All values come from data.js; nothing is drawn from invented numbers.

import { YEARS, CONTINENTS, COUNTRIES, layerValue, LAYERS } from './data.js';

const TEAL = '#0f3d3e';
const AMBER = '#e8a317';
const BLUE = '#2f6f8f';
const GRID = '#d8e2df';
const MUTED = '#5c6f72';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// --- Line chart: years on x, values on y, with honest point annotations. ---
export function lineChart({ values, color = TEAL, label, annotations = [] }) {
  const W = 720, H = 228, PL = 56, PR = 18, PT = 18, PB = 34;
  const min = Math.min(...values) * 0.92;
  const max = Math.max(...values) * 1.04;
  const x = (i) => PL + (i * (W - PL - PR)) / (values.length - 1);
  const y = (v) => PT + ((max - v) / (max - min)) * (H - PT - PB);
  let grid = '';
  for (let g = 0; g <= 4; g++) {
    const v = min + ((max - min) * g) / 4;
    const gy = y(v);
    grid += `<line x1="${PL}" y1="${gy}" x2="${W - PR}" y2="${gy}" stroke="${GRID}" stroke-width="1"/>` +
      `<text x="${PL - 8}" y="${gy + 4}" text-anchor="end" font-size="11" fill="${MUTED}">$${v.toFixed(0)}tn</text>`;
  }
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${PL},${H - PB} ${pts} ${x(values.length - 1).toFixed(1)},${H - PB}`;
  let dots = '';
  values.forEach((v, i) => {
    dots += `<circle cx="${x(i)}" cy="${y(v)}" r="4.5" fill="${color}" stroke="#fff" stroke-width="1.5"/>` +
      `<text x="${x(i)}" y="${H - 12}" text-anchor="middle" font-size="11.5" fill="${MUTED}">${YEARS[i]}</text>`;
  });
  let notes = '';
  for (const a of annotations) {
    const ax = x(a.yearIndex), ay = y(values[a.yearIndex]);
    const tx = Math.min(Math.max(ax - 70, PL), W - PR - 170);
    notes += `<g><line x1="${ax}" y1="${ay - 8}" x2="${ax}" y2="${ay - 26}" stroke="${AMBER}" stroke-width="1.5"/>` +
      `<text x="${tx}" y="${ay - 32}" font-size="12" font-weight="700" fill="${TEAL}">${esc(a.text)}</text></g>`;
  }
  const last = values[values.length - 1];
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(label)} line chart, 2020 to 2025, last value $${last.toFixed(2)} trillion">
    ${grid}
    <polygon points="${area}" fill="${color}" opacity="0.08"/>
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}${notes}
    <text x="${x(values.length - 1)}" y="${y(last) - 14}" text-anchor="end" font-size="13" font-weight="800" fill="${TEAL}">2025: $${last.toFixed(2)}tn</text>
  </svg>`;
}

// --- Sparkline: tiny area chart for KPI cards with a verified series. ---
export function sparkline(values, color = TEAL) {
  const W = 150, H = 26;
  const min = Math.min(...values), max = Math.max(...values);
  const x = (i) => (i * W) / (values.length - 1);
  const y = (v) => 3 + ((max - v) / (max - min || 1)) * (H - 6);
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" width="150" height="${H}" aria-hidden="true">
    <polygon points="0,${H} ${pts} ${W},${H}" fill="${color}" opacity="0.12"/>
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2"/>
  </svg>`;
}

// --- Population pyramid: male bars left, age band centre, female bars right. ---
// Bands arrive youngest-first; the chart draws oldest on top.
export function pyramid(bands, yearLabel) {
  const W = 640, H = 460, CX = 320, MAXV = 380, ROW_H = 20, TOP = 26;
  const scale = (CX - 62) / MAXV;
  let rows = '';
  const ordered = [...bands].reverse();
  ordered.forEach((b, i) => {
    const y = TOP + i * ROW_H;
    const mw = Math.max(b.m * scale, b.m > 0 ? 1 : 0);
    const fw = Math.max(b.f * scale, b.f > 0 ? 1 : 0);
    // Value labels sit outside the bar ends only when the bar is wide enough
    // to keep them clear of the centre age label; narrow bars print both
    // values inside the centre column instead, so nothing ever overlaps.
    const mLabel = mw > 42 ? `<text x="${(CX - mw - 5).toFixed(1)}" y="${y + 13}" text-anchor="end" font-size="10.5" fill="${TEAL}">${b.m.toFixed(1)}</text>` : '';
    const fLabel = fw > 42 ? `<text x="${(CX + fw + 5).toFixed(1)}" y="${y + 13}" font-size="10.5" fill="#8a6d00">${b.f.toFixed(1)}</text>` : '';
    const centre = (mw > 42 && fw > 42) ? esc(b.band) : `${esc(b.band)} · ${b.m.toFixed(1)}/${b.f.toFixed(1)}`;
    rows += `<rect x="${(CX - mw).toFixed(1)}" y="${y}" width="${mw.toFixed(1)}" height="17" fill="${TEAL}"/>` +
      `<rect x="${CX}" y="${y}" width="${fw.toFixed(1)}" height="17" fill="${AMBER}"/>` +
      `<text x="${CX}" y="${y + 13}" text-anchor="middle" font-size="10.5" fill="${MUTED}">${centre}</text>` +
      mLabel + fLabel;
  });
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Age-sex population pyramid, ${yearLabel}, values in millions">
    <text x="${CX - 130}" y="14" text-anchor="middle" font-size="12" font-weight="700" fill="${TEAL}">Male</text>
    <text x="${CX}" y="14" text-anchor="middle" font-size="12" font-weight="700" fill="${TEAL}">Age</text>
    <text x="${CX + 130}" y="14" text-anchor="middle" font-size="12" font-weight="700" fill="${TEAL}">Female</text>
    <line x1="${CX}" y1="20" x2="${CX}" y2="${TOP + ordered.length * ROW_H}" stroke="${GRID}" stroke-width="1"/>
    ${rows}
    <text x="${CX}" y="${H - 6}" text-anchor="middle" font-size="11" fill="${MUTED}">Millions of people per band — ${esc(yearLabel)}</text>
  </svg>`;
}

// --- World map: equirectangular projection, lon -180..180, lat -60..85. ---
export function project(lon, lat, W = 1000, H = 470) {
  const x = ((lon + 180) / 360) * W;
  const y = ((85 - lat) / 145) * H;
  return [x, y];
}

// Colour ramp for a layer value between min and max: pale teal -> deep teal -> amber.
// Guard: a null value (e.g. Rest of world on non-GDP layers) gets a neutral grey.
export function layerColor(v, min, max) {
  if (v === null || v === undefined || max === min) return '#9db8b4';
  const t = (v - min) / (max - min);
  const stops = [[217, 235, 230], [15, 61, 62], [232, 163, 23]];
  const seg = t < 0.5 ? 0 : 1;
  const f = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5;
  const a = stops[seg], b = stops[seg + 1];
  const mix = a.map((v0, i) => Math.round(v0 + (b[i] - v0) * f));
  return `rgb(${mix[0]},${mix[1]},${mix[2]})`;
}

export function worldMap(layerKey, selectedCode) {
  const W = 1000, H = 470;
  const vals = COUNTRIES.map((c) => layerValue(layerKey, c));
  const min = Math.min(...vals), max = Math.max(...vals);
  const layer = LAYERS.find((l) => l.key === layerKey);
  let polys = '';
  for (const cont of CONTINENTS) {
    const pts = cont.pts.map(([lo, la]) => project(lo, la, W, H).map((n) => n.toFixed(1)).join(',')).join(' ');
    // Continent fill reflects its region's layer value where a region figure exists.
    let fill = '#cfe0dc';
    const regionCountries = COUNTRIES.filter((c) => c.region === cont.region);
    if (regionCountries.length) {
      const rv = regionCountries.reduce((s, c) => s + layerValue(layerKey, c), 0) / regionCountries.length;
      fill = layerColor(rv, min, max);
    }
    polys += `<polygon points="${pts}" fill="${fill}" stroke="#ffffff" stroke-width="1.5" data-region="${esc(cont.region)}" opacity="0.92">
      <title>${esc(cont.name)} — ${esc(cont.region)}</title></polygon>`;
  }
  let markers = '';
  // Per-country label offsets keep the crowded European labels apart.
  const offsets = { GBR: [-82, -10], DEU: [11, -16], FRA: [-76, 18], ITA: [12, 20],
    USA: [11, 4], CAN: [11, -14], CHN: [11, -4], JPN: [11, 4], IND: [11, 4], BRA: [11, 4] };
  for (const c of COUNTRIES) {
    const [mx, my] = project(c.lon, c.lat, W, H);
    const v = layerValue(layerKey, c);
    const sel = c.code === selectedCode;
    const [dx, dy] = offsets[c.code] || [11, 4];
    const anchor = dx < 0 ? 'end' : 'start';
    markers += `<g class="marker" data-country="${c.code}" tabindex="0" role="button" aria-label="${esc(c.name)}: ${esc(layer.fmt(c))}">
      <circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="${sel ? 9 : 6.5}" fill="${layerColor(v, min, max)}" stroke="${sel ? AMBER : '#fff'}" stroke-width="${sel ? 3 : 1.5}"/>
      <text x="${(mx + dx).toFixed(1)}" y="${(my + dy).toFixed(1)}" text-anchor="${anchor}" font-size="12.5" font-weight="700" fill="${TEAL}" style="paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round">${c.code} ${esc(layer.fmt(c))}</text>
    </g>`;
  }
  return `<svg class="map-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Simplified world map, active layer ${esc(layer.label)}">
    <rect x="0" y="0" width="${W}" height="${H}" fill="#eef4f2"/>
    ${polys}${markers}
  </svg>
  <div class="map-legend"><span>Low</span><span class="gradient-bar"></span><span>High</span>
  <span>${esc(layer.label)} range: ${esc(layer.fmt(COUNTRIES.reduce((a, b) => (layerValue(layerKey, a) <= layerValue(layerKey, b) ? a : b))))} – ${esc(layer.fmt(COUNTRIES.reduce((a, b) => (layerValue(layerKey, a) >= layerValue(layerKey, b) ? a : b))))}</span></div>`;
}

// --- Horizontal bar row (regions, rankings). ---
export function barRow(label, valueText, pct, amber = false, sub = '') {
  const w = Math.max(0, Math.min(100, pct));
  return `<div class="bar-row"><span>${esc(label)}</span>
    <span><span class="bar-track" style="display:block"><span class="bar-fill${amber ? ' amber' : ''}" style="display:block;width:${w.toFixed(1)}%"></span></span>
    ${sub ? `<span class="bar-sub">${esc(sub)}</span>` : ''}</span>
    <span class="bar-val">${esc(valueText)}</span></div>`;
}
