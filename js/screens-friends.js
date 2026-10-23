/* Detour prototype · Friends: one friend card at a time, a friend page, Sent to you, Swap tastes. */
(function () {
  'use strict';
  const D = window.DETOUR_DATA;
  const T = D.text;
  const st = () => window.App.state;
  const Screens = window.Screens;
  const UI = window.UI;
  const { h, esc, fill, $, $$, icon, backBtn, avatar } = UI;
  const EDIT = ' data-params=\'{"edit":true}\'';

  function sentFriend() {
    const s = st();
    const want = Model.contact(D.sentToYou.from);
    if (s.friends.indexOf(want.id) > -1) return want;
    return Model.friends()[0] || null;
  }
  const sentCount = () => (!st().sentHandled && sentFriend() ? 1 : 0);

  /* Shared actions on a friend's pick. */
  function onPickAction(e) {
    const s = st();
    const X = T.friends;
    const tryBtn = e.target.closest('[data-try]');
    if (tryBtn) {
      s.tried[tryBtn.dataset.try] = true;
      App.save();
      tryBtn.outerHTML = '<button type="button" class="btn btn--soft btn--sm" data-share-friend="' + tryBtn.dataset.try + '">' + icon('share', 16) + T.today.share + '</button>';
      Anim.toast(X.tried);
      return true;
    }
    const send = e.target.closest('[data-sendback]');
    if (send) {
      const f = Model.contact(send.dataset.sendback);
      Anim.toast(fill(X.sent, { name: f.name, x: Model.myPick() }));
      return true;
    }
    const sh = e.target.closest('[data-share-friend]');
    if (sh) {
      const f = Model.contact(sh.dataset.shareFriend);
      UI.openShare({ kind: 'friend', title: Model.friendPick(f).item.title });
      return true;
    }
    return false;
  }
  function actions(f) {
    const tried = st().tried[f.id];
    return '<div class="fcard__actions">' +
      (tried ? '<button type="button" class="btn btn--soft btn--sm" data-share-friend="' + f.id + '">' + icon('share', 16) + T.today.share + '</button>'
        : '<button type="button" class="btn btn--primary btn--sm" data-try="' + f.id + '">' + T.friends.tryIt + '</button>') +
      '<button type="button" class="btn btn--quiet btn--sm" data-sendback="' + f.id + '">' + T.friends.sendBack + '</button></div>';
  }

  /* =========================================================
     Friends tab
     ========================================================= */
  Screens.friends = function (ctx) {
    const s = st();
    const X = T.friends;
    const list = Model.friends();
    if (!list.length) {
      return h(
        '<section class="friendsscreen"><div class="scroll">' +
          '<header class="stack-8"><h1 class="title">' + X.title + '</h1><p class="muted">' + X.sub + '</p></header>' +
          '<div class="card card--sand empty">' + icon('people', 36) + '<p>' + X.empty + '</p>' +
            '<button type="button" class="btn btn--primary" data-go="friendsAdd"' + EDIT + '>' + icon('userPlus', 18) + X.add + '</button></div>' +
        '</div></section>'
      );
    }
    const el = h(
      '<section class="friendsscreen"><div class="scroll">' +
        '<header class="stack-8">' + (ctx.params.sunday ? '<p class="eyebrow">' + D.today.sunday + '</p>' : '') +
          '<h1 class="title">' + (ctx.params.sunday ? X.sunday : X.title) + '</h1><p class="muted">' + X.sub + '</p></header>' +
        '<div class="fcards" data-track>' + list.map(f => {
          const p = Model.friendPick(f);
          return '<article class="fcard" data-friend="' + f.id + '">' +
            '<button type="button" class="fcard__who" data-go="friend" data-params=\'{"id":"' + f.id + '"}\'>' + avatar(f, 44) +
              '<span><b>' + f.name + '</b><span class="fine">' + fill(X.loved, { name: f.name }) + '</span></span>' + icon('chevron', 16) + '</button>' +
            '<h2 class="fcard__pick">' + p.item.title + '</h2>' +
            '<p class="fcard__meta">' + icon(D.categories.find(c => c.id === p.cat).icon, 14) + p.item.meta + '</p>' +
            '<p class="fcard__both">' + icon('heart', 14) + f.both + '</p>' +
            actions(f) +
          '</article>';
        }).join('') + '</div>' +
        (list.length > 1 ? '<div class="fdots" aria-hidden="true">' + list.map(() => '<i></i>').join('') + '</div>' : '') +
        '<div class="card rows">' +
          '<button type="button" class="row row--link" data-go="sent"><span class="row__icon">' + icon('heart', 20) + '</span><span class="row__txt"><b>' + fill(X.sentRow, { n: sentCount() }) + '</b></span>' + icon('chevron', 18) + '</button>' +
          '<button type="button" class="row row--link" data-go="swap"><span class="row__icon">' + icon('shuffle', 20) + '</span><span class="row__txt"><b>' + X.swapRow + '</b>' +
            (s.swap ? '<span class="fine">' + fill(X.swapOn, { name: Model.contact(s.swap).name }) + '</span>' : '') + '</span>' + icon('chevron', 18) + '</button>' +
        '</div>' +
        '<button type="button" class="btn btn--quiet btn--block" data-go="friendsAdd"' + EDIT + '>' + icon('userPlus', 18) + X.invite + '</button>' +
      '</div></section>'
    );
    const track = $(el, '[data-track]');
    const dots = $$(el, '.fdots i');
    function paint() {
      const card = track.firstElementChild;
      const w = card ? card.offsetWidth + 12 : 1;
      const i = Math.round(track.scrollLeft / w);
      dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
    }
    track.addEventListener('scroll', () => requestAnimationFrame(paint));
    el.addEventListener('click', onPickAction);
    ctx.onEnter(paint);
    return el;
  };

  /* =========================================================
     A friend's page
     ========================================================= */
  Screens.friend = function (ctx) {
    const s = st();
    const X = T.friends;
    const f = Model.contact(ctx.params.id) || Model.friends()[0];
    const loved = D.categories.filter(c => s.categories[c.id] && f.loves[c.id]).slice(0, 3);
    const el = h(
      '<section class="friendpage"><div class="scroll">' + backBtn('friends') +
        '<header class="friendpage__head">' + avatar(f, 64) + '<h1 class="title">' + f.name + '</h1></header>' +
        '<section class="stack-12"><h2 class="h3">' + fill(X.pageLoved, { name: f.name }) + '</h2>' +
          '<div class="card rows">' + loved.map(c =>
            '<div class="row"><span class="row__icon">' + icon(c.icon, 20) + '</span><span class="row__txt"><b>' + f.loves[c.id].title + '</b><span class="fine">' + f.loves[c.id].meta + '</span></span></div>').join('') +
          '</div></section>' +
        '<section class="stack-8"><h2 class="h3">' + X.pageBoth + '</h2><p class="note">' + icon('heart', 16) + '<span>' + f.both + '</span></p></section>' +
        actions(f) +
      '</div></section>'
    );
    el.addEventListener('click', onPickAction);
    return el;
  };

  /* =========================================================
     Sent to you
     ========================================================= */
  Screens.sent = function () {
    const s = st();
    const X = T.friends;
    const f = sentFriend();
    const item = f ? f.loves[D.sentToYou.cat] : null;
    const el = h(
      '<section><div class="scroll">' + backBtn('friends') +
        '<header class="stack-8"><h1 class="title">' + X.sentTitle + '</h1><p class="muted">' + X.sentSub + '</p></header>' +
        (f && !s.sentHandled
          ? '<article class="card fcard fcard--single">' +
              '<div class="fcard__who">' + avatar(f, 44) + '<span><b>' + f.name + '</b><span class="fine">' + fill(X.sentLine, { name: f.name }) + '</span></span></div>' +
              '<h2 class="fcard__pick">' + item.title + '</h2><p class="fcard__meta">' + icon('music', 14) + item.meta + '</p>' +
              '<div class="fcard__actions"><button type="button" class="btn btn--primary btn--sm" data-sent="try">' + X.tryIt + '</button>' +
              '<button type="button" class="btn btn--quiet btn--sm" data-sent="not">' + X.sentNot + '</button></div></article>'
          : '<p class="note">' + icon('check', 16) + '<span>' + X.sentEmpty + '</span></p>') +
      '</div></section>'
    );
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-sent]');
      if (!b) return;
      s.sentHandled = true;
      App.save();
      Anim.toast(b.dataset.sent === 'try' ? X.sentTried : X.sentNotToast);
      App.back('friends');
    });
    return el;
  };

  /* =========================================================
     Swap tastes for a week
     ========================================================= */
  Screens.swap = function () {
    const s = st();
    const X = T.friends;
    const list = Model.friends();
    let pick = s.swap || (list[0] && list[0].id);
    const el = h('<section class="ob"><div class="scroll ob__scroll" data-body></div><div class="ob__foot" data-foot></div></section>');
    function paint() {
      const body = $(el, '[data-body]');
      const foot = $(el, '[data-foot]');
      const f = pick ? Model.contact(pick) : null;
      if (s.swap) {
        const sf = Model.contact(s.swap);
        body.innerHTML = UI.backBtn('friends') +
          '<header class="ob__head"><h1 class="title">' + X.swapTitle + '</h1><p class="lead">' + fill(X.swapOn, { name: sf.name }) + '</p></header>' +
          '<div class="swapnow">' + avatar(sf, 72) + '</div>';
        foot.innerHTML = '<button type="button" class="btn btn--ghost btn--block" data-stop>' + X.swapStop + '</button>';
        return;
      }
      if (!f) {
        body.innerHTML = UI.backBtn('friends') + '<header class="ob__head"><h1 class="title">' + X.swapTitle + '</h1></header><p class="note">' + icon('info', 16) + '<span>' + X.swapNeed + '</span></p>';
        foot.innerHTML = '<button type="button" class="btn btn--primary btn--block" data-go="friendsAdd"' + EDIT + '>' + X.add + '</button>';
        return;
      }
      body.innerHTML = UI.backBtn('friends') +
        '<header class="ob__head"><h1 class="title">' + X.swapTitle + '</h1><p class="lead">' + fill(X.swapSub, { name: f.name }) + '</p></header>' +
        '<p class="label">' + X.swapPick + '</p>' +
        '<div class="stack-12" role="radiogroup">' + list.map(c =>
          '<button type="button" class="pick" role="radio" data-pick="' + c.id + '" aria-checked="' + (c.id === pick) + '">' + avatar(c, 40) +
            '<span class="pick__txt"><b>' + c.name + '</b><span>' + c.both + '</span></span><span class="pick__check">' + icon('check', 16) + '</span></button>').join('') + '</div>';
      $$(body, '[data-pick]').forEach(b => b.classList.toggle('is-on', b.dataset.pick === pick));
      foot.innerHTML = '<button type="button" class="btn btn--primary btn--block" data-main data-swap-go>' + fill(X.swapCta, { name: f.name }) + '</button>';
    }
    el.addEventListener('click', e => {
      const p = e.target.closest('[data-pick]');
      if (p) { pick = p.dataset.pick; paint(); return; }
      if (e.target.closest('[data-swap-go]')) {
        s.swap = pick;
        App.save();
        Anim.toast(fill(X.swapToast, { name: Model.contact(pick).name }));
        App.back('friends');
        return;
      }
      if (e.target.closest('[data-stop]')) {
        s.swap = null;
        App.save();
        Anim.toast(X.swapStopped);
        paint();
      }
    });
    paint();
    return el;
  };
})();
