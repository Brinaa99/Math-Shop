/**
 * MATH SHOP — SUPERMARKET SHOPPING & CASHIER ENGINE
 * Standard 3 Mathematics: Money, Decimals, Pricing & Exact Payment in Malaysian Ringgit (RM)
 */

(() => {
  'use strict';

  // ==========================================================================
  // 1. SUPERMARKET AUDIO SYNTHESIZER
  // ==========================================================================
  class SupermarketAudio {
    constructor() {
      this.enabled = localStorage.getItem('math_games_sound') !== 'false';
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
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
      this.playTone(1760.0, 'sine', 0.08, 0.15); // A6 optical beep
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
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
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
  // 2. PRODUCT DATABASE & CATALOG
  // ==========================================================================
  const PRODUCTS = [
    // Produce
    { id: 'apple', name: 'Fresh Apple', emoji: '🍎', price: 2.00, category: 'produce' },
    { id: 'banana', name: 'Banana Bunch', emoji: '🍌', price: 1.50, category: 'produce' },
    { id: 'carrot', name: 'Fresh Carrot', emoji: '🥕', price: 1.00, category: 'produce' },
    { id: 'broccoli', name: 'Green Broccoli', emoji: '🥦', price: 2.50, category: 'produce' },
    { id: 'orange', name: 'Sweet Orange', emoji: '🍊', price: 1.80, category: 'produce' },
    { id: 'strawberry', name: 'Strawberries', emoji: '🍓', price: 3.00, category: 'produce' },

    // Bakery & Dairy
    { id: 'bread', name: 'Sliced Bread', emoji: '🍞', price: 3.00, category: 'bakery' },
    { id: 'milk', name: 'Fresh Milk', emoji: '🥛', price: 2.50, category: 'bakery' },
    { id: 'cheese', name: 'Cheddar Cheese', emoji: '🧀', price: 4.00, category: 'bakery' },
    { id: 'eggs', name: 'Farm Eggs', emoji: '🥚', price: 1.20, category: 'bakery' },
    { id: 'croissant', name: 'Butter Croissant', emoji: '🥐', price: 2.20, category: 'bakery' },

    // Snacks & Drinks
    { id: 'juice', name: 'Orange Juice Box', emoji: '🧃', price: 3.50, category: 'snacks' },
    { id: 'cereal', name: 'Breakfast Cereal', emoji: '🥣', price: 4.50, category: 'snacks' },
    { id: 'cookies', name: 'Choc Cookies', emoji: '🍪', price: 2.00, category: 'snacks' },
    { id: 'choc', name: 'Chocolate Bar', emoji: '🍫', price: 1.50, category: 'snacks' },
    { id: 'chips', name: 'Crispy Potato Chips', emoji: '🥔', price: 2.80, category: 'snacks' },
    { id: 'honey', name: 'Pure Honey Jar', emoji: '🍯', price: 5.00, category: 'snacks' }
  ];

  // ==========================================================================
  // 3. 10 STANDARD 3 SHOPPING CHALLENGES (MALAYSIAN RINGGIT)
  // ==========================================================================
  const CHALLENGES = [
    {
      id: 1,
      title: 'Buy 2 Fresh Apples',
      items: [
        { id: 'apple', qty: 2 }
      ],
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
      hint: '(2 × RM 1.50 = RM 3.00) + RM 3.50 = RM 6.50. Try 1x RM5, 1x RM1, and 1x 50 sen!'
    },
    {
      id: 4,
      title: 'Buy 1 Breakfast Cereal and 2 Farm Eggs',
      items: [
        { id: 'cereal', qty: 1 },
        { id: 'eggs', qty: 2 }
      ],
      targetTotal: 6.90,
      hint: 'RM 4.50 + (2 × RM 1.20 = RM 2.40) = RM 6.90. Try RM5 + RM1 + 50 sen + 2x 20 sen!'
    },
    {
      id: 5,
      title: 'Buy 3 Fresh Carrots and 2 Choc Cookies',
      items: [
        { id: 'carrot', qty: 3 },
        { id: 'cookies', qty: 2 }
      ],
      targetTotal: 7.00,
      hint: '(3 × RM 1.00) + (2 × RM 2.00) = RM 7.00. Try 1x RM5 and 2x RM1 notes!'
    },
    {
      id: 6,
      title: 'Buy 1 Cheddar Cheese and 2 Strawberries',
      items: [
        { id: 'cheese', qty: 1 },
        { id: 'strawberry', qty: 2 }
      ],
      targetTotal: 10.00,
      hint: 'RM 4.00 + (2 × RM 3.00 = RM 6.00) = RM 10.00. Try 1x RM10 note or 2x RM5 notes!'
    },
    {
      id: 7,
      title: 'Buy 2 Butter Croissants and 1 Fresh Milk',
      items: [
        { id: 'croissant', qty: 2 },
        { id: 'milk', qty: 1 }
      ],
      targetTotal: 6.90,
      hint: '(2 × RM 2.20 = RM 4.40) + RM 2.50 = RM 6.90. Try RM5 + RM1 + 50 sen + 2x 20 sen!'
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
      
      // Game metrics
      this.score = 0;
      this.lives = 3;
      this.maxLives = 3;
      this.currentTaskIdx = 0;
      this.timeLeft = 90;
      this.timerInterval = null;
      this.isPlaying = false;
      this.totalSpent = 0;

      // Basket & Payment State
      this.basket = {}; // { apple: 2, juice: 1 }
      this.paymentTray = []; // Array of money tokens added: [50, 5, 0.50]
      this.selectedCategory = 'all';

      // DOM Elements
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
        
        posStatusBadge: document.getElementById('pos-status-badge'),
        posTotalDue: document.getElementById('pos-total-due'),
        posPaidAmount: document.getElementById('pos-paid-amount'),
        posDifferenceTag: document.getElementById('pos-difference-tag'),
        
        traySumDisplay: document.getElementById('tray-sum-display'),
        paymentMatItems: document.getElementById('payment-mat-items'),
        btnUndoMoney: document.getElementById('btn-undo-money'),
        btnClearMoney: document.getElementById('btn-clear-money'),
        btnPayCheckout: document.getElementById('btn-pay-checkout'),
        
        // Modals & Overlays
        checkoutSuccessModal: document.getElementById('checkout-success-modal'),
        successTitle: document.getElementById('success-title'),
        successDetails: document.getElementById('success-details'),
        successPoints: document.getElementById('success-points'),
        btnNextTask: document.getElementById('btn-next-task'),
        
        startScreen: document.getElementById('start-screen'),
        startGameBtn: document.getElementById('start-game-btn'),
        howToPlayBtn: document.getElementById('how-to-play-btn'),
        hudHowToPlayBtn: document.getElementById('hud-how-to-play-btn'),
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
        soundIcon: document.getElementById('sound-icon')
      };

      this.initEvents();
      this.renderShelves();
      this.updateSoundButton();
    }

    // ==========================================================================
    // INITIALIZATION & EVENT BINDINGS
    // ==========================================================================
    initEvents() {
      // Start & Instructions Navigation
      this.dom.startGameBtn.addEventListener('click', () => this.startGame());
      this.dom.howToPlayBtn.addEventListener('click', () => this.showInstructions());
      if (this.dom.hudHowToPlayBtn) {
        this.dom.hudHowToPlayBtn.addEventListener('click', () => this.showInstructions());
      }
      this.dom.closeInstructionsBtn.addEventListener('click', () => this.hideInstructions());
      this.dom.startFromInstructionsBtn.addEventListener('click', () => {
        this.hideInstructions();
        this.startGame();
      });

      // Sound Toggle
      if (this.dom.soundToggleBtn) {
        this.dom.soundToggleBtn.addEventListener('click', () => {
          this.audio.enabled = !this.audio.enabled;
          localStorage.setItem('math_games_sound', this.audio.enabled ? 'true' : 'false');
          this.updateSoundButton();
        });
      }

      // Replay
      this.dom.playAgainBtn.addEventListener('click', () => this.startGame());

      // Next Task
      this.dom.btnNextTask.addEventListener('click', () => this.proceedToNextTask());

      // Category Tabs
      this.dom.catTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          this.audio.playClick();
          this.dom.catTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          this.selectedCategory = tab.dataset.cat;
          this.renderShelves();
        });
      });

      // Money Tokens (Notes & Coins)
      document.querySelectorAll('.money-token').forEach(tokenBtn => {
        tokenBtn.addEventListener('click', (e) => {
          const val = parseFloat(tokenBtn.dataset.value);
          this.addMoneyToTray(val);
        });
      });

      // Payment Mat Action Buttons
      this.dom.btnUndoMoney.addEventListener('click', () => this.undoLastMoney());
      this.dom.btnClearMoney.addEventListener('click', () => this.clearMoneyTray());
      this.dom.btnPayCheckout.addEventListener('click', () => this.validateAndCheckout());
    }

    updateSoundButton() {
      if (this.dom.soundIcon) {
        this.dom.soundIcon.textContent = this.audio.enabled ? 'Sound: ON' : 'Sound: OFF';
      }
    }

    showInstructions() {
      this.audio.playClick();
      this.dom.instructionsModal.classList.remove('hidden');
    }

    hideInstructions() {
      this.audio.playClick();
      this.dom.instructionsModal.classList.add('hidden');
    }

    // ==========================================================================
    // GAME CYCLE
    // ==========================================================================
    startGame() {
      this.audio.playClick();
      this.dom.startScreen.classList.add('hidden');
      this.dom.endScreen.classList.add('hidden');
      this.dom.checkoutSuccessModal.classList.add('hidden');

      this.score = 0;
      this.lives = this.maxLives;
      this.currentTaskIdx = 0;
      this.timeLeft = 90;
      this.totalSpent = 0;
      this.isPlaying = true;

      this.updateHUD();
      this.loadTask(this.currentTaskIdx);
      this.startTimer();
    }

    startTimer() {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        if (!this.isPlaying) return;
        this.timeLeft--;
        this.dom.timerDisplay.textContent = `${this.timeLeft}s`;

        if (this.timeLeft <= 0) {
          clearInterval(this.timerInterval);
          this.endGame(false, 'Time ran out! Your supermarket shift has ended.');
        }
      }, 1000);
    }

    updateHUD() {
      this.dom.scoreDisplay.textContent = this.score.toLocaleString();
      this.dom.timerDisplay.textContent = `${this.timeLeft}s`;
      this.dom.progressDisplay.textContent = `${this.currentTaskIdx + 1} / ${CHALLENGES.length}`;

      // Update Lives Hearts
      const hearts = this.dom.livesContainer.querySelectorAll('.heart');
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

    // ==========================================================================
    // TASK & SHOPPING MISSION MANAGEMENT
    // ==========================================================================
    loadTask(taskIndex) {
      if (taskIndex >= CHALLENGES.length) {
        this.endGame(true, 'Supermarket Champion! All 10 challenges completed!');
        return;
      }

      const task = CHALLENGES[taskIndex];
      this.basket = {};
      this.paymentTray = [];
      this.hideHint();

      // Update Header prompt
      this.dom.taskTitleText.textContent = `Task ${task.id}: ${task.title}`;
      this.renderTaskChecklist();
      this.renderShelves();
      this.renderBasket();
      this.updatePaymentDisplay();
      this.updateHUD();
    }

    renderTaskChecklist() {
      const task = CHALLENGES[this.currentTaskIdx];
      this.dom.taskChecklist.innerHTML = '';

      task.items.forEach(reqItem => {
        const prod = PRODUCTS.find(p => p.id === reqItem.id);
        const inBasket = this.basket[reqItem.id] || 0;
        const isComplete = inBasket === reqItem.qty;

        const pill = document.createElement('div');
        pill.className = `task-check-pill ${isComplete ? 'completed' : ''}`;
        pill.innerHTML = `
          <span>${prod.emoji} ${prod.name}</span>
          <span class="pill-qty">(${inBasket}/${reqItem.qty})</span>
          ${isComplete ? '<span>✓</span>' : ''}
        `;
        this.dom.taskChecklist.appendChild(pill);
      });
    }

    showHint(message) {
      this.dom.taskHintText.textContent = message;
      this.dom.taskHintBox.classList.remove('hidden');
    }

    hideHint() {
      this.dom.taskHintBox.classList.add('hidden');
    }

    // ==========================================================================
    // SHELF DISPLAY & BASKET LOGIC
    // ==========================================================================
    renderShelves() {
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
          <div class="product-emoji-wrap">${prod.emoji}</div>
          <div class="product-name">${prod.name}</div>
          <div class="product-price-tag">RM ${prod.price.toFixed(2)}</div>
          <div class="product-actions">
            ${qtyInBasket > 0 ? `<button class="btn-shelf-mod btn-minus" data-action="minus" data-id="${prod.id}">-</button>` : ''}
            <span class="product-qty-badge">${qtyInBasket > 0 ? `x${qtyInBasket}` : ''}</span>
            <button class="btn-shelf-mod btn-plus" data-action="plus" data-id="${prod.id}">+</button>
          </div>
        `;

        // Click card body to add item
        card.addEventListener('click', (e) => {
          if (e.target.closest('.btn-shelf-mod')) return; // handled by button
          this.modifyBasketItem(prod.id, 1);
        });

        // Plus and Minus button handles
        const plusBtn = card.querySelector('.btn-plus');
        if (plusBtn) {
          plusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.modifyBasketItem(prod.id, 1);
          });
        }

        const minusBtn = card.querySelector('.btn-minus');
        if (minusBtn) {
          minusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.modifyBasketItem(prod.id, -1);
          });
        }

        this.dom.shelvesGrid.appendChild(card);
      });
    }

    modifyBasketItem(productId, delta) {
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
      this.dom.basketItemsList.innerHTML = '';
      const itemKeys = Object.keys(this.basket);

      let totalItems = 0;
      let totalRM = 0;

      if (itemKeys.length === 0) {
        this.dom.basketItemsList.innerHTML = `
          <div class="basket-empty-state">
            <span>🛒 Click products from the shelves to add them to your basket!</span>
          </div>
        `;
        this.dom.basketItemCount.textContent = '0 items';
        this.dom.basketTotalText.textContent = 'RM 0.00';
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
            <span class="basket-row-emoji">${prod.emoji}</span>
            <span class="basket-row-name">${prod.name}</span>
            <span class="basket-row-qty">x${qty}</span>
          </div>
          <div class="basket-row-actions">
            <strong class="basket-row-price">RM ${lineTotal.toFixed(2)}</strong>
            <button class="btn-remove-basket-item" data-id="${prod.id}" title="Remove item">✕</button>
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

      this.dom.basketItemCount.textContent = `${totalItems} item${totalItems > 1 ? 's' : ''}`;
      this.dom.basketTotalText.textContent = `RM ${totalRM.toFixed(2)}`;
    }

    // ==========================================================================
    // CASH DRAWER & PAYMENT MAT CONTROLLER
    // ==========================================================================
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

    getBasketTotal() {
      let total = 0;
      Object.keys(this.basket).forEach(pId => {
        const prod = PRODUCTS.find(p => p.id === pId);
        total += prod.price * this.basket[pId];
      });
      return Math.round(total * 100) / 100;
    }

    getTrayTotal() {
      let sum = this.paymentTray.reduce((acc, v) => acc + v, 0);
      return Math.round(sum * 100) / 100;
    }

    updatePaymentDisplay() {
      const task = CHALLENGES[this.currentTaskIdx];
      const basketTotal = this.getBasketTotal();
      const trayTotal = this.getTrayTotal();

      // POS Display
      this.dom.posTotalDue.textContent = `RM ${task.targetTotal.toFixed(2)}`;
      this.dom.posPaidAmount.textContent = `RM ${trayTotal.toFixed(2)}`;
      this.dom.traySumDisplay.textContent = `RM ${trayTotal.toFixed(2)}`;

      const diff = Math.round((task.targetTotal - trayTotal) * 100) / 100;
      if (diff > 0) {
        this.dom.posDifferenceTag.innerHTML = `Needs: <strong style="color: #f87171;">RM ${diff.toFixed(2)}</strong>`;
        this.dom.posStatusBadge.textContent = 'READY TO PAY';
        this.dom.posStatusBadge.style.color = '#34d399';
      } else if (diff < 0) {
        this.dom.posDifferenceTag.innerHTML = `Over by: <strong style="color: #fb923c;">RM ${Math.abs(diff).toFixed(2)}</strong>`;
        this.dom.posStatusBadge.textContent = 'OVERPAID';
        this.dom.posStatusBadge.style.color = '#fb923c';
      } else {
        this.dom.posDifferenceTag.innerHTML = `<strong style="color: #34d399;">EXACT MATCH! ✓</strong>`;
        this.dom.posStatusBadge.textContent = 'EXACT AMOUNT';
        this.dom.posStatusBadge.style.color = '#34d399';
      }

      // Render Mat Chips
      this.dom.paymentMatItems.innerHTML = '';
      if (this.paymentTray.length === 0) {
        this.dom.paymentMatItems.innerHTML = `
          <span class="mat-placeholder">Click notes &amp; coins above to pay the exact total</span>
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
          label = `${Math.round(val * 100)}¢`;
        }

        chip.className = `tray-chip ${chipClass}`;
        chip.textContent = label;
        this.dom.paymentMatItems.appendChild(chip);
      });
    }

    // ==========================================================================
    // CHECKOUT & VALIDATION
    // ==========================================================================
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

      // Also ensure no extra unwanted items
      const requestedIds = task.items.map(i => i.id);
      for (const bId of Object.keys(this.basket)) {
        if (!requestedIds.includes(bId)) {
          basketMatches = false;
          break;
        }
      }

      if (!basketMatches) {
        this.audio.playWrongBuzz();
        this.showHint(`Please collect the exact items from the shopping list first!`);
        return;
      }

      // 2. Verify payment amount
      const trayTotal = this.getTrayTotal();
      const targetTotal = task.targetTotal;

      if (trayTotal === targetTotal) {
        // EXACT PAYMENT SUCCESS!
        this.handleSuccessfulPayment(task, targetTotal);
      } else {
        // INCORRECT PAYMENT
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

      // Show Success Modal
      this.dom.successTitle.textContent = 'Exact Payment Verified!';
      this.dom.successDetails.textContent = `You paid RM ${amount.toFixed(2)} accurately for "${task.title}". Great job!`;
      this.dom.successPoints.textContent = `+${earnedPoints} Points!`;
      this.dom.checkoutSuccessModal.classList.remove('hidden');

      if (window.NumberlandFeedback) {
        window.NumberlandFeedback.showFloatingPoints(earnedPoints, window.innerWidth / 2, window.innerHeight / 2);
      }
    }

    handleIncorrectPayment(task, paid, target) {
      this.audio.playWrongBuzz();
      this.lives--;
      this.updateHUD();

      const diff = Math.round((target - paid) * 100) / 100;
      if (paid < target) {
        this.showHint(`You placed RM ${paid.toFixed(2)}, but total is RM ${target.toFixed(2)}. You need RM ${diff.toFixed(2)} more! ${task.hint}`);
      } else {
        this.showHint(`You placed RM ${paid.toFixed(2)}. That's over by RM ${Math.abs(diff).toFixed(2)}! ${task.hint}`);
      }

      if (this.lives <= 0) {
        this.endGame(false, 'Out of accuracy lives! Check your change carefully next time.');
      }
    }

    proceedToNextTask() {
      this.dom.checkoutSuccessModal.classList.add('hidden');
      this.currentTaskIdx++;

      if (this.currentTaskIdx >= CHALLENGES.length) {
        this.endGame(true, 'Outstanding! You completed all 10 shopping challenges!');
      } else {
        this.loadTask(this.currentTaskIdx);
      }
    }

    // ==========================================================================
    // GAME OVER & RESULTS SCREEN
    // ==========================================================================
    endGame(completedAll, message) {
      this.isPlaying = false;
      if (this.timerInterval) clearInterval(this.timerInterval);

      this.dom.endTitle.textContent = completedAll ? 'SUPERMARKET CHAMPION!' : 'SHIFT COMPLETED!';
      this.dom.endSubtitle.textContent = message;

      // Calculate Stars (1 to 3 stars)
      let stars = 1;
      if (completedAll && this.lives === 3) {
        stars = 3;
      } else if (completedAll || this.currentTaskIdx >= 6) {
        stars = 2;
      } else if (this.score > 200) {
        stars = 1;
      }

      const starSlots = this.dom.starsContainer.querySelectorAll('.star-slot');
      starSlots.forEach((slot, idx) => {
        if (idx < stars) {
          slot.classList.add('earned');
        } else {
          slot.classList.remove('earned');
        }
      });

      // Populate Summary Grid
      this.dom.finalScoreVal.textContent = this.score.toLocaleString();
      this.dom.finalTasksVal.textContent = `${Math.min(CHALLENGES.length, this.currentTaskIdx + (completedAll ? 0 : 0))} / ${CHALLENGES.length}`;
      this.dom.finalLivesVal.textContent = `${this.lives} / ${this.maxLives}`;
      this.dom.finalSpentVal.textContent = `RM ${this.totalSpent.toFixed(2)}`;

      // Save to Profile
      if (window.NumberlandProfile) {
        window.NumberlandProfile.saveGameRecord('math-shop', this.score, stars);
      }

      this.dom.endScreen.classList.remove('hidden');
    }
  }

  // ==========================================================================
  // INITIALIZE ON DOM READY
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    window.game = new MathShopGame();
  });
})();
