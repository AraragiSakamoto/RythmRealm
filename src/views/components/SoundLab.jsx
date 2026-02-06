import React from 'react';
import { Icons } from './Icons';

export const SoundLab = ({ instKey, config, onChange, onClose }) => {
  // Close on Escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 pt-16 pb-24" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-sm max-h-[calc(100vh-10rem)] flex flex-col animate-bounce-in text-white relative" onClick={(e) => e.stopPropagation()}>
        {/* Sticky Header */}
        <div className="flex justify-between items-center p-4 pb-3 border-b border-slate-700 shrink-0">
          <h3 className="font-black text-lg uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{instKey} Lab</h3>
          <button onClick={onClose} className="w-8 h-8 bg-slate-800 hover:bg-red-500 text-slate-400 hover:text-white rounded-lg flex items-center justify-center transition-all border border-slate-700 hover:border-red-500">
            <Icons.Close />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Mute Toggle */}
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase">🔇 Mute</label>
              <button
                onClick={() => onChange('muted', !config.muted)}
                className={`w-12 h-6 rounded-full transition-all duration-200 ${config.muted ? 'bg-red-500' : 'bg-green-500'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-all ${config.muted ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
              </button>
            </div>
            {config.muted && <p className="text-xs text-red-400 mt-2 font-bold">This instrument is muted</p>}
          </div>

          {/* Volume */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase">🔊 Volume</label>
              <span className="text-xs font-bold text-green-400">{config.volume || 100}%</span>
            </div>
            <input type="range" min="0" max="100" value={config.volume || 100} onChange={(e) => onChange('volume', parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
          </div>

          {/* Chord Type */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">🎵 Chord Type</label>
            <div className="flex gap-2">
              {['none', 'maj', 'min'].map(type => (
                <button
                  key={type}
                  onClick={() => onChange('chord', type === 'none' ? null : type)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all 
                ${(config.chord === type || (type === 'none' && !config.chord)) ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'}`}
                >
                  {type === 'none' ? 'Single' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Pitch Shift */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase">🎹 Pitch Shift</label>
              <span className="text-xs font-bold text-indigo-400">{(config.pitch || 0) > 0 ? '+' : ''}{config.pitch || 0} st</span>
            </div>
            <input type="range" min="-12" max="12" value={config.pitch || 0} onChange={(e) => onChange('pitch', parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
          </div>

          {/* Attack */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase">⚡ Attack</label>
              <span className="text-xs font-bold text-orange-400">{config.attack || 0}ms</span>
            </div>
            <input type="range" min="0" max="500" value={config.attack || 0} onChange={(e) => onChange('attack', parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
          </div>

          {/* Decay */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase">📰 Decay</label>
              <span className="text-xs font-bold text-amber-400">{config.decay || 100}ms</span>
            </div>
            <input type="range" min="50" max="2000" value={config.decay || 100} onChange={(e) => onChange('decay', parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500" />
          </div>

          {/* Filter */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase">🌊 Filter</label>
              <span className="text-xs font-bold text-cyan-400">{config.filter || 100}%</span>
            </div>
            <input type="range" min="0" max="100" value={config.filter || 100} onChange={(e) => onChange('filter', parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
          </div>

          {/* Reverb */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase">🏺️  Reverb</label>
              <span className="text-xs font-bold text-purple-400">{config.reverb || 0}%</span>
            </div>
            <input type="range" min="0" max="100" value={config.reverb || 0} onChange={(e) => onChange('reverb', parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
          </div>

          {/* Distortion */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase">🔥 Distortion</label>
              <span className="text-xs font-bold text-red-400">{config.distortion || 0}%</span>
            </div>
            <input type="range" min="0" max="100" value={config.distortion || 0} onChange={(e) => onChange('distortion', parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
          </div>

          {/* Pan */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase">↔️  Pan</label>
              <span className="text-xs font-bold text-blue-400">{(config.pan || 0) === 0 ? 'Center' : (config.pan || 0) < 0 ? `Left ${Math.abs(config.pan || 0)}` : `Right ${config.pan || 0}`}</span>
            </div>
            <input type="range" min="-50" max="50" value={config.pan || 0} onChange={(e) => onChange('pan', parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
          </div>

          {/* Bend Effect */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase">〰️  Bend</label>
              <span className="text-xs font-bold text-pink-400">{config.bend || 0}%</span>
            </div>
            <input type="range" min="0" max="100" value={config.bend || 0} onChange={(e) => onChange('bend', parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
          </div>
        </div>

        {/* Action Buttons - Sticky Footer */}
        <div className="shrink-0 p-4 pt-3 border-t border-slate-700 bg-slate-900">
          <div className="flex gap-2">
            <button
              onClick={() => {
                onChange('volume', 100);
                onChange('pitch', 0);
                onChange('chord', null);
                onChange('bend', 0);
                onChange('attack', 0);
                onChange('decay', 100);
                onChange('filter', 100);
                onChange('reverb', 0);
                onChange('distortion', 0);
                onChange('pan', 0);
                onChange('muted', false);
              }}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-300 transition-all border border-slate-700"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 rounded-lg text-xs font-bold text-white transition-all shadow-lg shadow-indigo-500/20"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
