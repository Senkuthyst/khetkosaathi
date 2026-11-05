import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { municipalities, pilotField, type CropId, type LatLng } from "@/lib/data";
import { num } from "@/lib/i18n";
import { Btn, Card, PageTitle, inputCls } from "@/components/kit";
import { LazyMap } from "@/components/LazyMap";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Register your field — Nepal Agri Intelligence" },
      { name: "description", content: "Choose your municipality and register your field boundary." },
      { property: "og:title", content: "Register your field — Nepal Agri Intelligence" },
      { property: "og:description", content: "Choose your municipality and register your field boundary." },
    ],
  }),
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
    setField({ id: "f1", name: name || pilotField.name, crop, plantingDate: date, municipality: muni, boundary: pts });
    nav({ to: "/" });
  };

  return (
    <div>
      <PageTitle>{t("welcome")}</PageTitle>
      <p className="mb-1 text-muted-foreground">{t("onbIntro")}</p>
      <p className="mb-4 text-sm font-semibold">{t("step")} {num(lang, step)}/{num(lang, 3)}</p>

      {step === 1 && (
        <Card>
          <fieldset>
            <legend className="mb-2 font-bold">{t("municipality")}</legend>
            <div className="space-y-2">
              {municipalities.map((m) => (
                <label key={m.id} className={`tap flex cursor-pointer items-center gap-3 rounded-xl border-2 px-3 ${muni === m.id ? "border-primary bg-secondary" : ""}`}>
                  <input type="radio" name="muni" checked={muni === m.id} onChange={() => setMuni(m.id)} className="h-5 w-5 accent-primary" />
                  {m[lang]}
                </label>
              ))}
            </div>
          </fieldset>
          <Btn className="mt-4 w-full" onClick={() => setStep(2)}>{t("next")}</Btn>
        </Card>
      )}

      {step === 2 && (
        <Card className="space-y-4">
          <label className="block"><span className="mb-1 block font-bold">{t("fieldName")}</span>
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder={pilotField.name} /></label>
          <div><span className="mb-1 block font-bold">{t("crop")}</span>
            <div className="grid grid-cols-3 gap-2">
              {crops.map((c) => (
                <button key={c} onClick={() => setCrop(c)} aria-pressed={crop === c} className={`tap rounded-xl border-2 font-semibold ${crop === c ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{t(c)}</button>
              ))}
            </div></div>
          <label className="block"><span className="mb-1 block font-bold">{t("plantingDate")}</span>
            <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <div className="flex gap-2"><Btn variant="outline" className="flex-1" onClick={() => setStep(1)}>{t("back")}</Btn><Btn className="flex-1" onClick={() => setStep(3)}>{t("next")}</Btn></div>
        </Card>
      )}

      {step === 3 && (
        <Card className="space-y-3">
          <h2 className="font-bold">{t("boundary")}</h2>
          <p className="text-sm text-muted-foreground">{t("boundaryHelp")}</p>
          <LazyMap key={muni} center={pts[0] ?? center} zoom={16} drawing={pts} onAdd={(p) => setPts((x) => [...x, p])} height={320} />
          <p className="text-sm font-semibold">{num(lang, pts.length)} {t("points")}</p>
          <div className="grid grid-cols-3 gap-2">
            <Btn variant="outline" onClick={() => setPts((x) => x.slice(0, -1))} disabled={!pts.length}>{t("undo")}</Btn>
            <Btn variant="outline" onClick={() => setPts([])} disabled={!pts.length}>{t("clear")}</Btn>
            <Btn variant="ghost" onClick={() => { setMuni("bharatpur"); setPts(pilotField.boundary); }}>{t("usePilot")}</Btn>
          </div>
          <div className="flex gap-2"><Btn variant="outline" className="flex-1" onClick={() => setStep(2)}>{t("back")}</Btn><Btn className="flex-1" disabled={pts.length < 3} onClick={finish}>{t("finish")}</Btn></div>
        </Card>
      )}
    </div>
  );
}
