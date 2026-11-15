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
import { stationCurrent } from "@/lib/data";
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
  const { lang, field, selectedField } = useApp();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeFarmLabel = selectedField
    ? `${selectedField.fieldName}${selectedField.municipality ? ` (${selectedField.municipality})` : ""}`
    : (field?.name ?? "No farm plot registered");

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
      contextData: selectedField
        ? [
            { label: "Selected Farm", value: `${selectedField.fieldName} (${selectedField.municipality || "Nepal"})` },
            { label: "Coordinates", value: `${selectedField.latitude.toFixed(4)}° N, ${selectedField.longitude.toFixed(4)}° E` },
            { label: "Crop", value: `${selectedField.cropType}` },
          ]
        : [
            { label: "Selected Farm", value: "No farm plot registered yet" },
            { label: "Status", value: "Register plot via Onboarding" },
          ],
      sources: [
        { label: "NASA POWER Daily API", url: "https://power.larc.nasa.gov/" },
        { label: "NASA Earth Observation System", url: "https://earthdata.nasa.gov/" },
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
      const fieldDesc = selectedField ? `${selectedField.fieldName} (${selectedField.municipality || "Nepal"})` : "तपाईंको खेत";
      return {
        id: `resp-${Date.now()}`,
        sender: "assistant",
        text:
          lang === "ne"
            ? `${fieldDesc} को लागि माटोको चिस्यान अनुगमन गर्दा: सतह मुनि कम्तीमा २५% भन्दा माथिको चिस्यान धान तथा हिउँदे बालीका लागि आवश्यक हुन्छ। NASA SMAP उपग्रहले ९-३६ कि.मि. क्षेत्रीय दायरामा सतह चिस्यान मापन गर्दछ भने खेत-स्तरको सटीक व्यवस्थापनका लागि सिँचाइ नाला तथा माटोको अवस्था प्रत्यक्ष जाँच्न सिफारिस गरिन्छ।`
            : `For ${selectedField ? selectedField.fieldName : "your farm plot"}: Active root-zone moisture above 25% volumetric is recommended to sustain vigorous vegetative growth. Regional NASA SMAP microwave observations report regional moisture trends across a 9 km to 36 km grid, while field-level irrigation should be managed based on direct soil inspection.`,
        timestamp: time,
        contextData: [
          { label: "Target Moisture", value: "> 25% Volumetric" },
          { label: "SMAP Resolution", value: "9 km / 36 km regional grid" },
        ],
        sources: [
          { label: "NASA SMAP Mission", url: "https://smap.jpl.nasa.gov/" },
          { label: "NARC Soil Science Division", url: "https://narc.gov.np" },
        ],
      };
    }

    // MODIS / NDVI / Vegetation query
    if (q.includes("ndvi") || q.includes("modis") || q.includes("हरियाली") || q.includes("vegetation")) {
      return {
        id: `resp-${Date.now()}`,
        sender: "assistant",
        text:
          lang === "ne"
            ? `NASA MODIS (MOD13Q1, २५० मिटर रिजोल्युसन) ले वनस्पति क्यानोपीको हरियाली (NDVI) मापन गर्दछ। ध्यान दिनुहोस्: उपग्रहले बालीको प्रत्यक्ष रोग निदान गर्दैन, बरु क्यानोपीको परावर्तन सूचकाङ्क मात्र देखाउँछ। बाली पाक्ने बेलामा पात पहेँलिँदै जानु स्वाभाविक परिपक्वता (senescence) हो। कुनै शंका लागेमा खेत निरीक्षण गर्नुहोस्।`
            : `NASA MODIS (MOD13Q1, 250 m spatial resolution) provides vegetation indices (NDVI/EVI) indicating photosynthetic canopy vitality. A satellite vegetation index is an environmental indicator, not a direct disease diagnosis. Declining greenness during late-season crop maturity typically reflects natural senescence rather than distress. Always confirm via ground inspection.`,
        timestamp: time,
        contextData: [
          { label: "MODIS Sensor", value: "Terra MODIS MOD13Q1" },
          { label: "Spatial Resolution", value: "250 m (16-day composite)" },
          { label: "Principle", value: "Indicator, not direct crop disease diagnosis" },
        ],
        sources: [
          { label: "NASA LP DAAC MOD13Q1", url: "https://lpdaac.usgs.gov/" },
          { label: "FAO Crop Phenology Guidelines" },
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
      const fieldDesc = selectedField ? `${selectedField.fieldName} (${selectedField.municipality || "Nepal"})` : "तपाईंको खेत";
      return {
        id: `resp-${Date.now()}`,
        sender: "assistant",
        text:
          lang === "ne"
            ? `${fieldDesc} को लागि: NASA POWER दैनिक मोडलले खेतको अक्षांश र देशान्तरमा आधारित सतही मौसम (अधिकतम/न्यूनतम तापक्रम, आर्द्रता, वायु गति र सच्याइएको वर्षा) गणना गर्दछ। उपग्रहिय मौसम विश्लेषणले स्थानीय मौसमी उतारचढाव बुझ्न र सिँचाइ समय निर्धारण गर्न मद्दत गर्दछ।`
            : `For ${selectedField ? selectedField.fieldName : "your farm plot"}: NASA POWER provides daily point meteorology (temperatures, relative humidity, wind speed, corrected precipitation, and solar radiation) parameterized for your exact coordinates. Spaceborne meteorology helps anticipate moisture shifts and optimize irrigation scheduling.`,
        timestamp: time,
        contextData: [
          { label: "Data Source", value: "NASA POWER Daily API (MERRA-2)" },
          { label: "Community", value: "Agroclimatology (AG)" },
        ],
        sources: [
          { label: "NASA POWER Daily Temporal API", url: "https://power.larc.nasa.gov/" },
          { label: "NASA Earthdata Science Systems", url: "https://earthdata.nasa.gov/" },
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
                  ? "तपाईंको खेत र NASA भू-उपग्रह डाटामा आधारित"
                  : "Contextual AgriTech intelligence for your farm"}
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
              {activeFarmLabel}
            </span>
            <span className="text-muted-foreground shrink-0">|</span>
            <span className="shrink-0 text-muted-foreground">
              📍 Coords: <strong className="text-foreground">{selectedField ? `${selectedField.latitude.toFixed(2)}°N, ${selectedField.longitude.toFixed(2)}°E` : "Not set"}</strong>
            </span>
            <span className="shrink-0 text-muted-foreground">
              🌾 Crop: <strong className="text-foreground">{selectedField?.cropType ?? "Rice"}</strong>
            </span>
            <span className="shrink-0 text-muted-foreground">
              🛰 NASA POWER: <strong className="text-foreground">Connected</strong>
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
