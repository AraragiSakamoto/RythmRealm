import React from 'react';
import { PixelMusicBackground } from './components/PixelMusicBackground';
import VoiceControlIndicator from './components/VoiceControlIndicator';
import { Icons } from './components/Icons';
import { DJ_TRACKS, DJ_BEATS, DJ_TUTORIAL_STEPS, EFFECT_PADS } from '../utils/dj_data';
import AudioEngine from '../utils/AudioEngine';
import { SOUND_VARIANTS, STEPS } from '../utils/constants';

export default function DJMode({
    djDecks,
    setDjDecks,
    djLooping,
    setDjLooping,
    djCrossfader,
    setDjCrossfader,
    djTutorialActive,
    setDjTutorialActive,
    djTutorialStep,
    setDjTutorialStep,
    tempo,
    setTempo,
    isPlaying,
    setIsPlaying,
    onSetView,
    highContrastMode,
    largeTextMode,
    voiceControlEnabled,
    isListening,
    lastVoiceCommand,
    currentStep,
    setGrid,
    setActiveInstrumentIds,
    setCurrentStep
}) {

    const currentDjTutorial = DJ_TUTORIAL_STEPS[djTutorialStep];

    const handleDjTutorialAction = (action) => {
      if (!djTutorialActive) return;

      if (djTutorialStep === 1 && action === 'play') {
        setTimeout(() => setDjTutorialStep(2), 500);
      } else if (djTutorialStep === 3 && action === 'crossfader') {
        setTimeout(() => setDjTutorialStep(4), 500);
      } else if (djTutorialStep === 4 && action === 'fx') {
        setTimeout(() => setDjTutorialStep(5), 500);
      } else if (djTutorialStep === 5 && action === 'bpm') {
        setTimeout(() => setDjTutorialStep(6), 500);
      } else if (djTutorialStep === 6 && action === 'loop') {
        setTimeout(() => setDjTutorialStep(7), 500);
      }
    };

    const loadDeckBeat = (deck, beat) => {
        // If same beat is already loaded, unload it (toggle off)
        if (djDecks[deck]?.id === beat.id) {
          unloadDeck(deck);
          return;
        }
  
        setDjDecks(prev => ({ ...prev, [deck]: beat }));
        setTempo(beat.bpm);
        // Load the pattern into the grid
        const newGrid = {};
        Object.keys(SOUND_VARIANTS).forEach(key => newGrid[key] = Array(STEPS).fill(false));
        Object.entries(beat.pattern).forEach(([inst, steps]) => {
          if (newGrid[inst]) {
            steps.forEach(step => {
              if (step < STEPS) newGrid[inst][step] = true;
            });
          }
        });
        setGrid(newGrid);
        setActiveInstrumentIds(Object.keys(beat.pattern));
  
        // Auto-advance DJ tutorial
        if (djTutorialActive) {
          if (djTutorialStep === 0 && deck === 'left') {
            setTimeout(() => setDjTutorialStep(1), 500);
          } else if (djTutorialStep === 2 && deck === 'right') {
            setTimeout(() => setDjTutorialStep(3), 500);
          }
        }
    };
  
    const unloadDeck = (deck) => {
        setDjDecks(prev => ({ ...prev, [deck]: null }));
        setDjLooping(prev => ({ ...prev, [deck]: false }));
        // Clear the grid if no decks are loaded
        const otherDeck = deck === 'left' ? 'right' : 'left';
        if (!djDecks[otherDeck]) {
          const newGrid = {};
          Object.keys(SOUND_VARIANTS).forEach(key => newGrid[key] = Array(STEPS).fill(false));
          setGrid(newGrid);
        }
    };

    const triggerDjEffect = (effectId) => {
        AudioEngine.init();
        // Since AudioEngine singleton doesn't expose public methods for specific FX generation 
        // (logic was inline in app.jsx), we should ideally move that logic to AudioEngine.
        // For now, I will assume AudioEngine has a method `playEffect` or similar, 
        // OR I should have extracted `triggerDjEffect` to `src/utils/audioEffects.js`.
        
        // I'll call a hypothetical method on AudioEngine or just log warning.
        // Real implementation requires moving the oscillator logic from App.jsx to AudioEngine.js.
        if (AudioEngine.triggerDjEffect) {
            AudioEngine.triggerDjEffect(effectId);
        } else {
            console.warn("AudioEngine.triggerDjEffect not implemented yet. Please extract it.");
        }
    };

    return (
        <div className={`h-screen w-full text-white flex flex-col overflow-hidden font-sans relative bg-gradient-to-b from-gray-900 via-slate-900 to-black ${highContrastMode ? 'high-contrast' : ''} ${largeTextMode ? 'large-text' : ''}`} role="main" aria-label="DJ Mode - Live Performance Studio">
        {/* Landscape Mode Hint Overlay */}
        <div className="landscape-hint hidden fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-8 text-center backdrop-blur-xl">
          <div className="text-6xl mb-6 animate-bounce">📱</div>
          <h2 className="text-3xl font-black text-white mb-4">Please Rotate Your Device</h2>
          <p className="text-xl text-slate-400">Rhythm Realm is best experienced in landscape mode for the full studio experience.</p>
          <div className="mt-8 w-16 h-16 border-4 border-slate-600 rounded-xl animate-spin-slow"></div>
        </div>
        
        <a href="#dj-decks" className="skip-link">Skip to DJ controls</a>
        <VoiceControlIndicator enabled={voiceControlEnabled} isListening={isListening} lastCommand={lastVoiceCommand} />

        {/* DJ Tutorial Overlay */}
        {djTutorialActive && currentDjTutorial && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] animate-bounce-in" role="dialog" aria-modal="true" aria-label="DJ Tutorial">
            <div className="bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl p-4 shadow-2xl border-2 border-white/30">
              <div className="flex items-start gap-3">
                <div className="text-3xl animate-bounce" aria-hidden="true">
                  {djTutorialStep === 0 && '👠'}
                  {djTutorialStep === 1 && '▶️ '}
                  {djTutorialStep === 2 && '💿'}
                  {djTutorialStep === 3 && '🎚️ '}
                  {djTutorialStep === 4 && '🎛️ '}
                  {djTutorialStep === 5 && '⚡'}
                  {djTutorialStep === 6 && '🔁'}
                  {djTutorialStep === 7 && '🎉'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                      Step {djTutorialStep + 1}/{DJ_TUTORIAL_STEPS.length}
                    </span>
                    <button
                      onClick={() => setDjTutorialActive(false)}
                      className="text-white/60 hover:text-white text-xs"
                    >
                      Skip ✔️
                    </button>
                  </div>
                  <h3 className="font-black text-lg mb-1">{currentDjTutorial.title}</h3>
                  <p className="text-sm text-white/90 leading-snug">{currentDjTutorial.text}</p>
                  {djTutorialStep === 7 && (
                    <button
                      onClick={() => setDjTutorialActive(false)}
                      className="mt-3 w-full py-2 bg-white text-purple-600 font-bold rounded-xl hover:bg-white/90 transition-all"
                    >
                      Start Mixing! 🎧
                    </button>
                  )}
                </div>
              </div>
            </div>
            {/* Arrow pointing to target */}
            {currentDjTutorial.target && (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-purple-600"></div>
            )}
          </div>
        )}

        {/* DJ Header */}
        <div className="relative z-10 px-4 py-3 flex items-center justify-between border-b border-cyan-500/30 bg-black/60 backdrop-blur-md">
          <button onClick={() => { setIsPlaying(false); setDjTutorialActive(false); onSetView('splash'); }} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all">
            <Icons.ChevronLeft />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-pulse">🎧</span>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">DJ MODE</h1>
              <div className="text-xs text-cyan-400/70">Live Performance</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setDjTutorialActive(!djTutorialActive); setDjTutorialStep(0); }}
              className={`p-2 rounded-xl transition-all ${djTutorialActive ? 'bg-purple-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
              title="DJ Tutorial"
            >
              <Icons.GradCap />
            </button>
            <div className="bg-black/50 px-3 py-1.5 rounded-lg border border-cyan-500/30">
              <span className="text-cyan-400 font-mono font-bold">{tempo} BPM</span>
            </div>
          </div>
        </div>

        {/* Main DJ Interface */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* TRENDING TRACKS Section */}
          <div className={`bg-gradient-to-r from-purple-900/40 via-slate-800/60 to-cyan-900/40 rounded-2xl p-4 border border-white/20 transition-all ${djTutorialActive && djTutorialStep === 0 ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-black flex items-center gap-2">
                <span className="text-2xl">🔥</span> TRENDING TRACKS
              </h2>
              <span className="text-xs text-white/50">Tap to load • {DJ_TRACKS.length} tracks</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
              {DJ_TRACKS.map(track => (
                <button
                  key={track.id}
                  onClick={() => loadDeckBeat('left', track)}
                  className={`p-2 bg-gradient-to-br ${track.color} rounded-xl text-left transition-all hover:scale-105 active:scale-95 shadow-lg`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{track.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black truncate">{track.name}</div>
                      <div className="text-[9px] opacity-70 truncate">{track.artist}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[8px] bg-black/30 px-1.5 py-0.5 rounded">{track.bpm} BPM</span>
                    <span className="text-[8px] bg-black/30 px-1.5 py-0.5 rounded">{track.genre}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Turntables Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Deck */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
              <div className="text-center mb-3">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Deck A</span>
                <div className="text-lg font-black mt-1">{djDecks.left?.name || 'Empty'}</div>
                {djDecks.left?.artist && <div className="text-xs text-cyan-400/70">{djDecks.left.artist}</div>}
              </div>

              {/* Turntable */}
              <div className="relative w-full aspect-square max-w-[150px] mx-auto mb-3">
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border-4 border-slate-600 shadow-inner flex items-center justify-center ${isPlaying && djDecks.left ? 'animate-spin-slow' : ''}`}
                  style={{ animationDuration: '2s' }}
                >
                  <div className={`w-1/3 h-1/3 rounded-full bg-gradient-to-br ${djDecks.left?.color || 'from-cyan-500 to-blue-600'} flex items-center justify-center text-2xl shadow-lg`}>
                    {djDecks.left?.icon || '💿'}
                  </div>
                  {/* Vinyl grooves */}
                  <div className="absolute inset-4 rounded-full border border-slate-600/50"></div>
                  <div className="absolute inset-8 rounded-full border border-slate-600/30"></div>
                  <div className="absolute inset-12 rounded-full border border-slate-600/20"></div>
                </div>
                {/* Tonearm */}
                <div className={`absolute -right-2 top-0 w-1 h-16 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full origin-top transition-transform ${djDecks.left ? 'rotate-[30deg]' : 'rotate-0'}`}></div>
              </div>

              {/* Deck Controls */}
              <div className={`flex justify-center gap-2 mb-3 transition-all ${djTutorialActive && djTutorialStep === 6 ? 'ring-2 ring-yellow-400 rounded-xl p-1' : ''}`}>
                <button
                  onClick={() => { if (djDecks.left) { setDjLooping(p => ({ ...p, left: !p.left })); handleDjTutorialAction('loop'); } }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${djLooping.left ? 'bg-cyan-500 text-black' : 'bg-slate-700 hover:bg-slate-600'}`}
                >
                  🔁 LOOP
                </button>
                <button
                  onClick={() => djDecks.left && triggerDjEffect('scratch')}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold transition-all"
                >
                  💿 SCRATCH
                </button>
                {djDecks.left && (
                  <button
                    onClick={() => unloadDeck('left')}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-bold transition-all"
                    title="Eject track"
                  >
                    ⏏️ EJECT
                  </button>
                )}
              </div>

              {/* Quick Beat Selector */}
              <div className="grid grid-cols-2 gap-1.5">
                {DJ_BEATS.slice(0, 4).map(beat => (
                  <button
                    key={beat.id}
                    onClick={() => loadDeckBeat('left', beat)}
                    className={`p-2 rounded-lg text-xs font-bold transition-all ${djDecks.left?.id === beat.id ? 'bg-cyan-500 text-black' : 'bg-slate-700 hover:bg-slate-600'}`}
                  >
                    {beat.icon} {beat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Deck */}
            <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-purple-500/30 shadow-lg shadow-purple-500/10 transition-all ${djTutorialActive && djTutorialStep === 2 ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}>
              <div className="text-center mb-3">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Deck B</span>
                <div className="text-lg font-black mt-1">{djDecks.right?.name || 'Empty'}</div>
                {djDecks.right?.artist && <div className="text-xs text-purple-400/70">{djDecks.right.artist}</div>}
              </div>

              {/* Turntable */}
              <div className="relative w-full aspect-square max-w-[150px] mx-auto mb-3">
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border-4 border-slate-600 shadow-inner flex items-center justify-center ${isPlaying && djDecks.right ? 'animate-spin-slow' : ''}`}
                  style={{ animationDuration: '2s' }}
                >
                  <div className={`w-1/3 h-1/3 rounded-full bg-gradient-to-br ${djDecks.right?.color || 'from-purple-500 to-pink-600'} flex items-center justify-center text-2xl shadow-lg`}>
                    {djDecks.right?.icon || '💿'}
                  </div>
                  <div className="absolute inset-4 rounded-full border border-slate-600/50"></div>
                  <div className="absolute inset-8 rounded-full border border-slate-600/30"></div>
                  <div className="absolute inset-12 rounded-full border border-slate-600/20"></div>
                </div>
                <div className={`absolute -right-2 top-0 w-1 h-16 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full origin-top transition-transform ${djDecks.right ? 'rotate-[30deg]' : 'rotate-0'}`}></div>
              </div>

              {/* Deck Controls */}
              <div className={`flex justify-center gap-2 mb-3 transition-all ${djTutorialActive && djTutorialStep === 6 ? 'ring-2 ring-yellow-400 rounded-xl p-1' : ''}`}>
                <button
                  onClick={() => { if (djDecks.right) { setDjLooping(p => ({ ...p, right: !p.right })); handleDjTutorialAction('loop'); } }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${djLooping.right ? 'bg-purple-500 text-black' : 'bg-slate-700 hover:bg-slate-600'}`}
                >
                  🔁 LOOP
                </button>
                <button
                  onClick={() => djDecks.right && triggerDjEffect('scratch')}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold transition-all"
                >
                  💿 SCRATCH
                </button>
                {djDecks.right && (
                  <button
                    onClick={() => unloadDeck('right')}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-bold transition-all"
                    title="Eject track"
                  >
                    ⏏️ EJECT
                  </button>
                )}
              </div>

              {/* Quick Beat Selector */}
              <div className="grid grid-cols-2 gap-1.5">
                {DJ_BEATS.slice(4, 8).map(beat => (
                  <button
                    key={beat.id}
                    onClick={() => loadDeckBeat('right', beat)}
                    className={`p-2 rounded-lg text-xs font-bold transition-all ${djDecks.right?.id === beat.id ? 'bg-purple-500 text-black' : 'bg-slate-700 hover:bg-slate-600'}`}
                  >
                    {beat.icon} {beat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Crossfader */}
          <div className={`bg-gradient-to-r from-cyan-900/30 via-slate-800 to-purple-900/30 rounded-2xl p-4 border border-white/10 transition-all ${djTutorialActive && djTutorialStep === 3 ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-400">A</span>
              <span className="text-sm font-black text-white/80">CROSSFADER</span>
              <span className="text-xs font-bold text-purple-400">B</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={djCrossfader}
              onChange={(e) => { setDjCrossfader(Number(e.target.value)); handleDjTutorialAction('crossfader'); }}
              className="w-full h-3 bg-gradient-to-r from-cyan-500 via-slate-600 to-purple-500 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${djCrossfader}%, #a855f7 ${djCrossfader}%, #a855f7 100%)`
              }}
            />
          </div>

          {/* Transport & BPM */}
          <div className="flex gap-4">
            {/* Play Controls */}
            <div className={`flex-1 bg-slate-800/80 rounded-2xl p-4 border border-white/10 flex items-center justify-center gap-4 transition-all ${djTutorialActive && djTutorialStep === 1 ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}>
              <button
                onClick={() => setCurrentStep(0)}
                className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center text-xl transition-all"
              >
                ⏮
              </button>
              <button
                onClick={() => { AudioEngine.init(); setIsPlaying(!isPlaying); handleDjTutorialAction('play'); }}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all shadow-lg ${isPlaying ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-green-500 hover:bg-green-600'}`}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                onClick={() => setCurrentStep(0)}
                className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center text-xl transition-all"
              >
                ⏭
              </button>
            </div>

            {/* BPM Control */}
            <div className={`bg-slate-800/80 rounded-2xl p-4 border border-white/10 transition-all ${djTutorialActive && djTutorialStep === 5 ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}>
              <div className="text-xs font-bold text-white/60 mb-2 text-center">BPM</div>
              <div className="flex items-center gap-1">
                <button onClick={() => { setTempo(t => Math.max(60, t - 5)); handleDjTutorialAction('bpm'); }} className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-sm">-5</button>
                <button onClick={() => { setTempo(t => Math.max(60, t - 1)); handleDjTutorialAction('bpm'); }} className="px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded-lg font-bold text-xs">-1</button>
                <div className="w-12 text-center font-mono text-xl font-black text-cyan-400">{tempo}</div>
                <button onClick={() => { setTempo(t => Math.min(200, t + 1)); handleDjTutorialAction('bpm'); }} className="px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded-lg font-bold text-xs">+1</button>
                <button onClick={() => { setTempo(t => Math.min(200, t + 5)); handleDjTutorialAction('bpm'); }} className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-sm">+5</button>
              </div>
            </div>
          </div>

          {/* Effect Pads */}
          <div className={`bg-slate-800/80 rounded-2xl p-4 border border-white/10 transition-all ${djTutorialActive && djTutorialStep === 4 ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}>
            <div className="text-sm font-black text-white/80 mb-3 flex items-center gap-2">
              <span className="text-xl">🎛️</span> FX PADS
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {EFFECT_PADS.map(pad => (
                    <button
                        key={pad.id}
                        onClick={() => { triggerDjEffect(pad.id); handleDjTutorialAction('fx'); }}
                        className={`aspect-square rounded-xl bg-gradient-to-br ${pad.color} flex flex-col items-center justify-center gap-1 hover:scale-105 active:scale-90 transition-all shadow-lg active:shadow-none bg-opacity-80 hover:bg-opacity-100`}
                    >
                        <span className="text-2xl">{pad.icon}</span>
                        <span className="text-[10px] font-bold bg-black/20 px-1 rounded">{pad.name}</span>
                    </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
}
