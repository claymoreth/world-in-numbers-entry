// THE WORLD IN NUMBERS — the only file that holds figures.
// Every number below was verified live on 26 November 2026 against the
// source named beside it. Nothing here is estimated, rounded from memory,
// or filled in to complete a row: a figure with no verified source is
// written as null and the site shows "n/a" for it.
//
// Sources used, each with its year:
//   IMF WEO Oct 2026 — nominal GDP (current US$), inflation, unemployment
//   World Bank WDI   — population, GDP per capita, world aggregates
//   UNDP HDR 2025    — Human Development Index and life expectancy (2023)

export const WORLD = {
  gdpTn: 118.5,
  gdpSource: "IMF, World Economic Outlook, October 2026",
  gdpYear: 2025,
  populationM: 8215.43,
  populationSource: "World Bank, World Development Indicators, July 2026",
  populationYear: 2025,
  gdpPerCapita: 14406,
  gdpPerCapitaSource: "World Bank, World Development Indicators",
  gdpPerCapitaYear: 2025,
  hdi: 0.756,
  hdiSource: "UNDP, Human Development Report 2025",
  hdiYear: 2023,
};

// Nominal GDP series, trillion current US$, IMF WEO October 2026
// (via Wikipedia, "List of countries by past and projected GDP (nominal)").
// 2025 is the IMF October 2026 vintage for every country: one vintage,
// never mixed.
export const COUNTRIES = [
  {
    code: "USA",
    name: "United States",
    region: "North America",
    gdp: { 2020: 21.38, 2021: 23.75, 2022: 26.06, 2023: 27.83, 2024: 29.38, 2025: 30.86 },
    gdpPerCapita: 90027,
    populationM: 341.79,
    inflation: 2.7,
    unemployment: 4.3,
    hdi: 0.938,
    lifeExpectancy: 79.3,
  },
  {
    code: "CHN",
    name: "China",
    region: "East Asia",
    gdp: { 2020: 15.0, 2021: 18.19, 2022: 18.35, 2023: 18.37, 2024: 18.93, 2025: 19.63 },
    gdpPerCapita: 13862,
    populationM: 1406.59,
    inflation: 0.0,
    unemployment: 5.1,
    hdi: 0.797,
    lifeExpectancy: 77.95,
  },
  {
    code: "DEU",
    name: "Germany",
    region: "Europe",
    gdp: { 2020: 3.97, 2021: 4.39, 2022: 4.23, 2023: 4.6, 2024: 4.75, 2025: 5.12 },
    gdpPerCapita: 60496,
    populationM: 83.49,
    inflation: 2.3,
    unemployment: 3.8,
    hdi: 0.959,
    lifeExpectancy: 81.4,
  },
  {
    code: "JPN",
    name: "Japan",
    region: "East Asia",
    gdp: { 2020: 5.19, 2021: 5.23, 2022: 4.44, 2023: 4.39, 2024: 4.21, 2025: 4.45 },
    gdpPerCapita: 35951,
    populationM: 123.37,
    inflation: 3.2,
    unemployment: 2.5,
    hdi: 0.925,
    lifeExpectancy: 84.7,
  },
  {
    code: "GBR",
    name: "United Kingdom",
    region: "Europe",
    gdp: { 2020: 2.73, 2021: 3.21, 2022: 3.2, 2023: 3.44, 2024: 3.71, 2025: 4.01 },
    gdpPerCapita: 57602,
    populationM: 69.49,
    inflation: 3.4,
    unemployment: 4.9,
    hdi: 0.946,
    lifeExpectancy: 81.3,
  },
  {
    code: "IND",
    name: "India",
    region: "South Asia",
    gdp: { 2020: 2.62, 2021: 3.09, 2022: 3.26, 2023: 3.51, 2024: 3.76, 2025: 3.91 },
    gdpPerCapita: 2702,
    populationM: 1463.87,
    inflation: 2.4,
    unemployment: 4.2,
    hdi: 0.685,
    lifeExpectancy: 72.0,
  },
  {
    code: "FRA",
    name: "France",
    region: "Europe",
    gdp: { 2020: 2.65, 2021: 2.97, 2022: 2.8, 2023: 3.07, 2024: 3.18, 2025: 3.38 },
    gdpPerCapita: 48986,
    populationM: 68.72,
    inflation: 0.9,
    unemployment: 7.7,
    hdi: 0.92,
    lifeExpectancy: 83.3,
  },
  {
    code: "ITA",
    name: "Italy",
    region: "Europe",
    gdp: { 2020: 1.91, 2021: 2.18, 2022: 2.11, 2023: 2.32, 2024: 2.38, 2025: 2.55 },
    gdpPerCapita: 43309,
    populationM: 58.92,
    inflation: 1.6,
    unemployment: 6.1,
    hdi: 0.915,
    lifeExpectancy: 83.7,
  },
  {
    code: "CAN",
    name: "Canada",
    region: "North America",
    gdp: { 2020: 1.66, 2021: 2.02, 2022: 2.2, 2023: 2.2, 2024: 2.27, 2025: 2.32 },
    gdpPerCapita: 55698,
    populationM: 41.65,
    inflation: 2.1,
    unemployment: 6.9,
    hdi: 0.939,
    lifeExpectancy: 82.6,
  },
  {
    code: "BRA",
    name: "Brazil",
    region: "South America",
    gdp: { 2020: 1.48, 2021: 1.67, 2022: 1.95, 2023: 2.19, 2024: 2.19, 2025: 2.28 },
    gdpPerCapita: 10713,
    populationM: 212.81,
    inflation: 5.0,
    unemployment: 6.0,
    hdi: 0.786,
    lifeExpectancy: 75.85,
  },
];

// Per-indicator source lines, shown under every chart and in the Archive.
export const SOURCES = {
  gdp: "IMF, World Economic Outlook, October 2026 — nominal GDP, current US$",
  gdpPerCapita: "World Bank, World Development Indicators — GDP per capita, current US$, 2025",
  population: "World Bank, World Development Indicators — population, midyear estimate, 2025",
  inflation: "IMF, World Economic Outlook, October 2026 — consumer prices, annual average, 2025",
  unemployment: "IMF, World Economic Outlook, October 2026 — unemployment rate, 2025",
  hdi: "UNDP, Human Development Report 2025, Table 1 — Human Development Index, 2023",
  lifeExpectancy:
    "UNDP, Human Development Report 2025, Table 1 — life expectancy at birth, 2023; China, India and Brazil: World Bank, World Development Indicators, 2023",
};

export const YEARS = [2020, 2021, 2022, 2023, 2024, 2025];

export const INDICATORS = [
  { key: "gdp", label: "GDP", unit: "$tn", decimals: 2 },
  { key: "gdpPerCapita", label: "GDP per capita", unit: "$", decimals: 0 },
  { key: "populationM", label: "Population", unit: "m", decimals: 2 },
  { key: "inflation", label: "Inflation", unit: "%", decimals: 1 },
  { key: "unemployment", label: "Unemployment", unit: "%", decimals: 1 },
  { key: "hdi", label: "HDI", unit: "", decimals: 3 },
  { key: "lifeExpectancy", label: "Life expectancy", unit: "yrs", decimals: 1 },
];

export function gdpOf(country, year) {
  return country.gdp[year] ?? null;
}

export function top10GdpShare(year) {
  const sum = COUNTRIES.reduce((acc, c) => acc + (c.gdp[year] ?? 0), 0);
  return { total: sum, share: (sum / WORLD.gdpTn) * 100 };
}

export function formatNumber(value, decimals) {
  if (value === null || value === undefined) return "n/a";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
