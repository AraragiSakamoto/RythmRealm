import React from 'react';

export const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: '🎵 Welcome to GrooveLab!',
    content: "Let's learn how to make music! This tutorial will guide you through the basics of creating your first beat.",
    target: null,
    position: 'center',
    action: 'next',
  },
  {
    id: 'grid-intro',
    title: '🎹 The Beat Grid',
    content: "This is your beat grid! Each row is a different instrument (Kick, Snare, HiHat, etc). Each column is a point in time. Click any cell to add a sound!",
    target: 'grid',
    position: 'top',
    action: 'next',
  },
  {
    id: 'click-cell',
    title: '👠 Try Clicking a Cell!',
    content: "Click on any empty cell in the grid to add a beat. The cell will light up and you'll hear the sound!",
    target: 'grid',
    position: 'top',
    action: 'click-grid',
    highlight: 'grid',
  },
  {
    id: 'play-button',
    title: '▶️ Play Your Beat',
    content: "Press the PLAY button (or hit SPACEBAR) to hear your creation! The playhead will move across the grid showing which sounds play.",
    target: 'play-button',
    position: 'top',
    action: 'next',
    highlight: 'play-button',
  },
  {
    id: 'tempo',
    title: '⏱️ Tempo Control',
    content: "Use the tempo controls to speed up or slow down your beat. BPM means 'Beats Per Minute' - higher = faster!",
    target: 'tempo',
    position: 'top',
    action: 'next',
    highlight: 'tempo',
  },
  {
    id: 'add-instrument',
    title: '➕ Adding Instruments',
    content: "Click the + button at the bottom of the instrument list to add new instruments like Tom, FX, Keys, or Synth!",
    target: 'add-track',
    position: 'right',
    action: 'next',
    highlight: 'add-track',
  },
  {
    id: 'sound-variant',
    title: '🎛️ Change Instrument Sounds',
    content: "Click on an instrument's icon (the colored circle) to cycle through different sound variations. Each instrument has 4 unique sounds!",
    target: 'instrument-icon',
    position: 'right',
    action: 'next',
    highlight: 'instrument-icon',
  },
  {
    id: 'soundlab-intro',
    title: '🔬 The Sound Lab',
    content: "Click the 🔬 button next to any instrument to open the SOUND LAB. Here you can customize volume, pitch, effects, and more!",
    target: 'soundlab-button',
    position: 'right',
    action: 'next',
    highlight: 'soundlab-button',
  },
  {
    id: 'soundlab-features',
    title: '🎚️  Sound Lab Features',
    content: "In Sound Lab you can adjust: Volume 🔊, Pitch 🎹, Attack ⚡, Decay 📰, Filter 🌊, Reverb 🏺️ , Distortion 🔥, Pan ↔️ , and Bend 〰️ ",
    target: null,
    position: 'center',
    action: 'next',
  },
  {
    id: 'complete',
    title: '🎉 You\'re Ready!',
    content: "You now know the basics! Experiment with different patterns, try the genre tutorials, or just have fun creating your own beats!",
    target: null,
    position: 'center',
    action: 'finish',
  },
];

// ==========================================
// 4. DATA CONSTANTS
// ==========================================
export const STEPS = 32;

export const INSTRUMENTS_DATA = [
  { id: 'kick', name: 'Kick', color: 'bg-red-400', shadow: 'shadow-red-400/50' },
  { id: 'snare', name: 'Snare', color: 'bg-yellow-400', shadow: 'shadow-yellow-400/50' },
  { id: 'hihat', name: 'HiHat', color: 'bg-cyan-400', shadow: 'shadow-cyan-400/50' },
  { id: 'bass', name: 'Bass', color: 'bg-purple-400', shadow: 'shadow-purple-400/50' },
  { id: 'synth', name: 'Synth', color: 'bg-pink-400', shadow: 'shadow-pink-400/50' },
  { id: 'tom', name: 'Tom', color: 'bg-indigo-400', shadow: 'shadow-indigo-400/50' },
  { id: 'perc', name: 'Percussion', color: 'bg-orange-400', shadow: 'shadow-orange-400/50' },
  { id: 'fx', name: 'FX', color: 'bg-slate-400', shadow: 'shadow-slate-400/50' },
  { id: 'keys', name: 'Keys', color: 'bg-teal-400', shadow: 'shadow-teal-400/50' },
  { id: 'vox', name: 'Vox', color: 'bg-fuchsia-400', shadow: 'shadow-fuchsia-400/50' },
  { id: 'lead', name: 'Lead', color: 'bg-blue-500', shadow: 'shadow-blue-500/50' },
  { id: 'orch', name: 'Orch', color: 'bg-amber-600', shadow: 'shadow-amber-600/50' },
];

export const SOUND_VARIANTS = {
  kick: [
    { name: '808 Boom', icon: '💥', type: 'kick808', freq: 55, duration: 0.8, decay: 0.5 },
    { name: 'Punchy', icon: '👐', type: 'kickPunch', freq: 150, duration: 0.3, decay: 0.2 },
    { name: 'Sub Drop', icon: '🌊', type: 'kickSub', freq: 40, duration: 1.0, decay: 0.8 },
    { name: 'Acoustic', icon: '🥁 ', type: 'kickAcoustic', freq: 80, duration: 0.4, decay: 0.3 }
  ],
  snare: [
    { name: 'Crack', icon: '⚡', type: 'snareCrack', freq: 200, duration: 0.2, noise: 0.8 },
    { name: 'Clap', icon: '👏', type: 'clap', freq: 300, duration: 0.15, noise: 0.9 },
    { name: 'Rim', icon: '🔔', type: 'rim', freq: 800, duration: 0.05, noise: 0.3 },
    { name: 'Trap', icon: '🔥', type: 'snareTrap', freq: 180, duration: 0.3, noise: 0.7 }
  ],
  hihat: [
    { name: 'Closed', icon: '🎩', type: 'hihatClosed', freq: 8000, duration: 0.05, noise: 1.0 },
    { name: 'Open', icon: '🌟', type: 'hihatOpen', freq: 6000, duration: 0.3, noise: 0.9 },
    { name: 'Pedal', icon: '👘', type: 'hihatPedal', freq: 4000, duration: 0.1, noise: 0.7 },
    { name: 'Shaker', icon: '🧂', type: 'shaker', freq: 10000, duration: 0.08, noise: 1.0 }
  ],
  tom: [
    { name: 'Floor', icon: '🏛¢️ ', type: 'tomLow', freq: 80, duration: 0.5, decay: 0.4 },
    { name: 'Mid', icon: '🥁 ', type: 'tomMid', freq: 150, duration: 0.4, decay: 0.3 },
    { name: 'High', icon: '🎯', type: 'tomHigh', freq: 250, duration: 0.3, decay: 0.2 },
    { name: 'Taiko', icon: '🏯', type: 'taiko', freq: 60, duration: 0.8, decay: 0.6 }
  ],
  perc: [
    { name: 'Conga', icon: '🪘', type: 'conga', freq: 200, duration: 0.3, decay: 0.2 },
    { name: 'Bongo', icon: '🥁 ', type: 'bongo', freq: 350, duration: 0.15, decay: 0.1 },
    { name: 'Cowbell', icon: '🔔', type: 'cowbell', freq: 800, duration: 0.2, decay: 0.15 },
    { name: 'Woodblock', icon: '🪵', type: 'woodblock', freq: 1200, duration: 0.05, decay: 0.03 }
  ],
  bass: [
    { name: 'Sub Bass', icon: '🔊', type: 'bassSub', freq: 55, duration: 0.5, decay: 0.4 },
    { name: 'Synth', icon: '🎹', type: 'bassSynth', freq: 82, duration: 0.3, decay: 0.25 },
    { name: 'Pluck', icon: '🎸', type: 'bassPluck', freq: 110, duration: 0.2, decay: 0.15 },
    { name: 'Wobble', icon: '🌀', type: 'bassWobble', freq: 65, duration: 0.6, decay: 0.5 }
  ],
  synth: [
    { name: 'Pad', icon: '🎶', type: 'synthPad', freq: 440, duration: 1.0, decay: 0.8 },
    { name: 'Pluck', icon: '✨', type: 'synthPluck', freq: 523, duration: 0.2, decay: 0.15 },
    { name: 'Stab', icon: 'âš”️ ', type: 'synthStab', freq: 392, duration: 0.15, decay: 0.1 },
    { name: 'Arp', icon: '🌈', type: 'synthArp', freq: 659, duration: 0.1, decay: 0.08 }
  ],
  fx: [
    { name: 'Riser', icon: '🚀', type: 'fxRiser', freq: 200, duration: 1.5, decay: 1.2 },
    { name: 'Impact', icon: '💫', type: 'fxImpact', freq: 100, duration: 0.8, decay: 0.6 },
    { name: 'Laser', icon: '🔫', type: 'fxLaser', freq: 1500, duration: 0.3, decay: 0.2 },
    { name: 'Zap', icon: '⚡', type: 'fxZap', freq: 800, duration: 0.15, decay: 0.1 }
  ],
  keys: [
    { name: 'Piano', icon: '🎹', type: 'keysPiano', freq: 523, duration: 0.8, decay: 0.6 },
    { name: 'Rhodes', icon: '🌙', type: 'keysRhodes', freq: 440, duration: 1.0, decay: 0.8 },
    { name: 'Organ', icon: 'â›ª', type: 'keysOrgan', freq: 392, duration: 0.5, decay: 0.4 },
    { name: 'Bells', icon: '🔔', type: 'keysBells', freq: 880, duration: 1.2, decay: 1.0 }
  ],
  vox: [
    { name: 'Ooh', icon: '😮', type: 'voxOoh', freq: 400, duration: 0.5, decay: 0.4 },
    { name: 'Aah', icon: '😲', type: 'voxAah', freq: 500, duration: 0.6, decay: 0.5 },
    { name: 'Hey', icon: '🗣️ ', type: 'voxHey', freq: 350, duration: 0.2, decay: 0.15 },
    { name: 'Choir', icon: '👼', type: 'voxChoir', freq: 440, duration: 1.0, decay: 0.8 }
  ],
  lead: [
    { name: 'Saw', icon: '🪚', type: 'leadSaw', freq: 659, duration: 0.4, decay: 0.3 },
    { name: 'Square', icon: 'â¬œ', type: 'leadSquare', freq: 523, duration: 0.35, decay: 0.25 },
    { name: 'Pluck', icon: '🎻', type: 'leadPluck', freq: 784, duration: 0.15, decay: 0.1 },
    { name: 'Screech', icon: '🦅', type: 'leadScreech', freq: 1046, duration: 0.5, decay: 0.4 }
  ],
  orch: [
    { name: 'Strings', icon: '🎻', type: 'orchStrings', freq: 294, duration: 1.0, decay: 0.8 },
    { name: 'Brass', icon: '🎺', type: 'orchBrass', freq: 349, duration: 0.4, decay: 0.3 },
    { name: 'Timpani', icon: '🥁 ', type: 'orchTimpani', freq: 73, duration: 0.8, decay: 0.6 },
    { name: 'Harp', icon: '🪕', type: 'orchHarp', freq: 523, duration: 0.6, decay: 0.5 }
  ]
};

export const BEAT_GUIDES = [
  {
    name: "Rock n Roll 🎸",
    desc: "Classic rock beat - Kick on 1 & 3, Snare on 2 & 4",
    pattern: { kick: [0, 8, 16, 24], snare: [4, 12, 20, 28], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 8, 16, 24] }
  },
  {
    name: "Hip Hop 🧢",
    desc: "Boom bap with swing and groove",
    pattern: { kick: [0, 7, 10, 16, 23, 26], snare: [4, 12, 20, 28], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 7, 16, 23] }
  },
  {
    name: "House 💿",
    desc: "Four on the floor - classic club beat",
    pattern: { kick: [0, 4, 8, 12, 16, 20, 24, 28], snare: [4, 12, 20, 28], hihat: [2, 6, 10, 14, 18, 22, 26, 30], bass: [0, 6, 8, 14, 16, 22, 24, 30] }
  },
  {
    name: "Trap 🔥",
    desc: "Hard-hitting 808s with rapid hi-hats",
    pattern: { kick: [0, 6, 14, 16, 22, 30], snare: [4, 12, 20, 28], hihat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], bass: [0, 6, 14, 16, 22, 30] }
  },
  {
    name: "Reggaeton 🌴",
    desc: "Dembow rhythm - infectious Latin groove",
    pattern: { kick: [0, 6, 8, 14, 16, 22, 24, 30], snare: [3, 7, 11, 15, 19, 23, 27, 31], hihat: [0, 4, 8, 12, 16, 20, 24, 28], perc: [2, 6, 10, 14, 18, 22, 26, 30] }
  },
  {
    name: "Drum & Bass 🚀",
    desc: "Fast breakbeat with rolling bass",
    pattern: { kick: [0, 10, 16, 26], snare: [4, 12, 14, 20, 28, 30], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 3, 6, 10, 16, 19, 22, 26] }
  },
  {
    name: "Disco Funk 🚺",
    desc: "Groovy funk beat with offbeat bass",
    pattern: { kick: [0, 4, 8, 12, 16, 20, 24, 28], snare: [4, 12, 20, 28], hihat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], bass: [2, 6, 10, 14, 18, 22, 26, 30] }
  },
  {
    name: "Lo-Fi Chill 🌙",
    desc: "Relaxed beat for studying",
    pattern: { kick: [0, 10, 16, 26], snare: [4, 20], hihat: [0, 4, 8, 12, 16, 20, 24, 28], keys: [0, 8, 16, 24] }
  },
  {
    name: "Afrobeat 🌍",
    desc: "West African polyrhythmic groove",
    pattern: { kick: [0, 6, 10, 16, 22, 26], snare: [4, 12, 20, 28], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], perc: [0, 3, 6, 9, 12, 16, 19, 22, 25, 28] }
  },
  {
    name: "Techno 🤖",
    desc: "Hypnotic industrial rhythm",
    pattern: { kick: [0, 4, 8, 12, 16, 20, 24, 28], snare: [8, 24], hihat: [2, 6, 10, 14, 18, 22, 26, 30], synth: [0, 8, 16, 24] }
  },
  {
    name: "Bossa Nova 🏓️ ",
    desc: "Brazilian jazz rhythm",
    pattern: { kick: [0, 10, 16, 26], snare: [6, 14, 22, 30], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 6, 10, 16, 22, 26] }
  },
  {
    name: "Dubstep 🔊",
    desc: "Heavy drops with wobble bass",
    pattern: { kick: [0, 14, 16, 30], snare: [8, 24], hihat: [0, 4, 8, 12, 16, 20, 24, 28], bass: [0, 2, 4, 6, 14, 16, 18, 20, 22, 30] }
  }
];

export const DEFAULT_SCENARIO = {
  id: -1, name: "Free Play 🎨", bpm: 100, desc: "Create anything you want!", locked: false, theme: "from-violet-500 to-fuchsia-500", bgClass: "bg-gradient-to-br from-violet-900 to-fuchsia-900", ambience: "studio",
  renderScene: (pulse, accuracy) => (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 rounded-b-3xl">
      {/* Animated gradient orbs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-500/40 to-purple-500/40 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-yellow-400/50 to-orange-500/50 rounded-full blur-xl" style={{ transform: `translate(-50%, -50%) scale(${1 + pulse * 0.3})` }}></div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute w-full h-px bg-white" style={{ top: `${(i + 1) * 12.5}%` }}></div>
        ))}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute h-full w-px bg-white" style={{ left: `${(i + 1) * 12.5}%` }}></div>
        ))}
      </div>

      {/* Floating music notes */}
      <div className="absolute top-1/4 left-1/4 text-4xl opacity-60" style={{ transform: `translateY(${Math.sin(Date.now() / 500) * 10}px)` }}>🎵</div>
      <div className="absolute top-1/3 right-1/4 text-3xl opacity-50" style={{ transform: `translateY(${Math.sin(Date.now() / 600 + 1) * 8}px)` }}>🎶</div>
      <div className="absolute bottom-1/4 left-1/3 text-3xl opacity-40" style={{ transform: `translateY(${Math.sin(Date.now() / 700 + 2) * 12}px)` }}>🎵</div>

      {/* Center beat visualizer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-end gap-1">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="w-3 bg-gradient-to-t from-pink-500 to-cyan-400 rounded-full transition-all duration-75"
            style={{
              height: `${20 + pulse * 40 + Math.sin(Date.now() / 200 + i) * 15}px`,
              opacity: 0.7 + pulse * 0.3
            }}
          ></div>
        ))}
      </div>

      {/* FREE PLAY text */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 font-black text-lg tracking-widest">FREE PLAY</div>
    </div>
  )
};

export const SCENARIOS = [
  {
    id: 0, name: "Sunny Vibes ☀️", bpm: 112, desc: "Bright, happy, and uplifting atmosphere", locked: false, theme: "from-yellow-400 to-orange-400", bgClass: "bg-sky-200", ambience: "beach",
    tutorial: [
      { text: "Welcome! 🎉 Let's make a HAPPY beat! The KICK drum is the heartbeat - add kicks on beats 1, 3, 5, 7 plus a funky pickup!", targetInstrument: 'kick', targetSteps: [0, 8, 14, 16, 24, 30], soundVariant: 1 },
      { text: "Awesome! 👏 SNARE/CLAP on the backbeat (2, 4, 6, 8) - this groove makes everyone dance!", targetInstrument: 'snare', targetSteps: [4, 12, 20, 28], soundVariant: 1 },
      { text: "🎵 HI-HATS create the groove! 8th notes with an open hat accent for brightness!", targetInstrument: 'hihat', targetSteps: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], soundVariant: 0 },
      { text: "🎸 BASS adds the groove! Syncopated pattern that locks with the kick!", targetInstrument: 'bass', targetSteps: [0, 6, 8, 14, 16, 22, 24, 30], soundVariant: 1 },
      { text: "✨ SYNTH adds chord stabs! Off-beat hits create that pop bounce!", targetInstrument: 'synth', targetSteps: [2, 6, 10, 18, 22, 26], soundVariant: 1 },
      { text: "🪘 PERCUSSION with shaker fills the gaps! Creates continuous movement!", targetInstrument: 'perc', targetSteps: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31], soundVariant: 1 },
      { text: "🌟 PERFECT! You made a full POP beat with 6 instruments! Hit PLAY! ☀️", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 8, 14, 16, 24, 30], snare: [4, 12, 20, 28], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 6, 8, 14, 16, 22, 24, 30], synth: [2, 6, 10, 18, 22, 26], perc: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-sky-400 to-sky-200 rounded-b-3xl">
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-green-400 to-green-300 rounded-t-[50%]"></div>
        <div className="absolute top-8 right-12 w-20 h-20 bg-yellow-300 rounded-full shadow-[0_0_60px_rgba(253,224,71,0.8)]" style={{ transform: `scale(${1 + pulse * 0.1})` }}></div>
        <div className="absolute top-16 left-16 w-28 h-10 bg-white/70 rounded-full blur-md"></div>
        <div className="absolute top-24 left-32 w-20 h-8 bg-white/50 rounded-full blur-md"></div>
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-5xl" style={{ transform: `translateX(-50%) scale(${1 + pulse * 0.2})` }}>🎵</div>
      </div>
    )
  },
  {
    id: 1, name: "Chill Night 🌙", bpm: 75, desc: "Relaxed, lo-fi, late night mood", locked: false, theme: "from-slate-600 to-indigo-800", bgClass: "bg-slate-900", ambience: "rain",
    tutorial: [
      { text: "🌙 Lo-Fi Tutorial! SLOWER tempo (75 BPM) with a SWUNG feel. Kicks on 1 and the 'and' of 2!", targetInstrument: 'kick', targetSteps: [0, 5, 16, 21], soundVariant: 2 },
      { text: "Lo-Fi snares are LAZY 👤 Ghost notes make it human! Main hits on 2 & 6 with soft flams!", targetInstrument: 'snare', targetSteps: [4, 7, 20, 23], soundVariant: 2 },
      { text: "Gentle hi-hats 🍿 Swung 8ths with ghost notes create that dusty vinyl feel!", targetInstrument: 'hihat', targetSteps: [0, 3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31], soundVariant: 2 },
      { text: "🎹 RHODES KEYS are the soul! 7th chords on 1 and 5 with passing tones!", targetInstrument: 'keys', targetSteps: [0, 6, 16, 22], soundVariant: 1 },
      { text: "🎸 Mellow BASS walks through chord tones - jazzy and warm!", targetInstrument: 'bass', targetSteps: [0, 5, 8, 12, 16, 21, 24, 28], soundVariant: 2 },
      { text: "✨ SYNTH PAD breathes in and out - long sustained atmosphere!", targetInstrument: 'synth', targetSteps: [0, 16], soundVariant: 0 },
      { text: "🌙 Beautiful! 6 layers of chill! The magic is in the SPACE between notes. PLAY! 🎧", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 5, 16, 21], snare: [4, 7, 20, 23], hihat: [0, 3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31], keys: [0, 6, 16, 22], bass: [0, 5, 8, 12, 16, 21, 24, 28], synth: [0, 16] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-indigo-900 to-slate-900 rounded-b-3xl">
        <div className="absolute top-8 right-16 w-16 h-16 bg-slate-200 rounded-full opacity-90 shadow-[0_0_40px_rgba(255,255,255,0.3)]"></div>
        {[...Array(30)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white rounded-full opacity-60" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%` }}></div>
        ))}
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute w-0.5 bg-blue-400/40 animate-rain" style={{ height: `${Math.random() * 20 + 10}%`, left: `${Math.random() * 100}%`, top: `-10%`, animationDuration: `${Math.random() * 0.8 + 0.4}s`, animationDelay: `${Math.random() * 2}s` }}></div>
        ))}
        <div className="absolute bottom-0 w-full h-16 bg-slate-800/80"></div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-4xl" style={{ transform: `translateX(-50%) translateY(${pulse * -5}px)` }}>🎧</div>
      </div>
    )
  },
  {
    id: 2, name: "Neon City 🌠", bpm: 126, desc: "Electronic, urban, energetic beats", locked: false, theme: "from-pink-500 to-purple-600", bgClass: "bg-purple-950", ambience: "city",
    tutorial: [
      { text: "🏠 HOUSE MUSIC! Four-on-the-floor with a tasteful ghost kick for groove!", targetInstrument: 'kick', targetSteps: [0, 4, 8, 11, 12, 16, 20, 24, 27, 28], soundVariant: 1 },
      { text: "👏 Clap on 2 and 4 with a pickup clap! Classic house with extra bounce!", targetInstrument: 'snare', targetSteps: [4, 12, 15, 20, 28, 31], soundVariant: 1 },
      { text: "🎩 OFFBEAT open hi-hats! The signature house bounce between kicks!", targetInstrument: 'hihat', targetSteps: [2, 6, 10, 14, 18, 22, 26, 30], soundVariant: 1 },
      { text: "🎹 Piano STABS with that disco/house chord rhythm! Off-beat magic!", targetInstrument: 'synth', targetSteps: [2, 5, 10, 13, 18, 21, 26, 29], soundVariant: 2 },
      { text: "🎸 Pumping BASS with 16th note rhythm - the dance floor driver!", targetInstrument: 'bass', targetSteps: [0, 3, 4, 8, 11, 12, 16, 19, 20, 24, 27, 28], soundVariant: 1 },
      { text: "🚀 FX RISER builds anticipation for the drop!", targetInstrument: 'fx', targetSteps: [0], soundVariant: 0 },
      { text: "🔥 6 layers of HOUSE! This is EDM, Disco, and Club music! DROP IT! 🏠", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 4, 8, 11, 12, 16, 20, 24, 27, 28], snare: [4, 12, 15, 20, 28, 31], hihat: [2, 6, 10, 14, 18, 22, 26, 30], synth: [2, 5, 10, 13, 18, 21, 26, 29], bass: [0, 3, 4, 8, 11, 12, 16, 19, 20, 24, 27, 28], fx: [0] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-purple-900 to-slate-900 rounded-b-3xl">
        <div className="absolute bottom-0 w-full h-32 bg-slate-900"></div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute bottom-0" style={{ left: `${i * 14 + 5}%`, height: `${40 + Math.random() * 40}%`, width: '8%' }}>
            <div className="w-full h-full bg-slate-800 relative">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="absolute w-2 h-2 bg-yellow-300/80" style={{ left: `${20 + Math.random() * 60}%`, top: `${10 + j * 15}%`, opacity: Math.random() > 0.3 ? 1 : 0.3 }}></div>
              ))}
            </div>
          </div>
        ))}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl" style={{ transform: `translate(-50%, -50%) scale(${1 + pulse * 0.3})`, filter: `drop-shadow(0 0 ${10 + pulse * 20}px #f0abfc)` }}>🎹</div>
        <div className="absolute bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-80" style={{ transform: `scaleX(${0.5 + pulse * 0.5})` }}></div>
      </div>
    )
  },
  {
    id: 3, name: "Desert Sunset 🏜️", bpm: 98, desc: "Warm, groovy, world music vibes", locked: false, theme: "from-orange-500 to-red-500", bgClass: "bg-orange-900", ambience: "desert",
    tutorial: [
      { text: "🌍 AFROBEAT groove! The '3-2 clave' kick pattern - syncopated magic that makes you MOVE!", targetInstrument: 'kick', targetSteps: [0, 6, 12, 16, 20, 26], soundVariant: 3 },
      { text: "🥁  Cross-stick snare on 2 & 4 plus ghost notes - tight and funky!", targetInstrument: 'snare', targetSteps: [4, 7, 12, 20, 23, 28], soundVariant: 0 },
      { text: "🧂 SHAKER drives the groove with 16th notes - constant flowing energy!", targetInstrument: 'hihat', targetSteps: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], soundVariant: 3 },
      { text: "🪘 CONGA plays the TUMBA pattern! Traditional 6/8 polyrhythm over 4/4!", targetInstrument: 'perc', targetSteps: [0, 3, 6, 10, 12, 15, 16, 19, 22, 26, 28, 31], soundVariant: 0 },
      { text: "🎸 BASS locks with the kick - dancehall-style bounce pattern!", targetInstrument: 'bass', targetSteps: [0, 6, 10, 12, 16, 20, 26, 28], soundVariant: 2 },
      { text: "🎹 KEYS play jazzy maj7 chords - that sunny Afro-Cuban color!", targetInstrument: 'keys', targetSteps: [0, 3, 8, 16, 19, 24], soundVariant: 2 },
      { text: "🌦 6 instruments with POLYRHYTHM! Heart of African & Latin music! PLAY! 🌍", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 6, 12, 16, 20, 26], snare: [4, 7, 12, 20, 23, 28], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], perc: [0, 3, 6, 10, 12, 15, 16, 19, 22, 26, 28, 31], bass: [0, 6, 10, 12, 16, 20, 26, 28], keys: [0, 3, 8, 16, 19, 24] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-orange-400 via-red-400 to-purple-600 rounded-b-3xl">
        <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-amber-800 to-amber-700"></div>
        <div className="absolute bottom-16 left-1/4 w-0 h-0 border-l-[30px] border-r-[30px] border-b-[60px] border-l-transparent border-r-transparent border-b-amber-900/60"></div>
        <div className="absolute bottom-16 right-1/3 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[40px] border-l-transparent border-r-transparent border-b-amber-900/40"></div>
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-yellow-200 rounded-full opacity-90 shadow-[0_0_80px_rgba(253,224,71,0.6)]"></div>
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-4xl" style={{ transform: `translateX(-50%) rotate(${pulse * 10}deg)` }}>🪘</div>
      </div>
    )
  },
  {
    id: 4, name: "Deep Space 🚀", bpm: 174, desc: "Cosmic, epic, cinematic sounds", locked: false, theme: "from-indigo-600 to-violet-900", bgClass: "bg-slate-950", ambience: "space",
    tutorial: [
      { text: "🚀 DRUM & BASS! 174 BPM with the classic 'Amen break' style kick pattern!", targetInstrument: 'kick', targetSteps: [0, 10, 14, 16, 26, 30], soundVariant: 1 },
      { text: "⚡ D&B snares hit hard on 2 & 4 with ROLLS before the next bar!", targetInstrument: 'snare', targetSteps: [4, 12, 13, 20, 28, 29, 30], soundVariant: 0 },
      { text: "🎩 Breakbeat hi-hat pattern - open hats for that jungle feel!", targetInstrument: 'hihat', targetSteps: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], soundVariant: 0 },
      { text: "🌀 REESE BASS - the legendary D&B bass! Rolling 16ths that fill the space!", targetInstrument: 'bass', targetSteps: [0, 2, 4, 6, 10, 14, 16, 18, 20, 22, 26, 30], soundVariant: 3 },
      { text: "🎹 SYNTH PAD - cosmic atmosphere that breathes through the track!", targetInstrument: 'synth', targetSteps: [0, 16], soundVariant: 0 },
      { text: "💫 FX IMPACTS mark the phrases - cinematic power!", targetInstrument: 'fx', targetSteps: [0, 14, 16, 30], soundVariant: 1 },
      { text: "🚀 6 layers of D&B! ENERGY and SPEED! Launch into hyperspace! 🌈", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 10, 14, 16, 26, 30], snare: [4, 12, 13, 20, 28, 29, 30], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 2, 4, 6, 10, 14, 16, 18, 20, 22, 26, 30], synth: [0, 16], fx: [0, 14, 16, 30] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-violet-950 rounded-b-3xl">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white" style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.8 + 0.2,
            animation: `pulse ${Math.random() * 2 + 1}s infinite`
          }}></div>
        ))}
        <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-sm opacity-60"></div>
        <div className="absolute bottom-1/3 left-1/5 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-sm opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl" style={{ transform: `translate(-50%, -50%) scale(${1 + pulse * 0.2}) rotate(${pulse * 15}deg)` }}>🎸</div>
      </div>
    )
  },
  {
    id: 5, name: "Trap Kingdom 👑", bpm: 145, desc: "Hard-hitting trap with 808s and hi-hat rolls", locked: false, theme: "from-red-600 to-black", bgClass: "bg-black", ambience: "trap",
    tutorial: [
      { text: "👑 TRAP MUSIC! The 808 kick is sparse but MASSIVE! Feel that low end shake the room!", targetInstrument: 'kick', targetSteps: [0, 7, 14, 16, 23, 30], soundVariant: 0 },
      { text: "Trap snares hit HARD on 2 & 4! 💥 Add extra hits for attitude!", targetInstrument: 'snare', targetSteps: [4, 12, 15, 20, 28, 31], soundVariant: 3 },
      { text: "🎩 HI-HAT ROLLS are trap's signature! Notice the TRIPLETS that create machine-gun energy!", targetInstrument: 'hihat', targetSteps: [0, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16, 18, 20, 21, 22, 24, 25, 26, 28, 29, 30], soundVariant: 0 },
      { text: "808 BASS = LIFE! 🔊 Long sliding notes that hit with the kick!", targetInstrument: 'bass', targetSteps: [0, 7, 14, 16, 23, 30], soundVariant: 0 },
      { text: "SYNTH adds dark minor chords! 🌑 Mysterious ominous atmosphere!", targetInstrument: 'synth', targetSteps: [0, 8, 16, 24], soundVariant: 3 },
      { text: "🎵 LEAD melody - the catchy hook that gets stuck in your head!", targetInstrument: 'lead', targetSteps: [0, 3, 6, 8, 11, 16, 19, 22, 24, 27], soundVariant: 1 },
      { text: "💥 FX builds INTENSITY! Risers before the drop!", targetInstrument: 'fx', targetSteps: [14, 30], soundVariant: 1 },
      { text: "👑 TRAP ROYALTY! 7 layers of pure fire! HIT PLAY!", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 7, 14, 16, 23, 30], snare: [4, 12, 15, 20, 28, 31], hihat: [0, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16, 18, 20, 21, 22, 24, 25, 26, 28, 29, 30], bass: [0, 7, 14, 16, 23, 30], synth: [0, 8, 16, 24], lead: [0, 3, 6, 8, 11, 16, 19, 22, 24, 27], fx: [14, 30] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-red-950 to-black rounded-b-3xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.3),transparent_70%)]"></div>
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute w-1 bg-red-500/30" style={{
            height: `${20 + Math.random() * 40}%`,
            left: `${i * 5 + 2}%`,
            bottom: 0,
            transform: `scaleY(${0.5 + pulse * 0.5})`
          }}></div>
        ))}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl" style={{ transform: `translate(-50%, -50%) scale(${1 + pulse * 0.3})` }}>👑</div>
      </div>
    )
  },
  {
    id: 6, name: "Reggaeton 🔥", bpm: 98, desc: "Latin urban rhythm with the dembow beat", locked: false, theme: "from-yellow-500 to-red-600", bgClass: "bg-red-900", ambience: "reggaeton",
    tutorial: [
      { text: "🔥 REGGAETON! The 'DEMBOW' beat! Kick on 1, 'and' of 2, and repeat - feel that BOUNCE!", targetInstrument: 'kick', targetSteps: [0, 5, 8, 13, 16, 21, 24, 29], soundVariant: 1 },
      { text: "💿 The DEMBOW snare is magic! Off-beat hits create the irresistible swing!", targetInstrument: 'snare', targetSteps: [3, 7, 11, 15, 19, 23, 27, 31], soundVariant: 1 },
      { text: "Hi-hats add Latin FLAVOR! 🎶 Consistent 8ths with ghost notes!", targetInstrument: 'hihat', targetSteps: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], soundVariant: 0 },
      { text: "🎸 Bass LOCKS with the kick - deep and punchy dance floor shake!", targetInstrument: 'bass', targetSteps: [0, 5, 8, 13, 16, 21, 24, 29], soundVariant: 1 },
      { text: "🪘 Congas add PERREO! 🔥 Traditional tumba meets urban heat!", targetInstrument: 'perc', targetSteps: [0, 3, 6, 8, 11, 14, 16, 19, 22, 24, 27, 30], soundVariant: 0 },
      { text: "🎹 Piano montuno pattern - that tropical Caribbean color!", targetInstrument: 'keys', targetSteps: [0, 3, 6, 8, 11, 16, 19, 22, 24, 27], soundVariant: 3 },
      { text: "🎵 LEAD melody - the memorable hook! Catchy synth phrase!", targetInstrument: 'lead', targetSteps: [0, 4, 8, 12, 16, 20, 24, 28], soundVariant: 1 },
      { text: "🔥 DALE! Full REGGAETON heat with 7 layers! PLAY and PERREO! 💿", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 5, 8, 13, 16, 21, 24, 29], snare: [3, 7, 11, 15, 19, 23, 27, 31], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 5, 8, 13, 16, 21, 24, 29], perc: [0, 3, 6, 8, 11, 14, 16, 19, 22, 24, 27, 30], keys: [0, 3, 6, 8, 11, 16, 19, 22, 24, 27], lead: [0, 4, 8, 12, 16, 20, 24, 28] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-yellow-500 via-orange-500 to-red-600 rounded-b-3xl">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="absolute text-3xl" style={{
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 70}%`,
            transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + pulse * 0.3})`,
            opacity: 0.6
          }}>🔥</div>
        ))}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl" style={{ transform: `translate(-50%, -50%) scale(${1 + pulse * 0.2})` }}>💿</div>
      </div>
    )
  },
  {
    id: 7, name: "Hip Hop Classic 🎤", bpm: 92, desc: "Old school boom bap hip hop beat", locked: false, theme: "from-amber-600 to-stone-800", bgClass: "bg-stone-900", ambience: "hiphop",
    tutorial: [
      { text: "🎤 BOOM BAP! Classic 90s hip hop. Kick is lazy, slightly behind the beat!", targetInstrument: 'kick', targetSteps: [0, 5, 10, 16, 21, 26], soundVariant: 1 },
      { text: "'BAP' snare CRACKS! 💥 Hard on 2 & 4 with ghost notes for swing!", targetInstrument: 'snare', targetSteps: [4, 7, 12, 20, 23, 28], soundVariant: 0 },
      { text: "🎩 Swung hi-hats are ESSENTIAL! The shuffle feel makes heads nod!", targetInstrument: 'hihat', targetSteps: [0, 3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31], soundVariant: 0 },
      { text: "🎸 Upright bass sound - jazzy walking line with chromatic fills!", targetInstrument: 'bass', targetSteps: [0, 5, 8, 10, 16, 21, 24, 26], soundVariant: 2 },
      { text: "🎹 Dusty piano chops - sampled soul feel that defines boom bap!", targetInstrument: 'keys', targetSteps: [0, 6, 8, 14, 16, 22, 24, 30], soundVariant: 0 },
      { text: "🥁  Tom fills add that classic J Dilla flavor - unexpected hits!", targetInstrument: 'tom', targetSteps: [6, 14, 15, 22, 30, 31], soundVariant: 0 },
      { text: "🎵 Shaker for that dusty vinyl texture - old school authenticity!", targetInstrument: 'perc', targetSteps: [2, 6, 10, 14, 18, 22, 26, 30], soundVariant: 3 },
      { text: "🎤 CLASSIC BOOM BAP! 7 layers of golden era hip hop! DROP THE BEAT!", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 5, 10, 16, 21, 26], snare: [4, 7, 12, 20, 23, 28], hihat: [0, 3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31], bass: [0, 5, 8, 10, 16, 21, 24, 26], keys: [0, 6, 8, 14, 16, 22, 24, 30], tom: [6, 14, 15, 22, 30, 31], perc: [2, 6, 10, 14, 18, 22, 26, 30] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-amber-800 to-stone-900 rounded-b-3xl">
        <div className="absolute bottom-0 w-full h-20 bg-stone-950"></div>
        <div className="absolute bottom-16 left-10 w-16 h-24 bg-stone-800 rounded-t-lg"></div>
        <div className="absolute bottom-16 left-32 w-20 h-32 bg-stone-700 rounded-t-lg"></div>
        <div className="absolute bottom-16 right-20 w-14 h-20 bg-stone-800 rounded-t-lg"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl" style={{ transform: `translate(-50%, -50%) scale(${1 + pulse * 0.15})` }}>🎤</div>
      </div>
    )
  },
  {
    id: 8, name: "Rock Solid 🎸", bpm: 118, desc: "Classic rock drum pattern", locked: false, theme: "from-gray-700 to-red-900", bgClass: "bg-gray-900", ambience: "rock",
    tutorial: [
      { text: "🎸 ROCK DRUMS! Driving kick with an extra hit before beat 3 for power!", targetInstrument: 'kick', targetSteps: [0, 6, 8, 14, 16, 22, 24, 30], soundVariant: 3 },
      { text: "Rock snare CRACKS on 2 & 4! 💥 With a pickup note for energy!", targetInstrument: 'snare', targetSteps: [4, 12, 15, 20, 28, 31], soundVariant: 0 },
      { text: "🥁  Ride cymbal pattern - steady 8ths with accent on the beat!", targetInstrument: 'hihat', targetSteps: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], soundVariant: 0 },
      { text: "🎸 Bass guitar drives the rhythm - lock with the kick!", targetInstrument: 'bass', targetSteps: [0, 6, 8, 14, 16, 22, 24, 30], soundVariant: 2 },
      { text: "🎹 Hammond organ power chords - that classic rock sound!", targetInstrument: 'keys', targetSteps: [0, 8, 16, 24], soundVariant: 2 },
      { text: "🎵 Guitar riff lead line - memorable melodic hook!", targetInstrument: 'lead', targetSteps: [0, 3, 6, 8, 11, 16, 19, 22, 24, 27], soundVariant: 2 },
      { text: "🥁  Tom fills build to the next section - classic rock transition!", targetInstrument: 'tom', targetSteps: [12, 13, 14, 28, 29, 30, 31], soundVariant: 1 },
      { text: "🎸 ROCK ON! 7 layers of pure rock power! CRANK IT UP!", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 6, 8, 14, 16, 22, 24, 30], snare: [4, 12, 15, 20, 28, 31], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 6, 8, 14, 16, 22, 24, 30], keys: [0, 8, 16, 24], lead: [0, 3, 6, 8, 11, 16, 19, 22, 24, 27], tom: [12, 13, 14, 28, 29, 30, 31] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-gray-800 to-gray-950 rounded-b-3xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(220,38,38,0.2),transparent_60%)]"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="absolute bottom-10 bg-yellow-500 rounded-full" style={{
            width: '8px',
            height: '8px',
            left: `${25 + i * 25}%`,
            boxShadow: `0 0 ${20 + pulse * 30}px ${10 + pulse * 15}px rgba(234,179,8,0.6)`,
          }}></div>
        ))}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl" style={{ transform: `translate(-50%, -50%) scale(${1 + pulse * 0.2}) rotate(${pulse * 5}deg)` }}>🎸</div>
      </div>
    )
  },
  {
    id: 9, name: "Techno Machine 🤖", bpm: 132, desc: "Hypnotic, repetitive techno groove", locked: false, theme: "from-cyan-600 to-gray-900", bgClass: "bg-gray-950", ambience: "techno",
    tutorial: [
      { text: "🤖 TECHNO! Relentless four-on-the-floor with ghost kicks for groove!", targetInstrument: 'kick', targetSteps: [0, 4, 8, 10, 12, 16, 20, 24, 26, 28], soundVariant: 1 },
      { text: "👏 Minimal claps on 2 & 4 with a rimshot accent pattern!", targetInstrument: 'snare', targetSteps: [4, 12, 14, 20, 28, 30], soundVariant: 1 },
      { text: "🎩 Open hi-hats on offbeats plus 16th shaker texture!", targetInstrument: 'hihat', targetSteps: [2, 6, 10, 14, 18, 22, 26, 30], soundVariant: 0 },
      { text: "🔊 Sub bass POUNDS with the kick - feel it in your chest!", targetInstrument: 'bass', targetSteps: [0, 4, 8, 12, 16, 20, 24, 28], soundVariant: 0 },
      { text: "🌈 Pad EVOLVES slowly - building hypnotic atmosphere!", targetInstrument: 'synth', targetSteps: [0, 16], soundVariant: 0 },
      { text: "🎵 Acid lead sequence - the 303 pattern that defined techno!", targetInstrument: 'lead', targetSteps: [0, 3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31], soundVariant: 0 },
      { text: "🌟 FX textures add movement - risers and sweeps!", targetInstrument: 'fx', targetSteps: [0, 8, 16, 24], soundVariant: 0 },
      { text: "🤖 HYPNOTIC TECHNO! 7 layers of machine precision! ENTER THE TRANCE!", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 4, 8, 10, 12, 16, 20, 24, 26, 28], snare: [4, 12, 14, 20, 28, 30], hihat: [2, 6, 10, 14, 18, 22, 26, 30], bass: [0, 4, 8, 12, 16, 20, 24, 28], synth: [0, 16], lead: [0, 3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31], fx: [0, 8, 16, 24] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-gray-900 to-black rounded-b-3xl">
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="absolute left-1/2 top-1/2 border border-cyan-500/30 rounded-full" style={{
              width: `${(i + 1) * 40 + pulse * 20}px`,
              height: `${(i + 1) * 40 + pulse * 20}px`,
              transform: 'translate(-50%, -50%)',
              opacity: 1 - i * 0.1
            }}></div>
          ))}
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl" style={{ transform: `translate(-50%, -50%) scale(${1 + pulse * 0.3})` }}>🤖</div>
      </div>
    )
  },
];

// ==========================================
// GAME LEVELS - Progressive Learning System
// ==========================================
export const GAME_LEVELS = [
  {
    id: 1,
    name: "First Beat",
    difficulty: "Beginner",
    stars: 0,
    maxStars: 3,
    xpReward: 50,
    icon: "🥁 ",
    description: "Learn the basics! Place kicks and snares to create your first beat.",
    objective: "Continue the rock beat pattern",
    premadePattern: {
      kick: [0, 8],
      snare: [4, 12]
    },
    requirements: {
      instruments: ['kick', 'snare'],
      minNotes: 4,
      mustInclude: { kick: 2, snare: 2 }
    },
    hints: [
      "💡 Start with the KICK drum - it's the heartbeat of your music!",
      "💡 Place kicks on beats 1 and 3 (steps 0, 8, 16, 24)",
      "💡 Add SNARE on beats 2 and 4 (steps 4, 12, 20, 28) for the backbeat",
      "💡 Hit PLAY to hear your creation!"
    ],
    patternVariations: [
      { name: "Rock Backbeat", pattern: { kick: [0, 16], snare: [8, 24] }, difficulty: "Easy" },
      { name: "Hip-Hop Swing", pattern: { kick: [0, 11, 16, 27], snare: [8, 24] }, difficulty: "Medium" },
      { name: "Reggae One-Drop", pattern: { kick: [16], snare: [8, 24] }, difficulty: "Hard" }
    ],
    tempo: 100,
    unlocked: true,
    themeId: 'neon'
  },
  {
    id: 2,
    name: "Add the Groove",
    difficulty: "Beginner",
    stars: 0,
    maxStars: 3,
    xpReward: 75,
    icon: "🎩",
    description: "Time to add some rhythm! The drums are ready - you add the Hi-Hats.",
    objective: "Add 4 HI-HATS to the existing beat",
    premadePattern: {
      kick: [0, 8, 16, 24],
      snare: [4, 12, 20, 28]
    },
    requirements: {
      instruments: ['hihat'],
      minNotes: 4,
      mustInclude: { hihat: 4 }
    },
    hints: [
      "💡 Hi-hats create the 'tick-tick-tick' rhythm!",
      "💡 Try placing hi-hats on every other step for 8th notes",
      "💡 The hi-hat fills the space between kick and snare",
      "💡 Experiment with different patterns!"
    ],
    patternVariations: [
      { name: "Disco Groove", pattern: { kick: [0, 8, 16, 24], snare: [8, 24], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30] }, difficulty: "Easy" },
      { name: "Trap Roll", pattern: { kick: [0, 16], snare: [8, 24], hihat: [0, 1, 2, 3, 8, 9, 10, 11, 16, 17, 18, 19, 24, 25, 26, 27] }, difficulty: "Medium" },
      { name: "Breakbeat Shuffle", pattern: { kick: [0, 10, 16], snare: [5, 13, 21, 29], hihat: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30] }, difficulty: "Hard" }
    ],
    tempo: 100,
    unlocked: true,
    themeId: 'neon'
  },
  {
    id: 3,
    name: "Bass Drop",
    difficulty: "Easy",
    stars: 0,
    maxStars: 3,
    xpReward: 100,
    icon: "🎸",
    description: "The drums are tight. Now lay down a heavy Bass line to shake the floor!",
    objective: "Add a BASS line to the drum beat",
    premadePattern: {
      kick: [0, 10, 16, 26],
      snare: [8, 24],
      hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
    },
    requirements: {
      instruments: ['bass'],
      minNotes: 4,
      mustInclude: { bass: 4 }
    },
    hints: [
      "💡 Bass usually follows the kick drum",
      "💡 Try placing bass notes where your kicks are",
      "💡 Add some bass notes in between for groove",
      "💡 Lower sounds = more power!"
    ],
    patternVariations: [
      { name: "Dubstep Wobble", pattern: { kick: [0, 16], snare: [8, 24], bass: [0, 2, 4, 6, 16, 18, 20, 22] }, difficulty: "Easy" },
      { name: "Funk Slap", pattern: { kick: [0, 16], snare: [8, 24], bass: [0, 3, 7, 10, 16, 19, 23, 26] }, difficulty: "Medium" },
      { name: "Trance Roll", pattern: { kick: [0, 4, 8, 12, 16, 20, 24, 28], snare: [8, 24], bass: [0, 1, 4, 5, 8, 9, 12, 13, 16, 17, 20, 21, 24, 25, 28, 29] }, difficulty: "Hard" }
    ],
    tempo: 95,
    unlocked: false,
    themeId: 'ocean'
  },
  {
    id: 4,
    name: "Four on the Floor",
    difficulty: "Easy",
    stars: 0,
    maxStars: 3,
    xpReward: 125,
    icon: "🏠",
    description: "Learn the classic house music pattern!",
    objective: "Create a house beat with kick on every beat",
    requirements: {
      instruments: ['kick', 'snare', 'hihat'],
      minNotes: 12,
      mustInclude: { kick: 4, snare: 2, hihat: 4 }
    },
    hints: [
      "💡 'Four on the floor' means kick on beats 1, 2, 3, 4",
      "💡 Place kicks on steps 0, 8, 16, 24",
      "💡 Claps/snares go on 2 and 4 (steps 8, 24)",
      "💡 Hi-hats go on the OFF-beats for that house bounce!"
    ],
    patternVariations: [
      { name: "Chicago House", pattern: { kick: [0, 8, 16, 24], snare: [8, 24], hihat: [4, 12, 20, 28] }, difficulty: "Easy" },
      { name: "UK Garage 2-Step", pattern: { kick: [0, 12, 16, 28], snare: [6, 22], hihat: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30] }, difficulty: "Medium" },
      { name: "Baile Funk", pattern: { kick: [0, 3, 6, 8, 11, 14, 16, 19, 22, 24, 27, 30], snare: [8, 24], hihat: [2, 10, 18, 26] }, difficulty: "Hard" }
    ],
    tempo: 124,
    unlocked: false,
    themeId: 'golden'
  },
  {
    id: 5,
    name: "Synth Magic",
    difficulty: "Medium",
    stars: 0,
    maxStars: 3,
    xpReward: 150,
    icon: "🎹",
    description: "Add melody and chords with the synthesizer!",
    objective: "Create a beat using 4 different instruments including SYNTH",
    requirements: {
      instruments: ['kick', 'snare', 'hihat', 'synth'],
      minNotes: 12,
      mustInclude: { kick: 2, snare: 2, hihat: 4, synth: 2 }
    },
    hints: [
      "💡 Synth adds melody and harmony to your beat",
      "💡 Try placing synth notes on off-beats",
      "💡 Synth chords work well with bass lines",
      "💡 Less is more - don't overcrowd!"
    ],
    patternVariations: [
      { name: "Ambient Pad", pattern: { kick: [0, 16], snare: [8, 24], hihat: [0, 8, 16, 24], synth: [0] }, difficulty: "Easy" },
      { name: "Arpeggio Sequence", pattern: { kick: [0, 16], snare: [8, 24], hihat: [4, 12, 20, 28], synth: [0, 2, 4, 6, 8, 10, 12, 14] }, difficulty: "Medium" },
      { name: "Acid Bassline", pattern: { kick: [0, 6, 12, 18, 24, 30], snare: [8, 24], hihat: [0, 4, 8, 12, 16, 20, 24, 28], synth: [0, 3, 7, 10, 13, 16, 19, 23, 26, 29] }, difficulty: "Hard" }
    ],
    tempo: 110,
    unlocked: false,
    themeId: 'forest'
  },
  {
    id: 6,
    name: "Percussion Party",
    difficulty: "Medium",
    stars: 0,
    maxStars: 3,
    xpReward: 175,
    icon: "🪘",
    description: "Layer percussion for complex rhythms!",
    objective: "Use 5 instruments including PERCUSSION",
    requirements: {
      instruments: ['kick', 'snare', 'hihat', 'perc', 'bass'],
      minNotes: 16,
      mustInclude: { kick: 2, snare: 2, hihat: 4, perc: 4, bass: 2 }
    },
    hints: [
      "💡 Percussion adds texture and fills gaps",
      "💡 Shakers and congas work great off the main beat",
      "💡 Try polyrhythms - patterns that contrast!",
      "💡 World music uses lots of percussion layers"
    ],
    patternVariations: [
      { name: "Samba Brazilian", pattern: { kick: [0, 6, 12, 18, 24, 30], snare: [4, 20], hihat: [0, 4, 8, 12, 16, 20, 24, 28], perc: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30], bass: [0, 12, 24] }, difficulty: "Easy" },
      { name: "Middle Eastern Darbuka", pattern: { kick: [0, 8, 16, 24], snare: [6, 14, 22, 30], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], perc: [1, 5, 9, 13, 17, 21, 25, 29], bass: [0, 16] }, difficulty: "Medium" },
      { name: "West African Djembe", pattern: { kick: [0, 10, 20], snare: [8, 18, 28], hihat: [0, 4, 8, 12, 16, 20, 24, 28], perc: [0, 2, 5, 7, 10, 12, 15, 17, 20, 22, 25, 27, 30], bass: [0, 10, 20] }, difficulty: "Hard" }
    ],
    tempo: 98,
    unlocked: false,
    themeId: 'sunset'
  },
  {
    id: 7,
    name: "Lo-Fi Chill",
    difficulty: "Medium",
    stars: 0,
    maxStars: 3,
    xpReward: 200,
    icon: "🌙",
    description: "Create a relaxing lo-fi beat with keys!",
    objective: "Make a chill beat with KEYS and slow tempo",
    requirements: {
      instruments: ['kick', 'snare', 'hihat', 'keys', 'bass'],
      minNotes: 14,
      mustInclude: { kick: 2, snare: 2, hihat: 4, keys: 2, bass: 2 }
    },
    hints: [
      "💡 Lo-fi beats are SLOW - around 70-85 BPM",
      "💡 Keys add that jazzy, nostalgic feel",
      "💡 Leave SPACE in your beat - silence is powerful",
      "💡 Ghost notes (quiet hits) add human feel"
    ],
    patternVariations: [
      { name: "Vinyl Crackle Minimal", pattern: { kick: [0, 20], snare: [10, 26], hihat: [0, 6, 12, 18, 24, 30], keys: [0], bass: [0, 20] }, difficulty: "Easy" },
      { name: "Boom Bap Jazzy", pattern: { kick: [0, 11, 16, 27], snare: [8, 24], hihat: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30], keys: [0, 8, 16, 24], bass: [0, 11, 16, 27] }, difficulty: "Medium" },
      { name: "Anime Opening", pattern: { kick: [0, 6, 16, 22], snare: [8, 24], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], keys: [0, 4, 8, 12, 16, 20, 24, 28], bass: [0, 6, 12, 16, 22, 28] }, difficulty: "Hard" }
    ],
    tempo: 75,
    unlocked: false,
    themeId: 'midnight'
  },
  {
    id: 8,
    name: "Full Production",
    difficulty: "Hard",
    stars: 0,
    maxStars: 3,
    xpReward: 250,
    icon: "🎧",
    description: "Use ALL instruments to create a full track!",
    objective: "Create a complete beat using 6+ instruments",
    requirements: {
      instruments: ['kick', 'snare', 'hihat', 'bass', 'synth', 'keys'],
      minNotes: 24,
      mustInclude: { kick: 4, snare: 4, hihat: 8, bass: 4, synth: 2, keys: 2 }
    },
    hints: [
      "💡 Build in layers - start with drums, add bass, then melody",
      "💡 Make sure instruments don't clash - give each space",
      "💡 The best beats have contrast - loud and quiet parts",
      "💡 You're ready to be a producer!"
    ],
    patternVariations: [
      { name: "Synthwave Retro", pattern: { kick: [0, 8, 16, 24], snare: [8, 24], hihat: [4, 12, 20, 28], bass: [0, 8, 16, 24], synth: [0, 16], keys: [4, 12, 20, 28] }, difficulty: "Easy" },
      { name: "Future Bass", pattern: { kick: [0, 16], snare: [8, 24], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 6, 10, 16, 22, 26], synth: [0, 4, 8, 12, 16, 20, 24, 28], keys: [2, 10, 18, 26] }, difficulty: "Medium" },
      { name: "Industrial Dark", pattern: { kick: [0, 6, 12, 18, 24, 30], snare: [4, 10, 16, 22, 28], hihat: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30], bass: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30], synth: [0, 12, 24], keys: [6, 18, 30] }, difficulty: "Hard" }
    ],
    tempo: 105,
    unlocked: false,
    themeId: 'midnight'
  },
  {
    id: 9,
    name: "Speed Demon",
    difficulty: "Hard",
    stars: 0,
    maxStars: 3,
    xpReward: 300,
    icon: "⚡",
    description: "Fast tempo challenge - can you keep up?",
    objective: "Create a high-energy beat at 140+ BPM",
    requirements: {
      instruments: ['kick', 'snare', 'hihat', 'bass', 'synth'],
      minNotes: 20,
      mustInclude: { kick: 4, snare: 4, hihat: 8, bass: 2, synth: 2 }
    },
    hints: [
      "💡 Fast tempos need simpler patterns",
      "💡 Drum & Bass and Jungle run at 160-180 BPM!",
      "💡 Keep the rhythm tight and punchy",
      "💡 Less notes per bar at high speeds"
    ],
    patternVariations: [
      { name: "Amen Break Classic", pattern: { kick: [0, 10, 16], snare: [4, 12, 20, 28], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 10, 16], synth: [0, 16] }, difficulty: "Easy" },
      { name: "Halftime Dubstep", pattern: { kick: [0, 16], snare: [8], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 1, 2, 3, 8, 9, 10, 11, 16, 17, 18, 19, 24, 25, 26, 27], synth: [8, 24] }, difficulty: "Medium" },
      { name: "Footwork/Juke", pattern: { kick: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30], snare: [4, 8, 12, 16, 20, 24, 28], hihat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], bass: [0, 6, 12, 18, 24, 30], synth: [0, 8, 16, 24] }, difficulty: "Hard" }
    ],
    tempo: 145,
    unlocked: false,
    themeId: 'neon'
  },
  {
    id: 10,
    name: "Master Beat",
    difficulty: "Expert",
    stars: 0,
    maxStars: 3,
    xpReward: 500,
    icon: "👑",
    description: "The ultimate challenge - prove your mastery!",
    objective: "Create a complex beat with 7 instruments and 30+ notes",
    requirements: {
      instruments: ['kick', 'snare', 'hihat', 'bass', 'synth', 'keys', 'perc'],
      minNotes: 30,
      mustInclude: { kick: 4, snare: 4, hihat: 8, bass: 4, synth: 4, keys: 2, perc: 4 }
    },
    hints: [
      "💡 This is everything you've learned combined!",
      "💡 Think like a real producer - arrangement matters",
      "💡 Use dynamics - vary the intensity",
      "💡 You've mastered Rhythm Realm! 👑"
    ],
    patternVariations: [
      { name: "Cinematic Epic", pattern: { kick: [0, 8, 16, 24], snare: [12, 28], hihat: [0, 4, 8, 12, 16, 20, 24, 28], bass: [0, 8, 16, 24], synth: [0, 16], keys: [0, 8, 16, 24], perc: [4, 12, 20, 28] }, difficulty: "Easy" },
      { name: "Glitch Hop Experimental", pattern: { kick: [0, 7, 14, 16, 23, 30], snare: [6, 10, 22, 26], hihat: [0, 1, 3, 4, 6, 7, 9, 10, 12, 13, 15, 16, 18, 19, 21, 22, 24, 25, 27, 28, 30, 31], bass: [0, 2, 7, 9, 14, 16, 18, 23, 25, 30], synth: [0, 7, 14, 16, 23, 30], keys: [3, 10, 19, 26], perc: [1, 5, 9, 13, 17, 21, 25, 29] }, difficulty: "Medium" },
      { name: "Tribal Fusion", pattern: { kick: [0, 5, 10, 15, 20, 25, 30], snare: [8, 18, 28], hihat: [0, 2, 5, 7, 10, 12, 15, 17, 20, 22, 25, 27, 30], bass: [0, 5, 10, 15, 20, 25, 30], synth: [0, 10, 20, 30], keys: [5, 15, 25], perc: [0, 2, 3, 5, 7, 8, 10, 12, 13, 15, 17, 18, 20, 22, 23, 25, 27, 28, 30] }, difficulty: "Hard" }
    ],
    tempo: 115,
    unlocked: false,
    themeId: 'golden'
  }
];
