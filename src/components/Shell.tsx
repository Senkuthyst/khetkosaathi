import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Globe2,
  CloudSun,
  Droplets,
  Leaf,
  RotateCcw,
  MapPin,
  Bot,
  Bell,
  SlidersHorizontal,
  WifiOff,
  ShieldAlert,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  User,
  Compass,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { currentAlerts } from "@/lib/derived";
import { num } from "@/lib/i18n";
import { BrandLogo } from "./BrandLogo";
import { AiAssistant } from "./AiAssistant";
import { cn } from "@/lib/utils";

export function Shell({ children }: { children: ReactNode }) {
  const { t, lang, setLang, ready, field, thresholds, activeView, setActiveView } = useApp();
  const loc = useLocation();
  const nav = useNavigate();
  const [online, setOnline] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  const onboarding = loc.pathname.startsWith("/onboarding");

  useEffect(() => {
    const up = () => setOnline(navigator.onLine);
    up();
    window.addEventListener("online", up);
    window.addEventListener("offline", up);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", up);
    };
  }, []);

  const alertCount = ready ? currentAlerts(thresholds).length : 0;

  // Navigation Items matching Prompt Section 7
  const navItems = [
    {
      to: "/",
      label: lang === "ne" ? "अवलोकन" : "Overview",
      Icon: LayoutDashboard,
      exact: true,
    },
    {
      to: "/earth-intelligence",
      label: lang === "ne" ? "भू-सूचना" : "Earth Intelligence",
      Icon: Globe2,
    },
    {
      to: "/weather",
      label: lang === "ne" ? "मौसम र जलवायु" : "Weather & Climate",
      Icon: CloudSun,
    },
    {
      to: "/weather",
      hash: "soil",
      label: lang === "ne" ? "माटोको चिस्यान" : "Soil Moisture",
      Icon: Droplets,
    },
    {
      to: "/crop-health",
      label: lang === "ne" ? "बाली अनुगमन" : "Crop Monitoring",
      Icon: Leaf,
    },
    {
      to: "/guidance",
      label: lang === "ne" ? "बाली चक्र योजनाकार" : "Crop Rotation Planner",
      Icon: RotateCcw,
    },
    {
      to: "/my-farm",
      label: lang === "ne" ? "खेत प्रोफाइलहरू" : "Farm Profiles",
      Icon: MapPin,
    },
    {
      to: "/alerts",
      label: lang === "ne" ? "प्रतिवेदन तथा सूचना" : "Reports & Alerts",
      Icon: Bell,
      badge: alertCount > 0 ? alertCount : undefined,
    },
  ];

  // Current formatted date in Nepal Time
  const now = new Date();
  const nepalDate = now.toLocaleDateString(lang === "ne" ? "ne-NP" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kathmandu",
  });

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased selection:bg-[#B8D987] selection:text-[#123B2A]">
      {/* =========================================================================
          DESKTOP & TABLET SIDEBAR
         ========================================================================= */}
      <aside
        className={cn(
          "sticky top-0 z-30 hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 h-screen select-none",
          sidebarCollapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link to="/" className="flex items-center gap-2 overflow-hidden">
            <BrandLogo
              variant={sidebarCollapsed ? "icon" : "compact"}
              showTagline={false}
              showNepali={!sidebarCollapsed}
            />
          </Link>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-label="Toggle Sidebar"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item, idx) => {
            const active = item.exact
              ? loc.pathname === item.to
              : loc.pathname === item.to || loc.pathname.startsWith(item.to + "/");
            return (
              <Link
                key={idx}
                to={item.to}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all relative",
                  active
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "text-foreground/75 hover:bg-secondary hover:text-primary"
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                    active ? "text-accent" : "text-primary"
                  )}
                  aria-hidden
                />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}

                {/* Notification Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={cn(
                      "rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.2",
                      sidebarCollapsed ? "absolute top-1.5 right-1.5" : "ml-auto"
                    )}
                  >
                    {num(lang, item.badge)}
                  </span>
                )}
              </Link>
            );
          })}

          {/* AI Assistant Sidebar Trigger Button */}
          <button
            onClick={() => setAiAssistantOpen(true)}
            className={cn(
              "w-full group mt-2 flex items-center gap-3 rounded-xl border border-primary/20 bg-secondary/60 px-3 py-2.5 text-xs sm:text-sm font-bold text-primary hover:bg-secondary hover:shadow-xs transition-all relative",
              sidebarCollapsed ? "justify-center" : "justify-start"
            )}
            title={lang === "ne" ? "AI कृषि सहायक खोल्नुहोस्" : "Open AI Agricultural Assistant"}
          >
            <Bot className="h-4 w-4 text-primary shrink-0 group-hover:rotate-12 transition-transform" />
            {!sidebarCollapsed && (
              <div className="flex items-center justify-between w-full">
                <span>{lang === "ne" ? "AI कृषि सहायक" : "AI Assistant"}</span>
                <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-extrabold text-[#123B2A]">
                  AI
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="border-t border-border p-3 space-y-2">
          {/* NASA Live Status Badge */}
          {!sidebarCollapsed && (
            <div className="rounded-xl bg-secondary/40 border border-border p-2.5 text-[11px] text-muted-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-fresh animate-pulse shrink-0" />
              <span className="truncate">NASA POWER & SMAP Live</span>
            </div>
          )}

          {/* Quick Language / Landing Switcher */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLang(lang === "ne" ? "en" : "ne")}
              className={cn(
                "tap flex-1 rounded-xl border border-border text-xs font-bold text-primary hover:bg-secondary transition-colors text-center py-2",
                sidebarCollapsed && "px-1 text-[11px]"
              )}
              title="Toggle Language"
            >
              {sidebarCollapsed ? (lang === "ne" ? "EN" : "ने") : t("langToggle")}
            </button>

            {!sidebarCollapsed && (
              <button
                onClick={() => setActiveView(activeView === "dashboard" ? "landing" : "dashboard")}
                className="tap flex-1 rounded-xl bg-muted hover:bg-secondary text-xs font-bold text-foreground py-2 text-center transition-colors truncate px-2"
                title={activeView === "dashboard" ? "Switch to Landing View" : "Switch to Dashboard"}
              >
                {activeView === "dashboard" ? (lang === "ne" ? "ल्यान्डिङ" : "Showcase") : (lang === "ne" ? "ड्यासबोर्ड" : "Dashboard")}
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MAIN WORKSPACE LAYOUT
         ========================================================================= */}
      <div className="flex flex-1 flex-col min-w-0 overflow-x-hidden">
        {/* Top Application Header */}
        <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
            {/* Left: Mobile Menu Trigger & Personalized Greeting */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-border text-foreground hover:bg-muted"
                aria-label="Open Menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden sm:block min-w-0">
                <p className="text-xs font-medium text-muted-foreground leading-none">
                  {lang === "ne" ? "नमस्ते, कृषक साथी" : "Namaste, Farmer Companion"}
                </p>
                <h1 className="text-sm font-extrabold text-foreground truncate mt-0.5">
                  {field?.name ?? "Chitwan Pilot Field (चितवन नमुना खेत)"}
                </h1>
              </div>

              {/* Mobile compact title */}
              <div className="sm:hidden flex items-center gap-1.5">
                <BrandLogo variant="icon" />
                <span className="font-extrabold text-xs text-primary truncate">KHETKOSAATHI</span>
              </div>
            </div>

            {/* Middle: Selected Farm Pill */}
            {field && (
              <Link
                to="/my-farm"
                className="hidden lg:flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-xs hover:border-primary/40 hover:bg-secondary transition-all"
                title="View or Change Farm Boundary"
              >
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="font-semibold text-foreground truncate max-w-[200px]">
                  {field.name}
                </span>
                <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                  {t(field.crop)}
                </span>
              </Link>
            )}

            {/* Right Header Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Date display */}
              <span className="hidden xl:inline-block text-xs font-medium text-muted-foreground">
                📅 {nepalDate}
              </span>

              {/* AI Assistant Quick Pill */}
              <button
                onClick={() => setAiAssistantOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-secondary/80 px-3 py-1.5 text-xs font-extrabold text-primary hover:bg-secondary transition-all shadow-2xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-leaf" />
                <span className="hidden sm:inline">{lang === "ne" ? "AI सहायक" : "AI Assistant"}</span>
              </button>

              {/* Alerts Bell */}
              <Link
                to="/alerts"
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border text-foreground hover:bg-muted transition-colors"
                aria-label="View Alerts"
              >
                <Bell className="h-4 w-4" />
                {alertCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {num(lang, alertCount)}
                  </span>
                )}
              </Link>

              {/* View Switcher (Landing / Dashboard) */}
              <button
                onClick={() => setActiveView(activeView === "dashboard" ? "landing" : "dashboard")}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                title="Switch between Showcase and Dashboard"
              >
                <Compass className="h-3.5 w-3.5 text-primary" />
                <span>{activeView === "dashboard" ? (lang === "ne" ? "मञ्च परिचय" : "Showcase") : (lang === "ne" ? "ड्यासबोर्ड" : "Dashboard")}</span>
              </button>

              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === "ne" ? "en" : "ne")}
                className="rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs font-bold text-primary hover:bg-secondary transition-colors"
                aria-label="Toggle language"
              >
                {t("langToggle")}
              </button>

              {/* User Avatar */}
              <Link
                to="/my-farm"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xs"
                title="Farm Settings & Profile"
              >
                <User className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Offline Banner */}
          {!online && (
            <div
              role="status"
              className="flex items-center justify-center gap-2 bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground"
            >
              <WifiOff className="h-4 w-4" /> {t("offline")}
            </div>
          )}

          {/* NASA Satellite Disclaimer Bar */}
          <div className="flex items-center justify-between gap-2 bg-secondary/80 px-4 sm:px-6 py-1.5 text-[11px] font-medium text-foreground/80 border-t border-border">
            <div className="flex items-center gap-1.5 truncate">
              <ShieldAlert className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{t("disclaimer")}</span>
            </div>
            <Link
              to="/earth-intelligence"
              className="shrink-0 text-primary font-bold hover:underline hidden sm:inline"
            >
              NASA Provenance ↗
            </Link>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* =========================================================================
          MOBILE DRAWER / HAMBURGER SHEET
         ========================================================================= */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex md:hidden bg-black/60 backdrop-blur-xs"
        >
          <div className="relative flex flex-col w-4/5 max-w-xs h-full bg-card shadow-2xl p-5 border-r border-border animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between border-b pb-4">
              <BrandLogo variant="compact" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
                aria-label="Close Menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
              {navItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
                >
                  <item.Icon className="h-5 w-5 text-primary" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto rounded-full bg-destructive px-2 py-0.5 text-xs text-white font-bold">
                      {num(lang, item.badge)}
                    </span>
                  )}
                </Link>
              ))}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAiAssistantOpen(true);
                }}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-primary bg-secondary/50 mt-2"
              >
                <Bot className="h-5 w-5 text-primary" />
                <span>{lang === "ne" ? "AI कृषि सहायक" : "AI Assistant"}</span>
              </button>
            </nav>

            <div className="border-t pt-4 space-y-2">
              <button
                onClick={() => {
                  setLang(lang === "ne" ? "en" : "ne");
                  setMobileMenuOpen(false);
                }}
                className="w-full rounded-xl border border-border py-2 text-center text-xs font-bold text-primary"
              >
                {t("langToggle")}
              </button>

              <button
                onClick={() => {
                  setActiveView(activeView === "dashboard" ? "landing" : "dashboard");
                  setMobileMenuOpen(false);
                }}
                className="w-full rounded-xl bg-muted py-2 text-center text-xs font-bold text-foreground"
              >
                {activeView === "dashboard" ? (lang === "ne" ? "मञ्च परिचय हेर्नुहोस्" : "View Showcase") : (lang === "ne" ? "ड्यासबोर्ड खोल्नुहोस्" : "Open Dashboard")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MOBILE BOTTOM NAVIGATION (Fixed Touch Bar)
         ========================================================================= */}
      <nav
        className="md:hidden fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur-md shadow-lg"
        aria-label="Mobile Navigation"
      >
        <ul className="grid grid-cols-5 h-16">
          {[
            { to: "/", label: t("home"), Icon: LayoutDashboard, exact: true },
            { to: "/earth-intelligence", label: lang === "ne" ? "भू-सूचना" : "Earth", Icon: Globe2 },
            { to: "/crop-health", label: t("cropHealth"), Icon: Leaf },
            { to: "/weather", label: t("station"), Icon: CloudSun },
            { to: "/alerts", label: t("alerts"), Icon: Bell, badge: alertCount },
          ].map((item, idx) => {
            const active = item.exact ? loc.pathname === item.to : loc.pathname.startsWith(item.to);
            return (
              <li key={idx}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex flex-col items-center justify-center h-full gap-0.5 text-[10px] font-bold relative transition-colors",
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center justify-center rounded-xl p-1",
                      active && "bg-secondary text-primary"
                    )}
                  >
                    <item.Icon className="h-5 w-5" />
                  </span>
                  <span className="truncate max-w-[56px] leading-tight">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute top-1 right-3 rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
                      {num(lang, item.badge)}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* =========================================================================
          AI AGRICULTURAL ASSISTANT MODAL
         ========================================================================= */}
      <AiAssistant isOpen={aiAssistantOpen} onClose={() => setAiAssistantOpen(false)} />
    </div>
  );
}
