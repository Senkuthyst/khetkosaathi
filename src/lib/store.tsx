import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translate, type Lang, type TKey } from "./i18n";
import type { Field } from "./data";
import { loadUserFarmFields, type FarmField } from "./farm-fields-service";
import {
  loadDemoProfile,
  saveDemoProfile,
  resetDemoData as clearDemoData,
  type DemoProfile,
} from "./demo-profile";

export type { DemoProfile };

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
  // Demo Account (replaces Supabase auth)
  demoProfile: DemoProfile;
  updateDemoProfile: (p: DemoProfile) => void;
  resetDemoData: () => void;

  // Dynamic Current Location (GPS)
  currentGpsLocationName: string | null;
  setCurrentGpsLocationName: (name: string | null) => void;

  // Multi-Plot & Selected Field Management
  farmFields: FarmField[];
  selectedField: FarmField | null;
  setSelectedField: (f: FarmField | null) => void;
  reloadFarmFields: () => Promise<void>;

  // Legacy field bridge (backward compatibility with components expecting Field)
  field: Field | null;
  setField: (f: Field | null) => void;

  // App Settings
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: TKey) => string;
  thresholds: Thresholds;
  setThresholds: (t: Thresholds) => void;
  inspections: Inspection[];
  addInspection: (i: Inspection) => void;
  ready: boolean;
  activeView: "dashboard" | "landing";
  setActiveView: (v: "dashboard" | "landing") => void;
}

const defaults: Thresholds = { minRain7: 15, minSoil: 25, maxTemp: 32, minBattery: 30 };
const Ctx = createContext<State | null>(null);

function load<T>(k: string, fb: T): T {
  try {
    if (typeof localStorage !== "undefined") {
      const v = localStorage.getItem(k);
      return v ? (JSON.parse(v) as T) : fb;
    }
    return fb;
  } catch {
    return fb;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [demoProfile, setDemoProfileState] = useState<DemoProfile>(() => loadDemoProfile());
  const [currentGpsLocationName, setCurrentGpsLocationName] = useState<string | null>(null);

  const [farmFields, setFarmFields] = useState<FarmField[]>([]);
  const [selectedField, setSelectedFieldState] = useState<FarmField | null>(null);

  const [lang, setLangS] = useState<Lang>("ne");
  const [thresholds, setThS] = useState<Thresholds>(defaults);
  const [inspections, setInsp] = useState<Inspection[]>([]);
  const [ready, setReady] = useState(false);
  const [activeView, setActiveViewS] = useState<"dashboard" | "landing">("landing");

  const reloadFarmFields = async () => {
    const fields = await loadUserFarmFields();
    setFarmFields(fields);
    if (fields.length > 0) {
      const savedId =
        typeof localStorage !== "undefined" ? localStorage.getItem("naip.selected_field_id") : null;
      const matched =
        fields.find((f) => f.id === savedId) ?? fields.find((f) => f.isPrimary) ?? fields[0];
      setSelectedFieldState(matched ?? null);
    } else {
      setSelectedFieldState(null);
    }
  };

  // Load settings and farm fields on mount
  useEffect(() => {
    setLangS(load("naip.lang", "ne"));
    setThS(load("naip.th", defaults));
    setInsp(load("naip.insp", []));
    setActiveViewS(load("naip.view", "landing"));
    setCurrentGpsLocationName(load("naip.gps_loc", null));
    reloadFarmFields().finally(() => setReady(true));
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const save = (k: string, v: unknown) => {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(k, JSON.stringify(v));
      }
    } catch {
      /* storage quota protection */
    }
  };

  const setSelectedField = (f: FarmField | null) => {
    setSelectedFieldState(f);
    if (f) {
      save("naip.selected_field_id", f.id);
    } else {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("naip.selected_field_id");
      }
    }
  };

  const updateDemoProfile = (p: DemoProfile) => {
    setDemoProfileState(p);
    saveDemoProfile(p);
  };

  const resetDemoData = () => {
    clearDemoData();
    setDemoProfileState(loadDemoProfile());
    setFarmFields([]);
    setSelectedFieldState(null);
    setThS(defaults);
    setInsp([]);
    setLangS("ne");
  };

  // Bridge selectedField to legacy Field shape
  const field: Field | null = selectedField
    ? {
        id: selectedField.id,
        name: selectedField.fieldName,
        crop: (selectedField.cropType || "rice") as Field["crop"],
        plantingDate: selectedField.plantingDate,
        municipality: selectedField.municipality ?? "unspecified",
        boundary: selectedField.boundary,
      }
    : null;

  const setField = (legacyField: Field | null) => {
    if (!legacyField) {
      setSelectedField(null);
      return;
    }
    const matched = farmFields.find((f) => f.id === legacyField.id);
    if (matched) setSelectedField(matched);
  };

  const value: State = {
    demoProfile,
    updateDemoProfile,
    resetDemoData,
    currentGpsLocationName,
    setCurrentGpsLocationName: (n) => {
      setCurrentGpsLocationName(n);
      save("naip.gps_loc", n);
    },
    farmFields,
    selectedField,
    setSelectedField,
    reloadFarmFields,
    field,
    setField,
    lang,
    setLang: (l) => {
      setLangS(l);
      save("naip.lang", l);
    },
    t: (k) => translate(lang, k),
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
