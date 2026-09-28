/**
 * ============================================================================
 * EXPERIMENT: MD5 HASH ALGORITHM (STARTER TEMPLATE)
 * Assigned Group:
 *   - Nicole Dabre (10717)
 *   - Alciya Dodti (10722)
 *   - Larissa Dabreo (10718)
 *   - Ruth Dmello (10721)
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

  // 2. Group TODO: Implement MD5 simulation logic below
  function runMD5Simulation() {
    const inputVal = document.getElementById('md5-input')?.value || '';
    const outputEl = document.getElementById('md5-digest');

    // TODO [Group 1]:
    // 1. Implement 512-bit block padding & message length appending.
    // 2. Implement the 4 non-linear round functions: F, G, H, I.
    // 3. Update internal registers (A, B, C, D) in the UI.
    // 4. Compute and display the final 128-bit digest.

    // Placeholder until your team implements the algorithm:
    const placeholderDigest = `[TODO: Group 1 implements MD5 for "${inputVal}"]`;
    if (outputEl) outputEl.value = placeholderDigest;

    // Notify shell of state change
    if (window.LabBridge) {
      window.LabBridge.emitToParent('CRYPTO_LAB_STATE_CHANGE', {
        inputLength: inputVal.length
      });
    }
  }

  // 3. Setup and Event Listeners
  function init() {
    initTabs();

    const inputField = document.getElementById('md5-input');
    inputField?.addEventListener('input', runMD5Simulation);

    document.getElementById('md5-reset-btn')?.addEventListener('click', () => {
      if (inputField) inputField.value = 'The quick brown fox jumps over the lazy dog';
      runMD5Simulation();
    });

    // Auto-mount quiz from quiz.json (Pre-built)
    fetch('quiz.json')
      .then(res => res.json())
      .then(q => {
        if (window.LabQuizEngine) {
          window.LabQuizEngine.mount(document.getElementById('quiz-mount'), q, { experimentId: 'md5' });
        }
      })
      .catch(err => console.warn('Could not load quiz.json', err));

    runMD5Simulation();

    // Signal to parent shell that cartridge is loaded
    if (window.LabBridge) window.LabBridge.notifyReady('md5');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
