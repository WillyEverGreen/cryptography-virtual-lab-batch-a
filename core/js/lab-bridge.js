/**
 * ============================================================================
 * CRYPTOGRAPHY VIRTUAL LAB — LAB BRIDGE API
 * Bi-directional event communication between Master Shell & Experiment Cartridges
 * Handles events, state synchronization, audio cues, and instant theme sync!
 * ============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.LabBridge = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MESSAGE_PREFIX = 'CRYPTO_LAB_';
  const listeners = new Map();

  const LabBridge = {
    // Standard Message Types
    EVENTS: {
      MODULE_READY: `${MESSAGE_PREFIX}MODULE_READY`,
      STATE_CHANGE: `${MESSAGE_PREFIX}STATE_CHANGE`,
      TEST_CASE_PASSED: `${MESSAGE_PREFIX}TEST_CASE_PASSED`,
      LEVEL_COMPLETED: `${MESSAGE_PREFIX}LEVEL_COMPLETED`,
      PLAY_SOUND: `${MESSAGE_PREFIX}PLAY_SOUND`,
      THEME_CHANGE: `${MESSAGE_PREFIX}THEME_CHANGE`
    },

    /**
     * Send event to Master Shell (from inside experiment cartridge)
     */
    emitToParent: function (eventType, payload = {}) {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: eventType,
          payload: payload,
          timestamp: Date.now()
        }, '*');
      }
    },

    /**
     * Send event to Cartridge (from Master Shell to iframe)
     */
    emitToCartridge: function (iframeElement, eventType, payload = {}) {
      if (iframeElement && iframeElement.contentWindow) {
        iframeElement.contentWindow.postMessage({
          type: eventType,
          payload: payload,
          timestamp: Date.now()
        }, '*');
      }
    },

    /**
     * Listen for incoming messages
     */
    on: function (eventType, callback) {
      if (!listeners.has(eventType)) {
        listeners.set(eventType, []);
      }
      listeners.get(eventType).push(callback);
    },

    /**
     * Notify parent that module is ready
     */
    notifyReady: function (experimentId) {
      this.emitToParent(this.EVENTS.MODULE_READY, { experimentId });
      // Apply saved theme automatically
      this.applySavedTheme();
    },

    /**
     * Notify parent that user achieved state/level completion
     */
    completeLevel: function (experimentId, score = 100, details = {}) {
      this.emitToParent(this.EVENTS.LEVEL_COMPLETED, {
        experimentId,
        score,
        details
      });
    },

    /**
     * Play tactile UI sound via parent audio engine
     */
    sound: function (soundName = 'click') {
      this.emitToParent(this.EVENTS.PLAY_SOUND, { sound: soundName });
    },

    /**
     * Apply theme to current document
     */
    setTheme: function (theme) {
      document.documentElement.setAttribute('data-theme', theme);
      try { localStorage.setItem('crypto_lab_theme', theme); } catch (e) {}
    },

    applySavedTheme: function () {
      try {
        const saved = localStorage.getItem('crypto_lab_theme');
        if (saved) {
          document.documentElement.setAttribute('data-theme', saved);
        }
      } catch (e) {}
    }
  };

  // Auto-apply saved theme on load
  LabBridge.applySavedTheme();

  // Global message listener
  window.addEventListener('message', function (event) {
    if (!event.data || typeof event.data.type !== 'string') return;

    // Handle theme sync automatically
    if (event.data.type === LabBridge.EVENTS.THEME_CHANGE) {
      const theme = event.data.payload?.theme || 'light';
      LabBridge.setTheme(theme);
    }

    const callbacks = listeners.get(event.data.type);
    if (callbacks) {
      callbacks.forEach(cb => cb(event.data.payload));
    }
  });

  return LabBridge;
}));
