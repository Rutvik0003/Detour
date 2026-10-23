/* Detour prototype · reusable animation helpers (window.Anim). */
(function () {
  'use strict';

  const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduced() { return !!(mq && mq.matches); }

  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const fmt = n => Math.round(n).toLocaleString('en-IN');

  /* Count a number up inside el. */
  function countUp(el, to, opts) {
    if (!el) return;
    opts = opts || {};
    const from = opts.from || 0;
    const dur = opts.duration || 1200;
    const suffix = opts.suffix || '';
    const format = opts.format || fmt;
    if (reduced()) { el.textContent = format(to) + suffix; return; }
    el.textContent = format(from) + suffix;
    let start = null;
    const step = ts => {
      if (!el.isConnected) return;
      if (start === null) start = ts;
      const t = Math.min(1, (ts - start) / dur);
      el.textContent = format(from + (to - from) * easeOut(t)) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    setTimeout(() => requestAnimationFrame(step), opts.delay || 0);
  }

  /* Dotted paths are drawn by revealing a solid path inside a mask. */
  function pathLength(p) {
    if (p.__len) return p.__len;
    let len = 1000;
    try { len = p.getTotalLength() || 1000; } catch (e) { /* keep fallback */ }
    p.__len = len;
    p.style.strokeDasharray = len + ' ' + len;
    p.style.strokeDashoffset = len;
    return len;
  }
  function drawPath(p, opts) {
    if (!p) return;
    opts = opts || {};
    const len = pathLength(p);
    const frac = opts.to == null ? 1 : opts.to;
    if (reduced()) {
      p.style.transition = 'none';
      p.style.strokeDashoffset = len * (1 - frac);
      return;
    }
    void p.getBoundingClientRect();
    p.style.transition = 'stroke-dashoffset ' + (opts.duration || 1600) + 'ms cubic-bezier(.45,0,.25,1) ' + (opts.delay || 0) + 'ms';
    p.style.strokeDashoffset = len * (1 - frac);
  }

  /* Progress ring: circle with an r attribute. */
  function ring(circle, pct, opts) {
    if (!circle) return;
    const c = 2 * Math.PI * Number(circle.getAttribute('r'));
    circle.style.strokeDasharray = c;
    circle.style.strokeDashoffset = c;
    void circle.getBoundingClientRect();
    circle.style.transition = reduced() ? 'none' : 'stroke-dashoffset 1400ms cubic-bezier(.2,.7,.2,1) ' + ((opts && opts.delay) || 150) + 'ms';
    circle.style.strokeDashoffset = c * (1 - pct / 100);
  }

  function replayClass(el, cls) {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  let toastTimer = 0;
  function toast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    replayClass(t, 'is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-on'), 2600);
  }

  /* Lock-screen style notification that slides down from the top of the phone. */
  let notifTimer = 0;
  function notify(o) {
    const n = document.getElementById('notif');
    if (!n) return;
    const hide = () => n.classList.remove('is-on');
    n.innerHTML =
      '<span class="notif__icon">' + (o.iconHTML || '') + '</span>' +
      '<span class="notif__main">' +
        '<span class="notif__head"><span>Detour</span><span>now</span></span>' +
        '<span class="notif__title">' + o.title + '</span>' +
        '<span class="notif__body">' + o.body + '</span>' +
      '</span>';
    n.onclick = () => { hide(); if (o.onTap) o.onTap(); };
    n.setAttribute('aria-hidden', 'false');
    replayClass(n, 'is-on');
    clearTimeout(notifTimer);
    notifTimer = setTimeout(hide, 6500);
  }

  /* Drag-to-swipe card (mouse + touch through pointer events). */
  function swipeable(el, opts) {
    let startX = 0, startY = 0, dx = 0, dy = 0, active = false, done = false, pid = null;
    const yes = el.querySelector('[data-hint="yes"]');
    const no = el.querySelector('[data-hint="no"]');
    const scale = () => (opts.getScale && opts.getScale()) || 1;
    const hints = v => {
      if (yes) yes.style.opacity = Math.max(0, Math.min(1, v / 80));
      if (no) no.style.opacity = Math.max(0, Math.min(1, -v / 80));
    };

    el.addEventListener('pointerdown', e => {
      if (done || (e.button !== undefined && e.button !== 0)) return;
      active = true; pid = e.pointerId;
      startX = e.clientX; startY = e.clientY; dx = 0; dy = 0;
      try { el.setPointerCapture(pid); } catch (err) { /* ignore */ }
      el.style.transition = 'none';
      el.classList.add('is-dragging');
    });
    el.addEventListener('pointermove', e => {
      if (!active || e.pointerId !== pid) return;
      const s = scale();
      dx = (e.clientX - startX) / s;
      dy = (e.clientY - startY) / s;
      el.style.transform = 'translate(' + dx + 'px,' + dy * 0.25 + 'px) rotate(' + dx / 16 + 'deg)';
      hints(dx);
    });
    const end = () => {
      if (!active) return;
      active = false;
      el.classList.remove('is-dragging');
      if (Math.abs(dx) > 90) { fling(dx > 0 ? 'right' : 'left'); return; }
      el.style.transition = 'transform 320ms cubic-bezier(.2,.8,.2,1)';
      el.style.transform = '';
      hints(0);
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);

    function fling(dir) {
      if (done) return;
      done = true;
      const sign = dir === 'right' ? 1 : -1;
      hints(sign * 100);
      if (reduced()) {
        el.style.transition = 'opacity 220ms ease-out';
        el.style.opacity = '0';
      } else {
        el.style.transition = 'transform 400ms cubic-bezier(.2,.7,.3,1), opacity 400ms ease-out';
        el.style.transform = 'translate(' + sign * 460 + 'px,' + (dy * 0.25 - 24) + 'px) rotate(' + sign * 22 + 'deg)';
        el.style.opacity = '0';
      }
      setTimeout(() => opts.onDecide(dir), reduced() ? 220 : 330);
    }
    return { fling: fling };
  }

  window.Anim = {
    reduced, easeOut, easeInOut, countUp, drawPath, ring, replayClass, toast, notify, swipeable,
    wait: ms => new Promise(r => setTimeout(r, ms))
  };
})();
