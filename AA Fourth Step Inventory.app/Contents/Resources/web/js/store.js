/**
 * Local Storage & State Management with Privacy, AES-GCM Crypto, and Export Capabilities
 * 100% Client-Side, Zero Telemetry.
 */

class InventoryStore {
  constructor() {
    this.STORAGE_KEY = 'aa_fourth_step_inventory_v2';
    this.LEGACY_KEY = 'aa_fourth_step_inventory_v1';
    this.SETTINGS_KEY = 'aa_fourth_step_settings_v2';
    this.PIN_KEY = 'aa_fourth_step_pin_v2';
    this.SALT_KEY = 'aa_fourth_step_salt_v2';

    this.state = {
      resentments: [],
      fears: [],
      sexConduct: [],
      harms: [],
      sponsorNotes: ''
    };

    this.settings = {
      theme: 'parchment', // 'parchment' | 'midnight' | 'sanctuary' | 'pearl'
      pinEnabled: false,
      privacyShield: false,
      autoLockMinutes: 15,
      soundEnabled: true,
      hasSeenIntro: false
    };

    this.isUnlocked = true;
    this.activeCryptoKey = null;
    this.subscribers = [];
    this.init();
  }

  init() {
    this.loadSettings();
    if (this.settings.pinEnabled) {
      this.isUnlocked = false;
    } else {
      this.loadData();
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify(eventType, payload) {
    this.subscribers.forEach(cb => {
      try {
        cb(eventType, payload, this.state);
      } catch (err) {
        console.error('Store subscriber error:', err);
      }
    });
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem(this.SETTINGS_KEY);
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
  }

  saveSettings() {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
      this.notify('settings_changed', this.settings);
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  async loadData() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        if (this.settings.pinEnabled && this.activeCryptoKey) {
          // Decrypt
          const decrypted = await this.decryptPayload(saved, this.activeCryptoKey);
          this.state = JSON.parse(decrypted);
        } else {
          try {
            this.state = JSON.parse(saved);
          } catch (e) {
            console.warn('Data may be encrypted or corrupted');
          }
        }
      } else {
        // Try migrating from v1
        const legacy = localStorage.getItem(this.LEGACY_KEY);
        if (legacy) {
          try {
            this.state = { ...this.state, ...JSON.parse(legacy) };
            this.saveData();
          } catch (e) {
            this.loadSampleData(false);
          }
        } else {
          this.loadSampleData(false);
        }
      }
      this.notify('data_loaded', this.state);
    } catch (e) {
      console.error('Failed to load inventory data:', e);
    }
  }

  async saveData() {
    if (!this.isUnlocked && this.settings.pinEnabled) {
      console.warn('Cannot save while locked.');
      return;
    }
    try {
      const jsonString = JSON.stringify(this.state);
      if (this.settings.pinEnabled && this.activeCryptoKey) {
        const encrypted = await this.encryptPayload(jsonString, this.activeCryptoKey);
        localStorage.setItem(this.STORAGE_KEY, encrypted);
      } else {
        localStorage.setItem(this.STORAGE_KEY, jsonString);
      }
      this.notify('data_saved', this.state);
    } catch (e) {
      console.error('Failed to save inventory data:', e);
    }
  }

  loadSampleData(force = true) {
    if (typeof BIG_BOOK_DATA !== 'undefined' && BIG_BOOK_DATA.sampleInventory) {
      this.state = JSON.parse(JSON.stringify(BIG_BOOK_DATA.sampleInventory));
      if (!this.state.sponsorNotes) {
        this.state.sponsorNotes = '';
      }
      if (force) {
        this.saveData();
      }
    }
  }

  clearAllData() {
    this.state = {
      resentments: [],
      fears: [],
      sexConduct: [],
      harms: [],
      sponsorNotes: ''
    };
    this.saveData();
    this.notify('data_cleared', null);
  }

  // --- CRUD METHODS ---
  addResentment(item) {
    const newItem = {
      id: 'res_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      prayerDaysCompleted: new Array(14).fill(false),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    if (!Array.isArray(newItem.prayerDaysCompleted)) {
      newItem.prayerDaysCompleted = new Array(14).fill(false);
    }
    this.state.resentments.unshift(newItem);
    this.saveData();
    return newItem;
  }

  updateResentment(id, updates) {
    const idx = this.state.resentments.findIndex(r => r.id === id);
    if (idx !== -1) {
      this.state.resentments[idx] = {
        ...this.state.resentments[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveData();
      return this.state.resentments[idx];
    }
    return null;
  }

  togglePrayerDay(id, dayIndex) {
    const item = this.state.resentments.find(r => r.id === id);
    if (item) {
      if (!Array.isArray(item.prayerDaysCompleted)) {
        item.prayerDaysCompleted = new Array(14).fill(false);
      }
      item.prayerDaysCompleted[dayIndex] = !item.prayerDaysCompleted[dayIndex];
      this.saveData();
      return item.prayerDaysCompleted[dayIndex];
    }
    return false;
  }

  deleteResentment(id) {
    this.state.resentments = this.state.resentments.filter(r => r.id !== id);
    this.saveData();
  }

  addFear(item) {
    const newItem = {
      id: 'fear_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    this.state.fears.unshift(newItem);
    this.saveData();
    return newItem;
  }

  updateFear(id, updates) {
    const idx = this.state.fears.findIndex(f => f.id === id);
    if (idx !== -1) {
      this.state.fears[idx] = {
        ...this.state.fears[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveData();
      return this.state.fears[idx];
    }
    return null;
  }

  deleteFear(id) {
    this.state.fears = this.state.fears.filter(f => f.id !== id);
    this.saveData();
  }

  addSexConduct(item) {
    const newItem = {
      id: 'sex_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    this.state.sexConduct.unshift(newItem);
    this.saveData();
    return newItem;
  }

  updateSexConduct(id, updates) {
    const idx = this.state.sexConduct.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.state.sexConduct[idx] = {
        ...this.state.sexConduct[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveData();
      return this.state.sexConduct[idx];
    }
    return null;
  }

  deleteSexConduct(id) {
    this.state.sexConduct = this.state.sexConduct.filter(s => s.id !== id);
    this.saveData();
  }

  addHarm(item) {
    const newItem = {
      id: 'harm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    this.state.harms.unshift(newItem);
    this.saveData();
    return newItem;
  }

  updateHarm(id, updates) {
    const idx = this.state.harms.findIndex(h => h.id === id);
    if (idx !== -1) {
      this.state.harms[idx] = {
        ...this.state.harms[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveData();
      return this.state.harms[idx];
    }
    return null;
  }

  deleteHarm(id) {
    this.state.harms = this.state.harms.filter(h => h.id !== id);
    this.saveData();
  }

  saveSponsorNotes(notes) {
    this.state.sponsorNotes = notes;
    this.saveData();
  }

  // --- AES-256-GCM CRYPTOGRAPHY & PIN LOCK ---
  getSalt() {
    let saltHex = localStorage.getItem(this.SALT_KEY);
    if (!saltHex) {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
      localStorage.setItem(this.SALT_KEY, saltHex);
    }
    const match = saltHex.match(/.{1,2}/g);
    return new Uint8Array(match ? match.map(byte => parseInt(byte, 16)) : []);
  }

  async deriveKey(pin) {
    const enc = new TextEncoder();
    const pinBuffer = enc.encode(pin);
    const salt = this.getSalt();

    const baseKey = await crypto.subtle.importKey(
      'raw',
      pinBuffer,
      'PBKDF2',
      false,
      ['deriveKey', 'deriveBits']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async encryptPayload(plaintext, key) {
    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(plaintext)
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    let binary = '';
    const bytes = new Uint8Array(combined);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return 'ENC:' + btoa(binary);
  }

  async decryptPayload(cipherString, key) {
    if (!cipherString.startsWith('ENC:')) {
      return cipherString; // unencrypted fallback
    }
    const binary = atob(cipherString.slice(4));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const iv = bytes.slice(0, 12);
    const data = bytes.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    const dec = new TextDecoder();
    return dec.decode(decrypted);
  }

  async hashPin(pin) {
    const encoder = new TextEncoder();
    const salt = this.getSalt();
    const data = new Uint8Array([...encoder.encode(pin), ...salt]);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async setPin(pin) {
    if (!pin) {
      if (this.settings.pinEnabled && this.activeCryptoKey) {
        // Decrypt and save unencrypted
        const currentJson = JSON.stringify(this.state);
        localStorage.setItem(this.STORAGE_KEY, currentJson);
      }
      localStorage.removeItem(this.PIN_KEY);
      this.settings.pinEnabled = false;
      this.isUnlocked = true;
      this.activeCryptoKey = null;
      this.saveSettings();
      return true;
    }

    const key = await this.deriveKey(pin);
    const hash = await this.hashPin(pin);

    this.activeCryptoKey = key;
    localStorage.setItem(this.PIN_KEY, hash);
    this.settings.pinEnabled = true;
    this.isUnlocked = true;
    this.saveSettings();
    await this.saveData(); // Encrypt with new key
    this.notify('pin_set', true);
    return true;
  }

  async verifyPin(pin) {
    const storedHash = localStorage.getItem(this.PIN_KEY);
    if (!storedHash) return true;

    const inputHash = await this.hashPin(pin);
    if (inputHash === storedHash) {
      this.activeCryptoKey = await this.deriveKey(pin);
      this.isUnlocked = true;
      await this.loadData();
      this.notify('unlocked', true);
      return true;
    }
    return false;
  }

  lock() {
    if (this.settings.pinEnabled) {
      this.isUnlocked = false;
      this.activeCryptoKey = null;
      this.notify('locked', true);
    }
  }

  // --- ANALYTICS & PATTERNS ---
  getPatternAnalytics() {
    const instinctCounts = {
      self_esteem: 0,
      pride: 0,
      pocketbook: 0,
      security: 0,
      ambitions: 0,
      personal_relationships: 0,
      sex_relations: 0
    };

    let totalResentments = this.state.resentments.length;
    let turnaroundsCompleted = 0;
    let amendsIdentified = 0;
    let activePrayerTrackers = 0;

    let defectCounts = {
      selfish: 0,
      dishonest: 0,
      selfSeeking: 0,
      frightened: 0
    };

    this.state.resentments.forEach(r => {
      if (Array.isArray(r.affects)) {
        r.affects.forEach(inst => {
          if (instinctCounts[inst] !== undefined) {
            instinctCounts[inst]++;
          }
        });
      }
      if (r.selfish && r.selfish.trim()) defectCounts.selfish++;
      if (r.dishonest && r.dishonest.trim()) defectCounts.dishonest++;
      if (r.selfSeeking && r.selfSeeking.trim()) defectCounts.selfSeeking++;
      if (r.frightened && r.frightened.trim()) defectCounts.frightened++;

      if (r.myPart && r.myPart.trim().length > 5) {
        turnaroundsCompleted++;
      }
      if (r.amendsNeeded) {
        amendsIdentified++;
      }
      if (Array.isArray(r.prayerDaysCompleted) && r.prayerDaysCompleted.some(d => d)) {
        activePrayerTrackers++;
      }
    });

    return {
      totalResentments,
      totalFears: this.state.fears.length,
      totalSexConduct: this.state.sexConduct.length,
      totalHarms: this.state.harms.length,
      turnaroundsCompleted,
      amendsIdentified,
      activePrayerTrackers,
      instinctCounts,
      defectCounts
    };
  }

  // --- EXPORT & IMPORT ---
  exportJSON() {
    return JSON.stringify({
      app: 'AA 4th Step Moral Inventory',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      inventory: this.state
    }, null, 2);
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      const data = parsed.inventory || parsed;
      if (typeof data === 'object') {
        this.state = {
          resentments: Array.isArray(data.resentments) ? data.resentments : [],
          fears: Array.isArray(data.fears) ? data.fears : [],
          sexConduct: Array.isArray(data.sexConduct) ? data.sexConduct : [],
          harms: Array.isArray(data.harms) ? data.harms : [],
          sponsorNotes: data.sponsorNotes || ''
        };
        this.saveData();
        return { success: true };
      }
      return { success: false, error: 'Missing inventory data structure' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  exportMarkdown() {
    let md = '# Fourth Step Moral Inventory
';
    md += '*Alcoholics Anonymous, Chapter 5: "How It Works" (pp. 64-71)*
';
    md += 'Generated: ' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + '

';
    md += '> "Taking a commercial inventory is a fact-finding and a fact-facing process... We did exactly the same thing with our lives." (p. 64)

';

    // 1. Resentments
    md += '## 1. Resentment Inventory (The Four Columns)

';
    if (this.state.resentments.length === 0) {
      md += '*No resentments recorded.*

';
    } else {
      this.state.resentments.forEach((r, idx) => {
        md += '### ' + (idx + 1) + '. Resentful At: **' + (r.target || 'Unnamed') + '** (' + (r.category || 'Person') + ')

';
        md += '- **Column 2 (The Cause):** ' + (r.cause || 'N/A') + '
';
        md += '- **Column 3 (Affects My):** ' + (Array.isArray(r.affects) && r.affects.length ? r.affects.join(', ') : 'None marked') + '
';
        md += '- **Column 4 (The Turnaround / Where Was I To Blame?):**
';
        md += '  - *Where was I Selfish?* ' + (r.selfish || 'N/A') + '
';
        md += '  - *Where was I Dishonest?* ' + (r.dishonest || 'N/A') + '
';
        md += '  - *Where was I Self-Seeking?* ' + (r.selfSeeking || 'N/A') + '
';
        md += '  - *Where was I Frightened?* ' + (r.frightened || 'N/A') + '
';
        md += '  - *My Mistakes / Fault:* ' + (r.myPart || 'N/A') + '
';
        if (r.oppositeAsset) {
          md += '  - *Spiritual Asset to Cultivate:* ' + r.oppositeAsset + '
';
        }
        if (r.amendsNeeded) {
          md += '- **Amends Note (Steps 8/9):** ' + (r.amendsNotes || 'Yes, amends indicated') + '
';
        }
        md += '
';
      });
    }

    // 2. Fears
    md += '
## 2. Fear Inventory (pp. 67-68)

';
    if (this.state.fears.length === 0) {
      md += '*No fears recorded.*

';
    } else {
      this.state.fears.forEach((f, idx) => {
        md += '### ' + (idx + 1) + '. Fear: **' + (f.fear || 'Unnamed') + '**

';
        md += '- **Why do I have it? (Self-reliance):** ' + (f.why || 'N/A') + '
';
        md += '- **Affects My:** ' + (Array.isArray(f.affects) ? f.affects.join(', ') : 'N/A') + '
';
        md += '- **Where Self-Reliance Failed:** ' + (f.selfReliancePart || 'N/A') + '
';
        md += '- **Spiritual Turnaround (Fear Prayer):** ' + (f.prayerPractice || 'N/A') + '

';
      });
    }

    // 3. Sex Conduct
    md += '
## 3. Sex Conduct & Relationship Inventory (pp. 68-70)

';
    if (this.state.sexConduct.length === 0) {
      md += '*No sex conduct entries recorded.*

';
    } else {
      this.state.sexConduct.forEach((s, idx) => {
        md += '### ' + (idx + 1) + '. Person / Relationship: **' + (s.person || 'Unnamed') + '**

';
        md += '- **1. Selfish:** ' + (s.selfish || '—') + '
';
        md += '- **2. Dishonest:** ' + (s.dishonest || '—') + '
';
        md += '- **3. Inconsiderate:** ' + (s.inconsiderate || '—') + '
';
        md += '- **4. Whom had we hurt:** ' + (s.hurt || '—') + '
';
        md += '- **5. Aroused jealousy, suspicion or bitterness?** ' + (s.jealousy || '—') + '
';
        md += '- **6. Where were we at fault:** ' + (s.whereAtFault || '—') + '
';
        md += '- **7. What should we have done instead:** ' + (s.whatShouldHaveDone || '—') + '
';
        md += '- **8. Sound & sane ideal for future:** ' + (s.soundSaneIdeal || '—') + '
';
        md += '- **9. Willingness to make amends:** ' + (s.willingAmends || '—') + '

';
      });
    }

    // 4. Harms
    md += '
## 4. Harms Done to Others (Step 8 Prep)

';
    if (this.state.harms.length === 0) {
      md += '*No harms recorded.*

';
    } else {
      this.state.harms.forEach((h, idx) => {
        md += '### ' + (idx + 1) + '. Person / Organization: **' + (h.person || 'Unnamed') + '**

';
        md += '- **Harm description:** ' + (h.description || 'N/A') + '
';
        if (h.financialHarm) {
          md += '- **Financial Harm Amount:** ' + (h.financialAmount || 'Yes') + '
';
        }
        md += '- **Restitution Plan:** ' + (h.restitutionPlan || 'N/A') + '
';
        md += '- **Willingness:** ' + (h.willingness || 'Willing') + '

';
      });
    }

    if (this.state.sponsorNotes) {
      md += '
## 5. Sponsor Discussion & Fifth Step Notes

';
      md += this.state.sponsorNotes + '

';
    }

    return md;
  }

  exportCSV() {
    const rows = [
      ['Column 1: Resentful At', 'Category', 'Column 2: The Cause', 'Column 3: Affects My', 'Column 4: Selfish', 'Column 4: Dishonest', 'Column 4: Self-Seeking', 'Column 4: Frightened', 'Column 4: My Mistakes / Fault', 'Spiritual Asset', 'Amends Flag']
    ];

    this.state.resentments.forEach(r => {
      rows.push([
        r.target || '',
        r.category || '',
        r.cause || '',
        Array.isArray(r.affects) ? r.affects.join('; ') : '',
        r.selfish || '',
        r.dishonest || '',
        r.selfSeeking || '',
        r.frightened || '',
        r.myPart || '',
        r.oppositeAsset || '',
        r.amendsNeeded ? 'Yes' : 'No'
      ]);
    });

    return rows.map(e => e.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',')).join('
');
  }
}

window.inventoryStore = new InventoryStore();
