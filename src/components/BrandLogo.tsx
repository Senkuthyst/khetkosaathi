import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  variant?: "full" | "compact" | "icon" | "hero";
  className?: string;
  theme?: "light" | "dark" | "forest";
  showTagline?: boolean;
  showNepali?: boolean;
}

export function BrandLogo({
  variant = "compact",
  className,
  theme = "forest",
  showTagline = true,
  showNepali = true,
}: BrandLogoProps) {
  const { lang } = useApp();

  const textColor = {
    forest: "text-[#123B2A]",
    dark: "text-white",
    light: "text-[#18251E]",
  }[theme];

  const subtextColor = {
    forest: "text-[#237A50]",
    dark: "text-[#B8D987]",
    light: "text-[#758078]",
  }[theme];

  const iconSizes = {
    icon: "h-9 w-9",
    compact: "h-8 w-8 sm:h-9 sm:w-9",
    full: "h-10 w-10 sm:h-11 sm:w-11",
    hero: "h-14 w-14 sm:h-16 sm:w-16",
  }[variant];

  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      {/* KHETKOSAATHI Vector Emblem: Leaf + Satellite Orbital Path + Earth Observation Node */}
      <div className={cn("relative shrink-0 flex items-center justify-center", iconSizes)}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
          aria-hidden="true"
        >
          {/* Subtle Outer Glow / Atmosphere */}
          <circle cx="24" cy="24" r="22" fill="#237A50" fillOpacity="0.08" />

          {/* Satellite Orbit Ellipse */}
          <ellipse
            cx="24"
            cy="24"
            rx="19"
            ry="9"
            transform="rotate(-28 24 24)"
            stroke={theme === "dark" ? "#B8D987" : "#237A50"}
            strokeWidth="1.8"
            strokeDasharray="2.5 2.5"
            strokeOpacity="0.85"
          />

          {/* Agricultural Sprout / Leaf Body */}
          <path
            d="M15 33C14 26 18 17 29 13C29 23 23 31 15 33Z"
            fill={theme === "dark" ? "#69A96B" : "#123B2A"}
          />
          <path
            d="M17 33C24 33 32 28 35 18C28 17 21 21 17 33Z"
            fill="#237A50"
          />
          {/* Inner Leaf Vein */}
          <path
            d="M17 31C21 27 25 22 28 16"
            stroke="#B8D987"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Satellite Orbit Node / Observation Node */}
          <circle cx="39" cy="18" r="3" fill="#B8D987" stroke="#123B2A" strokeWidth="1.2" />
          <circle cx="39" cy="18" r="1.2" fill="#FFFFFF" />

          {/* Second Sensor Relay Pulse Node */}
          <circle cx="9" cy="30" r="1.8" fill="#69A96B" opacity="0.9" />
        </svg>
      </div>

      {/* Typography */}
      {variant !== "icon" && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={cn(
                "font-extrabold tracking-tight font-sans transition-colors",
                textColor,
                variant === "hero" ? "text-2xl sm:text-3xl" : "text-base sm:text-lg"
              )}
            >
              KHETKOSAATHI
            </span>
            {showNepali && (
              <span
                className={cn(
                  "font-medium text-xs px-1.5 py-0.5 rounded-md transition-colors",
                  theme === "dark"
                    ? "bg-white/10 text-[#B8D987]"
                    : "bg-[#237A50]/10 text-[#237A50]"
                )}
                title="खेतको साथी (Nepali)"
              >
                खेतको साथी
              </span>
            )}
          </div>

          {(variant === "full" || variant === "hero" || showTagline) && (
            <p
              className={cn(
                "mt-0.5 font-medium tracking-tight truncate",
                subtextColor,
                variant === "hero" ? "text-xs sm:text-sm" : "text-[11px]"
              )}
            >
              {lang === "ne"
                ? "तपाईंको बौद्धिक कृषि सहयात्री · NASA Earth Intelligence"
                : "Your Intelligent Agricultural Companion"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
