/**
 * ============================================================================
 * EXPERIMENT: SHA-1 HASH ALGORITHM (STARTER TEMPLATE)
 * Assigned Group:
 *   - Swar (10713)
 *   - Tanush Chavan (10710)
 *   - Aaron Deniz (10719)
 *   - Asher (10715)
 * ============================================================================
 */

(function () {
  'use strict';

  // 1. Tab Switching Controller (Pre-built — Do not modify)
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

  // 2. Group TODO: Implement SHA-1 simulation logic below
  function runSHA1Simulation() {
    const inputVal = document.getElementById('sha1-input')?.value || '';
    const outputEl = document.getElementById('sha1-digest');

    // TODO [Group 2]:
    // 1. Pad message to multiple of 512 bits with length appending.
    // 2. Expand 16 words into 80 words: W[0..79].
    // 3. Process 80 rounds across 5 chaining variables: A, B, C, D, E.
    // 4. Output the 160-bit hexadecimal message digest.

    // Placeholder until your team implements the algorithm:
    const placeholderDigest = `[TODO: Group 2 implements SHA-1 for "${inputVal}"]`;
    if (outputEl) outputEl.value = placeholderDigest;

    if (window.LabBridge) {
      window.LabBridge.emitToParent('CRYPTO_LAB_STATE_CHANGE', {
        inputLength: inputVal.length
      });
    }
  }

  // 3. Setup and Event Listeners
  function init() {
    initTabs();

    const inputField = document.getElementById('sha1-input');
    inputField?.addEventListener('input', runSHA1Simulation);

    document.getElementById('sha1-reset-btn')?.addEventListener('click', () => {
      if (inputField) inputField.value = 'abc';
      runSHA1Simulation();
    });

    // Auto-mount quiz from quiz.json (Pre-built)
    fetch('quiz.json')
      .then(res => res.json())
      .then(q => {
        if (window.LabQuizEngine) {
          window.LabQuizEngine.mount(document.getElementById('quiz-mount'), q, { experimentId: 'sha1' });
        }
      })
      .catch(err => console.warn('Could not load quiz.json', err));

    runSHA1Simulation();

    if (window.LabBridge) window.LabBridge.notifyReady('sha1');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
