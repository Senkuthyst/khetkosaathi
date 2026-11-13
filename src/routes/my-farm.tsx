import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { PageTitle, Skeleton } from "@/components/kit";
import { pageHead } from "@/lib/page-head";

const MyFarmMap = lazy(() => import("@/components/MyFarmMap"));

export const Route = createFileRoute("/my-farm")({
  head: () => pageHead("My Farm location", "Locate your farm on the map, draw its boundary, and save it for NASA environmental trend investigation."),
  component: MyFarm,
});

function MyFarm() {
  const { t } = useApp();
  const fb = <Skeleton className="h-[calc(100dvh-14rem)] min-h-[420px] w-full" />;
  return (
    <div>
      <PageTitle>{t("myFarm")}</PageTitle>
      <p className="mb-3 text-sm text-muted-foreground">{t("myFarmIntro")}</p>
      <ClientOnly fallback={fb}><Suspense fallback={fb}><MyFarmMap /></Suspense></ClientOnly>
    </div>
  );
}
