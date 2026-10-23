/* Detour prototype · Friends: a scrolling feed of photos and videos, Find friends,
   Friend requests, Sent to you, New post, and a friend's page. */
(function () {
  'use strict';
  const D = window.DETOUR_DATA;
  const T = D.text;
  const st = () => window.App.state;
  const Screens = window.Screens;
  const UI = window.UI;
  const { h, esc, fill, $, $$, icon, backBtn, avatar, media, privacyNote, obHead } = UI;

  /* =========================================================
     Friends tab: the feed
     ========================================================= */
  function postHTML(p) {
    const s = st();
    const X = T.friends;
    const who = p.mine ? null : Model.person(p.by);
    const name = p.mine ? (Model.name() || T.you) : who.name;
    const liked = !!s.likes[p.id];
    return '<article class="post" data-post="' + p.id + '">' +
      '<header class="post__head">' +
        (who ? '<button type="button" class="post__who" data-go="friend" data-params=\'{"id":"' + who.id + '"}\'>' + avatar(who, 36) + '<span><b>' + who.name + '</b><span class="fine">' + who.city + ' · ' + p.ago + '</span></span></button>'
          : '<span class="post__who"><span class="avatar" style="width:36px;height:36px;font-size:16px">' + esc(name.charAt(0).toUpperCase()) + '</span><span><b>' + esc(name) + '</b><span class="fine">' + p.ago + '</span></span></span>') +
        '<span class="post__tag post__tag--' + p.tag + '">' + icon(p.tag === 'did' ? 'hand' : 'heart', 12) + (p.tag === 'did' ? X.did : X.loved) + '</span>' +
      '</header>' +
      media(p, p.id) +
      '<div class="post__actions"><button type="button" class="post__like' + (liked ? ' is-on' : '') + '" data-like="' + p.id + '" aria-pressed="' + liked + '">' + icon('heart', 20) + '<span>' + ((p.likes || 0) + (liked ? 1 : 0)) + '</span></button></div>' +
      '<p class="post__cap"><b>' + esc(name) + '</b> ' + esc(p.caption) + '</p>' +
    '</article>';
  }

  function wireFeed(el) {
    el.addEventListener('click', e => {
      const like = e.target.closest('[data-like]');
      if (like) {
        const s = st();
        const id = like.dataset.like;
        s.likes[id] = !s.likes[id];
        if (!s.likes[id]) delete s.likes[id];
        App.save();
        const n = $(like, 'span');
        n.textContent = Number(n.textContent) + (s.likes[id] ? 1 : -1);
        like.classList.toggle('is-on', !!s.likes[id]);
        like.setAttribute('aria-pressed', !!s.likes[id]);
        if (s.likes[id]) Anim.replayClass(like, 'is-pop');
        return;
      }
      const play = e.target.closest('[data-play]');
      if (play) {
        const m = play.closest('.media--video');
        const on = !m.classList.contains('is-playing');
        $$(el, '.media--video.is-playing').forEach(x => { x.classList.remove('is-playing'); $(x, '[data-play]').innerHTML = icon('play', 26); });
        m.classList.toggle('is-playing', on);
        play.innerHTML = icon(on ? 'pause' : 'play', 26);
        play.setAttribute('aria-label', on ? T.friends.pause : T.friends.play);
      }
    });
  }

  Screens.friends = function (ctx) {
    const s = st();
    const X = T.friends;
    const posts = Model.feed();
    const reqN = s.requestsIn.length;
    const sentN = !s.sentHandled && Model.sentFriend() ? 1 : 0;
    const el = h(
      '<section class="friendsscreen"><div class="scroll feed__scroll">' +
        '<header class="feed__head"><div>' + (ctx.params.sunday ? '<p class="eyebrow">' + D.today.sunday + '</p>' : '') +
          '<h1 class="title">' + (ctx.params.sunday ? X.sunday : X.title) + '</h1></div>' +
          '<button type="button" class="iconbtn iconbtn--primary" data-go="post" aria-label="' + X.post + '">' + icon('plus', 22) + '</button></header>' +
        '<button type="button" class="searchbar" data-go="find">' + icon('search', 18) + '<span>' + X.search + '</span></button>' +
        '<div class="pills">' +
          '<button type="button" class="pill' + (reqN ? ' pill--hot' : '') + '" data-go="requests">' + icon('userPlus', 16) + fill(X.requests, { n: reqN }) + '</button>' +
          '<button type="button" class="pill" data-go="sent">' + icon('heart', 16) + fill(X.sentToYou, { n: sentN }) + '</button>' +
        '</div>' +
        (posts.length ? '<div class="feed">' + posts.map(postHTML).join('') + '</div>'
          : '<div class="card card--sand empty">' + icon('people', 36) + '<p>' + X.empty + '</p><button type="button" class="btn btn--primary" data-go="find">' + icon('search', 18) + X.find + '</button></div>') +
        privacyNote() +
      '</div></section>'
    );
    wireFeed(el);
    return el;
  };

  /* =========================================================
     Find friends (also step 6 of setup)
     ========================================================= */
  Screens.find = function (ctx) {
    const s = st();
    const X = T.findFriends;
    const setup = !!ctx.params.setup;
    const el = h(
      '<section class="ob find"><div class="scroll ob__scroll">' +
        (setup ? obHead(6) : backBtn('friends')) +
        '<header class="ob__head"><h1 class="title">' + X.title + '</h1><p class="lead">' + X.sub + '</p></header>' +
        '<label class="searchbar searchbar--input">' + icon('search', 18) + '<input type="search" data-q placeholder="' + X.search + '" aria-label="' + X.search + '" autocomplete="off"></label>' +
        '<div class="card rows people" data-list></div>' +
        privacyNote() +
      '</div>' +
      (setup ? '<div class="ob__foot"><button type="button" class="btn btn--primary btn--block" data-main data-finish>' + X.start + '</button>' +
        '<button type="button" class="btn btn--quiet btn--block" data-finish>' + X.skip + '</button></div>' : '') +
      '</section>'
    );
    const q = $(el, '[data-q]');
    function btnFor(p) {
      if (Model.isFriend(p.id)) return '<span class="btn btn--sm btn--done people__btn">' + icon('check', 14) + X.friend + '</span>';
      if (s.requestsSent.indexOf(p.id) > -1) return '<span class="btn btn--sm btn--done people__btn">' + X.sent + '</span>';
      if (!p.on) return s.invited[p.id] ? '<span class="btn btn--sm btn--done people__btn">' + X.invited + '</span>'
        : '<button type="button" class="btn btn--sm btn--ghost people__btn" data-invite="' + p.id + '">' + X.invite + '</button>';
      return '<button type="button" class="btn btn--sm btn--soft people__btn" data-add="' + p.id + '">' + icon('userPlus', 14) + X.add + '</button>';
    }
    function paint() {
      const term = q.value.trim().toLowerCase();
      const digits = term.replace(/\D/g, '');
      const list = D.people.filter(p => !term || p.name.toLowerCase().indexOf(term) > -1 || (digits.length > 1 && p.phone.replace(/\D/g, '').indexOf(digits) > -1));
      $(el, '[data-list]').innerHTML = list.length ? list.map(p =>
        '<div class="row people__row">' + avatar(p, 40) + '<span class="row__txt"><b>' + p.name + '</b><span class="fine">' + p.city + '</span></span>' + btnFor(p) + '</div>').join('')
        : '<p class="muted people__none">' + X.none + '</p>';
    }
    q.addEventListener('input', paint);
    el.addEventListener('click', e => {
      const a = e.target.closest('[data-add]');
      if (a) {
        const id = a.dataset.add;
        const willAccept = Model.sendRequest(id);
        App.save();
        paint();
        if (willAccept) {
          setTimeout(() => {
            Model.acceptSent(id);
            App.save();
            Anim.toast(fill(X.accepted, { name: Model.person(id).name }));
            if (el.isConnected) paint();
          }, 3200);
        }
        return;
      }
      const inv = e.target.closest('[data-invite]');
      if (inv) { s.invited[inv.dataset.invite] = true; App.save(); paint(); Anim.toast(X.inviteToast); return; }
      if (e.target.closest('[data-finish]')) UI.finishSetup();
    });
    paint();
    return el;
  };

  /* =========================================================
     Friend requests
     ========================================================= */
  Screens.requests = function () {
    const s = st();
    const X = T.requests;
    const el = h('<section><div class="scroll">' + backBtn('friends') +
      '<header class="stack-8"><h1 class="title">' + X.title + '</h1><p class="muted">' + X.sub + '</p></header>' +
      '<div data-list></div>' + privacyNote() + '</div></section>');
    function paint() {
      $(el, '[data-list]').innerHTML = s.requestsIn.length ? '<div class="card rows">' + s.requestsIn.map(id => {
        const p = Model.person(id);
        return '<div class="row people__row">' + avatar(p, 44) + '<span class="row__txt"><b>' + p.name + '</b><span class="fine">' + p.city + '</span></span>' +
          '<span class="req__btns"><button type="button" class="btn btn--sm btn--primary" data-accept="' + id + '">' + X.accept + '</button>' +
          '<button type="button" class="btn btn--sm btn--quiet" data-ignore="' + id + '">' + X.ignore + '</button></span></div>';
      }).join('') + '</div>' : '<p class="note">' + icon('check', 16) + '<span>' + X.empty + '</span></p>';
    }
    el.addEventListener('click', e => {
      const a = e.target.closest('[data-accept]');
      const i = e.target.closest('[data-ignore]');
      if (!a && !i) return;
      const id = (a || i).dataset[a ? 'accept' : 'ignore'];
      Model.answerRequest(id, !!a);
      App.save();
      paint();
      Anim.toast(a ? fill(X.accepted, { name: Model.person(id).name }) : X.ignored);
    });
    paint();
    return el;
  };

  /* =========================================================
     Sent to you
     ========================================================= */
  Screens.sent = function () {
    const s = st();
    const X = T.sent;
    const f = Model.sentFriend();
    const item = f ? (f.loves[D.sentToYou.cat] || f.loves[Object.keys(f.loves)[0]]) : null;
    const el = h('<section><div class="scroll">' + backBtn('friends') +
      '<header class="stack-8"><h1 class="title">' + X.title + '</h1><p class="muted">' + X.sub + '</p></header>' +
      (f && !s.sentHandled
        ? '<article class="card sentcard"><div class="sentcard__band">' + avatar(f, 40) + '<div><p class="ocard__src">' + D.sources.friend.label + '</p><p class="ocard__sub">' + fill(X.line, { name: f.name }) + '</p></div></div>' +
            '<h2 class="h2">' + item.title + '</h2><p class="fine">' + item.meta + '</p>' +
            '<div class="fcard__actions"><button type="button" class="btn btn--primary btn--sm" data-sent="try">' + X.tryIt + '</button>' +
            '<button type="button" class="btn btn--quiet btn--sm" data-sent="not">' + X.not + '</button></div></article>'
        : '<p class="note">' + icon('check', 16) + '<span>' + X.empty + '</span></p>') +
      privacyNote() + '</div></section>');
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-sent]');
      if (!b) return;
      s.sentHandled = true;
      App.save();
      Anim.toast(b.dataset.sent === 'try' ? X.tried : X.notToast);
      App.back('friends');
    });
    return el;
  };

  /* =========================================================
     New post: a real photo or video from this device, or a picture from the gallery
     ========================================================= */
  Screens.post = function (ctx) {
    const s = st();
    const X = T.newPost;
    let chosen = null;
    let tag = 'did';
    const el = h('<section class="ob"><div class="scroll ob__scroll">' + backBtn('friends') +
      '<header class="ob__head"><h1 class="title">' + X.title + '</h1><p class="lead">' + X.sub + '</p></header>' +
      '<div class="postpreview" data-preview>' + icon('image', 40) + '</div>' +
      '<label class="btn btn--ghost btn--block filebtn">' + icon('camera', 18) + X.pick + '<input type="file" accept="image/*,video/*" data-file hidden></label>' +
      '<p class="fine center">' + X.pickHelp + '</p>' +
      '<p class="label">' + X.gallery + '</p>' +
      '<div class="gallery">' + D.gallery.map((g, i) => '<button type="button" class="gallery__item" data-g="' + i + '" aria-label="' + g.label + '">' + UI.scene(g.art) +
        (g.kind === 'video' ? '<span class="gallery__vid">' + icon('play', 14) + '</span>' : '') + '</button>').join('') + '</div>' +
      '<p class="label">' + X.tag + '</p>' +
      '<div class="seg"><button type="button" data-tag="did" class="is-active">' + X.tagDid + '</button><button type="button" data-tag="loved">' + X.tagLoved + '</button></div>' +
      '<label class="label" for="pCap">' + X.caption + '</label>' +
      '<textarea id="pCap" class="input textarea" maxlength="140" placeholder="' + X.captionPh + '"></textarea>' +
      privacyNote() + '</div>' +
      '<div class="ob__foot"><button type="button" class="btn btn--primary btn--block" data-main>' + X.cta + '</button></div></section>');
    const preview = $(el, '[data-preview]');
    function showPreview() {
      if (!chosen) { preview.innerHTML = icon('image', 40); return; }
      preview.innerHTML = media(chosen, 'preview');
    }
    $(el, '[data-file]').addEventListener('change', e => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      chosen = { url: URL.createObjectURL(f), kind: f.type.indexOf('video') === 0 ? 'video' : 'photo', temp: true };
      $$(el, '[data-g]').forEach(b => b.classList.remove('is-on'));
      showPreview();
      Anim.toast(X.fileNote);
    });
    el.addEventListener('click', e => {
      const g = e.target.closest('[data-g]');
      if (g) {
        const item = D.gallery[Number(g.dataset.g)];
        chosen = { art: item.art, kind: item.kind };
        $$(el, '[data-g]').forEach(b => b.classList.toggle('is-on', b === g));
        showPreview();
        return;
      }
      const t = e.target.closest('[data-tag]');
      if (t) { tag = t.dataset.tag; $$(el, '[data-tag]').forEach(b => b.classList.toggle('is-active', b === t)); return; }
      const play = e.target.closest('[data-play]');
      if (play) { const m = play.closest('.media--video'); m.classList.toggle('is-playing'); play.innerHTML = icon(m.classList.contains('is-playing') ? 'pause' : 'play', 26); }
    });
    $(el, '[data-main]').addEventListener('click', () => {
      if (!chosen) { Anim.toast(X.need); return; }
      s.posts.unshift(Object.assign({ id: 'me-' + Date.now(), tag: tag, caption: $(el, '#pCap').value.trim() || (tag === 'did' ? T.newPost.tagDid + '.' : T.newPost.tagLoved + '.'), likes: 0, ago: 'now' }, chosen));
      App.save();
      Anim.toast(X.posted);
      App.go('friends', null, { reset: true });
    });
    return el;
  };

  /* =========================================================
     A friend's page
     ========================================================= */
  Screens.friend = function (ctx) {
    const f = Model.person(ctx.params.id) || Model.friends()[0];
    const X = T.friend;
    const loves = Object.keys(f.loves || {}).map(k => f.loves[k]);
    const el = h('<section class="friendpage"><div class="scroll">' + backBtn('friends') +
      '<header class="friendpage__head">' + avatar(f, 64) + '<div><h1 class="title">' + f.name + '</h1><p class="muted">' + f.city + '</p></div></header>' +
      (f.post ? postHTML(Object.assign({ id: 'p-' + f.id, by: f.id }, f.post)) : '') +
      '<section class="stack-12"><h2 class="h3">' + fill(X.loved, { name: f.name }) + '</h2><div class="card rows">' + loves.map(l =>
        '<div class="row"><span class="row__icon" style="background:' + D.sources.friend.tint + ';color:' + D.sources.friend.color + '">' + icon('heart', 18) + '</span><span class="row__txt"><b>' + l.title + '</b><span class="fine">' + l.meta + '</span></span></div>').join('') + '</div></section>' +
      '<section class="stack-8"><h2 class="h3">' + X.both + '</h2><p class="note">' + icon('heart', 16) + '<span>' + (f.both || '') + '</span></p></section>' +
      privacyNote() + '</div></section>');
    wireFeed(el);
    return el;
  };
})();
