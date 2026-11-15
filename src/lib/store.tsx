import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { translate, type Lang, type TKey } from "./i18n";
import type { Field } from "./data";
import {
  loadUserFarmFields,
  type FarmField,
  createFarmField,
  deleteFarmField,
} from "./farm-fields-service";
import type { Tables } from "@/integrations/supabase/types";

export type UserProfile = Tables<"user_profiles">;

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
  // Authentication & Profile
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;

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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentGpsLocationName, setCurrentGpsLocationName] = useState<string | null>(null);

  const [farmFields, setFarmFields] = useState<FarmField[]>([]);
  const [selectedField, setSelectedFieldState] = useState<FarmField | null>(null);

  const [lang, setLangS] = useState<Lang>("en");
  const [thresholds, setThS] = useState<Thresholds>(defaults);
  const [inspections, setInsp] = useState<Inspection[]>([]);
  const [ready, setReady] = useState(false);
  const [activeView, setActiveViewS] = useState<"dashboard" | "landing">("dashboard");

  // Sync Supabase Auth Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await refreshProfileForUser(newSession.user.id);
        await reloadFarmFields();
      } else {
        setProfile(null);
        setFarmFields([]);
        setSelectedFieldState(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const refreshProfileForUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setProfile(data);
        if (data.preferred_language === "ne" || data.preferred_language === "en") {
          setLangS(data.preferred_language);
        }
        if (data.current_location_name) {
          setCurrentGpsLocationName(data.current_location_name);
        }
      }
    } catch (err) {
      console.warn("Could not load user profile:", err);
    }
  };

  const refreshProfile = async () => {
    if (user) await refreshProfileForUser(user.id);
  };

  const reloadFarmFields = async () => {
    const fields = await loadUserFarmFields();
    setFarmFields(fields);
    if (fields.length > 0) {
      // Restore saved selection or pick primary / first
      const savedId = localStorage.getItem("naip.selected_field_id");
      const matched =
        fields.find((f) => f.id === savedId) ?? fields.find((f) => f.isPrimary) ?? fields[0];
      setSelectedFieldState(matched ?? null);
    } else {
      // NO CHITWAN DEFAULT - Honest empty state when user has no registered farm!
      setSelectedFieldState(null);
    }
  };

  useEffect(() => {
    setLangS(load("naip.lang", "en"));
    setThS(load("naip.th", defaults));
    setInsp(load("naip.insp", []));
    setActiveViewS(load("naip.view", "dashboard"));
    setCurrentGpsLocationName(load("naip.gps_loc", null));
    setReady(true);
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
      localStorage.removeItem("naip.selected_field_id");
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setFarmFields([]);
    setSelectedFieldState(null);
    localStorage.removeItem("naip.selected_field_id");
  };

  // Bridge selectedField to legacy Field shape
  const field: Field | null = selectedField
    ? {
        id: selectedField.id,
        name: selectedField.fieldName,
        crop: selectedField.cropType as any,
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
    user,
    session,
    profile,
    refreshProfile,
    signOut,
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
      if (user) {
        supabase.from("user_profiles").update({ preferred_language: l }).eq("id", user.id).then();
      }
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
