/* Detour prototype · optional setup: 6 screens. The app opens on Today; "Set up as yourself" runs these.
   1 Welcome · 2 Create your account · 3 Nostalgia quiz · 4 You, at 18 · 5 Connect your agent · 6 Find your friends (screens-friends.js) */
(function () {
  'use strict';
  const D = window.DETOUR_DATA;
  const T = D.text;
  const st = () => window.App.state;
  const Screens = window.Screens;
  const { h, esc, fill, named, $, $$, fmt, icon, wordmark, dottedPath, obHead, story, polaroid } = window.UI;

  function obScreen(step, body, foot, cls) {
    return h(
      '<section class="ob' + (cls ? ' ' + cls : '') + '">' +
        '<div class="scroll ob__scroll">' + obHead(step) + body + '</div>' +
        '<div class="ob__foot">' + foot + '</div>' +
      '</section>'
    );
  }
  const mainBtn = label => '<button type="button" class="btn btn--primary btn--block" data-main>' + label + '</button>';
  const head = (title, sub) => '<header class="ob__head"><h1 class="title">' + title + '</h1>' + (sub ? '<p class="lead">' + sub + '</p>' : '') + '</header>';
  const err = (key, text) => '<p class="field__error" data-err="' + key + '" hidden>' + text + '</p>';

  /* =========================================================
     1. Welcome
     ========================================================= */
  Screens.welcome = function (ctx) {
    const W = T.welcome;
    const el = h(
      '<section class="ob welcome-screen">' +
        '<div class="wc">' +
          '<div class="wc__brand">' + wordmark(34) + '</div>' +
          '<div class="wc__path">' + dottedPath('splash', { draw: true, width: 3.5, gap: 10 }) + '</div>' +
          '<div class="wc__lines">' + W.lines.map((l, i) => '<p class="wc__line" style="--d:' + i + '">' + l + '</p>').join('') + '</div>' +
        '</div>' +
        '<div class="ob__foot">' +
          '<button type="button" class="btn btn--primary btn--block" data-go="account">' + W.start + '</button>' +
          '<button type="button" class="btn btn--quiet btn--block" data-skip>' + W.skip + '</button>' +
        '</div>' +
      '</section>'
    );
    $(el, '[data-skip]').addEventListener('click', () => App.go('today', null, { reset: true, dir: 'fade' }));
    ctx.onEnter(() => { Anim.drawPath($(el, '.dpath__reveal'), { duration: 1600 }); el.classList.add('is-in'); });
    return el;
  };

  /* =========================================================
     2. Create your account: one form
     ========================================================= */
  Screens.account = function (ctx) {
    const s = st();
    const X = T.account;
    const p = s.profile;
    let city = p.city, home = p.hometown, codeOk = false, codeSent = false;
    const chips = (list, key, current) => '<div class="chips" role="radiogroup">' + list.map(c =>
      '<button type="button" class="pickchip' + (c === current ? ' is-on' : '') + '" role="radio" data-' + key + '="' + c + '" aria-checked="' + (c === current) + '">' + c + '</button>').join('') + '</div>';
    const years = [];
    for (let y = D.years.from; y <= D.years.to; y++) years.push(y);
    const el = obScreen(2,
      head(X.title, X.sub) +
      '<div class="form">' +
        '<div class="stack-8"><label class="label" for="fName">' + X.name + '</label>' +
          '<input id="fName" class="input" type="text" autocomplete="given-name" maxlength="20" placeholder="' + X.namePh + '" value="' + esc(p.name) + '">' + err('name', X.nameErr) + '</div>' +
        '<div class="stack-8"><label class="label" for="fPhone">' + X.phone + '</label>' +
          '<div class="phone-row"><label class="field"><span class="field__pre">+91</span>' +
            '<input id="fPhone" class="field__input" type="tel" inputmode="numeric" maxlength="10" autocomplete="off" placeholder="98765 43210" value="' + esc(p.phone) + '"></label>' +
            '<button type="button" class="btn btn--ink btn--sm" data-send>' + X.send + '</button></div>' + err('phone', X.phoneErr) +
          '<div class="codewrap" data-codewrap hidden>' +
            '<label class="label">' + X.code + '</label>' +
            '<div class="code"><input class="code__input" type="tel" inputmode="numeric" maxlength="4" autocomplete="one-time-code" aria-label="' + X.code + '">' +
              [0, 1, 2, 3].map(() => '<span class="code__box"></span>').join('') + '</div>' +
            '<p class="fine code__demo" data-codehelp>' + icon('info', 14) + X.codeHelp + '</p>' + err('code', X.codeErr) +
          '</div></div>' +
        '<div class="stack-8"><p class="label">' + X.city + '</p>' + chips(D.cities, 'city', city) + '</div>' +
        '<div class="stack-8"><p class="label">' + X.home + '</p>' + chips(D.cities, 'home', home) +
          '<input class="input" data-homeother type="text" maxlength="24" placeholder="' + X.homeOther + '" value="' + esc(p.homeOther) + '"' + (home === 'Other' ? '' : ' hidden') + '>' + err('home', X.homeErr) + '</div>' +
        '<div class="stack-8"><label class="label" for="fYear">' + X.year + '</label>' +
          '<select id="fYear" class="input select"><option value="">' + X.yearPh + '</option>' + years.map(y =>
            '<option value="' + y + '"' + (s.setup && Number(p.year18) === y ? ' selected' : '') + '>' + y + '</option>').join('') + '</select>' + err('year', X.yearErr) + '</div>' +
      '</div>',
      mainBtn(X.cta), 'account');

    const showErr = (k, on) => { const e = $(el, '[data-err="' + k + '"]'); if (e) e.hidden = !on; };
    const name = $(el, '#fName'), phone = $(el, '#fPhone'), code = $(el, '.code__input'), year = $(el, '#fYear'), other = $(el, '[data-homeother]');
    const boxes = $$(el, '.code__box');
    name.addEventListener('input', () => showErr('name', false));
    phone.addEventListener('input', () => { phone.value = phone.value.replace(/\D/g, '').slice(0, 10); showErr('phone', false); });
    year.addEventListener('change', () => showErr('year', false));

    $(el, '[data-send]').addEventListener('click', e => {
      if (phone.value.length !== 10) { showErr('phone', true); phone.focus(); return; }
      codeSent = true;
      $(el, '[data-codewrap]').hidden = false;
      e.currentTarget.textContent = X.resend;
      boxes[0].classList.add('is-on');
      code.focus();
      Anim.toast(X.sent);
    });
    code.addEventListener('input', () => {
      code.value = code.value.replace(/\D/g, '').slice(0, 4);
      boxes.forEach((b, i) => { b.textContent = code.value[i] || ''; b.classList.toggle('is-on', i === code.value.length); });
      codeOk = code.value.length === 4;
      $(el, '.code').classList.toggle('is-done', codeOk);
      showErr('code', false);
      if (codeOk) $(el, '[data-codehelp]').innerHTML = icon('check', 14) + X.codeOk;
    });
    $(el, '.code').addEventListener('click', () => code.focus());

    el.addEventListener('click', e => {
      const c = e.target.closest('[data-city]');
      if (c) { city = c.dataset.city; $$(el, '[data-city]').forEach(b => { b.classList.toggle('is-on', b === c); b.setAttribute('aria-checked', b === c); }); }
      const hm = e.target.closest('[data-home]');
      if (hm) {
        home = hm.dataset.home;
        $$(el, '[data-home]').forEach(b => { b.classList.toggle('is-on', b === hm); b.setAttribute('aria-checked', b === hm); });
        other.hidden = home !== 'Other';
        showErr('home', false);
        if (home === 'Other') other.focus();
      }
    });

    $(el, '[data-main]').addEventListener('click', () => {
      const v = name.value.trim().replace(/\s+/g, ' ');
      const bad = [];
      showErr('name', !v); if (!v) bad.push(name);
      showErr('phone', phone.value.length !== 10); if (phone.value.length !== 10) bad.push(phone);
      const needCode = !codeOk;
      showErr('code', needCode && codeSent);
      if (needCode && !codeSent) { showErr('phone', phone.value.length !== 10); Anim.toast(X.needCode); bad.push(phone); }
      else if (needCode) bad.push(code);
      const homeBad = !home || (home === 'Other' && !other.value.trim());
      showErr('home', homeBad); if (homeBad) bad.push(other);
      showErr('year', !year.value); if (!year.value) bad.push(year);
      if (bad.length) { bad[0].focus(); return; }
      const changed = p.hometown !== home || Number(p.year18) !== Number(year.value);
      p.name = v.charAt(0).toUpperCase() + v.slice(1);
      p.phone = phone.value;
      p.city = city;
      p.hometown = home;
      p.homeOther = other.value.trim();
      p.year18 = Number(year.value);
      if (changed) { s.quiz = {}; s.quizIds = null; }
      App.save();
      App.go('quiz');
    });
    return el;
  };

  /* =========================================================
     3. The nostalgia quiz: 8 old photos
     ========================================================= */
  Screens.quiz = function () {
    const Q = T.quiz;
    const cards = Model.newQuiz();
    const home = Model.hometown();
    let i = 0, top = null, swipe = null;
    const answers = {};
    const el = h(
      '<section class="quiz ob"><div class="scroll scroll--fit">' + obHead(3) +
        '<header class="quiz__head"><h1 class="title">' + fill(Q.title, { home: esc(home) }) + '</h1><p class="muted quiz__sub">' + Q.sub + '</p></header>' +
        '<div class="quiz__stack"></div>' +
        '<div class="quiz__dots" aria-hidden="true">' + cards.map(() => '<i></i>').join('') + '</div>' +
        '<div class="quiz__actions">' +
          '<button type="button" class="btn btn--ghost" data-a="no">' + Q.no + '</button>' +
          '<button type="button" class="btn btn--primary" data-a="yes">' + icon('heart', 18) + Q.yes + '</button>' +
        '</div>' +
      '</div></section>'
    );
    const stack = $(el, '.quiz__stack');
    function cardEl(c) {
      return h(
        '<article class="qcard qcard--photo" aria-label="' + esc(c.title) + '">' +
          polaroid(c, { caption: Model.caption(c) }) +
          '<p class="qcard__memory">' + c.title + '</p>' +
          '<span class="qcard__hint qcard__hint--yes" data-hint="yes">' + Q.stamp + '</span>' +
          '<span class="qcard__hint qcard__hint--no" data-hint="no">' + Q.no + '</span>' +
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
    }
    function decide(dir) {
      answers[cards[i].id] = dir === 'right';
      if (top) top.remove();
      i++;
      if (i >= cards.length) {
        st().quiz = answers;
        App.save();
        setTimeout(() => App.go('at18'), 260);
        return;
      }
      mount();
    }
    $(el, '[data-a="yes"]').addEventListener('click', () => {
      if (!top || !swipe) return;
      const p = $(top, '.polaroid');
      p.classList.add('is-stamped');
      setTimeout(() => swipe.fling('right'), Anim.reduced() ? 150 : 520);
    });
    $(el, '[data-a="no"]').addEventListener('click', () => swipe && swipe.fling('left'));
    mount();
    return el;
  };

  /* =========================================================
     4. You, at 18: three slides
     ========================================================= */
  Screens.at18 = function (ctx) {
    const R = T.at18;
    const s = st();
    if (!Object.keys(s.quiz).length) s.quiz = Model.defaultQuiz();
    const items = Model.quizItems();
    const yes = items.filter(q => s.quiz[q.id]);
    const yr = Model.year18();
    const home = esc(Model.hometown());
    const t = yes.slice(0, 3).map(q => q.tag);
    const sentence = t.length === 3 ? fill(R.three, { year: yr, a: t[0], b: t[1], c: t[2], home: home })
      : t.length === 2 ? fill(R.two, { year: yr, a: t[0], b: t[1], home: home })
        : t.length === 1 ? fill(R.one, { year: yr, a: t[0], home: home }) : fill(R.none, { year: yr, home: home });
    const pics = (yes.length ? yes : items).slice(0, 3).map((q, k) =>
      '<div class="at18__pic rv" style="--d:' + (k + 2) + '">' + UI.polaroid(q, { caption: Model.caption(q), tilt: [-6, 3, -2][k], cls: 'is-stamped' }) + '</div>').join('');
    const next = () => (s.setup ? App.go('me', null, { reset: true }) : App.go('connect'));
    const el = story({
      theme: 'sand',
      onClose: next,
      onEnd: next,
      slides: [
        { html: '<p class="eyebrow rv">' + R.eyebrow + '</p><h1 class="story__big rv" style="--d:1">' + named(R.hello, { year: yr }) + '</h1>' +
            '<div class="at18__pics">' + pics + '</div><p class="story__sub rv" style="--d:5">' + fill(R.place, { home: home }) + '</p>' },
        { html: '<p class="eyebrow rv">' + R.eyebrow + '</p><p class="story__quote rv" style="--d:1">' + sentence + '</p>' +
            '<div class="rv" style="--d:3">' + dottedPath('divider', { color: 'var(--amber)' }) + '</div>' },
        { html: '<h2 class="story__big rv">' + R.changed + '</h2><p class="story__sub rv" style="--d:1">' + R.see + '</p>' +
            '<button type="button" class="btn btn--primary btn--block rv" style="--d:2" data-at18-next>' + R.cta + icon('arrowRight', 18) + '</button>' }
      ]
    });
    $(el, '[data-at18-next]').addEventListener('click', next);
    ctx.onEnter(() => el.story.start());
    return el;
  };

  /* =========================================================
     5. Connect your agent: pick, read the promises, connect, sync
     ========================================================= */
  Screens.connect = function (ctx) {
    const s = st();
    const X = T.connect;
    let pick = s.profile.provider;
    const el = obScreen(5,
      head(X.title, X.sub) +
      '<div class="stack-12" role="radiogroup">' + D.providers.map(p =>
        '<button type="button" class="pick" role="radio" data-provider="' + p.id + '">' +
          '<span class="pick__icon">' + icon('chip', 22) + '</span>' +
          '<span class="pick__txt"><b>' + p.name + '</b><span>' + p.line + '</span></span>' +
          '<span class="pick__check">' + icon('check', 16) + '</span></button>').join('') + '</div>' +
      '<div class="card stack-12"><h2 class="card__h">' + icon('eye', 20) + X.seesTitle + '</h2>' +
        '<ul class="promise-list">' + X.sees.map(x => '<li>' + icon('check', 18) + x + '</li>').join('') + '</ul></div>' +
      '<div class="card stack-12"><h2 class="card__h">' + icon('shield', 20) + X.neverTitle + '</h2>' +
        '<ul class="promise-list">' + X.never.map(x => '<li>' + icon('check', 18) + x + '</li>').join('') + '</ul></div>',
      mainBtn(X.cta));
    function paint() {
      $$(el, '[data-provider]').forEach(b => { const on = b.dataset.provider === pick; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', on); });
    }
    el.addEventListener('click', e => { const b = e.target.closest('[data-provider]'); if (b) { pick = b.dataset.provider; paint(); } });
    el.appendChild(h(
      '<div class="sync" aria-live="polite">' +
        '<div class="sync__spin">' + dottedPath('splash', { color: 'var(--teal)', width: 3, gap: 9 }) + '</div>' +
        '<p class="sync__n" data-n>0</p><p class="sync__label" data-found></p>' +
        '<p class="sync__status" data-status>' + X.opening + '</p>' +
        '<div class="sync__done"><button type="button" class="btn btn--primary btn--block" data-synced>' + X.next + '</button></div>' +
      '</div>'));
    const timers = [];
    ctx.onLeave(() => timers.forEach(clearTimeout));
    $(el, '[data-main]').addEventListener('click', () => {
      s.profile.provider = pick;
      App.save();
      const sync = $(el, '.sync');
      sync.classList.add('is-on');
      Anim.countUp($(el, '[data-n]'), D.numbers.agentFound, { duration: 2200, delay: 200 });
      const status = $(el, '[data-status]');
      X.areas.forEach((a, k) => timers.push(setTimeout(() => { status.textContent = fill(X.reading, { x: a }); }, 300 + k * 380)));
      timers.push(setTimeout(() => {
        status.textContent = X.done;
        $(el, '[data-found]').innerHTML = named(X.found, { n: fmt(D.numbers.agentFound) });
        sync.classList.add('is-done');
      }, 2500));
    });
    $(el, '[data-synced]').addEventListener('click', () => App.go('find', { setup: true }));
    paint();
    return el;
  };

  /* Finishing setup (from Find your friends). */
  window.UI.finishSetup = function () {
    const s = st();
    s.setup = true;
    s.day = Model.newDay((s.day && s.day.run || 0) + 1);
    App.save();
    App.go('today', null, { reset: true, dir: 'up' });
  };
})();
