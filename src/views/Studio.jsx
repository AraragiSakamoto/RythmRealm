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
        {/* Studio Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 landscape:py-1 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSetView('home')}
              className="p-2 mr-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Icons.ChevronLeft />
            </button>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span className="text-2xl">🎛️</span>
              STUDIO
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-black/50 px-3 py-1.5 rounded-lg border border-cyan-500/30 flex items-center gap-2 mr-4">
              <button onClick={() => setTempo(Math.max(60, tempo - 5))} className="text-xs px-1 hover:text-cyan-400 font-bold">-</button>
              <span className="text-cyan-400 font-mono font-bold w-16 text-center">{tempo} BPM</span>
              <button onClick={() => setTempo(Math.min(200, tempo + 5))} className="text-xs px-1 hover:text-cyan-400 font-bold">+</button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              className="hidden"
              accept=".json"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 text-xs font-bold transition-all flex items-center gap-2"
              title="Import Beat"
            >
              <Icons.Upload className="w-4 h-4" />
              <span className="hidden sm:inline">IMPORT</span>
            </button>

            <button
              onClick={handleExport}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-bold transition-all flex items-center gap-2"
              title="Export Beat"
            >
              <Icons.Download className="w-4 h-4" />
              <span className="hidden sm:inline">EXPORT</span>
            </button>

            <div className="h-6 w-px bg-white/10 mx-2"></div>

            <button
              onClick={() => {
                AudioEngine.init();
                setIsPlaying(!isPlaying);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {isPlaying ? <Icons.Pause /> : <Icons.Play />}
            </button>
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
