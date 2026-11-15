//#region node_modules/.nitro/vite/services/ssr/assets/crop-advisory-engine-51jRVodT.js
/**
* 1. Existing Crop Growth & Harvest Catalog
*/
var CROP_HARVEST_AGRONOMY_CATALOG = {
	potato: {
		cropId: "potato",
		nameEn: "Potato",
		nameNe: "आलु",
		family: "Solanaceae",
		typicalDurationDaysMin: 90,
		typicalDurationDaysMax: 120,
		varietyDurations: {
			"kufri jyoti": {
				minDays: 100,
				maxDays: 120,
				notes: "Late blight tolerant, medium-late maturity"
			},
			cardinal: {
				minDays: 90,
				maxDays: 105,
				notes: "Medium maturity, red skin"
			},
			"janak dev": {
				minDays: 110,
				maxDays: 125,
				notes: "NARC released, high yielding hill/terai"
			},
			"khumal rato": {
				minDays: 105,
				maxDays: 120,
				notes: "NARC mid-hill variety"
			},
			"khumal seto": {
				minDays: 95,
				maxDays: 110,
				notes: "Early to medium maturity"
			},
			deshi: {
				minDays: 85,
				maxDays: 100,
				notes: "Local early variety"
			}
		},
		gddBaseTempC: 7,
		optimalHarvestSoilMoistureMinPct: 15,
		optimalHarvestSoilMoistureMaxPct: 22,
		excessiveRainRiskThresholdMmDay: 15,
		visibleMaturityIndicators: [
			{
				indicatorEn: "Foliage yellowing and natural vine dieback (senescence) across >70% of plot.",
				indicatorNe: "बोटका ७०% भन्दा बढी पातहरू पहेँलिँदै सुक्न थाल्नु (senescence)।"
			},
			{
				indicatorEn: "Skin-set test: Tuber skin does not peel off when rubbed firmly with thumb.",
				indicatorNe: "बोक्रा परीक्षण: बुढी औंलाले कडासँग रगड्दा आलुको बोक्रा नउखेलिनु।"
			},
			{
				indicatorEn: "Stolon separation: Tubers detach easily from underground roots without tearing flesh.",
				indicatorNe: "जराबाट सजिलै आलुका दानाहरू अलग हुनु।"
			},
			{
				indicatorEn: "Vine dehaulming completed 10-14 days prior to harvest for skin hardening.",
				indicatorNe: "खन्नु भन्दा १०-१४ दिन अगाडि बोटको माथिल्लो भाग (झार) काटिएको हुनुपर्छ।"
			}
		],
		expertAssessmentTrigger: "If persistent waterlogging occurs within 10 days of planned harvest or tuber rotting is detected, consult local Krishi Sakha/NARC technician immediately.",
		citation: {
			sourceTitle: "Potato Production Technology in Nepal (Technical Bulletin)",
			publishingInstitution: "Nepal Agricultural Research Council (NARC) - National Potato Research Program (NPRP), Khumaltar",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2021
		}
	},
	rice: {
		cropId: "rice",
		nameEn: "Paddy / Rice",
		nameNe: "धान",
		family: "Poaceae",
		typicalDurationDaysMin: 115,
		typicalDurationDaysMax: 145,
		varietyDurations: {
			sabitri: {
				minDays: 135,
				maxDays: 145,
				notes: "Medium late maturity, Terai staple"
			},
			"radha-4": {
				minDays: 120,
				maxDays: 130,
				notes: "Drought tolerant, early-medium"
			},
			"khumal-4": {
				minDays: 130,
				maxDays: 140,
				notes: "Mid-hills recommended"
			},
			"makwanpur-1": {
				minDays: 140,
				maxDays: 150,
				notes: "Late maturity, submergence tolerant"
			},
			"bahuguni-1": {
				minDays: 115,
				maxDays: 125,
				notes: "Short duration"
			}
		},
		gddBaseTempC: 10,
		optimalHarvestSoilMoistureMinPct: 18,
		optimalHarvestSoilMoistureMaxPct: 24,
		excessiveRainRiskThresholdMmDay: 25,
		visibleMaturityIndicators: [
			{
				indicatorEn: "Panicles turn golden-yellow across >85% of canopy while base stems remain lightly green.",
				indicatorNe: "बालाको ८५% भन्दा बढी भाग सुनौलो पहेँलो रङमा परिणत हुनु।"
			},
			{
				indicatorEn: "Grain moisture content reaches approximately 20-22% (firm kernel when crushed with teeth).",
				indicatorNe: "दाँतले टोक्दा दाना कडा भई फुट्नु (२०-२२% चिस्यान)।"
			},
			{
				indicatorEn: "Field drainage completed 10-12 days before combine or manual cutting.",
				indicatorNe: "काट्नुभन्दा १०-१२ दिन अघि खेतको पानी पूर्ण रूपमा निकास गरिएको हुनुपर्छ।"
			}
		],
		expertAssessmentTrigger: "Assess lodging risk if heavy precipitation is forecast within 5 days of physiological maturity.",
		citation: {
			sourceTitle: "Package of Practices for Rice Cultivation in Nepal",
			publishingInstitution: "National Rice Research Program (NRRP), NARC, Hardinath, Nepal",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2022
		}
	},
	maize: {
		cropId: "maize",
		nameEn: "Maize / Corn",
		nameNe: "मकै",
		family: "Poaceae",
		typicalDurationDaysMin: 100,
		typicalDurationDaysMax: 130,
		gddBaseTempC: 10,
		optimalHarvestSoilMoistureMinPct: 14,
		optimalHarvestSoilMoistureMaxPct: 20,
		excessiveRainRiskThresholdMmDay: 20,
		visibleMaturityIndicators: [{
			indicatorEn: "Husk leaves turn pale brown and dry completely around the ear.",
			indicatorNe: "घोगाको खोस्टा सुकेर खैरो-पहेँलो हुनु।"
		}, {
			indicatorEn: "Black layer formation visible at the tip of kernels where attached to the cob.",
			indicatorNe: "दानामा कालो तह (black layer) प्रष्ट देखिनु।"
		}],
		expertAssessmentTrigger: "Inspect for ear rot or mycotoxin risk if prolonged unseasonal rains occur during cob drying.",
		citation: {
			sourceTitle: "Maize Production Technologies in Nepal",
			publishingInstitution: "National Maize Research Program (NMRP), Rampur, Chitwan, NARC",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2020
		}
	},
	wheat: {
		cropId: "wheat",
		nameEn: "Wheat",
		nameNe: "गहुँ",
		family: "Poaceae",
		typicalDurationDaysMin: 110,
		typicalDurationDaysMax: 135,
		gddBaseTempC: 4.5,
		optimalHarvestSoilMoistureMinPct: 12,
		optimalHarvestSoilMoistureMaxPct: 18,
		excessiveRainRiskThresholdMmDay: 10,
		visibleMaturityIndicators: [{
			indicatorEn: "Peduncle (stem directly below spike) turns golden and dry.",
			indicatorNe: "बालामुनिको डाँठ पूर्णतया सुकेर सुनौलो हुनु।"
		}, {
			indicatorEn: "Grain kernel cannot be indented with thumbnail (hard dough stage, <14% moisture).",
			indicatorNe: "औंलाको नङले दाना थिच्दा नथिचिने हुनु।"
		}],
		expertAssessmentTrigger: "High temperature terminal heat stress (>32°C) can cause premature grain shriveling.",
		citation: {
			sourceTitle: "Wheat Production Guidelines for Nepal",
			publishingInstitution: "National Wheat Research Program (NWRP), Bhairahawa, NARC",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2021
		}
	},
	tomato: {
		cropId: "tomato",
		nameEn: "Tomato",
		nameNe: "गोलभेंडा",
		family: "Solanaceae",
		typicalDurationDaysMin: 75,
		typicalDurationDaysMax: 105,
		gddBaseTempC: 10,
		optimalHarvestSoilMoistureMinPct: 18,
		optimalHarvestSoilMoistureMaxPct: 26,
		excessiveRainRiskThresholdMmDay: 15,
		visibleMaturityIndicators: [{
			indicatorEn: "Fruit color transition from breaker to turning/pink stage depending on market distance.",
			indicatorNe: "फलको रङ हरियोबाट हल्का गुलाबी/रातोमा परिवर्तन हुनु (breaker stage)।"
		}],
		expertAssessmentTrigger: "Inspect for late blight or fruit borer in high relative humidity (>80%) conditions.",
		citation: {
			sourceTitle: "Commercial Tomato Production in Tunnel and Open Field",
			publishingInstitution: "Horticulture Research Division, NARC, Khumaltar",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2020
		}
	}
};
/**
* 2. Next Crop Suitability & Rotation Catalog (NARC & FAO Verified)
*/
var NEXT_CROP_SUITABILITY_CATALOG = [
	{
		cropId: "mungbean",
		nameEn: "Mungbean (Spring Pulse)",
		nameNe: "मुङ (वसन्त दलहन)",
		family: "Fabaceae",
		suitablePlantingMonths: [
			2,
			3,
			4
		],
		growthDurationDays: [60, 75],
		tempRangeC: [18, 38],
		optimalTempRangeC: [25, 33],
		waterRequirementMm: [250, 350],
		compatibleSoilTextures: [
			"loam",
			"sandy loam",
			"clay loam",
			"alluvial",
			"silt loam"
		],
		toleratesHeavyClay: false,
		irrigationNeeded: false,
		incompatiblePrecedingFamilies: ["Fabaceae"],
		beneficialPrecedingFamilies: ["Solanaceae", "Poaceae"],
		rotationBenefitsEn: "Biological nitrogen fixation (+35 to +50 kg N/ha via Rhizobium symbiosis). Short 60-70 day window easily fits between winter potato/wheat and monsoon paddy.",
		rotationBenefitsNe: "माटोमा जैविक नाइट्रोजन (३५-५० के.जी./हेक्टर) थप्दछ। आलु वा गहुँपछि बर्खे धान रोप्नु अघिको खाली समयमा ६०-७० दिनमै पाक्छ।",
		rotationRisksEn: "Vulnerable to heavy pre-monsoon waterlogging. Soil must have good internal drainage.",
		rotationRisksNe: "खेतमा पानी जम्ने समस्या भएमा जरा कुहिने जोखिम रहन्छ।",
		agronomicRequirementsEn: "Requires warm seedbed (>20°C soil temperature) for rapid emergence. 1-2 light irrigations if winter residual moisture is depleted.",
		agronomicRequirementsNe: "बिउ उम्रिन कम्तीमा २०°C तापक्रम चाहिन्छ। माटोमा चिस्यान कम भएमा १-२ पटक हल्का सिँचाइ आवश्यक पर्छ।",
		citation: {
			sourceTitle: "Spring Mungbean Production Technology in Cereal-Based Systems",
			publishingInstitution: "National Grain Legumes Research Program (NGLRP), Rampur, Chitwan, NARC",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2022
		}
	},
	{
		cropId: "maize_spring",
		nameEn: "Spring Maize",
		nameNe: "वसन्त मकै",
		family: "Poaceae",
		suitablePlantingMonths: [2, 3],
		growthDurationDays: [95, 115],
		tempRangeC: [15, 35],
		optimalTempRangeC: [22, 30],
		waterRequirementMm: [400, 550],
		compatibleSoilTextures: [
			"alluvial",
			"loam",
			"silt loam",
			"clay loam"
		],
		toleratesHeavyClay: true,
		irrigationNeeded: true,
		incompatiblePrecedingFamilies: ["Poaceae"],
		beneficialPrecedingFamilies: ["Fabaceae", "Solanaceae"],
		rotationBenefitsEn: "Deep root system utilizes residual fertilizers left behind from heavy-feeding potato crops. Breaks root-knot nematode cycles.",
		rotationBenefitsNe: "आलु खेतीमा हालिएको बाँकी रासायनिक तथा प्राङ्गारिक मलको उच्चतम सदुपयोग गर्दछ।",
		rotationRisksEn: "High water requirement during silking and tasseling; requires 3-4 assured irrigations before monsoon.",
		rotationRisksNe: "जुँगा हाल्ने र घोगा लाग्ने बेलामा खडेरी परेमा ३-४ पटक सिँचाइको भरपर्दो व्यवस्था चाहिन्छ।",
		agronomicRequirementsEn: "Optimal sowing when soil temperature reaches 15°C. Recommended varieties: Rampur Composite, Arun-2, Poshelo Makai-1.",
		agronomicRequirementsNe: "उचित रोपाईं समय फागुन-चैत। सिफारिस जातहरू: रामपुर कम्पोजिट, अरुण-२, पोषिलो मकै-१।",
		citation: {
			sourceTitle: "Spring Maize Production Package for Terai and Inner-Terai",
			publishingInstitution: "National Maize Research Program (NMRP), Rampur, NARC",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2021
		}
	},
	{
		cropId: "dhaincha",
		nameEn: "Dhaincha (Green Manure)",
		nameNe: "ढैँचा (हरियो मल)",
		family: "Fabaceae",
		suitablePlantingMonths: [
			3,
			4,
			5
		],
		growthDurationDays: [45, 60],
		tempRangeC: [20, 42],
		optimalTempRangeC: [25, 36],
		waterRequirementMm: [200, 300],
		compatibleSoilTextures: [
			"alluvial",
			"clay loam",
			"sandy loam",
			"silt loam",
			"loam"
		],
		toleratesHeavyClay: true,
		irrigationNeeded: false,
		incompatiblePrecedingFamilies: [],
		beneficialPrecedingFamilies: ["Solanaceae", "Poaceae"],
		rotationBenefitsEn: "Produces 15-25 tons/ha of succulent green biomass adding 80-100 kg organic N/ha when plowed in at 45-50 days before monsoon paddy.",
		rotationBenefitsNe: "रोपेको ४५-५० दिनमा माटोमा जोतेर मिलाउँदा प्रति हेक्टर ८०-१०० के.जी. नाइट्रोजन र प्राङ्गारिक पदार्थ थप गर्दछ।",
		rotationRisksEn: "Produces minimal direct cash yield; value is purely soil organic matter restoration.",
		rotationRisksNe: "यसबाट प्रत्यक्ष नगद आम्दानी हुँदैन, तर माटोको उर्वरशक्ति पुनर्स्थापनामा अतुलनीय छ।",
		agronomicRequirementsEn: "Broadcast seed at 40-50 kg/ha with pre-monsoon showers. Incorporate into mud 10 days before paddy transplanting.",
		agronomicRequirementsNe: "प्रति हेक्टर ४०-५० के.जी. बिउ छर्नुपर्छ। धान रोप्नु १०-१२ दिन अगाडि हिल्याएर माटोमा मिलाउनुपर्छ।",
		citation: {
			sourceTitle: "Green Manuring Techniques for Soil Fertility Management",
			publishingInstitution: "Soil Science Division, NARC, Khumaltar, Lalitpur",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2019
		}
	},
	{
		cropId: "okra",
		nameEn: "Okra / Lady's Finger (Spring-Summer)",
		nameNe: "भिन्डी / रामतोरियाँ",
		family: "Malvaceae",
		suitablePlantingMonths: [
			2,
			3,
			4
		],
		growthDurationDays: [55, 90],
		tempRangeC: [20, 38],
		optimalTempRangeC: [24, 32],
		waterRequirementMm: [300, 450],
		compatibleSoilTextures: [
			"sandy loam",
			"loam",
			"clay loam",
			"alluvial"
		],
		toleratesHeavyClay: false,
		irrigationNeeded: true,
		incompatiblePrecedingFamilies: ["Malvaceae"],
		beneficialPrecedingFamilies: [
			"Poaceae",
			"Fabaceae",
			"Solanaceae"
		],
		rotationBenefitsEn: "High-value commercial cash vegetable with staggered harvest starting in 50-55 days. Unrelated botanical family to potato or cereals.",
		rotationBenefitsNe: "५०-५५ दिनमै टिप्न सुरु हुने उच्च मूल्य नगदे तरकारी। आलु र धान भन्दा फरक वनस्पतीय परिवार।",
		rotationRisksEn: "Sensitive to soil damping-off in cold or soggy soils. Susceptible to Yellow Vein Mosaic Virus (YVMV) in late summer.",
		rotationRisksNe: "चिसो वा अत्यधिक चिसो माटोमा बिउ कुहिने जोखिम।",
		agronomicRequirementsEn: "Soak seed for 12 hours before sowing. Recommended varieties: Arka Anamika, Parbhani Kranti.",
		agronomicRequirementsNe: "बिउ छर्नुअघि १२ घण्टा पानीमा भिजाउनुपर्छ। सिफारिस जातहरू: अर्का अनामिका, परभनी क्रान्ति।",
		citation: {
			sourceTitle: "Commercial Vegetable Production Manual",
			publishingInstitution: "Vegetable Development Directorate, Ministry of Agriculture, Nepal",
			referenceUrl: "https://moald.gov.np/",
			publicationYear: 2021
		}
	},
	{
		cropId: "cowpea",
		nameEn: "Cowpea (Bodi)",
		nameNe: "बोडी",
		family: "Fabaceae",
		suitablePlantingMonths: [
			2,
			3,
			4,
			5
		],
		growthDurationDays: [65, 85],
		tempRangeC: [18, 38],
		optimalTempRangeC: [22, 32],
		waterRequirementMm: [300, 400],
		compatibleSoilTextures: [
			"sandy loam",
			"loam",
			"alluvial"
		],
		toleratesHeavyClay: false,
		irrigationNeeded: false,
		incompatiblePrecedingFamilies: ["Fabaceae"],
		beneficialPrecedingFamilies: ["Solanaceae", "Poaceae"],
		rotationBenefitsEn: "Simultaneously provides edible green pods for fresh market income and leaves nitrogen-rich biomass (+40 kg N/ha).",
		rotationBenefitsNe: "ताजा हरियो कोसा बजारमा बेचेर आम्दानी हुनुका साथै माटोमा नाइट्रोजन र प्राङ्गारिक पदार्थ थपिन्छ।",
		rotationRisksEn: "Aphid infestation during warm dry spells; scout field perimeters regularly.",
		rotationRisksNe: "सुख्खा मौसममा लाही कीरा (aphids) को प्रकोप हुन सक्छ।",
		agronomicRequirementsEn: "Tolerates moderate drought. Recommended varieties: Malepatan-1, Prakash, Kohalpur Local.",
		agronomicRequirementsNe: "सिफारिस जातहरू: मालेपाटन-१, प्रकाश, कोहलपुर लोकल।",
		citation: {
			sourceTitle: "Grain Legumes and Vegetable Cowpea Cultivation",
			publishingInstitution: "National Grain Legumes Research Program (NGLRP), NARC",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2020
		}
	},
	{
		cropId: "sesame",
		nameEn: "Sesame (Til)",
		nameNe: "तिल",
		family: "Pedaliaceae",
		suitablePlantingMonths: [3, 4],
		growthDurationDays: [80, 95],
		tempRangeC: [22, 40],
		optimalTempRangeC: [26, 34],
		waterRequirementMm: [250, 350],
		compatibleSoilTextures: [
			"sandy loam",
			"loam",
			"alluvial"
		],
		toleratesHeavyClay: false,
		irrigationNeeded: false,
		incompatiblePrecedingFamilies: ["Pedaliaceae"],
		beneficialPrecedingFamilies: ["Solanaceae", "Poaceae"],
		rotationBenefitsEn: "Low input, high value oilseed crop that thrives in post-winter residual moisture and high solar radiation.",
		rotationBenefitsNe: "कम खर्चमा बढी आम्दानी दिने तेलहन बाली, जसलाई धेरै सिँचाइ चाहिँदैन।",
		rotationRisksEn: "Highly sensitive to water stagnation at germination and seedling stages.",
		rotationRisksNe: "उम्रिने बेलामा पानी जमेमा तुरुन्तै कुहिने जोखिम।",
		agronomicRequirementsEn: "Sow in well-drained pulverized seedbed. Variety: Til No. 1.",
		agronomicRequirementsNe: "राम्रो निकास भएको हलुका माटोमा लगाउनुपर्छ।",
		citation: {
			sourceTitle: "Oilseed Crops Technology in Nepal",
			publishingInstitution: "National Oilseed Research Program (NORP), Nawalpur, Sarlahi, NARC",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2019
		}
	}
];
/**
* Scientific Crop Rotation & Planting Advisory Rules Engine
* Implements:
* 1. Existing Crop Harvest Window Estimator (NARC Agronomy grounded)
* 2. Next Crop Suitability Scoring Engine (NARC, FAO, NASA Environmental fusion)
* 3. Crop Rotation Calendar Timeline Generator
*/
/**
* 1. Compute Existing Crop Harvest Advice
*/
function computeHarvestAdvice(field, env) {
	const agronomy = CROP_HARVEST_AGRONOMY_CATALOG[(field.cropType || "").toLowerCase().trim()];
	const plantingTime = new Date(field.plantingDate).getTime();
	const diffDays = Math.max(0, Math.floor((Date.now() - plantingTime) / 864e5));
	if (!agronomy) {
		const fallbackStart = new Date(plantingTime + 7776e6).toISOString().slice(0, 10);
		const fallbackEnd = new Date(plantingTime + 10368e6).toISOString().slice(0, 10);
		return {
			hasCrop: Boolean(field.cropType),
			cropName: field.cropType || "Unspecified Crop",
			cropNameNe: field.cropType || "बाली",
			cropVariety: field.cropVariety,
			plantingDate: field.plantingDate,
			cropAgeDays: diffDays,
			expectedDurationRangeDays: [90, 120],
			estimatedHarvestStart: fallbackStart,
			estimatedHarvestEnd: fallbackEnd,
			isHarvestWindowActive: diffDays >= 90 && diffDays <= 120,
			isOverdue: diffDays > 120,
			environmentalRiskFactors: [{
				factor: "Crop Growth Duration",
				level: "medium",
				description: `Specific agronomic maturity curves for '${field.cropType}' are not yet calibrated in NARC database. Using standard 90-120 day reference.`
			}],
			visibleMaturityChecklist: [{
				indicatorEn: "Inspect grain hardness, pod color change, or natural leaf yellowing.",
				indicatorNe: "दानाको कडापन वा पातको पहेँलोपन अवलोकन गर्नुहोस्।"
			}],
			expertAssessmentNote: "Contact your local agricultural extension service (कृषि ज्ञान केन्द्र) for crop-specific guidance.",
			citation: {
				sourceTitle: "General Crop Production Manual",
				publishingInstitution: "Department of Agriculture, Nepal",
				referenceUrl: "https://doanepal.gov.np/",
				publicationYear: 2020
			},
			scientificConfidence: "limited",
			confidenceExplanation: `Lack of variety-specific phenological curves for '${field.cropType}'. Advice requires in-field validation.`
		};
	}
	let minDays = agronomy.typicalDurationDaysMin;
	let maxDays = agronomy.typicalDurationDaysMax;
	const normVariety = (field.cropVariety || "").toLowerCase().trim();
	if (agronomy.varietyDurations && normVariety) {
		for (const [varKey, varData] of Object.entries(agronomy.varietyDurations)) if (normVariety.includes(varKey) || varKey.includes(normVariety)) {
			minDays = varData.minDays;
			maxDays = varData.maxDays;
			break;
		}
	}
	const harvestStartDate = new Date(plantingTime + minDays * 864e5).toISOString().slice(0, 10);
	const harvestEndDate = new Date(plantingTime + maxDays * 864e5).toISOString().slice(0, 10);
	const isHarvestWindowActive = diffDays >= minDays && diffDays <= maxDays;
	const isOverdue = diffDays > maxDays;
	const riskFactors = [];
	if (env.recentRainSumMm !== null && env.recentRainSumMm > agronomy.excessiveRainRiskThresholdMmDay) riskFactors.push({
		factor: "Excessive Rainfall / Waterlogging",
		level: "high",
		description: `Recent precipitation (${env.recentRainSumMm.toFixed(1)} mm) exceeds safe harvest threshold (${agronomy.excessiveRainRiskThresholdMmDay} mm). Saturated soil increases tuber rotting (bacterial soft rot) and harvesting machinery sinkage. Delay tuber lifting until soil surface dries.`
	});
	else if (env.recentRainSumMm !== null && env.recentRainSumMm > 5) riskFactors.push({
		factor: "Moderate Moisture",
		level: "low",
		description: `Recent rainfall (${env.recentRainSumMm.toFixed(1)} mm) is within manageable range. Ensure adequate soil aeration before field operations.`
	});
	if (env.soilMoisturePct !== null) {
		if (env.soilMoisturePct > agronomy.optimalHarvestSoilMoistureMaxPct) riskFactors.push({
			factor: "Soil Moisture Wet Horizon",
			level: "medium",
			description: `Soil moisture (${env.soilMoisturePct.toFixed(1)}%) is above optimal dry-down window (${agronomy.optimalHarvestSoilMoistureMinPct}-${agronomy.optimalHarvestSoilMoistureMaxPct}%). Digging in overly moist soil tears potato skin and promotes post-harvest fungal decay.`
		});
		else if (env.soilMoisturePct < agronomy.optimalHarvestSoilMoistureMinPct) riskFactors.push({
			factor: "Hard Soil Crusting",
			level: "low",
			description: `Soil moisture (${env.soilMoisturePct.toFixed(1)}%) is low. In heavy clay soils, dry soil may cause tuber bruising during mechanical lifting.`
		});
	}
	if (env.recentAvgTempC !== null && env.recentAvgTempC > 28 && agronomy.cropId === "potato") riskFactors.push({
		factor: "Elevated Late-Season Temperature",
		level: "medium",
		description: `Mean temperature (${env.recentAvgTempC.toFixed(1)}°C) exceeds optimal potato tuber bulking temperature (18-22°C). High soil temperature accelerates vine death but impairs starch accumulation. Prompt harvest and cool shaded curing are advised.`
	});
	return {
		hasCrop: true,
		cropName: agronomy.nameEn,
		cropNameNe: agronomy.nameNe,
		cropVariety: field.cropVariety,
		plantingDate: field.plantingDate,
		cropAgeDays: diffDays,
		expectedDurationRangeDays: [minDays, maxDays],
		estimatedHarvestStart: harvestStartDate,
		estimatedHarvestEnd: harvestEndDate,
		isHarvestWindowActive,
		isOverdue,
		environmentalRiskFactors: riskFactors,
		visibleMaturityChecklist: agronomy.visibleMaturityIndicators,
		expertAssessmentNote: agronomy.expertAssessmentTrigger,
		citation: agronomy.citation,
		scientificConfidence: "high",
		confidenceExplanation: `Grounded in NARC ${agronomy.nameEn} growth models with real planting date (${field.plantingDate}) and satellite agrometeorology.`
	};
}
/**
* 2. Next Crop Suitability Engine
*/
function evaluateNextCrops(field, env) {
	const currentMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
	const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
	const targetWindowMonths = [
		currentMonth,
		nextMonth,
		nextMonth === 12 ? 1 : nextMonth + 1
	];
	const currentFamily = CROP_HARVEST_AGRONOMY_CATALOG[(field.cropType || "").toLowerCase().trim()]?.family;
	const results = [];
	for (const candidate of NEXT_CROP_SUITABILITY_CATALOG) {
		const compReasons = [];
		const incompReasons = [];
		const missingInfo = [];
		const isSeasonMatch = candidate.suitablePlantingMonths.some((m) => targetWindowMonths.includes(m));
		if (isSeasonMatch) compReasons.push(`Optimal planting window coincides with upcoming seasonal calendar (Months: ${candidate.suitablePlantingMonths.join(", ")}).`);
		else incompReasons.push(`Current season is outside optimal planting window (Requires sowing in Months: ${candidate.suitablePlantingMonths.join(", ")}).`);
		if (env.recentAvgTempC !== null) if (env.recentAvgTempC >= candidate.optimalTempRangeC[0] && env.recentAvgTempC <= candidate.optimalTempRangeC[1]) compReasons.push(`Observed temperature (${env.recentAvgTempC.toFixed(1)}°C) is directly in the optimal vegetative development range (${candidate.optimalTempRangeC[0]}–${candidate.optimalTempRangeC[1]}°C).`);
		else if (env.recentAvgTempC >= candidate.tempRangeC[0] && env.recentAvgTempC <= candidate.tempRangeC[1]) compReasons.push(`Observed temperature (${env.recentAvgTempC.toFixed(1)}°C) is tolerable, though slightly outside optimal range.`);
		else incompReasons.push(`Observed temperature (${env.recentAvgTempC.toFixed(1)}°C) is outside acceptable survival/growth limits (${candidate.tempRangeC[0]}–${candidate.tempRangeC[1]}°C).`);
		else missingInfo.push("Satellite surface temperature observations are currently unavailable.");
		if (currentFamily) if (candidate.incompatiblePrecedingFamilies.includes(currentFamily)) incompReasons.push(`Rotation Risk: Planting ${candidate.nameEn} immediately after ${field.cropType} (${currentFamily} family) promotes shared soil-borne pathogen and pest accumulation.`);
		else if (candidate.beneficialPrecedingFamilies.includes(currentFamily)) compReasons.push(`Beneficial Rotation: Highly synergistic following ${field.cropType}. Efficiently absorbs residual nutrients and breaks monoculture pathogen cycles.`);
		else compReasons.push(`Compatible rotational sequence: ${candidate.family} family is botanically distinct from ${currentFamily}.`);
		if (candidate.irrigationNeeded && field.irrigationType === "rainfed") incompReasons.push(`Requires assured irrigation (${candidate.waterRequirementMm[0]}-${candidate.waterRequirementMm[1]} mm), but field is registered as rainfed.`);
		else if (candidate.irrigationNeeded && field.irrigationType && field.irrigationType !== "rainfed") compReasons.push(`Water requirement (${candidate.waterRequirementMm[0]}–${candidate.waterRequirementMm[1]} mm) matches field's ${field.irrigationType} irrigation access.`);
		if (field.soilType) {
			const normSoil = field.soilType.toLowerCase();
			if (candidate.compatibleSoilTextures.some((txt) => normSoil.includes(txt))) compReasons.push(`Soil texture '${field.soilType}' matches recommended root aeration and drainage needs.`);
			else if (!candidate.toleratesHeavyClay && normSoil.includes("clay")) incompReasons.push(`Does not tolerate poorly-drained or heavy clay soils.`);
		} else missingInfo.push("Plot-specific laboratory soil texture & pH unknown (not inferred from satellite).");
		let suitabilityStatus = "suitable";
		let confidence = "medium";
		if (incompReasons.length >= 2 || incompReasons.length >= 1 && !isSeasonMatch) suitabilityStatus = "unsuitable";
		else if (incompReasons.length === 1) suitabilityStatus = "caution";
		else if (compReasons.length >= 3 && isSeasonMatch) {
			suitabilityStatus = "highly_suitable";
			confidence = "high";
		}
		const monthNames = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec"
		];
		const plantingWindowStr = candidate.suitablePlantingMonths.map((m) => monthNames[m - 1]).join(" – ");
		results.push({
			cropId: candidate.cropId,
			nameEn: candidate.nameEn,
			nameNe: candidate.nameNe,
			family: candidate.family,
			suitabilityStatus,
			compatibilityReasons: compReasons,
			incompatibilityReasons: incompReasons,
			missingInformation: missingInfo,
			recommendedPlantingWindow: plantingWindowStr,
			growthDurationDays: candidate.growthDurationDays,
			rotationBenefits: candidate.rotationBenefitsEn,
			rotationRisks: candidate.rotationRisksEn,
			agronomicRequirements: candidate.agronomicRequirementsEn,
			citation: candidate.citation,
			confidence,
			environmentalEvidence: {
				tempCompatibility: env.recentAvgTempC !== null ? `${env.recentAvgTempC.toFixed(1)}°C (Req: ${candidate.optimalTempRangeC[0]}-${candidate.optimalTempRangeC[1]}°C)` : "Unknown",
				waterCompatibility: `${candidate.waterRequirementMm[0]}-${candidate.waterRequirementMm[1]} mm (${candidate.irrigationNeeded ? "Irrigation required" : "Low water / drought tolerant"})`,
				soilCompatibility: candidate.compatibleSoilTextures.join(", ")
			}
		});
	}
	const rankOrder = {
		highly_suitable: 0,
		suitable: 1,
		caution: 2,
		unsuitable: 3
	};
	return results.sort((a, b) => rankOrder[a.suitabilityStatus] - rankOrder[b.suitabilityStatus]);
}
/**
* 3. Crop Rotation Planning Calendar Timeline
*/
function buildRotationTimeline(harvestAdvice, topNextCrop) {
	const items = [];
	const harvestEnd = new Date(harvestAdvice.estimatedHarvestEnd);
	items.push({
		stage: "current_crop",
		title: `Existing Crop: ${harvestAdvice.cropName}`,
		dateRange: `${harvestAdvice.plantingDate} to Present (${harvestAdvice.cropAgeDays} days elapsed)`,
		durationDays: harvestAdvice.cropAgeDays,
		description: `Active field tenure. Expected physiological maturity window spans ${harvestAdvice.expectedDurationRangeDays[0]} to ${harvestAdvice.expectedDurationRangeDays[1]} days.`,
		status: harvestAdvice.isHarvestWindowActive ? "active" : "completed"
	});
	items.push({
		stage: "harvest_window",
		title: `Estimated Harvest Window (${harvestAdvice.cropName})`,
		dateRange: `${harvestAdvice.estimatedHarvestStart} to ${harvestAdvice.estimatedHarvestEnd}`,
		durationDays: harvestAdvice.expectedDurationRangeDays[1] - harvestAdvice.expectedDurationRangeDays[0],
		description: `Target harvesting operations during dry soil conditions. Follow the in-field skin-set and maturity confirmation checklist.`,
		status: harvestAdvice.isHarvestWindowActive ? "active" : harvestAdvice.isOverdue ? "completed" : "upcoming"
	});
	const prepStart = new Date(harvestEnd.getTime() + 864e5);
	const prepEnd = new Date(harvestEnd.getTime() + 864e6);
	items.push({
		stage: "field_prep",
		title: "Field Preparation & Solarization Window",
		dateRange: `${prepStart.toISOString().slice(0, 10)} to ${prepEnd.toISOString().slice(0, 10)}`,
		durationDays: 10,
		description: "Allow 7-10 days for crop residue incorporation, harrowing, weed flush termination, and soil moisture adjustment prior to seedbed opening.",
		status: "upcoming"
	});
	if (topNextCrop) {
		const plantStart = new Date(prepEnd.getTime() + 1728e5);
		const plantEnd = new Date(plantStart.getTime() + 12096e5);
		items.push({
			stage: "next_planting",
			title: `Recommended Next Planting: ${topNextCrop.nameEn}`,
			dateRange: `${plantStart.toISOString().slice(0, 10)} to ${plantEnd.toISOString().slice(0, 10)}`,
			durationDays: 14,
			description: `Optimal sowing window following field preparation. Ensures emergence before monsoon peak.`,
			status: "upcoming"
		});
		const nextHarvestStart = new Date(plantStart.getTime() + topNextCrop.growthDurationDays[0] * 864e5);
		const nextHarvestEnd = new Date(plantStart.getTime() + topNextCrop.growthDurationDays[1] * 864e5);
		items.push({
			stage: "next_harvest",
			title: `Projected Next Harvest: ${topNextCrop.nameEn}`,
			dateRange: `${nextHarvestStart.toISOString().slice(0, 10)} to ${nextHarvestEnd.toISOString().slice(0, 10)}`,
			durationDays: topNextCrop.growthDurationDays[1] - topNextCrop.growthDurationDays[0],
			description: `Target harvest window (${topNextCrop.growthDurationDays[0]}–${topNextCrop.growthDurationDays[1]} days after sowing). Prepares land for subsequent monsoon paddy.`,
			status: "upcoming"
		});
	}
	return items;
}
//#endregion
export { computeHarvestAdvice as n, evaluateNextCrops as r, buildRotationTimeline as t };
