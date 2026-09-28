/**
 * ============================================================================
 * CRYPTOGRAPHY VIRTUAL LAB — HASH SPA ROUTER
 * Zero-dependency client-side routing for static deployment & local browsing
 * ============================================================================
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.LabRouter = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const routes = {};
  let currentRoute = '';

  const LabRouter = {
    register: function (routePattern, handler) {
      routes[routePattern] = handler;
    },

    navigate: function (path) {
      window.location.hash = path.startsWith('#') ? path : `#${path}`;
    },

    resolve: function () {
      const hash = window.location.hash || '#/';
      currentRoute = hash;

      // Extract path without query parameters
      const cleanPath = hash.split('?')[0];

      // Direct match
      if (routes[cleanPath]) {
        routes[cleanPath]({});
        this.updateNavLinks(cleanPath);
        return;
      }

      // Dynamic routes (e.g. #/experiment/:id)
      for (const pattern in routes) {
        if (pattern.includes(':')) {
          const patternParts = pattern.split('/');
          const pathParts = cleanPath.split('/');

          if (patternParts.length === pathParts.length) {
            const params = {};
            let isMatch = true;

            for (let i = 0; i < patternParts.length; i++) {
              if (patternParts[i].startsWith(':')) {
                const paramName = patternParts[i].slice(1);
                params[paramName] = pathParts[i];
              } else if (patternParts[i] !== pathParts[i]) {
                isMatch = false;
                break;
              }
            }

            if (isMatch) {
              routes[pattern](params);
              this.updateNavLinks(cleanPath);
              return;
            }
          }
        }
      }

      // Default fallback to root
      if (routes['#/']) {
        routes['#/']({});
        this.updateNavLinks('#/');
      }
    },

    updateNavLinks: function (currentPath) {
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath.startsWith('#/experiment') && href === '#/experiments')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    },

    init: function () {
      window.addEventListener('hashchange', () => this.resolve());
      this.resolve();
    }
  };

  return LabRouter;
}));
