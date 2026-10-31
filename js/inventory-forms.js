/**
 * Guided Inventory Forms & Interactive Wizards
 * Reimagined for maximum empathy, clarity, and intuitive spiritual discovery.
 */

const InventoryForms = {
  currentStep: 1,
  currentId: null,
  activeFormData: null,

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
  // 1. RESENTMENT WIZARD (The 4 Columns Made Truly Intuitive)
  // =========================================================================
  openResentmentModal(id = null, prefillTarget = '') {
    this.currentId = id;
    this.currentStep = 1;

    let d = {
      target: prefillTarget || '',
      category: 'Person',
      cause: '',
      affects: [],
      selfish: '',
      dishonest: '',
      selfSeeking: '',
      frightened: '',
      myPart: '',
      oppositeAsset: '',
      amendsNeeded: false,
      amendsNotes: '',
      startPrayer: true
    };

    if (id) {
      const existing = window.inventoryStore.state.resentments.find(r => r.id === id);
      if (existing) {
        d = { ...existing };
        if (d.affects && !Array.isArray(d.affects)) d.affects = [];
      }
    }

    this.activeFormData = d;
    this.renderResentmentStep(1);
  },

  renderResentmentStep(step) {
    this.currentStep = step;
    const d = this.activeFormData;
    const title = this.currentId ? 'Edit Resentment' : 'Guided Resentment Inventory';

    const stepsNav = `
      <div class="wizard-progress-bar">
        <button type="button" class="wizard-step-node ${step === 1 ? 'active' : (step > 1 ? 'done' : '')}" onclick="InventoryForms.renderResentmentStep(1)">1. Who</button>
        <button type="button" class="wizard-step-node ${step === 2 ? 'active' : (step > 2 ? 'done' : '')}" onclick="InventoryForms.renderResentmentStep(2)">2. Cause</button>
        <button type="button" class="wizard-step-node ${step === 3 ? 'active' : (step > 3 ? 'done' : '')}" onclick="InventoryForms.renderResentmentStep(3)">3. Hurt Areas</button>
        <button type="button" class="wizard-step-node ${step === 4 ? 'active' : (step > 4 ? 'done' : '')}" onclick="InventoryForms.renderResentmentStep(4)">4. Turnaround</button>
        <button type="button" class="wizard-step-node ${step === 5 ? 'active' : (step > 5 ? 'done' : '')}" onclick="InventoryForms.renderResentmentStep(5)">5. Freedom</button>
      </div>
    `;

    let stepHtml = '';

    if (step === 1) {
      stepHtml = `
        <div class="wizard-pane">
          <div class="hero-quote mb-3">
            "In dealing with resentments, we set them on paper. We listed people, institutions or principles with whom we were angry." (p. 64)
          </div>

          <div class="form-group mb-3">
            <label class="pref-label">Who or what are you angry at / resentful towards? <span style="color:var(--danger)">*</span></label>
            <input type="text" id="wizardTarget" class="dump-input" style="width:100%; border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.65rem 0.85rem;" placeholder="e.g. Mr. Brown, Mother, Employer, Ex-Partner, Myself, God" value="${this.escape(d.target)}" required autofocus>

            <div class="dump-quick-tags mt-2">
              <span class="tag-label">Quick select:</span>
              <button type="button" class="quick-chip" onclick="document.getElementById('wizardTarget').value='Mother'">Mother</button>
              <button type="button" class="quick-chip" onclick="document.getElementById('wizardTarget').value='Father'">Father</button>
              <button type="button" class="quick-chip" onclick="document.getElementById('wizardTarget').value='My Employer'">My Employer</button>
              <button type="button" class="quick-chip" onclick="document.getElementById('wizardTarget').value='Ex-Partner'">Ex-Partner</button>
              <button type="button" class="quick-chip" onclick="document.getElementById('wizardTarget').value='Myself'">Myself</button>
              <button type="button" class="quick-chip" onclick="document.getElementById('wizardTarget').value='God / Religion'">God</button>
            </div>
          </div>

          <div class="form-group mb-3">
            <label class="pref-label">Category</label>
            <select id="wizardCategory" class="select-pill" style="width:100%; padding:0.6rem 0.85rem;">
              <option value="Person" ${d.category === 'Person' ? 'selected' : ''}>Person (Friend, Acquaintance)</option>
              <option value="Family Member" ${d.category === 'Family Member' ? 'selected' : ''}>Family Member</option>
              <option value="Employer / Workplace" ${d.category === 'Employer / Workplace' ? 'selected' : ''}>Employer / Workplace / Career</option>
              <option value="Institution / Authority" ${d.category === 'Institution / Authority' ? 'selected' : ''}>Institution / Law / Government</option>
              <option value="Religion / God" ${d.category === 'Religion / God' ? 'selected' : ''}>Religion / God</option>
              <option value="Principle / Concept" ${d.category === 'Principle / Concept' ? 'selected' : ''}>Principle / Concept / Society</option>
              <option value="Myself" ${d.category === 'Myself' ? 'selected' : ''}>Myself</option>
            </select>
          </div>
        </div>
      `;
    } else if (step === 2) {
      stepHtml = `
        <div class="wizard-pane">
          <div class="hero-quote mb-3">
            "We asked ourselves why we were angry." (p. 65)
          </div>

          <div class="form-group mb-3">
            <label class="pref-label">The Cause: What specifically did <strong>${this.escape(d.target || 'they')}</strong> do or say?</label>
            <textarea id="wizardCause" class="turnaround-textarea" rows="4" placeholder="Describe the concrete actions, words, or broken promises that hurt or angered you.">${this.escape(d.cause)}</textarea>
            <p class="pref-desc mt-1">Keep it simple and factual. State what happened without needing to write a novel.</p>

            <div class="dump-quick-tags mt-2">
              <span class="tag-label">Common prompts:</span>
              <button type="button" class="quick-chip" onclick="AppUI.appendWizardCause('Broke promise and lied to me. ')">Broke Promise</button>
              <button type="button" class="quick-chip" onclick="AppUI.appendWizardCause('Criticized and disrespected me in front of others. ')">Criticized Me</button>
              <button type="button" class="quick-chip" onclick="AppUI.appendWizardCause('Tried to control and micromanage my life. ')">Tried to Control</button>
              <button type="button" class="quick-chip" onclick="AppUI.appendWizardCause('Abandoned and rejected me when I needed them. ')">Rejection</button>
              <button type="button" class="quick-chip" onclick="AppUI.appendWizardCause('Treated me unfairly and took credit for my work. ')">Unfair Treatment</button>
            </div>
          </div>
        </div>
      `;
    } else if (step === 3) {
      stepHtml = `
        <div class="wizard-pane">
          <div class="hero-quote mb-3">
            "In most cases it was found that our self-esteem, our pocketbooks, our ambitions, our personal relationships (including sex) were hurt or threatened." (p. 65)
          </div>

          <label class="pref-label">Tap every part of you that felt wounded, threatened, or insulted:</label>
          <div class="interactive-instinct-grid">
            ${BIG_BOOK_DATA.glossary.instincts.map(inst => {
              const isSelected = Array.isArray(d.affects) && d.affects.includes(inst.id);
              const iconMap = {
                self_esteem: '🪞',
                pride: '👑',
                pocketbook: '💳',
                security: '🔒',
                ambitions: '🎯',
                personal_relationships: '🫂',
                sex_relations: '💔'
              };
              return `
                <div class="instinct-choice-card ${isSelected ? 'selected' : ''}" onclick="InventoryForms.toggleInstinctChoice('${inst.id}', this)">
                  <div class="choice-icon">${iconMap[inst.id] || '⚡'}</div>
                  <div class="choice-text">
                    <strong>${inst.name}</strong>
                    <span>${inst.description}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else if (step === 4) {
      stepHtml = `
        <div class="wizard-pane">
          <div class="hero-quote mb-3" style="color:var(--primary); font-weight:600;">
            "Putting out of our minds the wrongs others had done, we resolutely looked for our own mistakes. Where had we been selfish, dishonest, self-seeking and frightened?" (p. 67)
          </div>

          <p class="pref-desc mb-3">
            Finding our part is <strong>not</strong> about blaming yourself for mistreatment. It is about identifying the character defects that are keeping <em>you</em> spiritually sick and finding the opposite spiritual virtue.
          </p>

          <!-- 4 Character Defects & Spiritual Assets -->
          <div class="turnaround-assistant-card ${d.selfish ? 'activated' : ''}">
            <div class="turnaround-prompt-header">
              <span class="turnaround-defect-name">1. Where was I Selfish?</span>
              <span class="turnaround-asset-pill">🌿 Asset: Selfless & Generous</span>
            </div>
            <textarea id="wizardSelfish" class="turnaround-textarea" rows="2" placeholder="Where did I demand my own way, ignore their feelings, or put my wants first?">${this.escape(d.selfish)}</textarea>
          </div>

          <div class="turnaround-assistant-card ${d.dishonest ? 'activated' : ''}">
            <div class="turnaround-prompt-header">
              <span class="turnaround-defect-name">2. Where was I Dishonest?</span>
              <span class="turnaround-asset-pill">🌿 Asset: Rigorous Honesty & Truth</span>
            </div>
            <textarea id="wizardDishonest" class="turnaround-textarea" rows="2" placeholder="Where was I hiding the truth, pretending, making false promises, or lying to myself?">${this.escape(d.dishonest)}</textarea>
          </div>

          <div class="turnaround-assistant-card ${d.selfSeeking ? 'activated' : ''}">
            <div class="turnaround-prompt-header">
              <span class="turnaround-defect-name">3. Where was I Self-Seeking?</span>
              <span class="turnaround-asset-pill">🌿 Asset: Loving Service & Surrender</span>
            </div>
            <textarea id="wizardSelfSeeking" class="turnaround-textarea" rows="2" placeholder="What was my hidden motive? How was I trying to control, manipulate, or extract?">${this.escape(d.selfSeeking)}</textarea>
          </div>

          <div class="turnaround-assistant-card ${d.frightened ? 'activated' : ''}">
            <div class="turnaround-prompt-header">
              <span class="turnaround-defect-name">4. Where was I Frightened?</span>
              <span class="turnaround-asset-pill">🌿 Asset: Courage & Faith in God</span>
            </div>
            <textarea id="wizardFrightened" class="turnaround-textarea" rows="2" placeholder="What was I afraid of losing or failing to get?">${this.escape(d.frightened)}</textarea>
          </div>

          <div class="form-group mt-3">
            <label class="pref-label">Disregarding the other person entirely, what was my mistake? (Setting the ball rolling):</label>
            <textarea id="wizardMyPart" class="turnaround-textarea" rows="3" placeholder="In black and white: how did I set the ball rolling? What was my mistake here?">${this.escape(d.myPart)}</textarea>
          </div>

          <div class="form-group mt-3">
            <label class="pref-label">Spiritual Asset / Principle to Live By Today:</label>
            <input type="text" id="wizardOppositeAsset" class="dump-input" style="width:100%; border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.6rem 0.85rem;" placeholder="e.g. Unconditional forgiveness, honest communication, financial diligence" value="${this.escape(d.oppositeAsset)}">
          </div>
        </div>
      `;
    } else if (step === 5) {
      stepHtml = `
        <div class="wizard-pane">
          <div class="sick-prayer-recitation mb-3">
            <div style="font-weight:700; color:var(--gold); margin-bottom:0.35rem;">The Freedom From Resentment Prayer (p. 67):</div>
            "We realized that the people who wronged us were perhaps spiritually sick... When a person offended we said to ourselves: 'This is a sick person. How can I be helpful to him? God save me from being angry. Thy will be done.'"
          </div>

          <div class="pref-section">
            <label class="pref-label">Begin 14-Day Resentment Freedom Prayer?</label>
            <p class="pref-desc">Pray for ${this.escape(d.target || 'this person')} for 14 days asking for everything you want for yourself to be given to them. This will add them to your 14-Day Sanctuary tracker.</p>
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" id="wizardStartPrayer" ${d.startPrayer !== false ? 'checked' : ''} style="width:18px; height:18px;">
              <span style="font-weight:600; font-size:0.9rem;">Yes, track 14-Day Freedom Prayer for ${this.escape(d.target || 'this person')}</span>
            </label>
          </div>

          <div class="pref-section">
            <label class="pref-label">Did you harm this person / Do you owe amends in Steps 8 & 9?</label>
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer; margin-bottom:0.5rem;">
              <input type="checkbox" id="wizardAmendsNeeded" ${d.amendsNeeded ? 'checked' : ''} onchange="document.getElementById('wizardAmendsNotesWrap').style.display = this.checked ? 'block' : 'none';" style="width:18px; height:18px;">
              <span style="font-weight:600; font-size:0.9rem;">Yes, I harmed them and need to make amends</span>
            </label>

            <div id="wizardAmendsNotesWrap" style="${d.amendsNeeded ? '' : 'display:none;'}">
              <textarea id="wizardAmendsNotes" class="turnaround-textarea" rows="2" placeholder="What harm did you cause, and what restitution is appropriate?">${this.escape(d.amendsNotes)}</textarea>
            </div>
          </div>
        </div>
      `;
    }

    const footerNav = `
      <div class="card-footer mt-4" style="border-top:1px solid var(--border-color); padding-top:1rem;">
        <div>
          ${step > 1 ? `<button type="button" class="btn btn-secondary" onclick="InventoryForms.navigateResentmentStep(-1)">← Previous</button>` : ''}
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button type="button" class="btn btn-outline" onclick="AppUI.closeModal()">Cancel</button>
          ${step < 5 ? `<button type="button" class="btn btn-primary" onclick="InventoryForms.navigateResentmentStep(1)">Next Step →</button>` : `<button type="button" class="btn btn-accent" onclick="InventoryForms.saveResentment()">Save Resentment</button>`}
        </div>
      </div>
    `;

    const html = stepsNav + stepHtml + footerNav;
    AppUI.showModal(title, html);
  },

  syncCurrentStepInputs() {
    const d = this.activeFormData;
    if (!d) return;

    if (this.currentStep === 1) {
      const t = document.getElementById('wizardTarget');
      const c = document.getElementById('wizardCategory');
      if (t) d.target = t.value.trim();
      if (c) d.category = c.value;
    } else if (this.currentStep === 2) {
      const c = document.getElementById('wizardCause');
      if (c) d.cause = c.value.trim();
    } else if (this.currentStep === 4) {
      const s = document.getElementById('wizardSelfish');
      const dis = document.getElementById('wizardDishonest');
      const ss = document.getElementById('wizardSelfSeeking');
      const f = document.getElementById('wizardFrightened');
      const p = document.getElementById('wizardMyPart');
      const a = document.getElementById('wizardOppositeAsset');

      if (s) d.selfish = s.value.trim();
      if (dis) d.dishonest = dis.value.trim();
      if (ss) d.selfSeeking = ss.value.trim();
      if (f) d.frightened = f.value.trim();
      if (p) d.myPart = p.value.trim();
      if (a) d.oppositeAsset = a.value.trim();
    } else if (this.currentStep === 5) {
      const sp = document.getElementById('wizardStartPrayer');
      const am = document.getElementById('wizardAmendsNeeded');
      const an = document.getElementById('wizardAmendsNotes');

      if (sp) d.startPrayer = sp.checked;
      if (am) d.amendsNeeded = am.checked;
      if (an) d.amendsNotes = an.value.trim();
    }
  },

  navigateResentmentStep(delta) {
    this.syncCurrentStepInputs();

    if (delta > 0 && this.currentStep === 1 && !this.activeFormData.target) {
      alert('Please enter a person, institution, or principle for Column 1.');
      return;
    }

    const next = this.currentStep + delta;
    if (next >= 1 && next <= 5) {
      this.renderResentmentStep(next);
    }
  },

  toggleInstinctChoice(id, element) {
    const d = this.activeFormData;
    if (!Array.isArray(d.affects)) d.affects = [];

    const idx = d.affects.indexOf(id);
    if (idx === -1) {
      d.affects.push(id);
      element.classList.add('selected');
    } else {
      d.affects.splice(idx, 1);
      element.classList.remove('selected');
    }
  },

  saveResentment() {
    this.syncCurrentStepInputs();
    const d = this.activeFormData;

    if (!d.target) {
      alert('Please enter who you are resentful towards.');
      this.renderResentmentStep(1);
      return;
    }

    if (this.currentId) {
      window.inventoryStore.updateItem('resentments', this.currentId, d);
      AppUI.showToast(`Updated resentment: ${d.target}`);
    } else {
      if (d.startPrayer && !d.prayerDaysCompleted) {
        d.prayerDaysCompleted = new Array(14).fill(false);
      }
      window.inventoryStore.addItem('resentments', d);
      AppUI.showToast(`Added resentment: ${d.target}`);
    }

    window.soundService.playChime(432);
    AppUI.closeModal();
    AppUI.render();
  },

  // =========================================================================
  // 2. FEAR INVENTORY MODAL
  // =========================================================================
  openFearModal(id = null, prefillFear = '') {
    this.currentId = id;
    let d = {
      fear: prefillFear || '',
      why: '',
      affects: [],
      selfReliancePart: '',
      prayerPractice: ''
    };

    if (id) {
      const existing = window.inventoryStore.state.fears.find(f => f.id === id);
      if (existing) d = { ...existing };
    }

    const title = id ? 'Edit Fear' : 'Reviewing Our Fears (pp. 67–68)';
    const html = `
      <form onsubmit="InventoryForms.saveFear(event)">
        <div class="hero-quote mb-3">
          "We reviewed our fears thoroughly. We put them on paper, even though we had no resentment in connection with them.
          We asked ourselves why we had them. Wasn't it because self-reliance failed us?" (pp. 67–68)
        </div>

        <div class="form-group mb-3">
          <label class="pref-label">What is the fear? <span style="color:var(--danger)">*</span></label>
          <input type="text" id="fearInput" class="dump-input" style="width:100%; border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.65rem 0.85rem;" placeholder="e.g. Financial ruin, being rejected, being exposed as inadequate, illness" value="${this.escape(d.fear)}" required autofocus>
        </div>

        <div class="form-group mb-3">
          <label class="pref-label">Why do I have it? (Where did self-reliance fail?):</label>
          <textarea id="fearWhy" class="turnaround-textarea" rows="3" placeholder="Why does this terrify me? Did I rely purely on self, money, or ego instead of spiritual trust?">${this.escape(d.why)}</textarea>
        </div>

        <div class="form-group mb-3">
          <label class="pref-label">What parts of self are threatened?</label>
          <div class="dump-quick-tags">
            ${['Self-Esteem', 'Security', 'Finances (Pocketbook)', 'Ambitions', 'Personal Relationships'].map(label => `
              <label class="quick-chip" style="cursor:pointer;">
                <input type="checkbox" name="fearAffects" value="${label}" ${(d.affects || []).includes(label) ? 'checked' : ''}> ${label}
              </label>
            `).join('')}
          </div>
        </div>

        <div class="form-group mb-3">
          <label class="pref-label">The Fear Prayer & Spiritual Asset:</label>
          <textarea id="fearPrayerPractice" class="turnaround-textarea" rows="2" placeholder="We ask Him to remove our fear and direct our attention to what He would have us be...">${this.escape(d.prayerPractice || 'We ask God to remove this fear and direct our attention to what He would have us be: courageous, humble, and useful to others.')}</textarea>
        </div>

        <div class="card-footer mt-4" style="border-top:1px solid var(--border-color); padding-top:1rem;">
          <div></div>
          <div style="display:flex; gap:0.5rem;">
            <button type="button" class="btn btn-outline" onclick="AppUI.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Fear</button>
          </div>
        </div>
      </form>
    `;

    AppUI.showModal(title, html);
  },

  saveFear(e) {
    e.preventDefault();
    const fear = document.getElementById('fearInput').value.trim();
    const why = document.getElementById('fearWhy').value.trim();
    const prayerPractice = document.getElementById('fearPrayerPractice').value.trim();
    const checkboxes = document.querySelectorAll('input[name="fearAffects"]:checked');
    const affects = Array.from(checkboxes).map(c => c.value);

    const item = { fear, why, prayerPractice, affects };

    if (this.currentId) {
      window.inventoryStore.updateItem('fears', this.currentId, item);
      AppUI.showToast(`Updated fear`);
    } else {
      window.inventoryStore.addItem('fears', item);
      AppUI.showToast(`Added fear`);
    }

    AppUI.closeModal();
    AppUI.render();
  },

  // =========================================================================
  // 3. SEX & INTIMACY MODAL
  // =========================================================================
  openSexConductModal(id = null) {
    this.currentId = id;
    let d = {
      person: '',
      selfish: '',
      dishonest: '',
      inconsiderate: '',
      hurt: '',
      jealousy: '',
      whereAtFault: '',
      whatShouldHaveDone: '',
      soundSaneIdeal: '',
      willingAmends: 'Yes'
    };

    if (id) {
      const existing = window.inventoryStore.state.sexConduct.find(s => s.id === id);
      if (existing) d = { ...existing };
    }

    const title = id ? 'Edit Relationship Review' : 'Sex Conduct & Intimacy (pp. 68–70)';
    const html = `
      <form onsubmit="InventoryForms.saveSexConduct(event)">
        <div class="hero-quote mb-3">
          "We subjected each relation to this test: was it selfish or not? We asked God to mold our ideals and help us to live up to them." (p. 69)
        </div>

        <div class="form-group mb-3">
          <label class="pref-label">Person / Partner:</label>
          <input type="text" id="sexPerson" class="dump-input" style="width:100%; border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.65rem 0.85rem;" placeholder="e.g. Former partner, spouse, person involved with" value="${this.escape(d.person)}" required autofocus>
        </div>

        <div class="form-group mb-3">
          <label class="pref-label">Where had we been selfish, dishonest, or inconsiderate?</label>
          <textarea id="sexSelfish" class="turnaround-textarea" rows="2" placeholder="Where did I put my wants, validation, or impulses ahead of their dignity?">${this.escape(d.selfish)}</textarea>
        </div>

        <div class="form-group mb-3">
          <label class="pref-label">Whom had we hurt? Did we arouse jealousy or suspicion?</label>
          <textarea id="sexHurt" class="turnaround-textarea" rows="2" placeholder="What damage was caused to them, family, children, or third parties?">${this.escape(d.hurt)}</textarea>
        </div>

        <div class="form-group mb-3">
          <label class="pref-label">What should we have done instead?</label>
          <textarea id="sexShouldHaveDone" class="turnaround-textarea" rows="2" placeholder="How should an honest, sane spiritual person have handled this?">${this.escape(d.whatShouldHaveDone)}</textarea>
        </div>

        <div class="form-group mb-3">
          <label class="pref-label">Our Sound and Sane Ideal for Relationships Today:</label>
          <textarea id="sexIdeal" class="turnaround-textarea" rows="2" placeholder="Describe the ideal relationship: built on mutual respect, trust, spiritual purpose, and love.">${this.escape(d.soundSaneIdeal)}</textarea>
        </div>

        <div class="card-footer mt-4" style="border-top:1px solid var(--border-color); padding-top:1rem;">
          <div></div>
          <div style="display:flex; gap:0.5rem;">
            <button type="button" class="btn btn-outline" onclick="AppUI.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Relationship</button>
          </div>
        </div>
      </form>
    `;

    AppUI.showModal(title, html);
  },

  saveSexConduct(e) {
    e.preventDefault();
    const item = {
      person: document.getElementById('sexPerson').value.trim(),
      selfish: document.getElementById('sexSelfish').value.trim(),
      hurt: document.getElementById('sexHurt').value.trim(),
      whatShouldHaveDone: document.getElementById('sexShouldHaveDone').value.trim(),
      soundSaneIdeal: document.getElementById('sexIdeal').value.trim()
    };

    if (this.currentId) {
      window.inventoryStore.updateItem('sexConduct', this.currentId, item);
      AppUI.showToast('Updated relationship review');
    } else {
      window.inventoryStore.addItem('sexConduct', item);
      AppUI.showToast('Added relationship review');
    }

    AppUI.closeModal();
    AppUI.render();
  },

  // =========================================================================
  // 4. HARMS TO OTHERS MODAL
  // =========================================================================
  openHarmModal(id = null) {
    this.currentId = id;
    let d = {
      person: '',
      description: '',
      financialHarm: false,
      financialAmount: '',
      restitutionPlan: '',
      willingness: 'Willing'
    };

    if (id) {
      const existing = window.inventoryStore.state.harms.find(h => h.id === id);
      if (existing) d = { ...existing };
    }

    const title = id ? 'Edit Person Harmed' : 'Harms to Others (Steps 8 & 9 Prep)';
    const html = `
      <form onsubmit="InventoryForms.saveHarm(event)">
        <div class="form-group mb-3">
          <label class="pref-label">Person or Institution Harmed:</label>
          <input type="text" id="harmPerson" class="dump-input" style="width:100%; border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.65rem 0.85rem;" placeholder="e.g. My brother, former boss, neighbor, bank" value="${this.escape(d.person)}" required autofocus>
        </div>

        <div class="form-group mb-3">
          <label class="pref-label">What was the harm or wrong done?</label>
          <textarea id="harmDescription" class="turnaround-textarea" rows="3" placeholder="Describe the theft, betrayal, slander, neglected obligation, or damage.">${this.escape(d.description)}</textarea>
        </div>

        <div class="form-group mb-3">
          <label class="pref-label">Restitution Plan / Amends Idea:</label>
          <textarea id="harmRestitution" class="turnaround-textarea" rows="2" placeholder="What can be done to right this wrong? (Direct apology, repayment, living amends)"></textarea>
        </div>

        <div class="form-group mb-3">
          <label class="pref-label">Current Willingness:</label>
          <select id="harmWillingness" class="select-pill" style="width:100%; padding:0.6rem 0.85rem;">
            <option value="Willing" ${d.willingness === 'Willing' ? 'selected' : ''}>Willing to make amends promptly</option>
            <option value="Hesitant" ${d.willingness === 'Hesitant' ? 'selected' : ''}>Hesitant / Need sponsor guidance first</option>
            <option value="Completed" ${d.willingness === 'Completed' ? 'selected' : ''}>Amends already completed</option>
          </select>
        </div>

        <div class="card-footer mt-4" style="border-top:1px solid var(--border-color); padding-top:1rem;">
          <div></div>
          <div style="display:flex; gap:0.5rem;">
            <button type="button" class="btn btn-outline" onclick="AppUI.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Harm Record</button>
          </div>
        </div>
      </form>
    `;

    AppUI.showModal(title, html);
  },

  saveHarm(e) {
    e.preventDefault();
    const item = {
      person: document.getElementById('harmPerson').value.trim(),
      description: document.getElementById('harmDescription').value.trim(),
      restitutionPlan: document.getElementById('harmRestitution').value.trim(),
      willingness: document.getElementById('harmWillingness').value
    };

    if (this.currentId) {
      window.inventoryStore.updateItem('harms', this.currentId, item);
      AppUI.showToast('Updated harm entry');
    } else {
      window.inventoryStore.addItem('harms', item);
      AppUI.showToast('Added harm entry');
    }

    AppUI.closeModal();
    AppUI.render();
  }
};
