/**
 * ============================================================================
 * EXPERIMENT: MESSAGE AUTHENTICATION CODE (STARTER TEMPLATE)
 * Assigned Group:
 *   - Aarna Chopdekar (10712)
 *   - Slora Bar (10708)
 *   - Arya Chavan (10709)
 *   - Cajetan Dsouza (10723)
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

  const BLOCK_SIZE = 16;
  let simulationRequest = 0;

  function bytesToHex(bytes) {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  function xorBytes(left, right) {
    return left.map((value, index) => value ^ right[index]);
  }

  function normalizeKey(keyText) {
    const source = new TextEncoder().encode(keyText);
    return Uint8Array.from({ length: BLOCK_SIZE }, (_, index) => source[index] || 0);
  }

  function buildBlocks(messageText) {
    const source = new TextEncoder().encode(messageText);
    const blockCount = Math.max(1, Math.ceil(source.length / BLOCK_SIZE));
    const padded = new Uint8Array(blockCount * BLOCK_SIZE);
    padded.set(source);
    return Array.from({ length: blockCount }, (_, index) =>
      padded.slice(index * BLOCK_SIZE, (index + 1) * BLOCK_SIZE)
    );
  }

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[character]));
  }

  async function calculateCBCMAC(messageText, keyText) {
    const keyBytes = normalizeKey(keyText);
    const blocks = buildBlocks(messageText);
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-CBC' },
      false,
      ['encrypt']
    );
    let chainingValue = new Uint8Array(BLOCK_SIZE);
    const trace = [];

    for (const [index, block] of blocks.entries()) {
      const xorInput = xorBytes(block, chainingValue);
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv: new Uint8Array(BLOCK_SIZE) },
        cryptoKey,
        xorInput
      );
      chainingValue = new Uint8Array(encrypted).slice(0, BLOCK_SIZE);
      trace.push({
        blockNumber: index + 1,
        messageBlock: bytesToHex(block),
        previousChain: index === 0 ? '0'.repeat(BLOCK_SIZE * 2) : trace[index - 1].chainValue,
        xorInput: bytesToHex(xorInput),
        chainValue: bytesToHex(chainingValue)
      });
    }

    return { keyBytes, blocks, trace, tag: bytesToHex(chainingValue) };
  }

  function renderTrace(result, messageText, keyText) {
    const traceOutput = document.getElementById('mac-trace-output');
    const blockCount = document.getElementById('mac-block-count');
    const vectorOutput = document.getElementById('mac-vector-output');
    if (!traceOutput || !blockCount || !vectorOutput) return;

    blockCount.textContent = `${result.trace.length} BLOCK${result.trace.length === 1 ? '' : 'S'}`;
    traceOutput.innerHTML = `
      <div class="mac-trace-summary">KEY (16-BYTE NORMALIZED): <code>${bytesToHex(result.keyBytes)}</code></div>
      ${result.trace.map(row => `
        <div class="mac-trace-row">
          <strong>BLOCK ${row.blockNumber}</strong>
          <span>M<sub>${row.blockNumber}</sub>: <code>${row.messageBlock}</code></span>
          <span>C<sub>${row.blockNumber - 1}</sub>: <code>${row.previousChain}</code></span>
          <span>M<sub>${row.blockNumber}</sub> &oplus; C<sub>${row.blockNumber - 1}</sub>: <code>${row.xorInput}</code></span>
          <span>C<sub>${row.blockNumber}</sub>: <code>${row.chainValue}</code></span>
        </div>
      `).join('')}
    `;
    vectorOutput.innerHTML = `
      <div><strong>Message:</strong> <code>${escapeHtml(messageText || '(empty)')}</code></div>
      <div><strong>Key:</strong> <code>${escapeHtml(keyText || '(empty)')}</code></div>
      <div><strong>Blocks:</strong> ${result.trace.length}</div>
      <div><strong>Expected tag:</strong> <code>${result.tag}</code></div>
    `;
  }

  async function runMACSimulation() {
    const requestId = ++simulationRequest;
    const msg = document.getElementById('mac-msg-input')?.value || '';
    const key = document.getElementById('mac-key-input')?.value || '';
    const receivedMsg = document.getElementById('mac-tamper-input')?.value || '';
    const tagOutput = document.getElementById('mac-tag-output');
    const verifyResult = document.getElementById('mac-verify-result');

    if (!key.trim()) {
      if (tagOutput) tagOutput.value = 'ENTER A NON-EMPTY SHARED KEY';
      if (verifyResult) verifyResult.innerHTML = '<span class="mac-status invalid">KEY REQUIRED: THE RECEIVER CANNOT VERIFY THIS MESSAGE.</span>';
      return;
    }

    try {
      const senderResult = await calculateCBCMAC(msg, key);
      const receiverResult = await calculateCBCMAC(receivedMsg, key);
      if (requestId !== simulationRequest) return;

      if (tagOutput) tagOutput.value = senderResult.tag;
      renderTrace(senderResult, msg, key);

      const verified = senderResult.tag === receiverResult.tag;
      if (verifyResult) {
        verifyResult.innerHTML = verified
          ? '<span class="mac-status valid">✓ AUTHENTIC: RECEIVED MESSAGE MATCHES THE SENDER TAG.</span>'
          : '<span class="mac-status invalid">✗ TAMPER DETECTED: RECEIVED MESSAGE PRODUCES A DIFFERENT TAG.</span>';
      }

      if (window.LabBridge) {
        window.LabBridge.emitToParent('CRYPTO_LAB_STATE_CHANGE', {
          msgLength: msg.length,
          blockCount: senderResult.trace.length,
          verified
        });
      }
    } catch (error) {
      if (requestId !== simulationRequest) return;
      if (tagOutput) tagOutput.value = 'CALCULATION ERROR';
      if (verifyResult) verifyResult.innerHTML = `<span class="mac-status invalid">Unable to calculate CBC-MAC: ${escapeHtml(error.message)}</span>`;
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
      const receivedMsg = document.getElementById('mac-tamper-input');
      if (msg) msg.value = 'TRANSFER $500 TO BOB';
      if (key) key.value = 'SHARED_SECRET_KEY';
      if (receivedMsg) receivedMsg.value = 'TRANSFER $500 TO BOB';
      runMACSimulation();
    });

    // Auto-mount quiz from quiz.json (Pre-built)
    fetch('/experiments/mac/quiz.json')
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
