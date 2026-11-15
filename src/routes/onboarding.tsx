import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useApp } from "@/lib/store";
import { type CropId, type LatLng } from "@/lib/data";
import { num } from "@/lib/i18n";
import { Btn, Card, inputCls } from "@/components/kit";
import { LazyPlotDrawerMap } from "@/components/LazyPlotDrawerMap";
import { pageHead } from "@/lib/page-head";
import {
  Sprout,
  MapPin,
  CheckCircle2,
  Navigation,
  Layers,
  Info,
  Pencil,
  Check,
} from "lucide-react";
import { getCurrentBrowserCoordinates, reverseGeocodeCoordinates } from "@/lib/geolocation-service";
import { createFarmField } from "@/lib/farm-fields-service";
import { AuthModal } from "@/components/AuthModal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () =>
    pageHead(
      "KHETKOSAATHI — Register Your Farm Plot",
      "Dynamic farm onboarding: provide farmer details, crop specifications, GPS or map location, and cadastral boundaries.",
    ),
  component: Onboarding,
});

const crops: CropId[] = ["rice", "maize", "wheat", "potato", "tomato"];
const provinces = [
  "Koshi Province",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",
];

function Onboarding() {
  const { lang, t, user, reloadFarmFields, setSelectedField } = useApp();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // STEP 1: Farmer & Location details
  const [province, setProvince] = useState("Koshi Province");
  const [district, setDistrict] = useState("Sunsari");
  const [municipality, setMunicipality] = useState("Itahari Sub-Metropolitan");
  const [ward, setWard] = useState("4");

  // STEP 2: Farm Specifications
  const [fieldName, setFieldName] = useState("My Rice Field (मेरो खेत)");
  const [crop, setCrop] = useState<CropId>("rice");
  const [cropVariety, setCropVariety] = useState("Sabitri / Radha-4");
  const [plantingDate, setPlantingDate] = useState("2026-07-15");
  const [irrigation, setIrrigation] = useState("canal");
  const [soilType, setSoilType] = useState("Silty Clay Loam");

  // STEP 3 & 4: Location & Boundary
  // GPS is strictly for centering the map view — no default parcel is preselected!
  const [mapCenter, setMapCenter] = useState<[number, number]>([27.7172, 85.324]); // Default Nepal overview center if GPS not acquired
  const [confirmedBoundary, setConfirmedBoundary] = useState<LatLng[] | null>(null);
  const [confirmedAreaHa, setConfirmedAreaHa] = useState<number>(0);
  const [locatingGps, setLocatingGps] = useState(false);
  const [gpsAcquired, setGpsAcquired] = useState(false);
  const [saving, setSaving] = useState(false);

  // Attempt acquiring browser GPS on entry to center map, but fail silently/gracefully if denied
  useEffect(() => {
    if (step === 3 && !gpsAcquired) {
      handleAcquireGps(false);
    }
  }, [step]);

  const handleAcquireGps = async (showAlert = true) => {
    setLocatingGps(true);
    try {
      const gps = await getCurrentBrowserCoordinates();
      setMapCenter([gps.latitude, gps.longitude]);
      setGpsAcquired(true);

      const geocoded = await reverseGeocodeCoordinates(gps.latitude, gps.longitude);
      if (geocoded.cityOrTown) setMunicipality(geocoded.cityOrTown);
      if (geocoded.district) setDistrict(geocoded.district);
      if (geocoded.stateOrProvince) setProvince(geocoded.stateOrProvince);
    } catch (err: any) {
      if (showAlert) {
        alert(
          err.message ||
            "Could not retrieve GPS coordinates. You can pan and zoom the map manually.",
        );
      }
    } finally {
      setLocatingGps(false);
    }
  };

  const handleConfirmPlot = (points: LatLng[], areaHa: number) => {
    setConfirmedBoundary(points);
    setConfirmedAreaHa(areaHa);
  };

  const handleClearPlot = () => {
    setConfirmedBoundary(null);
    setConfirmedAreaHa(0);
  };

  const handleFinish = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (!confirmedBoundary || confirmedBoundary.length < 3) {
      alert("Please draw and confirm your agricultural plot on the map before proceeding.");
      setStep(3);
      return;
    }

    setSaving(true);
    try {
      const newField = await createFarmField({
        fieldName: fieldName.trim() || "My Farm Plot",
        boundary: confirmedBoundary,
        cropType: crop,
        cropVariety,
        plantingDate,
        irrigationType: irrigation,
        soilType,
        municipality,
        district,
        province,
        wardNumber: ward,
        isPrimary: true,
      });

      await reloadFarmFields();
      setSelectedField(newField);
      nav({ to: "/" });
    } catch (err: any) {
      alert(`Error saving field: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Banner */}
      <div className="rounded-3xl border border-border bg-gradient-to-r from-card to-secondary/30 p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
            Farm Registration & Dynamic Parcel Setup
          </span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Register Your Agricultural Plot
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Tailored to your actual location in Nepal or globally. Zero default Chitwan presets.
        </p>

        {/* Step Progress Pills */}
        <div className="mt-4 flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "flex-1 h-2 rounded-full transition-colors",
                step >= s ? "bg-primary" : "bg-muted",
              )}
            />
          ))}
        </div>
        <p className="mt-2 text-xs font-bold text-primary">
          Step {num(lang, step)} of {num(lang, 4)}
        </p>
      </div>

      {/* STEP 1: Administrative Location */}
      {step === 1 && (
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-extrabold text-foreground flex items-center gap-1.5 border-b pb-2">
            <MapPin className="h-4 w-4 text-primary" />
            1. Farmer Administrative Location
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Province / प्रदेश
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className={inputCls}
              >
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                District / जिल्ला
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Sunsari, Kathmandu, Morang"
                className={inputCls}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Municipality / गाउँपालिका / नगरपालिका
              </label>
              <input
                type="text"
                value={municipality}
                onChange={(e) => setMunicipality(e.target.value)}
                placeholder="e.g. Itahari Sub-Metropolitan"
                className={inputCls}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Ward Number / वडा नं.
              </label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                placeholder="e.g. 4"
                className={inputCls}
              />
            </div>
          </div>

          <div className="pt-3 border-t flex justify-end">
            <Btn onClick={() => setStep(2)}>Next: Crop Details →</Btn>
          </div>
        </Card>
      )}

      {/* STEP 2: Crop Details */}
      {step === 2 && (
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-extrabold text-foreground flex items-center gap-1.5 border-b pb-2">
            <Sprout className="h-4 w-4 text-primary" />
            2. Agricultural Specifications
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Field Name / खेतको नाम
              </label>
              <input
                type="text"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="e.g. Uttardhoka Khet, Tarahara Plot B"
                className={inputCls}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Crop Type / मुख्य बाली
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value as CropId)}
                  className={inputCls}
                >
                  {crops.map((c) => (
                    <option key={c} value={c}>
                      {t(c)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Crop Variety / जात
                </label>
                <input
                  type="text"
                  value={cropVariety}
                  onChange={(e) => setCropVariety(e.target.value)}
                  placeholder="e.g. Radha-4, Khumal-4"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Planting Date / रोपाईं मिति
                </label>
                <input
                  type="date"
                  value={plantingDate}
                  onChange={(e) => setPlantingDate(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Irrigation / सिँचाइ प्रकार
                </label>
                <select
                  value={irrigation}
                  onChange={(e) => setIrrigation(e.target.value)}
                  className={inputCls}
                >
                  <option value="rainfed">Rainfed (आकासे पानी)</option>
                  <option value="canal">Canal Irrigation (नहर/कुलो)</option>
                  <option value="borewell">Groundwater / Borewell (बोरिङ)</option>
                  <option value="drip">Drip Irrigation (थोपा सिँचाइ)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t flex justify-between">
            <Btn variant="outline" onClick={() => setStep(1)}>
              ← Back
            </Btn>
            <Btn onClick={() => setStep(3)}>Next: Select Agricultural Plot →</Btn>
          </div>
        </Card>
      )}

      {/* STEP 3: Interactive Plot Selection & Boundary Drawing */}
      {step === 3 && (
        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
            <div>
              <h2 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-primary" />
                3. Select Your Agricultural Plot
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Locate your land on the map, draw its boundary, and adjust vertices. Zero default
                preselection.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleAcquireGps(true)}
              disabled={locatingGps}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto shrink-0"
            >
              <Navigation className={cn("h-3.5 w-3.5", locatingGps && "animate-spin")} />
              {locatingGps ? "Acquiring GPS..." : "Center on My GPS Location"}
            </button>
          </div>

          {/* Interactive Plot Drawing Canvas */}
          <LazyPlotDrawerMap
            initialCenter={mapCenter}
            confirmedPlot={confirmedBoundary}
            onConfirmPlot={handleConfirmPlot}
            onClearPlot={handleClearPlot}
            height={400}
          />

          {/* Confirmation Status Pill */}
          {confirmedBoundary && confirmedBoundary.length >= 3 ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Plot Confirmed:</strong> {confirmedBoundary.length} boundary vertices ·
                  Area: <strong>{confirmedAreaHa} ha</strong>
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                Ready to Proceed
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Action Required:</strong> Click <strong>"Draw Plot Boundary"</strong> above
                to outline your parcel, adjust vertices, and click <strong>"Confirm Plot"</strong>{" "}
                before proceeding to review.
              </span>
            </div>
          )}

          <div className="pt-3 border-t flex justify-between">
            <Btn variant="outline" onClick={() => setStep(2)}>
              ← Back
            </Btn>
            <Btn
              onClick={() => {
                if (!confirmedBoundary || confirmedBoundary.length < 3) {
                  alert(
                    "Please draw your farm boundary and click 'Confirm Plot' before moving to the next step.",
                  );
                  return;
                }
                setStep(4);
              }}
              disabled={!confirmedBoundary || confirmedBoundary.length < 3}
            >
              Review & Confirm →
            </Btn>
          </div>
        </Card>
      )}

      {/* STEP 4: Review and Save */}
      {step === 4 && (
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-extrabold text-foreground flex items-center gap-1.5 border-b pb-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            4. Review & Confirm Farm Registration
          </h2>

          <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Field Name:</span>
              <strong className="text-foreground">{fieldName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <strong className="text-foreground">
                {municipality}, {district} ({province})
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Crop:</span>
              <strong className="text-foreground">
                {t(crop)} ({cropVariety})
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Planting Date:</span>
              <strong className="text-foreground">{plantingDate}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Calculated Land Area:</span>
              <strong className="text-foreground font-mono">{confirmedAreaHa} hectares</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Boundary Vertices:</span>
              <strong className="text-foreground font-mono">
                {confirmedBoundary ? `${confirmedBoundary.length} polygon points` : "None"}
              </strong>
            </div>
          </div>

          <div className="pt-3 border-t flex justify-between">
            <Btn variant="outline" onClick={() => setStep(3)}>
              ← Back to Plot Map
            </Btn>
            <Btn onClick={handleFinish} disabled={saving} className="font-bold">
              {saving ? "Registering Farm..." : "Complete & Open My Dashboard"}
            </Btn>
          </div>
        </Card>
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode="signup"
      />
    </div>
  );
}
