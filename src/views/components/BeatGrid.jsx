import React from 'react';
import { Icons } from './Icons';
import { SOUND_VARIANTS, STEPS, INSTRUMENTS_DATA } from '../../utils/constants';

export default function BeatGrid({
    grid,
    activeInstrumentIds,
    instrumentConfig,
    activeSoundPack,
    currentStep,
    onToggleStep,
    onInstrumentClick, // to open SoundLab or settings
    onRemoveTrack,
    lockedInstruments = [], // For levels
    tutorialActive,
    tutorialStep,
    isMobile
}) {
    return (
        <div className="w-full max-w-6xl mx-auto p-2 sm:p-4 overflow-x-auto perspective-container">
            <div className="space-y-2 sm:space-y-3 pb-24 sm:pb-0" style={{ transform: 'rotateX(5deg)' }}>
                {activeInstrumentIds.map((instId, index) => {
                    const instData = INSTRUMENTS_DATA[instId];
                    const variantIndex = instrumentConfig[instId] || 0;
                    const variantName = SOUND_VARIANTS[instId]?.[variantIndex]?.name || 'Classic';
                    
                    return (
                        <div 
                            key={instId} 
                            className={`
                                flex items-center gap-2 sm:gap-4 p-2 rounded-xl transition-all duration-300 relative group
                                ${index % 2 === 0 ? 'bg-white/5' : 'bg-white/5'}
                                hover:bg-white/10 hover:translate-z-4
                            `}
                        >
                            {/* Instrument Control */}
                            <div className="w-12 sm:w-32 shrink-0 flex flex-col sm:flex-row items-center gap-2">
                                <button
                                    onClick={() => onInstrumentClick && onInstrumentClick(instId)}
                                    className={`
                                        w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-lg transition-all
                                        bg-gradient-to-br ${instData.color} hover:scale-105 active:scale-95
                                        mobile-instrument-btn
                                    `}
                                    title={instData.name}
                                >
                                    {instData.icon}
                                </button>
                                <div className="hidden sm:block text-left min-w-0">
                                    <div className="font-bold text-sm truncate">{instData.name}</div>
                                    <div className="text-[10px] text-slate-400 truncate">{variantName}</div>
                                </div>
                                {onRemoveTrack && !lockedInstruments.includes(instId) && (
                                    <button 
                                        onClick={() => onRemoveTrack(instId)}
                                        className="hidden group-hover:block absolute left-0 top-0 -ml-2 -mt-2 bg-red-500 rounded-full p-1 shadow-lg hover:scale-110"
                                    >
                                        <Icons.Trash className="w-3 h-3" />
                                    </button>
                                )}
                            </div>

                            {/* The Grid Steps */}
                            <div className="flex-1 flex gap-1 sm:gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar touch-pan-x">
                                {Array(STEPS).fill(0).map((_, step) => {
                                    const isActive = grid[instId]?.[step];
                                    const isCurrent = currentStep === step;
                                    const isBeat = step % 4 === 0;

                                    return (
                                        <button
                                            key={step}
                                            onClick={() => onToggleStep(instId, step)}
                                            className={`
                                                relative shrink-0 transition-all duration-150 rounded-lg sm:rounded-md
                                                ${isMobile ? 'mobile-step w-7 h-10' : 'w-8 h-12 sm:w-10 sm:h-14'}
                                                ${isActive 
                                                    ? `bg-gradient-to-b ${instData.color} shadow-[0_0_10px_rgba(255,255,255,0.3)] scale-100` 
                                                    : isBeat ? 'bg-white/10' : 'bg-white/5'}
                                                ${isCurrent ? 'brightness-150 ring-2 ring-white/50 scale-105 z-10' : ''}
                                                hover:scale-110 hover:z-20
                                            `}
                                        >
                                            {/* Inner LED look */}
                                            {isActive && (
                                                <div className="absolute inset-1 rounded-sm bg-white/30 backdrop-blur-[1px]"></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
                
                {/* Add Track Button (if allowed) */}
                {onRemoveTrack && activeInstrumentIds.length < 12 && (
                    <button className="w-full py-4 border-2 border-dashed border-slate-700 rounded-2xl text-slate-500 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all flex items-center justify-center gap-2 font-bold group mb-24 sm:mb-0">
                        <span className="group-hover:scale-150 transition-transform text-xl">+</span> ADD INSTRUMENT
                    </button>
                )}
            </div>
        </div>
    );
}
