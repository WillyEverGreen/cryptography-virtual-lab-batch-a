# Cryptography Virtual Laboratory 🔐

A unified, interactive virtual laboratory platform designed with a **Minimal White & Neo-Pixel Cyber Terminal** aesthetic. Built on a modular **Hub & Cartridge Architecture** where individual student groups build self-contained cryptographic experiments that plug into one cohesive system.

---

## ⚡ Quick Start

### 1. View the Platform Locally
Double click `index.html` in your browser, or run a local server:
```bash
npx serve .
```

### 2. Validate Any Experiment Module
Run the automated contract validator:
```bash
npm test
# Or test a specific experiment:
node tools/validate-experiment.js caesar-cipher
```

---

## 🏗️ Architecture: Hub & Cartridge

- **The Master Shell (`index.html`, `/core`)**:
  - Main HUD Navigation, 2D Sector World Map, and Experiment Catalog.
  - SPA Hash Router (`#/`, `#/experiments`, `#/experiment/:id`, `#/instructions`, `#/about`).
  - Web Audio API synthesizer for 8-bit sound effects (no external MP3s).
  - Universal Quiz Engine and LocalStorage progress tracking.
- **Experiment Modules (`/experiments/<id>/`)**:
  - Sandboxed inside the Cyber-Deck Viewport with zero CSS/JS collision.
  - Standard 5-tab workstation layout:
    1. Aim & Theory
    2. Procedure
    3. Interactive Simulator
    4. Observations & Canonical Vectors
    5. Quiz & Evaluation
  - Communicates with the shell via `LabBridge`.

---

## 👥 Student Group Guide

1. Clone or branch off: `git checkout -b exp/grp-XX-<algorithm>`
2. Duplicate `experiments/_template/` to `experiments/<your-algorithm>/`
3. Edit `experiment.json`, `index.html`, `script.js`, and `quiz.json`.
4. Validate with: `node tools/validate-experiment.js <your-algorithm>`
5. Submit PR to `staging` branch using the PR checklist.

---

## 📁 Repository Structure
```
crypto-virtual-lab/
├── index.html                   # Master Platform Shell & HUD
├── core/                        # Platform Engine & Design System
│   ├── css/                     # Tokens, components, shell, retro styling
│   └── js/                      # Router, registry, bridge, audio, quiz engine
├── experiments/                 # All student experiment cartridges
│   ├── registry.json            # Master configuration directory
│   ├── _template/               # Starter template for new groups
│   └── caesar-cipher/           # Golden Reference Experiment
└── tools/
    └── validate-experiment.js   # Automated contract linter
```
