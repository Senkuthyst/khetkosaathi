import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/kit";
export const Route = createFileRoute("/alerts")({ component: () => <PageTitle>alerts</PageTitle> });
