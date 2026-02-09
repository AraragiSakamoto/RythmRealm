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

                        // Specific color mapping to ensure valid Tailwind classes
                        const colorMap = {
                            kick: { bg: 'bg-red-500', shadow: 'shadow-red-500/50', text: 'text-red-400', border: 'border-red-500/50' },
                            snare: { bg: 'bg-amber-400', shadow: 'shadow-amber-400/50', text: 'text-amber-400', border: 'border-amber-400/50' },
                            hihat: { bg: 'bg-cyan-400', shadow: 'shadow-cyan-400/50', text: 'text-cyan-400', border: 'border-cyan-400/50' },
                            bass: { bg: 'bg-purple-500', shadow: 'shadow-purple-500/50', text: 'text-purple-400', border: 'border-purple-500/50' },
                            synth: { bg: 'bg-pink-500', shadow: 'shadow-pink-500/50', text: 'text-pink-400', border: 'border-pink-500/50' },
                            tom: { bg: 'bg-indigo-500', shadow: 'shadow-indigo-500/50', text: 'text-indigo-400', border: 'border-indigo-500/50' },
                            perc: { bg: 'bg-orange-500', shadow: 'shadow-orange-500/50', text: 'text-orange-400', border: 'border-orange-500/50' },
                            fx: { bg: 'bg-emerald-500', shadow: 'shadow-emerald-500/50', text: 'text-emerald-400', border: 'border-emerald-500/50' },
                            keys: { bg: 'bg-teal-400', shadow: 'shadow-teal-400/50', text: 'text-teal-400', border: 'border-teal-400/50' },
                            vox: { bg: 'bg-fuchsia-500', shadow: 'shadow-fuchsia-500/50', text: 'text-fuchsia-400', border: 'border-fuchsia-500/50' },
                            lead: { bg: 'bg-blue-500', shadow: 'shadow-blue-500/50', text: 'text-blue-400', border: 'border-blue-500/50' },
                            orch: { bg: 'bg-rose-500', shadow: 'shadow-rose-500/50', text: 'text-rose-400', border: 'border-rose-500/50' }
                        };

                        const colors = colorMap[track.type] || colorMap.kick; // Fallback

                        return (
                            <div
                                key={uniqueId} 
                                className="flex items-center gap-4 group relative"
                            >
                                {/* Instrument Control - Redesigned Compact & Techy */}
                                <div className="sticky left-0 z-20 w-[164px] shrink-0 flex items-center gap-2 bg-[#0a0a16] border border-white/5 rounded-lg p-1 pr-3 shadow-lg relative group/card">
                                    {/* Icon Box */}
                                    <button
                                        onClick={() => onInstrumentClick && onInstrumentClick(track.id)}
                                        className={`
                                            w-10 h-10 rounded-md flex items-center justify-center text-lg shadow-inner transition-all
                                            bg-gradient-to-br from-gray-800 to-black border border-white/10
                                            ${colors.text} group-hover:text-white group-hover:${colors.border}
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
                                    <div className="flex flex-col gap-0.5 opacity-100 group-hover/card:opacity-0 transition-opacity">
                                        <div className="w-1 h-1 rounded-full bg-green-500/50"></div>
                                        <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                                        <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                                    </div>

                                    {/* Remove Track Button (Hover) */}
                                    {onRemoveTrack && !lockedInstruments.includes(track.type) && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent triggering other clicks
                                                onRemoveTrack(uniqueId);
                                            }}
                                            className="absolute right-2 opacity-0 group-hover/card:opacity-100 transition-all text-slate-400 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-md backdrop-blur-sm"
                                            title="Remove Track"
                                        >
                                            <Icons.Trash className="w-4 h-4" />
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
                                                    ? `${colors.bg} shadow-[0_0_10px_currentColor] border ${colors.border} text-${colors.bg.replace('bg-', '')}`
                                                        : 'bg-white/[0.03] hover:bg-white/[0.08] border border-transparent'}
                                                    ${isCurrent ? 'ring-1 ring-white z-10 brightness-150' : ''}
                                                    ${!isActive && isGhost ? 'border border-dashed border-white/30 opacity-40' : ''}
                                                `}
                                                style={isActive ? { boxShadow: `0 0 10px var(--tw-shadow-color)` } : {}}
                                            >
                                                {/* Active Content */}
                                                {isActive && (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-white/60"></div>
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
