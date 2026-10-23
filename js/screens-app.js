/* Detour prototype · the main app: Today, Your day, the options card stack, Do It Yourself,
   Taste Map, More ideas, recaps, Me and its settings. One main thing per screen. */
(function () {
  'use strict';
  const D = window.DETOUR_DATA;
  const T = D.text;
  const st = () => window.App.state;
  const Screens = window.Screens;
  const UI = window.UI;
  const { h, esc, fill, named, $, $$, icon, agentTag, detourTag, dottedPath, backBtn, sourceChip, sourceDot, freeChip, story, polaroid, avatar } = UI;

  /* =========================================================
     Resolving a moment (used by Today, Your day and the phone banner)
     ========================================================= */
  function done(toast) {
    App.save();
    App.emit('day');
    App.emit('resolved');
    if (toast) Anim.toast(toast);
  }
  UI.resolveSkill = function (id, yes) {
    const dec = Model.decision(id);
    Model.choose(id, yes ? 'self' : 'keep', yes ? { title: dec.did, source: null } : null);
    done(yes ? T.options.selfToast : T.options.keepToast);
  };
  UI.resolveRemember = function (id, yes) {
    const e = Model.logEntry(id);
    if (e) e.status = yes ? 'remembered' : 'notnow';
    done(yes ? T.today.rememberYes : T.today.rememberNo);
  };

  /* =========================================================
     Options: a swipeable stack of three cards, source front and centre
     ========================================================= */
  /* Swipes only move between cards. Choosing is only with buttons:
     "Do this", "Reject", or "Keep my agent's pick". Reject them all and the agent's pick stays. */
  UI.openOptions = function (id) {
    const dec = Model.decision(id);
    if (!dec || dec.kind !== 'repeat') return;
    const O = T.options;
    let cards = Model.optionsFor(dec);
    let k = 0;
    let mode = 'stack';
    const box = h(
      '<div class="optsheet">' +
        '<p class="agentpick">' + icon('chip', 18) + '<span>' + fill(O.picked, { x: esc(dec.pick), note: esc(dec.note) }) + '</span></p>' +
        '<div data-view></div>' +
        '<button type="button" class="btn btn--quiet btn--block" data-keep>' + O.keep + '</button>' +
        '<p class="noads">' + icon('shield', 16) + '<span>' + O.noPaid + '</span></p>' +
      '</div>'
    );
    const close = App.sheet(box);
    const view = $(box, '[data-view]');

    function band(o) {
      const src = D.sources[o.source];
      const fr = o.friend ? Model.person(o.friend) : null;
      return '<div class="ocard__band" style="background:' + src.color + '">' +
        (fr ? avatar(fr, 36) : '<span class="ocard__icon">' + icon(src.icon, 20) + '</span>') +
        '<div><p class="ocard__src">' + src.label + '</p><p class="ocard__sub">' + o.sub + '</p></div></div>';
    }
    function facts(o) {
      return '<p class="ocard__facts">' + o.facts.map(f => '<span>' + f + '</span>').join('') +
        (o.goal ? '<span class="chip chip--goal">' + icon('spark', 14) + O.goal + '</span>' : '') +
        (o.free && !o.cook ? freeChip() : '') + '</p>';
    }
    function buttons(o) {
      return '<div class="ocard__btns"><button type="button" class="btn btn--primary btn--sm" data-do="' + o.id + '">' + O.doThis + '</button>' +
        '<button type="button" class="btn btn--ghost btn--sm" data-reject="' + o.id + '">' + O.reject + '</button></div>';
    }
    function cardHTML(o, cls) {
      return '<article class="ocard' + (cls ? ' ' + cls : '') + '" data-opt="' + o.id + '">' + band(o) +
        '<div class="ocard__body"><h3 class="ocard__title">' + o.title + '</h3>' +
          (o.line ? '<p class="ocard__line">' + o.line + '</p>' : '') + facts(o) + buttons(o) + '</div></article>';
    }

    function renderStack(from) {
      const n = cards.length;
      const top = cardHTML(cards[k], from ? 'from-' + from : '');
      view.innerHTML =
        '<div class="ostack-wrap">' +
          '<button type="button" class="onav" data-nav="-1" aria-label="' + O.prev + '"' + (n < 2 ? ' disabled' : '') + '>' + icon('chevronLeft', 20) + '</button>' +
          '<div class="ostack" data-stack>' + (n > 1 ? cardHTML(cards[(k + 1) % n], 'is-next') : '') + top + '</div>' +
          '<button type="button" class="onav" data-nav="1" aria-label="' + O.next + '"' + (n < 2 ? ' disabled' : '') + '>' + icon('chevron', 20) + '</button>' +
        '</div>' +
        '<div class="odots">' + cards.map((c, i) =>
          '<button type="button" data-dot="' + i + '" class="' + (i === k ? 'is-on' : '') + '" aria-label="' + fill(O.dot, { n: i + 1 }) + '"' + (i === k ? ' aria-current="true"' : '') + '></button>').join('') + '</div>' +
        '<div class="ostack__foot"><span class="fine">' + (n > 1 ? O.hint : fill(O.left, { n: n })) + '</span>' +
          '<button type="button" class="linkbtn" data-mode="list">' + O.compare + '</button></div>';
      const topEl = $(view, '.ostack').lastElementChild;
      if (n > 1) {
        Anim.swipeable(topEl, {
          getScale: () => App.scale,
          onDecide: dir => move(dir === 'left' ? 1 : -1, true)
        });
      }
    }
    function renderList() {
      view.innerHTML = '<div class="olist">' + cards.map(o => cardHTML(o, 'ocard--row')).join('') + '</div>' +
        '<div class="ostack__foot ostack__foot--end"><button type="button" class="linkbtn" data-mode="stack">' + icon('chevronLeft', 14) + O.backToCards + '</button></div>';
    }
    function render(from) { if (mode === 'stack') renderStack(from); else renderList(); }
    function move(step, swiped) {
      if (cards.length < 2) return;
      k = (k + step + cards.length) % cards.length;
      render(swiped ? null : (step > 0 ? 'right' : 'left'));
    }

    function doThis(o) {
      const cook = !!o.cook;
      Model.choose(id, cook ? 'self' : 'swap', o);
      let toast = O.swapToast;
      if (cook) {
        const s = st();
        const from = s.stamps;
        s.stamps += D.numbers.stampReward;
        App.emit('stamps', { from: from, to: s.stamps });
        toast = fill(O.cookToast, { n: D.numbers.stampReward });
      }
      close();
      done(toast);
    }
    function reject(o) {
      cards = cards.filter(c => c !== o);
      if (!cards.length) {
        Model.choose(id, 'keep', null);
        close();
        done(O.allRejected);
        return;
      }
      k = k % cards.length;
      Anim.toast(O.rejectToast);
      render();
    }

    box.addEventListener('click', e => {
      if (e.target.closest('[data-keep]')) { Model.choose(id, 'keep', null); close(); done(O.keepToast); return; }
      const d = e.target.closest('[data-do]');
      if (d) { doThis(cards.find(c => c.id === d.dataset.do)); return; }
      const r = e.target.closest('[data-reject]');
      if (r) { reject(cards.find(c => c.id === r.dataset.reject)); return; }
      const nav = e.target.closest('[data-nav]');
      if (nav) { move(Number(nav.dataset.nav)); return; }
      const dot = e.target.closest('[data-dot]');
      if (dot) { const to = Number(dot.dataset.dot); if (to !== k) { const dir = to > k ? 'right' : 'left'; k = to; render(dir); } return; }
      const m = e.target.closest('[data-mode]');
      if (m) { mode = m.dataset.mode; render(); }
    });
    render();
  };

  /* =========================================================
     Today: one card at a time
     ========================================================= */
  Screens.today = function (ctx) {
    const s = st();
    const X = T.today;
    const el = h(
      '<section class="today"><div class="scroll today__scroll">' +
        '<header class="today__head"><div><p class="eyebrow" data-when></p><h1 class="title" data-hello></h1></div>' +
          '<button type="button" class="avatar" data-go="me" aria-label="' + T.tabs.me + '" data-initial></button></header>' +
        (s.setup ? '' : '<button type="button" class="setuppill" data-go="welcome">' + icon('spark', 16) + '<span>' + X.setup + '</span>' + icon('chevron', 16) + '</button>') +
        '<p class="madecount">' + icon('check', 16) + '<span>' + X.made + '</span><b data-made></b></p>' +
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
    }

    const agentPart = (e, dec, muted) =>
      '<div class="moment__agent' + (muted ? ' moment__agent--muted' : '') + '"><div class="moment__row">' + agentTag() + '<span class="moment__time">' + Model.fmtTime(e.time) + '</span></div>' +
      '<p class="moment__action">' + icon('chip', 20) + '<span>' + dec.agent + '</span></p></div>';

    function paintMoment() {
      const m = Model.todayMoment();
      const box = $(el, '[data-moment]');
      const e = m.entry;
      let html;
      if (m.kind === 'open') {
        const dec = Model.decision(e.id);
        const quietLine = e.status === 'quietLimit' ? X.quietLimit : e.status === 'quietHours' ? X.quietHours : '';
        let detour;
        if (dec.kind === 'skill') {
          detour = '<p class="moment__line">' + dec.ask + '</p>' + (quietLine ? '<p class="moment__line moment__line--quiet">' + quietLine + '</p>' : '') +
            '<button type="button" class="btn btn--primary btn--block" data-skill="yes" data-id="' + e.id + '">' + X.skillYes + '</button>' +
            '<button type="button" class="btn btn--quiet btn--block" data-skill="no" data-id="' + e.id + '">' + X.skillNo + '</button>';
        } else {
          detour = '<p class="moment__line' + (quietLine ? ' moment__line--quiet' : '') + '">' + (quietLine || dec.detour) + '</p>' +
            '<button type="button" class="btn btn--primary btn--block" data-open="' + e.id + '">' + X.seeOptions + '</button>';
        }
        html = '<article class="moment">' + agentPart(e, dec) + '<div class="moment__detour">' + detourTag() + detour + '</div></article>';
      } else if (m.kind === 'remember') {
        const r = Model.rememberInfo(e.rid);
        html = '<article class="moment moment--remember">' +
          '<div class="moment__row">' + detourTag() + '<span class="moment__time">' + X.rememberEyebrow + '</span></div>' +
          '<div class="remember__pic">' + polaroid({ id: r.id, art: r.art }, { caption: String(r.year), tilt: -3 }) + '</div>' +
          '<h2 class="moment__title">' + r.title + '</h2><p class="muted">' + r.line + '</p>' +
          '<button type="button" class="btn btn--primary btn--block" data-remember="yes" data-id="' + e.id + '">' + r.cta + '</button>' +
          '<button type="button" class="btn btn--quiet btn--block" data-remember="no" data-id="' + e.id + '">' + X.skillNo + '</button></article>';
      } else if (m.kind === 'result') {
        const dec = Model.decision(e.id);
        const src = e.opt && e.opt.source;
        const line = e.status === 'keep' ? X.result.keep : fill(X.result[e.status], { x: esc(e.opt ? e.opt.title : '') });
        const canShare = e.status !== 'keep';
        html = '<article class="moment moment--done">' + agentPart(e, dec, true) +
          '<p class="moment__result">' + (src ? sourceDot(src) : icon(e.status === 'keep' ? 'check' : 'hand', 20)) + '<span>' + line + '</span></p>' +
          '<div class="moment__actions">' +
            (canShare ? '<button type="button" class="btn btn--soft btn--sm" data-share="' + (e.opt && e.opt.cook ? 'cooked' : e.status === 'swap' ? 'tried' : 'self') + '" data-title="' + esc(e.opt ? e.opt.title : '') + '">' + icon('share', 16) + X.share + '</button>' : '') +
            (dec.kind === 'repeat' ? '<button type="button" class="btn btn--quiet btn--sm" data-open="' + e.id + '">' + X.change + '</button>' : '') +
          '</div></article>';
      } else if (m.kind === 'diy') {
        // The hero: today's challenge, big and alone on the screen.
        const c = Model.challenge();
        const skill = D.skills.find(k => k.id === c.skill) || { name: '' };
        const going = s.day.diy !== 'idle';
        html = '<article class="hero">' +
          '<div class="hero__path">' + dottedPath('splash', { color: 'var(--coral)', width: 3, gap: 9 }) + '</div>' +
          '<p class="hero__label">' + icon(c.icon, 16) + '<span>' + X.diyLabel + ' · ' + skill.name + '</span></p>' +
          '<h2 class="hero__title">' + (going ? X.diyGoing : c.title) + '</h2>' +
          '<p class="hero__line">' + (going ? X.diyGoingSub : fill(c.line, { dish: esc(Model.plannedDinner()) })) + '</p>' +
          '<p class="hero__reward">' + icon('stamp', 18) + fill(X.reward, { n: D.numbers.stampReward }) + '</p>' +
          '<div class="hero__btns">' +
            (going ? '<button type="button" class="btn btn--primary btn--block btn--lg" data-diy="did">' + X.diyDid + '</button>'
              : '<button type="button" class="btn btn--primary btn--block btn--lg" data-diy="in">' + X.diyIn + '</button>' +
                '<button type="button" class="btn btn--quiet btn--block" data-diy="not">' + X.diyNot + '</button>') +
          '</div></article>';
      } else {
        const dec = e && e.id !== 'remember' ? Model.decision(e.id) : null;
        const latest = dec ? '<p class="calm__latest">' + icon('chip', 14) + fill(X.latest, { x: dec.agent.charAt(0).toLowerCase() + dec.agent.slice(1) }) + '</p>' : '';
        html = '<article class="moment moment--calm">' +
          '<div class="calm__art">' + dottedPath('mini', { gap: 7, width: 3, color: 'var(--teal)' }) + '</div>' +
          '<h2 class="calm__t">' + X.calmTitle + '</h2><p class="calm__s">' + X.calmSub + '</p>' +
          '<p class="fine">' + (s.day.diy === 'done' ? X.diyDone : s.day.diy === 'skip' ? X.diyLater : X.calmHint) + '</p>' + latest + '</article>';
      }
      box.innerHTML = html;
      el.classList.toggle('is-hero', m.kind === 'diy');
    }

    el.addEventListener('click', e => {
      const o = e.target.closest('[data-open]');
      if (o) { UI.openOptions(o.dataset.open); return; }
      const sk = e.target.closest('[data-skill]');
      if (sk) { UI.resolveSkill(sk.dataset.id, sk.dataset.skill === 'yes'); return; }
      const r = e.target.closest('[data-remember]');
      if (r) { UI.resolveRemember(r.dataset.id, r.dataset.remember === 'yes'); return; }
      const dv = e.target.closest('[data-diy]');
      if (dv) {
        const a = dv.dataset.diy;
        if (a === 'in') { s.day.diy = 'in'; done(); }
        else if (a === 'not') { s.day.diy = 'skip'; done(X.diyLater); }
        else { s.day.diy = 'verify'; App.save(); App.go('diy'); }
        return;
      }
      const sh = e.target.closest('[data-share]');
      if (sh) UI.openShare({ kind: sh.dataset.share, title: sh.dataset.title, art: 'curry' });
    });
    const offs = [App.on('day', () => { paintHead(); paintMoment(); }), App.on('clock', paintHead)];
    ctx.onLeave(() => offs.forEach(f => f()));
    paintHead();
    paintMoment();
    return el;
  };

  /* =========================================================
     Your day: every decision, and what happened
     ========================================================= */
  Screens.day = function (ctx) {
    const s = st();
    const X = T.log;
    const S = X.status;
    const el = h(
      '<section class="daylog"><div class="scroll">' + backBtn() +
        '<header class="stack-8"><h1 class="title">' + X.title + '</h1><p class="muted">' + X.sub + '</p></header>' +
        '<p class="daycount" data-count></p>' +
        '<ol class="daylist" data-list></ol>' +
      '</div></section>'
    );
    function row(e) {
      if (e.id === 'remember') {
        const r = Model.rememberInfo(e.rid);
        const tone = e.status === 'remember' ? 'detour' : e.status === 'remembered' ? 'good' : 'plain';
        return '<li class="tl tl--' + tone + '"><span class="tl__time">' + Model.fmtTime(e.time) + '</span><div class="tl__body">' +
          '<p class="tl__agent tl__agent--detour">' + detourTag() + '</p>' +
          '<p class="tl__what">' + r.title + '</p>' +
          '<p class="tl__status">' + S[e.status] + '</p></div></li>';
      }
      const dec = Model.decision(e.id);
      let line, tone = 'plain', action = '';
      switch (e.status) {
        case 'offer': line = S.offer; tone = 'detour'; action = '<button type="button" class="btn btn--soft btn--xs" data-open="' + e.id + '">' + X.see + '</button>'; break;
        case 'skill': line = dec.ask; tone = 'detour'; break;
        case 'quietLimit': case 'quietHours':
          line = S[e.status]; tone = 'quiet';
          action = dec.kind === 'repeat' ? '<button type="button" class="btn btn--soft btn--xs" data-open="' + e.id + '">' + X.see + '</button>' : '';
          break;
        case 'quiet': line = dec.reason === 'none' ? S.quiet : S.stayOut; break;
        case 'swap': case 'self': line = (e.opt && e.opt.source ? sourceDot(e.opt.source) : '') + fill(S[e.status], { x: esc(e.opt ? e.opt.title : '') }); tone = 'good'; break;
        case 'keep': line = S.keep; break;
        default: line = (e.quiet ? S[e.quiet === 'limit' ? 'quietLimit' : 'quietHours'] + '. ' : '') + S.went; tone = e.quiet ? 'quiet' : 'plain';
      }
      if (dec.kind === 'skill' && Model.isOpen(e)) {
        action = '<span class="tl__btns"><button type="button" class="btn btn--soft btn--xs" data-skill="yes" data-id="' + e.id + '">' + T.today.skillYes + '</button>' +
          '<button type="button" class="btn btn--quiet btn--xs" data-skill="no" data-id="' + e.id + '">' + T.today.skillNo + '</button></span>';
      }
      return '<li class="tl tl--' + tone + '"><span class="tl__time">' + Model.fmtTime(e.time) + '</span><div class="tl__body">' +
        '<p class="tl__agent">' + icon('chip', 14) + '<span>' + dec.agent + '</span></p>' +
        '<p class="tl__status">' + line + '</p>' + action + '</div></li>';
    }
    function paint() {
      $(el, '[data-count]').innerHTML = icon('bell', 16) + '<span>' + fill(X.count, { n: s.day.sent, max: s.notif.limit }) + '</span>';
      const log = s.day.log;
      let html = log.map(row);
      if (s.day.clock >= D.day.onThisDayAt) {
        const otd = '<li class="tl tl--otd"><span class="tl__time">' + Model.fmtTime(D.day.onThisDayAt) + '</span><div class="tl__body"><p class="tl__otd">' +
          icon('clock', 14) + fill(D.onThisDay[s.day.otd], { y: Model.year18() + 2 }) + '</p></div></li>';
        const at = log.findIndex(e => e.time > D.day.onThisDayAt);
        html.splice(at < 0 ? html.length : at, 0, otd);
      }
      $(el, '[data-list]').innerHTML = html.length ? html.join('') : '<li class="tl tl--empty"><p class="muted">' + X.empty + '</p></li>';
    }
    el.addEventListener('click', e => {
      const o = e.target.closest('[data-open]');
      if (o) { UI.openOptions(o.dataset.open); return; }
      const sk = e.target.closest('[data-skill]');
      if (sk) UI.resolveSkill(sk.dataset.id, sk.dataset.skill === 'yes');
    });
    const off = App.on('day', paint);
    ctx.onLeave(off);
    paint();
    return el;
  };

  /* =========================================================
     Do It Yourself: today's challenge
     ========================================================= */
  Screens.diy = function (ctx) {
    const s = st();
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
          '<button type="button" class="quietrow" data-go="skills">' + icon('hand', 18) + '<span><b>' + X.skillsRow + '</b> · ' + skillNames + '</span>' + icon('chevron', 16) + '</button>' +
          '<button type="button" class="quietrow" data-redeem>' + icon('stamp', 18) + '<span>' + fill(X.stampsRow, { n: '<b data-stamps>' + s.stamps + '</b>' }) + '</span>' + icon('chevron', 16) + '</button>' +
        '</div>' +
      '</div></section>'
    );
    const card = $(el, '[data-card]');
    function render(animate) {
      const c = Model.challenge();
      const d = s.day;
      let html;
      if (d.diy === 'idle') {
        html = '<p class="eyebrow">' + X.eyebrow + '</p><div class="moment__art">' + icon(c.icon, 32) + '</div><h2 class="h2">' + c.title + '</h2><p class="muted">' + c.line + '</p>' +
          '<button type="button" class="btn btn--primary btn--block" data-act="in">' + X.in + '</button>' +
          '<button type="button" class="btn btn--quiet btn--block" data-act="later">' + X.later + '</button>';
      } else if (d.diy === 'in') {
        html = '<p class="eyebrow eyebrow--live"><i class="pulse"></i>' + X.goingEyebrow + '</p><h2 class="h2">' + c.title + '</h2><p class="muted">' + X.goingLine + '</p>' +
          '<ul class="steps">' + c.steps.map((t, k) =>
            '<li><button type="button" class="step' + (d.diySteps[k] ? ' is-on' : '') + '" data-step="' + k + '"><span class="step__box">' + icon('check', 14) + '</span><span>' + t + '</span></button></li>').join('') + '</ul>' +
          '<button type="button" class="btn btn--primary btn--block" data-act="did">' + X.did + '</button>' +
          '<button type="button" class="btn btn--quiet btn--block" data-act="cancel">' + X.cancel + '</button>';
      } else if (d.diy === 'verify') {
        html = '<p class="eyebrow">' + X.checkEyebrow + '</p><h2 class="h2">' + X.checkTitle + '</h2>' +
          '<ul class="checks">' + c.checks.map((t, k) => '<li class="check" data-check="' + k + '"><span class="check__dot">' + icon('check', 14) + '</span><span class="check__t">' + t + '</span></li>').join('') + '</ul>' +
          '<div class="confirm-wrap"><button type="button" class="btn btn--primary btn--block" data-act="confirm">' + X.confirm + '</button><p class="fine center">' + X.checkFine + '</p></div>';
      } else if (d.diy === 'done') {
        html = '<div class="stamp' + (animate ? ' is-pressed' : '') + '" aria-hidden="true"><span>' + X.stampWords[0] + '<b>+' + N.stampReward + '</b>' + X.stampWords[1] + '</span></div>' +
          '<div class="diy-done__head"><p class="eyebrow">' + X.doneEyebrow + '</p><h2 class="h2">' + X.doneTitle + '</h2><p class="muted">' + X.doneLine + '</p></div>' +
          '<p class="earned">' + icon('stamp', 18) + fill(X.earned, { n: N.stampReward }) + '</p>' +
          '<button type="button" class="btn btn--primary btn--block" data-act="share">' + icon('share', 18) + T.today.share + '</button>';
      } else {
        html = '<p class="eyebrow">' + X.eyebrow + '</p><h2 class="h2">' + X.skippedTitle + '</h2><p class="muted">' + X.skippedLine + '</p>';
      }
      card.className = 'card diy-card diy-card--' + d.diy + (animate ? ' is-thud' : '');
      card.innerHTML = html;
      if (d.diy === 'verify') runChecks();
    }
    function runChecks() {
      const items = $$(card, '.check');
      const btn = $(card, '.confirm-wrap');
      const fast = Anim.reduced();
      items.forEach((li, k) => { li.classList.add('is-hidden'); timers.push(setTimeout(() => { li.classList.remove('is-hidden'); li.classList.add('is-ok'); }, (k + 1) * (fast ? 100 : 600))); });
      timers.push(setTimeout(() => btn.classList.add('is-on'), (items.length + 1) * (fast ? 100 : 600)));
    }
    card.addEventListener('click', e => {
      const d = s.day;
      const step = e.target.closest('[data-step]');
      if (step) { d.diySteps[step.dataset.step] = !d.diySteps[step.dataset.step]; step.classList.toggle('is-on'); App.save(); return; }
      const a = e.target.closest('[data-act]');
      if (!a) return;
      const act = a.dataset.act;
      if (act === 'share') { UI.openShare({ kind: 'self', line: Model.challenge().share, title: '', art: 'curry' }); return; }
      if (act === 'later') { d.diy = 'skip'; Anim.toast(X.laterToast); }
      if (act === 'in') d.diy = 'in';
      if (act === 'cancel') { d.diy = 'skip'; Anim.toast(X.cancelToast); }
      if (act === 'did') d.diy = 'verify';
      if (act === 'confirm') {
        const from = s.stamps;
        d.diy = 'done';
        s.stamps += N.stampReward;
        App.save(); App.emit('day');
        render(true);
        timers.push(setTimeout(() => App.emit('stamps', { from: from, to: s.stamps }), 650));
        return;
      }
      App.save(); App.emit('day');
      render(false);
    });
    const off = App.on('stamps', d => $$(el, '[data-stamps]').forEach(n => Anim.countUp(n, d.to, { from: d.from, duration: 700 })));
    ctx.onLeave(off);
    render(false);
    return el;
  };

  /* =========================================================
     Taste Map
     ========================================================= */
  Screens.map = function (ctx) {
    const TM = D.tasteMap;
    const X = T.map;
    let cat = ctx.params.cat || TM.cats[0];
    let t = 1, raf = 0;
    const el = h(
      '<section class="mapscreen"><div class="scroll">' +
        '<header class="stack-8"><h1 class="title">' + X.title + '</h1><p class="muted">' + X.sub + '</p></header>' +
        '<div class="seg" role="tablist">' + TM.cats.map(c => '<button type="button" role="tab" data-cat="' + c + '">' + TM.catLabels[c] + '</button>').join('') + '</div>' +
        '<div class="stack-12"><div class="card map"><svg class="map__svg" viewBox="0 0 342 300" role="group" aria-label="' + X.title + '"></svg></div>' +
          '<div class="legend"><span><i class="lg lg--often"></i>' + X.often + '</span><span><i class="lg lg--used"></i>' + X.used + '</span><span><i class="lg lg--new"></i>' + X.never + '</span></div></div>' +
        '<p class="hint">' + icon('spark', 16) + '<span>' + X.hint + '</span></p>' +
        '<div class="card card--flat timeline">' +
          '<div class="timeline__top"><div><p class="eyebrow">' + X.yearLabel + '</p><p class="timeline__year" data-year>2040</p></div>' +
            '<button type="button" class="btn btn--ghost btn--sm" data-play>' + icon('play', 16) + X.replay + '</button></div>' +
          '<input class="range" type="range" min="0" max="1000" value="1000" aria-label="Year">' +
          '<div class="timeline__ends"><span>2026</span><span>2040</span></div>' +
          '<p class="timeline__note" data-note></p></div>' +
        '<section class="stack-12"><div class="stack-4"><h2 class="h3">' + X.barsTitle + '</h2><p class="fine">' + X.barsSub + '</p></div>' +
          '<div class="bars">' + D.ownBars.map(b =>
            '<div class="bar"><div class="bar__top"><span>' + b.label + '</span><span>' + b.pct + '%</span></div>' +
            '<div class="bar__track"><div class="bar__fill" data-pct="' + b.pct + '"></div></div></div>').join('') + '</div></section>' +
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
        return '<g class="bub bub--' + sl.kind + '" transform="translate(' + sl.x + ' ' + sl.y + ')"' + (isNew ? ' role="button" aria-label="' + esc(nm) + '" data-area="' + esc(nm) + '"' : '') + '>' +
          '<g class="bub__drift" style="animation-duration:' + (5 + (k % 4) * 1.3) + 's;animation-delay:-' + (k * 0.9) + 's"><circle r="' + sl.r1 + '"/><text text-anchor="middle">' + text + '</text></g></g>';
      }).join('');
      $$(el, '[data-cat]').forEach(b => { b.classList.toggle('is-active', b.dataset.cat === cat); b.setAttribute('aria-selected', b.dataset.cat === cat); });
      setT(t);
    }
    function setT(x) {
      t = x;
      $$(svg, '.bub').forEach((g, k) => {
        const sl = TM.slots[k];
        const c = $(g, 'circle');
        if (sl.kind === 'unexplored') {
          g.style.opacity = Math.max(0, Math.min(1, (x - 0.35) / 0.6)).toFixed(2);
          g.classList.toggle('is-live', x > 0.6);
          g.setAttribute('tabindex', x > 0.6 ? '0' : '-1');
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
      const start = performance.now();
      setT(0);
      const step = now => { const p = Math.min(1, (now - start) / 2400); setT(Anim.easeInOut(p)); if (p < 1) raf = requestAnimationFrame(step); };
      raf = requestAnimationFrame(step);
    }
    const open = g => App.go('ideas', { cat: cat, area: g.dataset.area });
    svg.addEventListener('click', e => { const g = e.target.closest('.bub--unexplored.is-live'); if (g) open(g); });
    svg.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.bub--unexplored.is-live')) { e.preventDefault(); open(e.target); } });
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
      $$(el, '.bar__fill').forEach((f, i) => setTimeout(() => { f.style.width = Math.max(2, f.dataset.pct) + '%'; }, 300 + i * 80));
    });
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
        '<p class="noads">' + icon('shield', 16) + '<span>' + X.noPaid + '</span></p></div></section>'
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
    const cardHTML = o => '<article class="card opt' + (s.ideas[o.id] ? ' is-chosen' : '') + (area && o.area === area ? ' is-match' : '') + '">' +
      '<div class="opt__top">' + sourceChip(o.source) + (o.free ? freeChip() : '') + '</div>' +
      '<h2 class="opt__title">' + o.title + '</h2><p class="opt__who">' + o.who + '</p><p class="muted">' + o.line + '</p>' +
      '<p class="opt__meta">' + icon('clock', 14) + o.meta + '</p><div data-state>' + stateHTML(o) + '</div></article>';
    function render() {
      box.innerHTML = options.map(o => '<div class="opt-slot" data-id="' + o.id + '">' + (s.ideas[o.id] === 'no' ? noteHTML() : cardHTML(o)) + '</div>').join('');
    }
    box.addEventListener('click', e => {
      const slot = e.target.closest('.opt-slot');
      if (!slot) return;
      const o = options.find(x => x.id === slot.dataset.id);
      if (e.target.closest('[data-undo]')) { delete s.ideas[o.id]; App.save(); render(); return; }
      const act = e.target.closest('[data-act]');
      if (!act) return;
      s.ideas[o.id] = act.dataset.act;
      App.save();
      if (act.dataset.act === 'no') { $(slot, '.opt').classList.add('is-leaving'); setTimeout(render, 300); return; }
      render();
      Anim.toast(act.dataset.act === 'self' ? X.selfToast : X.agentToast);
    });
    render();
    return el;
  };

  /* =========================================================
     Recaps
     ========================================================= */
  Screens.recaps = function () {
    const X = T.recaps;
    return h(
      '<section class="recaps"><div class="scroll">' + backBtn('me') +
        '<header class="stack-8"><h1 class="title">' + X.title + '</h1><p class="muted">' + X.sub + '</p></header>' +
        '<button type="button" class="wrapped-hero" data-go="wrapped">' +
          '<span class="wrapped-hero__path">' + dottedPath('divider', { color: 'var(--coral)' }) + '</span>' +
          '<span class="eyebrow">' + X.heroEyebrow + '</span><span class="wrapped-hero__t">' + X.heroTitle + '</span>' +
          '<span class="wrapped-hero__s">' + X.heroSub + '</span><span class="btn btn--primary btn--sm">' + X.open + icon('arrowRight', 16) + '</span></button>' +
        '<div class="card rows">' +
          '<button type="button" class="row row--link" data-go="monthly"><span class="row__icon">' + icon('book', 20) + '</span><span class="row__txt"><b>' + X.monthTitle + '</b><span class="fine">' + X.monthSub + '</span></span>' + icon('chevron', 18) + '</button>' +
          '<button type="button" class="row row--link" data-go="at18"><span class="row__icon">' + icon('clock', 20) + '</span><span class="row__txt"><b>' + X.oldTitle + '</b><span class="fine">' + X.oldSub + '</span></span>' + icon('chevron', 18) + '</button>' +
        '</div></div></section>'
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
        { html: '<p class="eyebrow rv">' + X.eyebrow + '</p><p class="story__huge rv" style="--d:1" data-c>0</p>' +
            '<p class="story__mid rv" style="--d:2">' + X.madeLine + '</p><p class="story__sub rv" style="--d:3">' + fill(X.madeSub, { last: N.ocrLastMonth, start: N.ocrStart }) + '</p>',
          onEnter: sl => Anim.countUp($(sl, '[data-c]'), N.ocrMonth, { from: N.ocrLastMonth, duration: 1200, delay: 300 }) },
        { html: '<p class="eyebrow rv">' + X.swapsEyebrow + '</p><div class="swapbadge rv" style="--d:1">' + icon('swap', 28) + '</div>' +
            '<h2 class="story__big rv" style="--d:2">' + fill(X.swapsTitle, { n: N.swapsMonth }) + '</h2>' },
        { html: '<p class="eyebrow rv">' + T.thenNow.eyebrow + '</p><div class="rv" style="--d:1">' + UI.thenNow() + '</div>' },
        { html: '<p class="eyebrow rv">' + X.firstsEyebrow + '</p><h2 class="story__big rv" style="--d:1">' + fill(X.firstsTitle, { n: N.firstsMonth }) + '</h2>' +
            '<ul class="story__list">' + D.monthly.firsts.map((f, k) => '<li class="rv" style="--d:' + (k + 2) + '">' + icon(f.icon, 20) + '<span>' + f.t + '</span></li>').join('') + '</ul>' },
        { html: '<p class="eyebrow rv">' + X.endEyebrow + '</p><h2 class="story__big rv" style="--d:1">' + named(X.endTitle) + '</h2>' +
            '<button type="button" class="btn btn--primary btn--block rv" style="--d:3" data-share-month>' + icon('share', 18) + X.share + '</button>' +
            '<button type="button" class="btn btn--quiet btn--block rv" style="--d:4" data-back="today">' + X.done + '</button>' }
      ]
    });
    $(el, '[data-share-month]').addEventListener('click', () => UI.openShare({ kind: 'monthly', title: '', art: 'books' }));
    ctx.onEnter(() => el.story.start());
    return el;
  };

  Screens.wrapped = function (ctx) {
    const N = D.numbers;
    const W = D.wrapped;
    const X = T.wrapped;
    const finish = () => App.back('today');
    const el = story({
      theme: 'dark', path: 'wrapped', pathColor: 'rgba(226,103,74,.55)', onClose: finish, onEnd: finish,
      slides: [
        { html: '<p class="eyebrow rv">' + X.eyebrow + '</p><h1 class="story__big story__big--xl rv" style="--d:1">' + X.title + '</h1><p class="story__sub rv" style="--d:2">' + named(X.sub) + '</p>' },
        { html: '<p class="story__line rv">' + X.agentLine + '</p><p class="story__line rv" style="--d:5">' + X.youLine + '</p>' +
            '<p class="story__line rv" style="--d:9">' + X.butLine + '</p><p class="story__huge rv" style="--d:10" data-c3>' + N.ocrYear + '</p><p class="story__line rv" style="--d:10">' + X.of100 + '</p>',
          onEnter: sl => {
            Anim.countUp($(sl, '[data-c1]'), N.agentYear, { duration: 900, delay: 150 });
            Anim.countUp($(sl, '[data-c2]'), N.ocrYear, { duration: 700, delay: 850 });
            Anim.countUp($(sl, '[data-c3]'), N.ocrDecember, { from: N.ocrYear, duration: 1300, delay: 1700 });
          } },
        { html: '<p class="eyebrow rv">' + X.swapsEyebrow + '</p><div class="swapbadge swapbadge--dark rv" style="--d:1">' + icon('swap', 28) + '</div><h2 class="story__big rv" style="--d:2">' + fill(X.swaps, { n: N.swapsYear }) + '</h2>' },
        { html: '<p class="eyebrow rv">' + T.thenNow.eyebrow + '</p><div class="rv" style="--d:1">' + UI.thenNow() + '</div>' },
        { html: '<p class="eyebrow rv">' + X.firstsEyebrow + '</p><h2 class="story__big rv" style="--d:1"><span class="hl">' + N.firstsYear + '</span> ' + X.firstsTitle + '</h2>' +
            '<ul class="firsts">' + W.firsts.map((f, k) => '<li class="rv" style="--d:' + (k * 0.7 + 2).toFixed(1) + '">' + f + '</li>').join('') + '</ul>' },
        { html: '<p class="eyebrow rv">' + X.mealsEyebrow + '</p><p class="story__huge rv" style="--d:1" data-c>0</p><h2 class="story__big rv" style="--d:2">' + X.mealsTitle + '</h2><p class="story__sub rv" style="--d:3">' + fill(X.mealsSub, { n: N.mealsLastYear }) + '</p>',
          onEnter: sl => Anim.countUp($(sl, '[data-c]'), N.mealsYear, { duration: 1200, delay: 300 }) },
        { cls: 'story__slide--share',
          html: '<p class="eyebrow rv">' + X.shareEyebrow + '</p><div class="wrapped-preview rv" style="--d:1">' + UI.shareCard({ kind: 'wrapped' }, 'coral') + '</div>' +
            '<p class="story__sub rv" style="--d:2">' + X.shareSub + '</p>' +
            '<div class="share__btns rv" style="--d:3"><button type="button" class="btn btn--primary btn--block" data-share-year>' + icon('share', 18) + X.share + '</button>' +
            '<button type="button" class="btn btn--quiet btn--block" data-wrapped-done>' + X.done + '</button></div>' }
      ]
    });
    $(el, '[data-share-year]').addEventListener('click', () => UI.openShare({ kind: 'wrapped', art: 'beach' }));
    $(el, '[data-wrapped-done]').addEventListener('click', finish);
    ctx.onEnter(() => el.story.start());
    return el;
  };

  /* =========================================================
     Me and its settings
     ========================================================= */
  Screens.me = function () {
    const s = st();
    const X = T.me;
    const n = Model.name();
    const qf = D.notifs.quietFrom.find(o => o.v === s.notif.quietFrom) || { t: '' };
    const qt = D.notifs.quietTo.find(o => o.v === s.notif.quietTo) || { t: '' };
    const skillNames = s.skills.map(id => (D.skills.find(k => k.id === id) || {}).name).filter(Boolean).join(', ');
    const row = (go, ic, title, sub) => '<button type="button" class="row row--link" data-go="' + go + '"><span class="row__icon">' + icon(ic, 20) + '</span>' +
      '<span class="row__txt"><b>' + title + '</b><span class="fine">' + sub + '</span></span>' + icon('chevron', 18) + '</button>';
    return h(
      '<section class="profile"><div class="scroll">' +
        '<header class="profile__head"><span class="avatar avatar--lg">' + (n ? esc(n.charAt(0).toUpperCase()) : icon('user', 26)) + '</span>' +
          '<div><h1 class="h2">' + (n ? esc(n) : T.you) + '</h1><p class="muted">' + fill(X.sub, { city: esc(s.profile.city), home: esc(Model.hometown()) }) + '</p>' +
          (s.setup ? '<p class="fine">' + fill(X.turned, { year: Model.year18() }) + '</p>' : '') + '</div></header>' +
        '<div class="card rows">' + (s.setup ? row('account', 'pen', X.redo, X.redoSub) : row('welcome', 'spark', X.setup, X.setupSub)) +
          row('find', 'userPlus', X.friends, fill(X.friendsSub, { n: s.friends.length })) + '</div>' +
        '<div class="card rows">' +
          row('shared', 'share', X.shared, s.shares.length ? fill(X.sharedSub.some, { n: s.shares.length }) : X.sharedSub.none) +
          row('recaps', 'book', X.recaps, X.recapsSub) +
          row('notifs', 'bell', X.notifs, fill(X.notifsSub, { n: s.notif.limit, from: qf.t, to: qt.t })) +
          row('skills', 'hand', X.skills, skillNames) + '</div>' +
        '<section class="stack-8"><h2 class="h3">' + X.promisesTitle + '</h2><div class="card promises">' + D.promises.map(p =>
          '<p>' + icon('shield', 20) + '<span>' + p + '</span></p>').join('') + '</div></section>' +
      '</div></section>'
    );
  };

  /* Settings screens: one purpose each, Save at the bottom. */
  function settings(title, sub, body, onSave) {
    const el = h('<section class="ob"><div class="scroll ob__scroll">' + backBtn('me') +
      '<header class="ob__head"><h1 class="title">' + title + '</h1><p class="lead">' + sub + '</p></header>' + body + '</div>' +
      '<div class="ob__foot"><button type="button" class="btn btn--primary btn--block" data-main>' + T.save + '</button></div></section>');
    $(el, '[data-main]').addEventListener('click', () => { if (onSave(el) !== false) { App.save(); Anim.toast(T.saved); App.back('me'); } });
    return el;
  }

  Screens.notifs = function () {
    const s = st();
    const X = T.notifs;
    const n = Object.assign({}, s.notif);
    const chips = (list, key) => '<div class="chips">' + list.map(o => '<button type="button" class="pickchip" data-' + key + '="' + o.v + '">' + o.t + '</button>').join('') + '</div>';
    const el = settings(X.title, X.sub,
      '<div class="card stack-12"><p class="h3">' + X.limit + '</p><div class="stepper"><button type="button" class="stepper__btn" data-step="-1" aria-label="Fewer">' + icon('minus', 20) + '</button>' +
        '<span class="stepper__n" data-limit></span><button type="button" class="stepper__btn" data-step="1" aria-label="More">' + icon('plus', 20) + '</button></div></div>' +
      '<div class="card stack-12"><p class="h3">' + X.quiet + '</p><p class="label">' + X.from + '</p>' + chips(D.notifs.quietFrom, 'from') +
        '<p class="label">' + X.to + '</p>' + chips(D.notifs.quietTo, 'to') + '</div><p class="fine">' + X.fine + '</p>',
      () => { s.notif = n; });
    function paint() {
      $(el, '[data-limit]').textContent = n.limit;
      $$(el, '[data-from]').forEach(b => b.classList.toggle('is-on', Number(b.dataset.from) === n.quietFrom));
      $$(el, '[data-to]').forEach(b => b.classList.toggle('is-on', Number(b.dataset.to) === n.quietTo));
      $(el, '[data-step="-1"]').disabled = n.limit <= 1;
      $(el, '[data-step="1"]').disabled = n.limit >= 5;
    }
    el.addEventListener('click', e => {
      const sp = e.target.closest('[data-step]'); if (sp) n.limit = Math.max(1, Math.min(5, n.limit + Number(sp.dataset.step)));
      const f = e.target.closest('[data-from]'); if (f) n.quietFrom = Number(f.dataset.from);
      const t = e.target.closest('[data-to]'); if (t) n.quietTo = Number(t.dataset.to);
      paint();
    });
    paint();
    return el;
  };

  Screens.skills = function () {
    const s = st();
    const X = T.skillsScreen;
    const picked = s.skills.slice();
    const el = settings(X.title, X.sub,
      '<div class="stack-12">' + D.skills.map(k =>
        '<button type="button" class="pick" data-skill="' + k.id + '"><span class="pick__icon">' + icon(k.icon, 22) + '</span>' +
        '<span class="pick__txt"><b>' + k.name + '</b><span>' + k.note + '</span></span><span class="pick__check">' + icon('check', 16) + '</span></button>').join('') + '</div>' +
      '<p class="note">' + icon('info', 16) + '<span>' + X.note + '</span></p>',
      () => { if (!picked.length) { Anim.toast(X.tooFew); return false; } s.skills = picked.slice(); });
    const paint = () => $$(el, '[data-skill]').forEach(b => b.classList.toggle('is-on', picked.indexOf(b.dataset.skill) > -1));
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-skill]');
      if (!b) return;
      const at = picked.indexOf(b.dataset.skill);
      if (at > -1) picked.splice(at, 1); else picked.push(b.dataset.skill);
      paint();
    });
    paint();
    return el;
  };

  Screens.shared = function () {
    const s = st();
    const X = T.sharedList;
    return h('<section><div class="scroll">' + backBtn('me') +
      '<header class="stack-8"><h1 class="title">' + X.title + '</h1><p class="muted">' + X.sub + '</p></header>' +
      (s.shares.length ? '<div class="sharedgrid">' + s.shares.map(it =>
        '<div class="sharedgrid__item"><div class="sharedgrid__card">' + UI.shareCard(it, it.style) + '</div><p class="fine">' + esc(it.where) + '</p></div>').join('') + '</div>'
        : '<p class="note">' + icon('share', 16) + '<span>' + X.empty + '</span></p>') + '</div></section>');
  };
})();
