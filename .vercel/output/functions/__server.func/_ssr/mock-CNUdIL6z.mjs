//#region node_modules/.nitro/vite/services/ssr/assets/mock-CNUdIL6z.js
/** Fixed demo "today" so server and client render identically. */
var DEMO_NOW = /* @__PURE__ */ new Date("2026-11-05T06:00:00+05:45");
var iso = (d) => d.toISOString().slice(0, 10);
var daysAgo = (n) => {
	const d = new Date(DEMO_NOW);
	d.setDate(d.getDate() - n);
	return d;
};
var wave = (i, a, p, s = 0) => Math.sin((i + s) / p) * a;
var r1 = (n) => Math.round(n * 10) / 10;
var pilotField = {
	id: "pilot-1",
	name: "पूर्वी खेत",
	crop: "rice",
	plantingDate: "2026-07-10",
	municipality: "bharatpur",
	boundary: [
		[27.6782, 84.4318],
		[27.6785, 84.4342],
		[27.6768, 84.4347],
		[27.6764, 84.4322]
	]
};
var neighbourFields = [{
	name: "A",
	status: "good",
	boundary: [
		[27.6792, 84.4322],
		[27.6795, 84.434],
		[27.6787, 84.4342],
		[27.6785, 84.4321]
	]
}, {
	name: "B",
	status: "watch",
	boundary: [
		[27.676, 84.435],
		[27.6762, 84.4368],
		[27.675, 84.437],
		[27.6749, 84.4352]
	]
}];
var stationMeta = {
	id: "NAIP-CH-01",
	depthCm: 15,
	lat: 27.6775,
	lng: 84.4333
};
function getStationDaily(days = 14) {
	return Array.from({ length: days }, (_, k) => {
		const i = days - 1 - k;
		const missing = i === 4;
		return {
			date: iso(daysAgo(i)),
			tMax: missing ? null : r1(28 + wave(i, 2.5, 2.3)),
			tMin: missing ? null : r1(17 + wave(i, 1.5, 3)),
			humidity: missing ? null : Math.round(74 + wave(i, 9, 1.7)),
			rain: missing ? null : r1(Math.max(0, wave(i, 9, 1.4, 1) - 3)),
			soil: missing ? null : r1(31 - (days - i) * -.05 - i * .6 + wave(i, 1.5, 2))
		};
	});
}
var stationCurrent = {
	observedAt: (/* @__PURE__ */ new Date(DEMO_NOW.getTime() - 72e4)).toISOString(),
	temp: 21.4,
	humidity: 82,
	rainToday: .6,
	soil: 24.8
};
var sensorHealth = {
	lastSeen: stationCurrent.observedAt,
	uptime: 96.4,
	battery: 71,
	signal: -87,
	gaps: [{
		from: iso(daysAgo(4)),
		hours: 22
	}]
};
function getNasaPowerDaily(days = 14) {
	return Array.from({ length: days }, (_, k) => {
		const i = days - 1 - k;
		return {
			date: iso(daysAgo(i + 1)),
			tMax: r1(27 + wave(i, 2, 2.6)),
			humidity: Math.round(70 + wave(i, 7, 2)),
			rain: r1(Math.max(0, wave(i, 7, 1.6, 1) - 2))
		};
	});
}
var nasaPowerMeta = {
	source: "nasa_power",
	observedAt: iso(daysAgo(2)),
	scale: "~0.5° (~50 km)"
};
function getVegSeries() {
	const out = [];
	for (let w = 16; w >= 0; w--) {
		const i = 16 - w;
		const base = .3 + Math.sin(i / 16 * Math.PI * .95) * .45;
		const sensor = i % 3 === 0 ? "landsat" : "modis";
		const cloud = i === 9 ? 78 : i === 12 ? 45 : i * 7 % 20;
		const drop = i >= 14 ? .12 * (i - 13) : 0;
		const ndvi = cloud > 70 ? null : r2(base - drop + wave(i, .02, 1.3));
		out.push({
			date: iso(daysAgo(w * 7)),
			ndvi,
			evi: ndvi === null ? null : r2(ndvi * .68),
			baseLow: r2(base - .07),
			baseHigh: r2(base + .07),
			cloud,
			quality: cloud > 70 ? "cloudy" : cloud > 30 ? "marginal" : "good",
			sensor
		});
	}
	return out;
}
function r2(n) {
	return Math.round(n * 100) / 100;
}
function freshness(observedAt, staleAfterHours) {
	if (!observedAt) return "missing";
	return (DEMO_NOW.getTime() - new Date(observedAt).getTime()) / 36e5 <= staleAfterHours ? "fresh" : "stale";
}
var calendar = [
	{
		id: "c1",
		crops: ["rice"],
		inDays: 3,
		ne: "धानको बाला पहेँलो हुँदै छ — खेतको पानी निकास जाँच्नुहोस्",
		en: "Rice panicles turning yellow — check field drainage"
	},
	{
		id: "c2",
		crops: ["rice"],
		inDays: 12,
		ne: "कटानीको तयारी: औजार र भण्डारण ठाउँ तयार गर्नुहोस्",
		en: "Prepare for harvest: tools and storage space"
	},
	{
		id: "c3",
		crops: ["wheat"],
		inDays: 20,
		ne: "गहुँ बीउ छर्ने उपयुक्त समय सुरु",
		en: "Suitable wheat sowing window begins"
	},
	{
		id: "c4",
		crops: ["potato", "tomato"],
		inDays: 6,
		ne: "चिसो रातमा बिरुवा निरीक्षण गर्नुहोस्",
		en: "Inspect plants after cold nights"
	},
	{
		id: "c5",
		crops: ["maize"],
		inDays: 9,
		ne: "मकै भण्डारण अघि राम्ररी सुकाउनुहोस्",
		en: "Dry maize well before storage"
	}
];
var guidance = [
	{
		id: "g1",
		crops: ["rice"],
		ne: {
			t: "धान खेतमा पानी व्यवस्थापन",
			b: "बाला निस्केपछि खेतमा २–५ से.मि. पानी राख्नुहोस्; कटानीभन्दा १०–१५ दिन अगाडि पानी निकाल्नुहोस्।"
		},
		en: {
			t: "Water management in rice",
			b: "Keep 2–5 cm of water after heading; drain the field 10–15 days before harvest."
		},
		reviewer: "NARC – National Rice Research Program",
		url: "https://narc.gov.np"
	},
	{
		id: "g2",
		crops: [
			"rice",
			"maize",
			"wheat",
			"potato",
			"tomato"
		],
		ne: {
			t: "खेत निरीक्षण कसरी गर्ने",
			b: "खेतको कम्तीमा ५ ठाउँमा हिँडेर हेर्नुहोस्। पात, डाँठ र माटोको फोटो खिच्नुहोस् र टिपोट राख्नुहोस्।"
		},
		en: {
			t: "How to inspect a field",
			b: "Walk to at least 5 spots in the field. Photograph leaves, stems and soil, and keep notes."
		},
		reviewer: "Ministry of Agriculture & Livestock Development",
		url: "https://moald.gov.np"
	},
	{
		id: "g3",
		crops: ["maize"],
		ne: {
			t: "मकैको भण्डारण",
			b: "दाना १३% भन्दा कम चिस्यान हुने गरी सुकाएर हावा चल्ने ठाउँमा राख्नुहोस्।"
		},
		en: {
			t: "Storing maize",
			b: "Dry grain below 13% moisture and store in a ventilated place."
		},
		reviewer: "NARC – National Maize Research Program",
		url: "https://narc.gov.np"
	},
	{
		id: "g4",
		crops: ["potato", "tomato"],
		ne: {
			t: "तुसारो र चिसोबाट बचाउ",
			b: "चिसो रात आउनु अघि हल्का सिँचाइ र छापो (मल्च) ले माटोको तापक्रम जोगाउन मद्दत गर्छ।"
		},
		en: {
			t: "Protecting from frost and cold",
			b: "Light irrigation and mulch before cold nights help keep soil warmer."
		},
		reviewer: "Agriculture Knowledge Centre, Kavre",
		url: "https://moald.gov.np"
	},
	{
		id: "g5",
		crops: ["wheat"],
		ne: {
			t: "गहुँ छर्ने समय",
			b: "तराईमा कात्तिक अन्त्यदेखि मंसिर मध्यसम्म छर्दा राम्रो हुन्छ। स्थानीय कृषि प्राविधिकसँग सल्लाह लिनुहोस्।"
		},
		en: {
			t: "Wheat sowing time",
			b: "In the Terai, late Kartik to mid-Mangsir is usually best. Consult your local agriculture technician."
		},
		reviewer: "NARC – National Wheat Research Program",
		url: "https://narc.gov.np"
	}
];
//#endregion
export { getStationDaily as a, nasaPowerMeta as c, sensorHealth as d, stationCurrent as f, getNasaPowerDaily as i, neighbourFields as l, calendar as n, getVegSeries as o, stationMeta as p, freshness as r, guidance as s, DEMO_NOW as t, pilotField as u };
