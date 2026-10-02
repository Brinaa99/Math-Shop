/**
 * MATH SHOP: DATA DASH — RETRO ARCADE SUPERMARKET DATA INTERPRETATION ENGINE
 * Cambridge & Standard 3 Mathematics: Displaying & Interpreting Data
 * (Pictographs, Bar Charts, Comparisons, Most/Least, Differences, Ordering)
 * StuCent Sandboxed Runtime Compatible (Allow-Scripts / ShadowRoot Safe)
 */

(() => {
  'use strict';

  const doc = typeof root !== 'undefined' ? root : document;
  const gameCtx = typeof game !== 'undefined' ? game : (window.game || null);

  const safeStorage = {
    getItem(key) {
      try { return (typeof window !== 'undefined' && window.localStorage) ? window.localStorage.getItem(key) : null; } catch (e) { return null; }
    },
    setItem(key, val) {
      try { if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem(key, val); } catch (e) {}
    }
  };

  function getEl(id) {
    try {
      if (doc && typeof doc.getElementById === 'function') {
        const el = doc.getElementById(id);
        if (el) return el;
      }
      if (doc && typeof doc.querySelector === 'function') {
        const el = doc.querySelector('#' + id);
        if (el) return el;
      }
    } catch (e) {}
    try {
      if (typeof document !== 'undefined' && typeof document.getElementById === 'function') {
        return document.getElementById(id);
      }
    } catch (e) {}
    return null;
  }

  function queryAll(sel) {
    try {
      if (doc && typeof doc.querySelectorAll === 'function') {
        const res = doc.querySelectorAll(sel);
        if (res && res.length > 0) return res;
      }
    } catch (e) {}
    try {
      if (typeof document !== 'undefined' && typeof document.querySelectorAll === 'function') {
        return document.querySelectorAll(sel);
      }
    } catch (e) {}
    return [];
  }

  // ==========================================================================
  // 1. SOUND SYNTHESIZER & PROCEDURAL SUPERMARKET BGM
  // ==========================================================================
  let audioCtx = null;
  let isMuted = safeStorage.getItem('math_games_sound') === 'false';
  let bgmMasterGain = null;
  let bgmInterval = null;
  let bgmStep = 0;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
        bgmMasterGain = audioCtx.createGain();
        bgmMasterGain.gain.setValueAtTime(isMuted ? 0 : 0.05, audioCtx.currentTime);
        bgmMasterGain.connect(audioCtx.destination);
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function startShopBGM() {
    initAudio();
    if (!audioCtx || bgmInterval) return;

    // Upbeat Supermarket Arcade Groove in F Major (120 BPM)
    const bassline = [
      174.61, 0, 261.63, 0,  220.00, 0, 261.63, 0,
      196.00, 0, 293.66, 0,  261.63, 0, 293.66, 0,
      174.61, 0, 261.63, 0,  220.00, 0, 261.63, 0,
      220.00, 0, 261.63, 0,  174.61, 0, 0, 0
    ];

    const leadMelody = [
      349.23, 0, 440.00, 0,  523.25, 0, 440.00, 0,
      392.00, 0, 523.25, 0,  440.00, 0, 392.00, 0,
      349.23, 0, 440.00, 0,  523.25, 0, 587.33, 0,
      523.25, 0, 440.00, 0,  349.23, 0, 0, 0
    ];

    const stepDuration = (60 / 120) / 4;
    bgmStep = 0;

    bgmInterval = setInterval(() => {
      if (isMuted || !audioCtx || !isPlaying || isGameOver) return;
      const t = audioCtx.currentTime;
      const idx = bgmStep % 32;

      const bFreq = bassline[idx];
      if (bFreq > 0) {
        try {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(bFreq, t);
          gain.gain.setValueAtTime(0.06, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + stepDuration * 1.5);
          osc.connect(gain);
          gain.connect(bgmMasterGain);
          osc.start(t);
          osc.stop(t + stepDuration * 1.6);
        } catch (e) {}
      }

      const lFreq = leadMelody[idx];
      if (lFreq > 0) {
        try {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(lFreq, t);
          gain.gain.setValueAtTime(0.035, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + stepDuration * 1.3);
          osc.connect(gain);
          gain.connect(bgmMasterGain);
          osc.start(t);
          osc.stop(t + stepDuration * 1.4);
        } catch (e) {}
      }

      bgmStep++;
    }, stepDuration * 1000);
  }

  function stopShopBGM() {
    if (bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
  }

  function beep(freq, durationMs, type = 'sine', vol = 0.15, delaySec = 0) {
    if (isMuted) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const t = audioCtx.currentTime + delaySec;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + durationMs / 1000);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + durationMs / 1000);
    } catch (e) {}
  }

  function playRestockSound() {
    beep(587.33, 60, 'triangle', 0.18);
    beep(880.00, 100, 'sine', 0.15, 0.05);
  }

  function playSuccessChime() {
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      beep(f, 160, 'triangle', 0.2, i * 0.08);
    });
  }

  function playWrongSound() {
    beep(180, 240, 'sawtooth', 0.2);
    beep(130, 260, 'square', 0.16, 0.08);
  }

  function playCashChime() {
    beep(1200, 80, 'sine', 0.2);
    beep(1800, 120, 'triangle', 0.15, 0.06);
  }

  // ==========================================================================
  // 2. PRODUCT DEFINITIONS (PURE VECTOR SVG GRAPHICS)
  // ==========================================================================
  const PRODUCTS = {
    apples: {
      id: 'apples',
      name: 'Fresh Apples',
      color: '#ef4444',
      svg: `<svg viewBox="0 0 24 24" fill="#ef4444"><path d="M12 4c-1.5-1.5-3-2-5-2C4 2 2 4 2 7c0 4.5 5 10 10 13 5-3 10-8.5 10-13 0-3-2-5-5-5-2 0-3.5.5-5 2z"/><path d="M12 4V1" stroke="#16a34a" stroke-width="2" stroke-linecap="round"/></svg>`
    },
    milk: {
      id: 'milk',
      name: 'Fresh Milk',
      color: '#38bdf8',
      svg: `<svg viewBox="0 0 24 24" fill="#38bdf8"><path d="M7 4h10v2H7V4zm1 3h8l1 14H7L8 7zm2 4h4v6h-4v-6z"/></svg>`
    },
    bread: {
      id: 'bread',
      name: 'Crusty Bread',
      color: '#f59e0b',
      svg: `<svg viewBox="0 0 24 24" fill="#f59e0b"><path d="M3 12c0-3.5 3.5-6 9-6s9 2.5 9 6c0 3-2 5-4 6H7c-2-1-4-3-4-6zm5-2v4m4-4v4m4-4v4" stroke="#78350f" stroke-width="1.5" stroke-linecap="round"/></svg>`
    },
    cereal: {
      id: 'cereal',
      name: 'Crunchy Cereal',
      color: '#a855f7',
      svg: `<svg viewBox="0 0 24 24" fill="#a855f7"><path d="M5 4h14v16H5V4zm3 4h8v3H8V8zm2 5h4v4h-4v-4z"/></svg>`
    }
  };

  // ==========================================================================
  // 3. CAMBRIDGE YEAR 3/4 DISPLAYING & INTERPRETING DATA ROUNDS (10 ROUNDS)
  // ==========================================================================
  const ROUNDS = [
    // STAGE 1: CHECK THE STOCK (PICTOGRAPHS & LEAST / MOST)
    {
      roundNum: 1,
      mode: 'restock',
      chartType: 'pictograph',
      badge: 'ROUND 01 • STOCK PICTOGRAPH (LEAST STOCK)',
      title: 'RESTOCK THE LOWEST PRODUCT: FRESH APPLES (2 UNITS)',
      tip: 'Look at the pictograph! Apples has only 2 icons. Restock its shelf!',
      chartTitle: 'CURRENT AISLE STOCK (PICTOGRAPH)',
      scaleTag: '1 ICON = 1 UNIT',
      data: { milk: 6, bread: 5, apples: 2, cereal: 7 },
      targetKeys: ['apples'],
      successMessage: 'Apples restocked! Stock chart updated from 2 to 8 units.'
    },
    {
      roundNum: 2,
      mode: 'restock',
      chartType: 'pictograph',
      badge: 'ROUND 02 • STOCK PICTOGRAPH (COMPARING QUANTITIES)',
      title: 'RESTOCK CRUSTY BREAD (3 UNITS) TO REACH 7 UNITS',
      tip: 'Bread has only 3 units. Tap RESTOCK on the Bread shelf!',
      chartTitle: 'SUPERMARKET INVENTORY (PICTOGRAPH)',
      scaleTag: '1 ICON = 1 UNIT',
      data: { milk: 8, bread: 3, apples: 7, cereal: 5 },
      targetKeys: ['bread'],
      successMessage: 'Bread shelf restocked to full capacity!'
    },
    {
      roundNum: 3,
      mode: 'restock',
      chartType: 'bar_threshold',
      badge: 'ROUND 03 • QUANTITY BARS (LOW STOCK THRESHOLD)',
      title: 'RESTOCK ALL ITEMS BELOW 4 UNITS (APPLES & CEREAL)',
      tip: 'Items below 4 units are in the RED alert zone. Restock both!',
      chartTitle: 'STOCK LEVEL GAUGE (CRITICAL < 4)',
      scaleTag: 'RED = LOW STOCK',
      threshold: 4,
      data: { milk: 7, bread: 6, apples: 2, cereal: 3 },
      targetKeys: ['apples', 'cereal'],
      successMessage: 'Both low-stock items restocked above threshold!'
    },

    // STAGE 2: SALES RUSH (BAR CHARTS & MOST POPULAR)
    {
      roundNum: 4,
      mode: 'restock',
      chartType: 'barchart',
      badge: 'ROUND 04 • TODAY\'S SALES BAR CHART (TOP SELLER)',
      title: 'RESTOCK THE TOP SELLER: FRESH MILK (9 SOLD TODAY)',
      tip: 'Check the bar chart! Milk has the longest bar (9 sold). Restock Milk!',
      chartTitle: 'TODAY\'S CUSTOMER SALES (BAR CHART)',
      scaleTag: 'UNITS SOLD TODAY',
      data: { milk: 9, bread: 4, apples: 6, cereal: 3 },
      targetKeys: ['milk'],
      successMessage: 'Top seller Milk restocked for evening shoppers!'
    },
    {
      roundNum: 5,
      mode: 'restock',
      chartType: 'barchart',
      badge: 'ROUND 05 • SALES DIFFERENCE (FINDING DIFFERENCES)',
      title: 'RESTOCK APPLES (SOLD 3 vs MILK SOLD 8 — DIFFERENCE: 5)',
      tip: 'Milk sold 8 and Apples sold 3. The difference is 8 - 3 = 5. Restock Apples!',
      chartTitle: 'SALES COMPARISON (BAR CHART)',
      scaleTag: '8 - 3 = 5 UNITS',
      data: { milk: 8, bread: 7, apples: 3, cereal: 5 },
      targetKeys: ['apples'],
      successMessage: 'Apples restocked to balance inventory!'
    },
    {
      roundNum: 6,
      mode: 'restock',
      chartType: 'barchart',
      badge: 'ROUND 06 • CUSTOMER DEMAND (MOST POPULAR)',
      title: 'RESTOCK CRUSTY BREAD (HIGHEST DEMAND: 10 CUSTOMERS)',
      tip: 'Bread has the highest demand on the chart (10). Restock Bread!',
      chartTitle: 'CUSTOMER DEMAND FORECAST',
      scaleTag: 'CUSTOMERS WAITING',
      data: { milk: 5, bread: 10, apples: 4, cereal: 8 },
      targetKeys: ['bread'],
      successMessage: 'Demand satisfied! +RM 10.00 Supermarket Bonus!'
    },

    // STAGE 3: BUILD THE DISPLAY (ORDERING DATA FROM GREATEST TO SMALLEST)
    {
      roundNum: 7,
      mode: 'ordering',
      chartType: 'pictograph',
      badge: 'ROUND 07 • ORDERING SALES (MOST SOLD → LEAST SOLD)',
      title: 'ARRANGE FEATURED DISPLAY: MOST SOLD TO LEAST SOLD',
      tip: 'Order: Milk (8) > Cereal (6) > Bread (4) > Apples (2)',
      chartTitle: 'WEEKLY SALES DATA (PICTOGRAPH)',
      scaleTag: '1 ICON = 1 UNIT',
      data: { milk: 8, cereal: 6, bread: 4, apples: 2 },
      correctOrder: ['milk', 'cereal', 'bread', 'apples'],
      successMessage: 'Featured display perfectly arranged by sales volume!'
    },
    {
      roundNum: 8,
      mode: 'ordering',
      chartType: 'barchart',
      badge: 'ROUND 08 • ORDERING STOCK (LOWEST STOCK FIRST)',
      title: 'ORDER DELIVERY PRIORITY: LEAST STOCK TO MOST STOCK',
      tip: 'Order: Apples (1) < Bread (3) < Milk (6) < Cereal (9)',
      chartTitle: 'WAREHOUSE STOCK LEVELS (BAR CHART)',
      scaleTag: 'DELIVERY PRIORITY',
      data: { apples: 1, bread: 3, milk: 6, cereal: 9 },
      correctOrder: ['apples', 'bread', 'milk', 'cereal'],
      successMessage: 'Delivery truck loaded by stock urgency!'
    },

    // STAGE 4: COMPARE THE DATA & SUPERMARKET MANAGER FINALE
    {
      roundNum: 9,
      mode: 'restock',
      chartType: 'dual_comparison',
      badge: 'ROUND 09 • 2-DAY SALES COMPARISON (MONDAY vs TUESDAY)',
      title: 'RESTOCK PRODUCT WITH BIGGEST SALES INCREASE: MILK (+4)',
      tip: 'Milk sales doubled from 4 (Mon) to 8 (Tue) (+4 jump). Restock Milk!',
      chartTitle: 'MONDAY (BLUE) vs TUESDAY (GOLD) SALES',
      scaleTag: '2-DAY TREND',
      dataMon: { milk: 4, bread: 7, apples: 3, cereal: 6 },
      dataTue: { milk: 8, bread: 5, apples: 6, cereal: 6 },
      targetKeys: ['milk'],
      successMessage: 'Fastest-growing product Milk successfully replenished!'
    },
    {
      roundNum: 10,
      mode: 'restock',
      chartType: 'barchart',
      badge: 'ROUND 10 • GRAND SUPERMARKET MANAGER CHALLENGE',
      title: 'RESTOCK CRITICAL HIGH-SALES LOW-STOCK ITEMS (MILK & APPLES)',
      tip: 'Both Milk (Sold 8, Stock 2) & Apples (Sold 7, Stock 3) need restocking!',
      chartTitle: 'END-OF-DAY MANAGER REPORT',
      scaleTag: 'MANAGER AUDIT',
      data: { milk: 8, apples: 7, cereal: 5, bread: 3 },
      targetKeys: ['milk', 'apples'],
      successMessage: 'SUPERMARKET MASTER! All data interpreted and shift completed!'
    }
  ];

  // ==========================================================================
  // 4. GAME STATE
  // ==========================================================================
  let currentRoundIdx = 0;
  let score = 0;
  let lives = 3;
  let combo = 1;
  let bestCombo = 1;
  let totalTasksDone = 0;
  let totalAttempts = 0;
  let timeRemaining = 90;
  let gameTimerInterval = null;
  let gameStartTime = 0;
  let isPlaying = false;
  let isGameOver = false;

  // Active round progress state
  let currentRestockedKeys = new Set();
  let currentRankingSlots = [null, null, null, null]; // [0..3] holds product id

  // ==========================================================================
  // 5. SCREEN & HUD MANAGEMENT
  // ==========================================================================
  function setScreen(screenId) {
    const screens = ['start-screen', 'countdown-screen', 'instructions-modal', 'game-over-screen'];
    screens.forEach(id => {
      const el = getEl(id);
      if (el) {
        if (id === screenId) {
          el.classList.remove('hidden');
          el.classList.add('active');
        } else {
          el.classList.add('hidden');
          el.classList.remove('active');
        }
      }
    });
  }

  function updateHUD() {
    const scoreEl = getEl('score-display');
    const timerEl = getEl('timer-display');
    const roundEl = getEl('round-display');
    const comboEl = getEl('combo-display');

    if (scoreEl) scoreEl.textContent = String(score).padStart(6, '0');
    if (timerEl) timerEl.textContent = String(Math.max(0, timeRemaining)).padStart(3, '0');
    if (roundEl) roundEl.textContent = `${String(currentRoundIdx + 1).padStart(2, '0')} / 10`;
    if (comboEl) comboEl.textContent = `${combo}x`;

    const heartsContainer = getEl('lives-container');
    if (heartsContainer) {
      let heartsHtml = '';
      for (let i = 0; i < 3; i++) {
        const isFull = i < lives;
        heartsHtml += `<span class="heart-icon ${isFull ? 'active' : 'lost'}"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></span>`;
      }
      heartsContainer.innerHTML = heartsHtml;
    }
  }

  function showHint(text) {
    const hintBanner = getEl('hint-banner');
    const hintText = getEl('hint-text');
    if (hintBanner && hintText) {
      hintText.textContent = text;
      hintBanner.classList.remove('hidden');
      setTimeout(() => {
        hintBanner.classList.add('hidden');
      }, 4000);
    }
  }

  // ==========================================================================
  // 6. DYNAMIC DATA CHART RENDERER (LEFT TERMINAL)
  // ==========================================================================
  function renderChart(roundData) {
    const chartTitleEl = getEl('chart-title');
    const chartScaleEl = getEl('chart-scale-tag');
    const chartViewport = getEl('chart-viewport');

    if (chartTitleEl) chartTitleEl.textContent = roundData.chartTitle;
    if (chartScaleEl) chartScaleEl.textContent = roundData.scaleTag;
    if (!chartViewport) return;

    chartViewport.innerHTML = '';

    if (roundData.chartType === 'pictograph') {
      // 1. PICTOGRAPH RENDERING
      const keys = Object.keys(roundData.data);
      keys.forEach(k => {
        const prod = PRODUCTS[k];
        const count = roundData.data[k];

        const row = document.createElement('div');
        row.className = 'picto-row';
        if (roundData.targetKeys && roundData.targetKeys.includes(k) && currentRestockedKeys.has(k)) {
          row.classList.add('highlighted');
        }

        let iconsHtml = '';
        for (let i = 0; i < count; i++) {
          iconsHtml += `<span class="picto-icon" title="${prod.name}">${prod.svg}</span>`;
        }

        row.innerHTML = `
          <div class="picto-label-wrap">
            <span class="picto-name">${prod.name}</span>
            <span class="picto-count font-mono">${count} Units</span>
          </div>
          <div class="picto-icons-cell">
            ${iconsHtml}
          </div>
        `;
        chartViewport.appendChild(row);
      });

    } else if (roundData.chartType === 'barchart' || roundData.chartType === 'bar_threshold') {
      // 2. BAR CHART / QUANTITY GAUGE RENDERING
      const chartWrap = document.createElement('div');
      chartWrap.className = 'bar-chart-wrap';

      const keys = Object.keys(roundData.data);
      const maxVal = 10;

      keys.forEach(k => {
        const prod = PRODUCTS[k];
        const val = roundData.data[k];
        const pct = Math.min(100, Math.round((val / maxVal) * 100));
        const isBelowThresh = roundData.threshold && val < roundData.threshold;

        const row = document.createElement('div');
        row.className = 'bar-row';

        const barColor = isBelowThresh ? '#ef4444' : prod.color;

        row.innerHTML = `
          <span class="bar-label">${prod.name}</span>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${pct}%; background: ${barColor};">
              <span class="bar-val-text">${val}</span>
            </div>
          </div>
        `;
        chartWrap.appendChild(row);
      });

      chartViewport.appendChild(chartWrap);

    } else if (roundData.chartType === 'dual_comparison') {
      // 3. 2-DAY SIDE-BY-SIDE COMPARISON CHART
      const chartWrap = document.createElement('div');
      chartWrap.className = 'bar-chart-wrap';

      const keys = Object.keys(roundData.dataMon);
      keys.forEach(k => {
        const prod = PRODUCTS[k];
        const monVal = roundData.dataMon[k];
        const tueVal = roundData.dataTue[k];
        const monPct = Math.min(100, Math.round((monVal / 10) * 100));
        const tuePct = Math.min(100, Math.round((tueVal / 10) * 100));
        const diff = tueVal - monVal;
        const diffTag = diff > 0 ? `+${diff}` : `${diff}`;

        const row = document.createElement('div');
        row.className = 'bar-row';
        row.innerHTML = `
          <span class="bar-label">${prod.name} <small style="color:${diff > 0 ? '#10b981':'#94a3b8'}">(${diffTag})</small></span>
          <div class="dual-bar-wrap">
            <div class="dual-bar-item dual-bar-mon" style="width: ${monPct}%;">Mon: ${monVal}</div>
            <div class="dual-bar-item dual-bar-tue" style="width: ${tuePct}%;">Tue: ${tueVal}</div>
          </div>
        `;
        chartWrap.appendChild(row);
      });

      chartViewport.appendChild(chartWrap);
    }
  }

  // ==========================================================================
  // 7. INTERACTIVE ACTION ZONE (RIGHT PANE)
  // ==========================================================================
  function setupRoundView(roundData) {
    const missionBadge = getEl('round-badge');
    const taskTitle = getEl('task-title-text');
    const taskSub = getEl('task-subtext');
    const shelvesView = getEl('shelves-view');
    const rankingView = getEl('ranking-view');
    const deliveryDock = getEl('delivery-dock');

    if (missionBadge) missionBadge.textContent = roundData.badge;
    if (taskTitle) taskTitle.textContent = roundData.title;
    if (taskSub) taskSub.textContent = roundData.tip;

    currentRestockedKeys.clear();
    currentRankingSlots = [null, null, null, null];

    renderChart(roundData);

    if (roundData.mode === 'restock') {
      if (shelvesView) shelvesView.classList.remove('hidden');
      if (rankingView) rankingView.classList.add('hidden');
      if (deliveryDock) deliveryDock.classList.remove('hidden');
      renderShelves(roundData);
      renderCrateDock(roundData);

    } else if (roundData.mode === 'ordering') {
      if (shelvesView) shelvesView.classList.add('hidden');
      if (rankingView) rankingView.classList.remove('hidden');
      if (deliveryDock) deliveryDock.classList.add('hidden');
      renderRankingPodium(roundData);
    }

    updateHUD();
  }

  function renderShelves(roundData) {
    const shelvesView = getEl('shelves-view');
    if (!shelvesView) return;

    shelvesView.innerHTML = '';
    const keys = ['apples', 'milk', 'bread', 'cereal'];

    keys.forEach(k => {
      const prod = PRODUCTS[k];
      const stockVal = roundData.data ? (roundData.data[k] || 5) : 5;
      const isTarget = roundData.targetKeys && roundData.targetKeys.includes(k);
      const isDone = currentRestockedKeys.has(k);

      const card = document.createElement('div');
      card.className = 'shelf-card';
      if (isTarget && !isDone) card.classList.add('low-stock', 'target-glow');

      // Shelf items preview icons
      let itemsHtml = '';
      const displayCount = isDone ? 8 : stockVal;
      for (let i = 0; i < displayCount; i++) {
        itemsHtml += `<span class="picto-icon" style="width:18px;height:18px;">${prod.svg}</span>`;
      }

      const btnLabel = isDone ? 'RESTOCKED ✓' : `RESTOCK ${prod.name.toUpperCase()}`;

      card.innerHTML = `
        <div class="shelf-top-row">
          <span class="shelf-prod-name">${prod.name}</span>
          <span class="shelf-stock-pill ${isTarget && !isDone ? 'danger' : ''}">${displayCount} Units</span>
        </div>
        <div class="shelf-items-rack">
          ${itemsHtml}
        </div>
        <button class="shelf-restock-btn" data-key="${k}" ${isDone ? 'disabled' : ''}>
          ${btnLabel}
        </button>
      `;

      const restockBtn = card.querySelector('.shelf-restock-btn');
      if (restockBtn) {
        restockBtn.addEventListener('click', () => handleRestockClick(k, roundData));
      }

      shelvesView.appendChild(card);
    });
  }

  function renderCrateDock(roundData) {
    const dockContainer = getEl('dock-crates-container');
    if (!dockContainer) return;

    dockContainer.innerHTML = '';
    const keys = ['apples', 'milk', 'bread', 'cereal'];

    keys.forEach(k => {
      const prod = PRODUCTS[k];
      const pill = document.createElement('div');
      pill.className = 'crate-pill';
      pill.innerHTML = `📦 ${prod.name}`;
      pill.addEventListener('click', () => handleRestockClick(k, roundData));
      dockContainer.appendChild(pill);
    });
  }

  function handleRestockClick(productKey, roundData) {
    if (!isPlaying || isGameOver) return;
    totalAttempts++;

    const isTarget = roundData.targetKeys && roundData.targetKeys.includes(productKey);

    if (isTarget) {
      // CORRECT RESTOCK ACTION
      currentRestockedKeys.add(productKey);
      playRestockSound();
      playCashChime();

      score += 70 * combo;
      combo = Math.min(8, combo + 1);
      if (combo > bestCombo) bestCombo = combo;

      renderShelves(roundData);
      renderChart(roundData);
      updateHUD();

      // Check if all targets in this round are completed
      const allDone = roundData.targetKeys.every(k => currentRestockedKeys.has(k));
      if (allDone) {
        playSuccessChime();
        totalTasksDone++;
        showHint(roundData.successMessage);

        setTimeout(() => {
          if (currentRoundIdx + 1 < ROUNDS.length) {
            currentRoundIdx++;
            setupRoundView(ROUNDS[currentRoundIdx]);
          } else {
            endGame(true);
          }
        }, 800);
      }

    } else {
      // INCORRECT RESTOCK SELECTION
      playWrongSound();
      lives--;
      combo = 1;
      updateHUD();
      showHint(`Not ${PRODUCTS[productKey].name}! Check the data chart for the target item.`);

      if (lives <= 0) {
        endGame(false);
      }
    }
  }

  // ==========================================================================
  // 8. ORDERING PODIUM (FEATURED DISPLAY)
  // ==========================================================================
  function renderRankingPodium(roundData) {
    const podiumContainer = getEl('ranking-podium');
    const dockContainer = getEl('ranking-dock');
    if (!podiumContainer || !dockContainer) return;

    podiumContainer.innerHTML = '';
    dockContainer.innerHTML = '';

    const labels = ['1st (Greatest)', '2nd', '3rd', '4th (Smallest)'];

    // 4 Slots
    for (let i = 0; i < 4; i++) {
      const slot = document.createElement('div');
      const filledKey = currentRankingSlots[i];
      slot.className = `podium-slot ${filledKey ? 'filled' : ''}`;

      if (filledKey) {
        const prod = PRODUCTS[filledKey];
        slot.innerHTML = `
          <span class="podium-rank-badge">${labels[i]}</span>
          <span class="picto-icon" style="width:28px;height:28px;">${prod.svg}</span>
          <span style="font-family:var(--display-font);font-size:0.8rem;font-weight:900;color:#fff;">${prod.name}</span>
        `;
        slot.addEventListener('click', () => {
          currentRankingSlots[i] = null;
          renderRankingPodium(roundData);
        });
      } else {
        slot.innerHTML = `
          <span class="podium-rank-badge">${labels[i]}</span>
          <span style="font-size:0.75rem;color:var(--text-dim);">[ Empty ]</span>
        `;
      }
      podiumContainer.appendChild(slot);
    }

    // Available Products in Dock
    const placedSet = new Set(currentRankingSlots.filter(Boolean));
    const allKeys = ['apples', 'milk', 'bread', 'cereal'];

    allKeys.forEach(k => {
      if (!placedSet.has(k)) {
        const prod = PRODUCTS[k];
        const card = document.createElement('div');
        card.className = 'dock-product-card';
        card.innerHTML = `
          <span class="picto-icon" style="width:20px;height:20px;">${prod.svg}</span>
          <span>${prod.name}</span>
        `;
        card.addEventListener('click', () => {
          // Place into first open slot
          const firstOpen = currentRankingSlots.indexOf(null);
          if (firstOpen !== -1) {
            currentRankingSlots[firstOpen] = k;
            playRestockSound();
            renderRankingPodium(roundData);
          }
        });
        dockContainer.appendChild(card);
      }
    });

    // Reset & Submit Buttons
    const resetBtn = getEl('btn-reset-ranking');
    const submitBtn = getEl('btn-submit-ranking');

    if (resetBtn) {
      resetBtn.onclick = () => {
        currentRankingSlots = [null, null, null, null];
        renderRankingPodium(roundData);
      };
    }

    if (submitBtn) {
      submitBtn.onclick = () => submitRankingOrder(roundData);
    }
  }

  function submitRankingOrder(roundData) {
    if (!isPlaying || isGameOver) return;

    if (currentRankingSlots.includes(null)) {
      showHint('Please place all 4 products onto the podium slots!');
      playWrongSound();
      return;
    }

    totalAttempts++;
    const isCorrect = roundData.correctOrder.every((k, i) => currentRankingSlots[i] === k);

    if (isCorrect) {
      playSuccessChime();
      playCashChime();
      totalTasksDone++;
      score += 100 * combo;
      combo = Math.min(8, combo + 1);
      if (combo > bestCombo) bestCombo = combo;
      updateHUD();

      showHint(roundData.successMessage);

      setTimeout(() => {
        if (currentRoundIdx + 1 < ROUNDS.length) {
          currentRoundIdx++;
          setupRoundView(ROUNDS[currentRoundIdx]);
        } else {
          endGame(true);
        }
      }, 900);

    } else {
      playWrongSound();
      lives--;
      combo = 1;
      updateHUD();
      showHint('Incorrect order! Check the quantities on the left chart.');

      if (lives <= 0) {
        endGame(false);
      }
    }
  }

  // ==========================================================================
  // 9. START, COUNTDOWN & END GAME
  // ==========================================================================
  function startGame() {
    currentRoundIdx = 0;
    score = 0;
    lives = 3;
    combo = 1;
    bestCombo = 1;
    totalTasksDone = 0;
    totalAttempts = 0;
    timeRemaining = 90;
    isPlaying = true;
    isGameOver = false;
    gameStartTime = Date.now();

    setScreen(null);
    setupRoundView(ROUNDS[0]);
    startShopBGM();

    if (gameTimerInterval) clearInterval(gameTimerInterval);
    gameTimerInterval = setInterval(() => {
      if (!isPlaying || isGameOver) return;
      timeRemaining--;
      updateHUD();
      if (timeRemaining <= 0) {
        endGame(totalTasksDone >= 6);
      }
    }, 1000);
  }

  function startCountdown() {
    initAudio();
    setScreen('countdown-screen');
    let count = 3;
    const numEl = getEl('countdown-number');
    if (numEl) numEl.textContent = count;
    beep(440, 100, 'sine', 0.15);

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        if (numEl) numEl.textContent = count;
        beep(440, 100, 'sine', 0.15);
      } else {
        clearInterval(interval);
        beep(880, 250, 'sine', 0.2);
        startGame();
      }
    }, 750);
  }

  function endGame(isVictory) {
    isPlaying = false;
    isGameOver = true;
    stopShopBGM();
    if (gameTimerInterval) clearInterval(gameTimerInterval);

    const totalTimeTaken = Math.round((Date.now() - gameStartTime) / 1000);
    const accuracy = totalAttempts > 0 ? Math.round((totalTasksDone / totalAttempts) * 100) : 100;

    let stars = 1;
    if (score >= 500 && lives >= 2) stars = 3;
    else if (score >= 280) stars = 2;

    safeStorage.setItem('math_shop_stars', stars);

    if (isVictory) {
      playSuccessChime();
    } else {
      playWrongSound();
    }

    const badgeEl = getEl('game-over-badge');
    const titleEl = getEl('game-over-title');
    const scoreEl = getEl('final-score');
    const roundsEl = getEl('final-rounds');
    const accuracyEl = getEl('final-accuracy');
    const comboEl = getEl('final-combo');
    const timeEl = getEl('final-time');
    const starsContainer = getEl('stars-container');

    if (badgeEl) badgeEl.textContent = isVictory ? 'STORE SHIFT COMPLETE' : 'STORE SHIFT FINISHED';
    if (titleEl) titleEl.textContent = isVictory ? 'SUPERMARKET MASTER!' : 'NICE SHIFT EFFORT!';
    if (scoreEl) scoreEl.textContent = String(score).padStart(6, '0');
    if (roundsEl) roundsEl.textContent = `${Math.min(10, currentRoundIdx + (isVictory ? 1 : 0))} / 10`;
    if (accuracyEl) accuracyEl.textContent = `${accuracy}%`;
    if (comboEl) comboEl.textContent = `${bestCombo}x`;
    if (timeEl) timeEl.textContent = `${totalTimeTaken}s`;

    if (starsContainer) {
      let starsHtml = '';
      for (let s = 1; s <= 3; s++) {
        const active = s <= stars ? 'star-active' : '';
        starsHtml += `<span class="arcade-star ${active}"><svg viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg></span>`;
      }
      starsContainer.innerHTML = starsHtml;
    }

    setScreen('game-over-screen');

    // StuCent Reporting Contract
    if (gameCtx && typeof gameCtx.end === 'function') {
      const targetMax = (gameCtx.config && gameCtx.config.maxPoints) || 100;
      const normalizedScore = Math.min(targetMax, Math.round((score / 800) * targetMax));
      gameCtx.end({
        score: normalizedScore,
        maxScore: targetMax,
        timeTaken: totalTimeTaken,
        success: isVictory || normalizedScore >= 50
      });
    }
  }

  // ==========================================================================
  // 10. SETUP EVENT CONTROLS
  // ==========================================================================
  function setupControls() {
    const startBtn = getEl('start-game-btn');
    const howToBtn = getEl('how-to-play-btn');
    const hudRulesBtn = getEl('hud-how-to-play-btn');
    const closeInstBtn = getEl('close-instructions-btn');
    const startFromInstBtn = getEl('start-from-instructions-btn');
    const playAgainBtn = getEl('play-again-btn');
    const soundBtn = getEl('sound-toggle-btn');

    if (startBtn) startBtn.addEventListener('click', startCountdown);
    if (howToBtn) howToBtn.addEventListener('click', () => setScreen('instructions-modal'));
    if (hudRulesBtn) hudRulesBtn.addEventListener('click', () => setScreen('instructions-modal'));
    if (closeInstBtn) closeInstBtn.addEventListener('click', () => setScreen('start-screen'));
    if (startFromInstBtn) startFromInstBtn.addEventListener('click', startCountdown);
    if (playAgainBtn) playAgainBtn.addEventListener('click', startCountdown);

    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        safeStorage.setItem('math_games_sound', isMuted ? 'false' : 'true');
        soundBtn.textContent = isMuted ? 'SOUND: OFF' : 'SOUND: ON';
        if (isMuted) {
          stopShopBGM();
        } else if (isPlaying && !isGameOver) {
          startShopBGM();
        }
      });
    }
  }

  // ==========================================================================
  // 11. STUCENT INIT & BOOTSTRAP
  // ==========================================================================
  window.game = window.game || {};
  window.game.init = function (config) {
    window.game.config = config || {};
  };

  function init() {
    setupControls();
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
