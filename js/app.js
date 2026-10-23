/* Detour prototype · router, state, tab bar, day simulator, guided tour, side panel, demo menu. */
(function () {
  'use strict';
  const D = window.DETOUR_DATA;
  const T = D.text;
  const UI = window.UI;
  const M = window.Model;
  const STORE_KEY = 'detour-prototype-v3';
  const STEPS = D.tour;

  /* Every screen. ob = onboarding; tab = owns a tab; tabbar = shows the bar under the last tab. */
  const SCREENS = [
    { id: 'welcome', ob: 1 }, { id: 'phone', ob: 1 }, { id: 'code', ob: 1 }, { id: 'about', ob: 1 }, { id: 'quiz', ob: 1 },
    { id: 'recap2026', story: true, theme: 'sand' },
    { id: 'agent', ob: 1 }, { id: 'consent', ob: 1 }, { id: 'categories', ob: 1 }, { id: 'skills', ob: 1 },
    { id: 'friendsAdd', ob: 1 }, { id: 'friendsPrivacy', ob: 1 }, { id: 'notifs', ob: 1 }, { id: 'done', ob: 1 },
    { id: 'today', tab: 'today' }, { id: 'friends', tab: 'friends' }, { id: 'map', tab: 'map' }, { id: 'diy', tab: 'diy' }, { id: 'me', tab: 'me' },
    { id: 'day', tabbar: true }, { id: 'ideas', tabbar: true }, { id: 'friend', tabbar: true }, { id: 'sent', tabbar: true },
    { id: 'swap', tabbar: true }, { id: 'recaps', tabbar: true }, { id: 'shared', tabbar: true },
    { id: 'monthly', story: true }, { id: 'wrapped', story: true, theme: 'dark' }
  ];
  const META = {};
  SCREENS.forEach((m, i) => { m.order = i; META[m.id] = m; });
  const JUMPS = ['welcome', 'quiz', 'recap2026', 'agent', 'friendsAdd', 'today', 'day', 'friends', 'diy', 'map', 'monthly', 'wrapped', 'me'];

  const TABS = [
    { id: 'today', icon: 'sun' }, { id: 'friends', icon: 'people' }, { id: 'map', icon: 'map' },
    { id: 'diy', icon: 'hand' }, { id: 'me', icon: 'user' }
  ];
  const TAB_INDEX = {};
  TABS.forEach((t, i) => { TAB_INDEX[t.id] = i; });

  /* ---------- state ---------- */
  function load() {
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && saved.v === 3) return Object.assign(M.defaults(false), saved);
      }
    } catch (e) { /* storage unavailable: run from memory */ }
    return M.defaults(false);
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
  const phone = () => document.getElementById('phoneScreen');

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
    const bar = !!(meta.tab || meta.tabbar || ctx.params.edit);
    if (bar) el.classList.add('has-tabbar');
    wire(el);

    if (prev) prev.leaves.forEach(fn => { try { fn(); } catch (e) { /* ignore */ } });
    current = { id, params: ctx.params, el, leaves, bar };
    if (meta.tab) App.lastTab = meta.tab;

    transition(el, prev && prev.el, dir);
    setChrome();
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

  function setChrome() {
    if (!current) return;
    const meta = META[current.id];
    phone().dataset.theme = meta.theme || 'light';
    const bar = document.getElementById('tabbar');
    bar.classList.toggle('is-hidden', !current.bar);
    bar.setAttribute('aria-hidden', current.bar ? 'false' : 'true');
    const activeTab = meta.tab || (current.bar ? App.lastTab : null);
    bar.querySelectorAll('.tab').forEach(t => {
      const isOn = t.dataset.tab === activeTab;
      t.classList.toggle('is-active', isOn);
      if (isOn) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
      t.tabIndex = current.bar ? 0 : -1;
    });
    document.querySelectorAll('[data-jump]').forEach(b => b.classList.toggle('is-active', b.dataset.jump === current.id));
    const showSim = App.state.onboarded && current.bar;
    phone().classList.toggle('has-simbar', !!showSim);
    renderClock();
  }

  /* Shared click handling for every screen. */
  function wire(el) {
    el.addEventListener('click', e => {
      const t = e.target.closest('[data-go],[data-back],[data-redeem],[data-toast]');
      if (!t || !el.contains(t)) return;
      if (t.hasAttribute('data-go')) {
        let params = null;
        if (t.dataset.params) { try { params = JSON.parse(t.dataset.params); } catch (err) { params = null; } }
        go(t.dataset.go, params);
      } else if (t.hasAttribute('data-back')) back(t.dataset.back || 'today');
      else if (t.hasAttribute('data-redeem')) UI.openRedeem();
      else if (t.hasAttribute('data-toast')) Anim.toast(t.dataset.toast);
    });
  }

  /* ---------- bottom sheet ---------- */
  function sheet(content) {
    clearSpot();
    Anim.hideNotif();
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

  /* =========================================================
     Day simulator: the agent decides through the day; Detour reacts
     ========================================================= */
  const sim = { playing: false, timer: 0 };

  function newDay() {
    const s = App.state;
    M.resetDay();
    s.diy = 'idle';
    s.diySteps = {};
  }

  function showDecision(id) {
    const ev = M.event(id);
    Anim.notify({
      agentLabel: T.agent, when: T.notify.now, agentIcon: UI.icon('chip', 20), agent: ev.agentNow,
      detourLabel: T.detour, detourIcon: UI.appIcon(), detour: ev.detour,
      sticky: true,
      onTap: () => {
        const onToday = current && current.id === 'today';
        if (!onToday) go('today', null, { force: true, reset: true });
        setTimeout(() => UI.openOptions(id), onToday ? 0 : 420);
      }
    });
    if (tour.mode === 'tour' && STEPS[tour.step].moment === 'lunch') scheduleSpot(900);
  }

  function afterFire(entry) {
    if (!entry) return;
    if (entry.status === 'notified') { simPause(); showDecision(entry.id); renderSim(); }
    else if (entry.status === 'diyOpen') simPause();
  }

  function simTick() {
    const s = App.state, d = s.day;
    const next = Math.min(D.day.end, d.clock + 5);
    const ev = D.day.events.find(e => e.time <= next && !M.logEntry(e.id));
    const before = JSON.stringify(d.log.map(e => e.status));
    if (ev) {
      d.clock = Math.max(d.clock, ev.time);
      M.expire(d.clock);
      const entry = M.fire(ev, false);
      save();
      emit('day'); emit('clock');
      afterFire(entry);
      return;
    }
    d.clock = next;
    M.expire(d.clock);
    if (JSON.stringify(d.log.map(e => e.status)) !== before) emit('day');
    emit('clock');
    if (d.clock >= D.day.end) { simPause(); Anim.toast(T.sim.over); }
  }

  function simPlay() {
    const s = App.state;
    if (!s.onboarded) { Anim.toast(T.sim.needSetup); return; }
    if (s.day.clock >= D.day.end) newDay();
    Anim.hideNotif();
    if (App._sheetClose) App._sheetClose();
    if (!current || current.id !== 'today') go('today', null, { force: true, reset: true });
    sim.playing = true;
    clearInterval(sim.timer);
    sim.timer = setInterval(simTick, 110);
    renderSim();
  }
  function simPause() {
    sim.playing = false;
    clearInterval(sim.timer);
    save();
    renderSim();
  }

  /* Jump to a moment of the day and fire its event. */
  function simJump(mid) {
    const m = D.day.moments.find(x => x.id === mid);
    if (!m) return;
    const s = App.state;
    simPause();
    Anim.hideNotif();
    if (!s.onboarded) M.ensureReady();
    if (m.screen) {
      go(m.screen, mid === 'sunday' ? { sunday: true } : null, { force: true, reset: true });
      save();
      return;
    }
    let ev = M.event(m.event);
    if (ev.repeat && !s.categories[ev.cat]) {
      ev = D.day.events.find(e => e.repeat && e.time >= ev.time && s.categories[e.cat]) || D.day.events.find(e => e.repeat && s.categories[e.cat]) || ev;
    }
    if (s.day.clock > ev.time || M.logEntry(ev.id)) newDay();
    M.fastForward(ev.time);
    const entry = M.fire(ev, false);
    save();
    if (!current || current.id !== 'today') go('today', null, { force: true, reset: true });
    emit('day'); emit('clock');
    if (entry && entry.status === 'notified') setTimeout(() => showDecision(entry.id), 650);
  }

  function renderClock() {
    const s = App.state;
    document.getElementById('clock').textContent = s.onboarded ? M.clockShort(s.day.clock) : '8:00';
  }

  function simHTML(compact) {
    const X = T.sim;
    const chips = D.day.moments.map(m => '<button type="button" class="simchip" data-moment="' + m.id + '">' + m.label + '</button>').join('');
    if (compact) {
      return '<button type="button" class="simbar__play" data-sim="toggle" aria-label="' + X.play + '"></button>' +
        '<span class="simbar__clock" data-sim-clock></span><div class="simbar__chips">' + chips + '</div>';
    }
    return '<section class="simbox">' +
      '<p class="simbox__title">' + X.title + '</p>' +
      '<div class="simbox__row"><button type="button" class="btn btn--ink btn--sm" data-sim="toggle"></button><span class="simbox__clock" data-sim-clock></span></div>' +
      '<div class="simbox__chips">' + chips + '</div>' +
      '<p class="simbox__note" data-sim-note></p>' +
    '</section>';
  }

  function renderSim() {
    const s = App.state;
    const X = T.sim;
    const over = s.day.clock >= D.day.end;
    document.querySelectorAll('[data-sim="toggle"]').forEach(b => {
      const compact = b.classList.contains('simbar__play');
      const label = sim.playing ? X.pause : over ? X.again : X.play;
      b.innerHTML = UI.icon(sim.playing ? 'pause' : 'play', compact ? 18 : 16) + (compact ? '' : label);
      b.setAttribute('aria-label', label);
    });
    document.querySelectorAll('[data-sim-clock]').forEach(n => { n.textContent = M.fmtTime(s.day.clock); });
    document.querySelectorAll('[data-sim-note]').forEach(n => {
      const paused = !sim.playing && document.getElementById('notif').classList.contains('is-on');
      n.textContent = paused ? X.paused : over ? X.over : UI.fill(X.note, { n: s.day.sent, max: s.notif.limit });
    });
  }

  function onSimClick(e) {
    const t = e.target.closest('[data-sim="toggle"]');
    if (t) { if (sim.playing) simPause(); else simPlay(); return true; }
    const m = e.target.closest('[data-moment]');
    if (m) { simJump(m.dataset.moment); return true; }
    return false;
  }

  /* =========================================================
     Guided tour (11 steps around a day)
     ========================================================= */
  const tour = { mode: 'welcome', step: 0 };   // welcome | tour | done | explore
  let spotOff = null, spotTimer = 0, clearing = false;
  const shown = {};

  function clearSpot() {
    clearTimeout(spotTimer);
    if (spotOff) { clearing = true; spotOff(); clearing = false; spotOff = null; }
  }

  function scheduleSpot(delay) {
    clearSpot();
    if (tour.mode !== 'tour') return;
    const i = tour.step;
    if (shown[i]) return;
    const step = STEPS[i];
    spotTimer = setTimeout(() => {
      if (tour.mode !== 'tour' || tour.step !== i || App._sheetClose) return;
      const target = phone().querySelector(step.target);
      if (!target) return;
      spotOff = Anim.spotlight(target, phone(), {
        getScale: () => App.scale,
        label: T.panel.tapHere,
        onRemove: () => { if (!clearing) shown[i] = true; spotOff = null; }
      });
    }, delay == null ? 750 : delay);
  }

  const stepOfScreen = id => STEPS.findIndex(s => s.screens && s.screens.indexOf(id) > -1);

  function tourSync(id) {
    renderSim();
    if (tour.mode !== 'tour') return;
    const i = stepOfScreen(id);
    if (i > -1) { tour.step = i; renderGuide(); scheduleSpot(); return; }
    if (id === 'today' && STEPS[tour.step].screens && App.state.onboarded) {
      tour.step = STEPS.findIndex(s => s.moment);
      renderGuide();
      setTimeout(() => runMoment(tour.step), 450);
      return;
    }
    renderGuide();
  }

  function runMoment(i) {
    const step = STEPS[i];
    simJump(step.moment);
    renderGuide();
    if (step.moment !== 'lunch') scheduleSpot(1000);
  }

  function tourStart() {
    simPause();
    Anim.hideNotif();
    App.state = M.defaults(false);
    save();
    Object.keys(shown).forEach(k => delete shown[k]);
    tour.mode = 'tour';
    tour.step = 0;
    renderGuide();
    go('welcome', null, { force: true, reset: true, dir: 'fade' });
  }
  function tourGo(i) {
    i = Math.max(0, Math.min(STEPS.length - 1, i));
    const step = STEPS[i];
    clearSpot();
    tour.step = i;
    if (step.screens) {
      go(step.screens[0], null, { force: true, reset: true });
    } else {
      M.ensureReady();
      // Skipped ahead with Next? Borrow the sample friends so Sunday has something to show.
      if (!App.state.friends.length) App.state.friends = D.sampleFriends.slice();
      tour.step = i;
      runMoment(i);
    }
    renderGuide();
  }
  function tourNext() { if (tour.step >= STEPS.length - 1) tourFinish(); else tourGo(tour.step + 1); }
  function tourBack() { if (tour.step > 0) tourGo(tour.step - 1); }
  function tourFinish() {
    clearSpot();
    tour.mode = 'done';
    renderGuide();
  }
  function tourLeave() {
    clearSpot();
    tour.mode = 'explore';
    renderGuide();
  }
  /* "Explore freely": a ready-made account if you haven't set one up. */
  function explore() {
    clearSpot();
    tour.mode = 'explore';
    if (!App.state.onboarded) {
      App.state = M.defaults(true);
      save();
      go('today', null, { force: true, reset: true, dir: 'fade' });
    }
    renderGuide();
  }

  function startOver() {
    simPause();
    Anim.hideNotif();
    App.state = M.defaults(false);
    save();
    stack = [];
    if (tour.mode === 'tour' || tour.mode === 'done') tour.mode = 'explore';
    renderGuide();
    go('welcome', null, { force: true, reset: true, dir: 'fade' });
    Anim.toast(T.me.startOverToast);
  }

  /* ---------- guide UI: side panel (desktop) + slim bars and welcome card (phone width) ---------- */
  function hintFor(step) {
    const id = current && current.id;
    return (step.alts && step.alts[id]) || step.tryThis;
  }

  function jumpList() {
    return '<p class="panel__label">' + T.panel.jumpTitle + '</p><nav class="panel__nav">' +
      JUMPS.map(id => '<button class="panel__link" type="button" data-jump="' + id + '">' + T.screens[id] + '</button>').join('') + '</nav>';
  }

  function renderPanel() {
    const P = T.panel;
    const p = document.getElementById('panel');
    const s = App.state;
    let body = '';
    if (tour.mode === 'welcome') {
      body = '<div class="welcome">' +
        '<p class="welcome__t">' + P.welcomeTitle + '</p><p class="welcome__s">' + P.welcomeSub + '</p>' +
        '<div class="welcome__btns"><button type="button" class="btn btn--primary" data-tour="start">' + P.start + '</button>' +
        '<button type="button" class="btn btn--ghost" data-tour="explore">' + P.explore + '</button></div></div>';
    } else if (tour.mode === 'tour') {
      const st = STEPS[tour.step];
      const last = tour.step === STEPS.length - 1;
      body = '<div class="guide">' +
        '<p class="guide__count">' + UI.fill(P.step, { n: tour.step + 1, total: STEPS.length }) + '</p>' +
        '<div class="guide__bar"><i style="width:' + ((tour.step + 1) / STEPS.length * 100) + '%"></i></div>' +
        '<h2 class="guide__title">' + st.title + '</h2>' +
        '<p class="guide__explain">' + st.explain + '</p>' +
        '<p class="guide__try"><b>' + P.tryThis + '</b> ' + hintFor(st) + '</p>' +
        '<div class="guide__nav"><button type="button" class="btn btn--ghost btn--sm" data-tour="back"' + (tour.step === 0 ? ' disabled' : '') + '>' + UI.icon('chevronLeft', 16) + P.back + '</button>' +
        '<button type="button" class="btn btn--primary btn--sm" data-tour="next">' + (last ? P.finish : P.next) + UI.icon('chevron', 16) + '</button></div>' +
        '<ol class="guide__steps">' + STEPS.map((x, i) =>
          '<li><button type="button" data-tour="step" data-i="' + i + '" class="' + (i < tour.step ? 'is-done' : i === tour.step ? 'is-current' : '') + '"><span>' + (i < tour.step ? UI.icon('check', 12) : i + 1) + '</span>' + x.title + '</button></li>').join('') + '</ol>' +
        '<button type="button" class="linkbtn guide__leave" data-tour="leave">' + P.leave + '</button>' +
        '</div>';
    } else if (tour.mode === 'done') {
      body = '<div class="welcome welcome--done">' +
        '<p class="welcome__t">' + P.doneTitle + '</p><p class="welcome__s">' + P.doneSub + '</p>' +
        '<div class="welcome__btns"><button type="button" class="btn btn--primary" data-tour="start">' + UI.icon('refresh', 16) + P.restart + '</button></div></div>';
    } else {
      body = '<button type="button" class="btn btn--primary btn--sm panel__start" data-tour="start">' + UI.icon('play', 14) + P.start + '</button>';
    }
    const simBlock = s.onboarded && tour.mode !== 'welcome' ? simHTML(false) : '';
    const jumps = tour.mode === 'explore' || tour.mode === 'done' ? jumpList() : '';
    p.innerHTML =
      '<div class="panel__brand">' + UI.wordmark(40) + '</div>' +
      '<p class="panel__tag">' + T.tagline + '</p>' +
      body + simBlock + jumps +
      '<p class="panel__foot">' + P.foot + '</p>';
  }

  function renderBars() {
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
        '<p class="tourbar__try"><b>' + P.tryThis + '</b> ' + hintFor(s) + '</p>' +
        '<i class="tourbar__progress" style="width:' + ((tour.step + 1) / STEPS.length * 100) + '%"></i>';
    } else if (tour.mode === 'done') {
      bar.innerHTML =
        '<div class="tourbar__row"><span class="tourbar__title">' + P.doneTitle + '</span>' +
          '<button type="button" class="tourbar__btn tourbar__btn--next" data-tour="start">' + P.restart + '</button>' +
          '<button type="button" class="tourbar__btn" data-tour="leave" aria-label="' + T.close + '">' + UI.icon('close', 18) + '</button></div>' +
        '<p class="tourbar__try">' + P.doneSub + '</p>';
    } else bar.innerHTML = '';
    document.getElementById('simbar').innerHTML = App.state.onboarded ? simHTML(true) : '';
  }

  function renderWelcome() {
    const P = T.panel;
    document.getElementById('welcome').innerHTML =
      '<div class="welcome welcome--overlay">' + UI.wordmark(32) +
        '<p class="welcome__t">' + P.welcomeTitle + '</p><p class="welcome__s">' + P.welcomeSub + '</p>' +
        '<div class="welcome__btns"><button type="button" class="btn btn--primary btn--block" data-tour="start">' + P.start + '</button>' +
        '<button type="button" class="btn btn--ghost btn--block" data-tour="explore">' + P.explore + '</button></div></div>';
  }

  function renderGuide() {
    renderPanel();
    renderBars();
    document.body.classList.toggle('is-welcome', tour.mode === 'welcome');
    phone().classList.toggle('has-tourbar', tour.mode === 'tour' || tour.mode === 'done');
    setChrome();
    renderSim();
  }

  function jumpTo(id) {
    const meta = META[id];
    if (!meta.ob && id !== 'recap2026' && !App.state.onboarded) {
      M.ensureReady();
      if (!App.state.friends.length) App.state.friends = D.sampleFriends.slice();
    }
    save();
    go(id, null, { force: true, reset: true, dir: 'fade' });
    renderGuide();
  }

  function onDocClick(e) {
    if (onSimClick(e)) return;
    const b = e.target.closest('[data-tour]');
    if (b) {
      const a = b.dataset.tour;
      if (a === 'start') tourStart();
      else if (a === 'explore') explore();
      else if (a === 'leave') tourLeave();
      else if (a === 'next') tourNext();
      else if (a === 'back') tourBack();
      else if (a === 'step') tourGo(Number(b.dataset.i));
      return;
    }
    const j = e.target.closest('[data-jump]');
    if (j && !j.closest('.demo')) jumpTo(j.dataset.jump);
    if (e.target.closest('[data-demo-open]')) toggleDemo(true);
  }

  /* ---------- tab bar ---------- */
  function buildTabbar() {
    const bar = document.getElementById('tabbar');
    bar.innerHTML = TABS.map(t =>
      '<button class="tab" type="button" data-tab="' + t.id + '">' + UI.icon(t.icon, 24) + '<span>' + T.tabs[t.id] + '</span></button>').join('');
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
    d.innerHTML =
      '<div class="demo__scrim" data-close></div>' +
      '<div class="demo__card" role="dialog" aria-modal="true" aria-label="' + X.title + '">' +
        '<div class="demo__head"><div><p class="demo__title">' + X.title + '</p><p class="demo__sub">' + X.sub + '</p></div>' +
          '<button type="button" class="demo__x" data-close aria-label="' + T.close + '">' + UI.icon('close', 20) + '</button></div>' +
        '<div class="demo__actions">' +
          '<button type="button" class="dbtn" data-demo="restart">' + UI.icon('refresh', 18) + X.restart + '</button>' +
          '<button type="button" class="dbtn" data-demo="play">' + UI.icon('play', 18) + X.play + '</button>' +
          '<button type="button" class="dbtn" data-demo="over">' + UI.icon('close', 18) + X.startOver + '</button>' +
        '</div>' +
        '<p class="demo__label">' + X.jump + '</p>' +
        '<div class="demo__grid">' + JUMPS.map(id => '<button type="button" class="dlink" data-jump="' + id + '">' + T.screens[id] + '</button>').join('') + '</div>' +
        '<p class="demo__foot">' + X.foot + '</p>' +
      '</div>';
    d.addEventListener('click', e => {
      if (e.target.closest('[data-close]')) { toggleDemo(false); return; }
      const j = e.target.closest('[data-jump]');
      if (j) { toggleDemo(false); jumpTo(j.dataset.jump); return; }
      const a = e.target.closest('[data-demo]');
      if (!a) return;
      toggleDemo(false);
      if (a.dataset.demo === 'restart') tourStart();
      if (a.dataset.demo === 'over') startOver();
      if (a.dataset.demo === 'play') {
        if (!App.state.onboarded) explore();
        setTimeout(simPlay, 400);
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

  /* Scale the phone to fit short laptop screens. */
  function fit() {
    const desktop = window.innerWidth >= 900;
    const s = desktop ? Math.max(0.55, Math.min(1, (window.innerHeight - 40) / 868)) : 1;
    document.documentElement.style.setProperty('--s', s);
    App.scale = s;
  }

  function onKey(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target || {};
    const tag = (t.tagName || '').toLowerCase();
    const typing = tag === 'textarea' || (tag === 'input' && ['checkbox', 'radio', 'range'].indexOf(t.type) < 0);
    if ((e.key === 'd' || e.key === 'D') && !typing) { toggleDemo(); return; }
    if (e.key === 'Escape') {
      if (demoOpen) toggleDemo(false);
      else if (App._sheetClose) App._sheetClose();
      return;
    }
    if (demoOpen || typing || !current || !current.el.story) return;
    if (e.key === 'ArrowRight' || (e.key === ' ' && tag !== 'button')) { e.preventDefault(); current.el.story.next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); current.el.story.prev(); }
  }

  const App = window.App = {
    state: load(),
    scale: 1,
    lastTab: 'today',
    _sheetClose: null,
    go, back, save, sheet, on, emit, startOver,
    current: () => current,
    tour: { start: tourStart, finish: tourFinish, isOn: () => tour.mode === 'tour' }
  };

  function init() {
    fit();
    window.addEventListener('resize', fit);
    buildTabbar();
    buildDemo();
    renderWelcome();
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    on('clock', () => { renderClock(); renderSim(); });
    on('day', renderSim);
    go(App.state.onboarded ? 'today' : 'welcome', null, { dir: 'fade' });
    renderGuide();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
