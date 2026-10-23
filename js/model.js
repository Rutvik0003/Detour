/* Detour prototype · user model, nostalgia quiz, the agent's day, options and friends (window.Model).
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
  const rememberById = id => D.remember.find(r => r.id === id);

  /* ---------- profile and nostalgia ---------- */
  const name = () => (S().profile.name || '').trim();
  const hometown = () => {
    const p = S().profile;
    return p.hometown === 'Other' ? (p.homeOther || '').trim() || 'your hometown' : p.hometown;
  };
  const year18 = () => Number(S().profile.year18) || 2019;
  const era = y => D.eras.find(e => y >= e.from && y <= e.to) || D.eras[1];
  const provider = () => D.providers.find(p => p.id === S().profile.provider) || D.providers[0];

  /* 8 polaroids: 6 from the era you turned 18 in, 2 from your hometown. */
  function quizItems() {
    const p = S().profile;
    const e = era(year18()).items;
    const home = D.hometowns[p.hometown] || D.hometowns.Other;
    return [e[0], home[0], e[1], e[2], home[1], e[3], e[4], e[5]];
  }
  function defaultQuiz() {
    const items = quizItems();
    const out = {};
    items.forEach((q, i) => { out[q.id] = [0, 1, 3, 4, 6].indexOf(i) > -1; });
    return out;
  }
  const caption = q => q.season + ', ' + (year18() + q.off);
  const ageAt = q => 18 + (q.off || 0);

  /* ---------- the day ---------- */
  function newDay(run) {
    const s = S();
    const prev = s && s.day ? s.day.plan.map(p => p.id).join() : '';
    let plan;
    let tries = 0;
    do {
      plan = D.slots.map(sl => {
        const d = pickOne(sl.pool);
        return { id: d.id, time: sl.time + Math.floor(Math.random() * 9) - 4 };
      });
      tries++;
    } while (plan.map(p => p.id).join() === prev && tries < 5);
    const r = pickOne(D.remember);
    plan.push({ id: 'remember', rid: r.id, time: pickOne([690, 870, 1030, 1130]) });
    plan.sort((a, b) => a.time - b.time);
    const skills = s && s.skills && s.skills.length ? s.skills : ['cooking', 'wayfinding', 'writing', 'trip'];
    const ch = pickOne(D.challenges.filter(c => skills.indexOf(c.skill) > -1).concat([])) || D.challenges[0];
    return {
      run: run || 1, clock: D.day.start, plan: plan, log: [], sent: 0,
      challenge: ch.id, diy: 'idle', diySteps: {}, otd: Math.floor(Math.random() * D.onThisDay.length)
    };
  }

  function defaults() {
    const s = {
      v: 4,
      setup: false,
      profile: { name: '', phone: '', city: 'Bengaluru', hometown: 'Kolkata', homeOther: '', year18: 2019, provider: 'nova' },
      quiz: {},
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
      tried: {},
      ideas: {},
      shares: [],
      redeemed: {}
    };
    return s;
  }
  /* Fill the parts that need the state to exist first. */
  function finishDefaults() {
    const s = S();
    if (!Object.keys(s.quiz).length) s.quiz = defaultQuiz();
    if (!s.day) s.day = newDay(1);
  }

  const challenge = () => D.challenges.find(c => c.id === S().day.challenge) || D.challenges[0];

  function fmtTime(mins) {
    let hr = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    const ap = hr >= 12 ? 'pm' : 'am';
    hr = hr % 12 || 12;
    return hr + ':' + String(m).padStart(2, '0') + ' ' + ap;
  }
  function clockShort(mins) {
    return (Math.floor(mins / 60) % 24 % 12 || 12) + ':' + String(mins % 60).padStart(2, '0');
  }
  function dayPart(mins) {
    const p = T.today.parts;
    return mins < 720 ? p[0] : mins < 1020 ? p[1] : p[2];
  }
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

  /* If you don't answer in time, the agent goes ahead. No guilt. */
  function expire(clock) {
    S().day.log.forEach(e => {
      if (e.status === 'remember' && clock >= e.time + 120) e.status = 'notnow';
      else if (isOpen(e) && e.status !== 'remember' && clock >= e.time + D.day.waitMins) e.status = 'went';
    });
  }

  function nextItem(upTo) {
    return S().day.plan.find(p => p.time <= upTo && !logEntry(p.id));
  }

  /* Move the clock forward, quietly logging anything before `to`. */
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
    e.opt = opt ? { title: opt.title, source: opt.source || null } : null;
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

  function optionsFor(dec) {
    const s = S();
    const O = T.options;
    const k = hash(dec.id + s.day.run);
    const list = [];

    // From a friend
    const fr = friends().filter(f => f.loves && f.loves[dec.cat]);
    if (fr.length) {
      const f = fr[k % fr.length];
      const l = f.loves[dec.cat];
      list.push({ source: 'friend', title: l.title, line: f.both, meta: l.meta, free: l.free, sub: UI.fill(O.friendLine, { name: f.name }), friend: f.id });
    }

    // From your taste: a "yes" from the quiz, with when you loved it
    const yes = quizItems().filter(q => q.cat === dec.cat && q.taste && s.quiz[q.id] === true);
    if (yes.length) {
      const q = yes[k % yes.length];
      list.push(Object.assign({ source: 'taste', sub: UI.fill(O.tasteLine, { age: ageAt(q) }) }, q.taste, { line: q.title + '.' }));
    } else {
      list.push(Object.assign({ source: 'taste', sub: UI.fill(O.tasteLine, { age: 19 }) }, dec.fallback));
    }

    // Something new: a "not me" from the quiz, else something nobody you know has tried
    const no = quizItems().filter(q => q.cat === dec.cat && q.taste && s.quiz[q.id] === false);
    const news = dec.news.slice();
    if (no.length) {
      const q = no[k % no.length];
      list.push(Object.assign({ source: 'new', sub: UI.fill(O.skippedLine, { age: ageAt(q) }) }, q.taste, { line: q.title + '.' }));
    } else {
      list.push(Object.assign({ source: 'new', sub: O.newLine }, news[k % news.length]));
    }
    // No friend for this? Show the other new idea instead of inventing one.
    if (list.length < 3) list.push(Object.assign({ source: 'new', sub: O.newLine }, news[(k + 1) % news.length]));
    return list.map((o, i) => Object.assign({ id: dec.id + '-' + i }, o));
  }

  /* ---------- friends ---------- */
  const person = id => D.people.find(p => p.id === id);
  const friends = () => S().friends.map(person).filter(Boolean);
  const isFriend = id => S().friends.indexOf(id) > -1;

  function feed() {
    const s = S();
    const mine = s.posts.map(p => Object.assign({ mine: true }, p));
    const theirs = friends().filter(f => f.post).map(f => Object.assign({ id: 'p-' + f.id, by: f.id }, f.post));
    return mine.concat(theirs);
  }

  /* Returns true when this request will be accepted a moment later (the first one only). */
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
    defaults, finishDefaults, newDay, decision, rememberById, challenge,
    name, hometown, year18, provider, quizItems, defaultQuiz, caption, ageAt,
    fmtTime, clockShort, dayPart, inQuiet,
    fire, expire, nextItem, fastForward, choose, logEntry, isOpen, madeToday, todayMoment, optionsFor,
    person, friends, isFriend, feed, sendRequest, acceptSent, answerRequest, sentFriend
  };
})();
