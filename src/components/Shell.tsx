import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Home, Leaf, CloudSun, Bell, BookOpen, WifiOff, Sprout, ShieldAlert, Globe2, MapPin } from "lucide-react";
import { useApp } from "@/lib/store";
import { currentAlerts } from "@/lib/derived";
import { num } from "@/lib/i18n";
import { Skeleton } from "./kit";

const tabs = [
  { to: "/", key: "home", Icon: Home },
  { to: "/crop-health", key: "cropHealth", Icon: Leaf },
  { to: "/weather", key: "station", Icon: CloudSun },
  { to: "/alerts", key: "alerts", Icon: Bell },
  { to: "/guidance", key: "guidance", Icon: BookOpen },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const { t, lang, setLang, ready, field, thresholds } = useApp();
  const loc = useLocation();
  const nav = useNavigate();
  const [online, setOnline] = useState(true);
  const onboarding = loc.pathname.startsWith("/onboarding");

  useEffect(() => {
    const up = () => setOnline(navigator.onLine);
    up();
    window.addEventListener("online", up);
    window.addEventListener("offline", up);
    return () => (window.removeEventListener("online", up), window.removeEventListener("offline", up));
  }, []);
  useEffect(() => {
    if (ready && !field && !onboarding) nav({ to: "/onboarding" });
  }, [ready, field, onboarding, nav]);

  const alertCount = ready ? currentAlerts(thresholds).length : 0;

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col bg-background">
      <header className="sticky top-0 z-20 bg-primary text-primary-foreground shadow">
        <div className="flex items-center justify-between gap-2 px-4 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <Sprout className="h-6 w-6 shrink-0" aria-hidden />
            <span className="truncate text-sm font-bold leading-tight">{t("appName")}</span>
          </div>
          <Link to="/my-farm" title={t("myFarm")} aria-label={t("myFarm")} aria-current={loc.pathname === "/my-farm" ? "page" : undefined} className="tap flex w-12 shrink-0 items-center justify-center rounded-lg border border-primary-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"><MapPin className="h-5 w-5" aria-hidden /></Link>
          <Link to="/earth-intelligence" title={t("earthIntelligence")} aria-label={t("earthIntelligence")} aria-current={loc.pathname === "/earth-intelligence" ? "page" : undefined} className="tap flex w-12 shrink-0 items-center justify-center rounded-lg border border-primary-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"><Globe2 className="h-5 w-5" aria-hidden /></Link>
          <button onClick={() => setLang(lang === "ne" ? "en" : "ne")} className="tap shrink-0 rounded-xl border-2 border-primary-foreground/60 px-3 text-sm font-semibold" aria-label="Switch language">
            {t("langToggle")}
          </button>
        </div>
        {!online && (
          <div role="status" className="flex items-center gap-2 bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
            <WifiOff className="h-4 w-4" aria-hidden /> {t("offline")}
          </div>
        )}
        <div className="flex items-start gap-2 bg-satellite-soft px-4 py-1.5 text-xs font-medium text-satellite">
          <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden /> {t("disclaimer")}
        </div>
      </header>

      <main className="flex-1 px-4 pb-28 pt-4">
        {ready ? children : <div className="space-y-3"><Skeleton className="h-8 w-1/2" /><Skeleton className="h-36" /><Skeleton className="h-36" /><Skeleton className="h-36" /></div>}
      </main>

      {!onboarding && (
        <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-xl border-t bg-card" aria-label="Main">
          <ul className="grid grid-cols-5">
            {tabs.map(({ to, key, Icon }) => {
              const active = to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(to);
              return (
                <li key={to}>
                  <Link to={to} className={`relative flex min-h-16 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`} aria-current={active ? "page" : undefined}>
                    <span className={`rounded-full px-3 py-1 ${active ? "bg-secondary" : ""}`}><Icon className="h-6 w-6" aria-hidden /></span>
                    <span className="text-center leading-tight">{t(key)}</span>
                    {key === "alerts" && alertCount > 0 && (
                      <span className="absolute right-3 top-1 rounded-full bg-destructive px-1.5 text-[10px] text-destructive-foreground">{num(lang, alertCount)}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
