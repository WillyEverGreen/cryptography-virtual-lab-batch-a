/**
 * ============================================================================
 * CRYPTOGRAPHY VIRTUAL LAB — GAMIFICATION & AUDIO ENGINE
 * Zero-dependency Web Audio API synthesizer + LocalStorage player progress
 * ============================================================================
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.LabGamification = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEY = 'crypto_lab_user_progress_v1';
  let audioCtx = null;
  let isSoundEnabled = true;

  // Initialize Web Audio API safely on first user gesture
  function getAudioContext() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Load progress from localStorage
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage unavailable, using transient state', e);
    }
    return {
      agentName: 'Operative',
      xp: 0,
      clearedExperiments: {},
      quizScores: {},
      soundEnabled: true
    };
  }

  // Save progress
  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state to localStorage', e);
    }
  }

  let currentState = loadState();
  isSoundEnabled = currentState.soundEnabled ?? true;

  const LabGamification = {
    // Sound FX Synthesizer using Web Audio API (No external assets required!)
    play: function (type = 'click') {
      if (!isSoundEnabled) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        // High-pitch tactile pixel blip
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'success' || type === 'level_clear') {
        // 3-note ascending arpeggio (C5 -> E5 -> G5)
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const noteOsc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          noteOsc.connect(noteGain);
          noteGain.connect(ctx.destination);
          noteOsc.type = 'triangle';
          noteOsc.frequency.setValueAtTime(freq, now + idx * 0.07);
          noteGain.gain.setValueAtTime(0.12, now + idx * 0.07);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * 0.09);
          noteOsc.start(now + idx * 0.07);
          noteOsc.stop(now + (idx + 1) * 0.09);
        });
      } else if (type === 'error') {
        // Low buzzing sawtooth
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    },

    toggleSound: function () {
      isSoundEnabled = !isSoundEnabled;
      currentState.soundEnabled = isSoundEnabled;
      saveState(currentState);
      if (isSoundEnabled) this.play('click');
      return isSoundEnabled;
    },

    isSoundActive: function () {
      return isSoundEnabled;
    },

    // Progress State Management
    getState: function () {
      return { ...currentState };
    },

    markExperimentCleared: function (experimentId, score = 100) {
      if (!currentState.clearedExperiments[experimentId]) {
        currentState.clearedExperiments[experimentId] = {
          clearedAt: new Date().toISOString(),
          score: score
        };
        currentState.xp += 150;
        saveState(currentState);
        this.play('level_clear');
        this.triggerStateUpdate();
      }
    },

    saveQuizScore: function (experimentId, score, total) {
      currentState.quizScores[experimentId] = {
        score: score,
        total: total,
        percentage: Math.round((score / total) * 100),
        takenAt: new Date().toISOString()
      };
      currentState.xp += score * 20;
      saveState(currentState);
      this.triggerStateUpdate();
    },

    isCleared: function (experimentId) {
      return !!currentState.clearedExperiments[experimentId];
    },

    triggerStateUpdate: function () {
      const event = new CustomEvent('lab_state_changed', { detail: currentState });
      window.dispatchEvent(event);
    }
  };

  return LabGamification;
}));
