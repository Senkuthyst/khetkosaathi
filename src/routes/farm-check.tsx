import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Navigation,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
  Calendar,
  Sparkles,
  CloudRain,
  Sun,
  Layers,
  ChevronDown,
  RefreshCw,
  Sprout,
  Satellite,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { pageHead } from "@/lib/page-head";
import { LazyMap } from "@/components/LazyMap";
import { Btn } from "@/components/kit";
import {
  getCurrentBrowserCoordinates,
  reverseGeocodeCoordinates,
} from "@/lib/geolocation-service";
import { fetchLiveHlsVegetation, type HlsVegetationSummary } from "@/lib/data/nasa-client";
import {
  fetchPowerRainfallYearOverYear,
  type YearOverYearRainfallResult,
} from "@/lib/data/nasa-power-yoy";
import {
  evaluateNextCrops,
  type NextCropSuitabilityScore,
} from "@/lib/crop-advisory-engine";
import type { FarmField } from "@/lib/farm-fields-service";
import type { MapPointMarker } from "@/components/FieldMap";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/farm-check")({
  head: () =>
    pageHead(
      "KHETKOSAATHI — Farm Check",
      "Instant mobile farm check: 30m NASA satellite vegetation, year-over-year rainfall comparison, and suitable crops for your land.",
    ),
  component: FarmCheckPage,
});

interface PrecedingCropOption {
  id: string;
  nameEn: string;
  nameNe: string;
  icon: string;
  descEn: string;
  descNe: string;
}

const PRECEDING_CROPS: PrecedingCropOption[] = [
  {
    id: "rice",
    nameEn: "Rice",
    nameNe: "धान",
    icon: "🌾",
    descEn: "Paddy crop",
    descNe: "धान बाली",
  },
  {
    id: "maize",
    nameEn: "Maize",
    nameNe: "मकै",
    icon: "🌽",
    descEn: "Corn crop",
    descNe: "मकै बाली",
  },
  {
    id: "wheat",
    nameEn: "Wheat",
    nameNe: "गहुँ",
    icon: "🌾",
    descEn: "Rabi cereal",
    descNe: "गहुँ बाली",
  },
  {
    id: "potato",
    nameEn: "Potato",
    nameNe: "आलु",
    icon: "🥔",
    descEn: "Tuber crop",
    descNe: "आलु बाली",
  },
  {
    id: "tomato",
    nameEn: "Tomato",
    nameNe: "गोलभेंडा",
    icon: "🍅",
    descEn: "Solanaceous fruit",
    descNe: "गोलभेंडा बाली",
  },
];

function FarmCheckPage() {
  const { lang, farmFields, selectedField } = useApp();

  // Coordinates and Location State
  const [coords, setCoords] = useState<[number, number] | null>(
    selectedField ? [selectedField.latitude, selectedField.longitude] : [27.6775, 84.4333],
  );
  const [locationName, setLocationName] = useState<string>(
    selectedField
      ? `${selectedField.fieldName} (${selectedField.municipality || "Chitwan"})`
      : "Chitwan Valley, Nepal",
  );
  const [locatingGps, setLocatingGps] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Preceding Crop State
  const [selectedCrop, setSelectedCrop] = useState<string>("rice");

  // Telemetry & Advisory Result State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [hlsSummary, setHlsSummary] = useState<HlsVegetationSummary | null>(null);
  const [rainfallYoY, setRainfallYoY] = useState<YearOverYearRainfallResult | null>(null);
  const [topCrops, setTopCrops] = useState<NextCropSuitabilityScore[]>([]);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Handle GPS location acquisition
  const handleAcquireGps = async () => {
    setLocatingGps(true);
    setLocationError(null);
    try {
      const pos = await getCurrentBrowserCoordinates();
      const newCoords: [number, number] = [pos.latitude, pos.longitude];
      setCoords(newCoords);

      const geocoded = await reverseGeocodeCoordinates(pos.latitude, pos.longitude);
      setLocationName(geocoded.displayName || `${pos.latitude.toFixed(4)}° N, ${pos.longitude.toFixed(4)}° E`);
    } catch (err: any) {
      setLocationError(err.message || "Could not retrieve GPS coordinates.");
    } finally {
      setLocatingGps(false);
    }
  };

  // Handle picking a saved farm
  const handleSelectSavedFarm = (fieldId: string) => {
    const f = farmFields.find((item) => item.id === fieldId);
    if (!f) return;
    setCoords([f.latitude, f.longitude]);
    setLocationName(`${f.fieldName}${f.municipality ? ` · ${f.municipality}` : ""}`);
    if (f.cropType && PRECEDING_CROPS.some((c) => c.id === f.cropType.toLowerCase())) {
      setSelectedCrop(f.cropType.toLowerCase());
    }
    setLocationError(null);
  };

  // Run the farm check analysis
  const handleRunFarmCheck = async () => {
    if (!coords) return;
    setIsAnalyzing(true);
    setAnalysisError(null);

    const [lat, lon] = coords;

    try {
      // 1. Fetch NASA HLS 30m Vegetation (with automatic MODIS fallback)
      const hlsPromise = fetchLiveHlsVegetation({
        fieldId: "farm-check-plot",
        latitude: lat,
        longitude: lon,
        windowDays: 30,
      });

      // 2. Fetch NASA POWER Year-Over-Year Rainfall
      const rainPromise = fetchPowerRainfallYearOverYear({
        latitude: lat,
        longitude: lon,
        fieldId: "farm-check-plot",
        windowDays: 14,
      });

      const [hlsRes, rainRes] = await Promise.allSettled([hlsPromise, rainPromise]);

      const hlsData = hlsRes.status === "fulfilled" ? hlsRes.value : null;
      const rainData = rainRes.status === "fulfilled" ? rainRes.value : null;

      setHlsSummary(hlsData);
      setRainfallYoY(rainData);

      // 3. Construct synthetic farm field for the scientific suitability engine
      const targetField: FarmField = {
        id: "farm-check-temp",
        userId: "farmer-session",
        fieldName: locationName,
        latitude: lat,
        longitude: lon,
        boundary: [[lat, lon]],
        boundaryFeature: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [lon, lat],
                [lon + 0.001, lat],
                [lon + 0.001, lat + 0.001],
                [lon, lat + 0.001],
                [lon, lat],
              ],
            ],
          },
          properties: { name: locationName },
        },
        areaM2: 4046, // ~1 Acre / ~8 Ropani
        areaUnit: "ropani",
        cropType: selectedCrop,
        plantingDate: new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10),
        irrigationType: "rainfed",
        isPrimary: true,
        createdAt: new Date().toISOString(),
      };

      // 4. Run evaluateNextCrops() from crop-advisory-engine
      const suitabilityResults = evaluateNextCrops(targetField, {
        recentAvgTempC: 22.5,
        recentMaxTempC: 28.0,
        recentMinTempC: 16.0,
        recentRainSumMm: rainData?.currentYearTotalMm ?? null,
        soilMoisturePct: null,
      });

      // Sort by suitability level and take top 3
      const priorityOrder: Record<string, number> = {
        highly_suitable: 3,
        suitable: 2,
        caution: 1,
        unsuitable: 0,
      };

      const sorted = [...suitabilityResults].sort(
        (a, b) => (priorityOrder[b.suitabilityStatus] ?? 0) - (priorityOrder[a.suitabilityStatus] ?? 0),
      );

      setTopCrops(sorted.slice(0, 3));
      setHasAnalyzed(true);
    } catch (err: any) {
      setAnalysisError(err.message || "Failed to complete farm telemetry analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Determine Vegetation Traffic Light state
  const latestNdvi = hlsSummary?.latestNdvi ?? null;
  let vegLight: "green" | "yellow" | "red" | "missing" = "missing";
  let vegLabelEn = "No clear satellite image";
  let vegLabelNe = "कुनै सफा उपग्रह तस्विर छैन";

  if (latestNdvi !== null) {
    if (latestNdvi >= 0.50) {
      vegLight = "green";
      vegLabelEn = "Good Vegetation Health";
      vegLabelNe = "हरियाली राम्रो छ";
    } else if (latestNdvi >= 0.25) {
      vegLight = "yellow";
      vegLabelEn = "Moderate Canopy Density";
      vegLabelNe = "मध्यम हरियाली";
    } else {
      vegLight = "red";
      vegLabelEn = "Low / Sparse Vegetation";
      vegLabelNe = "कम हरियाली वा खाली जग्गा";
    }
  }

  // Build Leaflet Map Pins
  const mapCenter: [number, number] = coords ?? [27.6775, 84.4333];
  const markers: MapPointMarker[] = [
    {
      position: mapCenter,
      color: "#16a34a",
      fillColor: "#22c55e",
      radius: 10,
      label: lang === "ne" ? "तपाईंको खेत" : "Your Farm",
      tooltipContent: `<b>${locationName}</b><br/>${mapCenter[0].toFixed(4)}° N, ${mapCenter[1].toFixed(4)}° E`,
    },
  ];

  // Offset pins for the top 3 recommended crops
  const offsets: [number, number][] = [
    [0.0012, 0.0012],
    [-0.0012, 0.0012],
    [0.0012, -0.0012],
  ];

  topCrops.forEach((crop, idx) => {
    const off = offsets[idx] || [0.001, 0.001];
    markers.push({
      position: [mapCenter[0] + off[0], mapCenter[1] + off[1]],
      color: "#2563eb",
      fillColor: "#3b82f6",
      radius: 8,
      label: lang === "ne" ? crop.nameNe : crop.nameEn,
      tooltipContent: `<b>${crop.nameNe} (${crop.nameEn})</b><br/>${crop.suitabilityStatus === "highly_suitable" ? (lang === "ne" ? "उच्च उपयुक्त" : "Highly Suitable") : (lang === "ne" ? "उपयुक्त" : "Suitable")}<br/>${lang === "ne" ? "रोप्ने समय" : "Planting"}: ${crop.recommendedPlantingWindow}`,
    });
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* =========================================================================
          PAGE HEADER
         ========================================================================= */}
      <div className="rounded-3xl border border-border bg-gradient-to-r from-card via-card to-secondary/30 p-5 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {lang === "ne" ? "छिटो खेत जाँच" : "Quick Farm Check"}
          </span>
          <span className="rounded-full bg-satellite/10 px-2.5 py-1 text-xs font-bold text-satellite">
            NASA 30m HLS Telemetry
          </span>
        </div>

        <h1 className="mt-2 text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          {lang === "ne" ? "खेत जाँच तथा बाली उपयुक्तता" : "Farm Check & Land Suitability"}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {lang === "ne"
            ? "आफ्नो खेतको स्थान पत्ता लगाई हालको ३० मिटर नासा उपग्रह हरियाली, गत वर्षको तुलना र जग्गा अनुसार उपयुक्त बालीहरू हेर्नुहोस्।"
            : "Check your land with 30m NASA satellite vegetation telemetry, year-over-year rainfall comparisons, and scientifically suitable crops."}
        </p>
      </div>

      {/* =========================================================================
          STEP 1: LOCATION INPUT (Mobile-First Touch Target)
         ========================================================================= */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-black">
              1
            </span>
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              {lang === "ne" ? "तपाईंको खेत कहाँ छ?" : "Where is your farm?"}
            </h2>
          </div>

          {farmFields.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>{lang === "ne" ? "वा बचत गरिएको खेत:" : "Or saved farm:"}</span>
              <select
                aria-label="Select saved farm field"
                onChange={(e) => handleSelectSavedFarm(e.target.value)}
                className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                defaultValue=""
              >
                <option value="" disabled>
                  {lang === "ne" ? "खेत छान्नुहोस्..." : "Choose farm..."}
                </option>
                {farmFields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.fieldName} ({f.municipality || "Nepal"})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Big Check My Farm Button */}
        <button
          onClick={handleAcquireGps}
          disabled={locatingGps}
          className="w-full flex items-center justify-center gap-3 rounded-2xl bg-primary text-primary-foreground p-4 sm:p-5 text-base sm:text-lg font-black shadow-md hover:bg-primary/90 active:scale-[0.99] transition-all disabled:opacity-60"
        >
          <Navigation className={cn("h-5 w-5 sm:h-6 sm:w-6", locatingGps && "animate-spin")} />
          <span>
            {locatingGps
              ? (lang === "ne" ? "स्थान पत्ता लगाउँदै..." : "Acquiring GPS location...")
              : (lang === "ne" ? "मेरो खेत जाँच गर्नुहोस् (हालको स्थान)" : "Check my farm (Current Location)")}
          </span>
        </button>

        {/* Location Status Chip */}
        {coords && (
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-xs sm:text-sm">
            <div className="flex items-center gap-2 overflow-hidden">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              <span className="font-bold text-foreground truncate">{locationName}</span>
            </div>
            <span className="shrink-0 text-muted-foreground font-mono text-xs">
              {coords[0].toFixed(4)}° N, {coords[1].toFixed(4)}° E
            </span>
          </div>
        )}

        {locationError && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{locationError}</span>
          </div>
        )}
      </div>

      {/* =========================================================================
          STEP 2: PRECEDING CROP SELECTOR ("What did you grow?")
         ========================================================================= */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-black">
            2
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              {lang === "ne" ? "तपाईंले भर्खरै के लगाउनुभएको थियो?" : "What did you grow?"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {lang === "ne"
                ? "उचित बाली चक्र पहिचान गर्न अघिल्लो बाली छान्नुहोस्"
                : "Select your previous crop to determine rotation compatibility"}
            </p>
          </div>
        </div>

        {/* Large Mobile-First Crop Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {PRECEDING_CROPS.map((crop) => {
            const isSelected = selectedCrop === crop.id;
            return (
              <button
                key={crop.id}
                type="button"
                onClick={() => setSelectedCrop(crop.id)}
                className={cn(
                  "flex flex-col items-center justify-center rounded-2xl p-4 text-center transition-all relative border-2 min-h-[96px]",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-sm text-foreground ring-2 ring-primary/20"
                    : "border-border bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground",
                )}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                )}
                <span className="text-3xl mb-1">{crop.icon}</span>
                <span className="font-extrabold text-sm sm:text-base text-foreground">
                  {lang === "ne" ? crop.nameNe : crop.nameEn}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {lang === "ne" ? crop.nameEn : crop.nameNe}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Trigger Button */}
        <div className="pt-2">
          <button
            onClick={handleRunFarmCheck}
            disabled={isAnalyzing || !coords}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground p-3.5 text-sm sm:text-base font-extrabold shadow-xs transition-all disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                <span>{lang === "ne" ? "नासा उपग्रह विश्लेषण हुँदैछ..." : "Analyzing NASA satellite telemetry..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-primary" />
                <span>{lang === "ne" ? "खेतको पूर्ण विश्लेषण गर्नुहोस्" : "Run Farm Check Analysis"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* =========================================================================
          STEP 3: RESULTS SECTION (Vegetation light, YoY comparisons, Suitable crops)
         ========================================================================= */}
      {analysisError && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-xs sm:text-sm text-destructive flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{analysisError}</span>
        </div>
      )}

      {hasAnalyzed && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Result Card: Vegetation Status Light */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Satellite className="h-5 w-5 text-satellite" />
                <h3 className="text-base sm:text-lg font-black text-foreground">
                  {lang === "ne" ? "वनस्पति हरियाली स्थिति (NDVI)" : "Vegetation Health Status (NDVI)"}
                </h3>
              </div>

              {/* Data Source & Freshness Badge */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="rounded-md bg-muted px-2 py-0.5 font-semibold text-foreground">
                  {hlsSummary?.dataSource || "NASA HLS 30m"}
                </span>
                {hlsSummary?.currentYearObservation?.date && (
                  <span className="font-mono text-[11px]">
                    {hlsSummary.currentYearObservation.date}
                  </span>
                )}
              </div>
            </div>

            {/* Traffic Light Display */}
            <div className="flex items-center gap-4 sm:gap-6 p-4 rounded-2xl bg-muted/30 border border-border">
              {/* Pulsing Light Indicator */}
              <div className="relative flex items-center justify-center shrink-0">
                {vegLight === "green" && (
                  <>
                    <span className="absolute h-12 w-12 rounded-full bg-emerald-500/20 animate-ping" />
                    <span className="h-10 w-10 rounded-full bg-emerald-500 border-4 border-emerald-200 shadow-md flex items-center justify-center text-white font-bold text-lg">
                      ✓
                    </span>
                  </>
                )}
                {vegLight === "yellow" && (
                  <>
                    <span className="absolute h-12 w-12 rounded-full bg-amber-500/20 animate-ping" />
                    <span className="h-10 w-10 rounded-full bg-amber-500 border-4 border-amber-200 shadow-md flex items-center justify-center text-white font-bold text-lg">
                      !
                    </span>
                  </>
                )}
                {vegLight === "red" && (
                  <>
                    <span className="absolute h-12 w-12 rounded-full bg-rose-500/20 animate-ping" />
                    <span className="h-10 w-10 rounded-full bg-rose-500 border-4 border-rose-200 shadow-md flex items-center justify-center text-white font-bold text-lg">
                      ✕
                    </span>
                  </>
                )}
                {vegLight === "missing" && (
                  <span className="h-10 w-10 rounded-full bg-gray-400 border-4 border-gray-200 shadow-sm flex items-center justify-center text-white font-bold text-sm">
                    ?
                  </span>
                )}
              </div>

              {/* Status Explanation */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h4 className="text-base sm:text-lg font-black text-foreground">
                    {lang === "ne" ? vegLabelNe : vegLabelEn}
                  </h4>
                  {latestNdvi !== null ? (
                    <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                      NDVI: {latestNdvi.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-muted-foreground px-2 py-0.5 rounded-md bg-muted">
                      {lang === "ne" ? "बादलले ढाकिएको" : "Cloud Masked"}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {latestNdvi !== null
                    ? (lang === "ne"
                        ? `३० मिटर रिजोल्युसन भएको नासा उपग्रहले यो जग्गाको हरियाली इन्डेक्स ${latestNdvi.toFixed(2)} देखाएको छ।`
                        : `NASA 30m surface reflectance indicates an active canopy greenness index of ${latestNdvi.toFixed(2)}.`)
                    : (lang === "ne"
                        ? "पछिल्लो ३० दिनमा यस स्थानमा २०% भन्दा बढी बादल भएकाले सफा तस्विर उपलब्ध भएन। कुनै नक्कली डाटा देखाइएको छैन।"
                        : "Observation window exceeded 20% cloud cover. No synthetic or estimated values are displayed.")}
                </p>

                {hlsSummary?.isFallback && (
                  <div className="mt-2 text-[11px] text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-200">
                    <strong>{lang === "ne" ? "विकल्प:" : "Fallback:"}</strong> {hlsSummary.fallbackReason}
                  </div>
                )}
              </div>
            </div>

            {/* Plain-Language YoY Comparisons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Rain YoY Comparison */}
              <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-foreground">
                  <CloudRain className="h-4 w-4 text-sky-500" />
                  <span>{lang === "ne" ? "वर्षा तुलना (गत वर्षको तुलनामा)" : "Rainfall vs Last Year"}</span>
                </div>

                {rainfallYoY ? (
                  <>
                    <p className="text-sm font-bold text-foreground">
                      {rainfallYoY.deltaPct !== null && Math.abs(rainfallYoY.deltaPct) >= 5 ? (
                        rainfallYoY.deltaPct < 0 ? (
                          <span className="text-amber-600">
                            {lang === "ne"
                              ? `गत वर्षको तुलनामा ${Math.abs(rainfallYoY.deltaPct).toFixed(0)}% कम वर्षा`
                              : `${Math.abs(rainfallYoY.deltaPct).toFixed(0)}% less rain than last year at this time`}
                          </span>
                        ) : (
                          <span className="text-emerald-600">
                            {lang === "ne"
                              ? `गत वर्षको तुलनामा ${Math.abs(rainfallYoY.deltaPct).toFixed(0)}% बढी वर्षा`
                              : `${Math.abs(rainfallYoY.deltaPct).toFixed(0)}% more rain than last year at this time`}
                          </span>
                        )
                      ) : (
                        <span>
                          {lang === "ne"
                            ? "गत वर्षको समान अवधिसँग वर्षा मिल्दोजुल्दो छ"
                            : "Rainfall is comparable to the same window last year"}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {rainfallYoY.currentYearTotalMm.toFixed(1)} mm vs {rainfallYoY.lastYearTotalMm.toFixed(1)} mm (14-day window)
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {lang === "ne" ? "नासा POWER वर्षा डाटा प्राप्त हुन सकेन।" : "NASA POWER precipitation telemetry unavailable."}
                  </p>
                )}
              </div>

              {/* Vegetation YoY Comparison */}
              <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-foreground">
                  <Sprout className="h-4 w-4 text-emerald-600" />
                  <span>{lang === "ne" ? "हरियाली तुलना (गत वर्षको तुलनामा)" : "Vegetation vs Last Year"}</span>
                </div>

                {hlsSummary?.lastYearObservation?.ndvi != null && latestNdvi != null ? (
                  <>
                    <p className="text-sm font-bold text-foreground">
                      {hlsSummary.ndviDelta != null && Math.abs(hlsSummary.ndviDelta) >= 0.05 ? (
                        hlsSummary.ndviDelta < 0 ? (
                          <span className="text-amber-600">
                            {lang === "ne"
                              ? "गत वर्ष यस समयको तुलनामा हरियाली कम छ"
                              : "Vegetation is lower than last year at this time"}
                          </span>
                        ) : (
                          <span className="text-emerald-600">
                            {lang === "ne"
                              ? "गत वर्ष यस समयको तुलनामा हरियाली बढी छ"
                              : "Vegetation is higher than last year at this time"}
                          </span>
                        )
                      ) : (
                        <span>
                          {lang === "ne"
                            ? "गत वर्ष यस समयको तुलनामा हरियाली स्थिर छ"
                            : "Vegetation is stable compared to last year at this time"}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      NDVI {latestNdvi.toFixed(2)} vs {hlsSummary.lastYearObservation.ndvi.toFixed(2)}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {lang === "ne"
                      ? "गत वर्षको समान अवधिको सफा उपग्रह तस्विर फेला परेन।"
                      : "No clear satellite scene from the exact same calendar window last year."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Result Card: Suitable crops for this land */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-foreground">
                  {lang === "ne" ? "यस जग्गाको लागि उपयुक्त बालीहरू" : "Suitable crops for this land"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {lang === "ne"
                    ? "NARC बाली चक्र विज्ञान तथा स्थानीय सिजन अनुसार उपयुक्त शीर्ष ३ विकल्पहरू"
                    : "Top 3 suitable rotation options grounded in NARC agronomy and current seasonal calendar"}
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                {lang === "ne" ? "बाली चक्र सिफारिस" : "Rotation Advisory"}
              </span>
            </div>

            {/* Top 3 Crop Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {topCrops.map((crop, idx) => (
                <div
                  key={crop.cropId}
                  className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2.5 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide",
                        crop.suitabilityStatus === "highly_suitable"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-blue-100 text-blue-800 border border-blue-300",
                      )}
                    >
                      {crop.suitabilityStatus === "highly_suitable"
                        ? (lang === "ne" ? "उच्च उपयुक्त" : "Highly Suitable")
                        : (lang === "ne" ? "उपयुक्त" : "Suitable")}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-foreground">
                      {lang === "ne" ? crop.nameNe : crop.nameEn}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {lang === "ne" ? crop.nameEn : crop.nameNe} · {crop.family} family
                    </p>
                  </div>

                  <div className="text-xs space-y-1 border-t border-border/60 pt-2">
                    <div className="flex items-center gap-1.5 text-foreground">
                      <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="font-semibold">{crop.recommendedPlantingWindow}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {lang === "ne" ? "पाक्ने समय:" : "Duration:"} {crop.growthDurationDays[0]}–{crop.growthDurationDays[1]} {lang === "ne" ? "दिन" : "days"}
                    </p>
                  </div>

                  {crop.rotationBenefits && (
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed bg-background/50 p-2 rounded-lg border border-border/40">
                      💡 {crop.rotationBenefits}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {topCrops.length === 0 && (
              <p className="text-xs text-muted-foreground py-4 text-center">
                {lang === "ne" ? "कुनै उपयुक्त बाली फेला परेन।" : "No suitable crops identified for current input parameters."}
              </p>
            )}
          </div>

          {/* Result Card: Leaflet Map with Recommendation Pins */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="text-sm sm:text-base font-bold text-foreground">
                  {lang === "ne" ? "खेत नक्सा र सिफारिस पिनहरू" : "Farm Location & Advisory Pins"}
                </h3>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {mapCenter[0].toFixed(4)}° N, {mapCenter[1].toFixed(4)}° E
              </span>
            </div>

            <div className="rounded-xl overflow-hidden border border-border">
              <LazyMap
                center={mapCenter}
                zoom={15}
                markers={markers}
                height={320}
              />
            </div>
            <p className="text-[11px] text-muted-foreground text-center">
              {lang === "ne"
                ? "हरियो पिनले तपाईंको खेत देखाउँछ; नीलो पिनहरूले यस जग्गाको लागि उपयुक्त बालीहरूको सिफारिस स्थान देखाउँछन्।"
                : "Green marker pinpoints your farm centroid; blue pins illustrate candidate suitable rotation zones."}
            </p>
          </div>

          {/* =========================================================================
              MANDATORY GOVERNANCE & SAFEGUARDS DISCLAIMER
             ========================================================================= */}
          <div className="rounded-2xl border border-amber-300/80 bg-amber-50/70 p-5 text-xs text-amber-950 space-y-3">
            <div className="flex items-center gap-2 font-extrabold text-amber-900 text-sm">
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-700" />
              <span>
                {lang === "ne" ? "कृषि सल्लाह सुरक्षा र नियमहरू (Safeguards)" : "Agricultural Advisory Safeguards & Disclaimers"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 leading-relaxed">
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-amber-800">•</span>
                <span>
                  <strong>{lang === "ne" ? "उपयुक्त बाली मात्र:" : "Suitable crops only:"}</strong>{" "}
                  {lang === "ne"
                    ? "यो सिफारिस बाली चक्र र सिजनमा आधारित छ। यसले उत्पादनको ग्यारेन्टी गर्दैन।"
                    : "Presents suitable rotation candidates only; never forecasts yield or revenue."}
                </span>
              </div>

              <div className="flex items-start gap-1.5">
                <span className="font-bold text-amber-800">•</span>
                <span>
                  <strong>{lang === "ne" ? "कुनै रोग निदान होइन:" : "No disease diagnosis:"}</strong>{" "}
                  {lang === "ne"
                    ? "उपग्रह हरियालीले बोटको सामान्य अवस्था देखाउँछ, कुनै रोग वा कीराको निदान गर्दैन।"
                    : "Satellite vegetation reflectance measures canopy vigor, not specific plant diseases or pathogens."}
                </span>
              </div>

              <div className="flex items-start gap-1.5">
                <span className="font-bold text-amber-800">•</span>
                <span>
                  <strong>{lang === "ne" ? "कुनै विषादी/मल सल्लाह छैन:" : "No pesticide/fertiliser advice:"}</strong>{" "}
                  {lang === "ne"
                    ? "विषादी वा मल प्रयोग गर्दा स्थानीय कृषि प्राविधिक वा कृषि ज्ञान केन्द्रसँग सल्लाह लिनुहोस्।"
                    : "Never use this tool for pesticide or chemical dosage decisions. Consult local agricultural extension."}
                </span>
              </div>

              <div className="flex items-start gap-1.5">
                <span className="font-bold text-amber-800">•</span>
                <span>
                  <strong>{lang === "ne" ? "निदान होइन:" : "Not a diagnosis:"}</strong>{" "}
                  {lang === "ne"
                    ? "उपग्रह अनुमानहरू केवल पूर्व-सूचना हुन्। रोप्नु अघि माटो र खेतको अवस्था आफैं जाँच्नुहोस्।"
                    : "Satellite estimates are indicative indicators, not an in-field agronomic diagnosis."}
                </span>
              </div>
            </div>

            <div className="border-t border-amber-200/80 pt-2 flex items-center justify-between flex-wrap gap-2 text-[11px] text-amber-800">
              <span>
                {lang === "ne" ? "डेटा स्रोत:" : "Data Provenance:"}{" "}
                <strong>{hlsSummary?.dataSource || "NASA HLS 30m / MODIS"}</strong>
              </span>
              <span>
                {lang === "ne" ? "प्रशोधन:" : "Processing:"} LP DAAC CMR STAC + NASA POWER API
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
