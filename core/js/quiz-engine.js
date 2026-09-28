/**
 * ============================================================================
 * CRYPTOGRAPHY VIRTUAL LAB — UNIVERSAL QUIZ & EVALUATION ENGINE
 * Standardized MCQ evaluation framework for all experiment cartridges
 * ============================================================================
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.LabQuizEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const LabQuizEngine = {
    /**
     * Mount Quiz to a container
     */
    mount: function (containerEl, questions, options = {}) {
      if (!containerEl || !Array.isArray(questions) || questions.length === 0) {
        if (containerEl) {
          containerEl.innerHTML = `
            <div style="padding: 24px; border: 2px dashed var(--border-medium); text-align: center;">
              <p style="font-family: var(--font-pixel); color: var(--text-muted);">[ NO QUIZ QUESTIONS REGISTERED FOR THIS EXPERIMENT ]</p>
            </div>
          `;
        }
        return;
      }

      const experimentId = options.experimentId || 'unknown';
      let userAnswers = {};
      let isSubmitted = false;

      function render() {
        containerEl.innerHTML = `
          <div class="cyber-quiz-wrapper" style="display: flex; flex-direction: column; gap: 20px;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--border-dark); padding-bottom: 10px;">
              <div>
                <h3 style="font-family: var(--font-pixel); font-size: 1.05rem; margin: 0;">CONCEPT EVALUATION & ASSESSMENT</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Test your understanding of the underlying cryptographic principles.</p>
              </div>
              <span class="badge-pixel cyan">${questions.length} QUESTIONS</span>
            </div>

            <div id="quiz-questions-list" style="display: flex; flex-direction: column; gap: 16px;"></div>

            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 2px solid var(--border-dark); padding-top: 16px;">
              <div id="quiz-score-badge" style="font-family: var(--font-mono); font-size: 0.9rem; font-weight: bold;"></div>
              <div style="display: flex; gap: 10px;">
                <button type="button" id="quiz-reset-btn" class="btn-cyber sm" ${!isSubmitted ? 'style="display:none;"' : ''}>
                  RETRY EVALUATION
                </button>
                <button type="button" id="quiz-submit-btn" class="btn-cyber primary" ${isSubmitted ? 'disabled style="opacity:0.6;"' : ''}>
                  SUBMIT ANSWERS
                </button>
              </div>
            </div>
          </div>
        `;

        const listEl = containerEl.querySelector('#quiz-questions-list');

        questions.forEach((q, qIdx) => {
          const qBox = document.createElement('div');
          qBox.className = 'cyber-card';
          qBox.style.padding = '14px';

          let feedbackHtml = '';
          if (isSubmitted) {
            const isCorrect = userAnswers[qIdx] === q.correctIndex;
            feedbackHtml = `
              <div style="margin-top: 12px; padding: 10px; border-left: 4px solid ${isCorrect ? 'var(--cyber-green)' : 'var(--cyber-crimson)'}; background: var(--bg-surface-elevated); font-size: 0.82rem;">
                <strong style="color: ${isCorrect ? 'var(--cyber-green-dim)' : 'var(--cyber-crimson)'};">
                  ${isCorrect ? '✓ CORRECT: ' : '✗ INCORRECT: '}
                </strong>
                ${q.explanation || 'Review the theory tab for detailed derivation.'}
              </div>
            `;
          }

          qBox.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-family: var(--font-pixel); font-size: 0.85rem; font-weight: bold;">Q${qIdx + 1}.</span>
              <span class="badge-pixel">${q.id || `q-${qIdx + 1}`}</span>
            </div>
            <p style="font-size: 0.9rem; margin-bottom: 12px; font-weight: 500;">${q.question}</p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${q.options.map((opt, optIdx) => {
                const isSelected = userAnswers[qIdx] === optIdx;
                let optionStyle = 'border: 1px solid var(--border-dark); padding: 8px 12px; background: var(--bg-surface); cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 0.85rem;';
                
                if (isSubmitted) {
                  if (optIdx === q.correctIndex) {
                    optionStyle += 'background: rgba(16, 185, 129, 0.18); border-color: var(--cyber-green); font-weight: bold;';
                  } else if (isSelected && optIdx !== q.correctIndex) {
                    optionStyle += 'background: rgba(220, 38, 38, 0.18); border-color: var(--cyber-crimson);';
                  }
                } else if (isSelected) {
                  optionStyle += 'background: var(--bg-surface-hover); border-color: var(--cyber-cyan); font-weight: 600;';
                }

                return `
                  <label style="${optionStyle}">
                    <input type="radio" name="q_${qIdx}" value="${optIdx}" ${isSelected ? 'checked' : ''} ${isSubmitted ? 'disabled' : ''} style="accent-color: var(--cyber-cyan);">
                    <span>${opt}</span>
                  </label>
                `;
              }).join('')}
            </div>
            ${feedbackHtml}
          `;

          // Bind option selection
          if (!isSubmitted) {
            const inputs = qBox.querySelectorAll(`input[name="q_${qIdx}"]`);
            inputs.forEach(input => {
              input.addEventListener('change', (e) => {
                userAnswers[qIdx] = parseInt(e.target.value, 10);
                if (window.LabBridge) window.LabBridge.sound('click');
              });
            });
          }

          listEl.appendChild(qBox);
        });

        // Submit logic
        const submitBtn = containerEl.querySelector('#quiz-submit-btn');
        submitBtn?.addEventListener('click', () => {
          let score = 0;
          questions.forEach((q, idx) => {
            if (userAnswers[idx] === q.correctIndex) score++;
          });

          isSubmitted = true;
          render();

          const scoreBadge = containerEl.querySelector('#quiz-score-badge');
          if (scoreBadge) {
            scoreBadge.innerHTML = `SCORE: ${score} / ${questions.length} (${Math.round((score / questions.length) * 100)}%)`;
            scoreBadge.style.color = score / questions.length >= 0.7 ? 'var(--cyber-green)' : 'var(--cyber-amber)';
          }

          if (window.LabGamification) {
            window.LabGamification.saveQuizScore(experimentId, score, questions.length);
            if (score / questions.length >= 0.7) {
              window.LabGamification.play('success');
            } else {
              window.LabGamification.play('error');
            }
          }

          if (window.LabBridge) {
            window.LabBridge.completeLevel(experimentId, Math.round((score / questions.length) * 100), {
              quizScore: score,
              totalQuestions: questions.length
            });
          }
        });

        // Reset logic
        const resetBtn = containerEl.querySelector('#quiz-reset-btn');
        resetBtn?.addEventListener('click', () => {
          userAnswers = {};
          isSubmitted = false;
          render();
        });
      }

      render();
    }
  };

  return LabQuizEngine;
}));
