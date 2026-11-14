import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translate, type Lang, type TKey } from "./i18n";
import { pilotField, type Field } from "./data";

export interface Thresholds {
  minRain7: number;
  minSoil: number;
  maxTemp: number;
  minBattery: number;
}
export interface Inspection {
  id: string;
  date: string;
  note: string;
  photo?: string;
  outcome: "noIssue" | "problem" | "unsure";
}

interface State {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: TKey) => string;
  field: Field | null;
  setField: (f: Field | null) => void;
  thresholds: Thresholds;
  setThresholds: (t: Thresholds) => void;
  inspections: Inspection[];
  addInspection: (i: Inspection) => void;
  ready: boolean;
  activeView: "dashboard" | "landing";
  setActiveView: (v: "dashboard" | "landing") => void;
}

export const defaultPilotFarm: Field = {
  id: "pilot_chitwan_1",
  name: "Chitwan Research Plot A (चितवन नमुना खेत)",
  crop: "rice",
  plantingDate: "2026-07-10",
  municipality: "bharatpur",
  boundary: pilotField.boundary,
};

const defaults: Thresholds = { minRain7: 15, minSoil: 25, maxTemp: 32, minBattery: 30 };
const Ctx = createContext<State | null>(null);

function load<T>(k: string, fb: T): T {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fb;
  } catch {
    return fb;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangS] = useState<Lang>("en");
  const [field, setFieldS] = useState<Field | null>(defaultPilotFarm);
  const [thresholds, setThS] = useState<Thresholds>(defaults);
  const [inspections, setInsp] = useState<Inspection[]>([]);
  const [ready, setReady] = useState(false);
  const [activeView, setActiveViewS] = useState<"dashboard" | "landing">("dashboard");

  useEffect(() => {
    setLangS(load("naip.lang", "en"));
    setFieldS(load("naip.field", defaultPilotFarm));
    setThS(load("naip.th", defaults));
    setInsp(load("naip.insp", []));
    setActiveViewS(load("naip.view", "dashboard"));
    setReady(true);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const save = (k: string, v: unknown) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {
      /* quota (large photo) — keep in memory */
    }
  };

  const value: State = {
    lang,
    setLang: (l) => (setLangS(l), save("naip.lang", l)),
    t: (k) => translate(lang, k),
    field,
    setField: (f) => (setFieldS(f), save("naip.field", f)),
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
    setActiveView: (v) => (setActiveViewS(v), save("naip.view", v)),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp outside provider");
  return c;
}
