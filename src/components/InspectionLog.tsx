import { useEffect, useRef, useState } from "react";
import { Camera, Save, Trash2 } from "lucide-react";
import { useApp, type Inspection } from "@/lib/store";
import { loadInspections, saveInspection, compressPhoto } from "@/lib/inspection-storage";
import { fmtDate } from "@/lib/i18n";
import { Btn, inputCls, Skeleton, ReportButton } from "./kit";

export function InspectionLog() {
  const { t, lang, field } = useApp();
  const [entries, setEntries] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState<string>();
  const [outcome, setOutcome] = useState<Inspection["outcome"]>("unsure");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error" | "photoError">("idle");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const upload = useRef<HTMLInputElement>(null);
  const fieldId = field?.id;
  useEffect(() => {
    let active = true;
    if (!fieldId) { setLoading(false); return; }
    setLoading(true); setLoadFailed(false);
    loadInspections(fieldId).then(rows => { if (active) setEntries(rows); }).catch(() => { if (active) setLoadFailed(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [fieldId, reload]);
  async function save(e: React.FormEvent) {
    e.preventDefault(); if (!fieldId || !note.trim()) return;
    setStatus("saving");
    try {
      const entry: Inspection = { id: crypto.randomUUID(), date: new Date().toISOString(), note: note.trim(), photo, outcome };
      const id = await saveInspection(fieldId, entry);
      setEntries(rows => [{ ...entry, id }, ...rows]); setNote(""); setPhoto(undefined); setStatus("saved");
    } catch { setStatus("error"); }
  }
  return <section className="border-t pt-5">
    <h2 className="mb-1 text-lg font-bold">{t("inspLog")}</h2><p className="mb-4 text-xs text-muted-foreground">{t("fieldScope")} · {field?.name}</p>
    <form onSubmit={save} className="space-y-3">
      <label className="block text-sm font-semibold">{t("notes")}<textarea required maxLength={2000} value={note} onChange={e => { setNote(e.target.value); setStatus("idle"); }} className={`${inputCls} mt-1 min-h-24 py-3`} /></label>
      <fieldset><legend className="mb-2 text-sm font-semibold">{t("outcome")}</legend><div className="flex flex-wrap gap-2">{(["noIssue", "problem", "unsure"] as const).map(o => <label key={o} className="tap flex items-center gap-2 rounded-lg border bg-card px-3 text-sm"><input type="radio" name="outcome" checked={outcome === o} onChange={() => setOutcome(o)} className="accent-primary" />{t(o)}</label>)}</div></fieldset>
      <input ref={upload} className="sr-only" type="file" aria-label={t("photo")} accept="image/jpeg,image/png,image/webp" onChange={async e => { const f = e.target.files?.[0]; if (!f) return; setPhotoLoading(true); try { setPhoto(await compressPhoto(f)); setStatus("idle"); } catch { setStatus("photoError"); } finally { setPhotoLoading(false); e.target.value = ""; } }} />
      <div className="flex flex-wrap gap-2"><Btn type="button" variant="outline" disabled={photoLoading} onClick={() => upload.current?.click()}><Camera className="h-4 w-4" />{t("photo")}</Btn><Btn type="submit" disabled={status === "saving" || photoLoading || !note.trim()}><Save className="h-4 w-4" />{t(status === "saving" ? "saving" : "save")}</Btn></div>
      <p className="text-xs text-muted-foreground">{t("photoLimit")}</p>
      {photo && <div className="flex items-start gap-2"><img src={photo} alt={t("photo")} className="h-24 w-32 rounded-lg object-cover" /><Btn variant="ghost" type="button" title={t("removePhoto")} aria-label={t("removePhoto")} onClick={() => setPhoto(undefined)}><Trash2 className="h-4 w-4" /></Btn></div>}
      {status === "saved" && <p role="status" className="text-sm text-primary">{t("saved")}</p>}
      {(status === "error" || status === "photoError") && <p role="alert" className="text-sm text-destructive">{t(status === "photoError" ? "photoError" : "saveError")}</p>}
    </form>
    <div className="mt-5 space-y-3">{loading ? <Skeleton className="h-24" /> : loadFailed ? <div role="alert"><p>{t("loadError")}</p><Btn variant="outline" onClick={() => setReload(n => n + 1)}>{t("retry")}</Btn></div> : entries.length === 0 ? <p className="py-3 text-sm text-muted-foreground">{t("noEntries")}</p> : entries.map(entry => <article key={entry.id} className="rounded-lg border bg-card p-4">
      <div className="mb-2 flex justify-between gap-2 text-xs"><time dateTime={entry.date}>{fmtDate(lang, entry.date)}</time><span className="font-semibold text-primary">{t(entry.outcome)}</span></div><p className="whitespace-pre-wrap break-words text-sm">{entry.note}</p>{entry.photo && <img src={entry.photo} alt={t("photo")} loading="lazy" className="mt-3 max-h-64 w-full rounded-lg object-contain" />}<ReportButton cardId={`Inspection ${entry.id}`} />
    </article>)}</div>
  </section>;
}