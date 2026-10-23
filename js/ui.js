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
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    chevronLeft: '<path d="M15 6l-6 6 6 6"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    shield: '<path d="M12 3l7.5 3v6c0 4.4-3.2 8.2-7.5 9-4.3-.8-7.5-4.6-7.5-9V6z"/><path d="M9 12l2 2 4-4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
    pin: '<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    people: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6"/>',
    spark: '<path d="M12 3c.7 4.6 2.4 6.3 7 7-4.6.7-6.3 2.4-7 7-.7-4.6-2.4-6.3-7-7 4.6-.7 6.3-2.4 7-7z"/>',
    leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19l7-7"/>',
    stamp: '<path d="M9.5 3.5h5v3.2a2 2 0 0 1-.8 1.6l-.2.2V13h4.2A2.3 2.3 0 0 1 20 15.3V17H4v-1.7A2.3 2.3 0 0 1 6.3 13h4.2V8.5l-.2-.2a2 2 0 0 1-.8-1.6z"/><path d="M5 20.5h14"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    bowl: '<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8 7.5c0-1.4 1.3-1.5 1.3-3M13 7.5c0-1.4 1.3-1.5 1.3-3"/>',
    music: '<path d="M9 18V5.5l11-2V16"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    shirt: '<path d="M8.5 3.5L3.5 6.5l2 4.5 2.5-1v10.5h8V10l2.5 1 2-4.5-5-3c-.3 1.6-1.7 2.8-3.5 2.8S8.8 5.1 8.5 3.5z"/>',
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
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    userPlus: '<circle cx="10" cy="8" r="3.5"/><path d="M3.5 20a6.5 6.5 0 0 1 13 0M19 8v6M16 11h6"/>',
    camera: '<rect x="3" y="6" width="18" height="14" rx="3"/><circle cx="12" cy="13" r="3.5"/><path d="M9 6l1.5-2.5h3L15 6"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 9"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
    chat: '<path d="M4 18.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8z"/><path d="M8 9h8M8 12.5h5"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    download: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5"/><path d="M5 19h14"/>'
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

  function avatar(p, size) {
    size = size || 44;
    return '<span class="avatar avatar--friend" style="background:' + p.color + ';width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * 0.42) + 'px">' + p.name.charAt(0) + '</span>';
  }

  /* ---------- the three option sources, same colours everywhere ---------- */
  function sourceChip(src) {
    const s = D.sources[src];
    return '<span class="chip chip--src" style="--src:' + s.color + ';--srct:' + s.tint + '">' + icon(s.icon, 14) + s.label + '</span>';
  }
  const sourceDot = src => '<i class="srcdot" style="background:' + D.sources[src].color + '"></i>';
  function freeChip() { return '<span class="chip chip--free">' + icon('leaf', 14) + T.options.free + '</span>'; }

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
    const dots = '<path class="dpath__dots" d="' + p.d + '" fill="none" stroke="' + color + '" stroke-width="' + (o.width || 3) + '" stroke-linecap="round" stroke-dasharray="0.1 ' + (o.gap || 9) + '"' + (o.draw ? ' mask="url(#' + id + ')"' : '') + '/>';
    const mask = o.draw
      ? '<defs><mask id="' + id + '" maskUnits="userSpaceOnUse" x="-40" y="-40" width="' + (p.w + 80) + '" height="' + (p.h + 80) + '"><path class="dpath__reveal" d="' + p.d + '" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round"/></mask></defs>'
      : '';
    return '<svg class="dpath ' + (o.cls || '') + '" viewBox="0 0 ' + p.w + ' ' + p.h + '" preserveAspectRatio="' + (o.par || 'xMidYMid meet') + '" aria-hidden="true">' + mask + dots + '</svg>';
  }

  function ringSVG(size) {
    const r = size / 2 - 6;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" aria-hidden="true"><circle class="ring__bg" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '"/><circle class="ring__fg" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '"/></svg>';
  }

  function backBtn(target) {
    return '<button type="button" class="back" data-back="' + (target || '') + '">' + icon('chevronLeft', 20) + '<span>' + T.back + '</span></button>';
  }
  function switchHTML(attrs, checked) {
    return '<span class="switch"><input type="checkbox" ' + attrs + (checked ? ' checked' : '') + '><span></span></span>';
  }
  /* Onboarding top: Back + a thin 6-step progress bar. */
  function obHead(step, opts) {
    opts = opts || {};
    const back = opts.noBack ? '<span></span>' : backBtn(opts.backTo || '');
    return '<div class="ob-top">' + back + '<div class="ob-progress" role="progressbar" aria-valuemin="1" aria-valuemax="6" aria-valuenow="' + step + '"><i style="width:' + (step / 6 * 100) + '%"></i></div></div>';
  }
  function privacyNote() {
    return '<p class="note note--privacy">' + icon('shield', 16) + '<span>' + T.privacy + '</span></p>';
  }

  /* =========================================================
     Scenes: small drawings used as old photos (quiz), feed photos and feed videos.
     Anything with class "anim" moves only inside a playing video.
     ========================================================= */
  const steam = (x, y) => '<path class="anim anim-steam" d="M' + x + ' ' + y + 'c-10-14 10-22 0-38" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".75"/>';
  const bg = c => '<rect width="300" height="300" fill="' + c + '"/>';
  const SCENES = {
    curry: bg('#F3D2A8') + '<ellipse cx="150" cy="215" rx="118" ry="34" fill="#FFF8EC"/><path d="M58 200a92 56 0 0 0 184 0z" fill="#E2674A"/><ellipse cx="150" cy="200" rx="92" ry="22" fill="#D9822B"/><circle cx="118" cy="196" r="9" fill="#F4E3B2"/><circle cx="160" cy="204" r="7" fill="#7FB069"/><circle cx="186" cy="193" r="6" fill="#F4E3B2"/>' + steam(128, 160) + steam(172, 150),
    chai: bg('#E6CFB6') + '<rect x="0" y="210" width="300" height="90" fill="#B98C62"/><path d="M110 120h80l-10 110h-60z" fill="#FFF8EC" opacity=".85"/><path d="M116 150h68l-7 78h-54z" fill="#C9822B"/><ellipse cx="150" cy="232" rx="56" ry="10" fill="#8C5E3C" opacity=".4"/>' + steam(138, 108) + steam(162, 100),
    beach: '<rect width="300" height="160" fill="#F7C59F"/><circle class="anim anim-rise" cx="150" cy="150" r="42" fill="#F28C5B"/><rect y="150" width="300" height="70" fill="#4B8FA8"/><path class="anim anim-wave" d="M-40 180q20-10 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0" stroke="#D9ECE8" stroke-width="5" fill="none"/><path class="anim anim-wave2" d="M-40 200q20-10 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0" stroke="#D9ECE8" stroke-width="4" fill="none" opacity=".7"/><rect y="220" width="300" height="80" fill="#EBD3A8"/>',
    hills: '<rect width="300" height="300" fill="#D9E4E8"/><circle class="anim anim-rise" cx="210" cy="100" r="28" fill="#F6D7A7"/><path d="M0 230L80 120l60 70 50-90 110 130v70H0z" fill="#6E8F7A"/><path d="M0 260l70-60 80 40 70-50 80 60v50H0z" fill="#3E6B57"/><rect class="anim anim-drift" x="-60" y="150" width="160" height="22" rx="11" fill="#fff" opacity=".6"/>',
    market: bg('#2B2340') + '<path d="M20 60q130 40 260 0" stroke="#F6D7A7" stroke-width="2" fill="none"/>' + [40, 80, 120, 160, 200, 240].map((x, i) => '<circle class="anim anim-twinkle" style="animation-delay:-' + i * 0.3 + 's" cx="' + x + '" cy="' + (66 + (i % 3) * 6) + '" r="6" fill="#F6C66B"/>').join('') + '<rect x="30" y="150" width="110" height="90" fill="#E2674A"/><path d="M24 150l63-36 63 36z" fill="#F7C59F"/><rect x="160" y="160" width="110" height="80" fill="#1E7A72"/><path d="M154 160l61-32 61 32z" fill="#D9ECE8"/><rect y="240" width="300" height="60" fill="#3A2F52"/>',
    cycle: '<rect width="300" height="300" fill="#FCE3C8"/><circle cx="230" cy="80" r="30" fill="#F6B26B"/><rect y="220" width="300" height="80" fill="#9C8F7A"/><path class="anim anim-road" d="M-20 260h60M80 260h60M180 260h60M280 260h60" stroke="#F6EFE4" stroke-width="5"/><g class="anim anim-bob"><circle cx="100" cy="200" r="30" fill="none" stroke="#1F1B16" stroke-width="6"/><circle cx="200" cy="200" r="30" fill="none" stroke="#1F1B16" stroke-width="6"/><path d="M100 200l40-50h50l10 50M140 150l20 50h40M185 150l-8-20h-18" stroke="#E2674A" stroke-width="7" fill="none" stroke-linejoin="round"/></g>',
    rain: '<rect width="300" height="300" fill="#8FA3B0"/><rect y="230" width="300" height="70" fill="#5E7180"/><path d="M80 170a70 60 0 0 1 140 0z" fill="#E2674A"/><path d="M150 170v70q0 14-14 14" stroke="#1F1B16" stroke-width="5" fill="none"/>' + [30, 70, 110, 190, 230, 270, 50, 250].map((x, i) => '<path class="anim anim-rain" style="animation-delay:-' + i * 0.17 + 's" d="M' + x + ' ' + (20 + (i % 4) * 25) + 'l-8 22" stroke="#E6EEF2" stroke-width="3" stroke-linecap="round"/>').join(''),
    books: bg('#E9DCC8') + '<rect x="30" y="220" width="240" height="14" fill="#8C5E3C"/>' + [['#E2674A', 40, 90], ['#1E7A72', 72, 110], ['#4B5BA8', 100, 80], ['#C9822B', 130, 120], ['#8A6BB8', 160, 95], ['#2F6E9E', 190, 105], ['#B5683A', 222, 85]].map(b => '<rect x="' + b[1] + '" y="' + (220 - b[2]) + '" width="26" height="' + b[2] + '" rx="3" fill="' + b[0] + '"/>').join('') + '<circle cx="240" cy="70" r="20" fill="#F6D7A7" opacity=".9"/>',
    park: '<rect width="300" height="300" fill="#E4EEDF"/><rect y="220" width="300" height="80" fill="#A9C99A"/><circle cx="80" cy="140" r="50" fill="#5E9C6B"/><rect x="74" y="170" width="12" height="60" fill="#7A5A3A"/><circle cx="220" cy="150" r="40" fill="#3E8E6B"/><rect x="214" y="175" width="12" height="50" fill="#7A5A3A"/><path d="M120 300q30-60 10-90" stroke="#F6EFE4" stroke-width="18" fill="none"/>',
    street: bg('#F2C9A0') + '<rect x="50" y="120" width="200" height="100" rx="8" fill="#C9533A"/><rect x="40" y="100" width="220" height="24" rx="6" fill="#F6D7A7"/><circle cx="100" cy="240" r="22" fill="#1F1B16"/><circle cx="200" cy="240" r="22" fill="#1F1B16"/><ellipse cx="150" cy="120" rx="40" ry="10" fill="#FFF8EC"/>' + steam(140, 92) + steam(162, 86),
    noodles: bg('#F6D7A7') + '<path d="M60 160a90 70 0 0 0 180 0z" fill="#E2674A"/><ellipse cx="150" cy="160" rx="90" ry="20" fill="#F4E3B2"/><path d="M90 160q15-20 30 0t30 0 30 0 30 0" stroke="#E8B04A" stroke-width="6" fill="none"/>' + steam(130, 120) + steam(168, 112),
    phone: bg('#D9E4E8') + '<rect x="95" y="40" width="110" height="220" rx="18" fill="#1F1B16"/><rect x="103" y="56" width="94" height="186" rx="8" fill="#F6EFE4"/><rect x="112" y="80" width="60" height="18" rx="9" fill="#4B5BA8"/><rect x="128" y="108" width="60" height="18" rx="9" fill="#E2674A"/><rect x="112" y="136" width="50" height="18" rx="9" fill="#4B5BA8"/><rect x="138" y="164" width="50" height="18" rx="9" fill="#E2674A"/>',
    tv: bg('#3A3326') + '<rect x="50" y="60" width="200" height="130" rx="12" fill="#1F1B16"/><rect x="62" y="72" width="176" height="106" fill="#6FA35C"/><rect x="146" y="100" width="4" height="40" fill="#F6EFE4"/><rect x="154" y="100" width="4" height="40" fill="#F6EFE4"/>' + [40, 80, 120, 160, 200, 240].map(x => '<circle cx="' + x + '" cy="250" r="22" fill="#1F1B16"/>').join(''),
    radio: bg('#E7D3B8') + '<rect x="60" y="110" width="180" height="120" rx="16" fill="#C9533A"/><circle cx="115" cy="170" r="34" fill="#F6EFE4"/><circle cx="115" cy="170" r="22" fill="#B5683A"/><rect x="170" y="140" width="50" height="10" rx="5" fill="#F6EFE4"/><rect x="170" y="160" width="50" height="10" rx="5" fill="#F6EFE4"/><path d="M90 110l60-40" stroke="#1F1B16" stroke-width="5"/><path class="anim anim-float" d="M230 80v-26l14 4" stroke="#1F1B16" stroke-width="4" fill="none"/><circle class="anim anim-float" cx="226" cy="82" r="6" fill="#1F1B16"/>',
    shirt: bg('#D9ECE8') + '<path d="M150 50l-12 14h24z" stroke="#1F1B16" stroke-width="4" fill="none"/><path d="M110 70l-50 28 16 40 20-8v110h108V130l20 8 16-40-50-28q-6 20-40 20t-40-20z" fill="#4B5BA8"/><path d="M150 90v148" stroke="#F6EFE4" stroke-width="3" stroke-dasharray="2 14"/>',
    cake: bg('#F3E3CF') + '<rect x="70" y="140" width="160" height="80" rx="18" fill="#B5683A"/><path d="M70 160q80-40 160 0" fill="#8C5E3C"/><ellipse cx="150" cy="230" rx="110" ry="14" fill="#FFF8EC"/>' + steam(150, 120)
  };
  function scene(key) {
    return '<svg class="scene" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + (SCENES[key] || SCENES.curry) + '</svg>';
  }

  /* An old photo: cream border, warm faded picture, handwritten caption, slight tilt. */
  function polaroid(item, opts) {
    opts = opts || {};
    const tilt = opts.tilt != null ? opts.tilt : ((item.id || '').length % 5 - 2) * 1.2;
    return '<figure class="polaroid' + (opts.cls ? ' ' + opts.cls : '') + '" style="--tilt:' + tilt + 'deg">' +
      '<div class="polaroid__img">' + scene(item.art) + '</div>' +
      (opts.caption ? '<figcaption class="polaroid__cap">' + opts.caption + '</figcaption>' : '') +
      '<span class="polaroid__stamp">' + T.quiz.stamp + '</span></figure>';
  }

  /* A feed photo or video. Real files from the device use <img>/<video>. */
  function media(m, id) {
    if (m.url) {
      return m.kind === 'video'
        ? '<div class="media media--file"><video src="' + m.url + '" controls playsinline muted loop></video></div>'
        : '<div class="media media--file"><img src="' + m.url + '" alt=""></div>';
    }
    if (m.kind === 'video') {
      return '<div class="media media--video" data-video="' + id + '">' + scene(m.art) +
        '<button type="button" class="media__play" data-play="' + id + '" aria-label="' + T.friends.play + '">' + icon('play', 26) + '</button>' +
        '<span class="media__bar"><i></i></span></div>';
    }
    return '<div class="media media--photo">' + scene(m.art) + '</div>';
  }

  /* =========================================================
     Story player: You at 18, monthly recap, Wrapped
     ========================================================= */
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

  /* "Then vs now" block for recaps. */
  function thenNow() {
    const X = T.thenNow;
    const age = 19;
    return '<div class="thennow"><div class="thennow__col"><p class="thennow__h">' + fill(X.then, { age: age }) + '</p>' +
      D.thenNow.map(p => '<p class="thennow__then">' + p.then + '</p>').join('') + '</div>' +
      '<div class="thennow__col"><p class="thennow__h">' + X.now + '</p>' +
      D.thenNow.map(p => '<p class="thennow__now">' + p.now + '</p>').join('') + '</div></div>';
  }

  /* =========================================================
     Sharing: preview, style, then a mock share sheet
     ========================================================= */
  function shareCard(item, style) {
    const name = (st().profile.name || '').trim();
    return '<div class="scard scard--' + style + '">' +
      '<div class="scard__path">' + dottedPath('splash', { color: style === 'coral' ? 'rgba(255,255,255,.75)' : 'var(--coral)', width: 3, gap: 9 }) + '</div>' +
      '<p class="scard__big">' + (item.line || D.share.lines[item.kind] || D.share.lines.self) + '</p>' +
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
      if (!t) return;
      const target = D.share.targets.find(x => x.id === t.dataset.target);
      const s2 = st();
      s2.shares.unshift({ kind: item.kind, title: item.title || '', line: item.line || '', style: style, where: target.label });
      if (target.id === 'feed') {
        s2.posts.unshift({ id: 'me-' + Date.now(), art: item.art || 'curry', kind: 'photo', tag: 'did',
          caption: (item.line || D.share.lines[item.kind] || '') + (item.title ? ' ' + item.title + '.' : ''), likes: 0, ago: 'now' });
      }
      App.save();
      close();
      Anim.toast(target.toast);
    });
    stepPreview();
  }

  /* ---------- stamps ---------- */
  function openRedeem() {
    const S = T.stamps;
    const box = h(
      '<div class="redeem"><h2 class="h2">' + S.sheetTitle + '</h2><p class="muted">' + S.sheetSub + '</p>' +
        '<ul class="redeem__list">' + D.redeem.map(r =>
          '<li class="redeem__row" data-id="' + r.id + '"><span class="redeem__icon">' + icon(r.icon, 20) + '</span>' +
          '<div class="redeem__txt"><b>' + r.title + '</b><span>' + r.desc + '</span></div>' +
          '<button type="button" class="redeem__btn"></button></li>').join('') + '</ul>' +
        '<p class="note">' + icon('shield', 16) + '<span>' + S.note + '</span></p>' +
        '<button type="button" class="btn btn--ghost btn--block" data-close>' + T.close + '</button></div>'
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
    h, esc, fill, named, $, $$, fmt, icon, wordmark, appIcon, agentTag, detourTag, avatar,
    sourceChip, sourceDot, freeChip, dottedPath, ringSVG, backBtn, switchHTML, obHead, privacyNote,
    scene, polaroid, media, story, thenNow, shareCard, openShare, openRedeem
  };
  window.Screens = {};
})();
