// Pure functions for FAO-56 Penman-Monteith Reference Evapotranspiration (ET0)
// and 14-day rolling water balance context (Precipitation minus ET0).
//
// Reference:
//   Allen, R.G., Pereira, L.S., Raes, D. and Smith, M. (1998).
//   "Crop evapotranspiration - Guidelines for computing crop water requirements"
//   FAO Irrigation and Drainage Paper No. 56. Food and Agriculture Organization of the United Nations.
//
// All wording strictly adheres to: "Water balance context", NEVER an irrigation recommendation.

export interface DailyEToInputs {
  latitude: number; // Degrees decimal (-90 to 90)
  date: string; // YYYY-MM-DD
  tMax: number | null; // Maximum air temperature at 2 m (°C)
  tMin: number | null; // Minimum air temperature at 2 m (°C)
  rhMean?: number | null; // Mean relative humidity at 2 m (%)
  rhMax?: number | null; // Optional: Maximum relative humidity at 2 m (%)
  rhMin?: number | null; // Optional: Minimum relative humidity at 2 m (%)
  solarRadiationMj: number | null; // ALLSKY_SFC_SW_DWN: Solar irradiance at surface (MJ/m²/day)
  windSpeed2mMps?: number | null; // WS2M: Wind speed measured at 2 m height (m/s)
  elevationM?: number; // Elevation above sea level (meters). Defaults to 100 m (Terai lowlands) if unknown.
  dayOfYearOverride?: number; // Optional: Force day of year (1-366) for testing standard benchmarks
}

/**
 * Compute FAO-56 Penman-Monteith reference evapotranspiration (ET0) for a single day.
 *
 * Steps and FAO-56 equations documented inline:
 *   1. Mean Temperature: T = (Tmax + Tmin) / 2
 *   2. Atmospheric Pressure: P = 101.3 * ((293 - 0.0065*z) / 293)^5.26 [Eq. 7]
 *   3. Psychrometric Constant: gamma = 0.000665 * P [Eq. 8]
 *   4. Saturation Vapour Pressure: es = (e°(Tmax) + e°(Tmin)) / 2 [Eq. 11, 12]
 *   5. Actual Vapour Pressure: ea from RHmax/RHmin or RHmean [Eq. 17, 19]
 *   6. Slope of Saturation Vapour Pressure Curve: delta [Eq. 13]
 *   7. Extraterrestrial Radiation: Ra from solar geometry [Eq. 21-25]
 *   8. Clear-Sky Radiation: Rso = (0.75 + 2e-5*z) * Ra [Eq. 37]
 *   9. Net Shortwave Radiation: Rns = (1 - 0.23) * Rs [Eq. 38] (albedo alpha = 0.23)
 *  10. Net Longwave Radiation: Rnl from Stefan-Boltzmann law and vapor/cloud factors [Eq. 39]
 *  11. Net Radiation: Rn = Rns - Rnl [Eq. 40]
 *  12. Soil Heat Flux: G = 0 for daily time steps [Eq. 42]
 *  13. Wind Speed: u2 at 2 m height (POWER WS2M is already at 2 m; default 2.0 m/s if missing)
 *  14. Penman-Monteith Equation: ET0 = (0.408*delta*(Rn - G) + gamma*(900/(T+273))*u2*(es - ea)) / (delta + gamma*(1 + 0.34*u2)) [Eq. 6]
 */
export function calculateDailyETo(inputs: DailyEToInputs): number | null {
  const {
    latitude,
    date,
    tMax,
    tMin,
    rhMean = null,
    rhMax = null,
    rhMin = null,
    solarRadiationMj,
    windSpeed2mMps = null,
    elevationM = 100, // Stated assumption: Terai agricultural elevation ~100m asl if not specified
    dayOfYearOverride,
  } = inputs;

  // Validate required inputs
  if (
    tMax === null ||
    tMin === null ||
    solarRadiationMj === null ||
    !Number.isFinite(tMax) ||
    !Number.isFinite(tMin) ||
    !Number.isFinite(solarRadiationMj) ||
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90
  ) {
    return null;
  }

  // At least one relative humidity measurement is required
  const hasRhRange =
    rhMax !== null && rhMin !== null && Number.isFinite(rhMax) && Number.isFinite(rhMin);
  const hasRhMean = rhMean !== null && Number.isFinite(rhMean);
  if (!hasRhRange && !hasRhMean) {
    return null;
  }

  // 1. Mean Temperature T (°C)
  const T = (tMax + tMin) / 2;

  // 2. Atmospheric Pressure P (kPa) [FAO-56 Eq. 7]
  const z = Math.max(0, elevationM);
  const P = 101.3 * Math.pow((293 - 0.0065 * z) / 293, 5.26);

  // 3. Psychrometric Constant gamma (kPa/°C) [FAO-56 Eq. 8]
  const gamma = 0.000665 * P;

  // 4. Saturation Vapour Pressure e°(T) (kPa) [FAO-56 Eq. 11, 12]
  const e0 = (t: number) => 0.6108 * Math.exp((17.27 * t) / (t + 237.3));
  const e0Max = e0(tMax);
  const e0Min = e0(tMin);
  const es = (e0Max + e0Min) / 2;

  // 5. Actual Vapour Pressure ea (kPa) [FAO-56 Eq. 17, 19]
  let ea: number;
  if (hasRhRange) {
    ea = (e0Min * (rhMax! / 100) + e0Max * (rhMin! / 100)) / 2;
  } else {
    ea = (rhMean! / 100) * es;
  }
  // Clamp actual vapour pressure to not exceed saturation
  ea = Math.min(es, Math.max(0.001, ea));

  // 6. Slope of Saturation Vapour Pressure Curve delta (kPa/°C) [FAO-56 Eq. 13]
  const delta = (4098 * (0.6108 * Math.exp((17.27 * T) / (T + 237.3)))) / Math.pow(T + 237.3, 2);

  // 7. Day of Year (J) and Solar Geometry [FAO-56 Eq. 21 - 25]
  let J = dayOfYearOverride;
  if (!J || J < 1 || J > 366) {
    const d = new Date(date + "T00:00:00Z");
    const startOfYear = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    J = Math.floor((d.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;
  }

  const phi = (latitude * Math.PI) / 180; // Latitude in radians [FAO-56 Eq. 22]
  const dr = 1 + 0.033 * Math.cos(((2 * Math.PI) / 365) * J); // Inverse relative distance Earth-Sun [FAO-56 Eq. 23]
  const deltaSolar = 0.409 * Math.sin(((2 * Math.PI) / 365) * J - 1.39); // Solar declination [FAO-56 Eq. 24]

  // Sunset hour angle [FAO-56 Eq. 25]
  const tanTerm = -Math.tan(phi) * Math.tan(deltaSolar);
  const clampedTanTerm = Math.max(-1, Math.min(1, tanTerm));
  const ws = Math.acos(clampedTanTerm);

  // Extraterrestrial Radiation Ra (MJ/m²/day) [FAO-56 Eq. 21]
  // Solar constant Gsc = 0.0820 MJ/m²/min; (24 * 60 / pi) * 0.0820 = 37.586 MJ/m²/day
  const Ra =
    ((24 * 60) / Math.PI) *
    0.082 *
    dr *
    (ws * Math.sin(phi) * Math.sin(deltaSolar) +
      Math.cos(phi) * Math.cos(deltaSolar) * Math.sin(ws));

  // 8. Clear-Sky Solar Radiation Rso (MJ/m²/day) [FAO-56 Eq. 37]
  const Rso = (0.75 + 2e-5 * z) * Ra;

  // 9. Net Shortwave Radiation Rns (MJ/m²/day) [FAO-56 Eq. 38]
  // Albedo alpha = 0.23 for reference grass crop
  const Rs = Math.max(0, solarRadiationMj);
  const Rns = (1 - 0.23) * Rs;

  // 10. Net Longwave Radiation Rnl (MJ/m²/day) [FAO-56 Eq. 39]
  // Stefan-Boltzmann constant sigma = 4.903e-9 MJ K⁻⁴ m⁻² day⁻¹
  const sigma = 4.903e-9;
  const TmaxK4 = Math.pow(tMax + 273.16, 4);
  const TminK4 = Math.pow(tMin + 273.16, 4);
  const meanTK4 = (TmaxK4 + TminK4) / 2;

  // Relative solar radiation Rs/Rso clamped to [0.3, 1.0] as recommended by FAO-56
  const relSolar = Rso > 0 ? Math.max(0.3, Math.min(1.0, Rs / Rso)) : 0.5;

  const Rnl = sigma * meanTK4 * (0.34 - 0.14 * Math.sqrt(ea)) * (1.35 * relSolar - 0.35);

  // 11. Net Radiation Rn (MJ/m²/day) [FAO-56 Eq. 40]
  const Rn = Rns - Rnl;

  // 12. Soil Heat Flux G = 0 for daily time step [FAO-56 Eq. 42]
  const G = 0;

  // 13. Wind Speed u2 at 2 m height (m/s)
  // Stated assumption: If wind is missing, use FAO-56 standard regional average of 2.0 m/s
  const u2 =
    windSpeed2mMps !== null && Number.isFinite(windSpeed2mMps) ? Math.max(0, windSpeed2mMps) : 2.0;

  // 14. FAO Penman-Monteith Equation [FAO-56 Eq. 6]
  const denominator = delta + gamma * (1 + 0.34 * u2);
  const radTerm = (0.408 * delta * (Rn - G)) / denominator;
  const aeroTerm = (gamma * (900 / (T + 273)) * u2 * (es - ea)) / denominator;

  const ETo = radTerm + aeroTerm;

  // Return non-negative reference evapotranspiration in mm/day, rounded to 2 decimal places
  return Math.max(0, Math.round(ETo * 100) / 100);
}

export interface DailyWaterBalanceRecord {
  date: string;
  rainMm: number | null; // Precipitation (PRECTOTCORR)
  et0Mm: number | null; // Calculated Penman-Monteith ET0
  netMm: number | null; // rainMm - et0Mm
}

export interface WaterBalance14DayResult {
  status: "success" | "missing";
  windowStart?: string;
  windowEnd?: string;
  totalRainfallMm?: number;
  totalEToMm?: number;
  rollingNetMm?: number; // Total Rainfall minus Total ET0 over the 14-day window
  climatologicalPercentile?: number | null; // Percentile relative to 15-year historical distribution
  historicalYearsCount?: number;
  dailyBreakdown?: DailyWaterBalanceRecord[];
  contextNote: string;
  reason?: string;
}

/**
 * Compute the 14-day rolling water balance (Rainfall minus ET0).
 * Compares current 14-day balance against the same calendar window across
 * historical years to evaluate atmospheric moisture supply vs evaporative demand.
 *
 * Safeguards: Pure observational context; never provides irrigation schedules or advice.
 */
export function calculate14DayWaterBalance(options: {
  latitude: number;
  dailyRecords: Array<{
    date: string; // YYYY-MM-DD
    t2mMax: number | null;
    t2mMin: number | null;
    rh2m: number | null;
    allskySfcSwDwn: number | null;
    ws2m: number | null;
    prectotcorr: number | null;
  }>;
  elevationM?: number;
  historicalWindowNetValues?: number[]; // Climatological 14-day Net (Rain - ET0) values from previous years
}): WaterBalance14DayResult {
  const { latitude, dailyRecords, elevationM, historicalWindowNetValues = [] } = options;

  const defaultNote =
    "Water balance context: Observational comparison of precipitation against atmospheric evaporative demand (ET₀). Not an irrigation schedule or recommendation.";

  if (!dailyRecords || dailyRecords.length === 0) {
    return {
      status: "missing",
      contextNote: defaultNote,
      reason: "No meteorological observations provided for water balance calculation.",
    };
  }

  // Sort chronologically ascending
  const sorted = [...dailyRecords].sort((a, b) => a.date.localeCompare(b.date));

  // Take the most recent 14-day window
  const windowDays = sorted.slice(-14);

  if (windowDays.length < 5) {
    return {
      status: "missing",
      contextNote: defaultNote,
      reason: `Insufficient observation days (${windowDays.length} days found, minimum 5 required for a meaningful 14-day rolling balance).`,
    };
  }

  let totalRain = 0;
  let totalET0 = 0;
  let validDaysCount = 0;
  const dailyBreakdown: DailyWaterBalanceRecord[] = [];

  for (const day of windowDays) {
    const et0 = calculateDailyETo({
      latitude,
      date: day.date,
      tMax: day.t2mMax,
      tMin: day.t2mMin,
      rhMean: day.rh2m,
      solarRadiationMj: day.allskySfcSwDwn,
      windSpeed2mMps: day.ws2m,
      elevationM,
    });

    const rain = day.prectotcorr;
    const net = rain !== null && et0 !== null ? Math.round((rain - et0) * 100) / 100 : null;

    dailyBreakdown.push({
      date: day.date,
      rainMm: rain !== null ? Math.round(rain * 10) / 10 : null,
      et0Mm: et0,
      netMm: net,
    });

    if (rain !== null && et0 !== null) {
      totalRain += rain;
      totalET0 += et0;
      validDaysCount++;
    }
  }

  if (validDaysCount === 0) {
    return {
      status: "missing",
      contextNote: defaultNote,
      reason:
        "All days in the 14-day evaluation window were missing solar, temperature, or rainfall records.",
    };
  }

  const roundedRain = Math.round(totalRain * 10) / 10;
  const roundedET0 = Math.round(totalET0 * 10) / 10;
  const rollingNet = Math.round((roundedRain - roundedET0) * 10) / 10;

  // Compute empirical percentile against historical distribution
  let climatologicalPercentile: number | null = null;
  if (historicalWindowNetValues.length >= 3) {
    const strictlyLower = historicalWindowNetValues.filter((v) => v < rollingNet).length;
    climatologicalPercentile = Math.round((strictlyLower / historicalWindowNetValues.length) * 100);
  }

  return {
    status: "success",
    windowStart: windowDays[0].date,
    windowEnd: windowDays[windowDays.length - 1].date,
    totalRainfallMm: roundedRain,
    totalEToMm: roundedET0,
    rollingNetMm: rollingNet,
    climatologicalPercentile,
    historicalYearsCount: historicalWindowNetValues.length,
    dailyBreakdown,
    contextNote: defaultNote,
  };
}
