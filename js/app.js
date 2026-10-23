/* Detour prototype · router, state, tab bar, the day simulator, the phone banner, and Reset demo. */
(function () {
  'use strict';
  const D = window.DETOUR_DATA;
  const T = D.text;
  const UI = window.UI;
  const M = window.Model;
  const STORE_KEY = 'detour-prototype-v4';

  /* Every screen. ob = setup; tab = owns a tab; tabbar = shows the bar under the last tab. */
  const SCREENS = [
    { id: 'welcome', ob: 1 }, { id: 'account', ob: 1 }, { id: 'quiz', ob: 1 },
    { id: 'at18', story: true, theme: 'sand' }, { id: 'connect', ob: 1 }, { id: 'find', tabbar: true },
    { id: 'today', tab: 'today' }, { id: 'friends', tab: 'friends' }, { id: 'map', tab: 'map' }, { id: 'diy', tab: 'diy' }, { id: 'me', tab: 'me' },
    { id: 'day', tabbar: true }, { id: 'ideas', tabbar: true }, { id: 'requests', tabbar: true }, { id: 'sent', tabbar: true },
    { id: 'post', tabbar: true }, { id: 'friend', tabbar: true }, { id: 'recaps', tabbar: true }, { id: 'shared', tabbar: true },
    { id: 'notifs', tabbar: true }, { id: 'skills', tabbar: true },
    { id: 'monthly', story: true }, { id: 'wrapped', story: true, theme: 'dark' }
  ];
  const META = {};
  SCREENS.forEach((m, i) => { m.order = i; META[m.id] = m; });
  const TABS = [
    { id: 'today', icon: 'sun' }, { id: 'friends', icon: 'people' }, { id: 'map', icon: 'map' },
    { id: 'diy', icon: 'hand' }, { id: 'me', icon: 'user' }
  ];
  const TAB_INDEX = {};
  TABS.forEach((t, i) => { TAB_INDEX[t.id] = i; });

  /* ---------- state (photos picked from the device are never saved) ---------- */
  function load() {
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && saved.v === 4) return Object.assign(M.defaults(), saved);
      }
    } catch (e) { /* storage unavailable: run from memory */ }
    return M.defaults();
  }
  function save() {
    try {
      const copy = Object.assign({}, App.state, { posts: App.state.posts.filter(p => !p.temp) });
      window.localStorage.setItem(STORE_KEY, JSON.stringify(copy));
    } catch (e) { /* ignore */ }
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

    const prev = current;
    if (opts.reset || meta.tab) stack = [];
    else if (prev && !opts.noPush) stack.push({ id: prev.id, params: prev.params });

    const dir = opts.dir || autoDir(prev && prev.id, id);
    const enters = [], leaves = [];
    const ctx = { params: params || {}, onEnter: fn => enters.push(fn), onLeave: fn => leaves.push(fn) };
    const el = window.Screens[id](ctx);
    el.classList.add('screen');
    el.dataset.screen = id;
    const bar = !!((meta.tab || meta.tabbar) && !ctx.params.setup);
    if (bar) el.classList.add('has-tabbar');
    wire(el);

    if (prev) prev.leaves.forEach(fn => { try { fn(); } catch (e) { /* ignore */ } });
    current = { id, params: ctx.params, el, leaves, bar };
    if (meta.tab) App.lastTab = meta.tab;

    transition(el, prev && prev.el, dir);
    setChrome();
    requestAnimationFrame(() => enters.forEach(fn => fn()));
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
    phone().classList.toggle('has-simbar', !!current.bar);
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
    hideBanner(true);
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
     The phone banner: the agent decided something. Detour adds its line, or stays quiet.
     ========================================================= */
  const sim = { playing: false, timer: 0, waiting: null };

  function showBanner(e) {
    const B = T.banner;
    const n = document.getElementById('notif');
    let html;
    const cont = '<button type="button" class="bn__cont" data-bn="cont">' + B.cont + UI.icon('chevron', 14) + '</button>';
    if (e.id === 'remember') {
      const r = M.rememberById(e.rid);
      const y = M.year18() + r.off;
      html = '<div class="bn bn--detour bn--remember"><div class="bn__row">' + UI.detourTag() + '<span class="bn__time">' + B.remember + '</span>' + cont + '</div>' +
        '<div class="bn__mem">' + UI.polaroid({ id: r.id, art: r.art }, { caption: String(y), tilt: -4 }) +
        '<div><p class="bn__strong">' + UI.fill(r.title, { y: y }) + '</p><p class="bn__text">' + r.line + '</p></div></div>' +
        '<div class="bn__btns"><button type="button" class="btn btn--primary btn--sm" data-bn="ryes">' + r.cta + '</button>' +
        '<button type="button" class="btn btn--quiet btn--sm" data-bn="rno">' + T.today.skillNo + '</button></div></div>';
    } else {
      const dec = M.decision(e.id);
      const agentText = /[.!?]$/.test(dec.agent) ? dec.agent : dec.agent + '.';
      const agent = '<div class="bn bn--agent"><span class="bn__icon">' + UI.icon('chip', 20) + '</span>' +
        '<div class="bn__main"><p class="bn__head"><b>' + T.agent + '</b><span>' + M.fmtTime(e.time) + '</span></p><p class="bn__text">' + agentText + '</p></div>' + cont + '</div>';
      let detour;
      if (e.status === 'offer') {
        detour = '<button type="button" class="bn bn--detour bn--tap" data-bn="options">' + UI.detourTag() + '<p class="bn__strong">' + dec.detour + '</p><span class="bn__cta">' + B.offer + UI.icon('chevron', 14) + '</span></button>';
      } else if (e.status === 'skill') {
        detour = '<div class="bn bn--detour">' + UI.detourTag() + '<p class="bn__strong">' + dec.ask + '</p>' +
          '<div class="bn__btns"><button type="button" class="btn btn--primary btn--sm" data-bn="self">' + T.today.skillYes + '</button>' +
          '<button type="button" class="btn btn--quiet btn--sm" data-bn="no">' + T.today.skillNo + '</button></div></div>';
      } else if (e.status === 'quietLimit' || e.status === 'quietHours') {
        detour = '<div class="bn bn--quiet">' + UI.detourTag() + '<p class="bn__text">' + B[e.status] + '</p></div>';
      } else {
        detour = '<div class="bn bn--quiet"><p class="bn__text">' + (B[dec.reason] || B.none) + '</p></div>';
      }
      html = agent + detour;
    }
    n.innerHTML = html;
    n.setAttribute('aria-hidden', 'false');
    sim.waiting = e.id;
    Anim.replayClass(n, 'is-on');
    renderSim();
  }

  function hideBanner(keepWaiting) {
    const n = document.getElementById('notif');
    n.classList.remove('is-on');
    n.setAttribute('aria-hidden', 'true');
    if (!keepWaiting) sim.waiting = null;
  }

  function onBannerClick(e) {
    const b = e.target.closest('[data-bn]');
    if (!b) return;
    const id = sim.waiting;
    const a = b.dataset.bn;
    if (a === 'cont') { hideBanner(); simPlay(); return; }
    if (!id) return;
    if (a === 'options') { UI.openOptions(id); return; }
    if (a === 'self' || a === 'no') { hideBanner(true); UI.resolveSkill(id, a === 'self'); return; }
    if (a === 'ryes' || a === 'rno') { hideBanner(true); UI.resolveRemember(id, a === 'ryes'); }
  }

  /* =========================================================
     Day simulator: Play runs the day and stops at every agent decision
     ========================================================= */
  function newRun() {
    const s = App.state;
    s.day = M.newDay((s.day ? s.day.run : 0) + 1);
    save();
    emit('day'); emit('clock');
  }

  function simTick() {
    const d = App.state.day;
    const next = Math.min(D.day.end, d.clock + 5);
    const item = M.nextItem(next);
    if (item) {
      d.clock = Math.max(d.clock, item.time);
      M.expire(d.clock);
      const e = M.fire(item, false);
      save();
      emit('day'); emit('clock');
      if (e) { simPause(); showBanner(e); }
      return;
    }
    const before = d.log.map(x => x.status).join();
    d.clock = next;
    M.expire(d.clock);
    if (d.log.map(x => x.status).join() !== before) emit('day');
    emit('clock');
    if (d.clock >= D.day.end) { simPause(); Anim.toast(T.sim.over); }
  }

  function simPlay() {
    if (App.state.day.clock >= D.day.end) newRun();
    hideBanner();
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

  /* Jump to a moment of the day and stop at its decision. */
  function simJump(mid) {
    const m = D.moments.find(x => x.id === mid);
    if (!m) return;
    simPause();
    hideBanner();
    if (m.screen) { go(m.screen, mid === 'sunday' ? { sunday: true } : null, { force: true, reset: true }); return; }
    const find = () => App.state.day.plan.find(p => p.id !== 'remember' && M.decision(p.id).slot === m.slot);
    let item = find();
    if (App.state.day.clock > item.time || M.logEntry(item.id)) { newRun(); item = find(); }
    M.fastForward(item.time);
    const e = M.fire(item, false);
    save();
    if (!current || current.id !== 'today') go('today', null, { force: true, reset: true });
    emit('day'); emit('clock');
    if (e) setTimeout(() => showBanner(e), 450);
  }

  function renderClock() {
    document.getElementById('clock').textContent = M.clockShort(App.state.day.clock);
  }

  function simHTML(compact) {
    const chips = D.moments.map(m => '<button type="button" class="simchip" data-moment="' + m.id + '">' + m.label + '</button>').join('');
    if (compact) {
      return '<button type="button" class="simbar__play" data-sim="toggle"></button><span class="simbar__clock" data-sim-clock></span><div class="simbar__chips">' + chips + '</div>';
    }
    return '<section class="simbox"><p class="simbox__title">' + T.sim.title + '</p>' +
      '<div class="simbox__row"><button type="button" class="btn btn--ink btn--sm" data-sim="toggle"></button>' +
        '<span class="simbox__clock" data-sim-clock></span><span class="simbox__run" data-sim-run></span></div>' +
      '<div class="simbox__chips">' + chips + '</div><p class="simbox__note" data-sim-note></p></section>';
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
    document.querySelectorAll('[data-sim-run]').forEach(n => { n.textContent = UI.fill(X.run, { n: s.day.run }); });
    document.querySelectorAll('[data-sim-note]').forEach(n => {
      n.textContent = sim.waiting ? X.waiting : over ? X.over : UI.fill(X.note, { n: s.day.sent, max: s.notif.limit });
    });
  }

  function onSimClick(e) {
    const t = e.target.closest('[data-sim="toggle"]');
    if (t) { if (sim.playing) simPause(); else simPlay(); return true; }
    const m = e.target.closest('[data-moment]');
    if (m) { simJump(m.dataset.moment); return true; }
    return false;
  }

  /* ---------- side panel, phone chip row, Reset demo ---------- */
  function renderPanel() {
    document.getElementById('panel').innerHTML =
      '<div class="panel__brand">' + UI.wordmark(44) + '</div>' +
      '<p class="panel__tag">' + T.tagline + '</p>' +
      '<div class="panel__div">' + UI.dottedPath('divider') + '</div>' +
      simHTML(false);
    document.getElementById('simbar').innerHTML = simHTML(true);
    renderSim();
  }

  function buildReset() {
    const R = T.reset;
    const btn = document.getElementById('resetBtn');
    const pop = document.getElementById('resetPop');
    btn.innerHTML = UI.icon('refresh', 16) + R.btn;
    pop.innerHTML = '<p class="resetpop__t">' + R.title + '</p><p class="resetpop__s">' + R.sub + '</p>' +
      '<div class="resetpop__btns"><button type="button" class="btn btn--primary btn--sm" data-reset="yes">' + R.yes + '</button>' +
      '<button type="button" class="btn btn--quiet btn--sm" data-reset="no">' + R.no + '</button></div>';
    const toggle = on => { pop.hidden = !on; btn.setAttribute('aria-expanded', on ? 'true' : 'false'); if (on) pop.querySelector('[data-reset="yes"]').focus(); };
    btn.addEventListener('click', () => toggle(pop.hidden));
    pop.addEventListener('click', e => {
      const b = e.target.closest('[data-reset]');
      if (!b) return;
      toggle(false);
      if (b.dataset.reset === 'yes') resetDemo();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !pop.hidden) toggle(false); });
  }

  function resetDemo() {
    simPause();
    hideBanner();
    try { window.localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
    App.state = M.defaults();
    M.finishDefaults();
    save();
    stack = [];
    App.lastTab = 'today';
    renderSim();
    go('welcome', null, { force: true, reset: true, dir: 'fade' });
    Anim.toast(T.reset.done);
  }

  /* ---------- tab bar ---------- */
  function buildTabbar() {
    const bar = document.getElementById('tabbar');
    bar.innerHTML = TABS.map(t => '<button class="tab" type="button" data-tab="' + t.id + '">' + UI.icon(t.icon, 24) + '<span>' + T.tabs[t.id] + '</span></button>').join('');
    bar.addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) go(b.dataset.tab); });
  }

  /* Scale the phone to fit short laptop screens. */
  function fit() {
    const desktop = window.innerWidth >= 900;
    const s = desktop ? Math.max(0.55, Math.min(1, (window.innerHeight - 40) / 868)) : 1;
    document.documentElement.style.setProperty('--s', s);
    App.scale = s;
  }

  function onKey(e) {
    const t = e.target || {};
    const tag = (t.tagName || '').toLowerCase();
    const typing = tag === 'textarea' || tag === 'select' || (tag === 'input' && ['checkbox', 'radio', 'range'].indexOf(t.type) < 0);
    if (e.key === 'Escape' && App._sheetClose) { App._sheetClose(); return; }
    if (typing || !current || !current.el.story) return;
    if (e.key === 'ArrowRight' || (e.key === ' ' && tag !== 'button')) { e.preventDefault(); current.el.story.next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); current.el.story.prev(); }
  }

  const App = window.App = {
    state: load(),
    scale: 1,
    lastTab: 'today',
    _sheetClose: null,
    go, back, save, sheet, on, emit,
    current: () => current
  };

  function init() {
    M.finishDefaults();
    save();
    fit();
    window.addEventListener('resize', fit);
    buildTabbar();
    buildReset();
    renderPanel();
    document.getElementById('notif').addEventListener('click', onBannerClick);
    document.addEventListener('click', e => { onSimClick(e); });
    document.addEventListener('keydown', onKey);
    on('clock', () => { renderClock(); renderSim(); });
    on('day', renderSim);
    on('resolved', () => { if (sim.waiting) { hideBanner(); setTimeout(simPlay, 700); } });
    go('today', null, { dir: 'fade' });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
