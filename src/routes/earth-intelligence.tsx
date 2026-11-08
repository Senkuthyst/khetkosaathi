import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/kit";
import { useApp } from "@/lib/store";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/earth-intelligence")({
  head: () => pageHead("Earth Intelligence", "NASA Earth observation provenance and regional agricultural context for Chitwan, Nepal."),
  component: EarthIntelligence,
});

function EarthIntelligence() {
  const { t } = useApp();
  return <div className="space-y-4">
    <PageTitle>{t("earthIntelligence")}</PageTitle>
    <p className="text-sm font-semibold">{t("chitwanRegion")}</p>
    <p className="text-xs text-muted-foreground">{t("earthScope")}</p>
  </div>;
}