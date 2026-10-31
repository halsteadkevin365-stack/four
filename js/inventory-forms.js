/**
 * Form builders, Wizard step transitions, and Modal Managers
 * for Resentments, Fears, Sex Conduct, and Harms.
 */

const InventoryForms = {
  currentModalType: null,
  currentEditingId: null,
  currentWizardStep: 1,

  // --- RESENTMENT MODAL (4 COLUMNS) ---
  openResentmentModal(id = null) {
    this.currentModalType = 'resentment';
    this.currentEditingId = id;
    this.currentWizardStep = 1;

    let data = {
      target: '',
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
      amendsNotes: ''
    };

    if (id) {
      const existing = window.inventoryStore.state.resentments.find(r => r.id === id);
      if (existing) {
        data = { ...existing };
      }
    }

    const modalTitle = id ? 'Edit Resentment' : 'New Resentment (The Four Columns)';
    const contentHtml = `
      <div class="wizard-header">
        <div class="wizard-steps">
          <button type="button" class="wizard-step-btn active" data-step="1">1. Who / What</button>
          <button type="button" class="wizard-step-btn" data-step="2">2. The Cause</button>
          <button type="button" class="wizard-step-btn" data-step="3">3. Affects My</button>
          <button type="button" class="wizard-step-btn" data-step="4">4. The Turnaround</button>
          <button type="button" class="wizard-step-btn" data-step="5">5. Sick Man Prayer</button>
        </div>
      </div>

      <form id="resentmentForm" class="inventory-form">
        <!-- STEP 1: Column 1 -->
        <div class="wizard-pane active" data-step="1">
          <div class="form-banner">
            <strong>Column 1 (Big Book p. 65):</strong> "In dealing with resentments, we set them on paper. We listed people, institutions or principles with whom we were angry."
          </div>

          <div class="form-group">
            <label for="resTarget">I am resentful at: <span class="required">*</span></label>
            <input type="text" id="resTarget" name="target" class="form-control" required placeholder="e.g. Mr. Brown, Mother, Ex-Spouse, Police, Church, My Employer, Myself" value="${this.escape(data.target)}">
            <div class="quick-picks-row mt-1">
              <span class="quick-pick-label">Quick select:</span>
              <button type="button" class="quick-pick-btn" onclick="document.getElementById('resTarget').value='Mother'">Mother</button>
              <button type="button" class="quick-pick-btn" onclick="document.getElementById('resTarget').value='Father'">Father</button>
              <button type="button" class="quick-pick-btn" onclick="document.getElementById('resTarget').value='Employer'">Employer</button>
              <button type="button" class="quick-pick-btn" onclick="document.getElementById('resTarget').value='Ex-Spouse'">Ex-Spouse</button>
              <button type="button" class="quick-pick-btn" onclick="document.getElementById('resTarget').value='Myself'">Myself</button>
              <button type="button" class="quick-pick-btn" onclick="document.getElementById('resTarget').value='God'">God</button>
            </div>
          </div>

          <div class="form-group">
            <label for="resCategory">Category:</label>
            <select id="resCategory" name="category" class="form-control">
              <option value="Person" ${data.category === 'Person' ? 'selected' : ''}>Person</option>
              <option value="Family Member" ${data.category === 'Family Member' ? 'selected' : ''}>Family Member</option>
              <option value="Employer / Workplace" ${data.category === 'Employer / Workplace' ? 'selected' : ''}>Employer / Workplace</option>
              <option value="Institution / Authority" ${data.category === 'Institution / Authority' ? 'selected' : ''}>Institution / Authority / Government</option>
              <option value="Religion / God" ${data.category === 'Religion / God' ? 'selected' : ''}>Religion / God</option>
              <option value="Principle / Concept" ${data.category === 'Principle / Concept' ? 'selected' : ''}>Principle / Concept / Law</option>
              <option value="Myself" ${data.category === 'Myself' ? 'selected' : ''}>Myself</option>
            </select>
          </div>
        </div>

        <!-- STEP 2: Column 2 -->
        <div class="wizard-pane" data-step="2">
          <div class="form-banner">
            <strong>Column 2 (Big Book p. 65):</strong> "We asked ourselves why we were angry." State the specific injury, slight, betrayal, or offense.
          </div>

          <div class="form-group">
            <label for="resCause">The Cause (What happened?): <span class="required">*</span></label>
            <textarea id="resCause" name="cause" class="form-control" rows="4" required placeholder="Describe specifically what they did or said (e.g. 'Broke promise to pay back loan; criticized me in public; neglected my emotional needs; fired me without explanation').">${this.escape(data.cause)}</textarea>
            <div class="form-hint">State the bare facts simply and directly. Avoid writing a novel or justifying yourself.</div>
          </div>
        </div>

        <!-- STEP 3: Column 3 -->
        <div class="wizard-pane" data-step="3">
          <div class="form-banner">
            <strong>Column 3 (Big Book p. 65):</strong> "In most cases it was found that our self-esteem, our pocketbooks, our ambitions, our personal relationships (including sex) were hurt or threatened."
          </div>

          <label class="section-label">Check every instinctive area that felt wounded or threatened:</label>
          <div class="checkbox-grid">
            ${BIG_BOOK_DATA.glossary.instincts.map(inst => `
              <label class="checkbox-card">
                <input type="checkbox" name="affects" value="${inst.id}" ${data.affects.includes(inst.id) ? 'checked' : ''}>
                <div class="card-text">
                  <strong>${inst.name}</strong>
                  <span>${inst.description}</span>
                  <small class="prompt-hint">${inst.question}</small>
                </div>
              </label>
            `).join('')}
          </div>
        </div>

        <!-- STEP 4: Column 4 -->
        <div class="wizard-pane" data-step="4">
          <div class="form-banner alert-highlight">
            <strong>Column 4: The Turnaround (p. 67):</strong> "Putting out of our minds the wrongs others had done, we resolutely looked for our own mistakes. Where had we been selfish, dishonest, self-seeking and frightened? Where were we to blame?"
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label for="resSelfish">1. Where was I Selfish?</label>
              <textarea id="resSelfish" name="selfish" class="form-control" rows="2" placeholder="What did I want regardless of anyone else?">${this.escape(data.selfish)}</textarea>
              <div class="opposite-hint">🌿 <em>Asset:</em> Selfless, generous, considering others first.</div>
            </div>

            <div class="form-group">
              <label for="resDishonest">2. Where was I Dishonest?</label>
              <textarea id="resDishonest" name="dishonest" class="form-control" rows="2" placeholder="What lies, pretenses, or omissions was I fostering?">${this.escape(data.dishonest)}</textarea>
              <div class="opposite-hint">🌿 <em>Asset:</em> Rigorous honesty, authenticity, admitting errors.</div>
            </div>

            <div class="form-group">
              <label for="resSelfSeeking">3. Where was I Self-Seeking?</label>
              <textarea id="resSelfSeeking" name="selfSeeking" class="form-control" rows="2" placeholder="What was my hidden motive? How was I trying to control?">${this.escape(data.selfSeeking)}</textarea>
              <div class="opposite-hint">🌿 <em>Asset:</em> Loving service, asking 'How can I help?'</div>
            </div>

            <div class="form-group">
              <label for="resFrightened">4. Where was I Frightened?</label>
              <textarea id="resFrightened" name="frightened" class="form-control" rows="2" placeholder="What fear was underneath? (Fear of loss, rejection, exposure?)">${this.escape(data.frightened)}</textarea>
              <div class="opposite-hint">🌿 <em>Asset:</em> Faith in God, courage, spiritual reliance.</div>
            </div>
          </div>

          <div class="form-group">
            <label for="resMyPart">Whose fault was it? / Where was I to blame? (My Mistakes):</label>
            <textarea id="resMyPart" name="myPart" class="form-control" rows="3" placeholder="Disregarding the other person entirely: how did I set the ball rolling? What was my mistake in this situation?">${this.escape(data.myPart)}</textarea>
          </div>

          <div class="form-group">
            <label for="resOppositeAsset">Spiritual Principle / Asset to Cultivate:</label>
            <input type="text" id="resOppositeAsset" name="oppositeAsset" class="form-control" placeholder="e.g. Unconditional forgiveness, honest communication, financial prudence" value="${this.escape(data.oppositeAsset || '')}">
          </div>
        </div>

        <!-- STEP 5: Sick Man Prayer & Amends -->
        <div class="wizard-pane" data-step="5">
          <div class="prayer-box">
            <div class="prayer-header-row">
              <h4>The Freedom from Resentment Prayer (p. 67)</h4>
              <button type="button" class="btn btn-xs btn-outline" onclick="window.soundService.playChime(432)">🔔 Ring Bell</button>
            </div>
            <p class="prayer-text">"This was our course: We realized that the people who wronged us were perhaps spiritually sick. Though we did not like their symptoms and the way these disturbed us, they, like ourselves, were sick too. We asked God to help us show them the same tolerance, pity, and patience that we would cheerfully grant a sick friend. When a person offended we said to ourselves: 'This is a sick person. How can I be helpful to him? God save me from being angry. Thy will be done.'"</p>
          </div>

          <div class="form-group mt-3">
            <label class="checkbox-card">
              <input type="checkbox" id="resAmendsNeeded" name="amendsNeeded" ${data.amendsNeeded ? 'checked' : ''}>
              <div class="card-text">
                <strong>Did I harm this person / Do I owe amends in Steps 8 & 9?</strong>
                <span>Flagging this person will automatically highlight them for your Step 8/9 Amends list.</span>
              </div>
            </label>
          </div>

          <div class="form-group" id="amendsNotesGroup" style="${data.amendsNeeded ? '' : 'display: none;'}">
            <label for="resAmendsNotes">Amends Notes / Harms Done:</label>
            <textarea id="resAmendsNotes" name="amendsNotes" class="form-control" rows="2" placeholder="What harm did I cause, and what kind of amends might be needed (sincere apology, financial restitution, changed behavior)?">${this.escape(data.amendsNotes)}</textarea>
          </div>
        </div>

        <!-- Navigation Controls -->
        <div class="modal-footer">
          <div class="footer-left">
            <button type="button" class="btn btn-secondary" id="btnWizardPrev" style="display: none;">← Previous</button>
          </div>
          <div class="footer-right">
            <button type="button" class="btn btn-secondary" id="btnModalCancel">Cancel</button>
            <button type="button" class="btn btn-primary" id="btnWizardNext">Next →</button>
            <button type="submit" class="btn btn-accent" id="btnWizardSubmit" style="display: none;">Save Resentment</button>
          </div>
        </div>
      </form>
    `;

    AppUI.showModal(modalTitle, contentHtml);
    this.setupResentmentFormListeners(id);
  },

  setupResentmentFormListeners(id) {
    const form = document.getElementById('resentmentForm');
    const stepBtns = document.querySelectorAll('.wizard-step-btn');
    const panes = document.querySelectorAll('.wizard-pane');
    const btnPrev = document.getElementById('btnWizardPrev');
    const btnNext = document.getElementById('btnWizardNext');
    const btnSubmit = document.getElementById('btnWizardSubmit');
    const btnCancel = document.getElementById('btnModalCancel');
    const amendsCheck = document.getElementById('resAmendsNeeded');
    const amendsNotesGroup = document.getElementById('amendsNotesGroup');

    amendsCheck.addEventListener('change', (e) => {
      amendsNotesGroup.style.display = e.target.checked ? 'block' : 'none';
    });

    const updateStep = (newStep) => {
      this.currentWizardStep = newStep;
      stepBtns.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.step) === newStep);
      });
      panes.forEach(pane => {
        pane.classList.toggle('active', parseInt(pane.dataset.step) === newStep);
      });

      btnPrev.style.display = newStep > 1 ? 'inline-flex' : 'none';
      if (newStep === 5) {
        btnNext.style.display = 'none';
        btnSubmit.style.display = 'inline-flex';
      } else {
        btnNext.style.display = 'inline-flex';
        btnSubmit.style.display = 'none';
      }
    };

    stepBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        updateStep(parseInt(btn.dataset.step));
      });
    });

    btnNext.addEventListener('click', () => {
      if (this.currentWizardStep < 5) {
        if (this.currentWizardStep === 1) {
          const target = document.getElementById('resTarget').value.trim();
          if (!target) {
            alert('Please specify who or what you are resentful at.');
            return;
          }
        }
        if (this.currentWizardStep === 2) {
          const cause = document.getElementById('resCause').value.trim();
          if (!cause) {
            alert('Please describe the cause of your resentment.');
            return;
          }
        }
        updateStep(this.currentWizardStep + 1);
      }
    });

    btnPrev.addEventListener('click', () => {
      if (this.currentWizardStep > 1) {
        updateStep(this.currentWizardStep - 1);
      }
    });

    btnCancel.addEventListener('click', () => AppUI.closeModal());

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const affects = Array.from(form.querySelectorAll('input[name="affects"]:checked')).map(el => el.value);

      const payload = {
        target: formData.get('target').trim(),
        category: formData.get('category'),
        cause: formData.get('cause').trim(),
        affects: affects,
        selfish: formData.get('selfish').trim(),
        dishonest: formData.get('dishonest').trim(),
        selfSeeking: formData.get('selfSeeking').trim(),
        frightened: formData.get('frightened').trim(),
        myPart: formData.get('myPart').trim(),
        oppositeAsset: formData.get('oppositeAsset') ? formData.get('oppositeAsset').trim() : '',
        amendsNeeded: amendsCheck.checked,
        amendsNotes: formData.get('amendsNotes') ? formData.get('amendsNotes').trim() : ''
      };

      if (id) {
        window.inventoryStore.updateResentment(id, payload);
      } else {
        window.inventoryStore.addResentment(payload);
      }

      window.soundService.playChime(528);
      AppUI.closeModal();
      AppUI.showToast(id ? 'Resentment updated.' : 'Resentment added to inventory.');
    });
  },

  // --- FEAR MODAL (pp. 67-68) ---
  openFearModal(id = null) {
    this.currentModalType = 'fear';
    this.currentEditingId = id;

    let data = {
      fear: '',
      why: '',
      affects: [],
      selfReliancePart: '',
      prayerPractice: ''
    };

    if (id) {
      const existing = window.inventoryStore.state.fears.find(f => f.id === id);
      if (existing) {
        data = { ...existing };
      }
    }

    const modalTitle = id ? 'Edit Fear' : 'New Fear Inventory (pp. 67-68)';
    const contentHtml = `
      <form id="fearForm" class="inventory-form">
        <div class="form-banner">
          <strong>Big Book pp. 67-68:</strong> "We reviewed our fears thoroughly. We put them on paper, even though we had no resentment in connection with them. We asked ourselves why we had them. Wasn't it because self-reliance failed us?"
        </div>

        <div class="form-group">
          <label for="fearName">What is the fear? <span class="required">*</span></label>
          <input type="text" id="fearName" name="fear" class="form-control" required placeholder="e.g. Financial ruin, Dying alone, Being exposed as a fraud, Being unloved, Public speaking" value="${this.escape(data.fear)}">
          <div class="quick-picks-row mt-1">
            <span class="quick-pick-label">Common fears:</span>
            <button type="button" class="quick-pick-btn" onclick="document.getElementById('fearName').value='Financial Insecurity / Poverty'">Poverty</button>
            <button type="button" class="quick-pick-btn" onclick="document.getElementById('fearName').value='Rejection & Being Alone'">Rejection</button>
            <button type="button" class="quick-pick-btn" onclick="document.getElementById('fearName').value='Illness & Death'">Illness</button>
            <button type="button" class="quick-pick-btn" onclick="document.getElementById('fearName').value='What People Think of Me'">Judgment</button>
            <button type="button" class="quick-pick-btn" onclick="document.getElementById('fearName').value='Failure & Incompetence'">Failure</button>
          </div>
        </div>

        <div class="form-group">
          <label for="fearWhy">Why do I have it? (Where did self-reliance fail?): <span class="required">*</span></label>
          <textarea id="fearWhy" name="why" class="form-control" rows="3" required placeholder="Why does this fear grip me? Did I believe I had to control life on my own willpower?">${this.escape(data.why)}</textarea>
        </div>

        <label class="section-label">What areas of life does this fear affect?</label>
        <div class="checkbox-grid">
          ${BIG_BOOK_DATA.glossary.instincts.map(inst => `
            <label class="checkbox-card">
              <input type="checkbox" name="affects" value="${inst.id}" ${data.affects.includes(inst.id) ? 'checked' : ''}>
              <div class="card-text">
                <strong>${inst.name}</strong>
              </div>
            </label>
          `).join('')}
        </div>

        <div class="form-group mt-3">
          <label for="fearSelfReliance">Self-Reliance vs. God-Reliance (Our Mistake):</label>
          <textarea id="fearSelfReliance" name="selfReliancePart" class="form-control" rows="3" placeholder="How did relying on my own finite ego fail to solve this fear?">${this.escape(data.selfReliancePart)}</textarea>
        </div>

        <div class="prayer-box mt-3">
          <h4>The Big Book Fear Prayer (p. 68)</h4>
          <p class="prayer-text">"We ask Him to remove our fear and direct our attention to what He would have us be. At once, we commence to outgrow fear."</p>
        </div>

        <div class="form-group mt-3">
          <label for="fearPrayerPractice">Spiritual Turnaround (What would God have me be?):</label>
          <textarea id="fearPrayerPractice" name="prayerPractice" class="form-control" rows="2" placeholder="Instead of living in this fear, what would God have me be? (e.g. Faithful, trustful, courageous, helpful to others).">${this.escape(data.prayerPractice)}</textarea>
        </div>

        <div class="modal-footer">
          <div class="footer-left"></div>
          <div class="footer-right">
            <button type="button" class="btn btn-secondary" onclick="AppUI.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-accent">Save Fear</button>
          </div>
        </div>
      </form>
    `;

    AppUI.showModal(modalTitle, contentHtml);

    const form = document.getElementById('fearForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const affects = Array.from(form.querySelectorAll('input[name="affects"]:checked')).map(el => el.value);

      const payload = {
        fear: formData.get('fear').trim(),
        why: formData.get('why').trim(),
        affects: affects,
        selfReliancePart: formData.get('selfReliancePart').trim(),
        prayerPractice: formData.get('prayerPractice').trim()
      };

      if (id) {
        window.inventoryStore.updateFear(id, payload);
      } else {
        window.inventoryStore.addFear(payload);
      }

      window.soundService.playChime(528);
      AppUI.closeModal();
      AppUI.showToast(id ? 'Fear updated.' : 'Fear added to inventory.');
    });
  },

  // --- SEX CONDUCT MODAL (pp. 68-70) ---
  openSexConductModal(id = null) {
    this.currentModalType = 'sexConduct';
    this.currentEditingId = id;

    let data = {
      person: '',
      selfish: '',
      dishonest: '',
      inconsiderate: '',
      hurt: '',
      jealousy: '',
      whereAtFault: '',
      whatShouldHaveDone: '',
      soundSaneIdeal: '',
      willingAmends: ''
    };

    if (id) {
      const existing = window.inventoryStore.state.sexConduct.find(s => s.id === id);
      if (existing) {
        data = { ...existing };
      }
    }

    const modalTitle = id ? 'Edit Sex Conduct Entry' : 'New Sex Conduct & Relationships Inventory (pp. 68-70)';
    const contentHtml = `
      <form id="sexForm" class="inventory-form">
        <div class="form-banner">
          <strong>Big Book pp. 68-70:</strong> "Now about sex. Many of us needed an overhauling there. But above all, we tried to be sensible on this subject... We reviewed our own past conduct over the years."
        </div>

        <div class="form-group">
          <label for="sexPerson">Person / Relationship: <span class="required">*</span></label>
          <input type="text" id="sexPerson" name="person" class="form-control" required placeholder="Name of partner, spouse, or person involved" value="${this.escape(data.person)}">
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label for="sexSelfish">1. Where had we been selfish?</label>
            <textarea id="sexSelfish" name="selfish" class="form-control" rows="2" placeholder="Used them for sex, comfort, ego?">${this.escape(data.selfish)}</textarea>
          </div>

          <div class="form-group">
            <label for="sexDishonest">2. Where had we been dishonest?</label>
            <textarea id="sexDishonest" name="dishonest" class="form-control" rows="2" placeholder="Lies, broken vows, secret affairs, false feelings?">${this.escape(data.dishonest)}</textarea>
          </div>

          <div class="form-group">
            <label for="sexInconsiderate">3. Where had we been inconsiderate?</label>
            <textarea id="sexInconsiderate" name="inconsiderate" class="form-control" rows="2" placeholder="Disregarded their feelings or emotional safety?">${this.escape(data.inconsiderate)}</textarea>
          </div>

          <div class="form-group">
            <label for="sexHurt">4. Whom had we hurt?</label>
            <textarea id="sexHurt" name="hurt" class="form-control" rows="2" placeholder="The partner, their family, children, our self-respect?">${this.escape(data.hurt)}</textarea>
          </div>
        </div>

        <div class="form-group">
          <label for="sexJealousy">5. Did we unjustifiably arouse jealousy, suspicion or bitterness?</label>
          <textarea id="sexJealousy" name="jealousy" class="form-control" rows="2" placeholder="Mind games, secrecy, flirtatious manipulation?">${this.escape(data.jealousy)}</textarea>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label for="sexWhereAtFault">6. Where were we at fault?</label>
            <textarea id="sexWhereAtFault" name="whereAtFault" class="form-control" rows="2" placeholder="My exact mistakes in this relationship">${this.escape(data.whereAtFault)}</textarea>
          </div>

          <div class="form-group">
            <label for="sexWhatShouldHaveDone">7. What should we have done instead?</label>
            <textarea id="sexWhatShouldHaveDone" name="whatShouldHaveDone" class="form-control" rows="2" placeholder="Honesty, respect, healthy boundaries, clean separation?">${this.escape(data.whatShouldHaveDone)}</textarea>
          </div>
        </div>

        <div class="form-group">
          <label for="sexSoundSaneIdeal">8. Developing a Sound & Sane Ideal for the Future (p. 69):</label>
          <textarea id="sexSoundSaneIdeal" name="soundSaneIdeal" class="form-control" rows="2" placeholder="What is our ideal for relationship and sexual conduct? (e.g. Unselfish, honest, spiritual, mutually supportive)">${this.escape(data.soundSaneIdeal)}</textarea>
        </div>

        <div class="form-group">
          <label for="sexWillingAmends">9. Willingness to Make Amends (Steps 8 & 9):</label>
          <textarea id="sexWillingAmends" name="willingAmends" class="form-control" rows="2" placeholder="Are we willing to repair damage, provided it does not harm them or others?">${this.escape(data.willingAmends)}</textarea>
        </div>

        <div class="modal-footer">
          <div class="footer-left"></div>
          <div class="footer-right">
            <button type="button" class="btn btn-secondary" onclick="AppUI.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-accent">Save Sex Conduct Entry</button>
          </div>
        </div>
      </form>
    `;

    AppUI.showModal(modalTitle, contentHtml);

    const form = document.getElementById('sexForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      const payload = {
        person: formData.get('person').trim(),
        selfish: formData.get('selfish').trim(),
        dishonest: formData.get('dishonest').trim(),
        inconsiderate: formData.get('inconsiderate').trim(),
        hurt: formData.get('hurt').trim(),
        jealousy: formData.get('jealousy').trim(),
        whereAtFault: formData.get('whereAtFault').trim(),
        whatShouldHaveDone: formData.get('whatShouldHaveDone').trim(),
        soundSaneIdeal: formData.get('soundSaneIdeal').trim(),
        willingAmends: formData.get('willingAmends').trim()
      };

      if (id) {
        window.inventoryStore.updateSexConduct(id, payload);
      } else {
        window.inventoryStore.addSexConduct(payload);
      }

      window.soundService.playChime(528);
      AppUI.closeModal();
      AppUI.showToast(id ? 'Sex conduct entry updated.' : 'Sex conduct entry saved.');
    });
  },

  // --- HARMS MODAL (Step 8 prep) ---
  openHarmModal(id = null) {
    this.currentModalType = 'harm';
    this.currentEditingId = id;

    let data = {
      person: '',
      description: '',
      financialHarm: false,
      financialAmount: '',
      emotionalHarm: true,
      restitutionPlan: '',
      willingness: 'Willing'
    };

    if (id) {
      const existing = window.inventoryStore.state.harms.find(h => h.id === id);
      if (existing) {
        data = { ...existing };
      }
    }

    const modalTitle = id ? 'Edit Harm Entry' : 'New Harm to Others (Pre-Step 8)';
    const contentHtml = `
      <form id="harmForm" class="inventory-form">
        <div class="form-banner">
          <strong>Harms Inventory:</strong> Beyond resentments and sex conduct, list other people or institutions you harmed (through theft, unpaid debts, broken promises, negligence, or slander) to prepare for Steps 8 and 9.
        </div>

        <div class="form-group">
          <label for="harmPerson">Person or Institution Harmed: <span class="required">*</span></label>
          <input type="text" id="harmPerson" name="person" class="form-control" required placeholder="e.g. Landlord, Former business partner, Old friend, Credit card company" value="${this.escape(data.person)}">
        </div>

        <div class="form-group">
          <label for="harmDesc">Description of Harm: <span class="required">*</span></label>
          <textarea id="harmDesc" name="description" class="form-control" rows="3" required placeholder="What specifically did I do to harm or cheat them?">${this.escape(data.description)}</textarea>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="checkbox-card">
              <input type="checkbox" id="harmFinCheck" name="financialHarm" ${data.financialHarm ? 'checked' : ''}>
              <div class="card-text">
                <strong>Financial / Property Harm</strong>
                <span>Money stolen, unpaid debts, damaged property</span>
              </div>
            </label>
          </div>

          <div class="form-group" id="harmAmountGroup" style="${data.financialHarm ? '' : 'display: none;'}">
            <label for="harmAmount">Amount or Property description:</label>
            <input type="text" id="harmAmount" name="financialAmount" class="form-control" placeholder="e.g. $500 unpaid rent" value="${this.escape(data.financialAmount)}">
          </div>
        </div>

        <div class="form-group">
          <label for="harmRestitution">Restitution / Amends Plan:</label>
          <textarea id="harmRestitution" name="restitutionPlan" class="form-control" rows="2" placeholder="What restitution or direct amends is necessary when ready?">${this.escape(data.restitutionPlan)}</textarea>
        </div>

        <div class="form-group">
          <label for="harmWillingness">Current Willingness (Step 8):</label>
          <select id="harmWillingness" name="willingness" class="form-control">
            <option value="Willing" ${data.willingness === 'Willing' ? 'selected' : ''}>Willing to make amends</option>
            <option value="Willing to become willing" ${data.willingness === 'Willing to become willing' ? 'selected' : ''}>Willing to become willing (need prayer / sponsor help)</option>
            <option value="Hesitant / Unsure" ${data.willingness === 'Hesitant / Unsure' ? 'selected' : ''}>Hesitant / Unsure (fear of consequences)</option>
            <option value="Direct amends would injure them" ${data.willingness === 'Direct amends would injure them' ? 'selected' : ''}>Direct amends would injure them or others (living amends only)</option>
          </select>
        </div>

        <div class="modal-footer">
          <div class="footer-left"></div>
          <div class="footer-right">
            <button type="button" class="btn btn-secondary" onclick="AppUI.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-accent">Save Harm</button>
          </div>
        </div>
      </form>
    `;

    AppUI.showModal(modalTitle, contentHtml);

    const form = document.getElementById('harmForm');
    const finCheck = document.getElementById('harmFinCheck');
    const amountGroup = document.getElementById('harmAmountGroup');

    finCheck.addEventListener('change', (e) => {
      amountGroup.style.display = e.target.checked ? 'block' : 'none';
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      const payload = {
        person: formData.get('person').trim(),
        description: formData.get('description').trim(),
        financialHarm: finCheck.checked,
        financialAmount: formData.get('financialAmount') ? formData.get('financialAmount').trim() : '',
        restitutionPlan: formData.get('restitutionPlan').trim(),
        willingness: formData.get('willingness')
      };

      if (id) {
        window.inventoryStore.updateHarm(id, payload);
      } else {
        window.inventoryStore.addHarm(payload);
      }

      window.soundService.playChime(528);
      AppUI.closeModal();
      AppUI.showToast(id ? 'Harm entry updated.' : 'Harm entry saved.');
    });
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

window.InventoryForms = InventoryForms;
