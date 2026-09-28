/**
 * ============================================================================
 * EXPERIMENT MODULE TEMPLATE: SCRIPT CONTROLLER
 * Implement your group's cryptographic simulation logic below.
 * ============================================================================
 */

(function () {
  'use strict';

  // 1. Tab Navigation Logic (Ready to use)
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

  // 2. Cryptographic Algorithm Simulation (Implement your logic here)
  function runSimulation() {
    const inputVal = document.getElementById('template-input')?.value || '';
    const outputEl = document.getElementById('template-output');

    // TODO: Replace with your actual cryptographic function (e.g. SHA1, MD5, RSA)
    const simulatedOutput = `PROCESSED: [${inputVal.toUpperCase()}]`;

    if (outputEl) {
      outputEl.value = simulatedOutput;
    }

    // Notify shell through LabBridge
    if (window.LabBridge) {
      window.LabBridge.emitToParent('CRYPTO_LAB_STATE_CHANGE', {
        inputLength: inputVal.length
      });
    }
  }

  // 3. Initialization
  function init() {
    initTabs();

    const inputField = document.getElementById('template-input');
    inputField?.addEventListener('input', runSimulation);

    document.getElementById('sim-run-btn')?.addEventListener('click', runSimulation);

    document.getElementById('sim-reset-btn')?.addEventListener('click', () => {
      if (inputField) inputField.value = 'SAMPLE PLAINTEXT';
      runSimulation();
    });

    // Auto-load Quiz
    fetch('quiz.json')
      .then(res => res.json())
      .then(questions => {
        const quizContainer = document.getElementById('quiz-mount');
        if (quizContainer && window.LabQuizEngine) {
          window.LabQuizEngine.mount(quizContainer, questions, { experimentId: 'my-algorithm' });
        }
      })
      .catch(err => console.warn('Could not load quiz.json', err));

    runSimulation();

    if (window.LabBridge) {
      window.LabBridge.notifyReady('my-algorithm');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
