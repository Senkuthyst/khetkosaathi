import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/kit";
export const Route = createFileRoute("/weather")({ component: () => <PageTitle>weather</PageTitle> });
