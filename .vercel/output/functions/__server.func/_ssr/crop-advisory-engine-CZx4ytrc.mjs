//#region node_modules/.nitro/vite/services/ssr/assets/crop-advisory-engine-CZx4ytrc.js
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
	},
	{
		cropId: "wheat_winter",
		nameEn: "Winter Wheat (Gahun)",
		nameNe: "गहुँ (हिउँदे)",
		family: "Poaceae",
		suitablePlantingMonths: [10, 11],
		growthDurationDays: [110, 135],
		tempRangeC: [5, 25],
		optimalTempRangeC: [12, 22],
		waterRequirementMm: [350, 500],
		compatibleSoilTextures: [
			"loam",
			"clay loam",
			"silt loam",
			"alluvial"
		],
		toleratesHeavyClay: false,
		irrigationNeeded: true,
		incompatiblePrecedingFamilies: ["Poaceae"],
		beneficialPrecedingFamilies: ["Fabaceae", "Solanaceae"],
		rotationBenefitsEn: "Staple winter cash crop. Breaks paddy monoculture and benefits from residual legume nitrogen when following lentil or chickpea. Varieties like Gautam and Bhrikuti recommended by NARC.",
		rotationBenefitsNe: "मुख्य हिउँदे नगदे बाली। दलहन पछि लगाउँदा नाइट्रोजन सहज पाइन्छ र रोग-कीराको चाप घट्छ। गौतम र भृकुटी जात सिफारिस।",
		rotationRisksEn: "Requires 3–4 irrigations if post-monsoon rains fail. Rust disease risk high if sowing is delayed past December.",
		rotationRisksNe: "मनसुन पछि वर्षा नभए ३–४ पटक सिँचाइ अनिवार्य। डिसेम्बर पछि ढिलो बोए कालो जंग (rust) को जोखिम बढ्छ।",
		agronomicRequirementsEn: "Sow Oct 15 – Nov 30 at 100–120 kg seed/ha. First irrigation at crown root initiation (21 days). Recommended varieties: Gautam, Bhrikuti, NL-971.",
		agronomicRequirementsNe: "असोज-मंसिर बीचमा बिउ राख्नुहोस् (प्रति हेक्टर १००-१२० कि.ग्रा.)। पहिलो सिँचाइ बोएको २१ दिनमा। सिफारिस जातहरू: गौतम, भृकुटी, NL-971।",
		citation: {
			sourceTitle: "Wheat Production Guidelines for Nepal",
			publishingInstitution: "National Wheat Research Program (NWRP), Bhairahawa, NARC",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2021
		}
	},
	{
		cropId: "potato_winter",
		nameEn: "Winter Potato (Hiunde Aalu)",
		nameNe: "हिउँदे आलु",
		family: "Solanaceae",
		suitablePlantingMonths: [
			9,
			10,
			11
		],
		growthDurationDays: [90, 110],
		tempRangeC: [7, 25],
		optimalTempRangeC: [12, 20],
		waterRequirementMm: [350, 500],
		compatibleSoilTextures: [
			"sandy loam",
			"loam",
			"silt loam",
			"alluvial"
		],
		toleratesHeavyClay: false,
		irrigationNeeded: true,
		incompatiblePrecedingFamilies: ["Solanaceae"],
		beneficialPrecedingFamilies: ["Poaceae", "Fabaceae"],
		rotationBenefitsEn: "High-value cash tuber crop for the winter market. Following rice or maize breaks soilborne disease cycles and uses residual organic matter efficiently.",
		rotationBenefitsNe: "हिउँदे बजारमा उच्च मूल्य पाइने नगदे बाली। धान वा मकै पछि लगाउँदा भूमिजन्य रोग घट्छ र बाँकी जैव पदार्थको सदुपयोग हुन्छ।",
		rotationRisksEn: "Late blight (Phytophthora infestans) is the primary risk in cool humid conditions; apply preventive fungicide at haulm closure.",
		rotationRisksNe: "चिसो र ओसिलो मौसममा ढुसी रोग (Phytophthora) को उच्च जोखिम; बोट जोडिनुअघि रोकथाम ढुसीनाशक प्रयोग गर्नुहोस्।",
		agronomicRequirementsEn: "Plant seed tubers (35–55 g) in Oct–Nov at 60×20 cm spacing. Varieties: Kufri Jyoti, Cardinal, Desiree. Earth up at 30–35 days.",
		agronomicRequirementsNe: "असोज-मंसिरमा बिउ-आलु (३५-५५ ग्राम) ६०×२० से.मी. दूरीमा रोप्नुहोस्। जात: कुफ्री ज्योति, कार्डिनल। रोपेको ३०-३५ दिनमा माटो थुपार्नुहोस्।",
		citation: {
			sourceTitle: "Potato Production Technology in Nepal (Technical Bulletin)",
			publishingInstitution: "Nepal Agricultural Research Council (NARC) - National Potato Research Program (NPRP), Khumaltar",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2021
		}
	},
	{
		cropId: "mustard",
		nameEn: "Mustard / Rapeseed (Tori)",
		nameNe: "तोरी / रायो",
		family: "Brassicaceae",
		suitablePlantingMonths: [
			9,
			10,
			11
		],
		growthDurationDays: [85, 110],
		tempRangeC: [5, 25],
		optimalTempRangeC: [10, 20],
		waterRequirementMm: [200, 350],
		compatibleSoilTextures: [
			"loam",
			"sandy loam",
			"clay loam",
			"alluvial",
			"silt loam"
		],
		toleratesHeavyClay: false,
		irrigationNeeded: false,
		incompatiblePrecedingFamilies: ["Brassicaceae"],
		beneficialPrecedingFamilies: ["Poaceae", "Fabaceae"],
		rotationBenefitsEn: "Important oilseed cash crop with low water demand. Deep taproot breaks paddy hardpan. Glucosinolate residues suppress soilborne nematodes.",
		rotationBenefitsNe: "कम पानीमा हुने महत्त्वपूर्ण तेलहन बाली। गहिरो जरोले धानको कठोर माटो तोड्छ। ग्लुकोसाइनोलेट अवशेषले माटोका सूत्रकृमि घटाउँछ।",
		rotationRisksEn: "Aphid (Lipaphis erysimi) infestation common from January; monitor weekly. White rust can reduce yield in high-humidity areas.",
		rotationRisksNe: "माघबाट लाही कीराको प्रकोप सामान्य; साप्ताहिक निरीक्षण गर्नुहोस्। ओसिलो क्षेत्रमा सेतो जंगले उत्पादन घटाउँछ।",
		agronomicRequirementsEn: "Broadcast or drill sow Oct–Nov at 5–6 kg seed/ha. Varieties: Binayak, Pusa Bold. Harvest when 75% pods turn golden.",
		agronomicRequirementsNe: "असोज-मंसिरमा प्रति हेक्टर ५-६ कि.ग्रा. बिउ छर्नुहोस्। जात: विनायक, पुसा बोल्ड। ७५% फली सुनौलो भएपछि काट्नुहोस्।",
		citation: {
			sourceTitle: "Oilseed Crops Technology in Nepal",
			publishingInstitution: "National Oilseed Research Program (NORP), Nawalpur, Sarlahi, NARC",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2019
		}
	},
	{
		cropId: "lentil",
		nameEn: "Lentil (Masuro)",
		nameNe: "मसुरो",
		family: "Fabaceae",
		suitablePlantingMonths: [
			10,
			11,
			12,
			1
		],
		growthDurationDays: [110, 130],
		tempRangeC: [5, 25],
		optimalTempRangeC: [10, 18],
		waterRequirementMm: [150, 300],
		compatibleSoilTextures: [
			"loam",
			"sandy loam",
			"silt loam",
			"alluvial"
		],
		toleratesHeavyClay: false,
		irrigationNeeded: false,
		incompatiblePrecedingFamilies: ["Fabaceae"],
		beneficialPrecedingFamilies: ["Poaceae", "Solanaceae"],
		rotationBenefitsEn: "Nitrogen-fixing legume that enriches soil with 40–60 kg N/ha. Ideal follow-on to rice paddy. Low water demand — excellent for rainfed winter soils.",
		rotationBenefitsNe: "नाइट्रोजन सोध्ने दलहन जसले प्रति हेक्टर ४०-६० कि.ग्रा. नाइट्रोजन माटोमा थप्छ। धान पछिको उत्तम विकल्प। सिँचाइ कम वा नचाहिने।",
		rotationRisksEn: "Stemphylium blight can be severe in warm wet winters. Avoid sowing in low-lying waterlogged plots.",
		rotationRisksNe: "न्यानो र ओसिलो हिउँदमा स्टेम्फिलियम झुल्के रोगको जोखिम। पानी जम्ने ठाउँमा नलगाउनुहोस्।",
		agronomicRequirementsEn: "Sow Oct–Jan at 40–50 kg/ha. Varieties: Khajura Masuro-1, ILL-5588. No irrigation needed in most areas. Harvest at physiological maturity (pods rattle).",
		agronomicRequirementsNe: "असोज-पुसमा प्रति हेक्टर ४०-५० कि.ग्रा. बिउ छर्नुहोस्। जात: खजुरा मसुरो-१, ILL-5588। अधिकांश क्षेत्रमा सिँचाइ नचाहिने।",
		citation: {
			sourceTitle: "Green Manuring Techniques for Soil Fertility Management",
			publishingInstitution: "Soil Science Division, NARC, Khumaltar, Lalitpur",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2019
		}
	},
	{
		cropId: "chickpea",
		nameEn: "Chickpea (Chana)",
		nameNe: "चना",
		family: "Fabaceae",
		suitablePlantingMonths: [
			10,
			11,
			12,
			1
		],
		growthDurationDays: [120, 145],
		tempRangeC: [5, 28],
		optimalTempRangeC: [10, 20],
		waterRequirementMm: [150, 300],
		compatibleSoilTextures: [
			"sandy loam",
			"loam",
			"alluvial"
		],
		toleratesHeavyClay: false,
		irrigationNeeded: false,
		incompatiblePrecedingFamilies: ["Fabaceae"],
		beneficialPrecedingFamilies: ["Poaceae", "Solanaceae"],
		rotationBenefitsEn: "Deep-rooted legume that fixes atmospheric nitrogen and improves soil structure after repeated shallow-rooted paddy. High protein cash crop with good market value.",
		rotationBenefitsNe: "गहिरो जरोको दलहन जसले वायुमण्डलीय नाइट्रोजन सोध्छ र बारम्बार धान लगाएपछि माटोको संरचना सुधार्छ।",
		rotationRisksEn: "Botrytis grey mould risk in humid conditions. Requires well-drained soils — avoid low-lying fields prone to fog.",
		rotationRisksNe: "ओसिलो अवस्थामा बोट्रिटिस (grey mould) को जोखिम। राम्रो निकास भएको माटो चाहिन्छ।",
		agronomicRequirementsEn: "Sow Oct–Dec at 70–90 kg/ha. Recommended varieties: Avrodhi, ICC-4918, Doli. Verify planting dates with NARC or your local agriculture office.",
		agronomicRequirementsNe: "असोज-पुसमा प्रति हेक्टर ७०-९० कि.ग्रा. बिउ। जात: अव्रोधी, Doli। स्थानीय कृषि शाखाबाट मिति पुष्टि गर्नुहोस्।",
		citation: {
			sourceTitle: "Grain Legumes and Vegetable Cowpea Cultivation",
			publishingInstitution: "National Grain Legumes Research Program (NGLRP), NARC",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2020
		}
	},
	{
		cropId: "field_pea",
		nameEn: "Field Pea (Kerau)",
		nameNe: "केराउ",
		family: "Fabaceae",
		suitablePlantingMonths: [
			10,
			11,
			12,
			1
		],
		growthDurationDays: [90, 115],
		tempRangeC: [5, 22],
		optimalTempRangeC: [8, 18],
		waterRequirementMm: [150, 280],
		compatibleSoilTextures: [
			"loam",
			"sandy loam",
			"silt loam",
			"clay loam",
			"alluvial"
		],
		toleratesHeavyClay: false,
		irrigationNeeded: false,
		incompatiblePrecedingFamilies: ["Fabaceae"],
		beneficialPrecedingFamilies: ["Poaceae", "Solanaceae"],
		rotationBenefitsEn: "Quick-maturing legume that fits neatly in the winter gap between paddy harvest and wheat planting. Fixes nitrogen and provides green pods for home consumption.",
		rotationBenefitsNe: "धान काटेपछि र गहुँ लगाउनु अघिको अन्तरालमा लगाइने छिटो पाक्ने दलहन। नाइट्रोजन सोध्छ र हरियो कोसा घरखर्चका लागि पाइन्छ।",
		rotationRisksEn: "Powdery mildew common in late winter (Feb–Mar). Avoid sowing too late (after January) in low-altitude areas.",
		rotationRisksNe: "माघ-फागुनमा पाउडरी मिल्ड्यूको प्रकोप सामान्य। तराईमा माघ पछि नलगाउनुहोस्।",
		agronomicRequirementsEn: "Sow Oct–Jan at 80–100 kg/ha. Varieties: Prakash, Arkel, Sungold. Verify planting dates with NARC or your local agriculture office.",
		agronomicRequirementsNe: "असोज-पुसमा प्रति हेक्टर ८०-१०० कि.ग्रा. बिउ। जात: प्रकाश, अर्केल, सनगोल्ड।",
		citation: {
			sourceTitle: "Spring Mungbean Production Technology in Cereal-Based Systems",
			publishingInstitution: "National Grain Legumes Research Program (NGLRP), Rampur, Chitwan, NARC",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2022
		}
	},
	{
		cropId: "winter_vegetables",
		nameEn: "Winter Vegetables (Cauliflower / Cabbage)",
		nameNe: "काउली / बन्दा (जाडो तरकारी)",
		family: "Brassicaceae",
		suitablePlantingMonths: [
			9,
			10,
			11,
			12
		],
		growthDurationDays: [60, 90],
		tempRangeC: [5, 25],
		optimalTempRangeC: [10, 20],
		waterRequirementMm: [300, 450],
		compatibleSoilTextures: [
			"loam",
			"clay loam",
			"silt loam",
			"alluvial"
		],
		toleratesHeavyClay: false,
		irrigationNeeded: true,
		incompatiblePrecedingFamilies: ["Brassicaceae"],
		beneficialPrecedingFamilies: [
			"Poaceae",
			"Fabaceae",
			"Solanaceae"
		],
		rotationBenefitsEn: "High-value market vegetable with quick turnover (60–90 days). Capitalises on cool dry winter conditions. After paddy or maize — excellent market supplement income.",
		rotationBenefitsNe: "चाँडो बिक्री हुने उच्च मूल्य तरकारी (६०-९० दिन)। चिसो सुख्खा हिउँदमा राम्रो उत्पादन। धान वा मकै पछि बजारमा थप आम्दानी।",
		rotationRisksEn: "Clubroot (Plasmodiophora brassicae) can persist 20+ years; never follow another Brassica crop. Diamond-back moth pressure increases from February.",
		rotationRisksNe: "क्लबरुट रोग २० वर्षभन्दा बढी माटोमा बाँच्छ; अर्को Brassica पछि नलगाउनुहोस्। फागुनबाट डाइमन्डब्याक पुतली बढ्छ।",
		agronomicRequirementsEn: "Raise nursery Aug–Sep; transplant at 4–5 leaf stage. Spacing 60×45 cm for cauliflower, 45×45 cm for cabbage. Varieties: Kathmandu Local, Pusa Snowball, Golden Acre.",
		agronomicRequirementsNe: "भदौ-असोजमा बिउ उमार्नुहोस्; ४-५ पात भएपछि सार्नुहोस्। काउलीका लागि ६०×४५ से.मी. दूरी। जात: काठमाडौं लोकल, पुसा स्नोबल।",
		citation: {
			sourceTitle: "Commercial Vegetable Production Manual",
			publishingInstitution: "Vegetable Development Directorate, Ministry of Agriculture, Nepal",
			referenceUrl: "https://moald.gov.np/",
			publicationYear: 2021
		}
	},
	{
		cropId: "monsoon_maize",
		nameEn: "Monsoon Maize (Barkhe Makai)",
		nameNe: "बर्खे मकै",
		family: "Poaceae",
		suitablePlantingMonths: [
			5,
			6,
			7
		],
		growthDurationDays: [95, 120],
		tempRangeC: [18, 38],
		optimalTempRangeC: [22, 32],
		waterRequirementMm: [500, 750],
		compatibleSoilTextures: [
			"loam",
			"silt loam",
			"clay loam",
			"alluvial"
		],
		toleratesHeavyClay: true,
		irrigationNeeded: false,
		incompatiblePrecedingFamilies: ["Poaceae"],
		beneficialPrecedingFamilies: ["Fabaceae", "Solanaceae"],
		rotationBenefitsEn: "Staple rainy season cereal. Good companion or rotation with legumes like soybean and cowpea. High biomass producer.",
		rotationBenefitsNe: "वर्षायामको प्रमुख खाद्यबाली। दलहनसँग घुम्ती खेती गर्दा माटोको उर्वराशक्ति सन्तुलित रहन्छ।",
		rotationRisksEn: "Vulnerable to banded leaf and sheath blight in prolonged excessive humidity.",
		rotationRisksNe: "लगातार पानी पर्दा पात तथा फेद कुहिने रोगको जोखिम।",
		agronomicRequirementsEn: "Ensure proper ridge tillage for surface drainage. Varieties: Rampur Composite, Deuti, Sheetala. Source: NMRP NARC.",
		agronomicRequirementsNe: "पानी निकासका लागि ड्याङ बनाएर लगाउनुहोस्। सिफारिस जातहरू: देउती, शीतला।",
		citation: {
			sourceTitle: "Maize Production Technologies in Nepal",
			publishingInstitution: "National Maize Research Program (NMRP), Rampur, Chitwan, NARC",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2021
		}
	},
	{
		cropId: "soybean",
		nameEn: "Soybean (Bhatmas)",
		nameNe: "भटमास",
		family: "Fabaceae",
		suitablePlantingMonths: [
			5,
			6,
			7,
			8
		],
		growthDurationDays: [90, 120],
		tempRangeC: [18, 35],
		optimalTempRangeC: [22, 30],
		waterRequirementMm: [450, 700],
		compatibleSoilTextures: [
			"loam",
			"sandy loam",
			"clay loam",
			"alluvial"
		],
		toleratesHeavyClay: false,
		irrigationNeeded: false,
		incompatiblePrecedingFamilies: ["Fabaceae"],
		beneficialPrecedingFamilies: ["Poaceae", "Solanaceae"],
		rotationBenefitsEn: "Enriches soil through atmospheric nitrogen fixation (+40-60 kg N/ha). Excellent intercrop or rotation crop for maize.",
		rotationBenefitsNe: "माटोमा नाइट्रोजन थपेर उर्वराशक्ति बढाउँछ। मकैसँग अन्तरबाली वा घुम्ती खेतीका लागि उपयुक्त।",
		rotationRisksEn: "Susceptible to soybean rust in wet cloudy conditions; ensure good field drainage.",
		rotationRisksNe: "अत्यधिक वर्षा र बादल लाग्दा खिया रोग (rust) को जोखिम।",
		agronomicRequirementsEn: "Sow at 60-70 kg/ha in rows. Varieties: Tarkari Bhatmas-1, Puja, Lumle-1. Source: NGLRP NARC.",
		agronomicRequirementsNe: "हल्का चिस्यान भएको माटोमा लाइनमा रोप्नुहोस्। सिफारिस जातहरू: तरकारी भटमास-१, पूजा।",
		citation: {
			sourceTitle: "Grain Legumes and Vegetable Cowpea Cultivation",
			publishingInstitution: "National Grain Legumes Research Program (NGLRP), NARC",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2020
		}
	},
	{
		cropId: "blackgram",
		nameEn: "Blackgram (Kalo Daal / Masko Daal)",
		nameNe: "मास",
		family: "Fabaceae",
		suitablePlantingMonths: [
			6,
			7,
			8
		],
		growthDurationDays: [75, 90],
		tempRangeC: [22, 38],
		optimalTempRangeC: [25, 33],
		waterRequirementMm: [350, 500],
		compatibleSoilTextures: [
			"loam",
			"sandy loam",
			"clay loam",
			"alluvial"
		],
		toleratesHeavyClay: false,
		irrigationNeeded: false,
		incompatiblePrecedingFamilies: ["Fabaceae"],
		beneficialPrecedingFamilies: ["Poaceae"],
		rotationBenefitsEn: "High protein pulse that enriches soil organic matter and nitrogen in late monsoon before winter crops.",
		rotationBenefitsNe: "हिउँदे बाली लगाउनु अघि माटोमा नाइट्रोजन र प्राङ्गारिक पदार्थ थप्ने उत्तम दलहन।",
		rotationRisksEn: "Sensitive to waterlogging during early vegetative growth.",
		rotationRisksNe: "सुरुको अवस्थामा पानी जमेमा बिरुवा पहेंलिने र कुहिने जोखिम।",
		agronomicRequirementsEn: "Broadcast or line sow at 25-30 kg/ha. Varieties: Kalu, Shekhar. Source: NGLRP NARC.",
		agronomicRequirementsNe: "प्रति हेक्टर २५-३० कि.ग्रा. बिउ प्रयोग गर्नुहोस्। जात: कालु, शेखर।",
		citation: {
			sourceTitle: "Grain Legumes and Vegetable Cowpea Cultivation",
			publishingInstitution: "National Grain Legumes Research Program (NGLRP), NARC",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2020
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
			...field.cropVariety !== void 0 ? { cropVariety: field.cropVariety } : {},
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
		...field.cropVariety !== void 0 ? { cropVariety: field.cropVariety } : {},
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
	const sorted = results.sort((a, b) => rankOrder[a.suitabilityStatus] - rankOrder[b.suitabilityStatus]);
	const hasSeasonMatch = sorted.some((r) => r.suitabilityStatus === "highly_suitable" || r.suitabilityStatus === "suitable" || r.suitabilityStatus === "caution");
	const upcomingCrops = NEXT_CROP_SUITABILITY_CATALOG.filter((candidate) => !candidate.suitablePlantingMonths.some((m) => targetWindowMonths.includes(m))).map((candidate) => {
		let minAway = 12;
		for (const pm of candidate.suitablePlantingMonths) {
			let away = pm - currentMonth;
			if (away <= 0) away += 12;
			if (away < minAway) minAway = away;
		}
		return {
			cropId: candidate.cropId,
			nameEn: candidate.nameEn,
			nameNe: candidate.nameNe,
			plantingWindowStr: candidate.suitablePlantingMonths.map((m) => [
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
			][m - 1]).join(" – "),
			monthsAway: minAway
		};
	}).sort((a, b) => a.monthsAway - b.monthsAway).slice(0, 4);
	const topCrops = sorted.slice(0, 3);
	return Object.assign([...sorted], {
		topCrops,
		hasSeasonMatch,
		upcomingCrops
	});
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
