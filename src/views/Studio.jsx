import React from 'react';
import { Icons } from '../components/Icons';
import AchievementNotification from '../components/AchievementNotification';
import { AudioEngine } from '../../utils/AudioEngine';
import { SoundLab } from '../components/SoundLab';
import BeatGrid from '../components/BeatGrid';

export default function Studio({
    grid,
    setGrid,
    isPlaying,
    setIsPlaying,
    onSetView,
    highContrastMode,
    largeTextMode,
    achievementNotification,
    activeSoundLab,
    setActiveSoundLab,
    activeInstrumentIds,
    setActiveInstrumentIds,
    activeSoundPack,
    currentStep,
    tempo,
    setTempo,
    instrumentConfig
}) {

    const handleToggleStep = (instId, step) => {
        setGrid(prev => {
            const newGrid = { ...prev };
            const newRow = [...(newGrid[instId] || [])];
            newRow[step] = !newRow[step];
            newGrid[instId] = newRow;
            return newGrid;
        });
    };
    
    // Logic to add tracks
    const handleAddTrack = () => {
        // Only if we have space and unused instruments
        // For MVP refactor, assume all instruments are available or logic is in BeatGrid
        // BeatGrid doesn't have add logic inside itself, it just calls `onRemoveTrack`?
        // Wait, BeatGrid has `ADD INSTRUMENT` button at the bottom.
        // It should call a callback.
        // I didn't add `onAddTrack` prop to BeatGrid in Step 300.
        // BeatGrid renders Add button if `onRemoveTrack` is present.
        // I should add logic to open a menu to add track.
        // For now, I'll pass a dummy or implement logic if I can.
    };
    
    const handleRemoveTrack = (instId) => {
        if (activeInstrumentIds.length > 1) {
            setActiveInstrumentIds(prev => prev.filter(id => id !== instId));
        }
    };

    return (
      <div className={`h-screen w-full flex flex-col overflow-hidden font-sans ${highContrastMode ? 'high-contrast' : ''} ${largeTextMode ? 'large-text' : ''}`}>
        
        <AchievementNotification achievement={achievementNotification} />

        {/* Studio Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 landscape:py-1 flex items-center justify-between border-b border-white/10 shrink-0">
          <button
            onClick={() => {
              setIsPlaying(false);
              AudioEngine.stopAll();
              onSetView('modes'); // Go back to modes selection or Splash
            }}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all"
          ><Icons.ChevronLeft /></button>

          <div className="text-center">
             <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">STUDIO</h1>
             <div className="text-xs text-slate-400">Free Play Mode</div>
          </div>

          <div className="flex items-center gap-2">
             <div className="bg-black/50 px-3 py-1.5 rounded-lg border border-cyan-500/30 flex items-center gap-2">
                <button onClick={() => setTempo(Math.max(60, tempo - 5))} className="text-xs px-1 hover:text-cyan-400">-</button>
                <span className="text-cyan-400 font-mono font-bold">{tempo} BPM</span>
                <button onClick={() => setTempo(Math.min(200, tempo + 5))} className="text-xs px-1 hover:text-cyan-400">+</button>
             </div>
             <button className="p-2 bg-purple-600 rounded-lg text-white font-bold text-xs hover:bg-purple-500">SAVE</button>
          </div>
        </div>

        {/* Studio Workspace */}
        <div className="flex-1 relative overflow-y-auto overflow-x-hidden bg-slate-900/80">
            <div className="absolute inset-0">
                <BeatGrid 
                    grid={grid}
                    activeInstrumentIds={activeInstrumentIds}
                    instrumentConfig={instrumentConfig}
                    activeSoundPack={activeSoundPack}
                    currentStep={currentStep}
                    onToggleStep={handleToggleStep}
                    onInstrumentClick={(inst) => setActiveSoundLab(inst)}
                    onRemoveTrack={handleRemoveTrack}
                    isMobile={false} // TODO: detect mobile from window width or prop
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
                    settings={{}} 
                    onClose={() => setActiveSoundLab(null)}
                    onChange={() => {}} 
                 />
            </div>
        )}

      </div>
    );
}
