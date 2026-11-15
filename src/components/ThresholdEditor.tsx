import { useState } from "react";
import { Save } from "lucide-react";
import { useApp, type Thresholds } from "@/lib/store";
import { thresholdSchema } from "@/lib/thresholds";
import { Btn, inputCls } from "./kit";

const fields = [
  { key: "minRain7", label: "minRain", min: 0, max: 500 },
  { key: "minSoil", label: "minSoil", min: 0, max: 100 },
  { key: "maxTemp", label: "maxTemp", min: -20, max: 60 },
  { key: "minBattery", label: "minBattery", min: 0, max: 100 },
] as const;
export function ThresholdEditor() {
  const { t, thresholds, setThresholds } = useApp();
  const [draft, setDraft] = useState<Thresholds>(thresholds);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const result = thresholdSchema.safeParse(draft);
        if (!result.success) {
          setStatus("error");
          return;
        }
        setThresholds(result.data);
        setStatus("saved");
      }}
    >
      <p className="text-sm text-muted-foreground">{t("thresholdsNote")}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.key} className="block text-sm font-semibold">
            {t(f.label)}
            <input
              type="number"
              step="0.1"
              required
              min={f.min}
              max={f.max}
              className={`${inputCls} mt-1`}
              value={Number.isNaN(draft[f.key]) ? "" : draft[f.key]}
              onChange={(e) => {
                setDraft({
                  ...draft,
                  [f.key]: e.target.value === "" ? NaN : Number(e.target.value),
                });
                setStatus("idle");
              }}
            />
          </label>
        ))}
      </div>
      <Btn type="submit">
        <Save className="h-4 w-4" />
        {t("save")}
      </Btn>
      {status !== "idle" && (
        <p
          role="status"
          className={status === "error" ? "text-sm text-destructive" : "text-sm text-primary"}
        >
          {t(status === "saved" ? "saved" : "thresholdError")}
        </p>
      )}
    </form>
  );
}
