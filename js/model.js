/* Detour prototype · the user model, the options generator and the day engine (window.Model).
   No DOM here: screens and app.js read from it and listen for App events. */
(function () {
  'use strict';
  const D = window.DETOUR_DATA;
  const T = D.text;
  const S = () => window.App.state;

  /* ---------- state ---------- */
  function freshDay() {
    return { clock: D.day.start, log: [], sent: 0 };
  }

  /* The quiz for a city: 3 general items + 2 for that city, in a fixed order. */
  function quizItems(city) {
    const local = D.quiz.cities[city] || D.quiz.cities.Other;
    const gen = {};
    D.quiz.general.forEach(q => { gen[q.id] = q; });
    return D.quiz.order.map(k => (k === 'CITY0' ? local[0] : k === 'CITY1' ? local[1] : gen[k]));
  }

  function defaultQuiz(city) {
    const items = quizItems(city);
    const out = {};
    D.quiz.order.forEach((k, i) => { out[items[i].id] = D.quiz.defaults[k]; });
    return out;
  }

  /* explore = true gives a ready-to-use account for "Explore freely". */
  function defaults(explore) {
    return {
      v: 3,
      onboarded: !!explore,
      profile: { name: '', city: 'Bengaluru', phone: '', provider: 'nova' },
      quiz: explore ? defaultQuiz('Bengaluru') : {},
      categories: { food: true, music: true, clothes: true, places: true, weekend: true },
      skills: ['cooking', 'trip'],
      friends: explore ? D.sampleFriends.slice() : [],
      invited: {},
      friendSee: { food: true, music: true, clothes: true, places: true, weekend: false },
      notif: { limit: 3, quietFrom: 22, quietTo: 7 },
      day: freshDay(),
      stamps: D.numbers.stampsStart,
      mealsMonth: D.numbers.mealsMonthStart,
      diy: 'idle',
      diySteps: {},
      ideas: {},
      shares: [],
      swap: null,
      tried: {},
      sentHandled: false,
      redeemed: {}
    };
  }

  /* Fill anything missing when someone jumps ahead without onboarding. */
  function ensureReady() {
    const s = S();
    if (!Object.keys(s.quiz).length) s.quiz = defaultQuiz(s.profile.city);
    s.onboarded = true;
  }

  /* ---------- small helpers ---------- */
  const name = () => (S().profile.name || '').trim();
  const provider = () => D.providers.find(p => p.id === S().profile.provider) || D.providers[0];
  const contact = id => D.contacts.find(c => c.id === id);
  const friends = () => S().friends.map(contact).filter(Boolean);
  const event = id => D.day.events.find(e => e.id === id);
  const catLabel = id => (D.categories.find(c => c.id === id) || { label: '' }).label;

  function fmtTime(mins) {
    let h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    const ap = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return h + ':' + String(m).padStart(2, '0') + ' ' + ap;
  }
  function clockShort(mins) {
    const h = Math.floor(mins / 60) % 24 % 12 || 12;
    return h + ':' + String(mins % 60).padStart(2, '0');
  }
  function dayPart(mins) {
    const p = T.today.parts;
    return mins < 720 ? p[0] : mins < 1020 ? p[1] : p[2];
  }
  function inQuiet(mins) {
    const n = S().notif, hr = mins / 60;
    return n.quietFrom > n.quietTo ? (hr >= n.quietFrom || hr < n.quietTo) : (hr >= n.quietFrom && hr < n.quietTo);
  }

  /* ---------- the options generator ---------- */
  function quizIn(cat, answer) {
    const s = S();
    return quizItems(s.profile.city).filter(q => q.cat === cat && s.quiz[q.id] === answer);
  }

  function optionsFor(ev) {
    const s = S();
    const cat = ev.cat;
    const rot = ev.rot || 0;
    const C = D.catalog[cat];
    const O = T.options;

    // From a friend (or from the friend you swapped tastes with)
    let friendOpt = null;
    const swapF = s.swap ? contact(s.swap) : null;
    const pool = swapF ? [swapF] : friends().filter(f => f.loves && f.loves[cat]);
    if (pool.length) {
      const f = pool[rot % pool.length];
      const l = f.loves[cat];
      friendOpt = { source: 'friend', title: l.title, line: UI.fill(swapF ? O.swapLine : O.friendLine, { name: f.name }), meta: l.meta, free: !!l.free };
    }

    // From your taste: a quiz "yes" in this category, else something you used to do
    const yes = quizIn(cat, true);
    const tasteSrc = yes[rot] ? yes[rot].taste : C.taste[rot % C.taste.length];
    const tasteOpt = Object.assign({ source: 'taste' }, tasteSrc);

    // Something new: a quiz "not me" in this category, else new in your city
    const no = quizIn(cat, false);
    let newOpt;
    let cityNew = false;
    if (no[rot]) newOpt = Object.assign({ source: 'new' }, no[rot].taste, { line: O.skippedLine });
    else if (C.newCity && rot === 0) { newOpt = Object.assign({ source: 'new' }, C.newCity[s.profile.city] || C.newCity.Other); cityNew = true; }
    else newOpt = Object.assign({ source: 'new' }, C.newMore);

    // No friends yet: offer a second new idea instead of inventing a friend.
    if (!friendOpt) friendOpt = Object.assign({ source: 'new' }, C.newMore.title === newOpt.title ? C.free : C.newMore);

    const list = [friendOpt, tasteOpt, newOpt];
    // Keep a free option in the mix, unless that would hide a new idea from your own city.
    if (!list.some(o => o.free) && !cityNew) list[2] = Object.assign({ source: 'new' }, C.free);
    return list.map((o, i) => Object.assign({ id: ev.id + '-' + i }, o));
  }

  /* ---------- the day engine ---------- */
  const OPEN = ['notified', 'quietLimit', 'quietHours', 'diyOpen'];
  const MADE = ['swap', 'self', 'diyDone'];

  const logEntry = id => S().day.log.find(e => e.id === id);

  /* An agent decision happens. silent = skipped past (jumps), so Detour says nothing. */
  function fire(ev, silent) {
    const s = S(), d = s.day;
    if (logEntry(ev.id)) return null;
    const entry = { id: ev.id, time: ev.time };
    if (ev.type === 'diy') entry.status = s.diy === 'done' ? 'diyDone' : silent ? 'diySkip' : 'diyOpen';
    else if (!ev.repeat) entry.status = 'info';
    else if (!s.categories[ev.cat]) entry.status = 'off';
    else if (silent) entry.status = 'went';
    else if (inQuiet(ev.time)) { entry.status = 'quietHours'; entry.quiet = 'hours'; }
    else if (d.sent >= s.notif.limit) { entry.status = 'quietLimit'; entry.quiet = 'limit'; }
    else { entry.status = 'notified'; d.sent++; }
    d.log.push(entry);
    d.log.sort((a, b) => a.time - b.time);
    return entry;
  }

  /* If you don't answer in time, the agent just goes ahead. No guilt. */
  function expire(clock) {
    S().day.log.forEach(e => {
      if (e.status === 'diyOpen' && clock >= e.time + 150) e.status = 'diySkip';
      else if (OPEN.indexOf(e.status) > -1 && e.status !== 'diyOpen' && clock >= e.time + D.day.waitMins) e.status = 'went';
    });
  }

  /* Move the clock forward, quietly logging anything that happened before `to`. */
  function fastForward(to) {
    const d = S().day;
    D.day.events.forEach(ev => { if (ev.time < to) fire(ev, true); });
    d.clock = to;
    expire(to);
  }

  function resetDay() { S().day = freshDay(); }

  function choose(id, choice, opt) {
    const e = logEntry(id);
    if (!e) return;
    e.status = choice;
    e.opt = opt ? { title: opt.title } : null;
  }

  function markDiy(status) {
    const e = logEntry('diy');
    if (e) e.status = status;
  }

  const madeToday = () => S().day.log.filter(e => MADE.indexOf(e.status) > -1).length;
  const isOpen = e => OPEN.indexOf(e.status) > -1;

  /* What Today shows: the newest open moment, else the newest result, else calm. */
  function todayMoment() {
    const log = S().day.log;
    const open = log.slice().reverse().find(isOpen);
    if (open) return { kind: 'open', entry: open };
    const last = log.slice().reverse().find(e => e.status !== 'info' && e.status !== 'off');
    const newest = log[log.length - 1];
    if (last && last === newest && ['swap', 'self', 'keep', 'diyDone'].indexOf(last.status) > -1) return { kind: 'result', entry: last };
    return { kind: 'calm', entry: newest || null };
  }

  /* A friend's pick for the Friends tab: prefer your enabled categories. */
  function friendPick(f) {
    const s = S();
    const order = ['food', 'music', 'weekend', 'clothes', 'places'];
    const cat = order.find(c => s.categories[c] && f.loves[c]) || order.find(c => f.loves[c]);
    return { cat: cat, item: f.loves[cat] };
  }

  /* Something of yours to send back to a friend. */
  function myPick() {
    const s = S();
    const yes = quizItems(s.profile.city).filter(q => s.quiz[q.id]);
    return yes.length ? yes[0].taste.title : D.catalog.food.taste[0].title;
  }

  window.Model = {
    defaults, defaultQuiz, ensureReady, freshDay, quizItems,
    name, provider, contact, friends, event, catLabel,
    fmtTime, clockShort, dayPart, inQuiet,
    optionsFor, fire, expire, fastForward, resetDay, choose, markDiy, logEntry,
    madeToday, isOpen, todayMoment, friendPick, myPick, OPEN
  };
})();
