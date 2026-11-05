import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translate, type Lang, type TKey } from "./i18n";
import type { Field } from "./data";

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
}

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
  const [lang, setLangS] = useState<Lang>("ne");
  const [field, setFieldS] = useState<Field | null>(null);
  const [thresholds, setThS] = useState<Thresholds>(defaults);
  const [inspections, setInsp] = useState<Inspection[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLangS(load("naip.lang", "ne"));
    setFieldS(load("naip.field", null));
    setThS(load("naip.th", defaults));
    setInsp(load("naip.insp", []));
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
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp outside provider");
  return c;
}
