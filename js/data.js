/* Detour prototype · all content and on-screen text lives here.
   No fixed persona: the viewer is the user. Personal details come from app state.
   No prices in any suggestion: only distance, time, "Free", "Uses what you have", "Fits your goal".
   Plain global object so the app runs from file:// with no fetch or modules. */
window.DETOUR_DATA = (function () {
  'use strict';

  /* Small builders keep the long lists readable. */
  const opt = (title, line, meta, free) => ({ title: title, line: line, meta: meta, free: !!free });
  /* A dish to cook: uses = [things you have, things it needs], mins = cooking time, goal = fits the protein goal. */
  const dish = (title, line, have, need, mins, goal) => ({ title: title, line: line, cook: true, uses: [have, need], mins: mins, goal: !!goal, free: true });
  const quiet = (id, agent, reason) => ({ id: id, kind: 'quiet', agent: agent, reason: reason || 'none' });

  return {
    today: { date: 'Friday, 26 October 2040', short: '26 Oct 2040', sunday: 'Sunday, 28 October 2040', year: 2040 },

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

    /* What the agent knows is in your kitchen, and your fitness goal. */
    kitchen: ['paneer', 'tomatoes', 'capsicum', 'curd', 'rice', 'eggs', 'onions', 'dal', 'oats', 'bananas', 'bhindi', 'atta', 'peanuts'],
    goal: 'protein',

    /* The three option sources. Same colours everywhere. */
    sources: {
      friend: { label: 'From a friend', icon: 'heart', color: '#4B5BA8', tint: '#E4E7F5' },
      taste: { label: 'From your taste', icon: 'clock', color: '#C9822B', tint: '#F7E9D5' },
      new: { label: 'Something new', icon: 'spark', color: '#1E7A72', tint: '#D9ECE8' }
    },

    /* =========================================================
       Nostalgia: real moments from your teens (about ages 13 to 20).
       kind = tech | game | trend | music | fashion | food (the quiz takes one of each).
       off = years after you turned 18, or year = a fixed year for real events.
       rem/now/cta = a "Remember this?" moment. thenS/nowS = a "You at 19 vs you today" pair.
       taste = what the memory becomes as a "From your taste" option (cat = which agent decisions it fits).
       Generic words only: no brand, app, game, song or artist names.
       ========================================================= */
    eras: [
      { from: 2010, to: 2014, items: [
        { id: 'a1', kind: 'tech', title: 'Playing the snake game on a keypad phone', season: 'Winter', off: -4, art: 'phone', tag: 'snake-game-champion',
          thenS: 'Beat the snake game high score', nowS: 'Your phone does everything for you' },
        { id: 'a2', kind: 'tech', title: 'Sharing songs over Bluetooth in class', season: 'Monsoon', off: -2, art: 'phone', tag: 'Bluetooth-song-sharer',
          taste: Object.assign({ cat: 'music' }, opt('Your Bluetooth-era songs, a throwback mix', 'The songs you passed around in class.', 'Free · 45 min', true)) },
        { id: 'a3', kind: 'game', title: 'The cyber café after school', season: 'Summer', off: -3, art: 'tv', tag: 'cyber-café-regular',
          rem: 'you spent every evening at the cyber café with your friends', now: 'This week, you met no one in person.', cta: 'Meet a friend this week',
          taste: Object.assign({ cat: 'weekend' }, opt('A board game café night with old friends', 'Like the cyber café, but face to face.', '2 km away · 3 hours')) },
        { id: 'a4', kind: 'music', title: 'An MP3 player full of songs you chose yourself', season: 'Summer', off: -1, art: 'radio', tag: 'MP3-player-curator',
          thenS: 'Picked every song yourself', nowS: 'Same 40 songs, picked for you',
          taste: Object.assign({ cat: 'music' }, opt('Build a playlist yourself, song by song', 'Like your old MP3 player. Every song your choice.', 'Free · 20 min', true)) },
        { id: 'a5', kind: 'trend', title: 'Your first social network profile, and the comments on it', season: 'Winter', off: -2, art: 'phone', tag: 'profile-comment-addict' },
        { id: 'a6', kind: 'trend', title: 'The 2011 World Cup final night', season: 'Summer', year: 2011, art: 'tv', tag: 'cricket-with-everyone',
          rem: 'you watched the World Cup final with 20 people around one TV', now: 'Last match, you watched alone.', cta: 'Watch the next match with friends',
          taste: Object.assign({ cat: 'weekend' }, opt('A big-screen match night with friends', 'Twenty people, one TV, like 2011.', 'Free · Sunday 7 pm', true)) },
        { id: 'a7', kind: 'tech', title: 'Your first selfie with a front camera', season: 'Monsoon', off: 0, art: 'camera', tag: 'first-selfie' },
        { id: 'a8', kind: 'food', title: 'Maggi at 2 am in exam week', season: 'Exam season', off: 0, art: 'noodles', tag: 'Maggi-at-2-am',
          taste: Object.assign({ cat: 'food' }, dish('Masala Maggi with veggies, your exam-week way', 'Uses the onions, tomatoes and capsicum you have.', 4, 5, 10, false)) },
        { id: 'a9', kind: 'fashion', title: 'Graphic tees and one favourite pair of jeans', season: 'Summer', off: -1, art: 'shirt', tag: 'one-pair-of-jeans',
          thenS: 'One pair of jeans, worn everywhere', nowS: 'Navy shirt, 4th Monday in a row',
          taste: Object.assign({ cat: 'clothes' }, opt('A plain graphic tee, like your old ones', 'Simple, soft and very you at 17.', 'Delivered tomorrow')) },
        { id: 'a10', kind: 'game', title: 'Cricket in the lane till the streetlights came on', season: 'Summer', off: -5, art: 'park', tag: 'lane-cricket',
          thenS: 'Played outside till dark', nowS: '900 steps today',
          taste: Object.assign({ cat: 'fitness' }, opt('A Sunday cricket match with neighbours', 'Tennis ball, any bat, everyone plays.', 'Free · Sunday 7 am', true)) },
        { id: 'a11', kind: 'music', title: 'Late-night radio song requests', season: 'Monsoon', off: 1, art: 'radio', tag: 'radio-requests',
          rem: 'you called the late-night radio show to request a song', now: 'Now your agent picks every song.', cta: 'Play something old tonight' },
        { id: 'a12', kind: 'food', title: 'Cutting chai at the college canteen', season: 'Monsoon', off: 1, art: 'chai', tag: 'canteen-chai',
          taste: Object.assign({ cat: 'food' }, dish('Masala chai and egg toast, canteen style', 'Uses the eggs, atta and milk you have.', 3, 4, 15, true)) }
      ] },
      { from: 2015, to: 2019, items: [
        { id: 'b1', kind: 'trend', title: 'The year data became almost free. Everyone streamed everything.', season: 'Monsoon', year: 2016, art: 'phone', tag: 'stream-everything',
          taste: Object.assign({ cat: 'shows' }, opt('The comedy series you binged that year', 'Short episodes. Still very funny.', 'Free with your plan', true)) },
        { id: 'b2', kind: 'game', title: 'Chasing digital creatures around the neighbourhood with your phone', season: 'Summer', year: 2016, art: 'park', tag: 'creature-chaser',
          rem: 'you spent a whole summer chasing digital creatures around your colony', now: 'Today, you walked 900 steps.', cta: 'Take a long walk today',
          thenS: 'Walked for hours chasing creatures', nowS: '900 steps today',
          taste: Object.assign({ cat: 'fitness' }, opt('A long evening walk with no plan', 'Like that summer. Just keep walking.', 'Free · 45 min', true)) },
        { id: 'b3', kind: 'game', title: 'The fidget spinner craze', season: 'Summer', year: 2017, art: 'spinner', tag: 'fidget-spinner-pro' },
        { id: 'b4', kind: 'game', title: 'Squad nights in the phone battle game', season: 'Monsoon', year: 2018, art: 'phone', tag: 'squad-nights',
          rem: 'you played battle game squad nights till 3 am', now: 'Your squad hasn\'t met in a year.', cta: 'Plan a squad meet-up',
          taste: Object.assign({ cat: 'weekend' }, opt('A real game night with your old squad', 'Same people. Board games this time.', 'Free · at home', true)) },
        { id: 'b5', kind: 'trend', title: 'The short-video dance trend', season: 'Winter', off: -1, art: 'radio', tag: 'dance-trend-learner',
          taste: Object.assign({ cat: 'fitness' }, opt('A beginner dance class', 'Like the trend, but in a real room.', 'Saturday · 1 hour')) },
        { id: 'b6', kind: 'tech', title: 'Paying the chai stall by scanning a QR code for the first time', season: 'Winter', year: 2017, art: 'chai', tag: 'first-QR-payment' },
        { id: 'b7', kind: 'fashion', title: 'The selfie stick on every trip', season: 'Summer', off: 0, art: 'beach', tag: 'selfie-stick-traveller',
          thenS: 'Planned trips with friends', nowS: 'Same beach town, booked for you',
          taste: Object.assign({ cat: 'weekend' }, opt('A day trip you plan yourself', 'Pick the place. Pick the people.', '2 hours away')) },
        { id: 'b8', kind: 'food', title: 'Maggi at 2 am during exam week', season: 'Exam season', off: 0, art: 'noodles', tag: 'Maggi-at-2-am',
          taste: Object.assign({ cat: 'food' }, dish('Masala Maggi with veggies, your exam-week way', 'Uses the onions, tomatoes and capsicum you have.', 4, 5, 10, false)) },
        { id: 'b9', kind: 'music', title: 'Indie pop on repeat in your earphones', season: 'Monsoon', off: 1, art: 'radio', tag: 'indie-pop-on-repeat',
          thenS: 'Found new songs every week', nowS: 'Same 40 songs',
          taste: Object.assign({ cat: 'music' }, opt('Indie pop, a throwback mix', 'Your earphone songs from that year.', 'Free · 50 min', true)) },
        { id: 'b10', kind: 'trend', title: 'The 2011 World Cup final night', season: 'Summer', year: 2011, art: 'tv', tag: 'cricket-with-everyone',
          taste: Object.assign({ cat: 'weekend' }, opt('A big-screen match night with friends', 'Twenty people, one TV, like 2011.', 'Free · Sunday 7 pm', true)) },
        { id: 'b11', kind: 'fashion', title: 'Ripped jeans and white sneakers', season: 'Winter', off: 1, art: 'shirt', tag: 'white-sneakers',
          taste: Object.assign({ cat: 'clothes' }, opt('Clean white sneakers, like your old pair', 'Simple. Goes with everything.', 'Delivered tomorrow')) },
        { id: 'b12', kind: 'food', title: 'Your mom\'s rajma every Sunday', season: 'Winter', off: 1, art: 'curry', tag: 'Sunday-rajma',
          rem: 'you made your mom\'s rajma every Sunday', now: 'Your agent hasn\'t planned it once.', cta: 'Make it this week',
          thenS: 'Cooked rajma every Sunday', nowS: 'Grilled paneer, 4th time this week',
          taste: Object.assign({ cat: 'food' }, dish('Your mom\'s rajma, the Sunday one', 'You have everything except rajma.', 6, 7, 45, true)) }
      ] },
      { from: 2020, to: 2024, items: [
        { id: 'c1', kind: 'trend', title: 'The lockdown, and online classes on a phone', season: 'Summer', year: 2020, art: 'phone', tag: 'lockdown-classes' },
        { id: 'c2', kind: 'food', title: 'Whipped coffee and lockdown baking', season: 'Summer', year: 2020, art: 'chai', tag: 'whipped-coffee',
          taste: Object.assign({ cat: 'food' }, dish('Whipped coffee and banana toast', 'Uses the bananas and milk you have.', 3, 4, 10, false)) },
        { id: 'c3', kind: 'tech', title: 'Video calls with your grandparents', season: 'Monsoon', year: 2020, art: 'phone', tag: 'grandparent-video-calls',
          rem: 'you video-called your grandparents every evening', now: 'Your agent sends them a weekly update now.', cta: 'Call them yourself today' },
        { id: 'c4', kind: 'fashion', title: 'Oversized hoodies and chunky sneakers', season: 'Winter', off: 0, art: 'shirt', tag: 'oversized-hoodie',
          taste: Object.assign({ cat: 'clothes' }, opt('A thrifted oversized hoodie', 'From the Sunday clothes swap.', 'Free · Sunday morning', true)) },
        { id: 'c5', kind: 'trend', title: 'Reels everywhere, all day', season: 'Monsoon', off: 0, art: 'phone', tag: 'reels-all-day' },
        { id: 'c6', kind: 'tech', title: 'Asking an AI chatbot for homework help for the first time', season: 'Winter', year: 2023, art: 'phone', tag: 'first-AI-homework' },
        { id: 'c7', kind: 'game', title: 'Online ludo with cousins every lockdown night', season: 'Summer', year: 2020, art: 'tv', tag: 'online-ludo',
          rem: 'you played ludo online with your cousins every night', now: 'You haven\'t played anything together since.', cta: 'Start a cousins game night',
          taste: Object.assign({ cat: 'weekend' }, opt('A board game night with cousins', 'Same faces. Real board this time.', 'Free · at home', true)) },
        { id: 'c8', kind: 'music', title: 'Lo-fi beats for studying', season: 'Monsoon', off: -1, art: 'radio', tag: 'lo-fi-study',
          thenS: 'Studied to your own lo-fi mixes', nowS: 'Same 40 songs',
          taste: Object.assign({ cat: 'music' }, opt('Your old lo-fi study mix', 'Calm beats. Good for a slow evening.', 'Free · 1 hour', true)) },
        { id: 'c9', kind: 'food', title: 'Learning Mom\'s dal over a video call', season: 'Monsoon', year: 2020, art: 'curry', tag: 'video-call-dal',
          thenS: 'Cooked Mom\'s dal over video call', nowS: 'Grilled paneer, 4th time this week',
          taste: Object.assign({ cat: 'food' }, dish('Mom\'s dal tadka, from that video call', 'Uses the dal, onions and tomatoes you have.', 6, 6, 30, true)) },
        { id: 'c10', kind: 'trend', title: 'Balcony evenings and clapping for frontline workers', season: 'Summer', year: 2020, art: 'rain', tag: 'balcony-evenings' },
        { id: 'c11', kind: 'game', title: 'Home workouts in your bedroom', season: 'Winter', off: 1, art: 'cycle', tag: 'bedroom-workouts',
          thenS: 'Worked out every day at home', nowS: 'Chest day, 3rd time this week',
          taste: Object.assign({ cat: 'fitness' }, opt('A 20-minute home workout you plan', 'Your old bedroom routine, made yours again.', 'Free · 20 min', true)) }
      ] },
      { from: 2025, to: 2028, items: [
        { id: 'd1', kind: 'tech', title: 'An AI helper for everything', season: 'Monsoon', off: 0, art: 'phone', tag: 'AI-for-everything' },
        { id: 'd2', kind: 'trend', title: 'The film camera comeback', season: 'Winter', off: 0, art: 'camera', tag: 'film-camera',
          rem: 'you shot a whole film roll at your best friend\'s birthday', now: 'Your agent picks your photos now.', cta: 'Take one photo yourself today',
          taste: Object.assign({ cat: 'weekend' }, opt('A photo walk with an old camera', 'Twenty-four shots. No retakes.', 'Free · Saturday morning', true)) },
        { id: 'd3', kind: 'trend', title: 'Weekend run clubs with strangers', season: 'Winter', off: 1, art: 'cycle', tag: 'run-club',
          thenS: 'Ran with strangers every Sunday', nowS: '900 steps today',
          taste: Object.assign({ cat: 'fitness' }, opt('A Sunday run club', 'Easy pace. New people.', 'Free · 6:30 am', true)) },
        { id: 'd4', kind: 'food', title: 'Everything matcha', season: 'Summer', off: 1, art: 'chai', tag: 'everything-matcha',
          taste: Object.assign({ cat: 'food' }, dish('Matcha overnight oats, café-at-home style', 'Uses the oats, curd and bananas you have.', 3, 4, 8, true)) },
        { id: 'd5', kind: 'tech', title: 'Smart rings and sleep scores', season: 'Winter', off: 1, art: 'phone', tag: 'sleep-score-checker' },
        { id: 'd6', kind: 'music', title: 'The retro song everyone rediscovered', season: 'Monsoon', off: -1, art: 'radio', tag: 'retro-song',
          thenS: 'Rediscovered old songs with friends', nowS: 'Same 40 songs',
          taste: Object.assign({ cat: 'music' }, opt('Old songs, a rediscovery mix', 'The retro wave, all over again.', 'Free · 45 min', true)) },
        { id: 'd7', kind: 'fashion', title: 'Bright kurtas with sneakers', season: 'Winter', off: 0, art: 'shirt', tag: 'kurta-and-sneakers',
          taste: Object.assign({ cat: 'clothes' }, opt('A bright block-print kurta', 'Your old favourite look.', 'Delivered tomorrow')) },
        { id: 'd8', kind: 'game', title: 'Retro handheld games, all over again', season: 'Summer', off: -2, art: 'tv', tag: 'retro-handheld' },
        { id: 'd9', kind: 'trend', title: 'The lockdown, and school from home', season: 'Summer', year: 2020, art: 'phone', tag: 'school-from-home',
          rem: 'you spent a whole year of school at home', now: 'You still work from your bed some days.', cta: 'Work from a café today' },
        { id: 'd10', kind: 'food', title: 'Maggi at 2 am in exam week', season: 'Exam season', off: 0, art: 'noodles', tag: 'Maggi-at-2-am',
          thenS: 'Cooked your own 2 am snacks', nowS: 'Oats again, 6th day this week',
          taste: Object.assign({ cat: 'food' }, dish('Masala Maggi with veggies, your exam-week way', 'Uses the onions, tomatoes and capsicum you have.', 4, 5, 10, false)) },
        { id: 'd11', kind: 'game', title: 'Pickleball with friends every weekend', season: 'Summer', off: 1, art: 'park', tag: 'pickleball',
          taste: Object.assign({ cat: 'fitness' }, opt('Pickleball at the park courts', 'Four people, one court, lots of laughing.', 'Free · 7 am', true)) }
      ] }
    ],

    hometowns: {
      Kolkata: [
        { id: 'h-kol1', kind: 'home', title: 'Puchka after tuition', season: 'Winter', off: -1, art: 'street', tag: 'puchka-after-tuition' },
        { id: 'h-kol2', kind: 'home', title: 'Rainy afternoons and fish curry with rice', season: 'Monsoon', off: 0, art: 'curry', tag: 'monsoon-fish-curry',
          taste: Object.assign({ cat: 'food' }, dish('Bengali fish curry and rice, home style', 'You have rice, onions and tomatoes. Add fish.', 4, 6, 40, true)) }
      ],
      Chennai: [
        { id: 'h-che1', kind: 'home', title: 'Filter coffee, then the beach on Sunday evening', season: 'Summer', off: 0, art: 'beach', tag: 'Sunday-beach',
          taste: Object.assign({ cat: 'weekend' }, opt('An evening at the beach', 'Like your Sundays at 18.', 'Free · 5 pm', true)) },
        { id: 'h-che2', kind: 'home', title: 'Curd rice and lemon pickle after school', season: 'Summer', off: -2, art: 'curry', tag: 'curd-rice-kid',
          taste: Object.assign({ cat: 'food' }, dish('Curd rice with a crunchy tadka', 'Uses the curd, rice and peanuts you have.', 3, 3, 15, false)) }
      ],
      Mumbai: [
        { id: 'h-mum1', kind: 'home', title: 'Vada pav after the local train', season: 'Monsoon', off: 0, art: 'street', tag: 'vada-pav-after-the-train' },
        { id: 'h-mum2', kind: 'home', title: 'Monsoon walks by the sea', season: 'Monsoon', off: 1, art: 'beach', tag: 'sea-walks',
          taste: Object.assign({ cat: 'weekend' }, opt('A walk by the sea at sunset', 'Like your monsoon evenings.', 'Free · 6 pm', true)) }
      ],
      Delhi: [
        { id: 'h-del1', kind: 'home', title: 'Winter mornings and chole bhature', season: 'Winter', off: 0, art: 'curry', tag: 'winter-chole-bhature',
          taste: Object.assign({ cat: 'food' }, dish('Chole and atta bhature at home', 'Uses the atta, onions and tomatoes you have. Add chole.', 4, 6, 50, true)) },
        { id: 'h-del2', kind: 'home', title: 'Shopping in the old market lanes', season: 'Winter', off: 1, art: 'market', tag: 'old-market-lanes',
          taste: Object.assign({ cat: 'clothes' }, opt('An old market walk this Saturday', 'Lanes, colours and no list.', 'Free to walk around', true)) }
      ],
      Bengaluru: [
        { id: 'h-blr1', kind: 'home', title: 'Cubbon Park before the city woke up', season: 'Winter', off: 0, art: 'park', tag: 'early-park-walks',
          taste: Object.assign({ cat: 'fitness' }, opt('A Saturday walk in Cubbon Park', 'Before 8 am, like you used to.', 'Free · 1 hour', true)) },
        { id: 'h-blr2', kind: 'home', title: 'Dosa breakfasts at a busy darshini', season: 'Monsoon', off: -1, art: 'street', tag: 'darshini-dosa',
          taste: Object.assign({ cat: 'food' }, dish('Crispy dosa with peanut chutney', 'Uses the rice, dal and peanuts you have.', 3, 4, 25, false)) }
      ],
      Hyderabad: [
        { id: 'h-hyd1', kind: 'home', title: 'Late-night biryani with cousins', season: 'Winter', off: 0, art: 'curry', tag: 'midnight-biryani',
          taste: Object.assign({ cat: 'food' }, dish('Egg dum biryani, cousin-night style', 'Uses the rice, eggs, onions and curd you have.', 5, 6, 50, true)) },
        { id: 'h-hyd2', kind: 'home', title: 'Irani chai and bun maska after school', season: 'Monsoon', off: -1, art: 'chai', tag: 'Irani-chai' }
      ],
      Pune: [
        { id: 'h-pun1', kind: 'home', title: 'Spicy misal pav breakfasts', season: 'Winter', off: 0, art: 'street', tag: 'misal-pav',
          taste: Object.assign({ cat: 'food' }, dish('Spicy misal, the Pune way', 'Uses the onions and tomatoes you have. Add sprouts.', 3, 5, 35, true)) },
        { id: 'h-pun2', kind: 'home', title: 'Monsoon treks to the old fort', season: 'Monsoon', off: 1, art: 'hills', tag: 'monsoon-treks',
          taste: Object.assign({ cat: 'fitness' }, opt('A short monsoon trek', 'Up to the fort and back.', 'Free · 2 hours', true)) }
      ],
      Other: [
        { id: 'h-oth1', kind: 'home', title: 'Sunday markets with your family', season: 'Summer', off: -1, art: 'market', tag: 'Sunday-markets',
          taste: Object.assign({ cat: 'weekend' }, opt('A Sunday morning market', 'Like your family Sundays.', 'Free to walk around', true)) },
        { id: 'h-oth2', kind: 'home', title: 'Street momos after school', season: 'Winter', off: 0, art: 'street', tag: 'after-school-momos',
          taste: Object.assign({ cat: 'food' }, dish('Steamed veg momos at home', 'Uses the atta, capsicum and onions you have.', 4, 5, 40, false)) }
      ]
    },
    quizKinds: ['tech', 'game', 'trend', 'music', 'food', 'fashion'],

    /* "On this day" lines in Your day. {y} = a year from your teens. */
    onThisDay: [
      'On this day in {y}: you cooked for six friends.',
      'On this day in {y}: you walked home in the rain, on purpose.',
      'On this day in {y}: you made your first playlist from scratch.'
    ],
    /* Used when your era pack has fewer than four "then vs now" pairs. */
    thenNowExtra: [
      { thenS: 'Walked everywhere', nowS: 'Cab every day' },
      { thenS: 'Knew every song on the radio', nowS: 'Same 40 songs' },
      { thenS: 'Cooked on Sundays', nowS: 'Grilled paneer, 4th time this week' },
      { thenS: 'Planned trips with friends', nowS: 'Same beach town, booked for you' }
    ],

    /* =========================================================
       The agent's decision pool. Each Play picks one per slot.
       kind: repeat (Detour may offer options), skill (a chance to do it yourself), quiet.
       cook: true = a cooking plan from your kitchen; its options are other dishes to cook.
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
        { id: 'b1', kind: 'repeat', cat: 'food', cook: true, agent: 'Planned breakfast: oats with banana again. Fits your protein goal.', noun: 'breakfast',
          pick: 'Oats with banana', note: '6th day this week', detour: 'Oats again, 6th day this week. 3 other options?',
          fallback: dish('Bread omelette, your hostel way', 'Two eggs, one pan, five minutes.', 4, 4, 10, true),
          news: [dish('Ragi dosa with peanut chutney', 'Light and high in fibre.', 3, 4, 25, true),
                 dish('Besan chilla with curd', 'Crispy, quick and full of protein.', 4, 5, 15, true)] },
        { id: 'b2', kind: 'skill', skill: 'cooking', agent: 'Planned breakfast from what\'s in your fridge',
          ask: 'You have eggs and bread. Make it yourself?', did: 'Made breakfast yourself' } ] },
      { id: 'outfit', time: 485, pool: [
        { id: 'o1', kind: 'repeat', cat: 'clothes', agent: 'Picked the navy shirt again', noun: 'today\'s outfit',
          pick: 'Navy shirt', note: '4th Monday in a row', detour: 'Navy shirt, 4th Monday in a row. 3 other options?',
          fallback: opt('Your blue checked shirt', 'Still in your cupboard. Still a good shirt.', 'Free · already yours', true),
          news: [opt('A mustard linen shirt', 'Bright, light and very not-navy.', 'Delivered by 9 am'),
                 opt('A Kalamkari print shirt', 'Hand-painted style from Andhra.', 'Delivered by 9 am')] },
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
          news: [opt('Trail shoes for weekend hikes', 'Grippy soles. Made for mud.', 'Delivered Saturday'),
                 opt('Barefoot-style walking shoes', 'Light and flat. Like walking on grass.', 'Delivered Saturday')] },
        quiet('sh3', 'Blocked an impulse buy at 11 pm last night.', 'money') ] },
      { id: 'lunch', time: 765, pool: [
        { id: 'l1', kind: 'repeat', cat: 'food', cook: true, agent: 'Planned lunch: dal, rice and bhindi, your usual weekday plate', noun: 'lunch',
          pick: 'Dal, rice and bhindi', note: '4th weekday in a row', detour: 'Same plate, 4th weekday in a row. 3 other options?',
          fallback: dish('Curd rice with a crunchy tadka', 'Cool, simple and very home.', 3, 3, 15, false),
          news: [dish('Rajma and jeera rice', 'High in protein. Very filling.', 5, 6, 40, true),
                 dish('Paneer bhurji with rotis', 'Ready in 20 minutes.', 6, 6, 20, true)] },
        { id: 'l2', kind: 'repeat', cat: 'food', cook: true, agent: 'Planned lunch: curd rice and pickle again', noun: 'lunch',
          pick: 'Curd rice and pickle', note: '5th time this week', detour: 'Curd rice, 5th time this week. 3 other options?',
          fallback: dish('Egg fried rice with leftover rice', 'Uses up yesterday\'s rice.', 5, 5, 15, true),
          news: [dish('Moong dal chilla with mint chutney', 'Light, green and full of protein.', 4, 5, 20, true),
                 dish('Masala oats khichdi', 'One pot. Warm and filling.', 5, 5, 25, true)] } ] },
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
          fallback: opt('Guitar lessons, finally', 'You always said you would.', 'Twice a week · 1 hour'),
          news: [opt('A beginner pottery class', 'Hands busy, mind quiet.', '3 km away · Saturday'),
                 opt('A free photo walk', 'Learn by shooting your own street.', 'Free · Sunday 7 am', true)] } ] },
      { id: 'gym', time: 1095, pool: [
        { id: 'g1', kind: 'repeat', cat: 'music', agent: 'Started the same 40-song gym playlist', noun: 'your gym music',
          pick: 'Gym mix', note: 'the same 40 songs', detour: 'Same 40 songs, 22 times this month. 3 other options?',
          fallback: opt('Your college running mix', 'You ran to these songs for a whole year.', 'Free · 45 min', true),
          news: [opt('A bhangra workout mix', 'Big drums. Hard to stand still.', 'Free · 45 min', true),
                 opt('An upbeat Afro-pop running set', 'Bright, fast and joyful.', 'Free · 40 min', true)] },
        { id: 'g2', kind: 'repeat', cat: 'fitness', agent: 'Picked your usual workout: chest day again', noun: 'your workout',
          pick: 'Chest day', note: '3rd time this week', detour: 'Chest day, 3rd time this week. 3 other options?',
          fallback: opt('Swimming, like in school', 'Forty lengths. No music needed.', '1 km away · 45 min'),
          news: [opt('A slow yoga flow class', 'Your back will thank you.', '1 km away · 7 pm'),
                 opt('Badminton with friends', 'Book a court for four.', '2 km away · 7:30 pm')] } ] },
      { id: 'dinner', time: 1170, pool: [
        { id: 'dn1', kind: 'repeat', cat: 'food', cook: true, agent: 'Planned dinner: grilled paneer and salad. You have paneer, tomatoes, capsicum, curd and rice at home.', noun: 'dinner',
          pick: 'Grilled paneer and salad', note: '4th time this week', detour: 'Grilled paneer, 4th time this week. 3 other options?',
          fallback: dish('Your mom\'s rajma, the Sunday one', 'You have everything except rajma.', 6, 7, 45, true),
          news: [dish('Ragi dosa with peanut chutney', 'Light and high in fibre.', 3, 4, 25, true),
                 dish('Paneer tikka masala with rice', 'Same paneer, a whole new dinner.', 6, 7, 35, true)] },
        { id: 'dn3', kind: 'repeat', cat: 'food', cook: true, agent: 'Planned dinner: egg bhurji and rotis again', noun: 'dinner',
          pick: 'Egg bhurji and rotis', note: '3rd time this week', detour: 'Egg bhurji, 3rd time this week. 3 other options?',
          fallback: dish('Khichdi, your way', 'One pot. Twenty minutes. Very comforting.', 4, 4, 20, true),
          news: [dish('Shakshuka with eggs and capsicum', 'Eggs in a spicy tomato sauce.', 5, 5, 25, true),
                 dish('Dal palak with jeera rice', 'Greens, protein and comfort.', 4, 5, 30, true)] },
        { id: 'dn2', kind: 'skill', skill: 'cooking', agent: 'Planned an easy dinner: last night\'s leftovers',
          ask: 'Cook something fresh tonight? You have dal, rice and onions.', did: 'Cooked dinner yourself' },
        { id: 'dn4', kind: 'repeat', cat: 'order', agent: 'Friday night: ordering from your usual place', noun: 'Friday dinner',
          pick: 'Your usual North Indian place', note: '6th order this month', detour: '6th order from here this month. 3 other options?',
          fallback: opt('A South Indian meals place you loved', 'Banana leaf, unlimited rasam.', '2 km away · 25 min'),
          news: [opt('A Kerala parotta and veg stew place', 'Flaky, soft and full of coconut.', '3 km away · 30 min'),
                 opt('A small Northeast kitchen', 'Bamboo shoot, greens and a fiery chutney.', '4 km away · 35 min')] } ] },
      { id: 'evening', time: 1245, pool: [
        { id: 'ev1', kind: 'repeat', cat: 'shows', agent: 'Queued another crime thriller series', noun: 'tonight\'s show',
          pick: 'Crime thriller', note: 'your 6th this year', detour: 'Your 6th crime thriller this year. 3 other options?',
          fallback: opt('That comedy you loved as a teen', 'Still funny. Still short episodes.', 'Free with your plan', true),
          news: [opt('A Malayalam family comedy', 'Warm, funny and very different.', 'Free with your plan', true),
                 opt('A food documentary from Korea', 'Gentle and beautiful. Makes you hungry.', 'Free with your plan', true)] },
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
                 opt('A pottery café', 'Make a mug. Drink from it later.', '3 km away · 2 hours')] },
        { id: 'we2', kind: 'skill', skill: 'trip', agent: 'Booked the same beach town for the long weekend',
          ask: 'Plan this trip yourself?', did: 'Planned the long weekend yourself' } ] },
      { id: 'worklife', time: 1360, pool: [
        quiet('wl1', 'Checked your leave: 9 days left, 3 expire in December.'),
        quiet('wl2', 'Set a reminder for tomorrow\'s first meeting.') ] }
    ],

    day: { start: 360, end: 1410, waitMins: 20, onThisDayAt: 540 },

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

    /* Do It Yourself: today's challenge is picked from your skills. {dish} = tonight's planned dinner. */
    skills: [
      { id: 'cooking', name: 'Cooking', icon: 'pot', note: 'You cooked most Sundays, years ago.' },
      { id: 'wayfinding', name: 'Finding your way', icon: 'compass', note: 'You used to explore without a map.' },
      { id: 'writing', name: 'Writing your own messages', icon: 'pen', note: 'Your birthday messages used to be long and warm.' },
      { id: 'trip', name: 'Planning trips', icon: 'route', note: 'You planned trips with friends at 19.' }
    ],
    challenges: [
      { id: 'cook', skill: 'cooking', icon: 'pot', title: 'Cook dinner yourself tonight.', line: 'Your agent planned {dish} again. Try your mom\'s rajma instead?',
        steps: ['Soak the rajma for an hour.', 'Fry onions, tomatoes and spices.', 'Pressure-cook it all for 20 minutes.'],
        checks: ['We checked: your agent didn\'t plan dinner.', 'You used the onions and tomatoes at home.'], share: 'Cooked by me. Not by my agent.' },
      { id: 'walk', skill: 'wayfinding', icon: 'compass', title: 'Walk to the market without directions.', line: 'Your agent booked a cab for everything this week.',
        steps: ['Leave the map in your pocket.', 'Ask one person the way.', 'Notice one new shop.'],
        checks: ['We checked: your agent didn\'t plan a route.', 'You walked 2.1 km today.'], share: 'Walked it myself. No map.' },
      { id: 'write', skill: 'writing', icon: 'pen', title: 'Write one message yourself today.', line: 'Your agent wrote your last 30 messages.',
        steps: ['Think of one funny memory.', 'Write three lines. Keep it you.', 'Send it before your agent does.'],
        checks: ['We checked: your agent didn\'t draft this one.'], share: 'Written by me. Not by my agent.' },
      { id: 'plan', skill: 'trip', icon: 'route', title: 'Plan your Saturday yourself.', line: 'Your agent planned the same mall and café again.',
        steps: ['Pick one place you\'ve never been.', 'Ask one friend to come.', 'Book it yourself.'],
        checks: ['We checked: your agent didn\'t plan Saturday.'], share: 'Planned it myself. Not my agent.' }
    ],

    /* =========================================================
       People: about 20 across India. on = on Detour.
       loves = things they loved lately. cook = a dish they cook (for cooking plans).
       ========================================================= */
    people: [
      { id: 'ananya', name: 'Ananya', city: 'Bengaluru', phone: '98451 20311', on: true, color: '#4B5BA8', both: 'You both like spicy food.',
        cook: dish('Ananya\'s Northeast-style egg curry', 'Uses the eggs, onions and tomatoes you have.', 5, 6, 30, true),
        loves: { music: opt('A Kannada indie playlist', 'Twelve songs, mostly guitars.', 'Free · 48 min', true), weekend: opt('A sunrise bike ride by the lake', 'Back before breakfast.', 'Free · 6 am', true), order: opt('A Northeast Indian kitchen', 'Smoky and fresh.', '4 km away · 30 min') },
        post: { art: 'cycle', kind: 'video', tag: 'did', caption: 'Rode to the lake at 6 am. No agent, no plan.', ago: '2h', likes: 24 } },
      { id: 'kabir', name: 'Kabir', city: 'Delhi', phone: '98110 45872', on: true, color: '#1E7A72', both: 'You both like old film songs.',
        cook: dish('Kabir\'s nani-style chole', 'Uses the onions, tomatoes and atta you have.', 4, 6, 50, true),
        loves: { shows: opt('An old Hindi film, restored', 'Black and white, and beautiful.', 'Free with your plan', true), clothes: opt('A bright block-print kurta', 'Loud colours. Very happy.', 'Delivered tomorrow'), learning: opt('A calligraphy class', 'Slow hands, calm mind.', '2 km away · Sunday') },
        post: { art: 'curry', kind: 'photo', tag: 'did', caption: 'Made chole like my nani. Burnt one batch. Worth it.', ago: '5h', likes: 41 } },
      { id: 'meera', name: 'Meera', city: 'Pune', phone: '98220 77140', on: true, color: '#8A6BB8', both: 'You both love long walks.',
        cook: dish('Meera\'s home-made rajma chawal', 'You have everything except rajma.', 6, 7, 45, true),
        loves: { learning: opt('A free sketching meetup', 'Bring a pencil. That\'s all.', 'Free · Saturday 10 am', true), weekend: opt('A slow morning at a flower market', 'Colours, smells and chai.', 'Free', true), fitness: opt('A hill walk at sunrise', 'Slow and steep.', 'Free · 6 am', true) },
        post: { art: 'hills', kind: 'photo', tag: 'loved', caption: 'Monsoon trek to the fort. Muddy shoes, happy heart.', ago: '1d', likes: 57 } },
      { id: 'arjun', name: 'Arjun', city: 'Chennai', phone: '98400 31219', on: true, color: '#C9533A', both: 'You both like trying new food.',
        cook: dish('Arjun\'s Chettinad mushroom curry', 'Uses the onions, tomatoes and curd you have.', 4, 6, 35, false),
        loves: { music: opt('A Carnatic fusion set', 'Old ragas, new beats.', 'Free · 50 min', true), fitness: opt('Beach volleyball at sunrise', 'Sand, sea and shouting.', 'Free · 6 am', true), order: opt('A Chettinad lunch place', 'Spicy and slow-cooked.', '3 km away · 25 min') },
        post: { art: 'beach', kind: 'video', tag: 'loved', caption: 'Sunday evening at the beach. Corn, sea breeze, no phone.', ago: '1d', likes: 33 } },
      { id: 'farhan', name: 'Farhan', city: 'Hyderabad', phone: '98490 66025', on: true, color: '#2F6E9E', both: 'You both love late-night food.',
        cook: dish('Farhan\'s egg keema with pav', 'Uses the eggs, onions and tomatoes you have.', 5, 6, 25, true),
        loves: { shows: opt('A Turkish family drama', 'Long, warm and very dramatic.', 'Free with your plan', true), fitness: opt('A Sunday football kickabout', 'Any level. Just turn up.', 'Free · 7 am', true), order: opt('A tiny Irani café', 'Chai, bun maska, old chairs.', '2 km away · 20 min') },
        post: { art: 'chai', kind: 'photo', tag: 'loved', caption: 'Irani chai at the old café. Some things never change.', ago: '3h', likes: 19 } },
      { id: 'lakshmi', name: 'Lakshmi', city: 'Chennai', phone: '98410 22987', on: true, color: '#B5683A', both: 'You both like cooking slow.',
        cook: dish('Lakshmi\'s Kerala egg roast', 'Uses the eggs and onions you have.', 5, 6, 30, true),
        loves: { clothes: opt('A handloom cotton shirt', 'Soft, light and made by hand.', 'Delivered tomorrow'), learning: opt('A beginner Tamil cooking class', 'Learn three dishes in a morning.', '3 km away · Sunday'), music: opt('A veena evening concert', 'Quiet and lovely.', 'Free · Friday 6 pm', true) },
        post: { art: 'curry', kind: 'photo', tag: 'did', caption: 'First time making bisi bele bath without calling Amma.', ago: '6h', likes: 62 } },
      { id: 'gurpreet', name: 'Gurpreet', city: 'Amritsar', phone: '98140 55120', on: true, color: '#C9822B', both: 'You both like loud music.',
        cook: dish('Gurpreet\'s paneer bhurji paratha', 'Uses the paneer, atta and onions you have.', 5, 5, 25, true),
        loves: { music: opt('A bhangra dance class', 'Big drums, bigger smiles.', '2 km away · Saturday'), fitness: opt('A morning cycling group', 'Twenty km, slow pace.', 'Free · 6 am', true), weekend: opt('A winter food walk', 'Old city lanes, one bite at a time.', 'Free · Saturday evening', true) },
        post: { art: 'market', kind: 'video', tag: 'loved', caption: 'Winter market lights. Ate three jalebis. No regrets.', ago: '2d', likes: 48 } },
      { id: 'tenzin', name: 'Tenzin', city: 'Darjeeling', phone: '98320 10475', on: true, color: '#3E8E6B', both: 'You both like quiet mornings.',
        cook: dish('Tenzin\'s veg thukpa', 'Uses the onions, tomatoes and capsicum you have. Add noodles.', 4, 6, 30, false),
        loves: { weekend: opt('A day hike to a monastery', 'Fog at the bottom, sun at the top.', 'Free · Saturday', true), music: opt('Mountain folk songs, a calm mix', 'Flutes and soft voices.', 'Free · 35 min', true), fitness: opt('A slow morning hike', 'Two hours, lots of views.', 'Free · 6 am', true) },
        post: { art: 'hills', kind: 'video', tag: 'did', caption: 'Walked up to the monastery. The fog lifted at the top.', ago: '4h', likes: 71 } },
      { id: 'joseph', name: 'Joseph', city: 'Kochi', phone: '98470 33612', on: true, color: '#1F6F8B', both: 'You both like the sea.',
        cook: dish('Joseph\'s appam and veg stew', 'Uses the rice and onions you have. Add coconut.', 3, 5, 40, false),
        loves: { shows: opt('A Malayalam thriller everyone loved', 'Twists till the very end.', 'Free with your plan', true), weekend: opt('A backwater kayak trip', 'Calm water, coconut trees.', '2 hours away · Saturday') },
        post: { art: 'beach', kind: 'photo', tag: 'did', caption: 'Kayaked the backwaters myself. Arms hurt. Totally worth it.', ago: '8h', likes: 29 } },
      { id: 'zoya', name: 'Zoya', city: 'Lucknow', phone: '98390 70123', on: true, color: '#A0527A', both: 'You both love old poetry.',
        cook: dish('Zoya\'s tawa paneer kebabs', 'Uses the paneer, curd and onions you have.', 5, 5, 25, true),
        loves: { clothes: opt('A chikankari kurta', 'Soft white threads on cotton.', 'Delivered in 2 days'), learning: opt('An Urdu poetry evening', 'Old words, new friends.', 'Free · Friday 7 pm', true) },
        post: { art: 'books', kind: 'photo', tag: 'loved', caption: 'Poetry night at the old library. I read one of my own.', ago: '1d', likes: 53 } },
      { id: 'aditya', name: 'Aditya', city: 'Mumbai', phone: '98200 88417', on: true, color: '#5B6B2E', both: 'You both like rooftop evenings.',
        cook: dish('Aditya\'s Goan-style egg curry', 'Uses the eggs, onions and tomatoes you have.', 5, 6, 30, true),
        loves: { fitness: opt('A rooftop yoga session', 'Sunrise and stretching.', '1 km away · 7 am'), shows: opt('A stand-up comedy special', 'Ninety minutes of laughing.', 'Free with your plan', true) },
        post: { art: 'rain', kind: 'video', tag: 'loved', caption: 'Mumbai rain from the rooftop. Chai in one hand.', ago: '3h', likes: 38 } },
      { id: 'nandini', name: 'Nandini', city: 'Kolkata', phone: '98300 12658', on: true, color: '#7A4B9E', both: 'You both like Sunday books.',
        cook: dish('Nandini\'s shukto and rice', 'Uses the rice and bhindi you have. Add bitter gourd.', 3, 5, 35, false),
        loves: { music: opt('Rabindra sangeet, a calm mix', 'Gentle songs for a slow evening.', 'Free · 40 min', true), weekend: opt('A book market on Sunday', 'Old books, cheap chai.', 'Free to browse', true) },
        post: { art: 'books', kind: 'photo', tag: 'did', caption: 'Found a 1970s poetry book at the street market.', ago: '9h', likes: 44 } },
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

    gallery: [
      { art: 'curry', kind: 'photo', label: 'Dinner' }, { art: 'chai', kind: 'photo', label: 'Chai' },
      { art: 'cycle', kind: 'video', label: 'Ride' }, { art: 'hills', kind: 'photo', label: 'Hills' },
      { art: 'beach', kind: 'video', label: 'Sea' }, { art: 'books', kind: 'photo', label: 'Books' }
    ],

    /* =========================================================
       Taste Map (labels kept short so they fit inside the bubbles)
       ========================================================= */
    tasteMap: {
      cats: ['food', 'music', 'clothes', 'places'],
      catLabels: { food: 'Food', music: 'Music', clothes: 'Clothes', places: 'Places' },
      slots: [
        { kind: 'often', x: 160, y: 150, r0: 30, r1: 46 }, { kind: 'often', x: 232, y: 104, r0: 24, r1: 36 },
        { kind: 'often', x: 214, y: 226, r0: 22, r1: 32 }, { kind: 'used', x: 92, y: 100, r0: 40, r1: 30 },
        { kind: 'used', x: 96, y: 210, r0: 36, r1: 30 }, { kind: 'used', x: 274, y: 200, r0: 34, r1: 30 },
        { kind: 'unexplored', x: 296, y: 60, r0: 40, r1: 40 }, { kind: 'unexplored', x: 48, y: 260, r0: 38, r1: 38 },
        { kind: 'unexplored', x: 46, y: 46, r0: 40, r1: 40 }
      ],
      labels: {
        food: ['Paneer\nplates', 'Oats', 'Dal\nrice', 'Fish\ncurry', 'Home\nrajma', 'Street\nchaat', 'Northeast', 'Millets', 'Ethiopian'],
        music: ['Lo-fi', 'Chill\npop', 'Gym\nmix', 'Indie\npop', 'Old\nfilms', 'Fusion', 'Kannada\nindie', 'Qawwali', 'Highlife'],
        clothes: ['Grey\ntees', 'Navy\nshirts', 'Plain\nshoes', 'Linen', 'Block\nprints', 'Bright\ncolours', 'Handloom', 'Thrift', 'Workwear'],
        places: ['Home', 'Usual\ncafés', 'Office', 'Parks', 'Café\nhops', 'Book\nshops', 'Old\nmarkets', 'Theatre', 'Lakes']
      }
    },
    ownBars: [
      { label: 'Places', pct: 28 }, { label: 'Food', pct: 15 }, { label: 'Travel', pct: 12 },
      { label: 'Music', pct: 9 }, { label: 'Clothes', pct: 4 }
    ],

    ideas: {
      food: { context: 'Your agent plans the same five dishes.', options: [
        { id: 'f1', area: 'Northeast', source: 'friend', who: 'A friend loved this.', title: 'A Northeast-style egg curry at home', line: 'Smoky, with a fiery chutney.', meta: 'Uses 5 of 6 things you have · 30 min' },
        { id: 'f2', area: 'Ethiopian', source: 'new', who: 'Nobody you know has tried it yet.', title: 'A new Ethiopian café near you', line: 'Big shared plates. You eat with your hands.', meta: '3 km away · 30 min' },
        { id: 'f3', area: 'Millets', source: 'new', who: 'Nothing like your usual.', free: true, title: 'Cook a millet khichdi tonight', line: 'One pot. 25 minutes.', meta: 'Uses what you have · 25 min' } ] },
      music: { context: 'Your last 200 songs came from four playlists.', options: [
        { id: 'm1', area: 'Kannada indie', source: 'friend', who: 'A friend made this.', free: true, title: 'A Kannada indie playlist', line: 'Twelve songs. Mostly guitars and rain.', meta: 'Free · 48 min' },
        { id: 'm2', area: 'Qawwali', source: 'new', who: 'Nobody you know has gone yet.', free: true, title: 'A free qawwali evening in a park', line: 'Saturday at 6 pm. Bring a mat.', meta: 'Free · 2 km away' },
        { id: 'm3', area: 'Highlife', source: 'new', who: 'Nothing like your usual.', free: true, title: 'One West African highlife album', line: 'Bright guitars and horns.', meta: 'Free · 41 min' } ] },
      clothes: { context: 'Your agent bought the same grey tee six times this year.', options: [
        { id: 'c1', area: 'Handloom', source: 'friend', who: 'A friend wears hers every week.', title: 'A handloom ikat shirt', line: 'Sold by the weavers themselves.', meta: 'Delivered in 2 days' },
        { id: 'c2', area: 'Thrift', source: 'new', who: 'Nobody you know has gone yet.', free: true, title: 'A clothes swap this Saturday', line: 'Bring two things. Take two home.', meta: 'Free · Saturday 10 am' },
        { id: 'c3', area: 'Workwear', source: 'new', who: 'Nothing like your usual.', title: 'A strong canvas work jacket', line: 'The opposite of a grey tee.', meta: 'Delivered tomorrow' } ] },
      places: { context: 'Most weekends since June looked the same.', options: [
        { id: 'pl1', area: 'Lakes', source: 'friend', who: 'A friend rides here every Sunday.', free: true, title: 'A sunrise bike ride by a lake', line: 'Rent a bike at the gate.', meta: 'Free · 6 am start' },
        { id: 'pl2', area: 'Theatre', source: 'new', who: 'Nobody you know has gone yet.', title: 'A comedy play this Friday', line: 'Small hall. Very loud crowd.', meta: '4 km away · Friday 7 pm' },
        { id: 'pl3', area: 'Old markets', source: 'new', who: 'Nothing like your usual.', free: true, title: 'A slow morning at an old market', line: 'Flowers at 6 am. Coffee at 7.', meta: 'Free to walk around' } ] }
    },

    redeem: [
      { id: 'plus', icon: 'star', title: 'One free month of Plus', desc: 'More Wrapped cards and a longer Taste Map.', cost: 120, toast: 'Done. One free month of Plus.' },
      { id: 'cards', icon: 'spark', title: 'Two extra Wrapped cards', desc: '"Best Sunday" and "Biggest surprise".', cost: 60, toast: 'Two extra cards added to your Wrapped.' },
      { id: 'family', icon: 'people', title: 'One free month for family', desc: 'For someone you add to your plan.', cost: 100, toast: 'Saved for later.' },
      { id: 'donate', icon: 'heart', title: 'Give to a good cause', desc: '50 stamps feed someone at a community kitchen.', cost: 50, toast: 'Donated. Thank you.' }
    ],

    monthly: { firsts: [
      { icon: 'bowl', t: 'Your first ragi dosa' },
      { icon: 'music', t: 'Your first bhangra workout' },
      { icon: 'heart', t: 'Your mom\'s rajma, back after 4 years' } ] },
    wrapped: { firsts: [
      'Ragi dosa', 'Bhangra workout', 'Heritage walk', 'Sunrise bike ride', 'Kerala egg roast', 'Pottery class',
      'Kalamkari shirt', 'A trip you planned', 'Veg thukpa', 'Malayalam comedy', 'Book market Sunday', 'A letter you wrote' ] },

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
        cooked: 'Cooked by me. Not by my agent.',
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
        sub: 'Real moments from your teens.',
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
        diyLabel: 'Today\'s challenge',
        diyIn: 'I\'m in', diyNot: 'Not today',
        diyGoing: 'You\'re on it.', diyGoingSub: 'Tap when you\'re done.', diyDid: 'I did it',
        diyDone: 'Done. You did it yourself.', diyLater: 'No problem. Maybe tomorrow.',
        reward: '+{n} stamps',
        usualDish: 'the usual',
        rememberEyebrow: 'Remember this?',
        rememberIn: 'In {y}, {x}.',
        rememberYes: 'Nice. Added to this week.', rememberNo: 'Okay. Maybe another time.',
        calmTitle: 'All quiet.', calmSub: 'Your agent\'s got this.',
        calmHint: 'Detour taps you when your agent repeats itself.',
        latest: 'Latest: {x}',
        result: { swap: 'You chose: {x}', self: 'You did it yourself: {x}', keep: 'You kept your agent\'s pick.' },
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
        doThis: 'Do this', reject: 'Reject', keep: 'Keep my agent\'s pick',
        hint: 'Swipe to see the others.',
        compare: 'Compare all', backToCards: 'Back to cards',
        prev: 'Previous option', next: 'Next option', dot: 'Option {n}',
        left: '{n} left',
        cookToast: 'Nice. You\'re cooking this one. +{n} stamps.',
        swapToast: 'Done. Your agent will do this instead.',
        rejectToast: 'Got it. Not this one.',
        allRejected: 'No worries. Your agent\'s pick stays.',
        keepToast: 'Okay. Your agent\'s pick stays.',
        noPaid: 'No paid suggestions, ever.',
        free: 'Free',
        uses: 'Uses {a} of {b} things in your kitchen',
        mins: '{n} min',
        goal: 'Fits your protein goal',
        friendLine: '{name} loved this last week',
        friendCook: '{name} cooks this a lot',
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
          swap: 'You chose: {x}',
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
        tag: 'new', yearLabel: 'Your map in', replay: 'Replay',
        notes: ['Back then, you tried lots of things.', 'Your agent learned your habits. You tried less.', 'Now: a small centre, and three new things to try.'],
        hint: 'Tap a dashed circle to get ideas.',
        barsTitle: 'Choices you made yourself',
        barsSub: 'This month, by type'
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
        play: 'Play video', pause: 'Pause video'
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
      friend: { loved: 'What {name} loved lately', both: 'What you both like' },

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
        swapsTitle: 'You chose {n} other options this month.',
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
        swaps: 'You chose {n} other options this year.',
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
      }
    }
  };
})();
