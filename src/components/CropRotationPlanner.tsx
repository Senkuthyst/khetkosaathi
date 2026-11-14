import { useState } from "react";
import {
  RotateCcw,
  CheckCircle2,
  Droplets,
  Sprout,
  ShieldAlert,
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Info,
  Scale,
  Leaf,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { num } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface RotationSequence {
  id: string;
  title: string;
  titleNe: string;
  pattern: string[];
  suitabilityScore: number;
  waterReqLevel: "Low" | "Medium" | "High";
  waterReqMm: string;
  nitrogenImpact: string;
  organicMatterScore: number; // 0-100
  pestBreakScore: number; // 0-100
  pros: string[];
  cons: string[];
  scientificEvidence: string;
  limitations: string;
}

export function CropRotationPlanner() {
  const { lang } = useApp();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [location, setLocation] = useState("chitwan");
  const [soilType, setSoilType] = useState<"alluvial" | "clayLoam" | "sandyLoam" | "siltLoam">("alluvial");
  const [ph, setPh] = useState<number>(6.2);
  const [organicMatter, setOrganicMatter] = useState<number>(2.1);
  const [drainage, setDrainage] = useState<"well" | "moderate" | "poor">("moderate");
  const [irrigation, setIrrigation] = useState<"assured" | "seasonal" | "rainfed">("seasonal");

  const [priorities, setPriorities] = useState<string[]>([
    "soil_health",
    "water_conservation",
  ]);

  const togglePriority = (id: string) => {
    setPriorities((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Dynamic suitability calculations based on inputs
  const computeSequences = (): RotationSequence[] => {
    const isWaterConserve = priorities.includes("water_conservation");
    const isSoilHealth = priorities.includes("soil_health");
    const isRainfed = irrigation === "rainfed";

    const seqA_Score = Math.min(
      96,
      Math.max(
        60,
        78 +
          (isSoilHealth ? 10 : 0) +
          (drainage === "moderate" ? 5 : 0) +
          (ph >= 6.0 && ph <= 7.2 ? 6 : -4) +
          (isRainfed ? -15 : 2)
      )
    );

    const seqB_Score = Math.min(
      94,
      Math.max(
        55,
        74 +
          (isWaterConserve ? 12 : 0) +
          (soilType === "sandyLoam" || soilType === "alluvial" ? 6 : 0) +
          (isRainfed ? 5 : -2)
      )
    );

    const seqC_Score = Math.min(
      92,
      Math.max(
        50,
        72 +
          (drainage === "well" ? 14 : drainage === "poor" ? -18 : 2) +
          (irrigation === "assured" ? 12 : -15) +
          (organicMatter >= 2.5 ? 6 : 0)
      )
    );

    return [
      {
        id: "seq-legume",
        title: "Rice → Wheat → Mungbean / Cowpea",
        titleNe: "धान → गहुँ → मुङ / बोडी (दलहन समावेश)",
        pattern: ["Rice (Monsoon)", "Wheat (Winter)", "Mungbean (Spring Legume)"],
        suitabilityScore: seqA_Score,
        waterReqLevel: isRainfed ? "High" : "Medium",
        waterReqMm: "1,150 – 1,350 mm/yr",
        nitrogenImpact: "+35 to +50 kg N/ha biological fixation",
        organicMatterScore: 88,
        pestBreakScore: 82,
        pros: [
          "Mungbean fixes atmospheric nitrogen, reducing subsequent synthetic urea requirement.",
          "Breaks the monoculture weed and insect pathogen cycle between wheat and monsoon rice.",
          "High protein harvest for family nutrition and local market sale.",
        ],
        cons: [
          "Requires timely spring sowing before pre-monsoon squalls.",
          "Sensitive to waterlogging during early legume flowering.",
        ],
        scientificEvidence:
          "Nepal Agricultural Research Council (NARC) Agronomy Division long-term trials in Terai & Mid-Hills (1998–2024); CIMMYT South Asia cropping systems report.",
        limitations:
          "Legume rhizobium nodulation efficiency depends on adequate phosphorus and absence of extreme soil acidity (pH > 5.8).",
      },
      {
        id: "seq-oilseed",
        title: "Rice → Rapeseed (Mustard) → Spring Maize",
        titleNe: "धान → तोरी → मकै (तेलहन-अन्न विविधता)",
        pattern: ["Rice (Monsoon)", "Mustard / Toria (Early Winter)", "Spring Maize"],
        suitabilityScore: seqB_Score,
        waterReqLevel: "Low",
        waterReqMm: "850 – 1,050 mm/yr",
        nitrogenImpact: "Neutral to slight negative (requires balanced organic manure)",
        organicMatterScore: 74,
        pestBreakScore: 89,
        pros: [
          "High water-use efficiency; mustard thrives on residual monsoon moisture.",
          "Mustard root glucosinolates provide biofumigation against soil nematodes.",
          "Frees land quickly (85–95 days) allowing timely spring maize planting.",
        ],
        cons: [
          "Mustard is sensitive to alternating winter aphids during high humidity.",
          "Does not add biological nitrogen; requires compost or farmyard manure.",
        ],
        scientificEvidence:
          "NARC National Oilseed Research Program (Nawalpur, Sarlahi); Directorate of Agricultural Research (Gandaki/Bagmati).",
        limitations:
          "Biofumigation effect requires turning under green residues; aphid risk requires frequent visual plot scouting.",
      },
      {
        id: "seq-tuber-green",
        title: "Rice → Potato → Dhaincha (Green Manure)",
        titleNe: "धान → आलु → ढैँचा (हरियो मल र आलु)",
        pattern: ["Rice (Monsoon)", "Potato (Winter Cash Crop)", "Dhaincha (Summer Green Manure)"],
        suitabilityScore: seqC_Score,
        waterReqLevel: "Medium",
        waterReqMm: "1,000 – 1,200 mm/yr",
        nitrogenImpact: "+60 to +80 kg N/ha from Dhaincha biomass",
        organicMatterScore: 95,
        pestBreakScore: 85,
        pros: [
          "Exceptional organic matter building via Sesbania (Dhaincha) incorporation.",
          "Potato offers high economic cash returns per kattha/ropani in winter.",
          "Substantial improvement in soil aggregate stability and water retention.",
        ],
        cons: [
          "Requires strict tuber seed storage and reliable irrigation during potato bulking.",
          "Unsuitable for waterlogged or poorly drained heavy clay parcels.",
        ],
        scientificEvidence:
          "NARC National Potato Research Program (Khumaltar) & Regional Agricultural Research Station (Lumle/Parwanipur).",
        limitations:
          "Late blight (Phytophthora) vulnerability in cool foggy winter periods; potato requires light, friable, well-drained topsoil.",
      },
    ];
  };

  const sequences = computeSequences();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-card to-secondary/30 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
              <Sprout className="h-3.5 w-3.5" />
              {lang === "ne" ? "निर्णय सहयोग प्रणाली" : "Scientific Decision Support"}
            </div>
            <h2 className="mt-2 text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              {lang === "ne" ? "बाली चक्र तथा माटो व्यवस्थापन योजनाकार" : "Crop Intelligence & Rotation Planner"}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl">
              {lang === "ne"
                ? "स्थान, माटोको गुणस्तर, पानी उपलब्धता र वातावरणीय प्राथमिकता अनुसार वैज्ञानिक रूपमा सिफारिस गरिएको ५-चरणे बाली चक्र।"
                : "Evaluate regenerative crop rotation sequences based on your farm's soil characteristics, water availability, and agro-ecological priorities."}
            </p>
          </div>

          {/* Step pill buttons */}
          <div className="flex items-center gap-1 self-start sm:self-auto bg-muted/60 p-1 rounded-xl">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setStep(s as any)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  step === s
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {lang === "ne" ? `चरण ${num(lang, s)}` : `Step ${s}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step 1: Farm Location */}
      {step === 1 && (
        <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              1
            </span>
            <h3 className="font-bold text-foreground">
              {lang === "ne" ? "चरण १: खेतको भौगोलिक क्षेत्र चयन गर्नुहोस्" : "Step 1: Select Farm Location & Agro-Ecological Zone"}
            </h3>
          </div>

          <p className="text-xs text-muted-foreground">
            {lang === "ne"
              ? "नेपालका फरक कृषि-पारिस्थितिक क्षेत्रहरूमा तापक्रम, सौर्य विकिरण र मनसुनको ढाँचा फरक हुने भएकाले उपयुक्त स्थान छान्नुहोस्।"
              : "Cropping suitability depends on altitude, thermal units, and precipitation timing across Nepal's diverse agro-ecological belts."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                id: "chitwan",
                name: "Chitwan Valley (चितवन उपत्यका)",
                zone: "Inner Terai / Sub-tropical (180–250 m)",
                temp: "15°C – 38°C",
                rain: "1,800 mm/yr",
              },
              {
                id: "jhapa",
                name: "Eastern Terai - Jhapa (झापा तराई)",
                zone: "Eastern Plain (70–120 m)",
                temp: "12°C – 36°C",
                rain: "2,200 mm/yr",
              },
              {
                id: "pokhara",
                name: "Pokhara Valley (पोखरा उपत्यका)",
                zone: "Mid-Hills River Basin (800–950 m)",
                temp: "8°C – 32°C",
                rain: "3,800 mm/yr",
              },
              {
                id: "kavre",
                name: "Kavre Mid-Hills (काभ्रे मध्यपहाड)",
                zone: "Mid-Hills Terraced (1,200–1,600 m)",
                temp: "4°C – 28°C",
                rain: "1,400 mm/yr",
              },
            ].map((loc) => (
              <div
                key={loc.id}
                onClick={() => setLocation(loc.id)}
                className={cn(
                  "cursor-pointer rounded-xl border-2 p-4 transition-all text-left",
                  location === loc.id
                    ? "border-primary bg-secondary/50 shadow-sm"
                    : "border-border hover:border-primary/40 bg-card"
                )}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-foreground">{loc.name}</h4>
                  {location === loc.id && (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  )}
                </div>
                <p className="mt-1 text-xs text-primary font-medium">{loc.zone}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t pt-2">
                  <span>🌡 {loc.temp}</span>
                  <span>🌧 {loc.rain}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              {lang === "ne" ? "अर्को: माटोका विशेषताहरू" : "Next: Soil Characteristics"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Soil Characteristics */}
      {step === 2 && (
        <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              2
            </span>
            <h3 className="font-bold text-foreground">
              {lang === "ne" ? "चरण २: माटोको भौतिक तथा रासायनिक अवस्था" : "Step 2: Enter Soil Characteristics"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Soil Type */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-2">
                {lang === "ne" ? "माटोको प्रकार (Soil Texture)" : "Soil Texture / Classification"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "alluvial", label: "Alluvial Silt (दोमट/पाँगो)" },
                  { id: "clayLoam", label: "Clay Loam (चिम्ट्याइलो)" },
                  { id: "sandyLoam", label: "Sandy Loam (बलौटे दोमट)" },
                  { id: "siltLoam", label: "Silt Loam (मसिनो पाँगो)" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSoilType(s.id as any)}
                    className={cn(
                      "tap rounded-xl border-2 px-3 py-2 text-xs font-semibold transition-all text-left",
                      soilType === s.id
                        ? "border-primary bg-secondary text-primary"
                        : "border-border text-foreground hover:bg-muted"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Drainage */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-2">
                {lang === "ne" ? "पानी निकास (Drainage Capacity)" : "Parcel Drainage Capacity"}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "well", label: "Well Drained (राम्रो)" },
                  { id: "moderate", label: "Moderate (मध्यम)" },
                  { id: "poor", label: "Poor / Waterlogged (कमजोर)" },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDrainage(d.id as any)}
                    className={cn(
                      "tap rounded-xl border-2 px-2 py-2 text-xs font-semibold transition-all text-center",
                      drainage === d.id
                        ? "border-primary bg-secondary text-primary"
                        : "border-border text-foreground hover:bg-muted"
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* pH Slider */}
            <div className="rounded-xl border p-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  {lang === "ne" ? "माटोको pH मान" : "Soil pH Level"}
                </span>
                <span className="font-extrabold text-sm text-primary">
                  {num(lang, ph.toFixed(1))} ({ph < 5.8 ? "Acidic" : ph > 7.3 ? "Alkaline" : "Optimal Neutral"})
                </span>
              </div>
              <input
                type="range"
                min="4.5"
                max="8.5"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(parseFloat(e.target.value))}
                className="w-full mt-3 accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>4.5 (Acidic)</span>
                <span>6.5 (Neutral)</span>
                <span>8.5 (Alkaline)</span>
              </div>
            </div>

            {/* Organic Matter Slider */}
            <div className="rounded-xl border p-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  {lang === "ne" ? "जैविक पदार्थ (Organic Matter %)" : "Soil Organic Matter (SOM %)"}
                </span>
                <span className="font-extrabold text-sm text-primary">
                  {num(lang, organicMatter.toFixed(1))}% ({organicMatter < 1.5 ? "Low" : organicMatter < 3.0 ? "Moderate" : "Good"})
                </span>
              </div>
              <input
                type="range"
                min="0.8"
                max="5.0"
                step="0.1"
                value={organicMatter}
                onChange={(e) => setOrganicMatter(parseFloat(e.target.value))}
                className="w-full mt-3 accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>0.8% (Depleted)</span>
                <span>2.5% (Average Terai)</span>
                <span>5.0% (Enriched)</span>
              </div>
            </div>

            {/* Irrigation Availability */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-foreground mb-2">
                {lang === "ne" ? "सिँचाइ सुविधा (Irrigation Infrastructure)" : "Farm Irrigation Infrastructure"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: "assured", title: "Year-Round Canal / Borewell", desc: "कुलो वा बोरिङबाट बाह्रै महिना" },
                  { id: "seasonal", title: "Seasonal Irrigation", desc: "मनसुन र हिउँदको सुरुमा मात्र" },
                  { id: "rainfed", title: "Rainfed (आकासे पानी निर्भर)", desc: "कुनै स्थायी सिँचाइ संरचना नभएको" },
                ].map((irr) => (
                  <button
                    key={irr.id}
                    type="button"
                    onClick={() => setIrrigation(irr.id as any)}
                    className={cn(
                      "tap rounded-xl border-2 p-3 text-left transition-all",
                      irrigation === irr.id
                        ? "border-primary bg-secondary text-primary"
                        : "border-border text-foreground hover:bg-muted"
                    )}
                  >
                    <p className="font-bold text-xs">{irr.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{irr.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <button
              onClick={() => setStep(1)}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors"
            >
              {lang === "ne" ? "पछाडि" : "Back"}
            </button>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              {lang === "ne" ? "अर्को: कृषि प्राथमिकताहरू" : "Next: Farming Priorities"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Farming Priorities */}
      {step === 3 && (
        <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              3
            </span>
            <h3 className="font-bold text-foreground">
              {lang === "ne" ? "चरण ३: कृषि तथा वातावरणीय प्राथमिकता छान्नुहोस्" : "Step 3: Select Farming Priorities & Goals"}
            </h3>
          </div>

          <p className="text-xs text-muted-foreground">
            {lang === "ne"
              ? "तपाईंको खेतका मुख्य आवश्यकताहरू छान्नुहोस्। प्रणालीले सोही अनुसार उपयुक्त बाली चक्रको गणना गर्नेछ।"
              : "Choose 1 to 4 primary agro-ecological objectives to weight the suitability scoring algorithm."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                id: "soil_health",
                Icon: Sprout,
                title: "Soil Fertility & N-Fixation (माटो सुधार र नाइट्रोजन)",
                desc: "Rebuild depleted organic carbon and add natural biological nitrogen through leguminous crops.",
              },
              {
                id: "water_conservation",
                Icon: Droplets,
                title: "Water Conservation & Drought Guard (पानी बचत)",
                desc: "Minimize groundwater pumping and prioritize crops with low evapotranspiration during dry months.",
              },
              {
                id: "crop_diversification",
                Icon: Layers,
                title: "Crop Diversification & Pest Breaks (रोग-कीरा नियन्त्रण)",
                desc: "Interrupt insect lifecycles and soil fungal pathogens by rotating non-host plant families.",
              },
              {
                id: "environmental_resilience",
                Icon: Scale,
                title: "Climate & Economic Resilience (जलवायु अनुकूलन)",
                desc: "Balance market profitability with thermal heat-stress tolerance for unpredictable weather.",
              },
            ].map((p) => {
              const active = priorities.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => togglePriority(p.id)}
                  className={cn(
                    "cursor-pointer rounded-xl border-2 p-4 transition-all flex items-start gap-3",
                    active
                      ? "border-primary bg-secondary/50 shadow-sm"
                      : "border-border hover:border-primary/40 bg-card"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg shrink-0",
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    <p.Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-foreground">{p.title}</h4>
                      {active && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <button
              onClick={() => setStep(2)}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors"
            >
              {lang === "ne" ? "पछाडि" : "Back"}
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={priorities.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
            >
              {lang === "ne" ? "चरण ४: विकल्पहरूको विश्लेषण" : "Step 4: Analyze Rotation Alternatives"}
              <Sparkles className="h-4 w-4 text-accent" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Analysis Overview */}
      {step === 4 && (
        <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              4
            </span>
            <h3 className="font-bold text-foreground">
              {lang === "ne" ? "चरण ४: वैज्ञानिक मोडल विश्लेषण सारांश" : "Step 4: Agro-Ecological Analysis Summary"}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border p-3 bg-muted/40 text-center">
              <span className="text-[11px] text-muted-foreground block">{lang === "ne" ? "स्थान" : "Location"}</span>
              <span className="text-sm font-bold text-foreground capitalize">{location}</span>
            </div>
            <div className="rounded-xl border p-3 bg-muted/40 text-center">
              <span className="text-[11px] text-muted-foreground block">{lang === "ne" ? "माटो र pH" : "Texture & pH"}</span>
              <span className="text-sm font-bold text-foreground capitalize">{soilType} · {ph.toFixed(1)}</span>
            </div>
            <div className="rounded-xl border p-3 bg-muted/40 text-center">
              <span className="text-[11px] text-muted-foreground block">{lang === "ne" ? "सिँचाइ" : "Irrigation"}</span>
              <span className="text-sm font-bold text-foreground capitalize">{irrigation}</span>
            </div>
            <div className="rounded-xl border p-3 bg-muted/40 text-center">
              <span className="text-[11px] text-muted-foreground block">{lang === "ne" ? "प्राथमिकताहरू" : "Priorities"}</span>
              <span className="text-sm font-bold text-primary">{priorities.length} Selected</span>
            </div>
          </div>

          {/* Analysis Card */}
          <div className="rounded-xl bg-secondary/50 border border-primary/20 p-5 space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <TrendingUp className="h-4 w-4" />
              {lang === "ne" ? "मोडल विश्लेषण नतिजा तयार छ" : "3 Suitable Multi-Cropping Sequences Evaluated"}
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">
              Based on your field's {soilType} texture, pH of {ph.toFixed(1)}, and {irrigation} status in {location},
              the decision matrix weighted your {priorities.join(", ").replaceAll("_", " ")} goals against NARC long-term agronomic observations.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <button
              onClick={() => setStep(3)}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors"
            >
              {lang === "ne" ? "पछाडि" : "Back"}
            </button>
            <button
              onClick={() => setStep(5)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              {lang === "ne" ? "चरण ५: तुलनात्मक तालिका हेर्नुहोस्" : "Step 5: View Detailed Comparison"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Results & Comparison Interface */}
      {step === 5 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  5
                </span>
                <h3 className="font-bold text-lg text-foreground">
                  {lang === "ne" ? "चरण ५: बाली चक्र विकल्पहरूको तुलनात्मक प्रतिवेदन" : "Step 5: Crop Rotation Sequence Comparison"}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {lang === "ne"
                  ? "विभिन्न चक्रहरूको अनुकूलता अङ्क, पानी खपत, माटो सुधार र प्राविधिक सीमाहरूको विस्तृत तुलना।"
                  : "Compare suitability scores, water requirements, soil health impacts, and published scientific evidence."}
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-primary hover:underline"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {lang === "ne" ? "पुनः कन्फिगर गर्नुहोस्" : "Reconfigure Inputs"}
            </button>
          </div>

          {/* Sequence Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {sequences.map((seq, idx) => (
              <div
                key={seq.id}
                className={cn(
                  "rounded-2xl border bg-card p-5 shadow-sm flex flex-col justify-between transition-all",
                  idx === 0 ? "border-primary/60 ring-2 ring-primary/10" : "border-border"
                )}
              >
                <div>
                  {/* Badge & Score */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-bold text-primary">
                      {idx === 0 ? "⭐ Highest Match" : `Alternative ${idx + 1}`}
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-primary">
                        {num(lang, seq.suitabilityScore)}
                      </span>
                      <span className="text-xs text-muted-foreground">/100</span>
                      <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Suitability</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="mt-3 font-extrabold text-base text-foreground leading-snug">
                    {lang === "ne" ? seq.titleNe : seq.title}
                  </h4>

                  {/* Visual Pattern Steps */}
                  <div className="mt-3 flex items-center gap-1 flex-wrap">
                    {seq.pattern.map((p, pIdx) => (
                      <span
                        key={pIdx}
                        className="inline-flex items-center gap-1 rounded-lg border bg-muted/60 px-2 py-1 text-[11px] font-semibold text-foreground"
                      >
                        <Leaf className="h-3 w-3 text-leaf" />
                        {p}
                        {pIdx < seq.pattern.length - 1 && <span className="text-muted-foreground">→</span>}
                      </span>
                    ))}
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs border-y py-3">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">{lang === "ne" ? "पानी आवश्यकता" : "Water Need"}</span>
                      <span className="font-bold text-foreground">{seq.waterReqLevel} ({seq.waterReqMm})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">{lang === "ne" ? "नाइट्रोजन प्रभाव" : "N Balance"}</span>
                      <span className="font-bold text-primary">{seq.nitrogenImpact}</span>
                    </div>
                  </div>

                  {/* Advantages */}
                  <div className="mt-4">
                    <h5 className="text-xs font-bold text-primary uppercase tracking-wide flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      {lang === "ne" ? "फाइदाहरू" : "Agronomic Advantages"}
                    </h5>
                    <ul className="mt-1.5 space-y-1 text-xs text-foreground/85">
                      {seq.pros.map((pro, pI) => (
                        <li key={pI} className="flex items-start gap-1.5">
                          <span className="text-primary font-bold">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Disadvantages / Watchouts */}
                  <div className="mt-3">
                    <h5 className="text-xs font-bold text-destructive uppercase tracking-wide flex items-center gap-1">
                      <ShieldAlert className="h-3.5 w-3.5 text-destructive" />
                      {lang === "ne" ? "सावधानीहरू" : "Considerations & Risks"}
                    </h5>
                    <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                      {seq.cons.map((con, cI) => (
                        <li key={cI} className="flex items-start gap-1.5">
                          <span className="text-destructive font-bold">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Evidence & Scientific Limitations */}
                <div className="mt-5 pt-3 border-t text-[11px] space-y-1.5 bg-muted/30 p-2.5 rounded-xl">
                  <div>
                    <span className="font-bold text-muted-foreground block">
                      <Info className="inline h-3 w-3 mr-1" />
                      {lang === "ne" ? "वैज्ञानिक प्रमाण" : "Supporting Evidence"}:
                    </span>
                    <span className="text-foreground/80">{seq.scientificEvidence}</span>
                  </div>
                  <div>
                    <span className="font-bold text-muted-foreground block">
                      {lang === "ne" ? "वैज्ञानिक सीमाहरू" : "Scientific Limitations"}:
                    </span>
                    <span className="text-foreground/70 italic">{seq.limitations}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scientific Disclaimer Note */}
          <div className="rounded-xl border border-dashed border-primary/40 bg-secondary/30 p-4 text-xs text-foreground/80 flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-primary block">
                {lang === "ne" ? "वैज्ञानिक शुद्धता तथा सिफारिस सीमा सूचना" : "Scientific Validation & Field Safety Disclaimer"}
              </span>
              <span>
                {lang === "ne"
                  ? "यो योजनाकार नेपाल कृषि अनुसन्धान परिषद् (NARC) का सिफारिस र स्थापित कृषि-पारिस्थितिक सिद्धान्तमा आधारित निर्णय-सहयोग उपकरण हो। यसले कुनै अप्रमाणित उत्पादनको ग्यारेन्टी गर्दैन। स्थानीय माटो परीक्षण र कृषि विज्ञको सल्लाह लिनुहोस्।"
                  : "KHETKOSAATHI rotation recommendations are research-based decision aids utilizing NARC crop calendars and agro-ecological modeling. They do not constitute guaranteed yield predictions. Always confirm parcel nutrient status with certified soil laboratory tests."}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
