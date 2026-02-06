import React from 'react';
import { Icons } from '../components/Icons';
import AchievementNotification from '../components/AchievementNotification';
import { AudioEngine } from '../../utils/AudioEngine';
import { checkLevelCompletion } from '../../utils/gameLogic';
import { SoundLab } from '../components/SoundLab';
import BeatGrid from '../components/BeatGrid';

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
      <div className={`h-screen w-full flex flex-col overflow-hidden font-sans ${highContrastMode ? 'high-contrast' : ''} ${largeTextMode ? 'large-text' : ''}`}>
        
        <AchievementNotification achievement={achievementNotification} />

        {/* Level Header */}
        <div className="bg-gradient-to-r from-purple-900 to-pink-900 px-4 py-3 landscape:py-1 flex items-center justify-between border-b border-white/10 shrink-0">
          <button
            onClick={() => {
              setIsPlaying(false);
              AudioEngine.stopAll();
              onSetView('levels');
            }}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all"
          ><Icons.ChevronLeft /></button>

          <div className="text-center">
            <div className="flex items-center gap-2 justify-center">
              <span className="text-xl">{currentLevel.icon}</span>
              <span className="font-black text-white text-lg">{currentLevel.name}</span>
            </div>
            <div className="text-xs text-purple-300">{currentLevel.difficulty}</div>
          </div>

          <button
            onClick={showNextHint}
            className={`
              relative group overflow-hidden px-4 py-2 rounded-full font-bold transition-all duration-300
              ${currentLevel.hints
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-[0_0_15px_rgba(251,191,36,0.4)] hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] hover:scale-105'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
            `}
          >
            <div className="flex items-center gap-2 relative z-10">
              <span className="text-lg filter drop-shadow">💡</span>
              <span className="tracking-wide text-sm hidden sm:inline">HINT</span>
            </div>
          </button>
        </div>

        {/* Level 1 Tutorial Overlay */}
        {currentLevel.id === 1 && showLevelTutorial && (
          <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
            <div className="bg-slate-900/95 border-2 border-cyan-500 rounded-3xl p-8 max-w-lg w-full shadow-2xl pointer-events-auto animate-bounce-in text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 to-purple-500"></div>
                <div className="w-20 h-20 bg-cyan-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-cyan-400/30">
                    <span className="text-4xl">👋</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-3">Welcome to the Studio!</h2>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                    You've got a <span className="text-cyan-400 font-bold">Rock Beat</span> started.
                    <br />
                    Your goal is to <span className="text-white font-bold border-b-2 border-purple-500">finish the pattern</span>.
                </p>
                <div className="space-y-4">
                    <button
                        onClick={() => setShowLevelTutorial(false)}
                        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-2xl font-black text-xl text-white shadow-lg transition-all"
                    >
                        GOT IT, LET'S ROCK! 🤘
                    </button>
                    <button onClick={() => setShowLevelTutorial(false)} className="text-slate-500 font-bold text-sm">Skip</button>
                </div>
            </div>
          </div>
        )}

        {/* Objective Banner */}
        <div className="bg-slate-800/80 px-4 py-3 landscape:py-1 text-center border-b border-slate-700 shrink-0">
          <div className="text-white font-bold landscape:text-sm">{currentLevel.objective}</div>
          <div className="flex flex-wrap justify-center gap-2 mt-2 landscape:mt-0 landscape:gap-1">
            {Object.entries(currentLevel.requirements?.mustInclude || {}).map(([inst, count]) => {
              const current = grid[inst]?.filter(Boolean).length || 0;
              const met = current >= count;
              return (
                <div key={inst} className={`px-2 py-1 rounded-lg text-xs font-bold ${met ? 'bg-green-500/30 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                  {inst.toUpperCase()}: {current}/{count} {met && '✔'}
                </div>
              );
            })}
          </div>
        </div>

        {/* Hint Popup */}
        {showHint && currentLevel.hints && (
          <div className="absolute top-32 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-black px-6 py-3 rounded-2xl shadow-2xl max-w-sm text-center font-bold animate-bounce-in">
            {currentLevel.hints[currentHintIndex]}
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-slate-900 px-4 py-2 landscape:py-1 shrink-0">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Completion</span>
            <span className={completion.score >= 100 ? 'text-green-400' : ''}>{completion.score}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${completion.score >= 100 ? 'bg-green-500' : 'bg-purple-500'}`}
              style={{ width: `${Math.min(100, completion.score)}%` }}
            ></div>
          </div>
        </div>

        {/* Grid Area */}
        <div className="flex-1 relative overflow-y-auto overflow-x-hidden bg-slate-900/80">
            <div className="absolute inset-0">
                <BeatGrid 
                    grid={grid}
              activeTracks={activeTracks || []}
              // activeInstrumentIds removed
                    instrumentConfig={instrumentConfig}
                    activeSoundPack={activeSoundPack}
                    currentStep={currentStep}
                    onToggleStep={handleToggleStep}
                    onInstrumentClick={(inst) => setActiveSoundLab(inst)}
                    // onRemoveTrack not enabled in levels usually
              lockedInstruments={[]} 
                    tutorialActive={tutorialActive}
              guidePattern={currentLevel.id <= 5 ? currentLevel.premadePattern : null} // Enable guides for early levels
              isMobile={false} 
                />
            </div>
             {/* Play Controls Overlay */}
            <div className="absolute bottom-6 right-6 flex items-center gap-4 pointer-events-auto">
                 <button
                    onClick={() => {
                        AudioEngine.init();
                        setIsPlaying(!isPlaying);
                    }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all shadow-lg ${isPlaying ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-green-500 hover:bg-green-600'}`}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
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
