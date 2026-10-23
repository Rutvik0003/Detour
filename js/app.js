/* Detour prototype · router, state, transitions, tab bar, side panel, demo menu. */
(function () {
  'use strict';
  const D = window.DETOUR_DATA;
  const UI = window.UI;
  const STORE_KEY = 'detour-prototype-v1';

  /* Every screen, in flow order. `tab` = owns a tab; `tabbar` = shows the bar under the last tab. */
  const SCREENS = [
    { id: 'splash', label: 'Splash', group: 'Onboarding' },
    { id: 'quiz', label: 'Nostalgia quiz', group: 'Onboarding' },
    { id: 'recap2026', label: 'Your 2026 self', group: 'Onboarding', story: true, theme: 'sand' },
    { id: 'link', label: 'Link agent history', group: 'Onboarding' },
    { id: 'skills', label: 'Skills to keep', group: 'Onboarding' },
    { id: 'today', label: 'Today', group: 'App', tab: 'today' },
    { id: 'map', label: 'Taste Map', group: 'App', tab: 'map' },
    { id: 'tsn', label: 'Try something new', group: 'App', tabbar: true },
    { id: 'diy', label: 'Do it yourself', group: 'App', tab: 'diy' },
    { id: 'recaps', label: 'Recaps', group: 'App', tab: 'recaps', hideJump: true },
    { id: 'monthly', label: 'Monthly recap', group: 'App', story: true },
    { id: 'wrapped', label: 'Wrapped 2040', group: 'App', story: true, theme: 'dark' },
    { id: 'profile', label: 'Profile & privacy', group: 'App', tab: 'profile' }
  ];
  const META = {};
  SCREENS.forEach((m, i) => { m.order = i; META[m.id] = m; });
  const JUMPS = SCREENS.filter(m => !m.hideJump);

  const TABS = [
    { id: 'today', label: 'Today', icon: 'sun' },
    { id: 'map', label: 'Taste Map', icon: 'map' },
    { id: 'diy', label: 'Do It Yourself', icon: 'hand' },
    { id: 'recaps', label: 'Recaps', icon: 'book' },
    { id: 'profile', label: 'Profile', icon: 'user' }
  ];
  const TAB_INDEX = {};
  TABS.forEach((t, i) => { TAB_INDEX[t.id] = i; });

  /* ---------- state ---------- */
  function defaults() {
    return {
      onboarded: false,
      // Pre-filled so jumping straight to the 2026 recap still reads well.
      quiz: { music: true, corndog: false, linen: true, park: true, cafe: true, seafood: true },
      categories: { food: true, music: true, clothes: true, places: true, travel: true },
      skills: ['cooking', 'trip'],
      stamps: D.numbers.stampsStart,
      mealsMonth: D.numbers.mealsMonthStart,
      diy: 'idle',
      diySteps: {},
      morningMode: 'diy',
      morningSkipped: false,
      tsn: {},
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
    document.getElementById('phoneScreen').dataset.theme = meta.theme || 'light';
    const bar = document.getElementById('tabbar');
    const showBar = !!(meta.tab || meta.tabbar);
    bar.classList.toggle('is-hidden', !showBar);
    bar.setAttribute('aria-hidden', showBar ? 'false' : 'true');
    const activeTab = meta.tab || (meta.tabbar ? App.lastTab : null);
    bar.querySelectorAll('.tab').forEach(t => {
      const on = t.dataset.tab === activeTab;
      t.classList.toggle('is-active', on);
      if (on) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
      t.tabIndex = showBar ? 0 : -1;
    });
    document.querySelectorAll('[data-jump]').forEach(b => b.classList.toggle('is-active', b.dataset.jump === meta.id));
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

  /* ---------- chrome: tab bar, panel, demo ---------- */
  function buildTabbar() {
    const bar = document.getElementById('tabbar');
    bar.innerHTML = TABS.map(t =>
      '<button class="tab" type="button" data-tab="' + t.id + '">' + UI.icon(t.icon, 24) + '<span>' + t.label + '</span></button>'
    ).join('');
    bar.addEventListener('click', e => {
      const b = e.target.closest('[data-tab]');
      if (b) go(b.dataset.tab);
    });
  }

  function jumpTo(id) { go(id, null, { force: true, reset: true, dir: 'fade' }); }

  function buildPanel() {
    const p = document.getElementById('panel');
    let lastGroup = '';
    const links = JUMPS.map((m, i) => {
      let out = '';
      if (m.group !== lastGroup) { out += '<p class="panel__group">' + m.group + '</p>'; lastGroup = m.group; }
      return out + '<button class="panel__link" type="button" data-jump="' + m.id + '"><span class="num">' +
        String(i + 1).padStart(2, '0') + '</span>' + m.label + '</button>';
    }).join('');
    p.innerHTML =
      '<div class="panel__brand">' + UI.wordmark(44) + '</div>' +
      '<p class="panel__tag">Your agent takes the fastest route. Detour shows you the scenic one.</p>' +
      '<div class="panel__div">' + UI.dottedPath('divider') + '</div>' +
      '<p class="panel__label">Jump to</p>' +
      '<nav class="panel__nav">' + links + '</nav>' +
      '<p class="panel__foot">A concept for 2040. Press <kbd>D</kbd> or open the <button type="button" class="linkbtn" data-demo-open>demo menu</button>.</p>';
    p.addEventListener('click', e => {
      const j = e.target.closest('[data-jump]');
      if (j) jumpTo(j.dataset.jump);
      if (e.target.closest('[data-demo-open]')) toggleDemo(true);
    });
  }

  let demoOpen = false;
  function buildDemo() {
    const d = document.getElementById('demo');
    d.innerHTML =
      '<div class="demo__scrim" data-close></div>' +
      '<div class="demo__card" role="dialog" aria-modal="true" aria-label="Demo menu">' +
        '<div class="demo__head"><div><p class="demo__title">Demo menu</p><p class="demo__sub">For walkthroughs and recordings</p></div>' +
          '<button type="button" class="demo__x" data-close aria-label="Close">' + UI.icon('close', 20) + '</button></div>' +
        '<div class="demo__actions">' +
          '<button type="button" class="dbtn" data-demo="reset">' + UI.icon('refresh', 18) + 'Reset the demo</button>' +
          '<button type="button" class="dbtn" data-demo="notify">' + UI.icon('bell', 18) + 'Show morning notification</button>' +
        '</div>' +
        '<p class="demo__label">Today\'s morning card</p>' +
        '<div class="seg" data-modes><button type="button" data-mode="diy">Do it yourself</button><button type="button" data-mode="tsn">Try something new</button></div>' +
        '<p class="demo__label">Jump to</p>' +
        '<div class="demo__grid">' + JUMPS.map(m => '<button type="button" class="dlink" data-jump="' + m.id + '">' + m.label + '</button>').join('') + '</div>' +
        '<p class="demo__foot">Press <kbd>D</kbd> to open or close. <kbd>Esc</kbd> also closes.</p>' +
      '</div>';
    d.addEventListener('click', e => {
      if (e.target.closest('[data-close]')) { toggleDemo(false); return; }
      const j = e.target.closest('[data-jump]');
      if (j) { toggleDemo(false); jumpTo(j.dataset.jump); return; }
      const m = e.target.closest('[data-mode]');
      if (m) {
        App.state.morningMode = m.dataset.mode;
        App.state.morningSkipped = false;
        save();
        paintModes();
        Anim.toast(m.dataset.mode === 'diy' ? 'Morning card: Do it yourself' : 'Morning card: Try something new');
        if (current && current.id === 'today') go('today', null, { force: true, dir: 'fade' });
        return;
      }
      const a = e.target.closest('[data-demo]');
      if (!a) return;
      toggleDemo(false);
      if (a.dataset.demo === 'reset') reset();
      if (a.dataset.demo === 'notify') setTimeout(morningNotification, 350);
    });
    paintModes();
  }
  function paintModes() {
    document.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('is-active', b.dataset.mode === App.state.morningMode));
  }
  function toggleDemo(force) {
    demoOpen = typeof force === 'boolean' ? force : !demoOpen;
    const d = document.getElementById('demo');
    d.classList.toggle('is-on', demoOpen);
    d.setAttribute('aria-hidden', demoOpen ? 'false' : 'true');
    if (demoOpen) { paintModes(); const first = d.querySelector('.dbtn'); if (first) first.focus(); }
  }

  function morningNotification() {
    const mode = App.state.morningMode;
    const n = D.notify[mode];
    Anim.notify({
      title: n.title,
      body: n.body,
      iconHTML: UI.appIcon(),
      onTap: () => go(mode === 'diy' ? 'diy' : 'tsn', null, { force: true })
    });
  }

  function reset() {
    App.state = defaults();
    save();
    stack = [];
    App.lastTab = 'today';
    paintModes();
    go('splash', null, { force: true, reset: true, dir: 'fade' });
    Anim.toast('Demo reset');
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
    current: () => current
  };

  function init() {
    fit();
    window.addEventListener('resize', fit);
    document.getElementById('clock').textContent = D.today.clock;
    buildTabbar();
    buildPanel();
    buildDemo();
    document.addEventListener('keydown', onKey);
    go('splash', null, { dir: 'fade' });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
