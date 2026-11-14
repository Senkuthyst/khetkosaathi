import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { MapPin, Info } from "lucide-react";
import { useApp } from "@/lib/store";
import { Skeleton } from "@/components/kit";
import { pageHead } from "@/lib/page-head";

const MyFarmMap = lazy(() => import("@/components/MyFarmMap"));

export const Route = createFileRoute("/my-farm")({
  head: () =>
    pageHead(
      "KHETKOSAATHI — My Farm Location & Parcel Boundaries",
      "Locate your farm on the map, draw its boundary with Geoman, and save it for NASA Earth observation trend investigation."
    ),
  component: MyFarm,
});

function MyFarm() {
  const { t } = useApp();
  const fb = <Skeleton className="h-[calc(100dvh-20rem)] min-h-[420px] w-full rounded-2xl" />;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl border border-border bg-gradient-to-r from-card to-secondary/30 p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
            Cadastral Boundary Mapping
          </span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          {t("myFarm")}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
          {t("myFarmIntro")}
        </p>

        <div className="mt-4 pt-3 border-t border-border flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span>{t("resolutionNote")}</span>
        </div>
      </div>

      {/* Lazy Map Component */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm overflow-hidden">
        <ClientOnly fallback={fb}>
          <Suspense fallback={fb}>
            <MyFarmMap />
          </Suspense>
        </ClientOnly>
      </div>
    </div>
  );
}
