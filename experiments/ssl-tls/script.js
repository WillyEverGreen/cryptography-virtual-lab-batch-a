/**
 * ============================================================================
 * EXPERIMENT: SSL / TLS HANDSHAKE PROTOCOL — STARTER TEMPLATE
 * Assigned Group:
 *   - Jace Jaison (10711)
 *   - Ahamed Wafiq (10705)
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

  // 2. Group TODO: Implement SSL/TLS handshake simulation below
  function runTLSSimulation() {
    const suite = document.getElementById('cipher-suite-select')?.value || '';
    const handshakeLog = document.getElementById('handshake-log');

    // TODO [Group 5]:
    // 1. Simulate step-by-step handshake progression:
    //    - Step 1: ClientHello (Random bytes, Cipher Suites offered)
    //    - Step 2: ServerHello (Selected Cipher Suite, Server Random)
    //    - Step 3: Certificate & Key Exchange (X.509 cert validation)
    //    - Step 4: Finished & Secure Channel Established
    // 2. Render sequence diagram or step-by-step state visualization.

    if (handshakeLog) {
      handshakeLog.innerHTML = `
        <div style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.85rem;">
          [ Selected Suite: <strong>${suite}</strong> ]<br>
          <em>[TODO: Group 5 implements animated handshake step progression here]</em>
        </div>
      `;
    }

    if (window.LabBridge) {
      window.LabBridge.emitToParent('CRYPTO_LAB_STATE_CHANGE', { cipherSuite: suite });
    }
  }

  // 3. Setup and Event Listeners
  function init() {
    initTabs();

    document.getElementById('cipher-suite-select')?.addEventListener('change', runTLSSimulation);
    document.getElementById('tls-step-btn')?.addEventListener('click', runTLSSimulation);
    document.getElementById('tls-reset-btn')?.addEventListener('click', runTLSSimulation);

    // Auto-mount quiz from quiz.json (Pre-built)
    fetch('quiz.json')
      .then(res => res.json())
      .then(q => {
        if (window.LabQuizEngine) {
          window.LabQuizEngine.mount(document.getElementById('quiz-mount'), q, { experimentId: 'ssl-tls' });
        }
      })
      .catch(err => console.warn('Could not load quiz.json', err));

    runTLSSimulation();

    if (window.LabBridge) window.LabBridge.notifyReady('ssl-tls');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
