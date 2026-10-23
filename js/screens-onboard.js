/* Detour prototype · onboarding: 11 steps, one action per screen.
   Settings screens (categories, skills, friends, privacy, messages) also open from Me with { edit: true }. */
(function () {
  'use strict';
  const D = window.DETOUR_DATA;
  const T = D.text;
  const st = () => window.App.state;
  const Screens = window.Screens;
  const { h, esc, fill, named, $, $$, fmt, icon, wordmark, dottedPath, obHead, switchHTML, story, ART, avatar } = window.UI;

  /* One onboarding screen: Back + progress on top, content, one main action pinned at the bottom. */
  function obScreen(step, ctx, body, foot, cls) {
    const edit = !!(ctx && ctx.params.edit);
    return h(
      '<section class="ob' + (cls ? ' ' + cls : '') + '">' +
        '<div class="scroll ob__scroll">' + obHead(step, { edit: edit, backTo: edit ? 'me' : '' }) + body + '</div>' +
        '<div class="ob__foot">' + foot + '</div>' +
      '</section>'
    );
  }
  const mainBtn = (label, attrs) => '<button type="button" class="btn btn--primary btn--block" data-main ' + (attrs || '') + '>' + label + '</button>';
  const head = (title, sub) => '<header class="ob__head"><h1 class="title">' + title + '</h1>' + (sub ? '<p class="lead">' + sub + '</p>' : '') + '</header>';
  function finish(ctx, next) {
    App.save();
    if (ctx.params.edit) { Anim.toast(T.saved); App.back('me'); }
    else App.go(next);
  }

  /* =========================================================
     1. Welcome: three swipeable cards
     ========================================================= */
  Screens.welcome = function (ctx) {
    const W = T.welcome;
    const art = [
      '<div class="wc-art wc-art--agent">' + icon('chip', 64) + '</div>',
      '<div class="wc-art wc-art--repeat">' + [0, 1, 2].map(() => '<span>' + icon('bowl', 30) + '</span>').join('') + '</div>',
      '<div class="wc-art wc-art--detour">' + dottedPath('splash', { draw: true, ends: true, width: 3.5, gap: 10 }) + '</div>'
    ];
    const el = h(
      '<section class="ob welcome-screen">' +
        '<div class="wc">' +
          '<div class="wc__brand">' + wordmark(30) + '</div>' +
          '<div class="wc__track" data-track>' + W.cards.map((c, i) =>
            '<div class="wc__card">' + art[i] + '<p class="wc__line">' + c + '</p></div>').join('') + '</div>' +
          '<div class="wc__dots" aria-hidden="true">' + W.cards.map(() => '<i></i>').join('') + '</div>' +
        '</div>' +
        '<div class="ob__foot">' +
          '<button type="button" class="btn btn--primary btn--block" data-start data-main data-go="phone">' + W.start + '</button>' +
          '<button type="button" class="btn btn--quiet btn--block" data-go="phone">' + W.have + '</button>' +
        '</div>' +
      '</section>'
    );
    const track = $(el, '[data-track]');
    const dots = $$(el, '.wc__dots i');
    let drawn = false;
    function paint() {
      const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
      dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
      if (i === 2 && !drawn) { drawn = true; Anim.drawPath($(el, '.dpath__reveal'), { duration: 1600 }); }
    }
    track.addEventListener('scroll', () => requestAnimationFrame(paint));
    // Tap a dot area or the card to move on, for mouse users.
    track.addEventListener('click', () => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      if (i < 2) track.scrollTo({ left: (i + 1) * track.clientWidth, behavior: Anim.reduced() ? 'auto' : 'smooth' });
    });
    ctx.onEnter(paint);
    return el;
  };

  /* =========================================================
     2. Phone number, then a 4-digit code
     ========================================================= */
  Screens.phone = function (ctx) {
    const s = st();
    const X = T.phone;
    const el = obScreen(2, ctx,
      head(X.title, X.sub) +
      '<label class="field" data-field><span class="field__pre">+91</span>' +
        '<input class="field__input" type="tel" inputmode="numeric" maxlength="10" autocomplete="off" placeholder="98765 43210" aria-label="' + X.label + '" value="' + esc(s.profile.phone) + '"></label>' +
      '<p class="field__error" data-error hidden>' + X.error + '</p>',
      mainBtn(T.cont));
    const input = $(el, 'input');
    const err = $(el, '[data-error]');
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(0, 10);
      err.hidden = true;
      $(el, '[data-field]').classList.remove('is-error');
    });
    function submit() {
      if (input.value.length !== 10) {
        err.hidden = false;
        $(el, '[data-field]').classList.add('is-error');
        input.focus();
        return;
      }
      s.profile.phone = input.value;
      App.save();
      App.go('code');
    }
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    $(el, '[data-main]').addEventListener('click', submit);
    ctx.onEnter(() => { if (window.innerWidth >= 900) input.focus(); });
    return el;
  };

  Screens.code = function (ctx) {
    const s = st();
    const X = T.code;
    const p = s.profile.phone || '';
    const shown = p.length === 10 ? p.slice(0, 5) + ' ' + p.slice(5) : p;
    const el = obScreen(2, ctx,
      head(X.title, fill(X.sub, { phone: esc(shown) })) +
      '<div class="code" data-field>' +
        '<input class="code__input" type="tel" inputmode="numeric" maxlength="4" autocomplete="one-time-code" aria-label="' + X.title + '">' +
        [0, 1, 2, 3].map(() => '<span class="code__box"></span>').join('') +
      '</div>' +
      '<p class="fine code__demo">' + icon('info', 14) + X.demo + '</p>',
      '<button type="button" class="btn btn--quiet btn--block" data-resend>' + X.resend + '</button>');
    const input = $(el, '.code__input');
    const boxes = $$(el, '.code__box');
    let moved = false;
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(0, 4);
      boxes.forEach((b, i) => {
        b.textContent = input.value[i] || '';
        b.classList.toggle('is-on', i === input.value.length);
      });
      if (input.value.length === 4 && !moved) {
        moved = true;
        $(el, '.code').classList.add('is-done');
        setTimeout(() => App.go('about'), 450);
      }
    });
    $(el, '.code').addEventListener('click', () => input.focus());
    $(el, '[data-resend]').addEventListener('click', () => Anim.toast(X.resent));
    ctx.onEnter(() => { boxes[0].classList.add('is-on'); input.focus(); });
    return el;
  };

  /* =========================================================
     3. About you: first name + city
     ========================================================= */
  Screens.about = function (ctx) {
    const s = st();
    const X = T.about;
    let city = s.profile.city;
    const el = obScreen(3, ctx,
      head(X.title) +
      '<div class="stack-8"><label class="label" for="nameInput">' + X.nameLabel + '</label>' +
        '<input id="nameInput" class="input" data-field type="text" autocomplete="given-name" maxlength="20" placeholder="' + X.namePh + '" value="' + esc(s.profile.name) + '">' +
        '<p class="field__error" data-error hidden>' + X.nameError + '</p></div>' +
      '<div class="stack-8"><p class="label">' + X.cityLabel + '</p>' +
        '<div class="chips" role="radiogroup" aria-label="' + X.cityLabel + '">' + D.cities.map(c =>
          '<button type="button" class="pickchip" role="radio" data-city="' + c + '">' + c + '</button>').join('') + '</div></div>',
      mainBtn(T.cont));
    const input = $(el, 'input');
    const err = $(el, '[data-error]');
    function paint() {
      $$(el, '[data-city]').forEach(b => {
        const on = b.dataset.city === city;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-checked', on ? 'true' : 'false');
      });
    }
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-city]');
      if (b) { city = b.dataset.city; paint(); }
    });
    input.addEventListener('input', () => { err.hidden = true; input.classList.remove('is-error'); });
    function submit() {
      const v = input.value.trim().replace(/\s+/g, ' ');
      if (!v) { err.hidden = false; input.classList.add('is-error'); input.focus(); return; }
      if (city !== s.profile.city) s.quiz = {};
      s.profile.name = v.charAt(0).toUpperCase() + v.slice(1);
      s.profile.city = city;
      App.save();
      App.go('quiz');
    }
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    $(el, '[data-main]').addEventListener('click', submit);
    paint();
    ctx.onEnter(() => { if (window.innerWidth >= 900) input.focus(); });
    return el;
  };

  /* =========================================================
     4. The 2026 quiz: 5 swipe cards (2 for your city)
     ========================================================= */
  Screens.quiz = function (ctx) {
    const Q = T.quiz;
    const city = st().profile.city;
    const cards = Model.quizItems(city);
    let i = 0, top = null, swipe = null;
    const answers = {};
    const el = h(
      '<section class="quiz ob"><div class="scroll scroll--fit">' + obHead(4) +
        '<header class="quiz__head"><h1 class="title">' + Q.title + '</h1><p class="muted quiz__sub">' + Q.sub + '</p></header>' +
        '<div class="quiz__stack"></div>' +
        '<div class="quiz__dots" aria-hidden="true">' + cards.map(() => '<i></i>').join('') + '</div>' +
        '<p class="sr-only" data-progress></p>' +
        '<div class="quiz__actions">' +
          '<button type="button" class="btn btn--ghost" data-a="no">' + icon('close', 18) + Q.no + '</button>' +
          '<button type="button" class="btn btn--teal" data-a="yes">' + icon('check', 18) + Q.yes + '</button>' +
        '</div>' +
      '</div></section>'
    );
    const stack = $(el, '.quiz__stack');
    function cardEl(c) {
      return h(
        '<article class="qcard" style="--tint:' + c.tint + '" aria-label="' + esc(c.title) + '">' +
          '<div class="qcard__art"><svg viewBox="0 0 240 150" aria-hidden="true">' + ART[c.art] + '</svg></div>' +
          '<div class="qcard__body">' +
            '<span class="chip chip--sm">' + Model.catLabel(c.cat) + ' · 2026</span>' +
            '<h2 class="qcard__title">' + c.title + '</h2>' +
            '<p class="qcard__line">' + c.line + '</p>' +
            (c.local ? '<p class="qcard__local">' + icon('pin', 14) + fill(Q.local, { city: city }) + '</p>' : '') +
          '</div>' +
          '<span class="qcard__hint qcard__hint--yes" data-hint="yes">' + Q.hintYes + '</span>' +
          '<span class="qcard__hint qcard__hint--no" data-hint="no">' + Q.hintNo + '</span>' +
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
      $(el, '[data-progress]').textContent = (i + 1) + ' / ' + cards.length;
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
     5. Your 2026 self: 2 slides from the answers and your name
     ========================================================= */
  Screens.recap2026 = function (ctx) {
    const R = T.recap2026;
    const s = st();
    if (!Object.keys(s.quiz).length) s.quiz = Model.defaultQuiz(s.profile.city);
    const items = Model.quizItems(s.profile.city);
    const yes = items.filter(q => s.quiz[q.id]);
    const who = yes[0];
    const wth = yes[1];
    const sentence = !who ? R.none : !wth ? fill(R.one, { who: who.who }) : fill(R.two, { who: who.who, with: wth.with });
    const list = yes.slice(0, 4).map((q, k) => '<li class="rv" style="--d:' + (k + 1) + '">' + icon(q.icon, 20) + '<span>' + q.short + '</span></li>').join('');
    const next = () => (s.onboarded ? App.back('recaps') : App.go('agent'));
    const el = story({
      theme: 'sand',
      onClose: next,
      onEnd: next,
      slides: [
        { html: '<p class="eyebrow rv">' + R.eyebrow + '</p><h1 class="story__big rv" style="--d:1">' + named(R.hello) + '</h1>' +
            '<p class="story__quote rv" style="--d:3">' + sentence + '</p>' +
            '<div class="rv" style="--d:5">' + dottedPath('divider', { color: 'var(--teal)' }) + '</div>' },
        { html: '<h2 class="story__mid rv">' + (list ? R.listTitle : R.listNone) + '</h2>' +
            (list ? '<ul class="story__list">' + list + '</ul>' : '') +
            '<p class="story__sub rv" style="--d:6">' + R.question + '</p>' +
            '<button type="button" class="btn btn--primary btn--block rv" style="--d:7" data-recap-next>' + R.cta + icon('arrowRight', 18) + '</button>' }
      ]
    });
    $(el, '[data-recap-next]').addEventListener('click', next);
    ctx.onEnter(() => el.story.start());
    return el;
  };

  /* =========================================================
     6. Pick your agent, then connect it (consent + sync)
     ========================================================= */
  Screens.agent = function (ctx) {
    const s = st();
    const X = T.agentPick;
    let pick = s.profile.provider;
    const el = obScreen(6, ctx,
      head(X.title, X.sub) +
      '<div class="stack-12" role="radiogroup" aria-label="' + X.title + '">' + D.providers.map(p =>
        '<button type="button" class="pick" role="radio" data-provider="' + p.id + '">' +
          '<span class="pick__icon">' + icon('chip', 22) + '</span>' +
          '<span class="pick__txt"><b>' + p.name + '</b><span>' + p.line + '</span></span>' +
          '<span class="pick__check">' + icon('check', 16) + '</span></button>').join('') + '</div>',
      mainBtn(T.cont));
    function paint() {
      $$(el, '[data-provider]').forEach(b => {
        const on = b.dataset.provider === pick;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-checked', on ? 'true' : 'false');
      });
    }
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-provider]');
      if (b) { pick = b.dataset.provider; paint(); }
    });
    $(el, '[data-main]').addEventListener('click', () => { s.profile.provider = pick; App.save(); App.go('consent'); });
    paint();
    return el;
  };

  Screens.consent = function (ctx) {
    const s = st();
    const X = T.consent;
    const agent = Model.provider().name;
    const el = obScreen(6, ctx,
      head(fill(X.title, { agent: agent }), fill(X.lead, { agent: agent })) +
      '<div class="card stack-12"><h2 class="card__h">' + icon('eye', 20) + X.seesTitle + '</h2>' +
        '<p class="muted">' + X.seesLine + '</p>' +
        '<div class="who"><span class="agent-tag">' + icon('chip', 14) + X.who.agent + '</span><span class="chip chip--you">' + icon('user', 14) + X.who.you + '</span><span class="chip chip--approved">' + icon('check', 14) + X.who.approved + '</span></div></div>' +
      '<div class="card stack-12"><h2 class="card__h">' + icon('shield', 20) + X.neverTitle + '</h2>' +
        '<ul class="promise-list">' + X.never.map(p => '<li>' + icon('check', 18) + p + '</li>').join('') + '</ul></div>',
      mainBtn(fill(X.cta, { agent: agent })));
    el.appendChild(h(
      '<div class="sync" aria-live="polite">' +
        '<div class="sync__spin">' + dottedPath('splash', { color: 'var(--teal)', width: 3, gap: 9 }) + '</div>' +
        '<p class="sync__n" data-n>0</p>' +
        '<p class="sync__label" data-found></p>' +
        '<p class="sync__status" data-status>' + X.opening + '</p>' +
        '<div class="sync__done">' +
          '<ul class="sync__list">' + X.breakdown.map(b =>
            '<li><span class="dot dot--' + b.cls + '"></span><span>' + b.who + '</span><b>' + fmt(b.n) + '</b></li>').join('') + '</ul>' +
          '<button type="button" class="btn btn--primary btn--block" data-synced>' + T.cont + '</button>' +
        '</div>' +
      '</div>'));
    const timers = [];
    ctx.onLeave(() => timers.forEach(clearTimeout));
    $(el, '[data-main]').addEventListener('click', () => {
      const sync = $(el, '.sync');
      sync.classList.add('is-on');
      Anim.countUp($(el, '[data-n]'), D.numbers.agentFound, { duration: 2200, delay: 200 });
      const status = $(el, '[data-status]');
      D.categories.forEach((c, k) => timers.push(setTimeout(() => { status.textContent = fill(X.reading, { x: c.label.toLowerCase() }); }, 300 + k * 380)));
      timers.push(setTimeout(() => {
        status.textContent = X.done;
        $(el, '[data-found]').innerHTML = named(X.found, { n: fmt(D.numbers.agentFound) });
        sync.classList.add('is-done');
      }, 2600));
    });
    $(el, '[data-synced]').addEventListener('click', () => App.go('categories'));
    return el;
  };

  /* =========================================================
     7. What should Detour help with?
     ========================================================= */
  Screens.categories = function (ctx) {
    const s = st();
    const X = T.categories;
    const cats = Object.assign({}, s.categories);
    const el = obScreen(7, ctx,
      head(X.title, X.sub) +
      '<div class="card card--flat rows">' + D.categories.map(c =>
        '<label class="row">' + icon(c.icon, 20) + '<span class="row__t">' + c.label + '</span>' + switchHTML('data-cat="' + c.id + '"', cats[c.id]) + '</label>').join('') + '</div>',
      mainBtn(ctx.params.edit ? T.save : T.cont));
    $$(el, '[data-cat]').forEach(inp => inp.addEventListener('change', () => { cats[inp.dataset.cat] = inp.checked; }));
    $(el, '[data-main]').addEventListener('click', () => {
      if (!D.categories.some(c => cats[c.id])) { Anim.toast(X.pickOne); return; }
      s.categories = cats;
      finish(ctx, 'skills');
    });
    return el;
  };

  /* =========================================================
     8. Skills to keep
     ========================================================= */
  Screens.skills = function (ctx) {
    const s = st();
    const K = T.skills;
    let picked = s.skills.slice();
    const el = obScreen(8, ctx,
      head(K.title, K.sub) +
      '<div class="stack-12" role="group" aria-label="' + K.title + '">' + D.skills.map(k =>
        '<button type="button" class="pick" data-skill="' + k.id + '" aria-pressed="false">' +
          '<span class="pick__icon">' + icon(k.icon, 22) + '</span>' +
          '<span class="pick__txt"><b>' + k.name + '</b><span>' + k.note + '</span></span>' +
          '<span class="pick__check">' + icon('check', 16) + '</span></button>').join('') + '</div>' +
      '<p class="note">' + icon('info', 16) + '<span>' + K.note + '</span></p>',
      mainBtn(''));
    const keep = $(el, '[data-main]');
    function paint() {
      $$(el, '[data-skill]').forEach(b => {
        const on = picked.indexOf(b.dataset.skill) > -1;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      const ok = picked.length >= 2 && picked.length <= 3;
      keep.classList.toggle('is-disabled', !ok);
      keep.textContent = ok ? (ctx.params.edit ? T.save : fill(K.keep, { n: picked.length })) : fill(K.more, { n: 2 - picked.length });
    }
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-skill]');
      if (!b) return;
      const at = picked.indexOf(b.dataset.skill);
      if (at > -1) picked.splice(at, 1);
      else if (picked.length >= 3) { Anim.toast(K.tooMany); return; }
      else picked.push(b.dataset.skill);
      paint();
    });
    keep.addEventListener('click', () => {
      if (picked.length < 2) { Anim.toast(K.tooFew); return; }
      s.skills = picked;
      finish(ctx, 'friendsAdd');
    });
    paint();
    return el;
  };

  /* =========================================================
     9. Add friends, then what friends can see
     ========================================================= */
  Screens.friendsAdd = function (ctx) {
    const s = st();
    const X = T.friendsAdd;
    const edit = !!ctx.params.edit;
    const el = obScreen(9, ctx,
      head(X.title, X.sub) +
      '<div class="card rows contacts">' + D.contacts.map(c =>
        '<div class="row contact" data-contact="' + c.id + '">' + avatar(c, 40) +
          '<span class="row__txt"><b>' + c.name + '</b><span class="fine">' + (c.on ? icon('check', 12) + X.on : X.off) + '</span></span>' +
          '<button type="button" class="btn btn--sm contact__btn" data-act></button></div>').join('') + '</div>',
      mainBtn(edit ? T.save : T.cont) + (edit ? '' : '<button type="button" class="btn btn--quiet btn--block" data-skip>' + X.skip + '</button>'));
    function paint() {
      $$(el, '[data-contact]').forEach(row => {
        const c = Model.contact(row.dataset.contact);
        const b = $(row, '[data-act]');
        if (c.on) {
          const on = s.friends.indexOf(c.id) > -1;
          b.textContent = on ? X.added : X.add;
          b.className = 'btn btn--sm contact__btn ' + (on ? 'btn--done' : 'btn--soft');
        } else {
          const inv = !!s.invited[c.id];
          b.textContent = inv ? X.invited : X.invite;
          b.className = 'btn btn--sm contact__btn ' + (inv ? 'btn--done' : 'btn--ghost');
        }
      });
    }
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      const c = Model.contact(b.closest('[data-contact]').dataset.contact);
      if (c.on) {
        const at = s.friends.indexOf(c.id);
        if (at > -1) s.friends.splice(at, 1); else s.friends.push(c.id);
      } else if (!s.invited[c.id]) {
        s.invited[c.id] = true;
        Anim.toast(X.inviteToast);
      }
      App.save();
      paint();
    });
    $(el, '[data-main]').addEventListener('click', () => finish(ctx, 'friendsPrivacy'));
    const skip = $(el, '[data-skip]');
    if (skip) skip.addEventListener('click', () => App.go('notifs'));
    paint();
    return el;
  };

  Screens.friendsPrivacy = function (ctx) {
    const s = st();
    const X = T.friendsPrivacy;
    const see = Object.assign({}, s.friendSee);
    const el = obScreen(9, ctx,
      head(X.title, X.sub) +
      '<div class="card card--flat rows">' + D.categories.map(c =>
        '<label class="row">' + icon(c.icon, 20) + '<span class="row__t">' + c.label + '</span>' + switchHTML('data-see="' + c.id + '"', see[c.id]) + '</label>').join('') + '</div>' +
      '<p class="note">' + icon('shield', 16) + '<span>' + X.sub + '</span></p>',
      mainBtn(ctx.params.edit ? T.save : T.cont));
    $$(el, '[data-see]').forEach(inp => inp.addEventListener('change', () => { see[inp.dataset.see] = inp.checked; }));
    $(el, '[data-main]').addEventListener('click', () => { s.friendSee = see; finish(ctx, 'notifs'); });
    return el;
  };

  /* =========================================================
     10. When should Detour message you?
     ========================================================= */
  Screens.notifs = function (ctx) {
    const s = st();
    const X = T.notifs;
    const n = Object.assign({}, s.notif);
    const chips = (list, key) => '<div class="chips">' + list.map(o =>
      '<button type="button" class="pickchip" data-' + key + '="' + o.v + '">' + o.t + '</button>').join('') + '</div>';
    const el = obScreen(10, ctx,
      head(X.title, X.sub) +
      '<div class="card stack-12"><p class="h3">' + X.limit + '</p>' +
        '<div class="stepper"><button type="button" class="stepper__btn" data-step="-1" aria-label="Fewer">' + icon('minus', 20) + '</button>' +
        '<span class="stepper__n" data-limit aria-live="polite"></span>' +
        '<button type="button" class="stepper__btn" data-step="1" aria-label="More">' + icon('plus', 20) + '</button></div></div>' +
      '<div class="card stack-12"><p class="h3">' + X.quiet + '</p>' +
        '<p class="label">' + X.from + '</p>' + chips(D.notifs.quietFrom, 'from') +
        '<p class="label">' + X.to + '</p>' + chips(D.notifs.quietTo, 'to') + '</div>' +
      '<p class="fine">' + X.fine + '</p>',
      mainBtn(ctx.params.edit ? T.save : T.cont));
    function paint() {
      $(el, '[data-limit]').textContent = n.limit;
      $$(el, '[data-from]').forEach(b => b.classList.toggle('is-on', Number(b.dataset.from) === n.quietFrom));
      $$(el, '[data-to]').forEach(b => b.classList.toggle('is-on', Number(b.dataset.to) === n.quietTo));
      $(el, '[data-step="-1"]').disabled = n.limit <= 1;
      $(el, '[data-step="1"]').disabled = n.limit >= 5;
    }
    el.addEventListener('click', e => {
      const stp = e.target.closest('[data-step]');
      if (stp) n.limit = Math.max(1, Math.min(5, n.limit + Number(stp.dataset.step)));
      const f = e.target.closest('[data-from]');
      if (f) n.quietFrom = Number(f.dataset.from);
      const t = e.target.closest('[data-to]');
      if (t) n.quietTo = Number(t.dataset.to);
      paint();
    });
    $(el, '[data-main]').addEventListener('click', () => { s.notif = n; finish(ctx, 'done'); });
    paint();
    return el;
  };

  /* =========================================================
     11. Done
     ========================================================= */
  Screens.done = function (ctx) {
    const X = T.done;
    const el = obScreen(11, ctx,
      '<div class="done">' +
        '<div class="done__badge">' + icon('check', 40) + '</div>' +
        '<h1 class="title">' + named(X.title) + '</h1><p class="lead">' + X.sub + '</p>' +
        '<div class="done__path">' + dottedPath('divider') + '</div>' +
      '</div>',
      mainBtn(X.cta));
    $(el, '[data-main]').addEventListener('click', () => {
      const s = st();
      s.onboarded = true;
      Model.resetDay();
      App.save();
      App.go('today', null, { dir: 'up', reset: true });
    });
    return el;
  };
})();
