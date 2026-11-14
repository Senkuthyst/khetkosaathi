import { Link } from "@tanstack/react-router";
import {
  Satellite,
  Globe2,
  Droplets,
  CloudSun,
  Sprout,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Cpu,
  CheckCircle,
  Database,
  Compass,
  Sparkles,
  BarChart3,
  Layers,
  Leaf,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { useApp } from "@/lib/store";
import { num } from "@/lib/i18n";

interface LandingPageProps {
  onEnterDashboard?: () => void;
}

export function LandingPage({ onEnterDashboard }: LandingPageProps) {
  const { lang, setLang } = useApp();

  return (
    <div className="min-h-screen bg-[#F7F8F2] text-[#18251E] selection:bg-[#B8D987] selection:text-[#123B2A]">
      {/* 1. TOP MARKETING NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-[#E5EAE2] bg-[#FFFFFF]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
          <BrandLogo variant="full" theme="forest" />

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-semibold text-[#18251E]/80">
            <a href="#hero" className="hover:text-[#237A50] transition-colors">
              {lang === "ne" ? "गृह" : "Home"}
            </a>
            <Link to="/earth-intelligence" className="hover:text-[#237A50] transition-colors">
              {lang === "ne" ? "भू-सूचना" : "Earth Intelligence"}
            </Link>
            <Link to="/crop-health" className="hover:text-[#237A50] transition-colors">
              {lang === "ne" ? "बाली अन्तर्दृष्टि" : "Crop Insights"}
            </Link>
            <Link to="/weather" className="hover:text-[#237A50] transition-colors">
              {lang === "ne" ? "खेत अनुगमन" : "Farm Monitoring"}
            </Link>
            <a href="#nasa-integration" className="hover:text-[#237A50] transition-colors">
              {lang === "ne" ? "NASA इन्टिग्रेसन" : "NASA Data"}
            </a>
            <a href="#about" className="hover:text-[#237A50] transition-colors">
              {lang === "ne" ? "हाम्रो बारेमा" : "About"}
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "ne" ? "en" : "ne")}
              className="rounded-lg border border-[#E5EAE2] px-2.5 py-1.5 text-xs font-bold text-[#237A50] hover:bg-[#EBF4EC] transition-colors"
              aria-label="Switch Language"
            >
              {lang === "ne" ? "English" : "नेपाली"}
            </button>

            <button
              onClick={onEnterDashboard}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#123B2A] px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#123B2A] hover:bg-[#EBF4EC] transition-colors"
            >
              {lang === "ne" ? "लग इन" : "Sign In"}
            </button>

            <button
              onClick={onEnterDashboard}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#123B2A] px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-bold text-[#F7F8F2] shadow-sm hover:bg-[#237A50] transition-all"
            >
              <span>{lang === "ne" ? "ड्यासबोर्ड खोल्नुहोस्" : "Open Dashboard"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        {/* Background Atmospheric Grid */}
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#237A50_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Mission Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#B8D987] bg-[#EBF4EC] px-3.5 py-1.5 text-xs font-extrabold text-[#123B2A]">
                <Satellite className="h-3.5 w-3.5 text-[#237A50]" />
                <span>NASA Earth Observation Intelligence · Nepal</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#123B2A] leading-[1.12]">
                Bringing NASA Earth Intelligence to Nepal&apos;s Farms.
              </h1>

              {/* Nepali Sub-Headline */}
              <p className="text-base sm:text-lg font-semibold text-[#237A50]">
                खेतको साथी: खेतको सूक्ष्म चिस्यानदेखि अन्तरिक्षको भू-उपग्रह दृष्टिकोणसम्म।
              </p>

              {/* Supporting Description */}
              <p className="text-base sm:text-lg text-[#18251E]/80 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Monitor changing environmental conditions, explore satellite-powered agricultural insights,
                and make smarter farming decisions with KHETKOSAATHI. Grounded in real-time NASA POWER, SMAP,
                GPM IMERG, and MODIS observations calibrated for Nepal.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/earth-intelligence"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#123B2A] px-6 py-3.5 text-sm font-bold text-[#F7F8F2] shadow-md hover:bg-[#237A50] hover:shadow-lg transition-all"
                >
                  <Globe2 className="h-4 w-4 text-[#B8D987]" />
                  <span>{lang === "ne" ? "भू-सूचना अन्वेषण गर्नुहोस्" : "Explore Earth Intelligence"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <button
                  onClick={onEnterDashboard}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#123B2A] bg-white px-6 py-3.5 text-sm font-bold text-[#123B2A] hover:bg-[#EBF4EC] transition-all"
                >
                  <Compass className="h-4 w-4 text-[#237A50]" />
                  <span>{lang === "ne" ? "हाम्रो मञ्च जान्नुहोस्" : "Discover Our Platform"}</span>
                </button>
              </div>

              {/* Key Highlights */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-[#E5EAE2] text-left">
                <div>
                  <span className="block text-2xl font-extrabold text-[#123B2A]">4+</span>
                  <span className="text-xs text-[#758078] font-medium">NASA Satellites Ingested</span>
                </div>
                <div>
                  <span className="block text-2xl font-extrabold text-[#237A50]">250 m</span>
                  <span className="text-xs text-[#758078] font-medium">MODIS Phenology Grid</span>
                </div>
                <div>
                  <span className="block text-2xl font-extrabold text-[#123B2A]">100%</span>
                  <span className="text-xs text-[#758078] font-medium">Bilingual (नेपाली / EN)</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Aerial Satellite Representation with Floating Data Panels */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden border-2 border-[#123B2A]/20 bg-gradient-to-br from-[#0C1821] to-[#152432] p-4 sm:p-6 text-white shadow-2xl">
                {/* Aerial Satellite Imagery Simulation */}
                <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-white/10 bg-[#1E3A4C]">
                  {/* Vector Map Contours representing Nepal Terai Agricultural Landscape */}
                  <svg
                    viewBox="0 0 400 320"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full object-cover opacity-85"
                  >
                    <rect width="400" height="320" fill="#143224" />
                    {/* River Narayani Meander */}
                    <path
                      d="M-20 60 C80 90, 140 40, 220 110 C300 180, 360 210, 420 260"
                      stroke="#2A5C7E"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />
                    <path
                      d="M-20 60 C80 90, 140 40, 220 110 C300 180, 360 210, 420 260"
                      stroke="#4287B5"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    {/* Field Cadastral Polygons with NDVI false color representation */}
                    <polygon points="50,130 110,120 130,190 70,200" fill="#2E7D32" fillOpacity="0.7" stroke="#81C784" strokeWidth="1" />
                    <polygon points="120,115 190,95 210,165 140,185" fill="#388E3C" fillOpacity="0.8" stroke="#A5D6A7" strokeWidth="1" />
                    <polygon points="65,210 145,195 160,280 80,290" fill="#1B5E20" fillOpacity="0.9" stroke="#66BB6A" strokeWidth="1.5" />
                    <polygon points="230,130 310,110 330,190 250,210" fill="#43A047" fillOpacity="0.75" stroke="#81C784" strokeWidth="1" />
                    <polygon points="260,220 340,200 360,280 280,295" fill="#689F38" fillOpacity="0.7" stroke="#C5E1A5" strokeWidth="1" />
                    {/* Selected Farm Target Highlight in Bharatpur-14 */}
                    <polygon
                      points="155,200 235,180 250,260 170,275"
                      fill="#B8D987"
                      fillOpacity="0.4"
                      stroke="#B8D987"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />
                    <circle cx="205" cy="230" r="4" fill="#B8D987" />
                    <circle cx="205" cy="230" r="10" stroke="#B8D987" strokeWidth="1" strokeDasharray="2 2" className="animate-ping" />
                  </svg>

                  {/* Satellite Orbit Overlay */}
                  <div className="absolute top-3 left-3 bg-[#0C1821]/80 backdrop-blur-md rounded-lg px-2.5 py-1 text-[11px] font-mono text-[#B8D987] border border-white/10 flex items-center gap-1.5">
                    <Satellite className="h-3.5 w-3.5 text-[#B8D987]" />
                    <span>MOD13Q1 · 27.6775° N, 84.4333° E</span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-[#0C1821]/80 backdrop-blur-md rounded-lg px-2.5 py-1 text-[11px] text-white/90 border border-white/10">
                    Chitwan Pilot Field · 3.42 ha
                  </div>
                </div>

                {/* Floating Live Data Cards */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/15 p-3">
                    <div className="flex items-center justify-between text-[11px] text-[#B8D987]">
                      <span>NDVI Health</span>
                      <Leaf className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xl font-bold mt-1 block">0.68</span>
                    <span className="text-[10px] text-white/70">MODIS 16-day Composite</span>
                  </div>

                  <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/15 p-3">
                    <div className="flex items-center justify-between text-[11px] text-[#B8D987]">
                      <span>Soil Moisture</span>
                      <Droplets className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xl font-bold mt-1 block">24.8%</span>
                    <span className="text-[10px] text-white/70">15 cm In-Situ Sensor</span>
                  </div>

                  <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/15 p-3">
                    <div className="flex items-center justify-between text-[11px] text-[#B8D987]">
                      <span>NASA POWER Temp</span>
                      <CloudSun className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xl font-bold mt-1 block">29.3°C</span>
                    <span className="text-[10px] text-white/70">Daily UTC Mean Max</span>
                  </div>

                  <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/15 p-3">
                    <div className="flex items-center justify-between text-[11px] text-[#B8D987]">
                      <span>GPM Rainfall</span>
                      <TrendingUp className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xl font-bold mt-1 block">4.3 mm</span>
                    <span className="text-[10px] text-white/70">7-Day Cumulative</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 1: EARTH INTELLIGENCE DECK */}
      <section className="py-16 bg-white border-y border-[#E5EAE2]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="rounded-md bg-[#237A50]/10 px-3 py-1 text-xs font-bold text-[#237A50]">
              EARTH OBSERVATION PORTFOLIO
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B2A] tracking-tight">
              Four NASA Missions. One Unified Agro-Intelligence System.
            </h2>
            <p className="text-sm sm:text-base text-[#18251E]/75">
              KHETKOSAATHI transforms raw spaceborne observations into actionable agricultural intelligence
              for extension workers and smallholder farmers.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "NASA POWER",
                tag: "Meteorology & Solar",
                resolution: "0.5° × 0.625° Grid",
                source: "NASA Langley Research Center",
                desc: "Surface solar irradiance, 2-meter air temperature dynamics, and agroclimatology models for energy budgeting.",
                icon: CloudSun,
              },
              {
                title: "NASA SMAP",
                tag: "Soil Moisture Active Passive",
                resolution: "36 km / 9 km Enhanced",
                source: "NASA Jet Propulsion Laboratory",
                desc: "L-band microwave radiometry detecting surface soil moisture in the top 5 cm to map regional drought stress.",
                icon: Droplets,
              },
              {
                title: "NASA GPM IMERG",
                tag: "Global Precipitation Measurement",
                resolution: "0.1° (~10 km) Multi-satellite",
                source: "NASA Goddard Space Flight Center",
                desc: "Half-hourly and daily rainfall accumulation tracking monsoon anomalies across river basins.",
                icon: TrendingUp,
              },
              {
                title: "NASA MODIS / Landsat",
                tag: "Vegetation Indices",
                resolution: "250 m (MODIS) / 30 m (Landsat)",
                source: "USGS / NASA LP DAAC",
                desc: "NDVI and EVI 16-day composites illustrating canopy greenness and crop maturation phenology.",
                icon: Sprout,
              },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#E5EAE2] bg-[#F7F8F2] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-white p-2.5 shadow-xs border border-[#E5EAE2] text-[#237A50]">
                      <card.icon className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] font-bold text-[#758078] bg-white px-2 py-0.5 rounded-md border border-[#E5EAE2]">
                      {card.resolution}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-[#123B2A]">{card.title}</h3>
                  <span className="text-xs font-semibold text-[#237A50] block mt-0.5">{card.tag}</span>
                  <p className="mt-2 text-xs text-[#18251E]/80 leading-relaxed">{card.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E5EAE2] text-[11px] text-[#758078]">
                  Source: {card.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECTION 2 & 3: ENVIRONMENTAL MONITORING & AGRICULTURAL INSIGHTS */}
      <section className="py-16 bg-[#F7F8F2]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="rounded-md bg-[#B8D987]/30 px-3 py-1 text-xs font-bold text-[#123B2A]">
                GROUND-TO-SPACE FUSION
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B2A] tracking-tight">
                Calibrating Orbital Data with On-Farm Realities
              </h2>
              <p className="text-sm sm:text-base text-[#18251E]/80 leading-relaxed">
                Satellite data provides invaluable macro context, but smallholder agriculture in Nepal
                requires precise measurement. KHETKOSAATHI seamlessly bridges the gap by comparing regional
                estimates with local field station sensors.
              </p>

              <div className="space-y-3.5">
                {[
                  {
                    title: "Volumetric Moisture Discrepancy Detection",
                    desc: "Compare SMAP regional topsoil (5 cm) against farm probe (15 cm) to determine root-zone water penetration.",
                  },
                  {
                    title: "Rainfall Anomaly vs. In-Situ Gauges",
                    desc: "Cross-check GPM IMERG 10 km grid estimates against farm tipping buckets to detect rainshadow effects.",
                  },
                  {
                    title: "Microclimate Temperature Offset",
                    desc: "Analyze local valley inversion against NASA POWER gridded 2-meter air temperature records.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl bg-white p-4 border border-[#E5EAE2]">
                    <CheckCircle className="h-5 w-5 text-[#237A50] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-sm text-[#123B2A]">{item.title}</h3>
                      <p className="text-xs text-[#758078] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Comparison Box */}
            <div className="rounded-3xl border border-[#E5EAE2] bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#E5EAE2] pb-4">
                <div>
                  <h3 className="font-bold text-base text-[#123B2A]">Chitwan Pilot Calibration Dashboard</h3>
                  <span className="text-xs text-[#758078]">Bharatpur-14 · Co-registered Sensors</span>
                </div>
                <span className="rounded-full bg-[#EBF4EC] px-3 py-1 text-xs font-bold text-[#237A50]">
                  Live Validated
                </span>
              </div>

              {/* Data Table */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F8F2] border border-[#E5EAE2]">
                  <span className="font-semibold text-[#18251E]">Soil Moisture (15 cm Probe)</span>
                  <strong className="text-sm font-extrabold text-[#237A50]">24.8% Volumetric</strong>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F8F2] border border-[#E5EAE2]">
                  <span className="font-semibold text-[#18251E]">NASA SMAP Surface (5 cm)</span>
                  <strong className="text-sm font-extrabold text-[#1D5C8A]">0.21 m³/m³ (21.0%)</strong>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F8F2] border border-[#E5EAE2]">
                  <span className="font-semibold text-[#18251E]">NASA GPM IMERG 7-Day Rainfall</span>
                  <strong className="text-sm font-extrabold text-[#1D5C8A]">4.3 mm (Deficit: -64%)</strong>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F8F2] border border-[#E5EAE2]">
                  <span className="font-semibold text-[#18251E]">MODIS NDVI Vegetation Index</span>
                  <strong className="text-sm font-extrabold text-[#237A50]">0.68 (Normal vegetative)</strong>
                </div>
              </div>

              <div className="rounded-xl bg-[#EBF4EC] p-3 text-xs text-[#123B2A] flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 text-[#237A50] mt-0.5" />
                <span>
                  <strong>Scientific Rule:</strong> Never assume coarse satellite pixels equal farm-level microclimate.
                  Always calibrate using ground-truth observations.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION 4 & 5: CROP INTELLIGENCE & ROTATION PLANNER SHOWCASE */}
      <section className="py-16 bg-white border-y border-[#E5EAE2]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="rounded-md bg-[#237A50]/10 px-3 py-1 text-xs font-bold text-[#237A50]">
              REGENERATIVE CROPPING SYSTEMS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B2A] tracking-tight">
              Regenerative Crop Intelligence & Soil Rebuilding
            </h2>
            <p className="text-sm sm:text-base text-[#18251E]/75">
              Empowering farmers to restore degraded soils through evidence-based crop rotations, biological
              nitrogen fixation, and reduced chemical dependency.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-[#E5EAE2] bg-[#F7F8F2] p-6 space-y-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF4EC] text-[#237A50]">
                <Sprout className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-[#123B2A]">5-Step Interactive Planner</h3>
              <p className="text-xs text-[#758078] leading-relaxed">
                Input your parcel location, soil pH, organic matter, and drainage to receive dynamically weighted
                multi-season rotation options.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5EAE2] bg-[#F7F8F2] p-6 space-y-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF4EC] text-[#237A50]">
                <Database className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-[#123B2A]">NARC Validated Knowledge</h3>
              <p className="text-xs text-[#758078] leading-relaxed">
                Rules calibrated against multi-decade trials by the Nepal Agricultural Research Council across
                Terai, Inner Terai, and Mid-Hills agro-ecological zones.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5EAE2] bg-[#F7F8F2] p-6 space-y-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF4EC] text-[#237A50]">
                <BarChart3 className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-[#123B2A]">Water & Nitrogen Scoring</h3>
              <p className="text-xs text-[#758078] leading-relaxed">
                Transparent quantitative metrics including cubic meters of water consumed and biological nitrogen
                fixed (+35 to +80 kg N/ha).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION 6: HOW KHETKOSAATHI WORKS */}
      <section className="py-16 bg-[#F7F8F2]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="rounded-md bg-[#B8D987]/30 px-3 py-1 text-xs font-bold text-[#123B2A]">
              END-TO-END WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B2A] tracking-tight">
              How KHETKOSAATHI Works in Practice
            </h2>
            <p className="text-sm sm:text-base text-[#18251E]/75">
              From drawing farm boundaries on high-resolution maps to receiving timely anomaly alerts.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Register & Draw Field",
                desc: "Locate your parcel in Nepal and use the Geoman polygon tool to draw exact plot boundaries.",
              },
              {
                step: "02",
                title: "Ingest Satellite Data",
                desc: "The system fetches regional NASA POWER daily climatology and overlay records for your coordinates.",
              },
              {
                step: "03",
                title: "Rule-Based Evaluation",
                desc: "Algorithmic checks evaluate soil moisture deficits, thermal heat stress, and phenological milestones.",
              },
              {
                step: "04",
                title: "Informed Decision Action",
                desc: "Plan crop rotations, inspect flagged anomalies in person, and share reports with extension officers.",
              },
            ].map((st, i) => (
              <div key={i} className="rounded-2xl border border-[#E5EAE2] bg-white p-6 shadow-sm relative">
                <span className="text-3xl font-black text-[#237A50]/20 block mb-2">{st.step}</span>
                <h3 className="font-bold text-base text-[#123B2A]">{st.title}</h3>
                <p className="mt-2 text-xs text-[#758078] leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SECTION 7: SUSTAINABLE AGRICULTURE & FINAL CTA */}
      <section className="py-20 bg-gradient-to-br from-[#123B2A] via-[#1A4F38] to-[#123B2A] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#B8D987_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-[#B8D987] border border-white/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>NASA Space Apps Challenge 2026 Ready</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Empower Nepal&apos;s Agriculture with Earth Intelligence.
          </h2>

          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            KHETKOSAATHI brings the power of NASA Earth observation satellites down to the farmers of Nepal,
            fostering sustainable, climate-resilient, and food-secure rural communities.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnterDashboard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#B8D987] px-8 py-4 text-base font-extrabold text-[#123B2A] shadow-lg hover:bg-white hover:scale-105 transition-all"
            >
              <span>{lang === "ne" ? "कृषि ड्यासबोर्ड खोल्नुहोस्" : "Open Agricultural Dashboard"}</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <Link
              to="/earth-intelligence"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white hover:bg-white/20 transition-all"
            >
              <Globe2 className="h-5 w-5 text-[#B8D987]" />
              <span>{lang === "ne" ? "NASA डाटा मञ्च हेर्नुहोस्" : "Explore NASA Datasets"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FOOTER (Clean Branding, NASA Attribution, No Lovable Promotional Badges) */}
      <footer id="about" className="border-t border-[#E5EAE2] bg-[#FFFFFF] py-12 text-xs text-[#758078]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <BrandLogo variant="compact" theme="forest" />
              <p className="text-xs text-[#758078] leading-relaxed">
                KHETKOSAATHI (खेतको साथी) — Your Intelligent Agricultural Companion.
                Bringing NASA Earth Intelligence closer to Nepal&apos;s farmers.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#123B2A] mb-3">Core Modules</h4>
              <ul className="space-y-2">
                <li><Link to="/earth-intelligence" className="hover:text-[#237A50]">Earth Intelligence</Link></li>
                <li><Link to="/crop-health" className="hover:text-[#237A50]">Crop Health & NDVI</Link></li>
                <li><Link to="/weather" className="hover:text-[#237A50]">Weather & Station</Link></li>
                <li><Link to="/my-farm" className="hover:text-[#237A50]">Farm Plot Boundary</Link></li>
                <li><Link to="/guidance" className="hover:text-[#237A50]">Crop Rotation Guidance</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#123B2A] mb-3">Scientific Data Sources</h4>
              <ul className="space-y-2">
                <li><a href="https://power.larc.nasa.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-[#237A50]">NASA POWER Daily AG API</a></li>
                <li><a href="https://smap.jpl.nasa.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-[#237A50]">NASA SMAP Soil Moisture</a></li>
                <li><a href="https://gpm.nasa.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-[#237A50]">NASA GPM IMERG Precipitation</a></li>
                <li><a href="https://lpdaac.usgs.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-[#237A50]">NASA / USGS MODIS & Landsat</a></li>
                <li><a href="https://narc.gov.np" target="_blank" rel="noopener noreferrer" className="hover:text-[#237A50]">NARC Agronomy Division</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#123B2A] mb-3">Compliance & Attribution</h4>
              <p className="text-xs text-[#758078] leading-relaxed">
                Developed for the NASA Space Apps Challenge 2026. This platform adheres to NASA Open Science data policies.
                Satellite estimates are regional indicators and do not diagnose farm crop diseases.
              </p>
              <p className="mt-3 text-[11px] text-[#758078]">
                © 2026 KHETKOSAATHI · खेतको साथी. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
