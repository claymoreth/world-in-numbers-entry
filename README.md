[![make.fun bounty](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![make.fun rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/claymoreth/world-in-numbers-entry/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![make.fun reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/claymoreth/world-in-numbers-entry/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

# The World in Numbers

The ten largest economies on Earth, compared side by side on the figures that matter: output, income, people, prices, work and wellbeing. An original static site — no framework, no network requests, no tracking.

## What it is

Five pages, one hash router:

- **Home** — eight world headlines (world GDP $118.50tn, world population 8.22bn, world GDP per capita $14,406, the top 10's 66.3% share of world GDP, and more), a GDP bar chart with a 2020–2025 year picker, a 2020–2025 trend line for the top three economies, and a top-five table.
- **Countries** — all ten economies on one comparison table, plus a GDP-per-capita bar chart.
- **Rankings** — the showpiece: click any column heading to re-sort all ten countries by GDP, GDP per capita, population, inflation, unemployment or HDI, in either direction.
- **People** — population, Human Development Index and life expectancy per country, with bar charts.
- **Archive** — every figure on the site (124 rows) with its source and year, with a live search box.

## Where the numbers come from

Every figure was verified live on 26 November 2026, from one vintage per indicator so years compare like with like:

- **Nominal GDP 2020–2025** — IMF, World Economic Outlook, October 2026 (USA $30.86tn, China $19.63tn, Germany $5.12tn, Japan $4.45tn, United Kingdom $4.01tn, India $3.91tn, France $3.38tn, Italy $2.55tn, Canada $2.32tn, Brazil $2.28tn in 2025).
- **Population and GDP per capita, 2025** — World Bank, World Development Indicators.
- **Inflation and unemployment, 2025** — IMF, World Economic Outlook, October 2026.
- **Human Development Index and life expectancy, 2023** — UNDP, Human Development Report 2025.

Where a figure could not be verified from an official source it is not shown at all.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Hand it in (outside the grader, `MAKEFUN_OUTPUT_DIR` stands in for `/output`):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Files

- `app/index.html`, `app/style.css` — shell and the dark-teal/amber design.
- `app/data.js` — the only file that holds figures, with the source of each.
- `app/charts.js` — hand-drawn SVG bar and line charts.
- `app/views.js` — the five page renderers.
- `app/main.js` — router, the one global state object, and every control's wiring.
- `screenshots/` — four renders of the site itself (desktop home, desktop rankings, desktop archive, phone home).

## License

MIT — see `LICENSE`.
