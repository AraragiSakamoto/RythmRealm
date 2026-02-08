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
    // Generate an array of 8 beats (since STEPS is 32, 32/4 = 8 beats)
    const beats = Array(8).fill(0).map((_, i) => i + 1);

    return (
        <div className="w-full max-w-[1400px] mx-auto p-4 overflow-x-auto">
            <div className="min-w-[1000px]">

                {/* Timeline Header - NEW */}
                <div className="flex items-center gap-4 mb-2 pl-[180px] pr-2">
                    {beats.map((beat) => (
                        <div key={beat} className="flex-1 text-center relative">
                            {/* Beat Number */}
                            <div className="text-xs font-bold text-slate-500 mb-1 tracking-widest">
                                {beat}
                            </div>
                            {/* Visual marker bar */}
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-neon-cyan/50 transition-all duration-100 ease-linear`}
                                    style={{
                                        width: currentStep >= (beat - 1) * 4 && currentStep < beat * 4
                                            ? `${((currentStep % 4) + 1) * 25}%`
                                            : currentStep >= beat * 4 ? '100%' : '0%'
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-1 pb-32 sm:pb-12">
                    {activeTracks.map((track, index) => {
                        const instData = INSTRUMENTS_DATA[track.type] || { name: 'Unknown', color: 'bg-gray-500', icon: <Icons.HelpCircle /> }; // Fallback
                        const uniqueId = track.id;
                        const variantIndex = instrumentConfig[track.type] || 0;
                        const variantName = SOUND_VARIANTS[track.type]?.[variantIndex]?.name || 'Classic';

                        // Extract base color name for text coloring (e.g. from 'bg-red-400' get 'red')
                        // This is a rough heuristic, defaulting to neon-cyan if complex
                        const baseColorMatch = instData.color?.match(/bg-([a-z]+)-/);
                        const baseColor = baseColorMatch ? baseColorMatch[1] : 'cyan';

                        return (
                            <div
                                key={uniqueId} 
                                className="flex items-center gap-4 group relative"
                            >
                                {/* Instrument Control - Redesigned Compact & Techy */}
                                <div className="sticky left-0 z-20 w-[164px] shrink-0 flex items-center gap-2 bg-[#0a0a16] border border-white/5 rounded-lg p-1 pr-3 shadow-lg">
                                    {/* Icon Box */}
                                    <button
                                        onClick={() => onInstrumentClick && onInstrumentClick(track.type)}
                                        className={`
                                            w-10 h-10 rounded-md flex items-center justify-center text-lg shadow-inner transition-all
                                            bg-gradient-to-br from-gray-800 to-black border border-white/10
                                            text-${baseColor}-400 group-hover:text-white group-hover:border-${baseColor}-400/50
                                        `}
                                        title={instData.name}
                                    >
                                        {instData.icon}
                                    </button>

                                    {/* Text Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <div className="font-bold text-xs tracking-wider text-slate-300 uppercase truncate">{instData.name}</div>
                                        <div className="text-[9px] font-mono text-slate-500 truncate group-hover:text-neon-cyan transition-colors">{variantName}</div>
                                    </div>

                                    {/* Mute/Solo Indicators (Visual only for now, could act as buttons) */}
                                    <div className="flex flex-col gap-0.5">
                                        <div className="w-1 h-1 rounded-full bg-green-500/50"></div>
                                        <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                                        <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                                    </div>

                                    {/* Remove Track Button (Hover) */}
                                    {onRemoveTrack && !lockedInstruments.includes(track.type) && (
                                        <button
                                            onClick={() => onRemoveTrack(uniqueId)}
                                            className="absolute -left-2 -top-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-400 text-white rounded-full p-0.5 shadow-lg scale-75"
                                            title="Remove Track"
                                        >
                                            <Icons.Trash className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>

                                {/* The Grid Steps - Redesigned Flat & Neon */}
                                <div className="flex-1 flex gap-1 items-center">
                                    {Array(STEPS).fill(0).map((_, step) => {
                                        const isActive = grid[uniqueId]?.[step];
                                        const isCurrent = currentStep === step;
                                        const isBeatStart = step % 4 === 0;

                                        // Tutorial/Ghost Mode Logic
                                        const isGhost = guidePattern?.[track.type]?.includes(step);

                                        return (
                                            <button
                                                key={step}
                                                onClick={() => onToggleStep(uniqueId, step)}
                                                className={`
                                                    relative shrink-0 flex-1 h-12 rounded-sm transition-all duration-100
                                                    ${isBeatStart ? 'ml-1' : ''} /* Gap between beats */
                                                    ${isActive 
                                                        ? `bg-${baseColor}-500 shadow-[0_0_10px_rgba(var(--color-${baseColor}-500),0.6)] border border-white/20`
                                                        : 'bg-white/[0.03] hover:bg-white/[0.08] border border-transparent'}
                                                    ${isCurrent ? 'ring-1 ring-white z-10 brightness-150' : ''}
                                                    ${!isActive && isGhost ? 'border border-dashed border-white/30 opacity-40' : ''}
                                                `}
                                            >
                                                {/* Active Content */}
                                                {isActive && (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}

                    {/* Add Track Button - Redesigned */}
                    {onAddTrack && activeTracks.length < 16 && (
                        <div className="pl-[164px]">
                            <button
                                onClick={onAddTrack}
                                className="ml-4 px-6 py-2 border border-dashed border-white/10 rounded-lg text-slate-500 hover:text-white hover:border-slate-500 hover:bg-white/5 transition-all flex items-center gap-2 font-bold text-xs tracking-wider"
                            >
                                <span className="text-lg leading-none">+</span> ADD TRACK
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
