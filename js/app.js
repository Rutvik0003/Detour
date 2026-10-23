/* Detour prototype · router, state, transitions, tab bar, guided tour, side panel, demo menu. */
(function () {
  'use strict';
  const D = window.DETOUR_DATA;
  const T = D.text;
  const UI = window.UI;
  const STORE_KEY = 'detour-prototype-v2';
  const STEPS = D.tour;

  /* Every screen. `tab` = owns a tab; `tabbar` = shows the bar under the last tab. */
  const SCREENS = [
    { id: 'splash' },
    { id: 'quiz' },
    { id: 'recap2026', story: true, theme: 'sand' },
    { id: 'link' },
    { id: 'today', tab: 'today' },
    { id: 'map', tab: 'map' },
    { id: 'ideas', tabbar: true },
    { id: 'diy', tab: 'diy' },
    { id: 'skills', tabbar: true },
    { id: 'recaps', tabbar: true },
    { id: 'monthly', story: true },
    { id: 'wrapped', story: true, theme: 'dark' },
    { id: 'me', tab: 'me' }
  ];
  const META = {};
  SCREENS.forEach((m, i) => { m.order = i; META[m.id] = m; });
  const MORE = ['map', 'ideas', 'skills', 'monthly', 'recaps', 'me'];

  const TABS = [
    { id: 'today', icon: 'sun' },
    { id: 'map', icon: 'map' },
    { id: 'diy', icon: 'hand' },
    { id: 'me', icon: 'user' }
  ];
  const TAB_INDEX = {};
  TABS.forEach((t, i) => { TAB_INDEX[t.id] = i; });

  /* ---------- state ---------- */
  function defaults() {
    return {
      onboarded: false,
      // Pre-filled so skipping the quiz still gives a good "2026 self".
      quiz: { music: true, cafe: true, park: true, seafood: false },
      categories: { food: true, music: true, clothes: true, places: true, travel: true },
      skills: ['cooking', 'trip'],
      stamps: D.numbers.stampsStart,
      mealsMonth: D.numbers.mealsMonthStart,
      diy: 'idle',
      diySteps: {},
      feed: {},
      ideas: {},
      notifOn: true,
      notifTime: '7:30',
      share: {},
      redeemed: {}
    };
  }
  function load() {
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      if (raw) return Object.assign(defaults(), JSON.parse(raw));
    } catch (e) { /* storage unavailable: run from memory */ }
    return defaults();
  }
  function save() {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(App.state)); } catch (e) { /* ignore */ }
  }

  /* ---------- tiny event bus ---------- */
  const handlers = {};
  function on(evt, fn) {
    (handlers[evt] = handlers[evt] || []).push(fn);
    return () => { handlers[evt] = (handlers[evt] || []).filter(f => f !== fn); };
  }
  function emit(evt, data) { (handlers[evt] || []).slice().forEach(f => f(data)); }

  /* ---------- router ---------- */
  let current = null;
  let stack = [];
  const ENTER = { forward: 'from-right', back: 'from-left', up: 'from-bottom', fade: 'from-fade' };
  const EXIT = { forward: 'to-left', back: 'to-right', up: 'to-fade', fade: 'to-fade' };

  function autoDir(from, to) {
    if (!from) return 'fade';
    const a = META[from], b = META[to];
    if (b.story) return 'up';
    if (a.story) return 'fade';
    if (a.tab && b.tab) return TAB_INDEX[b.tab] > TAB_INDEX[a.tab] ? 'forward' : 'back';
    return b.order >= a.order ? 'forward' : 'back';
  }

  function go(id, params, opts) {
    opts = opts || {};
    const meta = META[id];
    if (!meta || !window.Screens[id]) return;
    if (current && current.id === id && !opts.force) return;
    if (App._sheetClose) App._sheetClose();
    clearSpot();
    if (tour.mode === 'welcome' && current) { tour.mode = 'explore'; renderGuide(); }

    const prev = current;
    if (opts.reset || meta.tab) stack = [];
    else if (prev && !opts.noPush) stack.push({ id: prev.id, params: prev.params });

    const dir = opts.dir || autoDir(prev && prev.id, id);
    const enters = [], leaves = [];
    const ctx = { params: params || {}, onEnter: fn => enters.push(fn), onLeave: fn => leaves.push(fn) };
    const el = window.Screens[id](ctx);
    el.classList.add('screen');
    el.dataset.screen = id;
    if (meta.tab || meta.tabbar) el.classList.add('has-tabbar');
    wire(el);

    if (prev) prev.leaves.forEach(fn => { try { fn(); } catch (e) { /* ignore */ } });
    current = { id, params: ctx.params, el, leaves };
    if (meta.tab) App.lastTab = meta.tab;

    transition(el, prev && prev.el, dir);
    setChrome(meta);
    requestAnimationFrame(() => enters.forEach(fn => fn()));
    tourSync(id);
  }

  function back(fallback) {
    const prev = stack.pop();
    if (prev) go(prev.id, prev.params, { dir: 'back', noPush: true, force: true });
    else go(fallback || 'today', null, { dir: 'back', noPush: true, force: true });
  }

  function transition(el, old, dir) {
    const vp = document.getElementById('viewport');
    el.classList.add(ENTER[dir]);
    vp.appendChild(el);
    void el.offsetWidth;
    el.classList.remove(ENTER[dir]);
    if (old) {
      old.classList.add('is-leaving', EXIT[dir]);
      setTimeout(() => old.remove(), 380);
    }
  }

  function setChrome(meta) {
    phone().dataset.theme = meta.theme || 'light';
    const bar = document.getElementById('tabbar');
    const showBar = !!(meta.tab || meta.tabbar);
    bar.classList.toggle('is-hidden', !showBar);
    bar.setAttribute('aria-hidden', showBar ? 'false' : 'true');
    const activeTab = meta.tab || (meta.tabbar ? App.lastTab : null);
    bar.querySelectorAll('.tab').forEach(t => {
      const isOn = t.dataset.tab === activeTab;
      t.classList.toggle('is-active', isOn);
      if (isOn) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
      t.tabIndex = showBar ? 0 : -1;
    });
    document.querySelectorAll('[data-jump]').forEach(b => b.classList.toggle('is-active', b.dataset.jump === meta.id));
  }

  /* Shared click handling for every screen. */
  function wire(el) {
    el.addEventListener('click', e => {
      const t = e.target.closest('[data-go],[data-back],[data-redeem],[data-toast]');
      if (!t || !el.contains(t)) return;
      if (t.hasAttribute('data-go')) go(t.dataset.go);
      else if (t.hasAttribute('data-back')) back(t.dataset.back || 'today');
      else if (t.hasAttribute('data-redeem')) UI.openRedeem();
      else if (t.hasAttribute('data-toast')) Anim.toast(t.dataset.toast);
    });
  }

  const phone = () => document.getElementById('phoneScreen');

  /* ---------- bottom sheet ---------- */
  function sheet(content) {
    clearSpot();
    document.getElementById('notif').classList.remove('is-on');
    const layer = document.getElementById('sheetLayer');
    layer.innerHTML = '<div class="scrim"></div><div class="sheet" role="dialog" aria-modal="true"><div class="sheet__grab"></div></div>';
    layer.querySelector('.sheet').appendChild(content);
    void layer.offsetWidth;
    layer.classList.add('is-on');
    const close = () => {
      layer.classList.remove('is-on');
      App._sheetClose = null;
      setTimeout(() => { if (!layer.classList.contains('is-on')) layer.innerHTML = ''; }, 380);
    };
    layer.querySelector('.scrim').addEventListener('click', close);
    App._sheetClose = close;
    return close;
  }

  /* ---------- the agent notification (the core moment) ---------- */
  function agentNotification(onHide) {
    const N = T.notify;
    Anim.notify({
      app: N.app,
      when: N.now,
      iconHTML: UI.appIcon(),
      body: '<span class="notif__agent">' + UI.icon('chip', 14) + '</span>' + N.agentLine,
      detourLine: N.detourLine,
      duration: 7000,
      onHide: onHide,
      onTap: () => {
        const onToday = current && current.id === 'today';
        if (!onToday) go('today', null, { force: true });
        setTimeout(() => UI.openOptions('lunch'), onToday ? 0 : 420);
      }
    });
  }

  /* =========================================================
     Guided tour
     ========================================================= */
  const tour = { mode: 'welcome', step: 0 };   // mode: welcome | tour | done | explore
  let spotOff = null, spotTimer = 0, notifyTimer = 0, clearing = false;
  const shown = {};

  function clearSpot() {
    clearTimeout(spotTimer);
    if (spotOff) { clearing = true; spotOff(); clearing = false; spotOff = null; }
  }

  function scheduleSpot(delay) {
    clearSpot();
    if (tour.mode !== 'tour') return;
    const i = tour.step;
    const step = STEPS[i];
    if (shown[i] || !current || current.id !== step.screen) return;
    spotTimer = setTimeout(() => {
      if (tour.mode !== 'tour' || tour.step !== i || App._sheetClose || !current) return;
      const target = current.el.querySelector(step.target);
      if (!target) return;
      spotOff = Anim.spotlight(target, phone(), {
        getScale: () => App.scale,
        label: T.panel.tapHere,
        onRemove: () => { if (!clearing) shown[i] = true; spotOff = null; }
      });
    }, delay == null ? 700 : delay);
  }

  function tourSync(id) {
    clearTimeout(notifyTimer);
    if (tour.mode !== 'tour') return;
    const i = STEPS.findIndex(s => s.screen === id);
    if (i > -1) tour.step = i;
    renderGuide();
    if (i < 0) return;
    if (STEPS[i].notify && !shown['n' + i]) {
      notifyTimer = setTimeout(() => {
        shown['n' + i] = true;
        agentNotification(() => scheduleSpot(250));
      }, 900);
    } else {
      scheduleSpot();
    }
  }

  function tourStart() {
    App.state = defaults();
    save();
    Object.keys(shown).forEach(k => delete shown[k]);
    tour.mode = 'tour';
    tour.step = 0;
    renderGuide();
    go('splash', null, { force: true, reset: true, dir: 'fade' });
  }
  function tourGo(i) {
    i = Math.max(0, Math.min(STEPS.length - 1, i));
    const s = App.state;
    if (STEPS[i].screen === 'today' || STEPS[i].screen === 'diy' || STEPS[i].screen === 'wrapped') s.onboarded = true;
    tour.step = i;
    go(STEPS[i].screen, null, { force: true, reset: true });
  }
  function tourNext() {
    if (tour.step >= STEPS.length - 1) tourFinish();
    else tourGo(tour.step + 1);
  }
  function tourBack() { if (tour.step > 0) tourGo(tour.step - 1); }
  function tourFinish() {
    clearSpot();
    clearTimeout(notifyTimer);
    tour.mode = 'done';
    renderGuide();
  }
  function tourExplore() {
    clearSpot();
    clearTimeout(notifyTimer);
    tour.mode = 'explore';
    renderGuide();
  }

  /* ---------- guide UI: side panel (desktop) + slim bar and welcome card (phone width) ---------- */
  function jumpList() {
    const P = T.panel;
    const link = (id, n) => '<button class="panel__link" type="button" data-jump="' + id + '"><span class="num">' + n + '</span>' + T.screens[id] + '</button>';
    return '<p class="panel__label">' + P.jumpTitle + '</p>' +
      '<nav class="panel__nav"><p class="panel__group">' + P.tourGroup + '</p>' +
      STEPS.map((s, i) => link(s.screen, i + 1)).join('') +
      '<p class="panel__group">' + P.moreGroup + '</p>' +
      MORE.map(id => link(id, '·')).join('') + '</nav>';
  }

  function renderPanel() {
    const P = T.panel;
    const p = document.getElementById('panel');
    let body = '';
    if (tour.mode === 'welcome') {
      body = '<div class="welcome">' +
        '<p class="welcome__t">' + P.welcomeTitle + '</p><p class="welcome__s">' + P.welcomeSub + '</p>' +
        '<div class="welcome__btns"><button type="button" class="btn btn--primary" data-tour="start">' + P.start + '</button>' +
        '<button type="button" class="btn btn--ghost" data-tour="explore">' + P.explore + '</button></div></div>';
    } else if (tour.mode === 'tour') {
      const s = STEPS[tour.step];
      const last = tour.step === STEPS.length - 1;
      body = '<div class="guide">' +
        '<p class="guide__count">' + UI.fill(P.step, { n: tour.step + 1, total: STEPS.length }) + '</p>' +
        '<div class="guide__bar"><i style="width:' + ((tour.step + 1) / STEPS.length * 100) + '%"></i></div>' +
        '<h2 class="guide__title">' + s.title + '</h2>' +
        '<p class="guide__explain">' + s.explain + '</p>' +
        '<p class="guide__try"><b>' + P.tryThis + '</b> ' + s.tryThis + '</p>' +
        '<div class="guide__nav"><button type="button" class="btn btn--ghost btn--sm" data-tour="back"' + (tour.step === 0 ? ' disabled' : '') + '>' + UI.icon('chevronLeft', 16) + P.back + '</button>' +
        '<button type="button" class="btn btn--primary btn--sm" data-tour="next">' + (last ? P.finish : P.next) + UI.icon('chevron', 16) + '</button></div>' +
        '<ol class="guide__steps">' + STEPS.map((st, i) =>
          '<li><button type="button" data-tour="step" data-i="' + i + '" class="' + (i < tour.step ? 'is-done' : i === tour.step ? 'is-current' : '') + '"><span>' + (i < tour.step ? UI.icon('check', 12) : i + 1) + '</span>' + st.title + '</button></li>').join('') + '</ol>' +
        '<button type="button" class="linkbtn guide__leave" data-tour="explore">' + P.leave + '</button>' +
        '</div>';
    } else if (tour.mode === 'done') {
      body = '<div class="welcome welcome--done">' +
        '<p class="welcome__t">' + P.doneTitle + '</p><p class="welcome__s">' + P.doneSub + '</p>' +
        '<div class="welcome__btns"><button type="button" class="btn btn--primary" data-tour="start">' + UI.icon('refresh', 16) + P.restart + '</button></div></div>' +
        jumpList();
    } else {
      body = '<button type="button" class="btn btn--primary btn--sm panel__start" data-tour="start">' + UI.icon('play', 14) + P.start + '</button>' + jumpList();
    }
    p.innerHTML =
      '<div class="panel__brand">' + UI.wordmark(44) + '</div>' +
      '<p class="panel__tag">' + T.tagline + '</p>' +
      '<div class="panel__div">' + UI.dottedPath('divider') + '</div>' +
      body +
      '<p class="panel__foot">' + P.foot + '</p>';
  }

  function renderBar() {
    const P = T.panel;
    const bar = document.getElementById('tourbar');
    if (tour.mode === 'tour') {
      const s = STEPS[tour.step];
      const last = tour.step === STEPS.length - 1;
      bar.innerHTML =
        '<div class="tourbar__row"><span class="tourbar__count">' + (tour.step + 1) + '/' + STEPS.length + '</span>' +
          '<span class="tourbar__title">' + s.title + '</span>' +
          '<button type="button" class="tourbar__btn" data-tour="back" aria-label="' + P.back + '"' + (tour.step === 0 ? ' disabled' : '') + '>' + UI.icon('chevronLeft', 18) + '</button>' +
          '<button type="button" class="tourbar__btn tourbar__btn--next" data-tour="next">' + (last ? P.finish : P.next) + '</button></div>' +
        '<p class="tourbar__try"><b>' + P.tryThis + '</b> ' + s.tryThis + '</p>' +
        '<i class="tourbar__progress" style="width:' + ((tour.step + 1) / STEPS.length * 100) + '%"></i>';
    } else if (tour.mode === 'done') {
      bar.innerHTML =
        '<div class="tourbar__row"><span class="tourbar__title">' + P.doneTitle + '</span>' +
          '<button type="button" class="tourbar__btn tourbar__btn--next" data-tour="start">' + P.restart + '</button>' +
          '<button type="button" class="tourbar__btn" data-tour="explore" aria-label="' + T.close + '">' + UI.icon('close', 18) + '</button></div>' +
        '<p class="tourbar__try">' + P.doneSub + '</p>';
    } else {
      bar.innerHTML = '';
    }
  }

  function renderWelcome() {
    const P = T.panel;
    document.getElementById('welcome').innerHTML =
      '<div class="welcome welcome--overlay">' + UI.wordmark(36) +
        '<p class="welcome__t">' + P.welcomeTitle + '</p><p class="welcome__s">' + P.welcomeSub + '</p>' +
        '<div class="welcome__btns"><button type="button" class="btn btn--primary btn--block" data-tour="start">' + P.start + '</button>' +
        '<button type="button" class="btn btn--ghost btn--block" data-tour="explore">' + P.explore + '</button></div></div>';
  }

  function renderGuide() {
    renderPanel();
    renderBar();
    document.body.classList.toggle('is-welcome', tour.mode === 'welcome');
    phone().classList.toggle('has-tourbar', tour.mode === 'tour' || tour.mode === 'done');
    if (current) setChrome(META[current.id]);
  }

  function onTourClick(e) {
    const b = e.target.closest('[data-tour]');
    if (b) {
      const a = b.dataset.tour;
      if (a === 'start') tourStart();
      else if (a === 'explore') tourExplore();
      else if (a === 'next') tourNext();
      else if (a === 'back') tourBack();
      else if (a === 'step') tourGo(Number(b.dataset.i));
      return;
    }
    const j = e.target.closest('[data-jump]');
    if (j && !j.closest('.demo')) jumpTo(j.dataset.jump);
    if (e.target.closest('[data-demo-open]')) toggleDemo(true);
  }

  function jumpTo(id) {
    if (id === 'today' || id === 'diy' || id === 'wrapped' || MORE.indexOf(id) > -1) App.state.onboarded = true;
    go(id, null, { force: true, reset: true, dir: 'fade' });
  }

  /* ---------- tab bar ---------- */
  function buildTabbar() {
    const bar = document.getElementById('tabbar');
    bar.innerHTML = TABS.map(t =>
      '<button class="tab" type="button" data-tab="' + t.id + '">' + UI.icon(t.icon, 24) + '<span>' + T.tabs[t.id] + '</span></button>'
    ).join('');
    bar.addEventListener('click', e => {
      const b = e.target.closest('[data-tab]');
      if (b) go(b.dataset.tab);
    });
  }

  /* ---------- demo menu (press D) ---------- */
  let demoOpen = false;
  function buildDemo() {
    const X = T.demo;
    const d = document.getElementById('demo');
    const ids = STEPS.map(s => s.screen).concat(MORE);
    d.innerHTML =
      '<div class="demo__scrim" data-close></div>' +
      '<div class="demo__card" role="dialog" aria-modal="true" aria-label="' + X.title + '">' +
        '<div class="demo__head"><div><p class="demo__title">' + X.title + '</p><p class="demo__sub">' + X.sub + '</p></div>' +
          '<button type="button" class="demo__x" data-close aria-label="' + T.close + '">' + UI.icon('close', 20) + '</button></div>' +
        '<div class="demo__actions">' +
          '<button type="button" class="dbtn" data-demo="restart">' + UI.icon('play', 18) + X.restart + '</button>' +
          '<button type="button" class="dbtn" data-demo="notify">' + UI.icon('bell', 18) + X.notify + '</button>' +
          '<button type="button" class="dbtn" data-demo="reset">' + UI.icon('refresh', 18) + X.reset + '</button>' +
        '</div>' +
        '<p class="demo__label">' + X.jump + '</p>' +
        '<div class="demo__grid">' + ids.map(id => '<button type="button" class="dlink" data-jump="' + id + '">' + T.screens[id] + '</button>').join('') + '</div>' +
        '<p class="demo__foot">' + X.foot + '</p>' +
      '</div>';
    d.addEventListener('click', e => {
      if (e.target.closest('[data-close]')) { toggleDemo(false); return; }
      const j = e.target.closest('[data-jump]');
      if (j) { toggleDemo(false); jumpTo(j.dataset.jump); return; }
      const a = e.target.closest('[data-demo]');
      if (!a) return;
      toggleDemo(false);
      if (a.dataset.demo === 'reset') reset();
      if (a.dataset.demo === 'restart') tourStart();
      if (a.dataset.demo === 'notify') {
        setTimeout(() => {
          if (!current || current.id !== 'today') { App.state.onboarded = true; go('today', null, { force: true }); }
          setTimeout(() => agentNotification(), 500);
        }, 300);
      }
    });
  }
  function toggleDemo(force) {
    demoOpen = typeof force === 'boolean' ? force : !demoOpen;
    const d = document.getElementById('demo');
    d.classList.toggle('is-on', demoOpen);
    d.setAttribute('aria-hidden', demoOpen ? 'false' : 'true');
    if (demoOpen) { const first = d.querySelector('.dbtn'); if (first) first.focus(); }
  }

  function reset() {
    App.state = defaults();
    save();
    stack = [];
    App.lastTab = 'today';
    if (tour.mode === 'tour' || tour.mode === 'done') { tourStart(); }
    else go('splash', null, { force: true, reset: true, dir: 'fade' });
    Anim.toast(T.demo.resetToast);
  }

  /* Scale the phone to fit short laptop screens. */
  function fit() {
    const desktop = window.innerWidth >= 900;
    const s = desktop ? Math.max(0.55, Math.min(1, (window.innerHeight - 40) / 868)) : 1;
    document.documentElement.style.setProperty('--s', s);
    App.scale = s;
  }

  function onKey(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const tag = ((e.target && e.target.tagName) || '').toLowerCase();
    if (e.key === 'd' || e.key === 'D') {
      if (tag === 'textarea' || (tag === 'input' && e.target.type === 'text')) return;
      toggleDemo();
      return;
    }
    if (e.key === 'Escape') {
      if (demoOpen) toggleDemo(false);
      else if (App._sheetClose) App._sheetClose();
      return;
    }
    if (demoOpen || !current || !current.el.story) return;
    if (e.key === 'ArrowRight' || (e.key === ' ' && tag !== 'button' && tag !== 'input')) {
      e.preventDefault(); current.el.story.next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault(); current.el.story.prev();
    }
  }

  const App = window.App = {
    state: load(),
    scale: 1,
    lastTab: 'today',
    _sheetClose: null,
    go, back, save, sheet, on, emit, reset,
    current: () => current,
    tour: { start: tourStart, finish: tourFinish, isOn: () => tour.mode === 'tour' }
  };

  function init() {
    fit();
    window.addEventListener('resize', fit);
    document.getElementById('clock').textContent = D.today.clock;
    buildTabbar();
    buildDemo();
    renderWelcome();
    renderGuide();
    document.addEventListener('click', onTourClick);
    document.addEventListener('keydown', onKey);
    go('splash', null, { dir: 'fade' });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
