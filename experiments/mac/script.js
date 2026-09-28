/**
 * ============================================================================
 * EXPERIMENT: MESSAGE AUTHENTICATION CODE (STARTER TEMPLATE)
 * Assigned Group:
 *   - Aarna Chopdekar (10712)
 *   - Slora Bar (10708)
 *   - Arya Chavan (10709)
 *   - Cajetan Dsouza (10723)
 *   - Shreyas Divekar (10720)
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

  // 2. Group TODO: Implement MAC calculation & tamper verification below
  function runMACSimulation() {
    const msg = document.getElementById('mac-msg-input')?.value || '';
    const key = document.getElementById('mac-key-input')?.value || '';
    const tagOutput = document.getElementById('mac-tag-output');
    const verifyResult = document.getElementById('mac-verify-result');

    // TODO [Group 3]:
    // 1. Implement symmetric MAC algorithm (e.g. CBC-MAC or Keyed Hash).
    // 2. Compute authentication tag Tag = MAC(K, M).
    // 3. Compare received message tag vs computed tag to verify authenticity.

    const placeholderTag = `[TODO: Group 3 computes MAC for "${msg}"]`;
    if (tagOutput) tagOutput.value = placeholderTag;

    if (verifyResult) {
      verifyResult.innerHTML = '<span style="color: var(--text-muted);">[ Implement verification logic in script.js ]</span>';
    }

    if (window.LabBridge) {
      window.LabBridge.emitToParent('CRYPTO_LAB_STATE_CHANGE', { msgLength: msg.length });
    }
  }

  // 3. Setup and Event Listeners
  function init() {
    initTabs();

    document.getElementById('mac-msg-input')?.addEventListener('input', runMACSimulation);
    document.getElementById('mac-key-input')?.addEventListener('input', runMACSimulation);
    document.getElementById('mac-tamper-input')?.addEventListener('input', runMACSimulation);

    document.getElementById('mac-reset-btn')?.addEventListener('click', () => {
      const msg = document.getElementById('mac-msg-input');
      const key = document.getElementById('mac-key-input');
      if (msg) msg.value = 'TRANSFER $500 TO BOB';
      if (key) key.value = 'SHARED_SECRET_KEY';
      runMACSimulation();
    });

    // Auto-mount quiz from quiz.json (Pre-built)
    fetch('quiz.json')
      .then(res => res.json())
      .then(q => {
        if (window.LabQuizEngine) {
          window.LabQuizEngine.mount(document.getElementById('quiz-mount'), q, { experimentId: 'mac' });
        }
      })
      .catch(err => console.warn('Could not load quiz.json', err));

    runMACSimulation();

    if (window.LabBridge) window.LabBridge.notifyReady('mac');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
