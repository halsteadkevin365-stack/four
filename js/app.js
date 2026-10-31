/**
 * Main Application Controller & UI Render Engine
 * Completely Reimagined for Maximum Serenity, Intuition, and Spiritual Freedom.
 */

const AppUI = {
  currentTab: 'resentments',
  viewMode: 'cards', // 'cards' | 'ledger'
  searchQuery: '',
  categoryFilter: 'all',
  turnaroundFilter: 'all',
  anonymizeMode: false,
  timerInterval: null,

  init() {
    this.bindEvents();
    this.setupDialogPolyfill();
    this.applyTheme(window.inventoryStore.settings.theme || 'parchment');
    this.checkLockState();

    window.inventoryStore.subscribe((event, data) => {
      this.handleStoreEvent(event, data);
    });

    this.render();
  },

  setupDialogPolyfill() {
    const dialogs = document.querySelectorAll('dialog');
    dialogs.forEach(dialog => {
      // Fallback for browsers without closedby support (per modern-web-guidance)
      if (!('closedBy' in HTMLDialogElement.prototype)) {
        dialog.addEventListener('click', (event) => {
          if (event.target !== dialog) return;
          const rect = dialog.getBoundingClientRect();
          const isDialogContent = (
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width
          );
          if (isDialogContent) return;
          dialog.close();
        });
      }
    });
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
    // Nav Pills
    document.querySelectorAll('.nav-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Zen Hub Toggle
    const btnZen = document.getElementById('btnZenHub');
    if (btnZen) {
      btnZen.addEventListener('click', () => {
        const drawer = document.getElementById('zenDrawer');
        const isOpen = drawer.style.display !== 'none';
        this.toggleZenDrawer(!isOpen);
      });
    }

    // Ambient Rain Audio Toggle
    const btnAmbient = document.getElementById('btnToggleAmbient');
    if (btnAmbient) {
      btnAmbient.addEventListener('click', () => {
        const isPlaying = window.soundService.toggleAmbient();
        btnAmbient.classList.toggle('btn-primary', isPlaying);
        btnAmbient.textContent = isPlaying ? '🔊 Rain Playing' : '🎵 Play Rain';

        const indicator = document.getElementById('ambientIndicator');
        if (indicator) indicator.style.display = isPlaying ? 'inline-block' : 'none';
      });
    }

    // Volume Slider
    const volSlider = document.getElementById('ambientVolume');
    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        if (window.soundService.ambientGain) {
          window.soundService.ambientGain.gain.setValueAtTime(parseFloat(e.target.value), window.soundService.audioCtx.currentTime);
        }
      });
    }

    // Panic Key: Esc key toggles privacy shield immediately
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const dialog = document.getElementById('appDialog');
        if (dialog && dialog.open) {
          dialog.close();
        } else {
          this.togglePrivacyShield();
        }
      }
    });

    // More Menu Modal
    const btnMore = document.getElementById('btnMoreMenu');
    if (btnMore) {
      btnMore.addEventListener('click', () => {
        document.getElementById('preferencesDialog').showModal();
      });
    }

    // Privacy Shield Button
    const btnPrivacy = document.getElementById('btnPrivacyShield');
    if (btnPrivacy) {
      btnPrivacy.addEventListener('click', () => this.togglePrivacyShield());
    }
  },

  switchTab(tabName) {
    this.currentTab = tabName;

    document.querySelectorAll('.nav-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.tab === tabName);
    });

    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === `pane-${tabName}`);
    });

    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setViewMode(mode) {
    this.viewMode = mode;
    const btnCards = document.getElementById('btnViewCards');
    const btnLedger = document.getElementById('btnViewLedger');
    if (btnCards) btnCards.classList.toggle('active', mode === 'cards');
    if (btnLedger) btnLedger.classList.toggle('active', mode === 'ledger');
    this.renderResentments();
  },

  toggleZenDrawer(forceState) {
    const drawer = document.getElementById('zenDrawer');
    if (drawer) {
      drawer.style.display = forceState ? 'block' : 'none';
    }
  },

  startQuickTimer(minutes) {
    if (this.timerInterval) clearInterval(this.timerInterval);
    let secondsLeft = minutes * 60;
    this.showToast(`Timer started: ${minutes} minutes of quiet contemplation.`);
    window.soundService.playChime(432);

    this.timerInterval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft <= 0) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        window.soundService.playChime(528);
        this.showToast(`Contemplation period ended. Bell chimed (528Hz).`);
      }
    }, 1000);
  },

  togglePrivacyShield(forceState = null) {
    const overlay = document.getElementById('privacyOverlay');
    if (!overlay) return;
    const isCurrentlyActive = overlay.style.display !== 'none';
    const newState = forceState !== null ? forceState : !isCurrentlyActive;
    overlay.style.display = newState ? 'flex' : 'none';
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    window.inventoryStore.settings.theme = theme;
    window.inventoryStore.saveSettings();

    document.querySelectorAll('.theme-tile').forEach(tile => {
      tile.classList.toggle('active', tile.dataset.theme === theme);
    });
  },

  showModal(title, html) {
    const dialog = document.getElementById('appDialog');
    const titleEl = document.getElementById('dialogTitle');
    const bodyEl = document.getElementById('dialogBody');

    if (titleEl) titleEl.textContent = title;
    if (bodyEl) bodyEl.innerHTML = html;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  },

  closeModal() {
    const dialog = document.getElementById('appDialog');
    if (dialog && dialog.open) {
      dialog.close();
    }
  },

  showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },

  maskName(str) {
    if (!this.anonymizeMode || !str) return str;
    const parts = str.split(' ');
    return parts.map(p => {
      if (p.length <= 1) return p;
      return p[0] + '***';
    }).join(' ');
  },

  toggleAnonymize() {
    this.anonymizeMode = !this.anonymizeMode;
    const btn = document.getElementById('btnToggleAnonymize');
    if (btn) {
      btn.textContent = this.anonymizeMode ? '🕶️ Mask Real Names: ON' : '🕶️ Mask Real Names: OFF';
      btn.classList.toggle('btn-primary', this.anonymizeMode);
    }
    this.render();
  },

  escape(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // =========================================================================
  // QUICK BRAIN DUMP ACTIONS
  // =========================================================================
  fillQuickTarget(target) {
    const input = document.getElementById('quickAddTarget');
    if (input) {
      input.value = target;
      input.focus();
    }
  },

  handleQuickAddResentment(e) {
    e.preventDefault();
    const input = document.getElementById('quickAddTarget');
    if (!input || !input.value.trim()) return;

    const target = input.value.trim();
    input.value = '';

    // Directly open the guided walkthrough with this target prefilled!
    InventoryForms.openResentmentModal(null, target);
    this.showToast(`Let's explore your resentment towards ${target}.`);
  },

  fillQuickFear(fear) {
    const input = document.getElementById('quickAddFearInput');
    if (input) {
      input.value = fear;
      input.focus();
    }
  },

  handleQuickAddFear(e) {
    e.preventDefault();
    const input = document.getElementById('quickAddFearInput');
    if (!input || !input.value.trim()) return;

    const fear = input.value.trim();
    input.value = '';
    InventoryForms.openFearModal(null, fear);
    this.showToast(`Reviewing fear: ${fear}`);
  },

  appendWizardCause(phrase) {
    const textarea = document.getElementById('wizardCause');
    if (textarea) {
      textarea.value = (textarea.value ? textarea.value.trim() + ' ' : '') + phrase;
      textarea.focus();
    }
  },

  handleSearch(e) {
    this.searchQuery = e.target.value.trim();
    this.render();
  },

  handleCategoryFilter(e) {
    this.categoryFilter = e.target.value;
    this.render();
  },

  handleTurnaroundFilter(e) {
    this.turnaroundFilter = e.target.value;
    this.render();
  },

  // =========================================================================
  // MASTER RENDER DISPATCHER
  // =========================================================================
  render() {
    this.updateBadges();

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
    } else if (this.currentTab === 'step5') {
      this.renderStep5();
    }
  },

  updateBadges() {
    const s = window.inventoryStore.state;
    const bRes = document.getElementById('badgeResentments');
    const bFear = document.getElementById('badgeFears');
    const bSex = document.getElementById('badgeSexConduct');
    const bHarm = document.getElementById('badgeHarms');
    const bPray = document.getElementById('badgePrayerTracker');

    if (bRes) bRes.textContent = s.resentments.length;
    if (bFear) bFear.textContent = s.fears.length;
    if (bSex) bSex.textContent = s.sexConduct.length;
    if (bHarm) bHarm.textContent = s.harms.length;

    // Header summary counters
    const totalCount = s.resentments.length + s.fears.length + s.sexConduct.length + s.harms.length;
    const completedTurnarounds = s.resentments.filter(r => r.myPart && r.myPart.trim().length > 0).length;
    const pendingTurnarounds = s.resentments.length - completedTurnarounds;

    const sTotal = document.getElementById('summaryTotalCount');
    const sComplete = document.getElementById('summaryCompletedCount');
    const sDraft = document.getElementById('summaryDraftCount');

    if (sTotal) sTotal.textContent = `${totalCount} Total Entries`;
    if (sComplete) sComplete.textContent = `${completedTurnarounds} Free (Turnaround Done)`;
    if (sDraft) sDraft.textContent = `${pendingTurnarounds} In Progress`;

    const activePrayers = s.resentments.filter(r => Array.isArray(r.prayerDaysCompleted) && r.prayerDaysCompleted.some(d => d)).length;
    if (bPray) bPray.textContent = activePrayers;
  },

  // =========================================================================
  // 1. RENDER RESENTMENTS VIEW (Dual Cards & Classic Ledger)
  // =========================================================================
  renderResentments() {
    const container = document.getElementById('resentmentsViewArea');
    if (!container) return;

    const resentments = window.inventoryStore.state.resentments;

    if (resentments.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🧭</div>
          <h3>Your Slate is Clean</h3>
          <p>
            "In dealing with resentments, we set them on paper. We listed people, institutions or principles with whom we were angry."
            Use the Brain-Dump bar above or load authentic 1939 Big Book examples.
          </p>
          <div class="empty-actions">
            <button class="btn btn-primary" onclick="InventoryForms.openResentmentModal()">+ Walk Me Through a Resentment</button>
            <button class="btn btn-secondary" onclick="window.inventoryStore.loadSampleData(); AppUI.render(); AppUI.showToast('Big Book examples loaded.');">📥 Load Big Book Examples</button>
          </div>
        </div>
      `;
      return;
    }

    // Filter logic
    let filtered = resentments.filter(r => {
      const q = this.searchQuery.toLowerCase();
      const matchesSearch = !q ||
        r.target.toLowerCase().includes(q) ||
        r.cause.toLowerCase().includes(q) ||
        (r.myPart && r.myPart.toLowerCase().includes(q));

      const matchesCategory = this.categoryFilter === 'all' || r.category === this.categoryFilter;

      let matchesTurnaround = true;
      const hasTurnaround = r.myPart && r.myPart.trim().length > 0;
      if (this.turnaroundFilter === 'complete') matchesTurnaround = hasTurnaround;
      else if (this.turnaroundFilter === 'incomplete') matchesTurnaround = !hasTurnaround;
      else if (this.turnaroundFilter === 'amends') matchesTurnaround = r.amendsNeeded === true;
      else if (this.turnaroundFilter === 'prayer') {
        matchesTurnaround = Array.isArray(r.prayerDaysCompleted) && r.prayerDaysCompleted.some(d => d);
      }

      return matchesSearch && matchesCategory && matchesTurnaround;
    });

    if (this.viewMode === 'ledger') {
      container.innerHTML = this.renderResentmentsLedger(filtered);
    } else {
      container.innerHTML = this.renderResentmentsCards(filtered);
    }
  },

  renderResentmentsCards(items) {
    if (items.length === 0) {
      return `<div class="empty-state"><p>No resentments match your search and filter criteria.</p></div>`;
    }

    const cardsHtml = items.map(r => {
      const hasTurnaround = r.myPart && r.myPart.trim().length > 0;
      const prayerDays = Array.isArray(r.prayerDaysCompleted) ? r.prayerDaysCompleted.filter(d => d).length : 0;

      const instinctPills = Array.isArray(r.affects) && r.affects.length > 0
        ? r.affects.map(inst => {
            const item = BIG_BOOK_DATA.glossary.instincts.find(i => i.id === inst);
            return `<span class="instinct-badge">${item ? item.name : inst}</span>`;
          }).join('')
        : `<span class="text-muted" style="font-size:0.75rem;">None selected</span>`;

      return `
        <div class="item-card ${hasTurnaround ? 'item-card-complete' : 'item-card-draft'}">
          <div class="card-top">
            <div class="target-badge-group">
              <div class="card-target-name">${this.escape(this.maskName(r.target))}</div>
              <span class="card-category">${this.escape(r.category || 'Person')}</span>
            </div>
            <span class="card-status-pill ${hasTurnaround ? 'status-complete' : 'status-pending'}">
              ${hasTurnaround ? '✓ Freedom Found' : '⚠️ Turnaround Needed'}
            </span>
          </div>

          <!-- Cause -->
          <div class="card-cause-box">
            <div class="card-cause-label">Column 2: The Cause</div>
            <p class="card-cause-text">${this.escape(r.cause || 'No cause specified yet.')}</p>
          </div>

          <!-- Affects -->
          <div class="card-instincts-row">
            <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted); margin-right:0.25rem;">Hurt Areas:</span>
            ${instinctPills}
          </div>

          <!-- Turnaround Box -->
          ${hasTurnaround ? `
            <div class="card-turnaround-box">
              <div class="turnaround-box-header">
                <span class="turnaround-title">Column 4: The Turnaround</span>
                <div class="defects-chips-row">
                  ${r.selfish ? '<span class="defect-chip-tag">Selfish</span>' : ''}
                  ${r.dishonest ? '<span class="defect-chip-tag">Dishonest</span>' : ''}
                  ${r.selfSeeking ? '<span class="defect-chip-tag">Self-Seeking</span>' : ''}
                  ${r.frightened ? '<span class="defect-chip-tag">Frightened</span>' : ''}
                </div>
              </div>
              <p class="card-mypart-text">"${this.escape(r.myPart)}"</p>
              ${r.oppositeAsset ? `<div class="asset-highlight">🌿 <strong>Asset:</strong> ${this.escape(r.oppositeAsset)}</div>` : ''}
            </div>
          ` : `
            <div class="card-turnaround-box" style="background:var(--accent-light); border-color:var(--accent);">
              <div style="font-size:0.8rem; font-weight:600; color:var(--accent); margin-bottom:0.25rem;">Column 4 pending:</div>
              <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.5rem;">Where were you selfish, dishonest, self-seeking, or frightened? Disregarding them, what was your mistake?</p>
              <button class="btn btn-sm btn-accent" onclick="InventoryForms.openResentmentModal('${r.id}')">Complete Turnaround →</button>
            </div>
          `}

          <!-- 14-Day Prayer Tracker Strip -->
          <div class="card-prayer-strip">
            <div class="prayer-strip-left">
              <span>🕊️ 14-Day Freedom Prayer:</span>
              <span>${prayerDays}/14 Days</span>
            </div>
            <div class="prayer-beads-inline">
              ${[...Array(14)].map((_, i) => {
                const isChecked = Array.isArray(r.prayerDaysCompleted) && r.prayerDaysCompleted[i];
                return `<button type="button" class="bead-mini ${isChecked ? 'completed' : ''}" title="Day ${i+1}: Click to pray and toggle" onclick="AppUI.togglePrayerBead('${r.id}', ${i})"></button>`;
              }).join('')}
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="card-footer">
            <div class="footer-btn-group">
              <button class="btn btn-xs btn-outline" onclick="InventoryForms.openResentmentModal('${r.id}')">✏️ Edit / Walkthrough</button>
              ${r.amendsNeeded ? '<span style="font-size:0.75rem; color:var(--danger); font-weight:700;">⚖️ Amends Flagged</span>' : ''}
            </div>
            <button class="btn btn-xs btn-outline" style="color:var(--danger);" onclick="AppUI.deleteItem('resentments', '${r.id}')" title="Delete">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    return `<div class="inventory-grid">${cardsHtml}</div>`;
  },

  renderResentmentsLedger(items) {
    if (items.length === 0) {
      return `<div class="empty-state"><p>No resentments match your search and filter criteria.</p></div>`;
    }

    const rows = items.map(r => {
      const hasTurnaround = r.myPart && r.myPart.trim().length > 0;
      const instinctNames = Array.isArray(r.affects) && r.affects.length > 0
        ? r.affects.map(inst => {
            const item = BIG_BOOK_DATA.glossary.instincts.find(i => i.id === inst);
            return item ? item.name : inst;
          }).join(', ')
        : 'None specified';

      return `
        <tr>
          <td class="td-target">
            <strong>${this.escape(this.maskName(r.target))}</strong>
            <div style="font-size:0.75rem; color:var(--text-muted);">${this.escape(r.category || 'Person')}</div>
            ${r.amendsNeeded ? '<div style="font-size:0.72rem; color:var(--danger); font-weight:700;">⚖️ Amends</div>' : ''}
          </td>
          <td class="td-cause">${this.escape(r.cause)}</td>
          <td><span style="font-size:0.8rem; color:var(--text-muted);">${this.escape(instinctNames)}</span></td>
          <td class="td-turnaround">
            ${hasTurnaround ? `
              <div style="margin-bottom:0.35rem;">"${this.escape(r.myPart)}"</div>
              ${r.oppositeAsset ? `<div style="font-size:0.78rem; color:var(--success); font-weight:600;">🌿 ${this.escape(r.oppositeAsset)}</div>` : ''}
            ` : `
              <span style="color:var(--accent); font-size:0.8rem;">⚠️ Pending</span>
              <button class="btn btn-xs btn-outline" onclick="InventoryForms.openResentmentModal('${r.id}')">Start</button>
            `}
          </td>
          <td style="text-align:center;">
            <button class="btn btn-xs btn-outline" onclick="InventoryForms.openResentmentModal('${r.id}')" title="Edit">✏️</button>
            <button class="btn btn-xs btn-outline" style="color:var(--danger);" onclick="AppUI.deleteItem('resentments', '${r.id}')" title="Delete">🗑️</button>
          </td>
        </tr>
      `;
    }).join('');

    return `
      <div class="ledger-table-wrap">
        <table class="ledger-table">
          <thead>
            <tr>
              <th style="width:22%;">Column 1: I'm Resentful At</th>
              <th style="width:25%;">Column 2: The Cause</th>
              <th style="width:20%;">Column 3: Affects My</th>
              <th style="width:25%;">Column 4: The Turnaround</th>
              <th style="width:8%; text-align:center;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  },

  togglePrayerBead(resentmentId, dayIndex) {
    const r = window.inventoryStore.state.resentments.find(item => item.id === resentmentId);
    if (!r) return;

    if (!Array.isArray(r.prayerDaysCompleted)) {
      r.prayerDaysCompleted = new Array(14).fill(false);
    }

    r.prayerDaysCompleted[dayIndex] = !r.prayerDaysCompleted[dayIndex];
    window.inventoryStore.updateItem('resentments', resentmentId, { prayerDaysCompleted: r.prayerDaysCompleted });

    if (r.prayerDaysCompleted[dayIndex]) {
      window.soundService.playChime(432);
      this.showToast(`Day ${dayIndex + 1} prayer recorded for ${r.target}. Bell chimed (432Hz).`);
    }

    this.render();
  },

  // =========================================================================
  // 2. RENDER FEARS VIEW
  // =========================================================================
  renderFears() {
    const container = document.getElementById('fearsViewArea');
    if (!container) return;

    const fears = window.inventoryStore.state.fears;
    if (fears.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🕊️</div>
          <h3>No Fears Listed Yet</h3>
          <p>"We reviewed our fears thoroughly. We put them on paper, even though we had no resentment in connection with them."</p>
          <div class="empty-actions">
            <button class="btn btn-primary" onclick="InventoryForms.openFearModal()">+ Add Your First Fear</button>
            <button class="btn btn-secondary" onclick="window.inventoryStore.loadSampleData(); AppUI.render();">Load Sample Fears</button>
          </div>
        </div>
      `;
      return;
    }

    const cards = fears.map(f => {
      return `
        <div class="item-card item-card-complete">
          <div class="card-top">
            <div class="card-target-name">${this.escape(f.fear)}</div>
            <span class="card-status-pill status-complete">Fear Uncovered</span>
          </div>

          <div class="card-cause-box">
            <div class="card-cause-label">Why do I have it? (Self-Reliance Failed)</div>
            <p class="card-cause-text">${this.escape(f.why || 'Not specified')}</p>
          </div>

          ${f.prayerPractice ? `
            <div class="card-turnaround-box">
              <div class="turnaround-title">The Spiritual Asset & Prayer</div>
              <p class="card-mypart-text">"${this.escape(f.prayerPractice)}"</p>
            </div>
          ` : ''}

          <div class="card-footer">
            <button class="btn btn-xs btn-outline" onclick="InventoryForms.openFearModal('${f.id}')">✏️ Edit</button>
            <button class="btn btn-xs btn-outline" style="color:var(--danger);" onclick="AppUI.deleteItem('fears', '${f.id}')">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `<div class="inventory-grid">${cards}</div>`;
  },

  // =========================================================================
  // 3. RENDER SEX CONDUCT VIEW
  // =========================================================================
  renderSexConduct() {
    const container = document.getElementById('sexConductViewArea');
    if (!container) return;

    const items = window.inventoryStore.state.sexConduct;
    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🤝</div>
          <h3>No Relationship Reviews Yet</h3>
          <p>"We reviewed our own past conduct over the years. We subjected each relation to this test: was it selfish or not?"</p>
          <div class="empty-actions">
            <button class="btn btn-primary" onclick="InventoryForms.openSexConductModal()">+ Add Relationship Review</button>
          </div>
        </div>
      `;
      return;
    }

    const cards = items.map(s => {
      return `
        <div class="item-card item-card-complete">
          <div class="card-top">
            <div class="card-target-name">${this.escape(this.maskName(s.person))}</div>
            <span class="card-status-pill status-complete">Relationship Review</span>
          </div>

          <div class="card-cause-box">
            <div class="card-cause-label">Where was I Selfish, Dishonest, or Inconsiderate?</div>
            <p class="card-cause-text">${this.escape(s.selfish || 'None specified')}</p>
          </div>

          <div class="card-cause-box" style="border-left-color:var(--accent);">
            <div class="card-cause-label">What Should I Have Done Instead?</div>
            <p class="card-cause-text">${this.escape(s.whatShouldHaveDone || 'None specified')}</p>
          </div>

          ${s.soundSaneIdeal ? `
            <div class="card-turnaround-box">
              <div class="turnaround-title">Sound & Sane Ideal Today</div>
              <p class="card-mypart-text">"${this.escape(s.soundSaneIdeal)}"</p>
            </div>
          ` : ''}

          <div class="card-footer">
            <button class="btn btn-xs btn-outline" onclick="InventoryForms.openSexConductModal('${s.id}')">✏️ Edit</button>
            <button class="btn btn-xs btn-outline" style="color:var(--danger);" onclick="AppUI.deleteItem('sexConduct', '${s.id}')">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `<div class="inventory-grid">${cards}</div>`;
  },

  // =========================================================================
  // 4. RENDER HARMS VIEW
  // =========================================================================
  renderHarms() {
    const container = document.getElementById('harmsViewArea');
    if (!container) return;

    const harms = window.inventoryStore.state.harms;
    if (harms.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⚖️</div>
          <h3>No Harms Listed Yet</h3>
          <p>Disclose persons you have harmed to prepare for Steps 8 and 9 amends.</p>
          <div class="empty-actions">
            <button class="btn btn-primary" onclick="InventoryForms.openHarmModal()">+ Add Person Harmed</button>
          </div>
        </div>
      `;
      return;
    }

    const cards = harms.map(h => {
      return `
        <div class="item-card item-card-complete">
          <div class="card-top">
            <div class="card-target-name">${this.escape(this.maskName(h.person))}</div>
            <span class="card-status-pill ${h.willingness === 'Willing' ? 'status-complete' : 'status-pending'}">${this.escape(h.willingness || 'Willing')}</span>
          </div>

          <div class="card-cause-box">
            <div class="card-cause-label">Harm Done</div>
            <p class="card-cause-text">${this.escape(h.description || 'Not specified')}</p>
          </div>

          ${h.restitutionPlan ? `
            <div class="card-turnaround-box">
              <div class="turnaround-title">Restitution Plan</div>
              <p class="card-mypart-text">${this.escape(h.restitutionPlan)}</p>
            </div>
          ` : ''}

          <div class="card-footer">
            <button class="btn btn-xs btn-outline" onclick="InventoryForms.openHarmModal('${h.id}')">✏️ Edit</button>
            <button class="btn btn-xs btn-outline" style="color:var(--danger);" onclick="AppUI.deleteItem('harms', '${h.id}')">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `<div class="inventory-grid">${cards}</div>`;
  },

  // =========================================================================
  // 5. RENDER 14-DAY PRAYER SANCTUARY
  // =========================================================================
  renderPrayerTracker() {
    const container = document.getElementById('prayerTrackerArea');
    if (!container) return;

    const resentments = window.inventoryStore.state.resentments;
    const candidates = resentments.filter(r => r.target && r.target.trim().length > 0);

    if (candidates.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🕯️</div>
          <h3>No Resentments in Prayer Sanctuary</h3>
          <p>Add a resentment in the first tab to begin praying for them daily for 14 days.</p>
        </div>
      `;
      return;
    }

    const shrines = candidates.map(r => {
      if (!Array.isArray(r.prayerDaysCompleted)) {
        r.prayerDaysCompleted = new Array(14).fill(false);
      }
      const daysCount = r.prayerDaysCompleted.filter(d => d).length;
      const isFinished = daysCount >= 14;

      return `
        <div class="prayer-shrine-card">
          <div class="prayer-shrine-header">
            <div class="prayer-shrine-target">${this.escape(this.maskName(r.target))}</div>
            <div class="prayer-progress-count">${daysCount} / 14 Days Prayed</div>
          </div>

          <!-- 14 Interactive Beads -->
          <div class="prayer-rosary-strip">
            ${[...Array(14)].map((_, i) => {
              const isChecked = r.prayerDaysCompleted[i];
              return `
                <button type="button" class="prayer-bead-node ${isChecked ? 'checked' : ''}" onclick="AppUI.togglePrayerBead('${r.id}', ${i})" title="Day ${i+1}: Click to pray and check off">
                  ${i + 1}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Sick Man's Prayer customized for this target -->
          <div class="sick-prayer-recitation">
            "This is a sick person. How can I be helpful to <strong>${this.escape(this.maskName(r.target))}</strong>?
            God grant ${this.escape(this.maskName(r.target))} health, prosperity, happiness, and peace of mind. God save me from being angry. Thy will be done."
          </div>

          <div class="card-footer" style="padding-top:0.5rem;">
            <span style="font-size:0.8rem; color:var(--text-muted);">
              ${isFinished ? '✨ 14-Day Freedom milestone reached!' : 'Click today\'s numbered bead when you complete your prayer.'}
            </span>
            <button class="btn btn-xs btn-outline" onclick="window.soundService.playChime(432); AppUI.showToast('Bell chimed for ${this.escape(r.target)}');">🔔 Ring Chime</button>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `<div class="prayer-sanctuary-grid">${shrines}</div>`;
  },

  // =========================================================================
  // 6. RENDER STEP 5 SPONSOR SUITE
  // =========================================================================
  renderStep5() {
    const container = document.getElementById('step5ViewArea');
    if (!container) return;

    const s = window.inventoryStore.state;
    const notes = s.sponsorNotes || '';

    container.innerHTML = `
      <div class="step5-container">
        <div class="sponsor-paper">
          <h3>The Fifth Step Presentation</h3>
          <p style="font-size:1.05rem; line-height:1.6; margin-bottom:1.5rem;">
            "We pocket our pride and go to it, illuminating every twist of character, every dark cranny of the past...
            Once we have taken this step, withholding nothing, we are delighted. We can look the world in the eye.
            We can be alone at perfect peace and ease. Our fears fall from us." (pp. 72–75)
          </p>

          <div class="pref-section">
            <label class="pref-label">Sponsor Discussion Notes & Amends Reflections:</label>
            <textarea class="sponsor-notes-area" placeholder="Type thoughts, sponsor instructions, or insights that emerge during your Step 5 sit-down..." oninput="AppUI.saveSponsorNotes(event)">${this.escape(notes)}</textarea>
            <p class="pref-desc mt-1">Autosaves locally to this device.</p>
          </div>

          <div class="pref-section">
            <h4 style="font-family:var(--font-heading); margin-bottom:0.75rem;">Summary of Inventory Assets to Discuss:</h4>
            <div style="font-size:0.95rem; line-height:1.7;">
              <div>• <strong>Resentments to Review:</strong> ${s.resentments.length} people / institutions</div>
              <div>• <strong>Fears to Examine:</strong> ${s.fears.length} fears cataloged</div>
              <div>• <strong>Sex Conduct Relations:</strong> ${s.sexConduct.length} relationships tested for selfishness</div>
              <div>• <strong>Harms Owed (Steps 8 & 9):</strong> ${s.harms.length} amends candidates</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  saveSponsorNotes(e) {
    window.inventoryStore.state.sponsorNotes = e.target.value;
    window.inventoryStore.save();
  },

  deleteItem(type, id) {
    if (confirm('Are you sure you want to delete this inventory entry?')) {
      window.inventoryStore.deleteItem(type, id);
      this.showToast('Item deleted.');
      this.render();
    }
  },

  // =========================================================================
  // SECURITY & PASSCODE MODALS
  // =========================================================================
  openSecuritySettings() {
    document.getElementById('preferencesDialog').close();
    const isEnabled = window.inventoryStore.settings.pinEnabled;

    const html = `
      <div class="pref-section">
        <label class="pref-label">In-Browser AES-256-GCM Encryption</label>
        <p class="pref-desc">
          When enabled, your entire inventory is encrypted using PBKDF2 (100,000 iterations) and AES-256-GCM before writing to your browser's storage.
        </p>

        <div class="form-group mb-3">
          <label class="pref-label">Set / Change Passcode:</label>
          <input type="password" id="newPasscode" class="dump-input" style="width:100%; border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.6rem 0.85rem;" placeholder="Enter a secure passcode...">
        </div>

        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-primary" onclick="AppUI.saveNewPasscode()">Save Passcode</button>
          ${isEnabled ? `<button class="btn btn-danger" onclick="AppUI.disablePasscode()">Remove Passcode</button>` : ''}
        </div>
      </div>
    `;

    this.showModal('Security & Encryption', html);
  },

  async saveNewPasscode() {
    const input = document.getElementById('newPasscode');
    if (!input || !input.value.trim()) {
      alert('Please enter a passcode.');
      return;
    }
    const passcode = input.value.trim();
    await window.inventoryStore.setPasscode(passcode);
    this.closeModal();
    this.showToast('Passcode enabled & data encrypted with AES-256-GCM.');
  },

  async disablePasscode() {
    if (confirm('Disable passcode protection and store in plain local storage?')) {
      await window.inventoryStore.disablePasscode();
      this.closeModal();
      this.showToast('Passcode removed.');
    }
  },

  lockNow() {
    window.inventoryStore.lock();
    document.getElementById('preferencesDialog').close();
    this.showPinModal(true);
  },

  showPinModal(isBlocking = false) {
    const html = `
      <div style="text-align:center; padding:1.5rem 1rem;">
        <div style="font-size:2.5rem; margin-bottom:0.75rem;">🔒</div>
        <h3 style="font-family:var(--font-heading); margin-bottom:0.5rem;">Inventory Locked</h3>
        <p style="font-size:0.875rem; color:var(--text-muted); margin-bottom:1.25rem;">Enter your passcode to decrypt your 4th Step Moral Inventory.</p>
        <form onsubmit="AppUI.handleUnlock(event)">
          <input type="password" id="unlockPinInput" class="dump-input" style="width:240px; border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.65rem; text-align:center; font-size:1.2rem; letter-spacing:0.2em; margin-bottom:1rem;" autofocus required placeholder="••••">
          <div>
            <button type="submit" class="btn btn-primary">Unlock Inventory</button>
          </div>
        </form>
      </div>
    `;

    this.showModal('Encrypted Sanctuary', html);
  },

  async handleUnlock(e) {
    e.preventDefault();
    const input = document.getElementById('unlockPinInput');
    if (!input) return;

    const ok = await window.inventoryStore.unlock(input.value);
    if (ok) {
      this.closeModal();
      this.showToast('Inventory unlocked.');
      this.render();
    } else {
      alert('Incorrect passcode. Please try again.');
      input.value = '';
      input.focus();
    }
  }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  AppUI.init();
});
