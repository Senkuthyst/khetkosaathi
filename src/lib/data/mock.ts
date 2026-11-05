// Mock data for one pilot farm (Chitwan). Deterministic — no randomness at module scope.
// Swap these functions for real adapters: NASA POWER daily API, AppEEARS (Landsat/MODIS NDVI/EVI), MQTT station feed.
import type { DailyPoint, Field, Freshness, Meta, VegPoint } from "./types";

/** Fixed demo "today" so server and client render identically. */
export const DEMO_NOW = new Date("2026-11-05T06:00:00+05:45");

const iso = (d: Date) => d.toISOString().slice(0, 10);
const daysAgo = (n: number) => {
  const d = new Date(DEMO_NOW);
  d.setDate(d.getDate() - n);
  return d;
};
const wave = (i: number, a: number, p: number, s = 0) => Math.sin((i + s) / p) * a;
const r1 = (n: number) => Math.round(n * 10) / 10;

export const municipalities = [
  { id: "bharatpur", ne: "भरतपुर महानगरपालिका, चितवन", en: "Bharatpur Metropolitan, Chitwan", center: [27.6766, 84.4335] as [number, number] },
  { id: "ratnanagar", ne: "रत्ननगर नगरपालिका, चितवन", en: "Ratnanagar Municipality, Chitwan", center: [27.618, 84.505] as [number, number] },
  { id: "tilottama", ne: "तिलोत्तमा नगरपालिका, रुपन्देही", en: "Tilottama Municipality, Rupandehi", center: [27.633, 83.475] as [number, number] },
  { id: "banepa", ne: "बनेपा नगरपालिका, काभ्रे", en: "Banepa Municipality, Kavre", center: [27.632, 85.521] as [number, number] },
  { id: "dhangadhi", ne: "धनगढी उपमहानगरपालिका, कैलाली", en: "Dhangadhi Sub-Metropolitan, Kailali", center: [28.698, 80.594] as [number, number] },
];

export const pilotField: Field = {
  id: "pilot-1",
  name: "पूर्वी खेत",
  crop: "rice",
  plantingDate: "2026-07-10",
  municipality: "bharatpur",
  boundary: [
    [27.6782, 84.4318],
    [27.6785, 84.4342],
    [27.6768, 84.4347],
    [27.6764, 84.4322],
  ],
};

export const neighbourFields: { name: string; status: "good" | "watch" | "low"; boundary: [number, number][] }[] = [
  { name: "A", status: "good", boundary: [[27.6792, 84.4322], [27.6795, 84.434], [27.6787, 84.4342], [27.6785, 84.4321]] },
  { name: "B", status: "watch", boundary: [[27.676, 84.435], [27.6762, 84.4368], [27.675, 84.437], [27.6749, 84.4352]] },
];

// ---------- Weather station (farm, point) ----------
export const stationMeta = { id: "NAIP-CH-01", depthCm: 15, lat: 27.6775, lng: 84.4333 };

export function getStationDaily(days = 14) {
  return Array.from({ length: days }, (_, k) => {
    const i = days - 1 - k;
    const missing = i === 4; // honest data gap
    return {
      date: iso(daysAgo(i)),
      tMax: missing ? null : r1(28 + wave(i, 2.5, 2.3)),
      tMin: missing ? null : r1(17 + wave(i, 1.5, 3)),
      humidity: missing ? null : Math.round(74 + wave(i, 9, 1.7)),
      rain: missing ? null : r1(Math.max(0, wave(i, 9, 1.4, 1) - 3)),
      soil: missing ? null : r1(31 - (days - i) * -0.05 - i * 0.6 + wave(i, 1.5, 2)),
    };
  });
}

export const stationCurrent = {
  observedAt: new Date(DEMO_NOW.getTime() - 12 * 60000).toISOString(),
  temp: 21.4,
  humidity: 82,
  rainToday: 0.6,
  soil: 24.8,
};

export const sensorHealth = {
  lastSeen: stationCurrent.observedAt,
  uptime: 96.4,
  battery: 71,
  signal: -87, // dBm
  gaps: [{ from: iso(daysAgo(4)), hours: 22 }],
};

// ---------- NASA POWER (regional gridded, ~0.5°) ----------
export function getNasaPowerDaily(days = 14) {
  return Array.from({ length: days }, (_, k) => {
    const i = days - 1 - k;
    return {
      date: iso(daysAgo(i + 1)),
      tMax: r1(27 + wave(i, 2, 2.6)),
      humidity: Math.round(70 + wave(i, 7, 2)),
      rain: r1(Math.max(0, wave(i, 7, 1.6, 1) - 2)),
    };
  });
}
export const nasaPowerMeta: Meta = { source: "nasa_power", observedAt: iso(daysAgo(2)), scale: "~0.5° (~50 km)" };

// ---------- Satellite vegetation (AppEEARS) ----------
export function getVegSeries(): VegPoint[] {
  const out: VegPoint[] = [];
  for (let w = 16; w >= 0; w--) {
    const i = 16 - w;
    const season = Math.sin((i / 16) * Math.PI * 0.95);
    const base = 0.3 + season * 0.45;
    const sensor = i % 3 === 0 ? "landsat" : "modis";
    const cloud = i === 9 ? 78 : i === 12 ? 45 : (i * 7) % 20;
    const drop = i >= 14 ? 0.12 * (i - 13) : 0;
    const ndvi = cloud > 70 ? null : r2(base - drop + wave(i, 0.02, 1.3));
    out.push({
      date: iso(daysAgo(w * 7)),
      ndvi,
      evi: ndvi === null ? null : r2(ndvi * 0.68),
      baseLow: r2(base - 0.07),
      baseHigh: r2(base + 0.07),
      cloud,
      quality: cloud > 70 ? "cloudy" : cloud > 30 ? "marginal" : "good",
      sensor,
    });
  }
  return out;
}
function r2(n: number) {
  return Math.round(n * 100) / 100;
}

export function freshness(observedAt: string | null, staleAfterHours: number): Freshness {
  if (!observedAt) return "missing";
  const h = (DEMO_NOW.getTime() - new Date(observedAt).getTime()) / 3600000;
  return h <= staleAfterHours ? "fresh" : "stale";
}

export const calendar = [
  { id: "c1", crops: ["rice"], inDays: 3, ne: "धानको बाला पहेँलो हुँदै छ — खेतको पानी निकास जाँच्नुहोस्", en: "Rice panicles turning yellow — check field drainage" },
  { id: "c2", crops: ["rice"], inDays: 12, ne: "कटानीको तयारी: औजार र भण्डारण ठाउँ तयार गर्नुहोस्", en: "Prepare for harvest: tools and storage space" },
  { id: "c3", crops: ["wheat"], inDays: 20, ne: "गहुँ बीउ छर्ने उपयुक्त समय सुरु", en: "Suitable wheat sowing window begins" },
  { id: "c4", crops: ["potato", "tomato"], inDays: 6, ne: "चिसो रातमा बिरुवा निरीक्षण गर्नुहोस्", en: "Inspect plants after cold nights" },
  { id: "c5", crops: ["maize"], inDays: 9, ne: "मकै भण्डारण अघि राम्ररी सुकाउनुहोस्", en: "Dry maize well before storage" },
];

export const guidance = [
  { id: "g1", crops: ["rice"], ne: { t: "धान खेतमा पानी व्यवस्थापन", b: "बाला निस्केपछि खेतमा २–५ से.मि. पानी राख्नुहोस्; कटानीभन्दा १०–१५ दिन अगाडि पानी निकाल्नुहोस्।" }, en: { t: "Water management in rice", b: "Keep 2–5 cm of water after heading; drain the field 10–15 days before harvest." }, reviewer: "NARC – National Rice Research Program", url: "https://narc.gov.np" },
  { id: "g2", crops: ["rice", "maize", "wheat", "potato", "tomato"], ne: { t: "खेत निरीक्षण कसरी गर्ने", b: "खेतको कम्तीमा ५ ठाउँमा हिँडेर हेर्नुहोस्। पात, डाँठ र माटोको फोटो खिच्नुहोस् र टिपोट राख्नुहोस्।" }, en: { t: "How to inspect a field", b: "Walk to at least 5 spots in the field. Photograph leaves, stems and soil, and keep notes." }, reviewer: "Ministry of Agriculture & Livestock Development", url: "https://moald.gov.np" },
  { id: "g3", crops: ["maize"], ne: { t: "मकैको भण्डारण", b: "दाना १३% भन्दा कम चिस्यान हुने गरी सुकाएर हावा चल्ने ठाउँमा राख्नुहोस्।" }, en: { t: "Storing maize", b: "Dry grain below 13% moisture and store in a ventilated place." }, reviewer: "NARC – National Maize Research Program", url: "https://narc.gov.np" },
  { id: "g4", crops: ["potato", "tomato"], ne: { t: "तुसारो र चिसोबाट बचाउ", b: "चिसो रात आउनु अघि हल्का सिँचाइ र छापो (मल्च) ले माटोको तापक्रम जोगाउन मद्दत गर्छ।" }, en: { t: "Protecting from frost and cold", b: "Light irrigation and mulch before cold nights help keep soil warmer." }, reviewer: "Agriculture Knowledge Centre, Kavre", url: "https://moald.gov.np" },
  { id: "g5", crops: ["wheat"], ne: { t: "गहुँ छर्ने समय", b: "तराईमा कात्तिक अन्त्यदेखि मंसिर मध्यसम्म छर्दा राम्रो हुन्छ। स्थानीय कृषि प्राविधिकसँग सल्लाह लिनुहोस्।" }, en: { t: "Wheat sowing time", b: "In the Terai, late Kartik to mid-Mangsir is usually best. Consult your local agriculture technician." }, reviewer: "NARC – National Wheat Research Program", url: "https://narc.gov.np" },
];
