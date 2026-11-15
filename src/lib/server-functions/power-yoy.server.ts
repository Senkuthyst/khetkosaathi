// Server-side wrapper for NASA POWER Year-Over-Year rainfall comparison.
// Runs fetch() from the server so CORS restrictions do not apply to the browser.
// Never silently swallows failures: logs and returns null so the client shows
// an honest "data unavailable" state.

import { createServerFn } from "@tanstack/react-start";
import * as zod from "zod";
const z = (zod as any).z ?? zod;
import {
  fetchPowerRainfallYearOverYear,
  type YearOverYearRainfallResult,
} from "@/lib/data/nasa-power-yoy";

const powerYoYSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  fieldId: z.string().optional().default("farm-check"),
  windowDays: z.number().int().min(1).max(60).optional().default(14),
});

export type PowerYoYInput = z.infer<typeof powerYoYSchema>;

export const fetchPowerRainfallYoYServerFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => powerYoYSchema.parse(data))
  .handler(async ({ data }): Promise<YearOverYearRainfallResult | null> => {
    try {
      const result = await fetchPowerRainfallYearOverYear({
        latitude: data.latitude,
        longitude: data.longitude,
        fieldId: data.fieldId,
        windowDays: data.windowDays,
      });
      return result;
    } catch (err) {
      console.error("[power-yoy.server] NASA POWER YoY fetch failed:", err);
      return null;
    }
  });
