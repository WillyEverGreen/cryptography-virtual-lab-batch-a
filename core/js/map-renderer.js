/**
 * ============================================================================
 * CRYPTOGRAPHY VIRTUAL LAB — WORLD MAP & CATALOG RENDERER
 * Renders the 2D Cyber Sector Map and Experiment Cards with clean SVG icons
 * ============================================================================
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.LabMapRenderer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const SECTOR_ICONS = {
    'sector-classic': 'scroll',
    'sector-hash': 'hash',
    'sector-auth': 'shield',
    'sector-network': 'globe'
  };

  const LabMapRenderer = {
    /**
     * Render the 2D Sector World Map
     */
    renderWorldMap: function (containerEl, sectors, experiments, userState) {
      if (!containerEl) return;
      containerEl.innerHTML = '';

      sectors.forEach((sector, idx) => {
        const sectorExps = experiments.filter(e => e.sectorId === sector.id);
        const iconKey = SECTOR_ICONS[sector.id] || 'folder';
        const iconSvg = window.LabIcons ? window.LabIcons.get(iconKey, 'lg') : '';

        const trackEl = document.createElement('div');
        trackEl.className = 'sector-track';

        trackEl.innerHTML = `
          <div class="sector-header">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="color: var(--cyber-cyan); display: flex; align-items: center;">
                ${iconSvg}
              </div>
              <div>
                <h3 style="font-size: 1rem; font-weight: 700; margin: 0; color: var(--text-bright);">${sector.name}</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">${sector.description}</p>
              </div>
            </div>
            <span class="badge-pixel cyan">${sector.badge || `SECTOR 0${idx + 1}`}</span>
          </div>
          <div class="sector-nodes-grid" id="sector-grid-${sector.id}"></div>
        `;

        const gridEl = trackEl.querySelector(`#sector-grid-${sector.id}`);

        if (sectorExps.length === 0) {
          gridEl.innerHTML = `
            <div style="padding: 16px; border: 1px dashed var(--border-medium); border-radius: 4px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">
              [ NO EXPERIMENTS DEPLOYED IN THIS SECTOR YET ]
            </div>
          `;
        } else {
          sectorExps.forEach(exp => {
            const isDone = userState?.clearedExperiments?.[exp.id];
            const nodeCard = document.createElement('a');
            nodeCard.href = `#/experiment/${exp.id}`;
            nodeCard.className = 'experiment-node-card';

            const arrowSvg = window.LabIcons ? window.LabIcons.get('arrowRight') : '&rarr;';
            const checkSvg = window.LabIcons ? window.LabIcons.get('check') : '✓';

            nodeCard.innerHTML = `
              <div class="node-title">
                <span>${exp.title}</span>
                <span class="status-led ${isDone ? 'green' : (exp.status === 'active' ? 'cyan' : 'amber')}"></span>
              </div>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 2px 0 10px 0; line-height: 1.45; flex: 1;">
                ${exp.description || 'Hands-on interactive cryptosystem simulation and analysis.'}
              </p>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 8px; border-top: 1px solid var(--border-dim);">
                <span class="badge-pixel ${exp.difficulty === 'Advanced' ? 'amber' : 'green'}">${exp.difficulty}</span>
                <span style="font-size: 0.78rem; font-weight: 600; color: var(--cyber-cyan); display: inline-flex; align-items: center; gap: 4px;">
                  ${isDone ? `${checkSvg} COMPLETED` : `ENTER LAB ${arrowSvg}`}
                </span>
              </div>
            `;

            nodeCard.addEventListener('click', () => {
              if (window.LabGamification) window.LabGamification.play('click');
            });

            gridEl.appendChild(nodeCard);
          });
        }

        containerEl.appendChild(trackEl);
      });
    },

    /**
     * Render the flat Experiment Catalog
     */
    renderCatalog: function (containerEl, experiments, userState, searchTerm = '', sectorFilter = 'all') {
      if (!containerEl) return;
      containerEl.innerHTML = '';

      const filtered = experiments.filter(exp => {
        const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              exp.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              exp.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSector = sectorFilter === 'all' || exp.sectorId === sectorFilter;
        return matchesSearch && matchesSector;
      });

      if (filtered.length === 0) {
        containerEl.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 40px; text-align: center; border: 1px dashed var(--border-medium); border-radius: 6px; background: var(--bg-surface);">
            <p style="font-size: 0.95rem; font-weight: 600; color: var(--text-secondary);">No experiment modules found matching query.</p>
            <p style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-muted); margin-top: 6px;">Try clearing filters or search term.</p>
          </div>
        `;
        return;
      }

      filtered.forEach(exp => {
        const isDone = userState?.clearedExperiments?.[exp.id];
        const card = document.createElement('div');
        card.className = 'cyber-card';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';

        const arrowSvg = window.LabIcons ? window.LabIcons.get('arrowRight') : '&rarr;';

        card.innerHTML = `
          <div class="card-header">
            <span class="badge-pixel cyan">${exp.sectorId}</span>
            <span class="badge-pixel ${isDone ? 'green' : 'amber'}">${isDone ? 'COMPLETED' : 'INCOMPLETE'}</span>
          </div>
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 6px; color: var(--text-bright);">${exp.title}</h3>
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 16px; flex: 1; line-height: 1.5;">
            ${exp.description || 'Interactive simulation module.'}
          </p>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-dim); padding-top: 10px;">
            <span class="badge-pixel">${exp.difficulty}</span>
            <a href="#/experiment/${exp.id}" class="btn-cyber primary sm">
              LAUNCH MODULE ${arrowSvg}
            </a>
          </div>
        `;

        containerEl.appendChild(card);
      });
    }
  };

  return LabMapRenderer;
}));
