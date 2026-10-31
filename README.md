# 4th Step Moral Inventory — Alcoholics Anonymous

[![Live at four.kevns.com](https://img.shields.io/badge/Live%20Site-four.kevns.com-2d5038?style=for-the-badge&logo=safari)](https://four.kevns.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub-halsteadkevin365--stack%2Ffour-181717?style=for-the-badge&logo=github)](https://github.com/halsteadkevin365-stack/four)
[![License: MIT](https://img.shields.io/badge/License-MIT-gold?style=for-the-badge)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20First-blue?style=for-the-badge&logo=pwa)](https://four.kevns.com)

A private, fearless, and spiritually grounded web application designed strictly in accordance with Chapter 5 ("How It Works", pages 64–71) and Chapter 6 ("Into Action", pages 72–75) of the book *Alcoholics Anonymous* (the Big Book).

---

## 🌐 Live Web Access & Domain

The application is deployed and configured for custom domain:
- **Primary Domain**: [**https://four.kevns.com**](https://four.kevns.com)
- **GitHub Repository**: [**https://github.com/halsteadkevin365-stack/four**](https://github.com/halsteadkevin365-stack/four)

---

## 🍏 Native macOS Desktop App

A pre-built native universal binary (`arm64` + `x86_64`) for macOS is included:
- **Location**: [`AA Fourth Step Inventory.app`](file:///Users/kevinh/.gemini/antigravity/scratch/aa-fourth-step-inventory/AA%20Fourth%20Step%20Inventory.app)
- **To Launch**: Double-click `AA Fourth Step Inventory.app` in Finder, or run `./Start\ Inventory\ App.command`.
- **To Install System-Wide**:
  ```bash
  cp -R "AA Fourth Step Inventory.app" /Applications/
  ```

---

## 📖 Authentic Big Book Architecture

### 1. Resentment Inventory (The 4 Columns — pp. 64–67)
- **Column 1: "I'm Resentful At"**: Persons, Family, Workplace/Employers, Institutions, Authorities, Religion/God, Principles/Law, or Myself.
- **Column 2: "The Cause"**: The specific injury, betrayal, slight, or offense stated plainly.
- **Column 3: "Affects My"**: Interactive checklist with tooltips for the 7 instinctual areas:
  - *Self-Esteem* (how I view myself)
  - *Pride* (how I want others to see me)
  - *Pocketbook* (finances, livelihood, material security)
  - *Security* (emotional and physical safety)
  - *Ambitions* (plans, goals, and demands)
  - *Personal Relationships* (bonds with family, friends, partners)
  - *Sex Relations* (romantic and intimate conduct)
- **Column 4: "The Turnaround / Where Was I to Blame?"**:
  - *Selfish*: What did I want regardless of others? ➔ **Spiritual Asset:** *Selfless & Generous*
  - *Dishonest*: What lies or false impressions did I cultivate? ➔ **Spiritual Asset:** *Rigorous Honesty & Authenticity*
  - *Self-Seeking*: What was my hidden agenda? ➔ **Spiritual Asset:** *Loving Service & Consideration*
  - *Frightened*: What fear was underneath? ➔ **Spiritual Asset:** *Courage & Faith in God*
  - *My Mistakes / Fault:* Disregarding the other person entirely, how did I set the ball rolling?
- **The Sick Man's Prayer (p. 67)**: Integrated prayer contemplation tool (*"God save me from being angry. This is a sick person. How can I be helpful to them? Thy will be done."*).

### 2. 14-Day Freedom from Resentment Prayer Tracker
Built-in practice tool for the classic AA exercise:
> *"If you have a resentment you want to be free of, pray for that person or institution every day for 14 days. Ask for everything you want for yourself to be given to them—health, prosperity, happiness, and peace of mind."*
- Check off daily prayers with Tibetan bell chimes and reflection notes.

### 3. Fear Inventory (pp. 67–68)
- Complete disclosure of fears on paper (*"even though we had no resentment in connection with them"*).
- Guided analysis: *"Why do we have it? Wasn't it because self-reliance failed us?"*
- Freedom from fear turnaround & Big Book Fear Prayer (*"We ask Him to remove our fear and direct our attention to what He would have us be"*).

### 4. Sex Conduct & Relationship Inventory (pp. 68–70)
Evaluating past relationships against the 9 explicit Big Book questions (p. 69):
1. Where had we been selfish?
2. Where had we been dishonest?
3. Where had we been inconsiderate?
4. Whom had we hurt?
5. Did we unjustifiably arouse jealousy, suspicion, or bitterness?
6. Where were we at fault?
7. What should we have done instead?
8. Developing a sound and sane ideal for the future.
9. Willingness to make amends (precursor to Steps 8 & 9).

### 5. Harms to Others (Step 8 Prep)
- Recording individuals or organizations harmed outside of resentments and sex conduct (financial debts, broken trusts, negligence, property damage).
- Restitution planning and willingness ratings.

### 6. Contemplation Timer & Soundscapes
- Built-in Web Audio API synthesized **Tibetan Singing Bowl (432Hz / 528Hz)** chime.
- Soothing procedural pink-noise **Ambient Calm** soundscape.
- Quiet contemplation countdown timer (3m, 5m, 10m) before writing sessions.

### 7. Step 5 Sponsor Suite & Publication-Quality Printing
- Clean, book-like layout specifically formatted for sitting across the table with a sponsor.
- Private "Sponsor Discussion Notes" scratchpad.
- Big Book Step 5 Promises reading (p. 75).
- Print stylesheet (`css/print.css`) hides buttons and web UI for a crisp, physical printout or PDF.

---

## 🔒 Privacy & Cryptographic Security

The Fourth Step contains deeply sensitive personal reflections:
- **100% Client-Side Local Storage**: No data is ever transmitted over the network or stored in external databases.
- **Web Crypto AES-256-GCM Encryption**: When PIN protection is enabled, all inventory records are encrypted using PBKDF2 (100,000 iterations, SHA-256) + AES-GCM before saving to `localStorage`.
- **Instant Privacy Shield (Panic Button)**: Press the <kbd>Esc</kbd> key at any moment to immediately blur and mask the screen with an ultra-realistic "Daily Notes & Reflections" journal page.
- **Comprehensive Backups**:
  - Export as **Markdown (`.md`)** for personal note applications (Obsidian, Bear, Apple Notes).
  - Export as **CSV** for spreadsheet tools (Excel, Numbers, Sheets).
  - Export as **JSON** for complete offline migration and restore.

---

## 🛠️ Local Development & Running

### Option 1: Double-Click Desktop Launcher
- Double-click `Start Inventory App.command` or `AA Fourth Step Inventory.app`.

### Option 2: Local Python Server
```bash
python3 -m http.server 8080
# Open http://localhost:8080
```

### Option 3: Direct File
- Double-click `index.html` to open in any modern browser.

---

## ☁️ Deployment

- **GitHub Pages**: Configured via `CNAME` (`four.kevns.com`) and `.github/workflows/deploy.yml`.
- **Cloudflare**: Configured with `wrangler.jsonc` for Cloudflare Workers / Pages deployment.
