
export const DJ_BEATS = [
    { id: 'house', name: 'House', icon: '🏠', bpm: 128, pattern: { kick: [0, 4, 8, 12, 16, 20, 24, 28], snare: [4, 12, 20, 28], hihat: [2, 6, 10, 14, 18, 22, 26, 30] } },
    { id: 'hiphop', name: 'Hip Hop', icon: '🎤', bpm: 90, pattern: { kick: [0, 10, 16, 26], snare: [4, 12, 20, 28], hihat: [0, 4, 8, 12, 16, 20, 24, 28] } },
    { id: 'trap', name: 'Trap', icon: '👑', bpm: 140, pattern: { kick: [0, 14, 16, 30], snare: [4, 12, 20, 28], hihat: [0, 2, 4, 5, 6, 8, 10, 12, 13, 14, 16, 18, 20, 21, 22, 24, 26, 28, 29, 30] } },
    { id: 'techno', name: 'Techno', icon: '🤖', bpm: 130, pattern: { kick: [0, 4, 8, 12, 16, 20, 24, 28], snare: [4, 12, 20, 28], hihat: [2, 6, 10, 14, 18, 22, 26, 30] } },
    { id: 'reggaeton', name: 'Reggaeton', icon: '🔥', bpm: 95, pattern: { kick: [0, 6, 16, 22], snare: [4, 10, 12, 20, 26, 28], hihat: [0, 4, 8, 12, 16, 20, 24, 28] } },
    { id: 'dnb', name: 'Drum & Bass', icon: '⚡', bpm: 170, pattern: { kick: [0, 12, 14, 16, 28, 30], snare: [8, 24], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30] } },
    { id: 'lofi', name: 'Lo-Fi', icon: '🌙', bpm: 80, pattern: { kick: [0, 10, 16, 26], snare: [4, 20], hihat: [0, 4, 8, 12, 16, 20, 24, 28] } },
    { id: 'rock', name: 'Rock', icon: '🎸', bpm: 120, pattern: { kick: [0, 8, 16, 24], snare: [4, 12, 20, 28], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30] } },
  ];

  export const DJ_TRACKS = [
    {
      id: 'blinding_lights',
      name: 'Blinding Lights',
      artist: 'The Weeknd Style',
      icon: '🌟',
      bpm: 171,
      genre: 'Synthwave Pop',
      color: 'from-purple-500 to-pink-500',
      pattern: {
        kick: [0, 4, 8, 12, 16, 20, 24, 28], 
        snare: [4, 12, 20, 28], 
        hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], 
        synth: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], 
        bass: [0, 0, 8, 8, 16, 16, 24, 24], 
        keys: [0, 6, 8, 14, 16, 22, 24, 30] 
      }
    },
    {
      id: 'bad_guy',
      name: 'Bad Guy',
      artist: 'Billie Eilish Style',
      icon: '😈',
      bpm: 135,
      genre: 'Dark Pop',
      color: 'from-green-400 to-emerald-600',
      pattern: {
        kick: [0, 3, 8, 11, 16, 19, 24, 27], 
        snare: [6, 14, 22, 30], 
        hihat: [], 
        bass: [0, 3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31], 
        synth: [0, 8, 16, 24], 
        perc: [2, 6, 10, 14, 18, 22, 26, 30] 
      }
    },
    {
      id: 'industry_baby',
      name: 'Industry Baby',
      artist: 'Lil Nas X Style',
      icon: '🏆',
      bpm: 150,
      genre: 'Hip Hop Pop',
      color: 'from-yellow-400 to-orange-500',
      pattern: {
        kick: [0, 6, 8, 12, 16, 22, 24, 28], 
        snare: [4, 12, 20, 28], 
        hihat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], 
        bass: [0, 0, 6, 8, 8, 14, 16, 16, 22, 24, 24, 30], 
        synth: [0, 4, 8, 12, 16, 20, 24, 28], 
        perc: [4, 5, 12, 13, 20, 21, 28, 29] 
      }
    },
    {
      id: 'stay',
      name: 'Stay',
      artist: 'Kid Laroi Style',
      icon: '💖',
      bpm: 170,
      genre: 'Pop/EDM',
      color: 'from-red-400 to-rose-600',
      pattern: {
        kick: [0, 4, 8, 12, 16, 20, 24, 28], 
        snare: [4, 12, 20, 28], 
        hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], 
        synth: [0, 1, 4, 5, 8, 9, 12, 13, 16, 17, 20, 21, 24, 25, 28, 29], 
        bass: [0, 4, 8, 12, 16, 20, 24, 28], 
        keys: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30] 
      }
    },
    {
      id: 'heat_waves',
      name: 'Heat Waves',
      artist: 'Glass Animals Style',
      icon: '🌊',
      bpm: 81,
      genre: 'Indie Pop',
      color: 'from-orange-400 to-amber-600',
      pattern: {
        kick: [0, 6, 8, 14, 16, 22, 24, 30], 
        snare: [8, 24], 
        hihat: [4, 12, 20, 28], 
        synth: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], 
        bass: [0, 3, 8, 11, 16, 19, 24, 27], 
        keys: [0, 8, 16, 24], 
        perc: [2, 6, 10, 14, 18, 22, 26, 30] 
      }
    },
    {
      id: 'levitating',
      name: 'Levitating',
      artist: 'Dua Lipa Style',
      icon: '🚀',
      bpm: 103,
      genre: 'Disco Pop',
      color: 'from-violet-400 to-purple-600',
      pattern: {
        kick: [0, 4, 8, 12, 16, 20, 24, 28], 
        snare: [4, 12, 20, 28], 
        hihat: [2, 6, 10, 14, 18, 22, 26, 30], 
        bass: [0, 3, 4, 6, 8, 11, 12, 14, 16, 19, 20, 22, 24, 27, 28, 30], 
        synth: [0, 4, 8, 12, 16, 20, 24, 28], 
        keys: [2, 6, 10, 14, 18, 22, 26, 30], 
        perc: [0, 4, 8, 12, 16, 20, 24, 28] 
      }
    },
    {
      id: 'peaches',
      name: 'Peaches',
      artist: 'Justin Bieber Style',
      icon: '🍑',
      bpm: 90,
      genre: 'R&B Pop',
      color: 'from-pink-400 to-rose-500',
      pattern: {
        kick: [0, 10, 16, 26], 
        snare: [8, 24], 
        hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
        bass: [0, 4, 8, 10, 16, 20, 24, 26], 
        keys: [0, 3, 6, 8, 11, 14, 16, 19, 22, 24, 27, 30], 
        synth: [0, 8, 16, 24] 
      }
    },
    {
      id: 'montero',
      name: 'Montero',
      artist: 'Lil Nas X Style',
      icon: '🎸',
      bpm: 178,
      genre: 'Pop Trap',
      color: 'from-amber-400 to-red-500',
      pattern: {
        kick: [0, 3, 8, 11, 16, 19, 24, 27], 
        snare: [4, 12, 20, 28], 
        hihat: [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18, 20, 21, 22, 24, 25, 26, 28, 29, 30], 
        bass: [0, 3, 6, 8, 11, 14, 16, 19, 22, 24, 27, 30], 
        synth: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], 
        lead: [0, 8, 16, 24] 
      }
    },
    {
      id: 'save_your_tears',
      name: 'Save Your Tears',
      artist: 'The Weeknd Style',
      icon: '😢',
      bpm: 118,
      genre: 'Synth Pop',
      color: 'from-blue-400 to-indigo-600',
      pattern: {
        kick: [0, 8, 16, 24], 
        snare: [4, 12, 20, 28], 
        hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], 
        synth: [0, 4, 6, 8, 12, 14, 16, 20, 22, 24, 28, 30], 
        bass: [0, 4, 8, 12, 16, 20, 24, 28], 
        keys: [0, 2, 8, 10, 16, 18, 24, 26] 
      }
    },
    {
      id: 'drivers_license',
      name: 'Drivers License',
      artist: 'Olivia Rodrigo Style',
      icon: '🚗',
      bpm: 72,
      genre: 'Sad Pop',
      color: 'from-slate-400 to-gray-600',
      pattern: {
        kick: [0, 16], 
        snare: [8, 24], 
        hihat: [], 
        keys: [0, 2, 4, 8, 10, 12, 16, 18, 20, 24, 26, 28], 
        bass: [0, 8, 16, 24], 
        synth: [0, 4, 8, 12, 16, 20, 24, 28] 
      }
    },
    {
      id: 'as_it_was',
      name: 'As It Was',
      artist: 'Harry Styles Style',
      icon: '🌈',
      bpm: 174,
      genre: 'Synth Pop',
      color: 'from-cyan-400 to-teal-500',
      pattern: {
        kick: [0, 4, 8, 12, 16, 20, 24, 28], 
        snare: [4, 12, 20, 28], 
        hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], 
        synth: [0, 3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31], 
        bass: [0, 4, 8, 12, 16, 20, 24, 28], 
        keys: [0, 8, 12, 16, 24, 28] 
      }
    },
    {
      id: 'watermelon_sugar',
      name: 'Watermelon Sugar',
      artist: 'Harry Styles Style',
      icon: '🍉',
      bpm: 95,
      genre: 'Funk Pop',
      color: 'from-green-400 to-lime-500',
      pattern: {
        kick: [0, 6, 8, 14, 16, 22, 24, 30], 
        snare: [4, 12, 20, 28], 
        hihat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], 
        bass: [0, 3, 6, 8, 11, 14, 16, 19, 22, 24, 27, 30], 
        keys: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], 
        perc: [4, 12, 20, 28] 
      }
    }
  ];

  export const EFFECT_PADS = [
    { id: 'airhorn', name: 'Air Horn', icon: '📣', color: 'from-yellow-400 to-orange-500' },
    { id: 'scratch', name: 'Scratch', icon: '💿', color: 'from-cyan-400 to-blue-500' },
    { id: 'siren', name: 'Siren', icon: '🚨', color: 'from-red-400 to-pink-500' },
    { id: 'laser', name: 'Laser', icon: '⚡', color: 'from-purple-400 to-indigo-500' },
    { id: 'bomb', name: 'Bomb Drop', icon: '💣', color: 'from-gray-600 to-gray-800' },
    { id: 'yeah', name: 'Yeah!', icon: '🎤', color: 'from-green-400 to-emerald-500' },
    { id: 'reverse', name: 'Reverse', icon: '🔁', color: 'from-pink-400 to-rose-500' },
    { id: 'buildup', name: 'Build Up', icon: '🚀', color: 'from-amber-400 to-yellow-500' },
  ];

  export const DJ_TUTORIAL_STEPS = [
    {
      title: "Welcome to DJ Mode! 🎧",
      text: "Let's learn to mix like a pro! First, load a track on DECK A. Tap any track in the TRENDING TRACKS section above!",
      target: "tracks",
      action: "load_left"
    },
    {
      title: "Great Choice! 🎵",
      text: "Now hit the PLAY button to start the beat! The turntable will spin when playing.",
      target: "play",
      action: "play"
    },
    {
      title: "Load Deck B! 💿",
      text: "Real DJs mix between TWO decks! Load a different track on DECK B using the quick beats below the right turntable.",
      target: "deck_right",
      action: "load_right"
    },
    {
      title: "Try the Crossfader! 🎚️ ",
      text: "The CROSSFADER blends between Deck A and Deck B. Slide it left for Deck A, right for Deck B!",
      target: "crossfader",
      action: "crossfader"
    },
    {
      title: "FX Pads! 🎛️ ",
      text: "Tap the FX PADS to trigger sound effects! Try the AIR HORN or SCRATCH - these are classic DJ moves!",
      target: "fx",
      action: "fx"
    },
    {
      title: "Control the BPM! ⚡",
      text: "Use the BPM controls to speed up or slow down the beat. Try to match tempos between decks!",
      target: "bpm",
      action: "bpm"
    },
    {
      title: "Loop It! 🔁",
      text: "Press LOOP on either deck to keep a section repeating. Great for building energy!",
      target: "loop",
      action: "loop"
    },
    {
      title: "You're a DJ Now! 🎉",
      text: "You've learned the basics! Experiment with mixing tracks, effects, and creating your own style. HAVE FUN!",
      target: null,
      action: "complete"
    }
  ];
