import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/kit";
export const Route = createFileRoute("/crop-health")({ component: () => <PageTitle>crop-health</PageTitle> });
