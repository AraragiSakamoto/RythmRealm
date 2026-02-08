import React from 'react';
import { Icons } from '../views/components/Icons';

export const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to GrooveLab!',
    content: "Let's learn how to make music! This tutorial will guide you through the basics of creating your first beat.",
    target: null,
    position: 'center',
    action: 'next',
  },
  {
    id: 'grid-intro',
    title: 'The Beat Grid',
    content: "This is your beat grid! Each row is a different instrument (Kick, Snare, HiHat, etc). Each column is a point in time. Click any cell to add a sound!",
    target: 'grid',
    position: 'top',
    action: 'next',
  },
  {
    id: 'click-cell',
    title: 'ry Clicking a Cell!',
    content: "Click on any empty cell in the grid to add a beat. The cell will light up and you'll hear the sound!",
    target: 'grid',
    position: 'top',
    action: 'click-grid',
    highlight: 'grid',
  },
  {
    id: 'play-button',
    title: 'Play Your Beat',
    content: "Press the PLAY button (or hit SPACEBAR) to hear your creation! The playhead will move across the grid showing which sounds play.",
    target: 'play-button',
    position: 'top',
    action: 'next',
    highlight: 'play-button',
  },
  {
    id: 'tempo',
    title: 'Tempo Control',
    content: "Use the tempo controls to speed up or slow down your beat. BPM means 'Beats Per Minute' - higher = faster!",
    target: 'tempo',
    position: 'top',
    action: 'next',
    highlight: 'tempo',
  },
  {
    id: 'add-instrument',
    title: 'Adding Instruments',
    content: "Click the + button at the bottom of the instrument list to add new instruments like Tom, FX, Keys, or Synth!",
    target: 'add-track',
    position: 'right',
    action: 'next',
    highlight: 'add-track',
  },
  {
    id: 'sound-variant',
    title: 'Change Instrument Sounds',
    content: "Click on an instrument's icon (the colored circle) to cycle through different sound variations. Each instrument has 4 unique sounds!",
    target: 'instrument-icon',
    position: 'right',
    action: 'next',
    highlight: 'instrument-icon',
  },
  {
    id: 'soundlab-intro',
    title: 'The Sound Lab',
    content: "Click the lab button next to any instrument to open the SOUND LAB. Here you can customize volume, pitch, effects, and more!",
    target: 'soundlab-button',
    position: 'right',
    action: 'next',
    highlight: 'soundlab-button',
  },
  {
    id: 'soundlab-features',
    title: 'Sound Lab Features',
    content: "In Sound Lab you can adjust: Volume, Pitch, Attack, Decay, Filter, Reverb, Distortion, Pan, and Bend",
    target: null,
    position: 'center',
    action: 'next',
  },
  {
    id: 'complete',
    title: "You're Ready!",
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

export const INSTRUMENTS_DATA = {
  kick: { id: 'kick', name: 'Kick', color: 'bg-red-400', shadow: 'shadow-red-400/50', icon: <Icons.Activity /> },
  snare: { id: 'snare', name: 'Snare', color: 'bg-yellow-400', shadow: 'shadow-yellow-400/50', icon: <Icons.Disc /> },
  hihat: { id: 'hihat', name: 'HiHat', color: 'bg-cyan-400', shadow: 'shadow-cyan-400/50', icon: <Icons.Layers /> },
  bass: { id: 'bass', name: 'Bass', color: 'bg-purple-400', shadow: 'shadow-purple-400/50', icon: <Icons.Music /> },
  synth: { id: 'synth', name: 'Synth', color: 'bg-pink-400', shadow: 'shadow-pink-400/50', icon: <Icons.Zap /> },
  tom: { id: 'tom', name: 'Tom', color: 'bg-indigo-400', shadow: 'shadow-indigo-400/50', icon: <Icons.Cloud /> },
  perc: { id: 'perc', name: 'Percussion', color: 'bg-orange-400', shadow: 'shadow-orange-400/50', icon: <Icons.Disc /> },
  fx: { id: 'fx', name: 'FX', color: 'bg-slate-400', shadow: 'shadow-slate-400/50', icon: <Icons.Settings /> },
  keys: { id: 'keys', name: 'Keys', color: 'bg-teal-400', shadow: 'shadow-teal-400/50', icon: <Icons.Keyboard /> },
  vox: { id: 'vox', name: 'Vox', color: 'bg-fuchsia-400', shadow: 'shadow-fuchsia-400/50', icon: <Icons.Mic /> },
  lead: { id: 'lead', name: 'Lead', color: 'bg-blue-500', shadow: 'shadow-blue-500/50', icon: <Icons.Zap /> },
  orch: { id: 'orch', name: 'Orch', color: 'bg-amber-600', shadow: 'shadow-amber-600/50', icon: <Icons.Cloud /> },
};

export const SOUND_VARIANTS = {
  kick: [
    { name: '808 Boom', icon: '', type: 'kick808', freq: 55, duration: 0.8, decay: 0.5 },
    { name: 'Punchy', icon: '', type: 'kickPunch', freq: 150, duration: 0.3, decay: 0.2 },
    { name: 'Sub Drop', icon: '', type: 'kickSub', freq: 40, duration: 1.0, decay: 0.8 },
    { name: 'Acoustic', icon: '', type: 'kickAcoustic', freq: 80, duration: 0.4, decay: 0.3 }
  ],
  snare: [
    { name: 'Crack', icon: '', type: 'snareCrack', freq: 200, duration: 0.2, noise: 0.8 },
    { name: 'Clap', icon: '', type: 'clap', freq: 300, duration: 0.15, noise: 0.9 },
    { name: 'Rim', icon: '', type: 'rim', freq: 800, duration: 0.05, noise: 0.3 },
    { name: 'Trap', icon: '', type: 'snareTrap', freq: 180, duration: 0.3, noise: 0.7 }
  ],
  hihat: [
    { name: 'Closed', icon: '', type: 'hihatClosed', freq: 8000, duration: 0.05, noise: 1.0 },
    { name: 'Open', icon: '', type: 'hihatOpen', freq: 6000, duration: 0.3, noise: 0.9 },
    { name: 'Pedal', icon: '', type: 'hihatPedal', freq: 4000, duration: 0.1, noise: 0.7 },
    { name: 'Shaker', icon: '', type: 'shaker', freq: 10000, duration: 0.08, noise: 1.0 }
  ],
  tom: [
    { name: 'Floor', icon: '', type: 'tomLow', freq: 80, duration: 0.5, decay: 0.4 },
    { name: 'Mid', icon: '', type: 'tomMid', freq: 150, duration: 0.4, decay: 0.3 },
    { name: 'High', icon: '', type: 'tomHigh', freq: 250, duration: 0.3, decay: 0.2 },
    { name: 'Taiko', icon: '', type: 'taiko', freq: 60, duration: 0.8, decay: 0.6 }
  ],
  perc: [
    { name: 'Conga', icon: '', type: 'conga', freq: 200, duration: 0.3, decay: 0.2 },
    { name: 'Bongo', icon: '', type: 'bongo', freq: 350, duration: 0.15, decay: 0.1 },
    { name: 'Cowbell', icon: '', type: 'cowbell', freq: 800, duration: 0.2, decay: 0.15 },
    { name: 'Woodblock', icon: '', type: 'woodblock', freq: 1200, duration: 0.05, decay: 0.03 }
  ],
  bass: [
    { name: 'Sub Bass', icon: '', type: 'bassSub', freq: 55, duration: 0.5, decay: 0.4 },
    { name: 'Synth', icon: '', type: 'bassSynth', freq: 82, duration: 0.3, decay: 0.25 },
    { name: 'Pluck', icon: '', type: 'bassPluck', freq: 110, duration: 0.2, decay: 0.15 },
    { name: 'Wobble', icon: '', type: 'bassWobble', freq: 65, duration: 0.6, decay: 0.5 }
  ],
  synth: [
    { name: 'Pad', icon: '', type: 'synthPad', freq: 440, duration: 1.0, decay: 0.8 },
    { name: 'Pluck', icon: '', type: 'synthPluck', freq: 523, duration: 0.2, decay: 0.15 },
    { name: 'Stab', icon: '', type: 'synthStab', freq: 392, duration: 0.15, decay: 0.1 },
    { name: 'Arp', icon: '', type: 'synthArp', freq: 659, duration: 0.1, decay: 0.08 }
  ],
  fx: [
    { name: 'Riser', icon: '', type: 'fxRiser', freq: 200, duration: 1.5, decay: 1.2 },
    { name: 'Impact', icon: '', type: 'fxImpact', freq: 100, duration: 0.8, decay: 0.6 },
    { name: 'Laser', icon: '', type: 'fxLaser', freq: 1500, duration: 0.3, decay: 0.2 },
    { name: 'Zap', icon: '', type: 'fxZap', freq: 800, duration: 0.15, decay: 0.1 }
  ],
  keys: [
    { name: 'Piano', icon: '', type: 'keysPiano', freq: 523, duration: 0.8, decay: 0.6 },
    { name: 'Rhodes', icon: '', type: 'keysRhodes', freq: 440, duration: 1.0, decay: 0.8 },
    { name: 'Organ', icon: '', type: 'keysOrgan', freq: 392, duration: 0.5, decay: 0.4 },
    { name: 'Bells', icon: '', type: 'keysBells', freq: 880, duration: 1.2, decay: 1.0 }
  ],
  vox: [
    { name: 'Ooh', icon: '', type: 'voxOoh', freq: 400, duration: 0.5, decay: 0.4 },
    { name: 'Aah', icon: '', type: 'voxAah', freq: 500, duration: 0.6, decay: 0.5 },
    { name: 'Hey', icon: '', type: 'voxHey', freq: 350, duration: 0.2, decay: 0.15 },
    { name: 'Choir', icon: '', type: 'voxChoir', freq: 440, duration: 1.0, decay: 0.8 }
  ],
  lead: [
    { name: 'Saw', icon: '', type: 'leadSaw', freq: 659, duration: 0.4, decay: 0.3 },
    { name: 'Square', icon: '', type: 'leadSquare', freq: 523, duration: 0.35, decay: 0.25 },
    { name: 'Pluck', icon: '', type: 'leadPluck', freq: 784, duration: 0.15, decay: 0.1 },
    { name: 'Screech', icon: '', type: 'leadScreech', freq: 1046, duration: 0.5, decay: 0.4 }
  ],
  orch: [
    { name: 'Strings', icon: '', type: 'orchStrings', freq: 294, duration: 1.0, decay: 0.8 },
    { name: 'Brass', icon: '', type: 'orchBrass', freq: 349, duration: 0.4, decay: 0.3 },
    { name: 'Timpani', icon: '', type: 'orchTimpani', freq: 73, duration: 0.8, decay: 0.6 },
    { name: 'Harp', icon: '', type: 'orchHarp', freq: 523, duration: 0.6, decay: 0.5 }
  ]
};

export const BEAT_GUIDES = [
  {
    name: "Rock n Roll",
    desc: "Classic rock beat - Kick on 1 & 3, Snare on 2 & 4",
    pattern: { kick: [0, 8, 16, 24], snare: [4, 12, 20, 28], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 8, 16, 24] }
  },
  {
    name: "Hip Hop",
    desc: "Boom bap with swing and groove",
    pattern: { kick: [0, 7, 10, 16, 23, 26], snare: [4, 12, 20, 28], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 7, 16, 23] }
  },
  {
    name: "House",
    desc: "Four on the floor - classic club beat",
    pattern: { kick: [0, 4, 8, 12, 16, 20, 24, 28], snare: [4, 12, 20, 28], hihat: [2, 6, 10, 14, 18, 22, 26, 30], bass: [0, 6, 8, 14, 16, 22, 24, 30] }
  },
  {
    name: "Trap",
    desc: "Hard-hitting 808s with rapid hi-hats",
    pattern: { kick: [0, 6, 14, 16, 22, 30], snare: [4, 12, 20, 28], hihat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], bass: [0, 6, 14, 16, 22, 30] }
  },
  {
    name: "Reggaeton",
    desc: "Dembow rhythm - infectious Latin groove",
    pattern: { kick: [0, 6, 8, 14, 16, 22, 24, 30], snare: [3, 7, 11, 15, 19, 23, 27, 31], hihat: [0, 4, 8, 12, 16, 20, 24, 28], perc: [2, 6, 10, 14, 18, 22, 26, 30] }
  },
  {
    name: "Drum & Bass",
    desc: "Fast breakbeat with rolling bass",
    pattern: { kick: [0, 10, 16, 26], snare: [4, 12, 14, 20, 28, 30], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 3, 6, 10, 16, 19, 22, 26] }
  },
  {
    name: "Disco Funk",
    desc: "Groovy funk beat with offbeat bass",
    pattern: { kick: [0, 4, 8, 12, 16, 20, 24, 28], snare: [4, 12, 20, 28], hihat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], bass: [2, 6, 10, 14, 18, 22, 26, 30] }
  },
  {
    name: "Lo-Fi Chill",
    desc: "Relaxed beat for studying",
    pattern: { kick: [0, 10, 16, 26], snare: [4, 20], hihat: [0, 4, 8, 12, 16, 20, 24, 28], keys: [0, 8, 16, 24] }
  },
  {
    name: "Afrobeat",
    desc: "West African polyrhythmic groove",
    pattern: { kick: [0, 6, 10, 16, 22, 26], snare: [4, 12, 20, 28], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], perc: [0, 3, 6, 9, 12, 16, 19, 22, 25, 28] }
  },
  {
    name: "Techno",
    desc: "Hypnotic industrial rhythm",
    pattern: { kick: [0, 4, 8, 12, 16, 20, 24, 28], snare: [8, 24], hihat: [2, 6, 10, 14, 18, 22, 26, 30], synth: [0, 8, 16, 24] }
  },
  {
    name: "Bossa Nova",
    desc: "Brazilian jazz rhythm",
    pattern: { kick: [0, 10, 16, 26], snare: [6, 14, 22, 30], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 6, 10, 16, 22, 26] }
  },
  {
    name: "Dubstep",
    desc: "Heavy drops with wobble bass",
    pattern: { kick: [0, 14, 16, 30], snare: [8, 24], hihat: [0, 4, 8, 12, 16, 20, 24, 28], bass: [0, 2, 4, 6, 14, 16, 18, 20, 22, 30] }
  }
];

export const DEFAULT_SCENARIO = {
  id: -1, name: "Free Play", bpm: 100, desc: "Create anything you want!", locked: false, theme: "from-violet-500 to-fuchsia-500", bgClass: "bg-gradient-to-br from-violet-900 to-fuchsia-900", ambience: "studio",
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

      {/* Floating music notes - Replaced with Icons or simple text */}
      <div className="absolute top-1/4 left-1/4 text-4xl opacity-60" style={{ transform: `translateY(${Math.sin(Date.now() / 500) * 10}px)` }}>
        <Icons.Music className="w-12 h-12" />
      </div>
      <div className="absolute top-1/3 right-1/4 text-3xl opacity-50" style={{ transform: `translateY(${Math.sin(Date.now() / 600 + 1) * 8}px)` }}>
        <Icons.Music className="w-10 h-10" />
      </div>

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
    id: 0, name: "Sunny Vibes", bpm: 112, desc: "Bright, happy, and uplifting atmosphere", locked: false, theme: "from-yellow-400 to-orange-400", bgClass: "bg-sky-200", ambience: "beach",
    tutorial: [
      { text: "Welcome! Let's make a HAPPY beat! The KICK drum is the heartbeat - add kicks on beats 1, 3, 5, 7 plus a funky pickup!", targetInstrument: 'kick', targetSteps: [0, 8, 14, 16, 24, 30], soundVariant: 1 },
      { text: "Awesome! SNARE/CLAP on the backbeat (2, 4, 6, 8) - this groove makes everyone dance!", targetInstrument: 'snare', targetSteps: [4, 12, 20, 28], soundVariant: 1 },
      { text: "HI-HATS create the groove! 8th notes with an open hat accent for brightness!", targetInstrument: 'hihat', targetSteps: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], soundVariant: 0 },
      { text: "BASS adds the groove! Syncopated pattern that locks with the kick!", targetInstrument: 'bass', targetSteps: [0, 6, 8, 14, 16, 22, 24, 30], soundVariant: 1 },
      { text: "SYNTH adds chord stabs! Off-beat hits create that pop bounce!", targetInstrument: 'synth', targetSteps: [2, 6, 10, 18, 22, 26], soundVariant: 1 },
      { text: "PERCUSSION with shaker fills the gaps! Creates continuous movement!", targetInstrument: 'perc', targetSteps: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31], soundVariant: 1 },
      { text: "PERFECT! You made a full POP beat with 6 instruments! Hit PLAY!", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 8, 14, 16, 24, 30], snare: [4, 12, 20, 28], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 6, 8, 14, 16, 22, 24, 30], synth: [2, 6, 10, 18, 22, 26], perc: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-sky-400 to-sky-200 rounded-b-3xl">
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-green-400 to-green-300 rounded-t-[50%]"></div>
        <div className="absolute top-8 right-12 w-20 h-20 bg-yellow-300 rounded-full shadow-[0_0_60px_rgba(253,224,71,0.8)]" style={{ transform: `scale(${1 + pulse * 0.1})` }}></div>
        <div className="absolute top-16 left-16 w-28 h-10 bg-white/70 rounded-full blur-md"></div>
        <div className="absolute top-24 left-32 w-20 h-8 bg-white/50 rounded-full blur-md"></div>
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-5xl" style={{ transform: `translateX(-50%) scale(${1 + pulse * 0.2})` }}>
          <Icons.Sun className="w-16 h-16 text-yellow-500" />
        </div>
      </div>
    )
  },
  {
    id: 1, name: "Chill Night", bpm: 75, desc: "Relaxed, lo-fi, late night mood", locked: false, theme: "from-slate-600 to-indigo-800", bgClass: "bg-slate-900", ambience: "rain",
    tutorial: [
      { text: "Lo-Fi Tutorial! SLOWER tempo (75 BPM) with a SWUNG feel. Kicks on 1 and the 'and' of 2!", targetInstrument: 'kick', targetSteps: [0, 5, 16, 21], soundVariant: 2 },
      { text: "Lo-Fi snares are LAZY Ghost notes make it human! Main hits on 2 & 6 with soft flams!", targetInstrument: 'snare', targetSteps: [4, 7, 20, 23], soundVariant: 2 },
      { text: "Gentle hi-hats Swung 8ths with ghost notes create that dusty vinyl feel!", targetInstrument: 'hihat', targetSteps: [0, 3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31], soundVariant: 2 },
      { text: "RHODES KEYS are the soul! 7th chords on 1 and 5 with passing tones!", targetInstrument: 'keys', targetSteps: [0, 6, 16, 22], soundVariant: 1 },
      { text: "Mellow BASS walks through chord tones - jazzy and warm!", targetInstrument: 'bass', targetSteps: [0, 5, 8, 12, 16, 21, 24, 28], soundVariant: 2 },
      { text: "SYNTH PAD breathes in and out - long sustained atmosphere!", targetInstrument: 'synth', targetSteps: [0, 16], soundVariant: 0 },
      { text: "Beautiful! 6 layers of chill! The magic is in the SPACE between notes. PLAY!", targetInstrument: null, targetSteps: [] }
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
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-4xl" style={{ transform: `translateX(-50%) translateY(${pulse * -5}px)` }}>
          <Icons.Music className="w-16 h-16 text-indigo-300" />
        </div>
      </div>
    )
  },
  // ... (Other scenarios similar, replacing emojis with Icons or removing them)
];

// Re-export GAME_LEVELS with emojis replaced
export const GAME_LEVELS = [
  {
    id: 1,
    name: "First Beat",
    difficulty: "Beginner",
    stars: 0,
    maxStars: 3,
    xpReward: 50,
    icon: <Icons.Activity />,
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
      "Start with the KICK drum - it's the heartbeat of your music!",
      "Place kicks on beats 1 and 3 (steps 0, 8, 16, 24)",
      "Add SNARE on beats 2 and 4 (steps 4, 12, 20, 28) for the backbeat",
      "Hit PLAY to hear your creation!"
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
    icon: <Icons.Layers />,
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
      "Hi-hats create the 'tick-tick-tick' rhythm!",
      "Try placing hi-hats on every other step for 8th notes",
      "The hi-hat fills the space between kick and snare",
      "Experiment with different patterns!"
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
    icon: <Icons.Music />,
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
      "Bass usually follows the kick drum",
      "Try placing bass notes where your kicks are",
      "Add some bass notes in between for groove",
      "Lower sounds = more power!"
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
    icon: <Icons.Disc />,
    description: "Learn the classic house music pattern!",
    objective: "Create a house beat with kick on every beat",
    requirements: {
      instruments: ['kick', 'snare', 'hihat'],
      minNotes: 12,
      mustInclude: { kick: 4, snare: 2, hihat: 4 }
    },
    hints: [
      "'Four on the floor' means kick on beats 1, 2, 3, 4",
      "Place kicks on steps 0, 8, 16, 24",
      "Claps/snares go on 2 and 4 (steps 8, 24)",
      "Hi-hats go on the OFF-beats for that house bounce!"
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
    icon: <Icons.Zap />,
    description: "Add melody and chords with the synthesizer!",
    objective: "Create a beat using 4 different instruments including SYNTH",
    requirements: {
      instruments: ['kick', 'snare', 'hihat', 'synth'],
      minNotes: 12,
      mustInclude: { kick: 2, snare: 2, hihat: 4, synth: 2 }
    },
    hints: [
      "Synth adds melody and harmony to your beat",
      "Try placing synth notes on off-beats",
      "Synth chords work well with bass lines",
      "Less is more - don't overcrowd!"
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
    icon: <Icons.Layers />,
    description: "Layer percussion for complex rhythms!",
    objective: "Use 5 instruments including PERCUSSION",
    requirements: {
      instruments: ['kick', 'snare', 'hihat', 'perc', 'bass'],
      minNotes: 16,
      mustInclude: { kick: 2, snare: 2, hihat: 4, perc: 4, bass: 2 }
    },
    hints: [
      "Percussion adds texture and fills gaps",
      "Shakers and congas work great off the main beat",
      "Try polyrhythms - patterns that contrast!",
      "World music uses lots of percussion layers"
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
    icon: <Icons.Cloud />,
    description: "Create a relaxing lo-fi beat with keys!",
    objective: "Make a chill beat with KEYS and slow tempo",
    requirements: {
      instruments: ['kick', 'snare', 'hihat', 'keys', 'bass'],
      minNotes: 14,
      mustInclude: { kick: 2, snare: 2, hihat: 4, keys: 2, bass: 2 }
    },
    hints: [
      "Lo-fi beats are SLOW - around 70-85 BPM",
      "Keys add that jazzy, nostalgic feel",
      "Leave SPACE in your beat - silence is powerful",
      "Ghost notes (quiet hits) add human feel"
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
    icon: <Icons.Music />,
    description: "Use ALL instruments to create a full track!",
    objective: "Create a complete beat using 6+ instruments",
    requirements: {
      instruments: ['kick', 'snare', 'hihat', 'bass', 'synth', 'keys'],
      minNotes: 24,
      mustInclude: { kick: 4, snare: 4, hihat: 8, bass: 4, synth: 2, keys: 2 }
    },
    hints: [
      "Build in layers - start with drums, add bass, then melody",
      "Make sure instruments don't clash - give each space",
      "The best beats have contrast - loud and quiet parts",
      "You're ready to be a producer!"
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
    icon: <Icons.Zap />,
    description: "Fast tempo challenge - can you keep up?",
    objective: "Create a high-energy beat at 140+ BPM",
    requirements: {
      instruments: ['kick', 'snare', 'hihat', 'bass', 'synth'],
      minNotes: 20,
      mustInclude: { kick: 4, snare: 4, hihat: 8, bass: 2, synth: 2 }
    },
    hints: [
      "Fast tempos need simpler patterns",
      "Drum & Bass and Jungle run at 160-180 BPM!",
      "Keep the rhythm tight and punchy",
      "Less notes per bar at high speeds"
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
    icon: <Icons.Activity />,
    description: "The ultimate challenge - prove your mastery!",
    objective: "Create a complex beat with 7 instruments and 30+ notes",
    requirements: {
      instruments: ['kick', 'snare', 'hihat', 'bass', 'synth', 'keys', 'perc'],
      minNotes: 30,
      mustInclude: { kick: 4, snare: 4, hihat: 8, bass: 4, synth: 4, keys: 2, perc: 4 }
    },
    hints: [
      "This is everything you've learned combined!",
      "Think like a real producer - arrangement matters",
      "Use dynamics - vary the intensity",
      "You've mastered Rhythm Realm!"
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
