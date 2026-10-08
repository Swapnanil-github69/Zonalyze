# Zonalyze 🌐📍
### Objective Location Intelligence & Grounded Environmental Risk Debriefs

---

## 📌 Executive Summary

**Zonalyze** is an open-source, **₹0-cost** geospatial location intelligence and environmental risk debrief platform. It allows researchers, prospective homebuyers, urban planners, and civic investigators to drop a pin anywhere on Earth or search any address and receive an objective, forensic location dossier in real time.

Unlike standard real-estate marketing websites that invent arbitrary "livability scores" (e.g., *"Livability: 82/100"*) or generic AI assistants that hallucinate nearby amenities, Zonalyze is anchored in **hard physical telemetry, deterministic mathematical models, and grounded forensic AI synthesis**.

---

## 🚩 The Problem It Solves

1. **Arbitrary & Biased Livability Scores:**
   Most property and neighborhood portals display opaque, unscientific composite scores designed to sell properties rather than inform citizens. They rarely reveal the raw data or methodology behind their claims.

2. **LLM Hallucinations in Spatial Data:**
   General-purpose AI chat assistants routinely hallucinate amenities, proximity to transit, hospital distances, and environmental conditions when asked about specific coordinates.

3. **Prohibitive Geospatial Infrastructure Costs:**
   Traditional spatial intelligence tools require expensive commercial API keys (Google Maps Platform, Mapbox vector tokens, premium weather feeds), making independent civic auditing financially inaccessible.

---

## 💡 The Zonalyze Solution & Core Invariants

Zonalyze is engineered around **four non-negotiable core invariants**:

1. **Zero Hallucination Guarantee:**
   The artificial intelligence engine (**Google Gemma**) operates strictly as a forensic auditor inspecting verified telemetry data. It is bounded by a rigid JSON schema and prompt constraint: it is forbidden from inventing facilities, distances, or measurements.

2. **No Arbitrary Composite Scores:**
   Every metric in Zonalyze is derived directly from empirical sensor feeds, OpenStreetMap geometry, or transparent mathematical physics formulas.

3. **Anti-Rate-Limit Geospatial Cache:**
   Before querying any external API, the backend checks MongoDB Atlas for an audit generated within **150 meters** during the past **7 days** using a geospatial `2dsphere` index and automatic TTL expiration. Cache hits resolve in under **50 milliseconds**.

4. **100% Free / Open Infrastructure (₹0 Running Cost):**
   Powered by MapLibre GL with Carto Voyager basemaps, Open-Meteo, OpenStreetMap Nominatim, OpenStreetMap Overpass Turbo, MongoDB Atlas Free Tier, and Google Gemma via Google AI Studio. **Only one single API key** is needed across the entire platform.

---

## 🛠️ Key Platform Features

### 1. Interactive Geospatial Workspace
- **High-Performance Vector Map:** Powered by **MapLibre GL JS** using Carto Voyager vector tiles—completely free and open-source with zero Mapbox tokens.
- **Pinpoint Coordinate Drop:** Click anywhere on the map to drop a target pin and trigger an automated site investigation.
- **Forward Geocoding Search:** Search addresses, landmarks, or neighborhoods with real-time autocompletion.
- **Radar Scanner HUD Animation:** Tactical scanning ring visualization tracking coordinates during multi-stage telemetry ingestion (`checking_cache` $\to$ `ingesting_telemetry` $\to$ `computing_heuristics` $\to$ `synthesizing_ai`).
- **URL Synchronization:** Deep-link sharing via URL hash (`#investigate?lat=28.6139&lon=77.2090`), allowing instant reloading of audited sites.

### 2. Environmental & Atmospheric Telemetry
- **Real-Time Air Quality Indices:** Live measurements of PM2.5 ($\mu\text{g/m}^3$), PM10 ($\mu\text{g/m}^3$), and European AQI sourced from Open-Meteo.
- **72-Hour Historical Sparklines:** Trend visualization showing fine particulate variation over the past three days to detect sustained pollution events.
- **WHO Threshold Benchmarks:** Immediate categorization against international health safety baselines.

### 3. Acoustic Noise Physics Engine
- **Deterministic Attenuation Model:** Instead of subjective guesses, noise exposure is calculated using the acoustic distance attenuation law:
  $$L = L_0 - 20 \log_{10}\left(\frac{d}{d_0}\right)$$
- **Transit Corridor Analysis:** Measures proximity to arterial roadways ($L_0 = 75\text{ dBA}$ at $10\text{m}$) and railway tracks ($L_0 = 85\text{ dBA}$ at $15\text{m}$).
- **Exposure Brackets:** Categorizes sites into *Elevated ($\ge 65\text{ dBA}$)*, *Moderate ($50-65\text{ dBA}$)*, or *Low/Ambient ($< 50\text{ dBA}$)* with geometry verification confidence.

### 4. Civic Infrastructure & Facility Proximity
- **3,000-Meter Batch Geocoding:** Overpass Turbo query scanning for essential civic nodes:
  - Hospitals & emergency healthcare
  - Pharmacies & dispensaries
  - Transit stops, metro stations & railway hubs
  - Educational institutions (schools, colleges)
  - Public parks & recreational green spaces
- **Exact Haversine Distance Calculations:** Precise spherical trigonometric measurements to the nearest facility of every type.
- **Indian Airport Proximity Index:** Built-in geodetic database calculating distance to major Indian civil and defense aerodromes.
- **Interactive Routing Modal:** Select any facility to calculate turn-by-turn walking or driving routes with real-time travel duration estimates.

### 5. Grounded AI Forensic Debrief
- **Empirical Observations:** Bulleted analytical debrief synthesizing acoustic, atmospheric, and transit telemetry.
- **Site Inspection Checklist:** Concrete, actionable physical inspection targets for on-site surveyors (e.g., *"Inspect double-glazing acoustic insulation on north facade"*, *"Verify HVAC filter density against elevated PM2.5 load"*).
- **Interactive Location Chat Widget:** Grounded conversational assistant enabling users to ask specific questions about the audited site without hallucinated answers.

### 6. Multilingual Natural Audio Debrief Player
- **Neural Voice Synthesis:** Audio debrief player built on the Web Speech API.
- **Multi-Language Support:** Listen to the forensic debrief in **English**, **Hindi**, or **Bengali** with play, pause, seek, and language-switching controls.

### 7. Dual-Aesthetic Visual Design System
- **Literary Journal Mode ("General Intelligence Company"):**
  A warm, archival scientific publication aesthetic featuring parchment tones (`#fefffc`), cerulean accents (`#41a1cf`), and classical editorial typography.
- **Dark Console Mode ("San Rita Tactical"):**
  A high-tech command center aesthetic featuring carbon-ink surfaces (`#161b13`), highlighter mint accents (`#e2ffcc`), CRT scanline effects, and topographic grid backdrops.

---

## 🏗️ System Architecture & Data Pipeline

```
[User Pin Drop / Search]
         │
         ▼
[Frontend: React + MapLibre GL]
         │  POST /api/investigate { lat, lon }
         ▼
[Backend: Express + Node.js]
         │
         ├───► [MongoDB Atlas: 2dsphere Cache Check]
         │          │
         │          ├── (Found within 150m & < 7 days old)
         │          │      └─► Return Cached Dossier (⚡ < 50ms)
         │          │
         │          └── (Cache Miss)
         │                 │
         │                 ▼
         │        [Parallel Ingestion]
         │        ├── OpenStreetMap Nominatim ──► Address Resolution
         │        ├── Open-Meteo Air Quality   ──► Live & 72h PM2.5/PM10
         │        └── OSM Overpass (3000m)     ──► Hospitals, Transit, Rail, Roads
         │                 │
         │                 ▼
         │        [Heuristic & Physics Calculations]
         │        ├── Haversine Spherical Distances
         │        └── Acoustic Noise Attenuation Formula
         │                 │
         │                 ▼
         │        [Google Gemma AI Synthesis]
         │        └── Strict JSON Schema Forensic Debrief
         │                 │
         │                 ▼
         │        [MongoDB Atlas: Save with 7-Day TTL Index]
         │                 │
         ▼                 ▼
[Complete Forensic Location Dossier Rendered in Web UI]
```

---

## 💻 Complete Technology Stack

### Frontend Architecture
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `18.3.1` | Declarative component UI and state management |
| **TypeScript** | `5.7.2` | Strict type safety across contracts and component props |
| **Vite** | `6.0.3` | Ultra-fast development server and optimized build tooling |
| **MapLibre GL JS** | `4.7.1` | Open-source WebGL vector map rendering |
| **Carto Voyager** | Free CDN | High-resolution vector map tiles ($0 cost, no token) |
| **Tailwind CSS** | `3.4.17` | Responsive utility-first design system |
| **Lucide React** | `0.468.0` | Minimalist SVG iconography |
| **Axios** | `1.7.9` | Client-to-server API communication |
| **Web Speech API** | Native | In-browser multilingual speech playback (EN / HI / BN) |

### Backend Architecture
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `>= 20.x` | Server-side JavaScript runtime |
| **Express** | `4.21.2` | RESTful API server routing and middleware |
| **TypeScript** | `5.7.2` | End-to-end typed interfaces and data contracts |
| **tsx** | `4.19.2` | Zero-configuration dev execution with live reload |
| **Mongoose** | `8.9.2` | MongoDB object modeling and geospatial query support |
| **@google/genai** | `2.27.0` | Google Gemma LLM integration with structured schema |
| **dotenv** | `16.4.7` | Environment configuration management |
| **cors** | `2.8.5` | Cross-Origin Resource Sharing security |

### Database & Storage
| Technology | Details | Purpose |
| :--- | :--- | :--- |
| **MongoDB Atlas** | `M0 Free Tier` | Cloud-hosted NoSQL document database |
| **`2dsphere` Index** | GeoJSON Point | Spherical `$near` queries within 150m radius |
| **TTL Index** | `expires: 7d` | Automatic database self-cleaning after 7 days |

### External APIs & Data Providers
| Provider | Cost / Tier | Data Provided |
| :--- | :--- | :--- |
| **Google AI Studio** | Free Tier | Google Gemma LLM for forensic synthesis (`GEMINI_API_KEY`) |
| **Open-Meteo** | Free Public API | Real-time & 72h historical PM2.5, PM10, AQI |
| **OSM Nominatim** | Free Public API | Reverse & forward geocoding with custom User-Agent |
| **OSM Overpass** | Free Public API | 3,000-meter batch infrastructure & transit queries |
| **CartoCDN** | Free Open Tiles | Vector tile basemap stylesheet |

---

## 📁 Repository Structure

```
Zonalyze/
├── ARCHITECTURE.md            # In-depth architectural specification & sequence flows
├── README.md                  # Project overview & contributor division
├── description.md             # Complete project description (this file)
├── package.json               # Monorepo workspaces configuration
├── tsconfig.base.json         # Shared TypeScript compiler settings
│
├── apps/
│   ├── api/                   # Backend Express & Data Engine
│   │   ├── src/
│   │   │   ├── config/        # MongoDB connection lifecycle
│   │   │   ├── controllers/   # Investigation & chat endpoints
│   │   │   ├── models/        # Investigation Mongoose schema (2dsphere + TTL)
│   │   │   ├── routes/        # Express API route declarations
│   │   │   ├── services/      # Nominatim, Open-Meteo, Overpass, Noise, Gemma
│   │   │   └── utils/         # Haversine distance & geodetic math
│   │   ├── package.json
│   │   └── .env.example
│   │
│   └── web/                   # Frontend React & Map Application
│       ├── public/            # Favicon assets & field photography
│       ├── src/
│       │   ├── api/           # Frontend API client
│       │   ├── components/
│       │   │   ├── common/    # RadarScanner HUD & error boundaries
│       │   │   ├── dossier/   # AirQuality, Noise, Infrastructure, Gemma report, Chat
│       │   │   ├── landing/   # 9-section editorial landing page & theme toggle
│       │   │   └── map/       # MapLibre GL map canvas & geocoding search bar
│       │   ├── context/       # Dual-mode theme provider (Literary vs Dark Console)
│       │   ├── data/          # Indian airport geodetic records
│       │   ├── hooks/         # useInvestigation state orchestration hook
│       │   ├── pages/         # LandingPage & InvestigationMapPage
│       │   ├── services/      # OSRM street route service
│       │   ├── types/         # Shared TypeScript domain models
│       │   └── utils/         # Natural speech synthesizer & livability metrics
│       ├── index.html         # HTML entry point with brand favicon
│       ├── tailwind.config.js # Custom design tokens & palette
│       └── package.json
```

---

## ⚡ Quickstart Guide

### Prerequisites
- Node.js `>= 18.0.0`
- npm `>= 9.0.0`
- MongoDB Atlas free sandbox URI (or local MongoDB)
- Google AI Studio API Key (Free Tier)

### 1. Clone the Repository
```bash
git clone https://github.com/Swapnanil-github69/Zonalyze.git
cd Zonalyze
```

### 2. Install Monorepo Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
In `apps/api/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/zonalyze?retryWrites=true&w=majority
GEMINI_API_KEY=your_google_ai_studio_api_key_here
```

In `apps/web/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run Development Servers
```bash
npm run dev
```
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`

---

## 🏆 Project Highlights & Hackathon Merits

1. **Production-Ready ₹0 Cost Architecture:** Built with completely free, high-availability public APIs and open-source vector map tooling, eliminating massive cloud and mapping bills.
2. **True Multidisciplinary Engineering:** Combines geospatial indexing, spherical trigonometry, physics-based acoustic attenuation, open sensor ingestion, and modern LLM orchestration.
3. **Dual-Mode Visual Excellence:** Seamlessly bridges two distinct high-polish design systems: a classical archival Literary Journal and a tactical Dark Console.
4. **Anti-Hallucination Guardrails:** Demonstrates how generative AI can be securely constrained to act as an analytical debriefing tool rather than an ungrounded guesser.
5. **Real Civic Utility:** Provides tangible, transparent value for citizens, home buyers, environmentalists, and researchers evaluating real-world physical locations.
