/**
 * Main Application Controller & UI Render Engine
 * Upgraded with Audio Chimes, Contemplation Timer, 14-Day Prayer Tracker, and Step 5 Sponsor Suite.
 */

const AppUI = {
  currentTab: 'resentments',
  searchQuery: '',
  categoryFilter: 'all',
  instinctFilter: 'all',

  init() {
    this.bindEvents();
    this.applyTheme(window.inventoryStore.settings.theme || 'parchment');
    this.checkLockState();

    window.inventoryStore.subscribe((event, data) => {
      this.handleStoreEvent(event, data);
    });

    this.render();
  },

  handleStoreEvent(event, data) {
    if (event === 'locked') {
      this.showPinModal(true);
    } else if (event === 'unlocked' || event === 'data_loaded' || event === 'data_saved' || event === 'data_cleared') {
      this.render();
    } else if (event === 'settings_changed') {
      this.applyTheme(window.inventoryStore.settings.theme);
    }
  },

  checkLockState() {
    if (window.inventoryStore.settings.pinEnabled && !window.inventoryStore.isUnlocked) {
      this.showPinModal(true);
    }
  },

  bindEvents() {
    // Navigation Tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetTab = e.currentTarget.dataset.tab;
        this.switchTab(targetTab);
      });
    });

    // Theme Selector
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
      themeSelect.value = window.inventoryStore.settings.theme;
      themeSelect.addEventListener('change', (e) => {
        window.inventoryStore.settings.theme = e.target.value;
        window.inventoryStore.saveSettings();
      });
    }

    // Audio & Ambient Button
    const btnAudio = document.getElementById('btnToggleAmbient');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        const isPlaying = window.soundService.toggleAmbient();
        btnAudio.classList.toggle('active', isPlaying);
        btnAudio.textContent = isPlaying ? '🔊 Ambient Playing' : '🎵 Ambient Calm';
      });
    }

    // Chime Bell Button
    const btnChime = document.getElementById('btnBellChime');
    if (btnChime) {
      btnChime.addEventListener('click', () => {
        window.soundService.playChime(432);
        this.showToast('Bell chimed (432Hz)');
      });
    }

    // Contemplation Timer Button
    const btnTimer = document.getElementById('btnOpenTimer');
    if (btnTimer) {
      btnTimer.addEventListener('click', () => this.openContemplationTimerModal());
    }

    // Privacy Shield Button
    const btnPrivacy = document.getElementById('btnPrivacyShield');
    if (btnPrivacy) {
      btnPrivacy.addEventListener('click', () => this.togglePrivacyShield());
    }

    // Panic Key: Esc key toggles privacy shield immediately
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('appModal');
        if (modal && modal.classList.contains('active')) {
          this.closeModal();
        } else {
          this.togglePrivacyShield();
        }
      }
    });

    // Passcode Lock Button
    const btnLock = document.getElementById('btnLockApp');
    if (btnLock) {
      btnLock.addEventListener('click', () => {
        if (!window.inventoryStore.settings.pinEnabled) {
          this.openSecuritySettings();
        } else {
          window.inventoryStore.lock();
        }
      });
    }

    // Settings Button
    const btnSettings = document.getElementById('btnSettings');
    if (btnSettings) {
      btnSettings.addEventListener('click', () => this.openSecuritySettings());
    }

    // Export Options Button
    const btnExport = document.getElementById('btnExportOptions');
    if (btnExport) {
      btnExport.addEventListener('click', () => this.openExportModal());
    }

    // Modal background click
    const modalBackdrop = document.getElementById('appModal');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          this.closeModal();
        }
      });
    }

    // Privacy Overlay Click to dismiss
    const privacyOverlay = document.getElementById('privacyOverlay');
    if (privacyOverlay) {
      privacyOverlay.addEventListener('click', () => {
        this.togglePrivacyShield(false);
      });
    }
  },

  switchTab(tabName) {
    this.currentTab = tabName;
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tabName);
    });

    document.querySelectorAll('.tab-content').forEach(c => {
      c.classList.toggle('active', c.id === `tab-${tabName}`);
    });

    this.render();
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  },

  togglePrivacyShield(forcedState = null) {
    const overlay = document.getElementById('privacyOverlay');
    if (!overlay) return;
    const isCurrentlyActive = overlay.classList.contains('active');
    const newState = forcedState !== null ? forcedState : !isCurrentlyActive;
    overlay.classList.toggle('active', newState);
    document.body.classList.toggle('privacy-blurred', newState);
  },

  render() {
    if (this.currentTab === 'resentments') {
      this.renderResentments();
    } else if (this.currentTab === 'fears') {
      this.renderFears();
    } else if (this.currentTab === 'sexConduct') {
      this.renderSexConduct();
    } else if (this.currentTab === 'harms') {
      this.renderHarms();
    } else if (this.currentTab === 'prayerTracker') {
      this.renderPrayerTracker();
    } else if (this.currentTab === 'patterns') {
      this.renderPatterns();
    } else if (this.currentTab === 'step5') {
      this.renderStep5Review();
    } else if (this.currentTab === 'guide') {
      this.renderGuide();
    }

    this.updateBadges();
  },

  updateBadges() {
    const s = window.inventoryStore.state;
    const resCount = document.getElementById('badgeResentments');
    const fearCount = document.getElementById('badgeFears');
    const sexCount = document.getElementById('badgeSexConduct');
    const harmCount = document.getElementById('badgeHarms');
    const prayerCount = document.getElementById('badgePrayerTracker');

    if (resCount) resCount.textContent = s.resentments.length;
    if (fearCount) fearCount.textContent = s.fears.length;
    if (sexCount) sexCount.textContent = s.sexConduct.length;
    if (harmCount) harmCount.textContent = s.harms.length;

    if (prayerCount) {
      const activePrayers = s.resentments.filter(r => Array.isArray(r.prayerDaysCompleted) && r.prayerDaysCompleted.some(d => d)).length;
      prayerCount.textContent = activePrayers;
    }
  },

  // --- RESENTMENTS VIEW ---
  renderResentments() {
    const container = document.getElementById('resentmentsList');
    if (!container) return;

    const resentments = window.inventoryStore.state.resentments;

    if (resentments.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📖</div>
          <h3>No Resentments Listed Yet</h3>
          <p>The Big Book instructs us to list people, institutions, or principles with whom we were angry.</p>
          <div class="empty-actions">
            <button class="btn btn-primary" onclick="InventoryForms.openResentmentModal()">+ Add Your First Resentment</button>
            <button class="btn btn-secondary" onclick="window.inventoryStore.loadSampleData(); AppUI.render(); AppUI.showToast('Big Book 1939 examples loaded.');">Load Big Book Examples</button>
          </div>
        </div>
      `;
      return;
    }

    let filtered = resentments.filter(r => {
      const q = this.searchQuery.toLowerCase();
      const matchesSearch = !q ||
        r.target.toLowerCase().includes(q) ||
        r.cause.toLowerCase().includes(q) ||
        (r.myPart && r.myPart.toLowerCase().includes(q));
      const matchesCategory = this.categoryFilter === 'all' || r.category === this.categoryFilter;
      const matchesInstinct = this.instinctFilter === 'all' || (Array.isArray(r.affects) && r.affects.includes(this.instinctFilter));
      return matchesSearch && matchesCategory && matchesInstinct;
    });

    let html = `
      <div class="table-actions-bar">
        <div class="search-box">
          <input type="text" id="resSearchInput" class="form-control form-control-sm" placeholder="Search target, cause, turnaround..." value="${this.escape(this.searchQuery)}" oninput="AppUI.handleSearch(event)">
        </div>
        <div class="filter-group">
          <select class="form-control form-control-sm" onchange="AppUI.handleCategoryFilter(event)">
            <option value="all">All Categories</option>
            <option value="Person" ${this.categoryFilter === 'Person' ? 'selected' : ''}>Person</option>
            <option value="Family Member" ${this.categoryFilter === 'Family Member' ? 'selected' : ''}>Family Member</option>
            <option value="Employer / Workplace" ${this.categoryFilter === 'Employer / Workplace' ? 'selected' : ''}>Employer / Workplace</option>
            <option value="Institution / Authority" ${this.categoryFilter === 'Institution / Authority' ? 'selected' : ''}>Institution / Authority</option>
            <option value="Religion / God" ${this.categoryFilter === 'Religion / God' ? 'selected' : ''}>Religion / God</option>
            <option value="Principle / Concept" ${this.categoryFilter === 'Principle / Concept' ? 'selected' : ''}>Principle / Concept</option>
            <option value="Myself" ${this.categoryFilter === 'Myself' ? 'selected' : ''}>Myself</option>
          </select>

          <select class="form-control form-control-sm" onchange="AppUI.handleInstinctFilter(event)">
            <option value="all">All Affected Instincts</option>
            <option value="self_esteem" ${this.instinctFilter === 'self_esteem' ? 'selected' : ''}>Self-Esteem</option>
            <option value="pride" ${this.instinctFilter === 'pride' ? 'selected' : ''}>Pride</option>
            <option value="pocketbook" ${this.instinctFilter === 'pocketbook' ? 'selected' : ''}>Pocketbook (Finances)</option>
            <option value="security" ${this.instinctFilter === 'security' ? 'selected' : ''}>Security</option>
            <option value="ambitions" ${this.instinctFilter === 'ambitions' ? 'selected' : ''}>Ambitions</option>
            <option value="personal_relationships" ${this.instinctFilter === 'personal_relationships' ? 'selected' : ''}>Personal Relationships</option>
            <option value="sex_relations" ${this.instinctFilter === 'sex_relations' ? 'selected' : ''}>Sex Relations</option>
          </select>
        </div>
        <div class="bar-right">
          <button class="btn btn-sm btn-primary" onclick="InventoryForms.openResentmentModal()">+ Add Resentment</button>
        </div>
      </div>

      <div class="inventory-table-container">
        <table class="bigbook-table">
          <thead>
            <tr>
              <th style="width: 22%;">Column 1: I'm Resentful At</th>
              <th style="width: 25%;">Column 2: The Cause</th>
              <th style="width: 18%;">Column 3: Affects My</th>
              <th style="width: 25%;">Column 4: The Turnaround (My Part)</th>
              <th style="width: 10%; text-align: center;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(r => this.renderResentmentRow(r)).join('')}
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = html;
  },

  renderResentmentRow(r) {
    const hasTurnaround = r.myPart && r.myPart.trim().length > 0;
    const instinctsPills = Array.isArray(r.affects) && r.affects.length > 0
      ? r.affects.map(inst => {
          const item = BIG_BOOK_DATA.glossary.instincts.find(i => i.id === inst);
          return `<span class="instinct-tag" title="${item ? item.description : ''}">${item ? item.name : inst}</span>`;
        }).join('')
      : '<span class="text-muted">None specified</span>';

    const prayerDays = Array.isArray(r.prayerDaysCompleted) ? r.prayerDaysCompleted.filter(d => d).length : 0;

    return `
      <tr class="table-row-item">
        <td class="col-target">
          <div class="target-name"><strong>${this.escape(r.target)}</strong></div>
          <span class="category-badge">${this.escape(r.category || 'Person')}</span>
          ${r.amendsNeeded ? '<span class="amends-flag" title="Amends flagged for Step 8/9">⚖️ Amends</span>' : ''}
          ${prayerDays > 0 ? `<span class="prayer-flag" title="${prayerDays}/14 Days Prayed">🕊️ ${prayerDays}/14d</span>` : ''}
        </td>
        <td class="col-cause">
          <p class="cause-text">${this.escape(r.cause)}</p>
        </td>
        <td class="col-affects">
          <div class="instincts-wrap">${instinctsPills}</div>
        </td>
        <td class="col-turnaround">
          ${hasTurnaround ? `
            <div class="turnaround-box">
              <div class="turnaround-tags">
                ${r.selfish ? '<span class="defect-mini-tag" title="Selfish: Putting self first">Selfish</span>' : ''}
                ${r.dishonest ? '<span class="defect-mini-tag" title="Dishonest: Lies, pretenses">Dishonest</span>' : ''}
                ${r.selfSeeking ? '<span class="defect-mini-tag" title="Self-Seeking: Hidden motives">Self-Seeking</span>' : ''}
                ${r.frightened ? '<span class="defect-mini-tag" title="Frightened: Underlying fear">Frightened</span>' : ''}
              </div>
              <p class="turnaround-text">${this.escape(r.myPart)}</p>
              ${r.oppositeAsset ? `<div class="asset-text">🌿 <strong>Asset:</strong> ${this.escape(r.oppositeAsset)}</div>` : ''}
            </div>
          ` : `
            <div class="turnaround-prompt">
              <span class="text-warning">⚠️ Turnaround pending</span>
              <button class="btn btn-xs btn-outline" onclick="InventoryForms.openResentmentModal('${r.id}')">Complete Turnaround</button>
            </div>
          `}
        </td>
        <td class="col-actions text-center">
          <button class="btn-icon" title="Edit Resentment" onclick="InventoryForms.openResentmentModal('${r.id}')">✏️</button>
          <button class="btn-icon text-danger" title="Delete Resentment" onclick="AppUI.confirmDeleteResentment('${r.id}')">🗑️</button>
        </td>
      </tr>
    `;
  },

  handleSearch(e) {
    this.searchQuery = e.target.value;
    this.renderResentments();
  },

  handleCategoryFilter(e) {
    this.categoryFilter = e.target.value;
    this.renderResentments();
  },

  handleInstinctFilter(e) {
    this.instinctFilter = e.target.value;
    this.renderResentments();
  },

  confirmDeleteResentment(id) {
    if (confirm('Are you sure you want to delete this resentment entry?')) {
      window.inventoryStore.deleteResentment(id);
      this.showToast('Resentment deleted.');
    }
  },

  // --- FEARS VIEW ---
  renderFears() {
    const container = document.getElementById('fearsList');
    if (!container) return;

    const fears = window.inventoryStore.state.fears;

    if (fears.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🕊️</div>
          <h3>No Fears Listed Yet</h3>
          <p>"We put them on paper, even though we had no resentment in connection with them." (Big Book p. 67)</p>
          <div class="empty-actions">
            <button class="btn btn-primary" onclick="InventoryForms.openFearModal()">+ Add Fear to Inventory</button>
          </div>
        </div>
      `;
      return;
    }

    let html = `
      <div class="table-actions-bar">
        <div class="bar-left">
          <span class="section-subtitle">"Wasn't it because self-reliance failed us?" (p. 68)</span>
        </div>
        <div class="bar-right">
          <button class="btn btn-sm btn-primary" onclick="InventoryForms.openFearModal()">+ Add Fear</button>
        </div>
      </div>

      <div class="cards-grid">
        ${fears.map(f => `
          <div class="inventory-card">
            <div class="card-header">
              <h4 class="card-title">${this.escape(f.fear)}</h4>
              <div class="card-controls">
                <button class="btn-icon" onclick="InventoryForms.openFearModal('${f.id}')">✏️</button>
                <button class="btn-icon text-danger" onclick="AppUI.confirmDeleteFear('${f.id}')">🗑️</button>
              </div>
            </div>
            <div class="card-body">
              <div class="card-section">
                <span class="field-title">Why do I have it?</span>
                <p>${this.escape(f.why)}</p>
              </div>
              <div class="card-section">
                <span class="field-title">Where Self-Reliance Failed:</span>
                <p>${this.escape(f.selfReliancePart || 'Not specified')}</p>
              </div>
              ${f.affects && f.affects.length ? `
                <div class="card-section">
                  <span class="field-title">Affects:</span>
                  <div class="instincts-wrap">
                    ${f.affects.map(a => `<span class="instinct-tag">${a.replace('_', ' ')}</span>`).join('')}
                  </div>
                </div>
              ` : ''}
              ${f.prayerPractice ? `
                <div class="card-section prayer-card-box">
                  <span class="field-title">Spiritual Turnaround (Fear Prayer):</span>
                  <p class="prayer-reflection">"${this.escape(f.prayerPractice)}"</p>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.innerHTML = html;
  },

  confirmDeleteFear(id) {
    if (confirm('Delete this fear entry?')) {
      window.inventoryStore.deleteFear(id);
      this.showToast('Fear entry deleted.');
    }
  },

  // --- SEX CONDUCT VIEW ---
  renderSexConduct() {
    const container = document.getElementById('sexConductList');
    if (!container) return;

    const sexConduct = window.inventoryStore.state.sexConduct;

    if (sexConduct.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🤝</div>
          <h3>No Sex Conduct Entries Yet</h3>
          <p>"We subjected each relation to this test: was it selfish or not? We asked God to mold our ideals..." (p. 69)</p>
          <div class="empty-actions">
            <button class="btn btn-primary" onclick="InventoryForms.openSexConductModal()">+ Add Sex Conduct Entry</button>
          </div>
        </div>
      `;
      return;
    }

    let html = `
      <div class="table-actions-bar">
        <div class="bar-left">
          <span class="section-subtitle">Evaluating our past conduct against the 9 Big Book questions (p. 69)</span>
        </div>
        <div class="bar-right">
          <button class="btn btn-sm btn-primary" onclick="InventoryForms.openSexConductModal()">+ Add Entry</button>
        </div>
      </div>

      <div class="cards-grid">
        ${sexConduct.map(s => `
          <div class="inventory-card">
            <div class="card-header">
              <h4 class="card-title">${this.escape(s.person)}</h4>
              <div class="card-controls">
                <button class="btn-icon" onclick="InventoryForms.openSexConductModal('${s.id}')">✏️</button>
                <button class="btn-icon text-danger" onclick="AppUI.confirmDeleteSexConduct('${s.id}')">🗑️</button>
              </div>
            </div>
            <div class="card-body">
              <div class="questions-table">
                <div class="q-row"><strong>1. Selfish:</strong> <span>${this.escape(s.selfish || '—')}</span></div>
                <div class="q-row"><strong>2. Dishonest:</strong> <span>${this.escape(s.dishonest || '—')}</span></div>
                <div class="q-row"><strong>3. Inconsiderate:</strong> <span>${this.escape(s.inconsiderate || '—')}</span></div>
                <div class="q-row"><strong>4. Whom did we hurt:</strong> <span>${this.escape(s.hurt || '—')}</span></div>
                <div class="q-row"><strong>5. Jealousy / Bitterness aroused:</strong> <span>${this.escape(s.jealousy || '—')}</span></div>
                <div class="q-row"><strong>6. Where at fault:</strong> <span>${this.escape(s.whereAtFault || '—')}</span></div>
                <div class="q-row"><strong>7. What should have done:</strong> <span>${this.escape(s.whatShouldHaveDone || '—')}</span></div>
              </div>

              ${s.soundSaneIdeal ? `
                <div class="card-section mt-2 highlight-box">
                  <span class="field-title">8. Sound & Sane Ideal for the Future:</span>
                  <p>${this.escape(s.soundSaneIdeal)}</p>
                </div>
              ` : ''}

              ${s.willingAmends ? `
                <div class="card-section mt-1">
                  <span class="field-title">9. Willingness to Make Amends (Steps 8/9):</span>
                  <p>${this.escape(s.willingAmends)}</p>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.innerHTML = html;
  },

  confirmDeleteSexConduct(id) {
    if (confirm('Delete this sex conduct entry?')) {
      window.inventoryStore.deleteSexConduct(id);
      this.showToast('Entry deleted.');
    }
  },

  // --- HARMS VIEW ---
  renderHarms() {
    const container = document.getElementById('harmsList');
    if (!container) return;

    const harms = window.inventoryStore.state.harms;

    if (harms.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⚖️</div>
          <h3>No Harms Listed Yet</h3>
          <p>List other people or institutions harmed through dishonesty, theft, or broken promises.</p>
          <div class="empty-actions">
            <button class="btn btn-primary" onclick="InventoryForms.openHarmModal()">+ Add Harm Entry</button>
          </div>
        </div>
      `;
      return;
    }

    let html = `
      <div class="table-actions-bar">
        <div class="bar-left">
          <span class="section-subtitle">General harms inventory preparing for Steps 8 & 9</span>
        </div>
        <div class="bar-right">
          <button class="btn btn-sm btn-primary" onclick="InventoryForms.openHarmModal()">+ Add Harm</button>
        </div>
      </div>

      <div class="cards-grid">
        ${harms.map(h => `
          <div class="inventory-card">
            <div class="card-header">
              <h4 class="card-title">${this.escape(h.person)}</h4>
              <div class="card-controls">
                <button class="btn-icon" onclick="InventoryForms.openHarmModal('${h.id}')">✏️</button>
                <button class="btn-icon text-danger" onclick="AppUI.confirmDeleteHarm('${h.id}')">🗑️</button>
              </div>
            </div>
            <div class="card-body">
              <div class="card-section">
                <span class="field-title">Harm Done:</span>
                <p>${this.escape(h.description)}</p>
              </div>

              ${h.financialHarm ? `
                <div class="card-section">
                  <span class="financial-badge">💰 Financial Harm: ${this.escape(h.financialAmount || 'Indicated')}</span>
                </div>
              ` : ''}

              <div class="card-section">
                <span class="field-title">Restitution Plan:</span>
                <p>${this.escape(h.restitutionPlan || 'To be determined with sponsor')}</p>
              </div>

              <div class="card-section">
                <span class="field-title">Willingness:</span>
                <span class="willingness-tag tag-${h.willingness.replace(/ /g, '-').toLowerCase()}">${this.escape(h.willingness)}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.innerHTML = html;
  },

  confirmDeleteHarm(id) {
    if (confirm('Delete this harm entry?')) {
      window.inventoryStore.deleteHarm(id);
      this.showToast('Harm entry deleted.');
    }
  },

  // --- 14-DAY PRAYER TRACKER VIEW ---
  renderPrayerTracker() {
    const container = document.getElementById('prayerTrackerView');
    if (!container) return;

    const resentments = window.inventoryStore.state.resentments;

    let html = `
      <div class="prayer-tracker-hero">
        <div class="hero-content">
          <h2>14-Day Freedom from Resentment Practice</h2>
          <p>"If you have a resentment you want to be free of, pray for that person or institution every day for 14 days. Ask for everything you want for yourself to be given to them—health, prosperity, happiness, and peace of mind."</p>
          <div class="prayer-hero-buttons">
            <button class="btn btn-secondary btn-sm" onclick="window.soundService.playChime(432)">🔔 Chime Prayer Bell</button>
            <button class="btn btn-primary btn-sm" onclick="AppUI.openSickManPrayerModal()">📜 Read Sick Man's Prayer</button>
          </div>
        </div>
      </div>

      <div class="tracker-list">
        ${resentments.map(r => {
          const days = Array.isArray(r.prayerDaysCompleted) ? r.prayerDaysCompleted : new Array(14).fill(false);
          const completedCount = days.filter(Boolean).length;
          const pct = Math.round((completedCount / 14) * 100);

          return `
            <div class="tracker-card">
              <div class="tracker-card-header">
                <div>
                  <h4 class="tracker-title">${this.escape(r.target)} <span class="category-badge">${this.escape(r.category || 'Person')}</span></h4>
                  <p class="tracker-sub">Cause: ${this.escape(r.cause)}</p>
                </div>
                <div class="tracker-progress-badge ${completedCount === 14 ? 'badge-complete' : ''}">
                  ${completedCount === 14 ? '✨ 14/14 Completed!' : `${completedCount}/14 Days`}
                </div>
              </div>

              <div class="prayer-days-grid">
                ${days.map((isDone, idx) => `
                  <button type="button" class="day-check-btn ${isDone ? 'checked' : ''}" onclick="AppUI.handleTogglePrayerDay('${r.id}', ${idx})">
                    <span class="day-num">Day ${idx + 1}</span>
                    <span class="day-icon">${isDone ? '✓' : '○'}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.innerHTML = html;
  },

  handleTogglePrayerDay(id, dayIndex) {
    const isNowDone = window.inventoryStore.togglePrayerDay(id, dayIndex);
    if (isNowDone) {
      window.soundService.playChime(432 + (dayIndex * 15));
      this.showToast(`Day ${dayIndex + 1} checked!`);
    }
    this.renderPrayerTracker();
  },

  openSickManPrayerModal() {
    const title = "The Sick Man's Prayer (Big Book p. 67)";
    const content = `
      <div class="prayer-dialog-content">
        <div class="prayer-meditation-box">
          <p class="prayer-lead">"This was our course: We realized that the people who wronged us were perhaps spiritually sick. Though we did not like their symptoms and the way these disturbed us, they, like ourselves, were sick too."</p>
          <hr class="prayer-divider">
          <blockquote class="prayer-quote">
            "God, please help me show them the same tolerance, pity, and patience that I would cheerfully grant a sick friend.<br><br>
            This is a sick person. How can I be helpful to them? God save me from being angry.<br><br>
            <strong>Thy will be done.</strong>"
          </blockquote>
        </div>
        <div class="text-center mt-3">
          <button class="btn btn-secondary btn-sm" onclick="window.soundService.playChime(528)">🔔 Ring Transformation Chime (528Hz)</button>
        </div>
        <div class="modal-footer mt-3">
          <button class="btn btn-primary" onclick="AppUI.closeModal()">Amen / Close</button>
        </div>
      </div>
    `;
    this.showModal(title, content);
  },

  // --- CONTEMPLATION TIMER MODAL ---
  openContemplationTimerModal() {
    const title = "Quiet Contemplation & Meditation Timer";
    const content = `
      <div class="timer-modal-content text-center">
        <div class="timer-icon">⏳</div>
        <p class="timer-desc">Before writing your inventory, take a few moments of quiet reflection and prayer to clear your mind.</p>
        
        <div class="timer-display" id="timerDisplay">05:00</div>

        <div class="timer-presets-row mt-2">
          <button class="btn btn-outline btn-sm" onclick="AppUI.setTimerPreset(180)">3 Minutes</button>
          <button class="btn btn-outline btn-sm" onclick="AppUI.setTimerPreset(300)">5 Minutes</button>
          <button class="btn btn-outline btn-sm" onclick="AppUI.setTimerPreset(600)">10 Minutes</button>
        </div>

        <div class="timer-controls mt-3">
          <button class="btn btn-primary" id="btnTimerStart" onclick="AppUI.startTimer()">Start Reflection</button>
          <button class="btn btn-secondary" id="btnTimerStop" onclick="AppUI.stopTimer()" style="display: none;">Stop</button>
        </div>

        <div class="modal-footer mt-3">
          <button class="btn btn-secondary" onclick="AppUI.closeModal()">Close</button>
        </div>
      </div>
    `;
    this.showModal(title, content);
    this.selectedTimerSeconds = 300;
  },

  setTimerPreset(sec) {
    this.selectedTimerSeconds = sec;
    const disp = document.getElementById('timerDisplay');
    if (disp) {
      const m = Math.floor(sec / 60).toString().padStart(2, '0');
      const s = (sec % 60).toString().padStart(2, '0');
      disp.textContent = `${m}:${s}`;
    }
  },

  startTimer() {
    const startBtn = document.getElementById('btnTimerStart');
    const stopBtn = document.getElementById('btnTimerStop');
    if (startBtn) startBtn.style.display = 'none';
    if (stopBtn) stopBtn.style.display = 'inline-flex';

    window.soundService.startTimer(
      this.selectedTimerSeconds,
      (remain) => {
        const disp = document.getElementById('timerDisplay');
        if (disp) {
          const m = Math.floor(remain / 60).toString().padStart(2, '0');
          const s = (remain % 60).toString().padStart(2, '0');
          disp.textContent = `${m}:${s}`;
        }
      },
      () => {
        if (startBtn) startBtn.style.display = 'inline-flex';
        if (stopBtn) stopBtn.style.display = 'none';
        this.showToast('Contemplation complete.');
      }
    );
  },

  stopTimer() {
    window.soundService.stopTimer();
    const startBtn = document.getElementById('btnTimerStart');
    const stopBtn = document.getElementById('btnTimerStop');
    if (startBtn) startBtn.style.display = 'inline-flex';
    if (stopBtn) stopBtn.style.display = 'none';
    this.setTimerPreset(this.selectedTimerSeconds);
  },

  // --- PATTERNS & ANALYTICS VIEW ---
  renderPatterns() {
    const container = document.getElementById('patternsView');
    if (!container) return;

    const stats = window.inventoryStore.getPatternAnalytics();

    let instinctBars = '';
    const maxInstinct = Math.max(...Object.values(stats.instinctCounts), 1);

    BIG_BOOK_DATA.glossary.instincts.forEach(inst => {
      const count = stats.instinctCounts[inst.id] || 0;
      const pct = Math.round((count / maxInstinct) * 100);
      instinctBars += `
        <div class="pattern-bar-row">
          <div class="bar-label">
            <strong>${inst.name}</strong>
            <span class="count-badge">${count} threatened</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${pct}%;"></div>
          </div>
          <span class="bar-description">${inst.description}</span>
        </div>
      `;
    });

    let html = `
      <div class="patterns-dashboard">
        <div class="stats-cards-row">
          <div class="stat-card">
            <div class="stat-number">${stats.totalResentments}</div>
            <div class="stat-label">Total Resentments</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${stats.turnaroundsCompleted} / ${stats.totalResentments}</div>
            <div class="stat-label">Turnarounds Done</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${stats.totalFears}</div>
            <div class="stat-label">Fears Disclosed</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${stats.totalSexConduct}</div>
            <div class="stat-label">Sex Reviews</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${stats.totalHarms + stats.amendsIdentified}</div>
            <div class="stat-label">Amends Flagged</div>
          </div>
        </div>

        <div class="patterns-grid-2">
          <div class="dashboard-panel">
            <h3>Threatened Instincts Analysis</h3>
            <p class="panel-subtitle">Which instinctive drives were repeatedly threatened by resentments and fear?</p>
            <div class="instinct-bars-container">
              ${instinctBars}
            </div>
          </div>

          <div class="dashboard-panel">
            <h3>Column 4 Defects & Spiritual Assets</h3>
            <p class="panel-subtitle">"Where had we been selfish, dishonest, self-seeking and frightened?"</p>

            <div class="defect-stats-box">
              <div class="defect-stat-item">
                <span class="defect-title">Selfish</span>
                <span class="defect-val">${stats.defectCounts.selfish}</span>
                <span class="defect-sub">Opposite Asset: <strong>Generous / Selfless</strong></span>
              </div>
              <div class="defect-stat-item">
                <span class="defect-title">Dishonest</span>
                <span class="defect-val">${stats.defectCounts.dishonest}</span>
                <span class="defect-sub">Opposite Asset: <strong>Rigorous Honesty</strong></span>
              </div>
              <div class="defect-stat-item">
                <span class="defect-title">Self-Seeking</span>
                <span class="defect-val">${stats.defectCounts.selfSeeking}</span>
                <span class="defect-sub">Opposite Asset: <strong>Loving Service</strong></span>
              </div>
              <div class="defect-stat-item">
                <span class="defect-title">Frightened</span>
                <span class="defect-val">${stats.defectCounts.frightened}</span>
                <span class="defect-sub">Opposite Asset: <strong>Courage & Faith</strong></span>
              </div>
            </div>

            <div class="insight-box mt-3">
              <h4>Key Big Book Insight (p. 62)</h4>
              <p>"Selfishness - self-centeredness! That, we think, is the root of our troubles. Driven by a hundred forms of fear, self-delusion, self-seeking, and self-pity, we step on the toes of our fellows and they retaliate."</p>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  // --- STEP 5 REVIEW & SPONSOR PACKET ---
  renderStep5Review() {
    const container = document.getElementById('step5View');
    if (!container) return;

    const s = window.inventoryStore.state;

    let html = `
      <div class="step5-header-actions no-print">
        <div class="header-info">
          <h2>Step 5 Sponsor Review Packet</h2>
          <p>"Admitted to God, to ourselves, and to another human being the exact nature of our wrongs." (p. 59)</p>
        </div>
        <div class="header-buttons">
          <button class="btn btn-primary" onclick="window.print()">🖨️ Print / Save as PDF</button>
          <button class="btn btn-secondary" onclick="AppUI.openExportModal()">💾 Export Markdown / CSV</button>
        </div>
      </div>

      <div class="sponsor-packet-document">
        <div class="packet-cover">
          <h1>Fourth Step Moral Inventory</h1>
          <h3>Alcoholics Anonymous (Big Book pp. 64-71)</h3>
          <p class="packet-meta">Prepared for Step 5 Review • Confidential & Sacred</p>
        </div>

        <section class="packet-section">
          <h2>Part I: Resentment Inventory (The Four Columns)</h2>
          <table class="packet-table">
            <thead>
              <tr>
                <th style="width: 20%;">1. I'm Resentful At</th>
                <th style="width: 25%;">2. The Cause</th>
                <th style="width: 20%;">3. Affects My</th>
                <th style="width: 35%;">4. The Turnaround (My Mistakes & Spiritual Asset)</th>
              </tr>
            </thead>
            <tbody>
              ${s.resentments.map(r => `
                <tr>
                  <td><strong>${this.escape(r.target)}</strong><br><small class="text-muted">(${this.escape(r.category)})</small></td>
                  <td>${this.escape(r.cause)}</td>
                  <td>${Array.isArray(r.affects) ? r.affects.map(a => a.replace('_', ' ')).join(', ') : 'None'}</td>
                  <td>
                    ${r.selfish ? `<div><em>Selfish:</em> ${this.escape(r.selfish)}</div>` : ''}
                    ${r.dishonest ? `<div><em>Dishonest:</em> ${this.escape(r.dishonest)}</div>` : ''}
                    ${r.selfSeeking ? `<div><em>Self-Seeking:</em> ${this.escape(r.selfSeeking)}</div>` : ''}
                    ${r.frightened ? `<div><em>Frightened:</em> ${this.escape(r.frightened)}</div>` : ''}
                    ${r.myPart ? `<div class="packet-part"><strong>My Mistakes:</strong> ${this.escape(r.myPart)}</div>` : ''}
                    ${r.oppositeAsset ? `<div class="packet-asset"><strong>Asset to Cultivate:</strong> ${this.escape(r.oppositeAsset)}</div>` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </section>

        <section class="packet-section page-break">
          <h2>Part II: Fear Inventory (pp. 67-68)</h2>
          <table class="packet-table">
            <thead>
              <tr>
                <th style="width: 25%;">What is the Fear?</th>
                <th style="width: 25%;">Why Do I Have It?</th>
                <th style="width: 25%;">Where Self-Reliance Failed</th>
                <th style="width: 25%;">Spiritual Turnaround (Fear Prayer)</th>
              </tr>
            </thead>
            <tbody>
              ${s.fears.map(f => `
                <tr>
                  <td><strong>${this.escape(f.fear)}</strong></td>
                  <td>${this.escape(f.why)}</td>
                  <td>${this.escape(f.selfReliancePart || '—')}</td>
                  <td>${this.escape(f.prayerPractice || '—')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </section>

        <section class="packet-section page-break">
          <h2>Part III: Sex Conduct & Relationship Inventory (pp. 68-70)</h2>
          ${s.sexConduct.map((sc, idx) => `
            <div class="packet-entry-box">
              <h4>${idx + 1}. Relationship with: ${this.escape(sc.person)}</h4>
              <div class="entry-grid-2">
                <div><strong>Selfish:</strong> ${this.escape(sc.selfish || '—')}</div>
                <div><strong>Dishonest:</strong> ${this.escape(sc.dishonest || '—')}</div>
                <div><strong>Inconsiderate:</strong> ${this.escape(sc.inconsiderate || '—')}</div>
                <div><strong>Whom hurt:</strong> ${this.escape(sc.hurt || '—')}</div>
                <div><strong>Aroused Jealousy:</strong> ${this.escape(sc.jealousy || '—')}</div>
                <div><strong>Where at fault:</strong> ${this.escape(sc.whereAtFault || '—')}</div>
                <div><strong>What should have done:</strong> ${this.escape(sc.whatShouldHaveDone || '—')}</div>
                <div><strong>Sound & sane ideal:</strong> ${this.escape(sc.soundSaneIdeal || '—')}</div>
              </div>
            </div>
          `).join('')}
        </section>

        <section class="packet-section page-break">
          <h2>Part IV: Harms to Others (Step 8 & 9 Preparation)</h2>
          <table class="packet-table">
            <thead>
              <tr>
                <th style="width: 25%;">Person / Institution Harmed</th>
                <th style="width: 40%;">Harm Description</th>
                <th style="width: 20%;">Restitution Plan</th>
                <th style="width: 15%;">Willingness</th>
              </tr>
            </thead>
            <tbody>
              ${s.harms.map(h => `
                <tr>
                  <td><strong>${this.escape(h.person)}</strong></td>
                  <td>${this.escape(h.description)} ${h.financialHarm ? `<br><small><strong>Financial:</strong> ${this.escape(h.financialAmount)}</small>` : ''}</td>
                  <td>${this.escape(h.restitutionPlan || '—')}</td>
                  <td>${this.escape(h.willingness)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </section>

        <section class="packet-section no-print">
          <h2>Sponsor Discussion & Fifth Step Notes</h2>
          <p class="panel-subtitle">Private notes from your Fifth Step sit-down with your sponsor. Automatically saved.</p>
          <textarea id="sponsorNotesInput" class="form-control" rows="6" placeholder="Record feedback, patterns noticed by your sponsor, amends recommendations, and spiritual counsel...">${this.escape(s.sponsorNotes || '')}</textarea>
        </section>

        <section class="packet-section page-break">
          <h2>The Promises of Step Five (Big Book p. 75)</h2>
          <div class="promises-box">
            <p>"Once we have taken this step, withholding nothing, we are delighted. We can look the world in the eye. We can be alone at perfect peace and ease. Our fears fall from us. We begin to feel the nearness of our Creator. We may have had certain spiritual beliefs, but now we begin to have a spiritual experience. The feeling that the drink problem has disappeared will often come strongly. We feel we are on the Broad Highway, walking hand in hand with the Spirit of the Universe."</p>
          </div>
        </section>
      </div>
    `;

    container.innerHTML = html;

    const notesInput = document.getElementById('sponsorNotesInput');
    if (notesInput) {
      notesInput.addEventListener('input', (e) => {
        window.inventoryStore.saveSponsorNotes(e.target.value);
      });
    }
  },

  // --- BIG BOOK GUIDE & TEXT DRAWER ---
  renderGuide() {
    const container = document.getElementById('guideView');
    if (!container) return;

    const excerpts = BIG_BOOK_DATA.excerpts;

    let html = `
      <div class="guide-container">
        <div class="guide-hero">
          <h2>How It Works — Big Book Excerpts & Directions</h2>
          <p>Alcoholics Anonymous, Chapter 5 (Pages 64 through 71) & Chapter 6 (p. 75)</p>
        </div>

        <div class="guide-cards-list">
          <div class="guide-card">
            <h3>${excerpts.inventoryIntro.title} <span class="page-tag">${excerpts.inventoryIntro.page}</span></h3>
            <p class="quote-body">"${excerpts.inventoryIntro.quote}"</p>
          </div>

          <div class="guide-card">
            <h3>${excerpts.resentmentIntro.title} <span class="page-tag">${excerpts.resentmentIntro.page}</span></h3>
            <p class="quote-body">"${excerpts.resentmentIntro.quote}"</p>
          </div>

          <div class="guide-card highlight-card">
            <h3>${excerpts.column4Turnaround.title} <span class="page-tag">${excerpts.column4Turnaround.page}</span></h3>
            <p class="quote-body">"${excerpts.column4Turnaround.quote}"</p>
          </div>

          <div class="guide-card prayer-card">
            <h3>${excerpts.resentmentPrayer.title} <span class="page-tag">${excerpts.resentmentPrayer.page}</span></h3>
            <p class="quote-body">"${excerpts.resentmentPrayer.quote}"</p>
          </div>

          <div class="guide-card">
            <h3>${excerpts.fourteenDayPrayer.title} <span class="page-tag">${excerpts.fourteenDayPrayer.page}</span></h3>
            <p class="quote-body">"${excerpts.fourteenDayPrayer.quote}"</p>
          </div>

          <div class="guide-card">
            <h3>${excerpts.fearIntro.title} <span class="page-tag">${excerpts.fearIntro.page}</span></h3>
            <p class="quote-body">"${excerpts.fearIntro.quote}"</p>
          </div>

          <div class="guide-card prayer-card">
            <h3>${excerpts.fearPrayer.title} <span class="page-tag">${excerpts.fearPrayer.page}</span></h3>
            <p class="quote-body">"${excerpts.fearPrayer.quote}"</p>
          </div>

          <div class="guide-card">
            <h3>${excerpts.sexConductIntro.title} <span class="page-tag">${excerpts.sexConductIntro.page}</span></h3>
            <p class="quote-body">"${excerpts.sexConductIntro.quote}"</p>
          </div>

          <div class="guide-card">
            <h3>${excerpts.step5Promise.title} <span class="page-tag">${excerpts.step5Promise.page}</span></h3>
            <p class="quote-body">"${excerpts.step5Promise.quote}"</p>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  // --- MODAL UTILITIES ---
  showModal(title, bodyHtml) {
    const modal = document.getElementById('appModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    if (modal && modalTitle && modalBody) {
      modalTitle.textContent = title;
      modalBody.innerHTML = bodyHtml;
      modal.classList.add('active');
    }
  },

  closeModal() {
    const modal = document.getElementById('appModal');
    if (modal) {
      modal.classList.remove('active');
    }
  },

  showToast(message) {
    let toast = document.getElementById('appToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'appToast';
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  },

  // --- SECURITY / PIN LOCK MODAL ---
  showPinModal(isUnlocking = false) {
    const title = isUnlocking ? 'Enter Passcode' : 'Configure Passcode & Encryption';
    const contentHtml = `
      <div class="pin-modal-content">
        <div class="pin-icon">🔒</div>
        <p class="pin-desc">
          ${isUnlocking ? 'Your inventory is locked with AES-256-GCM encryption. Enter your passcode to unlock.' : 'Set an optional PIN passcode to encrypt your inventory on this computer.'}
        </p>

        <div class="form-group text-center">
          <input type="password" id="pinInput" class="form-control pin-input" maxlength="12" placeholder="••••" autofocus>
          <div id="pinError" class="text-danger mt-1" style="display: none;">Incorrect passcode. Please try again.</div>
        </div>

        <div class="modal-footer">
          <div class="footer-left"></div>
          <div class="footer-right">
            ${isUnlocking ? `
              <button type="button" class="btn btn-primary" id="btnSubmitPin">Unlock</button>
            ` : `
              <button type="button" class="btn btn-secondary" onclick="AppUI.closeModal()">Cancel</button>
              <button type="button" class="btn btn-primary" id="btnSaveNewPin">Set Passcode</button>
            `}
          </div>
        </div>
      </div>
    `;

    this.showModal(title, contentHtml);

    const pinInput = document.getElementById('pinInput');
    const pinError = document.getElementById('pinError');

    if (isUnlocking) {
      const submitBtn = document.getElementById('btnSubmitPin');
      const tryUnlock = async () => {
        const pin = pinInput.value;
        const valid = await window.inventoryStore.verifyPin(pin);
        if (valid) {
          window.soundService.playChime(528);
          this.closeModal();
          this.showToast('Inventory unlocked.');
        } else {
          pinError.style.display = 'block';
          pinInput.value = '';
          pinInput.focus();
        }
      };

      submitBtn.addEventListener('click', tryUnlock);
      pinInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') tryUnlock();
      });
    }
  },

  openSecuritySettings() {
    const pinEnabled = window.inventoryStore.settings.pinEnabled;
    const title = 'Privacy & Security Settings';
    const contentHtml = `
      <div class="settings-modal-content">
        <div class="settings-card">
          <h4>Passcode & AES-256-GCM Encryption</h4>
          <p>Protect your inventory with a local passcode. All inventory entries are cryptographically encrypted using Web Crypto AES-GCM before saving to your browser.</p>

          ${pinEnabled ? `
            <div class="alert-success-box">
              Passcode encryption is currently <strong>ACTIVE</strong>.
            </div>
            <div class="mt-2 button-row">
              <button class="btn btn-danger btn-sm" id="btnDisablePin">Remove Passcode</button>
              <button class="btn btn-secondary btn-sm" id="btnChangePin">Change Passcode</button>
            </div>
          ` : `
            <div class="form-group">
              <label for="newPinInput">Enter New Passcode / PIN:</label>
              <input type="password" id="newPinInput" class="form-control" maxlength="16" placeholder="Enter PIN code">
            </div>
            <button class="btn btn-primary btn-sm" id="btnEnablePin">Enable Passcode & Encryption</button>
          `}
        </div>

        <div class="settings-card mt-3">
          <h4>Data Management</h4>
          <p>Export your inventory for safe offline storage or erase local data.</p>
          <div class="button-row">
            <button class="btn btn-secondary btn-sm" onclick="AppUI.openExportModal()">Backup / Export</button>
            <button class="btn btn-danger btn-sm" onclick="AppUI.confirmResetAll()">Clear All Inventory Data</button>
          </div>
        </div>
      </div>
    `;

    this.showModal(title, contentHtml);

    if (pinEnabled) {
      const btnDisable = document.getElementById('btnDisablePin');
      if (btnDisable) {
        btnDisable.addEventListener('click', async () => {
          if (confirm('Remove passcode protection and decrypt storage?')) {
            await window.inventoryStore.setPin(null);
            this.closeModal();
            this.showToast('Passcode protection disabled.');
          }
        });
      }
      const btnChange = document.getElementById('btnChangePin');
      if (btnChange) {
        btnChange.addEventListener('click', () => {
          const newPin = prompt('Enter your new passcode:');
          if (newPin) {
            window.inventoryStore.setPin(newPin);
            this.closeModal();
            this.showToast('Passcode updated.');
          }
        });
      }
    } else {
      const btnEnable = document.getElementById('btnEnablePin');
      const newPinInput = document.getElementById('newPinInput');
      if (btnEnable && newPinInput) {
        btnEnable.addEventListener('click', async () => {
          const pin = newPinInput.value.trim();
          if (!pin) {
            alert('Please enter a passcode.');
            return;
          }
          await window.inventoryStore.setPin(pin);
          this.closeModal();
          this.showToast('Passcode protection enabled.');
        });
      }
    }
  },

  confirmResetAll() {
    if (confirm('WARNING: Are you sure you want to completely erase all resentments, fears, sex conduct, and harms? This cannot be undone.')) {
      if (confirm('Please confirm once more: Erase all 4th step inventory data?')) {
        window.inventoryStore.clearAllData();
        this.closeModal();
        this.showToast('All inventory data cleared.');
      }
    }
  },

  // --- EXPORT / IMPORT MODAL ---
  openExportModal() {
    const title = 'Backup, Export & Import';
    const contentHtml = `
      <div class="export-modal-content">
        <p>Your 4th Step data is stored only in this browser. Keep a private offline backup for your peace of mind.</p>

        <div class="export-options-grid">
          <div class="export-card">
            <h4>📄 Markdown Document (.md)</h4>
            <p>Formatted document with tables, Column 4 turnarounds, prayers, and reflections.</p>
            <button class="btn btn-primary btn-sm" id="btnDownloadMd">Download Markdown</button>
          </div>

          <div class="export-card">
            <h4>📊 Spreadsheet CSV</h4>
            <p>4-Column Resentment inventory formatted for Excel, Numbers, or Sheets.</p>
            <button class="btn btn-secondary btn-sm" id="btnDownloadCsv">Download CSV</button>
          </div>

          <div class="export-card">
            <h4>💾 JSON Data Backup</h4>
            <p>Full raw backup of your entire inventory for restoring on any device.</p>
            <button class="btn btn-secondary btn-sm" id="btnDownloadJson">Download JSON</button>
          </div>

          <div class="export-card">
            <h4>📂 Restore / Import Backup</h4>
            <p>Upload a previously exported JSON backup file.</p>
            <input type="file" id="importFileInput" accept=".json" style="display: none;">
            <button class="btn btn-outline btn-sm" onclick="document.getElementById('importFileInput').click()">Choose JSON File...</button>
          </div>
        </div>

        <div class="modal-footer mt-3">
          <button class="btn btn-secondary" onclick="AppUI.closeModal()">Close</button>
        </div>
      </div>
    `;

    this.showModal(title, contentHtml);

    document.getElementById('btnDownloadMd').addEventListener('click', () => {
      const md = window.inventoryStore.exportMarkdown();
      this.downloadFile('Fourth_Step_Inventory.md', md, 'text/markdown');
    });

    document.getElementById('btnDownloadCsv').addEventListener('click', () => {
      const csv = window.inventoryStore.exportCSV();
      this.downloadFile('AA_Resentments_4_Columns.csv', csv, 'text/csv');
    });

    document.getElementById('btnDownloadJson').addEventListener('click', () => {
      const json = window.inventoryStore.exportJSON();
      this.downloadFile('aa_fourth_step_backup.json', json, 'application/json');
    });

    document.getElementById('importFileInput').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const res = window.inventoryStore.importJSON(evt.target.result);
        if (res.success) {
          this.closeModal();
          this.showToast('Inventory successfully imported.');
        } else {
          alert('Import failed: ' + res.error);
        }
      };
      reader.readAsText(file);
    });
  },

  downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast('Download started: ' + filename);
  },

  escape(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AppUI.init();
});
