/* Detour prototype · all content and on-screen text lives here.
   No fixed persona: the viewer is the user. Personal details come from app state.
   Plain global object so the app runs from file:// with no fetch or modules. */
window.DETOUR_DATA = (function () {
  'use strict';

  /* Small builders keep the long lists readable. */
  const opt = (title, line, meta, free) => ({ title: title, line: line, meta: meta, free: !!free });
  const quiet = (id, agent, reason) => ({ id: id, kind: 'quiet', agent: agent, reason: reason || 'none' });

  return {
    today: { date: 'Friday, 26 October 2040', short: '26 Oct 2040', sunday: 'Sunday, 28 October 2040', year: 2040 },

    // Demo numbers for recaps. Today's numbers are live.
    numbers: {
      ocrStart: 18, ocrLastMonth: 20, ocrMonth: 22, ocrYear: 19, agentYear: 81, ocrDecember: 31,
      swapsMonth: 9, swapsYear: 74, firstsYear: 12, firstsMonth: 3,
      mealsYear: 20, mealsLastYear: 2, stampsStart: 140, stampReward: 15, agentFound: 4312
    },

    cities: ['Bengaluru', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Other'],
    years: { from: 2010, to: 2028 },

    providers: [
      { id: 'nova', name: 'Nova', line: 'Plans your meals, music and days.' },
      { id: 'sutra', name: 'Sutra', line: 'Handles food, shopping and travel.' },
      { id: 'orbit', name: 'Orbit', line: 'Runs your calendar and daily picks.' }
    ],

    /* The three option sources. Same colours everywhere. */
    sources: {
      friend: { label: 'From a friend', icon: 'heart', color: '#4B5BA8', tint: '#E4E7F5' },
      taste: { label: 'From your taste', icon: 'clock', color: '#C9822B', tint: '#F7E9D5' },
      new: { label: 'Something new', icon: 'spark', color: '#1E7A72', tint: '#D9ECE8' }
    },

    /* =========================================================
       Nostalgia: era packs (by the year you turned 18) + hometown memories.
       off = years after you turned 18. tag = a phrase for "You, at 18".
       taste = what this memory becomes as a "From your taste" option.
       ========================================================= */
    eras: [
      { from: 2010, to: 2014, items: [
        { id: 'e1-maggi', title: 'Maggi at 2 am in exam week', season: 'Exam season', off: 0, art: 'noodles', cat: 'food', tag: 'Maggi-at-2-am',
          taste: opt('Masala Maggi, made by you', '', 'Free · 10 min', true) },
        { id: 'e1-sms', title: 'Saving SMS packs to text all night', season: 'Winter', off: -1, art: 'phone', cat: null, tag: 'texting-all-night' },
        { id: 'e1-cricket', title: 'A World Cup final with 20 people around one TV', season: 'Summer', off: 0, art: 'tv', cat: 'weekend', tag: 'cricket-with-everyone',
          taste: opt('A big-screen match night with friends', '', 'Free · Sunday 7 pm', true) },
        { id: 'e1-radio', title: 'Requesting songs on the late-night radio show', season: 'Monsoon', off: 1, art: 'radio', cat: 'music', tag: 'radio-requests',
          taste: opt('Old radio hits, a late-night mix', '', 'Free · 1 hour', true) },
        { id: 'e1-chai', title: 'Cutting chai at the college canteen', season: 'Monsoon', off: 1, art: 'chai', cat: 'food', tag: 'canteen-chai',
          taste: opt('A tiny chai stall near you', '', '2 min away · ₹15') },
        { id: 'e1-tees', title: 'Graphic tees and one favourite pair of jeans', season: 'Summer', off: 0, art: 'shirt', cat: 'clothes', tag: 'one-pair-of-jeans',
          taste: opt('A plain printed tee, like your old ones', '', '₹400') }
      ] },
      { from: 2015, to: 2019, items: [
        { id: 'e2-data', title: 'Data became almost free. Everyone streamed everything.', season: 'Monsoon', off: 0, art: 'phone', cat: 'shows', tag: 'stream-everything',
          taste: opt('That comedy series you binged at 18', '', 'Free · 20-minute episodes', true) },
        { id: 'e2-maggi', title: 'Maggi at 2 am during exam week', season: 'Exam season', off: 0, art: 'noodles', cat: 'food', tag: 'Maggi-at-2-am',
          taste: opt('Masala Maggi, made by you', '', 'Free · 10 min', true) },
        { id: 'e2-group', title: 'The class group chat that never slept', season: 'Winter', off: 0, art: 'phone', cat: null, tag: 'group-chat-all-night' },
        { id: 'e2-phone', title: 'Saving up for your first smartphone', season: 'Summer', off: -1, art: 'phone', cat: null, tag: 'saving-up' },
        { id: 'e2-cricket', title: 'A cricket final with 20 people around one TV', season: 'Summer', off: 1, art: 'tv', cat: 'weekend', tag: 'cricket-with-everyone',
          taste: opt('A big-screen match night with friends', '', 'Free · Sunday 7 pm', true) },
        { id: 'e2-music', title: 'Indie pop on repeat in your earphones', season: 'Monsoon', off: 1, art: 'radio', cat: 'music', tag: 'indie-pop-on-repeat',
          taste: opt('Indie pop, a throwback mix', '', 'Free · 50 min', true) }
      ] },
      { from: 2020, to: 2024, items: [
        { id: 'e3-class', title: 'Online classes from your bed', season: 'Monsoon', off: 0, art: 'phone', cat: null, tag: 'classes-from-bed' },
        { id: 'e3-coffee', title: 'The whipped coffee everyone made at home', season: 'Summer', off: 0, art: 'chai', cat: 'food', tag: 'whipped-coffee',
          taste: opt('Whipped coffee, made by you', '', 'Free · 10 min', true) },
        { id: 'e3-bake', title: 'Baking banana bread for the first time', season: 'Winter', off: 0, art: 'cake', cat: 'food', tag: 'first-banana-bread',
          taste: opt('Banana bread, your old recipe', '', 'Free recipe · 1 hour', true) },
        { id: 'e3-dance', title: 'Learning every dance from short videos', season: 'Monsoon', off: 1, art: 'radio', cat: 'fitness', tag: 'short-video-dances',
          taste: opt('A dance class for beginners', '', '₹300 · Saturday') },
        { id: 'e3-hoodie', title: 'Thrifted shirts and oversized hoodies', season: 'Winter', off: 1, art: 'shirt', cat: 'clothes', tag: 'oversized-hoodie',
          taste: opt('A thrift market this Sunday', '', 'Free to browse', true) },
        { id: 'e3-cycle', title: 'Long cycle rides on empty roads', season: 'Summer', off: 0, art: 'cycle', cat: 'weekend', tag: 'empty-road-cycling',
          taste: opt('A sunrise cycle ride', '', '₹100 rental · 6 am') }
      ] },
      { from: 2025, to: 2028, items: [
        { id: 'e4-agent', title: 'Your first AI agent, and asking it everything', season: 'Monsoon', off: 0, art: 'phone', cat: null, tag: 'asking-the-agent-everything' },
        { id: 'e4-run', title: 'Weekend run clubs with strangers', season: 'Winter', off: 0, art: 'cycle', cat: 'fitness', tag: 'run-club',
          taste: opt('A Sunday run club', '', 'Free · 6:30 am', true) },
        { id: 'e4-cafe', title: 'Trying every new café drink in town', season: 'Summer', off: 1, art: 'chai', cat: 'food', tag: 'café-drink-hunter',
          taste: opt('A new café drink near you', '', '₹220') },
        { id: 'e4-vinyl', title: 'Old songs on vinyl at a friend\'s place', season: 'Monsoon', off: 1, art: 'radio', cat: 'music', tag: 'vinyl-nights',
          taste: opt('An old songs listening night', '', 'Free · Friday', true) },
        { id: 'e4-maggi', title: 'Maggi at 2 am during exam week', season: 'Exam season', off: -1, art: 'noodles', cat: 'food', tag: 'Maggi-at-2-am',
          taste: opt('Masala Maggi, made by you', '', 'Free · 10 min', true) },
        { id: 'e4-kurta', title: 'Bright kurtas with sneakers', season: 'Winter', off: 0, art: 'shirt', cat: 'clothes', tag: 'kurta-and-sneakers',
          taste: opt('A bright block-print kurta', '', '₹900') }
      ] }
    ],

    hometowns: {
      Kolkata: [
        { id: 'h-kol1', title: 'Puchka after tuition', season: 'Winter', off: -1, art: 'street', cat: 'food', tag: 'puchka-after-tuition',
          taste: opt('Puchka from a street stall', '', '5 min away · ₹40') },
        { id: 'h-kol2', title: 'Rainy afternoons and fish curry with rice', season: 'Monsoon', off: 0, art: 'curry', cat: 'food', tag: 'monsoon-fish-curry',
          taste: opt('Bengali fish curry and rice', '', '20 min away · ₹300') }
      ],
      Chennai: [
        { id: 'h-che1', title: 'Filter coffee, then the beach on Sunday evening', season: 'Summer', off: 0, art: 'beach', cat: 'weekend', tag: 'Sunday-beach',
          taste: opt('An evening at the beach', '', 'Free · 5 pm', true) },
        { id: 'h-che2', title: 'December music season mornings', season: 'Winter', off: 1, art: 'radio', cat: 'music', tag: 'music-season-mornings',
          taste: opt('A Carnatic morning concert', '', 'Free · Sunday 7 am', true) }
      ],
      Mumbai: [
        { id: 'h-mum1', title: 'Vada pav after the local train', season: 'Monsoon', off: 0, art: 'street', cat: 'food', tag: 'vada-pav-after-the-train',
          taste: opt('A fresh vada pav stall', '', '5 min away · ₹40') },
        { id: 'h-mum2', title: 'Monsoon walks by the sea', season: 'Monsoon', off: 1, art: 'beach', cat: 'weekend', tag: 'sea-walks',
          taste: opt('A walk by the sea at sunset', '', 'Free · 6 pm', true) }
      ],
      Delhi: [
        { id: 'h-del1', title: 'Winter mornings and chole bhature', season: 'Winter', off: 0, art: 'curry', cat: 'food', tag: 'winter-chole-bhature',
          taste: opt('Chole bhature for lunch', '', '15 min away · ₹180') },
        { id: 'h-del2', title: 'Shopping in the old market lanes', season: 'Winter', off: 1, art: 'market', cat: 'clothes', tag: 'old-market-lanes',
          taste: opt('An old market walk this Saturday', '', 'Free to walk around', true) }
      ],
      Bengaluru: [
        { id: 'h-blr1', title: 'Cubbon Park before the city woke up', season: 'Winter', off: 0, art: 'park', cat: 'weekend', tag: 'early-park-walks',
          taste: opt('A Saturday walk in Cubbon Park', '', 'Free · 1 hour', true) },
        { id: 'h-blr2', title: 'Dosa breakfasts at a busy darshini', season: 'Monsoon', off: -1, art: 'street', cat: 'food', tag: 'darshini-dosa',
          taste: opt('A crispy dosa breakfast', '', '10 min away · ₹80') }
      ],
      Hyderabad: [
        { id: 'h-hyd1', title: 'Late-night biryani with cousins', season: 'Winter', off: 0, art: 'curry', cat: 'food', tag: 'midnight-biryani',
          taste: opt('A small wood-fire biryani place', '', '15 min away · ₹300') },
        { id: 'h-hyd2', title: 'Irani chai and bun maska after school', season: 'Monsoon', off: -1, art: 'chai', cat: 'food', tag: 'Irani-chai',
          taste: opt('Irani chai and bun maska', '', '10 min away · ₹60') }
      ],
      Pune: [
        { id: 'h-pun1', title: 'Spicy misal pav breakfasts', season: 'Winter', off: 0, art: 'street', cat: 'food', tag: 'misal-pav',
          taste: opt('A spicy misal pav breakfast', '', '10 min away · ₹110') },
        { id: 'h-pun2', title: 'Monsoon treks to the old fort', season: 'Monsoon', off: 1, art: 'hills', cat: 'weekend', tag: 'monsoon-treks',
          taste: opt('A short monsoon trek', '', 'Free · 2 hours', true) }
      ],
      Other: [
        { id: 'h-oth1', title: 'Sunday markets with your family', season: 'Summer', off: -1, art: 'market', cat: 'weekend', tag: 'Sunday-markets',
          taste: opt('A Sunday morning market', '', 'Free to walk around', true) },
        { id: 'h-oth2', title: 'Street momos after school', season: 'Winter', off: 0, art: 'street', cat: 'food', tag: 'after-school-momos',
          taste: opt('Hot momos from a street stall', '', '5 min away · ₹80') }
      ]
    },

    /* "Remember this?" moments in the day. {y} = the year, {age} = your age then. */
    remember: [
      { id: 'r-rajma', art: 'curry', off: 2, title: 'In {y}, you cooked your mom\'s rajma every Sunday.', line: 'Your agent hasn\'t ordered it once.', cta: 'Make it this week' },
      { id: 'r-cycle', art: 'cycle', off: 1, title: 'In {y}, you cycled everywhere.', line: 'Your agent books a cab every day now.', cta: 'Ride on Saturday' },
      { id: 'r-letter', art: 'books', off: 0, title: 'In {y}, you wrote long birthday letters.', line: 'Your agent writes them now.', cta: 'Write the next one' },
      { id: 'r-radio', art: 'radio', off: 1, title: 'In {y}, you knew every song on the radio.', line: 'Now it\'s the same 40 songs.', cta: 'Play something old' }
    ],
    onThisDay: [
      'On this day in {y}: your first Kerala fish curry.',
      'On this day in {y}: you cooked for six friends.',
      'On this day in {y}: you walked home in the rain, on purpose.'
    ],
    thenNow: [
      { then: 'Walked everywhere', now: 'Cab every day' },
      { then: 'Knew every song on the radio', now: 'Same 40 songs' },
      { then: 'Cooked on Sundays', now: 'Paneer bowl, 9 times' },
      { then: 'Planned trips with friends', now: 'Same beach town, booked for you' }
    ],

    /* =========================================================
       The agent's decision pool. Each Play picks one per slot.
       kind: repeat (Detour may offer options), skill (a chance to do it yourself), quiet.
       ========================================================= */
    slots: [
      { id: 'wake', time: 380, pool: [
        quiet('w1', 'Moved your alarm to 6:20. You have an early meeting.'),
        quiet('w2', 'Noted you slept 5 hours 40 minutes.', 'health'),
        quiet('w3', 'Turned on the geyser 10 minutes before you woke up.') ] },
      { id: 'care', time: 410, pool: [
        quiet('c1', 'Reordered your usual toothpaste.'),
        quiet('c2', 'Your toothbrush is 3 months old. Ordered a new one.') ] },
      { id: 'breakfast', time: 465, pool: [
        { id: 'b1', kind: 'repeat', cat: 'food', agent: 'Ordered your usual poha again', noun: 'breakfast',
          pick: 'Poha', note: '11th time this month', detour: '11th poha this month. 3 other options?',
          fallback: opt('Bread omelette, your hostel way', 'Two eggs, one pan, five minutes.', 'Free · 10 min', true),
          news: [opt('Akki roti with coconut chutney', 'Rice flatbread from a small Mangalorean kitchen.', '15 min away · ₹120'),
                 opt('Thepla and mango pickle', 'Soft Gujarati flatbread. Good with chai.', '10 min away · ₹90')] },
        { id: 'b2', kind: 'skill', skill: 'cooking', agent: 'Planned breakfast from what\'s in your fridge',
          ask: 'You have eggs and bread. Make it yourself?', did: 'Made breakfast yourself' } ] },
      { id: 'outfit', time: 485, pool: [
        { id: 'o1', kind: 'repeat', cat: 'clothes', agent: 'Picked the navy shirt again', noun: 'today\'s outfit',
          pick: 'Navy shirt', note: '4th Monday in a row', detour: 'Navy shirt, 4th Monday in a row. 3 other options?',
          fallback: opt('Your blue checked shirt', 'Still in your cupboard. Still a good shirt.', 'Free · already yours', true),
          news: [opt('A mustard linen shirt', 'Bright, light and very not-navy.', '₹1,100'),
                 opt('A Kalamkari print shirt', 'Hand-painted style from Andhra.', '₹1,300')] },
        quiet('o2', 'Scheduled your laundry for Wednesday.'),
        quiet('o3', 'Sent your blue kurta for repair.') ] },
      { id: 'essentials', time: 500, pool: [
        quiet('es1', 'Reminder: keys, wallet, charger, umbrella. Rain at 6 pm.'),
        quiet('es2', 'Charged your earphones overnight and packed them.') ] },
      { id: 'commute', time: 520, pool: [
        quiet('cm1', 'Booked a cab for you and a colleague.'),
        { id: 'cm2', kind: 'skill', skill: 'wayfinding', agent: 'Bought your metro ticket and picked the route',
          ask: 'Walk the last kilometre without directions?', did: 'Walked the last kilometre yourself' },
        quiet('cm3', 'Picked a route that avoids tolls.'),
        quiet('cm4', 'Booked your car service for Friday.') ] },
      { id: 'work', time: 630, pool: [
        quiet('wk1', 'Summarised 42 emails and replied to 30.'),
        quiet('wk2', 'Wrote notes from your 10 am meeting. Set 3 deadlines.'),
        { id: 'wk3', kind: 'skill', skill: 'writing', agent: 'Drafted a thank-you note to your manager',
          ask: 'Want to write this one yourself?', did: 'Wrote the thank-you note yourself' } ] },
      { id: 'shopping', time: 700, pool: [
        quiet('sh1', 'Reordered detergent.'),
        { id: 'sh2', kind: 'repeat', cat: 'clothes', agent: 'Found the same running shoes you bought last year', noun: 'new shoes',
          pick: 'Same running shoes', note: 'the same pair, again', detour: 'Same shoes as last year. 3 other options?',
          fallback: opt('Your old canvas shoes, cleaned up', 'A wash and new laces. Good as new.', 'Free · already yours', true),
          news: [opt('Trail shoes for weekend hikes', 'Grippy soles. Made for mud.', '₹3,200'),
                 opt('Barefoot-style walking shoes', 'Light and flat. Feels like walking on grass.', '₹2,400')] },
        quiet('sh3', 'Blocked an impulse buy at 11 pm last night.', 'money') ] },
      { id: 'lunch', time: 765, pool: [
        { id: 'l1', kind: 'repeat', cat: 'food', agent: 'Ordering your usual paneer bowl', noun: 'lunch',
          pick: 'Paneer bowl', note: '9th time this month', detour: 'You\'ve had this 9 times this month. 3 other options?',
          fallback: opt('A South Indian meals plate', 'Rice, sambar, rasam, two veg and curd.', '10 min away · ₹180'),
          news: [opt('A Goan prawn curry rice plate', 'Tangy, coconutty and new for you.', '20 min away · ₹380'),
                 opt('A Rajasthani dal baati thali', 'Smoky baati and a lot of ghee.', '15 min away · ₹260')] },
        { id: 'l2', kind: 'repeat', cat: 'food', agent: 'Ordering the same salad bowl again', noun: 'lunch',
          pick: 'Salad bowl', note: '7th time this month', detour: 'Same salad, 7 times this month. 3 other options?',
          fallback: opt('Curd rice with a crunchy tadka', 'Cool, simple and very home.', 'Free recipe · 15 min', true),
          news: [opt('Hyderabadi haleem', 'Slow-cooked and very filling.', '25 min away · ₹280'),
                 opt('A Japanese ramen bowl', 'Rich broth. Nothing like a salad.', '20 min away · ₹420')] } ] },
      { id: 'money', time: 840, pool: [
        quiet('m1', 'Invested your monthly savings.', 'money'),
        quiet('m2', 'Paid the electricity bill.', 'money') ] },
      { id: 'health', time: 900, pool: [
        quiet('h1', 'Reordered your vitamin D.', 'health'),
        quiet('h2', 'Booked your dentist for next Tuesday.', 'health') ] },
      { id: 'docs', time: 960, pool: [
        quiet('d1', 'Reminder: your passport renewal is due in March.', 'docs'),
        quiet('d2', 'Filed this month\'s rent receipt.', 'docs') ] },
      { id: 'learning', time: 1005, pool: [
        { id: 'le1', kind: 'repeat', cat: 'learning', agent: 'Signed you up for another productivity course', noun: 'something to learn',
          pick: 'Productivity course', note: 'like your last three', detour: 'Your 4th productivity course. 3 other options?',
          fallback: opt('Guitar lessons, finally', 'You always said you would.', '₹1,500 a month'),
          news: [opt('A beginner pottery class', 'Hands busy, mind quiet.', '₹800 · Saturday'),
                 opt('A free photo walk', 'Learn by shooting your own street.', 'Free · Sunday 7 am', true)] } ] },
      { id: 'gym', time: 1095, pool: [
        { id: 'g1', kind: 'repeat', cat: 'music', agent: 'Started the same 40-song gym playlist', noun: 'your gym music',
          pick: 'Gym mix', note: 'the same 40 songs', detour: 'Same 40 songs, 22 times this month. 3 other options?',
          fallback: opt('Your college running mix', 'You ran to these songs for a whole year.', 'Free · 45 min', true),
          news: [opt('A bhangra workout mix', 'Big drums. Hard to stand still.', 'Free · 45 min', true),
                 opt('An Afrobeats running set', 'Bright, fast and joyful.', 'Free · 40 min', true)] },
        { id: 'g2', kind: 'repeat', cat: 'fitness', agent: 'Picked your usual workout: chest day again', noun: 'your workout',
          pick: 'Chest day', note: '3rd time this week', detour: 'Chest day, 3rd time this week. 3 other options?',
          fallback: opt('Swimming, like in school', 'Forty lengths. No music needed.', '₹150 · pool pass'),
          news: [opt('A slow yoga flow class', 'Your back will thank you.', '₹200 · 7 pm'),
                 opt('Badminton with friends', 'Book a court for four.', '₹400 · 7:30 pm')] } ] },
      { id: 'dinner', time: 1170, pool: [
        { id: 'dn1', kind: 'repeat', cat: 'food', agent: 'Ordering from your usual place again', noun: 'dinner',
          pick: 'Your usual North Indian place', note: '6th order this month', detour: '6th order from here this month. 3 other options?',
          fallback: opt('Khichdi, your way', 'One pot. Twenty minutes. Very comforting.', 'Free recipe · 20 min', true),
          news: [opt('Kerala parotta and veg stew', 'Flaky, soft and full of coconut.', '20 min away · ₹240'),
                 opt('A smoky Northeast thali', 'Bamboo shoot, greens and a fiery chutney.', '25 min away · ₹350')] },
        { id: 'dn2', kind: 'skill', skill: 'cooking', agent: 'Getting ready to order dinner again',
          ask: 'Cook tonight? You have dal, rice and onions.', did: 'Cooked dinner yourself' } ] },
      { id: 'evening', time: 1245, pool: [
        { id: 'ev1', kind: 'repeat', cat: 'shows', agent: 'Queued another crime thriller series', noun: 'tonight\'s show',
          pick: 'Crime thriller', note: 'your 6th this year', detour: 'Your 6th crime thriller this year. 3 other options?',
          fallback: opt('That comedy you loved at 18', 'Still funny. Still short episodes.', 'Free with your plan', true),
          news: [opt('A Malayalam family comedy', 'Warm, funny and very different.', 'Free with your plan', true),
                 opt('A Korean food documentary', 'Gentle and beautiful. Makes you hungry.', 'Free with your plan', true)] },
        quiet('ev2', 'Dimmed the lights and set the AC to 26°.') ] },
      { id: 'social', time: 1290, pool: [
        { id: 'so1', kind: 'skill', skill: 'writing', agent: 'Picked a birthday gift for Ananya and wrote the message',
          ask: 'Write her message yourself?', did: 'Wrote Ananya\'s message yourself' },
        quiet('so2', 'Replied "Congrats!" to 4 wedding photos.') ] },
      { id: 'weekend', time: 1335, pool: [
        { id: 'we1', kind: 'repeat', cat: 'weekend', agent: 'Planned Saturday: the same mall and the same café', noun: 'Saturday',
          pick: 'Mall, then the usual café', note: '5th Saturday like this', detour: '5th Saturday like this. 3 other options?',
          fallback: opt('A long walk in your old park', 'You used to go every weekend.', 'Free · 1 hour', true),
          news: [opt('A heritage walk in the old town', 'Old lanes and good stories.', 'Free · Saturday 8 am', true),
                 opt('A pottery café', 'Make a mug. Drink from it later.', '₹700 · 2 hours')] },
        { id: 'we2', kind: 'skill', skill: 'trip', agent: 'Booked the same beach town for the long weekend',
          ask: 'Plan this trip yourself?', did: 'Planned the long weekend yourself' } ] },
      { id: 'worklife', time: 1360, pool: [
        quiet('wl1', 'Checked your leave: 9 days left, 3 expire in December.'),
        quiet('wl2', 'Set a reminder for tomorrow\'s first meeting.') ] }
    ],

    day: { start: 360, end: 1410, waitMins: 20, onThisDayAt: 540 },

    /* Jump chips. slot = where the day jumps to; screen = opens a screen. */
    moments: [
      { id: 'morning', label: 'Morning', slot: 'breakfast' },
      { id: 'work', label: 'Work', slot: 'work' },
      { id: 'lunch', label: 'Lunch', slot: 'lunch' },
      { id: 'evening', label: 'Evening', slot: 'dinner' },
      { id: 'night', label: 'Night', slot: 'weekend' },
      { id: 'sunday', label: 'Sunday', screen: 'friends' },
      { id: 'month', label: 'Month end', screen: 'monthly' },
      { id: 'year', label: 'Year end', screen: 'wrapped' }
    ],

    /* Do It Yourself: today's challenge is picked from your skills. */
    skills: [
      { id: 'cooking', name: 'Cooking', icon: 'pot', note: 'You cooked most Sundays, years ago.' },
      { id: 'wayfinding', name: 'Finding your way', icon: 'compass', note: 'You used to explore without a map.' },
      { id: 'writing', name: 'Writing your own messages', icon: 'pen', note: 'Your birthday messages used to be long and warm.' },
      { id: 'trip', name: 'Planning trips', icon: 'route', note: 'You planned trips with friends at 19.' }
    ],
    challenges: [
      { id: 'walk', skill: 'wayfinding', icon: 'compass', title: 'Walk to the market today without directions.', line: 'Just you and the street signs.',
        steps: ['Leave the map in your pocket.', 'Ask one person the way.', 'Notice one new shop.'],
        checks: ['We checked: your agent didn\'t plan a route.', 'You walked 2.1 km today.'], share: 'Walked it myself. No map.' },
      { id: 'cook', skill: 'cooking', icon: 'pot', title: 'Cook one meal yourself today.', line: 'Your old dal recipe is waiting.',
        steps: ['Wash the dal. Soak it for 15 minutes.', 'Pressure-cook it with turmeric and salt.', 'Heat ghee. Add cumin, garlic and one chilli.'],
        checks: ['We checked: your agent didn\'t order dinner.', 'You bought the dal yourself on Thursday.'], share: 'Cooked by me. Not by my agent.' },
      { id: 'write', skill: 'writing', icon: 'pen', title: 'Write one message yourself today.', line: 'A friend\'s birthday is on Friday.',
        steps: ['Think of one funny memory.', 'Write three lines. Keep it you.', 'Send it before your agent does.'],
        checks: ['We checked: your agent didn\'t draft this one.'], share: 'Written by me. Not by my agent.' },
      { id: 'plan', skill: 'trip', icon: 'route', title: 'Plan your Saturday yourself.', line: 'No mall. No usual café. Your call.',
        steps: ['Pick one place you\'ve never been.', 'Ask one friend to come.', 'Book it yourself.'],
        checks: ['We checked: your agent didn\'t plan Saturday.'], share: 'Planned it myself. Not my agent.' }
    ],

    /* =========================================================
       People: about 20 across India. on = on Detour.
       loves = things they loved lately (become "From a friend" options).
       post = their latest photo or video in the Friends feed.
       ========================================================= */
    people: [
      { id: 'ananya', name: 'Ananya', city: 'Bengaluru', phone: '98451 20311', on: true, color: '#4B5BA8', both: 'You both like spicy food.',
        loves: { food: opt('Northeast Indian thali', '', '15 min away · ₹350'), music: opt('A Kannada indie playlist', '', 'Free · 48 min', true), weekend: opt('A sunrise bike ride by the lake', '', 'Free · 6 am', true) },
        post: { art: 'cycle', kind: 'video', tag: 'did', caption: 'Rode to the lake at 6 am. No agent, no plan.', ago: '2h', likes: 24 } },
      { id: 'kabir', name: 'Kabir', city: 'Delhi', phone: '98110 45872', on: true, color: '#1E7A72', both: 'You both like old film songs.',
        loves: { food: opt('Amritsari kulcha and chole', '', '20 min away · ₹220'), shows: opt('An old Hindi film, restored', '', 'Free with your plan', true), clothes: opt('A bright block-print kurta', '', '₹900') },
        post: { art: 'curry', kind: 'photo', tag: 'did', caption: 'Made chole like my nani. Burnt one batch. Worth it.', ago: '5h', likes: 41 } },
      { id: 'meera', name: 'Meera', city: 'Pune', phone: '98220 77140', on: true, color: '#8A6BB8', both: 'You both love long walks.',
        loves: { food: opt('Home-made rajma chawal', '', 'Free recipe · 40 min', true), learning: opt('A free sketching meetup', '', 'Free · Saturday 10 am', true), weekend: opt('A slow morning at a flower market', '', 'Free', true) },
        post: { art: 'hills', kind: 'photo', tag: 'loved', caption: 'Monsoon trek to the fort. Muddy shoes, happy heart.', ago: '1d', likes: 57 } },
      { id: 'arjun', name: 'Arjun', city: 'Chennai', phone: '98400 31219', on: true, color: '#C9533A', both: 'You both like trying new food.',
        loves: { food: opt('A Chettinad mushroom curry', '', '20 min away · ₹280'), music: opt('A Carnatic fusion set', '', 'Free · 50 min', true), fitness: opt('Beach volleyball at sunrise', '', 'Free · 6 am', true) },
        post: { art: 'beach', kind: 'video', tag: 'loved', caption: 'Sunday evening at the beach. Corn, sea breeze, no phone.', ago: '1d', likes: 33 } },
      { id: 'farhan', name: 'Farhan', city: 'Hyderabad', phone: '98490 66025', on: true, color: '#2F6E9E', both: 'You both love late-night food.',
        loves: { food: opt('Lukhmi and Irani chai', '', '10 min away · ₹120'), shows: opt('A Turkish family drama', '', 'Free with your plan', true), fitness: opt('A Sunday football kickabout', '', 'Free · 7 am', true) },
        post: { art: 'chai', kind: 'photo', tag: 'loved', caption: 'Irani chai at the old café. Some things never change.', ago: '3h', likes: 19 } },
      { id: 'lakshmi', name: 'Lakshmi', city: 'Chennai', phone: '98410 22987', on: true, color: '#B5683A', both: 'You both like cooking slow.',
        loves: { food: opt('Bisi bele bath, her mom\'s way', '', 'Free recipe · 45 min', true), clothes: opt('A handloom cotton shirt', '', '₹1,200'), learning: opt('A beginner Tamil cooking class', '', '₹500 · Sunday') },
        post: { art: 'curry', kind: 'photo', tag: 'did', caption: 'First time making bisi bele bath without calling Amma.', ago: '6h', likes: 62 } },
      { id: 'gurpreet', name: 'Gurpreet', city: 'Amritsar', phone: '98140 55120', on: true, color: '#C9822B', both: 'You both like loud music.',
        loves: { food: opt('Sarson da saag and makki roti', '', '25 min away · ₹250'), music: opt('A bhangra dance class', '', '₹300 · Saturday'), fitness: opt('A morning cycling group', '', 'Free · 6 am', true) },
        post: { art: 'market', kind: 'video', tag: 'loved', caption: 'Winter market lights. Ate three jalebis. No regrets.', ago: '2d', likes: 48 } },
      { id: 'tenzin', name: 'Tenzin', city: 'Darjeeling', phone: '98320 10475', on: true, color: '#3E8E6B', both: 'You both like quiet mornings.',
        loves: { food: opt('Thukpa from a tiny Tibetan kitchen', '', '15 min away · ₹180'), weekend: opt('A day hike to a monastery', '', 'Free · Saturday', true), music: opt('Mountain folk songs, a calm mix', '', 'Free · 35 min', true) },
        post: { art: 'hills', kind: 'video', tag: 'did', caption: 'Walked up to the monastery. The fog lifted at the top.', ago: '4h', likes: 71 } },
      { id: 'joseph', name: 'Joseph', city: 'Kochi', phone: '98470 33612', on: true, color: '#1F6F8B', both: 'You both like the sea.',
        loves: { food: opt('Appam and vegetable stew', '', '15 min away · ₹200'), shows: opt('A Malayalam thriller everyone loved', '', 'Free with your plan', true), weekend: opt('A backwater kayak trip', '', '₹900 · Saturday') },
        post: { art: 'beach', kind: 'photo', tag: 'did', caption: 'Kayaked the backwaters myself. Arms hurt. Totally worth it.', ago: '8h', likes: 29 } },
      { id: 'zoya', name: 'Zoya', city: 'Lucknow', phone: '98390 70123', on: true, color: '#A0527A', both: 'You both love old poetry.',
        loves: { food: opt('A Lucknowi kebab platter', '', '20 min away · ₹350'), clothes: opt('A chikankari kurta', '', '₹1,600'), learning: opt('An Urdu poetry evening', '', 'Free · Friday 7 pm', true) },
        post: { art: 'books', kind: 'photo', tag: 'loved', caption: 'Poetry night at the old library. I read one of my own.', ago: '1d', likes: 53 } },
      { id: 'aditya', name: 'Aditya', city: 'Mumbai', phone: '98200 88417', on: true, color: '#5B6B2E', both: 'You both like rooftop evenings.',
        loves: { food: opt('A Goan fish thali', '', '25 min away · ₹400'), fitness: opt('A rooftop yoga session', '', '₹250 · 7 am'), shows: opt('A stand-up comedy special', '', 'Free with your plan', true) },
        post: { art: 'rain', kind: 'video', tag: 'loved', caption: 'Mumbai rain from the rooftop. Chai in one hand.', ago: '3h', likes: 38 } },
      { id: 'nandini', name: 'Nandini', city: 'Kolkata', phone: '98300 12658', on: true, color: '#7A4B9E', both: 'You both like Sunday books.',
        loves: { food: opt('Shukto and rice, Bengali style', '', '20 min away · ₹220'), music: opt('Rabindra sangeet, a calm mix', '', 'Free · 40 min', true), weekend: opt('A book market on Sunday', '', 'Free to browse', true) },
        post: { art: 'books', kind: 'photo', tag: 'did', caption: 'Found a 1970s poetry book at the street market. ₹40.', ago: '9h', likes: 44 } },
      { id: 'sana', name: 'Sana', city: 'Srinagar', phone: '98580 21346', on: false, color: '#6E6A63' },
      { id: 'dev', name: 'Dev', city: 'Ahmedabad', phone: '98250 64710', on: false, color: '#6E6A63' },
      { id: 'ishita', name: 'Ishita', city: 'Jaipur', phone: '98290 11835', on: false, color: '#6E6A63' },
      { id: 'rahul', name: 'Rahul', city: 'Patna', phone: '98350 47290', on: false, color: '#6E6A63' },
      { id: 'neha', name: 'Neha', city: 'Indore', phone: '98260 30951', on: false, color: '#6E6A63' },
      { id: 'priyanka', name: 'Priyanka', city: 'Guwahati', phone: '98640 52813', on: false, color: '#6E6A63' },
      { id: 'vikram', name: 'Vikram', city: 'Mysuru', phone: '98450 93627', on: false, color: '#6E6A63' },
      { id: 'harish', name: 'Harish', city: 'Coimbatore', phone: '98430 26174', on: false, color: '#6E6A63' }
    ],
    sampleFriends: ['ananya', 'kabir', 'meera', 'arjun'],
    requestsIn: ['lakshmi', 'tenzin'],
    sentToYou: { from: 'meera', cat: 'weekend' },

    /* Pictures for new posts (drawn in the browser, no files). */
    gallery: [
      { art: 'curry', kind: 'photo', label: 'Dinner' },
      { art: 'chai', kind: 'photo', label: 'Chai' },
      { art: 'cycle', kind: 'video', label: 'Ride' },
      { art: 'hills', kind: 'photo', label: 'Hills' },
      { art: 'beach', kind: 'video', label: 'Sea' },
      { art: 'books', kind: 'photo', label: 'Books' }
    ],

    /* =========================================================
       Taste Map and More ideas (unchanged screens)
       ========================================================= */
    tasteMap: {
      cats: ['food', 'music', 'clothes', 'places'],
      catLabels: { food: 'Food', music: 'Music', clothes: 'Clothes', places: 'Places' },
      slots: [
        { kind: 'often', x: 160, y: 150, r0: 30, r1: 46 }, { kind: 'often', x: 232, y: 104, r0: 24, r1: 36 },
        { kind: 'often', x: 214, y: 226, r0: 22, r1: 32 }, { kind: 'used', x: 92, y: 100, r0: 40, r1: 28 },
        { kind: 'used', x: 96, y: 210, r0: 36, r1: 28 }, { kind: 'used', x: 274, y: 200, r0: 34, r1: 28 },
        { kind: 'unexplored', x: 298, y: 58, r0: 38, r1: 38 }, { kind: 'unexplored', x: 50, y: 262, r0: 38, r1: 38 },
        { kind: 'unexplored', x: 44, y: 44, r0: 38, r1: 38 }
      ],
      labels: {
        food: ['Biryani\nnights', 'Paneer\nbowls', 'Quick\nsalads', 'Fish\ncurry', 'Home\ndal', 'Street\nchaat', 'Northeast\nIndian', 'Millet\nbowls', 'Ethiopian'],
        music: ['Lo-fi\nfocus', 'Chill\npop', 'Gym\nmixes', 'Indie\npop', 'Old film\nsongs', 'Carnatic\nfusion', 'Kannada\nindie', 'Sufi\nqawwali', 'Highlife'],
        clothes: ['Grey\ntees', 'Navy\nshirts', 'Plain\nsneakers', 'Linen\nshirts', 'Block\nprints', 'Bright\ncolours', 'Handloom\nikat', 'Thrifted\nvintage', 'Workwear'],
        places: ['Home', 'Usual\ncafés', 'Office', 'City\nparks', 'Café\nhopping', 'Book\nshops', 'Old city\nmarkets', 'Community\ntheatre', 'Lake\ncycling']
      }
    },
    ideas: {
      food: { context: 'Your agent picks from the same five places.', options: [
        { id: 'f1', area: 'Northeast Indian', source: 'friend', who: 'A friend loved this.', title: 'A Northeast Indian kitchen near you', line: 'Smoky flavours and a fiery chutney.', meta: '15 min away · about ₹600' },
        { id: 'f2', area: 'Ethiopian', source: 'new', who: 'Nobody you know has tried it yet.', title: 'A new Ethiopian café near you', line: 'Big shared plates. You eat with your hands.', meta: '20 min away · about ₹500' },
        { id: 'f3', area: 'Millet bowls', source: 'new', who: 'Nothing like your usual.', free: true, title: 'Cook a millet khichdi tonight', line: 'One pot. 25 minutes.', meta: 'Free recipe · 25 min' } ] },
      music: { context: 'Your last 200 songs came from four playlists.', options: [
        { id: 'm1', area: 'Kannada indie', source: 'friend', who: 'A friend made this.', free: true, title: 'A Kannada indie playlist', line: 'Twelve songs. Mostly guitars and rain.', meta: 'Free · 48 min' },
        { id: 'm2', area: 'Sufi qawwali', source: 'new', who: 'Nobody you know has gone yet.', free: true, title: 'A free qawwali evening in a park', line: 'Saturday at 6 pm. Bring a mat.', meta: 'Free · Saturday evening' },
        { id: 'm3', area: 'Highlife', source: 'new', who: 'Nothing like your usual.', free: true, title: 'One West African highlife album', line: 'Bright guitars and horns.', meta: 'Free · 41 min' } ] },
      clothes: { context: 'Your agent bought the same grey tee six times this year.', options: [
        { id: 'c1', area: 'Handloom ikat', source: 'friend', who: 'A friend wears hers every week.', title: 'A handloom ikat shirt', line: 'Sold by the weavers themselves.', meta: 'About ₹1,400' },
        { id: 'c2', area: 'Thrifted vintage', source: 'new', who: 'Nobody you know has gone yet.', free: true, title: 'A clothes swap this Saturday', line: 'Bring two things. Take two home.', meta: 'Free · Saturday 10 am' },
        { id: 'c3', area: 'Workwear', source: 'new', who: 'Nothing like your usual.', title: 'A strong canvas work jacket', line: 'The opposite of a grey tee.', meta: 'About ₹2,000' } ] },
      places: { context: 'Most weekends since June looked the same.', options: [
        { id: 'pl1', area: 'Lake cycling', source: 'friend', who: 'A friend rides here every Sunday.', free: true, title: 'A sunrise bike ride by a lake', line: 'Rent a bike at the gate.', meta: 'Free · 6 am start' },
        { id: 'pl2', area: 'Community theatre', source: 'new', who: 'Nobody you know has gone yet.', title: 'A comedy play this Friday', line: 'Small hall. Very loud crowd.', meta: 'About ₹300 · Friday 7 pm' },
        { id: 'pl3', area: 'Old city markets', source: 'new', who: 'Nothing like your usual.', free: true, title: 'A slow morning at an old market', line: 'Flowers at 6 am. Coffee at 7.', meta: 'Free to walk around' } ] }
    },

    redeem: [
      { id: 'plus', icon: 'star', title: 'One free month of Plus', desc: 'More Wrapped cards and a longer Taste Map.', cost: 120, toast: 'Done. One free month of Plus.' },
      { id: 'cards', icon: 'spark', title: 'Two extra Wrapped cards', desc: '"Best Sunday" and "Biggest surprise".', cost: 60, toast: 'Two extra cards added to your Wrapped.' },
      { id: 'family', icon: 'people', title: 'Family plan discount', desc: 'One month off when you add someone.', cost: 100, toast: 'Saved for later.' },
      { id: 'donate', icon: 'heart', title: 'Give to a good cause', desc: '50 stamps become ₹50 for a community kitchen.', cost: 50, toast: 'Donated. Thank you.' }
    ],

    monthly: { firsts: [
      { icon: 'bowl', t: 'Your first Goan prawn curry' },
      { icon: 'music', t: 'Your first bhangra workout' },
      { icon: 'heart', t: 'An old favourite, back after 4 years' } ] },
    wrapped: { firsts: [
      'Goan prawn curry', 'Bhangra workout', 'Heritage walk', 'Sunrise bike ride', 'Bisi bele bath', 'Pottery class',
      'Kalamkari shirt', 'A trip you planned', 'Thukpa', 'Malayalam comedy', 'Book market Sunday', 'A letter you wrote' ] },

    promises: [
      'No paid suggestions, ever.',
      'Your data stays on your phone, unless you share it.',
      'Detour never changes your agent on its own.',
      'Detour stays out of health, money and documents.'
    ],
    notifs: {
      quietFrom: [{ v: 21, t: '9 pm' }, { v: 22, t: '10 pm' }, { v: 23, t: '11 pm' }],
      quietTo: [{ v: 6, t: '6 am' }, { v: 7, t: '7 am' }, { v: 8, t: '8 am' }]
    },

    share: {
      styles: [{ id: 'paper', label: 'Paper' }, { id: 'night', label: 'Night' }, { id: 'coral', label: 'Coral' }],
      targets: [
        { id: 'insta', label: 'Instagram story', icon: 'camera', toast: 'Ready to share on Instagram.' },
        { id: 'fb', label: 'Facebook', icon: 'globe', toast: 'Ready to share on Facebook.' },
        { id: 'wa', label: 'WhatsApp', icon: 'chat', toast: 'Ready to share on WhatsApp.' },
        { id: 'feed', label: 'My Detour friends', icon: 'people', toast: 'Posted for your friends.' },
        { id: 'link', label: 'Copy link', icon: 'link', toast: 'Link copied.' },
        { id: 'save', label: 'Save image', icon: 'download', toast: 'Image saved to your phone.' }
      ],
      lines: {
        self: 'I did this myself. Not my agent.',
        tried: 'I tried something new.',
        friend: 'A friend\'s pick. Loved it.',
        monthly: 'My October, in detours.',
        wrapped: 'My 2040, in detours.'
      }
    },

    /* =========================================================
       All other on-screen text
       ========================================================= */
    text: {
      tagline: 'Your agent takes the fastest route. Detour shows you the scenic one.',
      agent: 'Your agent',
      detour: 'Detour',
      back: 'Back', close: 'Close', cont: 'Continue', save: 'Save', saved: 'Saved.', you: 'You',
      tabs: { today: 'Today', friends: 'Friends', map: 'Taste Map', diy: 'Do It Yourself', me: 'Me' },
      story: { tap: 'Tap to continue' },
      privacy: 'Friends only see things you loved or did yourself, if you choose to share them. Never your agent\'s history.',

      reset: { btn: 'Reset demo', title: 'Start over?', sub: 'This clears everything in the demo.', yes: 'Start over', no: 'Cancel', done: 'Starting over.' },

      welcome: {
        lines: ['Your agent does a lot for you.', 'But it keeps picking the same things.', 'Detour shows you other options. You choose.'],
        start: 'Get started',
        skip: 'Skip and explore'
      },
      account: {
        title: 'Create your account',
        sub: 'A few details make Detour feel like yours.',
        name: 'First name', namePh: 'For example, Priya', nameErr: 'Please type your first name.',
        phone: 'Phone number', phoneErr: 'Please enter 10 digits.',
        send: 'Send code', resend: 'Send again', sent: 'Code sent.',
        code: '4-digit code', codeHelp: 'Demo: type any 4 digits.', codeErr: 'Please type the 4-digit code.', codeOk: 'Phone checked.',
        needCode: 'Tap Send code first.',
        city: 'City you live in now',
        home: 'Where did you grow up?', homeOther: 'Type your hometown', homeErr: 'Please pick where you grew up.',
        year: 'What year did you turn 18?', yearPh: 'Pick a year', yearErr: 'Please pick a year.',
        cta: 'Continue'
      },
      quiz: {
        title: '{home} called.<br>Was this you?',
        titleNone: 'Your teens called.<br>Was this you?',
        sub: 'Old memories from around the year you turned 18.',
        yes: 'That was me!', no: 'Not me',
        stamp: 'Remembered'
      },
      at18: {
        eyebrow: 'You, at 18',
        hello: { name: '{year}. You turned 18, {name}.', none: '{year}. You turned 18.' },
        place: '{home} was home.',
        three: 'In {year}, you were a {a}, {b}, {c} kind of person. {home} made you.',
        two: 'In {year}, you were a {a}, {b} kind of person. {home} made you.',
        one: 'In {year}, you were a {a} kind of person. {home} made you.',
        none: 'In {year}, you kept your secrets. {home} still made you.',
        changed: 'You\'ve changed a lot since.',
        see: 'Want to see how?',
        cta: 'Show me'
      },
      connect: {
        title: 'Connect your agent',
        sub: 'Pick the agent you use. Detour only reads. It never takes over.',
        seesTitle: 'What Detour reads',
        sees: ['What your agent picked for you', 'Who made each choice: your agent or you'],
        neverTitle: 'What Detour never does',
        never: ['Never changes your agent on its own', 'Never sells your data', 'Stays out of health, money and documents'],
        cta: 'Connect',
        opening: 'Opening your agent\'s history…',
        reading: 'Looking at {x}…',
        areas: ['food', 'music', 'clothes', 'plans', 'shopping'],
        found: { name: 'Found {n} things your agent did for you, {name}.', none: 'Found {n} things your agent did for you.' },
        done: 'Done. Nothing was changed.',
        next: 'Continue'
      },
      findFriends: {
        title: 'Find your friends',
        sub: 'See what they loved or did themselves.',
        search: 'Search by name or phone number',
        none: 'No one found. Try another name.',
        add: 'Add friend', sent: 'Request sent', friend: 'Friends', invite: 'Invite', invited: 'Invited',
        inviteToast: 'Invite sent.',
        accepted: '{name} accepted your request.',
        skip: 'Skip for now',
        start: 'Start my day'
      },

      today: {
        hello: { name: 'Good {part}, {name}.', none: 'Good {part}.' },
        parts: ['morning', 'afternoon', 'evening'],
        made: 'Choices you made yourself today:',
        setup: 'Make it yours: set up as yourself',
        seeDay: 'See your day',
        seeOptions: 'See 3 other options',
        quietLimit: 'Detour stayed quiet: daily limit reached. Your options are still here.',
        quietHours: 'Detour stayed quiet: quiet hours. Your options are still here.',
        skillYes: 'I\'ll do it myself', skillNo: 'Not now',
        diyEyebrow: 'Today\'s challenge',
        diyIn: 'I\'m in', diyNot: 'Not today',
        diyGoing: 'You\'re on it.', diyGoingSub: 'Tap when you\'re done.', diyDid: 'I did it',
        diyDone: 'Done. You did it yourself.', diyLater: 'No problem. Maybe tomorrow.',
        rememberEyebrow: 'Remember this?',
        rememberYes: 'Nice. Added to this week.', rememberNo: 'Okay. Maybe another time.',
        calmTitle: 'All quiet.', calmSub: 'Your agent\'s got this.',
        calmHint: 'Detour taps you when your agent repeats itself.',
        latest: 'Latest: {x}',
        result: { swap: 'You swapped to: {x}', self: 'You did it yourself: {x}', keep: 'You kept your agent\'s pick.' },
        share: 'Share this',
        change: 'Change'
      },

      banner: {
        now: 'now',
        cont: 'Continue',
        offer: 'See 3 options',
        none: 'Detour: nothing to suggest here.',
        health: 'Detour stays out of health, money and documents.',
        money: 'Detour stays out of health, money and documents.',
        docs: 'Detour stays out of health, money and documents.',
        quietLimit: 'Detour stayed quiet: daily limit reached. Options are in the app.',
        quietHours: 'Detour stayed quiet: quiet hours. Options are in the app.',
        remember: 'Remember this?'
      },

      options: {
        picked: 'Your agent picked: <b>{x}</b>, {note}.',
        swap: 'Swap to this', self: 'I\'ll do it myself', keep: 'Keep my agent\'s pick',
        hint: 'Swipe left for the next one. Swipe right to swap.',
        swapToast: 'Done. Your agent will get this instead.',
        selfToast: 'Nice. This one\'s all yours.',
        keepToast: 'Okay. Your agent\'s pick stays.',
        noPaid: 'No paid suggestions, ever.',
        free: 'Free',
        friendLine: '{name} loved this last week',
        tasteLine: 'You loved this when you were {age}',
        newLine: 'Nobody you know has tried this yet',
        skippedLine: 'You said "not me" at {age}. Maybe now?'
      },

      log: {
        title: 'Your day',
        sub: 'Everything your agent did today, and what you chose.',
        count: 'Detour messages today: {n} of {max}',
        empty: 'Nothing yet. Tap Play beside the phone to start the day.',
        see: 'See options',
        status: {
          offer: 'Detour: 3 other options waiting',
          skill: 'Detour: want to do this yourself?',
          quietLimit: 'Detour stayed quiet: daily limit reached',
          quietHours: 'Detour stayed quiet: quiet hours',
          quiet: 'Detour: nothing to suggest here.',
          stayOut: 'Detour stays out of health, money and documents.',
          swap: 'You swapped to: {x}',
          self: 'You did it yourself: {x}',
          keep: 'You kept your agent\'s pick.',
          went: 'Your agent went ahead.',
          remember: 'Detour: remember this?',
          remembered: 'You said you\'ll do it this week.',
          notnow: 'Not now. That\'s fine.'
        }
      },

      stamps: {
        sheetTitle: 'Spend your stamps',
        sheetSub: 'You have <b data-bal></b> stamps. You earned them by doing things yourself.',
        redeemed: 'Done', already: 'You already have this one.',
        short: 'You need {n} more stamps for this.',
        note: 'No brand vouchers. No ads. Ever.'
      },

      diy: {
        title: 'Do it yourself',
        sub: 'One small challenge a day. Only if you feel like it.',
        eyebrow: 'Today\'s challenge',
        in: 'I\'m in', later: 'Not today', laterToast: 'No problem. Maybe tomorrow.',
        goingEyebrow: 'On it now',
        goingLine: 'A few small steps. Tick them if you like.',
        did: 'I did it', cancel: 'Not today after all', cancelToast: 'That\'s okay. Your agent has it.',
        checkEyebrow: 'Quick check', checkTitle: 'Nice! Let\'s check.', confirm: 'Confirm',
        checkFine: 'Detour only looks at today.',
        doneEyebrow: 'Done', doneTitle: 'You did it yourself!',
        doneLine: 'That\'s one more thing that\'s still yours.',
        stampWords: ['Done', 'by you'],
        earned: '+{n} stamps',
        skippedTitle: 'Skipped today.', skippedLine: 'That\'s fine. A new one comes tomorrow.',
        skillsRow: 'Your skills', stampsRow: 'Your stamps: {n}'
      },

      map: {
        title: 'Taste Map',
        sub: 'What you pick, and what you\'ve never tried.',
        often: 'You pick often', used: 'You used to pick', never: 'Never tried',
        tag: 'never tried', yearLabel: 'Your map in', replay: 'Replay',
        notes: ['Back then, you tried lots of things.', 'Your agent learned your habits. You tried less.', 'Now: a small centre, and three things you\'ve never tried.'],
        hint: 'Tap a dashed circle to get ideas.'
      },
      ideas: {
        title: 'More ideas', sub: 'Things to try, if you feel like it.',
        areaSub: 'You\'ve never tried this. Here are some ideas.',
        self: 'I\'ll do it myself', agent: 'Tell my agent', no: 'Not for me',
        selfState: 'It\'s yours. Have fun.', agentState: 'Sent to your agent. It won\'t change anything else.',
        undo: 'Undo', dismissed: 'Got it. We won\'t show this again.',
        emptyTitle: 'That\'s all for today.', emptyLine: 'New ideas tomorrow.', openMap: 'Back to Taste Map',
        selfToast: 'Nice. This one\'s all yours.', agentToast: 'Sent to your agent.',
        noPaid: 'No paid suggestions, ever.'
      },

      friends: {
        title: 'Friends',
        sunday: 'Sunday: your friends\' week',
        search: 'Search by name or phone number',
        requests: 'Friend requests ({n})',
        sentToYou: 'Sent to you ({n})',
        post: 'New post',
        empty: 'No friends yet. Find someone you know.',
        find: 'Find friends',
        did: 'Did it myself',
        loved: 'Loved this',
        like: 'Like', play: 'Play video', pause: 'Pause video',
        tryIt: 'Try it',
        tried: 'Saved. It will show up as an option this week.',
        suggest: 'People you may know'
      },
      requests: {
        title: 'Friend requests',
        sub: 'People who want to see what you share.',
        accept: 'Accept', ignore: 'Ignore',
        accepted: 'You and {name} are now friends.',
        ignored: 'Request removed.',
        empty: 'No new requests.'
      },
      sent: {
        title: 'Sent to you',
        sub: 'A pick a friend sent you.',
        line: '{name} sent you this.',
        tryIt: 'Try it', not: 'Not now',
        tried: 'Nice. It\'s on your list.', notToast: 'Okay. Maybe another time.',
        empty: 'Nothing new right now.'
      },
      newPost: {
        title: 'New post',
        sub: 'Share something you loved or did yourself.',
        pick: 'Pick from your phone',
        pickHelp: 'Photos and videos stay on this device.',
        gallery: 'Or pick one of these',
        caption: 'Say something about it',
        captionPh: 'For example: Cooked this myself tonight.',
        tag: 'What is it?',
        tagDid: 'I did it myself', tagLoved: 'I loved this',
        need: 'Pick a photo or video first.',
        cta: 'Share with friends',
        posted: 'Shared with your friends.',
        fileNote: 'Photos from your phone disappear when you reload.'
      },
      friend: {
        loved: 'What {name} loved lately',
        both: 'What you both like'
      },

      shareFlow: {
        title: 'Share this?',
        sub: 'Only this card is shared. Never your agent\'s history.',
        style: 'Pick a style', next: 'Share',
        whereTitle: 'Where to?', whereSub: 'Nothing is shared until you pick.'
      },

      recaps: {
        title: 'Your recaps', sub: 'Short looks back at your own choices.',
        heroEyebrow: 'Preview · ready on 31 December', heroTitle: 'Your year: Detour Wrapped 2040',
        heroSub: 'Seven short cards about your year.', open: 'Open',
        monthTitle: 'October recap', monthSub: 'This month · 5 cards',
        oldTitle: 'You, at 18', oldSub: 'From day one · 3 cards'
      },
      thenNow: { eyebrow: 'Then vs now', then: 'You at {age}', now: 'You today' },
      monthly: {
        eyebrow: 'October recap',
        madeLine: 'out of every 100 choices, you made yourself.',
        madeSub: 'Last month it was {last}. In March, it was {start}.',
        swapsEyebrow: 'Other options',
        swapsTitle: 'You swapped {n} of your agent\'s picks this month.',
        firstsEyebrow: 'Firsts', firstsTitle: '{n} firsts this month.',
        endEyebrow: 'That\'s October',
        endTitle: { name: 'Nice month, {name}.', none: 'Nice month.' },
        share: 'Share this', done: 'Done'
      },
      wrapped: {
        eyebrow: 'Detour Wrapped 2040',
        title: 'Your year, in detours.',
        sub: { name: 'Seven cards. All about you, {name}.', none: 'Seven cards. All about you.' },
        agentLine: 'Your agent made <b class="hl" data-c1>0</b> of every 100 choices.',
        youLine: 'You made <b data-c2>0</b>.',
        butLine: 'But by December, you made',
        of100: 'out of every 100 yourself.',
        swapsEyebrow: 'Other options',
        swaps: 'You swapped {n} of your agent\'s picks this year.',
        firstsEyebrow: 'Firsts', firstsTitle: 'firsts.',
        mealsEyebrow: 'Do it yourself', mealsTitle: 'meals, cooked by you.', mealsSub: 'Up from {n} last year.',
        shareEyebrow: 'Share if you like', shareSub: 'You see a preview first. Nothing is shared by default.',
        share: 'Share my year', done: 'Done'
      },

      me: {
        sub: '{city} · grew up in {home}',
        turned: 'Turned 18 in {year}',
        setup: 'Set up as yourself', setupSub: 'Name, hometown and the year you turned 18',
        redo: 'Change your details', redoSub: 'Run the setup again',
        shared: 'Things you shared', sharedSub: { some: '{n} cards', none: 'Nothing yet' },
        recaps: 'Your recaps', recapsSub: 'October, your year, and you at 18',
        notifs: 'Messages from Detour', notifsSub: '{n} a day at most · quiet {from} to {to}',
        skills: 'Skills you\'re keeping',
        friends: 'Find friends', friendsSub: '{n} friends',
        promisesTitle: 'Our promises'
      },
      notifs: {
        title: 'Messages from Detour',
        sub: 'Only when your agent keeps picking the same thing.',
        limit: 'Messages a day, at most', quiet: 'Quiet hours', from: 'From', to: 'Until',
        fine: 'Over the limit, Detour stays quiet. Your options still wait in the app.'
      },
      skillsScreen: {
        title: 'Skills you want to keep',
        sub: 'Detour picked these from your agent\'s history. Change them any time.',
        note: 'We never suggest medicine, health or money choices.',
        tooFew: 'Keep at least one.'
      },
      sharedList: {
        title: 'Things you shared', sub: 'Cards you shared. Only you see this list.',
        empty: 'Nothing shared yet. Look for "Share this" after you do something yourself.'
      },

      sim: {
        title: 'Play a day with Detour',
        play: 'Play', pause: 'Pause', again: 'Play a new day',
        note: 'Detour messages today: {n} of {max}',
        waiting: 'Paused. Your agent just decided something.',
        over: 'That\'s the day. Play a new one any time.',
        run: 'Day {n}'
      },

      screens: { today: 'Today' }
    }
  };
})();
