// data.js — the ONLY source of numbers for "The World in Numbers".
// Every figure comes from the DATA SPEC (IMF WEO Oct 2026, World Bank WDI
// Jul 2026, UNDP HDR 2025, UN WPP 2024). Nothing here is invented.
// Figures marked "calculated" are arithmetic on the verified figures below.

export const YEARS = [2020, 2021, 2022, 2023, 2024, 2025];

export const WORLD = {
  gdp: { value: 118.5, label: '$118.50tn', year: 2025, source: 'IMF WEO, October 2026' },
  population: { value: 8215.43, label: '8.22bn', year: 2025, source: 'World Bank WDI, 2025' },
  gdpPerCapita: { value: 14406, label: '$14,406', year: 2025, source: 'World Bank WDI, 2025' },
  hdi: { value: 0.756, label: '0.756', year: 2023, source: 'UNDP, Human Development Report 2025' },
};

// GDP series in $ trillion, nominal, IMF WEO October 2026, 2020-2025.
export const COUNTRIES = [
  { code: 'USA', name: 'United States', region: 'North America', lon: -100, lat: 40,
    gdp: [21.38, 23.75, 26.06, 27.83, 29.38, 30.86], gdpPerCapita: 90027, population: 341.79,
    inflation: 2.7, unemployment: 4.3, hdi: 0.938, lifeExpectancy: 79.3 },
  { code: 'CHN', name: 'China', region: 'Asia', lon: 104, lat: 35,
    gdp: [15.00, 18.19, 18.35, 18.37, 18.93, 19.63], gdpPerCapita: 13862, population: 1406.59,
    inflation: 0.0, unemployment: 5.1, hdi: 0.797, lifeExpectancy: 77.95 },
  { code: 'DEU', name: 'Germany', region: 'Europe', lon: 10, lat: 51,
    gdp: [3.97, 4.39, 4.23, 4.60, 4.75, 5.12], gdpPerCapita: 60496, population: 83.49,
    inflation: 2.3, unemployment: 3.8, hdi: 0.959, lifeExpectancy: 81.4 },
  { code: 'JPN', name: 'Japan', region: 'Asia', lon: 138, lat: 38,
    gdp: [5.19, 5.23, 4.44, 4.39, 4.21, 4.45], gdpPerCapita: 35951, population: 123.37,
    inflation: 3.2, unemployment: 2.5, hdi: 0.925, lifeExpectancy: 84.7 },
  { code: 'GBR', name: 'United Kingdom', region: 'Europe', lon: -1, lat: 54,
    gdp: [2.73, 3.21, 3.20, 3.44, 3.71, 4.01], gdpPerCapita: 57602, population: 69.49,
    inflation: 3.4, unemployment: 4.9, hdi: 0.946, lifeExpectancy: 81.3 },
  { code: 'IND', name: 'India', region: 'Asia', lon: 79, lat: 22,
    gdp: [2.62, 3.09, 3.26, 3.51, 3.76, 3.91], gdpPerCapita: 2702, population: 1463.87,
    inflation: 2.4, unemployment: 4.2, hdi: 0.685, lifeExpectancy: 72.0 },
  { code: 'FRA', name: 'France', region: 'Europe', lon: 2, lat: 47,
    gdp: [2.65, 2.97, 2.80, 3.07, 3.18, 3.38], gdpPerCapita: 48986, population: 68.72,
    inflation: 0.9, unemployment: 7.7, hdi: 0.920, lifeExpectancy: 83.3 },
  { code: 'ITA', name: 'Italy', region: 'Europe', lon: 13, lat: 42,
    gdp: [1.91, 2.18, 2.11, 2.32, 2.38, 2.55], gdpPerCapita: 43309, population: 58.92,
    inflation: 1.6, unemployment: 6.1, hdi: 0.915, lifeExpectancy: 83.7 },
  { code: 'CAN', name: 'Canada', region: 'North America', lon: -106, lat: 56,
    gdp: [1.66, 2.02, 2.20, 2.20, 2.27, 2.32], gdpPerCapita: 55698, population: 41.65,
    inflation: 2.1, unemployment: 6.9, hdi: 0.939, lifeExpectancy: 82.6 },
  { code: 'BRA', name: 'Brazil', region: 'South America', lon: -52, lat: -10,
    gdp: [1.48, 1.67, 1.95, 2.19, 2.19, 2.28], gdpPerCapita: 10713, population: 212.81,
    inflation: 5.0, unemployment: 6.0, hdi: 0.786, lifeExpectancy: 75.85 },
];

// Top-10 GDP total, $ trillion (calculated from the series above).
export const TOP10_TOTAL = [58.59, 66.70, 68.60, 71.92, 74.76, 78.51];
export const TOP10_SHARE = 66.3; // % of world GDP, calculated

// Regions — calculated from the verified figures above; labelled calculated.
export const REGIONS = [
  { name: 'North America', gdp: 33.18, share: 28.0, population: 383.44, gdpPerCapita: 86531, growth: 4.8, hdi: 0.938 },
  { name: 'Europe', gdp: 15.06, share: 12.7, population: 280.62, gdpPerCapita: 53665, growth: 7.4, hdi: 0.937 },
  { name: 'Asia', gdp: 27.99, share: 23.6, population: 2993.83, gdpPerCapita: 9350, growth: 4.1, hdi: 0.748 },
  { name: 'South America', gdp: 2.28, share: 1.9, population: 212.81, gdpPerCapita: 10713, growth: 4.1, hdi: 0.786 },
  { name: 'Rest of world', gdp: 39.99, share: 33.7, population: null, gdpPerCapita: null, growth: null, hdi: null },
];

// Demographics — UN World Population Prospects 2024 (medium variant).
// 2025 is a projection. Bands are millions, youngest first.
export const PYRAMID_2025 = [
  { band: '0–4', m: 330.0, f: 314.0 }, { band: '5–9', m: 348.0, f: 329.0 },
  { band: '10–14', m: 355.0, f: 333.0 }, { band: '15–19', m: 340.0, f: 319.0 },
  { band: '20–24', m: 321.0, f: 303.0 }, { band: '25–29', m: 310.0, f: 292.0 },
  { band: '30–34', m: 308.0, f: 292.0 }, { band: '35–39', m: 307.0, f: 293.0 },
  { band: '40–44', m: 276.0, f: 268.0 }, { band: '45–49', m: 243.0, f: 240.0 },
  { band: '50–54', m: 231.0, f: 232.0 }, { band: '55–59', m: 210.0, f: 215.0 },
  { band: '60–64', m: 178.0, f: 188.0 }, { band: '65–69', m: 139.0, f: 155.0 },
  { band: '70–74', m: 108.0, f: 128.0 }, { band: '75–79', m: 69.6, f: 88.6 },
  { band: '80–84', m: 38.0, f: 53.8 }, { band: '85–89', m: 19.0, f: 32.2 },
  { band: '90–94', m: 6.3, f: 13.6 }, { band: '95–99', m: 1.2, f: 3.6 },
  { band: '100+', m: 0.1, f: 0.5 },
];
export const PYRAMID_1950 = [
  { band: '0–4', m: 175.0, f: 168.0 }, { band: '5–9', m: 136.0, f: 131.0 },
  { band: '10–14', m: 132.0, f: 126.0 }, { band: '15–19', m: 120.0, f: 116.0 },
  { band: '20–24', m: 111.0, f: 109.0 }, { band: '25–29', m: 95.8, f: 97.5 },
  { band: '30–34', m: 80.8, f: 82.1 }, { band: '35–39', m: 78.2, f: 80.4 },
  { band: '40–44', m: 70.9, f: 72.6 }, { band: '45–49', m: 61.4, f: 63.3 },
  { band: '50–54', m: 50.6, f: 53.4 }, { band: '55–59', m: 40.6, f: 44.2 },
  { band: '60–64', m: 32.9, f: 37.3 }, { band: '65–69', m: 23.8, f: 28.4 },
  { band: '70–74', m: 16.0, f: 20.0 }, { band: '75–79', m: 9.4, f: 12.6 },
  { band: '80–84', m: 4.3, f: 6.5 }, { band: '85–89', m: 1.5, f: 2.6 },
  { band: '90–94', m: 0.3, f: 0.7 }, { band: '95–99', m: 0.0, f: 0.1 },
  { band: '100+', m: 0.0, f: 0.0 },
];
export const DEMO_SUMMARY = {
  2025: { total: '8.23bn', medianAge: 30.9, under20: 32.4, age2064: 57.2, over65: 10.4, oldPer100: 18,
    age014: 24.4, age1564: 65.2, childDep: 37.4, oldDep: 16.0, note: '2025 (UN projection)' },
  1950: { total: '2.5bn', medianAge: 22.2, under20: 44.3, age2064: 50.6, over65: 5.1, oldPer100: 10,
    age014: null, age1564: null, childDep: null, oldDep: null, note: '1950' },
};
export const TRAJECTORY = [
  { year: 1950, medianAge: 22.2, under20: 44.3, age2064: 50.6, over65: 5.1, oldPer100: 10 },
  { year: 2000, medianAge: 25.1, under20: 39.7, age2064: 53.4, over65: 6.8, oldPer100: 13 },
  { year: 2025, medianAge: 30.9, under20: 32.4, age2064: 57.2, over65: 10.4, oldPer100: 18 },
];

// Official release calendar (real publications, no invented dates).
export const CALENDAR = [
  { publisher: 'IMF', title: 'World Economic Outlook', cadence: 'April and October editions' },
  { publisher: 'World Bank', title: 'World Development Indicators', cadence: 'July update' },
  { publisher: 'UNDP', title: 'Human Development Report', cadence: 'Annual edition' },
  { publisher: 'UN', title: 'World Population Prospects', cadence: '2024 revision (July 2024)' },
];

// World map — simplified continent outlines, equirectangular, lon -180..180, lat -60..85.
export const CONTINENTS = [
  { name: 'North America', region: 'North America', pts: [[-168,66],[-140,70],[-125,72],[-110,73],[-95,80],[-85,70],[-75,62],[-65,60],[-55,52],[-60,46],[-70,42],[-75,35],[-80,26],[-85,30],[-90,21],[-97,16],[-105,20],[-115,28],[-125,40],[-125,48],[-135,58],[-155,58],[-165,60]] },
  { name: 'South America', region: 'South America', pts: [[-80,10],[-75,5],[-60,8],[-50,0],[-35,-8],[-40,-20],[-48,-28],[-58,-38],[-65,-45],[-70,-54],[-73,-40],[-73,-25],[-80,-5],[-80,5]] },
  { name: 'Europe', region: 'Europe', pts: [[-10,36],[-9,43],[0,46],[-2,50],[5,53],[8,57],[12,56],[18,56],[21,60],[25,65],[30,70],[40,68],[45,60],[40,50],[35,45],[30,42],[28,38],[23,36],[19,40],[15,44],[10,44],[3,42]] },
  { name: 'Africa', region: 'Africa', pts: [[-17,15],[-10,30],[0,35],[10,37],[20,32],[32,31],[35,28],[43,12],[51,11],[48,0],[40,-10],[35,-20],[30,-30],[20,-35],[15,-27],[12,-18],[9,-2],[9,4],[-8,5],[-15,11]] },
  { name: 'Asia', region: 'Asia', pts: [[40,68],[50,70],[70,72],[90,75],[110,76],[130,72],[150,70],[170,66],[178,65],[170,60],[162,56],[158,50],[145,45],[140,38],[135,33],[130,30],[127,35],[122,38],[120,30],[115,22],[108,18],[105,10],[100,8],[95,15],[90,22],[85,20],[80,10],[77,8],[73,15],[68,23],[62,25],[58,26],[52,28],[48,30],[44,29],[40,35],[36,36],[35,42],[40,50],[45,55]] },
  { name: 'Oceania', region: 'Oceania', pts: [[113,-22],[114,-30],[115,-35],[124,-33],[130,-32],[135,-35],[140,-38],[147,-39],[150,-37],[153,-27],[146,-19],[142,-11],[137,-12],[132,-12],[126,-14],[122,-17],[118,-20]] },
];

export const LAYERS = [
  { key: 'gdp', label: 'GDP', unit: '$tn', fmt: (c) => '$' + c.gdp[5].toFixed(2) + 'tn' },
  { key: 'gdpPerCapita', label: 'GDP per capita', unit: '$', fmt: (c) => '$' + c.gdpPerCapita.toLocaleString('en-US') },
  { key: 'population', label: 'Population', unit: 'm', fmt: (c) => c.population.toLocaleString('en-US') + 'm' },
  { key: 'hdi', label: 'HDI', unit: '', fmt: (c) => c.hdi.toFixed(3) },
];
export function layerValue(layerKey, c) {
  if (layerKey === 'gdp') return c.gdp[5];
  return c[layerKey];
}
export function regionLayerValue(layerKey, r) {
  if (layerKey === 'gdp') return r.gdp;
  if (layerKey === 'gdpPerCapita') return r.gdpPerCapita;
  if (layerKey === 'population') return r.population;
  if (layerKey === 'hdi') return r.hdi;
  return null;
}

// Lookup helper used by the Regions detail panel and the compare box.
export function countryByCode(code) {
  return COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
}

// Archive: 4 world + 60 GDP-series + 60 other-indicator figures = 124 rows.
export function buildArchive() {
  const rows = [];
  rows.push({ country: 'World', indicator: 'GDP (nominal)', value: '$118.50 trillion', year: 2025, source: 'IMF, World Economic Outlook, October 2026' });
  rows.push({ country: 'World', indicator: 'Population', value: '8,215.43 million', year: 2025, source: 'World Bank, World Development Indicators, July 2026' });
  rows.push({ country: 'World', indicator: 'GDP per capita', value: '$14,406', year: 2025, source: 'World Bank, World Development Indicators' });
  rows.push({ country: 'World', indicator: 'Human Development Index (HDI)', value: '0.756', year: 2023, source: 'UNDP, Human Development Report 2025' });
  for (const c of COUNTRIES) {
    YEARS.forEach((y, i) => rows.push({
      country: c.name, indicator: 'GDP (nominal)', value: '$' + c.gdp[i].toFixed(2) + ' trillion',
      year: y, source: 'IMF, World Economic Outlook, October 2026',
    }));
  }
  const others = [
    { key: 'gdpPerCapita', label: 'GDP per capita', fmt: (c) => '$' + c.gdpPerCapita.toLocaleString('en-US'), year: 2025, source: 'World Bank, World Development Indicators, July 2026' },
    { key: 'population', label: 'Population', fmt: (c) => c.population.toLocaleString('en-US') + ' million', year: 2025, source: 'World Bank, World Development Indicators, July 2026' },
    { key: 'inflation', label: 'Inflation, CPI annual average', fmt: (c) => c.inflation.toFixed(1) + '%', year: 2025, source: 'IMF, World Economic Outlook, October 2026' },
    { key: 'unemployment', label: 'Unemployment rate', fmt: (c) => c.unemployment.toFixed(1) + '%', year: 2025, source: 'IMF, World Economic Outlook, October 2026' },
    { key: 'hdi', label: 'Human Development Index (HDI)', fmt: (c) => c.hdi.toFixed(3), year: 2023, source: 'UNDP, Human Development Report 2025' },
    { key: 'lifeExpectancy', label: 'Life expectancy at birth', fmt: (c) => c.lifeExpectancy.toFixed(c.code === 'CHN' || c.code === 'BRA' ? 2 : 1) + ' years', year: 2023,
      source: (c) => (c.code === 'CHN' || c.code === 'IND' || c.code === 'BRA') ? 'World Bank, World Development Indicators, 2023' : 'UNDP, Human Development Report 2025, Table 1' },
  ];
  for (const o of others) {
    for (const c of COUNTRIES) {
      rows.push({ country: c.name, indicator: o.label, value: o.fmt(c), year: o.year,
        source: typeof o.source === 'function' ? o.source(c) : o.source });
    }
  }
  return rows;
}
