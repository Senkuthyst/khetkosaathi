import {
  X,
  HelpCircle,
  ShieldCheck,
  Smartphone,
  Satellite,
  Leaf,
  Stethoscope,
  RefreshCcw,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface HelpSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpSheet({ isOpen, onClose }: HelpSheetProps) {
  const { lang } = useApp();

  if (!isOpen) return null;

  const faqs = [
    {
      icon: Smartphone,
      qEn: "Where is my data saved?",
      qNe: "मेरो डाटा कहाँ सुरक्षित हुन्छ?",
      aEn: "On this phone only! We store your farm location and settings exclusively in your browser's local memory. We never send or store your private farmland coordinates on remote servers, and no signup or password is required.",
      aNe: "यस फोनमा मात्र! हामी तपाईंको खेतको स्थान र रोजाइहरू तपाईंको फोनको ब्राउजरमा मात्र सुरक्षित राख्छौँ। तपाईंको खेतको निजी जानकारी कुनै पनि बाहिरी सर्भरमा पठाइँदैन, र कुनै खाता वा पासवर्ड पनि चाहिँदैन।",
    },
    {
      icon: Satellite,
      qEn: "How does KHETKOSAATHI check my farm?",
      qNe: "खेतको साथीले मेरो खेत कसरी जाँच गर्छ?",
      aEn: "We connect to free, open NASA and Earth observation satellites (Sentinel-2, Landsat, MODIS, and GPM). When you provide your farm coordinates, satellites measure rainfall history and how green your field is from space.",
      aNe: "हामी खुला नासा (NASA) भू-उपग्रहहरू प्रयोग गर्छौँ। तपाईंले आफ्नो खेतको स्थान दिनुभएपछि, अन्तरिक्षबाट तपाईंको खेतमा परेको वर्षा र बालीको हरियाली नापिन्छ।",
    },
    {
      icon: Leaf,
      qEn: "What does 'plant greenness' mean?",
      qNe: "बिरुवाको हरियाली (Plant Greenness) भनेको के हो?",
      aEn: "It reflects the density, chlorophyll, and vitality of living leaves on your land. A higher greenness score means crops are actively growing. If greenness drops suddenly, it may indicate drought, harvesting, or crop stress.",
      aNe: "यसले तपाईंको खेतमा रहेका बालीका हरिया पातहरूको स्वास्थ्य र घनत्व देखाउँछ। बढी हरियाली हुनु भनेको बाली राम्रोसँग हुर्किरहेको संकेत हो। हरियाली अचानक घट्नु भनेको खडेरी, कटानी वा बालीमा समस्या हुन सक्छ।",
    },
    {
      icon: Stethoscope,
      qEn: "Is this satellite check a disease diagnosis?",
      qNe: "के यो भू-उपग्रह जाँच रोग वा किराको निदान हो?",
      aEn: "No. Satellite measurements give a high-level view of crop vigor from space, not a laboratory diagnosis. If your crop appears stressed or yellowing, visit your field in person or consult your local municipal agriculture officer (कृषि शाखा).",
      aNe: "होइन। भू-उपग्रहले अन्तरिक्षबाट समग्र हरियाली मात्र देख्छ, सुक्ष्म किरा वा रोगको पहिचान गर्दैन। यदि बालीमा समस्या देखिएमा आफ्नै खेतमा गएर निरीक्षण गर्नुहोस् वा स्थानीय कृषि शाखाका प्राविधिकसँग परामर्श गर्नुहोस्।",
    },
    {
      icon: RefreshCcw,
      qEn: "How do I reset my data or change my farm?",
      qNe: "मेरो डाटा कसरी हटाउने वा नयाँ खेत कसरी बदल्ने?",
      aEn: "You can tap the 'Reset' button in the top bar to wipe all local data with one tap, or open 'My Farm' to add, switch, or remove individual agricultural plots at any time.",
      aNe: "माथिल्लो पट्टीमा रहेको 'डाटा रिसेट' बटन थिचेर सबै डाटा एकै पटक मेटाउन सक्नुहुन्छ, अथवा 'मेरो खेत' मेनुमा गएर नयाँ खेत थप्न वा हटाउन सक्नुहुन्छ।",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-xl max-h-[90vh] bg-card text-card-foreground rounded-t-3xl sm:rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-sheet-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="help-sheet-title"
                className="text-base sm:text-lg font-extrabold text-foreground"
              >
                {lang === "ne" ? "सहयोग र साधारण जानकारी" : "Help & Questions"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {lang === "ne" ? "सरल भाषामा स्पष्ट उत्तरहरू" : "Plain answers to common questions"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close Help"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-sm">
          {/* Privacy Highlight Banner */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-xs sm:text-sm text-foreground">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-primary">
                {lang === "ne"
                  ? "पूर्ण गोपनीयता: डाटा फोनमै सुरक्षित"
                  : "100% Private & Device-Only"}
              </strong>
              <span className="text-muted-foreground text-xs leading-relaxed">
                {lang === "ne"
                  ? "तपाईंको खेतको विवरण केवल तपाईंको यो मोबाइल फोनमा मात्र रहन्छ।"
                  : "Your farm coordinates stay strictly on your device. Zero cloud account tracking."}
              </span>
            </div>
          </div>

          {/* Q&A Accordion/List */}
          <div className="space-y-3">
            {faqs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-2"
                >
                  <h3 className="font-bold text-foreground flex items-center gap-2 text-sm sm:text-base">
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    <span>{lang === "ne" ? item.qNe : item.qEn}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                    {lang === "ne" ? item.aNe : item.aEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-xs hover:bg-primary/90 transition-all min-h-[44px]"
          >
            {lang === "ne" ? "बुझेँ, बन्द गर्नुहोस्" : "Got it, close"}
          </button>
        </div>
      </div>
    </div>
  );
}
