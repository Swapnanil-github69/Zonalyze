# Zonalyze 🌐📍

> **Objective Location Intelligence and Grounded Environmental Risk Debriefs**  
> An open-source, ₹0-cost location audit platform evaluating coordinates in real-time with zero hallucinations and zero vanity scores.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Map: MapLibre GL](https://img.shields.io/badge/Map-MapLibre%20GL%20(Carto%20Voyager)-green)](https://maplibre.org/)
[![Database: MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas%20(2dsphere)-brightgreen)](https://www.mongodb.com/)
[![AI: Google Gemma](https://img.shields.io/badge/AI-Google%20Gemma%204-orange)](https://aistudio.google.com/)

---

## 🎯 What is Zonalyze?

Unlike standard map tools or real-estate marketing websites, Zonalyze:
1. **Never calculates arbitrary scores** (No arbitrary "Livability: 78/100").
2. **Never allows AI hallucination**: The LLM functions strictly as a forensic auditor inspecting verified telemetry data.
3. **Anti-Rate-Limit Cache**: Before calling external APIs, it checks MongoDB for an investigation within **150 meters** generated in the past **7 days**.
4. **100% Free / Open Infrastructure**: Powered by MapLibre GL with Carto Voyager basemaps, Open-Meteo, OSM Nominatim, and OSM Overpass.

---

## 👥 Contributor Ownership & Work Division

This repository is split between 4 core team contributors:

| Contributor | Area | Focus & Responsibilities |
| :--- | :--- | :--- |
| **Backend Lead** | `apps/api` | Parallel Ingestion (Nominatim, Open-Meteo, Overpass), Haversine & Acoustic Noise proxy engine, Gemma structured debrief synthesis. |
| **Database Engineer** | `apps/api/src/models`, `db.ts` | MongoDB Atlas cluster, Mongoose `2dsphere` index, 7-day TTL index, `$near` geospatial caching service. |
| **Frontend Map Lead** | `apps/web/src/components/map` | MapLibre GL map view, Carto Voyager vector style, click listener, pin dropping, coordinate/address search geocoder. |
| **Frontend UI & Viz** | `apps/web/src/components/dossier` | Telemetry Radar Scanner loading animation, Slide-out Dossier Panel, 72h PM2.5 sparklines, Acoustic & Infrastructure cards. |

👉 **Read the full [ARCHITECTURE.md](ARCHITECTURE.md) for sequence diagrams, interface schemas, and technical specifications.**

---

## 🔑 Required API Keys & Credentials

Across the entire platform, only **ONE** API key and **ONE** database URI are required!

| Variable | Service | Tier / Cost | Where to Get |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API (`gemini-2.5-flash` or `gemini-1.5-flash`) | **Free Tier** | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `MONGODB_URI` | MongoDB Atlas Database | **Free (M0 Sandbox)** | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) |
| *No Key Required* | OSM Nominatim Reverse Geocoder | Free Open API | Requires custom `User-Agent` header |
| *No Key Required* | Open-Meteo Air Quality (PM2.5, PM10, AQI) | Free Open API | Public API endpoint |
| *No Key Required* | OSM Overpass 3000m Infrastructure Engine | Free Open API | Public Overpass interpreter |
| *No Key Required* | Carto Voyager Basemap (MapLibre GL) | Free Open Tiles | Public vector tile style |

---

## 🏗️ Repository Layout

```
Zonalyze/
├── ARCHITECTURE.md            # Complete architecture & API contracts
├── README.md                  # Project overview (this file)
├── package.json               # Monorepo workspaces
│
├── apps/
│   ├── api/                   # Express + TypeScript Backend
│   │   ├── src/
│   │   │   ├── controllers/   # Investigation route handlers
│   │   │   ├── models/        # Mongoose schema (2dsphere + TTL)
│   │   │   ├── services/      # Cache, Nominatim, OpenMeteo, Overpass, Noise, Gemini
│   │   │   └── utils/         # Math & Haversine helpers
│   │   └── .env.example
│   │
│   └── web/                   # React + Vite + Tailwind Frontend
│       ├── src/
│       │   ├── components/    # MapLibre GL & Dossier components
│       │   ├── hooks/         # Investigation state hook
│       │   └── types/         # TypeScript contracts
│       └── .env.example
```

---

## 🚀 Quickstart (Coming in Phase 1)

```bash
# Clone the repository
git clone https://github.com/Swapnanil-github69/Zonalyze.git
cd Zonalyze

# Install monorepo dependencies
npm install

# Start backend & frontend in development mode
npm run dev
```

---

## 📄 License
MIT License.
