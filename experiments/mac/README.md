# Experiment: Message Authentication Code (MAC)

### Group Assignment
- **Sector**: Sector 02 — Message Authentication Codes
- **Assigned Members**:
  1. Aarna Chopdekar (Roll No: 10712)
  2. Slora Bar (Roll No: 10708)
  3. Arya Chavan (Roll No: 10709)
  4. Cajetan Dsouza (Roll No: 10723)

---

### Group Verification Checklist
- [x] Pre-populated `experiment.json` with all 5 student names and roll numbers.
- [x] Standard 5-tab workstation layout (Aim, Procedure, Simulator, Vectors, Quiz).
- [x] CBC-MAC theory, objectives, procedure, security observations, and references.
- [x] Interactive channel tampering simulation with receiver-side tag verification.
- [x] Intermediate block-by-block CBC-MAC trace and deterministic test vectors.
- [x] 5 conceptual evaluation questions in `quiz.json`.
- [x] Offline-compatible implementation using the browser Web Crypto API.

### Implementation Notes

The simulator uses 16-byte AES blocks, UTF-8 input, a 16-byte normalized key, an all-zero initial chaining value, and zero-padding for the final message block. It is an educational fixed-length CBC-MAC demonstration; variable-length production protocols should use CMAC or another construction designed for that setting.
