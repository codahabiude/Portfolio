# Codah Abiude — Futuristic 3D Web & Full-Stack Portfolio

A high-efficiency, full-stack 3D portfolio web application built for **Codah Abiude** (Creative Technologist & Full-Stack Web Engineer based in Kenya).

## Key Features

- **Real-Time 3D `CA` Logo Sphere & Spatial Grid (`Three.js` / `WebGL 2`)**
  - Procedural 3D rotating logo globe featuring extruded beveled emerald `C`, brushed-chrome `A` with spear crossbar, tri-color logo arcs, and a `"CODAH ABIUDE"` orbital nameplate band & plaques (`RoomEnvironment` PMREM reflections + 24 instanced emerald/blue beacon nodes).
  - Hardware-adaptive software WebGL guard (`isSoftwareGl`) with `afterDraw` GPU fence pacing and zero per-frame garbage collection allocations.
  - Automatic section-reactive camera choreography, pointer parallax, and dynamic lighting spectrum transitions.
- **Full-Stack Express + Vite Backend (`server.ts`)**
  - `GET /api/portfolio`: Serves portfolio projects, services, and capability metrics from persistent server storage (`data/portfolio-store.json`).
  - `POST /api/projects/:id/view` & `POST /api/projects/:id/appreciate`: Persists real project view and appreciation counts atomically.
  - `POST /api/inquiries`: Validates, rate-limits, and stores client project requests, issuing a unique tracking reference ID (`REQ-2026-XXXXXX`).
  - `GET /api/inquiries/status/:refId`: Verifies inquiry receipt status without exposing sensitive submitter details.
- **Selected Works & Live GitHub Sync (`github.com/codahabiude`)**
  - Filterable showcase powered directly by Codah Abiude's public GitHub repositories (**Nakoyonjo Admin System**, **LanVox**, and **3D Web Portfolio**), synchronized via `GET /api/portfolio?sync=1` with 3D pointer-tilt cards, source links, and interactive case study modal inspection.
  - Interactive **GitHub Contribution Heatmap** (`GET /api/github/contributions` & `GitHubContributionHeatmap.tsx`) displaying `@codahabiude`'s live 53-week commit calendar, streak metrics, day-by-day activity inspector, and intensity-level filtering inside the About section.
- **Personal Collaboration, Smart-Art Workflow & Visual Brand Logos**
  - Interactive 4-stage Smart-Art architectural workflow diagram (`ArchitectureSmartArt.tsx`), vector technology stack marks, and direct social/contact logos (GitHub, LinkedIn, X `@CodahAbiude`, Instagram, Facebook, `codahabiude@gmail.com`).

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Three.js, Lucide Icons
- **Backend**: Node.js, Express, `tsx`, atomic JSON file persistence (`data/portfolio-store.json`)
- **Typography**: `Chakra Petch`, `Plus Jakarta Sans`, `JetBrains Mono`

## Project Structure

```text
├── server.ts                          # Express API server & Vite middleware / static host
├── index.html                         # Entry HTML & Google Fonts
├── public/assets/                     # Portrait, crisp vector CA favicon SVG, and brand assets
├── src/
│   ├── App.tsx                        # Main portfolio experience & API integrations
│   ├── index.css                      # Tailwind v4 & typography tokens
│   ├── types/portfolio.ts             # Shared TypeScript interfaces
│   ├── assets/images/                 # Generated showcase artwork
│   └── components/
│       ├── ThreePortfolioScene.tsx       # Hardware-adaptive Three.js 3D CA logo sphere viewport
│       ├── GitHubContributionHeatmap.tsx # Live interactive @codahabiude GitHub activity heatmap
│       ├── ArchitectureSmartArt.tsx      # Interactive 4-stage Smart-Art schematic & stack logos
│       ├── BrandMarks.tsx                # Vector CA brand logos, social marks & tech stack SVGs
│       ├── Navbar.tsx                    # 3-zone top bar & mobile drawer
│       ├── ProjectCard.tsx               # 3D-tilt showcase card
│       └── ProjectModal.tsx              # Interactive case study modal
└── data/                              # Auto-created JSON persistence store
```

## Running Locally

```bash
# Install dependencies
npm install

# Run full-stack dev server (Express + Vite on port 3000)
npm run dev

# Typecheck and production build
npm run lint
npm run build

# Run production server
NODE_ENV=production npm start
```

## Pushing to GitHub

```bash
git init
git add .
git commit -m "Initial 3D full-stack portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/portfolio.git
git push -u origin main
```

