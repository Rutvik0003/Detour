/* Detour prototype · shared UI components (window.UI) and screen renderers (window.Screens).
   Each Screens.<id>(ctx) returns one DOM element; app.js handles routing and transitions. */
(function () {
  'use strict';
  const D = window.DETOUR_DATA;
  const st = () => window.App.state;

  /* ---------- helpers ---------- */
  function h(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  const $ = (r, s) => r.querySelector(s);
  const $$ = (r, s) => Array.prototype.slice.call(r.querySelectorAll(s));
  const fmt = n => Number(n).toLocaleString('en-IN');
  const lerp = (a, b, x) => a + (b - a) * x;

  /* ---------- icons: one outline style, 24px grid ---------- */
  const ICONS = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>',
    map: '<path d="M9 4L3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4z"/><path d="M9 4v14M15 6v14"/>',
    hand: '<path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12"/><path d="M11 11.5V5a1.5 1.5 0 0 1 3 0v6.5"/><path d="M14 11.5V7a1.5 1.5 0 0 1 3 0v7.5a6.5 6.5 0 0 1-6.5 6.5h-.6a6 6 0 0 1-4.8-2.4L3 15.5a1.5 1.5 0 0 1 2.3-1.9L8 16"/>',
    book: '<path d="M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3z"/><path d="M21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    chevronLeft: '<path d="M15 6l-6 6 6 6"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    shield: '<path d="M12 3l7.5 3v6c0 4.4-3.2 8.2-7.5 9-4.3-.8-7.5-4.6-7.5-9V6z"/><path d="M9 12l2 2 4-4"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
    pin: '<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    people: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6"/>',
    shuffle: '<path d="M3 7h3c4.5 0 6.5 10 11 10h4"/><path d="M3 17h3c1.6 0 2.8-1.3 3.8-3M14.2 10c1-1.7 2.2-3 3.8-3h3"/><path d="M18 4l3 3-3 3M18 14l3 3-3 3"/>',
    spark: '<path d="M12 3c.7 4.6 2.4 6.3 7 7-4.6.7-6.3 2.4-7 7-.7-4.6-2.4-6.3-7-7 4.6-.7 6.3-2.4 7-7z"/>',
    leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19l7-7"/>',
    stamp: '<path d="M9.5 3.5h5v3.2a2 2 0 0 1-.8 1.6l-.2.2V13h4.2A2.3 2.3 0 0 1 20 15.3V17H4v-1.7A2.3 2.3 0 0 1 6.3 13h4.2V8.5l-.2-.2a2 2 0 0 1-.8-1.6z"/><path d="M5 20.5h14"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    bowl: '<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8 7.5c0-1.4 1.3-1.5 1.3-3M13 7.5c0-1.4 1.3-1.5 1.3-3"/>',
    music: '<path d="M9 18V5.5l11-2V16"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    shirt: '<path d="M8.5 3.5L3.5 6.5l2 4.5 2.5-1v10.5h8V10l2.5 1 2-4.5-5-3c-.3 1.6-1.7 2.8-3.5 2.8S8.8 5.1 8.5 3.5z"/>',
    bag: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8.5 7V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2M3 12.5h18"/>',
    share: '<path d="M12 15V3.5M7.5 8L12 3.5 16.5 8"/><path d="M5 13v5.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V13"/>',
    play: '<path d="M7 5v14l11-7z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    route: '<circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="6" r="2.2"/><path d="M8.2 18H14a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h5.8"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v4.5h-4.5"/>',
    star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.2"/>',
    pot: '<path d="M4 11h16v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M2 11h2M20 11h2M9 7.5c0-1.2 1-1.4 1-2.7M14 7.5c0-1.2 1-1.4 1-2.7"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>'
  };
  function icon(name, size, cls) {
    size = size || 24;
    return '<svg class="icon ' + (cls || '') + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }

  /* ---------- wordmark: the ONE place the logo is defined.
     To use a real logo later, return an <img class="wordmark" src="img/logo.svg" alt="detour"> here. ---------- */
  function wordmark(size) {
    return '<span class="wordmark" style="font-size:' + (size || 28) + 'px" role="img" aria-label="detour">detour</span>';
  }
  function appIcon() {
    return '<svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true"><path d="M8 30c6 0 6-9 12-9s4 8 9 4 2-12 6-15" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-dasharray="0.1 5.5"/><circle cx="35" cy="10" r="2.6" fill="#fff"/></svg>';
  }

  /* ---------- signature motif: hand-drawn dotted path ---------- */
  const PATHS = {
    splash: { w: 320, h: 220, d: 'M22 188 C 64 192 88 154 126 152 C 172 150 196 196 162 202 C 124 208 124 132 172 110 C 216 90 236 140 264 110 C 286 86 280 54 300 34' },
    divider: { w: 320, h: 40, d: 'M8 24 C 48 6 74 38 112 25 C 146 13 154 33 184 29 C 214 25 222 9 252 16 C 280 23 292 31 312 17' },
    wrapped: { w: 390, h: 844, d: 'M-20 790 C 70 760 40 680 130 660 C 230 638 320 700 350 610 C 382 520 250 500 200 450 C 150 400 50 430 46 340 C 42 250 170 262 236 226 C 300 192 336 150 304 96 C 284 62 240 60 214 30' },
    mini: { w: 120, h: 60, d: 'M8 48 C 30 50 34 22 56 26 C 76 30 70 50 88 42 C 104 34 100 16 114 10' }
  };
  let uid = 0;
  function dottedPath(name, o) {
    o = o || {};
    const p = PATHS[name];
    const id = 'dp' + (++uid);
    const color = o.color || 'var(--coral)';
    const sw = o.width || 3;
    const gap = o.gap || 9;
    const par = o.par || 'xMidYMid meet';
    const dots = '<path class="dpath__dots" d="' + p.d + '" fill="none" stroke="' + color + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-dasharray="0.1 ' + gap + '"' + (o.draw ? ' mask="url(#' + id + ')"' : '') + '/>';
    const mask = o.draw
      ? '<defs><mask id="' + id + '" maskUnits="userSpaceOnUse" x="-40" y="-40" width="' + (p.w + 80) + '" height="' + (p.h + 80) + '"><path class="dpath__reveal" d="' + p.d + '" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round"/></mask></defs>'
      : '';
    let ends = '';
    if (o.ends) {
      const start = p.d.match(/^M\s*(-?[\d.]+)\s+(-?[\d.]+)/);
      const nums = p.d.trim().split(/[\s,]+/);
      const ex = nums[nums.length - 2], ey = nums[nums.length - 1];
      ends = '<circle class="dpath__start" cx="' + start[1] + '" cy="' + start[2] + '" r="5" fill="var(--ink)"/>' +
        '<g class="dpath__end" transform="translate(' + ex + ' ' + ey + ')"><circle r="12" fill="var(--coral)" opacity=".18"/><circle r="6" fill="var(--coral)"/></g>';
    }
    return '<svg class="dpath ' + (o.cls || '') + '" viewBox="0 0 ' + p.w + ' ' + p.h + '" preserveAspectRatio="' + par + '" aria-hidden="true">' + mask + dots + ends + '</svg>';
  }

  function ringSVG(size) {
    const r = size / 2 - 6;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" aria-hidden="true"><circle class="ring__bg" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '"/><circle class="ring__fg" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '"/></svg>';
  }

  function backBtn(target) {
    return '<button type="button" class="back" data-back="' + (target || '') + '">' + icon('chevronLeft', 20) + '<span>Back</span></button>';
  }

  function sourceChip(src) {
    const s = D.sources[src];
    return '<span class="chip chip--' + s.cls + '">' + icon(s.icon, 14) + s.label + '</span>';
  }

  function switchHTML(attrs, checked) {
    return '<span class="switch"><input type="checkbox" ' + attrs + (checked ? ' checked' : '') + '><span></span></span>';
  }

  /* ---------- quiz illustrations (simple line drawings) ---------- */
  const INK = '#1F1B16', CORAL = '#E2674A', TEAL = '#1E7A72', PAPER = '#FFFCF7';
  const g0 = '<g fill="none" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">';
  const ART = {
    music: g0 +
      '<path d="M82 98V84a38 38 0 0 1 76 0v14"/>' +
      '<rect x="70" y="88" width="22" height="36" rx="10" fill="' + CORAL + '"/><rect x="148" y="88" width="22" height="36" rx="10" fill="' + CORAL + '"/>' +
      '<path d="M190 38v28l12 4"/><circle cx="185" cy="68" r="6" fill="' + INK + '"/>' +
      '<path d="M48 50v22"/><circle cx="43" cy="74" r="5.5" fill="' + INK + '"/>' +
      '<path d="M26 128c10-8 18 8 28 0s18 8 28 0" stroke="' + TEAL + '" stroke-dasharray="0.1 7"/>' +
      '<path d="M158 134c10-8 18 8 28 0s18 8 28 0" stroke="' + TEAL + '" stroke-dasharray="0.1 7"/></g>',
    corndog: g0 +
      '<path d="M104 140V104"/>' +
      '<rect x="84" y="34" width="40" height="76" rx="20" fill="#F3D2A8"/>' +
      '<path d="M94 52c4 3 8 3 12 0M98 70c4 3 8 3 12 0M94 88c4 3 8 3 12 0" stroke-width="2"/>' +
      '<path d="M104 34c0-10 14-14 22-24" stroke="#E8B04A" stroke-width="3.5"/>' +
      '<rect x="146" y="40" width="46" height="78" rx="9" fill="' + PAPER + '"/><circle cx="169" cy="104" r="5" fill="' + CORAL + '" stroke="none"/>' +
      '<path d="M156 56h26M156 66h18" stroke-width="2" opacity=".5"/>' +
      '<path d="M40 60l6 6M46 60l-6 6M200 22l5 5M205 22l-5 5" stroke="' + CORAL + '"/></g>',
    linen: g0 +
      '<path d="M92 30l-34 20 12 28 14-6v58h72V72l14 6 12-28-34-20c-2 10-12 17-28 17s-26-7-28-17z" fill="' + PAPER + '"/>' +
      '<path d="M120 47v83"/><path d="M58 50l12 28" stroke-width="5" stroke="' + TEAL + '" opacity=".35"/><path d="M182 50l-12 28" stroke-width="5" stroke="' + TEAL + '" opacity=".35"/>' +
      '<circle cx="120" cy="66" r="2" fill="' + INK + '"/><circle cx="120" cy="86" r="2" fill="' + INK + '"/><circle cx="120" cy="106" r="2" fill="' + INK + '"/>' +
      '<path d="M30 132h180" stroke-dasharray="0.1 8" stroke="' + CORAL + '"/></g>',
    park: g0 +
      '<circle cx="190" cy="34" r="14" fill="#F6D7A7"/>' +
      '<circle cx="62" cy="62" r="26" fill="#BFD9C9"/><path d="M62 88v40"/>' +
      '<circle cx="150" cy="70" r="20" fill="#BFD9C9"/><path d="M150 90v38"/>' +
      '<path d="M104 128c6-30 2-60 8-92M112 128c-2-24 6-50 2-76" stroke="' + TEAL + '"/>' +
      '<path d="M20 132c40-12 80 8 120-2s60-10 80 0" stroke-dasharray="0.1 8" stroke="' + CORAL + '"/></g>',
    cafe: g0 +
      '<path d="M84 64h66v28a26 26 0 0 1-26 26h-14a26 26 0 0 1-26-26z" fill="' + PAPER + '"/>' +
      '<path d="M150 72h8a12 12 0 0 1 0 24h-10"/><path d="M70 124h94"/>' +
      '<path d="M104 52c0-8 8-8 8-16M120 52c0-8 8-8 8-16" stroke="' + CORAL + '"/>' +
      '<rect x="22" y="94" width="20" height="22" rx="5" fill="' + CORAL + '" stroke="none" opacity=".8"/>' +
      '<rect x="196" y="94" width="20" height="22" rx="5" fill="' + TEAL + '" stroke="none" opacity=".8"/>' +
      '<path d="M44 110c10-26 22-34 32-36M164 74c14 4 26 12 32 30" stroke-dasharray="0.1 7" stroke="' + INK + '" opacity=".5"/></g>',
    seafood: g0 +
      '<path d="M24 112C60 52 160 40 220 62 190 112 90 130 24 112z" fill="#BFD9C9" stroke="' + TEAL + '"/>' +
      '<path d="M40 106c50-20 120-34 168-40" stroke="' + TEAL + '" stroke-width="1.8"/>' +
      '<path d="M88 86c14-14 40-16 56 0-16 16-42 14-56 0z" fill="' + CORAL + '"/><path d="M144 86l14-10v20z" fill="' + CORAL + '"/><circle cx="100" cy="84" r="2" fill="' + INK + '"/>' +
      '<circle cx="176" cy="80" r="16" fill="' + PAPER + '"/><circle cx="176" cy="80" r="7" fill="#F3D2A8" stroke-width="1.8"/></g>'
  };

  /* ---------- story player: shared by 2026 recap, monthly recap, Wrapped ---------- */
  function story(opts) {
    const n = opts.slides.length;
    let idx = -1;
    const el = h(
      '<section class="story story--' + opts.theme + '">' +
        (opts.path ? '<div class="story__path">' + dottedPath(opts.path, { draw: true, par: 'xMidYMid slice', color: opts.pathColor, width: 3, gap: 10 }) + '</div>' : '') +
        '<div class="story__bars">' + opts.slides.map(() => '<span class="story__bar"><i></i></span>').join('') + '</div>' +
        '<button type="button" class="story__close" aria-label="Close">' + icon('close', 22) + '</button>' +
        '<div class="story__stage" aria-live="polite"></div>' +
        '<p class="story__hint">Tap to continue</p>' +
      '</section>'
    );
    const stage = $(el, '.story__stage');
    const slides = opts.slides.map(s => {
      const sl = h('<div class="story__slide' + (s.cls ? ' ' + s.cls : '') + '">' + s.html + '</div>');
      stage.appendChild(sl);
      return sl;
    });
    const bars = $$(el, '.story__bar');
    const reveal = $(el, '.dpath__reveal');

    function show(k) {
      if (k < 0) return;
      if (k >= n) { if (opts.onEnd) opts.onEnd(); return; }
      idx = k;
      slides.forEach((sl, j) => sl.classList.toggle('is-active', j === k));
      bars.forEach((b, j) => {
        b.classList.toggle('is-done', j < k);
        b.classList.toggle('is-current', j === k);
      });
      $(el, '.story__hint').classList.toggle('is-gone', k > 0);
      if (reveal) Anim.drawPath(reveal, { to: (k + 1) / n, duration: 1100 });
      const s = opts.slides[k];
      if (s.onEnter) s.onEnter(slides[k]);
    }
    stage.addEventListener('click', e => {
      if (e.target.closest('button, a, input, label, .no-tap')) return;
      const r = stage.getBoundingClientRect();
      if ((e.clientX - r.left) / r.width < 0.28) show(idx - 1); else show(idx + 1);
    });
    $(el, '.story__close').addEventListener('click', opts.onClose);
    el.story = { next: () => show(idx + 1), prev: () => show(idx - 1), start: () => show(0) };
    return el;
  }

  /* ---------- redeem sheet ---------- */
  function openRedeem() {
    const box = h(
      '<div class="redeem">' +
        '<h2 class="h2">Redeem stamps</h2>' +
        '<p class="muted">You have <b data-bal></b> stamps, all earned by doing things yourself.</p>' +
        '<ul class="redeem__list">' + D.redeem.map(r =>
          '<li class="redeem__row" data-id="' + r.id + '"><span class="redeem__icon">' + icon(r.icon, 20) + '</span>' +
          '<div class="redeem__txt"><b>' + r.title + '</b><span>' + r.desc + '</span></div>' +
          '<button type="button" class="redeem__btn"></button></li>').join('') +
        '</ul>' +
        '<p class="note">' + icon('shield', 16) + '<span>No brand vouchers. No partner offers. Stamps never turn into ads.</span></p>' +
        '<button type="button" class="btn btn--ghost btn--block" data-close>Close</button>' +
      '</div>'
    );
    const close = App.sheet(box);
    function paint() {
      const s = st();
      $(box, '[data-bal]').textContent = s.stamps;
      $$(box, '.redeem__row').forEach(row => {
        const r = D.redeem.find(x => x.id === row.dataset.id);
        const b = $(row, '.redeem__btn');
        const done = !!s.redeemed[r.id];
        b.classList.toggle('is-done', done);
        b.classList.toggle('is-short', !done && s.stamps < r.cost);
        b.innerHTML = done ? icon('check', 14) + 'Redeemed' : icon('stamp', 14) + r.cost;
        b.setAttribute('aria-label', done ? r.title + ', redeemed' : 'Redeem ' + r.title + ' for ' + r.cost + ' stamps');
      });
    }
    box.addEventListener('click', e => {
      if (e.target.closest('[data-close]')) { close(); return; }
      const b = e.target.closest('.redeem__btn');
      if (!b) return;
      const r = D.redeem.find(x => x.id === b.closest('.redeem__row').dataset.id);
      const s = st();
      if (s.redeemed[r.id]) { Anim.toast('Already redeemed. Enjoy it.'); return; }
      if (s.stamps < r.cost) { Anim.toast('You need ' + (r.cost - s.stamps) + ' more stamps for this one.'); return; }
      s.stamps -= r.cost;
      s.redeemed[r.id] = true;
      App.save();
      App.emit('stamps', { from: s.stamps + r.cost, to: s.stamps });
      paint();
      Anim.toast(r.toast);
    });
    paint();
  }

  /* Keep any visible stamp balance in sync. */
  function bindStamps(ctx, el) {
    const off = App.on('stamps', d => {
      $$(el, '[data-stamps]').forEach(n => Anim.countUp(n, d.to, { from: d.from, duration: 700 }));
    });
    ctx.onLeave(off);
  }

  function stampsRow() {
    return '<button type="button" class="card stamps-row" data-redeem>' +
      '<span class="stamps-row__icon">' + icon('stamp', 22) + '</span>' +
      '<span class="stamps-row__txt"><b><span data-stamps>' + st().stamps + '</span> stamps</b><span class="fine">Earned by doing things yourself</span></span>' +
      '<span class="link">Redeem' + icon('chevron', 16) + '</span></button>';
  }

  const Screens = {};

  /* =========================================================
     1. Splash
     ========================================================= */
  Screens.splash = function (ctx) {
    const el = h(
      '<section class="splash">' +
        '<div class="splash__art">' + dottedPath('splash', { draw: true, ends: true, width: 3.5, gap: 10 }) + '</div>' +
        '<div class="splash__brand">' + wordmark(64) +
          '<p class="splash__tag">Your agent takes the fastest route.<br>Detour shows you the scenic one.</p></div>' +
        '<p class="splash__start">Tap anywhere to start</p>' +
      '</section>'
    );
    const next = () => App.go(st().onboarded ? 'today' : 'quiz', null, { dir: 'fade' });
    ctx.onEnter(() => {
      Anim.drawPath($(el, '.dpath__reveal'), { duration: 1900, delay: 150 });
      el.classList.add('is-in');
    });
    const t = setTimeout(next, 4600);
    ctx.onLeave(() => clearTimeout(t));
    el.addEventListener('click', next);
    return el;
  };

  /* =========================================================
     2. Nostalgia quiz
     ========================================================= */
  Screens.quiz = function () {
    const cards = D.quiz;
    let i = 0, top = null, swipe = null;
    const answers = {};
    const el = h(
      '<section class="quiz"><div class="scroll scroll--fit">' +
        '<header class="quiz__head"><p class="eyebrow">Step 1 of 3</p>' +
          '<h1 class="title">2026 called.<br>Were you into this?</h1>' +
          '<p class="muted quiz__sub">Swipe right if it was you, left if not. No wrong answers, only slightly embarrassing ones.</p></header>' +
        '<div class="quiz__stack"></div>' +
        '<div class="quiz__dots" aria-hidden="true">' + cards.map(() => '<i></i>').join('') + '</div>' +
        '<p class="sr-only" data-progress></p>' +
        '<div class="quiz__actions">' +
          '<button type="button" class="btn btn--ghost" data-a="no">' + icon('close', 18) + 'Not me</button>' +
          '<button type="button" class="btn btn--teal" data-a="yes">' + icon('check', 18) + 'Yes, that was me</button>' +
        '</div>' +
      '</div></section>'
    );
    const stack = $(el, '.quiz__stack');

    function cardEl(c) {
      return h(
        '<article class="qcard" style="--tint:' + c.tint + '" aria-label="' + esc(c.title) + '">' +
          '<div class="qcard__art"><svg viewBox="0 0 240 150" aria-hidden="true">' + ART[c.art] + '</svg></div>' +
          '<div class="qcard__body">' +
            '<span class="chip chip--sm">' + c.cat + ' · 2026</span>' +
            '<h2 class="qcard__title">' + c.title + '</h2>' +
            '<p class="qcard__line">' + c.line + '</p>' +
            (c.local ? '<p class="qcard__local">' + icon('pin', 14) + c.local + '</p>' : '') +
          '</div>' +
          '<span class="qcard__hint qcard__hint--yes" data-hint="yes">That was me</span>' +
          '<span class="qcard__hint qcard__hint--no" data-hint="no">Not me</span>' +
        '</article>'
      );
    }
    function mount() {
      const waiting = $(stack, '.qcard.is-next');
      if (waiting) { waiting.classList.remove('is-next'); top = waiting; }
      else { top = cardEl(cards[i]); stack.appendChild(top); }
      swipe = Anim.swipeable(top, { getScale: () => App.scale, onDecide: decide });
      if (i + 1 < cards.length) {
        const nx = cardEl(cards[i + 1]);
        nx.classList.add('is-next');
        stack.insertBefore(nx, stack.firstChild);
      }
      $$(el, '.quiz__dots i').forEach((d, k) => { d.className = k < i ? 'is-done' : k === i ? 'is-current' : ''; });
      $(el, '[data-progress]').textContent = 'Card ' + (i + 1) + ' of ' + cards.length;
    }
    function decide(dir) {
      answers[cards[i].id] = dir === 'right';
      if (top) top.remove();
      i++;
      if (i >= cards.length) {
        st().quiz = answers;
        App.save();
        $$(el, '.quiz__dots i').forEach(d => { d.className = 'is-done'; });
        setTimeout(() => App.go('recap2026'), 260);
        return;
      }
      mount();
    }
    $(el, '[data-a="yes"]').addEventListener('click', () => swipe && swipe.fling('right'));
    $(el, '[data-a="no"]').addEventListener('click', () => swipe && swipe.fling('left'));
    mount();
    return el;
  };

  /* =========================================================
     3. Your 2026 self (built from the quiz answers)
     ========================================================= */
  Screens.recap2026 = function (ctx) {
    const P = D.persona;
    const yes = D.quiz.filter(c => st().quiz[c.id]);
    const yesIds = yes.map(c => c.id);
    const whoId = P.whoOrder.find(id => yesIds.indexOf(id) > -1);
    const withId = P.withOrder.find(id => id !== whoId && yesIds.indexOf(id) > -1);
    let sentence;
    if (!whoId) sentence = 'In 2026, you were <em>a mystery</em>. Honestly? We respect that.';
    else if (!withId) sentence = 'In 2026, you were <em>' + P[whoId].who + '</em>. Simple. Committed.';
    else sentence = 'In 2026, you were <em>' + P[whoId].who + '</em> with ' + P[withId].with + '.';

    const list = yes.slice(0, 4).map((c, k) =>
      '<li class="rv" style="--d:' + (k + 1) + '">' + icon(P[c.id].icon, 20) + '<span>' + P[c.id].short + '</span></li>').join('');

    const el = story({
      theme: 'sand',
      onClose: () => App.go('link'),
      onEnd: () => App.go('link'),
      slides: [
        { html: '<p class="eyebrow rv">Your 2026 self</p><h1 class="story__big rv" style="--d:1">Hello,<br>2026 you.</h1>' +
            '<p class="story__sub rv" style="--d:2">You said yes to <b>' + yes.length + ' of ' + D.quiz.length + '</b>. Let\'s see who that was.</p>' },
        { html: '<p class="eyebrow rv">The verdict</p><p class="story__quote rv" style="--d:1">' + sentence + '</p>' +
            '<div class="rv" style="--d:3">' + dottedPath('divider', { color: 'var(--teal)' }) + '</div>' },
        { html: '<p class="eyebrow rv">Back then</p><h2 class="story__mid rv" style="--d:0">You picked these yourself.</h2>' +
            (list ? '<ul class="story__list">' + list + '</ul><p class="story__sub rv" style="--d:6">No agent involved. Just you and a lot of opinions.</p>'
                  : '<p class="story__sub rv" style="--d:1">You kept your cards close. Fair. Your agent history will fill in the rest.</p>') },
        { html: '<h2 class="story__big rv">Want to see how much you\'ve changed since?</h2>' +
            '<p class="story__sub rv" style="--d:1">Fourteen years is a long time. Let\'s take a gentle look.</p>' +
            '<button type="button" class="btn btn--primary btn--block rv" style="--d:2" data-go="link">Show me' + icon('arrowRight', 18) + '</button>' }
      ]
    });
    ctx.onEnter(() => el.story.start());
    return el;
  };

  /* =========================================================
     4. Link your agent history (consent)
     ========================================================= */
  Screens.link = function (ctx) {
    const s = st();
    const L = D.link;
    const el = h(
      '<section class="linkscreen"><div class="scroll">' +
        '<header class="stack-8"><p class="eyebrow">Step 2 of 3</p><h1 class="title">Link your agent history</h1>' +
          '<p class="lead">By law, every agent keeps your history in one standard format, and you can hand a copy to any app you trust.</p></header>' +
        '<div class="card stack-12"><h2 class="card__h">' + icon('eye', 20) + 'What Detour reads</h2>' +
          '<p class="muted">A copy of each choice, and who made it:</p>' +
          '<div class="who"><span class="chip chip--agent">' + icon('phone', 14) + 'The agent</span><span class="chip chip--you">' + icon('user', 14) + 'You</span><span class="chip chip--approved">' + icon('check', 14) + 'The agent, with your OK</span></div></div>' +
        '<div class="card stack-12"><h2 class="card__h">' + icon('shield', 20) + 'What Detour never does</h2>' +
          '<ul class="promise-list">' +
            '<li>' + icon('check', 18) + 'Never changes your agent</li>' +
            '<li>' + icon('check', 18) + 'Never sells your data</li>' +
            '<li>' + icon('check', 18) + 'Processing happens on your phone</li>' +
          '</ul></div>' +
        '<section class="stack-8"><h2 class="h3">Choose what to include</h2>' +
          '<div class="card card--flat rows">' + D.categories.map(c =>
            '<label class="row">' + icon(c.icon, 20) + '<span class="row__t">' + c.label + '</span>' + switchHTML('data-cat="' + c.id + '"', s.categories[c.id]) + '</label>').join('') +
          '</div></section>' +
        '<div class="stack-8"><button type="button" class="btn btn--primary btn--block" data-link>Link my history</button>' +
          '<p class="fine center">You can unlink anytime in Profile.</p></div>' +
      '</div>' +
      '<div class="sync" aria-live="polite">' +
        '<div class="sync__spin">' + dottedPath('splash', { color: 'var(--teal)', width: 3, gap: 9 }) + '</div>' +
        '<p class="sync__n" data-n>0</p><p class="sync__label">choices found since ' + L.since + '</p>' +
        '<p class="sync__status" data-status>Opening your history…</p>' +
        '<div class="sync__done">' +
          '<ul class="sync__list">' + L.breakdown.map(b =>
            '<li><span class="dot dot--' + b.cls + '"></span><span>' + b.who + '</span><b>' + fmt(b.n) + '</b></li>').join('') + '</ul>' +
          '<p class="fine center">All of it stays on this phone.</p>' +
          '<button type="button" class="btn btn--primary btn--block" data-go="skills">Continue</button>' +
        '</div>' +
      '</div></section>'
    );
    $$(el, '[data-cat]').forEach(inp => inp.addEventListener('change', () => {
      s.categories[inp.dataset.cat] = inp.checked;
      App.save();
    }));
    const timers = [];
    ctx.onLeave(() => timers.forEach(clearTimeout));
    $(el, '[data-link]').addEventListener('click', () => {
      const on = D.categories.filter(c => s.categories[c.id]);
      if (!on.length) { Anim.toast('Pick at least one area to include.'); return; }
      const sync = $(el, '.sync');
      sync.classList.add('is-on');
      Anim.countUp($(el, '[data-n]'), L.total, { duration: 2400, delay: 200 });
      const status = $(el, '[data-status]');
      on.forEach((c, k) => timers.push(setTimeout(() => { status.textContent = 'Reading ' + c.label.toLowerCase() + '…'; }, 300 + k * 420)));
      timers.push(setTimeout(() => {
        status.textContent = 'Done. Nothing was changed.';
        sync.classList.add('is-done');
      }, 2800));
    });
    return el;
  };

  /* =========================================================
     5. Pick skills to keep
     ========================================================= */
  Screens.skills = function () {
    const s = st();
    let picked = s.skills.slice();
    const el = h(
      '<section><div class="scroll">' +
        '<header class="stack-8"><p class="eyebrow">Step 3 of 3</p><h1 class="title">Things you used to do yourself</h1>' +
          '<p class="lead">Pick two or three to keep. Now and then, Detour will invite you to do one. Gently, and only if you want.</p></header>' +
        '<div class="stack-12" role="group" aria-label="Skills">' + D.skills.map(k =>
          '<button type="button" class="skill-pick" data-skill="' + k.id + '" aria-pressed="false">' +
            '<span class="skill-pick__icon">' + icon(k.icon, 22) + '</span>' +
            '<span class="skill-pick__txt"><b>' + k.name + '</b><span>' + k.note + '</span></span>' +
            '<span class="skill-pick__check">' + icon('check', 16) + '</span></button>').join('') +
        '</div>' +
        '<p class="note">' + icon('info', 16) + '<span>Medication, health and big money decisions are never offered. Those stay with your agent and the experts.</span></p>' +
        '<button type="button" class="btn btn--primary btn--block" data-keep></button>' +
      '</div></section>'
    );
    function paint() {
      $$(el, '[data-skill]').forEach(b => {
        const on = picked.indexOf(b.dataset.skill) > -1;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      const ok = picked.length >= 2 && picked.length <= 3;
      const keep = $(el, '[data-keep]');
      keep.classList.toggle('is-disabled', !ok);
      keep.textContent = ok ? 'Keep these ' + picked.length : 'Pick ' + (2 - picked.length) + ' more';
    }
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-skill]');
      if (b) {
        const id = b.dataset.skill;
        const at = picked.indexOf(id);
        if (at > -1) picked.splice(at, 1);
        else if (picked.length >= 3) { Anim.toast('Three is plenty. Unpick one first.'); return; }
        else picked.push(id);
        paint();
        return;
      }
      if (e.target.closest('[data-keep]')) {
        if (picked.length < 2) { Anim.toast('Pick at least two. You can change them later.'); return; }
        s.skills = picked;
        s.onboarded = true;
        App.save();
        App.go('today', null, { dir: 'up' });
        setTimeout(() => Anim.toast('All set. See you tomorrow morning.'), 500);
      }
    });
    paint();
    return el;
  };

  /* =========================================================
     6. Today
     ========================================================= */
  Screens.today = function (ctx) {
    const s = st();
    const N = D.numbers;
    const el = h(
      '<section class="today"><div class="scroll">' +
        '<header class="today__head"><div><p class="eyebrow">' + D.today.long + '</p><h1 class="title">Good morning,<br>' + D.user.name + '.</h1></div>' +
          '<button type="button" class="avatar" data-go="profile" aria-label="Profile">' + D.user.initial + '</button></header>' +
        '<div data-morning></div>' +
        '<div class="card owned">' +
          '<div class="ring">' + ringSVG(96) + '<span class="ring__val" data-ringval>0%</span></div>' +
          '<div class="owned__txt"><p class="owned__big">of this month\'s choices were yours.</p>' +
            '<p class="delta">' + icon('arrowUp', 16) + 'up from ' + N.ocrLastMonth + '% last month</p></div>' +
        '</div>' +
        stampsRow() +
        '<div class="shortcuts">' +
          '<button type="button" class="card shortcut" data-go="map">' +
            '<svg class="shortcut__art" viewBox="0 0 120 60" aria-hidden="true"><circle cx="48" cy="32" r="18" fill="var(--coral)" opacity=".9"/><circle cx="78" cy="22" r="11" fill="none" stroke="var(--ink)" stroke-opacity=".35" stroke-width="1.5"/><circle cx="96" cy="44" r="12" fill="none" stroke="var(--teal)" stroke-width="1.75" stroke-dasharray="3 4" stroke-linecap="round"/></svg>' +
            '<b>Taste Map</b><span class="fine">' + D.tasteMap.newCorner + '</span></button>' +
          '<button type="button" class="card shortcut" data-go="monthly">' +
            '<span class="shortcut__art">' + dottedPath('mini', { gap: 7, width: 3 }) + '</span>' +
            '<b>Latest recap</b><span class="fine">' + D.monthly.title + '</span></button>' +
        '</div>' +
        '<footer class="signoff">' + dottedPath('divider', { color: 'var(--ink-40)', width: 2.5 }) +
          '<p>Your agent takes the fastest route.<br>Detour shows you the scenic one.</p></footer>' +
      '</div></section>'
    );

    function renderMorning() {
      const box = $(el, '[data-morning]');
      let html;
      if (s.morningSkipped) {
        html = '<div class="card card--sand morning morning--rest"><p>No pick today, then. See you tomorrow morning.</p>' +
          '<button type="button" class="btn btn--quiet" data-unskip>Show it again</button></div>';
      } else if (s.morningMode === 'diy' && s.diy === 'done') {
        html = '<article class="card morning"><div class="morning__top"><span class="chip chip--approved">' + icon('check', 14) + 'Done today</span></div>' +
          '<h2 class="h2">Cooked by you tonight.</h2><p class="muted">+' + N.stampReward + ' stamps, and meal number ' + s.mealsMonth + ' this month.</p>' +
          '<div class="morning__actions"><button type="button" class="btn btn--ghost" data-go="diy">See your progress</button></div></article>';
      } else if (s.morningMode === 'diy') {
        html = '<article class="card morning"><div class="morning__top"><span class="chip chip--you">' + icon('hand', 14) + 'Do it yourself</span><span class="fine">Today\'s one pick</span></div>' +
          '<h2 class="h2">Cook one meal yourself today.</h2>' +
          '<p class="muted">Your 2031 self made a great dal. Want to see if you\'ve still got it?</p>' +
          '<div class="morning__actions"><button type="button" class="btn btn--primary" data-go="diy">I\'m curious</button>' +
          '<button type="button" class="btn btn--quiet" data-skip>Not today</button></div></article>';
      } else {
        html = '<article class="card morning"><div class="morning__top">' + sourceChip('friend') + '<span class="fine">Today\'s one pick</span></div>' +
          '<h2 class="h2">Dinner somewhere new?</h2>' +
          '<p class="muted">Ananya loved a Northeast Indian kitchen in Indiranagar. Two more ideas inside.</p>' +
          '<div class="morning__actions"><button type="button" class="btn btn--primary" data-go="tsn">See the options</button>' +
          '<button type="button" class="btn btn--quiet" data-skip>Not today</button></div></article>';
      }
      box.innerHTML = html;
    }
    el.addEventListener('click', e => {
      if (e.target.closest('[data-skip]')) { s.morningSkipped = true; App.save(); renderMorning(); }
      if (e.target.closest('[data-unskip]')) { s.morningSkipped = false; App.save(); renderMorning(); }
    });
    renderMorning();
    bindStamps(ctx, el);
    ctx.onEnter(() => {
      Anim.ring($(el, '.ring__fg'), N.ocrMonth, { delay: 200 });
      Anim.countUp($(el, '[data-ringval]'), N.ocrMonth, { suffix: '%', duration: 1400, delay: 200 });
    });
    return el;
  };

  /* =========================================================
     7. Taste Map
     ========================================================= */
  Screens.map = function (ctx) {
    const TM = D.tasteMap;
    let cat = ctx.params.cat || 'food';
    let t = 1, raf = 0;
    const el = h(
      '<section class="mapscreen"><div class="scroll">' +
        '<header class="stack-8"><h1 class="title">Taste Map</h1><p class="muted">Where your choices live, and the corners you haven\'t visited yet.</p></header>' +
        '<div class="seg" role="tablist" aria-label="Category">' + TM.cats.map(c =>
          '<button type="button" role="tab" data-cat="' + c.id + '">' + c.label + '</button>').join('') + '</div>' +
        '<div class="stack-12">' +
          '<div class="card map"><svg class="map__svg" viewBox="0 0 342 300" role="group" aria-label="Taste map bubbles"></svg></div>' +
          '<div class="legend"><span><i class="lg lg--often"></i>You pick often</span><span><i class="lg lg--used"></i>You used to</span><span><i class="lg lg--new"></i>Unexplored</span></div>' +
        '</div>' +
        '<div class="card card--flat timeline">' +
          '<div class="timeline__top"><div><p class="eyebrow">Your map in</p><p class="timeline__year" data-year>2040</p></div>' +
            '<button type="button" class="btn btn--ghost btn--sm" data-play>' + icon('play', 16) + 'Replay</button></div>' +
          '<input class="range" type="range" min="0" max="1000" value="1000" aria-label="Year, 2026 to 2040">' +
          '<div class="timeline__ends"><span>2026</span><span>2040</span></div>' +
          '<p class="timeline__note" data-note></p>' +
        '</div>' +
        '<p class="hint">' + icon('spark', 16) + '<span>Tap a dashed circle to see something new from that corner.</span></p>' +
        '<section class="stack-12"><div><h2 class="h3">Choices you still make yourself</h2><p class="fine">This month, by area</p></div>' +
          '<div class="bars">' + D.ownBars.map(b =>
            '<div class="bar"><div class="bar__top"><span>' + b.label + '</span><span>' + b.pct + '%</span></div>' +
            '<div class="bar__track"><div class="bar__fill" data-pct="' + b.pct + '"></div></div></div>').join('') +
          '</div></section>' +
      '</div></section>'
    );
    const svg = $(el, '.map__svg');
    const range = $(el, '.range');

    function render() {
      const labels = TM.labels[cat];
      svg.innerHTML = '<circle class="map__area" cx="172" cy="156" r="150"/>' + TM.slots.map((sl, k) => {
        const lines = labels[k].split('\n');
        const isNew = sl.kind === 'unexplored';
        const all = isNew ? ['unexplored'].concat(lines) : lines;
        const y0 = -(all.length - 1) * 7 + 4;
        const text = all.map((ln, j) => '<tspan x="0" y="' + (y0 + j * 14) + '"' + (isNew && j === 0 ? ' class="tag"' : '') + '>' + esc(ln) + '</tspan>').join('');
        const name = lines.join(' ');
        return '<g class="bub bub--' + sl.kind + '" transform="translate(' + sl.x + ' ' + sl.y + ')"' +
          (isNew ? ' role="button" aria-label="Explore ' + esc(name) + '" data-area="' + esc(name) + '"' : '') + '>' +
          '<g class="bub__drift" style="animation-duration:' + (5 + (k % 4) * 1.3) + 's;animation-delay:-' + (k * 0.9) + 's">' +
          '<circle r="' + sl.r1 + '"/><text text-anchor="middle">' + text + '</text></g></g>';
      }).join('');
      $$(el, '[data-cat]').forEach(b => {
        b.classList.toggle('is-active', b.dataset.cat === cat);
        b.setAttribute('aria-selected', b.dataset.cat === cat ? 'true' : 'false');
      });
      setT(t);
    }

    function setT(x) {
      t = x;
      $$(svg, '.bub').forEach((g, k) => {
        const sl = TM.slots[k];
        const c = $(g, 'circle');
        if (sl.kind === 'unexplored') {
          const o = Math.max(0, Math.min(1, (x - 0.35) / 0.6));
          g.style.opacity = o.toFixed(2);
          const live = x > 0.6;
          g.classList.toggle('is-live', live);
          g.setAttribute('tabindex', live ? '0' : '-1');
        } else {
          c.setAttribute('r', lerp(sl.r0, sl.r1, x).toFixed(1));
          if (sl.kind === 'used') {
            c.setAttribute('fill-opacity', lerp(0.8, 0, x).toFixed(2));
            c.setAttribute('stroke-opacity', lerp(0, 0.4, x).toFixed(2));
            g.classList.toggle('is-faded', x > 0.5);
          } else {
            c.setAttribute('fill-opacity', lerp(0.6, 0.95, x).toFixed(2));
          }
        }
      });
      const area = $(svg, '.map__area');
      if (area) area.setAttribute('r', lerp(160, 96, x).toFixed(1));
      $(el, '[data-year]').textContent = Math.round(2026 + 14 * x);
      range.value = Math.round(x * 1000);
      range.style.setProperty('--p', (x * 100).toFixed(1) + '%');
      $(el, '[data-note]').textContent = x < 0.3
        ? 'Back then, you were all over the map.'
        : x < 0.85 ? 'Your agent learned what you like. The edges went quiet.'
          : 'A cosy centre, and three corners waiting for you.';
    }

    function play() {
      cancelAnimationFrame(raf);
      if (Anim.reduced()) { setT(1); return; }
      const start = performance.now(), dur = 2400;
      setT(0);
      const step = now => {
        const p = Math.min(1, (now - start) / dur);
        setT(Anim.easeInOut(p));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }

    function open(g) { App.go('tsn', { cat: cat, area: g.dataset.area }); }
    svg.addEventListener('click', e => {
      const g = e.target.closest('.bub--unexplored.is-live');
      if (g) open(g);
    });
    svg.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.bub--unexplored.is-live')) {
        e.preventDefault(); open(e.target);
      }
    });
    range.addEventListener('input', () => { cancelAnimationFrame(raf); setT(range.value / 1000); });
    $(el, '[data-play]').addEventListener('click', play);
    $$(el, '[data-cat]').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.cat === cat) return;
      cat = b.dataset.cat;
      svg.classList.add('is-swapping');
      setTimeout(() => { render(); svg.classList.remove('is-swapping'); }, 160);
    }));

    render();
    let startT = 0;
    ctx.onEnter(() => {
      startT = setTimeout(play, 350);
      $$(el, '.bar__fill').forEach((f, k) => setTimeout(() => { f.style.width = Math.max(2, f.dataset.pct) + '%'; }, 300 + k * 80));
    });
    ctx.onLeave(() => { cancelAnimationFrame(raf); clearTimeout(startT); });
    return el;
  };

  /* =========================================================
     8. Try Something New
     ========================================================= */
  Screens.tsn = function (ctx) {
    const s = st();
    const cat = ctx.params.cat || 'food';
    const area = ctx.params.area;
    const data = D.tsn[cat];
    const catLabel = (D.tasteMap.cats.find(c => c.id === cat) || { label: 'Food' }).label;
    let options = data.options.slice();
    if (area) options.sort((a, b) => (b.area === area) - (a.area === area));

    const el = h(
      '<section class="tsn"><div class="scroll">' +
        backBtn() +
        '<header class="stack-8"><p class="eyebrow">Try something new</p>' +
          '<h1 class="title">' + (area ? esc(area) + '<span class="title__soft">, a corner you haven\'t visited</span>' : 'Something new,<br>if you fancy it.') + '</h1></header>' +
        '<div class="context">' + icon('compass', 20) + '<p>' + (area ? 'From your ' + catLabel + ' map. ' : '') + data.context + '</p></div>' +
        '<div class="opts" data-opts></div>' +
        '<p class="noads">' + icon('shield', 16) + '<span>No paid placements, ever. Every pick shows where it came from.</span></p>' +
      '</div></section>'
    );
    const box = $(el, '[data-opts]');

    function stateHTML(o) {
      const v = s.tsn[o.id];
      if (v === 'self') return '<div class="opt__state">' + icon('check', 18) + '<span>It\'s yours. Added to your week, no agent involved.</span><button type="button" class="btn btn--quiet btn--xs" data-undo>Undo</button></div>';
      if (v === 'agent') return '<div class="opt__state opt__state--agent">' + icon('phone', 18) + '<span>Sent to your agent. It\'ll sort the details and change nothing else.</span><button type="button" class="btn btn--quiet btn--xs" data-undo>Undo</button></div>';
      return '<div class="opt__actions"><button type="button" class="btn btn--primary btn--sm btn--block" data-act="self">I\'ll do it myself</button>' +
        '<div class="opt__row"><button type="button" class="btn btn--ghost btn--sm" data-act="agent">Tell my agent</button>' +
        '<button type="button" class="btn btn--quiet btn--sm" data-act="no">Not for me</button></div></div>';
    }
    function noteHTML() {
      return '<p class="opt-note">' + icon('check', 16) + '<span>Got it, we won\'t show this again.</span></p>';
    }
    function cardHTML(o) {
      return '<article class="card opt' + (s.tsn[o.id] ? ' is-chosen' : '') + (area && o.area === area ? ' is-match' : '') + '">' +
        '<div class="opt__top">' + sourceChip(o.source) + (o.free ? '<span class="chip chip--free">' + icon('leaf', 14) + 'Free</span>' : '') + '</div>' +
        '<h2 class="opt__title">' + o.title + '</h2>' +
        '<p class="opt__who opt__who--' + o.source + '">' + o.who + '</p>' +
        '<p class="muted">' + o.line + '</p>' +
        '<p class="opt__meta">' + icon('clock', 14) + o.meta + '</p>' +
        '<div data-state>' + stateHTML(o) + '</div></article>';
    }
    function render() {
      box.innerHTML = options.map(o =>
        '<div class="opt-slot" data-id="' + o.id + '">' + (s.tsn[o.id] === 'no' ? noteHTML() : cardHTML(o)) + '</div>').join('');
      checkEmpty();
    }
    function checkEmpty() {
      const left = options.filter(o => s.tsn[o.id] !== 'no').length;
      let empty = $(el, '.opts__empty');
      if (!left && !empty) {
        empty = h('<div class="card card--sand opts__empty"><p><b>That\'s all for today.</b><br>Fresh ideas tomorrow morning. Or wander your Taste Map now.</p>' +
          '<button type="button" class="btn btn--ghost btn--sm" data-go="map">Open Taste Map</button></div>');
        box.appendChild(empty);
      } else if (left && empty) empty.remove();
    }

    box.addEventListener('click', e => {
      const slot = e.target.closest('.opt-slot');
      if (!slot) return;
      const o = options.find(x => x.id === slot.dataset.id);
      const act = e.target.closest('[data-act]');
      if (e.target.closest('[data-undo]')) {
        delete s.tsn[o.id]; App.save();
        $(slot, '.opt').classList.remove('is-chosen');
        $(slot, '[data-state]').innerHTML = stateHTML(o);
        return;
      }
      if (!act) return;
      const kind = act.dataset.act;
      if (kind === 'no') {
        s.tsn[o.id] = 'no'; App.save();
        const card = $(slot, '.opt');
        const hStart = slot.offsetHeight;
        card.classList.add('is-leaving');
        setTimeout(() => {
          slot.style.height = hStart + 'px';
          slot.innerHTML = noteHTML();
          const hEnd = slot.firstElementChild.offsetHeight;
          void slot.offsetHeight;
          slot.style.transition = 'height 320ms var(--ease)';
          slot.style.height = hEnd + 'px';
          setTimeout(() => { slot.style.height = ''; slot.style.transition = ''; checkEmpty(); }, 340);
        }, Anim.reduced() ? 120 : 300);
        return;
      }
      s.tsn[o.id] = kind; App.save();
      $(slot, '.opt').classList.add('is-chosen');
      $(slot, '[data-state]').innerHTML = stateHTML(o);
      Anim.toast(kind === 'self' ? 'Nice. That one\'s all yours.' : 'Sent to your agent.');
    });
    render();
    return el;
  };

  /* =========================================================
     9. Do It Yourself
     ========================================================= */
  Screens.diy = function (ctx) {
    const s = st();
    const C = D.diy;
    const N = D.numbers;
    const timers = [];
    ctx.onLeave(() => timers.forEach(clearTimeout));
    const el = h(
      '<section class="diy"><div class="scroll">' +
        '<header class="stack-8"><h1 class="title">Do it yourself</h1><p class="muted">Small things you chose to keep doing. Only when you feel like it.</p></header>' +
        '<article class="card diy-card" data-card aria-live="polite"></article>' +
        '<section class="stack-12"><h2 class="h3">Your skills</h2><div class="card rows skills-card" data-skills></div></section>' +
        stampsRow() +
      '</div></section>'
    );
    const card = $(el, '[data-card]');

    function renderCard(animate) {
      const state = s.diy;
      let html = '';
      if (state === 'idle') {
        html = '<p class="eyebrow">' + C.eyebrow + '</p><h2 class="h2">' + C.title + '</h2><p class="muted">' + C.line + '</p>' +
          '<div class="recipe">' + icon('pot', 22) + '<div><b>' + C.recipe.name + '</b><span>' + C.recipe.meta + '</span></div></div>' +
          '<button type="button" class="btn btn--primary btn--block" data-act="in">I\'m in</button>' +
          '<button type="button" class="btn btn--quiet btn--block" data-act="later">Maybe next Sunday</button>';
      } else if (state === 'in') {
        html = '<p class="eyebrow eyebrow--live"><i class="pulse"></i>In progress</p><h2 class="h2">You\'re cooking.</h2>' +
          '<p class="muted">Your notes from 2031, if you want them. Tick as you go, or don\'t.</p>' +
          '<ul class="steps">' + C.steps.map((t, k) =>
            '<li><button type="button" class="step' + (s.diySteps[k] ? ' is-on' : '') + '" data-step="' + k + '" aria-pressed="' + (s.diySteps[k] ? 'true' : 'false') + '"><span class="step__box">' + icon('check', 14) + '</span><span>' + t + '</span></button></li>').join('') +
          '</ul>' +
          '<button type="button" class="btn btn--primary btn--block" data-act="did">I did it</button>' +
          '<button type="button" class="btn btn--quiet btn--block" data-act="cancel">Not tonight after all</button>';
      } else if (state === 'verify') {
        html = '<p class="eyebrow">Quick check</p><h2 class="h2">Nice. Let\'s make it official.</h2>' +
          '<ul class="checks">' + C.checks.map((c, k) =>
            '<li class="check" data-check="' + k + '"><span class="check__dot">' + icon('check', 14) + '</span><span class="check__t">' + (c.wait || c.done) + '</span></li>').join('') + '</ul>' +
          '<div class="confirm-wrap"><button type="button" class="btn btn--primary btn--block" data-act="confirm">Confirm</button>' +
          '<p class="fine center">Detour only looks at tonight\'s food choices. Nothing else.</p></div>';
      } else {
        html = '<div class="stamp' + (animate ? ' is-pressed' : '') + '" aria-hidden="true"><span>Cooked<b>+' + N.stampReward + '</b>by you</span></div>' +
          '<div class="diy-done__head"><p class="eyebrow">' + C.eyebrow + ' · done</p><h2 class="h2">Cooked by you.</h2>' +
          '<p class="muted">Meal number ' + s.mealsMonth + ' this month. Your 2031 self would approve.</p></div>' +
          '<p class="earned">' + icon('stamp', 18) + '+' + N.stampReward + ' stamps added</p>' +
          '<button type="button" class="btn btn--ghost btn--block" data-go="today">Back to Today</button>';
      }
      card.className = 'card diy-card diy-card--' + state + (animate && state === 'done' ? ' is-thud' : '');
      card.innerHTML = html;
      if (state === 'verify') runChecks();
    }

    function runChecks() {
      const items = $$(card, '.check');
      const btn = $(card, '.confirm-wrap');
      items.forEach(li => li.classList.add('is-hidden'));
      const fast = Anim.reduced();
      items[0].classList.remove('is-hidden');
      items[0].classList.add('is-wait');
      timers.push(setTimeout(() => {
        items[0].classList.remove('is-wait');
        items[0].classList.add('is-ok');
        $(items[0], '.check__t').textContent = C.checks[0].done;
        items.slice(1).forEach((li, k) => timers.push(setTimeout(() => { li.classList.remove('is-hidden'); li.classList.add('is-ok'); }, (k + 1) * (fast ? 100 : 550))));
        timers.push(setTimeout(() => btn.classList.add('is-on'), items.length * (fast ? 100 : 550) + 100));
      }, fast ? 200 : 1300));
    }

    function renderSkills(animateMeals) {
      const box = $(el, '[data-skills]');
      box.innerHTML = s.skills.map(id => {
        const k = D.skills.find(x => x.id === id);
        if (!k) return '';
        const val = id === 'cooking' ? s.mealsMonth : k.value;
        return '<div class="row skill-row"><span class="skill-row__icon">' + icon(k.icon, 20) + '</span>' +
          '<div class="skill-row__txt"><b>' + k.name + '</b><span>' + k.metric + ': <b' + (id === 'cooking' ? ' data-meals' : '') + '>' + val + '</b></span>' +
          (k.next ? '<span class="fine">' + k.next + '</span>' : '') +
          (k.cta ? '<button type="button" class="skill-row__cta" data-toast="' + esc(k.toast) + '">' + k.cta + icon('chevron', 14) + '</button>' : '') +
          '</div></div>';
      }).join('');
      if (animateMeals) Anim.countUp($(box, '[data-meals]'), s.mealsMonth, { from: s.mealsMonth - 1, duration: 600, delay: 600 });
    }

    card.addEventListener('click', e => {
      const step = e.target.closest('[data-step]');
      if (step) {
        const k = step.dataset.step;
        s.diySteps[k] = !s.diySteps[k]; App.save();
        step.classList.toggle('is-on', !!s.diySteps[k]);
        step.setAttribute('aria-pressed', s.diySteps[k] ? 'true' : 'false');
        return;
      }
      const a = e.target.closest('[data-act]');
      if (!a) return;
      const act = a.dataset.act;
      if (act === 'later') { Anim.toast('No problem. It\'ll keep.'); return; }
      if (act === 'in') s.diy = 'in';
      if (act === 'cancel') { s.diy = 'idle'; Anim.toast('All good. Your agent can handle dinner.'); }
      if (act === 'did') s.diy = 'verify';
      if (act === 'confirm') {
        const from = s.stamps;
        s.diy = 'done';
        s.stamps += N.stampReward;
        s.mealsMonth = N.mealsMonthStart + 1;
        App.save();
        renderCard(true);
        renderSkills(true);
        timers.push(setTimeout(() => App.emit('stamps', { from: from, to: s.stamps }), Anim.reduced() ? 0 : 650));
        return;
      }
      App.save();
      renderCard(false);
    });

    renderCard(false);
    renderSkills(false);
    bindStamps(ctx, el);
    return el;
  };

  /* =========================================================
     Recaps tab (hub)
     ========================================================= */
  Screens.recaps = function () {
    return h(
      '<section class="recaps"><div class="scroll">' +
        '<header class="stack-8"><h1 class="title">Recaps</h1><p class="muted">Little looks back. Yours to keep, and yours to share, or not.</p></header>' +
        '<button type="button" class="wrapped-hero" data-go="wrapped">' +
          '<span class="wrapped-hero__path">' + dottedPath('divider', { color: 'var(--coral)' }) + '</span>' +
          '<span class="eyebrow">Sneak peek · lands 31 December</span>' +
          '<span class="wrapped-hero__t">Detour Wrapped 2040</span>' +
          '<span class="wrapped-hero__s">Your year, in detours. Seven short cards.</span>' +
          '<span class="btn btn--primary btn--sm">Open' + icon('arrowRight', 16) + '</span>' +
        '</button>' +
        '<div class="card rows">' +
          '<button type="button" class="row row--link" data-go="monthly"><span class="row__icon">' + icon('book', 20) + '</span><span class="row__txt"><b>' + D.monthly.title + '</b><span class="fine">This month · 4 cards</span></span>' + icon('chevron', 18) + '</button>' +
          '<button type="button" class="row row--link" data-go="recap2026"><span class="row__icon">' + icon('clock', 20) + '</span><span class="row__txt"><b>Your 2026 self</b><span class="fine">From your first day · 4 cards</span></span>' + icon('chevron', 18) + '</button>' +
        '</div>' +
      '</div></section>'
    );
  };

  /* =========================================================
     10. Monthly recap
     ========================================================= */
  Screens.monthly = function (ctx) {
    const s = st();
    const N = D.numbers;
    const M = D.monthly;
    const trip = D.skills.find(k => k.id === 'trip');
    const el = story({
      theme: 'light',
      onClose: () => App.back('recaps'),
      onEnd: () => App.back('recaps'),
      slides: [
        { html: '<p class="eyebrow rv">' + M.title + '</p>' +
            '<p class="story__huge rv" style="--d:1" data-c>0%</p>' +
            '<p class="story__mid rv" style="--d:2">of your choices were yours this month.</p>' +
            '<p class="story__sub rv" style="--d:3">Up from ' + N.ocrLastMonth + '% in ' + D.today.lastMonth + '. When you joined in March, it was ' + N.ocrStart + '%.</p>',
          onEnter: sl => Anim.countUp($(sl, '[data-c]'), N.ocrMonth, { from: N.ocrLastMonth, suffix: '%', duration: 1200, delay: 300 }) },
        { html: '<p class="eyebrow rv">Firsts</p><h2 class="story__big rv" style="--d:1">' + N.firstsMonth + ' firsts this month.</h2>' +
            '<ul class="story__list">' + M.firsts.map((f, k) => '<li class="rv" style="--d:' + (k + 2) + '">' + icon(f.icon, 20) + '<span>' + f.t + '</span></li>').join('') + '</ul>' },
        { html: '<p class="eyebrow rv">Welcome back</p><h2 class="story__big rv" style="--d:1">' + M.favourite.t + '</h2>' +
            '<div class="story__art rv" style="--d:2"><svg viewBox="0 0 240 150" aria-hidden="true">' + ART.seafood + '</svg></div>' +
            '<p class="story__sub rv" style="--d:3">' + M.favourite.line + '</p>' },
        { html: '<p class="eyebrow rv">Your skills</p><h2 class="story__big rv" style="--d:1">Still yours.</h2>' +
            '<ul class="story__list">' +
              '<li class="rv" style="--d:2">' + icon('pot', 20) + '<span>Cooking: <b>' + s.mealsMonth + ' meals</b> made by you</span></li>' +
              '<li class="rv" style="--d:3">' + icon('route', 20) + '<span>Trip planning: <b>' + trip.value + ' day trip</b> planned by you</span></li>' +
            '</ul>' +
            '<button type="button" class="btn btn--primary btn--block rv" style="--d:5" data-back="recaps">Done</button>' }
      ]
    });
    ctx.onEnter(() => el.story.start());
    return el;
  };

  /* =========================================================
     11. Detour Wrapped 2040
     ========================================================= */
  Screens.wrapped = function (ctx) {
    const s = st();
    const N = D.numbers;
    const W = D.wrapped;
    const skillNames = s.skills.map(id => (D.skills.find(k => k.id === id) || {}).name).filter(Boolean);

    // Then vs now: a scattered 2026, a tighter 2040 with new teal corners.
    const then = [[40, 50, 14], [90, 38, 18], [112, 92, 12], [52, 102, 16], [80, 72, 10], [26, 82, 8], [124, 56, 9]];
    const nowCore = [[222, 76, 24], [248, 98, 13], [204, 100, 10]];
    const nowNew = [[178, 42, 9], [272, 44, 10], [288, 104, 8], [184, 128, 9], [252, 132, 8]];
    const tvn = '<svg class="tvn" viewBox="0 0 300 160" aria-hidden="true">' +
      then.map((b, k) => '<circle class="pop" style="--d:' + k + '" cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[2] + '" fill="var(--coral)" fill-opacity=".8"/>').join('') +
      nowCore.map((b, k) => '<circle class="pop" style="--d:' + (k + 7) + '" cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[2] + '" fill="var(--coral)"/>').join('') +
      nowNew.map((b, k) => '<circle class="pop" style="--d:' + (k + 10) + '" cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[2] + '" fill="var(--teal-light)"/>').join('') +
      '<line x1="150" y1="20" x2="150" y2="140" stroke="currentColor" stroke-opacity=".2" stroke-dasharray="0.1 6" stroke-linecap="round" stroke-width="2"/>' +
      '<text x="75" y="156" text-anchor="middle">2026</text><text x="230" y="156" text-anchor="middle">2040</text></svg>';

    const el = story({
      theme: 'dark',
      path: 'wrapped',
      pathColor: 'rgba(226,103,74,.55)',
      onClose: () => App.back('recaps'),
      onEnd: () => {},
      slides: [
        { html: '<p class="eyebrow rv">Detour Wrapped 2040</p>' + '<h1 class="story__big story__big--xl rv" style="--d:1">Your year, in detours.</h1>' +
            '<p class="story__sub rv" style="--d:2">Seven cards. All about you, ' + D.user.name + '.</p>' },
        { html: '<p class="story__line rv">Your agent made <b class="hl" data-c1>0%</b> of your choices.</p>' +
            '<p class="story__line rv" style="--d:5">You made <b data-c2>0%</b>…</p>' +
            '<p class="story__line rv" style="--d:9">…but by December, you made</p>' +
            '<p class="story__huge rv" style="--d:10" data-c3>19%</p>',
          onEnter: sl => {
            Anim.countUp($(sl, '[data-c1]'), N.agentYear, { suffix: '%', duration: 900, delay: 150 });
            Anim.countUp($(sl, '[data-c2]'), N.ocrYear, { suffix: '%', duration: 700, delay: 850 });
            Anim.countUp($(sl, '[data-c3]'), N.ocrDecember, { from: N.ocrYear, suffix: '%', duration: 1300, delay: 1700 });
          } },
        { html: '<p class="eyebrow rv">Then vs now</p><h2 class="story__mid rv" style="--d:1">Your taste got cosier. Then it got curious.</h2>' +
            '<div class="rv" style="--d:2">' + tvn + '</div>' +
            '<p class="story__sub rv" style="--d:4">2026 was all over the map. 2040 has a tighter centre, plus <b class="teal">5 new corners</b> you opened this year.</p>' },
        { html: '<p class="eyebrow rv">Firsts</p><h2 class="story__big rv" style="--d:1"><span class="hl">' + N.firstsYear + '</span> firsts.</h2>' +
            '<ul class="firsts">' + W.firsts.map((f, k) => '<li class="rv" style="--d:' + (k * 0.7 + 2).toFixed(1) + '">' + f + '</li>').join('') + '</ul>' },
        { html: '<p class="eyebrow rv">The road not taken</p>' +
            '<div class="road rv" style="--d:1"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54" fill="var(--teal)" fill-opacity=".12" stroke="var(--teal-light)" stroke-width="2" stroke-dasharray="5 6" stroke-linecap="round"/></svg><span>' + W.road.area + '</span></div>' +
            '<p class="story__mid rv" style="--d:2">' + W.road.line + '</p>' +
            '<p class="story__sub rv" style="--d:3">' + W.road.nudge + '</p>' },
        { html: '<p class="eyebrow rv">Do it yourself</p><p class="story__huge rv" style="--d:1" data-c>0</p>' +
            '<h2 class="story__big rv" style="--d:2">meals, cooked by you.</h2>' +
            '<p class="story__sub rv" style="--d:3">Up from ' + N.mealsLastYear + ' last year. The 2031 dal is officially back.</p>',
          onEnter: sl => Anim.countUp($(sl, '[data-c]'), N.mealsYear, { duration: 1200, delay: 300 }) },
        { cls: 'story__slide--share',
          html: '<p class="eyebrow rv">Share, if you like</p>' +
            '<div class="share-card rv" style="--d:1">' + wordmark(22) + '<p class="share-card__t">' + D.user.name + '\'s 2040, in detours</p><ul data-lines></ul></div>' +
            '<p class="share__label rv" style="--d:2">Nothing is shared unless you switch it on.</p>' +
            '<div class="share__opts rv" style="--d:2">' + W.share.map(o =>
              '<label class="share__opt"><span>' + o.label + '</span>' + switchHTML('data-share="' + o.id + '"', !!s.share[o.id]) + '</label>').join('') + '</div>' +
            '<div class="share__btns rv" style="--d:3"><button type="button" class="btn btn--primary btn--block" data-share-btn>' + icon('share', 18) + 'Share</button>' +
            '<button type="button" class="btn btn--quiet btn--block" data-back="recaps">Done</button></div>' }
      ]
    });

    function paintShare() {
      const lines = W.share.filter(o => s.share[o.id]).map(o => o.id === 'skills' ? 'Skills I kept: ' + skillNames.join(' and ').toLowerCase() : o.value);
      $(el, '[data-lines]').innerHTML = lines.length
        ? lines.map(l => '<li>' + icon('check', 14) + l + '</li>').join('')
        : '<li class="share-card__empty">Nothing selected yet. Your year stays yours until you pick something.</li>';
    }
    $$(el, '[data-share]').forEach(inp => inp.addEventListener('change', () => {
      s.share[inp.dataset.share] = inp.checked; App.save(); paintShare();
    }));
    $(el, '[data-share-btn]').addEventListener('click', () => {
      const any = W.share.some(o => s.share[o.id]);
      Anim.toast(any ? 'Copied to share' : 'Pick at least one thing to share first.');
    });
    paintShare();
    ctx.onEnter(() => el.story.start());
    return el;
  };

  /* =========================================================
     12. Profile and privacy
     ========================================================= */
  Screens.profile = function () {
    const s = st();
    const el = h(
      '<section class="profile"><div class="scroll">' +
        '<header class="profile__head"><span class="avatar avatar--lg">' + D.user.initial + '</span>' +
          '<div><h1 class="h2">' + D.user.name + '</h1><p class="muted">' + D.user.city + ' · with Detour since ' + D.user.since + '</p></div></header>' +

        '<section class="stack-8"><h2 class="h3">Morning pick</h2><div class="card rows">' +
          '<label class="row">' + icon('bell', 20) + '<span class="row__t">One pick a day, at most</span>' + switchHTML('data-notif', s.notifOn) + '</label>' +
          '<div class="row row--col"><span class="row__t">Time</span><div class="times" role="radiogroup" aria-label="Morning time">' + D.notifTimes.map(t =>
            '<button type="button" class="time" role="radio" data-time="' + t + '">' + t + '</button>').join('') + '</div></div>' +
        '</div><p class="fine">Never at night. Never more than one.</p></section>' +

        '<section class="stack-8"><h2 class="h3">What Detour can read</h2><div class="card rows">' + D.categories.map(c =>
          '<label class="row">' + icon(c.icon, 20) + '<span class="row__t">' + c.label + '</span>' + switchHTML('data-cat="' + c.id + '"', s.categories[c.id]) + '</label>').join('') +
        '</div></section>' +

        '<section class="stack-8"><h2 class="h3">Our promises</h2><div class="card promises">' + D.promises.map(p =>
          '<p>' + icon('shield', 20) + '<span>' + p + '</span></p>').join('') + '</div></section>' +

        '<section class="stack-8"><h2 class="h3">Your plan</h2><div class="plans">' +
          '<div class="plan is-current"><span class="chip chip--sm">Your plan</span><b>Free</b><span class="fine">Daily pick, Taste Map, monthly recaps, Wrapped.</span></div>' +
          '<button type="button" class="plan" data-toast="Plus isn\'t available in this prototype yet."><span class="chip chip--sm chip--soon">Coming soon</span><b>Plus</b><span class="fine">₹99 a month. Extra Wrapped cards, family plan, longer history.</span></button>' +
        '</div></section>' +

        '<section class="stack-8"><h2 class="h3">Coming soon</h2><div class="card rows">' +
          '<button type="button" class="row row--link" data-toast="Friends\' Picks is on the way."><span class="row__icon">' + icon('heart', 20) + '</span><span class="row__txt"><b>Friends\' Picks</b><span class="fine">A shelf of things your friends love</span></span><span class="chip chip--sm chip--soon">Soon</span></button>' +
          '<button type="button" class="row row--link" data-toast="Other Options is on the way."><span class="row__icon">' + icon('shuffle', 20) + '</span><span class="row__txt"><b>Other Options</b><span class="fine">See what else your agent could have picked</span></span><span class="chip chip--sm chip--soon">Soon</span></button>' +
        '</div></section>' +

        '<div class="stack-8 profile__foot">' +
          '<button type="button" class="btn btn--ghost btn--block" data-toast="In this prototype, your history stays linked.">Unlink agent history</button>' +
          '<button type="button" class="btn btn--quiet btn--block" data-replay>Replay the intro</button></div>' +
      '</div></section>'
    );
    function paintTimes() {
      $$(el, '[data-time]').forEach(b => {
        const on = b.dataset.time === s.notifTime;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-checked', on ? 'true' : 'false');
      });
      $(el, '.times').classList.toggle('is-off', !s.notifOn);
    }
    el.addEventListener('click', e => {
      const t = e.target.closest('[data-time]');
      if (t) {
        if (!s.notifOn) { Anim.toast('Turn the morning pick on first.'); return; }
        s.notifTime = t.dataset.time; App.save(); paintTimes();
        Anim.toast('Your pick will arrive at ' + s.notifTime + ' a.m.');
      }
      if (e.target.closest('[data-replay]')) App.reset();
    });
    $(el, '[data-notif]').addEventListener('change', e => {
      s.notifOn = e.target.checked; App.save(); paintTimes();
      Anim.toast(s.notifOn ? 'Morning pick on.' : 'Morning pick off. Detour will stay quiet.');
    });
    $$(el, '[data-cat]').forEach(inp => inp.addEventListener('change', () => {
      s.categories[inp.dataset.cat] = inp.checked; App.save();
      const label = D.categories.find(c => c.id === inp.dataset.cat).label;
      Anim.toast(inp.checked ? 'Detour can read ' + label + ' again.' : 'Detour will stop reading ' + label + '.');
    }));
    paintTimes();
    return el;
  };

  window.UI = { h, icon, wordmark, appIcon, dottedPath, story, openRedeem };
  window.Screens = Screens;
})();
