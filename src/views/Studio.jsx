import React, { useRef } from 'react';
import { Icons } from './components/Icons';
import AchievementNotification from './components/AchievementNotification';
import AudioEngine from '../utils/AudioEngine';
import { SoundLab } from './components/SoundLab';
import BeatGrid from './components/BeatGrid';

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
  activeTracks,
  setActiveTracks,
    activeSoundPack,
    currentStep,
    tempo,
    setTempo,
    instrumentConfig
}) {
  const fileInputRef = useRef(null);

  const handleToggleStep = (trackId, step) => {
        setGrid(prev => {
            const newGrid = { ...prev };
          const newRow = [...(newGrid[trackId] || [])];
            newRow[step] = !newRow[step];
          newGrid[trackId] = newRow;
            return newGrid;
        });
    };

    const handleAddTrack = () => {
    if (activeTracks.length >= 12) return;
    // Default to adding a new instrument type or duplicating last one?
    // Let's just add a random one/default one for now, or cycle.
    // Or simpler: Add 'kick' by default, user can change it?
    // Let's add 'perc' or 'fx' if missing, or just specific logic.
    // For MVP: Add 'perc' as default new track.
    const newId = `perc-${Date.now()}`;
    setActiveTracks(prev => [...prev, { id: newId, type: 'perc' }]);
    // Initialize grid for it
    setGrid(prev => ({
      ...prev,
      [newId]: Array(32).fill(false)
    }));
  };

  const handleRemoveTrack = (trackId) => {
    if (activeTracks.length > 1) {
      setActiveTracks(prev => prev.filter(t => t.id !== trackId));
    }
  };

  const handleExport = () => {
    const data = {
      version: '1.0',
      tempo,
      activeTracks,
      grid
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beat-${Date.now()}.json`;
    a.click();
    };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.tempo) setTempo(data.tempo);
        if (data.activeTracks) setActiveTracks(data.activeTracks);
        if (data.grid) setGrid(data.grid);
      } catch (err) {
        console.error("Failed to import beat", err);
        alert("Invalid beat file");
      }
      };
      reader.readAsText(file);
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
              onSetView('modes'); 
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
            <button onClick={handleExport} className="p-2 bg-indigo-600 rounded-lg text-white font-bold text-xs hover:bg-indigo-500">EXPORT</button>
            <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-purple-600 rounded-lg text-white font-bold text-xs hover:bg-purple-500">IMPORT</button>
            <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />
          </div>
        </div>

        {/* Studio Workspace */}
        <div className="flex-1 relative overflow-y-auto overflow-x-hidden bg-slate-900/80">
            <div className="absolute inset-0">
                <BeatGrid 
                    grid={grid}
              activeTracks={activeTracks}
                    instrumentConfig={instrumentConfig}
                    activeSoundPack={activeSoundPack}
                    currentStep={currentStep}
                    onToggleStep={handleToggleStep}
              onInstrumentClick={(instType) => setActiveSoundLab(instType)}
                    onRemoveTrack={handleRemoveTrack}
              onAddTrack={handleAddTrack}
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
                    settings={{}} 
                    onClose={() => setActiveSoundLab(null)}
                    onChange={() => {}} 
                 />
            </div>
        )}

      </div>
    );
}
