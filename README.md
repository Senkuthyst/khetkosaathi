# Khetkosaathi

Build a mobile-first web app called "Nepal Agricultural Intelligence Platform" using Next.js (App Router), Tailwind, shadcn/ui, Recharts and react-leaflet (OpenStreetMap tiles). It is a farmer-facing decision-support tool that combines weather, farm-station sensor data and satellite crop-health trends. Use realistic mock data for one pilot farm, kept in a separate data layer (/lib/data) so real APIs (NASA POWER, AppEEARS/Landsat/MODIS, MQTT station feed) can replace it later.



LANGUAGE & DESIGN

- Nepali by default, with an English toggle in the header. Keep all strings in a translation dictionary. Use the Noto Sans Devanagari font.

- Earthy green palette, large touch targets, simple icons, plain language. It must work well on cheap phones and slow connections: skeleton loaders, light pages, an offline banner, and a PWA manifest.

- Bottom tab navigation: Home, Crop Health, Weather Station, Alerts, Guidance.



ONBOARDING

- Pick a municipality (mock list), register a field (name, crop, planting date) and draw or select its boundary on a map. Crops: rice, maize, wheat, potato, tomato.



HOME

- A few simple cards: 7-day rainfall, temperature, humidity, soil-moisture trend, satellite vegetation trend, and upcoming crop-calendar reminders.

- EVERY card shows a source label (Farm station / NASA POWER / Landsat / MODIS), observation date, spatial scale, and a freshness badge (Fresh / Stale / Missing).



CROP HEALTH (Project 1)

- An interactive map showing field polygons coloured by vegetation status.

- An NDVI/EVI time-series chart with the field's seasonal baseline as a shaded band.

- A change-alert panel with the text: "Vegetation index decreased compared with this field's recent baseline; inspect the plot."

- Show data date, resolution (Landsat 30 m or MODIS ~250 m), cloud/quality flags and a confidence level.

- A field inspection log: add notes, upload a photo, and record an outcome (No issue / Problem found / Unsure).



WEATHER STATION (Project 2)

- Current readings for temperature, humidity, rainfall and soil moisture at a stated depth.

- Daily summaries and trend charts.

- A sensor-health panel: last seen, uptime %, battery %, signal strength, and a data-gap indicator.

- A comparison of farm readings against NASA POWER regional values, with a note that gridded data is context, not a replacement for on-site measurements.

- Configurable thresholds, e.g. low rainfall or soil moisture below a chosen value.



ALERTS

- A rules-based alert list with severity, source, and time. Users can edit thresholds.



GUIDANCE

- A library of reviewed guidance cards and crop-calendar reminders, each marked "Reviewed by [expert/institution]" with a source link.

- A "Report incorrect information" button on every card.



SAFEGUARDS (must be visible in the UI)

- A persistent note that satellite alerts are not diagnoses.

- No pesticide or fertiliser instructions anywhere.

- Clear visual separation between satellite estimates and field measurements.

- Show uncertainty and missing data honestly. Never imply yield prediction or disease diagnosis.



Make it polished, accessible, and ready to demo.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://khetkosaathi.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/873d4203-aa74-457e-b63b-2bde5ebc6ed7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
