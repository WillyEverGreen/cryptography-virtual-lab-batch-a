/**
 * ============================================================================
 * EXPERIMENT: HMAC (KEYED-HASH MESSAGE AUTHENTICATION) — STARTER TEMPLATE
 * Assigned Group:
 *   - Jadern Crasto (10716)
 *   - Wendell Dsouza (10724)
 *   - Rohit Ahir (10706)
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

  // 2. Group TODO: Implement RFC 2104 HMAC algorithm below
  function runHMACSimulation() {
    const msg = document.getElementById('hmac-msg-input')?.value || '';
    const key = document.getElementById('hmac-key-input')?.value || '';
    const hmacOutput = document.getElementById('hmac-output');

    // TODO [Group 4]:
    // 1. Implement key padding (pad with 0x00 to block size B=64 bytes, or hash if key > B).
    // 2. Compute inner key XOR: K' ^ ipad (0x36).
    // 3. Compute inner hash: H((K' ^ ipad) || M).
    // 4. Compute outer key XOR: K' ^ opad (0x5c).
    // 5. Compute outer hash: H((K' ^ opad) || inner_hash).
    // 6. Display final HMAC tag and intermediate stages.

    const placeholderHMAC = `[TODO: Group 4 computes HMAC for "${msg}"]`;
    if (hmacOutput) hmacOutput.value = placeholderHMAC;

    if (window.LabBridge) {
      window.LabBridge.emitToParent('CRYPTO_LAB_STATE_CHANGE', { msgLength: msg.length });
    }
  }

  // 3. Setup and Event Listeners
  function init() {
    initTabs();

    document.getElementById('hmac-msg-input')?.addEventListener('input', runHMACSimulation);
    document.getElementById('hmac-key-input')?.addEventListener('input', runHMACSimulation);

    document.getElementById('hmac-reset-btn')?.addEventListener('click', () => {
      const msg = document.getElementById('hmac-msg-input');
      const key = document.getElementById('hmac-key-input');
      if (msg) msg.value = 'Hi There';
      if (key) key.value = 'secret_hmac_key_2026';
      runHMACSimulation();
    });

    // Auto-mount quiz from quiz.json (Pre-built)
    fetch('quiz.json')
      .then(res => res.json())
      .then(q => {
        if (window.LabQuizEngine) {
          window.LabQuizEngine.mount(document.getElementById('quiz-mount'), q, { experimentId: 'hmac' });
        }
      })
      .catch(err => console.warn('Could not load quiz.json', err));

    runHMACSimulation();

    if (window.LabBridge) window.LabBridge.notifyReady('hmac');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
