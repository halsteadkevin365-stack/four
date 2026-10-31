/**
 * Web Audio API Sound Synthesizer & Contemplation Timer
 * 100% offline, zero audio file dependencies.
 * Synthesizes peaceful Tibetan singing bowl chimes & ambient meditation tones.
 */

class SoundService {
  constructor() {
    this.ctx = null;
    this.ambientNode = null;
    this.ambientGain = null;
    this.isAmbientPlaying = false;
    this.timerInterval = null;
    this.timerRemaining = 0;
    this.onTimerTick = null;
    this.onTimerComplete = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Play a peaceful Tibetan Singing Bowl chime (multi-harmonic decay)
   */
  playChime(pitch = 432) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Harmonics of singing bowl
      const harmonics = [
        { freq: pitch, gain: 0.35, decay: 4.5 },
        { freq: pitch * 2.76, gain: 0.18, decay: 3.5 },
        { freq: pitch * 5.4, gain: 0.08, decay: 2.5 },
        { freq: pitch * 8.9, gain: 0.03, decay: 1.5 }
      ];

      harmonics.forEach(h => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(h.freq, now);

        // Subtle warm vibrato
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(4.5, now);
        lfoGain.gain.setValueAtTime(1.5, now);
        lfo.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + h.decay);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(h.gain, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + h.decay);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + h.decay);
      });
    } catch (e) {
      console.warn('Audio chime notice:', e);
    }
  }

  /**
   * Toggle gentle calming ambient noise (filtered warm pink noise)
   */
  toggleAmbient(enable = null) {
    try {
      this.initContext();
      if (!this.ctx) return false;

      const shouldPlay = enable !== null ? enable : !this.isAmbientPlaying;

      if (!shouldPlay && this.ambientGain) {
        // Fade out
        const now = this.ctx.currentTime;
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
        setTimeout(() => {
          if (this.ambientNode) {
            this.ambientNode.stop();
            this.ambientNode.disconnect();
            this.ambientNode = null;
          }
          this.isAmbientPlaying = false;
        }, 1300);
        return false;
      }

      if (shouldPlay && !this.isAmbientPlaying) {
        // Generate 4 seconds of warm pink noise buffer
        const bufferSize = this.ctx.sampleRate * 4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        // Warm lowpass filter
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, this.ctx.currentTime);

        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.ambientGain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 2.0);

        noise.connect(filter);
        filter.connect(this.ambientGain);
        this.ambientGain.connect(this.ctx.destination);

        noise.start();
        this.ambientNode = noise;
        this.isAmbientPlaying = true;
        return true;
      }
    } catch (e) {
      console.warn('Ambient audio error:', e);
    }
    return this.isAmbientPlaying;
  }

  /**
   * Start a contemplation countdown timer (in seconds)
   */
  startTimer(seconds, onTick, onComplete) {
    this.stopTimer();
    this.playChime(432); // Start chime
    this.timerRemaining = seconds;
    this.onTimerTick = onTick;
    this.onTimerComplete = onComplete;

    if (this.onTimerTick) {
      this.onTimerTick(this.timerRemaining);
    }

    this.timerInterval = setInterval(() => {
      this.timerRemaining--;
      if (this.onTimerTick) {
        this.onTimerTick(this.timerRemaining);
      }

      if (this.timerRemaining <= 0) {
        this.stopTimer();
        this.playChime(528); // Completion chime (528 Hz transformation frequency)
        if (this.onTimerComplete) {
          this.onTimerComplete();
        }
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timerRemaining = 0;
  }
}

window.soundService = new SoundService();
