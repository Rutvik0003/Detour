/* Detour prototype · user model, nostalgia, the agent's day, options and friends (window.Model).
   No DOM here: screens and app.js read from it. */
(function () {
  'use strict';
  const D = window.DETOUR_DATA;
  const T = D.text;
  const S = () => window.App.state;

  const pickOne = list => list[Math.floor(Math.random() * list.length)];
  /* Every decision in the pool, by id. */
  const DECISIONS = {};
  D.slots.forEach(sl => sl.pool.forEach(d => { d.slot = sl.id; DECISIONS[d.id] = d; }));
  const decision = id => DECISIONS[id] || null;

  /* Every nostalgia memory (era packs + hometowns), by id. */
  const MEMORIES = {};
  D.eras.forEach(e => e.items.forEach(i => { MEMORIES[i.id] = i; }));
  Object.keys(D.hometowns).forEach(k => D.hometowns[k].forEach(i => { MEMORIES[i.id] = i; }));
  const memory = id => MEMORIES[id] || null;

  /* ---------- profile ---------- */
  const name = () => (S().profile.name || '').trim();
  const hometown = () => {
    const p = S().profile;
    return p.hometown === 'Other' ? (p.homeOther || '').trim() || 'your hometown' : p.hometown;
  };
  const year18 = () => Number(S().profile.year18) || 2019;
  const era = () => D.eras.find(e => year18() >= e.from && year18() <= e.to) || D.eras[1];
  const homeItems = () => D.hometowns[S().profile.hometown] || D.hometowns.Other;
  const provider = () => D.providers.find(p => p.id === S().profile.provider) || D.providers[0];

  /* The year of a memory, and how old you were then. */
  const yearOf = q => q.year || year18() + (q.off || 0);
  const ageAt = q => 18 + (yearOf(q) - year18());
  const caption = q => q.season + ', ' + yearOf(q);

  /* ---------- the nostalgia quiz: one memory per kind + one more + one from your hometown ---------- */
  function buildQuiz(random) {
    // Only memories from your teens (about 12 to 21); fall back to the whole pack if a kind is empty.
    const all = era().items;
    const teen = all.filter(i => ageAt(i) >= 12 && ageAt(i) <= 21);
    const items = teen.length >= 8 ? teen : all;
    const take = list => (random ? pickOne(list) : list[0]);
    const ofKind = k => { const t = items.filter(i => i.kind === k); return t.length ? t : all.filter(i => i.kind === k); };
    const byKind = D.quizKinds.map(k => take(ofKind(k)));
    const extra = take(items.filter(i => byKind.indexOf(i) < 0));
    const home = take(homeItems());
    const [tech, game, trend, music, food, fashion] = byKind;
    return [tech, home, game, trend, music, food, fashion, extra];
  }
  /* The current quiz: the one last shown, if it still matches your era and hometown. */
  function quizItems() {
    const s = S();
    const valid = s.quizIds && s.quizIds.length === 8 && s.quizIds.every(id => {
      const m = memory(id);
      return m && (era().items.indexOf(m) > -1 || homeItems().indexOf(m) > -1);
    });
    return valid ? s.quizIds.map(memory) : buildQuiz(false);
  }
  /* A fresh mix for the quiz screen, so two people with the same year can still differ. */
  function newQuiz() {
    S().quizIds = buildQuiz(true).map(q => q.id);
    return quizItems();
  }
  function defaultQuiz() {
    const out = {};
    quizItems().forEach((q, i) => { out[q.id] = [0, 1, 3, 4, 5].indexOf(i) > -1; });
    return out;
  }
  const yesItems = () => quizItems().filter(q => S().quiz[q.id] === true);

  /* "Remember this?" moments come from the same packs, your "yes" answers first. */
  function rememberInfo(id) {
    const m = memory(id);
    if (!m) return null;
    return { id: m.id, art: m.art, year: yearOf(m), title: UI.fill(T.today.rememberIn, { y: yearOf(m), x: m.rem }), line: m.now, cta: m.cta };
  }
  function pickRemember() {
    const mine = yesItems().filter(q => q.rem);
    const all = era().items.filter(q => q.rem);
    return pickOne(mine.length ? mine : all).id;
  }

  /* "You at 19 vs you today": your memories first, then general ones. */
  function thenNowPairs() {
    const out = [];
    const add = p => { if (out.length < 4 && !out.some(x => x.nowS === p.nowS)) out.push(p); };
    yesItems().filter(q => q.thenS).forEach(add);
    era().items.filter(q => q.thenS).forEach(add);
    D.thenNowExtra.forEach(add);
    return out;
  }

  /* ---------- the day ---------- */
  function newDay(run) {
    const s = S();
    const prev = s && s.day ? s.day.plan.map(p => p.id).join() : '';
    let plan, tries = 0;
    do {
      plan = D.slots.map(sl => ({ id: pickOne(sl.pool).id, time: sl.time + Math.floor(Math.random() * 9) - 4 }));
      tries++;
    } while (plan.map(p => p.id).join() === prev && tries < 5);
    plan.push({ id: 'remember', rid: pickRemember(), time: pickOne([690, 870, 1030, 1130]) });
    plan.sort((a, b) => a.time - b.time);
    const skills = s && s.skills && s.skills.length ? s.skills : ['cooking', 'wayfinding', 'writing', 'trip'];
    const ch = pickOne(D.challenges.filter(c => skills.indexOf(c.skill) > -1)) || D.challenges[0];
    return {
      run: run || 1, clock: D.day.start, plan: plan, log: [], sent: 0,
      challenge: ch.id, diy: 'idle', diySteps: {}, otd: Math.floor(Math.random() * D.onThisDay.length)
    };
  }

  function defaults() {
    return {
      v: 5,
      setup: false,
      profile: { name: '', phone: '', city: 'Bengaluru', hometown: 'Kolkata', homeOther: '', year18: 2016, provider: 'nova' },
      quiz: {},
      quizIds: null,
      skills: ['cooking', 'wayfinding', 'writing', 'trip'],
      notif: { limit: 3, quietFrom: 22, quietTo: 7 },
      day: null,
      stamps: D.numbers.stampsStart,
      friends: D.sampleFriends.slice(),
      requestsIn: D.requestsIn.slice(),
      requestsSent: [],
      invited: {},
      acceptedOnce: false,
      sentHandled: false,
      posts: [],
      likes: {},
      ideas: {},
      shares: [],
      redeemed: {}
    };
  }
  function finishDefaults() {
    const s = S();
    if (!Object.keys(s.quiz).length) s.quiz = defaultQuiz();
    if (!s.day) s.day = newDay(1);
  }

  const challenge = () => D.challenges.find(c => c.id === S().day.challenge) || D.challenges[0];
  /* Tonight's planned dinner, for the cooking challenge line. */
  function plannedDinner() {
    const p = S().day.plan.find(x => x.id !== 'remember' && decision(x.id).slot === 'dinner');
    const d = p && decision(p.id);
    return d && d.cook ? d.pick.toLowerCase() : T.today.usualDish;
  }

  function fmtTime(mins) {
    let hr = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    const ap = hr >= 12 ? 'pm' : 'am';
    hr = hr % 12 || 12;
    return hr + ':' + String(m).padStart(2, '0') + ' ' + ap;
  }
  const clockShort = mins => (Math.floor(mins / 60) % 24 % 12 || 12) + ':' + String(mins % 60).padStart(2, '0');
  function dayPart(mins) { const p = T.today.parts; return mins < 720 ? p[0] : mins < 1020 ? p[1] : p[2]; }
  function inQuiet(mins) {
    const n = S().notif, hr = mins / 60;
    return n.quietFrom > n.quietTo ? (hr >= n.quietFrom || hr < n.quietTo) : (hr >= n.quietFrom && hr < n.quietTo);
  }

  const OPEN = ['offer', 'skill', 'quietLimit', 'quietHours', 'remember'];
  const MADE = ['swap', 'self'];
  const logEntry = id => S().day.log.find(e => e.id === id);
  const isOpen = e => OPEN.indexOf(e.status) > -1;

  /* One planned item happens. silent = skipped past by a jump, so Detour says nothing. */
  function fire(item, silent) {
    const s = S(), d = s.day;
    if (logEntry(item.id)) return null;
    const entry = { id: item.id, time: item.time };
    if (item.id === 'remember') {
      entry.rid = item.rid;
      entry.status = silent ? 'notnow' : 'remember';
    } else {
      const dec = decision(item.id);
      if (dec.kind === 'quiet') entry.status = 'quiet';
      else if (silent) entry.status = 'went';
      else if (inQuiet(item.time)) { entry.status = 'quietHours'; entry.quiet = 'hours'; }
      else if (d.sent >= s.notif.limit) { entry.status = 'quietLimit'; entry.quiet = 'limit'; }
      else { entry.status = dec.kind === 'repeat' ? 'offer' : 'skill'; d.sent++; }
    }
    d.log.push(entry);
    d.log.sort((a, b) => a.time - b.time);
    return entry;
  }

  function expire(clock) {
    S().day.log.forEach(e => {
      if (e.status === 'remember' && clock >= e.time + 120) e.status = 'notnow';
      else if (isOpen(e) && e.status !== 'remember' && clock >= e.time + D.day.waitMins) e.status = 'went';
    });
  }
  const nextItem = upTo => S().day.plan.find(p => p.time <= upTo && !logEntry(p.id));
  function fastForward(to) {
    const d = S().day;
    d.plan.forEach(p => { if (p.time < to) fire(p, true); });
    d.clock = to;
    expire(to);
  }
  function choose(id, choice, opt) {
    const e = logEntry(id);
    if (!e) return;
    e.status = choice;
    e.opt = opt ? { title: opt.title, source: opt.source || null, cook: !!opt.cook } : null;
  }
  const madeToday = () => S().day.log.filter(e => MADE.indexOf(e.status) > -1).length + (S().day.diy === 'done' ? 1 : 0);

  /* What Today shows: an open moment, else the newest result, else today's challenge, else calm. */
  function todayMoment() {
    const d = S().day;
    const log = d.log;
    const open = log.slice().reverse().find(isOpen);
    if (open) return { kind: open.status === 'remember' ? 'remember' : 'open', entry: open };
    const newest = log[log.length - 1];
    if (newest && ['swap', 'self', 'keep'].indexOf(newest.status) > -1) return { kind: 'result', entry: newest };
    if (d.diy === 'idle' || d.diy === 'in' || d.diy === 'verify') return { kind: 'diy' };
    return { kind: 'calm', entry: log.slice().reverse().find(e => e.id !== 'remember') || null };
  }

  /* ---------- options from the three sources ---------- */
  function hash(str) { let n = 0; for (let i = 0; i < str.length; i++) n = (n * 31 + str.charCodeAt(i)) >>> 0; return n; }

  /* Simple facts instead of prices. */
  function facts(o) {
    const O = T.options;
    if (o.cook) return [UI.fill(O.uses, { a: o.uses[0], b: o.uses[1] }), UI.fill(O.mins, { n: o.mins })];
    return [o.meta];
  }

  function optionsFor(dec) {
    const s = S();
    const O = T.options;
    const k = hash(dec.id + s.day.run);
    const list = [];

    // From a friend: a dish they cook (for cooking plans) or something they loved
    const fr = dec.cook ? friends().filter(f => f.cook) : friends().filter(f => f.loves && f.loves[dec.cat]);
    if (fr.length) {
      const f = fr[k % fr.length];
      const src = dec.cook ? f.cook : f.loves[dec.cat];
      list.push(Object.assign({ source: 'friend', friend: f.id, sub: UI.fill(dec.cook ? O.friendCook : O.friendLine, { name: f.name }) }, src));
    }

    // From your taste: a quiz "yes", with how old you were
    // (rotates with the decision's own past favourite, so two meals in a day don't show the same card)
    const yes = yesItems().filter(q => q.taste && q.taste.cat === dec.cat);
    const pool = yes.concat([null]);
    const q = pool[k % pool.length];
    if (q) list.push(Object.assign({ source: 'taste', sub: UI.fill(O.tasteLine, { age: ageAt(q) }) }, q.taste));
    else list.push(Object.assign({ source: 'taste', sub: UI.fill(O.tasteLine, { age: 19 }) }, dec.fallback));

    // Something new: a quiz "not me", else something nobody you know has tried
    const no = quizItems().filter(q => q.taste && q.taste.cat === dec.cat && s.quiz[q.id] === false);
    if (no.length) {
      const q = no[k % no.length];
      list.push(Object.assign({ source: 'new', sub: UI.fill(O.skippedLine, { age: ageAt(q) }) }, q.taste));
    } else {
      list.push(Object.assign({ source: 'new', sub: O.newLine }, dec.news[k % dec.news.length]));
    }
    if (list.length < 3) list.push(Object.assign({ source: 'new', sub: O.newLine }, dec.news[(k + 1) % dec.news.length]));
    return list.map((o, i) => Object.assign({ id: dec.id + '-' + i, facts: facts(o) }, o));
  }

  /* ---------- friends ---------- */
  const person = id => D.people.find(p => p.id === id);
  const friends = () => S().friends.map(person).filter(Boolean);
  const isFriend = id => S().friends.indexOf(id) > -1;
  function feed() {
    const mine = S().posts.map(p => Object.assign({ mine: true }, p));
    const theirs = friends().filter(f => f.post).map(f => Object.assign({ id: 'p-' + f.id, by: f.id }, f.post));
    return mine.concat(theirs);
  }
  function sendRequest(id) {
    const s = S();
    if (s.requestsSent.indexOf(id) < 0 && !isFriend(id)) s.requestsSent.push(id);
    if (!s.acceptedOnce) { s.acceptedOnce = true; return true; }
    return false;
  }
  function acceptSent(id) {
    const s = S();
    s.requestsSent = s.requestsSent.filter(x => x !== id);
    if (!isFriend(id)) s.friends.push(id);
  }
  function answerRequest(id, yes) {
    const s = S();
    s.requestsIn = s.requestsIn.filter(x => x !== id);
    if (yes && !isFriend(id)) s.friends.push(id);
  }
  function sentFriend() {
    const want = person(D.sentToYou.from);
    if (isFriend(want.id)) return want;
    return friends()[0] || null;
  }

  window.Model = {
    defaults, finishDefaults, newDay, decision, memory, rememberInfo, thenNowPairs, challenge, plannedDinner,
    name, hometown, year18, provider, quizItems, newQuiz, defaultQuiz, caption, ageAt, yearOf,
    fmtTime, clockShort, dayPart, inQuiet,
    fire, expire, nextItem, fastForward, choose, logEntry, isOpen, madeToday, todayMoment, optionsFor,
    person, friends, isFriend, feed, sendRequest, acceptSent, answerRequest, sentFriend
  };
})();
