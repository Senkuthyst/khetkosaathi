// Demo Account Profile — SSR-safe localStorage helpers
// Stores a minimal guest profile (name only) locally.
// No Supabase, no authentication, no email required.

export const DEMO_USER_ID = "demo-farmer-local";
export const DEMO_PROFILE_KEY = "naip.demo_profile";
export const FARM_FIELDS_KEY = "naip.farm_fields";

export interface DemoProfile {
  name: string;
}

const DEFAULT_PROFILE: DemoProfile = { name: "Demo Farmer" };

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

/** Load the demo profile from localStorage; returns default if absent or SSR. */
export function loadDemoProfile(): DemoProfile {
  if (!isBrowser()) return { ...DEFAULT_PROFILE };
  try {
    const raw = localStorage.getItem(DEMO_PROFILE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw) as Partial<DemoProfile>;
    return { name: parsed.name?.trim() || DEFAULT_PROFILE.name };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

/** Persist the demo profile to localStorage. */
export function saveDemoProfile(profile: DemoProfile): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    /* quota protection */
  }
}

/**
 * Clear all naip.* localStorage keys and restore the default demo profile.
 * Does NOT reload the page — the caller decides whether to reload.
 */
export function resetDemoData(): void {
  if (!isBrowser()) return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("naip.")) keysToRemove.push(k);
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}
