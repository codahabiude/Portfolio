# Codah Abiude — Futuristic 3D Web & Full-Stack Portfolio

A high-efficiency, full-stack 3D portfolio web application built for **Codah Abiude** (Creative Technologist & Full-Stack Web Engineer based in Kenya).

## Key Features

- **Real-Time 3D Gyroscopic Core & Spatial Grid (`Three.js` / `WebGL 2`)**
  - Procedural 8-part 3D centerpiece (`THREE.Group`) with `RoomEnvironment` PMREM studio reflections, anodized metallic/carbon material contrast, instanced orbital beacon nodes (`InstancedMesh`), and a procedural spatial grid floor.
  - Hardware-adaptive software WebGL guard (`isSoftwareGl`) with `afterDraw` GPU fence pacing and zero per-frame garbage collection allocations.
  - Collapsible bottom-center **3D Scene Control Dock** (`H` shortcut) for adjusting core explosion (`0–100%`), orbit speed (`Paused` / `Orbit` / `Hyper`), lighting spectrum (`Auto` / `Emerald` / `Cobalt`), and wireframe lattice mode.
- **Full-Stack Express + Vite Backend (`server.ts`)**
  - `GET /api/portfolio`: Serves portfolio projects, services, and capability metrics from persistent server storage (`data/portfolio-store.json`).
  - `POST /api/projects/:id/view` & `POST /api/projects/:id/appreciate`: Persists real project view and appreciation counts atomically.
  - `POST /api/inquiries`: Validates, rate-limits, and stores client project requests, issuing a unique tracking reference ID (`REQ-2026-XXXXXX`).
  - `GET /api/inquiries/status/:refId`: Verifies inquiry receipt status without exposing sensitive submitter details.
- **Selected Works & Interactive Case Studies**
  - Filterable bento showcase featuring **Neon Architects**, **Void Data**, **Three.js Experiments**, and **Edge Commerce Core** with 3D pointer-tilt cards and case study modal inspection.
- **Direct Settlement Channels**
  - Built-in USDT/ETH wallet address with local procedural SVG QR graphic and one-click copy, plus M-Pesa / Mobile Money details with clipboard toast feedback.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Three.js, Lucide Icons
- **Backend**: Node.js, Express, `tsx`, atomic JSON file persistence (`data/portfolio-store.json`)
- **Typography**: `Chakra Petch`, `Plus Jakarta Sans`, `JetBrains Mono`

## Project Structure

```text
├── server.ts                          # Express API server & Vite middleware / static host
├── index.html                         # Entry HTML & Google Fonts
├── public/assets/aistudio/            # Portrait & CA emblem assets
├── src/
│   ├── App.tsx                        # Main portfolio experience & API integrations
│   ├── index.css                      # Tailwind v4 & typography tokens
│   ├── types/portfolio.ts             # Shared TypeScript interfaces
│   ├── assets/images/                 # Generated showcase artwork
│   └── components/
│       ├── ThreePortfolioScene.tsx    # Hardware-adaptive Three.js 3D viewport
│       ├── ControlDock.tsx            # Collapsible bottom-center 3D control dock
│       ├── Navbar.tsx                 # 3-zone top bar & mobile drawer
│       ├── ProjectCard.tsx            # 3D-tilt showcase card
│       ├── ProjectModal.tsx           # Interactive case study modal
│       └── CryptoQrCode.tsx           # Zero-dependency SVG QR matrix
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

