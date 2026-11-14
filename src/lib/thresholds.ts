import * as zod from "zod";
const z = (zod as any).z ?? zod;

export const thresholdSchema = z.object({
  minRain7: z.number().min(0).max(500),
  minSoil: z.number().min(0).max(100),
  maxTemp: z.number().min(-20).max(60),
  minBattery: z.number().min(0).max(100),
});