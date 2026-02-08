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
    const newId = `perc-${Date.now()}`;
      setActiveTracks(prev => [...prev, { id: newId, type: 'perc' }]);
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
      <div className={`h-screen w-full flex flex-col overflow-hidden font-sans bg-surface-dark ${highContrastMode ? 'high-contrast' : ''} ${largeTextMode ? 'large-text' : ''}`}>
        
        <AchievementNotification achievement={achievementNotification} />

        {/* Studio Header */}
        <div className="glass-panel z-20 px-6 py-4 flex items-center justify-between border-b border-white/5 shrink-0 relative">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onSetView('home')}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 hover:scale-110 transition-all text-slate-300 hover:text-white"
            >
              <Icons.ChevronLeft className="w-6 h-6" />
            </button>

            <div className="h-8 w-px bg-white/10 mx-2"></div>

            <h1 className="text-xl font-display font-bold text-white tracking-widest flex items-center gap-3">
              <span className="text-2xl animate-pulse-slow">🎛️</span>
              <span className="bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent">STUDIO</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* BPM Control */}
            <div className="glass-button px-4 py-2 rounded-xl flex items-center gap-4 mr-4 border-neon-cyan/20">
              <span className="text-xs font-bold text-neon-cyan tracking-widest">BPM</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setTempo(Math.max(60, tempo - 5))} className="hover:text-neon-cyan transition-colors text-lg active:scale-90">-</button>
                <span className="font-mono font-bold text-white w-12 text-center text-lg">{tempo}</span>
                <button onClick={() => setTempo(Math.min(200, tempo + 5))} className="hover:text-neon-cyan transition-colors text-lg active:scale-90">+</button>
              </div>
            </div>

            <div className="h-8 w-px bg-white/10 mx-2"></div>

            {/* Import/Export */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              className="hidden"
              accept=".json"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="glass-button px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:border-neon-blue/50 flex items-center gap-2 group"
              title="Import Beat"
            >
              <Icons.Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={handleExport}
              className="glass-button px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:border-neon-purple/50 flex items-center gap-2 group"
              title="Export Beat"
            >
              <Icons.Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>

            <div className="h-8 w-px bg-white/10 mx-4"></div>

            {/* Play Button */}
            <button
              onClick={() => {
                AudioEngine.init();
                setIsPlaying(!isPlaying);
              }}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
                ${isPlaying
                  ? 'bg-gradient-to-tr from-rose-600 to-red-500 shadow-[0_0_20px_rgba(225,29,72,0.4)] scale-105'
                  : 'bg-gradient-to-tr from-emerald-600 to-green-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-105'}
              `}
            >
              {isPlaying ? <Icons.Pause className="w-6 h-6 fill-white" /> : <Icons.Play className="w-6 h-6 fill-white ml-1" />}
            </button>
          </div>
        </div>

        {/* Studio Workspace */}
        <div className="flex-1 relative overflow-y-auto overflow-x-hidden bg-gradient-to-b from-surface-dark to-[#02020a]">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

          <div className="relative z-10 p-6 min-h-full flex flex-col justify-center">
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
            
          {/* Floating Play FAB (Bottom Right) - Only visible if specific condition or preference? For now let's keep it as secondary control or remove if header is enough. 
                Original had it. Let's keep it but styling upgrade. */}
          <div className="absolute bottom-8 right-8 z-30 pointer-events-auto">
                 <button
                    onClick={() => {
                        AudioEngine.init();
                        setIsPlaying(!isPlaying);
                    }}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-md ${isPlaying ? 'bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-white/5 text-emerald-400 hover:bg-emerald-500 hover:text-white'}`}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
            </div>
        </div>

        {/* Sound Lab Modal */}
        {activeSoundLab && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
                 <SoundLab 
              instKey={activeSoundLab}
              config={instrumentConfig?.[activeSoundLab] || {}} 
                    onClose={() => setActiveSoundLab(null)}
              onChange={() => { }} // TODO: Implement state update
                 />
            </div>
        )}

      </div>
    );
}
