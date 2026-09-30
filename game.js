/**
 * MATH SHOP — RETRO ARCADE SUPERMARKET & CASHIER ENGINE
 * Standard 3 Mathematics: Money, Decimals, Pricing & Exact Payment in Malaysian Ringgit (RM)
 * Pure Vector Graphics — 100% Emoji Free
 */

(() => {
  'use strict';

  // ==========================================================================
  // 1. SUPERMARKET WEBAUDIO SYNTHESIZER & BGM ENGINE
  // ==========================================================================
  class SupermarketAudio {
    constructor() {
      this.enabled = localStorage.getItem('math_games_sound') !== 'false';
      this.ctx = null;
      this.bgmGain = null;
      this.bgmInterval = null;
      this.bgmStep = 0;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.bgmGain = this.ctx.createGain();
          this.bgmGain.gain.setValueAtTime(this.enabled ? 0.04 : 0, this.ctx.currentTime);
          this.bgmGain.connect(this.ctx.destination);
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    startBGM() {
      this.init();
      if (!this.ctx || this.bgmInterval) return;

      // 116 BPM Supermarket Bossa / Arcade Shopping Groove in F Major
      const bassline = [
        174.61, 0, 220.00, 0,  261.63, 0, 220.00, 0,
        146.83, 0, 220.00, 0,  261.63, 0, 220.00, 0,
        164.81, 0, 196.00, 0,  246.94, 0, 196.00, 0,
        130.81, 0, 196.00, 0,  261.63, 0, 0, 0
      ];

      const leadChords = [
        349.23, 0, 440.00, 0,  523.25, 0, 440.00, 0,
        293.66, 0, 440.00, 0,  523.25, 0, 440.00, 0,
        329.63, 0, 392.00, 0,  493.88, 0, 392.00, 0,
        261.63, 0, 392.00, 0,  523.25, 0, 0, 0
      ];

      const stepDuration = (60 / 116) / 4;
      this.bgmStep = 0;

      this.bgmInterval = setInterval(() => {
        if (!this.enabled || !this.ctx) return;
        const t = this.ctx.currentTime;
        const idx = this.bgmStep % 32;

        const bFreq = bassline[idx];
        if (bFreq > 0) {
          try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(bFreq, t);
            gain.gain.setValueAtTime(0.045, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + stepDuration * 1.5);
            osc.connect(gain);
            gain.connect(this.bgmGain);
            osc.start(t);
            osc.stop(t + stepDuration * 1.6);
          } catch (e) {}
        }

        const lFreq = leadChords[idx];
        if (lFreq > 0) {
          try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(lFreq, t);
            gain.gain.setValueAtTime(0.025, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + stepDuration * 1.3);
            osc.connect(gain);
            gain.connect(this.bgmGain);
            osc.start(t);
            osc.stop(t + stepDuration * 1.4);
          } catch (e) {}
        }

        this.bgmStep++;
      }, stepDuration * 1000);
    }

    stopBGM() {
      if (this.bgmInterval) {
        clearInterval(this.bgmInterval);
        this.bgmInterval = null;
      }
    }

    playTone(freq, type, duration, gainVal = 0.1, startTime = null) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      try {
        const now = startTime || this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(gainVal, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + duration);
      } catch (e) {}
    }

    playLaserScan() {
      this.playTone(1760.0, 'sine', 0.08, 0.15); // optical beep
    }

    playCoinClink() {
      const now = this.ctx ? this.ctx.currentTime : null;
      this.playTone(1200, 'sine', 0.09, 0.12, now);
      if (now) this.playTone(1600, 'triangle', 0.12, 0.08, now + 0.02);
    }

    playBillSnap() {
      this.playTone(450, 'triangle', 0.07, 0.14);
      setTimeout(() => this.playTone(600, 'sine', 0.06, 0.1), 30);
    }

    playKaChing() {
      this.playTone(1318.51, 'sine', 0.22, 0.15);
      setTimeout(() => this.playTone(1760.00, 'sine', 0.35, 0.18), 70);
    }

    playSuccessFanfare() {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        setTimeout(() => this.playTone(freq, 'sine', 0.15, 0.12), i * 75);
      });
    }

    playWrongBuzz() {
      this.playTone(160, 'sawtooth', 0.25, 0.18);
    }

    playClick() {
      this.playTone(800, 'sine', 0.04, 0.08);
    }
  }

  // ==========================================================================
  // 2. VECTOR SVG CATALOG (100% EMOJI FREE)
  // ==========================================================================
  const SVG_ICONS = {
    apple: `<svg viewBox="0 0 32 32" class="prod-svg"><circle cx="16" cy="18" r="11" fill="#ef4444"/><path d="M16 7 Q18 3 22 4" stroke="#15803d" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="14" cy="14" rx="2" ry="4" fill="#fca5a5" transform="rotate(-20 14 14)"/></svg>`,
    banana: `<svg viewBox="0 0 32 32" class="prod-svg"><path d="M7 24 Q16 28 25 15 Q22 23 9 20 Z" fill="#fcd34d" stroke="#d97706" stroke-width="1.5"/><path d="M5 23 Q16 26 23 10" stroke="#b45309" stroke-width="1.5" fill="none"/></svg>`,
    carrot: `<svg viewBox="0 0 32 32" class="prod-svg"><polygon points="7 7, 26 12, 14 28" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/><path d="M6 7 Q4 2 8 3 M6 7 Q1 5 3 9" stroke="#16a34a" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    broccoli: `<svg viewBox="0 0 32 32" class="prod-svg"><rect x="13" y="16" width="6" height="12" rx="3" fill="#86efac" stroke="#15803d" stroke-width="1.5"/><circle cx="12" cy="12" r="7" fill="#22c55e"/><circle cx="20" cy="12" r="7" fill="#16a34a"/><circle cx="16" cy="8" r="6" fill="#15803d"/></svg>`,
    orange: `<svg viewBox="0 0 32 32" class="prod-svg"><circle cx="16" cy="17" r="11" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/><path d="M16 6 Q20 3 22 7" stroke="#15803d" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="16" cy="17" rx="9" ry="9" fill="none" stroke="#ea580c" stroke-dasharray="2 3"/></svg>`,
    strawberry: `<svg viewBox="0 0 32 32" class="prod-svg"><path d="M8 12 C8 6, 24 6, 24 12 C24 22, 16 28, 16 28 C16 28, 8 22, 8 12 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/><circle cx="12" cy="14" r="1" fill="#fef08a"/><circle cx="20" cy="14" r="1" fill="#fef08a"/><circle cx="16" cy="18" r="1" fill="#fef08a"/><circle cx="14" cy="22" r="1" fill="#fef08a"/><circle cx="18" cy="22" r="1" fill="#fef08a"/><path d="M12 7 Q16 10 20 7" stroke="#15803d" stroke-width="2" fill="none"/></svg>`,
    bread: `<svg viewBox="0 0 32 32" class="prod-svg"><rect x="6" y="12" width="20" height="14" rx="4" fill="#d97706" stroke="#78350f" stroke-width="1.5"/><ellipse cx="16" cy="12" rx="10" ry="5" fill="#fcd34d" stroke="#78350f" stroke-width="1.5"/><line x1="11" y1="12" x2="11" y2="24" stroke="#78350f" stroke-width="1"/><line x1="16" y1="12" x2="16" y2="24" stroke="#78350f" stroke-width="1"/><line x1="21" y1="12" x2="21" y2="24" stroke="#78350f" stroke-width="1"/></svg>`,
    milk: `<svg viewBox="0 0 32 32" class="prod-svg"><rect x="10" y="10" width="12" height="18" rx="2" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/><polygon points="10 10, 16 5, 22 10" fill="#3b82f6" stroke="#334155" stroke-width="1.5"/><rect x="10" y="16" width="12" height="6" fill="#38bdf8"/></svg>`,
    cheese: `<svg viewBox="0 0 32 32" class="prod-svg"><polygon points="6 22, 26 22, 26 12, 6 18" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/><circle cx="12" cy="19" r="2" fill="#ca8a04"/><circle cx="20" cy="17" r="1.5" fill="#ca8a04"/><circle cx="17" cy="20" r="1.2" fill="#ca8a04"/></svg>`,
    eggs: `<svg viewBox="0 0 32 32" class="prod-svg"><ellipse cx="12" cy="18" rx="6" ry="8" fill="#fde68a" stroke="#d97706" stroke-width="1.5" transform="rotate(-15 12 18)"/><ellipse cx="20" cy="18" rx="6" ry="8" fill="#fed7aa" stroke="#ea580c" stroke-width="1.5" transform="rotate(15 20 18)"/></svg>`,
    croissant: `<svg viewBox="0 0 32 32" class="prod-svg"><path d="M5 21 C8 12, 24 12, 27 21 C22 16, 10 16, 5 21 Z" fill="#d97706" stroke="#78350f" stroke-width="1.5"/><ellipse cx="16" cy="16" rx="6" ry="4" fill="#fcd34d"/></svg>`,
    juice: `<svg viewBox="0 0 32 32" class="prod-svg"><rect x="10" y="10" width="12" height="18" rx="2" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/><path d="M18 10 L22 4" stroke="#fcd34d" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="19" r="3.5" fill="#fef08a"/></svg>`,
    cereal: `<svg viewBox="0 0 32 32" class="prod-svg"><path d="M6 15 Q16 12 26 15 L23 25 Q16 28 9 25 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/><ellipse cx="16" cy="15" rx="10" ry="3" fill="#fef08a"/><path d="M22 10 L27 7" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/></svg>`,
    cookies: `<svg viewBox="0 0 32 32" class="prod-svg"><circle cx="16" cy="16" r="11" fill="#d97706" stroke="#78350f" stroke-width="1.5"/><circle cx="12" cy="12" r="1.8" fill="#451a03"/><circle cx="20" cy="13" r="1.8" fill="#451a03"/><circle cx="15" cy="19" r="1.8" fill="#451a03"/><circle cx="20" cy="20" r="1.8" fill="#451a03"/><circle cx="10" cy="18" r="1.5" fill="#451a03"/></svg>`,
    choc: `<svg viewBox="0 0 32 32" class="prod-svg"><rect x="8" y="8" width="16" height="20" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1.5"/><rect x="8" y="16" width="16" height="12" rx="1" fill="#dc2626" stroke="#991b1b" stroke-width="1"/><line x1="16" y1="8" x2="16" y2="16" stroke="#451a03" stroke-width="1.5"/></svg>`,
    chips: `<svg viewBox="0 0 32 32" class="prod-svg"><polygon points="8 6, 24 6, 22 26, 10 26" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5"/><ellipse cx="16" cy="16" rx="4" ry="2.5" fill="#facc15" stroke="#ca8a04" stroke-width="1"/></svg>`,
    honey: `<svg viewBox="0 0 32 32" class="prod-svg"><rect x="9" y="11" width="14" height="16" rx="4" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/><rect x="11" y="7" width="10" height="4" rx="1" fill="#fcd34d" stroke="#b45309" stroke-width="1"/><rect x="11" y="15" width="10" height="6" rx="1" fill="#fef08a"/></svg>`
  };

  const PRODUCTS = [
    // Produce
    { id: 'apple', name: 'Fresh Apple', price: 2.00, category: 'produce' },
    { id: 'banana', name: 'Banana Bunch', price: 1.50, category: 'produce' },
    { id: 'carrot', name: 'Fresh Carrot', price: 1.00, category: 'produce' },
    { id: 'broccoli', name: 'Green Broccoli', price: 2.50, category: 'produce' },
    { id: 'orange', name: 'Sweet Orange', price: 1.80, category: 'produce' },
    { id: 'strawberry', name: 'Strawberries', price: 3.00, category: 'produce' },

    // Bakery & Dairy
    { id: 'bread', name: 'Sliced Bread', price: 3.00, category: 'bakery' },
    { id: 'milk', name: 'Fresh Milk', price: 2.50, category: 'bakery' },
    { id: 'cheese', name: 'Cheddar Cheese', price: 4.00, category: 'bakery' },
    { id: 'eggs', name: 'Farm Eggs', price: 1.20, category: 'bakery' },
    { id: 'croissant', name: 'Butter Croissant', price: 2.20, category: 'bakery' },

    // Snacks & Drinks
    { id: 'juice', name: 'Orange Juice Box', price: 3.50, category: 'snacks' },
    { id: 'cereal', name: 'Breakfast Cereal', price: 4.50, category: 'snacks' },
    { id: 'cookies', name: 'Choc Cookies', price: 2.00, category: 'snacks' },
    { id: 'choc', name: 'Chocolate Bar', price: 1.50, category: 'snacks' },
    { id: 'chips', name: 'Potato Chips', price: 2.80, category: 'snacks' },
    { id: 'honey', name: 'Pure Honey Jar', price: 5.00, category: 'snacks' }
  ];

  // ==========================================================================
  // 3. 10 REALISTIC SHOPPING TASKS (MALAYSIAN RINGGIT)
  // ==========================================================================
  const CHALLENGES = [
    {
      id: 1,
      title: 'Buy 2 Fresh Apples',
      items: [{ id: 'apple', qty: 2 }],
      targetTotal: 4.00,
      hint: '2 Apples @ RM 2.00 = RM 4.00. Try paying with 4x RM1 notes!'
    },
    {
      id: 2,
      title: 'Buy 1 Sliced Bread and 1 Fresh Milk',
      items: [
        { id: 'bread', qty: 1 },
        { id: 'milk', qty: 1 }
      ],
      targetTotal: 5.50,
      hint: 'RM 3.00 + RM 2.50 = RM 5.50. Try paying with 1x RM5 note and 1x 50 sen coin!'
    },
    {
      id: 3,
      title: 'Buy 2 Banana Bunches and 1 Orange Juice Box',
      items: [
        { id: 'banana', qty: 2 },
        { id: 'juice', qty: 1 }
      ],
      targetTotal: 6.50,
      hint: '(2 x RM 1.50 = RM 3.00) + RM 3.50 = RM 6.50. Try 1x RM5, 1x RM1, and 1x 50 sen!'
    },
    {
      id: 4,
      title: 'Buy 1 Breakfast Cereal and 2 Farm Eggs',
      items: [
        { id: 'cereal', qty: 1 },
        { id: 'eggs', qty: 2 }
      ],
      targetTotal: 6.90,
      hint: 'RM 4.50 + (2 x RM 1.20 = RM 2.40) = RM 6.90. Try RM5 + RM1 + 50 sen + 2x 20 sen!'
    },
    {
      id: 5,
      title: 'Buy 3 Fresh Carrots and 2 Choc Cookies',
      items: [
        { id: 'carrot', qty: 3 },
        { id: 'cookies', qty: 2 }
      ],
      targetTotal: 7.00,
      hint: '(3 x RM 1.00) + (2 x RM 2.00) = RM 7.00. Try 1x RM5 and 2x RM1 notes!'
    },
    {
      id: 6,
      title: 'Buy 1 Cheddar Cheese and 2 Strawberries',
      items: [
        { id: 'cheese', qty: 1 },
        { id: 'strawberry', qty: 2 }
      ],
      targetTotal: 10.00,
      hint: 'RM 4.00 + (2 x RM 3.00 = RM 6.00) = RM 10.00. Try 1x RM10 note or 2x RM5 notes!'
    },
    {
      id: 7,
      title: 'Buy 2 Butter Croissants and 1 Fresh Milk',
      items: [
        { id: 'croissant', qty: 2 },
        { id: 'milk', qty: 1 }
      ],
      targetTotal: 6.90,
      hint: '(2 x RM 2.20 = RM 4.40) + RM 2.50 = RM 6.90. Try RM5 + RM1 + 50 sen + 2x 20 sen!'
    },
    {
      id: 8,
      title: 'Buy 1 Honey Jar, 1 Potato Chips, and 1 Banana Bunch',
      items: [
        { id: 'honey', qty: 1 },
        { id: 'chips', qty: 1 },
        { id: 'banana', qty: 1 }
      ],
      targetTotal: 9.30,
      hint: 'RM 5.00 + RM 2.80 + RM 1.50 = RM 9.30. Try RM5 + 4x RM1 + 20 sen + 10 sen!'
    },
    {
      id: 9,
      title: 'Buy 2 Green Broccoli, 1 Cereal, and 2 Orange Juices',
      items: [
        { id: 'broccoli', qty: 2 },
        { id: 'cereal', qty: 1 },
        { id: 'juice', qty: 2 }
      ],
      targetTotal: 16.50,
      hint: 'RM 5.00 + RM 4.50 + RM 7.00 = RM 16.50. Try 1x RM10 + 1x RM5 + 1x RM1 + 50 sen!'
    },
    {
      id: 10,
      title: 'Mega Feast: 2 Cheese, 2 Cookies, 1 Honey Jar, and 3 Apples',
      items: [
        { id: 'cheese', qty: 2 },
        { id: 'cookies', qty: 2 },
        { id: 'honey', qty: 1 },
        { id: 'apple', qty: 3 }
      ],
      targetTotal: 23.00,
      hint: 'RM 8.00 + RM 4.00 + RM 5.00 + RM 6.00 = RM 23.00. Try 1x RM20 + 3x RM1 notes!'
    }
  ];

  // ==========================================================================
  // 4. MAIN GAME STATE CONTROLLER
  // ==========================================================================
  class MathShopGame {
    constructor() {
      this.audio = new SupermarketAudio();

      this.score = 0;
      this.lives = 3;
      this.maxLives = 3;
      this.currentTaskIdx = 0;
      this.timeLeft = 90;
      this.timerInterval = null;
      this.isPlaying = false;
      this.startTime = 0;
      this.totalSpent = 0;
      this.gameEnded = false;

      // Basket & Payment State
      this.basket = {};
      this.paymentTray = [];
      this.selectedCategory = 'all';

      // DOM Cache
      this.dom = {
        scoreDisplay: document.getElementById('score-display'),
        livesContainer: document.getElementById('lives-container'),
        timerDisplay: document.getElementById('timer-display'),
        progressDisplay: document.getElementById('progress-display'),

        taskTitleText: document.getElementById('task-title-text'),
        taskChecklist: document.getElementById('task-checklist'),
        taskHintBox: document.getElementById('task-hint-box'),
        taskHintText: document.getElementById('task-hint-text'),

        shelvesGrid: document.getElementById('shelves-grid'),
        catTabs: document.querySelectorAll('.cat-tab'),

        basketItemCount: document.getElementById('basket-item-count'),
        basketItemsList: document.getElementById('basket-items-list'),
        basketTotalText: document.getElementById('basket-total-text'),

        cashierAvatar: document.getElementById('cashier-avatar'),
        cashierSpeech: document.getElementById('cashier-speech'),

        posStatusBadge: document.getElementById('pos-status-badge'),
        posTotalDue: document.getElementById('pos-total-due'),
        posPaidAmount: document.getElementById('pos-paid-amount'),
        posDifferenceTag: document.getElementById('pos-difference-tag'),

        traySumDisplay: document.getElementById('tray-sum-display'),
        paymentMatItems: document.getElementById('payment-mat-items'),
        btnUndoMoney: document.getElementById('btn-undo-money'),
        btnClearMoney: document.getElementById('btn-clear-money'),
        btnPayCheckout: document.getElementById('btn-pay-checkout'),

        checkoutSuccessModal: document.getElementById('checkout-success-modal'),
        receiptTaskName: document.getElementById('receipt-task-name'),
        receiptTotalAmount: document.getElementById('receipt-total-amount'),
        receiptPaidAmount: document.getElementById('receipt-paid-amount'),
        successPoints: document.getElementById('success-points'),
        btnNextTask: document.getElementById('btn-next-task'),

        startScreen: document.getElementById('start-screen'),
        startGameBtn: document.getElementById('start-game-btn'),
        howToPlayBtn: document.getElementById('start-how-to-play-btn'),
        hudHowToPlayBtn: document.getElementById('hud-how-to-play-btn'),
        hudRestartBtn: document.getElementById('hud-restart-btn'),
        instructionsModal: document.getElementById('instructions-modal'),
        closeInstructionsBtn: document.getElementById('close-instructions-btn'),
        startFromInstructionsBtn: document.getElementById('start-from-instructions-btn'),

        endScreen: document.getElementById('end-screen'),
        endTitle: document.getElementById('end-title'),
        endSubtitle: document.getElementById('end-subtitle'),
        starsContainer: document.getElementById('stars-container'),
        finalScoreVal: document.getElementById('final-score-val'),
        finalTasksVal: document.getElementById('final-tasks-val'),
        finalLivesVal: document.getElementById('final-lives-val'),
        finalSpentVal: document.getElementById('final-spent-val'),
        playAgainBtn: document.getElementById('play-again-btn'),

        soundToggleBtn: document.getElementById('sound-toggle-btn'),
        particlesLayer: document.getElementById('flying-particles-layer')
      };

      this.initEvents();
      this.renderShelves();
    }

    initEvents() {
      if (this.dom.startGameBtn) {
        this.dom.startGameBtn.addEventListener('click', () => {
          this.audio.init();
          this.audio.playClick();
          this.startGame();
        });
      }

      if (this.dom.howToPlayBtn) {
        this.dom.howToPlayBtn.addEventListener('click', () => this.showInstructions());
      }
      if (this.dom.hudHowToPlayBtn) {
        this.dom.hudHowToPlayBtn.addEventListener('click', () => this.showInstructions());
      }
      if (this.dom.closeInstructionsBtn) {
        this.dom.closeInstructionsBtn.addEventListener('click', () => this.hideInstructions());
      }
      if (this.dom.startFromInstructionsBtn) {
        this.dom.startFromInstructionsBtn.addEventListener('click', () => {
          this.hideInstructions();
          this.startGame();
        });
      }

      if (this.dom.hudRestartBtn) {
        this.dom.hudRestartBtn.addEventListener('click', () => {
          this.audio.playClick();
          this.startGame();
        });
      }

      if (this.dom.soundToggleBtn) {
        this.dom.soundToggleBtn.textContent = this.audio.enabled ? 'SOUND ON' : 'SOUND OFF';
        this.dom.soundToggleBtn.addEventListener('click', () => {
          this.audio.enabled = !this.audio.enabled;
          localStorage.setItem('math_games_sound', this.audio.enabled ? 'true' : 'false');
          if (this.audio.bgmGain && this.audio.ctx) {
            this.audio.bgmGain.gain.setValueAtTime(this.audio.enabled ? 0.04 : 0, this.audio.ctx.currentTime);
          }
          if (this.audio.enabled && this.isPlaying) {
            this.audio.startBGM();
          } else if (!this.audio.enabled) {
            this.audio.stopBGM();
          }
          this.dom.soundToggleBtn.textContent = this.audio.enabled ? 'SOUND ON' : 'SOUND OFF';
        });
      }

      if (this.dom.playAgainBtn) {
        this.dom.playAgainBtn.addEventListener('click', () => this.startGame());
      }

      if (this.dom.btnNextTask) {
        this.dom.btnNextTask.addEventListener('click', () => this.proceedToNextTask());
      }

      if (this.dom.catTabs) {
        this.dom.catTabs.forEach(tab => {
          tab.addEventListener('click', () => {
            this.audio.playClick();
            this.dom.catTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            this.selectedCategory = tab.dataset.cat;
            this.renderShelves();
          });
        });
      }

      document.querySelectorAll('.money-token').forEach(tokenBtn => {
        tokenBtn.addEventListener('click', () => {
          const val = parseFloat(tokenBtn.dataset.value);
          this.addMoneyToTray(val);
        });
      });

      if (this.dom.btnUndoMoney) {
        this.dom.btnUndoMoney.addEventListener('click', () => this.undoLastMoney());
      }
      if (this.dom.btnClearMoney) {
        this.dom.btnClearMoney.addEventListener('click', () => this.clearMoneyTray());
      }
      if (this.dom.btnPayCheckout) {
        this.dom.btnPayCheckout.addEventListener('click', () => this.validateAndCheckout());
      }
    }

    setCashierSpeech(text) {
      if (this.dom.cashierSpeech) this.dom.cashierSpeech.textContent = text;
    }

    showInstructions() {
      this.audio.playClick();
      if (this.dom.instructionsModal) this.dom.instructionsModal.classList.remove('hidden');
    }

    hideInstructions() {
      this.audio.playClick();
      if (this.dom.instructionsModal) this.dom.instructionsModal.classList.add('hidden');
    }

    startGame() {
      if (this.dom.startScreen) this.dom.startScreen.classList.add('hidden');
      if (this.dom.endScreen) this.dom.endScreen.classList.add('hidden');
      if (this.dom.checkoutSuccessModal) this.dom.checkoutSuccessModal.classList.add('hidden');

      this.score = 0;
      this.lives = this.maxLives;
      this.currentTaskIdx = 0;
      this.timeLeft = 90;
      this.totalSpent = 0;
      this.isPlaying = true;
      this.gameEnded = false;
      this.startTime = Date.now();

      this.audio.startBGM();
      this.updateHUD();
      this.loadTask(this.currentTaskIdx);
      this.startTimer();
    }

    startTimer() {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        if (!this.isPlaying) return;
        this.timeLeft--;
        if (this.dom.timerDisplay) {
          this.dom.timerDisplay.textContent = String(this.timeLeft).padStart(3, '0');
          if (this.timeLeft <= 10) {
            this.dom.timerDisplay.style.color = '#ef4444';
          } else {
            this.dom.timerDisplay.style.color = '';
          }
        }

        if (this.timeLeft <= 0) {
          clearInterval(this.timerInterval);
          this.endGame(false, 'Time ran out! Your supermarket shift has ended.');
        }
      }, 1000);
    }

    updateHUD() {
      if (this.dom.scoreDisplay) this.dom.scoreDisplay.textContent = String(this.score).padStart(6, '0');
      if (this.dom.timerDisplay) this.dom.timerDisplay.textContent = String(this.timeLeft).padStart(3, '0');
      if (this.dom.progressDisplay) {
        const cur = String(this.currentTaskIdx + 1).padStart(2, '0');
        const total = String(CHALLENGES.length).padStart(2, '0');
        this.dom.progressDisplay.textContent = `${cur} / ${total}`;
      }

      if (this.dom.livesContainer) {
        const hearts = this.dom.livesContainer.querySelectorAll('.heart-icon');
        hearts.forEach((heart, idx) => {
          if (idx < this.lives) {
            heart.classList.remove('lost');
            heart.classList.add('active');
          } else {
            heart.classList.add('lost');
            heart.classList.remove('active');
          }
        });
      }
    }

    triggerShake() {
      const el = document.getElementById('game-app') || document.body;
      if (!el) return;
      el.style.transform = 'translate(6px, -4px)';
      setTimeout(() => { el.style.transform = 'translate(-6px, 4px)'; }, 50);
      setTimeout(() => { el.style.transform = 'translate(4px, -3px)'; }, 100);
      setTimeout(() => { el.style.transform = 'translate(-4px, 2px)'; }, 150);
      setTimeout(() => { el.style.transform = 'none'; }, 200);
    }

    loadTask(taskIndex) {
      if (taskIndex >= CHALLENGES.length) {
        this.endGame(true, 'Supermarket Champion! All 10 challenges completed!');
        return;
      }

      const task = CHALLENGES[taskIndex];
      this.basket = {};
      this.paymentTray = [];
      this.hideHint();

      if (this.dom.taskTitleText) {
        this.dom.taskTitleText.textContent = `Task ${task.id}: ${task.title}`;
      }
      this.setCashierSpeech(`"Task ${task.id}: Find the items on your list, then pay RM ${task.targetTotal.toFixed(2)} at the checkout!"`);
      this.renderTaskChecklist();
      this.renderShelves();
      this.renderBasket();
      this.updatePaymentDisplay();
      this.updateHUD();
    }

    renderTaskChecklist() {
      const task = CHALLENGES[this.currentTaskIdx];
      if (!this.dom.taskChecklist) return;
      this.dom.taskChecklist.innerHTML = '';

      let allCollected = true;

      task.items.forEach(reqItem => {
        const prod = PRODUCTS.find(p => p.id === reqItem.id);
        const inBasket = this.basket[reqItem.id] || 0;
        const isComplete = inBasket === reqItem.qty;
        if (!isComplete) allCollected = false;

        const pill = document.createElement('div');
        pill.className = `task-check-pill ${isComplete ? 'completed' : ''}`;
        pill.innerHTML = `
          <span>${prod.name}</span>
          <span class="pill-qty">(${inBasket}/${reqItem.qty})</span>
          ${isComplete ? '<span>[DONE]</span>' : ''}
        `;
        this.dom.taskChecklist.appendChild(pill);
      });

      if (allCollected) {
        this.setCashierSpeech(`"All items collected! Now place exactly RM ${task.targetTotal.toFixed(2)} into the payment tray!"`);
      }
    }

    showHint(message) {
      if (this.dom.taskHintText) this.dom.taskHintText.textContent = message;
      if (this.dom.taskHintBox) this.dom.taskHintBox.classList.remove('hidden');
    }

    hideHint() {
      if (this.dom.taskHintBox) this.dom.taskHintBox.classList.add('hidden');
    }

    renderShelves() {
      if (!this.dom.shelvesGrid) return;
      this.dom.shelvesGrid.innerHTML = '';

      const filtered = PRODUCTS.filter(p => {
        if (this.selectedCategory === 'all') return true;
        return p.category === this.selectedCategory;
      });

      filtered.forEach(prod => {
        const qtyInBasket = this.basket[prod.id] || 0;
        const card = document.createElement('div');
        card.className = `product-card ${qtyInBasket > 0 ? 'in-basket' : ''}`;

        card.innerHTML = `
          <div class="product-vector-wrap">${SVG_ICONS[prod.id] || ''}</div>
          <div class="product-name">${prod.name}</div>
          <div class="product-price-tag">RM ${prod.price.toFixed(2)}</div>
          <div class="product-actions">
            ${qtyInBasket > 0 ? `<button class="btn-shelf-mod btn-minus" data-action="minus" data-id="${prod.id}">-</button>` : ''}
            <span class="product-qty-badge">${qtyInBasket > 0 ? `x${qtyInBasket}` : ''}</span>
            <button class="btn-shelf-mod btn-plus" data-action="plus" data-id="${prod.id}">+</button>
          </div>
        `;

        card.addEventListener('click', (e) => {
          if (e.target.closest('.btn-shelf-mod')) return;
          this.modifyBasketItem(prod.id, 1, card);
        });

        const plusBtn = card.querySelector('.btn-plus');
        if (plusBtn) {
          plusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.modifyBasketItem(prod.id, 1, card);
          });
        }

        const minusBtn = card.querySelector('.btn-minus');
        if (minusBtn) {
          minusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.modifyBasketItem(prod.id, -1, card);
          });
        }

        this.dom.shelvesGrid.appendChild(card);
      });
    }

    modifyBasketItem(productId, delta, cardEl = null) {
      const current = this.basket[productId] || 0;
      const next = current + delta;

      if (next <= 0) {
        delete this.basket[productId];
      } else {
        this.basket[productId] = next;
      }

      if (delta > 0) {
        this.audio.playLaserScan();
      } else {
        this.audio.playClick();
      }

      this.renderShelves();
      this.renderBasket();
      this.renderTaskChecklist();
      this.updatePaymentDisplay();
    }

    renderBasket() {
      if (!this.dom.basketItemsList) return;
      this.dom.basketItemsList.innerHTML = '';
      const itemKeys = Object.keys(this.basket);

      let totalItems = 0;
      let totalRM = 0;

      if (itemKeys.length === 0) {
        this.dom.basketItemsList.innerHTML = `
          <div class="basket-empty-state">
            <span>Select grocery items on shelves to place them into your basket</span>
          </div>
        `;
        if (this.dom.basketItemCount) this.dom.basketItemCount.textContent = '0 items';
        if (this.dom.basketTotalText) this.dom.basketTotalText.textContent = 'RM 0.00';
        return;
      }

      itemKeys.forEach(pId => {
        const prod = PRODUCTS.find(p => p.id === pId);
        const qty = this.basket[pId];
        const lineTotal = prod.price * qty;

        totalItems += qty;
        totalRM += lineTotal;

        const row = document.createElement('div');
        row.className = 'basket-row-item';
        row.innerHTML = `
          <div class="basket-row-info">
            <span class="basket-row-name">${prod.name}</span>
            <span class="basket-row-qty">x${qty}</span>
          </div>
          <div class="basket-row-actions">
            <strong class="basket-row-price font-mono">RM ${lineTotal.toFixed(2)}</strong>
            <button class="btn-remove-basket-item" data-id="${prod.id}" title="Remove item">X</button>
          </div>
        `;

        row.querySelector('.btn-remove-basket-item').addEventListener('click', () => {
          delete this.basket[prod.id];
          this.audio.playClick();
          this.renderShelves();
          this.renderBasket();
          this.renderTaskChecklist();
          this.updatePaymentDisplay();
        });

        this.dom.basketItemsList.appendChild(row);
      });

      if (this.dom.basketItemCount) {
        this.dom.basketItemCount.textContent = `${totalItems} item${totalItems > 1 ? 's' : ''}`;
      }
      if (this.dom.basketTotalText) {
        this.dom.basketTotalText.textContent = `RM ${totalRM.toFixed(2)}`;
      }
    }

    addMoneyToTray(value) {
      if (!this.isPlaying) return;

      this.paymentTray.push(value);

      if (value >= 1.00) {
        this.audio.playBillSnap();
      } else {
        this.audio.playCoinClink();
      }

      this.updatePaymentDisplay();
    }

    undoLastMoney() {
      if (this.paymentTray.length === 0) return;
      this.paymentTray.pop();
      this.audio.playClick();
      this.updatePaymentDisplay();
    }

    clearMoneyTray() {
      if (this.paymentTray.length === 0) return;
      this.paymentTray = [];
      this.audio.playClick();
      this.updatePaymentDisplay();
    }

    getTrayTotal() {
      let sum = this.paymentTray.reduce((acc, v) => acc + v, 0);
      return Math.round(sum * 100) / 100;
    }

    updatePaymentDisplay() {
      const task = CHALLENGES[this.currentTaskIdx];
      if (!task) return;
      const trayTotal = this.getTrayTotal();

      if (this.dom.posTotalDue) this.dom.posTotalDue.textContent = `RM ${task.targetTotal.toFixed(2)}`;
      if (this.dom.posPaidAmount) this.dom.posPaidAmount.textContent = `RM ${trayTotal.toFixed(2)}`;
      if (this.dom.traySumDisplay) this.dom.traySumDisplay.textContent = `RM ${trayTotal.toFixed(2)}`;

      const diff = Math.round((task.targetTotal - trayTotal) * 100) / 100;
      if (this.dom.posDifferenceTag && this.dom.posStatusBadge) {
        if (diff > 0) {
          this.dom.posDifferenceTag.innerHTML = `Needs: <strong style="color: #ef4444;" class="font-mono">RM ${diff.toFixed(2)}</strong>`;
          this.dom.posStatusBadge.textContent = 'READY TO PAY';
          this.dom.posStatusBadge.style.color = '#38bdf8';
        } else if (diff < 0) {
          this.dom.posDifferenceTag.innerHTML = `Over by: <strong style="color: #f59e0b;" class="font-mono">RM ${Math.abs(diff).toFixed(2)}</strong>`;
          this.dom.posStatusBadge.textContent = 'OVERPAID';
          this.dom.posStatusBadge.style.color = '#f59e0b';
        } else {
          this.dom.posDifferenceTag.innerHTML = `<strong style="color: #10b981;" class="font-mono">EXACT MATCH</strong>`;
          this.dom.posStatusBadge.textContent = 'EXACT MATCH';
          this.dom.posStatusBadge.style.color = '#10b981';
        }
      }

      if (!this.dom.paymentMatItems) return;
      this.dom.paymentMatItems.innerHTML = '';
      if (this.paymentTray.length === 0) {
        this.dom.paymentMatItems.innerHTML = `
          <span class="mat-placeholder">Select banknotes and coins above to place into tray</span>
        `;
        return;
      }

      this.paymentTray.forEach((val) => {
        const chip = document.createElement('span');
        let chipClass = 'chip-rm1';
        let label = `RM ${val.toFixed(2)}`;

        if (val === 50) { chipClass = 'chip-rm50'; label = 'RM 50'; }
        else if (val === 20) { chipClass = 'chip-rm20'; label = 'RM 20'; }
        else if (val === 10) { chipClass = 'chip-rm10'; label = 'RM 10'; }
        else if (val === 5) { chipClass = 'chip-rm5'; label = 'RM 5'; }
        else if (val === 1) { chipClass = 'chip-rm1'; label = 'RM 1'; }
        else if (val < 1) {
          chipClass = 'chip-coin';
          label = `${Math.round(val * 100)}c`;
        }

        chip.className = `tray-chip ${chipClass}`;
        chip.textContent = label;
        this.dom.paymentMatItems.appendChild(chip);
      });
    }

    validateAndCheckout() {
      if (!this.isPlaying) return;

      const task = CHALLENGES[this.currentTaskIdx];

      // 1. Verify basket matches shopping list requirements
      let basketMatches = true;
      for (const reqItem of task.items) {
        const inBasket = this.basket[reqItem.id] || 0;
        if (inBasket !== reqItem.qty) {
          basketMatches = false;
          break;
        }
      }

      const requestedIds = task.items.map(i => i.id);
      for (const bId of Object.keys(this.basket)) {
        if (!requestedIds.includes(bId)) {
          basketMatches = false;
          break;
        }
      }

      if (!basketMatches) {
        this.audio.playWrongBuzz();
        this.triggerShake();
        this.setCashierSpeech(`"Your basket doesn't match the shopping list yet! Please check what items are requested."`);
        this.showHint(`Please collect the exact items from the shopping list first!`);
        return;
      }

      // 2. Verify payment amount
      const trayTotal = this.getTrayTotal();
      const targetTotal = task.targetTotal;

      if (trayTotal === targetTotal) {
        this.handleSuccessfulPayment(task, targetTotal);
      } else {
        this.handleIncorrectPayment(task, trayTotal, targetTotal);
      }
    }

    handleSuccessfulPayment(task, amount) {
      this.audio.playKaChing();
      this.audio.playSuccessFanfare();

      const earnedPoints = 150 + Math.max(0, this.timeLeft * 2);
      this.score += earnedPoints;
      this.totalSpent += amount;

      this.updateHUD();
      this.setCashierSpeech(`"Ka-Ching! Exact payment received! Here is your official receipt!"`);

      if (this.dom.receiptTaskName) this.dom.receiptTaskName.textContent = task.title;
      if (this.dom.receiptTotalAmount) this.dom.receiptTotalAmount.textContent = `RM ${amount.toFixed(2)}`;
      if (this.dom.receiptPaidAmount) this.dom.receiptPaidAmount.textContent = `RM ${amount.toFixed(2)}`;
      if (this.dom.successPoints) this.dom.successPoints.textContent = `+${earnedPoints} PTS`;
      if (this.dom.checkoutSuccessModal) this.dom.checkoutSuccessModal.classList.remove('hidden');
    }

    handleIncorrectPayment(task, paid, target) {
      this.audio.playWrongBuzz();
      this.triggerShake();
      this.lives--;
      this.updateHUD();

      const diff = Math.round((target - paid) * 100) / 100;
      if (paid < target) {
        this.setCashierSpeech(`"You placed RM ${paid.toFixed(2)}. Total is RM ${target.toFixed(2)} — you need RM ${diff.toFixed(2)} more!"`);
        this.showHint(`You placed RM ${paid.toFixed(2)}, but total is RM ${target.toFixed(2)}. You need RM ${diff.toFixed(2)} more! ${task.hint}`);
      } else {
        this.setCashierSpeech(`"You placed RM ${paid.toFixed(2)}. That's over by RM ${Math.abs(diff).toFixed(2)}!"`);
        this.showHint(`You placed RM ${paid.toFixed(2)}. That's over by RM ${Math.abs(diff).toFixed(2)}! ${task.hint}`);
      }

      if (this.lives <= 0) {
        setTimeout(() => {
          this.endGame(false, 'Out of accuracy lives! Check your change carefully next time.');
        }, 1200);
      }
    }

    proceedToNextTask() {
      if (this.dom.checkoutSuccessModal) this.dom.checkoutSuccessModal.classList.add('hidden');
      this.currentTaskIdx++;

      if (this.currentTaskIdx >= CHALLENGES.length) {
        this.endGame(true, 'Outstanding! You completed all 10 shopping challenges!');
      } else {
        this.loadTask(this.currentTaskIdx);
      }
    }

    endGame(completedAll, message) {
      if (this.gameEnded) return;
      this.gameEnded = true;

      this.isPlaying = false;
      this.audio.stopBGM();
      if (this.timerInterval) clearInterval(this.timerInterval);

      if (this.dom.endTitle) {
        this.dom.endTitle.textContent = completedAll ? 'SUPERMARKET CHAMPION!' : 'SHIFT COMPLETED!';
      }
      if (this.dom.endSubtitle) {
        this.dom.endSubtitle.textContent = message;
      }

      let stars = 1;
      if (completedAll && this.lives === 3) {
        stars = 3;
      } else if (completedAll || this.currentTaskIdx >= 6) {
        stars = 2;
      } else if (this.score > 200) {
        stars = 1;
      }

      localStorage.setItem('math_shop_stars', stars);

      if (this.dom.starsContainer) {
        const starSlots = this.dom.starsContainer.querySelectorAll('.star-slot');
        starSlots.forEach((slot, idx) => {
          if (idx < stars) {
            slot.classList.add('earned');
          } else {
            slot.classList.remove('earned');
          }
        });
      }

      if (this.dom.finalScoreVal) this.dom.finalScoreVal.textContent = String(this.score).padStart(6, '0');
      if (this.dom.finalTasksVal) {
        const cur = String(Math.min(CHALLENGES.length, this.currentTaskIdx)).padStart(2, '0');
        const tot = String(CHALLENGES.length).padStart(2, '0');
        this.dom.finalTasksVal.textContent = `${cur} / ${tot}`;
      }
      if (this.dom.finalLivesVal) this.dom.finalLivesVal.textContent = `${this.lives} / ${this.maxLives}`;
      if (this.dom.finalSpentVal) this.dom.finalSpentVal.textContent = `RM ${this.totalSpent.toFixed(2)}`;

      const timeTaken = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));

      // StuCent runtime contract integration
      if (window.game && typeof window.game.end === 'function') {
        const targetMax = (window.game.config && window.game.config.maxPoints) || 100;
        const normalizedScore = Math.min(targetMax, Math.round((this.score / 2000) * targetMax));
        window.game.end({
          score: normalizedScore,
          maxScore: targetMax,
          timeTaken: timeTaken,
          success: completedAll || stars >= 1
        });
      }

      if (this.dom.endScreen) this.dom.endScreen.classList.remove('hidden');
    }
  }

  // Initialize StuCent runtime game contract
  window.game = window.game || {};
  window.game.init = function(config) {
    window.game.config = config || {};
  };

  document.addEventListener('DOMContentLoaded', () => {
    new MathShopGame();
  });

})();
