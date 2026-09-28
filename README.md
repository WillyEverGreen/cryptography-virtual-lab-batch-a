# Cryptography Virtual Laboratory 🔐

A unified, interactive virtual laboratory platform designed with a **Minimal White & Pitch-Black Neo-Terminal** design system. Built on a modular **Hub & Cartridge Architecture** where independent student groups build self-contained cryptographic experiments that plug into one cohesive platform.

---

## 👥 Batch A — Experiment Assignments (18 Students)

| Group | Topic / Algorithm | Sector | Assigned Members & Roll Numbers | Module Folder | Target Branch |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **01** | **MD5 Hash Algorithm** | Cryptographic Hash Functions | • **Nicole Dabre** (10717)<br>• **Alciya Dodti** (10722)<br>• **Larissa Dabreo** (10718)<br>• **Ruth Dmello** (10721) | [`experiments/md5/`](./experiments/md5/) | `exp/grp-01-md5` |
| **02** | **SHA-1 Hash Algorithm** | Cryptographic Hash Functions | • **Swar** (10713)<br>• **Tanush Chavan** (10710)<br>• **Aaron Deniz** (10719)<br>• **Asher** (10715) | [`experiments/sha1/`](./experiments/sha1/) | `exp/grp-02-sha1` |
| **03** | **Message Authentication Code (MAC)** | Message Authentication Codes | • **Aarna Chopdekar** (10712)<br>• **Slora Bar** (10708)<br>• **Arya Chavan** (10709)<br>• **Cajetan Dsouza** (10723) | [`experiments/mac/`](./experiments/mac/) | `exp/grp-03-mac` |
| **04** | **HMAC (Keyed-Hash Message Auth)** | Message Authentication Codes | • **Jadern Crasto** (10716)<br>• **Wendell Dsouza** (10724)<br>• **Rohit Ahir** (10706)<br>• **Shreyas Divekar** (10720) | [`experiments/hmac/`](./experiments/hmac/) | `exp/grp-04-hmac` |
| **05** | **SSL / TLS Handshake Protocol** | Secure Transport Protocols | • **Jace Jaison** (10711)<br>• **Ahamed Wafiq** (10705) | [`experiments/ssl-tls/`](./experiments/ssl-tls/) | `exp/grp-05-ssl-tls` |
| **Ref** | **Caesar Cipher & Frequency Analysis** | Reference Sector | • **Integration Architecture Team** | [`experiments/caesar-cipher/`](./experiments/caesar-cipher/) | `main` |

---

## 🛠️ Student Group Contribution Workflow

### 1. Checkout Your Group Branch
```bash
git clone https://github.com/WillyEverGreen/cryptography-virtual-lab-batch-a.git
cd cryptography-virtual-lab-batch-a

# Checkout your group's designated branch:
git checkout -b exp/grp-01-md5          # Group 1
git checkout -b exp/grp-02-sha1         # Group 2
git checkout -b exp/grp-03-mac          # Group 3
git checkout -b exp/grp-04-hmac         # Group 4
git checkout -b exp/grp-05-ssl-tls      # Group 5
```

### 2. Implement Your Module
Each group has a pre-configured cartridge in `experiments/<your-topic>/`. You will implement:
- **`script.js`**: Your cryptographic simulation logic & interactive state updates.
- **`index.html`**: The 5-tab workstation layout (Aim, Procedure, Simulator, Vectors, Quiz).
- **`style.css`**: Scoped styles for your visualizer.
- **`quiz.json`**: 3–5 concept evaluation MCQs.
- **Study Reference**: Review [`experiments/caesar-cipher/`](./experiments/caesar-cipher/) as the working baseline.

### 3. Run Automated Validation & Open PR
Before pushing, ensure your module passes all contract checks:
```bash
# Validate your module:
node tools/validate-experiment.js <your-module-id>

# Examples:
node tools/validate-experiment.js md5
node tools/validate-experiment.js sha1
node tools/validate-experiment.js mac
node tools/validate-experiment.js hmac
node tools/validate-experiment.js ssl-tls
```
When validation outputs `✔ PASS`, push your branch and open a Pull Request targeting `main`!

---

## ⚡ Quick Start & Local Preview

Run locally in your browser:
```bash
# Double click index.html or run:
npx serve .
```
- **World Map View**: `http://localhost:3000/#/`
- **Catalog View**: `http://localhost:3000/#/experiments`
- **Direct Module Test**: `http://localhost:3000/experiments/<module-id>/index.html`

---

## ⚠️ The 5 Golden Rules of Integration
1. **Strict Boundary**: ONLY touch files inside your assigned `experiments/<your-id>/` directory.
2. **Zero Modification of Core**: Do NOT modify `index.html`, `/core/`, or other groups' folders.
3. **No External CDNs**: All code, CSS, and fonts must run completely offline.
4. **No Global Pollution**: Use scoped functions and variables in `script.js`.
5. **Standard 5 Tabs**: Keep the 5 mandatory tabs (Aim/Theory, Procedure, Simulator, Analysis, Quiz).

---

## 📁 Repository Structure
```
cryptography-virtual-lab/
├── index.html                   # Master Shell & 2D World Map
├── core/                        # Platform Engine & Design System
│   ├── css/                     # Dual-mode tokens, components, shell styling
│   └── js/                      # Router, registry, bridge, icons, quiz engine
├── experiments/                 # All student experiment cartridges
│   ├── registry.json            # Master configuration directory
│   ├── caesar-cipher/           # Reference Implementation (Study this!)
│   ├── md5/                     # Group 01
│   ├── sha1/                    # Group 02
│   ├── mac/                     # Group 03
│   ├── hmac/                    # Group 04
│   └── ssl-tls/                 # Group 05
└── tools/
    ├── validate-experiment.js   # Automated contract linter
    └── server.js                # Lightweight local static server
```
