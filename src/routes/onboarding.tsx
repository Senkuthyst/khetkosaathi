import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { type CropId, type LatLng } from "@/lib/data";
import { num } from "@/lib/i18n";
import { Btn, Card, inputCls } from "@/components/kit";
import { LazyMap } from "@/components/LazyMap";
import { pageHead } from "@/lib/page-head";
import { Sprout, MapPin, CheckCircle2, Navigation, Layers, Info } from "lucide-react";
import { getCurrentBrowserCoordinates, reverseGeocodeCoordinates } from "@/lib/geolocation-service";
import { createFarmField } from "@/lib/farm-fields-service";
import { AuthModal } from "@/components/AuthModal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () =>
    pageHead(
      "KHETKOSAATHI — Register Your Farm Plot",
      "Dynamic farm onboarding: provide farmer details, crop specifications, GPS or map location, and cadastral boundaries."
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
  const [coords, setCoords] = useState<[number, number]>([26.666, 87.279]); // Default Itahari centroid if GPS denied
  const [boundary, setBoundary] = useState<LatLng[]>([
    [26.6675, 87.278],
    [26.6678, 87.2805],
    [26.6658, 87.281],
    [26.6655, 87.2785],
  ]);
  const [locatingGps, setLocatingGps] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAcquireGps = async () => {
    setLocatingGps(true);
    try {
      const gps = await getCurrentBrowserCoordinates();
      setCoords([gps.latitude, gps.longitude]);
      // Create initial parcel around GPS point
      const delta = 0.001;
      setBoundary([
        [gps.latitude + delta, gps.longitude - delta],
        [gps.latitude + delta, gps.longitude + delta],
        [gps.latitude - delta, gps.longitude + delta],
        [gps.latitude - delta, gps.longitude - delta],
      ]);

      const geocoded = await reverseGeocodeCoordinates(gps.latitude, gps.longitude);
      if (geocoded.cityOrTown) setMunicipality(geocoded.cityOrTown);
      if (geocoded.district) setDistrict(geocoded.district);
      if (geocoded.stateOrProvince) setProvince(geocoded.stateOrProvince);
    } catch (err: any) {
      alert(err.message || "Could not retrieve GPS coordinates.");
    } finally {
      setLocatingGps(false);
    }
  };

  const handleFinish = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    setSaving(true);
    try {
      const newField = await createFarmField({
        fieldName: fieldName.trim() || "My Farm Plot",
        boundary,
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
                step >= s ? "bg-primary" : "bg-muted"
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
              <label className="block text-xs font-bold text-foreground mb-1">Province / प्रदेश</label>
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
              <label className="block text-xs font-bold text-foreground mb-1">District / जिल्ला</label>
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
              <label className="block text-xs font-bold text-foreground mb-1">Ward Number / वडा नं.</label>
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
              <label className="block text-xs font-bold text-foreground mb-1">Field Name / खेतको नाम</label>
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
                <label className="block text-xs font-bold text-foreground mb-1">Crop Type / मुख्य बाली</label>
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
                <label className="block text-xs font-bold text-foreground mb-1">Crop Variety / जात</label>
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
                <label className="block text-xs font-bold text-foreground mb-1">Planting Date / रोपाईं मिति</label>
                <input
                  type="date"
                  value={plantingDate}
                  onChange={(e) => setPlantingDate(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Irrigation / सिँचाइ प्रकार</label>
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
            <Btn onClick={() => setStep(3)}>Next: Field Boundary →</Btn>
          </div>
        </Card>
      )}

      {/* STEP 3: Boundary & Location */}
      {step === 3 && (
        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
            <h2 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-primary" />
              3. Field Boundary & Cadastral Mapping
            </h2>

            <button
              type="button"
              onClick={handleAcquireGps}
              disabled={locatingGps}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <Navigation className={cn("h-3.5 w-3.5", locatingGps && "animate-spin")} />
              {locatingGps ? "Acquiring GPS..." : "Center on My GPS Location"}
            </button>
          </div>

          <div className="rounded-xl overflow-hidden border border-border">
            <LazyMap
              center={coords}
              zoom={15}
              height={300}
              polygons={[{ positions: boundary, color: "var(--primary)", label: fieldName }]}
            />
          </div>

          <div className="p-3 rounded-xl bg-secondary/50 border border-primary/20 text-xs text-foreground flex items-start gap-2">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>
              Your plot coordinates: {coords[0].toFixed(4)}° N, {coords[1].toFixed(4)}° E. You can fine-tune
              vertices anytime in the Farm Profiles tab.
            </span>
          </div>

          <div className="pt-3 border-t flex justify-between">
            <Btn variant="outline" onClick={() => setStep(2)}>
              ← Back
            </Btn>
            <Btn onClick={() => setStep(4)}>Review & Confirm →</Btn>
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
              <strong className="text-foreground">{t(crop)} ({cropVariety})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Planting Date:</span>
              <strong className="text-foreground">{plantingDate}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Coordinates:</span>
              <strong className="text-foreground font-mono">
                {coords[0].toFixed(4)}° N, {coords[1].toFixed(4)}° E
              </strong>
            </div>
          </div>

          <div className="pt-3 border-t flex justify-between">
            <Btn variant="outline" onClick={() => setStep(3)}>
              ← Back
            </Btn>
            <Btn onClick={handleFinish} disabled={saving} className="font-bold">
              {saving ? "Registering Farm..." : "Complete & Open My Dashboard"}
            </Btn>
          </div>
        </Card>
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultMode="signup" />
    </div>
  );
}
