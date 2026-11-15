import { useState, useTransition } from "react";
import { Search, MapPin, Globe, Loader2, Check } from "lucide-react";
import { Btn, Card } from "@/components/kit";
import { useApp } from "@/lib/store";

export interface GeoLocation {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  region?: string;
}

export const PRESET_GLOBAL_LOCATIONS: GeoLocation[] = [
  {
    id: "np-chitwan",
    name: "Chitwan (भरतपुर / रत्ननगर)",
    country: "Nepal",
    latitude: 27.6775,
    longitude: 84.4333,
    region: "Bagmati Province (Pilot Farm)",
  },
  {
    id: "np-kavre",
    name: "Kavre (बनेपा / पनौती)",
    country: "Nepal",
    latitude: 27.632,
    longitude: 85.521,
    region: "Mid-Hills Agroecology",
  },
  {
    id: "np-rupandehi",
    name: "Rupandehi (तिलोत्तमा / भैरहवा)",
    country: "Nepal",
    latitude: 27.633,
    longitude: 83.475,
    region: "Lumbini Terai Plain",
  },
  {
    id: "np-kailali",
    name: "Kailali (धनगढी / अत्तरिया)",
    country: "Nepal",
    latitude: 28.698,
    longitude: 80.594,
    region: "Far-West Grain Belt",
  },
  {
    id: "in-punjab",
    name: "Ludhiana, Punjab",
    country: "India",
    latitude: 30.901,
    longitude: 75.8573,
    region: "Indo-Gangetic Plain",
  },
  {
    id: "bd-rangpur",
    name: "Rangpur",
    country: "Bangladesh",
    latitude: 25.7439,
    longitude: 89.2752,
    region: "Brahmaputra Basin",
  },
  {
    id: "us-iowa",
    name: "Ames, Iowa",
    country: "United States",
    latitude: 42.0308,
    longitude: -93.6319,
    region: "US Corn Belt",
  },
  {
    id: "br-mato-grosso",
    name: "Sorriso, Mato Grosso",
    country: "Brazil",
    latitude: -12.5425,
    longitude: -55.7214,
    region: "Cerrado Agricultural Hub",
  },
];

interface LocationSelectorProps {
  currentLocation: GeoLocation;
  onSelectLocation: (loc: GeoLocation) => void;
  className?: string;
}

export function GlobalLocationSelector({
  currentLocation,
  onSelectLocation,
  className = "",
}: LocationSelectorProps) {
  const { lang, t } = useApp();
  const [query, setQuery] = useState("");
  const [customLat, setCustomLat] = useState("");
  const [customLon, setCustomLon] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filteredLocations = PRESET_GLOBAL_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(query.toLowerCase()) ||
      loc.country.toLowerCase().includes(query.toLowerCase()) ||
      (loc.region && loc.region.toLowerCase().includes(query.toLowerCase())),
  );

  const handleCustomCoordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);

    if (
      Number.isFinite(lat) &&
      Number.isFinite(lon) &&
      lat >= -90 &&
      lat <= 90 &&
      lon >= -180 &&
      lon <= 180
    ) {
      onSelectLocation({
        id: `custom-${lat.toFixed(3)}-${lon.toFixed(3)}`,
        name: `Custom [${lat.toFixed(3)}°, ${lon.toFixed(3)}°]`,
        country: "Global Coordinate",
        latitude: Math.round(lat * 10000) / 10000,
        longitude: Math.round(lon * 10000) / 10000,
        region: "Custom User Coordinate",
      });
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Current Selection Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Observation Region
              </span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-primary/10 text-primary">
                {currentLocation.country}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-foreground">{currentLocation.name}</h3>
            <p className="text-xs text-muted-foreground font-mono">
              {currentLocation.latitude.toFixed(4)}° N, {currentLocation.longitude.toFixed(4)}° E
              {currentLocation.region ? ` · ${currentLocation.region}` : ""}
            </p>
          </div>
        </div>

        <Btn
          variant="outline"
          size="sm"
          className="shrink-0 text-xs font-bold gap-1.5"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MapPin className="h-3.5 w-3.5 text-primary" />
          {isOpen ? "Close Selector" : "Change Location"}
        </Btn>
      </div>

      {/* Expandable Location Modal / Drawer */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2 p-5 shadow-2xl border-2 border-primary/20 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h4 className="text-sm font-extrabold text-foreground">Select Geographic Focus</h4>
              <p className="text-xs text-muted-foreground">
                Supports verified Nepal agricultural districts and global comparative hubs.
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search city, district, country..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Preset Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {filteredLocations.map((loc) => {
              const isSelected = loc.id === currentLocation.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    onSelectLocation(loc);
                    setIsOpen(false);
                  }}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-start justify-between ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "border-border hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <div>
                    <span className="block font-semibold">{loc.name}</span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}° · {loc.country}
                    </span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Coordinate Direct Input Form */}
          <form onSubmit={handleCustomCoordSubmit} className="pt-3 border-t space-y-2">
            <span className="text-xs font-bold text-foreground block">
              Or Enter Precise Global Coordinates:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="any"
                min="-90"
                max="90"
                placeholder="Latitude (-90 to 90)"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                className="w-1/2 p-2 text-xs rounded-lg border border-input bg-background"
                required
              />
              <input
                type="number"
                step="any"
                min="-180"
                max="180"
                placeholder="Longitude (-180 to 180)"
                value={customLon}
                onChange={(e) => setCustomLon(e.target.value)}
                className="w-1/2 p-2 text-xs rounded-lg border border-input bg-background"
                required
              />
              <Btn type="submit" size="sm" className="shrink-0 text-xs font-bold">
                Apply Coordinates
              </Btn>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
