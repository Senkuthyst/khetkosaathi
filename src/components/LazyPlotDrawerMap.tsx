import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Skeleton } from "./kit";
import type { PlotDrawerMapProps } from "./PlotDrawerMap";

const PlotDrawerMapComponent = lazy(() => import("./PlotDrawerMap"));

export function LazyPlotDrawerMap(props: PlotDrawerMapProps) {
  return (
    <div
      style={{ height: props.height ?? 380 }}
      className="relative w-full rounded-2xl overflow-hidden border border-border"
    >
      <ClientOnly fallback={<Skeleton className="h-full w-full" />}>
        <Suspense fallback={<Skeleton className="h-full w-full" />}>
          <PlotDrawerMapComponent {...props} />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
