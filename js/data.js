/* Detour prototype · all content and on-screen text lives here.
   There is no fixed persona: the viewer is the user. Anything personal
   (name, city, quiz answers, friends) comes from app state.
   Plain global object so the app runs from file:// with no fetch or modules. */
window.DETOUR_DATA = {
  today: { date: 'Friday, 26 October 2040', short: '26 Oct 2040', sunday: 'Sunday, 28 October 2040' },

  // Demo numbers for recaps. Today's numbers are live.
  numbers: {
    ocrStart: 18, ocrLastMonth: 20, ocrMonth: 22, ocrYear: 19, agentYear: 81, ocrDecember: 31,
    swapsMonth: 9, swapsYear: 74, firstsYear: 12, firstsMonth: 3,
    mealsYear: 20, mealsLastYear: 2, mealsMonthStart: 3,
    stampsStart: 140, stampReward: 15, agentFound: 4312, since: 2036
  },

  cities: ['Bengaluru', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Other'],

  providers: [
    { id: 'nova', name: 'Nova', line: 'Plans your meals, music and days.' },
    { id: 'sutra', name: 'Sutra', line: 'Handles food, shopping and travel.' },
    { id: 'orbit', name: 'Orbit', line: 'Runs your calendar and daily picks.' }
  ],

  categories: [
    { id: 'food', label: 'Food', icon: 'bowl' },
    { id: 'music', label: 'Music', icon: 'music' },
    { id: 'clothes', label: 'Clothes', icon: 'shirt' },
    { id: 'places', label: 'Places', icon: 'pin' },
    { id: 'weekend', label: 'Weekend plans', icon: 'route' }
  ],

  /* =========================================================
     The 2026 quiz: 3 general trends + 2 items for the user's city
     Each "yes" becomes a "From your taste" option later.
     Each "not me" can come back as "Something new".
     ========================================================= */
  quiz: {
    general: [
      { id: 'g-music', cat: 'music', art: 'music', tint: '#FBE3DA',
        title: 'Indie Hindi pop on repeat', line: 'Soft guitars. Sad lyrics. Every café played it.',
        who: 'an indie Hindi pop fan', with: 'a soft spot for indie Hindi pop', short: 'Indie Hindi pop, on repeat', icon: 'music',
        taste: { title: 'Indie Hindi pop, 2026 mix', line: 'You loved indie Hindi pop in 2026. Here are 30 songs.', meta: 'Free · 1 hr 50 min', free: true } },
      { id: 'g-linen', cat: 'clothes', art: 'linen', tint: '#D9ECE8',
        title: 'Oversized linen shirts', line: 'Two sizes up. Sleeves rolled. Very relaxed.',
        who: 'a linen shirt fan', with: 'a cupboard full of linen', short: 'Oversized linen shirts', icon: 'shirt',
        taste: { title: 'Your old linen shirt', line: 'You loved oversized linen in 2026. One is still in your cupboard.', meta: 'Free · already yours', free: true } },
      { id: 'g-cafe', cat: 'weekend', art: 'cafe', tint: '#EFE6D8',
        title: 'Weekend café hopping', line: 'Three cafés in one Saturday. A lot of iced coffee.',
        who: 'a café hopper', with: 'a weekend café list', short: 'Three cafés every Saturday', icon: 'pin',
        taste: { title: 'A three-café Saturday walk', line: 'You loved café hopping in 2026. Here is a new route.', meta: 'Free route · 2 km', free: true } }
    ],
    cities: {
      Bengaluru: [
        { id: 'blr-food', cat: 'food', art: 'seafood', tint: '#FBE3DA', local: true,
          title: 'Kerala fish curry in Indiranagar', line: 'A small Malayali place. Fish curry and appam on a leaf.',
          who: 'a fish curry regular', with: 'a soft spot for Kerala fish curry', short: 'Fish curry and appam', icon: 'bowl',
          taste: { title: 'Kerala fish curry meal', line: 'You loved Kerala fish curry in 2026. This place does a great one.', meta: '20 min away · ₹420' } },
        { id: 'blr-walk', cat: 'weekend', art: 'park', tint: '#E4EEDF', local: true,
          title: 'Morning walks in Cubbon Park', line: 'Up before the city. Just you and the trees.',
          who: 'an early riser', with: 'a Cubbon Park walking habit', short: 'Cubbon Park at 6 am', icon: 'leaf',
          taste: { title: 'A Saturday walk in Cubbon Park', line: 'You loved these walks in 2026. Go before 8 am.', meta: 'Free · 1 hour', free: true } }
      ],
      Mumbai: [
        { id: 'mum-food', cat: 'food', art: 'plate', tint: '#FBE3DA', local: true,
          title: 'Vada pav after work', line: 'Hot, spicy and eaten standing up near the station.',
          who: 'a vada pav loyalist', with: 'a weakness for station vada pav', short: 'Vada pav after work', icon: 'bowl',
          taste: { title: 'A fresh vada pav stall', line: 'You loved vada pav in 2026. This stall makes them hot.', meta: '5 min away · ₹40' } },
        { id: 'mum-sea', cat: 'weekend', art: 'sea', tint: '#D9ECE8', local: true,
          title: 'Sunset walks on Marine Drive', line: 'The sea, the breeze and half the city.',
          who: 'a sunset walker', with: 'a Marine Drive habit', short: 'Sunsets on Marine Drive', icon: 'leaf',
          taste: { title: 'A sunset walk on Marine Drive', line: 'You loved these walks in 2026. Sunset is at 6:10 pm.', meta: 'Free · 1 hour', free: true } }
      ],
      Delhi: [
        { id: 'del-food', cat: 'food', art: 'plate', tint: '#FBE3DA', local: true,
          title: 'Sunday chole bhature', line: 'Huge, puffy and worth the queue.',
          who: 'a chole bhature fan', with: 'a Sunday chole bhature ritual', short: 'Sunday chole bhature', icon: 'bowl',
          taste: { title: 'Chole bhature for lunch', line: 'You loved Sunday chole bhature in 2026. This place is famous for it.', meta: '15 min away · ₹180' } },
        { id: 'del-park', cat: 'weekend', art: 'park', tint: '#E4EEDF', local: true,
          title: 'Winter mornings in Lodhi Garden', line: 'Fog, old tombs and a flask of chai.',
          who: 'a winter morning walker', with: 'a Lodhi Garden habit', short: 'Lodhi Garden mornings', icon: 'leaf',
          taste: { title: 'A morning in Lodhi Garden', line: 'You loved these mornings in 2026. Go before it gets busy.', meta: 'Free · 1 hour', free: true } }
      ],
      Chennai: [
        { id: 'che-food', cat: 'food', art: 'plate', tint: '#FBE3DA', local: true,
          title: 'Podi idli and filter coffee', line: 'Soft idlis. Strong coffee. A steel tumbler.',
          who: 'a filter coffee person', with: 'a podi idli habit', short: 'Podi idli and filter coffee', icon: 'bowl',
          taste: { title: 'Podi idli and filter coffee', line: 'You loved this in 2026. This small café makes it right.', meta: '10 min away · ₹120' } },
        { id: 'che-sea', cat: 'weekend', art: 'sea', tint: '#D9ECE8', local: true,
          title: 'Evenings at Besant Nagar beach', line: 'Corn on the cob and a long walk on the sand.',
          who: 'a beach walker', with: 'a beach evening habit', short: 'Beach evenings', icon: 'leaf',
          taste: { title: 'An evening at the beach', line: 'You loved beach evenings in 2026. The sea breeze starts at 5.', meta: 'Free · 1 hour', free: true } }
      ],
      Hyderabad: [
        { id: 'hyd-food', cat: 'food', art: 'plate', tint: '#FBE3DA', local: true,
          title: 'Late-night biryani runs', line: 'Midnight. A big pot. Too many friends.',
          who: 'a late-night biryani hunter', with: 'a midnight biryani habit', short: 'Late-night biryani', icon: 'bowl',
          taste: { title: 'A small wood-fire biryani place', line: 'You loved late-night biryani in 2026. This one is slow-cooked.', meta: '15 min away · ₹300' } },
        { id: 'hyd-lake', cat: 'weekend', art: 'sea', tint: '#D9ECE8', local: true,
          title: 'Sunsets by the lake', line: 'Big rocks, cool wind and a pink sky.',
          who: 'a lakeside sunset fan', with: 'a lakeside sunset habit', short: 'Lake sunsets', icon: 'leaf',
          taste: { title: 'A sunset by the lake', line: 'You loved lake sunsets in 2026. Sunset is at 5:55 pm.', meta: 'Free · 1 hour', free: true } }
      ],
      Pune: [
        { id: 'pun-food', cat: 'food', art: 'plate', tint: '#FBE3DA', local: true,
          title: 'Spicy misal pav breakfasts', line: 'Red, fiery and very good for waking up.',
          who: 'a misal pav fan', with: 'a spicy misal pav habit', short: 'Misal pav breakfasts', icon: 'bowl',
          taste: { title: 'A spicy misal pav breakfast', line: 'You loved misal pav in 2026. This place is famous for it.', meta: '10 min away · ₹110' } },
        { id: 'pun-trek', cat: 'weekend', art: 'park', tint: '#E4EEDF', local: true,
          title: 'Sunrise treks on nearby hills', line: 'Start at 5. Fog at the top. Chai after.',
          who: 'a sunrise trekker', with: 'a sunrise trek habit', short: 'Sunrise treks', icon: 'leaf',
          taste: { title: 'A short sunrise trek', line: 'You loved sunrise treks in 2026. This one takes 2 hours.', meta: 'Free · 2 hours', free: true } }
      ],
      Other: [
        { id: 'oth-food', cat: 'food', art: 'plate', tint: '#FBE3DA',
          title: 'Street-side momos', line: 'Steamed, spicy chutney, eaten in a hurry.',
          who: 'a momo fan', with: 'a street momo habit', short: 'Street-side momos', icon: 'bowl',
          taste: { title: 'Hot momos from a street stall', line: 'You loved street momos in 2026. This stall is very good.', meta: '5 min away · ₹80' } },
        { id: 'oth-market', cat: 'weekend', art: 'park', tint: '#E4EEDF',
          title: 'Sunday morning markets', line: 'Fresh fruit, old books and a lot of chatting.',
          who: 'a Sunday market regular', with: 'a Sunday market habit', short: 'Sunday markets', icon: 'leaf',
          taste: { title: 'A Sunday morning market', line: 'You loved Sunday markets in 2026. One is 2 km away.', meta: 'Free to walk around', free: true } }
      ]
    },
    order: ['g-music', 'CITY0', 'g-linen', 'CITY1', 'g-cafe'],
    // Used when someone explores without onboarding.
    defaults: { 'g-music': true, 'g-linen': false, 'g-cafe': true, CITY0: true, CITY1: false }
  },

  /* =========================================================
     The agent's day. Times are minutes after midnight.
     Repeats trigger Detour (within the user's limits). Others only go in the log.
     ========================================================= */
  day: {
    start: 480,   // 8:00 am
    end: 1410,    // 11:30 pm
    waitMins: 20, // the agent waits this long for your choice
    events: [
      { id: 'cab', time: 520, cat: null, repeat: false, icon: 'route',
        agent: 'Booked a cab to work' },
      { id: 'lunch', time: 765, cat: 'food', repeat: true, rot: 0, icon: 'bowl', noun: 'lunch',
        agent: 'Ordering your usual paneer bowl',
        agentNow: 'Your agent is ordering your usual paneer bowl.',
        pick: 'Paneer bowl', pickNote: '9th time this month',
        detour: 'You\'ve had this 9 times this month. 3 other options?',
        wentAhead: 'Your agent went ahead with the paneer bowl.' },
      { id: 'weekend', time: 930, cat: 'weekend', repeat: true, rot: 0, icon: 'route', noun: 'Saturday',
        agent: 'Booking your usual Saturday café table',
        agentNow: 'Your agent is booking your usual Saturday café.',
        pick: 'Same café, same table', pickNote: '5th Saturday in a row',
        detour: 'Same café, 5 Saturdays in a row. 3 other options?',
        wentAhead: 'Your agent went ahead and booked the usual café.' },
      { id: 'gym', time: 1095, cat: 'music', repeat: true, rot: 0, icon: 'music', noun: 'your gym playlist',
        agent: 'Started your gym playlist: the same 40 songs',
        agentNow: 'Your agent started your gym playlist.',
        pick: 'Gym mix', pickNote: 'the same 40 songs',
        detour: 'Same 40 songs, 22 times this month. 3 other options?',
        wentAhead: 'Your agent went ahead with the usual gym mix.' },
      { id: 'diy', time: 1140, type: 'diy', icon: 'pot' },
      { id: 'dinner', time: 1205, cat: 'food', repeat: true, rot: 1, icon: 'bowl', noun: 'dinner',
        agent: 'Ordering dinner from your usual place',
        agentNow: 'Your agent is ordering dinner from your usual place.',
        pick: 'Your usual North Indian place', pickNote: '6th order this month',
        detour: '6th order from here this month. 3 other options?',
        wentAhead: 'Your agent went ahead with your usual place.' },
      { id: 'outfit', time: 1350, cat: 'clothes', repeat: true, rot: 0, icon: 'shirt', noun: 'tomorrow\'s outfit',
        agent: 'Picked tomorrow\'s outfit: black tee, grey chinos',
        agentNow: 'Your agent picked tomorrow\'s outfit.',
        pick: 'Black tee and grey chinos', pickNote: 'your usual',
        detour: 'You\'ve worn this 5 times this month. 3 other options?',
        wentAhead: 'Your agent went ahead with the black tee.' }
    ],
    // Jump chips beside the phone. `at` = the moment's time; `event` = what fires there.
    moments: [
      { id: 'morning', label: 'Morning', at: 520, event: 'cab' },
      { id: 'lunch', label: 'Lunch', at: 765, event: 'lunch' },
      { id: 'evening', label: 'Evening', at: 1140, event: 'diy' },
      { id: 'night', label: 'Night', at: 1350, event: 'outfit' },
      { id: 'sunday', label: 'Sunday', screen: 'friends' },
      { id: 'month', label: 'Month end', screen: 'monthly' },
      { id: 'year', label: 'Year end', screen: 'wrapped' }
    ]
  },

  /* Options when the quiz or friends don't cover a category. */
  catalog: {
    food: {
      taste: [
        { title: 'Home-style dal tadka', line: 'You used to cook this every Sunday.', meta: 'Free recipe · 35 min', free: true },
        { title: 'A South Indian thali', line: 'You used to order this a lot in 2030.', meta: '10 min away · ₹220' }
      ],
      newCity: {
        Bengaluru: { title: 'A millet bowl café', line: 'It opened 1 km away last week.', meta: '1 km away · ₹280' },
        Mumbai: { title: 'A Parsi dhansak lunch', line: 'An old café near you serves it on Fridays.', meta: '10 min away · ₹350' },
        Delhi: { title: 'A small Tibetan kitchen', line: 'Thukpa and momos, near the market.', meta: '15 min away · ₹260' },
        Chennai: { title: 'A Chettinad lunch place', line: 'Spicy and slow-cooked. It opened this month.', meta: '12 min away · ₹300' },
        Hyderabad: { title: 'A Persian tea house', line: 'Bun maska and a slow chai. Very calm.', meta: '10 min away · ₹150' },
        Pune: { title: 'A Goan home kitchen', line: 'A family cooks lunch on weekdays.', meta: '15 min away · ₹320' },
        Other: { title: 'A new millet bowl café', line: 'It opened near you last week.', meta: '1 km away · ₹280' }
      },
      newMore: { title: 'A Burmese noodle soup', line: 'Nothing like your usual. Warm and light.', meta: '15 min away · ₹300' },
      free: { title: 'A 20-minute khichdi at home', line: 'One pot. Things you already have.', meta: 'Free recipe · 20 min', free: true }
    },
    music: {
      taste: [{ title: 'Your 2031 running mix', line: 'You ran to these songs for a whole year.', meta: 'Free · 45 min', free: true }],
      newMore: { title: 'A West African highlife album', line: 'Bright guitars and horns. Nothing like your usual.', meta: 'Free · 41 min', free: true },
      free: { title: 'A Carnatic fusion set', line: 'Old ragas. New beats. Great for a workout.', meta: 'Free · 50 min', free: true }
    },
    clothes: {
      taste: [{ title: 'Your blue checked shirt', line: 'You wore it all the time in 2029. Still in your cupboard.', meta: 'Free · already yours', free: true }],
      newMore: { title: 'A block-print kurta', line: 'Light and bright. Good for a warm day.', meta: '₹900' },
      free: { title: 'The olive shirt you never wear', line: 'It still has the tag on. Give it a go.', meta: 'Free · already yours', free: true }
    },
    weekend: {
      taste: [{ title: 'A board game café', line: 'You loved game nights in 2030.', meta: '₹200 · 3 hours' }],
      newCity: {
        Bengaluru: { title: 'A pottery class in Jayanagar', line: 'Two hours. Messy hands. Very calm.', meta: '₹800 · Saturday' },
        Mumbai: { title: 'A free heritage walk in the old fort area', line: 'Old buildings and good stories.', meta: 'Free · Saturday 8 am', free: true },
        Delhi: { title: 'A free walk through an old bazaar', line: 'Spices, lanes and a lot of noise.', meta: 'Free · Saturday 9 am', free: true },
        Chennai: { title: 'A Carnatic music evening', line: 'A small hall. Free entry on Saturdays.', meta: 'Free · Saturday 6 pm', free: true },
        Hyderabad: { title: 'A free walk around old step-wells', line: 'Old stone and great photos.', meta: 'Free · Saturday 7 am', free: true },
        Pune: { title: 'A cycling morning by the river', line: 'Rent a cycle. Back by breakfast.', meta: '₹100 · 6 am', free: false },
        Other: { title: 'A pottery class nearby', line: 'Two hours. Messy hands. Very calm.', meta: '₹800 · Saturday' }
      },
      newMore: { title: 'A comedy open mic', line: 'New comics, short sets, lots of laughs.', meta: '₹250 · Saturday 8 pm' },
      free: { title: 'A picnic in a park', line: 'Pack lunch. Bring a book. Leave the phone.', meta: 'Free', free: true }
    }
  },

  /* =========================================================
     Contacts and friends (generic names, initials avatars)
     ========================================================= */
  contacts: [
    { id: 'ananya', name: 'Ananya', on: true, color: '#E2674A', both: 'You both like spicy food.',
      loves: {
        food: { title: 'Northeast Indian thali', meta: '15 min away · ₹350' },
        music: { title: 'A Kannada indie playlist', meta: 'Free · 48 min', free: true },
        clothes: { title: 'A handloom ikat shirt', meta: '₹1,400' },
        places: { title: 'A rooftop library café', meta: '₹150' },
        weekend: { title: 'A sunrise bike ride by the lake', meta: 'Free · 6 am', free: true } } },
    { id: 'kabir', name: 'Kabir', on: true, color: '#1E7A72', both: 'You both like old film songs.',
      loves: {
        food: { title: 'A Burmese khow suey bowl', meta: '20 min away · ₹320' },
        music: { title: 'Old film songs, slowed down', meta: 'Free · 1 hour', free: true },
        clothes: { title: 'A bright block-print kurta', meta: '₹900' },
        places: { title: 'A tiny vinyl record shop', meta: 'Free to browse', free: true },
        weekend: { title: 'A Saturday pottery class', meta: '₹800' } } },
    { id: 'meera', name: 'Meera', on: true, color: '#8A6BB8', both: 'You both love long walks.',
      loves: {
        food: { title: 'Home-made rajma chawal', meta: 'Free recipe · 40 min', free: true },
        music: { title: 'A free qawwali evening in a park', meta: 'Free · Saturday 6 pm', free: true },
        clothes: { title: 'A thrifted denim jacket', meta: '₹600' },
        places: { title: 'An old botanical garden', meta: 'Free', free: true },
        weekend: { title: 'A slow morning at a flower market', meta: 'Free', free: true } } },
    { id: 'arjun', name: 'Arjun', on: true, color: '#C9533A', both: 'You both like trying new food.',
      loves: {
        food: { title: 'An Ethiopian sharing platter', meta: '20 min away · ₹500' },
        music: { title: 'A West African highlife album', meta: 'Free · 41 min', free: true },
        clothes: { title: 'A canvas work jacket', meta: '₹2,000' },
        places: { title: 'A night food market', meta: 'Free to walk around', free: true },
        weekend: { title: 'A comedy play on Friday', meta: '₹300' } } },
    { id: 'sana', name: 'Sana', on: false, color: '#6E6A63' },
    { id: 'dev', name: 'Dev', on: false, color: '#6E6A63' },
    { id: 'ishita', name: 'Ishita', on: false, color: '#6E6A63' },
    { id: 'rahul', name: 'Rahul', on: false, color: '#6E6A63' }
  ],
  sampleFriends: ['ananya', 'kabir', 'meera'],
  sentToYou: { from: 'meera', cat: 'music' },

  /* =========================================================
     Skills, Taste Map, More ideas, DIY, stamps
     ========================================================= */
  skills: [
    { id: 'cooking', name: 'Cooking', icon: 'pot', note: 'You cooked most Sundays until 2033.' },
    { id: 'trip', name: 'Planning trips', icon: 'route', note: 'You planned six trips yourself, 2027 to 2032.' },
    { id: 'wayfinding', name: 'Finding your way', icon: 'compass', note: 'You used to explore new areas without a map.' },
    { id: 'writing', name: 'Writing your own messages', icon: 'pen', note: 'Your birthday messages used to be long and warm.' }
  ],

  tasteMap: {
    cats: ['food', 'music', 'clothes', 'places'],
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
      food:    ['Biryani\nnights', 'Paneer\nbowls', 'Quick\nsalads', 'Fish\ncurry', 'Home\ndal', 'Street\nchaat', 'Northeast\nIndian', 'Millet\nbowls', 'Ethiopian'],
      music:   ['Lo-fi\nfocus', 'Chill\npop', 'Gym\nmixes', 'Indie\nHindi pop', 'Old film\nsongs', 'Carnatic\nfusion', 'Kannada\nindie', 'Sufi\nqawwali', 'Highlife'],
      clothes: ['Grey\ntees', 'Navy\nchinos', 'Plain\nsneakers', 'Linen\nshirts', 'Block\nprints', 'Bright\ncolours', 'Handloom\nikat', 'Thrifted\nvintage', 'Workwear'],
      places:  ['Home', 'Usual\ncafés', 'Office', 'City\nparks', 'Café\nhopping', 'Book\nshops', 'Old city\nmarkets', 'Community\ntheatre', 'Lake\ncycling']
    }
  },

  ideas: {
    food: { context: 'Your agent picks from the same five places.', options: [
      { id: 'f1', area: 'Northeast Indian', source: 'friend', who: 'A friend loved this.', title: 'A Northeast Indian kitchen near you', line: 'Smoky flavours and a fiery chutney.', meta: '15 min away · about ₹600' },
      { id: 'f2', area: 'Ethiopian', source: 'nearby', who: '60 people near you tried it.', title: 'A new Ethiopian café near you', line: 'Big shared plates. You eat with your hands.', meta: '20 min away · about ₹500' },
      { id: 'f3', area: 'Millet bowls', source: 'new', who: 'Nothing like your usual.', free: true, title: 'Cook a millet khichdi tonight', line: 'One pot. 25 minutes.', meta: 'Free recipe · 25 min' } ] },
    music: { context: 'Your last 200 songs came from four playlists.', options: [
      { id: 'm1', area: 'Kannada indie', source: 'friend', who: 'A friend made this.', free: true, title: 'A Kannada indie playlist', line: 'Twelve songs. Mostly guitars and rain.', meta: 'Free · 48 min' },
      { id: 'm2', area: 'Sufi qawwali', source: 'nearby', who: '140 people near you are going.', free: true, title: 'A free qawwali evening in a park', line: 'Saturday at 6 pm. Bring a mat.', meta: 'Free · Saturday evening' },
      { id: 'm3', area: 'Highlife', source: 'new', who: 'Nothing like your usual.', free: true, title: 'One West African highlife album', line: 'Bright guitars and horns.', meta: 'Free · 41 min' } ] },
    clothes: { context: 'Your agent bought the same grey tee six times this year.', options: [
      { id: 'c1', area: 'Handloom ikat', source: 'friend', who: 'A friend wears hers every week.', title: 'A handloom ikat shirt', line: 'Sold by the weavers themselves.', meta: 'About ₹1,400' },
      { id: 'c2', area: 'Thrifted vintage', source: 'nearby', who: '90 people near you are going.', free: true, title: 'A clothes swap this Saturday', line: 'Bring two things. Take two home.', meta: 'Free · Saturday 10 am' },
      { id: 'c3', area: 'Workwear', source: 'new', who: 'Nothing like your usual.', title: 'A strong canvas work jacket', line: 'The opposite of a grey tee.', meta: 'About ₹2,000' } ] },
    places: { context: 'Most weekends since June looked the same.', options: [
      { id: 'pl1', area: 'Lake cycling', source: 'friend', who: 'A friend rides here every Sunday.', free: true, title: 'A sunrise bike ride by a lake', line: 'Rent a bike at the gate.', meta: 'Free · 6 am start' },
      { id: 'pl2', area: 'Community theatre', source: 'nearby', who: '80 people near you went last week.', title: 'A comedy play this Friday', line: 'Small hall. Very loud crowd.', meta: 'About ₹300 · Friday 7 pm' },
      { id: 'pl3', area: 'Old city markets', source: 'new', who: 'Nothing like your usual.', free: true, title: 'A slow morning at an old market', line: 'Flowers at 6 am. Coffee at 7.', meta: 'Free to walk around' } ] }
  },

  sources: {
    friend: { label: 'From a friend', icon: 'heart', cls: 'friend' },
    taste: { label: 'From your taste', icon: 'clock', cls: 'taste' },
    new: { label: 'Something new', icon: 'spark', cls: 'new' },
    nearby: { label: 'Something new nearby', icon: 'pin', cls: 'new' }
  },

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

  monthly: { firsts: [
    { icon: 'bowl', t: 'Your first Northeast Indian dinner' },
    { icon: 'music', t: 'Your first Kannada indie album' },
    { icon: 'heart', t: 'An old favourite, back after 4 years' } ] },

  wrapped: { firsts: [
    'Northeast Indian dinner', 'Kannada indie album', 'Clothes swap', 'Sunrise bike ride',
    'Millet khichdi', 'Comedy play', 'Handloom shirt', 'A trip you planned',
    'Ethiopian dinner', 'Highlife album', 'Bookshop Sunday', 'A birthday message you wrote' ] },

  promises: [
    'No paid suggestions, ever.',
    'Your data stays on your phone, unless you share it.',
    'Detour never changes your agent on its own.'
  ],

  notifs: {
    quietFrom: [{ v: 21, t: '9 pm' }, { v: 22, t: '10 pm' }, { v: 23, t: '11 pm' }],
    quietTo: [{ v: 6, t: '6 am' }, { v: 7, t: '7 am' }, { v: 8, t: '8 am' }]
  },

  /* =========================================================
     Sharing
     ========================================================= */
  share: {
    styles: [
      { id: 'paper', label: 'Paper' },
      { id: 'night', label: 'Night' },
      { id: 'coral', label: 'Coral' }
    ],
    targets: [
      { id: 'insta', label: 'Instagram story', icon: 'camera', toast: 'Ready to share on Instagram.' },
      { id: 'fb', label: 'Facebook', icon: 'globe', toast: 'Ready to share on Facebook.' },
      { id: 'wa', label: 'WhatsApp', icon: 'chat', toast: 'Ready to share on WhatsApp.' },
      { id: 'link', label: 'Copy link', icon: 'link', toast: 'Link copied.' },
      { id: 'save', label: 'Save image', icon: 'download', toast: 'Image saved to your phone.' }
    ],
    lines: {
      cooked: 'Cooked by me. Not by my agent.',
      self: 'I chose this myself. Not my agent.',
      tried: 'I tried something new.',
      friend: 'A friend\'s pick. Loved it.',
      streak: '3 days of doing it myself.',
      monthly: 'My October, in detours.',
      wrapped: 'My 2040, in detours.'
    }
  },

  /* =========================================================
     Guided tour: 11 steps built around a day
     `screens` = onboarding screens that belong to this step.
     `alt` = a different hint for those in-between screens.
     `moment` = the day-simulator moment this step plays.
     ========================================================= */
  tour: [
    { title: 'Welcome', screens: ['welcome'],
      explain: 'Three short cards say what Detour is.',
      tryThis: 'Swipe the cards. Then tap Get started.',
      target: '[data-start]' },
    { title: 'Create an account', screens: ['phone', 'code'],
      explain: 'Sign up with a phone number. This is a demo.',
      tryThis: 'Type any 10 digits. Then tap Continue.',
      alts: { code: 'Type any 4 digits.' },
      target: '[data-field]' },
    { title: 'About you', screens: ['about'],
      explain: 'Your name and city make everything personal.',
      tryThis: 'Type your first name. Pick a city. Tap Continue.',
      target: '[data-field]' },
    { title: 'The 2026 quiz', screens: ['quiz'],
      explain: 'A fun start. Your answers shape your options later.',
      tryThis: 'Swipe right for yes, left for no.',
      target: '[data-a="yes"]' },
    { title: 'Your 2026 self', screens: ['recap2026'],
      explain: 'You get something back right away.',
      tryThis: 'Tap to see the next card. Then tap Continue.',
      target: '.story__hint:not(.is-gone)' },
    { title: 'Connect your agent', screens: ['agent', 'consent', 'categories', 'skills'],
      explain: 'Detour only looks at what your agent did. It never changes your agent.',
      tryThis: 'Pick an agent. Then tap Continue.',
      alts: { consent: 'Tap Connect. Then Continue.', categories: 'Pick a few and continue.', skills: 'Pick a few and continue.' },
      target: '[data-main]' },
    { title: 'Add friends', screens: ['friendsAdd', 'friendsPrivacy', 'notifs', 'done'],
      explain: 'Friends\' picks become options for you.',
      tryThis: 'Add a friend or two. Then continue.',
      alts: { friendsPrivacy: 'Pick a few and continue.', notifs: 'Pick a few and continue.', done: 'Tap Start my day.' },
      target: '[data-main]' },
    { title: 'Lunch', moment: 'lunch',
      explain: 'Your agent orders the usual again. Detour sends one calm message.',
      tryThis: 'Tap the message. Then swap to an option.',
      target: '#notif.is-on' },
    { title: 'Evening', moment: 'evening',
      explain: 'A small challenge: cook dinner yourself and earn stamps.',
      tryThis: 'Tap I\'m in, then I did it, then Confirm. Then try Share this.',
      target: '[data-moment-act="in"]' },
    { title: 'Sunday', moment: 'sunday',
      explain: 'See what friends loved. Try their taste for a week.',
      tryThis: 'Tap Swap tastes for a week. Then pick a friend.',
      target: '[data-go="swap"], [data-go="friendsAdd"]' },
    { title: 'Year end', moment: 'year',
      explain: 'Once a year, a recap of your own choices.',
      tryThis: 'Tap to see each card. Share it if you like.',
      target: '.story__hint:not(.is-gone)' }
  ],

  /* =========================================================
     All other on-screen text
     ========================================================= */
  text: {
    tagline: 'Your agent takes the fastest route. Detour shows you the scenic one.',
    agent: 'Your agent',
    detour: 'Detour',
    back: 'Back',
    close: 'Close',
    cont: 'Continue',
    save: 'Save',
    saved: 'Saved.',
    you: 'You',
    tabs: { today: 'Today', friends: 'Friends', map: 'Taste Map', diy: 'Do It Yourself', me: 'Me' },
    story: { tap: 'Tap to continue' },

    welcome: {
      cards: [
        'Your agent does a lot for you. That\'s great.',
        'But it keeps picking the same things. And you stop doing things yourself.',
        'Detour shows you other options, and small ways to keep doing things yourself. You always choose.'
      ],
      start: 'Get started',
      have: 'I already have an account'
    },
    phone: {
      title: 'What\'s your phone number?',
      sub: 'We\'ll send you a code.',
      label: 'Phone number',
      error: 'Please enter 10 digits.'
    },
    code: {
      title: 'Enter the code',
      sub: 'We sent it to +91 {phone}.',
      demo: 'Demo: type any 4 digits.',
      resend: 'Send a new code',
      resent: 'New code sent.'
    },
    about: {
      title: 'About you',
      nameLabel: 'Your first name',
      namePh: 'For example, Priya',
      nameError: 'Please type your first name.',
      cityLabel: 'Your city'
    },
    quiz: {
      title: '2026 called.<br>Were you into this?',
      sub: 'Swipe right for yes. Swipe left for no.',
      yes: 'Yes, that was me', no: 'Not me',
      hintYes: 'That was me', hintNo: 'Not me',
      local: 'Not a trend. Just a {city} thing.'
    },
    recap2026: {
      eyebrow: 'Your 2026 self',
      hello: { name: 'Hi {name}. Meet 2026 you.', none: 'Meet 2026 you.' },
      none: 'In 2026, you kept it a mystery. Fair enough.',
      one: 'You were <em>{who}</em>. Simple.',
      two: 'You were <em>{who}</em> with {with}.',
      listTitle: 'You picked all of this yourself.',
      listNone: 'You kept your cards close. That\'s fine.',
      question: 'Let\'s see what your agent does now.',
      cta: 'Continue'
    },
    agentPick: {
      title: 'Which agent do you use?',
      sub: 'Detour works next to it. It never takes over.'
    },
    consent: {
      title: 'Connect {agent}',
      lead: 'Detour looks at what {agent} did for you. It never changes {agent}.',
      seesTitle: 'What Detour sees',
      seesLine: 'Each choice, and who made it:',
      who: { agent: 'Your agent', you: 'You', approved: 'Your agent asked, you said yes' },
      neverTitle: 'What Detour never does',
      never: ['Never changes your agent on its own', 'Never sells your data', 'Everything stays on your phone'],
      cta: 'Connect {agent}',
      opening: 'Opening your agent\'s history…',
      reading: 'Looking at {x}…',
      found: { name: 'Found {n} things your agent did for you, {name}.', none: 'Found {n} things your agent did for you.' },
      done: 'Done. Nothing was changed.',
      breakdown: [
        { who: 'Made by your agent', n: 3402, cls: 'agent' },
        { who: 'Made by you', n: 562, cls: 'you' },
        { who: 'Your agent asked, you said yes', n: 348, cls: 'approved' }
      ]
    },
    categories: {
      title: 'What should Detour help with?',
      sub: 'Detour only watches these. Pick at least one.',
      pickOne: 'Pick at least one.'
    },
    skills: {
      title: 'Skills you want to keep',
      sub: 'Pick 2 or 3. Detour will invite you to do one now and then.',
      note: 'We never suggest medicine, health or money choices.',
      keep: 'Keep these {n}',
      more: 'Pick {n} more',
      tooMany: 'Three is plenty. Unpick one first.',
      tooFew: 'Pick at least two.'
    },
    friendsAdd: {
      title: 'Add friends',
      sub: 'Their favourite things become options for you.',
      on: 'On Detour', off: 'Not on Detour yet',
      add: 'Add', added: 'Added', invite: 'Invite', invited: 'Invited',
      inviteToast: 'Invite sent.',
      skip: 'Skip for now'
    },
    friendsPrivacy: {
      title: 'What can friends see?',
      sub: 'Only things you loved or did yourself. Never your full history.'
    },
    notifs: {
      title: 'When should Detour message you?',
      sub: 'Only when your agent keeps picking the same thing.',
      limit: 'Messages a day, at most',
      quiet: 'Quiet hours',
      from: 'From', to: 'Until',
      fine: 'Over the limit, Detour stays quiet. Your options still wait in the app.'
    },
    done: {
      title: { name: 'You\'re all set, {name}.', none: 'You\'re all set.' },
      sub: 'Your agent keeps going. Detour watches for repeats.',
      cta: 'Start my day'
    },

    today: {
      hello: { name: 'Good {part}, {name}.', none: 'Good {part}.' },
      parts: ['morning', 'afternoon', 'evening'],
      made: 'Choices you made yourself today:',
      swapBanner: 'This week: {name}\'s picks.',
      seeDay: 'See your day',
      seeOptions: 'See other options',
      quietLimit: 'Detour stayed quiet: daily limit reached. Your options are still here.',
      quietHours: 'Detour stayed quiet: quiet hours. Your options are still here.',
      calmTitle: 'All quiet.',
      calmSub: 'Your agent\'s got this.',
      calmHint: 'Detour will tap you when your agent repeats itself.',
      latest: 'Latest: {x}.',
      diyTitle: 'Want to cook dinner yourself tonight?',
      diySub: 'Your old dal recipe is waiting.',
      diyIn: 'I\'m in', diyNot: 'Not tonight',
      diySkipped: 'No problem. Your agent will sort dinner.',
      diyDone: 'You cooked dinner yourself.',
      result: {
        swap: 'You swapped to: {x}',
        self: 'You\'re doing it yourself: {x}',
        keep: 'You kept your agent\'s pick.',
        went: '{x}'
      },
      share: 'Share this',
      change: 'Change'
    },

    log: {
      title: 'Your day',
      sub: 'What your agent did today, and what you chose.',
      count: 'Detour messages today: {n} of {max}',
      empty: 'Nothing yet. Your day is just starting.',
      see: 'See options',
      status: {
        notified: 'Detour: 3 other options waiting',
        quietLimit: 'Detour stayed quiet: daily limit reached',
        quietHours: 'Detour stayed quiet: quiet hours',
        info: 'Not a repeat. Detour stayed out of it.',
        off: 'You turned Detour off for {x}.',
        swap: 'You swapped to: {x}',
        self: 'You did it yourself: {x}',
        keep: 'You kept your agent\'s pick.',
        went: '{x}',
        diyOpen: 'Detour asked: cook dinner yourself?',
        diyDone: 'You cooked dinner yourself.',
        diySkip: 'No cooking tonight. That\'s fine.'
      },
      diyAgent: 'Your evening'
    },

    options: {
      title: 'Other options for {x}',
      picked: 'Your agent picked: <b>{x}</b> ({note}).',
      swap: 'Swap to this',
      self: 'I\'ll do it myself',
      keep: 'Keep my agent\'s pick',
      swapToast: 'Done. Your agent will get this instead.',
      selfToast: 'Nice. This one\'s all yours.',
      keepToast: 'Okay. Your agent\'s pick stays.',
      noPaid: 'No paid suggestions, ever.',
      free: 'Free',
      friendLine: '{name} loved this last week.',
      swapLine: 'From {name}\'s picks this week.',
      skippedLine: 'You said "not me" in 2026. Maybe now?'
    },

    stamps: {
      label: 'Your stamps', count: '{n} stamps',
      sheetTitle: 'Spend your stamps',
      sheetSub: 'You have <b data-bal></b> stamps. You earned them by doing things yourself.',
      redeemed: 'Done',
      already: 'You already have this one.',
      short: 'You need {n} more stamps for this.',
      note: 'No brand vouchers. No ads. Ever.'
    },

    diy: {
      title: 'Do it yourself',
      sub: 'One small challenge. Only if you feel like it.',
      idleEyebrow: 'Today\'s challenge',
      idleTitle: 'Cook one meal yourself.',
      idleLine: 'In 2031, you made a great dal. Want to try again?',
      in: 'I\'m in', later: 'Maybe later', laterToast: 'No problem. It will wait.',
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
      skillsRow: 'Your skills',
      stampsRow: 'Your stamps: {n}'
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
      none: 'Turn on Food, Music, Clothes or Places in Me to see your map.'
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
      emptyLine: 'New ideas tomorrow.',
      openMap: 'Back to Taste Map',
      selfToast: 'Nice. This one\'s all yours.',
      agentToast: 'Sent to your agent.',
      noPaid: 'No paid suggestions, ever.'
    },

    friends: {
      title: 'Friends',
      sub: 'What your friends loved this week.',
      sunday: 'Sunday: your friends\' week',
      loved: '{name} loved this week:',
      tryIt: 'Try it',
      sendBack: 'Send a pick back',
      tried: 'Saved. It will show up as an option this week.',
      sent: 'Sent {name} your pick: {x}.',
      sentRow: 'Sent to you ({n})',
      swapRow: 'Swap tastes for a week',
      invite: 'Invite friends',
      empty: 'No friends yet. Add one to see their picks.',
      add: 'Add friends',
      pageLoved: 'What {name} loved',
      pageBoth: 'What you both like',
      sentTitle: 'Sent to you',
      sentSub: 'A pick a friend sent you.',
      sentLine: '{name} sent you this.',
      sentTried: 'Nice. It\'s on your list.',
      sentNot: 'Not now',
      sentNotToast: 'Okay. Maybe another time.',
      sentEmpty: 'Nothing new right now.',
      swapTitle: 'Swap tastes for a week',
      swapSub: 'Get {name}\'s picks as your options for 7 days.',
      swapPick: 'Pick a friend',
      swapCta: 'Swap with {name} for a week',
      swapOn: 'You\'re seeing {name}\'s picks this week.',
      swapStop: 'Stop the swap',
      swapToast: 'Done. This week: {name}\'s picks.',
      swapStopped: 'Swap stopped. Back to your own options.',
      swapNeed: 'Add a friend first.'
    },

    shareFlow: {
      title: 'Share this?',
      sub: 'Only this card is shared. Never your agent\'s history.',
      style: 'Pick a style',
      next: 'Share',
      whereTitle: 'Where to?',
      whereSub: 'Nothing is shared until you pick.',
      byline: 'via detour'
    },

    recaps: {
      title: 'Your recaps',
      sub: 'Short looks back at your own choices.',
      heroEyebrow: 'Preview · ready on 31 December',
      heroTitle: 'Your year: Detour Wrapped 2040',
      heroSub: 'Six short cards about your year.',
      open: 'Open',
      monthTitle: 'October recap', monthSub: 'This month · 4 cards',
      oldTitle: 'Your 2026 self', oldSub: 'From day one · 2 cards'
    },

    monthly: {
      eyebrow: 'October recap',
      madeLine: 'out of every 100 choices, you made yourself.',
      madeSub: 'Last month it was {last}. In March, it was {start}.',
      swapsEyebrow: 'Other options',
      swapsTitle: 'You swapped {n} of your agent\'s picks this month.',
      firstsEyebrow: 'Firsts',
      firstsTitle: '{n} firsts this month.',
      endEyebrow: 'That\'s October',
      endTitle: { name: 'Nice month, {name}.', none: 'Nice month.' },
      share: 'Share this',
      done: 'Done'
    },

    wrapped: {
      eyebrow: 'Detour Wrapped 2040',
      title: 'Your year, in detours.',
      sub: { name: 'Six cards. All about you, {name}.', none: 'Six cards. All about you.' },
      agentLine: 'Your agent made <b class="hl" data-c1>0</b> of every 100 choices.',
      youLine: 'You made <b data-c2>0</b>.',
      butLine: 'But by December, you made',
      of100: 'out of every 100 yourself.',
      swapsEyebrow: 'Other options',
      swaps: 'You swapped {n} of your agent\'s picks this year.',
      firstsEyebrow: 'Firsts',
      firstsTitle: 'firsts.',
      mealsEyebrow: 'Do it yourself',
      mealsTitle: 'meals, cooked by you.',
      mealsSub: 'Up from {n} last year.',
      shareEyebrow: 'Share if you like',
      shareSub: 'You see a preview first. Nothing is shared by default.',
      share: 'Share my year',
      done: 'Done'
    },

    me: {
      sub: '{city} · using Detour with {agent}',
      shared: 'Things you shared', sharedSub: { some: '{n} cards', none: 'Nothing yet' },
      recaps: 'Your recaps', recapsSub: 'October, your year, and 2026 you',
      notifs: 'Messages from Detour', notifsSub: '{n} a day at most · quiet {from} to {to}',
      cats: 'What Detour helps with',
      friendSee: 'What friends can see',
      skills: 'Skills you\'re keeping',
      promisesTitle: 'Our promises',
      startOver: 'Start over',
      startOverToast: 'Starting over.',
      restart: 'Restart the tour'
    },
    sharedList: {
      title: 'Things you shared',
      sub: 'Cards you shared. Only you see this list.',
      empty: 'Nothing shared yet. Look for "Share this" after you do something yourself.'
    },

    notify: { now: 'now' },

    sim: {
      title: 'Play a day with Detour',
      play: 'Play', pause: 'Pause', again: 'Play again',
      clock: '{t}',
      note: 'Detour messages today: {n} of {max}',
      needSetup: 'Finish setup, or explore freely, to play a day.',
      paused: 'Paused. Tap the message on the phone.',
      over: 'That\'s the day. Play it again any time.'
    },

    panel: {
      welcomeTitle: 'This is a 3-minute tour of Detour.',
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
      jumpTitle: 'Jump to a screen',
      foot: 'Press <kbd>D</kbd> for the <button type="button" class="linkbtn" data-demo-open>demo menu</button>.',
      tapHere: 'Tap here'
    },

    screens: {
      welcome: 'Welcome', phone: 'Phone number', about: 'About you', quiz: '2026 quiz',
      recap2026: 'Your 2026 self', agent: 'Pick your agent', friendsAdd: 'Add friends',
      today: 'Today', day: 'Your day', friends: 'Friends', diy: 'Do it yourself',
      map: 'Taste Map', monthly: 'October recap', wrapped: 'Wrapped 2040', me: 'Me'
    },

    demo: {
      title: 'Demo menu',
      sub: 'For walkthroughs and recordings',
      restart: 'Restart tour',
      startOver: 'Start over',
      play: 'Play the day',
      jump: 'Jump to',
      foot: 'Press <kbd>D</kbd> to open or close. <kbd>Esc</kbd> also closes.'
    }
  }
};
