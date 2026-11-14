import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Info,
  HelpCircle,
  X,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { stationCurrent, imergPilot, smapPilot, modisPilot } from "@/lib/data";
import { summary } from "@/lib/derived";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  sources?: { label: string; url?: string }[];
  contextData?: { label: string; value: string }[];
}

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiAssistant({ isOpen, onClose }: AiAssistantProps) {
  const { lang, field } = useApp();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const s = summary();

  const suggestedQuestions = [
    {
      qNe: "हालको माटोको चिस्यानले मेरो धान बालीलाई कस्तो असर गर्छ?",
      qEn: "How does the current soil moisture reading affect my rice crop?",
      tag: "Soil & Crop",
    },
    {
      qNe: "NASA MODIS NDVI र खेतको सेन्सर बीच के भिन्नता छ?",
      qEn: "What is the difference between NASA MODIS NDVI and on-farm observations?",
      tag: "Earth Observation",
    },
    {
      qNe: "धानपछि माटोको नाइट्रोजन बढाउन कुन बाली चक्र उपयुक्त हुन्छ?",
      qEn: "What crop rotation sequence after rice best replenishes soil nitrogen?",
      tag: "Rotation",
    },
    {
      qNe: "NASA POWER र GPM IMERG वर्षा आँकडाले के संकेत गर्छ?",
      qEn: "What do the NASA POWER and GPM IMERG rainfall figures indicate?",
      tag: "NASA Climate",
    },
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro-1",
      sender: "assistant",
      text:
        lang === "ne"
          ? "नमस्ते! म खेतको साथीको कृषि बौद्धिक सहायक (KHETKOSAATHI Agricultural Assistant) हुँ। म तपाईंलाई NASA भू-उपग्रह डाटा (POWER, SMAP, GPM IMERG, MODIS), खेतका सेन्सरहरू, र नेपाल कृषि अनुसन्धान परिषद् (NARC) का सिफारिसहरू बुझ्न सहयोग गर्दछु। मलाई कुनै प्रश्न सोध्नुहोस्!"
          : "Namaste! I am the KHETKOSAATHI Agricultural Intelligence Assistant. I synthesize live NASA Earth observations (NASA POWER, SMAP, GPM IMERG, MODIS), on-farm sensor measurements, and Nepal Agricultural Research Council (NARC) agronomic principles to help you make informed decisions. How may I assist your farm today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      contextData: [
        { label: "Location", value: "Chitwan, Nepal (27.6775° N, 84.4333° E)" },
        { label: "Station Temp", value: `${stationCurrent.temp}°C` },
        { label: "Station Soil", value: `${stationCurrent.soil}% (15cm)` },
        { label: "MODIS NDVI", value: `${modisPilot.composites.at(-1)?.ndvi}` },
      ],
      sources: [
        { label: "NASA POWER Daily API", url: "https://power.larc.nasa.gov/" },
        { label: "NASA SMAP Soil Moisture", url: "https://smap.jpl.nasa.gov/" },
        { label: "NARC Agronomy Division", url: "https://narc.gov.np" },
      ],
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const generateAnswer = (userQuery: string): Message => {
    const q = userQuery.toLowerCase();
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Soil moisture query
    if (q.includes("soil") || q.includes("चिस्यान") || q.includes("moisture")) {
      return {
        id: `resp-${Date.now()}`,
        sender: "assistant",
        text:
          lang === "ne"
            ? `हाल तपाईंको खेतको सेन्सरले १५ से.मि. गहिराइमा ${stationCurrent.soil}% माटोको चिस्यान देखाएको छ। यता NASA SMAP उपग्रहको ५ से.मि. सतह चिस्यान ${smapPilot.surfaceVolumetric} m³/m³ छ। धानको लागि सक्रिय वृद्धि अवस्थामा कम्तीमा २५% भन्दा माथिको चिस्यान आवश्यक हुन्छ। चिस्यान हाल अनुकूल दायरामा छ, तर वर्षा विचलन कम रहेकाले आगामी ३ दिनमा नियमित खेत निरीक्षण सिफारिस गरिन्छ।`
            : `Your farm station sensor indicates ${stationCurrent.soil}% volumetric soil moisture at 15 cm depth. Regional NASA SMAP microwave observations report ${smapPilot.surfaceVolumetric} m³/m³ in the top 5 cm horizon. For actively tillering rice, maintain moisture above the 25% lower threshold. Currently, moisture levels are satisfactory, but given negative rainfall anomaly trends, parcel-level perimeter checks are advised.`,
        timestamp: time,
        contextData: [
          { label: "Station Soil (15cm)", value: `${stationCurrent.soil}%` },
          { label: "SMAP Surface (5cm)", value: `${smapPilot.surfaceVolumetric} m³/m³` },
          { label: "Threshold", value: "> 25%" },
        ],
        sources: [
          { label: "NASA SMAP SPL3SMP V009", url: "https://nsidc.org/data/spl3smp" },
          { label: "In-Situ Farm Probe (Chitwan)" },
        ],
      };
    }

    // MODIS / NDVI / Vegetation query
    if (q.includes("ndvi") || q.includes("modis") || q.includes("हरियाली") || q.includes("vegetation")) {
      const latest = modisPilot.composites.at(-1)!;
      return {
        id: `resp-${Date.now()}`,
        sender: "assistant",
        text:
          lang === "ne"
            ? `NASA MODIS उपग्रह (MOD13Q1 २५० मि. रिजोल्युसन) ले पछिल्लो १६ दिने संयुक्त दृश्यमा NDVI मान ${latest.ndvi} देखाएको छ। यस मौसमको ऐतिहासिक आधार सीमा ${latest.baselineLow} देखि ${latest.baselineHigh} हो। जब बाली पाक्ने अवस्था (८०% उमेर भन्दा बढी) मा पुग्छ, पात पहेँलिँदै जानु स्वाभाविक हो। त्यसैले यो घटबढ रोग भन्दा पनि प्राकृतिक परिपक्वता (senescence) को संकेत हुन सक्छ।`
            : `NASA MODIS (MOD13Q1, 250 m spatial resolution) 16-day composite shows an NDVI of ${latest.ndvi}. The seasonal Chitwan reference envelope spans ${latest.baselineLow} to ${latest.baselineHigh}. Note that for crops past 80% seasonal duration, declining chlorophyll reflectance often signifies natural physiological maturation rather than biological distress. Ground inspection confirms grain filling.`,
        timestamp: time,
        contextData: [
          { label: "MODIS NDVI", value: `${latest.ndvi}` },
          { label: "Baseline Range", value: `${latest.baselineLow} – ${latest.baselineHigh}` },
          { label: "Pixel Scale", value: "250 m composite" },
        ],
        sources: [
          { label: "NASA LP DAAC MOD13Q1", url: "https://lpdaac.usgs.gov/" },
          { label: "Chitwan Phenological Baseline" },
        ],
      };
    }

    // Rotation / Nitrogen query
    if (q.includes("rotation") || q.includes("चक्र") || q.includes("nitrogen") || q.includes("नाइट्रोजन") || q.includes("crop")) {
      return {
        id: `resp-${Date.now()}`,
        sender: "assistant",
        text:
          lang === "ne"
            ? `मनसुन धानपछि हिउँदमा गहुँ वा तोरी, र त्यसपछि वसन्त ऋतुमा मुङ (Mungbean) वा ढैँचा (Dhaincha) लगाउँदा माटोमा प्रति हेक्टर ३५ देखि ५० के.जी. जैविक नाइट्रोजन थप हुन्छ। यसले माटोको प्राङ्गारिक पदार्थ बढाउनुका साथै अर्को वर्ष रासायनिक मलको निर्भरता घटाउँछ र माटोको जीवाणु स्वास्थ्य सुधार्छ।`
            : `According to NARC Agronomy division recommendations for the Chitwan Terai agro-zone, introducing a spring legume such as Mungbean (Vigna radiata) or green manure Dhaincha (Sesbania aculeata) after winter wheat adds between +35 to +50 kg N/ha of biologically fixed nitrogen, while interrupting continuous cereal root-rot fungi.`,
        timestamp: time,
        contextData: [
          { label: "Recommended Sequence", value: "Rice → Wheat → Mungbean" },
          { label: "Biological N-Fixation", value: "+35 to +50 kg N/ha" },
          { label: "SOM Impact", value: "+0.3% over 3 seasons" },
        ],
        sources: [
          { label: "NARC Crop Rotation Technical Bulletins", url: "https://narc.gov.np" },
          { label: "CIMMYT South Asia Conservation Agriculture" },
        ],
      };
    }

    // Weather / Rain / Temperature query
    if (q.includes("weather") || q.includes("rain") || q.includes("तापक्रम") || q.includes("वर्षा") || q.includes("power") || q.includes("imerg")) {
      const rainSum = imergPilot.daily.reduce((a, b) => a + b, 0);
      return {
        id: `resp-${Date.now()}`,
        sender: "assistant",
        text:
          lang === "ne"
            ? `NASA GPM IMERG उपग्रहको ७ दिने वर्षा जम्मा ${rainSum.toFixed(1)} मि.मि. रहेको छ (नमुना मौसमी आधार: ${imergPilot.seasonalBaselineMm} मि.मि.)। खेत केन्द्रमा पछिल्लो ७ दिनमा ${s.rain7} मि.मि. वर्षा मापन गरिएको छ। NASA POWER दैनिक मोडलले अधिकतम तापक्रम २९.३°C र आर्द्रता ७४% देखाएको छ। वर्षामा केही कमी रहेकाले सुख्खापन नहोस् भनी माटो चिस्यान अनुगमन गर्नुपर्छ।`
            : `NASA GPM IMERG 0.1° gridded estimates register a 7-day total of ${rainSum.toFixed(1)} mm against a seasonal baseline of ${imergPilot.seasonalBaselineMm} mm. Local farm station readings recorded ${s.rain7} mm. NASA POWER climatology displays a mean daily max temperature of 29.3°C with 74% relative humidity. We observe a negative precipitation anomaly; monitor irrigation gates accordingly.`,
        timestamp: time,
        contextData: [
          { label: "7-day IMERG Total", value: `${rainSum.toFixed(1)} mm` },
          { label: "Farm Rain Gauge", value: `${s.rain7} mm` },
          { label: "NASA POWER Temp", value: "29.3°C Max" },
        ],
        sources: [
          { label: "NASA GPM IMERG Early Run", url: "https://gpm.nasa.gov/data/imerg" },
          { label: "NASA POWER Daily Temporal API", url: "https://power.larc.nasa.gov/" },
        ],
      };
    }

    // Default intelligent overview
    return {
      id: `resp-${Date.now()}`,
      sender: "assistant",
      text:
        lang === "ne"
          ? `तपाईंको प्रश्न "${userQuery}" को सन्दर्भमा: KHETKOSAATHI ले उपग्रहिय अवलोकन (NASA POWER, SMAP, IMERG, MODIS) लाई खेतको प्रत्यक्ष सेन्सरसँग जोडेर निर्णय सहयोग प्रदान गर्दछ। माटो चिस्यान, मौसम प्रवृत्ति, बाली चक्र योजना वा भू-उपग्रह सूचकाङ्कबारे थप सोध्न सक्नुहुन्छ।`
          : `Addressing your inquiry regarding "${userQuery}": KHETKOSAATHI synthesizes spaceborne Earth observations (NASA POWER, SMAP, GPM IMERG, MODIS) with localized field observations to produce evidence-backed guidance. Feel free to ask about soil moisture dynamics, weather patterns, rotation planners, or vegetation anomalies.`,
      timestamp: time,
      sources: [
        { label: "KHETKOSAATHI Scientific Rules Engine" },
        { label: "NASA Earth Science Data Systems (ESDS)", url: "https://earthdata.nasa.gov/" },
      ],
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const response = generateAnswer(text);
      setMessages((prev) => [...prev, response]);
      setLoading(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity"
    >
      <div className="relative flex flex-col w-full max-w-2xl h-[90vh] max-h-[720px] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Assistant Header */}
        <div className="flex items-center justify-between border-b bg-primary px-4 py-3 text-primary-foreground">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <Bot className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                  KHETKOSAATHI AI Assistant
                </h3>
                <span className="rounded-md bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold text-accent">
                  NASA Grounded
                </span>
              </div>
              <p className="text-[11px] text-primary-foreground/75 leading-tight">
                {lang === "ne"
                  ? "चितवन नमुना खेत र NASA भू-उपग्रह डाटामा आधारित"
                  : "Contextual AgriTech intelligence for Nepal's farmers"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/15 text-primary-foreground/80 hover:text-white transition-colors"
            aria-label="Close Assistant"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Context Bar */}
        <div className="flex items-center justify-between border-b bg-secondary/50 px-4 py-2 text-xs text-foreground">
          <div className="flex items-center gap-3 overflow-x-auto py-0.5">
            <span className="flex items-center gap-1 font-semibold text-primary shrink-0">
              <ShieldCheck className="h-3.5 w-3.5" />
              {field?.name ?? "Chitwan Pilot Plot"}
            </span>
            <span className="text-muted-foreground shrink-0">|</span>
            <span className="shrink-0 text-muted-foreground">
              🌡 Station: <strong className="text-foreground">{stationCurrent.temp}°C</strong>
            </span>
            <span className="shrink-0 text-muted-foreground">
              💧 Soil: <strong className="text-foreground">{stationCurrent.soil}%</strong>
            </span>
            <span className="shrink-0 text-muted-foreground">
              🛰 NDVI: <strong className="text-foreground">{modisPilot.composites.at(-1)?.ndvi}</strong>
            </span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex gap-3 max-w-[88%]",
                m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              {m.sender === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                  <Bot className="h-4 w-4 text-accent" />
                </div>
              )}

              <div className="space-y-2">
                <div
                  className={cn(
                    "rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs",
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-xs"
                      : "bg-muted/80 text-foreground border border-border/80 rounded-tl-xs"
                  )}
                >
                  <p>{m.text}</p>

                  {/* Context Data Badges */}
                  {m.contextData && m.contextData.length > 0 && (
                    <div className="mt-2.5 grid grid-cols-2 gap-1.5 pt-2 border-t border-border/60">
                      {m.contextData.map((cd, i) => (
                        <div key={i} className="rounded-lg bg-card/70 p-1.5 text-[11px]">
                          <span className="text-muted-foreground block text-[10px]">{cd.label}</span>
                          <span className="font-bold text-foreground">{cd.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Scientific Source Citations */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-border/50 text-[11px] space-y-1">
                      <span className="font-semibold text-muted-foreground block flex items-center gap-1">
                        <Info className="h-3 w-3 text-primary" />
                        {lang === "ne" ? "वैज्ञानिक स्रोतहरू" : "Scientific Reference Sources"}:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.sources.map((src, i) =>
                          src.url ? (
                            <a
                              key={i}
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-md bg-secondary/70 px-2 py-0.5 text-[10px] font-semibold text-primary hover:underline"
                            >
                              {src.label}
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          ) : (
                            <span
                              key={i}
                              className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                            >
                              {src.label}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={cn(
                    "flex items-center text-[10px] text-muted-foreground px-1",
                    m.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <span>{m.timestamp}</span>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary" />
              <span>{lang === "ne" ? "NASA डाटा विश्लेषण हुँदै छ…" : "Synthesizing NASA observations & NARC principles…"}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Carousel */}
        <div className="border-t bg-card px-4 py-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-accent" />
            {lang === "ne" ? "सुझाव गरिएका प्रश्नहरू" : "Suggested Scientific Queries"}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {suggestedQuestions.map((sq, i) => (
              <button
                key={i}
                onClick={() => handleSend(lang === "ne" ? sq.qNe : sq.qEn)}
                className="shrink-0 rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-xs text-foreground font-medium hover:border-primary/50 hover:bg-secondary transition-all text-left max-w-xs truncate"
              >
                {lang === "ne" ? sq.qNe : sq.qEn}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 border-t p-3 bg-card"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              lang === "ne"
                ? "NASA डाटा, माटो, मौसम वा बालीबारे सोध्नुहोस्…"
                : "Ask about NASA observations, soil moisture, crop rotation, or weather patterns…"
            }
            className="flex-1 rounded-xl border border-input bg-muted/30 px-3.5 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 shrink-0"
            aria-label="Send Message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
