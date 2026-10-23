/* Detour prototype · the main app: Today, Your day, options sheet, Do It Yourself,
   Taste Map, More ideas, recaps, Wrapped, Me and Things you shared. One purpose per screen. */
(function () {
  'use strict';
  const D = window.DETOUR_DATA;
  const T = D.text;
  const st = () => window.App.state;
  const Screens = window.Screens;
  const UI = window.UI;
  const { h, esc, fill, named, $, $$, icon, wordmark, agentTag, detourTag, dottedPath, ringSVG, backBtn, sourceChip, freeChip, story } = UI;
  const EDIT = ' data-params=\'{"edit":true}\'';

  /* =========================================================
     The core moment: other options for one agent decision
     ========================================================= */
  UI.openOptions = function (id) {
    const ev = Model.event(id);
    if (!ev) return;
    const O = T.options;
    const opts = Model.optionsFor(ev);
    const box = h(
      '<div class="optsheet">' +
        '<div class="optsheet__head">' + detourTag() + '<h2 class="h2">' + fill(O.title, { x: ev.noun }) + '</h2></div>' +
        '<p class="agentpick">' + icon('chip', 18) + '<span>' + fill(O.picked, { x: esc(ev.pick), note: esc(ev.pickNote) }) + '</span></p>' +
        '<div class="optsheet__list">' + opts.map(o =>
          '<article class="card opt opt--sheet" data-opt="' + o.id + '">' +
            '<div class="opt__top">' + sourceChip(o.source) + (o.free ? freeChip() : '') + '</div>' +
            '<h3 class="opt__title">' + o.title + '</h3>' +
            '<p class="muted">' + o.line + '</p>' +
            '<p class="opt__meta">' + icon('clock', 14) + o.meta + '</p>' +
            '<div class="opt__row"><button type="button" class="btn btn--primary btn--sm" data-choose="swap">' + O.swap + '</button>' +
            '<button type="button" class="btn btn--ghost btn--sm" data-choose="self">' + O.self + '</button></div>' +
          '</article>').join('') +
        '</div>' +
        '<button type="button" class="btn btn--quiet btn--block" data-choose="keep">' + O.keep + '</button>' +
        '<p class="noads">' + icon('shield', 16) + '<span>' + O.noPaid + '</span></p>' +
      '</div>'
    );
    const close = App.sheet(box);
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-choose]');
      if (!b) return;
      const card = b.closest('[data-opt]');
      const opt = card ? opts.find(o => o.id === card.dataset.opt) : null;
      const choice = b.dataset.choose;
      Model.choose(id, choice, opt);
      App.save();
      close();
      App.emit('day');
      Anim.toast(choice === 'swap' ? O.swapToast : choice === 'self' ? O.selfToast : O.keepToast);
    });
  };

  /* =========================================================
     Today: only the latest moment
     ========================================================= */
  Screens.today = function (ctx) {
    const s = st();
    const X = T.today;
    const el = h(
      '<section class="today"><div class="scroll today__scroll">' +
        '<header class="today__head"><div><p class="eyebrow" data-when></p><h1 class="title" data-hello></h1></div>' +
          '<button type="button" class="avatar" data-go="me" aria-label="' + T.tabs.me + '" data-initial></button></header>' +
        '<p class="madecount">' + icon('check', 16) + '<span>' + X.made + '</span><b data-made></b></p>' +
        '<div data-swapbanner></div>' +
        '<div class="today__moment" data-moment aria-live="polite"></div>' +
        '<button type="button" class="seeday" data-go="day">' + X.seeDay + icon('arrowRight', 16) + '</button>' +
      '</div></section>'
    );

    function paintHead() {
      const clock = s.day.clock;
      $(el, '[data-when]').textContent = D.today.date.split(',')[0] + ' · ' + Model.fmtTime(clock);
      $(el, '[data-hello]').innerHTML = named(X.hello, { part: Model.dayPart(clock) });
      const n = Model.name();
      $(el, '[data-initial]').innerHTML = n ? esc(n.charAt(0).toUpperCase()) : icon('user', 20);
      const made = $(el, '[data-made]');
      const v = String(Model.madeToday());
      if (made.textContent && made.textContent !== v) Anim.replayClass(made, 'is-bump');
      made.textContent = v;
      const swapF = s.swap ? Model.contact(s.swap) : null;
      $(el, '[data-swapbanner]').innerHTML = swapF
        ? '<button type="button" class="swapbanner" data-go="swap">' + UI.avatar(swapF, 24) + '<span>' + fill(X.swapBanner, { name: swapF.name }) + '</span>' + icon('chevron', 16) + '</button>'
        : '';
    }

    function resultLine(e, ev) {
      if (e.status === 'diyDone') return X.diyDone;
      if (e.status === 'keep') return X.result.keep;
      return fill(X.result[e.status], { x: e.opt ? esc(e.opt.title) : '' });
    }

    function paintMoment() {
      const m = Model.todayMoment();
      const box = $(el, '[data-moment]');
      const e = m.entry;
      const ev = e ? Model.event(e.id) : null;
      let html;
      if (m.kind === 'open' && e.status === 'diyOpen') {
        html = '<article class="moment moment--diy">' +
          '<div class="moment__row">' + detourTag() + '<span class="moment__time">' + Model.fmtTime(e.time) + '</span></div>' +
          '<div class="moment__art">' + icon('pot', 36) + '</div>' +
          '<h2 class="moment__title">' + X.diyTitle + '</h2><p class="muted">' + X.diySub + '</p>' +
          '<button type="button" class="btn btn--primary btn--block" data-moment-act="in">' + X.diyIn + '</button>' +
          '<button type="button" class="btn btn--quiet btn--block" data-moment-act="not">' + X.diyNot + '</button></article>';
      } else if (m.kind === 'open') {
        const line = e.status === 'quietLimit' ? X.quietLimit : e.status === 'quietHours' ? X.quietHours : ev.detour;
        html = '<article class="moment">' +
          '<div class="moment__agent"><div class="moment__row">' + agentTag() + '<span class="moment__time">' + Model.fmtTime(e.time) + '</span></div>' +
            '<p class="moment__action">' + icon(ev.icon, 22) + '<span>' + ev.agent + '</span></p></div>' +
          '<div class="moment__detour">' + detourTag() + '<p class="moment__line' + (e.status !== 'notified' ? ' moment__line--quiet' : '') + '">' + line + '</p>' +
            '<button type="button" class="btn btn--primary btn--block" data-open="' + ev.id + '">' + X.seeOptions + '</button></div>' +
        '</article>';
      } else if (m.kind === 'result') {
        const canShare = e.status === 'self' || e.status === 'swap' || e.status === 'diyDone';
        const kind = e.status === 'diyDone' ? 'cooked' : e.status === 'self' ? 'self' : 'tried';
        const title = e.status === 'diyDone' ? D.diy.recipe.name : (e.opt ? e.opt.title : '');
        html = '<article class="moment moment--done">' +
          (e.status === 'diyDone' ? '<div class="moment__row">' + detourTag() + '<span class="moment__time">' + Model.fmtTime(e.time) + '</span></div>'
            : '<div class="moment__agent moment__agent--muted"><div class="moment__row">' + agentTag() + '<span class="moment__time">' + Model.fmtTime(e.time) + '</span></div>' +
              '<p class="moment__action">' + icon(ev.icon, 22) + '<span>' + ev.agent + '</span></p></div>') +
          '<p class="moment__result">' + icon(e.status === 'keep' ? 'check' : e.status === 'swap' ? 'swap' : 'hand', 20) + '<span>' + resultLine(e, ev) + '</span></p>' +
          '<div class="moment__actions">' +
            (canShare ? '<button type="button" class="btn btn--soft btn--sm" data-share="' + kind + '" data-title="' + esc(title) + '">' + icon('share', 16) + X.share + '</button>' : '') +
            (e.status !== 'diyDone' ? '<button type="button" class="btn btn--quiet btn--sm" data-open="' + ev.id + '">' + X.change + '</button>' : '') +
          '</div></article>';
      } else {
        const latest = e && ev && ev.agent ? '<p class="calm__latest">' + icon('chip', 14) + fill(X.latest, { x: ev.agent.charAt(0).toLowerCase() + ev.agent.slice(1) }) + '</p>' : '';
        html = '<article class="moment moment--calm">' +
          '<div class="calm__art">' + dottedPath('mini', { gap: 7, width: 3, color: 'var(--teal)' }) + '</div>' +
          '<h2 class="calm__t">' + X.calmTitle + '</h2><p class="calm__s">' + X.calmSub + '</p>' +
          '<p class="fine">' + X.calmHint + '</p>' + latest + '</article>';
      }
      box.innerHTML = html;
    }

    el.addEventListener('click', e => {
      const o = e.target.closest('[data-open]');
      if (o) { UI.openOptions(o.dataset.open); return; }
      const a = e.target.closest('[data-moment-act]');
      if (a) {
        if (a.dataset.momentAct === 'in') { s.diy = s.diy === 'done' ? 'done' : 'in'; App.save(); App.go('diy'); }
        else { Model.markDiy('diySkip'); App.save(); App.emit('day'); Anim.toast(X.diySkipped); }
        return;
      }
      const sh = e.target.closest('[data-share]');
      if (sh) UI.openShare({ kind: sh.dataset.share, title: sh.dataset.title });
    });
    const offs = [App.on('day', () => { paintHead(); paintMoment(); }), App.on('clock', paintHead)];
    ctx.onLeave(() => offs.forEach(f => f()));
    paintHead();
    paintMoment();
    return el;
  };

  /* =========================================================
     Your day: the full log
     ========================================================= */
  Screens.day = function (ctx) {
    const s = st();
    const X = T.log;
    const el = h(
      '<section class="daylog"><div class="scroll">' + backBtn() +
        '<header class="stack-8"><h1 class="title">' + X.title + '</h1><p class="muted">' + X.sub + '</p></header>' +
        '<p class="daycount" data-count></p>' +
        '<ol class="timeline" data-list></ol>' +
      '</div></section>'
    );
    function line(e, ev) {
      const S = X.status;
      switch (e.status) {
        case 'off': return fill(S.off, { x: Model.catLabel(ev.cat) });
        case 'swap': case 'self': return fill(S[e.status], { x: e.opt ? esc(e.opt.title) : '' });
        case 'went': return (e.quiet ? S[e.quiet === 'limit' ? 'quietLimit' : 'quietHours'] + '. ' : '') + (ev.wentAhead || S.info);
        default: return S[e.status] || '';
      }
    }
    function paint() {
      $(el, '[data-count]').innerHTML = icon('bell', 16) + '<span>' + fill(X.count, { n: s.day.sent, max: s.notif.limit }) + '</span>';
      const log = s.day.log;
      $(el, '[data-list]').innerHTML = log.length ? log.map(e => {
        const ev = Model.event(e.id);
        const tone = ['swap', 'self', 'diyDone'].indexOf(e.status) > -1 ? 'good'
          : ['notified', 'diyOpen'].indexOf(e.status) > -1 ? 'detour'
            : ['quietLimit', 'quietHours'].indexOf(e.status) > -1 || e.quiet ? 'quiet' : 'plain';
        const open = Model.isOpen(e) && e.status !== 'diyOpen';
        return '<li class="tl tl--' + tone + '"><span class="tl__time">' + Model.fmtTime(e.time) + '</span>' +
          '<div class="tl__body">' +
            (ev.type === 'diy' ? '<p class="tl__agent tl__agent--detour">' + detourTag() + '</p>'
              : '<p class="tl__agent">' + icon('chip', 14) + '<span>' + ev.agent + '</span></p>') +
            '<p class="tl__status">' + line(e, ev) + '</p>' +
            (open ? '<button type="button" class="btn btn--soft btn--xs" data-open="' + e.id + '">' + X.see + '</button>' : '') +
          '</div></li>';
      }).join('') : '<li class="tl tl--empty"><p class="muted">' + X.empty + '</p></li>';
    }
    el.addEventListener('click', e => {
      const o = e.target.closest('[data-open]');
      if (o) UI.openOptions(o.dataset.open);
    });
    const off = App.on('day', paint);
    ctx.onLeave(off);
    paint();
    return el;
  };

  /* =========================================================
     Do It Yourself: today's challenge only
     ========================================================= */
  Screens.diy = function (ctx) {
    const s = st();
    const C = D.diy;
    const X = T.diy;
    const N = D.numbers;
    const timers = [];
    ctx.onLeave(() => timers.forEach(clearTimeout));
    const skillNames = s.skills.map(id => (D.skills.find(k => k.id === id) || {}).name).filter(Boolean).join(', ');
    const el = h(
      '<section class="diy"><div class="scroll">' +
        '<header class="stack-8"><h1 class="title">' + X.title + '</h1><p class="muted">' + X.sub + '</p></header>' +
        '<article class="card diy-card" data-card aria-live="polite"></article>' +
        '<div class="quietrows">' +
          '<button type="button" class="quietrow" data-go="skills"' + EDIT + '>' + icon('hand', 18) + '<span><b>' + X.skillsRow + '</b> · ' + skillNames + '</span>' + icon('chevron', 16) + '</button>' +
          '<button type="button" class="quietrow" data-redeem>' + icon('stamp', 18) + '<span>' + fill(X.stampsRow, { n: '<b data-stamps>' + s.stamps + '</b>' }) + '</span>' + icon('chevron', 16) + '</button>' +
        '</div>' +
      '</div></section>'
    );
    const card = $(el, '[data-card]');

    function renderCard(animate) {
      const state = s.diy;
      let html = '';
      if (state === 'idle') {
        html = '<p class="eyebrow">' + X.idleEyebrow + '</p><h2 class="h2">' + X.idleTitle + '</h2><p class="muted">' + X.idleLine + '</p>' +
          '<div class="recipe">' + icon('pot', 22) + '<div><b>' + C.recipe.name + '</b><span>' + C.recipe.meta + '</span></div></div>' +
          '<button type="button" class="btn btn--primary btn--block" data-act="in">' + X.in + '</button>' +
          '<button type="button" class="btn btn--quiet btn--block" data-act="later">' + X.later + '</button>';
      } else if (state === 'in') {
        html = '<p class="eyebrow eyebrow--live"><i class="pulse"></i>' + X.cookingEyebrow + '</p><h2 class="h2">' + X.cookingTitle + '</h2>' +
          '<p class="muted">' + X.cookingLine + '</p>' +
          '<ul class="steps">' + C.steps.map((t, k) =>
            '<li><button type="button" class="step' + (s.diySteps[k] ? ' is-on' : '') + '" data-step="' + k + '" aria-pressed="' + (s.diySteps[k] ? 'true' : 'false') + '"><span class="step__box">' + icon('check', 14) + '</span><span>' + t + '</span></button></li>').join('') +
          '</ul>' +
          '<button type="button" class="btn btn--primary btn--block" data-act="did">' + X.did + '</button>' +
          '<button type="button" class="btn btn--quiet btn--block" data-act="cancel">' + X.cancel + '</button>';
      } else if (state === 'verify') {
        html = '<p class="eyebrow">' + X.checkEyebrow + '</p><h2 class="h2">' + X.checkTitle + '</h2>' +
          '<ul class="checks">' + C.checks.map((c, k) =>
            '<li class="check" data-check="' + k + '"><span class="check__dot">' + icon('check', 14) + '</span><span class="check__t">' + (c.wait || c.done) + '</span></li>').join('') + '</ul>' +
          '<div class="confirm-wrap"><button type="button" class="btn btn--primary btn--block" data-act="confirm">' + X.confirm + '</button>' +
          '<p class="fine center">' + X.checkFine + '</p></div>';
      } else {
        html = '<div class="stamp' + (animate ? ' is-pressed' : '') + '" aria-hidden="true"><span>' + X.stampWords[0] + '<b>+' + N.stampReward + '</b>' + X.stampWords[1] + '</span></div>' +
          '<div class="diy-done__head"><p class="eyebrow">' + X.doneEyebrow + '</p><h2 class="h2">' + X.doneTitle + '</h2>' +
          '<p class="muted">' + fill(X.doneLine, { n: s.mealsMonth }) + '</p></div>' +
          '<p class="earned">' + icon('stamp', 18) + fill(X.earned, { n: N.stampReward }) + '</p>' +
          '<button type="button" class="btn btn--primary btn--block" data-share-diy>' + icon('share', 18) + T.today.share + '</button>';
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

    card.addEventListener('click', e => {
      const step = e.target.closest('[data-step]');
      if (step) {
        const k = step.dataset.step;
        s.diySteps[k] = !s.diySteps[k]; App.save();
        step.classList.toggle('is-on', !!s.diySteps[k]);
        step.setAttribute('aria-pressed', s.diySteps[k] ? 'true' : 'false');
        return;
      }
      if (e.target.closest('[data-share-diy]')) { UI.openShare({ kind: 'cooked', title: C.recipe.name }); return; }
      const a = e.target.closest('[data-act]');
      if (!a) return;
      const act = a.dataset.act;
      if (act === 'later') { Anim.toast(X.laterToast); return; }
      if (act === 'in') s.diy = 'in';
      if (act === 'cancel') { s.diy = 'idle'; Model.markDiy('diySkip'); Anim.toast(X.cancelToast); }
      if (act === 'did') s.diy = 'verify';
      if (act === 'confirm') {
        const from = s.stamps;
        s.diy = 'done';
        s.stamps += N.stampReward;
        s.mealsMonth = N.mealsMonthStart + 1;
        Model.markDiy('diyDone');
        App.save();
        renderCard(true);
        App.emit('day');
        timers.push(setTimeout(() => App.emit('stamps', { from: from, to: s.stamps }), Anim.reduced() ? 0 : 650));
        return;
      }
      App.save();
      App.emit('day');
      renderCard(false);
    });

    const off = App.on('stamps', d => $$(el, '[data-stamps]').forEach(n => Anim.countUp(n, d.to, { from: d.from, duration: 700 })));
    ctx.onLeave(off);
    renderCard(false);
    return el;
  };

  /* =========================================================
     Taste Map (only the categories you turned on)
     ========================================================= */
  Screens.map = function (ctx) {
    const s = st();
    const TM = D.tasteMap;
    const X = T.map;
    const cats = TM.cats.filter(c => s.categories[c]);
    let cat = ctx.params.cat && cats.indexOf(ctx.params.cat) > -1 ? ctx.params.cat : cats[0];
    let t = 1, raf = 0;
    if (!cat) {
      return h('<section class="mapscreen"><div class="scroll"><header class="stack-8"><h1 class="title">' + X.title + '</h1><p class="muted">' + X.sub + '</p></header>' +
        '<p class="note">' + icon('info', 16) + '<span>' + X.none + '</span></p></div></section>');
    }
    const el = h(
      '<section class="mapscreen"><div class="scroll">' +
        '<header class="stack-8"><h1 class="title">' + X.title + '</h1><p class="muted">' + X.sub + '</p></header>' +
        (cats.length > 1 ? '<div class="seg" role="tablist">' + cats.map(c =>
          '<button type="button" role="tab" data-cat="' + c + '">' + Model.catLabel(c) + '</button>').join('') + '</div>' : '') +
        '<div class="stack-12">' +
          '<div class="card map"><svg class="map__svg" viewBox="0 0 342 300" role="group" aria-label="' + X.title + '"></svg></div>' +
          '<div class="legend"><span><i class="lg lg--often"></i>' + X.often + '</span><span><i class="lg lg--used"></i>' + X.used + '</span><span><i class="lg lg--new"></i>' + X.never + '</span></div>' +
        '</div>' +
        '<p class="hint">' + icon('spark', 16) + '<span>' + X.hint + '</span></p>' +
        '<div class="card card--flat timeline">' +
          '<div class="timeline__top"><div><p class="eyebrow">' + X.yearLabel + '</p><p class="timeline__year" data-year>2040</p></div>' +
            '<button type="button" class="btn btn--ghost btn--sm" data-play>' + icon('play', 16) + X.replay + '</button></div>' +
          '<input class="range" type="range" min="0" max="1000" value="1000" aria-label="2026 to 2040">' +
          '<div class="timeline__ends"><span>2026</span><span>2040</span></div>' +
          '<p class="timeline__note" data-note></p>' +
        '</div>' +
      '</div></section>'
    );
    const svg = $(el, '.map__svg');
    const range = $(el, '.range');
    const lerp = (a, b, x) => a + (b - a) * x;

    function render() {
      const labels = TM.labels[cat];
      svg.innerHTML = '<circle class="map__area" cx="172" cy="156" r="150"/>' + TM.slots.map((sl, k) => {
        const lines = labels[k].split('\n');
        const isNew = sl.kind === 'unexplored';
        const all = isNew ? [X.tag].concat(lines) : lines;
        const y0 = -(all.length - 1) * 7 + 4;
        const text = all.map((ln, j) => '<tspan x="0" y="' + (y0 + j * 14) + '"' + (isNew && j === 0 ? ' class="tag"' : '') + '>' + esc(ln) + '</tspan>').join('');
        const nm = lines.join(' ');
        return '<g class="bub bub--' + sl.kind + '" transform="translate(' + sl.x + ' ' + sl.y + ')"' +
          (isNew ? ' role="button" aria-label="' + esc(nm) + '" data-area="' + esc(nm) + '"' : '') + '>' +
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
          g.style.opacity = Math.max(0, Math.min(1, (x - 0.35) / 0.6)).toFixed(2);
          const live = x > 0.6;
          g.classList.toggle('is-live', live);
          g.setAttribute('tabindex', live ? '0' : '-1');
        } else {
          c.setAttribute('r', lerp(sl.r0, sl.r1, x).toFixed(1));
          if (sl.kind === 'used') {
            c.setAttribute('fill-opacity', lerp(0.8, 0, x).toFixed(2));
            c.setAttribute('stroke-opacity', lerp(0, 0.4, x).toFixed(2));
            g.classList.toggle('is-faded', x > 0.5);
          } else c.setAttribute('fill-opacity', lerp(0.6, 0.95, x).toFixed(2));
        }
      });
      const area = $(svg, '.map__area');
      if (area) area.setAttribute('r', lerp(160, 96, x).toFixed(1));
      $(el, '[data-year]').textContent = Math.round(2026 + 14 * x);
      range.value = Math.round(x * 1000);
      range.style.setProperty('--p', (x * 100).toFixed(1) + '%');
      $(el, '[data-note]').textContent = x < 0.3 ? X.notes[0] : x < 0.85 ? X.notes[1] : X.notes[2];
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
    const open = g => App.go('ideas', { cat: cat, area: g.dataset.area });
    svg.addEventListener('click', e => { const g = e.target.closest('.bub--unexplored.is-live'); if (g) open(g); });
    svg.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.bub--unexplored.is-live')) { e.preventDefault(); open(e.target); }
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
    ctx.onEnter(() => { startT = setTimeout(play, 350); });
    ctx.onLeave(() => { cancelAnimationFrame(raf); clearTimeout(startT); });
    return el;
  };

  /* =========================================================
     More ideas (from Taste Map bubbles)
     ========================================================= */
  Screens.ideas = function (ctx) {
    const s = st();
    const X = T.ideas;
    const cat = ctx.params.cat || 'food';
    const area = ctx.params.area;
    const data = D.ideas[cat] || D.ideas.food;
    const options = data.options.slice();
    if (area) options.sort((a, b) => (b.area === area) - (a.area === area));
    const el = h(
      '<section class="ideas"><div class="scroll">' + backBtn('map') +
        '<header class="stack-8"><h1 class="title">' + (area ? esc(area) : X.title) + '</h1><p class="muted">' + (area ? X.areaSub : X.sub) + '</p></header>' +
        '<div class="context">' + icon('compass', 20) + '<p>' + data.context + '</p></div>' +
        '<div class="opts" data-opts></div>' +
        '<p class="noads">' + icon('shield', 16) + '<span>' + X.noPaid + '</span></p>' +
      '</div></section>'
    );
    const box = $(el, '[data-opts]');
    function stateHTML(o) {
      const v = s.ideas[o.id];
      if (v === 'self') return '<div class="opt__state">' + icon('check', 18) + '<span>' + X.selfState + '</span><button type="button" class="btn btn--quiet btn--xs" data-undo>' + X.undo + '</button></div>';
      if (v === 'agent') return '<div class="opt__state opt__state--agent">' + icon('chip', 18) + '<span>' + X.agentState + '</span><button type="button" class="btn btn--quiet btn--xs" data-undo>' + X.undo + '</button></div>';
      return '<div class="opt__actions"><button type="button" class="btn btn--primary btn--sm btn--block" data-act="self">' + X.self + '</button>' +
        '<div class="opt__row"><button type="button" class="btn btn--ghost btn--sm" data-act="agent">' + X.agent + '</button>' +
        '<button type="button" class="btn btn--quiet btn--sm" data-act="no">' + X.no + '</button></div></div>';
    }
    const noteHTML = () => '<p class="opt-note">' + icon('check', 16) + '<span>' + X.dismissed + '</span></p>';
    function cardHTML(o) {
      return '<article class="card opt' + (s.ideas[o.id] ? ' is-chosen' : '') + (area && o.area === area ? ' is-match' : '') + '">' +
        '<div class="opt__top">' + sourceChip(o.source) + (o.free ? freeChip() : '') + '</div>' +
        '<h2 class="opt__title">' + o.title + '</h2>' +
        '<p class="opt__who opt__who--' + o.source + '">' + o.who + '</p>' +
        '<p class="muted">' + o.line + '</p>' +
        '<p class="opt__meta">' + icon('clock', 14) + o.meta + '</p>' +
        '<div data-state>' + stateHTML(o) + '</div></article>';
    }
    function render() {
      box.innerHTML = options.map(o => '<div class="opt-slot" data-id="' + o.id + '">' + (s.ideas[o.id] === 'no' ? noteHTML() : cardHTML(o)) + '</div>').join('');
      checkEmpty();
    }
    function checkEmpty() {
      const left = options.filter(o => s.ideas[o.id] !== 'no').length;
      let empty = $(el, '.opts__empty');
      if (!left && !empty) {
        box.appendChild(h('<div class="card card--sand opts__empty"><p><b>' + X.emptyTitle + '</b><br>' + X.emptyLine + '</p>' +
          '<button type="button" class="btn btn--ghost btn--sm" data-go="map">' + X.openMap + '</button></div>'));
      } else if (left && empty) empty.remove();
    }
    box.addEventListener('click', e => {
      const slot = e.target.closest('.opt-slot');
      if (!slot) return;
      const o = options.find(x => x.id === slot.dataset.id);
      if (e.target.closest('[data-undo]')) {
        delete s.ideas[o.id]; App.save();
        $(slot, '.opt').classList.remove('is-chosen');
        $(slot, '[data-state]').innerHTML = stateHTML(o);
        return;
      }
      const act = e.target.closest('[data-act]');
      if (!act) return;
      const kind = act.dataset.act;
      if (kind === 'no') {
        s.ideas[o.id] = 'no'; App.save();
        const hStart = slot.offsetHeight;
        $(slot, '.opt').classList.add('is-leaving');
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
      s.ideas[o.id] = kind; App.save();
      $(slot, '.opt').classList.add('is-chosen');
      $(slot, '[data-state]').innerHTML = stateHTML(o);
      Anim.toast(kind === 'self' ? X.selfToast : X.agentToast);
    });
    render();
    return el;
  };

  /* =========================================================
     Recaps hub, October recap, Wrapped
     ========================================================= */
  Screens.recaps = function () {
    const X = T.recaps;
    return h(
      '<section class="recaps"><div class="scroll">' + backBtn('me') +
        '<header class="stack-8"><h1 class="title">' + X.title + '</h1><p class="muted">' + X.sub + '</p></header>' +
        '<button type="button" class="wrapped-hero" data-go="wrapped">' +
          '<span class="wrapped-hero__path">' + dottedPath('divider', { color: 'var(--coral)' }) + '</span>' +
          '<span class="eyebrow">' + X.heroEyebrow + '</span>' +
          '<span class="wrapped-hero__t">' + X.heroTitle + '</span>' +
          '<span class="wrapped-hero__s">' + X.heroSub + '</span>' +
          '<span class="btn btn--primary btn--sm">' + X.open + icon('arrowRight', 16) + '</span>' +
        '</button>' +
        '<div class="card rows">' +
          '<button type="button" class="row row--link" data-go="monthly"><span class="row__icon">' + icon('book', 20) + '</span><span class="row__txt"><b>' + X.monthTitle + '</b><span class="fine">' + X.monthSub + '</span></span>' + icon('chevron', 18) + '</button>' +
          '<button type="button" class="row row--link" data-go="recap2026"><span class="row__icon">' + icon('clock', 20) + '</span><span class="row__txt"><b>' + X.oldTitle + '</b><span class="fine">' + X.oldSub + '</span></span>' + icon('chevron', 18) + '</button>' +
        '</div>' +
      '</div></section>'
    );
  };

  Screens.monthly = function (ctx) {
    const N = D.numbers;
    const X = T.monthly;
    const el = story({
      theme: 'light',
      onClose: () => App.back('today'),
      onEnd: () => App.back('today'),
      slides: [
        { html: '<p class="eyebrow rv">' + X.eyebrow + '</p>' +
            '<p class="story__huge rv" style="--d:1" data-c>0</p>' +
            '<p class="story__mid rv" style="--d:2">' + X.madeLine + '</p>' +
            '<p class="story__sub rv" style="--d:3">' + fill(X.madeSub, { last: N.ocrLastMonth, start: N.ocrStart }) + '</p>',
          onEnter: sl => Anim.countUp($(sl, '[data-c]'), N.ocrMonth, { from: N.ocrLastMonth, duration: 1200, delay: 300 }) },
        { html: '<p class="eyebrow rv">' + X.swapsEyebrow + '</p>' +
            '<div class="swapbadge rv" style="--d:1">' + icon('swap', 28) + '</div>' +
            '<h2 class="story__big rv" style="--d:2">' + fill(X.swapsTitle, { n: N.swapsMonth }) + '</h2>' },
        { html: '<p class="eyebrow rv">' + X.firstsEyebrow + '</p><h2 class="story__big rv" style="--d:1">' + fill(X.firstsTitle, { n: N.firstsMonth }) + '</h2>' +
            '<ul class="story__list">' + D.monthly.firsts.map((f, k) => '<li class="rv" style="--d:' + (k + 2) + '">' + icon(f.icon, 20) + '<span>' + f.t + '</span></li>').join('') + '</ul>' },
        { html: '<p class="eyebrow rv">' + X.endEyebrow + '</p><h2 class="story__big rv" style="--d:1">' + named(X.endTitle) + '</h2>' +
            '<button type="button" class="btn btn--primary btn--block rv" style="--d:3" data-share-month>' + icon('share', 18) + X.share + '</button>' +
            '<button type="button" class="btn btn--quiet btn--block rv" style="--d:4" data-back="today">' + X.done + '</button>' }
      ]
    });
    $(el, '[data-share-month]').addEventListener('click', () => UI.openShare({ kind: 'monthly', title: '' }));
    ctx.onEnter(() => el.story.start());
    return el;
  };

  Screens.wrapped = function (ctx) {
    const s = st();
    const N = D.numbers;
    const W = D.wrapped;
    const X = T.wrapped;
    const finish = () => { if (App.tour.isOn()) App.tour.finish(); else App.back('today'); };
    const el = story({
      theme: 'dark',
      path: 'wrapped',
      pathColor: 'rgba(226,103,74,.55)',
      onClose: finish,
      onEnd: finish,
      slides: [
        { html: '<p class="eyebrow rv">' + X.eyebrow + '</p><h1 class="story__big story__big--xl rv" style="--d:1">' + X.title + '</h1>' +
            '<p class="story__sub rv" style="--d:2">' + named(X.sub) + '</p>' },
        { html: '<p class="story__line rv">' + X.agentLine + '</p>' +
            '<p class="story__line rv" style="--d:5">' + X.youLine + '</p>' +
            '<p class="story__line rv" style="--d:9">' + X.butLine + '</p>' +
            '<p class="story__huge rv" style="--d:10" data-c3>' + N.ocrYear + '</p>' +
            '<p class="story__line rv" style="--d:10">' + X.of100 + '</p>',
          onEnter: sl => {
            Anim.countUp($(sl, '[data-c1]'), N.agentYear, { duration: 900, delay: 150 });
            Anim.countUp($(sl, '[data-c2]'), N.ocrYear, { duration: 700, delay: 850 });
            Anim.countUp($(sl, '[data-c3]'), N.ocrDecember, { from: N.ocrYear, duration: 1300, delay: 1700 });
          } },
        { html: '<p class="eyebrow rv">' + X.swapsEyebrow + '</p><div class="swapbadge swapbadge--dark rv" style="--d:1">' + icon('swap', 28) + '</div>' +
            '<h2 class="story__big rv" style="--d:2">' + fill(X.swaps, { n: N.swapsYear }) + '</h2>' },
        { html: '<p class="eyebrow rv">' + X.firstsEyebrow + '</p><h2 class="story__big rv" style="--d:1"><span class="hl">' + N.firstsYear + '</span> ' + X.firstsTitle + '</h2>' +
            '<ul class="firsts">' + W.firsts.map((f, k) => '<li class="rv" style="--d:' + (k * 0.7 + 2).toFixed(1) + '">' + f + '</li>').join('') + '</ul>' },
        { html: '<p class="eyebrow rv">' + X.mealsEyebrow + '</p><p class="story__huge rv" style="--d:1" data-c>0</p>' +
            '<h2 class="story__big rv" style="--d:2">' + X.mealsTitle + '</h2>' +
            '<p class="story__sub rv" style="--d:3">' + fill(X.mealsSub, { n: N.mealsLastYear }) + '</p>',
          onEnter: sl => Anim.countUp($(sl, '[data-c]'), N.mealsYear, { duration: 1200, delay: 300 }) },
        { cls: 'story__slide--share',
          html: '<p class="eyebrow rv">' + X.shareEyebrow + '</p>' +
            '<div class="wrapped-preview rv" style="--d:1">' + UI.shareCard({ kind: 'wrapped', title: '' }, 'coral') + '</div>' +
            '<p class="story__sub rv" style="--d:2">' + X.shareSub + '</p>' +
            '<div class="share__btns rv" style="--d:3"><button type="button" class="btn btn--primary btn--block" data-share-year>' + icon('share', 18) + X.share + '</button>' +
            '<button type="button" class="btn btn--quiet btn--block" data-wrapped-done>' + X.done + '</button></div>' }
      ]
    });
    $(el, '[data-share-year]').addEventListener('click', () => UI.openShare({ kind: 'wrapped', title: '' }));
    $(el, '[data-wrapped-done]').addEventListener('click', finish);
    ctx.onEnter(() => el.story.start());
    return el;
  };

  /* =========================================================
     Me: settings, recaps, shared things
     ========================================================= */
  Screens.me = function () {
    const s = st();
    const X = T.me;
    const n = Model.name();
    const qf = D.notifs.quietFrom.find(o => o.v === s.notif.quietFrom) || { t: s.notif.quietFrom };
    const qt = D.notifs.quietTo.find(o => o.v === s.notif.quietTo) || { t: s.notif.quietTo };
    const catNames = D.categories.filter(c => s.categories[c.id]).map(c => c.label).join(', ');
    const seeNames = D.categories.filter(c => s.friendSee[c.id]).map(c => c.label).join(', ') || '—';
    const skillNames = s.skills.map(id => (D.skills.find(k => k.id === id) || {}).name).filter(Boolean).join(', ');
    const row = (go, ic, title, sub, edit) =>
      '<button type="button" class="row row--link" data-go="' + go + '"' + (edit ? EDIT : '') + '><span class="row__icon">' + icon(ic, 20) + '</span>' +
      '<span class="row__txt"><b>' + title + '</b><span class="fine">' + sub + '</span></span>' + icon('chevron', 18) + '</button>';
    const el = h(
      '<section class="profile"><div class="scroll">' +
        '<header class="profile__head"><span class="avatar avatar--lg">' + (n ? esc(n.charAt(0).toUpperCase()) : icon('user', 26)) + '</span>' +
          '<div><h1 class="h2">' + (n ? esc(n) : T.you) + '</h1><p class="muted">' + fill(X.sub, { city: esc(s.profile.city), agent: Model.provider().name }) + '</p></div></header>' +
        '<div class="card rows">' +
          row('shared', 'share', X.shared, s.shares.length ? fill(X.sharedSub.some, { n: s.shares.length }) : X.sharedSub.none) +
          row('recaps', 'book', X.recaps, X.recapsSub) +
        '</div>' +
        '<div class="card rows">' +
          row('notifs', 'bell', X.notifs, fill(X.notifsSub, { n: s.notif.limit, from: qf.t, to: qt.t }), true) +
          row('categories', 'eye', X.cats, catNames, true) +
          row('friendsPrivacy', 'people', X.friendSee, seeNames, true) +
          row('skills', 'hand', X.skills, skillNames, true) +
        '</div>' +
        '<section class="stack-8"><h2 class="h3">' + X.promisesTitle + '</h2><div class="card promises">' + D.promises.map(p =>
          '<p>' + icon('shield', 20) + '<span>' + p + '</span></p>').join('') + '</div></section>' +
        '<div class="stack-8 profile__foot">' +
          '<button type="button" class="btn btn--ghost btn--block" data-startover>' + X.startOver + '</button>' +
          '<button type="button" class="btn btn--quiet btn--block" data-restart>' + X.restart + '</button></div>' +
      '</div></section>'
    );
    el.addEventListener('click', e => {
      if (e.target.closest('[data-startover]')) App.startOver();
      if (e.target.closest('[data-restart]')) App.tour.start();
    });
    return el;
  };

  Screens.shared = function () {
    const s = st();
    const X = T.sharedList;
    return h(
      '<section><div class="scroll">' + backBtn('me') +
        '<header class="stack-8"><h1 class="title">' + X.title + '</h1><p class="muted">' + X.sub + '</p></header>' +
        (s.shares.length
          ? '<div class="sharedgrid">' + s.shares.map(it =>
            '<div class="sharedgrid__item"><div class="sharedgrid__card">' + UI.shareCard(it, it.style) + '</div><p class="fine">' + esc(it.where) + '</p></div>').join('') + '</div>'
          : '<p class="note">' + icon('share', 16) + '<span>' + X.empty + '</span></p>') +
      '</div></section>'
    );
  };
})();
