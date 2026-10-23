/* Detour prototype · all fake content lives here.
   Plain global object so the app runs from file:// with no fetch or modules. */
window.DETOUR_DATA = {
  user: { name: 'Rohan', city: 'Bengaluru', since: 'March 2040', initial: 'R' },

  today: { long: 'Sunday, 28 October 2040', clock: '8:02', month: 'October', lastMonth: 'September' },

  // Keep these consistent everywhere.
  numbers: {
    ocrStart: 18,        // owned-choice rate when Rohan joined (March)
    ocrLastMonth: 20,
    ocrMonth: 22,        // this month
    ocrYear: 19,         // year average
    agentYear: 81,
    ocrDecember: 31,
    firstsYear: 12,
    firstsMonth: 3,
    mealsYear: 20,
    mealsLastYear: 2,
    mealsMonthStart: 3,  // becomes 4 after today's challenge
    stampsStart: 140,
    stampReward: 15
  },

  /* ---------- 2. Nostalgia quiz ---------- */
  quiz: [
    { id: 'music', cat: 'Music', art: 'music', tint: '#FBE3DA',
      title: 'Indie Hindi pop on loop',
      line: 'Soft guitars, softer heartbreak. Every café had the same playlist, and you knew all of it.' },
    { id: 'corndog', cat: 'Food', art: 'corndog', tint: '#EFE6D8',
      title: 'Cheese-pull corn dogs',
      line: 'The food-street snack everyone filmed before eating. You definitely filmed it.' },
    { id: 'linen', cat: 'Fashion', art: 'linen', tint: '#D9ECE8',
      title: 'Oversized linen shirts',
      line: 'Two sizes up, sleeves rolled. Very "just back from Goa," even on a Tuesday.' },
    { id: 'park', cat: 'Places', art: 'park', tint: '#E4EEDF',
      title: 'Cubbon Park morning walks',
      line: 'Before the city woke up. Just you, the bamboo, and one man doing very loud laughter yoga.',
      local: 'Not a trend. Just a Bengaluru thing.' },
    { id: 'cafe', cat: 'Places', art: 'cafe', tint: '#EFE6D8',
      title: 'Weekend café hopping',
      line: 'Three cafés, one Saturday, one very long iced coffee. Productivity optional.' },
    { id: 'seafood', cat: 'Food', art: 'seafood', tint: '#FBE3DA',
      title: 'Kerala-style seafood in Indiranagar',
      line: 'A small Malayali place. Fish curry, appam, and a banana leaf you didn\'t have to wash.',
      local: 'Not a trend. Just a Bengaluru thing.' }
  ],

  /* Pieces used to write the "Your 2026 self" recap from the answers. */
  persona: {
    whoOrder: ['cafe', 'park', 'linen', 'seafood', 'music', 'corndog'],
    withOrder: ['music', 'seafood', 'linen', 'park', 'cafe', 'corndog'],
    music:   { who: 'an indie Hindi pop devotee', with: 'a soft spot for indie Hindi pop', short: 'Indie Hindi pop, on loop', icon: 'music' },
    corndog: { who: 'a food-street trend chaser', with: 'zero shame about corn dogs', short: 'Corn dogs, filmed first', icon: 'bowl' },
    linen:   { who: 'a linen-shirt loyalist', with: 'a cupboard full of oversized linen', short: 'Oversized linen, sleeves rolled', icon: 'shirt' },
    park:    { who: 'an early riser', with: 'a Cubbon Park morning habit', short: 'Cubbon Park at 6 a.m.', icon: 'pin' },
    cafe:    { who: 'a café hopper', with: 'a weekend café list', short: 'Three cafés every Saturday', icon: 'pin' },
    seafood: { who: 'a fish-curry regular', with: 'a soft spot for Kerala-style seafood', short: 'Fish curry and appam', icon: 'bowl' }
  },

  /* ---------- 4. Link history ---------- */
  link: {
    total: 4312,
    since: 2036,
    breakdown: [
      { who: 'Your agent', n: 3402, cls: 'agent' },
      { who: 'You', n: 562, cls: 'you' },
      { who: 'Your agent, with your OK', n: 348, cls: 'approved' }
    ]
  },

  categories: [
    { id: 'food', label: 'Food', icon: 'bowl' },
    { id: 'music', label: 'Music', icon: 'music' },
    { id: 'clothes', label: 'Clothes', icon: 'shirt' },
    { id: 'places', label: 'Places', icon: 'pin' },
    { id: 'travel', label: 'Travel', icon: 'bag' }
  ],

  /* ---------- 5. Skills ---------- */
  skills: [
    { id: 'cooking', name: 'Cooking', icon: 'pot',
      note: 'You cooked most Sundays until 2033.',
      metric: 'Meals cooked this month' },
    { id: 'trip', name: 'Trip planning', icon: 'route',
      note: 'You planned six trips yourself between 2027 and 2032.',
      metric: 'Trips planned yourself this year', value: 1,
      next: 'Next, whenever you like: plan a Saturday day trip.', cta: 'Save for Saturday', toast: 'Saved for Saturday. No rush.' },
    { id: 'wayfinding', name: 'Finding your way', icon: 'compass',
      note: 'You used to explore new neighbourhoods without directions.',
      metric: 'Walks without directions this month', value: 2,
      next: 'Next: walk to the market without the map voice.', cta: 'Maybe this week', toast: 'Noted. Comfortable shoes recommended.' },
    { id: 'writing', name: 'Writing your own messages', icon: 'pen',
      note: 'Your birthday messages used to be long, and very you.',
      metric: 'Messages written yourself this month', value: 5,
      next: 'Next: Ananya\'s birthday is on Friday.', cta: 'Remind me Friday', toast: 'We\'ll nudge you Friday morning. Once.' }
  ],

  /* ---------- 7. Taste Map ---------- */
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
    },
    newCorner: 'A new corner showed up in Music'
  },

  ownBars: [
    { label: 'Places', pct: 28 },
    { label: 'Food', pct: 15 },
    { label: 'Travel', pct: 12 },
    { label: 'Music', pct: 9 },
    { label: 'Clothes', pct: 4 }
  ],

  /* ---------- 8. Try Something New ---------- */
  tsn: {
    food: {
      context: 'You\'ve ordered from the same five places since August.',
      options: [
        { id: 'f1', area: 'Northeast Indian', source: 'friend', who: 'Ananya loved this.',
          title: 'A Northeast Indian kitchen in Indiranagar',
          line: 'Smoked pork, bamboo shoot, and a chilli chutney she still talks about.',
          meta: '15 min away · about ₹600 for one' },
        { id: 'f2', area: 'Ethiopian', source: 'nearby', who: '60 people near you tried it this month.',
          title: 'An Ethiopian café that just opened near you',
          line: 'Shared platters on soft, spongy flatbread. You eat with your hands.',
          meta: '20 min away · about ₹500 for one' },
        { id: 'f3', area: 'Millet bowls', source: 'wild', who: 'Nothing like your usual.', free: true,
          title: 'Cook a millet khichdi tonight',
          line: 'One pot, 25 minutes, mostly things already in your kitchen.',
          meta: 'Free recipe · 25 min' }
      ]
    },
    music: {
      context: 'Your last 200 songs came from the same four playlists.',
      options: [
        { id: 'm1', area: 'Kannada indie', source: 'friend', who: 'Ananya made this.', free: true,
          title: 'Ananya\'s Sunday playlist: Kannada indie',
          line: 'Twelve songs, mostly guitars and rain.',
          meta: 'Free · 48 min' },
        { id: 'm2', area: 'Sufi qawwali', source: 'nearby', who: '140 people near you are going.', free: true,
          title: 'An open-air qawwali evening at a park near you',
          line: 'Saturday, 6 p.m. Bring a mat. Leave the phone in your pocket.',
          meta: 'Free · Saturday evening' },
        { id: 'm3', area: 'Highlife', source: 'wild', who: 'Nothing like your usual.', free: true,
          title: 'One West African highlife album, start to finish',
          line: 'Bright guitars and horns. Good for a Sunday clean-up.',
          meta: 'Free · 41 min' }
      ]
    },
    clothes: {
      context: 'Your agent has re-ordered the same grey tee six times this year.',
      options: [
        { id: 'c1', area: 'Handloom ikat', source: 'friend', who: 'Ananya wears hers every week.',
          title: 'A handloom ikat shirt from a weavers\' co-op',
          line: 'Sold directly by the weavers. Every piece is a little different.',
          meta: 'About ₹1,400' },
        { id: 'c2', area: 'Thrifted vintage', source: 'nearby', who: '90 people near you are going.', free: true,
          title: 'A clothes swap at a community hall in Jayanagar',
          line: 'Bring two things, take two things home. Saturday morning.',
          meta: 'Free · Saturday 10 a.m.' },
        { id: 'c3', area: 'Workwear', source: 'wild', who: 'Nothing like your usual.',
          title: 'A sturdy canvas work jacket',
          line: 'The opposite of a grey tee. In a good way.',
          meta: 'About ₹2,000' }
      ]
    },
    places: {
      context: 'Most weekends since June have looked the same: home, one café, home.',
      options: [
        { id: 'p1', area: 'Lake cycling', source: 'friend', who: 'Ananya rides this every Sunday.', free: true,
          title: 'A sunrise cycling loop around a lake',
          line: 'Rent a cycle at the gate. Back home before breakfast.',
          meta: 'Free · 6 a.m. start' },
        { id: 'p2', area: 'Community theatre', source: 'nearby', who: '80 people near you went last week.',
          title: 'A community theatre night in Malleshwaram',
          line: 'A Kannada comedy with English surtitles. Very loud audience.',
          meta: 'About ₹300 · Friday 7 p.m.' },
        { id: 'p3', area: 'Old city markets', source: 'wild', who: 'Nothing like your usual.', free: true,
          title: 'A slow morning in an old city market',
          line: 'Flowers at 6 a.m., filter coffee at 7, no list at all.',
          meta: 'Free to wander' }
      ]
    }
  },

  sources: {
    friend: { label: 'From a friend', icon: 'heart', cls: 'friend' },
    nearby: { label: 'People nearby', icon: 'people', cls: 'nearby' },
    wild: { label: 'Wildcard', icon: 'shuffle', cls: 'wild' }
  },

  /* ---------- 9. Do It Yourself ---------- */
  diy: {
    eyebrow: 'Sunday challenge',
    title: 'Cook one meal yourself.',
    line: 'Your 2031 self made a great dal. The recipe is still in your history.',
    recipe: { name: 'Dal tadka, your way', meta: '35 min · 6 ingredients · serves 3' },
    steps: [
      'Rinse the toor dal and soak it for 15 minutes.',
      'Pressure-cook with turmeric and salt. Three whistles.',
      'Heat ghee. Add cumin, garlic and one dried chilli.',
      'Pour it over the dal. Coriander on top. Done.'
    ],
    checks: [
      { wait: 'Checking your agent history…', done: 'Checked your agent history.' },
      { done: 'The agent didn\'t order dinner tonight.' },
      { done: 'Lentils and tomatoes were bought on Thursday, by you.' }
    ]
  },

  redeem: [
    { id: 'plus', icon: 'star', title: 'One free month of Plus', desc: 'Extra Wrapped cards and a longer Taste Map history.', cost: 120, toast: 'Redeemed: one free month of Plus.' },
    { id: 'cards', icon: 'spark', title: 'Two extra Wrapped cards', desc: 'Add "Best Sunday" and "Most surprising first" to your year.', cost: 60, toast: 'Two extra cards added to your Wrapped.' },
    { id: 'family', icon: 'people', title: 'Family-plan credit', desc: 'One month off when you add someone to your plan.', cost: 100, toast: 'Family-plan credit saved for later.' },
    { id: 'donate', icon: 'heart', title: 'Donate to a cause', desc: '50 stamps become ₹50 for a community kitchen in Bengaluru.', cost: 50, toast: 'Donated. Thank you.' }
  ],

  /* ---------- 10. Monthly recap ---------- */
  monthly: {
    title: 'October, in detours',
    firsts: [
      { icon: 'bowl', t: 'First Northeast Indian dinner' },
      { icon: 'music', t: 'First Kannada indie album, start to finish' },
      { icon: 'route', t: 'First day trip you planned yourself since 2032' }
    ],
    favourite: {
      t: 'Kerala-style seafood came back.',
      line: 'Fish curry and appam at a small Malayali restaurant in Indiranagar. Your first visit in four years.'
    }
  },

  /* ---------- 11. Wrapped 2040 ---------- */
  wrapped: {
    firsts: [
      'Northeast Indian dinner', 'Kannada indie album', 'Clothes swap', 'Sunrise lake ride',
      'Millet khichdi', 'Community theatre night', 'Handloom shirt', 'Trip planned yourself in 8 years',
      'Ethiopian platter', 'Highlife album', 'Bookshop Sunday since 2031', 'Birthday message written yourself'
    ],
    road: {
      area: 'Sufi qawwali',
      line: 'It sat at the edge of your Music map all year, right next to things you love.',
      nudge: 'If you\'re curious: a free open-air evening of it plays at a park near you in January. Only if you want.'
    },
    share: [
      { id: 'ocr', label: 'Choices you made', value: '31% by December' },
      { id: 'firsts', label: 'Firsts', value: '12 firsts this year' },
      { id: 'meals', label: 'Meals cooked', value: '20 meals, cooked by me' },
      { id: 'skills', label: 'Skills I kept', value: 'Cooking and trip planning' }
    ]
  },

  /* ---------- 12. Profile ---------- */
  promises: [
    'No paid placements, ever.',
    'Your data never leaves your phone unless you share it.',
    'Detour never changes your agent.'
  ],
  notifTimes: ['7:00', '7:30', '8:00', '8:30'],

  notify: {
    diy: { title: 'Your morning pick', body: 'Sunday challenge: cook one meal yourself. Your 2031 dal is waiting.' },
    tsn: { title: 'Your morning pick', body: 'Ananya loved a Northeast Indian kitchen in Indiranagar. Dinner, maybe?' }
  }
};
