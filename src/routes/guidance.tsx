import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/kit";
export const Route = createFileRoute("/guidance")({ component: () => <PageTitle>guidance</PageTitle> });
