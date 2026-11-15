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
  Compass,
  ChevronDown,
  Navigation,
  Plus,
  HelpCircle,
  MoreHorizontal,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { currentAlerts } from "@/lib/derived";
import { num } from "@/lib/i18n";
import { BrandLogo } from "./BrandLogo";
import { AiAssistant } from "./AiAssistant";
import { HelpSheet } from "./HelpSheet";
import { Btn } from "@/components/kit";
import { getCurrentBrowserCoordinates, reverseGeocodeCoordinates } from "@/lib/geolocation-service";
import { cn } from "@/lib/utils";

export function Shell({ children }: { children: ReactNode }) {
  const {
    t,
    lang,
    setLang,
    ready,
    demoProfile,
    resetDemoData,
    selectedField,
    setSelectedField,
    farmFields,
    currentGpsLocationName,
    setCurrentGpsLocationName,
    thresholds,
    activeView,
    setActiveView,
  } = useApp();

  const loc = useLocation();
  const nav = useNavigate();
  const [online, setOnline] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [helpSheetOpen, setHelpSheetOpen] = useState(false);
  const [fieldDropdownOpen, setFieldDropdownOpen] = useState(false);
  const [locatingGps, setLocatingGps] = useState(false);

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

  const handleAcquireGps = async () => {
    setLocatingGps(true);
    try {
      const coords = await getCurrentBrowserCoordinates();
      const geocoded = await reverseGeocodeCoordinates(coords.latitude, coords.longitude);
      setCurrentGpsLocationName(geocoded.displayName);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Could not retrieve GPS location.");
    } finally {
      setLocatingGps(false);
    }
  };

  const alertCount = ready ? currentAlerts(thresholds).length : 0;

  // Navigation Items
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
      to: "/farm-check",
      label: lang === "ne" ? "खेत जाँच" : "Farm Check",
      Icon: Compass,
    },
    {
      to: "/alerts",
      label: lang === "ne" ? "प्रतिवेदन तथा सूचना" : "Reports & Alerts",
      Icon: Bell,
      badge: alertCount > 0 ? alertCount : undefined,
    },
  ];

  // Dynamic Location Header Label
  let locationHeaderLabel = "Location not set";
  if (selectedField) {
    locationHeaderLabel = `${selectedField.fieldName}${selectedField.municipality ? ` · ${selectedField.municipality}` : ""}${selectedField.district ? `, ${selectedField.district}` : ""}`;
  } else if (currentGpsLocationName) {
    locationHeaderLabel = currentGpsLocationName;
  }

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground antialiased selection:bg-leaf/20 selection:text-primary">
      {/* =========================================================================
          COLLAPSIBLE DESKTOP SIDEBAR
         ========================================================================= */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out shrink-0 sticky top-0 h-screen z-30",
          sidebarCollapsed ? "w-20" : "w-64",
        )}
      >
        {/* Brand Logo Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2 overflow-hidden">
            <BrandLogo variant={sidebarCollapsed ? "icon" : "full"} />
          </Link>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {navItems.map((item) => {
            const active = item.exact ? loc.pathname === item.to : loc.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all relative",
                  active
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                  sidebarCollapsed && "justify-center px-0",
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                    active ? "text-primary-foreground" : "text-primary",
                  )}
                />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}

                {/* Notification Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={cn(
                      "rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.2",
                      sidebarCollapsed ? "absolute top-1.5 right-1.5" : "ml-auto",
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
              sidebarCollapsed ? "justify-center" : "justify-start",
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

          {/* Help & Questions Sidebar Trigger */}
          <button
            onClick={() => setHelpSheetOpen(true)}
            className={cn(
              "w-full group mt-1.5 flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all relative",
              sidebarCollapsed ? "justify-center" : "justify-start",
            )}
            title={lang === "ne" ? "मद्दत र जानकारी खोल्नुहोस्" : "Open Help & FAQs"}
          >
            <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
            {!sidebarCollapsed && (
              <span>{lang === "ne" ? "मद्दत र जानकारी" : "Help & Questions"}</span>
            )}
          </button>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="border-t border-border p-3 space-y-2">
          {/* Quick Language / Landing Switcher */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLang(lang === "ne" ? "en" : "ne")}
              className={cn(
                "tap flex-1 rounded-xl border border-border text-xs font-bold text-primary hover:bg-secondary transition-colors text-center py-2",
                sidebarCollapsed && "px-1 text-[11px]",
              )}
              title="Toggle Language"
            >
              {sidebarCollapsed ? (lang === "ne" ? "EN" : "ने") : t("langToggle")}
            </button>

            {!sidebarCollapsed && (
              <button
                onClick={() => setActiveView(activeView === "dashboard" ? "landing" : "dashboard")}
                className="tap flex-1 rounded-xl bg-muted hover:bg-secondary text-xs font-bold text-foreground py-2 text-center transition-colors truncate px-2"
                title={
                  activeView === "dashboard" ? "Switch to Landing View" : "Switch to Dashboard"
                }
              >
                {activeView === "dashboard"
                  ? lang === "ne"
                    ? "ल्यान्डिङ"
                    : "Showcase"
                  : lang === "ne"
                    ? "ड्यासबोर्ड"
                    : "Dashboard"}
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
            {/* Left: Mobile Menu Trigger & Dynamic Location Display */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-border text-foreground hover:bg-muted"
                aria-label="Open Menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden sm:block min-w-0">
                <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1 leading-none">
                  <MapPin className="h-3 w-3 text-primary" />
                  {selectedField ? "Active Farm Plot" : "Current Region"}
                </p>
                <h1 className="text-sm font-extrabold text-foreground truncate mt-0.5">
                  {locationHeaderLabel}
                </h1>
              </div>

              {/* Mobile compact title */}
              <div className="sm:hidden flex items-center gap-1.5">
                <BrandLogo variant="icon" />
                <span className="font-extrabold text-xs text-primary truncate max-w-[120px]">
                  {selectedField?.fieldName ?? "KHETKOSAATHI"}
                </span>
              </div>
            </div>

            {/* Middle: Field Selector Dropdown or Acquire GPS Button */}
            <div className="relative">
              {farmFields.length > 0 ? (
                <div>
                  <button
                    onClick={() => setFieldDropdownOpen(!fieldDropdownOpen)}
                    className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-xs font-semibold hover:border-primary/40 hover:bg-secondary transition-all"
                  >
                    <span className="truncate max-w-[160px]">
                      {selectedField ? selectedField.fieldName : "Select Active Plot"}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>

                  {fieldDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-border bg-card p-2 shadow-xl z-50 space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase px-2 py-1 block">
                        Your Agricultural Plots
                      </span>
                      {farmFields.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => {
                            setSelectedField(f);
                            setFieldDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full text-left p-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between",
                            selectedField?.id === f.id
                              ? "bg-primary text-primary-foreground font-bold"
                              : "hover:bg-muted text-foreground",
                          )}
                        >
                          <span className="truncate">{f.fieldName}</span>
                          <span className="text-[10px] opacity-80">{f.cropType}</span>
                        </button>
                      ))}
                      <div className="border-t border-border pt-1 mt-1">
                        <Link
                          to="/onboarding"
                          onClick={() => setFieldDropdownOpen(false)}
                          className="w-full text-left p-2 rounded-lg text-xs font-bold text-primary hover:bg-secondary flex items-center gap-1.5"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Register New Plot
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleAcquireGps}
                  disabled={locatingGps}
                  className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                >
                  <Navigation
                    className={cn("h-3.5 w-3.5 text-primary", locatingGps && "animate-spin")}
                  />
                  <span>{locatingGps ? "Acquiring GPS..." : "Acquire Current GPS"}</span>
                </button>
              )}
            </div>

            {/* Right Header Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Big, Obvious Language Toggle */}
              <div className="flex items-center rounded-xl border-2 border-primary/40 bg-muted/60 p-0.5 shadow-2xs">
                <button
                  onClick={() => setLang("ne")}
                  className={cn(
                    "px-2.5 py-1 text-xs font-extrabold rounded-lg transition-all",
                    lang === "ne"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-label="नेपाली भाषा"
                >
                  नेपाली
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={cn(
                    "px-2.5 py-1 text-xs font-extrabold rounded-lg transition-all",
                    lang === "en"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-label="English language"
                >
                  EN
                </button>
              </div>

              {/* AI Assistant Quick Pill */}
              <button
                onClick={() => setAiAssistantOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-secondary/80 px-3 py-1.5 text-xs font-extrabold text-primary hover:bg-secondary transition-all shadow-2xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-leaf" />
                <span>{lang === "ne" ? "AI सहायक" : "AI Assistant"}</span>
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

              {/* Demo Account Chip - small and secondary */}
              <div className="flex items-center gap-1.5">
                <Link
                  to="/my-farm"
                  className="rounded-lg bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  title="Demo Account"
                >
                  {lang === "ne" ? "डेमो" : "Demo"}
                </Link>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        lang === "ne"
                          ? "डेमो डाटा रिसेट गर्ने?"
                          : "Reset all demo data? This will clear all saved farms and settings.",
                      )
                    ) {
                      resetDemoData();
                      window.location.reload();
                    }
                  }}
                  className="text-[11px] text-muted-foreground hover:text-destructive transition-colors hidden sm:block"
                  title="Reset Demo Data"
                >
                  {lang === "ne" ? "रिसेट" : "Reset"}
                </button>
              </div>
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
        </header>

        {/* Dynamic Page Content (with bottom padding on mobile for 5-tab bar) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* =========================================================================
          MOBILE 5-TAB BOTTOM NAVIGATION (< md)
         ========================================================================= */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur-md px-1 py-1.5 shadow-lg"
      >
        <div className="grid grid-cols-5 items-center gap-0.5">
          {/* Tab 1: Check My Farm */}
          <Link
            to="/farm-check"
            className={cn(
              "flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-center transition-colors min-h-[48px]",
              loc.pathname.startsWith("/farm-check")
                ? "text-primary font-bold bg-primary/10"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Compass className="h-5 w-5 shrink-0" />
            <span className="text-[10px] font-semibold truncate mt-0.5 max-w-full px-0.5">
              {lang === "ne" ? "खेत जाँच" : "Check Farm"}
            </span>
          </Link>

          {/* Tab 2: My Farm */}
          <Link
            to="/my-farm"
            className={cn(
              "flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-center transition-colors min-h-[48px]",
              loc.pathname.startsWith("/my-farm")
                ? "text-primary font-bold bg-primary/10"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <MapPin className="h-5 w-5 shrink-0" />
            <span className="text-[10px] font-semibold truncate mt-0.5 max-w-full px-0.5">
              {lang === "ne" ? "मेरो खेत" : "My Farm"}
            </span>
          </Link>

          {/* Tab 3: Weather */}
          <Link
            to="/weather"
            className={cn(
              "flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-center transition-colors min-h-[48px]",
              loc.pathname.startsWith("/weather")
                ? "text-primary font-bold bg-primary/10"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <CloudSun className="h-5 w-5 shrink-0" />
            <span className="text-[10px] font-semibold truncate mt-0.5 max-w-full px-0.5">
              {lang === "ne" ? "मौसम" : "Weather"}
            </span>
          </Link>

          {/* Tab 4: Alerts */}
          <Link
            to="/alerts"
            className={cn(
              "flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-center transition-colors relative min-h-[48px]",
              loc.pathname.startsWith("/alerts")
                ? "text-primary font-bold bg-primary/10"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Bell className="h-5 w-5 shrink-0" />
            {alertCount > 0 && (
              <span className="absolute top-1 right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[8px] font-extrabold text-destructive-foreground">
                {num(lang, alertCount)}
              </span>
            )}
            <span className="text-[10px] font-semibold truncate mt-0.5 max-w-full px-0.5">
              {lang === "ne" ? "सूचना" : "Alerts"}
            </span>
          </Link>

          {/* Tab 5: Help */}
          <button
            onClick={() => setHelpSheetOpen(true)}
            className="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-center text-muted-foreground hover:text-foreground transition-colors min-h-[48px]"
          >
            <HelpCircle className="h-5 w-5 shrink-0" />
            <span className="text-[10px] font-semibold truncate mt-0.5 max-w-full px-0.5">
              {lang === "ne" ? "मद्दत" : "Help"}
            </span>
          </button>
        </div>
      </nav>

      {/* AI Assistant Modal Scaffolding */}
      <AiAssistant isOpen={aiAssistantOpen} onClose={() => setAiAssistantOpen(false)} />

      {/* Plain Language Help Sheet */}
      <HelpSheet isOpen={helpSheetOpen} onClose={() => setHelpSheetOpen(false)} />
    </div>
  );
}
