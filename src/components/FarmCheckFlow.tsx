import { useState, useEffect } from "react";
import {
  Navigation,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  CloudRain,
  Leaf,
  Layers,
  RefreshCw,
  Sprout,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { LazyMap } from "@/components/LazyMap";
import { Btn } from "@/components/kit";
import { getCurrentBrowserCoordinates, reverseGeocodeCoordinates } from "@/lib/geolocation-service";
import { fetchLiveHlsVegetation, type HlsVegetationSummary } from "@/lib/data/nasa-client";
import {
  fetchPowerRainfallYearOverYear,
  type YearOverYearRainfallResult,
} from "@/lib/data/nasa-power-yoy";
import { evaluateNextCrops, type NextCropSuitabilityScore } from "@/lib/crop-advisory-engine";
import type { FarmField } from "@/lib/farm-fields-service";
import type { MapPointMarker } from "@/components/FieldMap";
import { cn } from "@/lib/utils";

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
    nameEn: "Rice (धान)",
    nameNe: "धान (Rice)",
    icon: "🌾",
    descEn: "Paddy crop",
    descNe: "मुख्य वर्षे बाली",
  },
  {
    id: "maize",
    nameEn: "Maize (मकै)",
    nameNe: "मकै (Maize)",
    icon: "🌽",
    descEn: "Corn crop",
    descNe: "पहाड र तराईको अन्न",
  },
  {
    id: "wheat",
    nameEn: "Wheat (गहुँ)",
    nameNe: "गहुँ (Wheat)",
    icon: "🌾",
    descEn: "Rabi cereal",
    descNe: "हिउँदे प्रमुख बाली",
  },
  {
    id: "potato",
    nameEn: "Potato (आलु)",
    nameNe: "आलु (Potato)",
    icon: "🥔",
    descEn: "Tuber crop",
    descNe: "तरकारी तथा नगदे",
  },
  {
    id: "tomato",
    nameEn: "Tomato (गोलभेंडा)",
    nameNe: "गोलभेंडा (Tomato)",
    icon: "🍅",
    descEn: "Solanaceous fruit",
    descNe: "नगदे तरकारी बाली",
  },
];

interface FarmCheckFlowProps {
  className?: string;
  onViewDashboard?: () => void;
}

export function FarmCheckFlow({ className, onViewDashboard }: FarmCheckFlowProps) {
  const { lang, farmFields, selectedField } = useApp();

  // Wizard Step: 1 = Location, 2 = Crop, 3 = Result
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Location & Coordinates
  const [coords, setCoords] = useState<[number, number] | null>(
    selectedField ? [selectedField.latitude, selectedField.longitude] : null,
  );
  const [locationName, setLocationName] = useState<string>(
    selectedField ? `${selectedField.fieldName} (${selectedField.municipality || "Nepal"})` : "",
  );
  const [locatingGps, setLocatingGps] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showManualPicker, setShowManualPicker] = useState(false);
  const [manualLat, setManualLat] = useState("27.6775");
  const [manualLon, setManualLon] = useState("84.4333");

  // Step 2: Preceding Crop
  const [selectedCrop, setSelectedCrop] = useState<string>("rice");

  // Step 3: Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hlsSummary, setHlsSummary] = useState<HlsVegetationSummary | null>(null);
  const [rainfallYoY, setRainfallYoY] = useState<YearOverYearRainfallResult | null>(null);
  const [topCrops, setTopCrops] = useState<NextCropSuitabilityScore[]>([]);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Audio / Speech Synthesis state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setHasSpeechSupport(true);
    }
  }, []);

  // Stop speech if step changes or unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [step]);

  // Acquire GPS Location
  const handleAcquireGps = async () => {
    setLocatingGps(true);
    setLocationError(null);
    try {
      const pos = await getCurrentBrowserCoordinates();
      const newCoords: [number, number] = [pos.latitude, pos.longitude];
      setCoords(newCoords);

      const geocoded = await reverseGeocodeCoordinates(pos.latitude, pos.longitude);
      setLocationName(
        geocoded.displayName || `${pos.latitude.toFixed(4)}° N, ${pos.longitude.toFixed(4)}° E`,
      );
      // Auto advance to step 2 after obtaining location
      setStep(2);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setLocationError(
        lang === "ne"
          ? "तपाईंको फोनको जीपीएस स्थान पत्ता लागेन। कृपया फोनको 'Location' अन गर्नुहोस् वा तल 'नक्सामा छान्नुहोस्' रोज्नुहोस्।"
          : `${msg}. Please enable location permissions or choose 'Pick on map' below.`,
      );
    } finally {
      setLocatingGps(false);
    }
  };

  // Pick a saved farm field
  const handleSelectSavedFarm = (fieldId: string) => {
    const f = farmFields.find((item) => item.id === fieldId);
    if (!f) return;
    setCoords([f.latitude, f.longitude]);
    setLocationName(`${f.fieldName}${f.municipality ? ` · ${f.municipality}` : ""}`);
    if (f.cropType && PRECEDING_CROPS.some((c) => c.id === f.cropType.toLowerCase())) {
      setSelectedCrop(f.cropType.toLowerCase());
    }
    setLocationError(null);
    setStep(2);
  };

  // Confirm manual coordinate picker
  const handleApplyManualCoords = () => {
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      alert(
        lang === "ne"
          ? "कृपया मान्य अक्षांश र देशान्तर राख्नुहोस्।"
          : "Please enter valid coordinates.",
      );
      return;
    }
    setCoords([lat, lon]);
    setLocationName(`${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`);
    setLocationError(null);
    setStep(2);
  };

  // Run analysis when Step 2 finishes
  const handleRunAnalysis = async (cropIdToUse = selectedCrop) => {
    if (!coords) return;
    setStep(3);
    setIsAnalyzing(true);
    setAnalysisError(null);

    const [lat, lon] = coords;

    try {
      // 1. Fetch live HLS vegetation
      const hlsPromise = fetchLiveHlsVegetation({
        fieldId: "farm-check-flow",
        latitude: lat,
        longitude: lon,
        windowDays: 30,
      });

      // 2. Fetch NASA POWER rainfall
      const rainPromise = fetchPowerRainfallYearOverYear({
        latitude: lat,
        longitude: lon,
        fieldId: "farm-check-flow",
        windowDays: 14,
      });

      const [hlsRes, rainRes] = await Promise.allSettled([hlsPromise, rainPromise]);

      const hlsData = hlsRes.status === "fulfilled" ? hlsRes.value : null;
      const rainData = rainRes.status === "fulfilled" ? rainRes.value : null;

      setHlsSummary(hlsData);
      setRainfallYoY(rainData);

      // 3. Synthetic field for scientific crop advisory engine
      const targetField: FarmField = {
        id: "farm-check-temp",
        userId: "farmer-session",
        fieldName: locationName || "My Farm",
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
        areaM2: 4046,
        areaUnit: "ropani",
        cropType: cropIdToUse,
        plantingDate: new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10),
        irrigationType: "rainfed",
        isPrimary: true,
        createdAt: new Date().toISOString(),
      };

      const suitabilityResults = evaluateNextCrops(targetField, {
        recentAvgTempC: 22.5,
        recentMaxTempC: 28.0,
        recentMinTempC: 16.0,
        recentRainSumMm: rainData?.currentYearTotalMm ?? null,
        soilMoisturePct: null,
      });

      const priorityOrder: Record<string, number> = {
        highly_suitable: 3,
        suitable: 2,
        caution: 1,
        unsuitable: 0,
      };

      const sorted = [...suitabilityResults].sort(
        (a, b) =>
          (priorityOrder[b.suitabilityStatus] ?? 0) - (priorityOrder[a.suitabilityStatus] ?? 0),
      );

      setTopCrops(sorted.slice(0, 3));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setAnalysisError(
        lang === "ne"
          ? "उपग्रह विवरण प्राप्त गर्न सकिएन। कृपया इन्टरनेट जाँच्नुहोस् र फेरि प्रयास गर्नुहोस्।"
          : `Could not retrieve satellite observations: ${msg}. Please check your connection and try again.`,
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Health Status Logic
  const getHealthStatus = (): {
    level: "green" | "yellow" | "red";
    titleNe: string;
    titleEn: string;
    meaningNe: string;
    meaningEn: string;
    actionNe: string;
    actionEn: string;
  } => {
    const ndvi = hlsSummary?.currentNdvi;
    const yoy = hlsSummary?.ndviDifferenceFromLastYear;

    if (ndvi !== null && ndvi !== undefined && yoy !== null && yoy !== undefined) {
      if (ndvi >= 0.45 && yoy >= -0.05) {
        return {
          level: "green",
          titleNe: "राम्रो अवस्था (Good)",
          titleEn: "Good Condition",
          meaningNe: "बिरुवाको हरियाली स्वस्थ र यस मौसमका लागि सामान्य छ।",
          meaningEn: "Plant greenness is healthy and normal for this time of year.",
          actionNe: "खेतको नियमित रेखदेख जारी राख्नुहोस् र नियमित सिँचाइ कायम राख्नुहोस्।",
          actionEn: "Continue regular field care and maintain scheduled irrigation.",
        };
      }
      if (ndvi >= 0.25 || yoy >= -0.15) {
        return {
          level: "yellow",
          titleNe: "मध्यम अवस्था (Moderate)",
          titleEn: "Moderate Condition",
          meaningNe: "बिरुवाको हरियाली केही कम छ वा गत वर्षभन्दा पानीको मात्रा फरक परेको छ।",
          meaningEn: "Plant greenness is slightly lower or rain has differed from last year.",
          actionNe:
            "खेतमा गएर माटोको चिस्यान जाँच्नुहोस् र कुलो वा सिँचाइको अवस्था निरीक्षण गर्नुहोस्।",
          actionEn: "Inspect soil moisture in low spots and verify irrigation canal flow.",
        };
      }
    }

    return {
      level: "red",
      titleNe: "ध्यान दिनुपर्ने (Needs Attention)",
      titleEn: "Needs Attention",
      meaningNe:
        "बिरुवाको हरियाली निकै कम देखिएको छ वा सुख्खा मौसमले बालीमा असर पुर्‍याएको हुन सक्छ।",
      meaningEn: "Plant greenness is noticeably low or dry weather may be stressing crops.",
      actionNe:
        "खेतमा प्रत्यक्ष निरीक्षण गर्नुहोस् र स्थानीय कृषि शाखाका प्राविधिकसँग परामर्श गर्नुहोस्।",
      actionEn:
        "Walk your field to check for dry soil, and consult your local agriculture officer.",
    };
  };

  const health = getHealthStatus();

  // Read aloud helper (TTS)
  const handleToggleSpeak = () => {
    if (!hasSpeechSupport || typeof window === "undefined") return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const title = lang === "ne" ? health.titleNe : health.titleEn;
    const meaning = lang === "ne" ? health.meaningNe : health.meaningEn;
    const action = lang === "ne" ? health.actionNe : health.actionEn;
    const fullText = `${title}. ${meaning} ${action}`;

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = lang === "ne" ? "ne-NP" : "en-US";
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Convert crops into map markers
  const mapCenter: [number, number] = coords ?? [27.6775, 84.4333];
  const markers: MapPointMarker[] = [
    {
      id: "center-farm",
      lat: mapCenter[0],
      lon: mapCenter[1],
      label: locationName || (lang === "ne" ? "तपाईंको खेत" : "Your Farm"),
      color:
        health.level === "green" ? "#237A50" : health.level === "yellow" ? "#D97706" : "#DC2626",
    },
    ...topCrops.map((c, i) => {
      const angle = (i * 2 * Math.PI) / 3;
      const offsetLat = Math.sin(angle) * 0.003;
      const offsetLon = Math.cos(angle) * 0.003;
      return {
        id: `crop-${c.cropId}`,
        lat: mapCenter[0] + offsetLat,
        lon: mapCenter[1] + offsetLon,
        label: `${c.cropNameNe} (${c.suitabilityStatus.replace("_", " ")})`,
        color: "#237A50",
      };
    }),
  ];

  return (
    <div
      className={cn(
        "w-full rounded-3xl border border-border bg-card p-4 sm:p-6 lg:p-8 shadow-md text-card-foreground space-y-6",
        className,
      )}
    >
      {/* Visual Progress Line */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-primary">
          <span>
            {step === 1 &&
              (lang === "ne"
                ? "चरण १ को ३: तपाईंको खेत कहाँ छ?"
                : "Step 1 of 3: Where is your farm?")}
            {step === 2 &&
              (lang === "ne"
                ? "चरण २ को ३: कुन बाली लगाउनुभयो?"
                : "Step 2 of 3: What did you grow?")}
            {step === 3 &&
              (lang === "ne" ? "चरण ३ को ३: तपाईंको नतिजा" : "Step 3 of 3: Your result")}
          </span>
          <span className="text-muted-foreground font-mono text-xs">{step}/3</span>
        </div>

        {/* 3 Progress Bars */}
        <div className="grid grid-cols-3 gap-2">
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              step >= 1 ? "bg-primary" : "bg-muted",
            )}
          />
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              step >= 2 ? "bg-primary" : "bg-muted",
            )}
          />
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              step >= 3 ? "bg-primary" : "bg-muted",
            )}
          />
        </div>
      </div>

      {/* =========================================================================
          STEP 1: WHERE IS YOUR FARM?
         ========================================================================= */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center sm:text-left space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              {lang === "ne" ? "तपाईंको खेत कहाँ छ?" : "Where is your farm?"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {lang === "ne"
                ? "तपाईंको आफ्नै खेतको हरियाली र पानी जाँच्न तलको ठूलो हरियो बटन थिच्नुहोस्।"
                : "Tap the green button to automatically check satellite rain and greenness for your land."}
            </p>
          </div>

          {/* Primary Big GPS Button */}
          <button
            onClick={handleAcquireGps}
            disabled={locatingGps}
            className="w-full min-h-[58px] py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 shadow-md hover:bg-primary/95 active:scale-[0.99] transition-all disabled:opacity-70"
          >
            <Navigation
              className={cn("h-6 w-6 text-primary-foreground", locatingGps && "animate-spin")}
            />
            <span>
              {locatingGps
                ? lang === "ne"
                  ? "स्थान पत्ता लगाउँदै..."
                  : "Finding your location..."
                : lang === "ne"
                  ? "मेरो स्थान प्रयोग गर्नुहोस् (Use My Location)"
                  : "Use My Current Location"}
            </span>
          </button>

          {/* Location Error Guidance Banner */}
          {locationError && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 space-y-1.5">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />
                <span>{lang === "ne" ? "स्थान पत्ता लागेन" : "Location Permission Needed"}</span>
              </div>
              <p className="leading-relaxed text-amber-800">{locationError}</p>
            </div>
          )}

          {/* Secondary Option: Saved Farms or Coordinate Picker */}
          <div className="pt-2 border-t border-border space-y-3">
            {farmFields.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-muted-foreground block uppercase">
                  {lang === "ne"
                    ? "वा सुरक्षित गरिएको खेत रोज्नुहोस्:"
                    : "Or pick from your saved plots:"}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {farmFields.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => handleSelectSavedFarm(f.id)}
                      className="p-3.5 rounded-xl border border-border bg-muted/30 hover:bg-muted text-left flex items-center justify-between text-xs sm:text-sm font-semibold transition-colors"
                    >
                      <span className="truncate">{f.fieldName}</span>
                      <span className="text-xs text-primary font-bold">
                        {lang === "ne" ? "छान्नुहोस् →" : "Select →"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Toggle Manual / Map picker */}
            <div>
              <button
                onClick={() => setShowManualPicker(!showManualPicker)}
                className="text-xs sm:text-sm font-bold text-primary hover:underline flex items-center gap-1.5 min-h-[44px]"
              >
                <MapPin className="h-4 w-4" />
                <span>
                  {showManualPicker
                    ? lang === "ne"
                      ? "नक्सा विकल्प लुकाउनुहोस्"
                      : "Hide coordinates input"
                    : lang === "ne"
                      ? "वा नक्सा / अक्षांश राख्नुहोस् (Pick on map)"
                      : "Or enter coordinates manually (Pick on map)"}
                </span>
              </button>

              {showManualPicker && (
                <div className="mt-3 p-4 rounded-2xl border border-border bg-secondary/30 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        {lang === "ne" ? "अक्षांश (Latitude)" : "Latitude"}
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={manualLat}
                        onChange={(e) => setManualLat(e.target.value)}
                        className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono"
                        placeholder="27.6775"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        {lang === "ne" ? "देशान्तर (Longitude)" : "Longitude"}
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={manualLon}
                        onChange={(e) => setManualLon(e.target.value)}
                        className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono"
                        placeholder="84.4333"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleApplyManualCoords}
                    className="w-full py-2.5 rounded-xl bg-secondary text-primary font-bold text-xs sm:text-sm border border-primary/20 hover:bg-secondary/80 transition-colors min-h-[44px]"
                  >
                    {lang === "ne" ? "यो स्थान प्रयोग गर्नुहोस् →" : "Use these coordinates →"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 2: WHAT DID YOU GROW?
         ========================================================================= */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{lang === "ne" ? "स्थान बदल्नुहोस्" : "Change location"}</span>
            </button>
            <span className="text-xs font-bold text-primary truncate max-w-[200px]">
              📍{" "}
              {locationName ||
                (coords ? `${coords[0].toFixed(2)}°, ${coords[1].toFixed(2)}°` : "Selected")}
            </span>
          </div>

          <div className="text-center sm:text-left space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              {lang === "ne" ? "तपाईंले भर्खर कुन बाली लगाउनुभयो?" : "What did you grow?"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {lang === "ne"
                ? "पछिल्लो बाली छान्नुहोस् ताकि अर्को मौसमका लागि उत्तम बालीहरू सुझाव दिन सकियोस्।"
                : "Select the most recent crop so we can calculate rotation benefits for your next cycle."}
            </p>
          </div>

          {/* 5 Big Touch Crop Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRECEDING_CROPS.map((crop) => {
              const isSelected = selectedCrop === crop.id;
              return (
                <button
                  key={crop.id}
                  onClick={() => {
                    setSelectedCrop(crop.id);
                    handleRunAnalysis(crop.id);
                  }}
                  className={cn(
                    "min-h-[64px] p-4 rounded-2xl border text-left flex items-center gap-3.5 transition-all shadow-xs",
                    isSelected
                      ? "border-primary bg-primary/10 ring-2 ring-primary"
                      : "border-border bg-card hover:bg-muted/50",
                  )}
                >
                  <span className="text-3xl shrink-0">{crop.icon}</span>
                  <div className="min-w-0">
                    <strong className="block text-base font-extrabold text-foreground truncate">
                      {lang === "ne" ? crop.nameNe : crop.nameEn}
                    </strong>
                    <span className="text-xs text-muted-foreground block truncate">
                      {lang === "ne" ? crop.descNe : crop.descEn}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground text-center sm:text-left">
            {lang === "ne"
              ? "बाली छानेपछि स्वतः भू-उपग्रह जाँच सुरु हुनेछ।"
              : "Tapping a crop starts the satellite analysis automatically."}
          </p>
        </div>
      )}

      {/* =========================================================================
          STEP 3: RESULT SCREEN
         ========================================================================= */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Top Bar with actions */}
          <div className="flex items-center justify-between border-b border-border pb-3">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{lang === "ne" ? "नयाँ खेत जाँच्नुहोस्" : "Check another plot"}</span>
            </button>

            {hasSpeechSupport && !isAnalyzing && (
              <button
                onClick={handleToggleSpeak}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border",
                  isSpeaking
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/60 text-primary border-primary/20 hover:bg-secondary",
                )}
                title={lang === "ne" ? "नतिजा सुन्नुहोस्" : "Listen to result"}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="h-4 w-4" />
                    <span>{lang === "ne" ? "रोक्नुहोस्" : "Stop"}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4" />
                    <span>{lang === "ne" ? "सुन्नुहोस् (Listen)" : "Listen"}</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Loading State */}
          {isAnalyzing ? (
            <div className="p-8 text-center space-y-4 rounded-3xl bg-secondary/30 border border-border">
              <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-extrabold text-foreground">
                  {lang === "ne"
                    ? "तपाईंको खेतको भू-उपग्रह तस्बिर हेर्दै छौँ..."
                    : "Looking at satellite pictures of your farm..."}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  {lang === "ne"
                    ? "नासा उपग्रहबाट वर्षा र बिरुवाको हरियाली नापिँदै छ। केही सेकेन्ड लाग्न सक्छ।"
                    : "Reading 30m resolution reflectance and rain measurements. Just a few moments."}
                </p>
              </div>
            </div>
          ) : analysisError ? (
            <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
              <div className="flex items-center gap-2 font-bold text-base">
                <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0" />
                <span>{lang === "ne" ? "डाटा प्राप्त गर्न सकिएन" : "Notice"}</span>
              </div>
              <p className="text-sm leading-relaxed">{analysisError}</p>
              <button
                onClick={() => handleRunAnalysis()}
                className="px-4 py-2 rounded-xl bg-amber-700 text-white font-bold text-xs"
              >
                {lang === "ne" ? "फेरि प्रयास गर्नुहोस्" : "Try Again"}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Traffic Light Card */}
              <div
                className={cn(
                  "p-5 sm:p-6 rounded-3xl border shadow-xs space-y-3",
                  health.level === "green" &&
                    "bg-emerald-50/70 border-emerald-300 text-emerald-950",
                  health.level === "yellow" && "bg-amber-50/70 border-amber-300 text-amber-950",
                  health.level === "red" && "bg-rose-50/70 border-rose-300 text-rose-950",
                )}
              >
                {/* Traffic Light Badge */}
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "h-4 w-4 rounded-full animate-pulse",
                      health.level === "green" && "bg-emerald-600 shadow-[0_0_8px_#10B981]",
                      health.level === "yellow" && "bg-amber-500 shadow-[0_0_8px_#F59E0B]",
                      health.level === "red" && "bg-rose-600 shadow-[0_0_8px_#EF4444]",
                    )}
                  />
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide">
                    {lang === "ne" ? health.titleNe : health.titleEn}
                  </span>
                </div>

                {/* Plain 1-Sentence Meaning */}
                <p className="text-base sm:text-lg font-bold leading-snug">
                  {lang === "ne" ? health.meaningNe : health.meaningEn}
                </p>

                {/* Plain 1-Sentence Next Step Action */}
                <p className="text-sm sm:text-base font-medium opacity-90 border-t border-black/10 pt-2">
                  👉 <strong>{lang === "ne" ? "अब के गर्ने: " : "What to do now: "}</strong>
                  {lang === "ne" ? health.actionNe : health.actionEn}
                </p>
              </div>

              {/* Rain and Greenness YoY Comparison (Plain Words) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Rain YoY */}
                <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card space-y-2">
                  <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase">
                    <CloudRain className="h-4 w-4 text-primary" />
                    {lang === "ne" ? "वर्षा तुलना (Rain Comparison)" : "Rain vs Last Year"}
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-foreground">
                    {rainfallYoY?.percentageChange !== null &&
                    rainfallYoY?.percentageChange !== undefined ? (
                      <span>
                        {Math.abs(rainfallYoY.percentageChange)}%{" "}
                        {rainfallYoY.percentageChange >= 0
                          ? lang === "ne"
                            ? "बढी पानी परेको"
                            : "more rain"
                          : lang === "ne"
                            ? "कम पानी परेको"
                            : "less rain"}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground font-normal">
                        {lang === "ne" ? "डाटा उपलब्ध छैन" : "No recent data"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {lang === "ne"
                      ? "गत वर्षको यही अवधिको तुलनामा तपाईंको खेतको वर्षा।"
                      : "Rainfall accumulation compared to the exact same calendar period last year."}
                  </p>
                </div>

                {/* Plant Greenness YoY */}
                <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card space-y-2">
                  <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase">
                    <Leaf className="h-4 w-4 text-primary" />
                    {lang === "ne" ? "बिरुवाको हरियाली (Plant Greenness)" : "Plant Greenness"}
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-foreground">
                    {hlsSummary?.ndviDifferenceFromLastYear !== null &&
                    hlsSummary?.ndviDifferenceFromLastYear !== undefined ? (
                      <span>
                        {hlsSummary.ndviDifferenceFromLastYear >= 0
                          ? lang === "ne"
                            ? "गत वर्षभन्दा हरियाली बढी छ"
                            : "Greener than last year"
                          : lang === "ne"
                            ? "गत वर्षभन्दा हरियाली केही कम छ"
                            : "Lower greenness than last year"}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground font-normal">
                        {lang === "ne" ? "उपग्रह तस्बिरमा बादल छ" : "No clear image (clouds)"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {lang === "ne"
                      ? "नासा उपग्रहले देखेको पातहरूको हरियाली स्तर।"
                      : "Reflectance density measured by Sentinel-2 / Landsat satellites."}
                  </p>
                </div>
              </div>

              {/* Top 3 Suitable Crops on the Map */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-primary" />
                    <span>
                      {lang === "ne"
                        ? "यस जग्गाका लागि उपयुक्त बालीहरू (Suitable crops for this land)"
                        : "Suitable crops for this land"}
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {lang === "ne"
                      ? "माटोको चक्र र मौसम अनुसार अर्को सिजनका लागि राम्रो बालीहरू।"
                      : "Crops recommended by rotation science for your next cycle."}
                  </p>
                </div>

                {/* 3 Suitable Crop Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {topCrops.map((c, i) => (
                    <div
                      key={c.cropId}
                      className="p-4 rounded-2xl border border-border bg-secondary/30 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary">#{i + 1}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                          {c.suitabilityStatus.replace("_", " ")}
                        </span>
                      </div>
                      <strong className="block text-base font-extrabold text-foreground">
                        {lang === "ne" ? c.cropNameNe : c.cropNameEn}
                      </strong>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {lang === "ne" ? c.reasonNe : c.reasonEn}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Leaflet Map with Top 3 Crops */}
                <div className="h-64 sm:h-72 rounded-2xl overflow-hidden border border-border shadow-xs">
                  <LazyMap center={mapCenter} zoom={15} markers={markers} height={288} />
                </div>
              </div>

              {/* Collapsed Technical Details */}
              <details className="rounded-2xl border border-border bg-muted/20 p-4 text-xs space-y-2">
                <summary className="font-bold text-foreground cursor-pointer hover:text-primary flex items-center gap-1.5">
                  <ChevronDown className="h-4 w-4" />
                  <span>
                    {lang === "ne"
                      ? "थप प्राविधिक विवरण हेर्नुहोस् (More details)"
                      : "More technical details"}
                  </span>
                </summary>
                <div className="pt-3 space-y-2 text-muted-foreground border-t border-border mt-2">
                  <div className="flex justify-between">
                    <span>Data Source:</span>
                    <strong className="text-foreground">
                      {hlsSummary?.dataSource || "NASA HLS / MODIS"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Greenness Index (NDVI):</span>
                    <strong className="text-foreground font-mono">
                      {hlsSummary?.currentNdvi ?? "N/A"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Scene Date:</span>
                    <strong className="text-foreground">
                      {hlsSummary?.currentDate || "Recent"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Cloud Cover:</span>
                    <strong className="text-foreground">
                      {hlsSummary?.cloudPercentage !== undefined
                        ? `${hlsSummary.cloudPercentage}%`
                        : "Clear"}
                    </strong>
                  </div>
                </div>
              </details>

              {/* Safeguards Disclaimer */}
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border text-[11px] sm:text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">
                  ⚠️{" "}
                  {lang === "ne" ? "सावधानी र जिम्मेवारी अस्वीकरण" : "Important Note & Safeguards"}
                </p>
                <p>
                  {lang === "ne"
                    ? "उपग्रह अनुमानहरू सामान्य जानकारीका लागि मात्र हुन्; यो प्रयोगशाला परीक्षण वा रोग निदान होइन। कुनै पनि विषादी, मल वा औषधि सिफारिस गरिएको छैन। निर्णय लिनुअघि आफ्नो स्थानीय कृषि ज्ञान केन्द्र वा शाखासँग सम्पर्क गर्नुहोस्।"
                    : "Satellite observations provide spatial estimations, not on-site crop disease diagnosis or pesticide/fertilizer prescription. Always verify with your local agricultural extension service."}
                </p>
              </div>

              {/* Button to Enter Full Dashboard */}
              {onViewDashboard && (
                <div className="pt-2 text-center">
                  <button
                    onClick={onViewDashboard}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary hover:underline"
                  >
                    <span>
                      {lang === "ne"
                        ? "विस्तृत कृषि ड्यासबोर्ड खोल्नुहोस् →"
                        : "Explore full agricultural dashboard →"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
