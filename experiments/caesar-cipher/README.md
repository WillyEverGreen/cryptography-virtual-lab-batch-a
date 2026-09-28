# Experiment 01: Caesar Cipher & Frequency Analysis

### Module Metadata
- **Experiment ID**: `caesar-cipher`
- **Sector**: Sector 01 — Classical Ciphers
- **Difficulty**: Novice
- **Authors**: Integration Architecture Team

---

### 1. Aim
To study and cryptanalyze the classical monoalphabetic Caesar shift cipher, understand modular arithmetic operations over finite character rings, and demonstrate susceptibility to brute-force and frequency analysis attacks.

### 2. Theoretical Formulation
- Encryption: `C = (P + K) mod 26`
- Decryption: `P = (C - K + 26) mod 26`
- Key Space: `|K| = 25` (excluding trivial identity shift K = 0)

### 3. Canonical Test Vectors
| Plaintext | Key (K) | Mode | Expected Ciphertext | Verified |
| :--- | :--- | :--- | :--- | :--- |
| `HELLO WORLD` | 3 | Encrypt | `KHOOR ZRUOG` | Yes |
| `KHOOR ZRUOG` | 3 | Decrypt | `HELLO WORLD` | Yes |
| `THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG` | 13 | Encrypt (ROT13) | `GRR DHVPX OEBJA SBK WHZCF BIRE GUR YNML QBT` | Yes |

### 4. Integration Verification
- [x] Conforms to 5-tab workstation layout (Aim, Procedure, Simulator, Analysis, Quiz).
- [x] Sandboxed within `experiments/caesar-cipher/`.
- [x] Zero external CDN dependencies.
- [x] Communicates with Master Shell via `LabBridge`.
- [x] Interactive responsive UI with input sanitization and reset controls.
