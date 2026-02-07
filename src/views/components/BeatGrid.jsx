import React from 'react';
import { Icons } from './Icons';
import { SOUND_VARIANTS, STEPS, INSTRUMENTS_DATA } from '../../utils/constants';

export default function BeatGrid({
    grid,
    activeTracks,
    instrumentConfig,
    currentStep,
    onToggleStep,
    onInstrumentClick, 
    onRemoveTrack,
    onAddTrack,
    lockedInstruments = [], 
    tutorialActive,
    guidePattern,
    isMobile
}) {
    return (
        <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 overflow-x-auto perspective-container">
            <div className="space-y-4 pb-32 sm:pb-12" style={{ transformOrigin: 'center top' }}>
                {activeTracks.map((track, index) => {
                    const instData = INSTRUMENTS_DATA[track.type];
                    const uniqueId = track.id;
                    const variantIndex = instrumentConfig[track.type] || 0;
                    const variantName = SOUND_VARIANTS[track.type]?.[variantIndex]?.name || 'Classic';
                    
                    return (
                        <div 
                            key={uniqueId} 
                            className={`
                                flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 border border-white/5 group relative
                                ${index % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'}
                                hover:bg-white/[0.04] hover:border-white/10 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)]
                            `}
                        >
                            {/* Instrument Control */}
                            <div className="w-14 sm:w-40 shrink-0 flex flex-col sm:flex-row items-center gap-4 border-r border-white/5 pr-4 relative">
                                <button
                                    onClick={() => onInstrumentClick && onInstrumentClick(track.type)}
                                    className={`
                                        w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg transition-all
                                        bg-gradient-to-br from-gray-800 to-black border border-white/10
                                        hover:scale-105 active:scale-95 group-hover:border-${instData.color?.split('-')[1] || 'white'}/50
                                    `}
                                    style={{ color: instData.hex || '#fff' }} // Assuming hex prop exists or fallback
                                    title={instData.name}
                                >
                                    {instData.icon}
                                </button>
                                <div className="hidden sm:block text-left min-w-0 flex-1">
                                    <div className="font-bold text-sm tracking-wide text-slate-200">{instData.name}</div>
                                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 group-hover:text-neon-cyan transition-colors">{variantName}</div>
                                </div>

                                {onRemoveTrack && !lockedInstruments.includes(track.type) && (
                                    <button 
                                        onClick={() => onRemoveTrack(uniqueId)}
                                        className="absolute -left-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1 shadow-lg"
                                    >
                                        <Icons.Trash className="w-3 h-3" />
                                    </button>
                                )}
                            </div>

                            {/* The Grid Steps */}
                            <div className="flex-1 flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar touch-pan-x items-center">
                                {Array(STEPS).fill(0).map((_, step) => {
                                    const isActive = grid[uniqueId]?.[step];
                                    const isCurrent = currentStep === step;
                                    const isBeat = step % 4 === 0;

                                    // Tutorial/Ghost Mode Logic
                                    const isGhost = guidePattern?.[track.type]?.includes(step);

                                    return (
                                        <button
                                            key={step}
                                            onClick={() => onToggleStep(uniqueId, step)}
                                            className={`
                                                relative shrink-0 transition-all duration-200 rounded sm:rounded-md
                                                ${isMobile ? 'w-8 h-10' : 'w-9 h-14'}
                                                ${isActive 
                                                    ? `bg-gradient-to-b ${instData.color || 'from-neon-purple to-purple-600'} shadow-[0_0_12px_rgba(139,92,246,0.5)] scale-100 border border-white/20`
                                                    : isBeat ? 'bg-white/[0.08]' : 'bg-white/[0.03]'}
                                                ${isCurrent ? 'ring-2 ring-white z-10 scale-105 brightness-150 shadow-[0_0_15px_rgba(255,255,255,0.4)]' : ''}
                                                hover:bg-white/20 hover:scale-105
                                                ${!isActive && isGhost ? 'border border-dashed border-white/40 opacity-50' : ''} 
                                            `}
                                        >
                                            {/* Step Marker */}
                                            {!isActive && (
                                                <div className={`w-1 h-1 rounded-full bg-white/10 mx-auto transition-all ${isBeat ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
                
                {/* Add Track Button */}
                {onAddTrack && activeTracks.length < 16 && (
                    <button
                        onClick={onAddTrack}
                        className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-slate-500 hover:text-white hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all flex items-center justify-center gap-3 font-bold tracking-widest text-xs group"
                    >
                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center group-hover:scale-110 transition-transform">+</span>
                        ADD TRACK
                    </button>
                )}
            </div>
        </div>
    );
}
