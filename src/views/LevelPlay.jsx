import React from 'react';
import { Icons } from './components/Icons';
import AchievementNotification from './components/AchievementNotification';
import AudioEngine from '../utils/AudioEngine';
import { checkLevelCompletion } from '../utils/gameLogic';
import { SoundLab } from './components/SoundLab';
import BeatGrid from './components/BeatGrid';

export default function LevelPlay({
    currentLevel,
    grid,
    setGrid,
    isPlaying,
    setIsPlaying,
    onSetView,
    highContrastMode,
    largeTextMode,
    achievementNotification,
    showNextHint,
    showHint,
    currentHintIndex,
    showLevelTutorial,
    setShowLevelTutorial,
    activeSoundLab,
    setActiveSoundLab,

  activeTracks, // Updated from activeInstrumentIds
    instrumentConfig,
    activeSoundPack,
    currentStep,
    tutorialActive
}) {
    if (!currentLevel) return null;
    
    // Calculate completion dynamically
    const completion = checkLevelCompletion(grid, currentLevel);

    const handleToggleStep = (instId, step) => {
        // Here we could add logic to prevent editing locked notes if the level dictates
        // For now, allow editing
        setGrid(prev => {
            const newGrid = { ...prev };
            const newRow = [...(newGrid[instId] || [])];
            newRow[step] = !newRow[step];
            newGrid[instId] = newRow;
            return newGrid;
        });
    };

  // Prepare Guide Pattern for Tutorial Mode
  // Mapping keys (kick, snare) to activeTracks logic is complex if multiple tracks exist.
  // For levels, we assume tracks match types usually.
  const guidePattern = currentLevel.premadePattern;

    return (
      <div className={`h-screen w-full flex flex-col overflow-hidden font-sans ${highContrastMode ? 'high-contrast' : ''} ${largeTextMode ? 'large-text' : ''} bg-slate-950`}>
        
        <AchievementNotification achievement={achievementNotification} />

        {/* Level Header */}
        <div className="glass-panel border-b border-white/10 px-4 py-3 landscape:py-1 flex items-center justify-between shrink-0 z-20">
          <button
            onClick={() => {
              setIsPlaying(false);
              AudioEngine.stopAll();
              onSetView('levels');
            }}
            className="glass-button p-2 rounded-xl text-white hover:text-neon-cyan"
          ><Icons.ChevronLeft /></button>

          <div className="text-center">
            <div className="flex items-center gap-2 justify-center">
              <span className="text-xl filter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{currentLevel.icon}</span>
              <span className="font-display font-black text-white text-xl tracking-wide">{currentLevel.name}</span>
            </div>
            <div className="text-xs text-neon-purple font-bold tracking-widest">{currentLevel.difficulty.toUpperCase()}</div>
          </div>

          <button
            onClick={showNextHint}
            className={`
              relative group overflow-hidden px-4 py-2 rounded-full font-bold transition-all duration-300 border
              ${currentLevel.hints
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'bg-white/5 text-slate-500 border-white/5 cursor-not-allowed'}
            `}
          >
            <div className="flex items-center gap-2 relative z-10">
              <span className="text-lg filter drop-shadow">💡</span>
              <span className="tracking-wide text-xs font-display hidden sm:inline">HINT</span>
            </div>
          </button>
        </div>

        {/* Level 1 Tutorial Overlay - Styled */}
        {currentLevel.id === 1 && showLevelTutorial && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="glass-panel border-2 border-neon-cyan rounded-3xl p-8 max-w-lg w-full shadow-[0_0_50px_rgba(6,182,212,0.2)] pointer-events-auto animate-bounce-in text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan to-neon-purple"></div>
              <div className="w-20 h-20 bg-neon-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-neon-cyan/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <span className="text-4xl animate-pulse-slow">👋</span>
                </div>
              <h2 className="text-4xl font-display font-black text-white mb-3 tracking-tight">Welcome to the Studio!</h2>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                You've got a <span className="text-neon-cyan font-bold">Rock Beat</span> started.
                    <br />
                Your goal is to <span className="text-white font-bold border-b-2 border-neon-purple">finish the pattern</span>.
                </p>
                <div className="space-y-4">
                    <button
                        onClick={() => setShowLevelTutorial(false)}
                  className="w-full py-4 bg-gradient-to-r from-neon-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-2xl font-display font-black text-xl text-white shadow-lg transition-all transform hover:scale-[1.02]"
                    >
                        GOT IT, LET'S ROCK! 🤘
                    </button>
                <button onClick={() => setShowLevelTutorial(false)} className="text-slate-500 hover:text-white font-bold text-sm transition-colors">Skip Tutorial</button>
                </div>
            </div>
          </div>
        )}

        {/* Objective Banner */}
        <div className="glass-panel border-b border-white/5 px-4 py-2 flex flex-col items-center justify-center shrink-0 z-10 space-y-2">
          <div className="text-white font-bold text-sm font-display tracking-wide">{currentLevel.objective}</div>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(currentLevel.requirements?.mustInclude || {}).map(([inst, count]) => {
              const current = grid[inst]?.filter(Boolean).length || 0;
              const met = current >= count;
              return (
                <div key={inst} className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold border ${met ? 'bg-green-500/20 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(74,222,128,0.2)]' : 'bg-white/5 text-slate-400 border-white/10'}`}>
                  {inst}: {current}/{count} {met && '✔'}
                </div>
              );
            })}
          </div>
        </div>

        {/* Hint Popup */}
        {showHint && currentLevel.hints && (
          <div className="absolute top-32 left-1/2 -translate-x-1/2 z-50 bg-amber-500/90 backdrop-blur-md text-black px-6 py-4 rounded-2xl shadow-2xl max-w-sm text-center font-bold animate-bounce-in border-2 border-amber-300">
            {currentLevel.hints[currentHintIndex]}
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-black/40 px-4 py-2 shrink-0 border-t border-white/5">
          <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">
            <span>Completion</span>
            <span className={completion.score >= 100 ? 'text-neon-green' : 'text-neon-purple'}>{completion.score}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${completion.score >= 100 ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'bg-neon-purple shadow-[0_0_10px_rgba(167,139,250,0.5)]'}`}
              style={{ width: `${Math.min(100, completion.score)}%` }}
            ></div>
          </div>
        </div>

        {/* Grid Area - Remodeled */}
        <div className="flex-1 relative overflow-y-auto overflow-x-hidden bg-gradient-to-b from-slate-900/50 to-black/80 flex items-center justify-center p-4">
          <div className={`
                w-full max-w-6xl mx-auto transition-all duration-500
                ${isPlaying ? 'scale-[1.02] filter brightness-110' : 'scale-100'}
            `}>
                <BeatGrid 
                    grid={grid}
              activeTracks={activeTracks || []}
                    instrumentConfig={instrumentConfig}
                    activeSoundPack={activeSoundPack}
                    currentStep={currentStep}
                    onToggleStep={handleToggleStep}
              onInstrumentClick={(inst) => setActiveSoundLab(inst)}
              lockedInstruments={[]} 
                    tutorialActive={tutorialActive}
              guidePattern={currentLevel.id <= 5 ? currentLevel.premadePattern : null}
              isMobile={false} 
                />
            </div>

          {/* Play Controls - Remodeled Floating Bar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-full shadow-2xl z-30">
                 <button
                    onClick={() => {
                        AudioEngine.init();
                        setIsPlaying(!isPlaying);
                    }}
              className={`
                        w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] border-2 border-white/10
                        ${isPlaying
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                  : 'bg-green-500 hover:bg-green-600 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-110'}
                    `}
                  >
              {isPlaying ? <Icons.Pause className="w-6 h-6 text-white" /> : <Icons.Play className="w-6 h-6 text-white ml-1" />}
                  </button>

            <div className="h-8 w-px bg-white/10"></div>

            <div className="flex flex-col text-xs font-bold text-slate-400">
              <span>TEMPO</span>
              <span className="text-white text-lg leading-none">{currentLevel.tempo || 120}</span>
            </div>
            </div>
        </div>
        
        {/* Sound Lab Modal */}
        {activeSoundLab && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                 <SoundLab 
                    instrument={activeSoundLab} 
                    settings={{}} // Needs settings passed down
                    onClose={() => setActiveSoundLab(null)}
                    onChange={() => {}} 
                 />
            </div>
        )}

      </div>
    );
}
