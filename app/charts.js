// Hand-drawn SVG charts. No chart library, no canvas, no network:
// every chart is an SVG string built from the numbers in data.js.

const TEAL = "#0f3d3e";
const TEAL_LIGHT = "#1d6a6b";
const AMBER = "#e8a317";
const AMBER_DARK = "#b97f0a";
const INK = "#12211f";
const MUTED = "#5c6f6d";
const GRID = "#d8e2e0";
const TRACK = "#e9efee";

function escapeText(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Horizontal bars, largest first. `rows` is [{ label, value, note }].
// `format` turns a value into the text shown at the end of its bar.
export function barChart(rows, format, options = {}) {
  const width = options.width ?? 760;
  const rowHeight = options.rowHeight ?? 34;
  const labelWidth = options.labelWidth ?? 150;
  const valueWidth = options.valueWidth ?? 92;
  const max = Math.max(...rows.map((r) => r.value), 0.0001);
  const barArea = width - labelWidth - valueWidth - 8;
  const height = rows.length * rowHeight + 8;
  const highlight = options.highlight ?? null;

  const parts = [];
  parts.push(
    `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="${escapeText(
      options.ariaLabel ?? "Bar chart",
    )}">`,
  );
  rows.forEach((row, i) => {
    const y = 8 + i * rowHeight;
    const barY = y + 7;
    const barH = 16;
    const w = Math.max(2, (row.value / max) * barArea);
    const isTop = highlight !== null && i === highlight;
    const fill = isTop ? AMBER : i % 2 === 0 ? TEAL : TEAL_LIGHT;
    parts.push(
      `<text x="0" y="${y + 19}" font-size="13" fill="${INK}" font-weight="${isTop ? 700 : 400}">${escapeText(row.label)}</text>`,
    );
    parts.push(
      `<rect x="${labelWidth}" y="${barY}" width="${barArea}" height="${barH}" rx="3" fill="${TRACK}"/>`,
    );
    parts.push(
      `<rect x="${labelWidth}" y="${barY}" width="${w.toFixed(1)}" height="${barH}" rx="3" fill="${fill}"/>`,
    );
    parts.push(
      `<text x="${labelWidth + barArea + 8}" y="${y + 19}" font-size="13" fill="${INK}" font-weight="600">${escapeText(
        format(row.value),
      )}</text>`,
    );
    if (row.note) {
      parts.push(
        `<text x="${labelWidth + barArea + 8}" y="${y + 19}" font-size="11" fill="${MUTED}"></text>`,
      );
    }
  });
  parts.push("</svg>");
  return parts.join("");
}

// One line per series over the same years. `series` is
// [{ label, color, values: [v, ...] }] aligned with `years`.
export function lineChart(series, years, format, options = {}) {
  const width = options.width ?? 760;
  const height = options.height ?? 300;
  const padL = 64;
  const padR = 16;
  const padT = 18;
  const padB = 34;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const all = series.flatMap((s) => s.values);
  const max = Math.max(...all, 0.0001);
  const min = 0;
  const x = (i) => padL + (i / (years.length - 1)) * plotW;
  const y = (v) => padT + plotH - ((v - min) / (max - min)) * plotH;

  const parts = [];
  parts.push(
    `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="${escapeText(
      options.ariaLabel ?? "Line chart",
    )}">`,
  );
  // Gridlines with value labels: 0, half, max.
  [0, 0.5, 1].forEach((f) => {
    const gy = padT + plotH - f * plotH;
    const gv = min + f * (max - min);
    parts.push(
      `<line x1="${padL}" y1="${gy}" x2="${width - padR}" y2="${gy}" stroke="${GRID}" stroke-width="1"/>`,
    );
    parts.push(
      `<text x="${padL - 8}" y="${gy + 4}" font-size="11" fill="${MUTED}" text-anchor="end">${escapeText(
        format(gv),
      )}</text>`,
    );
  });
  years.forEach((yr, i) => {
    parts.push(
      `<text x="${x(i)}" y="${height - 10}" font-size="11" fill="${MUTED}" text-anchor="middle">${yr}</text>`,
    );
  });
  series.forEach((s) => {
    const points = s.values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    parts.push(
      `<polyline points="${points}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`,
    );
    s.values.forEach((v, i) => {
      parts.push(
        `<circle cx="${x(i)}" cy="${y(v)}" r="3.5" fill="${s.color}"><title>${escapeText(
          s.label,
        )} ${years[i]}: ${escapeText(format(v))}</title></circle>`,
      );
    });
  });
  parts.push("</svg>");
  return parts.join("");
}

export const PALETTE = { TEAL, TEAL_LIGHT, AMBER, AMBER_DARK, INK, MUTED, GRID, TRACK };
