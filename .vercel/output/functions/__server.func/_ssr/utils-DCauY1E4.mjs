import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as index_default } from "../_libs/@turf/area+[...].mjs";
import { t as index_default$1 } from "../_libs/turf__kinks.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-DCauY1E4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var dict = {
	earthIntelligence: {
		ne: "पृथ्वी सूचना",
		en: "Earth Intelligence"
	},
	chitwanRegion: {
		ne: "चितवन, नेपाल",
		en: "Chitwan, Nepal"
	},
	earthScope: {
		ne: "NASA POWER क्षेत्रीय डाटा प्राप्त गरिन्छ। MODIS, GPM, SMAP, आधार मान र जोखिम नमुना मात्र हुन्; तपाईंको खेतको प्रत्यक्ष डाटा होइनन्।",
		en: "NASA POWER regional data is fetched. MODIS, GPM, SMAP, baselines and risk are illustrative pilot records, not live data for your field."
	},
	earthVegetation: {
		ne: "हरियाली अवस्था (NDVI)",
		en: "Vegetation health (NDVI)"
	},
	earthEvi: {
		ne: "वनस्पति सूचकाङ्क (EVI)",
		en: "Vegetation index (EVI)"
	},
	rainfallAnomaly: {
		ne: "वर्षाको विचलन",
		en: "Rainfall anomaly"
	},
	temperatureAnomaly: {
		ne: "तापक्रमको विचलन",
		en: "Temperature anomaly"
	},
	soilComparison: {
		ne: "माटोको चिस्यान तुलना",
		en: "Soil moisture comparison"
	},
	integratedRisk: {
		ne: "एकीकृत कृषि जोखिम",
		en: "Integrated agricultural risk"
	},
	provenance: {
		ne: "डाटाको स्रोत विवरण",
		en: "Data provenance"
	},
	dataset: {
		ne: "डाटासेट",
		en: "Dataset"
	},
	productId: {
		ne: "NASA उत्पादन पहिचान",
		en: "NASA product ID"
	},
	retrieved: {
		ne: "प्राप्त समय",
		en: "Retrieved at"
	},
	notRetrieved: {
		ne: "प्राप्त गरिएको छैन — नमुना अभिलेख",
		en: "Not retrieved — illustrative record"
	},
	observationPeriod: {
		ne: "अवलोकन अवधि",
		en: "Observation period"
	},
	pilot: {
		ne: "नमुना डाटा",
		en: "Pilot data"
	},
	live: {
		ne: "NASA बाट प्राप्त",
		en: "Fetched from NASA"
	},
	cached: {
		ne: "सुरक्षित NASA डाटा",
		en: "Cached NASA data"
	},
	pilotQuality: {
		ne: "नमुना मात्र; वास्तविक गुणस्तर/बादल जाँचिएको छैन",
		en: "Illustrative only; actual QA/cloud cover unverified"
	},
	powerOverview: {
		ne: "NASA POWER दैनिक सन्दर्भ",
		en: "NASA POWER daily context"
	},
	powerLoading: {
		ne: "NASA डाटा प्राप्त हुँदै छ…",
		en: "Fetching NASA data…"
	},
	powerFallback: {
		ne: "NASA उपलब्ध छैन। सुरक्षित डाटा नभएकाले स्पष्ट चिन्हित नमुना देखाइएको छ।",
		en: "NASA is unavailable. No cached data exists, so labeled pilot data is shown."
	},
	powerContext: {
		ne: "UTC दैनिक क्षेत्रीय मान; पछिल्लो उपलब्ध नाप। प्रकाशन ढिलो हुन सक्छ। सौर्य ग्रिड मौसम ग्रिडभन्दा फरक छ।",
		en: "UTC daily regional values; latest available observation. Publication may lag. Solar and weather grids differ."
	},
	solarRadiation: {
		ne: "सौर्य विकिरण",
		en: "Solar radiation"
	},
	minTemperature: {
		ne: "न्यूनतम तापक्रम",
		en: "Minimum temperature"
	},
	maxTemperature: {
		ne: "अधिकतम तापक्रम",
		en: "Maximum temperature"
	},
	rainfall: {
		ne: "वर्षा",
		en: "Rainfall"
	},
	seasonalPilot: {
		ne: "नमुना मौसमी आधार",
		en: "Illustrative seasonal baseline"
	},
	sevenDayTotal: {
		ne: "सात दिनको जम्मा",
		en: "Seven-day total"
	},
	weeklyMaxMean: {
		ne: "सात दिनको औसत अधिकतम तापक्रम",
		en: "Seven-day mean maximum temperature"
	},
	composite16: {
		ne: "१६ दिने संयुक्त दृश्य; दैनिक वा खेतस्तरको नाप होइन।",
		en: "16-day composite; not a daily or field-scale measurement."
	},
	eviContext: {
		ne: "हरियालीको अर्को सूचक; रोग वा उत्पादनको अनुमान होइन।",
		en: "Another vegetation indicator, not a disease or yield estimate."
	},
	surfaceRegional: {
		ne: "SMAP क्षेत्रीय सतह",
		en: "SMAP regional surface"
	},
	pilotProbe: {
		ne: "नमुना खेत सेन्सर",
		en: "Pilot farm probe"
	},
	depthCm: {
		ne: "से.मि. गहिराइ",
		en: "cm depth"
	},
	soilMismatch: {
		ne: "फरक मिति, गहिराइ र दायरा; सीधा मिलान वा सेन्सर प्रमाणीकरण होइन। दुवै आयतन चिस्यान हुन्।",
		en: "Different dates, depths and scales; not a direct match or probe validation. Both show volumetric moisture."
	},
	moderate: {
		ne: "मध्यम",
		en: "Moderate"
	},
	critical: {
		ne: "अति उच्च",
		en: "Critical"
	},
	pilotRiskNote: {
		ne: "नमुना संकेत मात्र, प्रमाणित जोखिम पूर्वानुमान होइन। खेतमा जाँच्नुहोस्।",
		en: "Demonstration indicator only, not a validated risk forecast. Inspect the field."
	},
	riskRule: {
		ne: "तीन नमुना संकेत: NDVI आधारभन्दा कम, वर्षा कम्तीमा ३०% कम, तापक्रम कम्तीमा २°C बढी। ०/१/२/३ संकेत = कम/मध्यम/उच्च/अति उच्च।",
		en: "Three pilot signals: NDVI below baseline, rainfall at least 30% below baseline, temperature at least 2°C above baseline. 0/1/2/3 signals = Low/Moderate/High/Critical."
	},
	refreshData: {
		ne: "NASA डाटा फेरि प्राप्त गर्नुहोस्",
		en: "Refresh NASA data"
	},
	src_gpm: {
		ne: "GPM IMERG",
		en: "GPM IMERG"
	},
	src_smap: {
		ne: "SMAP",
		en: "SMAP"
	},
	units: {
		ne: "एकाइ",
		en: "Units"
	},
	weatherResolution: {
		ne: "मौसम: ०.५° × ०.६२५°; सौर्य: १°",
		en: "Weather: 0.5° × 0.625°; solar: 1°"
	},
	demo: {
		ne: "चितवन नमुना · ५ नोभेम्बर २०२६",
		en: "Chitwan demo · 5 November 2026"
	},
	demoNote: {
		ne: "सबै मौसम र भू-उपग्रह डाटा चितवनको नमुना खेतका हुन्; दर्ता गरिएको खेतको प्रत्यक्ष नाप होइन।",
		en: "All weather and satellite data represent the Chitwan pilot, not live readings from your registered field."
	},
	pointScale: {
		ne: "खेतमा एक बिन्दु",
		en: "Point at farm"
	},
	calendarScale: {
		ne: "बाली / क्षेत्रीय",
		en: "Crop / regional"
	},
	gridded: {
		ne: "क्षेत्रीय ग्रिड सन्दर्भ",
		en: "Regional gridded context"
	},
	incompleteRain: {
		ne: "उपलब्ध दिनको जम्मा; एक दिनको नाप छैन।",
		en: "Total of available days; one day has no reading."
	},
	missingNote: {
		ne: "खाली ठाउँले नाप नभएको दिन देखाउँछ।",
		en: "Gaps indicate days without measurements."
	},
	allData: {
		ne: "सबै नाप",
		en: "All readings"
	},
	saving: {
		ne: "सुरक्षित हुँदै छ…",
		en: "Saving…"
	},
	saved: {
		ne: "सुरक्षित भयो",
		en: "Saved"
	},
	saveError: {
		ne: "सुरक्षित भएन। इन्टरनेट जाँचेर फेरि प्रयास गर्नुहोस्।",
		en: "Could not save. Check your connection and try again."
	},
	loadError: {
		ne: "अभिलेख लोड भएन। फेरि प्रयास गर्नुहोस्।",
		en: "Records could not load. Please retry."
	},
	retry: {
		ne: "फेरि प्रयास",
		en: "Retry"
	},
	reportDetails: {
		ne: "कुन जानकारी गलत छ?",
		en: "What information is incorrect?"
	},
	cancel: {
		ne: "रद्द",
		en: "Cancel"
	},
	sendReport: {
		ne: "रिपोर्ट पठाउनुहोस्",
		en: "Send report"
	},
	reviewDemo: {
		ne: "स्रोतमा आधारित नमुना सामग्री; औपचारिक विशेषज्ञ समीक्षा पुष्टि भएको छैन।",
		en: "Source-based demo content; formal expert review has not been verified."
	},
	referenceInstitution: {
		ne: "सन्दर्भ संस्था",
		en: "Reference institution"
	},
	reviewPending: {
		ne: "समीक्षा गर्ने: पुष्टि हुन बाँकी",
		en: "Reviewed by: verification pending"
	},
	photoLimit: {
		ne: "JPEG, PNG वा WebP फोटो (१० MB सम्म)",
		en: "JPEG, PNG or WebP photo (up to 10 MB)"
	},
	photoError: {
		ne: "फोटो पढ्न सकिएन। JPEG, PNG वा WebP (१० MB सम्म) छान्नुहोस्।",
		en: "Could not read photo. Choose JPEG, PNG or WebP (up to 10 MB)."
	},
	removePhoto: {
		ne: "फोटो हटाउनुहोस्",
		en: "Remove photo"
	},
	fieldScope: {
		ne: "यो खेतका अभिलेख",
		en: "Records for this field"
	},
	stationGap: {
		ne: "अघिल्लो नाप छुट्यो; अहिले केन्द्र जोडिएको छ।",
		en: "Historical measurement gap; station is currently connected."
	},
	soilDepth: {
		ne: "१५ से.मि. गहिराइमा",
		en: "At 15 cm depth"
	},
	recentGap: {
		ne: "अन्तिम ७ दिनमा",
		en: "In the last 7 days"
	},
	lowerBound: {
		ne: "न्यूनतम दायरा",
		en: "Lower baseline"
	},
	upperBound: {
		ne: "अधिकतम दायरा",
		en: "Upper baseline"
	},
	thresholdsNote: {
		ne: "सूचना सीमा तपाईंले छानेको मान हो; बालीको उपचार सल्लाह होइन।",
		en: "Alert thresholds are your selected values, not crop treatment advice."
	},
	thresholdError: {
		ne: "मान जाँच्नुहोस्: वर्षा ०–५००, चिस्यान र ब्याट्री ०–१००, तापक्रम −२०–६०।",
		en: "Check values: rain 0–500, moisture and battery 0–100, temperature −20–60."
	},
	appName: {
		ne: "खेतको साथी",
		en: "KHETKOSAATHI"
	},
	appTagline: {
		ne: "तपाईंको बौद्धिक कृषि सहयात्री",
		en: "Your Intelligent Agricultural Companion"
	},
	appPositioning: {
		ne: "नेपालका किसानहरूको लागि NASA भू-उपग्रह बौद्धिकता।",
		en: "Bringing NASA Earth Intelligence closer to Nepal's farmers."
	},
	overview: {
		ne: "अवलोकन",
		en: "Overview"
	},
	dashboard: {
		ne: "कृषि ड्यासबोर्ड",
		en: "Agricultural Dashboard"
	},
	cropMonitoring: {
		ne: "बाली अनुगमन",
		en: "Crop Monitoring"
	},
	cropRotationPlanner: {
		ne: "बाली चक्र योजनाकार",
		en: "Crop Rotation Planner"
	},
	farmProfiles: {
		ne: "खेत प्रोफाइलहरू",
		en: "Farm Profiles"
	},
	aiAssistant: {
		ne: "AI कृषि सहायक",
		en: "AI Agricultural Assistant"
	},
	reports: {
		ne: "प्रतिवेदन तथा सूचना",
		en: "Reports & Alerts"
	},
	settings: {
		ne: "सेटिङ तथा सीमाहरू",
		en: "Settings & Thresholds"
	},
	weatherAndClimate: {
		ne: "मौसम र जलवायु",
		en: "Weather & Climate"
	},
	landingPage: {
		ne: "मञ्च परिचय",
		en: "Platform Showcase"
	},
	exploreEarthIntelligence: {
		ne: "भू-सूचना अन्वेषण गर्नुहोस्",
		en: "Explore Earth Intelligence"
	},
	discoverPlatform: {
		ne: "हाम्रो मञ्च जान्नुहोस्",
		en: "Discover Our Platform"
	},
	getStarted: {
		ne: "सुरु गर्नुहोस्",
		en: "Get Started"
	},
	signIn: {
		ne: "लग इन",
		en: "Sign In"
	},
	about: {
		ne: "हाम्रो बारेमा",
		en: "About"
	},
	farmMonitoring: {
		ne: "खेत अनुगमन",
		en: "Farm Monitoring"
	},
	cropInsights: {
		ne: "बाली अन्तर्दृष्टि",
		en: "Crop Insights"
	},
	langToggle: {
		ne: "English",
		en: "नेपाली"
	},
	home: {
		ne: "गृह",
		en: "Home"
	},
	cropHealth: {
		ne: "बाली स्वास्थ्य",
		en: "Crop Health"
	},
	station: {
		ne: "मौसम केन्द्र",
		en: "Weather Station"
	},
	alerts: {
		ne: "सूचना",
		en: "Alerts"
	},
	guidance: {
		ne: "सल्लाह",
		en: "Guidance"
	},
	offline: {
		ne: "इन्टरनेट छैन — पछिल्लो सुरक्षित डाटा देखाइँदै छ",
		en: "You are offline — showing last saved data"
	},
	disclaimer: {
		ne: "भू-उपग्रह सूचना रोग वा समस्याको निदान होइन। सधैं खेतमा गएर जाँच्नुहोस्।",
		en: "Satellite alerts are not diagnoses. Always check the field in person."
	},
	src_station: {
		ne: "खेत केन्द्र",
		en: "Farm station"
	},
	src_nasa_power: {
		ne: "NASA POWER",
		en: "NASA POWER"
	},
	src_landsat: {
		ne: "Landsat",
		en: "Landsat"
	},
	src_modis: {
		ne: "MODIS",
		en: "MODIS"
	},
	fresh: {
		ne: "ताजा",
		en: "Fresh"
	},
	stale: {
		ne: "पुरानो",
		en: "Stale"
	},
	missing: {
		ne: "छैन",
		en: "Missing"
	},
	observed: {
		ne: "मिति",
		en: "Observed"
	},
	scale: {
		ne: "दायरा",
		en: "Scale"
	},
	measured: {
		ne: "खेतमा नापिएको",
		en: "Field measurement"
	},
	estimate: {
		ne: "भू-उपग्रह अनुमान",
		en: "Satellite estimate"
	},
	welcome: {
		ne: "स्वागत छ",
		en: "Welcome"
	},
	onbIntro: {
		ne: "आफ्नो खेत दर्ता गरेर सुरु गर्नुहोस्।",
		en: "Start by registering your field."
	},
	municipality: {
		ne: "नगरपालिका / गाउँपालिका",
		en: "Municipality"
	},
	fieldName: {
		ne: "खेतको नाम",
		en: "Field name"
	},
	crop: {
		ne: "बाली",
		en: "Crop"
	},
	plantingDate: {
		ne: "रोपेको मिति",
		en: "Planting date"
	},
	boundary: {
		ne: "खेतको सिमाना",
		en: "Field boundary"
	},
	boundaryHelp: {
		ne: "नक्सामा खेतको कुनाहरूमा थिच्नुहोस् (कम्तीमा ३)।",
		en: "Tap the corners of your field on the map (at least 3)."
	},
	usePilot: {
		ne: "नमुना खेत प्रयोग गर्नुहोस्",
		en: "Use pilot field"
	},
	clear: {
		ne: "मेटाउनुहोस्",
		en: "Clear"
	},
	undo: {
		ne: "पछाडि",
		en: "Undo"
	},
	points: {
		ne: "बिन्दु",
		en: "points"
	},
	next: {
		ne: "अगाडि",
		en: "Next"
	},
	back: {
		ne: "पछाडि",
		en: "Back"
	},
	finish: {
		ne: "दर्ता गर्नुहोस्",
		en: "Register field"
	},
	step: {
		ne: "चरण",
		en: "Step"
	},
	editField: {
		ne: "खेत बदल्नुहोस्",
		en: "Change field"
	},
	rice: {
		ne: "धान",
		en: "Rice"
	},
	maize: {
		ne: "मकै",
		en: "Maize"
	},
	wheat: {
		ne: "गहुँ",
		en: "Wheat"
	},
	potato: {
		ne: "आलु",
		en: "Potato"
	},
	tomato: {
		ne: "गोलभेडा",
		en: "Tomato"
	},
	rain7: {
		ne: "७ दिनको वर्षा",
		en: "7-day rainfall"
	},
	temperature: {
		ne: "तापक्रम",
		en: "Temperature"
	},
	humidity: {
		ne: "आर्द्रता",
		en: "Humidity"
	},
	soilMoisture: {
		ne: "माटोको चिस्यान",
		en: "Soil moisture"
	},
	vegTrend: {
		ne: "बिरुवाको हरियाली (NDVI)",
		en: "Vegetation trend (NDVI)"
	},
	reminders: {
		ne: "आउँदा बाली-पात्रो सम्झना",
		en: "Upcoming crop-calendar reminders"
	},
	inDays: {
		ne: "दिनमा",
		en: "days"
	},
	total: {
		ne: "जम्मा",
		en: "Total"
	},
	dayAge: {
		ne: "बालीको उमेर",
		en: "Crop age"
	},
	days: {
		ne: "दिन",
		en: "days"
	},
	map: {
		ne: "खेतको नक्सा",
		en: "Field map"
	},
	vegGood: {
		ne: "सामान्य",
		en: "Normal"
	},
	vegWatch: {
		ne: "ध्यान दिनुहोस्",
		en: "Watch"
	},
	vegLow: {
		ne: "आधारभन्दा कम",
		en: "Below baseline"
	},
	tsTitle: {
		ne: "NDVI / EVI समय-शृङ्खला",
		en: "NDVI / EVI time series"
	},
	baseline: {
		ne: "यस खेतको सामान्य दायरा",
		en: "Field's seasonal baseline"
	},
	changeAlert: {
		ne: "परिवर्तन सूचना",
		en: "Change alert"
	},
	changeText: {
		ne: "यस खेतको हालको आधारसँग तुलना गर्दा वनस्पति सूचकाङ्क घटेको छ; खेत निरीक्षण गर्नुहोस्।",
		en: "Vegetation index decreased compared with this field's recent baseline; inspect the plot."
	},
	resolution: {
		ne: "रिजोल्युसन",
		en: "Resolution"
	},
	cloud: {
		ne: "बादल",
		en: "Cloud"
	},
	quality: {
		ne: "गुणस्तर",
		en: "Quality"
	},
	confidence: {
		ne: "विश्वास स्तर",
		en: "Confidence"
	},
	low: {
		ne: "कम",
		en: "Low"
	},
	medium: {
		ne: "मध्यम",
		en: "Medium"
	},
	high: {
		ne: "उच्च",
		en: "High"
	},
	good: {
		ne: "राम्रो",
		en: "Good"
	},
	marginal: {
		ne: "सीमान्त",
		en: "Marginal"
	},
	cloudy: {
		ne: "बादलले ढाकेको",
		en: "Cloudy"
	},
	cloudGap: {
		ne: "बादलका कारण केही हप्ताको डाटा छैन — चार्टमा खाली देखिन्छ।",
		en: "Some weeks are missing due to cloud — shown as gaps in the chart."
	},
	confReason: {
		ne: "पछिल्लो दृश्यमा आंशिक बादल र MODIS को ठूलो पिक्सेलले विश्वास घटाउँछ।",
		en: "Partial cloud in recent scenes and the coarse MODIS pixel reduce confidence."
	},
	inspLog: {
		ne: "खेत निरीक्षण अभिलेख",
		en: "Field inspection log"
	},
	notes: {
		ne: "टिपोट",
		en: "Notes"
	},
	photo: {
		ne: "फोटो",
		en: "Photo"
	},
	outcome: {
		ne: "नतिजा",
		en: "Outcome"
	},
	noIssue: {
		ne: "समस्या छैन",
		en: "No issue"
	},
	problem: {
		ne: "समस्या भेटियो",
		en: "Problem found"
	},
	unsure: {
		ne: "थाहा भएन",
		en: "Unsure"
	},
	save: {
		ne: "सुरक्षित गर्नुहोस्",
		en: "Save"
	},
	noEntries: {
		ne: "अहिलेसम्म कुनै अभिलेख छैन।",
		en: "No entries yet."
	},
	current: {
		ne: "हालको अवस्था",
		en: "Current readings"
	},
	rainToday: {
		ne: "आजको वर्षा",
		en: "Rain today"
	},
	atDepth: {
		ne: "गहिराइमा",
		en: "depth"
	},
	daily: {
		ne: "दैनिक सारांश",
		en: "Daily summary"
	},
	trends: {
		ne: "प्रवृत्ति",
		en: "Trends"
	},
	sensorHealth: {
		ne: "सेन्सरको अवस्था",
		en: "Sensor health"
	},
	lastSeen: {
		ne: "अन्तिम सम्पर्क",
		en: "Last seen"
	},
	uptime: {
		ne: "चालु समय",
		en: "Uptime"
	},
	battery: {
		ne: "ब्याट्री",
		en: "Battery"
	},
	signal: {
		ne: "सिग्नल",
		en: "Signal"
	},
	dataGap: {
		ne: "डाटा नभएको समय",
		en: "Data gap"
	},
	hours: {
		ne: "घण्टा",
		en: "hours"
	},
	minAgo: {
		ne: "मिनेट अघि",
		en: "min ago"
	},
	compare: {
		ne: "खेत बनाम NASA POWER तुलना",
		en: "Farm vs NASA POWER comparison"
	},
	compareNote: {
		ne: "ग्रिड डाटा क्षेत्रीय सन्दर्भ मात्र हो, खेतमा गरिएको नापको विकल्प होइन।",
		en: "Gridded data is regional context, not a replacement for on-site measurements."
	},
	cropStageGdd: {
		ne: "बालीको अवस्था (GDD)",
		en: "Crop stage (GDD)"
	},
	waterBalance14: {
		ne: "पानी सन्तुलन (१४ दिन)",
		en: "Water balance (14 days)"
	},
	waterBalanceContext: {
		ne: "पानी सन्तुलन सन्दर्भ",
		en: "Water balance context"
	},
	accumulatedGdd: {
		ne: "सञ्चित ताप एकाइ (GDD)",
		en: "Accumulated GDD"
	},
	progressToNextStage: {
		ne: "अर्को अवस्थासम्मको प्रगति",
		en: "Progress to next stage"
	},
	approximateBadge: {
		ne: "अनुमानित",
		en: "Approximate"
	},
	netBalance: {
		ne: "खुद पानी सन्तुलन",
		en: "Net water balance"
	},
	rainfallMinusEto: {
		ne: "वर्षा घटाइ वाष्पीकरण (ET₀)",
		en: "Rainfall minus ET₀"
	},
	historicalPercentile: {
		ne: "१५ वर्षे ऐतिहासिक प्रतिशतक",
		en: "15-year historical percentile"
	},
	noIrrigationSchedule: {
		ne: "यो अवलोकन सन्दर्भ मात्र हो; सिँचाइ तालिका वा सिफारिस होइन।",
		en: "Observational context only; not an irrigation schedule or recommendation."
	},
	gddReanalysisNote: {
		ne: "NASA POWER ०.५° क्षेत्रीय ग्रिडमा आधारित; खेत स्तरको अनुमान मात्र।",
		en: "Based on NASA POWER ~0.5° regional grid; stage is an estimate."
	},
	thermalUnits: {
		ne: "डिग्री दिन (°C·दिन)",
		en: "degree-days (°C·day)"
	},
	waterBalanceChartTooltip: {
		ne: "दैनिक वर्षा, ET₀ र खुद सन्तुलन",
		en: "Daily rainfall, ET₀ and net balance"
	},
	farm: {
		ne: "खेत",
		en: "Farm"
	},
	thresholds: {
		ne: "सीमा सेटिङ",
		en: "Thresholds"
	},
	minRain: {
		ne: "७ दिनमा न्यूनतम वर्षा (मि.मि.)",
		en: "Minimum 7-day rainfall (mm)"
	},
	minSoil: {
		ne: "न्यूनतम माटो चिस्यान (%)",
		en: "Minimum soil moisture (%)"
	},
	maxTemp: {
		ne: "अधिकतम तापक्रम (°C)",
		en: "Maximum temperature (°C)"
	},
	minBattery: {
		ne: "न्यूनतम ब्याट्री (%)",
		en: "Minimum battery (%)"
	},
	date: {
		ne: "मिति",
		en: "Date"
	},
	max: {
		ne: "अधि.",
		en: "Max"
	},
	min: {
		ne: "न्यू.",
		en: "Min"
	},
	severity: {
		ne: "गम्भीरता",
		en: "Severity"
	},
	sevHigh: {
		ne: "उच्च",
		en: "High"
	},
	sevMed: {
		ne: "मध्यम",
		en: "Medium"
	},
	sevLow: {
		ne: "सामान्य",
		en: "Info"
	},
	editThresholds: {
		ne: "सीमा बदल्नुहोस्",
		en: "Edit thresholds"
	},
	noAlerts: {
		ne: "कुनै सूचना छैन।",
		en: "No alerts right now."
	},
	a_soil: {
		ne: "माटोको चिस्यान तोकिएको सीमाभन्दा कम छ",
		en: "Soil moisture is below your threshold"
	},
	a_rain: {
		ne: "पछिल्लो ७ दिनमा वर्षा तोकिएको सीमाभन्दा कम",
		en: "Rainfall over the last 7 days is below your threshold"
	},
	a_temp: {
		ne: "तापक्रम तोकिएको सीमाभन्दा बढी",
		en: "Temperature above your threshold"
	},
	a_veg: {
		ne: "वनस्पति सूचकाङ्क आधारभन्दा कम — खेत निरीक्षण गर्नुहोस्",
		en: "Vegetation index below baseline — inspect the plot"
	},
	a_gap: {
		ne: "मौसम केन्द्रबाट २२ घण्टा डाटा आएन",
		en: "Weather station sent no data for 22 hours"
	},
	a_batt: {
		ne: "केन्द्रको ब्याट्री कम छ",
		en: "Station battery is low"
	},
	reviewedBy: {
		ne: "समीक्षा गर्ने",
		en: "Reviewed by"
	},
	sourceLink: {
		ne: "स्रोत",
		en: "Source"
	},
	report: {
		ne: "गलत जानकारी रिपोर्ट गर्नुहोस्",
		en: "Report incorrect information"
	},
	reported: {
		ne: "धन्यवाद! रिपोर्ट प्राप्त भयो।",
		en: "Thanks! Report received."
	},
	allCrops: {
		ne: "सबै",
		en: "All"
	},
	noChem: {
		ne: "यस मञ्चले कुनै विषादी वा मलको मात्रा सिफारिस गर्दैन। त्यसका लागि स्थानीय कृषि प्राविधिकसँग सम्पर्क गर्नुहोस्।",
		en: "This platform never recommends pesticides or fertiliser doses. Contact your local agriculture technician for that."
	},
	noYield: {
		ne: "यो उत्पादन अनुमान होइन।",
		en: "This is not a yield prediction."
	},
	myFarm: {
		ne: "मेरो खेत",
		en: "My Farm"
	},
	myFarmIntro: {
		ne: "नक्सामा आफ्नो खेत खोज्नुहोस्, सिमाना कोर्नुहोस् र वातावरणीय अध्ययन सुरु गर्न सुरक्षित गर्नुहोस्।",
		en: "Locate your farm on the map, draw its boundary, and save it to begin environmental investigation."
	},
	myLocation: {
		ne: "मेरो स्थान",
		en: "My location"
	},
	zoomIn: {
		ne: "नक्सा नजिक्याउनुहोस्",
		en: "Zoom in"
	},
	zoomOut: {
		ne: "नक्सा टाढ्याउनुहोस्",
		en: "Zoom out"
	},
	plotLoading: {
		ne: "सुरक्षित खेत लोड हुँदै…",
		en: "Loading saved farm…"
	},
	plotLoadFail: {
		ne: "सुरक्षित खेत लोड भएन। फेरि प्रयास गर्नुहोस्।",
		en: "Saved farm could not be loaded. Please retry."
	},
	locating: {
		ne: "स्थान खोज्दै…",
		en: "Finding your location…"
	},
	locDenied: {
		ne: "स्थान अनुमति अस्वीकार भयो। नक्सा तानेर वा खोजेर खेत भेट्टाउनुहोस्।",
		en: "Location permission was denied. Drag or search the map to find your farm."
	},
	locUnavailable: {
		ne: "स्थान पत्ता लागेन। नक्सा आफैं चलाउनुहोस्।",
		en: "Your location could not be determined. Navigate the map manually."
	},
	locUnsupported: {
		ne: "यो ब्राउजरले स्थान पत्ता लगाउन सक्दैन।",
		en: "This browser cannot detect location."
	},
	lowAccuracy: {
		ne: "स्थान अनुमान कम सटीक छ",
		en: "Low location accuracy"
	},
	accuracy: {
		ne: "सटीकता",
		en: "Accuracy"
	},
	notFarmNote: {
		ne: "तपाईंको स्थान खेत मानिँदैन — खेतको सिमाना आफैं कोर्नुहोस्।",
		en: "Your position is not assumed to be your farm — draw the boundary yourself."
	},
	searchPlace: {
		ne: "गाउँ, सहर वा ठाउँ खोज्नुहोस्",
		en: "Search village, town or landmark"
	},
	search: {
		ne: "खोज",
		en: "Search"
	},
	searching: {
		ne: "खोज्दै…",
		en: "Searching…"
	},
	searchNone: {
		ne: "केही भेटिएन",
		en: "No places found"
	},
	searchFail: {
		ne: "खोज उपलब्ध छैन। नक्सा आफैं चलाउनुहोस्।",
		en: "Search unavailable. Navigate the map manually."
	},
	searchWait: {
		ne: "धेरै छिटो खोजियो। कृपया एक सेकेन्ड पर्खनुहोस्।",
		en: "Searched too quickly. Please wait a second."
	},
	searchAttribution: {
		ne: "खोज: OpenStreetMap Nominatim",
		en: "Search: OpenStreetMap Nominatim"
	},
	clearSearch: {
		ne: "खोज मेटाउनुहोस्",
		en: "Clear search"
	},
	drawBoundary: {
		ne: "खेतको सिमाना कोर्नुहोस्",
		en: "Draw Farm Boundary"
	},
	drawHelp: {
		ne: "नक्सामा खेतका कुनाहरूमा क्रमैसँग थिच्नुहोस्। सिमाना बन्द गर्न पहिलो बिन्दुमा थिच्नुहोस् वा दुई पटक थिच्नुहोस्। अर्को चरणमा बिन्दु सार्न वा हटाउन सकिन्छ।",
		en: "Tap each corner of your field in order. Tap the first corner or double-tap to close the boundary. You can move or remove points in the next step."
	},
	editHelp: {
		ne: "कुनाका बिन्दु तानेर सार्नुहोस्। बीचको बिन्दु तानेर नयाँ कुना थप्नुहोस्; बिन्दुमा थिचेर हटाउनुहोस्।",
		en: "Drag corners to move them. Drag a midpoint to add a corner; tap a corner to remove it."
	},
	stepDraw: {
		ne: "१. सिमाना कोर्नुहोस्",
		en: "1. Draw boundary"
	},
	stepAdjust: {
		ne: "२. सिमाना मिलाउनुहोस्",
		en: "2. Adjust boundary"
	},
	stepSave: {
		ne: "३. खेत सुरक्षित गर्नुहोस्",
		en: "3. Save farm"
	},
	confirm: {
		ne: "पुष्टि गर्नुहोस्",
		en: "Confirm"
	},
	editBoundary: {
		ne: "सिमाना सम्पादन",
		en: "Edit boundary"
	},
	restore: {
		ne: "फिर्ता ल्याउनुहोस्",
		en: "Restore"
	},
	restorePrevious: {
		ne: "अघिल्लो सिमाना फिर्ता ल्याउनुहोस्",
		en: "Restore previous boundary"
	},
	cleared: {
		ne: "सिमाना हटाइयो",
		en: "Boundary cleared"
	},
	invalidPoly: {
		ne: "कम्तीमा ३ बिन्दु चाहिन्छ र रेखाहरू एकअर्कामा काटिनु हुँदैन।",
		en: "At least 3 points are needed and edges must not cross."
	},
	area: {
		ne: "क्षेत्रफल",
		en: "Area"
	},
	sqm: {
		ne: "वर्ग मिटर",
		en: "m²"
	},
	hectares: {
		ne: "हेक्टर",
		en: "ha"
	},
	savePlot: {
		ne: "खेत सुरक्षित गर्नुहोस्",
		en: "Save farm plot"
	},
	plotSaved: {
		ne: "खेत सुरक्षित भयो",
		en: "Farm plot saved"
	},
	plotSaveFail: {
		ne: "सुरक्षित भएन। इन्टरनेट जाँचेर फेरि प्रयास गर्नुहोस्।",
		en: "Not saved. Check your connection and try again."
	},
	unsaved: {
		ne: "सुरक्षित नगरिएको परिवर्तन छ",
		en: "You have unsaved changes"
	},
	unsavedConfirm: {
		ne: "यो पृष्ठ छोड्नुहोस्? सुरक्षित नगरिएको सिमाना परिवर्तन हराउनेछ।",
		en: "Leave this page? Unsaved boundary changes will be lost."
	},
	tileFail: {
		ne: "नक्सा टाइल लोड भएन; ढिलो इन्टरनेट हुन सक्छ।",
		en: "Some map tiles failed to load; your connection may be slow."
	},
	resolutionNote: {
		ne: "नक्सा नजिक्याउँदा NASA उपग्रह डाटाको रिजोल्युसन बढ्दैन।",
		en: "Zooming the map does not increase NASA satellite data resolution."
	},
	savedPlot: {
		ne: "सुरक्षित खेत",
		en: "Saved plot"
	}
};
var translate = (lang, k) => dict[k][lang];
var neDigits = "०१२३४५६७८९";
function num(lang, v) {
	const s = String(v);
	return lang === "ne" ? s.replace(/\d/g, (d) => neDigits[+d] ?? d) : s;
}
function fmtDate(lang, isoStr) {
	return new Date(isoStr).toLocaleDateString(lang === "ne" ? "ne-NP" : "en-GB", {
		day: "numeric",
		month: "short",
		timeZone: "Asia/Kathmandu"
	});
}
function geometry(pts) {
	const ring = pts.map(([lat, lng]) => [lng, lat]);
	const first = ring[0];
	if (first) ring.push([...first]);
	return {
		type: "Polygon",
		coordinates: [ring]
	};
}
/** Geodesic polygon area on a sphere (m²). Input is [lat, lng] vertices, open ring. */
function polygonAreaM2(pts) {
	if (pts.length < 3) return 0;
	return index_default(geometry(pts));
}
/** At least 3 distinct points, non-zero area, no self-intersecting edges. */
function isValidPolygon(pts) {
	if (pts.length < 3) return false;
	if (pts.some(([lat, lng]) => !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180)) return false;
	if (new Set(pts.map((p) => p.join(","))).size !== pts.length) return false;
	if (polygonAreaM2(pts) <= 0) return false;
	return index_default$1(geometry(pts)).features.length === 0;
}
/** GeoJSON uses [lng, lat]; ring is closed. Coordinates are kept exactly as drawn. */
function toFeature(name, pts) {
	if (!isValidPolygon(pts)) throw new Error("Invalid farm boundary");
	const area = polygonAreaM2(pts);
	const ring = pts.map(([lat, lng]) => [lng, lat]);
	const first = ring[0];
	if (first) ring.push([...first]);
	return {
		type: "Feature",
		properties: {
			name,
			area_hectares: Math.round(area / 1e4 * 1e4) / 1e4,
			area_m2: Math.round(area)
		},
		geometry: {
			type: "Polygon",
			coordinates: [ring]
		}
	};
}
var DEMO_USER_ID = "demo-farmer-local";
var DEMO_PROFILE_KEY = "naip.demo_profile";
var FARM_FIELDS_KEY = "naip.farm_fields";
var DEFAULT_PROFILE = { name: "Demo Farmer" };
function isBrowser$1() {
	return typeof window !== "undefined" && typeof localStorage !== "undefined";
}
/** Load the demo profile from localStorage; returns default if absent or SSR. */
function loadDemoProfile() {
	if (!isBrowser$1()) return { ...DEFAULT_PROFILE };
	try {
		const raw = localStorage.getItem(DEMO_PROFILE_KEY);
		if (!raw) return { ...DEFAULT_PROFILE };
		return { name: JSON.parse(raw).name?.trim() || DEFAULT_PROFILE.name };
	} catch {
		return { ...DEFAULT_PROFILE };
	}
}
/** Persist the demo profile to localStorage. */
function saveDemoProfile(profile) {
	if (!isBrowser$1()) return;
	try {
		localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(profile));
	} catch {}
}
/**
* Clear all naip.* localStorage keys and restore the default demo profile.
* Does NOT reload the page — the caller decides whether to reload.
*/
function resetDemoData() {
	if (!isBrowser$1()) return;
	try {
		const keysToRemove = [];
		for (let i = 0; i < localStorage.length; i++) {
			const k = localStorage.key(i);
			if (k && k.startsWith("naip.")) keysToRemove.push(k);
		}
		keysToRemove.forEach((k) => localStorage.removeItem(k));
	} catch {}
}
function isBrowser() {
	return typeof window !== "undefined" && typeof localStorage !== "undefined";
}
function readAll() {
	if (!isBrowser()) return [];
	try {
		const raw = localStorage.getItem(FARM_FIELDS_KEY);
		if (!raw) return [];
		return JSON.parse(raw);
	} catch {
		return [];
	}
}
function writeAll(fields) {
	if (!isBrowser()) return;
	try {
		localStorage.setItem(FARM_FIELDS_KEY, JSON.stringify(fields));
	} catch {}
}
/**
* Load all registered agricultural plots for the demo account from localStorage.
*/
async function loadUserFarmFields() {
	return [...readAll()].sort((a, b) => {
		if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
		return b.createdAt.localeCompare(a.createdAt);
	});
}
/**
* Create a new farm field and persist it to localStorage.
*/
async function createFarmField(params) {
	const feature = toFeature(params.fieldName, params.boundary);
	const latSum = params.boundary.reduce((s, p) => s + p[0], 0);
	const lonSum = params.boundary.reduce((s, p) => s + p[1], 0);
	const centerLat = Math.round(latSum / params.boundary.length * 1e4) / 1e4;
	const centerLon = Math.round(lonSum / params.boundary.length * 1e4) / 1e4;
	const newField = {
		id: crypto.randomUUID(),
		userId: DEMO_USER_ID,
		fieldName: params.fieldName.trim() || "My Farm Plot",
		province: params.province,
		district: params.district,
		municipality: params.municipality,
		wardNumber: params.wardNumber,
		latitude: centerLat,
		longitude: centerLon,
		boundary: params.boundary,
		boundaryFeature: feature,
		areaM2: feature.properties.area_m2,
		areaUnit: "m2",
		cropType: params.cropType,
		cropVariety: params.cropVariety,
		plantingDate: params.plantingDate,
		irrigationType: params.irrigationType ?? "rainfed",
		soilType: params.soilType,
		isPrimary: params.isPrimary ?? false,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	const existing = readAll();
	let updated = params.isPrimary ? existing.map((f) => ({
		...f,
		isPrimary: false
	})) : existing;
	updated = [newField, ...updated];
	writeAll(updated);
	return newField;
}
/**
* Delete a farm field from localStorage.
*/
async function deleteFarmField(fieldId) {
	writeAll(readAll().filter((f) => f.id !== fieldId));
}
/**
* Set a field as primary for the demo account.
* The userId param is kept for signature compatibility but ignored.
*/
async function setPrimaryFarmField(fieldId, _userId) {
	writeAll(readAll().map((f) => ({
		...f,
		isPrimary: f.id === fieldId
	})));
}
var defaults = {
	minRain7: 15,
	minSoil: 25,
	maxTemp: 32,
	minBattery: 30
};
var Ctx = (0, import_react.createContext)(null);
function load(k, fb) {
	try {
		if (typeof localStorage !== "undefined") {
			const v = localStorage.getItem(k);
			return v ? JSON.parse(v) : fb;
		}
		return fb;
	} catch {
		return fb;
	}
}
function AppProvider({ children }) {
	const [demoProfile, setDemoProfileState] = (0, import_react.useState)(() => loadDemoProfile());
	const [currentGpsLocationName, setCurrentGpsLocationName] = (0, import_react.useState)(null);
	const [farmFields, setFarmFields] = (0, import_react.useState)([]);
	const [selectedField, setSelectedFieldState] = (0, import_react.useState)(null);
	const [lang, setLangS] = (0, import_react.useState)("ne");
	const [thresholds, setThS] = (0, import_react.useState)(defaults);
	const [inspections, setInsp] = (0, import_react.useState)([]);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [activeView, setActiveViewS] = (0, import_react.useState)("landing");
	const reloadFarmFields = async () => {
		const fields = await loadUserFarmFields();
		setFarmFields(fields);
		if (fields.length > 0) {
			const savedId = typeof localStorage !== "undefined" ? localStorage.getItem("naip.selected_field_id") : null;
			const matched = fields.find((f) => f.id === savedId) ?? fields.find((f) => f.isPrimary) ?? fields[0];
			setSelectedFieldState(matched ?? null);
		} else setSelectedFieldState(null);
	};
	(0, import_react.useEffect)(() => {
		setLangS(load("naip.lang", "ne"));
		setThS(load("naip.th", defaults));
		setInsp(load("naip.insp", []));
		setActiveViewS(load("naip.view", "landing"));
		setCurrentGpsLocationName(load("naip.gps_loc", null));
		reloadFarmFields().finally(() => setReady(true));
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.lang = lang;
	}, [lang]);
	const save = (k, v) => {
		try {
			if (typeof localStorage !== "undefined") localStorage.setItem(k, JSON.stringify(v));
		} catch {}
	};
	const setSelectedField = (f) => {
		setSelectedFieldState(f);
		if (f) save("naip.selected_field_id", f.id);
		else if (typeof localStorage !== "undefined") localStorage.removeItem("naip.selected_field_id");
	};
	const updateDemoProfile = (p) => {
		setDemoProfileState(p);
		saveDemoProfile(p);
	};
	const resetDemoData$1 = () => {
		resetDemoData();
		setDemoProfileState(loadDemoProfile());
		setFarmFields([]);
		setSelectedFieldState(null);
		setThS(defaults);
		setInsp([]);
		setLangS("ne");
	};
	const field = selectedField ? {
		id: selectedField.id,
		name: selectedField.fieldName,
		crop: selectedField.cropType || "rice",
		plantingDate: selectedField.plantingDate,
		municipality: selectedField.municipality ?? "unspecified",
		boundary: selectedField.boundary
	} : null;
	const setField = (legacyField) => {
		if (!legacyField) {
			setSelectedField(null);
			return;
		}
		const matched = farmFields.find((f) => f.id === legacyField.id);
		if (matched) setSelectedField(matched);
	};
	const value = {
		demoProfile,
		updateDemoProfile,
		resetDemoData: resetDemoData$1,
		currentGpsLocationName,
		setCurrentGpsLocationName: (n) => {
			setCurrentGpsLocationName(n);
			save("naip.gps_loc", n);
		},
		farmFields,
		selectedField,
		setSelectedField,
		reloadFarmFields,
		field,
		setField,
		lang,
		setLang: (l) => {
			setLangS(l);
			save("naip.lang", l);
		},
		t: (k) => translate(lang, k),
		thresholds,
		setThresholds: (t) => (setThS(t), save("naip.th", t)),
		inspections,
		addInspection: (i) => {
			const next = [i, ...inspections];
			setInsp(next);
			save("naip.insp", next);
		},
		ready,
		activeView,
		setActiveView: (v) => (setActiveViewS(v), save("naip.view", v))
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value,
		children
	});
}
function useApp() {
	const c = (0, import_react.useContext)(Ctx);
	if (!c) throw new Error("useApp outside provider");
	return c;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
export { fmtDate as a, useApp as c, deleteFarmField as i, cn as n, num as o, createFarmField as r, setPrimaryFarmField as s, AppProvider as t };
