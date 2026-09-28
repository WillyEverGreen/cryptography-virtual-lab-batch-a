/**
 * ============================================================================
 * EXPERIMENT MODULE: CAESAR CIPHER & FREQUENCY ANALYSIS
 * Cryptographic logic, interactive workbench, and evaluation controller
 * ============================================================================
 */

(function () {
  'use strict';

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const ENGLISH_FREQ = {
    A: 8.2, B: 1.5, C: 2.8, D: 4.3, E: 12.7, F: 2.2, G: 2.0, H: 6.1, I: 7.0,
    J: 0.15, K: 0.77, L: 4.0, M: 2.4, N: 6.7, O: 7.5, P: 1.9, Q: 0.09, R: 6.0,
    S: 6.3, T: 9.1, U: 2.8, V: 0.98, W: 2.4, X: 0.15, Y: 2.0, Z: 0.07
  };

  // State
  let currentShift = 3;
  let currentMode = 'encrypt'; // 'encrypt' or 'decrypt'

  // DOM Elements
  const shiftInput = document.getElementById('shift-slider');
  const shiftValDisplay = document.getElementById('shift-val-display');
  const plainTextInput = document.getElementById('plaintext-input');
  const cipherTextOutput = document.getElementById('ciphertext-output');
  const ribbonPlain = document.getElementById('ribbon-plain');
  const ribbonCipher = document.getElementById('ribbon-cipher');
  const bruteForceGrid = document.getElementById('brute-force-grid');
  const freqChartContainer = document.getElementById('freq-chart-container');
  const testCaseSelect = document.getElementById('test-case-select');

  /**
   * Encrypt / Decrypt text using Caesar shift C = (P + K) mod 26
   */
  function transformText(text, shift, isDecrypt = false) {
    const effectiveShift = isDecrypt ? (26 - (shift % 26)) % 26 : shift % 26;
    let result = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const upper = char.toUpperCase();
      const idx = ALPHABET.indexOf(upper);

      if (idx !== -1) {
        const shiftedIdx = (idx + effectiveShift) % 26;
        const shiftedChar = ALPHABET[shiftedIdx];
        result += (char === upper) ? shiftedChar : shiftedChar.toLowerCase();
      } else {
        result += char; // Non-alphabetic characters remain untouched
      }
    }
    return result;
  }

  /**
   * Update the alphabet shift ribbon
   */
  function updateRibbon(shift) {
    if (!ribbonPlain || !ribbonCipher) return;
    ribbonPlain.innerHTML = '';
    ribbonCipher.innerHTML = '';

    for (let i = 0; i < 26; i++) {
      const plainChar = ALPHABET[i];
      const cipherChar = ALPHABET[(i + shift) % 26];

      const pCell = document.createElement('div');
      pCell.className = 'letter-cell';
      pCell.textContent = plainChar;
      ribbonPlain.appendChild(pCell);

      const cCell = document.createElement('div');
      cCell.className = 'letter-cell cipher';
      cCell.textContent = cipherChar;
      ribbonCipher.appendChild(cCell);
    }
  }

  /**
   * Run automated Brute-Force cracker across all 25 non-trivial shifts
   */
  function runBruteForce(cipherText) {
    if (!bruteForceGrid) return;
    bruteForceGrid.innerHTML = '';

    if (!cipherText || cipherText.trim().length === 0) {
      bruteForceGrid.innerHTML = '<div style="color:var(--text-muted); padding:8px;">[ Enter text in simulator to populate brute-force table ]</div>';
      return;
    }

    for (let k = 1; k < 26; k++) {
      const decrypted = transformText(cipherText, k, true);
      const row = document.createElement('div');
      row.className = 'brute-force-row';
      row.innerHTML = `
        <strong style="color: var(--cyber-cyan-dim);">K = ${k.toString().padStart(2, '0')}:</strong>
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(decrypted)}</span>
      `;
      bruteForceGrid.appendChild(row);
    }
  }

  /**
   * Calculate and render letter frequency histogram
   */
  function updateFrequencyChart(text) {
    if (!freqChartContainer) return;
    freqChartContainer.innerHTML = '';

    const counts = {};
    let totalLetters = 0;

    for (let i = 0; i < 26; i++) counts[ALPHABET[i]] = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i].toUpperCase();
      if (counts[char] !== undefined) {
        counts[char]++;
        totalLetters++;
      }
    }

    for (let i = 0; i < 26; i++) {
      const letter = ALPHABET[i];
      const count = counts[letter];
      const percent = totalLetters > 0 ? (count / totalLetters) * 100 : 0;
      const expected = ENGLISH_FREQ[letter] || 0;

      const barWrap = document.createElement('div');
      barWrap.className = 'freq-bar-wrapper';
      barWrap.title = `${letter}: ${percent.toFixed(1)}% (Standard English: ${expected}%)`;

      const bar = document.createElement('div');
      bar.className = 'freq-bar';
      // Scale height: max 20% = 100px
      const heightPx = Math.min(100, Math.round((percent / 15) * 90));
      bar.style.height = `${Math.max(2, heightPx)}px`;

      const label = document.createElement('span');
      label.className = 'freq-label';
      label.textContent = letter;

      barWrap.appendChild(bar);
      barWrap.appendChild(label);
      freqChartContainer.appendChild(barWrap);
    }
  }

  /**
   * Helper: Escape HTML
   */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Main recalculation trigger
   */
  function processSimulation() {
    const rawText = plainTextInput.value;
    const isDecrypt = currentMode === 'decrypt';
    const output = transformText(rawText, currentShift, isDecrypt);

    if (cipherTextOutput) {
      cipherTextOutput.value = output;
    }

    updateRibbon(currentShift);
    runBruteForce(output);
    updateFrequencyChart(rawText);

    // Notify shell through LabBridge if available
    if (window.LabBridge) {
      window.LabBridge.emitToParent('CRYPTO_LAB_STATE_CHANGE', {
        inputLength: rawText.length,
        shift: currentShift,
        mode: currentMode
      });
    }
  }

  /**
   * Load Standard Benchmark Test Vectors
   */
  function loadTestCase(testKey) {
    if (testKey === 'test-1') {
      plainTextInput.value = 'HELLO WORLD';
      currentShift = 3;
    } else if (testKey === 'test-2') {
      plainTextInput.value = 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG';
      currentShift = 13;
    } else if (testKey === 'test-3') {
      plainTextInput.value = 'CRYPTOGRAPHY VIRTUAL LAB';
      currentShift = 7;
    }

    shiftInput.value = currentShift;
    shiftValDisplay.textContent = currentShift;
    processSimulation();

    if (window.LabBridge) {
      window.LabBridge.emitToParent('CRYPTO_LAB_TEST_CASE_PASSED', { testKey });
    }
  }

  /**
   * Tab Navigation Logic
   */
  function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');

        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.classList.add('active');

        if (window.LabBridge) window.LabBridge.sound('click');
      });
    });
  }

  /**
   * Initialize Golden Experiment Module
   */
  function init() {
    initTabs();

    // Bind shift slider
    shiftInput?.addEventListener('input', (e) => {
      currentShift = parseInt(e.target.value, 10);
      shiftValDisplay.textContent = currentShift;
      processSimulation();
    });

    // Bind text input
    plainTextInput?.addEventListener('input', () => {
      processSimulation();
    });

    // Mode Toggle Buttons
    const btnEncrypt = document.getElementById('mode-encrypt-btn');
    const btnDecrypt = document.getElementById('mode-decrypt-btn');

    btnEncrypt?.addEventListener('click', () => {
      currentMode = 'encrypt';
      btnEncrypt.classList.add('primary');
      btnDecrypt.classList.remove('primary');
      processSimulation();
    });

    btnDecrypt?.addEventListener('click', () => {
      currentMode = 'decrypt';
      btnDecrypt.classList.add('primary');
      btnEncrypt.classList.remove('primary');
      processSimulation();
    });

    // Reset Button
    document.getElementById('sim-reset-btn')?.addEventListener('click', () => {
      plainTextInput.value = 'CRYPTOGRAPHY VIRTUAL LAB';
      currentShift = 3;
      shiftInput.value = 3;
      shiftValDisplay.textContent = '3';
      currentMode = 'encrypt';
      btnEncrypt.classList.add('primary');
      btnDecrypt.classList.remove('primary');
      processSimulation();
    });

    // Test Case Selector
    testCaseSelect?.addEventListener('change', (e) => {
      loadTestCase(e.target.value);
    });

    // Copy Output Button
    document.getElementById('copy-output-btn')?.addEventListener('click', () => {
      if (cipherTextOutput && cipherTextOutput.value) {
        navigator.clipboard.writeText(cipherTextOutput.value);
        const originalText = document.getElementById('copy-output-btn').textContent;
        document.getElementById('copy-output-btn').textContent = 'COPIED!';
        setTimeout(() => {
          document.getElementById('copy-output-btn').textContent = originalText;
        }, 1200);
      }
    });

    // Load Quiz via universal Quiz Engine
    fetch('quiz.json')
      .then(res => res.json())
      .then(questions => {
        const quizContainer = document.getElementById('quiz-mount');
        if (quizContainer && window.LabQuizEngine) {
          window.LabQuizEngine.mount(quizContainer, questions, { experimentId: 'caesar-cipher' });
        }
      })
      .catch(err => console.warn('Could not load quiz.json', err));

    // Initial run
    processSimulation();

    // Signal to parent shell
    if (window.LabBridge) {
      window.LabBridge.notifyReady('caesar-cipher');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
