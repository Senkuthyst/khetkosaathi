import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { FarmCheckFlow } from "@/components/FarmCheckFlow";

export const Route = createFileRoute("/farm-check")({
  head: () =>
    pageHead(
      "KHETKOSAATHI — Farm Check (खेत जाँच)",
      "Instant mobile farm check: 30m NASA satellite greenness, year-over-year rainfall comparison, and suitable crops for your land.",
    ),
  component: FarmCheckPage,
});

function FarmCheckPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <FarmCheckFlow />
    </div>
  );
}
