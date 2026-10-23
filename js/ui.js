/* Detour prototype · shared UI components (window.UI).
   Screens live in screens-onboard.js, screens-app.js and screens-friends.js and register on window.Screens. */
(function () {
  'use strict';
  const D = window.DETOUR_DATA;
  const T = D.text;
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
  /* Fill {placeholders} in a text string. */
  function fill(str, vars) {
    return String(str).replace(/\{(\w+)\}/g, (m, k) => (vars && vars[k] != null ? vars[k] : m));
  }
  /* Pick the "with name" or "no name" version of a line. */
  function named(pair, vars) {
    const name = (st().profile.name || '').trim();
    return fill(name ? pair.name : pair.none, Object.assign({ name: esc(name) }, vars || {}));
  }
  const $ = (r, s) => r.querySelector(s);
  const $$ = (r, s) => Array.prototype.slice.call(r.querySelectorAll(s));
  const fmt = n => Number(n).toLocaleString('en-IN');

  /* ---------- icons: one outline style, 24px grid ---------- */
  const ICONS = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>',
    map: '<path d="M9 4L3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4z"/><path d="M9 4v14M15 6v14"/>',
    hand: '<path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12"/><path d="M11 11.5V5a1.5 1.5 0 0 1 3 0v6.5"/><path d="M14 11.5V7a1.5 1.5 0 0 1 3 0v7.5a6.5 6.5 0 0 1-6.5 6.5h-.6a6 6 0 0 1-4.8-2.4L3 15.5a1.5 1.5 0 0 1 2.3-1.9L8 16"/>',
    book: '<path d="M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3z"/><path d="M21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    chip: '<rect x="6" y="6" width="12" height="12" rx="2.5"/><path d="M9.5 2.5v3M14.5 2.5v3M9.5 18.5v3M14.5 18.5v3M2.5 9.5h3M2.5 14.5h3M18.5 9.5h3M18.5 14.5h3"/><path d="M12 9.5l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8z"/>',
    arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    chevronLeft: '<path d="M15 6l-6 6 6 6"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    shield: '<path d="M12 3l7.5 3v6c0 4.4-3.2 8.2-7.5 9-4.3-.8-7.5-4.6-7.5-9V6z"/><path d="M9 12l2 2 4-4"/>',
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
    pause: '<path d="M8 5v14M16 5v14"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    route: '<circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="6" r="2.2"/><path d="M8.2 18H14a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h5.8"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v4.5h-4.5"/>',
    star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.2"/>',
    pot: '<path d="M4 11h16v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M2 11h2M20 11h2M9 7.5c0-1.2 1-1.4 1-2.7M14 7.5c0-1.2 1-1.4 1-2.7"/>',
    swap: '<path d="M4 8h14M14 4l4 4-4 4"/><path d="M20 16H6M10 12l-4 4 4 4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    userPlus: '<circle cx="10" cy="8" r="3.5"/><path d="M3.5 20a6.5 6.5 0 0 1 13 0M19 8v6M16 11h6"/>',
    camera: '<rect x="3" y="6" width="18" height="14" rx="3"/><circle cx="12" cy="13" r="3.5"/><path d="M9 6l1.5-2.5h3L15 6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
    chat: '<path d="M4 18.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8z"/><path d="M8 9h8M8 12.5h5"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    download: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5"/><path d="M5 19h14"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>'
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

  /* ---------- the two parties: the agent (grey) and Detour (coral) ---------- */
  function agentTag() { return '<span class="agent-tag">' + icon('chip', 14) + T.agent + '</span>'; }
  function detourTag() { return '<span class="detour-tag"><i></i>' + T.detour + '</span>'; }

  /* ---------- friends ---------- */
  function avatar(c, size) {
    size = size || 44;
    return '<span class="avatar avatar--friend" style="background:' + c.color + ';width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * 0.42) + 'px">' + c.name.charAt(0) + '</span>';
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
    return '<button type="button" class="back" data-back="' + (target || '') + '">' + icon('chevronLeft', 20) + '<span>' + T.back + '</span></button>';
  }
  function sourceChip(src) {
    const s = D.sources[src];
    return '<span class="chip chip--' + s.cls + '">' + icon(s.icon, 14) + s.label + '</span>';
  }
  function freeChip() { return '<span class="chip chip--free">' + icon('leaf', 14) + T.options.free + '</span>'; }
  function switchHTML(attrs, checked) {
    return '<span class="switch"><input type="checkbox" ' + attrs + (checked ? ' checked' : '') + '><span></span></span>';
  }

  /* Onboarding top: Back + thin progress bar (or just Back when editing from Me). */
  function obHead(step, opts) {
    opts = opts || {};
    const back = opts.noBack ? '<span></span>' : backBtn(opts.backTo || '');
    const bar = opts.edit ? '' : '<div class="ob-progress" role="progressbar" aria-valuemin="1" aria-valuemax="11" aria-valuenow="' + step + '"><i style="width:' + (step / 11 * 100) + '%"></i></div>';
    return '<div class="ob-top">' + back + bar + '</div>';
  }

  /* ---------- quiz and recap illustrations (simple line drawings) ---------- */
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
    linen: g0 +
      '<path d="M92 30l-34 20 12 28 14-6v58h72V72l14 6 12-28-34-20c-2 10-12 17-28 17s-26-7-28-17z" fill="' + PAPER + '"/>' +
      '<path d="M120 47v83"/><path d="M58 50l12 28" stroke-width="5" stroke="' + TEAL + '" opacity=".35"/><path d="M182 50l-12 28" stroke-width="5" stroke="' + TEAL + '" opacity=".35"/>' +
      '<circle cx="120" cy="66" r="2" fill="' + INK + '"/><circle cx="120" cy="86" r="2" fill="' + INK + '"/><circle cx="120" cy="106" r="2" fill="' + INK + '"/>' +
      '<path d="M30 140h180" stroke-dasharray="0.1 8" stroke="' + CORAL + '"/></g>',
    park: g0 +
      '<circle cx="190" cy="34" r="14" fill="#F6D7A7"/>' +
      '<circle cx="62" cy="62" r="26" fill="#BFD9C9"/><path d="M62 88v40"/>' +
      '<circle cx="150" cy="70" r="20" fill="#BFD9C9"/><path d="M150 90v38"/>' +
      '<path d="M104 128c6-30 2-60 8-92M112 128c-2-24 6-50 2-76" stroke="' + TEAL + '"/>' +
      '<path d="M20 132c40-12 80 8 120-2s60-10 80 0" stroke-dasharray="0.1 8" stroke="' + CORAL + '"/></g>',
    sea: g0 +
      '<circle cx="120" cy="70" r="26" fill="#F6D7A7"/>' +
      '<path d="M20 96h200" />' +
      '<path d="M24 112c12-8 24 8 36 0s24 8 36 0 24 8 36 0 24 8 36 0 24 8 36 0" stroke="' + TEAL + '"/>' +
      '<path d="M40 130c12-8 24 8 36 0s24 8 36 0 24 8 36 0 24 8 36 0" stroke="' + TEAL + '" opacity=".6"/>' +
      '<path d="M170 40l10-6 10 6M60 46l8-5 8 5" stroke="' + INK + '" stroke-width="2"/></g>',
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
      '<circle cx="176" cy="80" r="16" fill="' + PAPER + '"/><circle cx="176" cy="80" r="7" fill="#F3D2A8" stroke-width="1.8"/></g>',
    plate: g0 +
      '<ellipse cx="120" cy="104" rx="84" ry="22" fill="' + PAPER + '"/>' +
      '<path d="M66 100c0-26 24-44 54-44s54 18 54 44" fill="#F3D2A8"/>' +
      '<circle cx="98" cy="84" r="5" fill="' + CORAL + '" stroke="none"/><circle cx="124" cy="76" r="5" fill="' + TEAL + '" stroke="none"/><circle cx="146" cy="88" r="5" fill="' + CORAL + '" stroke="none"/>' +
      '<path d="M100 44c0-8 8-8 8-16M124 44c0-8 8-8 8-16" stroke="' + CORAL + '"/></g>'
  };

  /* ---------- story player: shared by 2026 recap, monthly recap, Wrapped ---------- */
  function story(opts) {
    const n = opts.slides.length;
    let idx = -1;
    const el = h(
      '<section class="story story--' + opts.theme + '">' +
        (opts.path ? '<div class="story__path">' + dottedPath(opts.path, { draw: true, par: 'xMidYMid slice', color: opts.pathColor, width: 3, gap: 10 }) + '</div>' : '') +
        '<div class="story__bars">' + opts.slides.map(() => '<span class="story__bar"><i></i></span>').join('') + '</div>' +
        '<button type="button" class="story__close" aria-label="' + T.close + '">' + icon('close', 22) + '</button>' +
        '<div class="story__stage" aria-live="polite"></div>' +
        '<button type="button" class="story__hint">' + T.story.tap + icon('chevron', 14) + '</button>' +
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
    const hint = $(el, '.story__hint');
    function show(k) {
      if (k < 0) return;
      if (k >= n) { if (opts.onEnd) opts.onEnd(); return; }
      idx = k;
      slides.forEach((sl, j) => sl.classList.toggle('is-active', j === k));
      bars.forEach((b, j) => { b.classList.toggle('is-done', j < k); b.classList.toggle('is-current', j === k); });
      hint.classList.toggle('is-gone', k > 0);
      hint.tabIndex = k > 0 ? -1 : 0;
      if (reveal) Anim.drawPath(reveal, { to: (k + 1) / n, duration: 1100 });
      if (opts.slides[k].onEnter) opts.slides[k].onEnter(slides[k]);
    }
    stage.addEventListener('click', e => {
      if (e.target.closest('button, a, input, label, .no-tap')) return;
      const r = stage.getBoundingClientRect();
      if ((e.clientX - r.left) / r.width < 0.28) show(idx - 1); else show(idx + 1);
    });
    hint.addEventListener('click', () => show(idx + 1));
    $(el, '.story__close').addEventListener('click', opts.onClose);
    el.story = { next: () => show(idx + 1), prev: () => show(idx - 1), start: () => show(0) };
    return el;
  }

  /* ---------- sharing: preview card, style choice, then a mock share sheet ---------- */
  function shareCard(item, style) {
    const S = D.share;
    const name = (st().profile.name || '').trim();
    return '<div class="scard scard--' + style + '">' +
      '<div class="scard__path">' + dottedPath('splash', { color: style === 'coral' ? 'rgba(255,255,255,.75)' : 'var(--coral)', width: 3, gap: 9 }) + '</div>' +
      '<p class="scard__big">' + S.lines[item.kind] + '</p>' +
      (item.title ? '<p class="scard__item">' + esc(item.title) + '</p>' : '') +
      '<p class="scard__date">' + D.today.short + (name ? ' · ' + esc(name) : '') + '</p>' +
      '<span class="scard__mark">' + wordmark(16) + '</span>' +
    '</div>';
  }

  function openShare(item) {
    const X = T.shareFlow;
    let style = 'paper';
    const box = h('<div class="sharesheet"></div>');
    const close = App.sheet(box);
    function stepPreview() {
      box.innerHTML =
        '<h2 class="h2">' + X.title + '</h2><p class="muted">' + X.sub + '</p>' +
        '<div class="sharesheet__preview">' + shareCard(item, style) + '</div>' +
        '<p class="h3">' + X.style + '</p>' +
        '<div class="seg" role="radiogroup">' + D.share.styles.map(s =>
          '<button type="button" role="radio" data-style="' + s.id + '" class="' + (s.id === style ? 'is-active' : '') + '" aria-checked="' + (s.id === style) + '">' + s.label + '</button>').join('') + '</div>' +
        '<button type="button" class="btn btn--primary btn--block" data-next>' + icon('share', 18) + X.next + '</button>';
    }
    function stepWhere() {
      box.innerHTML =
        '<h2 class="h2">' + X.whereTitle + '</h2><p class="muted">' + X.whereSub + '</p>' +
        '<div class="card rows">' + D.share.targets.map(t =>
          '<button type="button" class="row row--link" data-target="' + t.id + '"><span class="row__icon">' + icon(t.icon, 20) + '</span><span class="row__txt"><b>' + t.label + '</b></span>' + icon('chevron', 18) + '</button>').join('') + '</div>' +
        '<button type="button" class="btn btn--quiet btn--block" data-close>' + T.close + '</button>';
    }
    box.addEventListener('click', e => {
      const s = e.target.closest('[data-style]');
      if (s) { style = s.dataset.style; stepPreview(); return; }
      if (e.target.closest('[data-next]')) { stepWhere(); return; }
      if (e.target.closest('[data-close]')) { close(); return; }
      const t = e.target.closest('[data-target]');
      if (t) {
        const target = D.share.targets.find(x => x.id === t.dataset.target);
        st().shares.unshift({ kind: item.kind, title: item.title || '', style: style, where: target.label });
        App.save();
        close();
        Anim.toast(target.toast);
      }
    });
    stepPreview();
  }

  /* ---------- stamps ---------- */
  function openRedeem() {
    const S = T.stamps;
    const box = h(
      '<div class="redeem">' +
        '<h2 class="h2">' + S.sheetTitle + '</h2>' +
        '<p class="muted">' + S.sheetSub + '</p>' +
        '<ul class="redeem__list">' + D.redeem.map(r =>
          '<li class="redeem__row" data-id="' + r.id + '"><span class="redeem__icon">' + icon(r.icon, 20) + '</span>' +
          '<div class="redeem__txt"><b>' + r.title + '</b><span>' + r.desc + '</span></div>' +
          '<button type="button" class="redeem__btn"></button></li>').join('') +
        '</ul>' +
        '<p class="note">' + icon('shield', 16) + '<span>' + S.note + '</span></p>' +
        '<button type="button" class="btn btn--ghost btn--block" data-close>' + T.close + '</button>' +
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
        b.innerHTML = done ? icon('check', 14) + S.redeemed : icon('stamp', 14) + r.cost;
        b.setAttribute('aria-label', r.title + (done ? '' : ', ' + r.cost));
      });
    }
    box.addEventListener('click', e => {
      if (e.target.closest('[data-close]')) { close(); return; }
      const b = e.target.closest('.redeem__btn');
      if (!b) return;
      const r = D.redeem.find(x => x.id === b.closest('.redeem__row').dataset.id);
      const s = st();
      if (s.redeemed[r.id]) { Anim.toast(S.already); return; }
      if (s.stamps < r.cost) { Anim.toast(fill(S.short, { n: r.cost - s.stamps })); return; }
      s.stamps -= r.cost;
      s.redeemed[r.id] = true;
      App.save();
      App.emit('stamps', { from: s.stamps + r.cost, to: s.stamps });
      paint();
      Anim.toast(r.toast);
    });
    paint();
  }

  window.UI = {
    h, esc, fill, named, $, $$, fmt, icon, wordmark, appIcon, agentTag, detourTag, avatar, dottedPath, ringSVG,
    backBtn, sourceChip, freeChip, switchHTML, obHead, ART, story, shareCard, openShare, openRedeem
  };
  window.Screens = window.Screens || {};
})();
