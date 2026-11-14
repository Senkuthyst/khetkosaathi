import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { municipalities, pilotField, type CropId, type LatLng } from "@/lib/data";
import { num } from "@/lib/i18n";
import { Btn, Card, PageTitle, inputCls } from "@/components/kit";
import { LazyMap } from "@/components/LazyMap";
import { pageHead } from "@/lib/page-head";
import { Sprout, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () =>
    pageHead(
      "KHETKOSAATHI — Register Your Field",
      "Choose your municipality, crop type, planting date, and register your field boundary polygon."
    ),
  component: Onboarding,
});

const crops: CropId[] = ["rice", "maize", "wheat", "potato", "tomato"];

function Onboarding() {
  const { t, lang, setField, field } = useApp();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [muni, setMuni] = useState(field?.municipality ?? "bharatpur");
  const [name, setName] = useState(field?.name ?? "");
  const [crop, setCrop] = useState<CropId>(field?.crop ?? "rice");
  const [date, setDate] = useState(field?.plantingDate ?? "2026-07-10");
  const [pts, setPts] = useState<LatLng[]>(field?.boundary ?? []);
  const center = municipalities.find((m) => m.id === muni)!.center;

  const finish = () => {
    setField({
      id: "f1",
      name: name.trim() || pilotField.name,
      crop,
      plantingDate: date,
      municipality: muni,
      boundary: pts,
    });
    nav({ to: "/" });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Banner */}
      <div className="rounded-3xl border border-border bg-gradient-to-r from-card to-secondary/30 p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
            KHETKOSAATHI Onboarding
          </span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          {t("welcome")}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{t("onbIntro")}</p>

        {/* Step Progress Pills */}
        <div className="mt-4 flex items-center gap-2">
          {[1, 2, 3].map((s) => (
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
          {t("step")} {num(lang, step)} / {num(lang, 3)}
        </p>
      </div>

      {/* STEP 1: Municipality */}
      {step === 1 && (
        <Card className="p-6 space-y-4">
          <fieldset>
            <legend className="text-sm font-extrabold text-foreground mb-3 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              {t("municipality")}
            </legend>
            <div className="space-y-2">
              {municipalities.map((m) => (
                <label
                  key={m.id}
                  className={cn(
                    "tap flex cursor-pointer items-center justify-between rounded-xl border-2 px-4 py-3 transition-all",
                    muni === m.id
                      ? "border-primary bg-secondary/60 text-primary font-bold shadow-2xs"
                      : "border-border bg-card text-foreground hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="muni"
                      checked={muni === m.id}
                      onChange={() => setMuni(m.id)}
                      className="h-4 w-4 accent-primary"
                    />
                    <span className="text-sm">{m[lang]}</span>
                  </div>
                  {muni === m.id && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </label>
              ))}
            </div>
          </fieldset>
          <Btn className="mt-4 w-full py-3" onClick={() => setStep(2)}>
            {t("next")}
          </Btn>
        </Card>
      )}

      {/* STEP 2: Field Details */}
      {step === 2 && (
        <Card className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t("fieldName")}
            </label>
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={pilotField.name}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1">
              <Sprout className="h-3.5 w-3.5 text-primary" />
              {t("crop")}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {crops.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCrop(c)}
                  aria-pressed={crop === c}
                  className={cn(
                    "tap rounded-xl border-2 py-2.5 px-3 text-xs font-bold transition-all text-center",
                    crop === c
                      ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                      : "border-border bg-card text-foreground hover:bg-muted"
                  )}
                >
                  {t(c)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t("plantingDate")}
            </label>
            <input
              type="date"
              className={inputCls}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2 border-t">
            <Btn variant="outline" className="flex-1" onClick={() => setStep(1)}>
              {t("back")}
            </Btn>
            <Btn className="flex-1" onClick={() => setStep(3)}>
              {t("next")}
            </Btn>
          </div>
        </Card>
      )}

      {/* STEP 3: Boundary Polygon */}
      {step === 3 && (
        <Card className="p-6 space-y-4">
          <div>
            <h2 className="font-extrabold text-base text-foreground">{t("boundary")}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{t("boundaryHelp")}</p>
          </div>

          <div className="rounded-xl overflow-hidden border border-border">
            <LazyMap
              key={muni}
              center={pts[0] ?? center}
              zoom={16}
              drawing={pts}
              onAdd={(p) => setPts((x) => [...x, p])}
              height={320}
            />
          </div>

          <p className="text-xs font-bold text-primary">
            {num(lang, pts.length)} {t("points")} recorded
          </p>

          <div className="grid grid-cols-3 gap-2">
            <Btn variant="outline" onClick={() => setPts((x) => x.slice(0, -1))} disabled={!pts.length}>
              {t("undo")}
            </Btn>
            <Btn variant="outline" onClick={() => setPts([])} disabled={!pts.length}>
              {t("clear")}
            </Btn>
            <Btn
              variant="ghost"
              onClick={() => {
                setMuni("bharatpur");
                setPts(pilotField.boundary);
              }}
            >
              {t("usePilot")}
            </Btn>
          </div>

          <div className="flex gap-3 pt-2 border-t">
            <Btn variant="outline" className="flex-1" onClick={() => setStep(2)}>
              {t("back")}
            </Btn>
            <Btn className="flex-1" disabled={pts.length < 3} onClick={finish}>
              {t("finish")}
            </Btn>
          </div>
        </Card>
      )}
    </div>
  );
}
