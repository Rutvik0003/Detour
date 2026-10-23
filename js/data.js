/* Detour prototype · all content and on-screen text lives here.
   Plain global object so the app runs from file:// with no fetch or modules. */
window.DETOUR_DATA = {
  user: { name: 'Rohan', city: 'Bengaluru', since: 'March 2040', initial: 'R' },

  today: { long: 'Sunday, 28 October 2040', clock: '8:02', month: 'October', lastMonth: 'September' },

  // Keep these consistent everywhere.
  numbers: {
    ocrStart: 18,        // choices made yourself, out of 100, when Rohan joined (March)
    ocrLastMonth: 20,
    ocrMonth: 22,        // this month
    ocrYear: 19,         // year average
    agentYear: 81,
    ocrDecember: 31,
    swapsMonth: 9,
    swapsYear: 74,
    firstsYear: 12,
    firstsMonth: 3,
    mealsYear: 20,
    mealsLastYear: 2,
    mealsMonthStart: 3,  // becomes 4 after today's challenge
    stampsStart: 140,
    stampReward: 15
  },

  /* =========================================================
     Guided tour: 7 steps
     ========================================================= */
  tour: [
    { screen: 'splash', title: 'Meet Detour',
      explain: 'Detour is a calm helper that sits next to your AI agent.',
      tryThis: 'Tap the screen to start.',
      target: '.splash__start' },
    { screen: 'quiz', title: 'A quick, fun quiz',
      explain: 'Detour starts with something fun. It needs no data.',
      tryThis: 'Swipe the card left or right. Or tap a button.',
      target: '[data-a="yes"]' },
    { screen: 'recap2026', title: 'Your 2026 self',
      explain: 'You get something back right away: a picture of your old self.',
      tryThis: 'Tap the screen for the next card. Then tap Connect your agent.',
      target: '.story__hint:not(.is-gone)' },
    { screen: 'link', title: 'Connect your agent',
      explain: 'Detour only looks at what your agent did. It never changes your agent.',
      tryThis: 'Tap Connect my agent at the bottom. Then tap Go to Today.',
      target: '[data-link]' },
    { screen: 'today', title: 'Your agent today',
      explain: 'Your agent picks things for you. Detour shows other options. You choose.',
      tryThis: 'Tap See other options on lunch. Then pick one.',
      target: '[data-feed="lunch"] [data-options]',
      notify: true },
    { screen: 'diy', title: 'Do it yourself',
      explain: 'A small daily challenge helps you keep a skill. You earn stamps.',
      tryThis: 'Tap I\'m in, then I did it, then Confirm.',
      target: '[data-act="in"]' },
    { screen: 'wrapped', title: 'Your year',
      explain: 'Once a year, you get a recap of your own choices. Share it if you like.',
      tryThis: 'Tap the screen to see each card.',
      target: '.story__hint:not(.is-gone)' }
  ],

  /* =========================================================
     The core idea: what the agent did today, and other options
     ========================================================= */
  agentFeed: [
    { id: 'lunch', time: '1:00 pm', cat: 'Food', icon: 'bowl', when: 'Coming up',
      action: 'Ordering your usual paneer bowl for lunch',
      noun: 'lunch', pick: 'Paneer bowl', pickNote: 'your 9th this month',
      swapToast: 'Done. Your agent will order this instead.',
      options: [
        { id: 'l1', source: 'friend', title: 'Northeast Indian thali',
          line: 'Ananya loved this Northeast Indian place last week.',
          meta: '15 min away · ₹350' },
        { id: 'l2', source: 'taste', title: 'Kerala fish curry meal',
          line: 'You used to love Kerala fish curry. This place does a great one.',
          meta: '20 min away · ₹420' },
        { id: 'l3', source: 'new', title: 'Millet bowl',
          line: 'A millet bowl café opened 1 km away.',
          meta: '1 km away · ₹280' }
      ] },
    { id: 'outfit', time: '7:00 am', cat: 'Clothes', icon: 'shirt', when: 'Done',
      action: 'Picked tomorrow\'s outfit: black tee, grey chinos',
      noun: 'your outfit', pick: 'Black tee and grey chinos', pickNote: 'your usual',
      swapToast: 'Done. Your agent will lay this out instead.',
      options: [
        { id: 'o1', source: 'friend', title: 'Handloom ikat shirt',
          line: 'Ananya wears hers every week. A weavers\' co-op sells them.',
          meta: '₹1,400' },
        { id: 'o2', source: 'taste', title: 'Your old linen shirt', free: true,
          line: 'You used to love oversized linen. One is still in your cupboard.',
          meta: 'Free · already yours' },
        { id: 'o3', source: 'new', title: 'Block-print kurta',
          line: 'Light and bright. Good for a hot day.',
          meta: '₹900' }
      ] },
    { id: 'playlist', time: '6:30 am', cat: 'Music', icon: 'music', when: 'Done',
      action: 'Made your morning playlist: the same 40 songs',
      noun: 'your playlist', pick: 'Morning mix', pickNote: 'the same 40 songs as last week',
      swapToast: 'Done. Your agent will play this instead.',
      options: [
        { id: 'p1', source: 'friend', title: 'Ananya\'s Kannada indie playlist', free: true,
          line: 'Ananya made this. Twelve songs, mostly guitars.',
          meta: 'Free · 48 min' },
        { id: 'p2', source: 'taste', title: 'Indie Hindi pop, 2026 mix', free: true,
          line: 'You played these on repeat in 2026.',
          meta: 'Free · 52 min' },
        { id: 'p3', source: 'new', title: 'A West African highlife album', free: true,
          line: 'Bright guitars and horns. Nothing like your usual.',
          meta: 'Free · 41 min' }
      ] }
  ],

  sources: {
    friend: { label: 'From a friend', icon: 'heart', cls: 'friend' },
    taste: { label: 'From your taste', icon: 'clock', cls: 'taste' },
    new: { label: 'Something new', icon: 'spark', cls: 'new' },
    nearby: { label: 'Something new nearby', icon: 'pin', cls: 'new' }
  },

  /* =========================================================
     Quick quiz (4 cards) and "Your 2026 self"
     ========================================================= */
  quiz: [
    { id: 'music', cat: 'Music', art: 'music', tint: '#FBE3DA',
      title: 'Indie Hindi pop on repeat',
      line: 'Soft guitars. Sad lyrics. Every café played it.' },
    { id: 'cafe', cat: 'Places', art: 'cafe', tint: '#EFE6D8',
      title: 'Weekend café hopping',
      line: 'Three cafés in one Saturday. A lot of iced coffee.' },
    { id: 'park', cat: 'Places', art: 'park', tint: '#E4EEDF',
      title: 'Morning walks in Cubbon Park',
      line: 'Up before the city. Just you and the trees.',
      local: 'Not a trend. Just a Bengaluru thing.' },
    { id: 'seafood', cat: 'Food', art: 'seafood', tint: '#FBE3DA',
      title: 'Kerala fish curry in Indiranagar',
      line: 'A small Malayali place. Fish curry and appam on a banana leaf.',
      local: 'Not a trend. Just a Bengaluru thing.' }
  ],

  persona: {
    whoOrder: ['cafe', 'park', 'seafood', 'music'],
    withOrder: ['music', 'seafood', 'park', 'cafe'],
    music:   { who: 'an indie Hindi pop fan', with: 'a soft spot for indie Hindi pop', short: 'Indie Hindi pop, on repeat', icon: 'music' },
    cafe:    { who: 'a café hopper', with: 'a weekend café list', short: 'Three cafés every Saturday', icon: 'pin' },
    park:    { who: 'an early riser', with: 'a Cubbon Park walking habit', short: 'Cubbon Park at 6 a.m.', icon: 'leaf' },
    seafood: { who: 'a fish curry regular', with: 'a soft spot for Kerala fish curry', short: 'Fish curry and appam', icon: 'bowl' }
  },

  /* =========================================================
     Connect your agent
     ========================================================= */
  link: {
    total: 4312,
    since: 2036,
    breakdown: [
      { who: 'Made by your agent', n: 3402, cls: 'agent' },
      { who: 'Made by you', n: 562, cls: 'you' },
      { who: 'Your agent asked, you said yes', n: 348, cls: 'approved' }
    ]
  },

  categories: [
    { id: 'food', label: 'Food', icon: 'bowl' },
    { id: 'music', label: 'Music', icon: 'music' },
    { id: 'clothes', label: 'Clothes', icon: 'shirt' },
    { id: 'places', label: 'Places', icon: 'pin' },
    { id: 'travel', label: 'Travel', icon: 'bag' }
  ],

  /* =========================================================
     Skills
     ========================================================= */
  skills: [
    { id: 'cooking', name: 'Cooking', icon: 'pot',
      note: 'You cooked most Sundays until 2033.',
      metric: 'Meals you cooked this month' },
    { id: 'trip', name: 'Planning trips', icon: 'route',
      note: 'You planned six trips yourself, 2027 to 2032.',
      metric: 'Trips you planned this year', value: 1,
      next: 'Next: plan a Saturday day trip.', cta: 'Save for Saturday', toast: 'Saved for Saturday. No rush.' },
    { id: 'wayfinding', name: 'Finding your way', icon: 'compass',
      note: 'You used to explore new areas without a map.',
      metric: 'Walks without a map this month', value: 2,
      next: 'Next: walk to the market without the map.', cta: 'Maybe this week', toast: 'Noted. Wear comfy shoes.' },
    { id: 'writing', name: 'Writing your own messages', icon: 'pen',
      note: 'Your birthday messages used to be long and warm.',
      metric: 'Messages you wrote this month', value: 5,
      next: 'Next: Ananya\'s birthday is on Friday.', cta: 'Remind me Friday', toast: 'We\'ll remind you on Friday. Just once.' }
  ],

  /* =========================================================
     Taste Map
     ========================================================= */
  tasteMap: {
    cats: [
      { id: 'food', label: 'Food' },
      { id: 'music', label: 'Music' },
      { id: 'clothes', label: 'Clothes' },
      { id: 'places', label: 'Places' }
    ],
    // Same layout for every category. r0 = size in 2026, r1 = size in 2040.
    slots: [
      { kind: 'often', x: 160, y: 150, r0: 30, r1: 46 },
      { kind: 'often', x: 232, y: 104, r0: 24, r1: 36 },
      { kind: 'often', x: 214, y: 226, r0: 22, r1: 32 },
      { kind: 'used', x: 92, y: 100, r0: 40, r1: 28 },
      { kind: 'used', x: 96, y: 210, r0: 36, r1: 28 },
      { kind: 'used', x: 274, y: 200, r0: 34, r1: 28 },
      { kind: 'unexplored', x: 298, y: 58, r0: 38, r1: 38 },
      { kind: 'unexplored', x: 50, y: 262, r0: 38, r1: 38 },
      { kind: 'unexplored', x: 44, y: 44, r0: 38, r1: 38 }
    ],
    labels: {
      food:    ['Biryani\nnights', 'Paneer\nbowls', 'Quick\nsalads', 'Kerala\nseafood', 'Home\ndal', 'Street\nchaat', 'Northeast\nIndian', 'Millet\nbowls', 'Ethiopian'],
      music:   ['Lo-fi\nfocus', 'Chill\npop', 'Gym\nmixes', 'Indie\nHindi pop', 'Old film\nsongs', 'Carnatic\nfusion', 'Kannada\nindie', 'Sufi\nqawwali', 'Highlife'],
      clothes: ['Grey\ntees', 'Navy\nchinos', 'Plain\nsneakers', 'Linen\nshirts', 'Block\nprints', 'Bright\ncolours', 'Handloom\nikat', 'Thrifted\nvintage', 'Workwear'],
      places:  ['Home', 'Usual\ncafés', 'Office', 'Cubbon\nPark', 'Café\nhopping', 'Book\nshops', 'Old city\nmarkets', 'Community\ntheatre', 'Lake\ncycling']
    }
  },

  ownBars: [
    { label: 'Places', pct: 28 },
    { label: 'Food', pct: 15 },
    { label: 'Travel', pct: 12 },
    { label: 'Music', pct: 9 },
    { label: 'Clothes', pct: 4 }
  ],

  /* =========================================================
     More ideas (reached from Today and from the Taste Map)
     ========================================================= */
  ideas: {
    food: {
      context: 'You\'ve ordered from the same five places since August.',
      options: [
        { id: 'f1', area: 'Northeast Indian', source: 'friend', who: 'Ananya loved this.',
          title: 'A Northeast Indian kitchen in Indiranagar',
          line: 'Smoky flavours and a chilli chutney she still talks about.',
          meta: '15 min away · about ₹600' },
        { id: 'f2', area: 'Ethiopian', source: 'nearby', who: '60 people near you tried it.',
          title: 'A new Ethiopian café near you',
          line: 'Big shared plates. You eat with your hands.',
          meta: '20 min away · about ₹500' },
        { id: 'f3', area: 'Millet bowls', source: 'new', who: 'Nothing like your usual.', free: true,
          title: 'Cook a millet khichdi tonight',
          line: 'One pot. 25 minutes. You have most things already.',
          meta: 'Free recipe · 25 min' }
      ]
    },
    music: {
      context: 'Your last 200 songs came from four playlists.',
      options: [
        { id: 'm1', area: 'Kannada indie', source: 'friend', who: 'Ananya made this.', free: true,
          title: 'Ananya\'s Kannada indie playlist',
          line: 'Twelve songs. Mostly guitars and rain.',
          meta: 'Free · 48 min' },
        { id: 'm2', area: 'Sufi qawwali', source: 'nearby', who: '140 people near you are going.', free: true,
          title: 'A free qawwali evening in a park',
          line: 'Saturday at 6 pm. Bring a mat.',
          meta: 'Free · Saturday evening' },
        { id: 'm3', area: 'Highlife', source: 'new', who: 'Nothing like your usual.', free: true,
          title: 'One West African highlife album',
          line: 'Bright guitars and horns. Great for a Sunday.',
          meta: 'Free · 41 min' }
      ]
    },
    clothes: {
      context: 'Your agent bought the same grey tee six times this year.',
      options: [
        { id: 'c1', area: 'Handloom ikat', source: 'friend', who: 'Ananya wears hers every week.',
          title: 'A handloom ikat shirt',
          line: 'Sold by the weavers themselves. Each one is a bit different.',
          meta: 'About ₹1,400' },
        { id: 'c2', area: 'Thrifted vintage', source: 'nearby', who: '90 people near you are going.', free: true,
          title: 'A clothes swap in Jayanagar',
          line: 'Bring two things. Take two things home.',
          meta: 'Free · Saturday 10 am' },
        { id: 'c3', area: 'Workwear', source: 'new', who: 'Nothing like your usual.',
          title: 'A strong canvas work jacket',
          line: 'The opposite of a grey tee. In a good way.',
          meta: 'About ₹2,000' }
      ]
    },
    places: {
      context: 'Most weekends since June looked the same.',
      options: [
        { id: 'pl1', area: 'Lake cycling', source: 'friend', who: 'Ananya rides here every Sunday.', free: true,
          title: 'A sunrise bike ride around a lake',
          line: 'Rent a bike at the gate. Back before breakfast.',
          meta: 'Free · 6 am start' },
        { id: 'pl2', area: 'Community theatre', source: 'nearby', who: '80 people near you went last week.',
          title: 'A comedy play in Malleshwaram',
          line: 'In Kannada, with English subtitles. Very loud crowd.',
          meta: 'About ₹300 · Friday 7 pm' },
        { id: 'pl3', area: 'Old city markets', source: 'new', who: 'Nothing like your usual.', free: true,
          title: 'A slow morning at an old market',
          line: 'Flowers at 6 am. Filter coffee at 7.',
          meta: 'Free to walk around' }
      ]
    }
  },

  /* =========================================================
     Do It Yourself
     ========================================================= */
  diy: {
    recipe: { name: 'Dal tadka, your way', meta: '35 min · 6 ingredients' },
    steps: [
      'Wash the dal. Soak it for 15 minutes.',
      'Pressure-cook it with turmeric and salt.',
      'Heat ghee. Add cumin, garlic and one chilli.',
      'Pour it over the dal. Add coriander. Done.'
    ],
    checks: [
      { wait: 'Looking at tonight…', done: 'We checked: your agent didn\'t order dinner.' },
      { done: 'You bought the dal yourself on Thursday.' }
    ]
  },

  redeem: [
    { id: 'plus', icon: 'star', title: 'One free month of Plus', desc: 'More Wrapped cards and a longer Taste Map.', cost: 120, toast: 'Done. One free month of Plus.' },
    { id: 'cards', icon: 'spark', title: 'Two extra Wrapped cards', desc: '"Best Sunday" and "Biggest surprise".', cost: 60, toast: 'Two extra cards added to your Wrapped.' },
    { id: 'family', icon: 'people', title: 'Family plan discount', desc: 'One month off when you add someone.', cost: 100, toast: 'Saved for later.' },
    { id: 'donate', icon: 'heart', title: 'Give to a good cause', desc: '50 stamps become ₹50 for a community kitchen.', cost: 50, toast: 'Donated. Thank you.' }
  ],

  /* =========================================================
     Recaps
     ========================================================= */
  monthly: {
    firsts: [
      { icon: 'bowl', t: 'Your first Northeast Indian dinner' },
      { icon: 'music', t: 'Your first Kannada indie album' },
      { icon: 'heart', t: 'Kerala fish curry, back after 4 years' }
    ]
  },

  wrapped: {
    firsts: [
      'Northeast Indian dinner', 'Kannada indie album', 'Clothes swap', 'Sunrise bike ride',
      'Millet khichdi', 'Comedy play', 'Handloom shirt', 'A trip you planned',
      'Ethiopian dinner', 'Highlife album', 'Bookshop Sunday', 'A birthday message you wrote'
    ],
    share: [
      { id: 'ocr', label: 'Choices I made myself', value: '31 out of 100 by December' },
      { id: 'swaps', label: 'Swaps', value: 'Swapped 74 of my agent\'s picks' },
      { id: 'firsts', label: 'Firsts', value: '12 firsts this year' },
      { id: 'meals', label: 'Meals', value: '20 meals cooked by me' }
    ]
  },

  /* =========================================================
     Me
     ========================================================= */
  promises: [
    'No paid suggestions, ever.',
    'Your data stays on your phone, unless you share it.',
    'Detour never changes your agent.'
  ],
  notifTimes: ['7:00', '7:30', '8:00', '8:30'],

  /* =========================================================
     All other on-screen text
     ========================================================= */
  text: {
    tagline: 'Your agent takes the fastest route. Detour shows you the scenic one.',
    agent: 'Your agent',
    detour: 'Detour',
    back: 'Back',
    close: 'Close',
    tabs: { today: 'Today', map: 'Taste Map', diy: 'Do It Yourself', me: 'Me' },

    splash: { start: 'Tap anywhere to start' },

    quiz: {
      eyebrow: 'Quick quiz',
      title: '2026 called.<br>Was this you?',
      sub: 'Swipe right for yes. Swipe left for no.',
      yes: 'Yes, that was me', no: 'Not me',
      hintYes: 'That was me', hintNo: 'Not me'
    },

    recap2026: {
      eyebrow: 'Your 2026 self',
      hello: 'Hello, 2026 you.',
      none: 'In 2026, you kept it a mystery. Fair enough.',
      one: 'In 2026, you were <em>{who}</em>. Simple.',
      two: 'In 2026, you were <em>{who}</em> with {with}.',
      listTitle: 'You picked all of this yourself.',
      listNone: 'You kept your cards close. Your agent history will fill in the rest.',
      question: 'Want to see how much has changed?',
      cta: 'Connect your agent'
    },

    link: {
      title: 'Connect your agent',
      lead: 'Detour looks at what your agent did for you. It never changes your agent.',
      seesTitle: 'What Detour sees',
      seesLine: 'Each choice, and who made it:',
      who: { agent: 'Your agent', you: 'You', approved: 'Your agent asked, you said yes' },
      neverTitle: 'What Detour never does',
      never: ['Never changes your agent', 'Never sells your data', 'Everything stays on your phone'],
      pickTitle: 'What Detour can look at',
      cta: 'Connect my agent',
      fine: 'You can disconnect any time in Me.',
      pickOne: 'Pick at least one.',
      found: 'choices found since',
      opening: 'Opening your agent\'s history…',
      reading: 'Looking at {x}…',
      done: 'Done. Nothing was changed.',
      stays: 'All of this stays on your phone.',
      next: 'Go to Today'
    },

    today: {
      hello: 'Good morning, {name}.',
      made: 'Choices you made yourself today:',
      feedTitle: 'Your agent today',
      feedSub: 'Your agent picks for you. Detour shows other options. You choose.',
      seeOptions: 'See other options',
      change: 'Change',
      swapped: 'You swapped to: {x}',
      self: 'You\'re doing this yourself: {x}',
      kept: 'You kept your agent\'s pick.',
      monthLine: 'This month, you made <b>{n} out of every 100</b> choices yourself.',
      monthDelta: 'Up from {n} last month',
      of100: 'of 100',
      challenge: 'Today\'s challenge',
      challengeLine: 'Cook one meal yourself.',
      challengeDone: 'Done. You cooked tonight.',
      ideas: 'More ideas', ideasSub: 'Things to try this week',
      recaps: 'Your recaps', recapsSub: 'October, and your year'
    },

    options: {
      title: 'Other options for {x}',
      picked: 'Your agent picked: <b>{x}</b> ({note}).',
      swap: 'Swap to this',
      self: 'I\'ll do it myself',
      keep: 'Keep my agent\'s pick',
      selfToast: 'Nice. This one\'s all yours.',
      keepToast: 'Okay. Your agent\'s pick stays.',
      noPaid: 'No paid suggestions, ever.',
      free: 'Free'
    },

    notify: {
      app: 'Detour',
      now: 'now',
      agentLine: 'Your agent: ordering your usual paneer bowl at 1 pm.',
      detourLine: 'Detour: 3 other options.'
    },

    stamps: {
      label: 'Your stamps', count: '{n} stamps', sub: 'You earn them by doing things yourself.', spend: 'Spend',
      sheetTitle: 'Spend your stamps',
      sheetSub: 'You have <b data-bal></b> stamps. You earned them by doing things yourself.',
      redeemed: 'Done',
      already: 'You already have this one.',
      short: 'You need {n} more stamps for this.',
      note: 'No brand vouchers. No ads. Ever.'
    },

    ideas: {
      title: 'More ideas',
      sub: 'Things to try, if you feel like it.',
      areaSub: 'You\'ve never tried this. Here are some ideas.',
      self: 'I\'ll do it myself', agent: 'Tell my agent', no: 'Not for me',
      selfState: 'It\'s yours. Have fun.',
      agentState: 'Sent to your agent. It won\'t change anything else.',
      undo: 'Undo',
      dismissed: 'Got it. We won\'t show this again.',
      emptyTitle: 'That\'s all for today.',
      emptyLine: 'New ideas tomorrow. Or look at your Taste Map.',
      openMap: 'Open Taste Map',
      selfToast: 'Nice. This one\'s all yours.',
      agentToast: 'Sent to your agent.',
      noPaid: 'No paid suggestions, ever.'
    },

    map: {
      title: 'Taste Map',
      sub: 'What you pick, and what you\'ve never tried.',
      often: 'You pick often', used: 'You used to pick', never: 'Never tried',
      tag: 'never tried',
      yearLabel: 'Your map in',
      replay: 'Replay',
      notes: ['Back then, you tried lots of things.', 'Your agent learned your habits. You tried less.', 'Now: a small centre, and three things you\'ve never tried.'],
      hint: 'Tap a dashed circle to get ideas.',
      barsTitle: 'Choices you made yourself',
      barsSub: 'This month, by type'
    },

    diy: {
      title: 'Do it yourself',
      sub: 'Small things you still want to do yourself. Only when you feel like it.',
      idleEyebrow: 'Today\'s challenge',
      idleTitle: 'Cook one meal yourself.',
      idleLine: 'In 2031, you made a great dal. Want to try again?',
      in: 'I\'m in', later: 'Maybe next Sunday', laterToast: 'No problem. It will wait.',
      cookingEyebrow: 'Cooking now',
      cookingTitle: 'You\'re cooking.',
      cookingLine: 'Your own steps from 2031. Tick them if you like.',
      did: 'I did it', cancel: 'Not tonight', cancelToast: 'That\'s okay. Your agent can make dinner.',
      checkEyebrow: 'Quick check',
      checkTitle: 'Nice! Let\'s check.',
      confirm: 'Confirm',
      checkFine: 'Detour only looks at tonight\'s food.',
      doneEyebrow: 'Done',
      doneTitle: 'You cooked tonight!',
      doneLine: 'That\'s meal {n} this month. Well done.',
      stampWords: ['Cooked', 'by you'],
      earned: '+{n} stamps',
      backToday: 'Back to Today',
      skillsTitle: 'Your skills',
      changeSkills: 'Change'
    },

    skills: {
      title: 'Skills you want to keep',
      lead: 'Pick 2 or 3. Now and then, Detour will invite you to do one yourself.',
      note: 'We never suggest medicine, health or big money choices. Those stay with your agent and experts.',
      keep: 'Keep these {n}',
      more: 'Pick {n} more',
      tooMany: 'Three is plenty. Unpick one first.',
      tooFew: 'Pick at least two.',
      saved: 'Saved.'
    },

    recaps: {
      title: 'Your recaps',
      sub: 'Short looks back at your own choices.',
      heroEyebrow: 'Preview · ready on 31 December',
      heroTitle: 'Your year: Detour Wrapped 2040',
      heroSub: 'Five short cards about your year.',
      open: 'Open',
      monthTitle: 'October recap', monthSub: 'This month · 4 cards',
      oldTitle: 'Your 2026 self', oldSub: 'From day one · 2 cards'
    },

    monthly: {
      eyebrow: 'October recap',
      madeLine: 'out of every 100 choices, you made yourself this month.',
      madeSub: 'Last month it was {last}. In March, it was {start}.',
      swapsEyebrow: 'Other options',
      swapsTitle: 'You swapped {n} of your agent\'s picks this month.',
      swapsSub: 'Two lunches, a lot of music, and one bright shirt.',
      firstsEyebrow: 'Firsts',
      firstsTitle: '{n} firsts this month.',
      skillsEyebrow: 'Your skills',
      skillsTitle: 'Still yours.',
      skillCook: 'Cooking: <b>{n} meals</b> made by you',
      skillTrip: 'Planning trips: <b>1 day trip</b> planned by you',
      done: 'Done'
    },

    wrapped: {
      eyebrow: 'Detour Wrapped 2040',
      title: 'Your year, in detours.',
      sub: 'Five cards. All about you, {name}.',
      agentLine: 'Your agent made <b class="hl" data-c1>0</b> of every 100 choices.',
      youLine: 'You made <b data-c2>0</b>.',
      butLine: 'But by December, you made',
      of100: 'out of every 100 yourself.',
      swaps: 'You swapped {n} of your agent\'s picks this year.',
      firstsEyebrow: 'Firsts',
      firstsTitle: 'firsts.',
      mealsEyebrow: 'Do it yourself',
      mealsTitle: 'meals, cooked by you.',
      mealsSub: 'Up from {n} last year. The 2031 dal is back.',
      shareEyebrow: 'Share if you like',
      shareTitle: '{name}\'s 2040, in detours',
      shareLabel: 'Nothing is shared until you turn it on.',
      shareEmpty: 'Nothing picked yet. Your year stays private.',
      share: 'Share',
      shared: 'Copied. Ready to share.',
      pickOne: 'Turn on at least one thing first.',
      done: 'Done'
    },

    story: { tap: 'Tap to continue' },

    me: {
      sub: '{city} · using Detour since {since}',
      recapsRow: 'Your recaps', recapsRowSub: 'October, your year, and your 2026 self',
      skillsRow: 'Skills you\'re keeping',
      dailyTitle: 'Daily message',
      dailyToggle: 'One message a day, at most',
      time: 'Time',
      dailyFine: 'Never at night.',
      timeToast: 'Your message will come at {t} am.',
      needOn: 'Turn the daily message on first.',
      onToast: 'Daily message on.',
      offToast: 'Daily message off. Detour will stay quiet.',
      catsTitle: 'What Detour can look at',
      catOn: 'Detour can look at {x} again.',
      catOff: 'Detour will stop looking at {x}.',
      promisesTitle: 'Our promises',
      planTitle: 'Your plan',
      freeTag: 'Your plan', freeName: 'Free', freeSub: 'Daily options, Taste Map and recaps.',
      plusTag: 'Coming soon', plusName: 'Plus', plusSub: '₹99 a month. More Wrapped cards and a family plan.',
      plusToast: 'Plus isn\'t ready yet.',
      soonTitle: 'Coming soon',
      friends: 'Friends\' Picks', friendsSub: 'A shelf of things your friends love', soon: 'Soon',
      friendsToast: 'Friends\' Picks is on the way.',
      disconnect: 'Disconnect my agent',
      disconnectToast: 'This is a prototype, so it stays connected.',
      restart: 'Restart the tour'
    },

    panel: {
      welcomeTitle: 'This is a 2-minute tour of Detour.',
      welcomeSub: 'Follow the steps, or explore freely.',
      start: 'Start the tour',
      explore: 'Explore freely',
      step: 'Step {n} of {total}',
      tryThis: 'Try this:',
      back: 'Back', next: 'Next', finish: 'Finish',
      leave: 'Leave the tour',
      doneTitle: 'That\'s Detour.',
      doneSub: 'Explore any screen freely, or restart the tour.',
      restart: 'Restart the tour',
      jumpTitle: 'Jump to any screen',
      tourGroup: 'The tour',
      moreGroup: 'More screens',
      foot: 'Press <kbd>D</kbd> for the <button type="button" class="linkbtn" data-demo-open>demo menu</button>.',
      tapHere: 'Tap here'
    },

    screens: {
      splash: 'Splash',
      quiz: 'Quick quiz',
      recap2026: 'Your 2026 self',
      link: 'Connect your agent',
      today: 'Today + other options',
      diy: 'Do it yourself',
      wrapped: 'Your year (Wrapped)',
      map: 'Taste Map',
      ideas: 'More ideas',
      skills: 'Skills you want to keep',
      monthly: 'October recap',
      recaps: 'Your recaps',
      me: 'Me'
    },

    demo: {
      title: 'Demo menu',
      sub: 'For walkthroughs and recordings',
      reset: 'Reset the demo',
      notify: 'Show agent notification',
      restart: 'Restart tour',
      jump: 'Jump to',
      foot: 'Press <kbd>D</kbd> to open or close. <kbd>Esc</kbd> also closes.',
      resetToast: 'Demo reset'
    }
  }
};
