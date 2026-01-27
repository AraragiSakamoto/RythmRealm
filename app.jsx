import React, { useState, useEffect, useRef } from 'react';
import { supabase, authService, scoreService, achievementService, ACHIEVEMENTS, beatStorageService } from './supabase.js';

// ==========================================
// 1. GLOBAL STYLES & ANIMATIONS
// ==========================================
const cssStyles = `
  @keyframes rain { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
  @keyframes float { 0% { transform: translateX(0px); } 50% { transform: translateX(20px); } 100% { transform: translateX(0px); } }
  @keyframes wiggle { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
  @keyframes bounce-in { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  @keyframes hit-pulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,255,255,0.7); } 100% { transform: scale(1.5); box-shadow: 0 0 20px 20px rgba(255,255,255,0); opacity: 0; } }
  @keyframes guide-pulse { 0% { opacity: 0.4; transform: scale(0.95); box-shadow: 0 0 0 0 rgba(250, 204, 21, 0.7); } 50% { opacity: 1; transform: scale(1); box-shadow: 0 0 10px 2px rgba(250, 204, 21, 0.5); } 100% { opacity: 0.4; transform: scale(0.95); box-shadow: 0 0 0 0 rgba(250, 204, 21, 0); } }
  
  /* Mobile Optimizations */
  * { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
  html, body { overscroll-behavior: none; }
  
  /* Prevent pull-to-refresh on mobile */
  body { overflow: hidden; position: fixed; width: 100%; height: 100%; }
  
  /* Better touch targets */
  @media (max-width: 768px) {
    .mobile-step { min-width: 28px; min-height: 40px; }
    .mobile-instrument-btn { min-height: 48px; }
    .mobile-controls { flex-wrap: wrap; gap: 8px; }
    
    /* Larger touch targets for mobile */
    button { min-height: 44px; min-width: 44px; }
    
    /* Seek bar mobile optimization */
    .seek-bar-touch { min-height: 48px; }
  }
  
  /* Line clamp for text truncation */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* Safe area support for notched devices */
  @supports (padding: max(0px)) {
    .safe-area-top { padding-top: max(env(safe-area-inset-top), 16px); }
    .safe-area-bottom { padding-bottom: max(env(safe-area-inset-bottom), 16px); }
  }
  
  /* Pixel Futuristic Animations */
  @keyframes pixel-wave { 
    0% { transform: scaleY(0.3); } 
    50% { transform: scaleY(1); } 
    100% { transform: scaleY(0.3); } 
  }
  @keyframes pixel-scroll { 
    0% { transform: translateY(0); } 
    100% { transform: translateY(-50%); } 
  }
  @keyframes pixel-glow { 
    0%, 100% { opacity: 0.3; filter: brightness(1); } 
    50% { opacity: 1; filter: brightness(1.5); } 
  }
  @keyframes note-float { 
    0% { transform: translateY(100vh) rotate(0deg); opacity: 0; } 
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-100px) rotate(360deg); opacity: 0; } 
  }
  @keyframes grid-pulse {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.3; }
  }
  @keyframes scanline {
    0% { top: -10%; }
    100% { top: 110%; }
  }
  
  .pixel-font { 
    font-family: 'Courier New', monospace; 
    image-rendering: pixelated;
  }
  
  .perspective-container { perspective: 1000px; overflow: hidden; }
  .highway { transform-style: preserve-3d; transform: rotateX(50deg) scaleY(1.5); transform-origin: 50% 100%; }
  
  .animate-rain { animation: rain 1s linear infinite; }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-bounce-in { animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
  .hit-effect { animation: hit-pulse 0.2s ease-out forwards; }
  .animate-guide-target { animation: guide-pulse 1s infinite; }
  
  /* Raining Notes Animation */
  @keyframes note-rain {
    0% { transform: translateY(-50px) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 0.8; }
    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
  }
  
  /* Bass Shake Effect */
  @keyframes bass-shake {
    0%, 100% { transform: translateX(0) translateY(0); }
    10% { transform: translateX(-2px) translateY(1px); }
    20% { transform: translateX(2px) translateY(-1px); }
    30% { transform: translateX(-1px) translateY(2px); }
    40% { transform: translateX(1px) translateY(-2px); }
    50% { transform: translateX(-2px) translateY(1px); }
    60% { transform: translateX(2px) translateY(-1px); }
    70% { transform: translateX(-1px) translateY(1px); }
    80% { transform: translateX(1px) translateY(-1px); }
    90% { transform: translateX(-1px) translateY(0); }
  }
  
  .bass-shake {
    animation: bass-shake 0.15s ease-in-out;
  }
  
  /* DJ Mode Turntable Spin */
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 2s linear infinite;
  }
  
  /* Custom Scrollbar */
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: #1e293b; }
  ::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
  
  /* Accessibility: High Contrast Mode */
  .high-contrast { filter: contrast(1.4) saturate(1.2); }
  .high-contrast button, .high-contrast [role="button"] { border: 3px solid white !important; }
  .high-contrast:focus, .high-contrast *:focus { outline: 4px solid yellow !important; outline-offset: 2px !important; }
  
  /* Accessibility: Focus Indicators */
  *:focus-visible { outline: 3px solid #fbbf24 !important; outline-offset: 2px; }
  button:focus-visible, [role="button"]:focus-visible { transform: scale(1.05); box-shadow: 0 0 20px rgba(251, 191, 36, 0.6); }
  
  /* Accessibility: Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
  }
  
  /* Accessibility: Large Text Mode */
  .large-text { font-size: 125% !important; }
  .large-text button, .large-text [role="button"] { font-size: 1.25em !important; padding: 1em 1.5em !important; }
  
  /* Skip to main content link */
  .skip-link { position: absolute; top: -100px; left: 50%; transform: translateX(-50%); background: #fbbf24; color: black; padding: 12px 24px; border-radius: 8px; font-weight: bold; z-index: 9999; }
  .skip-link:focus { top: 10px; }
`;

// ==========================================
// VISUAL THEMES DATA
// ==========================================
const VISUAL_THEMES = [
  {
    id: 'ocean',
    name: 'Ocean',
    primary: 'from-sky-400 to-blue-500',
    bgColors: ['#0f172a', '#172554', '#0f172a'], // slate-900, blue-950, slate-900
    gridColor: 'rgba(56, 189, 248, 0.3)',
    noteColors: ['#38bdf8', '#0ea5e9', '#06b6d4', '#22d3ee', '#67e8f9', '#0284c7', '#0369a1'],
    scanlineColor: '#22d3ee',
    eqColors: ['#06b6d4', '#3b82f6', '#0ea5e9'], // cyan, blue, sky
  },
  {
    id: 'sunset',
    name: 'Sunset',
    primary: 'from-pink-400 to-rose-500',
    bgColors: ['#0f172a', '#4c0519', '#0f172a'], // slate-900, rose-950, slate-900
    gridColor: 'rgba(244, 63, 94, 0.3)',
    noteColors: ['#fb7185', '#f43f5e', '#e11d48', '#ff6b6b', '#fda4af', '#ec4899', '#f472b6'],
    scanlineColor: '#fb7185',
    eqColors: ['#ec4899', '#f43f5e', '#ef4444'], // pink, rose, red
  },
  {
    id: 'golden',
    name: 'Golden',
    primary: 'from-amber-400 to-orange-500',
    bgColors: ['#0f172a', '#451a03', '#0f172a'], // slate-900, amber-950, slate-900
    gridColor: 'rgba(251, 191, 36, 0.3)',
    noteColors: ['#fbbf24', '#f59e0b', '#d97706', '#fcd34d', '#fde68a', '#ea580c', '#fb923c'],
    scanlineColor: '#fbbf24',
    eqColors: ['#eab308', '#f59e0b', '#f97316'], // yellow, amber, orange
  },
  {
    id: 'forest',
    name: 'Forest',
    primary: 'from-emerald-400 to-green-500',
    bgColors: ['#0f172a', '#022c22', '#0f172a'], // slate-900, emerald-950, slate-900
    gridColor: 'rgba(52, 211, 153, 0.3)',
    noteColors: ['#34d399', '#10b981', '#059669', '#6ee7b7', '#a7f3d0', '#14b8a6', '#2dd4bf'],
    scanlineColor: '#34d399',
    eqColors: ['#22c55e', '#10b981', '#14b8a6'], // green, emerald, teal
  },
  {
    id: 'neon',
    name: 'Neon',
    primary: 'from-violet-400 to-purple-500',
    bgColors: ['#0f172a', '#3b0764', '#0f172a'], // slate-900, purple-950, slate-900
    gridColor: 'rgba(139, 92, 246, 0.3)',
    noteColors: ['#ff00ff', '#00ffff', '#ffff00', '#ff6b6b', '#4ecdc4', '#a855f7', '#ec4899'],
    scanlineColor: '#a855f7',
    eqColors: ['#06b6d4', '#a855f7', '#ec4899'], // cyan, purple, pink
  },
  {
    id: 'midnight',
    name: 'Midnight',
    primary: 'from-slate-400 to-slate-500',
    bgColors: ['#020617', '#0f172a', '#020617'], // slate-950, slate-900, slate-950
    gridColor: 'rgba(100, 116, 139, 0.3)',
    noteColors: ['#94a3b8', '#64748b', '#475569', '#cbd5e1', '#e2e8f0', '#334155', '#1e293b'],
    scanlineColor: '#94a3b8',
    eqColors: ['#64748b', '#475569', '#334155'], // slate colors
  },
];

// ==========================================
// PIXEL MUSIC BACKGROUND COMPONENT
// ==========================================
const PixelMusicBackground = ({ theme = VISUAL_THEMES[4] }) => {
  const pixelNotes = ['♪', '♫', '♬', '🎵', '🎶'];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dark gradient base */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(135deg, ${theme.bgColors[0]} 0%, ${theme.bgColors[1]} 50%, ${theme.bgColors[2]} 100%)`
      }}></div>

      {/* Pixel Grid Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(${theme.gridColor} 1px, transparent 1px),
          linear-gradient(90deg, ${theme.gridColor} 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        animation: 'grid-pulse 4s ease-in-out infinite'
      }}></div>

      {/* Scanline effect */}
      <div className="absolute left-0 right-0 h-1"
        style={{
          background: `linear-gradient(to bottom, transparent, ${theme.scanlineColor}50, transparent)`,
          animation: 'scanline 3s linear infinite'
        }}></div>

      {/* Floating Pixel Music Notes */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`note-${i}`}
          className="absolute text-2xl md:text-4xl"
          style={{
            left: `${Math.random() * 100}%`,
            color: theme.noteColors[i % theme.noteColors.length],
            animation: `note-float ${8 + Math.random() * 8}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`,
            filter: 'drop-shadow(0 0 10px currentColor)',
            imageRendering: 'pixelated'
          }}
        >
          {pixelNotes[i % pixelNotes.length]}
        </div>
      ))}

      {/* Pixel Equalizer Bars - Left side */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-1 opacity-60">
        {[...Array(8)].map((_, i) => (
          <div
            key={`eq-left-${i}`}
            className="w-2 rounded-sm origin-bottom"
            style={{
              height: `${40 + Math.random() * 60}px`,
              background: `linear-gradient(to top, ${theme.eqColors[0]}, ${theme.eqColors[1]}, ${theme.eqColors[2]})`,
              animation: `pixel-wave ${0.5 + Math.random() * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
              imageRendering: 'pixelated'
            }}
          ></div>
        ))}
      </div>

      {/* Pixel Equalizer Bars - Right side */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 opacity-60">
        {[...Array(8)].map((_, i) => (
          <div
            key={`eq-right-${i}`}
            className="w-2 rounded-sm origin-bottom"
            style={{
              height: `${40 + Math.random() * 60}px`,
              background: `linear-gradient(to top, ${theme.eqColors[2]}, ${theme.eqColors[1]}, ${theme.eqColors[0]})`,
              animation: `pixel-wave ${0.5 + Math.random() * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
              imageRendering: 'pixelated'
            }}
          ></div>
        ))}
      </div>

      {/* Pixel Waveform - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 flex items-end justify-center gap-[2px] opacity-40">
        {[...Array(60)].map((_, i) => (
          <div
            key={`wave-${i}`}
            className="w-1 rounded-t-sm origin-bottom"
            style={{
              height: `${10 + Math.sin(i * 0.3) * 30 + Math.random() * 20}px`,
              background: `linear-gradient(to top, ${theme.eqColors[0]}, ${theme.eqColors[2]})`,
              animation: `pixel-wave ${0.8 + Math.random() * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.05}s`,
              imageRendering: 'pixelated'
            }}
          ></div>
        ))}
      </div>

      {/* Glowing Pixel Orbs */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`orb-${i}`}
          className="absolute rounded-sm"
          style={{
            width: `${8 + Math.random() * 12}px`,
            height: `${8 + Math.random() * 12}px`,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            background: theme.noteColors[i % theme.noteColors.length],
            boxShadow: `0 0 ${20 + Math.random() * 20}px ${theme.noteColors[i % theme.noteColors.length]}`,
            animation: `pixel-glow ${2 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            imageRendering: 'pixelated'
          }}
        ></div>
      ))}

      {/* Pixel Music Symbols - Scattered */}
      <div className="absolute top-10 left-10 text-4xl opacity-30" style={{ color: theme.noteColors[0], imageRendering: 'pixelated' }}>🎹</div>
      <div className="absolute top-20 right-20 text-3xl opacity-20 animate-pulse" style={{ color: theme.noteColors[1], imageRendering: 'pixelated' }}>🎸</div>
      <div className="absolute bottom-32 left-20 text-3xl opacity-25" style={{ color: theme.noteColors[2], imageRendering: 'pixelated', animation: 'float 4s ease-in-out infinite' }}>🥁</div>
      <div className="absolute bottom-40 right-10 text-4xl opacity-20 animate-bounce" style={{ color: theme.noteColors[3], imageRendering: 'pixelated' }}>🎤</div>

      {/* Corner Decorations - Pixel Style */}
      <div className="absolute top-0 left-0 w-20 h-20 m-4" style={{ borderLeft: `4px solid ${theme.eqColors[0]}80`, borderTop: `4px solid ${theme.eqColors[0]}80` }}></div>
      <div className="absolute top-0 right-0 w-20 h-20 m-4" style={{ borderRight: `4px solid ${theme.eqColors[2]}80`, borderTop: `4px solid ${theme.eqColors[2]}80` }}></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 m-4" style={{ borderLeft: `4px solid ${theme.eqColors[2]}80`, borderBottom: `4px solid ${theme.eqColors[2]}80` }}></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 m-4" style={{ borderRight: `4px solid ${theme.eqColors[0]}80`, borderBottom: `4px solid ${theme.eqColors[0]}80` }}></div>
    </div>
  );
};

// ==========================================
// 2. ICONS
// ==========================================
const Icons = {
  Play: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5v14l11-7z" /></svg>,
  Stop: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>,
  Map: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>,
  Home: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  Lock: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
  Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  ChevronRight: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>,
  ChevronLeft: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>,
  Star: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
  Trophy: () => <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.2 6.5C20.2 6.5 19 3 12 3S3.8 6.5 3.8 6.5C2.6 6.9 2 8 2.2 9.3c.4 2.1 2.2 6.3 5.4 8.2 1 .6 2.3 1.2 4.4 1.2s3.4-.6 4.4-1.2c3.2-1.9 5-6.1 5.4-8.2.2-1.3-.4-2.4-1.6-2.8zm-8.2 9c-1.3 0-2.4-.4-3.3-1.1-1.8-1.4-2.6-3.8-2.5-4.4.1-.7 1.2-3.5 5.8-3.5s5.7 2.8 5.8 3.5c.2.6-.7 3-2.5 4.4-.9.7-2 1.1-3.3 1.1z" /><path d="M12 17c-3 0-5 1.5-5 3v2h10v-2c0-1.5-2-3-5-3z" /></svg>,
  Trash: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  Book: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>,
  Music: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>,
  Minus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  GradCap: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>,
  Wand: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4V2"></path><path d="M15 16l-4-4"></path><path d="M11 2l-7 7a2.121 2.121 0 0 0 3 3L17 5a2.121 2.121 0 0 0-3-3z"></path><path d="M19 12v2"></path><path d="M19 19h2"></path><path d="M12 19h2"></path></svg>,
  Sliders: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>,
  Sword: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"></path><line x1="13" y1="19" x2="19" y2="13"></line><line x1="16" y1="16" x2="20" y2="20"></line><line x1="19" y1="21" x2="21" y2="19"></line></svg>,
  PlusCircle: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>,
  XCircle: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
};

// ==========================================
// 3. UI COMPONENTS
// ==========================================
const Button = ({ children, onClick, className = "", variant = "primary", disabled = false, size = "md" }) => {
  const sizes = { sm: "px-3 py-1 text-sm rounded-xl", md: "px-6 py-3 rounded-2xl text-lg", lg: "px-8 py-4 rounded-3xl text-xl" };
  const variants = {
    primary: "bg-indigo-500 hover:bg-indigo-400 text-white border-b-8 border-indigo-700 active:border-b-0 active:translate-y-2",
    secondary: "bg-white hover:bg-slate-100 text-slate-700 border-b-8 border-slate-300 active:border-b-0 active:translate-y-2",
    success: "bg-green-500 hover:bg-green-400 text-white border-b-8 border-green-700 active:border-b-0 active:translate-y-2",
    danger: "bg-red-500 hover:bg-red-400 text-white border-b-8 border-red-700 active:border-b-0 active:translate-y-2",
    locked: "bg-slate-300 text-slate-500 border-b-8 border-slate-400 cursor-not-allowed"
  };
  return (
    <button onClick={disabled ? null : onClick} className={`font-black uppercase tracking-wide transition-all shadow-xl flex items-center justify-center gap-3 ${sizes[size]} ${variants[disabled ? 'locked' : variant]} ${className}`}>
      {children}
    </button>
  );
};

const GuideSelector = ({ onSelect, onClose, activeGuide }) => (
  <div className="absolute top-20 right-4 z-40 bg-white border-4 border-indigo-200 rounded-3xl shadow-2xl w-72 overflow-hidden animate-fade-in text-slate-800">
    <div className="p-4 bg-indigo-100 border-b-2 border-indigo-200 flex justify-between items-center">
      <h3 className="font-black text-indigo-600 flex items-center gap-2"><Icons.Book /> Recipe Book</h3>
      <button onClick={onClose}><Icons.Close /></button>
    </div>
    <div className="p-3 space-y-2">
      <button onClick={() => onSelect(null)} className="w-full text-left p-4 rounded-2xl border-2 hover:bg-slate-50 border-slate-200 font-bold">My Own Beat</button>
      {BEAT_GUIDES.map((guide) => (
        <button key={guide.name} onClick={() => onSelect(guide)} className={`w-full text-left p-4 rounded-2xl border-2 ${activeGuide?.name === guide.name ? 'bg-indigo-500 text-white' : 'hover:bg-indigo-50 border-slate-200'}`}>
          <div className="font-bold">{guide.name}</div>
          <div className="text-xs opacity-80 mt-1">{guide.desc}</div>
        </button>
      ))}
    </div>
  </div>
);

const SoundLab = ({ instKey, config, onChange, onClose }) => {
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
              <label className="text-xs font-bold text-slate-400 uppercase">🏺️ Reverb</label>
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
              <label className="text-xs font-bold text-slate-400 uppercase">↔️ Pan</label>
              <span className="text-xs font-bold text-blue-400">{(config.pan || 0) === 0 ? 'Center' : (config.pan || 0) < 0 ? `Left ${Math.abs(config.pan || 0)}` : `Right ${config.pan || 0}`}</span>
            </div>
            <input type="range" min="-50" max="50" value={config.pan || 0} onChange={(e) => onChange('pan', parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
          </div>

          {/* Bend Effect */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase">〰️ Bend</label>
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

// ==========================================
// ONBOARDING TUTORIAL COMPONENT
// ==========================================
const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: '🎵 Welcome to Rhythm Realm!',
    content: "Let's learn how to create amazing beats! This quick tutorial will show you everything you need to know.",
    target: null,
    position: 'center',
    action: 'next',
  },
  {
    id: 'grid-intro',
    title: '🎹 The Beat Grid',
    content: "This is your beat grid! Each row is a different instrument (Kick, Snare, HiHat, etc). Each column is a point in time. Click any cell to add a sound!",
    target: 'grid',
    position: 'top',
    action: 'next',
  },
  {
    id: 'click-cell',
    title: '👠 Try Clicking a Cell!',
    content: "Click on any empty cell in the grid to add a beat. The cell will light up and you'll hear the sound!",
    target: 'grid',
    position: 'top',
    action: 'click-grid',
    highlight: 'grid',
  },
  {
    id: 'play-button',
    title: '▶️ Play Your Beat',
    content: "Press the PLAY button (or hit SPACEBAR) to hear your creation! The playhead will move across the grid showing which sounds play.",
    target: 'play-button',
    position: 'top',
    action: 'next',
    highlight: 'play-button',
  },
  {
    id: 'tempo',
    title: '⏱️ Tempo Control',
    content: "Use the tempo controls to speed up or slow down your beat. BPM means 'Beats Per Minute' - higher = faster!",
    target: 'tempo',
    position: 'top',
    action: 'next',
    highlight: 'tempo',
  },
  {
    id: 'add-instrument',
    title: '➕ Adding Instruments',
    content: "Click the + button at the bottom of the instrument list to add new instruments like Tom, FX, Keys, or Synth!",
    target: 'add-track',
    position: 'right',
    action: 'next',
    highlight: 'add-track',
  },
  {
    id: 'sound-variant',
    title: '🎛️ Change Instrument Sounds',
    content: "Click on an instrument's icon (the colored circle) to cycle through different sound variations. Each instrument has 4 unique sounds!",
    target: 'instrument-icon',
    position: 'right',
    action: 'next',
    highlight: 'instrument-icon',
  },
  {
    id: 'soundlab-intro',
    title: '🔬 The Sound Lab',
    content: "Click the 🔬 button next to any instrument to open the SOUND LAB. Here you can customize volume, pitch, effects, and more!",
    target: 'soundlab-button',
    position: 'right',
    action: 'next',
    highlight: 'soundlab-button',
  },
  {
    id: 'soundlab-features',
    title: '🎚️ Sound Lab Features',
    content: "In Sound Lab you can adjust: Volume 🔊, Pitch 🎹, Attack ⚡, Decay 📰, Filter 🌊, Reverb 🏺️, Distortion 🔥, Pan ↔️, and Bend 〰️",
    target: null,
    position: 'center',
    action: 'next',
  },
  {
    id: 'complete',
    title: '🎉 You\'re Ready!',
    content: "You now know the basics! Experiment with different patterns, try the genre tutorials, or just have fun creating your own beats!",
    target: null,
    position: 'center',
    action: 'finish',
  },
];

const OnboardingTutorial = ({ step, onNext, onSkip, onFinish }) => {
  const currentStep = ONBOARDING_STEPS[step];
  if (!currentStep) return null;

  const isCenter = currentStep.position === 'center';

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[100] pointer-events-none">
        {/* Dark backdrop with spotlight hole */}
        <div className="absolute inset-0 bg-black/70 pointer-events-auto" onClick={currentStep.action === 'next' || currentStep.action === 'finish' ? undefined : (e) => e.stopPropagation()}>
          {/* Highlight specific elements */}
          {currentStep.highlight && (
            <div className={`absolute animate-pulse-ring ${currentStep.highlight === 'grid' ? 'top-24 left-52 right-4 bottom-32' :
              currentStep.highlight === 'play-button' ? 'bottom-4 left-1/2 -translate-x-1/2 w-20 h-20' :
                currentStep.highlight === 'tempo' ? 'bottom-4 right-4 w-32 h-16' :
                  currentStep.highlight === 'add-track' ? 'top-1/2 left-4 w-12 h-12' :
                    currentStep.highlight === 'instrument-icon' ? 'top-32 left-4 w-12 h-12' :
                      currentStep.highlight === 'soundlab-button' ? 'top-32 left-32 w-10 h-10' : ''
              }`}>
              <div className="absolute inset-0 border-4 border-cyan-400 rounded-2xl animate-pulse"></div>
            </div>
          )}
        </div>
      </div>

      {/* Tutorial Card */}
      <div className={`fixed z-[101] ${isCenter ? 'inset-0 flex items-center justify-center p-4' :
        currentStep.position === 'top' ? 'top-20 left-1/2 -translate-x-1/2' :
          currentStep.position === 'right' ? 'top-1/3 left-64' :
            currentStep.position === 'bottom' ? 'bottom-24 left-1/2 -translate-x-1/2' : ''
        }`}>
        <div className={`bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-500/50 rounded-3xl shadow-2xl shadow-cyan-500/20 ${isCenter ? 'w-full max-w-md' : 'w-80'} animate-bounce-in`}>
          {/* Header */}
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="font-black text-lg text-white">{currentStep.title}</h3>
            <button
              onClick={onSkip}
              className="text-slate-400 hover:text-white text-sm font-bold px-3 py-1 rounded-lg hover:bg-slate-700 transition-all"
            >
              Skip
            </button>
          </div>

          {/* Content */}
          <div className="p-5">
            <p className="text-slate-300 text-sm leading-relaxed">{currentStep.content}</p>
          </div>

          {/* Footer */}
          <div className="p-4 pt-0 flex items-center justify-between">
            {/* Progress dots */}
            <div className="flex gap-1">
              {ONBOARDING_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-cyan-400 w-6' : i < step ? 'bg-cyan-400/50' : 'bg-slate-600'}`}
                />
              ))}
            </div>

            {/* Action button */}
            {currentStep.action === 'next' && (
              <button
                onClick={onNext}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-cyan-500/30"
              >
                Next →
              </button>
            )}
            {currentStep.action === 'click-grid' && (
              <div className="px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-xl text-amber-400 font-bold text-xs animate-pulse">
                👠 Click any cell in the grid!
              </div>
            )}
            {currentStep.action === 'finish' && (
              <button
                onClick={onFinish}
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-green-500/30"
              >
                🎉 Start Creating!
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// ==========================================
// 4. DATA CONSTANTS
// ==========================================
const STEPS = 32;

const INSTRUMENTS_DATA = [
  { id: 'kick', name: 'Kick', color: 'bg-red-400', shadow: 'shadow-red-400/50' },
  { id: 'snare', name: 'Snare', color: 'bg-yellow-400', shadow: 'shadow-yellow-400/50' },
  { id: 'hihat', name: 'HiHat', color: 'bg-cyan-400', shadow: 'shadow-cyan-400/50' },
  { id: 'bass', name: 'Bass', color: 'bg-purple-400', shadow: 'shadow-purple-400/50' },
  { id: 'synth', name: 'Synth', color: 'bg-pink-400', shadow: 'shadow-pink-400/50' },
  { id: 'tom', name: 'Tom', color: 'bg-indigo-400', shadow: 'shadow-indigo-400/50' },
  { id: 'perc', name: 'Perc', color: 'bg-orange-400', shadow: 'shadow-orange-400/50' },
  { id: 'fx', name: 'FX', color: 'bg-slate-400', shadow: 'shadow-slate-400/50' },
  { id: 'keys', name: 'Keys', color: 'bg-teal-400', shadow: 'shadow-teal-400/50' },
  { id: 'vox', name: 'Vox', color: 'bg-fuchsia-400', shadow: 'shadow-fuchsia-400/50' },
  { id: 'lead', name: 'Lead', color: 'bg-blue-500', shadow: 'shadow-blue-500/50' },
  { id: 'orch', name: 'Orch', color: 'bg-amber-600', shadow: 'shadow-amber-600/50' },
];

const SOUND_VARIANTS = {
  kick: [
    { name: '808 Boom', icon: '💥', type: 'kick808', freq: 55, duration: 0.8, decay: 0.5 },
    { name: 'Punchy', icon: '👐', type: 'kickPunch', freq: 150, duration: 0.3, decay: 0.2 },
    { name: 'Sub Drop', icon: '🌊', type: 'kickSub', freq: 40, duration: 1.0, decay: 0.8 },
    { name: 'Acoustic', icon: '🥁', type: 'kickAcoustic', freq: 80, duration: 0.4, decay: 0.3 }
  ],
  snare: [
    { name: 'Crack', icon: '⚡', type: 'snareCrack', freq: 200, duration: 0.2, noise: 0.8 },
    { name: 'Clap', icon: '👏', type: 'clap', freq: 300, duration: 0.15, noise: 0.9 },
    { name: 'Rim', icon: '🔔', type: 'rim', freq: 800, duration: 0.05, noise: 0.3 },
    { name: 'Trap', icon: '🔥', type: 'snareTrap', freq: 180, duration: 0.3, noise: 0.7 }
  ],
  hihat: [
    { name: 'Closed', icon: '🎩', type: 'hihatClosed', freq: 8000, duration: 0.05, noise: 1.0 },
    { name: 'Open', icon: '🌟', type: 'hihatOpen', freq: 6000, duration: 0.3, noise: 0.9 },
    { name: 'Pedal', icon: '👘', type: 'hihatPedal', freq: 4000, duration: 0.1, noise: 0.7 },
    { name: 'Shaker', icon: '🧂', type: 'shaker', freq: 10000, duration: 0.08, noise: 1.0 }
  ],
  tom: [
    { name: 'Floor', icon: '🏛¢️', type: 'tomLow', freq: 80, duration: 0.5, decay: 0.4 },
    { name: 'Mid', icon: '🥁', type: 'tomMid', freq: 150, duration: 0.4, decay: 0.3 },
    { name: 'High', icon: '🎯', type: 'tomHigh', freq: 250, duration: 0.3, decay: 0.2 },
    { name: 'Taiko', icon: '🏯', type: 'taiko', freq: 60, duration: 0.8, decay: 0.6 }
  ],
  perc: [
    { name: 'Conga', icon: '🪘', type: 'conga', freq: 200, duration: 0.3, decay: 0.2 },
    { name: 'Bongo', icon: '🥁', type: 'bongo', freq: 350, duration: 0.15, decay: 0.1 },
    { name: 'Cowbell', icon: '🔔', type: 'cowbell', freq: 800, duration: 0.2, decay: 0.15 },
    { name: 'Woodblock', icon: '🪵', type: 'woodblock', freq: 1200, duration: 0.05, decay: 0.03 }
  ],
  bass: [
    { name: 'Sub Bass', icon: '🔊', type: 'bassSub', freq: 55, duration: 0.5, decay: 0.4 },
    { name: 'Synth', icon: '🎹', type: 'bassSynth', freq: 82, duration: 0.3, decay: 0.25 },
    { name: 'Pluck', icon: '🎸', type: 'bassPluck', freq: 110, duration: 0.2, decay: 0.15 },
    { name: 'Wobble', icon: '🌀', type: 'bassWobble', freq: 65, duration: 0.6, decay: 0.5 }
  ],
  synth: [
    { name: 'Pad', icon: '🎶', type: 'synthPad', freq: 440, duration: 1.0, decay: 0.8 },
    { name: 'Pluck', icon: '✨', type: 'synthPluck', freq: 523, duration: 0.2, decay: 0.15 },
    { name: 'Stab', icon: 'âš”️', type: 'synthStab', freq: 392, duration: 0.15, decay: 0.1 },
    { name: 'Arp', icon: '🌈', type: 'synthArp', freq: 659, duration: 0.1, decay: 0.08 }
  ],
  fx: [
    { name: 'Riser', icon: '🚀', type: 'fxRiser', freq: 200, duration: 1.5, decay: 1.2 },
    { name: 'Impact', icon: '💫', type: 'fxImpact', freq: 100, duration: 0.8, decay: 0.6 },
    { name: 'Laser', icon: '🔫', type: 'fxLaser', freq: 1500, duration: 0.3, decay: 0.2 },
    { name: 'Zap', icon: '⚡', type: 'fxZap', freq: 800, duration: 0.15, decay: 0.1 }
  ],
  keys: [
    { name: 'Piano', icon: '🎹', type: 'keysPiano', freq: 523, duration: 0.8, decay: 0.6 },
    { name: 'Rhodes', icon: '🌙', type: 'keysRhodes', freq: 440, duration: 1.0, decay: 0.8 },
    { name: 'Organ', icon: 'â›ª', type: 'keysOrgan', freq: 392, duration: 0.5, decay: 0.4 },
    { name: 'Bells', icon: '🔔', type: 'keysBells', freq: 880, duration: 1.2, decay: 1.0 }
  ],
  vox: [
    { name: 'Ooh', icon: '😮', type: 'voxOoh', freq: 400, duration: 0.5, decay: 0.4 },
    { name: 'Aah', icon: '😲', type: 'voxAah', freq: 500, duration: 0.6, decay: 0.5 },
    { name: 'Hey', icon: '🗣️', type: 'voxHey', freq: 350, duration: 0.2, decay: 0.15 },
    { name: 'Choir', icon: '👼', type: 'voxChoir', freq: 440, duration: 1.0, decay: 0.8 }
  ],
  lead: [
    { name: 'Saw', icon: '🪚', type: 'leadSaw', freq: 659, duration: 0.4, decay: 0.3 },
    { name: 'Square', icon: 'â¬œ', type: 'leadSquare', freq: 523, duration: 0.35, decay: 0.25 },
    { name: 'Pluck', icon: '🎻', type: 'leadPluck', freq: 784, duration: 0.15, decay: 0.1 },
    { name: 'Screech', icon: '🦅', type: 'leadScreech', freq: 1046, duration: 0.5, decay: 0.4 }
  ],
  orch: [
    { name: 'Strings', icon: '🎻', type: 'orchStrings', freq: 294, duration: 1.0, decay: 0.8 },
    { name: 'Brass', icon: '🎺', type: 'orchBrass', freq: 349, duration: 0.4, decay: 0.3 },
    { name: 'Timpani', icon: '🥁', type: 'orchTimpani', freq: 73, duration: 0.8, decay: 0.6 },
    { name: 'Harp', icon: '🪕', type: 'orchHarp', freq: 523, duration: 0.6, decay: 0.5 }
  ]
};

const BEAT_GUIDES = [
  {
    name: "Rock n Roll 🎸",
    desc: "Classic rock beat - Kick on 1 & 3, Snare on 2 & 4",
    pattern: { kick: [0, 8, 16, 24], snare: [4, 12, 20, 28], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 8, 16, 24] }
  },
  {
    name: "Hip Hop 🧢",
    desc: "Boom bap with swing and groove",
    pattern: { kick: [0, 7, 10, 16, 23, 26], snare: [4, 12, 20, 28], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 7, 16, 23] }
  },
  {
    name: "House 💿",
    desc: "Four on the floor - classic club beat",
    pattern: { kick: [0, 4, 8, 12, 16, 20, 24, 28], snare: [4, 12, 20, 28], hihat: [2, 6, 10, 14, 18, 22, 26, 30], bass: [0, 6, 8, 14, 16, 22, 24, 30] }
  },
  {
    name: "Trap 🔥",
    desc: "Hard-hitting 808s with rapid hi-hats",
    pattern: { kick: [0, 6, 14, 16, 22, 30], snare: [4, 12, 20, 28], hihat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], bass: [0, 6, 14, 16, 22, 30] }
  },
  {
    name: "Reggaeton 🌴",
    desc: "Dembow rhythm - infectious Latin groove",
    pattern: { kick: [0, 6, 8, 14, 16, 22, 24, 30], snare: [3, 7, 11, 15, 19, 23, 27, 31], hihat: [0, 4, 8, 12, 16, 20, 24, 28], perc: [2, 6, 10, 14, 18, 22, 26, 30] }
  },
  {
    name: "Drum & Bass 🚀",
    desc: "Fast breakbeat with rolling bass",
    pattern: { kick: [0, 10, 16, 26], snare: [4, 12, 14, 20, 28, 30], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 3, 6, 10, 16, 19, 22, 26] }
  },
  {
    name: "Disco Funk 🚺",
    desc: "Groovy funk beat with offbeat bass",
    pattern: { kick: [0, 4, 8, 12, 16, 20, 24, 28], snare: [4, 12, 20, 28], hihat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], bass: [2, 6, 10, 14, 18, 22, 26, 30] }
  },
  {
    name: "Lo-Fi Chill 🌙",
    desc: "Relaxed beat for studying",
    pattern: { kick: [0, 10, 16, 26], snare: [4, 20], hihat: [0, 4, 8, 12, 16, 20, 24, 28], keys: [0, 8, 16, 24] }
  },
  {
    name: "Afrobeat 🌍",
    desc: "West African polyrhythmic groove",
    pattern: { kick: [0, 6, 10, 16, 22, 26], snare: [4, 12, 20, 28], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], perc: [0, 3, 6, 9, 12, 16, 19, 22, 25, 28] }
  },
  {
    name: "Techno 🤖",
    desc: "Hypnotic industrial rhythm",
    pattern: { kick: [0, 4, 8, 12, 16, 20, 24, 28], snare: [8, 24], hihat: [2, 6, 10, 14, 18, 22, 26, 30], synth: [0, 8, 16, 24] }
  },
  {
    name: "Bossa Nova 🏓️",
    desc: "Brazilian jazz rhythm",
    pattern: { kick: [0, 10, 16, 26], snare: [6, 14, 22, 30], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 6, 10, 16, 22, 26] }
  },
  {
    name: "Dubstep 🔊",
    desc: "Heavy drops with wobble bass",
    pattern: { kick: [0, 14, 16, 30], snare: [8, 24], hihat: [0, 4, 8, 12, 16, 20, 24, 28], bass: [0, 2, 4, 6, 14, 16, 18, 20, 22, 30] }
  }
];

const DEFAULT_SCENARIO = {
  id: -1, name: "Free Play 🎨", bpm: 100, desc: "Create anything you want!", locked: false, theme: "from-violet-500 to-fuchsia-500", bgClass: "bg-gradient-to-br from-violet-900 to-fuchsia-900", ambience: "studio",
  renderScene: (pulse, accuracy) => (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 rounded-b-3xl">
      {/* Animated gradient orbs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-500/40 to-purple-500/40 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-yellow-400/50 to-orange-500/50 rounded-full blur-xl" style={{ transform: `translate(-50%, -50%) scale(${1 + pulse * 0.3})` }}></div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute w-full h-px bg-white" style={{ top: `${(i + 1) * 12.5}%` }}></div>
        ))}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute h-full w-px bg-white" style={{ left: `${(i + 1) * 12.5}%` }}></div>
        ))}
      </div>

      {/* Floating music notes */}
      <div className="absolute top-1/4 left-1/4 text-4xl opacity-60" style={{ transform: `translateY(${Math.sin(Date.now() / 500) * 10}px)` }}>🎵</div>
      <div className="absolute top-1/3 right-1/4 text-3xl opacity-50" style={{ transform: `translateY(${Math.sin(Date.now() / 600 + 1) * 8}px)` }}>🎶</div>
      <div className="absolute bottom-1/4 left-1/3 text-3xl opacity-40" style={{ transform: `translateY(${Math.sin(Date.now() / 700 + 2) * 12}px)` }}>🎵</div>

      {/* Center beat visualizer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-end gap-1">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="w-3 bg-gradient-to-t from-pink-500 to-cyan-400 rounded-full transition-all duration-75"
            style={{
              height: `${20 + pulse * 40 + Math.sin(Date.now() / 200 + i) * 15}px`,
              opacity: 0.7 + pulse * 0.3
            }}
          ></div>
        ))}
      </div>

      {/* FREE PLAY text */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 font-black text-lg tracking-widest">FREE PLAY</div>
    </div>
  )
};

const SCENARIOS = [
  {
    id: 0, name: "Sunny Vibes ☀️", bpm: 112, desc: "Bright, happy, and uplifting atmosphere", locked: false, theme: "from-yellow-400 to-orange-400", bgClass: "bg-sky-200", ambience: "beach",
    tutorial: [
      { text: "Welcome! 🎉 Let's make a HAPPY beat! The KICK drum is the heartbeat - add kicks on beats 1, 3, 5, 7 plus a funky pickup!", targetInstrument: 'kick', targetSteps: [0, 8, 14, 16, 24, 30], soundVariant: 1 },
      { text: "Awesome! 👏 SNARE/CLAP on the backbeat (2, 4, 6, 8) - this groove makes everyone dance!", targetInstrument: 'snare', targetSteps: [4, 12, 20, 28], soundVariant: 1 },
      { text: "🎵 HI-HATS create the groove! 8th notes with an open hat accent for brightness!", targetInstrument: 'hihat', targetSteps: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], soundVariant: 0 },
      { text: "🎸 BASS adds the groove! Syncopated pattern that locks with the kick!", targetInstrument: 'bass', targetSteps: [0, 6, 8, 14, 16, 22, 24, 30], soundVariant: 1 },
      { text: "✨ SYNTH adds chord stabs! Off-beat hits create that pop bounce!", targetInstrument: 'synth', targetSteps: [2, 6, 10, 18, 22, 26], soundVariant: 1 },
      { text: "🪘 PERCUSSION with shaker fills the gaps! Creates continuous movement!", targetInstrument: 'perc', targetSteps: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31], soundVariant: 1 },
      { text: "🌟 PERFECT! You made a full POP beat with 6 instruments! Hit PLAY! ☀️", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 8, 14, 16, 24, 30], snare: [4, 12, 20, 28], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 6, 8, 14, 16, 22, 24, 30], synth: [2, 6, 10, 18, 22, 26], perc: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-sky-400 to-sky-200 rounded-b-3xl">
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-green-400 to-green-300 rounded-t-[50%]"></div>
        <div className="absolute top-8 right-12 w-20 h-20 bg-yellow-300 rounded-full shadow-[0_0_60px_rgba(253,224,71,0.8)]" style={{ transform: `scale(${1 + pulse * 0.1})` }}></div>
        <div className="absolute top-16 left-16 w-28 h-10 bg-white/70 rounded-full blur-md"></div>
        <div className="absolute top-24 left-32 w-20 h-8 bg-white/50 rounded-full blur-md"></div>
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-5xl" style={{ transform: `translateX(-50%) scale(${1 + pulse * 0.2})` }}>🎵</div>
      </div>
    )
  },
  {
    id: 1, name: "Chill Night 🌙", bpm: 75, desc: "Relaxed, lo-fi, late night mood", locked: false, theme: "from-slate-600 to-indigo-800", bgClass: "bg-slate-900", ambience: "rain",
    tutorial: [
      { text: "🌙 Lo-Fi Tutorial! SLOWER tempo (75 BPM) with a SWUNG feel. Kicks on 1 and the 'and' of 2!", targetInstrument: 'kick', targetSteps: [0, 5, 16, 21], soundVariant: 2 },
      { text: "Lo-Fi snares are LAZY 👤 Ghost notes make it human! Main hits on 2 & 6 with soft flams!", targetInstrument: 'snare', targetSteps: [4, 7, 20, 23], soundVariant: 2 },
      { text: "Gentle hi-hats 🍿 Swung 8ths with ghost notes create that dusty vinyl feel!", targetInstrument: 'hihat', targetSteps: [0, 3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31], soundVariant: 2 },
      { text: "🎹 RHODES KEYS are the soul! 7th chords on 1 and 5 with passing tones!", targetInstrument: 'keys', targetSteps: [0, 6, 16, 22], soundVariant: 1 },
      { text: "🎸 Mellow BASS walks through chord tones - jazzy and warm!", targetInstrument: 'bass', targetSteps: [0, 5, 8, 12, 16, 21, 24, 28], soundVariant: 2 },
      { text: "✨ SYNTH PAD breathes in and out - long sustained atmosphere!", targetInstrument: 'synth', targetSteps: [0, 16], soundVariant: 0 },
      { text: "🌙 Beautiful! 6 layers of chill! The magic is in the SPACE between notes. PLAY! 🎧", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 5, 16, 21], snare: [4, 7, 20, 23], hihat: [0, 3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31], keys: [0, 6, 16, 22], bass: [0, 5, 8, 12, 16, 21, 24, 28], synth: [0, 16] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-indigo-900 to-slate-900 rounded-b-3xl">
        <div className="absolute top-8 right-16 w-16 h-16 bg-slate-200 rounded-full opacity-90 shadow-[0_0_40px_rgba(255,255,255,0.3)]"></div>
        {[...Array(30)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white rounded-full opacity-60" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%` }}></div>
        ))}
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute w-0.5 bg-blue-400/40 animate-rain" style={{ height: `${Math.random() * 20 + 10}%`, left: `${Math.random() * 100}%`, top: `-10%`, animationDuration: `${Math.random() * 0.8 + 0.4}s`, animationDelay: `${Math.random() * 2}s` }}></div>
        ))}
        <div className="absolute bottom-0 w-full h-16 bg-slate-800/80"></div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-4xl" style={{ transform: `translateX(-50%) translateY(${pulse * -5}px)` }}>🎧</div>
      </div>
    )
  },
  {
    id: 2, name: "Neon City 🌠", bpm: 126, desc: "Electronic, urban, energetic beats", locked: false, theme: "from-pink-500 to-purple-600", bgClass: "bg-purple-950", ambience: "city",
    tutorial: [
      { text: "🏠 HOUSE MUSIC! Four-on-the-floor with a tasteful ghost kick for groove!", targetInstrument: 'kick', targetSteps: [0, 4, 8, 11, 12, 16, 20, 24, 27, 28], soundVariant: 1 },
      { text: "👏 Clap on 2 and 4 with a pickup clap! Classic house with extra bounce!", targetInstrument: 'snare', targetSteps: [4, 12, 15, 20, 28, 31], soundVariant: 1 },
      { text: "🎩 OFFBEAT open hi-hats! The signature house bounce between kicks!", targetInstrument: 'hihat', targetSteps: [2, 6, 10, 14, 18, 22, 26, 30], soundVariant: 1 },
      { text: "🎹 Piano STABS with that disco/house chord rhythm! Off-beat magic!", targetInstrument: 'synth', targetSteps: [2, 5, 10, 13, 18, 21, 26, 29], soundVariant: 2 },
      { text: "🎸 Pumping BASS with 16th note rhythm - the dance floor driver!", targetInstrument: 'bass', targetSteps: [0, 3, 4, 8, 11, 12, 16, 19, 20, 24, 27, 28], soundVariant: 1 },
      { text: "🚀 FX RISER builds anticipation for the drop!", targetInstrument: 'fx', targetSteps: [0], soundVariant: 0 },
      { text: "🔥 6 layers of HOUSE! This is EDM, Disco, and Club music! DROP IT! 🏠", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 4, 8, 11, 12, 16, 20, 24, 27, 28], snare: [4, 12, 15, 20, 28, 31], hihat: [2, 6, 10, 14, 18, 22, 26, 30], synth: [2, 5, 10, 13, 18, 21, 26, 29], bass: [0, 3, 4, 8, 11, 12, 16, 19, 20, 24, 27, 28], fx: [0] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-purple-900 to-slate-900 rounded-b-3xl">
        <div className="absolute bottom-0 w-full h-32 bg-slate-900"></div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute bottom-0" style={{ left: `${i * 14 + 5}%`, height: `${40 + Math.random() * 40}%`, width: '8%' }}>
            <div className="w-full h-full bg-slate-800 relative">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="absolute w-2 h-2 bg-yellow-300/80" style={{ left: `${20 + Math.random() * 60}%`, top: `${10 + j * 15}%`, opacity: Math.random() > 0.3 ? 1 : 0.3 }}></div>
              ))}
            </div>
          </div>
        ))}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl" style={{ transform: `translate(-50%, -50%) scale(${1 + pulse * 0.3})`, filter: `drop-shadow(0 0 ${10 + pulse * 20}px #f0abfc)` }}>🎹</div>
        <div className="absolute bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-80" style={{ transform: `scaleX(${0.5 + pulse * 0.5})` }}></div>
      </div>
    )
  },
  {
    id: 3, name: "Desert Sunset 🏜️", bpm: 98, desc: "Warm, groovy, world music vibes", locked: false, theme: "from-orange-500 to-red-500", bgClass: "bg-orange-900", ambience: "desert",
    tutorial: [
      { text: "🌍 AFROBEAT groove! The '3-2 clave' kick pattern - syncopated magic that makes you MOVE!", targetInstrument: 'kick', targetSteps: [0, 6, 12, 16, 20, 26], soundVariant: 3 },
      { text: "🥁 Cross-stick snare on 2 & 4 plus ghost notes - tight and funky!", targetInstrument: 'snare', targetSteps: [4, 7, 12, 20, 23, 28], soundVariant: 0 },
      { text: "🧂 SHAKER drives the groove with 16th notes - constant flowing energy!", targetInstrument: 'hihat', targetSteps: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], soundVariant: 3 },
      { text: "🪘 CONGA plays the TUMBA pattern! Traditional 6/8 polyrhythm over 4/4!", targetInstrument: 'perc', targetSteps: [0, 3, 6, 10, 12, 15, 16, 19, 22, 26, 28, 31], soundVariant: 0 },
      { text: "🎸 BASS locks with the kick - dancehall-style bounce pattern!", targetInstrument: 'bass', targetSteps: [0, 6, 10, 12, 16, 20, 26, 28], soundVariant: 2 },
      { text: "🎹 KEYS play jazzy maj7 chords - that sunny Afro-Cuban color!", targetInstrument: 'keys', targetSteps: [0, 3, 8, 16, 19, 24], soundVariant: 2 },
      { text: "🌦 6 instruments with POLYRHYTHM! Heart of African & Latin music! PLAY! 🌍", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 6, 12, 16, 20, 26], snare: [4, 7, 12, 20, 23, 28], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], perc: [0, 3, 6, 10, 12, 15, 16, 19, 22, 26, 28, 31], bass: [0, 6, 10, 12, 16, 20, 26, 28], keys: [0, 3, 8, 16, 19, 24] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-orange-400 via-red-400 to-purple-600 rounded-b-3xl">
        <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-amber-800 to-amber-700"></div>
        <div className="absolute bottom-16 left-1/4 w-0 h-0 border-l-[30px] border-r-[30px] border-b-[60px] border-l-transparent border-r-transparent border-b-amber-900/60"></div>
        <div className="absolute bottom-16 right-1/3 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[40px] border-l-transparent border-r-transparent border-b-amber-900/40"></div>
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-yellow-200 rounded-full opacity-90 shadow-[0_0_80px_rgba(253,224,71,0.6)]"></div>
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-4xl" style={{ transform: `translateX(-50%) rotate(${pulse * 10}deg)` }}>🪘</div>
      </div>
    )
  },
  {
    id: 4, name: "Deep Space 🚀", bpm: 174, desc: "Cosmic, epic, cinematic sounds", locked: false, theme: "from-indigo-600 to-violet-900", bgClass: "bg-slate-950", ambience: "space",
    tutorial: [
      { text: "🚀 DRUM & BASS! 174 BPM with the classic 'Amen break' style kick pattern!", targetInstrument: 'kick', targetSteps: [0, 10, 14, 16, 26, 30], soundVariant: 1 },
      { text: "⚡ D&B snares hit hard on 2 & 4 with ROLLS before the next bar!", targetInstrument: 'snare', targetSteps: [4, 12, 13, 20, 28, 29, 30], soundVariant: 0 },
      { text: "🎩 Breakbeat hi-hat pattern - open hats for that jungle feel!", targetInstrument: 'hihat', targetSteps: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], soundVariant: 0 },
      { text: "🌀 REESE BASS - the legendary D&B bass! Rolling 16ths that fill the space!", targetInstrument: 'bass', targetSteps: [0, 2, 4, 6, 10, 14, 16, 18, 20, 22, 26, 30], soundVariant: 3 },
      { text: "🎹 SYNTH PAD - cosmic atmosphere that breathes through the track!", targetInstrument: 'synth', targetSteps: [0, 16], soundVariant: 0 },
      { text: "💫 FX IMPACTS mark the phrases - cinematic power!", targetInstrument: 'fx', targetSteps: [0, 14, 16, 30], soundVariant: 1 },
      { text: "🚀 6 layers of D&B! ENERGY and SPEED! Launch into hyperspace! 🌈", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 10, 14, 16, 26, 30], snare: [4, 12, 13, 20, 28, 29, 30], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 2, 4, 6, 10, 14, 16, 18, 20, 22, 26, 30], synth: [0, 16], fx: [0, 14, 16, 30] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-violet-950 rounded-b-3xl">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white" style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.8 + 0.2,
            animation: `pulse ${Math.random() * 2 + 1}s infinite`
          }}></div>
        ))}
        <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-sm opacity-60"></div>
        <div className="absolute bottom-1/3 left-1/5 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-sm opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl" style={{ transform: `translate(-50%, -50%) scale(${1 + pulse * 0.2}) rotate(${pulse * 15}deg)` }}>🎸</div>
      </div>
    )
  },
  {
    id: 5, name: "Trap Kingdom 👑", bpm: 145, desc: "Hard-hitting trap with 808s and hi-hat rolls", locked: false, theme: "from-red-600 to-black", bgClass: "bg-black", ambience: "trap",
    tutorial: [
      { text: "👑 TRAP MUSIC! The 808 kick is sparse but MASSIVE! Feel that low end shake the room!", targetInstrument: 'kick', targetSteps: [0, 7, 14, 16, 23, 30], soundVariant: 0 },
      { text: "Trap snares hit HARD on 2 & 4! 💥 Add extra hits for attitude!", targetInstrument: 'snare', targetSteps: [4, 12, 15, 20, 28, 31], soundVariant: 3 },
      { text: "🎩 HI-HAT ROLLS are trap's signature! Notice the TRIPLETS that create machine-gun energy!", targetInstrument: 'hihat', targetSteps: [0, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16, 18, 20, 21, 22, 24, 25, 26, 28, 29, 30], soundVariant: 0 },
      { text: "808 BASS = LIFE! 🔊 Long sliding notes that hit with the kick!", targetInstrument: 'bass', targetSteps: [0, 7, 14, 16, 23, 30], soundVariant: 0 },
      { text: "SYNTH adds dark minor chords! 🌑 Mysterious ominous atmosphere!", targetInstrument: 'synth', targetSteps: [0, 8, 16, 24], soundVariant: 3 },
      { text: "🎵 LEAD melody - the catchy hook that gets stuck in your head!", targetInstrument: 'lead', targetSteps: [0, 3, 6, 8, 11, 16, 19, 22, 24, 27], soundVariant: 1 },
      { text: "💥 FX builds INTENSITY! Risers before the drop!", targetInstrument: 'fx', targetSteps: [14, 30], soundVariant: 1 },
      { text: "👑 TRAP ROYALTY! 7 layers of pure fire! HIT PLAY!", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 7, 14, 16, 23, 30], snare: [4, 12, 15, 20, 28, 31], hihat: [0, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16, 18, 20, 21, 22, 24, 25, 26, 28, 29, 30], bass: [0, 7, 14, 16, 23, 30], synth: [0, 8, 16, 24], lead: [0, 3, 6, 8, 11, 16, 19, 22, 24, 27], fx: [14, 30] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-red-950 to-black rounded-b-3xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.3),transparent_70%)]"></div>
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute w-1 bg-red-500/30" style={{
            height: `${20 + Math.random() * 40}%`,
            left: `${i * 5 + 2}%`,
            bottom: 0,
            transform: `scaleY(${0.5 + pulse * 0.5})`
          }}></div>
        ))}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl" style={{ transform: `translate(-50%, -50%) scale(${1 + pulse * 0.3})` }}>👑</div>
      </div>
    )
  },
  {
    id: 6, name: "Reggaeton 🔥", bpm: 98, desc: "Latin urban rhythm with the dembow beat", locked: false, theme: "from-yellow-500 to-red-600", bgClass: "bg-red-900", ambience: "reggaeton",
    tutorial: [
      { text: "🔥 REGGAETON! The 'DEMBOW' beat! Kick on 1, 'and' of 2, and repeat - feel that BOUNCE!", targetInstrument: 'kick', targetSteps: [0, 5, 8, 13, 16, 21, 24, 29], soundVariant: 1 },
      { text: "💿 The DEMBOW snare is magic! Off-beat hits create the irresistible swing!", targetInstrument: 'snare', targetSteps: [3, 7, 11, 15, 19, 23, 27, 31], soundVariant: 1 },
      { text: "Hi-hats add Latin FLAVOR! 🎶 Consistent 8ths with ghost notes!", targetInstrument: 'hihat', targetSteps: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], soundVariant: 0 },
      { text: "🎸 Bass LOCKS with the kick - deep and punchy dance floor shake!", targetInstrument: 'bass', targetSteps: [0, 5, 8, 13, 16, 21, 24, 29], soundVariant: 1 },
      { text: "🪘 Congas add PERREO! 🔥 Traditional tumba meets urban heat!", targetInstrument: 'perc', targetSteps: [0, 3, 6, 8, 11, 14, 16, 19, 22, 24, 27, 30], soundVariant: 0 },
      { text: "🎹 Piano montuno pattern - that tropical Caribbean color!", targetInstrument: 'keys', targetSteps: [0, 3, 6, 8, 11, 16, 19, 22, 24, 27], soundVariant: 3 },
      { text: "🎵 LEAD melody - the memorable hook! Catchy synth phrase!", targetInstrument: 'lead', targetSteps: [0, 4, 8, 12, 16, 20, 24, 28], soundVariant: 1 },
      { text: "🔥 DALE! Full REGGAETON heat with 7 layers! PLAY and PERREO! 💿", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 5, 8, 13, 16, 21, 24, 29], snare: [3, 7, 11, 15, 19, 23, 27, 31], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 5, 8, 13, 16, 21, 24, 29], perc: [0, 3, 6, 8, 11, 14, 16, 19, 22, 24, 27, 30], keys: [0, 3, 6, 8, 11, 16, 19, 22, 24, 27], lead: [0, 4, 8, 12, 16, 20, 24, 28] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-yellow-500 via-orange-500 to-red-600 rounded-b-3xl">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="absolute text-3xl" style={{
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 70}%`,
            transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + pulse * 0.3})`,
            opacity: 0.6
          }}>🔥</div>
        ))}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl" style={{ transform: `translate(-50%, -50%) scale(${1 + pulse * 0.2})` }}>💿</div>
      </div>
    )
  },
  {
    id: 7, name: "Hip Hop Classic 🎤", bpm: 92, desc: "Old school boom bap hip hop beat", locked: false, theme: "from-amber-600 to-stone-800", bgClass: "bg-stone-900", ambience: "hiphop",
    tutorial: [
      { text: "🎤 BOOM BAP! Classic 90s hip hop. Kick is lazy, slightly behind the beat!", targetInstrument: 'kick', targetSteps: [0, 5, 10, 16, 21, 26], soundVariant: 1 },
      { text: "'BAP' snare CRACKS! 💥 Hard on 2 & 4 with ghost notes for swing!", targetInstrument: 'snare', targetSteps: [4, 7, 12, 20, 23, 28], soundVariant: 0 },
      { text: "🎩 Swung hi-hats are ESSENTIAL! The shuffle feel makes heads nod!", targetInstrument: 'hihat', targetSteps: [0, 3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31], soundVariant: 0 },
      { text: "🎸 Upright bass sound - jazzy walking line with chromatic fills!", targetInstrument: 'bass', targetSteps: [0, 5, 8, 10, 16, 21, 24, 26], soundVariant: 2 },
      { text: "🎹 Dusty piano chops - sampled soul feel that defines boom bap!", targetInstrument: 'keys', targetSteps: [0, 6, 8, 14, 16, 22, 24, 30], soundVariant: 0 },
      { text: "🥁 Tom fills add that classic J Dilla flavor - unexpected hits!", targetInstrument: 'tom', targetSteps: [6, 14, 15, 22, 30, 31], soundVariant: 0 },
      { text: "🎵 Shaker for that dusty vinyl texture - old school authenticity!", targetInstrument: 'perc', targetSteps: [2, 6, 10, 14, 18, 22, 26, 30], soundVariant: 3 },
      { text: "🎤 CLASSIC BOOM BAP! 7 layers of golden era hip hop! DROP THE BEAT!", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 5, 10, 16, 21, 26], snare: [4, 7, 12, 20, 23, 28], hihat: [0, 3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31], bass: [0, 5, 8, 10, 16, 21, 24, 26], keys: [0, 6, 8, 14, 16, 22, 24, 30], tom: [6, 14, 15, 22, 30, 31], perc: [2, 6, 10, 14, 18, 22, 26, 30] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-amber-800 to-stone-900 rounded-b-3xl">
        <div className="absolute bottom-0 w-full h-20 bg-stone-950"></div>
        <div className="absolute bottom-16 left-10 w-16 h-24 bg-stone-800 rounded-t-lg"></div>
        <div className="absolute bottom-16 left-32 w-20 h-32 bg-stone-700 rounded-t-lg"></div>
        <div className="absolute bottom-16 right-20 w-14 h-20 bg-stone-800 rounded-t-lg"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl" style={{ transform: `translate(-50%, -50%) scale(${1 + pulse * 0.15})` }}>🎤</div>
      </div>
    )
  },
  {
    id: 8, name: "Rock Solid 🎸", bpm: 118, desc: "Classic rock drum pattern", locked: false, theme: "from-gray-700 to-red-900", bgClass: "bg-gray-900", ambience: "rock",
    tutorial: [
      { text: "🎸 ROCK DRUMS! Driving kick with an extra hit before beat 3 for power!", targetInstrument: 'kick', targetSteps: [0, 6, 8, 14, 16, 22, 24, 30], soundVariant: 3 },
      { text: "Rock snare CRACKS on 2 & 4! 💥 With a pickup note for energy!", targetInstrument: 'snare', targetSteps: [4, 12, 15, 20, 28, 31], soundVariant: 0 },
      { text: "🥁 Ride cymbal pattern - steady 8ths with accent on the beat!", targetInstrument: 'hihat', targetSteps: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], soundVariant: 0 },
      { text: "🎸 Bass guitar drives the rhythm - lock with the kick!", targetInstrument: 'bass', targetSteps: [0, 6, 8, 14, 16, 22, 24, 30], soundVariant: 2 },
      { text: "🎹 Hammond organ power chords - that classic rock sound!", targetInstrument: 'keys', targetSteps: [0, 8, 16, 24], soundVariant: 2 },
      { text: "🎵 Guitar riff lead line - memorable melodic hook!", targetInstrument: 'lead', targetSteps: [0, 3, 6, 8, 11, 16, 19, 22, 24, 27], soundVariant: 2 },
      { text: "🥁 Tom fills build to the next section - classic rock transition!", targetInstrument: 'tom', targetSteps: [12, 13, 14, 28, 29, 30, 31], soundVariant: 1 },
      { text: "🎸 ROCK ON! 7 layers of pure rock power! CRANK IT UP!", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 6, 8, 14, 16, 22, 24, 30], snare: [4, 12, 15, 20, 28, 31], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 6, 8, 14, 16, 22, 24, 30], keys: [0, 8, 16, 24], lead: [0, 3, 6, 8, 11, 16, 19, 22, 24, 27], tom: [12, 13, 14, 28, 29, 30, 31] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-gray-800 to-gray-950 rounded-b-3xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(220,38,38,0.2),transparent_60%)]"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="absolute bottom-10 bg-yellow-500 rounded-full" style={{
            width: '8px',
            height: '8px',
            left: `${25 + i * 25}%`,
            boxShadow: `0 0 ${20 + pulse * 30}px ${10 + pulse * 15}px rgba(234,179,8,0.6)`,
          }}></div>
        ))}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl" style={{ transform: `translate(-50%, -50%) scale(${1 + pulse * 0.2}) rotate(${pulse * 5}deg)` }}>🎸</div>
      </div>
    )
  },
  {
    id: 9, name: "Techno Machine 🤖", bpm: 132, desc: "Hypnotic, repetitive techno groove", locked: false, theme: "from-cyan-600 to-gray-900", bgClass: "bg-gray-950", ambience: "techno",
    tutorial: [
      { text: "🤖 TECHNO! Relentless four-on-the-floor with ghost kicks for groove!", targetInstrument: 'kick', targetSteps: [0, 4, 8, 10, 12, 16, 20, 24, 26, 28], soundVariant: 1 },
      { text: "👏 Minimal claps on 2 & 4 with a rimshot accent pattern!", targetInstrument: 'snare', targetSteps: [4, 12, 14, 20, 28, 30], soundVariant: 1 },
      { text: "🎩 Open hi-hats on offbeats plus 16th shaker texture!", targetInstrument: 'hihat', targetSteps: [2, 6, 10, 14, 18, 22, 26, 30], soundVariant: 0 },
      { text: "🔊 Sub bass POUNDS with the kick - feel it in your chest!", targetInstrument: 'bass', targetSteps: [0, 4, 8, 12, 16, 20, 24, 28], soundVariant: 0 },
      { text: "🌈 Pad EVOLVES slowly - building hypnotic atmosphere!", targetInstrument: 'synth', targetSteps: [0, 16], soundVariant: 0 },
      { text: "🎵 Acid lead sequence - the 303 pattern that defined techno!", targetInstrument: 'lead', targetSteps: [0, 3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31], soundVariant: 0 },
      { text: "🌟 FX textures add movement - risers and sweeps!", targetInstrument: 'fx', targetSteps: [0, 8, 16, 24], soundVariant: 0 },
      { text: "🤖 HYPNOTIC TECHNO! 7 layers of machine precision! ENTER THE TRANCE!", targetInstrument: null, targetSteps: [] }
    ],
    beat: { kick: [0, 4, 8, 10, 12, 16, 20, 24, 26, 28], snare: [4, 12, 14, 20, 28, 30], hihat: [2, 6, 10, 14, 18, 22, 26, 30], bass: [0, 4, 8, 12, 16, 20, 24, 28], synth: [0, 16], lead: [0, 3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31], fx: [0, 8, 16, 24] },
    renderScene: (pulse, accuracy) => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-gray-900 to-black rounded-b-3xl">
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="absolute left-1/2 top-1/2 border border-cyan-500/30 rounded-full" style={{
              width: `${(i + 1) * 40 + pulse * 20}px`,
              height: `${(i + 1) * 40 + pulse * 20}px`,
              transform: 'translate(-50%, -50%)',
              opacity: 1 - i * 0.1
            }}></div>
          ))}
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl" style={{ transform: `translate(-50%, -50%) scale(${1 + pulse * 0.3})` }}>🤖</div>
      </div>
    )
  },
];

// DEFAULT SCENARIO for Free Play

// ==========================================
// GAME LEVELS - Progressive Learning System
// ==========================================
const GAME_LEVELS = [
  {
    id: 1,
    name: "First Beat",
    difficulty: "Beginner",
    stars: 0,
    maxStars: 3,
    xpReward: 50,
    icon: "🥁",
    description: "Learn the basics! Place kicks and snares to create your first beat.",
    objective: "Continue the rock beat pattern",
    premadePattern: {
      kick: [0, 8],
      snare: [4, 12]
    },
    requirements: {
      instruments: ['kick', 'snare'],
      minNotes: 4,
      mustInclude: { kick: 2, snare: 2 }
    },
    hints: [
      "💡 Start with the KICK drum - it's the heartbeat of your music!",
      "💡 Place kicks on beats 1 and 3 (steps 0, 8, 16, 24)",
      "💡 Add SNARE on beats 2 and 4 (steps 4, 12, 20, 28) for the backbeat",
      "💡 Hit PLAY to hear your creation!"
    ],
    patternVariations: [
      { name: "Rock Backbeat", pattern: { kick: [0, 16], snare: [8, 24] }, difficulty: "Easy" },
      { name: "Hip-Hop Swing", pattern: { kick: [0, 11, 16, 27], snare: [8, 24] }, difficulty: "Medium" },
      { name: "Reggae One-Drop", pattern: { kick: [16], snare: [8, 24] }, difficulty: "Hard" }
    ],
    tempo: 100,
    unlocked: true,
    themeId: 'neon'
  },
  {
    id: 2,
    name: "Add the Groove",
    difficulty: "Beginner",
    stars: 0,
    maxStars: 3,
    xpReward: 75,
    icon: "🎩",
    description: "Time to add some rhythm! The drums are ready - you add the Hi-Hats.",
    objective: "Add 4 HI-HATS to the existing beat",
    premadePattern: {
      kick: [0, 8, 16, 24],
      snare: [4, 12, 20, 28]
    },
    requirements: {
      instruments: ['hihat'],
      minNotes: 4,
      mustInclude: { hihat: 4 }
    },
    hints: [
      "💡 Hi-hats create the 'tick-tick-tick' rhythm!",
      "💡 Try placing hi-hats on every other step for 8th notes",
      "💡 The hi-hat fills the space between kick and snare",
      "💡 Experiment with different patterns!"
    ],
    patternVariations: [
      { name: "Disco Groove", pattern: { kick: [0, 8, 16, 24], snare: [8, 24], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30] }, difficulty: "Easy" },
      { name: "Trap Roll", pattern: { kick: [0, 16], snare: [8, 24], hihat: [0, 1, 2, 3, 8, 9, 10, 11, 16, 17, 18, 19, 24, 25, 26, 27] }, difficulty: "Medium" },
      { name: "Breakbeat Shuffle", pattern: { kick: [0, 10, 16], snare: [5, 13, 21, 29], hihat: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30] }, difficulty: "Hard" }
    ],
    tempo: 100,
    unlocked: true,
    themeId: 'neon'
  },
  {
    id: 3,
    name: "Bass Drop",
    difficulty: "Easy",
    stars: 0,
    maxStars: 3,
    xpReward: 100,
    icon: "🎸",
    description: "The drums are tight. Now lay down a heavy Bass line to shake the floor!",
    objective: "Add a BASS line to the drum beat",
    premadePattern: {
      kick: [0, 10, 16, 26],
      snare: [8, 24],
      hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
    },
    requirements: {
      instruments: ['bass'],
      minNotes: 4,
      mustInclude: { bass: 4 }
    },
    hints: [
      "💡 Bass usually follows the kick drum",
      "💡 Try placing bass notes where your kicks are",
      "💡 Add some bass notes in between for groove",
      "💡 Lower sounds = more power!"
    ],
    patternVariations: [
      { name: "Dubstep Wobble", pattern: { kick: [0, 16], snare: [8, 24], bass: [0, 2, 4, 6, 16, 18, 20, 22] }, difficulty: "Easy" },
      { name: "Funk Slap", pattern: { kick: [0, 16], snare: [8, 24], bass: [0, 3, 7, 10, 16, 19, 23, 26] }, difficulty: "Medium" },
      { name: "Trance Roll", pattern: { kick: [0, 4, 8, 12, 16, 20, 24, 28], snare: [8, 24], bass: [0, 1, 4, 5, 8, 9, 12, 13, 16, 17, 20, 21, 24, 25, 28, 29] }, difficulty: "Hard" }
    ],
    tempo: 95,
    unlocked: false,
    themeId: 'ocean'
  },
  {
    id: 4,
    name: "Four on the Floor",
    difficulty: "Easy",
    stars: 0,
    maxStars: 3,
    xpReward: 125,
    icon: "🏠",
    description: "Learn the classic house music pattern!",
    objective: "Create a house beat with kick on every beat",
    requirements: {
      instruments: ['kick', 'snare', 'hihat'],
      minNotes: 12,
      mustInclude: { kick: 4, snare: 2, hihat: 4 }
    },
    hints: [
      "💡 'Four on the floor' means kick on beats 1, 2, 3, 4",
      "💡 Place kicks on steps 0, 8, 16, 24",
      "💡 Claps/snares go on 2 and 4 (steps 8, 24)",
      "💡 Hi-hats go on the OFF-beats for that house bounce!"
    ],
    patternVariations: [
      { name: "Chicago House", pattern: { kick: [0, 8, 16, 24], snare: [8, 24], hihat: [4, 12, 20, 28] }, difficulty: "Easy" },
      { name: "UK Garage 2-Step", pattern: { kick: [0, 12, 16, 28], snare: [6, 22], hihat: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30] }, difficulty: "Medium" },
      { name: "Baile Funk", pattern: { kick: [0, 3, 6, 8, 11, 14, 16, 19, 22, 24, 27, 30], snare: [8, 24], hihat: [2, 10, 18, 26] }, difficulty: "Hard" }
    ],
    tempo: 124,
    unlocked: false,
    themeId: 'golden'
  },
  {
    id: 5,
    name: "Synth Magic",
    difficulty: "Medium",
    stars: 0,
    maxStars: 3,
    xpReward: 150,
    icon: "🎹",
    description: "Add melody and chords with the synthesizer!",
    objective: "Create a beat using 4 different instruments including SYNTH",
    requirements: {
      instruments: ['kick', 'snare', 'hihat', 'synth'],
      minNotes: 12,
      mustInclude: { kick: 2, snare: 2, hihat: 4, synth: 2 }
    },
    hints: [
      "💡 Synth adds melody and harmony to your beat",
      "💡 Try placing synth notes on off-beats",
      "💡 Synth chords work well with bass lines",
      "💡 Less is more - don't overcrowd!"
    ],
    patternVariations: [
      { name: "Ambient Pad", pattern: { kick: [0, 16], snare: [8, 24], hihat: [0, 8, 16, 24], synth: [0] }, difficulty: "Easy" },
      { name: "Arpeggio Sequence", pattern: { kick: [0, 16], snare: [8, 24], hihat: [4, 12, 20, 28], synth: [0, 2, 4, 6, 8, 10, 12, 14] }, difficulty: "Medium" },
      { name: "Acid Bassline", pattern: { kick: [0, 6, 12, 18, 24, 30], snare: [8, 24], hihat: [0, 4, 8, 12, 16, 20, 24, 28], synth: [0, 3, 7, 10, 13, 16, 19, 23, 26, 29] }, difficulty: "Hard" }
    ],
    tempo: 110,
    unlocked: false,
    themeId: 'forest'
  },
  {
    id: 6,
    name: "Percussion Party",
    difficulty: "Medium",
    stars: 0,
    maxStars: 3,
    xpReward: 175,
    icon: "🪘",
    description: "Layer percussion for complex rhythms!",
    objective: "Use 5 instruments including PERCUSSION",
    requirements: {
      instruments: ['kick', 'snare', 'hihat', 'perc', 'bass'],
      minNotes: 16,
      mustInclude: { kick: 2, snare: 2, hihat: 4, perc: 4, bass: 2 }
    },
    hints: [
      "💡 Percussion adds texture and fills gaps",
      "💡 Shakers and congas work great off the main beat",
      "💡 Try polyrhythms - patterns that contrast!",
      "💡 World music uses lots of percussion layers"
    ],
    patternVariations: [
      { name: "Samba Brazilian", pattern: { kick: [0, 6, 12, 18, 24, 30], snare: [4, 20], hihat: [0, 4, 8, 12, 16, 20, 24, 28], perc: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30], bass: [0, 12, 24] }, difficulty: "Easy" },
      { name: "Middle Eastern Darbuka", pattern: { kick: [0, 8, 16, 24], snare: [6, 14, 22, 30], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], perc: [1, 5, 9, 13, 17, 21, 25, 29], bass: [0, 16] }, difficulty: "Medium" },
      { name: "West African Djembe", pattern: { kick: [0, 10, 20], snare: [8, 18, 28], hihat: [0, 4, 8, 12, 16, 20, 24, 28], perc: [0, 2, 5, 7, 10, 12, 15, 17, 20, 22, 25, 27, 30], bass: [0, 10, 20] }, difficulty: "Hard" }
    ],
    tempo: 98,
    unlocked: false,
    themeId: 'sunset'
  },
  {
    id: 7,
    name: "Lo-Fi Chill",
    difficulty: "Medium",
    stars: 0,
    maxStars: 3,
    xpReward: 200,
    icon: "🌙",
    description: "Create a relaxing lo-fi beat with keys!",
    objective: "Make a chill beat with KEYS and slow tempo",
    requirements: {
      instruments: ['kick', 'snare', 'hihat', 'keys', 'bass'],
      minNotes: 14,
      mustInclude: { kick: 2, snare: 2, hihat: 4, keys: 2, bass: 2 }
    },
    hints: [
      "💡 Lo-fi beats are SLOW - around 70-85 BPM",
      "💡 Keys add that jazzy, nostalgic feel",
      "💡 Leave SPACE in your beat - silence is powerful",
      "💡 Ghost notes (quiet hits) add human feel"
    ],
    patternVariations: [
      { name: "Vinyl Crackle Minimal", pattern: { kick: [0, 20], snare: [10, 26], hihat: [0, 6, 12, 18, 24, 30], keys: [0], bass: [0, 20] }, difficulty: "Easy" },
      { name: "Boom Bap Jazzy", pattern: { kick: [0, 11, 16, 27], snare: [8, 24], hihat: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30], keys: [0, 8, 16, 24], bass: [0, 11, 16, 27] }, difficulty: "Medium" },
      { name: "Anime Opening", pattern: { kick: [0, 6, 16, 22], snare: [8, 24], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], keys: [0, 4, 8, 12, 16, 20, 24, 28], bass: [0, 6, 12, 16, 22, 28] }, difficulty: "Hard" }
    ],
    tempo: 75,
    unlocked: false,
    themeId: 'midnight'
  },
  {
    id: 8,
    name: "Full Production",
    difficulty: "Hard",
    stars: 0,
    maxStars: 3,
    xpReward: 250,
    icon: "🎧",
    description: "Use ALL instruments to create a full track!",
    objective: "Create a complete beat using 6+ instruments",
    requirements: {
      instruments: ['kick', 'snare', 'hihat', 'bass', 'synth', 'keys'],
      minNotes: 24,
      mustInclude: { kick: 4, snare: 4, hihat: 8, bass: 4, synth: 2, keys: 2 }
    },
    hints: [
      "💡 Build in layers - start with drums, add bass, then melody",
      "💡 Make sure instruments don't clash - give each space",
      "💡 The best beats have contrast - loud and quiet parts",
      "💡 You're ready to be a producer!"
    ],
    patternVariations: [
      { name: "Synthwave Retro", pattern: { kick: [0, 8, 16, 24], snare: [8, 24], hihat: [4, 12, 20, 28], bass: [0, 8, 16, 24], synth: [0, 16], keys: [4, 12, 20, 28] }, difficulty: "Easy" },
      { name: "Future Bass", pattern: { kick: [0, 16], snare: [8, 24], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 6, 10, 16, 22, 26], synth: [0, 4, 8, 12, 16, 20, 24, 28], keys: [2, 10, 18, 26] }, difficulty: "Medium" },
      { name: "Industrial Dark", pattern: { kick: [0, 6, 12, 18, 24, 30], snare: [4, 10, 16, 22, 28], hihat: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30], bass: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30], synth: [0, 12, 24], keys: [6, 18, 30] }, difficulty: "Hard" }
    ],
    tempo: 105,
    unlocked: false,
    themeId: 'midnight'
  },
  {
    id: 9,
    name: "Speed Demon",
    difficulty: "Hard",
    stars: 0,
    maxStars: 3,
    xpReward: 300,
    icon: "⚡",
    description: "Fast tempo challenge - can you keep up?",
    objective: "Create a high-energy beat at 140+ BPM",
    requirements: {
      instruments: ['kick', 'snare', 'hihat', 'bass', 'synth'],
      minNotes: 20,
      mustInclude: { kick: 4, snare: 4, hihat: 8, bass: 2, synth: 2 }
    },
    hints: [
      "💡 Fast tempos need simpler patterns",
      "💡 Drum & Bass and Jungle run at 160-180 BPM!",
      "💡 Keep the rhythm tight and punchy",
      "💡 Less notes per bar at high speeds"
    ],
    patternVariations: [
      { name: "Amen Break Classic", pattern: { kick: [0, 10, 16], snare: [4, 12, 20, 28], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 10, 16], synth: [0, 16] }, difficulty: "Easy" },
      { name: "Halftime Dubstep", pattern: { kick: [0, 16], snare: [8], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], bass: [0, 1, 2, 3, 8, 9, 10, 11, 16, 17, 18, 19, 24, 25, 26, 27], synth: [8, 24] }, difficulty: "Medium" },
      { name: "Footwork/Juke", pattern: { kick: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30], snare: [4, 8, 12, 16, 20, 24, 28], hihat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], bass: [0, 6, 12, 18, 24, 30], synth: [0, 8, 16, 24] }, difficulty: "Hard" }
    ],
    tempo: 145,
    unlocked: false,
    themeId: 'neon'
  },
  {
    id: 10,
    name: "Master Beat",
    difficulty: "Expert",
    stars: 0,
    maxStars: 3,
    xpReward: 500,
    icon: "👑",
    description: "The ultimate challenge - prove your mastery!",
    objective: "Create a complex beat with 7 instruments and 30+ notes",
    requirements: {
      instruments: ['kick', 'snare', 'hihat', 'bass', 'synth', 'keys', 'perc'],
      minNotes: 30,
      mustInclude: { kick: 4, snare: 4, hihat: 8, bass: 4, synth: 4, keys: 2, perc: 4 }
    },
    hints: [
      "💡 This is everything you've learned combined!",
      "💡 Think like a real producer - arrangement matters",
      "💡 Use dynamics - vary the intensity",
      "💡 You've mastered Rhythm Realm! 👑"
    ],
    patternVariations: [
      { name: "Cinematic Epic", pattern: { kick: [0, 8, 16, 24], snare: [12, 28], hihat: [0, 4, 8, 12, 16, 20, 24, 28], bass: [0, 8, 16, 24], synth: [0, 16], keys: [0, 8, 16, 24], perc: [4, 12, 20, 28] }, difficulty: "Easy" },
      { name: "Glitch Hop Experimental", pattern: { kick: [0, 7, 14, 16, 23, 30], snare: [6, 10, 22, 26], hihat: [0, 1, 3, 4, 6, 7, 9, 10, 12, 13, 15, 16, 18, 19, 21, 22, 24, 25, 27, 28, 30, 31], bass: [0, 2, 7, 9, 14, 16, 18, 23, 25, 30], synth: [0, 7, 14, 16, 23, 30], keys: [3, 10, 19, 26], perc: [1, 5, 9, 13, 17, 21, 25, 29] }, difficulty: "Medium" },
      { name: "Tribal Fusion", pattern: { kick: [0, 5, 10, 15, 20, 25, 30], snare: [8, 18, 28], hihat: [0, 2, 5, 7, 10, 12, 15, 17, 20, 22, 25, 27, 30], bass: [0, 5, 10, 15, 20, 25, 30], synth: [0, 10, 20, 30], keys: [5, 15, 25], perc: [0, 2, 3, 5, 7, 8, 10, 12, 13, 15, 17, 18, 20, 22, 23, 25, 27, 28, 30] }, difficulty: "Hard" }
    ],
    tempo: 115,
    unlocked: false,
    themeId: 'golden'
  }
];

// ==========================================
// 5. AUDIO ENGINE - Advanced Synthesizer
// ==========================================
const AudioEngine = {
  ctx: null,
  masterGain: null,
  compressor: null,
  analyser: null,
  ambienceNodes: [],

  init: () => {
    if (typeof window === 'undefined') return;
    if (!AudioEngine.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        AudioEngine.ctx = new AudioContext();
        AudioEngine.masterGain = AudioEngine.ctx.createGain();
        AudioEngine.masterGain.gain.value = 0.7;
        AudioEngine.compressor = AudioEngine.ctx.createDynamicsCompressor();
        AudioEngine.compressor.threshold.value = -20;
        AudioEngine.compressor.knee.value = 10;
        AudioEngine.compressor.ratio.value = 4;
        AudioEngine.compressor.attack.value = 0.003;
        AudioEngine.compressor.release.value = 0.1;
        // Create analyser for waveform visualization
        AudioEngine.analyser = AudioEngine.ctx.createAnalyser();
        AudioEngine.analyser.fftSize = 256;
        AudioEngine.masterGain.connect(AudioEngine.compressor);
        AudioEngine.compressor.connect(AudioEngine.analyser);
        AudioEngine.analyser.connect(AudioEngine.ctx.destination);
      }
    }
    if (AudioEngine.ctx && AudioEngine.ctx.state === 'suspended') {
      AudioEngine.ctx.resume();
    }
  },

  createNoise: (duration) => {
    const bufferSize = AudioEngine.ctx.sampleRate * duration;
    const buffer = AudioEngine.ctx.createBuffer(1, bufferSize, AudioEngine.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  },

  createFilteredNoise: (freq, q, duration, t) => {
    const noise = AudioEngine.ctx.createBufferSource();
    noise.buffer = AudioEngine.createNoise(duration);
    const filter = AudioEngine.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value = q;
    noise.connect(filter);
    return { source: noise, output: filter };
  },

  startAmbience: (type) => { /* simplified */ },
  stopAmbience: () => {
    AudioEngine.ambienceNodes.forEach(node => {
      try { node.stop(); } catch (e) { }
      try { node.disconnect(); } catch (e) { }
    });
    AudioEngine.ambienceNodes = [];
  },

  // Stop all playing sounds by suspending and resuming context
  stopAll: () => {
    if (AudioEngine.ctx) {
      // Suspend immediately stops scheduled sounds
      AudioEngine.ctx.suspend().then(() => {
        // Resume after a tiny delay so new sounds can play
        setTimeout(() => {
          if (AudioEngine.ctx && AudioEngine.ctx.state === 'suspended') {
            AudioEngine.ctx.resume();
          }
        }, 50);
      }).catch(() => { });
    }
  },

  trigger: (variant, time = 0, config = { pitch: 0, chord: null, bend: 0, volume: 100, muted: false, attack: 0, decay: 100, filter: 100, reverb: 0, distortion: 0, pan: 0 }) => {
    // Skip if muted
    if (config.muted) return;

    if (!AudioEngine.ctx || !AudioEngine.masterGain) return;
    const t = time || AudioEngine.ctx.currentTime;
    const pitchMult = Math.pow(2, config.pitch / 12);
    const baseFreq = variant.freq * pitchMult;
    const soundType = variant.type || 'default';

    // Volume multiplier (0-1)
    const volumeMult = (config.volume !== undefined ? config.volume : 100) / 100;

    // Create a volume gain node for this sound
    const volumeGain = AudioEngine.ctx.createGain();
    volumeGain.gain.value = volumeMult;

    // Create panner node
    const panner = AudioEngine.ctx.createStereoPanner();
    panner.pan.value = (config.pan || 0) / 50; // Convert -50 to 50 to -1 to 1

    // Connect: sound -> volumeGain -> panner -> masterGain
    volumeGain.connect(panner);
    panner.connect(AudioEngine.masterGain);

    // === KICK DRUMS ===
    if (soundType.startsWith('kick')) {
      const osc = AudioEngine.ctx.createOscillator();
      const gain = AudioEngine.ctx.createGain();
      osc.type = 'sine';

      // Variables for different kick characters
      let clickFreq = 4000;
      let clickVol = 0.5;
      let clickDecay = 0.02;
      let noiseVol = 0.3;
      let noiseFilterFreq = 200;

      if (soundType === 'kick808') {
        // Classic 808 - DEEP sub bass, long sustain, iconic boom
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
        osc.frequency.exponentialRampToValueAtTime(28, t + 0.6);
        gain.gain.setValueAtTime(1.0, t);
        gain.gain.exponentialRampToValueAtTime(0.7, t + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.9);
        clickFreq = 2500;
        clickVol = 0.3;
        clickDecay = 0.015;
        noiseVol = 0.15;
        noiseFilterFreq = 150;
      } else if (soundType === 'kickPunch') {
        // Punchy kick - TIGHT attack, SHORT decay, snappy
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(65, t + 0.03);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.08);
        gain.gain.setValueAtTime(1.0, t);
        gain.gain.exponentialRampToValueAtTime(0.2, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
        clickFreq = 6000;
        clickVol = 0.8;
        clickDecay = 0.008;
        noiseVol = 0.5;
        noiseFilterFreq = 350;
      } else if (soundType === 'kickSub') {
        // Sub kick - ULTRA deep, long tail, rumbling bass
        osc.frequency.setValueAtTime(80, t);
        osc.frequency.exponentialRampToValueAtTime(32, t + 0.15);
        osc.frequency.exponentialRampToValueAtTime(22, t + 0.5);
        gain.gain.setValueAtTime(1.0, t);
        gain.gain.linearRampToValueAtTime(0.8, t + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 1.2);
        clickFreq = 1500;
        clickVol = 0.15;
        clickDecay = 0.02;
        noiseVol = 0.1;
        noiseFilterFreq = 100;
      } else {
        // Acoustic kick - realistic drum, mid punch, natural resonance
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(85, t + 0.025);
        osc.frequency.exponentialRampToValueAtTime(55, t + 0.12);
        gain.gain.setValueAtTime(0.9, t);
        gain.gain.exponentialRampToValueAtTime(0.35, t + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        clickFreq = 5000;
        clickVol = 0.7;
        clickDecay = 0.012;
        noiseVol = 0.6;
        noiseFilterFreq = 400;
      }

      // Click/attack transient - varies per kick type
      const click = AudioEngine.ctx.createOscillator();
      const clickGain = AudioEngine.ctx.createGain();
      click.type = 'triangle';
      click.frequency.setValueAtTime(clickFreq, t);
      click.frequency.exponentialRampToValueAtTime(150, t + clickDecay);
      clickGain.gain.setValueAtTime(clickVol, t);
      clickGain.gain.exponentialRampToValueAtTime(0.01, t + clickDecay + 0.005);
      click.connect(clickGain);
      clickGain.connect(volumeGain);
      click.start(t);
      click.stop(t + 0.05);

      // Noise for body/thump - varies per kick type
      const noiseBuffer = AudioEngine.ctx.createBuffer(1, AudioEngine.ctx.sampleRate * 0.1, AudioEngine.ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (AudioEngine.ctx.sampleRate * 0.015));
      }
      const noiseSource = AudioEngine.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      const noiseFilter = AudioEngine.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.value = noiseFilterFreq;
      const noiseGainNode = AudioEngine.ctx.createGain();
      noiseGainNode.gain.setValueAtTime(noiseVol, t);
      noiseGainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.06);
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGainNode);
      noiseGainNode.connect(volumeGain);
      noiseSource.start(t);
      noiseSource.stop(t + 0.1);

      osc.connect(gain);
      gain.connect(volumeGain);
      osc.start(t);
      osc.stop(t + 1.5);
    }
    // === SNARE / CLAP ===
    // === SNARE / CLAP ===
    else if (soundType.startsWith('snare') || soundType === 'clap' || soundType === 'rim') {
      const osc = AudioEngine.ctx.createOscillator();
      const oscGain = AudioEngine.ctx.createGain();
      osc.type = 'triangle';

      // Noise component for snare/clap match
      const noise = AudioEngine.ctx.createBufferSource();
      noise.buffer = AudioEngine.createNoise(0.4);
      const noiseFilter = AudioEngine.ctx.createBiquadFilter();
      const noiseGain = AudioEngine.ctx.createGain();

      if (soundType === 'clap') {
        // Multi-trigger noise for clap effect
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = 1500;
        noiseFilter.Q.value = 1;

        // Clap tone
        osc.type = 'triangle';
        osc.frequency.value = 150;
        oscGain.gain.setValueAtTime(0.1, t);
        oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

        // We trigger noise manually 3 times for clap
        // Disconnect main noise graph for custom clap logic
        for (let i = 0; i < 3; i++) {
          const delay = i * 0.012;
          const clapSource = AudioEngine.ctx.createBufferSource();
          clapSource.buffer = noise.buffer;
          const clapFilter = AudioEngine.ctx.createBiquadFilter();
          clapFilter.type = 'bandpass';
          clapFilter.frequency.value = 1500;
          const clapGain = AudioEngine.ctx.createGain();

          clapGain.gain.setValueAtTime(0.6, t + delay);
          clapGain.gain.exponentialRampToValueAtTime(0.01, t + delay + 0.1);

          clapSource.connect(clapFilter);
          clapFilter.connect(clapGain);
          clapGain.connect(volumeGain);
          clapSource.start(t + delay);
          clapSource.stop(t + delay + 0.15);
        }
      }
      else if (soundType === 'rim') {
        osc.frequency.value = baseFreq || 800;
        osc.type = 'square';
        oscGain.gain.setValueAtTime(0.3, t);
        oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
        // Minimal click noise for rim
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 5000;
        noiseGain.gain.setValueAtTime(0.1, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.02);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(volumeGain);
        noise.start(t);
      }
      else {
        // Standard Snare (Crack, Trap, etc)
        // 1. Tonal Body (Oscillator)
        osc.frequency.setValueAtTime(baseFreq || 200, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.15);

        // 2. Snap (Noise) - Using Highpass for crisp sound
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 2000; // Let the highs through

        // Envelope
        oscGain.gain.setValueAtTime(0.5, t);
        oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

        const noiseVol = soundType === 'snareTrap' ? 0.8 : 0.6;
        noiseGain.gain.setValueAtTime(noiseVol, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

        // Connect Noise Graph
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(volumeGain);
        noise.start(t);
      }

      // Connect Tone Graph (except for clap which handles it differently/minimally)
      if (soundType !== 'clap') {
        osc.connect(oscGain);
        oscGain.connect(volumeGain);
        osc.start(t);
        osc.stop(t + 0.4);
      }
    }
    // === HI-HATS / SHAKER ===
    else if (soundType.startsWith('hihat') || soundType === 'shaker') {
      const { source, output } = AudioEngine.createFilteredNoise(
        soundType === 'hihatOpen' ? 6000 : soundType === 'shaker' ? 12000 : 10000,
        soundType === 'hihatClosed' ? 3 : 1.5,
        soundType === 'hihatOpen' ? 0.4 : 0.15,
        t
      );
      const gain = AudioEngine.ctx.createGain();
      const highpass = AudioEngine.ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = soundType === 'hihatPedal' ? 3000 : 7000;
      const duration = soundType === 'hihatOpen' ? 0.35 : soundType === 'shaker' ? 0.1 : 0.06;
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + duration);
      output.connect(highpass);
      highpass.connect(gain);
      gain.connect(volumeGain);
      source.start(t);
      source.stop(t + duration + 0.1);
    }
    // === TOMS / TAIKO ===
    else if (soundType.startsWith('tom') || soundType === 'taiko') {
      const osc = AudioEngine.ctx.createOscillator();
      const gain = AudioEngine.ctx.createGain();
      osc.type = 'sine';
      const freq = soundType === 'tomLow' ? 80 : soundType === 'tomMid' ? 150 : soundType === 'tomHigh' ? 250 : 60;
      osc.frequency.setValueAtTime(freq * pitchMult * 1.5, t);
      osc.frequency.exponentialRampToValueAtTime(freq * pitchMult, t + 0.02);
      osc.frequency.exponentialRampToValueAtTime(freq * pitchMult * 0.7, t + 0.3);
      const vol = soundType === 'taiko' ? 0.8 : 0.6;
      const decay = soundType === 'taiko' ? 0.8 : 0.4;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + decay);
      osc.connect(gain);
      gain.connect(volumeGain);
      osc.start(t);
      osc.stop(t + decay + 0.1);
    }
    // === PERCUSSION ===
    else if (['conga', 'bongo', 'cowbell', 'woodblock'].includes(soundType)) {
      const osc = AudioEngine.ctx.createOscillator();
      const osc2 = AudioEngine.ctx.createOscillator();
      const gain = AudioEngine.ctx.createGain();
      if (soundType === 'cowbell') {
        osc.type = 'square';
        osc2.type = 'square';
        osc.frequency.value = 800 * pitchMult;
        osc2.frequency.value = 540 * pitchMult;
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        osc2.connect(gain);
        osc2.start(t);
        osc2.stop(t + 0.2);
      } else if (soundType === 'woodblock') {
        osc.type = 'sine';
        osc.frequency.value = 1200 * pitchMult;
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
      } else {
        osc.type = 'sine';
        const freq = soundType === 'conga' ? 200 : 350;
        osc.frequency.setValueAtTime(freq * pitchMult * 1.3, t);
        osc.frequency.exponentialRampToValueAtTime(freq * pitchMult, t + 0.02);
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
      }
      osc.connect(gain);
      gain.connect(volumeGain);
      osc.start(t);
      osc.stop(t + 0.3);
    }
    // === BASS ===
    else if (soundType.startsWith('bass')) {
      const notes = [baseFreq];
      if (config.chord === 'maj') { notes.push(baseFreq * 1.2599, baseFreq * 1.4983); }
      else if (config.chord === 'min') { notes.push(baseFreq * 1.1892, baseFreq * 1.4983); }

      // Special handling for Sub Bass - needs to be loud and clean
      if (soundType === 'bassSub') {
        notes.forEach((freq) => {
          const osc = AudioEngine.ctx.createOscillator();
          const osc2 = AudioEngine.ctx.createOscillator();
          const gain = AudioEngine.ctx.createGain();

          // Pure sine waves for deep sub bass
          osc.type = 'sine';
          osc2.type = 'sine';
          osc.frequency.value = freq || 55;
          osc2.frequency.value = (freq || 55) * 2; // Add octave for presence

          // Much louder volume for sub bass
          const vol = 0.7 / notes.length;
          gain.gain.setValueAtTime(vol, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + (variant.decay || 0.5));

          // Connect directly without filter for clean sub
          osc.connect(gain);
          osc2.connect(gain);
          gain.connect(volumeGain);

          osc.start(t);
          osc2.start(t);
          osc.stop(t + 0.7);
          osc2.stop(t + 0.7);
        });
      } else {
        // Other bass types
        notes.forEach((freq) => {
          const osc = AudioEngine.ctx.createOscillator();
          const osc2 = AudioEngine.ctx.createOscillator();
          const gain = AudioEngine.ctx.createGain();
          const filter = AudioEngine.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = soundType === 'bassWobble' ? 400 : 800;
          filter.Q.value = 5;
          if (soundType === 'bassWobble') {
            const lfo = AudioEngine.ctx.createOscillator();
            const lfoGain = AudioEngine.ctx.createGain();
            lfo.frequency.value = 4;
            lfoGain.gain.value = 300;
            lfo.connect(lfoGain);
            lfoGain.connect(filter.frequency);
            lfo.start(t);
            lfo.stop(t + 0.6);
          }
          osc.type = 'sawtooth';
          osc2.type = 'sine';
          osc.frequency.value = freq || 110;
          osc2.frequency.value = freq || 110;
          const vol = 0.6 / notes.length;
          gain.gain.setValueAtTime(vol, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + (variant.decay || 0.3));
          osc.connect(filter);
          osc2.connect(gain);
          filter.connect(gain);
          gain.connect(volumeGain);
          osc.start(t);
          osc2.start(t);
          osc.stop(t + 0.6);
          osc2.stop(t + 0.6);
        });
      }
    }
    // === SYNTHS ===
    else if (soundType.startsWith('synth')) {
      const notes = [baseFreq];
      if (config.chord === 'maj') { notes.push(baseFreq * 1.2599, baseFreq * 1.4983); }
      else if (config.chord === 'min') { notes.push(baseFreq * 1.1892, baseFreq * 1.4983); }
      notes.forEach((freq) => {
        const osc = AudioEngine.ctx.createOscillator();
        const gain = AudioEngine.ctx.createGain();
        const filter = AudioEngine.ctx.createBiquadFilter();
        if (soundType === 'synthPad') {
          osc.type = 'sawtooth';
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(200, t);
          filter.frequency.linearRampToValueAtTime(2000, t + 0.3);
          filter.frequency.linearRampToValueAtTime(800, t + 1.0);
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.4 / notes.length, t + 0.1);
          gain.gain.linearRampToValueAtTime(0.01, t + 1.0);
        } else if (soundType === 'synthPluck') {
          osc.type = 'sawtooth';
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(5000, t);
          filter.frequency.exponentialRampToValueAtTime(500, t + 0.15);
          gain.gain.setValueAtTime(0.5 / notes.length, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        } else if (soundType === 'synthStab') {
          osc.type = 'square';
          filter.type = 'lowpass';
          filter.frequency.value = 2000;
          gain.gain.setValueAtTime(0.45 / notes.length, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        } else {
          osc.type = 'square';
          filter.type = 'lowpass';
          filter.frequency.value = 3000;
          gain.gain.setValueAtTime(0.2 / notes.length, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
        }
        osc.frequency.value = freq;
        if (config.bend > 0) osc.frequency.linearRampToValueAtTime(freq * (1 + config.bend / 50), t + 0.1);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(volumeGain);
        osc.start(t);
        osc.stop(t + 1.2);
      });
    }
    // === KEYS ===
    else if (soundType.startsWith('keys')) {
      const notes = [baseFreq];
      if (config.chord === 'maj') { notes.push(baseFreq * 1.2599, baseFreq * 1.4983); }
      else if (config.chord === 'min') { notes.push(baseFreq * 1.1892, baseFreq * 1.4983); }
      notes.forEach((freq) => {
        const osc = AudioEngine.ctx.createOscillator();
        const osc2 = AudioEngine.ctx.createOscillator();
        const gain = AudioEngine.ctx.createGain();
        if (soundType === 'keysPiano') {
          osc.type = 'triangle';
          osc2.type = 'sine';
          osc2.frequency.value = freq * 2;
          gain.gain.setValueAtTime(0.35 / notes.length, t);
          gain.gain.exponentialRampToValueAtTime(0.15 / notes.length, t + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
        } else if (soundType === 'keysRhodes') {
          osc.type = 'sine';
          osc2.type = 'sine';
          osc2.frequency.value = freq * 3;
          gain.gain.setValueAtTime(0.25 / notes.length, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 1.0);
        } else if (soundType === 'keysOrgan') {
          osc.type = 'sine';
          osc2.type = 'sine';
          osc2.frequency.value = freq * 2;
          gain.gain.setValueAtTime(0.2 / notes.length, t);
          gain.gain.setValueAtTime(0.2 / notes.length, t + 0.4);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
        } else {
          osc.type = 'sine';
          osc2.type = 'sine';
          osc2.frequency.value = freq * 4;
          gain.gain.setValueAtTime(0.2 / notes.length, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 1.2);
        }
        osc.frequency.value = freq;
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(volumeGain);
        osc.start(t);
        osc2.start(t);
        osc.stop(t + 1.5);
        osc2.stop(t + 1.5);
      });
    }
    // === VOX ===
    else if (soundType.startsWith('vox')) {
      const osc = AudioEngine.ctx.createOscillator();
      const gain = AudioEngine.ctx.createGain();
      const filter = AudioEngine.ctx.createBiquadFilter();
      const filter2 = AudioEngine.ctx.createBiquadFilter();
      osc.type = 'sawtooth';
      osc.frequency.value = baseFreq;
      filter.type = 'bandpass';
      filter2.type = 'bandpass';
      filter.Q.value = 10;
      filter2.Q.value = 10;
      if (soundType === 'voxOoh') {
        filter.frequency.value = 400;
        filter2.frequency.value = 800;
      } else if (soundType === 'voxAah') {
        filter.frequency.value = 700;
        filter2.frequency.value = 1200;
      } else if (soundType === 'voxHey') {
        filter.frequency.setValueAtTime(600, t);
        filter.frequency.linearRampToValueAtTime(400, t + 0.1);
        filter2.frequency.value = 2000;
      } else {
        filter.frequency.value = 500;
        filter2.frequency.value = 1500;
        const osc2 = AudioEngine.ctx.createOscillator();
        osc2.type = 'sawtooth';
        osc2.frequency.value = baseFreq * 1.005;
        osc2.connect(filter);
        osc2.start(t);
        osc2.stop(t + 1.0);
      }
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.05);
      gain.gain.linearRampToValueAtTime(0.01, t + (variant.decay || 0.5));
      osc.connect(filter);
      filter.connect(filter2);
      filter2.connect(gain);
      gain.connect(volumeGain);
      osc.start(t);
      osc.stop(t + 1.0);
    }
    // === LEAD ===
    else if (soundType.startsWith('lead')) {
      const notes = [baseFreq];
      if (config.chord === 'maj') { notes.push(baseFreq * 1.2599, baseFreq * 1.4983); }
      else if (config.chord === 'min') { notes.push(baseFreq * 1.1892, baseFreq * 1.4983); }
      notes.forEach((freq) => {
        const osc = AudioEngine.ctx.createOscillator();
        const gain = AudioEngine.ctx.createGain();
        const filter = AudioEngine.ctx.createBiquadFilter();
        if (soundType === 'leadSaw') {
          osc.type = 'sawtooth';
          filter.type = 'lowpass';
          filter.frequency.value = 4000;
        } else if (soundType === 'leadSquare') {
          osc.type = 'square';
          filter.type = 'lowpass';
          filter.frequency.value = 3000;
        } else if (soundType === 'leadPluck') {
          osc.type = 'sawtooth';
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(8000, t);
          filter.frequency.exponentialRampToValueAtTime(500, t + 0.1);
        } else {
          osc.type = 'sawtooth';
          filter.type = 'lowpass';
          filter.frequency.value = 6000;
          filter.Q.value = 5;
        }
        osc.frequency.value = freq;
        if (config.bend > 0) osc.frequency.linearRampToValueAtTime(freq * (1 + config.bend / 30), t + 0.15);
        gain.gain.setValueAtTime(0.2 / notes.length, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + (variant.decay || 0.3));
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(volumeGain);
        osc.start(t);
        osc.stop(t + 0.5);
      });
    }
    // === ORCHESTRA ===
    else if (soundType.startsWith('orch')) {
      const notes = [baseFreq];
      if (config.chord === 'maj') { notes.push(baseFreq * 1.2599, baseFreq * 1.4983); }
      else if (config.chord === 'min') { notes.push(baseFreq * 1.1892, baseFreq * 1.4983); }
      notes.forEach((freq) => {
        const osc = AudioEngine.ctx.createOscillator();
        const osc2 = AudioEngine.ctx.createOscillator();
        const gain = AudioEngine.ctx.createGain();
        const filter = AudioEngine.ctx.createBiquadFilter();
        if (soundType === 'orchStrings') {
          osc.type = 'sawtooth';
          osc2.type = 'sawtooth';
          osc2.frequency.value = freq * 1.003;
          filter.type = 'lowpass';
          filter.frequency.value = 3000;
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.15 / notes.length, t + 0.15);
          gain.gain.linearRampToValueAtTime(0.01, t + 1.0);
        } else if (soundType === 'orchBrass') {
          osc.type = 'sawtooth';
          osc2.type = 'square';
          osc2.frequency.value = freq;
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(500, t);
          filter.frequency.linearRampToValueAtTime(3000, t + 0.1);
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.25 / notes.length, t + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        } else if (soundType === 'orchTimpani') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq * 1.5, t);
          osc.frequency.exponentialRampToValueAtTime(freq, t + 0.05);
          filter.type = 'lowpass';
          filter.frequency.value = 500;
          gain.gain.setValueAtTime(0.6 / notes.length, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
        } else {
          osc.type = 'triangle';
          osc2.type = 'sine';
          osc2.frequency.value = freq * 2;
          filter.type = 'lowpass';
          filter.frequency.value = 4000;
          gain.gain.setValueAtTime(0.25 / notes.length, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
        }
        osc.frequency.value = freq;
        osc.connect(filter);
        if (osc2.frequency.value) {
          osc2.connect(filter);
          osc2.start(t);
          osc2.stop(t + 1.2);
        }
        filter.connect(gain);
        gain.connect(volumeGain);
        osc.start(t);
        osc.stop(t + 1.2);
      });
    }
    // === FX ===
    else if (soundType.startsWith('fx')) {
      const osc = AudioEngine.ctx.createOscillator();
      const gain = AudioEngine.ctx.createGain();
      if (soundType === 'fxRiser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 8, t + 1.5);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.linearRampToValueAtTime(0.4, t + 1.4);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 1.5);
      } else if (soundType === 'fxImpact') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * 4, t);
        osc.frequency.exponentialRampToValueAtTime(20, t + 0.5);
        gain.gain.setValueAtTime(0.8, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
        const { source, output } = AudioEngine.createFilteredNoise(1000, 0.5, 0.3, t);
        const noiseGain = AudioEngine.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.4, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        output.connect(noiseGain);
        noiseGain.connect(volumeGain);
        source.start(t);
        source.stop(t + 0.3);
      } else if (soundType === 'fxLaser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(baseFreq * 2, t);
        osc.frequency.exponentialRampToValueAtTime(baseFreq / 4, t + 0.2);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
      } else {
        osc.type = 'square';
        osc.frequency.setValueAtTime(baseFreq / 2, t);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 2, t + 0.05);
        osc.frequency.exponentialRampToValueAtTime(baseFreq / 2, t + 0.1);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      }
      osc.connect(gain);
      gain.connect(volumeGain);
      osc.start(t);
      osc.stop(t + 1.6);
    }
    // === DEFAULT ===
    else {
      const osc = AudioEngine.ctx.createOscillator();
      const gain = AudioEngine.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = baseFreq;
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
      osc.connect(gain);
      gain.connect(volumeGain);
      osc.start(t);
      osc.stop(t + 0.4);
    }
  }
};

// ==========================================
// 6. MAIN APP
// ==========================================
export default function RhythmRealm() {
  const [view, setView] = useState('splash');
  const [previousView, setPreviousView] = useState('splash'); // Track where user came from
  const [studioMode, setStudioMode] = useState('compose'); // 'compose' or 'perform'
  const [djMode, setDjMode] = useState(false); // DJ Mode state
  const [currentScenario, setCurrentScenario] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tempo, setTempo] = useState(100);
  const [hype, setHype] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const [beatPulse, setBeatPulse] = useState(0);

  // ==========================================
  // AUTHENTICATION & USER STATE
  // ==========================================
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // ==========================================
  // LEADERBOARD & RANKING STATE
  // ==========================================
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [userRank, setUserRank] = useState(null);

  // ==========================================
  // ACHIEVEMENTS STATE
  // ==========================================
  const [showAchievements, setShowAchievements] = useState(false);
  const [userAchievements, setUserAchievements] = useState([]);
  const [achievementsLoading, setAchievementsLoading] = useState(false);
  const [newAchievementUnlocked, setNewAchievementUnlocked] = useState(null);
  const [hasPlayedBeat, setHasPlayedBeat] = useState(false);
  const [usedDJMode, setUsedDJMode] = useState(false);

  // ==========================================
  // LEVEL SYSTEM STATE
  // ==========================================
  const [currentLevel, setCurrentLevel] = useState(null);
  const [levelProgress, setLevelProgress] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rhythmRealm_levelProgress');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [levelScore, setLevelScore] = useState(0);
  const [showProfile, setShowProfile] = useState(false);

  // ==========================================
  // USER STATS FOR ACHIEVEMENTS
  // ==========================================
  const [userStats, setUserStats] = useState(() => {
    // Initialize level stats from localStorage
    let levelsCompleted = 0;
    let threeStarLevels = 0;
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem('rhythmRealm_levelProgress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        levelsCompleted = Object.values(progress).filter(p => p?.completed).length;
        threeStarLevels = Object.values(progress).filter(p => p?.stars >= 3).length;
      }
    }
    return {
      totalBeatsCreated: 0,
      tutorialsCompleted: 0,
      totalScore: 0,
      hasPlayed: false,
      accuracy: 0,
      instrumentsUsed: 0,
      tempo: 100,
      usedDJMode: false,
      currentStreak: 0,
      leaderboardRank: null,
      levelsCompleted,
      threeStarLevels
    };
  });

  // Background Music State
  const [bgMusicEnabled, setBgMusicEnabled] = useState(true);
  const bgMusicRef = useRef(null);
  const bgGainRef = useRef(null);
  const bgAudioCtxRef = useRef(null);

  // Studio States
  const [tutorialActive, setTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [activeGuide, setActiveGuide] = useState(null);
  const [bassShake, setBassShake] = useState(false);
  const [showGuideMenu, setShowGuideMenu] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Customizable Rack State
  const [activeInstrumentIds, setActiveInstrumentIds] = useState(['kick', 'snare', 'hihat', 'bass', 'synth']);
  const [showAddTrackMenu, setShowAddTrackMenu] = useState(false);
  const [lockedInstruments, setLockedInstruments] = useState({});
  const [showSoundPicker, setShowSoundPicker] = useState(null); // Which instrument's sound picker is open

  // New Player Modal State
  const [showNewPlayerModal, setShowNewPlayerModal] = useState(false);

  // Interactive Onboarding Tutorial State
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  // Visual Theme State
  const [currentTheme, setCurrentTheme] = useState(VISUAL_THEMES[4]); // Default to Neon

  // Sound Pack State
  const [activeSoundPack, setActiveSoundPack] = useState('electronic');

  // DJ Mode State
  const [djCrossfader, setDjCrossfader] = useState(50); // 0 = left deck, 100 = right deck
  const [djEffects, setDjEffects] = useState({ filter: 50, echo: 0, flanger: 0, reverb: 0 });
  const [djDecks, setDjDecks] = useState({ left: null, right: null }); // Loaded beats
  const [djScratch, setDjScratch] = useState({ left: 0, right: 0 }); // Turntable rotation
  const [djHotCues, setDjHotCues] = useState({ left: [null, null, null, null], right: [null, null, null, null] });
  const [djLooping, setDjLooping] = useState({ left: false, right: false });
  const [showTrackPicker, setShowTrackPicker] = useState(null); // 'left' or 'right'
  const [djTutorialActive, setDjTutorialActive] = useState(false);
  const [djTutorialStep, setDjTutorialStep] = useState(0);

  // Level 1 Tutorial State - initialized from localStorage to persist "seen" status
  const [showLevelTutorial, setShowLevelTutorial] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('rhythmRealm_lvl1_tutorial_seen');
    }
    return true;
  });

  // Accessibility State
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [largeTextMode, setLargeTextMode] = useState(false);
  const [keyboardNavMode, setKeyboardNavMode] = useState(false);
  const [voiceControlEnabled, setVoiceControlEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastVoiceCommand, setLastVoiceCommand] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const speechSynthRef = useRef(null);
  const recognitionRef = useRef(null);

  // ==========================================
  // AUTHENTICATION EFFECTS & FUNCTIONS
  // ==========================================

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authService.getSession();
        console.log('Session check:', session);
        if (session?.user) {
          setUser(session.user);
          try {
            const profile = await authService.getUserProfile(session.user.id);
            console.log('Profile from session:', profile);
            if (profile) {
              setUserProfile(profile);
              // Update user stats from profile
              setUserStats(prev => ({
                ...prev,
                totalBeatsCreated: profile.total_beats_created || 0,
                tutorialsCompleted: profile.total_tutorials_completed || 0,
                totalScore: profile.total_score || 0,
                currentStreak: profile.current_streak || 0
              }));
            } else {
              // Create profile from user metadata if not found
              const username = session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'Player';
              const newProfile = {
                id: session.user.id,
                username: username,
                email: session.user.email,
                total_score: 0,
                total_beats_created: 0,
                level: 1,
                rank_title: 'Beginner',
                experience_points: 0
              };
              setUserProfile(newProfile);
            }
          } catch (profileError) {
            console.error('Profile fetch error on mount:', profileError);
            // Create a fallback profile
            const username = session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'Player';
            setUserProfile({
              id: session.user.id,
              username: username,
              email: session.user.email,
              total_score: 0,
              total_beats_created: 0,
              level: 1,
              rank_title: 'Beginner',
              experience_points: 0
            });
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Only update if not already set (handleLogin already sets these)
        setUser(prev => prev?.id === session.user.id ? prev : session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      console.log('Attempting sign in with:', authEmail);
      const data = await authService.signIn(authEmail, authPassword);
      console.log('Sign in response:', data);

      const signedInUser = data?.user;

      // Check if email confirmation is required
      if (data?.user && !data?.session) {
        setAuthError('Please verify your email before logging in. Check your inbox for the confirmation link.');
        setAuthLoading(false);
        return;
      }

      if (!signedInUser) {
        setAuthError('Login failed. Please check your credentials.');
        setAuthLoading(false);
        return;
      }

      // Immediately close modal and set user for instant feedback
      setShowAuthModal(false);
      setUser(signedInUser);
      setAuthEmail('');
      setAuthPassword('');
      setAuthLoading(false);

      // Fetch profile in background (don't block UI)
      authService.getUserProfile(signedInUser.id).then(profile => {
        console.log('Profile fetched:', profile);
        if (profile) {
          setUserProfile(profile);
          setUserStats(prev => ({
            ...prev,
            totalBeatsCreated: profile.total_beats_created || 0,
            tutorialsCompleted: profile.total_tutorials_completed || 0,
            totalScore: profile.total_score || 0,
            currentStreak: profile.current_streak || 0
          }));
        } else {
          // Profile doesn't exist, create one from user metadata
          console.log('No profile found, creating from user metadata');
          const username = signedInUser.user_metadata?.username || signedInUser.email?.split('@')[0] || 'Player';
          const newProfile = {
            id: signedInUser.id,
            username: username,
            email: signedInUser.email,
            total_score: 0,
            total_beats_created: 0,
            level: 1,
            rank_title: 'Beginner',
            experience_points: 0
          };
          setUserProfile(newProfile);
          // Try to create profile in database
          authService.createUserProfile(signedInUser.id, username, signedInUser.email)
            .catch(e => console.log('Profile creation error (may already exist):', e));
        }
      }).catch(err => {
        console.error('Profile fetch error:', err);
        // Create a default profile from user data
        const username = signedInUser.user_metadata?.username || signedInUser.email?.split('@')[0] || 'Player';
        setUserProfile({
          id: signedInUser.id,
          username: username,
          email: signedInUser.email,
          total_score: 0,
          total_beats_created: 0,
          level: 1,
          rank_title: 'Beginner',
          experience_points: 0
        });
      });

    } catch (error) {
      console.error('Sign in error:', error);
      setAuthError(error.message || 'Login failed. Please try again.');
      setAuthLoading(false);
    }
  };

  // Handle register
  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (authUsername.length < 3) {
        throw new Error('Username must be at least 3 characters');
      }
      await authService.signUp(authEmail, authPassword, authUsername);
      // setShowAuthModal(false); // Keep open for verification message
      setAuthEmail('');
      setAuthPassword('');
      setAuthUsername('');
      setAuthUsername('');
      setAuthMode('verification');
    } catch (error) {
      if (error.message.toLowerCase().includes('rate limit')) {
        setAuthError('⚠️ Specific Rate Limit Exceeded: Please wait 15 minutes or check your spam folder for previous emails.');
      } else {
        setAuthError(error.message);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle logout with confirmation
  const handleLogout = async (closeModal = false) => {
    if (!window.confirm('Are you sure you want to logout?')) {
      return;
    }
    try {
      // Stop any playing audio
      setIsPlaying(false);
      AudioEngine.stopAll();

      await authService.signOut();
      setUser(null);
      setUserProfile(null);
      if (closeModal) {
        setShowProfile(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Load leaderboard
  const loadLeaderboard = async () => {
    setLeaderboardLoading(true);
    try {
      const data = await scoreService.getGlobalLeaderboard(100);
      setLeaderboardData(data);

      // Find user's rank
      if (user && data) {
        const rank = data.findIndex(p => p.id === user.id) + 1;
        if (rank > 0) {
          setUserRank(rank);
          setUserStats(prev => ({ ...prev, leaderboardRank: rank }));
        }
      }
    } catch (error) {
      console.error('Leaderboard error:', error);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  // Load user achievements
  const loadUserAchievements = async () => {
    if (!user) return;
    setAchievementsLoading(true);
    try {
      const data = await achievementService.getUserAchievements(user.id);
      setUserAchievements(data);
    } catch (error) {
      console.error('Achievements error:', error);
    } finally {
      setAchievementsLoading(false);
    }
  };

  // Play achievement sound
  const playAchievementSound = () => {
    if (!AudioEngine.ctx) {
      AudioEngine.init();
    }
    if (!AudioEngine.ctx) return;
    try {
      const ctx = AudioEngine.ctx;
      const now = ctx.currentTime;

      // Create a cheerful achievement sound
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.15); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.3); // G5
      osc2.frequency.setValueAtTime(783.99, now);
      osc2.frequency.setValueAtTime(987.77, now + 0.15); // B5
      osc2.frequency.setValueAtTime(1046.5, now + 0.3); // C6

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.log('Achievement sound error:', e);
    }
  };

  // Check for new achievements
  const checkForAchievements = async () => {
    if (!user) return;
    try {
      console.log('Checking achievements with stats:', userStats);
      const unlocked = await achievementService.checkAchievements(user.id, userStats);
      console.log('Unlocked achievements:', unlocked);
      if (unlocked && unlocked.length > 0) {
        // Show each unlocked achievement with delay
        for (let i = 0; i < unlocked.length; i++) {
          setTimeout(() => {
            playAchievementSound();
            setNewAchievementUnlocked(unlocked[i]);
            setTimeout(() => setNewAchievementUnlocked(null), 4000);
          }, i * 4500);
        }
        // Refresh profile after all achievements shown
        setTimeout(async () => {
          const profile = await authService.getUserProfile(user.id);
          setUserProfile(profile);
        }, unlocked.length * 4500);
      }
    } catch (error) {
      console.error('Achievement check error:', error);
    }
  };

  // Track first play for achievement
  const trackFirstPlay = () => {
    if (!userStats.hasPlayed) {
      setUserStats(prev => ({
        ...prev,
        hasPlayed: true,
        instrumentsUsed: activeInstrumentIds.length,
        tempo: tempo
      }));
      // Check achievements after a small delay
      setTimeout(() => checkForAchievements(), 1000);
    }
  };

  // Save score when tutorial completed
  const saveTutorialScore = async (scenarioId, scenarioName, accuracy) => {
    if (!user) return;
    try {
      const score = Math.round(accuracy * 10);
      await scoreService.saveScore(
        user.id,
        scenarioId,
        scenarioName,
        score,
        accuracy,
        tempo,
        activeInstrumentIds
      );
      await scoreService.incrementTutorialsCompleted(user.id);

      // Update local stats
      setUserStats(prev => ({
        ...prev,
        tutorialsCompleted: prev.tutorialsCompleted + 1,
        totalScore: prev.totalScore + score,
        accuracy: accuracy
      }));

      // Check for achievements
      await checkForAchievements();

      // Refresh profile
      const profile = await authService.getUserProfile(user.id);
      setUserProfile(profile);
    } catch (error) {
      console.error('Save score error:', error);
    }
  };

  // Increment beats created
  const incrementBeatsCreated = async () => {
    if (!user) return;
    try {
      await scoreService.incrementBeatsCreated(user.id);
      setUserStats(prev => ({
        ...prev,
        totalBeatsCreated: prev.totalBeatsCreated + 1
      }));
      await checkForAchievements();
    } catch (error) {
      console.error('Increment beats error:', error);
    }
  };

  // Language Translations
  const LANGUAGES = {
    en: { code: 'en-US', name: 'English', flag: '🇺🇸' },
    es: { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
    fr: { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
    de: { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
    it: { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
    pt: { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
    ja: { code: 'ja-JP', name: '\u65e5\u672c\u8a9e', flag: '🇯🇵' }, // Japanese
    ko: { code: 'ko-KR', name: '\ud55c\uad6d\uc5b4', flag: '🇰🇷' }, // Korean
    zh: { code: 'zh-CN', name: '\u4e2d\u6587', flag: '🇨🇳' }, // Chinese
    tl: { code: 'fil-PH', name: 'Tagalog', flag: '🇵🇭' },
    hi: { code: 'hi-IN', name: '\u0939\u093f\u0928\u094d\u0926\u0940', flag: '🇮🇳' }, // Hindi
    ar: { code: 'ar-SA', name: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629', flag: '🇸🇦' }, // Arabic
  }

  const TRANSLATIONS = {
    en: {
      appTitle: 'RHYTHM REALM',
      createBeat: 'Create Your Beat',
      letsPlay: "Let's Play!",
      modes: 'Modes',
      settings: 'Settings',
      freePlay: 'Free Play',
      freePlayDesc: 'Create your own beats with no limits!',
      tutorial: 'Tutorial',
      tutorialDesc: 'Learn different moods & styles!',
      beatLibrary: 'Beat Library',
      beatLibraryDesc: 'Explore example beats from different genres!',
      djMode: 'DJ Mode',
      djModeDesc: 'Live performance mode! Mix beats in real-time.',
      accessibility: 'Accessibility',
      textToSpeech: 'Text-to-Speech',
      textToSpeechDesc: 'Hover or focus to hear descriptions',
      highContrast: 'High Contrast',
      highContrastDesc: 'Increase color contrast for visibility',
      largeText: 'Large Text',
      largeTextDesc: 'Increase text and button sizes',
      keyboardNav: 'Keyboard Navigation',
      keyboardNavDesc: 'Enhanced Tab key navigation',
      voiceControl: 'Voice Control',
      voiceControlDesc: 'Hands-free! Control app with your voice',
      language: 'Language',
      languageDesc: 'Change app language',
      play: 'Play',
      stop: 'Stop',
      tempo: 'Tempo',
      volume: 'Volume',
      back: 'Back',
      home: 'Home',
      masterVolume: 'Master Volume',
      backgroundMusic: 'Background Music',
      visualThemes: 'Visual Themes',
      about: 'About',
      enableAll: 'Enable All Accessibility Features',
      allEnabled: 'All Features Enabled',
    },
    es: {
      appTitle: 'REINO DEL RITMO',
      createBeat: 'Crea Tu Ritmo',
      letsPlay: '¡Vamos a Jugar!',
      modes: 'Modos',
      settings: 'Ajustes',
      freePlay: 'Juego Libre',
      freePlayDesc: '¡Crea tus propios ritmos sin límites!',
      tutorial: 'Tutorial',
      tutorialDesc: '¡Aprende diferentes estilos y estados de ánimo!',
      beatLibrary: 'Biblioteca de Ritmos',
      beatLibraryDesc: '¡Explora ejemplos de diferentes géneros!',
      djMode: 'Modo DJ',
      djModeDesc: '¡Modo de actuación en vivo! Mezcla ritmos en tiempo real.',
      accessibility: 'Accesibilidad',
      textToSpeech: 'Texto a Voz',
      textToSpeechDesc: 'Pasa el cursor o enfoca para escuchar descripciones',
      highContrast: 'Alto Contraste',
      highContrastDesc: 'Aumentar el contraste de color para visibilidad',
      largeText: 'Texto Grande',
      largeTextDesc: 'Aumentar tamaño de texto y botones',
      keyboardNav: 'Navegación por Teclado',
      keyboardNavDesc: 'Navegación mejorada con tecla Tab',
      voiceControl: 'Control por Voz',
      voiceControlDesc: '¡Manos libres! Controla la app con tu voz',
      language: 'Idioma',
      languageDesc: 'Cambiar idioma de la app',
      play: 'Reproducir',
      stop: 'Parar',
      tempo: 'Tempo',
      volume: 'Volumen',
      back: 'Atrás',
      home: 'Inicio',
      masterVolume: 'Volumen Maestro',
      backgroundMusic: 'Música de Fondo',
      visualThemes: 'Temas Visuales',
      about: 'Acerca de',
      enableAll: 'Activar Funciones de Accesibilidad',
      allEnabled: 'Funciones Activadas',
    },
    fr: {
      appTitle: 'ROYAUME DU RYTHME',
      createBeat: 'Créez Votre Rythme',
      letsPlay: 'Jouons !',
      modes: 'Modes',
      settings: 'Paramètres',
      freePlay: 'Jeu Libre',
      freePlayDesc: 'Créez vos propres rythmes sans limites !',
      tutorial: 'Tutoriel',
      tutorialDesc: 'Apprenez différents styles et ambiances !',
      beatLibrary: 'Bibliothèque',
      beatLibraryDesc: 'Explorez des exemples de différents genres !',
      djMode: 'Mode DJ',
      djModeDesc: 'Mode performance live ! Mixez en temps réel.',
      accessibility: 'Accessibilité',
      textToSpeech: 'Synthèse Vocale',
      textToSpeechDesc: 'Survolez pour entendre les descriptions',
      highContrast: 'Contraste Élevé',
      highContrastDesc: 'Augmenter le contraste des couleurs',
      largeText: 'Grand Texte',
      largeTextDesc: 'Augmenter la taille du texte et des boutons',
      keyboardNav: 'Navigation Clavier',
      keyboardNavDesc: 'Navigation améliorée avec la touche Tab',
      voiceControl: 'Commande Vocale',
      voiceControlDesc: 'Mains libres ! Contrôlez l\'appli par la voix',
      language: 'Langue',
      languageDesc: 'Changer la langue de l\'application',
      play: 'Lecture',
      stop: 'Arrêt',
      tempo: 'Tempo',
      volume: 'Volume',
      back: 'Retour',
      home: 'Accueil',
      masterVolume: 'Volume Principal',
      backgroundMusic: 'Musique de Fond',
      visualThemes: 'Thèmes Visuels',
      about: 'À propos',
      enableAll: 'Activer l\'Accessibilité',
      allEnabled: 'Accessibilité Activée',
    },
    de: {
      appTitle: 'RHYTHMUS REICH',
      createBeat: 'Erstelle deinen Beat',
      letsPlay: 'Lass uns spielen!',
      modes: 'Modi',
      settings: 'Einstellungen',
      freePlay: 'Freies Spiel',
      freePlayDesc: 'Erstelle eigene Beats ohne Limits!',
      tutorial: 'Tutorial',
      tutorialDesc: 'Lerne verschiedene Stile!',
      beatLibrary: 'Beat-Bibliothek',
      beatLibraryDesc: 'Entdecke Beats aus verschiedenen Genres!',
      djMode: 'DJ-Modus',
      djModeDesc: 'Live-Performance-Modus! Mixe in Echtzeit.',
      accessibility: 'Barrierefreiheit',
      textToSpeech: 'Text-zu-Sprache',
      textToSpeechDesc: 'Fahre darüber, um Beschreibungen zu hören',
      highContrast: 'Hoher Kontrast',
      highContrastDesc: 'Farbkontrast erhöhen',
      largeText: 'Großer Text',
      largeTextDesc: 'Text- und Tastengröße erhöhen',
      keyboardNav: 'Tastaturnavigation',
      keyboardNavDesc: 'Verbesserte Tab-Navigation',
      voiceControl: 'Sprachsteuerung',
      voiceControlDesc: 'Freihändig! Steuere per Stimme',
      language: 'Sprache',
      languageDesc: 'App-Sprache ändern',
      play: 'Abspielen',
      stop: 'Stopp',
      tempo: 'Tempo',
      volume: 'Lautstärke',
      back: 'Zurück',
      home: 'Home',
      masterVolume: 'Gesamtlautstärke',
      backgroundMusic: 'Hintergrundmusik',
      visualThemes: 'Visuelle Themen',
      about: 'Über',
      enableAll: 'Alles Aktivieren',
      allEnabled: 'Alles Aktiviert',
    },
    it: {
      appTitle: 'REGNO DEL RITMO',
      createBeat: 'Crea il Tuo Beat',
      letsPlay: 'Giochiamo!',
      modes: 'Modalità',
      settings: 'Impostazioni',
      freePlay: 'Gioco Libero',
      freePlayDesc: 'Crea i tuoi beat senza limiti!',
      tutorial: 'Tutorial',
      tutorialDesc: 'Impara stili diversi!',
      beatLibrary: 'Libreria',
      beatLibraryDesc: 'Esplora beat di generi diversi!',
      djMode: 'Modalità DJ',
      djModeDesc: 'Performance dal vivo! Mixa in tempo reale.',
      accessibility: 'Accessibilità',
      textToSpeech: 'Testo a Voce',
      textToSpeechDesc: 'Passa sopra per ascoltare',
      highContrast: 'Contrasto Elevato',
      highContrastDesc: 'Aumenta contrasto colori',
      largeText: 'Testo Grande',
      largeTextDesc: 'Aumenta dimensione testo',
      keyboardNav: 'Navigazione Tastiera',
      keyboardNavDesc: 'Navigazione Tab migliorata',
      voiceControl: 'Controllo Vocale',
      voiceControlDesc: 'Mani libere! Controlla con la voce',
      language: 'Lingua',
      languageDesc: 'Cambia lingua app',
      play: 'Play',
      stop: 'Stop',
      tempo: 'Tempo',
      volume: 'Volume',
      back: 'Indietro',
      home: 'Home',
      masterVolume: 'Volume Master',
      backgroundMusic: 'Musica di Sfondo',
      visualThemes: 'Temi Visivi',
      about: 'Info',
      enableAll: 'Attiva Tutto',
      allEnabled: 'Tutto Attivato',
    },
    pt: {
      appTitle: 'REINO DO RITMO',
      createBeat: 'Crie Sua Batida',
      letsPlay: 'Vamos Jogar!',
      modes: 'Modos',
      settings: 'Configurações',
      freePlay: 'Jogo Livre',
      freePlayDesc: 'Crie batidas sem limites!',
      tutorial: 'Tutorial',
      tutorialDesc: 'Aprenda estilos diferentes!',
      beatLibrary: 'Biblioteca',
      beatLibraryDesc: 'Explore batidas de vários gêneros!',
      djMode: 'Modo DJ',
      djModeDesc: 'Performance ao vivo! Mixe em tempo real.',
      accessibility: 'Acessibilidade',
      textToSpeech: 'Texto para Fala',
      textToSpeechDesc: 'Passe o mouse para ouvir',
      highContrast: 'Alto Contraste',
      highContrastDesc: 'Aumentar contraste de cores',
      largeText: 'Texto Grande',
      largeTextDesc: 'Aumentar tamanho do texto',
      keyboardNav: 'Navegação Teclado',
      keyboardNavDesc: 'Navegação Tab melhorada',
      voiceControl: 'Controle de Voz',
      voiceControlDesc: 'Mãos livres! Controle por voz',
      language: 'Idioma',
      languageDesc: 'Mudar idioma do app',
      play: 'Tocar',
      stop: 'Parar',
      tempo: 'Andamento',
      volume: 'Volume',
      back: 'Voltar',
      home: 'Início',
      masterVolume: 'Volume Mestre',
      backgroundMusic: 'Música de Fundo',
      visualThemes: 'Temas Visuais',
      about: 'Sobre',
      enableAll: 'Ativar Tudo',
      allEnabled: 'Tudo Ativado',
    },
    ja: {
      appTitle: 'RHYTHM REALM',
      createBeat: '\u30d3\u30fc\u30c8\u3092\u4f5c\u6210',
      letsPlay: '\u904a\u307c\u3046\uff01',
      modes: '\u30e2\u30fc\u30c9',
      settings: '\u8a2d\u5b9a',
      freePlay: '\u30d5\u30ea\u30fc\u30d7\u30ec\u30a4',
      freePlayDesc: '\u5236\u9650\u306a\u3057\u3067\u81ea\u7531\u306b\u30d3\u30fc\u30c8\u3092\u4f5c\u60c5\uff01',
      tutorial: '\u30c1\u30e5\u30fc\u30c8\u30ea\u30a2\u30eb',
      tutorialDesc: '\u69d8\u3005\u306a\u30b9\u30bf\u30a4\u30eb\u3092\u5b66\u307c\u3046\uff01',
      beatLibrary: '\u30d3\u30fc\u30c8\u30e9\u30a4\u30d6\u30e9\u30ea',
      beatLibraryDesc: '\u69d8\u3005\u306a\u30b8\u30e3\u30f3\u30eb\u306e\u4f8b\u3092\u63a2\u7d22\uff01',
      djMode: 'DJ\u30e2\u30fc\u30c9',
      djModeDesc: '\u30e9\u30a4\u30d6\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\uff01\u30ea\u30a2\u30eb\u30bf\u30a4\u30e0\u3067\u30df\u30c3\u30af\u30b9\u3002',
      accessibility: '\u30a2\u30af\u30bb\u30b7\u30d3\u30ea\u30c6\u30a3',
      textToSpeech: '\u8aad\u307f\u4e0a\u3052',
      textToSpeechDesc: '\u30db\u30d0\u30fc\u307e\u305f\u306f\u30d5\u30a9\u30fc\u30ab\u30b9\u3067\u8aad\u307f\u4e0a\u3052',
      highContrast: '\u30cf\u30a4\u30b3\u30f3\u30c8\u30e9\u30b9\u30c8',
      highContrastDesc: '\u8996\u8a8d\u6027\u3092\u9ad8\u3081\u308b',
      largeText: '\u5927\u304d\u306a\u6587\u5b57',
      largeTextDesc: '\u30c6\u30ad\u30b9\u30c8\u3068\u30dc\u30bf\u30f3\u3092\u62e1\u5927',
      keyboardNav: '\u30ad\u30fc\u30dc\u30fc\u30c9\u64cd\u4f5c',
      keyboardNavDesc: 'Tab\u30ad\u30fc\u64cd\u4f5c\u3092\u5f37\u5316',
      voiceControl: '\u97f3\u58f0\u64cd\u4f5c',
      voiceControlDesc: '\u30cf\u30f3\u30ba\u30d5\u30ea\u30fc\uff01\u58f0\u3067\u30a2\u30d7\u30ea\u3092\u64cd\u4f5c',
      language: '\u8a00\u8a9e',
      languageDesc: '\u30a2\u30d7\u30ea\u306e\u8a00\u8a9e\u3092\u5909\u66f4',
      play: '\u518d\u751f',
      stop: '\u505c\u6b62',
      tempo: '\u30c6\u30f3\u30dd',
      volume: '\u97f3\u91cf',
      back: '\u623b\u308b',
      home: '\u30db\u30fc\u30e0',
      masterVolume: '\u30de\u30b9\u30bf\u30fc\u97f3\u91cf',
      backgroundMusic: 'BGM',
      visualThemes: '\u30c6\u30fc\u30de',
      about: '\u30a2\u30d7\u30ea\u306b\u3064\u3044\u3066',
      enableAll: '\u3059\u3079\u3066\u306e\u6a5f\u80fd\u3092\u6709\u52b9\u5316',
      allEnabled: '\u3059\u3079\u3066\u306e\u6a5f\u80fd\u304c\u6709\u52b9',
    },
    ko: {
      appTitle: 'RHYTHM REALM',
      createBeat: '\ube44\ud2b8 \ub9cc\ub4e4\uae30',
      letsPlay: '\uc2dc\uc791\ud558\uae30!',
      modes: '\ubaa8\ub4dc',
      settings: '\uc124\uc815',
      freePlay: '\uc790\uc720 \uc5f0\uc8fc',
      freePlayDesc: '\ub098\ub9cc\uc758 \ube44\ud2b8\ub97c \ub9cc\ub4e4\uc5b4\ubcf4\uc138\uc694!',
      tutorial: '\ud29c\ud1a0\ub9ac\uc5bc',
      tutorialDesc: '\ub2e4\uc591\ud55c \uc2a4\ud0c0\uc77c \ubc30\uc6b0\uae30!',
      beatLibrary: '\ube44\ud2b8 \ub77c\uc774\ube0c\ub7ec\ub9ac',
      beatLibraryDesc: '\ub2e4\uc591\ud55c \uc7a5\ub974 \ud0d0\ud5d8!',
      djMode: 'DJ \ubaa8\ub4dc',
      djModeDesc: '\ub77c\uc774\ube0c \ud37c\ud3ec\uba3c\uc2a4 \ubaa8\ub4dc! \uc2e4\uc2dc\uac04 \ubbf9\uc2f1.',
      accessibility: '\uc811\uadfc\uc131',
      textToSpeech: '\uc74c\uc131 \ub9ac\ub354',
      textToSpeechDesc: '\ub9c8\uc6b0\uc2a4\ub97c \uc62c\ub9ac\uba74 \uc124\uba85 \ub4e3\uae30',
      highContrast: '\uace0\ub300\ube44',
      highContrastDesc: '\uc0c9\uc0c1 \ub300\ube44 \uc99d\uac00',
      largeText: '\ud070 \ud14d\uc2a4\ud2b8',
      largeTextDesc: '\ud14d\uc2a4\ud2b8 \ubc0f \ubc84\ud2bc \ud06c\uae30 \ud655\ub300',
      keyboardNav: '\ud0a4\ubcf4\ub4dc \ud0d0\uc0c9',
      keyboardNavDesc: '\ud5a5\uc0c1\ub41c Tab \ud0a4 \ud0d0\uc0c9',
      voiceControl: '\uc74c\uc131 \uc81c\uc5b4',
      voiceControlDesc: '\ud578\uc988\ud504\ub9ac! \ubaa9\uc18c\ub9ac\ub85c \uc571 \uc81c\uc5b4',
      language: '\uc5b8\uc5b4',
      languageDesc: '\uc571 \uc5b8\uc5b4 \ubcc0\uacbd',
      play: '\uc7ac\uc0dd',
      stop: '\uc815\uc9c0',
      tempo: '\ud15c\ud3ec',
      volume: '\ubcfc\ub968',
      back: '\ub4fa\ub85c',
      home: '\ud648',
      masterVolume: '\ub9c8\uc2a4\ud130 \ubcfc\ub968',
      backgroundMusic: '\ubc30\uacbd \uc74c\uc545',
      visualThemes: '\ube44\uc8fc\uc5bc \ud14c\ub9c8',
      about: '\uc815\ubcf4',
      enableAll: '\ubaa8\ub4e0 \uae30\ub2a5 \ucf1c\uae30',
      allEnabled: '\ubaa8\ub4e0 \uae30\ub2a5 \ud65c\uc131\ud654\ub428',
    },
    zh: {
      appTitle: 'RHYTHM REALM',
      createBeat: '\u521b\u5efa\u8282\u594f',
      letsPlay: '\u5f00\u59cb\uff01',
      modes: '\u6a21\u5f0f',
      settings: '\u8bbe\u7f6e',
      freePlay: '\u81ea\u7531\u6a21\u5f0f',
      freePlayDesc: '\u81ea\u7531\u521b\u4f5c\u4f60\u7684\u8282\u594f\uff01',
      tutorial: '\u6559\u7a0b',
      tutorialDesc: '\u5b66\u4e60\u4e0d\u540c\u98ce\u683c\uff01',
      beatLibrary: '\u8282\u594f\u5e93',
      beatLibraryDesc: '\u63a2\u7d22\u5404\u79cd\u793a\u4f8b\uff01',
      djMode: 'DJ\u6a21\u5f0f',
      djModeDesc: '\u5373\u5174\u6f14\u594f\u6a21\u5f0f\uff01\u5b9e\u65f6\u6df7\u97f3\u3002',
      accessibility: '\u65e0\u969c\u788d',
      textToSpeech: '\u6587\u672c\u8f6c\u8bed\u97f3',
      textToSpeechDesc: '\u60ac\u505c\u6216\u805a\u7126\u4ee5\u6536\u542c\u8bf4\u660e',
      highContrast: '\u9ad8\u5bf9\u6bd4\u5ea6',
      highContrastDesc: '\u589e\u52a0\u989c\u8272\u5bf9\u6bd4\u5ea6\u4ee5\u63d0\u9ad8\u53ef\u89c1\u6027',
      largeText: '\u5927\u53f7\u6587\u672c',
      largeTextDesc: '\u589e\u5927\u6587\u672c\u548c\u6309\u94ae\u5c3a\u5bf8',
      keyboardNav: '\u952e\u76d8\u5bfc\u822a',
      keyboardNavDesc: '\u589e\u5f3a\u7684 Tab \u952e\u5bfc\u822a',
      voiceControl: '\u8bed\u97f3\u63a7\u5236',
      voiceControlDesc: '\u514d\u63d0\uff01\u7528\u58f0\u97f3\u63a7\u5236\u5e94\u7528',
      language: '\u8bed\u8a00',
      languageDesc: '\u66f4\u6539\u5e94\u7528\u8bed\u8a00',
      play: '\u64ad\u653e',
      stop: '\u505c\u6b62',
      tempo: '\u901f\u5ea6',
      volume: '\u97f3\u91cf',
      back: '\u8fd4\u56de',
      home: '\u4e3b\u9875',
      masterVolume: '\u4e3b\u97f3\u91cf',
      backgroundMusic: '\u80cc\u666f\u97f3\u4e50',
      visualThemes: '\u89c6\u89c9\u4e3b\u9898',
      about: '\u5173\u4e8e',
      enableAll: '\u542f\u7528\u6240\u6709\u529f\u80fd',
      allEnabled: '\u5df2\u542f\u7528\u6240\u6709\u529f\u80fd',
    },
    tl: {
      appTitle: 'RHYTHM REALM',
      createBeat: 'Gumawa ng Beat',
      letsPlay: 'Laro Tayo!',
      modes: 'Mga Mode',
      settings: 'Mga Setting',
      freePlay: 'Malayang Paglaro',
      freePlayDesc: 'Gumawa ng sariling beat nang walang limitasyon!',
      tutorial: 'Pagsasanay',
      tutorialDesc: 'Matuto ng iba\'t ibang estilo!',
      beatLibrary: 'Koleksyon ng Beat',
      beatLibraryDesc: 'Tuklasin ang iba\'t ibang genre!',
      djMode: 'DJ Mode',
      djModeDesc: 'Live performance! Paghaluin ang mga beat.',
      accessibility: 'Accessibility',
      textToSpeech: 'Text-to-Speech',
      textToSpeechDesc: 'Pakinggan ang mga paglalarawan',
      highContrast: 'High Contrast',
      highContrastDesc: 'Taasan ang contrast ng kulay',
      largeText: 'Malaking Teksto',
      largeTextDesc: 'Lakihan ang teksto at pindutan',
      keyboardNav: 'Nabigasyon gamit ang Keyboard',
      keyboardNavDesc: 'Gamitin ang Tab key',
      voiceControl: 'Boses na Kontrol',
      voiceControlDesc: 'Kontrolin gamit ang boses',
      language: 'Wika',
      languageDesc: 'Palitan ang wika',
      play: 'I-play',
      stop: 'Itigil',
      tempo: 'Bilis',
      volume: 'Lakas',
      back: 'Bumalik',
      home: 'Home',
      masterVolume: 'Pangunahing Lakas',
      backgroundMusic: 'Musika sa Background',
      visualThemes: 'Mga Tema',
      about: 'Tungkol',
      enableAll: 'Paganahin Lahat',
      allEnabled: 'Lahat ay Gumagana',
    },
    hi: {
      modes: '\u092e\u094b\u0921\u094d\u0938',
      settings: '\u0938\u0947\u091f\u093f\u0902\u0917\u094d\u0938',
      freePlay: '\u092b\u094d\u0930\u0940 \u092a\u094d\u0932\u0947',
      freePlayDesc: '\u092c\u093f\u0928\u093e \u0915\u093f\u0938\u0940 \u0938\u0940\u092e\u093e \u0915\u0947 \u0905\u092a\u0928\u0940 \u092c\u0940\u091f\u094d\u0938 \u092c\u0928\u093e\u090f\u0902!',
      tutorial: '\u091f\u094d\u092f\u0942\u091f\u094b\u0930\u093f\u092f\u0932',
      tutorialDesc: '\u0935\u093f\u092d\u093f\u0928\u094d\u0928 \u0936\u0948\u0932\u093f\u092f\u094b\u0902 \u0915\u094b \u0938\u0940\u0916\u0947\u0902!',
      beatLibrary: '\u092c\u0940\u091f \u0932\u093e\u0907\u092c\u094d\u0930\u0947\u0930\u0940',
      beatLibraryDesc: '\u0935\u093f\u092d\u093f\u0928\u094d\u0928 \u0936\u0948\u0932\u093f\u092f\u094b\u0902 \u0915\u0940 \u092c\u0940\u091f\u094d\u0938 \u092d\u0947\u0916\u0947\u0902!',
      djMode: 'DJ \u092e\u094b\u0921',
      djModeDesc: '\u0932\u093e\u0907\u0935 \u092a\u094d\u0930\u0926\u0930\u094d\u0936\u0928 \u092e\u094b\u0921! \u0930\u0940\u092f\u0932-\u091f\u093e\u0907\u092e \u092e\u0947\u0902 \u092e\u093f\u0915\u094d\u0938 \u0915\u0930\u0947\u0902\u0964',
      accessibility: '\u0938\u0941\u0917\u092e\u094d\u092f\u0924\u093e',
      textToSpeech: '\u091f\u0947\u0915\u094d\u0938\u094d\u091f-\u091f\u0942-\u0938\u094d\u092a\u0940\u091a',
      textToSpeechDesc: '\u0935\u093f\u0935\u0930\u0923 \u0938\u0941\u0928\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0939\u094b\u0935\u0930 \u0915\u0930\u0947\u0902',
      highContrast: '\u0939\u093e\u0908 \u0915\u0902\u091f\u094d\u0930\u093e\u0938\u094d\u091f',
      highContrastDesc: '\u0926\u0943\u0936\u094d\u092f\u0924\u093e \u0915\u0947 \u0932\u093f\u090f \u0930\u0902\u0917 \u0915\u0902\u091f\u094d\u0930\u093e\u0938\u094d\u091f \u092c\u0922\u093c\u093e\u090f\u0902',
      largeText: '\u092c\u0921\u093c\u093e \u091f\u0947\u0915\u094d\u0938\u094d\u091f',
      largeTextDesc: '\u091f\u0947\u0915\u094d\u0938\u094d\u091f \u0914\u0930 \u092c\u091f\u0928 \u0915\u093e \u090a\u0915\u093e\u0930 \u092c\u0922\u093c\u093e\u090f\u0902',
      keyboardNav: '\u0915\u0940\u092c\u094b\u0930\u094d\u0926 \u0928\u0947\u0935\u093f\u0917\u0947\u0936\u0928',
      keyboardNavDesc: '\u092c\u0947\u0939\u0924\u0930 Tab \u0915\u0941\u0902\u091c\u0940 \u0928\u0947\u0935\u093f\u0917\u0947\u0936\u0928',
      voiceControl: '\u0935\u0949\u092f\u0938 \u0915\u0902\u091f\u094d\u0930\u094b\u0932',
      voiceControlDesc: '\u0939\u0948\u0902\u0921\u094d\u0938-\u092b\u094d\u0930\u0940! \u0905\u092a\u0928\u0940 \u090a\u0935\u093e\u091c \u0938\u0947 \u0910\u092a \u0915\u0902\u091f\u094d\u0930\u094b\u0932 \u0915\u0930\u0947\u0902',
      language: '\u092d\u093e\u0937\u093e',
      languageDesc: '\u0910\u092a \u0915\u0940 \u092d\u093e\u0937\u093e \u092c\u0926\u0932\u0947\u0902',
      play: '\u091a\u0932\u093e\u090f\u0902',
      stop: '\u0930\u094b\u0915\u0947\u0902',
      tempo: '\u091f\u0947\u092e\u094d\u092a\u094b',
      volume: '\u0935\u0949\u0932\u094d\u092f\u0942\u092e',
      back: '\u0935\u093e\u092a\u0938',
      home: '\u0939\u094b\u092e',
      masterVolume: '\u092e\u093e\u0938\u094d\u091f\u0930 \u0935\u0949\u0932\u094d\u092f\u0942\u092e',
      backgroundMusic: '\u092c\u0948\u0915\u0917\u094d\u0930\u093e\u0909\u0902\u0921 \u092e\u094d\u092f\u0942\u091c\u093f\u0915',
      visualThemes: '\u0935\u093f\u091c\u0941\u0905\u0932 \u0925\u0940\u092e\u094d\u0938',
      about: '\u0915\u0947 \u092c\u093e\u0930\u0947 \u092e\u0947\u0902',
      enableAll: '\u0938\u092d\u0940 \u0938\u0915\u094d\u0937\u092e \u0915\u0930\u0947\u0902',
      allEnabled: '\u0938\u092d\u0940 \u0938\u0915\u094d\u0937\u092e \u0939\u0948\u0902',
    },
    ar: {
      appTitle: '\u0639\u0627\u0644\u0645 \u0627\u0644\u0625\u064a\u0642\u0627\u0639',
      createBeat: '\u0627\u0635\u064a\u0639 \u0625\u064a\u0642\u0627\u0639\u0643',
      letsPlay: '\u0644\u0646\u0644\u0639\u0628!',
      modes: '\u0627\u0644\u0623\u0648\u0636\u0627\u0639',
      settings: '\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',
      freePlay: '\u0644\u0639\u0628 \u062d\u0631',
      freePlayDesc: '\u0627\u0635\u064a\u0639 \u0625\u064a\u0642\u0627\u0639\u0627\u062a\u0643 \u0627\u0644\u062e\u0627\u0635\u0629 \u0628\u0644\u0627 \u062d\u062f\u0648\u062f!',
      tutorial: '\u062f\u0631\u0633 \u062a\u0639\u0644\u064a\u0645\u064a',
      tutorialDesc: '\u062a\u0639\u0644\u0645 \u0623\u0646\u0645\u0627\u0637 \u0645\u062e\u062a\u0644\u0641\u0629!',
      beatLibrary: '\u0645\u0643\u062a\u0628\u0629 \u0627\u0644\u0625\u064a\u0642\u0627\u0639\u0627\u062a',
      beatLibraryDesc: '\u0627\u0633\u062a\u0643\u0634\u0641 \u0625\u064a\u0642\u0627\u0639\u0627\u062a \u0645\u0646 \u0623\u0646\u0648\u0627\u0639 \u0645\u062e\u062a\u0644\u0641\u0629!',
      djMode: '\u0648\u0636\u0639 \u0627\u0644\u062f\u064a \u062c\u064a',
      djModeDesc: '\u0623\u062f\u0627\u0621 \u0645\u0628\u0627\u0634\u0631! \u0627\u0645\u0632\u062c \u0627\u0644\u0625\u064a\u0642\u0627\u0639\u0627\u062a \u0641\u064a \u0627\u0644\u0648\u0642\u062a \u0627\u0644\u0641\u0639\u0644\u064a.',
      accessibility: '\u0633\u0647\u0648\u0644\u0629 \u0627\u0644\u0648\u0635\u0648\u0644',
      textToSpeech: '\u062a\u062d\u0648\u064a\u0644 \u0627\u0644\u0646\u0635 \u0625\u0644\u0649 \u0643\u0644\u0627\u0645',
      textToSpeechDesc: '\u0645\u0631\u0631 \u0627\u0644\u0645\u0627\u0648\u0633 \u0644\u0644\u0627\u0633\u062a\u0645\u0627\u0639 \u0625\u0644\u0649 \u0627\u0644\u0648\u0635\u0641',
      highContrast: '\u062a\u0628\u0627\u064a\u0646 \u0639\u0627\u0644\u064a',
      highContrastDesc: '\u0632\u064a\u0627\u062f\u0629 \u062a\u0628\u0627\u064a\u0646 \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0644\u0644\u0631\u0624\u064a\u0629',
      largeText: '\u0646\u0635 \u0643\u0628\u064a\u0631',
      largeTextDesc: '\u062a\u0643\u0628\u064a\u0631 \u0627\u0644\u0646\u0635 \u0648\u0627\u0644\u0623\u0632\u0631\u0627\u0631',
      keyboardNav: '\u062a\u0633\u0641\u062d \u0644\u0648\u062d\u0629 \u0627\u0644\u0645\u0641\u0627\u062a\u064a\u062d',
      keyboardNavDesc: '\u062a\u0633\u0641\u062d \u0645\u062d\u0633\u0651\u0646 \u0628\u0645\u0641\u062a\u0627\u062d Tab',
      voiceControl: '\u0627\u0644\u062a\u062d\u0643\u0645 \u0627\u0644\u0635\u0648\u062a\u064a',
      voiceControlDesc: '\u0628\u062f\u0648\u0646 \u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u064a\u062f\u064a\u0646! \u062a\u062d\u0643\u0645 \u0628\u0635\u0648\u062a\u0643',
      language: '\u0627\u0644\u0644\u063a\u0629',
      languageDesc: '\u062a\u063a\u064a\u064a\u0631 \u0644\u063a\u0629 \u0627\u0644\u062a\u0637\u0628\u064a\u0642',
      play: '\u062a\u0634\u063a\u064a\u0644',
      stop: '\u0625\u064a\u0642\u0627\u0641',
      tempo: '\u0627\u0644\u0633\u0631\u0639\u0629',
      volume: '\u0627\u0644\u0635\u0648\u062a',
      back: '\u0631\u062c\u0648\u0639',
      home: '\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629',
      masterVolume: '\u0627\u0644\u0635\u0648\u062a \u0627\u0644\u0631\u0626\u064a\u0633\u064a',
      backgroundMusic: '\u0645\u0648\u0633\u064a\u0642\u0649 \u0627\u0644\u062e\u0644\u0641\u064a\u0629',
      visualThemes: '\u0627\u0644\u0633\u0645\u0627\u062a \u0627\u0644\u0645\u0631\u0626\u064a\u0629',
      about: '\u062d\u0648\u0644',
      enableAll: '\u062a\u0641\u0639\u064a\u0644 \u0627\u0644\u0643\u0644',
      allEnabled: '\u0627\u0644\u0643\u0644 \u0645\u0641\u0639\u0644',
    },
  };

  // Get translation helper
  const t = (key) => TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS.en[key] || key;

  // Mobile Detection & State
  const [isMobile, setIsMobile] = useState(false);
  const [mobileStepsVisible, setMobileStepsVisible] = useState(16); // Show 16 steps on mobile by default
  const [mobileStepOffset, setMobileStepOffset] = useState(0); // Which step to start from on mobile

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 480) {
        setMobileStepsVisible(8);
      } else if (window.innerWidth < 768) {
        setMobileStepsVisible(16);
      } else {
        setMobileStepsVisible(32);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Save/Load State
  const [savedBeats, setSavedBeats] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [saveBeatName, setSaveBeatName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null); // Beat to confirm deletion
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false); // Filter favorites

  // Seek bar state
  const [isDraggingSeek, setIsDraggingSeek] = useState(false);
  const seekBarRef = useRef(null);

  const [instrumentConfig, setInstrumentConfig] = useState({
    kick: 0, snare: 3, hihat: 0, tom: 0, perc: 0, bass: 0, synth: 0, fx: 0, keys: 0, vox: 0, lead: 0, orch: 0
  });
  const [soundSettings, setSoundSettings] = useState({});
  const [activeSoundLab, setActiveSoundLab] = useState(null);

  useEffect(() => {
    const initialSettings = {};
    Object.keys(SOUND_VARIANTS).forEach(key => {
      initialSettings[key] = {
        pitch: 0,
        chord: null,
        bend: 0,
        volume: 100,
        muted: false,
        attack: 0,
        decay: 100,
        filter: 100,
        reverb: 0,
        distortion: 0,
        pan: 0
      };
    });
    setSoundSettings(initialSettings);
  }, []);

  // Apply Sound Pack Logic
  const applySoundPack = (packId) => {
    setActiveSoundPack(packId);
    setInstrumentConfig(prev => {
      const newConfig = { ...prev };

      if (packId === 'electronic') {
        // Electronic / Trap (Default)
        newConfig.kick = 0; // 808
        newConfig.snare = 3; // Trap
        newConfig.hihat = 0; // Closed
        newConfig.bass = 0; // Sub
        newConfig.synth = 0; // Pad
        newConfig.fx = 0; // Riser
        newConfig.keys = 1; // Rhodes
      } else if (packId === 'classic') {
        // Classic / Acoustic
        newConfig.kick = 3; // Acoustic
        newConfig.snare = 0; // Crack (Standard)
        newConfig.hihat = 2; // Pedal (Accurate for acoustic?) or 0
        newConfig.tom = 1; // Mid
        newConfig.perc = 2; // Cowbell
        newConfig.bass = 2; // Pluck (Bass Guitar)
        newConfig.keys = 0; // Piano
        newConfig.lead = 2; // Organ?
        newConfig.orch = 0; // Strings
      } else if (packId === 'rock') {
        // Rock Band
        newConfig.kick = 1; // Punchy
        newConfig.snare = 0; // Crack
        newConfig.hihat = 1; // Open
        newConfig.bass = 2; // Pluck
        newConfig.keys = 2; // Organ
        newConfig.lead = 2; // Organ/Guitarish
        newConfig.tom = 0; // Floor
      }

      return newConfig;
    });

    // Play a confirmation sound
    if (AudioEngine.ctx) {
      AudioEngine.init();
      // Simple beep or chord could go here
    }
  };

  // Load accessibility settings from localStorage
  useEffect(() => {
    const savedAccessibility = localStorage.getItem('rhythmRealm_accessibility');
    if (savedAccessibility) {
      try {
        const settings = JSON.parse(savedAccessibility);
        setAccessibilityMode(settings.accessibilityMode || false);
        setTextToSpeechEnabled(settings.textToSpeech || false);
        setHighContrastMode(settings.highContrast || false);
        setLargeTextMode(settings.largeText || false);
        setKeyboardNavMode(settings.keyboardNav || false);
        setVoiceControlEnabled(settings.voiceControl || false);
      } catch (e) {
        console.log('Error loading accessibility settings:', e);
      }
    }
    // Load language preference
    const savedLanguage = localStorage.getItem('rhythmRealm_language');
    if (savedLanguage && LANGUAGES[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save accessibility settings
  useEffect(() => {
    const settings = {
      accessibilityMode,
      textToSpeech: textToSpeechEnabled,
      highContrast: highContrastMode,
      largeText: largeTextMode,
      keyboardNav: keyboardNavMode,
      voiceControl: voiceControlEnabled
    };
    localStorage.setItem('rhythmRealm_accessibility', JSON.stringify(settings));
  }, [accessibilityMode, textToSpeechEnabled, highContrastMode, largeTextMode, keyboardNavMode, voiceControlEnabled]);

  // Voice Control System
  useEffect(() => {
    let recognition = null;
    let isActive = true;

    const startRecognition = () => {
      if (!isActive || !voiceControlEnabled) return;

      // Check for browser support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.log('Speech recognition not supported in this browser');
        alert('Voice control is not supported in this browser. Please use Chrome, Edge, or Safari.');
        return;
      }

      recognition = new SpeechRecognition();
      recognition.continuous = false; // Better reliability with single utterances
      recognition.interimResults = false;
      recognition.lang = LANGUAGES[currentLanguage]?.code || 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('Voice recognition started');
        setIsListening(true);
      };

      recognition.onend = () => {
        console.log('Voice recognition ended');
        setIsListening(false);
        // Auto-restart after a short delay
        if (isActive && voiceControlEnabled) {
          setTimeout(() => {
            if (isActive && voiceControlEnabled) {
              try {
                startRecognition();
              } catch (e) {
                console.log('Restart error:', e);
              }
            }
          }, 300);
        }
      };

      recognition.onerror = (event) => {
        console.log('Speech recognition error:', event.error);
        setIsListening(false);
        // Restart on most errors except abort
        if (event.error !== 'aborted' && isActive && voiceControlEnabled) {
          setTimeout(() => {
            if (isActive && voiceControlEnabled) {
              startRecognition();
            }
          }, 1000);
        }
      };

      recognition.onresult = (event) => {
        const result = event.results[0];
        if (result.isFinal) {
          const command = result[0].transcript.toLowerCase().trim();
          console.log('Voice command received:', command);
          setLastVoiceCommand(command);
          processVoiceCommand(command);
        }
      };

      recognitionRef.current = recognition;

      try {
        recognition.start();
        console.log('Recognition starting...');
      } catch (e) {
        console.log('Recognition start error:', e);
        // Try again after delay
        setTimeout(() => {
          if (isActive && voiceControlEnabled) {
            startRecognition();
          }
        }, 500);
      }
    };

    if (!voiceControlEnabled) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) { }
        recognitionRef.current = null;
      }
      setIsListening(false);
      return;
    }

    // Start recognition
    startRecognition();

    return () => {
      isActive = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) { }
        recognitionRef.current = null;
      }
    };
  }, [voiceControlEnabled, currentLanguage]);

  // Process voice commands - separated for clarity
  const processVoiceCommand = (command) => {
    const speakResponse = (text) => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
      }
    };

    console.log('Processing command:', command);

    // Navigation commands
    if (command.includes('go home') || command.includes('home screen') || command.includes('main menu') || command === 'home') {
      speakResponse('Going to home screen');
      setIsPlaying(false);
      setView('splash');
    }
    else if (command.includes('go to modes') || command.includes('open modes') || command.includes('show modes') || command === 'modes') {
      speakResponse('Opening modes');
      setView('modes');
    }
    else if (command.includes('go to settings') || command.includes('open settings') || command === 'settings') {
      speakResponse('Opening settings');
      setView('settings');
    }
    else if (command.includes('free play') || command.includes('start playing') || command.includes('create beat') || command.includes('studio')) {
      speakResponse('Starting free play mode');
      AudioEngine.init();
      const newGrid = {};
      Object.keys(SOUND_VARIANTS).forEach(key => newGrid[key] = Array(STEPS).fill(false));
      setGrid(newGrid);
      setCurrentScenario(DEFAULT_SCENARIO);
      setTutorialActive(false);
      setActiveGuide(null);
      setPreviousView('splash');
      setView('studio');
    }
    else if (command.includes('dj mode') || command.includes('open dj') || command.includes('start dj') || command === 'dj') {
      speakResponse('Opening DJ mode');
      AudioEngine.init();
      setPreviousView('modes');
      setView('djmode');
    }
    else if (command.includes('tutorial') || command.includes('learn') || command.includes('help me learn')) {
      speakResponse('Opening tutorials');
      setView('tutorials');
    }
    else if (command.includes('library') || command.includes('beat library') || command.includes('saved beats')) {
      speakResponse('Opening beat library');
      setView('library');
    }
    else if (command.includes('go back') || command === 'back') {
      speakResponse('Going back');
      setIsPlaying(false);
      setView(previousView || 'splash');
    }

    // Playback commands
    else if (command === 'play' || command === 'start' || command.includes('play the beat') || command.includes('start playing')) {
      speakResponse('Playing');
      setIsPlaying(true);
    }
    else if (command === 'stop' || command === 'pause' || command.includes('stop playing') || command.includes('pause it')) {
      speakResponse('Stopped');
      setIsPlaying(false);
    }

    // Tempo commands
    else if (command.includes('faster') || command.includes('speed up') || command.includes('increase tempo')) {
      setTempo(prev => {
        const newTempo = Math.min(200, prev + 10);
        speakResponse(`Tempo increased to ${newTempo}`);
        return newTempo;
      });
    }
    else if (command.includes('slower') || command.includes('slow down') || command.includes('decrease tempo')) {
      setTempo(prev => {
        const newTempo = Math.max(40, prev - 10);
        speakResponse(`Tempo decreased to ${newTempo}`);
        return newTempo;
      });
    }

    // Clear commands
    else if (command.includes('clear') || command.includes('reset') || command.includes('start over') || command.includes('clear all')) {
      const newGrid = {};
      Object.keys(SOUND_VARIANTS).forEach(key => newGrid[key] = Array(STEPS).fill(false));
      setGrid(newGrid);
      speakResponse('Beat cleared');
    }

    // Help command
    else if (command.includes('help') || command.includes('what can i say') || command.includes('voice commands')) {
      speakResponse('You can say: play, stop, go home, modes, settings, DJ mode, free play, faster, slower, clear, or go back');
    }

    // Didn't understand
    else {
      speakResponse(`I heard: ${command}. Say help for commands.`);
    }
  };

  // Text-to-Speech function
  const speak = (text) => {
    if (!textToSpeechEnabled || !text) return;

    // Cancel any ongoing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Try to get a natural sounding voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en') && v.name.includes('Natural'))
        || voices.find(v => v.lang.includes('en-US'))
        || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;

      window.speechSynthesis.speak(utterance);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Accessible hover/focus handlers
  const accessibleProps = (label, description) => ({
    'aria-label': label,
    'aria-describedby': description ? `desc-${label.replace(/\s/g, '-')}` : undefined,
    tabIndex: 0,
    onMouseEnter: () => speak(label + (description ? '. ' + description : '')),
    onFocus: () => speak(label + (description ? '. ' + description : '')),
    onMouseLeave: stopSpeaking,
    onBlur: stopSpeaking,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.currentTarget.click();
      }
    }
  });

  // Load saved beats from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('rhythmRealm_savedBeats');
    if (saved) {
      try {
        setSavedBeats(JSON.parse(saved));
      } catch (e) {
        console.log('Error loading saved beats:', e);
      }
    }
  }, []);

  // Save beat function - saves to database if logged in, otherwise localStorage
  const saveBeat = async (name) => {
    const beat = {
      id: Date.now(),
      name: name || `Beat ${savedBeats.length + 1}`,
      date: new Date().toLocaleDateString(),
      grid: grid,
      tempo: tempo,
      activeInstrumentIds: activeInstrumentIds,
      instrumentConfig: instrumentConfig,
    };

    // If user is logged in, save to database
    if (user) {
      try {
        const savedBeat = await beatStorageService.saveBeat(user.id, {
          name: beat.name,
          grid: beat.grid,
          tempo: beat.tempo,
          activeInstrumentIds: beat.activeInstrumentIds,
          instrumentConfig: beat.instrumentConfig,
          isPublic: false
        });

        // Add the database beat to local state with DB id
        const dbBeat = {
          ...beat,
          id: savedBeat.id,
          cloudSaved: true
        };
        const newSavedBeats = [...savedBeats, dbBeat];
        setSavedBeats(newSavedBeats);
        localStorage.setItem('rhythmRealm_savedBeats', JSON.stringify(newSavedBeats));

        console.log('Beat saved to cloud!');
      } catch (error) {
        console.error('Failed to save to cloud, saving locally:', error);
        // Fallback to local storage only
        const newSavedBeats = [...savedBeats, beat];
        setSavedBeats(newSavedBeats);
        localStorage.setItem('rhythmRealm_savedBeats', JSON.stringify(newSavedBeats));
      }
    } else {
      // Not logged in - save to localStorage only
      const newSavedBeats = [...savedBeats, beat];
      setSavedBeats(newSavedBeats);
      localStorage.setItem('rhythmRealm_savedBeats', JSON.stringify(newSavedBeats));
    }

    setShowSaveModal(false);
    setSaveBeatName('');

    // Track beat creation for achievements
    incrementBeatsCreated();
  };

  // Load beat function
  const loadBeat = (beat) => {
    setGrid(beat.grid);
    setTempo(beat.tempo);
    setActiveInstrumentIds(beat.activeInstrumentIds);
    setInstrumentConfig(beat.instrumentConfig);
    setShowLoadModal(false);
  };

  // Delete beat function - deletes from database if logged in
  const deleteBeat = async (beatId) => {
    const beatToDelete = savedBeats.find(b => b.id === beatId);

    // If beat was saved to cloud and user is logged in, delete from database
    if (user && beatToDelete?.cloudSaved) {
      try {
        await beatStorageService.deleteBeat(beatId, user.id);
        console.log('Beat deleted from cloud');
      } catch (error) {
        console.error('Failed to delete from cloud:', error);
      }
    }

    const newSavedBeats = savedBeats.filter(b => b.id !== beatId);
    setSavedBeats(newSavedBeats);
    localStorage.setItem('rhythmRealm_savedBeats', JSON.stringify(newSavedBeats));
  };

  // Load beats from database when user logs in
  const loadBeatsFromCloud = async () => {
    if (!user) return;

    try {
      const cloudBeats = await beatStorageService.getUserBeats(user.id);
      if (cloudBeats && cloudBeats.length > 0) {
        // Convert cloud beats to local format
        const formattedBeats = cloudBeats.map(b => ({
          id: b.id,
          name: b.name,
          date: new Date(b.created_at).toLocaleDateString(),
          grid: b.grid,
          tempo: b.tempo,
          activeInstrumentIds: b.instruments,
          instrumentConfig: b.instrument_config,
          cloudSaved: true,
          favorite: b.favorite || false
        }));

        // Merge with local beats (avoid duplicates by id)
        const localOnlyBeats = savedBeats.filter(local =>
          !formattedBeats.some(cloud => cloud.id === local.id)
        );

        const mergedBeats = [...formattedBeats, ...localOnlyBeats];
        setSavedBeats(mergedBeats);
        localStorage.setItem('rhythmRealm_savedBeats', JSON.stringify(mergedBeats));
      }
    } catch (error) {
      console.error('Failed to load beats from cloud:', error);
    }
  };

  // Load cloud beats when user changes
  React.useEffect(() => {
    if (user) {
      loadBeatsFromCloud();
    }
  }, [user]);

  // Toggle beat favorite
  const toggleFavorite = (beatId) => {
    const newSavedBeats = savedBeats.map(b =>
      b.id === beatId ? { ...b, favorite: !b.favorite } : b
    );
    setSavedBeats(newSavedBeats);
    localStorage.setItem('rhythmRealm_savedBeats', JSON.stringify(newSavedBeats));
  };

  // Seek to specific step
  const seekToStep = (step) => {
    const newStep = Math.max(0, Math.min(STEPS - 1, step));
    setCurrentStep(newStep);
    currentStepRef.current = newStep;
    if (isPlaying && AudioEngine.ctx) {
      nextNoteTimeRef.current = AudioEngine.ctx.currentTime + 0.05;
    }
  };

  // Handle seek bar interaction
  const handleSeekBarInteraction = (e) => {
    if (!seekBarRef.current) return;
    const rect = seekBarRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const step = Math.floor(percentage * STEPS);
    seekToStep(step);
  };

  // Background Music System
  useEffect(() => {
    // Determine if we should play background music
    const shouldPlay = bgMusicEnabled &&
      (view === 'splash' || view === 'modes' || view === 'settings' || view === 'library') &&
      !tutorialActive;

    const startBgMusic = () => {
      if (bgMusicRef.current) return; // Already playing

      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        bgAudioCtxRef.current = ctx;

        // Master gain for background music
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.15; // Keep it subtle
        masterGain.connect(ctx.destination);
        bgGainRef.current = masterGain;

        // Create a chill ambient loop
        const playAmbientLoop = () => {
          if (!bgAudioCtxRef.current || bgAudioCtxRef.current.state === 'closed') return;

          const now = ctx.currentTime;
          const loopDuration = 8; // 8 second loop

          // Ambient pad chord (Cmaj7 - C E G B)
          const padNotes = [130.81, 164.81, 196.00, 246.94]; // C3, E3, G3, B3
          padNotes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.value = freq;

            filter.type = 'lowpass';
            filter.frequency.value = 800;
            filter.Q.value = 1;

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 2);
            gain.gain.setValueAtTime(0.08, now + loopDuration - 2);
            gain.gain.linearRampToValueAtTime(0, now + loopDuration);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(masterGain);

            osc.start(now);
            osc.stop(now + loopDuration);
          });

          // Soft arpeggio melody
          const arpeggioNotes = [261.63, 329.63, 392.00, 493.88, 392.00, 329.63]; // C4, E4, G4, B4, G4, E4
          arpeggioNotes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.value = freq;

            filter.type = 'lowpass';
            filter.frequency.value = 1200;

            const noteStart = now + i * 1.2;
            gain.gain.setValueAtTime(0, noteStart);
            gain.gain.linearRampToValueAtTime(0.06, noteStart + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 1.0);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(masterGain);

            osc.start(noteStart);
            osc.stop(noteStart + 1.0);
          });

          // Soft bass pulse
          [0, 4].forEach(beat => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = 65.41; // C2

            const bassStart = now + beat;
            gain.gain.setValueAtTime(0, bassStart);
            gain.gain.linearRampToValueAtTime(0.1, bassStart + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, bassStart + 1.5);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(bassStart);
            osc.stop(bassStart + 1.5);
          });

          // Schedule next loop
          bgMusicRef.current = setTimeout(() => playAmbientLoop(), loopDuration * 1000 - 100);
        };

        playAmbientLoop();
      } catch (e) {
        console.log('Background music error:', e);
      }
    };

    const stopBgMusic = () => {
      if (bgMusicRef.current) {
        clearTimeout(bgMusicRef.current);
        bgMusicRef.current = null;
      }
      if (bgGainRef.current) {
        bgGainRef.current.gain.linearRampToValueAtTime(0, bgAudioCtxRef.current?.currentTime + 0.5 || 0);
      }
      if (bgAudioCtxRef.current && bgAudioCtxRef.current.state !== 'closed') {
        setTimeout(() => {
          if (bgAudioCtxRef.current) {
            bgAudioCtxRef.current.close();
            bgAudioCtxRef.current = null;
          }
        }, 600);
      }
    };

    if (shouldPlay) {
      startBgMusic();
    } else {
      stopBgMusic();
    }

    return () => stopBgMusic();
  }, [view, bgMusicEnabled, tutorialActive]);

  const [grid, setGrid] = useState(() => {
    const initialGrid = {};
    // Initialize for ALL potential instruments, but UI will only show active ones
    Object.keys(SOUND_VARIANTS).forEach(key => initialGrid[key] = Array(STEPS).fill(false));
    return initialGrid;
  });

  const timerRef = useRef(null);
  const schedulerRef = useRef(null);
  const nextNoteTimeRef = useRef(0);
  const currentStepRef = useRef(0);
  const isPlayingRef = useRef(false);

  // Refs to access current state in scheduler without re-renders
  const gridRef = useRef(grid);
  const tempoRef = useRef(tempo);
  const activeInstrumentIdsRef = useRef(activeInstrumentIds);
  const instrumentConfigRef = useRef(instrumentConfig);
  const soundSettingsRef = useRef(soundSettings);

  // Keep refs in sync with state
  useEffect(() => { gridRef.current = grid; }, [grid]);
  useEffect(() => { tempoRef.current = tempo; }, [tempo]);
  useEffect(() => { activeInstrumentIdsRef.current = activeInstrumentIds; }, [activeInstrumentIds]);
  useEffect(() => { instrumentConfigRef.current = instrumentConfig; }, [instrumentConfig]);
  useEffect(() => { soundSettingsRef.current = soundSettings; }, [soundSettings]);

  // --- LOGIC ---
  const calculateGuideProgress = () => {
    if (!activeGuide) return 0;
    let totalTargetNotes = 0;
    let matchingNotes = 0;
    Object.keys(activeGuide.pattern).forEach(inst => {
      const targetSteps = activeGuide.pattern[inst] || [];
      totalTargetNotes += targetSteps.length;
      targetSteps.forEach(step => {
        if (grid[inst][step]) matchingNotes++;
      });
    });
    return totalTargetNotes === 0 ? 0 : (matchingNotes / totalTargetNotes) * 100;
  };
  const guideProgress = calculateGuideProgress();
  const currentScore = guideProgress;

  // Select a Guide Logic
  const handleSelectGuide = (guide) => {
    setActiveGuide(guide);
    setShowGuideMenu(false);
    if (guide) {
      // Ensure instruments required by the guide are visible
      const requiredInsts = Object.keys(guide.pattern).filter(k => guide.pattern[k].length > 0);
      setActiveInstrumentIds(prev => {
        const newSet = new Set([...prev, ...requiredInsts]);
        return Array.from(newSet);
      });
    }
  };

  // Add/Remove Tracks
  const addTrack = (instId) => {
    if (activeInstrumentIds.length >= 12) return;
    if (!activeInstrumentIds.includes(instId)) {
      setActiveInstrumentIds([...activeInstrumentIds, instId]);
    }
    setShowAddTrackMenu(false);
  };

  const removeTrack = (instId) => {
    setActiveInstrumentIds(activeInstrumentIds.filter(id => id !== instId));
  };

  // WEB AUDIO SCHEDULER - Uses look-ahead for precise timing
  const scheduleNote = (stepIndex, time) => {
    let notesPlayed = 0;

    activeInstrumentIdsRef.current.forEach(key => {
      if (gridRef.current[key][stepIndex]) {
        const variantIndex = instrumentConfigRef.current[key];
        const sound = SOUND_VARIANTS[key][variantIndex];
        const settings = soundSettingsRef.current[key] || { pitch: 0, chord: null, bend: 0, volume: 100, muted: false, attack: 0, decay: 100, filter: 100, reverb: 0, distortion: 0, pan: 0 };

        if (!settings.muted) {
          AudioEngine.trigger(sound, time, settings);
          notesPlayed++;
        }
      }
    });

    return notesPlayed;
  };

  const scheduler = () => {
    const lookahead = 0.1; // How far ahead to schedule (seconds)
    const scheduleAheadTime = 0.1; // How far ahead to look (seconds)

    while (nextNoteTimeRef.current < AudioEngine.ctx.currentTime + scheduleAheadTime) {
      // Schedule the note
      const notesPlayed = scheduleNote(currentStepRef.current, nextNoteTimeRef.current);

      // Update UI on main beat (but not in the audio thread)
      const stepToUpdate = currentStepRef.current;
      const timeUntilNote = (nextNoteTimeRef.current - AudioEngine.ctx.currentTime) * 1000;

      setTimeout(() => {
        setCurrentStep(stepToUpdate);
        if (notesPlayed > 0) {
          setHype(prev => Math.min(prev + 0.5, 100));
          setBeatPulse(1);
          setTimeout(() => setBeatPulse(0), 100);
        }
      }, Math.max(0, timeUntilNote));

      // Move to next step
      const secondsPerBeat = 60.0 / tempoRef.current;
      const secondsPerStep = secondsPerBeat / 4; // 16th notes (4 steps per beat)
      nextNoteTimeRef.current += secondsPerStep;
      currentStepRef.current = (currentStepRef.current + 1) % STEPS;
    }
  };

  // COMPOSE LOOP - Using Web Audio precise scheduling
  useEffect(() => {
    if (isPlaying) {
      AudioEngine.init();
      isPlayingRef.current = true;
      nextNoteTimeRef.current = AudioEngine.ctx.currentTime + 0.05; // Small delay to start
      currentStepRef.current = currentStep;

      // Use a faster interval for the scheduler (25ms for smooth scheduling)
      schedulerRef.current = setInterval(scheduler, 25);
    } else {
      isPlayingRef.current = false;
      if (schedulerRef.current) {
        clearInterval(schedulerRef.current);
        schedulerRef.current = null;
      }
    }
    return () => {
      if (schedulerRef.current) {
        clearInterval(schedulerRef.current);
        schedulerRef.current = null;
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (view === 'studio' && currentScenario) {
      AudioEngine.startAmbience(currentScenario.ambience);
    } else {
      AudioEngine.stopAmbience();
    }
    return () => AudioEngine.stopAmbience();
  }, [view, currentScenario]);

  useEffect(() => {
    const handleUp = () => setIsMouseDown(false);
    window.addEventListener('mouseup', handleUp);
    return () => window.removeEventListener('mouseup', handleUp);
  }, []);

  // AUTO-SET INSTRUMENT VARIANT FOR TUTORIAL STEPS
  useEffect(() => {
    if (tutorialActive && currentScenario && currentScenario.tutorial) {
      const currentTask = currentScenario.tutorial[tutorialStep];
      if (currentTask && currentTask.targetInstrument && currentTask.soundVariant !== undefined) {
        // Automatically set the instrument to the recommended variant for this tutorial step
        setInstrumentConfig(prev => ({
          ...prev,
          [currentTask.targetInstrument]: currentTask.soundVariant
        }));
      }
    }
  }, [tutorialStep, tutorialActive, currentScenario]);

  // ACTIONS
  const toggleCell = (instKey, stepIndex) => {
    // --- 1. Tutorial Locking ---
    if (tutorialActive && currentScenario && currentScenario.tutorial) {
      const scenarioTutorial = currentScenario.tutorial;
      if (tutorialStep < scenarioTutorial.length) {
        const currentTask = scenarioTutorial[tutorialStep];
        if (currentTask.targetInstrument && currentTask.targetSteps && currentTask.targetSteps.length > 0) {
          if (instKey !== currentTask.targetInstrument || !currentTask.targetSteps.includes(stepIndex)) {
            return; // Block click
          }
        }
      }
    }

    // --- 2. Guide Locking (Strict Mode) ---
    if (activeGuide) {
      const validSteps = activeGuide.pattern[instKey] || [];
      // Only allow toggling if it's a valid step in the guide
      if (!validSteps.includes(stepIndex)) {
        return; // Block click
      }
    }

    AudioEngine.init();
    // Close any open sound picker when clicking on grid
    if (showSoundPicker) setShowSoundPicker(null);

    setGrid(prev => {
      const newRow = [...prev[instKey]];
      newRow[stepIndex] = !newRow[stepIndex];
      if (newRow[stepIndex]) {
        const variantIndex = typeof instrumentConfig[instKey] === 'number' ? instrumentConfig[instKey] : 0;
        const sound = SOUND_VARIANTS[instKey]?.[variantIndex] || SOUND_VARIANTS[instKey]?.[0];
        // For preview, always play the sound (ignore mute)
        const previewSettings = { ...(soundSettings[instKey] || {}), muted: false };
        AudioEngine.trigger(sound, 0, previewSettings);
      }
      const nextGrid = { ...prev, [instKey]: newRow };

      // Advance onboarding tutorial if on click-grid step
      if (showOnboarding && ONBOARDING_STEPS[onboardingStep]?.action === 'click-grid') {
        setTimeout(() => setOnboardingStep(prev => prev + 1), 300);
      }

      if (tutorialActive) {
        const scenarioTutorial = currentScenario.tutorial;
        if (tutorialStep < scenarioTutorial.length) {
          const currentTask = scenarioTutorial[tutorialStep];
          if (currentTask.targetInstrument === instKey) {
            const allFilled = currentTask.targetSteps.every(idx => nextGrid[instKey][idx] === true);
            if (allFilled) {
              setTimeout(() => setTutorialStep(prev => Math.min(prev + 1, scenarioTutorial.length - 1)), 300);
            }
          }
        }
      }
      return nextGrid;
    });
  };

  const cycleInstrument = (instKey) => {
    setInstrumentConfig(prev => ({ ...prev, [instKey]: (prev[instKey] + 1) % SOUND_VARIANTS[instKey].length }));
  };

  const smartFill = (instKey) => {
    if (activeGuide) return; // Disable smart fill in guide mode to enforce learning
    setGrid(prev => {
      const newRow = Array(STEPS).fill(false);
      for (let i = 0; i < 6; i++) newRow[Math.floor(Math.random() * STEPS)] = true;
      return { ...prev, [instKey]: newRow };
    });
  };

  const clearGrid = () => {
    const newGrid = {};
    Object.keys(grid).forEach(key => newGrid[key] = Array(STEPS).fill(false));
    setGrid(newGrid);
  };

  const startLevel = (scenario) => {
    AudioEngine.init();
    setCurrentScenario(scenario);
    setTempo(scenario.bpm);
    setIsPlaying(false);

    // For tutorials: start with empty grid so user learns step by step
    if (scenario.tutorial) {
      // Clear the grid
      const newGrid = {};
      Object.keys(SOUND_VARIANTS).forEach(key => newGrid[key] = Array(STEPS).fill(false));
      setGrid(newGrid);

      // Get all instruments used in the tutorial
      const tutorialInstruments = scenario.tutorial
        .filter(step => step.targetInstrument)
        .map(step => step.targetInstrument);
      const uniqueInstruments = [...new Set(tutorialInstruments)];

      // Set active instruments to only the ones needed for tutorial
      setActiveInstrumentIds(uniqueInstruments);

      // Enable tutorial mode
      setTutorialActive(true);
      setTutorialStep(0);
      setActiveGuide(null);
      setLockedInstruments({});
    }
    // For non-tutorial scenarios (map vibes): load the beat
    else if (scenario.beat) {
      const newGrid = {};
      Object.keys(SOUND_VARIANTS).forEach(key => newGrid[key] = Array(STEPS).fill(false));
      Object.entries(scenario.beat).forEach(([inst, steps]) => {
        if (newGrid[inst]) {
          steps.forEach(step => {
            if (step < STEPS) newGrid[inst][step] = true;
          });
        }
      });
      setGrid(newGrid);

      // Enable the instruments used in this beat
      const usedInstruments = Object.keys(scenario.beat);
      setActiveInstrumentIds(usedInstruments);
      setTutorialActive(false);
      setActiveGuide(null);
      setLockedInstruments({});
    }
    // For GAME LEVELS: load premade pattern if it exists
    else if (scenario.premadePattern) {
      const newGrid = {};
      Object.keys(SOUND_VARIANTS).forEach(key => newGrid[key] = Array(STEPS).fill(false));

      // Load the premade pattern
      Object.entries(scenario.premadePattern).forEach(([inst, steps]) => {
        if (newGrid[inst]) {
          steps.forEach(step => {
            if (step < STEPS) newGrid[inst][step] = true;
          });
        }
      });
      setGrid(newGrid);

      // Enable the instruments used in this level
      const requiredInstruments = scenario.requirements?.instruments || [];
      const premadeInstruments = Object.keys(scenario.premadePattern);
      const allInstruments = [...new Set([...requiredInstruments, ...premadeInstruments])];

      setActiveInstrumentIds(allInstruments);
      setTutorialActive(false);
      setActiveGuide(null);
      setLockedInstruments({});
    }

    setView('studio');
  };

  const handleSoundSettingChange = (instKey, setting, value) => {
    setSoundSettings(prev => ({
      ...prev,
      [instKey]: { ...prev[instKey], [setting]: value }
    }));
  };

  const handleMouseDown = (key, idx) => { setIsMouseDown(true); toggleCell(key, idx); };
  const handleMouseEnter = (key, idx) => { if (isMouseDown) toggleCell(key, idx); };
  const handleTouchStart = (key, idx) => { toggleCell(key, idx); };

  // Mobile step navigation
  const scrollMobileSteps = (direction) => {
    if (direction === 'left') {
      setMobileStepOffset(prev => Math.max(0, prev - mobileStepsVisible));
    } else {
      setMobileStepOffset(prev => Math.min(STEPS - mobileStepsVisible, prev + mobileStepsVisible));
    }
  };

  // Voice Control Floating Indicator Component
  const VoiceControlIndicator = () => {
    if (!voiceControlEnabled) return null;
    return (
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
        <div className={`px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all ${isListening ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}>
          <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-white' : 'bg-white/50'}`}></div>
          <span className="text-white font-bold text-sm">{isListening ? '🎤 Listening' : '🔇 Paused'}</span>
        </div>
        {lastVoiceCommand && (
          <div className="px-3 py-1 bg-black/80 rounded-full text-white text-xs">
            "{lastVoiceCommand}"
          </div>
        )}
      </div>
    );
  };

  // --- RENDER ---

  // ==========================================
  // AUTHENTICATION MODAL - Rendered inline to prevent remount on state change
  // ==========================================
  const authModalContent = showAuthModal ? (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-purple-500/50 rounded-3xl w-full max-w-md shadow-2xl shadow-purple-500/20 animate-bounce-in" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <span className="text-3xl">
              {authMode === 'login' ? '🔐' : authMode === 'verification' ? '📧' : '✨'}
            </span>
            {authMode === 'login' ? 'Welcome Back!' : authMode === 'verification' ? 'Check Email' : 'Join Rhythm Realm'}
          </h2>
          <button onClick={() => setShowAuthModal(false)} className="p-2 hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-white">
            <Icons.Close />
          </button>
        </div>

        {authMode === 'verification' ? (
          <div className="p-8 text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500/50 animate-pulse-slow">
              <span className="text-4xl">📩</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Verification Link Sent!</h3>
            <p className="text-slate-400 mb-6 font-medium">
              We sent a link to <span className="text-green-400 font-bold">{authEmail}</span>.
              <br /><span className="text-sm opacity-80 mt-2 block">Click it to activate your account. Check Spam if needed!</span>
            </p>
            <button
              onClick={() => setShowAuthModal(false)}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
            >
              Got it!
            </button>
            <button
              onClick={() => setAuthMode('login')}
              className="mt-4 text-slate-500 hover:text-slate-300 text-sm font-bold"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="p-6 space-y-4" autoComplete="off">
            {authError && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
                ⚠️ {authError}
              </div>
            )}

            {authMode === 'register' && (
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Username</label>
                <input
                  type="text"
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder="Your display name"
                  className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-all"
                  required
                  minLength={3}
                  autoComplete="off"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Email</label>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="your@email.com"
                className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-all"
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Password</label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="••••••••"
                className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-all"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl font-bold text-white text-lg transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50"
            >
              {authLoading ? '⏳ Please wait...' : (authMode === 'login' ? '🚀 Login' : '🎉 Create Account')}
            </button>

            <div className="text-center text-slate-400 text-sm">
              {authMode === 'login' ? (
                <>Don't have an account? <button type="button" onClick={() => { setAuthMode('register'); setAuthError(''); }} className="text-purple-400 hover:text-purple-300 font-bold">Sign up</button></>
              ) : (
                <>Already have an account? <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} className="text-purple-400 hover:text-purple-300 font-bold">Login</button></>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  ) : null;

  // ==========================================
  // USER PROFILE HEADER COMPONENT
  // ==========================================
  const UserProfileHeader = () => {
    // Show login button even during loading, just show loading state for profile
    return (
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        {user ? (
          <>
            {/* Leaderboard Button */}
            <button
              onClick={() => { loadLeaderboard(); setShowLeaderboard(true); }}
              className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-xl shadow-lg transition-all hover:scale-105"
              title="Leaderboard"
            >
              <span className="text-xl">🏆</span>
            </button>

            {/* Achievements Button */}
            <button
              onClick={() => { loadUserAchievements(); setShowAchievements(true); }}
              className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 rounded-xl shadow-lg transition-all hover:scale-105"
              title="Achievements"
            >
              <span className="text-xl">🏅</span>
            </button>

            {/* User Profile - Clickable to open profile */}
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 hover:bg-slate-700/80 transition-all cursor-pointer"
              title="View Profile"
            >
              <div className="text-right">
                <div className="text-sm font-bold text-white">{userProfile?.username || 'Player'}</div>
                <div className="text-xs text-slate-400">Lvl {userProfile?.level || 1} • {userProfile?.rank_title || 'Beginner'}</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg font-black text-white">
                {(userProfile?.username || 'P')[0].toUpperCase()}
              </div>
            </button>

            {/* Logout Button */}
            <button
              onClick={() => handleLogout(false)}
              className="p-3 bg-slate-800/80 hover:bg-red-500/30 rounded-xl text-slate-400 hover:text-red-400 transition-all border border-slate-700 hover:border-red-500/50"
              title="Logout"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl font-bold text-white shadow-lg shadow-purple-500/30 transition-all hover:scale-105 flex items-center gap-2"
          >
            <span className="text-lg">👤</span> Login / Sign Up
          </button>
        )}
      </div>
    );
  };

  // ==========================================
  // LEADERBOARD MODAL COMPONENT
  // ==========================================
  const LeaderboardModal = () => (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-amber-500/50 rounded-3xl w-full max-w-2xl shadow-2xl shadow-amber-500/20 animate-bounce-in max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between shrink-0">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <span className="text-3xl">🏆</span> Global Leaderboard
          </h2>
          <button onClick={() => setShowLeaderboard(false)} className="p-2 hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-white">
            <Icons.Close />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {leaderboardLoading ? (
            <div className="text-center py-12 text-slate-400">
              <div className="text-5xl mb-4 animate-bounce">⏳</div>
              <p>Loading leaderboard...</p>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <div className="text-5xl mb-4">👥</div>
              <p>No players yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboardData.map((player, index) => {
                const rank = index + 1;
                const isCurrentUser = user && player.id === user.id;
                const medalEmoji = rank === 1 ? '🥁‡' : rank === 2 ? '🥁ˆ' : rank === 3 ? '🥁‰' : '';

                return (
                  <div
                    key={player.id}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${isCurrentUser
                      ? 'bg-purple-500/30 border-2 border-purple-500'
                      : rank <= 3
                        ? 'bg-amber-500/10 border border-amber-500/30'
                        : 'bg-slate-800/50 border border-slate-700/50'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${rank === 1 ? 'bg-amber-400 text-amber-900' :
                      rank === 2 ? 'bg-slate-300 text-slate-700' :
                        rank === 3 ? 'bg-amber-600 text-amber-100' :
                          'bg-slate-700 text-slate-300'
                      }`}>
                      {medalEmoji || rank}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{player.username}</span>
                        {isCurrentUser && <span className="text-xs bg-purple-500 px-2 py-0.5 rounded-full text-white">You</span>}
                      </div>
                      <div className="text-xs text-slate-400">
                        Level {player.level} • {player.rank_title}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-xl text-white">{player.total_score?.toLocaleString() || 0}</div>
                      <div className="text-xs text-slate-400">{player.total_beats_created || 0} beats</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {userRank && userRank > 10 && (
          <div className="p-4 border-t border-slate-700 shrink-0">
            <div className="text-center text-slate-400 text-sm">
              Your rank: <span className="text-purple-400 font-bold">#{userRank}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ==========================================
  // ACHIEVEMENTS MODAL COMPONENT
  // ==========================================
  const AchievementsModal = () => {
    const unlockedIds = new Set(userAchievements.map(a => a.achievement_id));

    return (
      <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-green-500/50 rounded-3xl w-full max-w-3xl shadow-2xl shadow-green-500/20 animate-bounce-in max-h-[80vh] flex flex-col">
          <div className="p-6 border-b border-slate-700 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="text-3xl">🏅</span> Achievements
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {userAchievements.length} / {ACHIEVEMENTS.length} unlocked
              </p>
            </div>
            <button onClick={() => setShowAchievements(false)} className="p-2 hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-white">
              <Icons.Close />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {achievementsLoading ? (
              <div className="text-center py-12 text-slate-400">
                <div className="text-5xl mb-4 animate-bounce">⏳</div>
                <p>Loading achievements...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ACHIEVEMENTS.map((achievement) => {
                  const isUnlocked = unlockedIds.has(achievement.id);
                  const progress = achievementService.getAchievementProgress(achievement.id, userStats);

                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-xl border-2 transition-all ${isUnlocked
                        ? 'bg-green-500/20 border-green-500/50'
                        : 'bg-slate-800/50 border-slate-700/50 opacity-60'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isUnlocked ? 'bg-green-500/30' : 'bg-slate-700/50 grayscale'
                          }`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{achievement.name}</span>
                            {isUnlocked && <span className="text-green-400">✔</span>}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{achievement.description}</p>
                          {progress && !isUnlocked && (
                            <div className="mt-2">
                              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-purple-500 transition-all"
                                  style={{ width: `${Math.min(100, (progress.current / progress.target) * 100)}%` }}
                                ></div>
                              </div>
                              <div className="text-[10px] text-slate-500 mt-1">
                                {progress.current} / {progress.target}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-amber-400 font-bold">
                          +{achievement.xp} XP
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // LEVEL SYSTEM FUNCTIONS
  // ==========================================

  // Check if level requirements are met
  const checkLevelCompletion = (level) => {
    if (!level) return { complete: false, score: 0, stars: 0 };

    const requirements = level.requirements;
    let score = 0;
    let totalRequired = 0;
    let totalPlaced = 0;

    // Count notes per instrument
    // Count notes per instrument (excluding locked/premade notes)
    const noteCounts = {};
    Object.keys(grid).forEach(inst => {
      const totalNotes = grid[inst].filter(Boolean).length;
      const lockedNotes = level.premadePattern?.[inst]?.length || 0;
      // Ensure we don't go below zero (though shouldn't happen)
      noteCounts[inst] = Math.max(0, totalNotes - lockedNotes);
    });

    // Check minimum notes for each required instrument
    let allRequirementsMet = true;
    Object.entries(requirements.mustInclude || {}).forEach(([inst, minCount]) => {
      totalRequired += minCount;
      const placed = noteCounts[inst] || 0;
      totalPlaced += Math.min(placed, minCount);
      if (placed < minCount) allRequirementsMet = false;
    });

    // Calculate score based on completion
    score = Math.round((totalPlaced / Math.max(1, totalRequired)) * 100);

    // Calculate stars (1-3)
    let stars = 0;
    if (score >= 100) stars = 3;
    else if (score >= 75) stars = 2;
    else if (score >= 50) stars = 1;

    return { complete: allRequirementsMet && score >= 100, score, stars };
  };

  // Submit level completion
  const submitLevel = async () => {
    if (!currentLevel) return;

    const result = checkLevelCompletion(currentLevel);
    setLevelScore(result.score);

    if (result.complete) {
      setLevelComplete(true);

      // Save progress
      const isFirstCompletion = !levelProgress[currentLevel.id]?.completed;
      const wasThreeStar = levelProgress[currentLevel.id]?.stars >= 3;
      const isNewThreeStar = result.stars >= 3 && !wasThreeStar;

      const newProgress = {
        ...levelProgress,
        [currentLevel.id]: {
          completed: true,
          stars: Math.max(result.stars, levelProgress[currentLevel.id]?.stars || 0),
          bestScore: Math.max(result.score, levelProgress[currentLevel.id]?.bestScore || 0)
        }
      };
      setLevelProgress(newProgress);
      localStorage.setItem('rhythmRealm_levelProgress', JSON.stringify(newProgress));

      // Count completed levels and three star levels for achievements
      const completedCount = Object.values(newProgress).filter(p => p?.completed).length;
      const threeStarCount = Object.values(newProgress).filter(p => p?.stars >= 3).length;

      // Award XP and update stats
      const xp = currentLevel.xpReward;

      // Update local stats
      setUserStats(prev => ({
        ...prev,
        totalScore: prev.totalScore + xp,
        tutorialsCompleted: prev.tutorialsCompleted + (isFirstCompletion ? 1 : 0),
        instrumentsUsed: activeInstrumentIds.length,
        tempo: tempo,
        hasPlayed: true,
        levelsCompleted: completedCount,
        threeStarLevels: threeStarCount
      }));

      // Update visible profile immediately
      if (userProfile) {
        setUserProfile(prev => ({
          ...prev,
          total_score: (prev.total_score || 0) + xp,
          experience_points: (prev.experience_points || 0) + xp,
          level: Math.floor(((prev.experience_points || 0) + xp) / 1000) + 1
        }));
      }

      // Sync with backend if logged in
      if (user) {
        try {
          // We can optimistically update, actual sync happens via service elsewhere or we can force it here
          // For now, local state update ensures UI is responsive
        } catch (e) { console.error("XP sync failed", e); }

        setTimeout(() => checkForAchievements(), 500);
      }
    }
  };

  // Get unlocked levels
  const getUnlockedLevels = () => {
    return GAME_LEVELS.map((level, index) => {
      if (index === 0) return { ...level, unlocked: true };
      const prevLevel = GAME_LEVELS[index - 1];
      const prevCompleted = levelProgress[prevLevel.id]?.completed;
      return { ...level, unlocked: prevCompleted || level.unlocked };
    });
  };

  // Show next hint
  const showNextHint = () => {
    if (!currentLevel) return;
    const hints = currentLevel.hints || [];
    if (currentHintIndex < hints.length) {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 4000);
      if (currentHintIndex < hints.length - 1) {
        setCurrentHintIndex(prev => prev + 1);
      }
    }
  };

  // ==========================================
  // NEW ACHIEVEMENT NOTIFICATION
  // ==========================================
  const AchievementNotification = () => {
    if (!newAchievementUnlocked) return null;

    return (
      <div className="fixed top-4 sm:top-20 left-2 right-2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[150] animate-bounce-in">
        <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 px-4 sm:px-8 py-4 sm:py-5 rounded-2xl shadow-2xl shadow-amber-500/50 flex items-center gap-3 sm:gap-4 border-2 border-yellow-300 max-w-md mx-auto">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/30 rounded-xl flex items-center justify-center text-2xl sm:text-4xl animate-bounce shadow-lg shrink-0">
            {newAchievementUnlocked.icon}
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold text-yellow-100 uppercase tracking-wide flex items-center gap-1 sm:gap-2">
              <span className="text-base sm:text-xl">🎉</span> Achievement! <span className="text-base sm:text-xl">🎉</span>
            </div>
            <div className="text-lg sm:text-2xl font-black text-white drop-shadow-lg truncate">{newAchievementUnlocked.name}</div>
            <div className="text-xs sm:text-sm text-yellow-100 font-bold">+{newAchievementUnlocked.xp} XP</div>
            <div className="text-[10px] sm:text-xs text-yellow-200 mt-1 line-clamp-2">{newAchievementUnlocked.description}</div>
          </div>
        </div>
      </div>
    );
  };

  if (view === 'splash') {
    return (
      <div className={`h-screen w-full text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans ${highContrastMode ? 'high-contrast' : ''} ${largeTextMode ? 'large-text' : ''}`} role="main" aria-label="Rhythm Realm - Music Creation App">
        <style>{cssStyles}</style>
        {/* Skip to main content link for screen readers */}
        <a href="#main-content" className="skip-link" onFocus={() => speak('Skip to main content')}>Skip to main content</a>
        <VoiceControlIndicator />
        <PixelMusicBackground theme={currentTheme} />

        {/* User Profile Header */}
        <UserProfileHeader />

        {/* Achievement Notification */}
        <AchievementNotification />

        {/* Auth Modal */}
        {authModalContent}

        {/* Leaderboard Modal */}
        {showLeaderboard && <LeaderboardModal />}

        {/* Achievements Modal */}
        {showAchievements && <AchievementsModal />}

        {/* Profile Modal */}
        {showProfile && (
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-purple-500/50 rounded-3xl w-full max-w-lg shadow-2xl animate-bounce-in max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <span className="text-3xl">👤</span> My Profile
                </h2>
                <button onClick={() => setShowProfile(false)} className="p-2 hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-white">
                  <Icons.Close />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {user && userProfile ? (
                  <>
                    {/* Profile Header */}
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl font-black text-white">
                        {(userProfile.username || 'P')[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white">{userProfile.username}</h3>
                        <p className="text-purple-400">{userProfile.rank_title || 'Beginner'}</p>
                        <p className="text-slate-500 text-sm">{userProfile.email}</p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-purple-400">{userProfile.level || 1}</div>
                        <div className="text-xs text-slate-500 uppercase">Level</div>
                      </div>
                      <div className="bg-slate-800 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-amber-400">{userProfile.total_score?.toLocaleString() || 0}</div>
                        <div className="text-xs text-slate-500 uppercase">Total XP</div>
                      </div>
                      <div className="bg-slate-800 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-green-400">{userProfile.total_beats_created || 0}</div>
                        <div className="text-xs text-slate-500 uppercase">Beats Created</div>
                      </div>
                      <div className="bg-slate-800 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-cyan-400">{Object.values(levelProgress).filter(p => p?.completed).length}</div>
                        <div className="text-xs text-slate-500 uppercase">Levels Done</div>
                      </div>
                    </div>

                    {/* XP Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">XP to Next Level</span>
                        <span className="text-white font-bold">{(userProfile.experience_points || 0) % 1000} / 1000</span>
                      </div>
                      <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                          style={{ width: `${((userProfile.experience_points || 0) % 1000) / 10}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Streak */}
                    <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-500/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🔥</span>
                          <span className="text-white font-bold">Current Streak</span>
                        </div>
                        <div className="text-2xl font-black text-orange-400">{userProfile.current_streak || 0} days</div>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={() => handleLogout(true)}
                      className="w-full p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 font-bold hover:bg-red-500/30 transition-all"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">👤</div>
                    <h3 className="text-xl font-bold text-white mb-2">Not Logged In</h3>
                    <p className="text-slate-400 mb-6">Login to save your progress and compete on the leaderboard!</p>
                    <button
                      onClick={() => { setShowProfile(false); setShowAuthModal(true); }}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white"
                    >
                      Login / Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div id="main-content" className="z-10 text-center animate-bounce-in px-4 w-full max-w-md">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white drop-shadow-[0_5px_0_rgba(0,0,0,0.3)] tracking-tight mb-4 sm:mb-6 pixel-font" style={{ textShadow: '4px 4px 0px #a855f7, 8px 8px 0px #06b6d4' }} aria-label={t('appTitle')}>{t('appTitle').split(' ')[0]}<br />{t('appTitle').split(' ')[1] || ''}</h1>
          <p className="text-cyan-300 text-base sm:text-lg mb-4 sm:mb-6 opacity-80" aria-hidden="true">🎵 {t('createBeat')} 🎵</p>

          {/* User Stats Card (if logged in) */}
          {user && userProfile && (
            <div className="mb-4 p-4 bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{userProfile.rank_title?.split(' ')[0] || '🎵'}</div>
                  <div className="text-left">
                    <div className="text-white font-bold">{userProfile.username}</div>
                    <div className="text-slate-400 text-xs">Level {userProfile.level} • {userProfile.total_score?.toLocaleString() || 0} pts</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-amber-400 font-bold text-lg">{userProfile.total_beats_created || 0}</div>
                  <div className="text-slate-500 text-xs">Beats</div>
                </div>
              </div>
              {/* XP Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>XP Progress</span>
                  <span>{(userProfile.experience_points || 0) % 1000} / 1000</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${((userProfile.experience_points || 0) % 1000) / 10}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 sm:space-y-4" role="navigation" aria-label="Main menu">
            <Button
              onClick={() => {
                AudioEngine.init();
                setView('levels');
              }}
              size="lg"
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 border-purple-700 hover:from-cyan-400 hover:to-purple-400"
              onMouseEnter={() => speak(t('letsPlay') + "! Choose a level and learn to make beats")}
              onFocus={() => speak(t('letsPlay') + "! Choose a level and learn to make beats")}
              onMouseLeave={stopSpeaking}
              onBlur={stopSpeaking}
              aria-label={t('letsPlay') + " - Choose a level to play"}
            ><Icons.Play /> {t('letsPlay')}</Button>
            <div className="flex gap-3">
              <button
                onClick={() => setView('modes')}
                className="flex-1 px-6 py-4 rounded-3xl text-lg font-black uppercase tracking-wide transition-all shadow-xl flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-400 hover:via-purple-400 hover:to-indigo-400 text-white border-b-8 border-purple-700 active:border-b-0 active:translate-y-2"
                onMouseEnter={() => speak(t('modes') + ". Choose from Free Play, Tutorial, Beat Library, or DJ Mode")}
                onFocus={() => speak(t('modes') + ". Choose from Free Play, Tutorial, Beat Library, or DJ Mode")}
                onMouseLeave={stopSpeaking}
                onBlur={stopSpeaking}
                aria-label={t('modes') + " - Access different game modes"}
              >
                <span className="text-2xl" aria-hidden="true">🎮</span> {t('modes')}
              </button>
              <button
                onClick={() => setView('settings')}
                className="flex-1 px-6 py-4 rounded-3xl text-lg font-black uppercase tracking-wide transition-all shadow-xl flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:via-teal-400 hover:to-emerald-400 text-white border-b-8 border-teal-700 active:border-b-0 active:translate-y-2"
                onMouseEnter={() => speak(t('settings') + ". Adjust volume, themes, and accessibility options")}
                onFocus={() => speak(t('settings') + ". Adjust volume, themes, and accessibility options")}
                onMouseLeave={stopSpeaking}
                onBlur={stopSpeaking}
                aria-label={t('settings') + " - Adjust app settings and accessibility"}
              >
                <Icons.Sliders /> {t('settings')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // LEVELS VIEW - Level Selection Screen
  // ==========================================
  if (view === 'levels') {
    const unlockedLevels = getUnlockedLevels();

    return (
      <div className={`h-screen w-full text-white flex flex-col overflow-hidden font-sans relative ${highContrastMode ? 'high-contrast' : ''} ${largeTextMode ? 'large-text' : ''}`}>
        <style>{cssStyles}</style>
        <VoiceControlIndicator />
        <PixelMusicBackground theme={currentTheme} />

        {/* Achievement Notification - Global */}
        <AchievementNotification />

        {/* Header */}
        <div className="relative z-10 px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between border-b border-white/10 bg-black/30 backdrop-blur-sm">
          <button
            onClick={() => setView('splash')}
            className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl shadow-lg transition-all active:scale-95"
          ><Icons.ChevronLeft /></button>
          <h2 className="text-xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">🎮 SELECT LEVEL</h2>
          <button
            onClick={() => setShowProfile(true)}
            className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl shadow-lg transition-all active:scale-95"
          >👤</button>
        </div>

        {/* Level Grid */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 max-w-6xl mx-auto">
            {unlockedLevels.map((level, index) => {
              const progress = levelProgress[level.id];
              const isCompleted = progress?.completed;
              const stars = progress?.stars || 0;

              return (
                <button
                  key={level.id}
                  onClick={() => {
                    if (level.unlocked) {
                      AudioEngine.init();
                      const newGrid = {};
                      Object.keys(SOUND_VARIANTS).forEach(key => newGrid[key] = Array(STEPS).fill(false));
                      // Load premade pattern if exists
                      if (level.premadePattern) {
                        Object.entries(level.premadePattern).forEach(([inst, steps]) => {
                          if (newGrid[inst]) {
                            steps.forEach(s => {
                              if (s < STEPS) newGrid[inst][s] = true;
                            });
                          }
                        });
                      }
                      setGrid(newGrid);
                      setCurrentLevel(level);
                      setCurrentHintIndex(0);
                      setShowHint(false);
                      setLevelComplete(false);
                      setTempo(level.tempo);
                      setCurrentScenario(DEFAULT_SCENARIO);
                      setPreviousView('levels');
                      setView('levelPlay');
                    }
                  }}
                  disabled={!level.unlocked}
                  className={`relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-center transition-all ${level.unlocked
                    ? isCompleted
                      ? 'bg-gradient-to-br from-green-500/80 to-emerald-600/80 hover:scale-105 border-2 border-green-400/50'
                      : 'bg-gradient-to-br from-purple-500/80 to-pink-600/80 hover:scale-105 border-2 border-purple-400/50'
                    : 'bg-slate-800/50 opacity-50 cursor-not-allowed border-2 border-slate-700/50'
                    } backdrop-blur-sm shadow-xl`}
                >
                  {/* Level Number */}
                  <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${level.unlocked ? 'bg-white text-purple-600' : 'bg-slate-600 text-slate-400'
                    }`}>
                    {level.id}
                  </div>

                  {/* Lock Icon */}
                  {!level.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl">🔒</span>
                    </div>
                  )}

                  {/* Level Content */}
                  <div className={level.unlocked ? '' : 'opacity-30'}>
                    <div className="text-4xl mb-2">{level.icon}</div>
                    <div className="font-bold text-sm sm:text-base mb-1">{level.name}</div>
                    <div className="text-xs text-white/70 mb-2">{level.difficulty}</div>

                    {/* Stars */}
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3].map(s => (
                        <span key={s} className={`text-lg ${s <= stars ? 'text-yellow-400' : 'text-slate-600'}`}>
                          ★
                        </span>
                      ))}
                    </div>

                    {/* XP Reward */}
                    <div className="mt-2 text-xs text-amber-400 font-bold">+{level.xpReward} XP</div>
                  </div>

                  {/* Completed Badge */}
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      ✔
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Progress Summary */}
          <div className="mt-6 sm:mt-8 max-w-md mx-auto">
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-700">
              <div className="flex justify-between items-center mb-3">
                <span className="text-slate-400 font-bold">Progress</span>
                <span className="text-white font-black">
                  {Object.values(levelProgress).filter(p => p?.completed).length} / {GAME_LEVELS.length}
                </span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                  style={{ width: `${(Object.values(levelProgress).filter(p => p?.completed).length / GAME_LEVELS.length) * 100}%` }}
                ></div>
              </div>
              <div className="mt-3 flex justify-between text-xs text-slate-500">
                <span>⭐ {Object.values(levelProgress).reduce((sum, p) => sum + (p?.stars || 0), 0)} total stars</span>
                <span>🏆 {Object.values(levelProgress).filter(p => p?.stars === 3).length} perfect</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Modal */}
        {showProfile && (
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-purple-500/50 rounded-3xl w-full max-w-lg shadow-2xl animate-bounce-in max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <span className="text-3xl">👤</span> My Profile
                </h2>
                <button onClick={() => setShowProfile(false)} className="p-2 hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-white">
                  <Icons.Close />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {user && userProfile ? (
                  <>
                    {/* Profile Header */}
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl font-black text-white">
                        {(userProfile.username || 'P')[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white">{userProfile.username}</h3>
                        <p className="text-purple-400">{userProfile.rank_title || 'Beginner'}</p>
                        <p className="text-slate-500 text-sm">{userProfile.email}</p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-purple-400">{userProfile.level || 1}</div>
                        <div className="text-xs text-slate-500 uppercase">Level</div>
                      </div>
                      <div className="bg-slate-800 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-amber-400">{userProfile.total_score?.toLocaleString() || 0}</div>
                        <div className="text-xs text-slate-500 uppercase">Total XP</div>
                      </div>
                      <div className="bg-slate-800 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-green-400">{userProfile.total_beats_created || 0}</div>
                        <div className="text-xs text-slate-500 uppercase">Beats Created</div>
                      </div>
                      <div className="bg-slate-800 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-cyan-400">{Object.values(levelProgress).filter(p => p?.completed).length}</div>
                        <div className="text-xs text-slate-500 uppercase">Levels Done</div>
                      </div>
                    </div>

                    {/* XP Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">XP to Next Level</span>
                        <span className="text-white font-bold">{(userProfile.experience_points || 0) % 1000} / 1000</span>
                      </div>
                      <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                          style={{ width: `${((userProfile.experience_points || 0) % 1000) / 10}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Streak */}
                    <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-500/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🔥</span>
                          <span className="text-white font-bold">Current Streak</span>
                        </div>
                        <div className="text-2xl font-black text-orange-400">{userProfile.current_streak || 0} days</div>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={() => handleLogout(true)}
                      className="w-full p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 font-bold hover:bg-red-500/30 transition-all"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">👤</div>
                    <h3 className="text-xl font-bold text-white mb-2">Not Logged In</h3>
                    <p className="text-slate-400 mb-6">Login to save your progress and compete on the leaderboard!</p>
                    <button
                      onClick={() => { setShowProfile(false); setShowAuthModal(true); }}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white"
                    >
                      Login / Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // LEVEL PLAY VIEW - Actual Gameplay
  // ==========================================
  if (view === 'levelPlay' && currentLevel) {
    const completion = checkLevelCompletion(currentLevel);

    return (
      <div className={`h-screen w-full flex flex-col overflow-hidden font-sans ${highContrastMode ? 'high-contrast' : ''} ${largeTextMode ? 'large-text' : ''}`}>
        <style>{cssStyles}</style>

        {/* Achievement Notification - Global */}
        <AchievementNotification />

        {/* Level Header */}
        <div className="bg-gradient-to-r from-purple-900 to-pink-900 px-4 py-3 landscape:py-1 flex items-center justify-between border-b border-white/10 shrink-0">
          <button
            onClick={() => {
              setIsPlaying(false);
              // Stop all scheduled audio immediately
              AudioEngine.stopAll();
              setView('levels');
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
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></div>
            <div className="flex items-center gap-2 relative z-10">
              <span className="text-lg filter drop-shadow">💡</span>
              <span className="tracking-wide text-sm">HINT</span>
            </div>
          </button>
        </div>

        {/* Level 1 Tutorial Overlay */}
        {/* Level 1 Tutorial Overlay */}
        {currentLevel.id === 1 && !tutorialActive && !levelComplete && showLevelTutorial && (
          <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
            <div className="bg-slate-900/95 border-2 border-cyan-500 rounded-3xl p-8 max-w-lg w-full shadow-2xl pointer-events-auto animate-bounce-in text-center relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 to-purple-500"></div>

              <div className="w-20 h-20 bg-cyan-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-cyan-400/30">
                <span className="text-4xl">👋</span>
              </div>

              <h2 className="text-3xl font-black text-white mb-3">Welcome to the Studio!</h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                You've got a <span className="text-cyan-400 font-bold">Rock Beat</span> started for you.
                <br /><br />
                Your goal is to <span className="text-white font-bold border-b-2 border-purple-500">finish the pattern</span>.
                <br />
                Look for the <span className="bg-slate-700 px-2 py-1 rounded text-sm text-slate-300">🔒 Gray Notes</span> - those are locked foundation blocks. Build around them!
              </p>

              <button
                onClick={() => {
                  setShowLevelTutorial(false);
                  localStorage.setItem('rhythmRealm_lvl1_tutorial_seen', 'true');
                }}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-2xl font-black text-xl text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
              >
                GOT IT, LET'S ROCK! 🤘
              </button>

              <button
                onClick={() => {
                  setShowLevelTutorial(false);
                  localStorage.setItem('rhythmRealm_lvl1_tutorial_seen', 'true');
                }}
                className="mt-4 text-slate-500 hover:text-slate-300 font-bold text-sm transition-colors"
              >
                Skip Tutorial
              </button>
            </div>
          </div>
        )}

        {/* Objective Banner */}
        <div className="bg-slate-800/80 px-4 py-3 landscape:py-1 text-center border-b border-slate-700 shrink-0">
          <div className="text-xs text-slate-400 uppercase tracking-wide mb-1 landscape:hidden">Objective</div>
          <div className="text-white font-bold landscape:text-sm">{currentLevel.objective}</div>

          {/* Requirements */}
          <div className="flex flex-wrap justify-center gap-2 mt-2 landscape:mt-0 landscape:gap-1">
            {Object.entries(currentLevel.requirements.mustInclude || {}).map(([inst, count]) => {
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

        {/* Grid Area - Scrollable */}
        <div className={`flex-1 overflow-auto p-4 landscape:p-1 custom-scrollbar transition-colors duration-700
          ${currentLevel.themeId === 'neon' ? 'bg-[#1a1c2e]' :
            currentLevel.themeId === 'sunset' ? 'bg-[#2c1a2e]' :
              currentLevel.themeId === 'ocean' ? 'bg-[#1a2c3a]' :
                currentLevel.themeId === 'golden' ? 'bg-[#2e261a]' :
                  currentLevel.themeId === 'forest' ? 'bg-[#1a2e22]' :
                    currentLevel.themeId === 'midnight' ? 'bg-[#0f1016]' : 'bg-[#1a1c2e]'}
        `}>
          {/* Top Ruler */}
          <div className="flex items-center gap-1 mb-2 sticky top-0 z-30 pt-2 pb-2 bg-[#131524] shadow-lg border-b border-white/5">
            <div className="w-16 sm:w-20 shrink-0 text-[10px] text-slate-500 font-bold text-center uppercase tracking-wider self-end pb-1">Instrument</div>
            <div className="flex-1 flex gap-0.5 relative">
              {/* Background for ruler */}
              <div className="absolute inset-x-0 bottom-0 h-6 bg-slate-800/50 rounded-sm"></div>

              {Array.from({ length: STEPS }).map((_, i) => {
                const isBarStart = i % 8 === 0;
                return (
                  <div key={i} className="flex-1 text-center relative h-8 flex flex-col justify-end">
                    {isBarStart && (
                      <div className="absolute -top-1 left-0 w-full text-center">
                        <span className="text-[10px] sm:text-xs font-black text-cyan-400 bg-[#131524] px-1.5 py-0.5 rounded-full border border-cyan-900 shadow-sm z-10 block mx-auto w-max transform -translate-y-1">
                          {Math.floor(i / 8) + 1}
                        </span>
                      </div>
                    )}
                    <div className={`mx-auto w-px transition-all duration-300 ${isBarStart
                      ? 'bg-cyan-600/50 h-full mt-1'
                      : i % 2 === 0
                        ? 'bg-slate-600 h-2 mb-1.5'
                        : 'bg-slate-700/30 h-1 mb-2'
                      }`}></div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            {Object.keys(SOUND_VARIANTS).filter(inst => activeInstrumentIds.includes(inst)).map((instKey) => {
              const settings = soundSettings[instKey] || { muted: false, volume: 80 };
              const isRequired = currentLevel.requirements.instruments?.includes(instKey);

              return (
                <div key={instKey} className={`flex items-center gap-1 ${isRequired ? 'ring-2 ring-purple-500/50 rounded-xl' : ''}`}>
                  <div className={`w-16 sm:w-20 text-xs font-black uppercase text-center py-2 rounded-l-xl ${isRequired ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                    {instKey}
                    {isRequired && <span className="ml-1 text-yellow-300">★</span>}
                  </div>
                  <div className="flex-1 flex gap-0.5">
                    {Array.from({ length: STEPS }).map((_, step) => {
                      const isActive = grid[instKey]?.[step];
                      const isBeat = step % 8 === 0;
                      // Check if this cell is part of the locked premade pattern
                      const isLocked = currentLevel.premadePattern?.[instKey]?.includes(step);

                      return (
                        <button
                          key={step}
                          onClick={() => {
                            // Prevent modifying locked cells
                            if (isLocked) return;

                            const newGrid = { ...grid };
                            if (!newGrid[instKey]) newGrid[instKey] = Array(STEPS).fill(false);
                            newGrid[instKey][step] = !newGrid[instKey][step];
                            setGrid(newGrid);

                            // Produce sound immediately for feedback
                            if (newGrid[instKey][step]) {
                              AudioEngine.init();
                              const settings = soundSettings[instKey] || {};
                              const variantIndex = typeof instrumentConfig[instKey] === 'number' ? instrumentConfig[instKey] : 0;
                              const sound = SOUND_VARIANTS[instKey]?.[variantIndex] || SOUND_VARIANTS[instKey]?.[0];
                              if (sound) AudioEngine.trigger(sound, 0, { volume: settings.volume || 80 });
                            }
                          }}
                          disabled={isLocked}
                          className={`
                            flex-1 h-8 sm:h-12 landscape:h-8 rounded-sm transition-all relative transform duration-100 ease-out
                            ${isActive
                              ? isLocked
                                ? 'bg-slate-600 border-b-4 border-slate-800 translate-y-1 shadow-inner cursor-not-allowed opacity-80' // Locked Pressed
                                : `${(INSTRUMENTS_DATA.find(i => i.id === instKey)?.color || 'bg-purple-500').replace('400', '500')} border-b-0 translate-y-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]` // Active Pressed - uses Instrument Color
                              : `${(INSTRUMENTS_DATA.find(i => i.id === instKey)?.color || 'bg-slate-700').replace('400', '900/30')} hover:bg-white/10 border-b-4 border-slate-900 shadow-md hover:-translate-y-0.5` // Inactive Unpressed
                            } 
                            ${currentStep === step && isPlaying ? 'ring-2 ring-cyan-400 z-10 brightness-125' : ''}
                            ${isBeat && !isActive ? 'bg-white/5 border-slate-800' : ''} 
                            ${isActive && !isLocked ? `shadow-[0_0_15px_rgba(255,255,255,0.3)]` : ''}
                          `}
                        >
                          {/* 3D Highlight Effect */}
                          {!isActive && <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 rounded-t-sm"></div>}
                          {isLocked && isActive && <span className="absolute inset-0 flex items-center justify-center text-[10px] opacity-50">🔒</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Playback Slider with Time Ruler */}
        <div className="bg-slate-900 px-4 pt-2 pb-1">
          <div className="flex items-center justify-between mb-1 text-xs font-bold text-slate-500">
            <span>PLAYBACK</span>
            <span className="font-mono text-cyan-400">
              BAR {Math.floor(currentStep / 8) + 1} <span className="text-slate-600">|</span> BEAT {Math.floor((currentStep % 8) / 2) + 1}
            </span>
          </div>
          <div
            className="relative h-8 bg-slate-800 rounded-lg cursor-pointer group mt-4 mb-2"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = Math.max(0, Math.min(1, x / rect.width));
              const newStep = Math.floor(percentage * STEPS);
              setCurrentStep(newStep);
              currentStepRef.current = newStep;
            }}
          >
            {/* Ruler Numbers & Ticks */}
            {[...Array(STEPS)].map((_, i) => {
              const isBar = i % 8 === 0;
              const isBeat = i % 2 === 0;
              return (
                <React.Fragment key={i}>
                  {/* Bar Number Label */}
                  {isBar && (
                    <div className="absolute -top-5 text-[10px] font-black text-slate-500" style={{ left: `${(i / STEPS) * 100}%` }}>
                      {Math.floor(i / 8) + 1}
                    </div>
                  )}

                  {/* Ticks */}
                  <div
                    className={`absolute top-0 w-px ${isBar ? 'h-full bg-white/40' :
                      isBeat ? 'h-1/2 top-1/4 bg-white/10' :
                        'hidden'
                      }`}
                    style={{ left: `${(i / STEPS) * 100}%` }}
                  ></div>
                </React.Fragment>
              );
            })}

            {/* Progress Fill */}
            <div className="absolute top-0 left-0 bottom-0 bg-cyan-900/40 pointer-events-none" style={{ width: `${(currentStep / STEPS) * 100}%` }}></div>

            {/* Playhead */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-75 pointer-events-none z-10" style={{ left: `${(currentStep / STEPS) * 100}%` }}>
              <div className="absolute -top-1.5 -left-[5px] w-3 h-3 rotate-45 border-2 border-cyan-400 bg-slate-900"></div>
            </div>
          </div>
        </div>

        {/* Control Bar */}
        <div className="bg-slate-900 border-t border-slate-700 px-4 py-3 flex items-center justify-center gap-4">
          <button
            onClick={() => {
              AudioEngine.init();
              if (!isPlaying) {
                trackFirstPlay();
              }
              setIsPlaying(!isPlaying);
            }}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl ${isPlaying ? 'bg-red-500 border-b-4 border-red-700' : 'bg-green-500 border-b-4 border-green-700'} text-white`}
          >
            {isPlaying ? <Icons.Stop /> : <Icons.Play />}
          </button>

          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400">Tempo</span>
            <span className="text-white font-bold">{tempo} BPM</span>
          </div>

          <button
            onClick={submitLevel}
            disabled={completion.score < 100}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${completion.score >= 100
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:scale-105'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
          >
            {completion.score >= 100 ? '✔ Submit' : 'Complete to Submit'}
          </button>
        </div>

        {/* Level Complete Modal */}
        {levelComplete && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-green-900 to-emerald-900 border-4 border-green-500 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-bounce-in">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-black text-white mb-2">Level Complete!</h2>
              <p className="text-green-300 mb-4">{currentLevel.name}</p>

              {/* Stars */}
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3].map(s => (
                  <span key={s} className={`text-4xl ${s <= checkLevelCompletion(currentLevel).stars ? 'text-yellow-400' : 'text-slate-600'}`}>
                    ★
                  </span>
                ))}
              </div>

              {/* Rewards */}
              <div className="bg-black/30 rounded-xl p-4 mb-6">
                <div className="text-amber-400 font-bold text-xl">+{currentLevel.xpReward} XP</div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setLevelComplete(false); setView('levels'); }}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold text-white transition-all"
                >
                  Back to Levels
                </button>
                <button
                  onClick={() => {
                    setLevelComplete(false);
                    // Go to next level if available
                    const nextLevel = GAME_LEVELS.find(l => l.id === currentLevel.id + 1);
                    if (nextLevel) {
                      const newGrid = {};
                      Object.keys(SOUND_VARIANTS).forEach(key => newGrid[key] = Array(STEPS).fill(false));
                      setGrid(newGrid);
                      setCurrentLevel(nextLevel);
                      setCurrentHintIndex(0);
                      setTempo(nextLevel.tempo);
                    } else {
                      setView('levels');
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white transition-all hover:scale-105"
                >
                  Next Level →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === 'modes') {
    return (
      <div className={`h-screen w-full text-white flex flex-col overflow-hidden font-sans relative ${highContrastMode ? 'high-contrast' : ''} ${largeTextMode ? 'large-text' : ''}`} role="main" aria-label="Game Modes">
        <style>{cssStyles}</style>
        <a href="#modes-content" className="skip-link" onFocus={() => speak('Skip to modes menu')}>Skip to modes</a>
        <VoiceControlIndicator />
        <PixelMusicBackground theme={currentTheme} />

        {/* Achievement Notification - Global */}
        <AchievementNotification />

        <div className="relative z-10 px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between border-b border-white/10 bg-black/30 backdrop-blur-sm">
          <button
            onClick={() => setView('splash')}
            className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl shadow-lg transition-all active:scale-95"
            onMouseEnter={() => speak(t('back') + " - " + t('home'))}
            onFocus={() => speak(t('back') + " - " + t('home'))}
            onMouseLeave={stopSpeaking}
            onBlur={stopSpeaking}
            aria-label={t('back') + " - " + t('home')}
          ><Icons.ChevronLeft /></button>
          <h2 className="text-xl sm:text-3xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent" aria-label={t('modes')}>🎮 {t('modes').toUpperCase()}</h2>
          <div className="w-10 sm:w-12"></div>
        </div>

        <div id="modes-content" className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4" role="navigation" aria-label="Mode selection">
          {/* Free Play Mode */}
          <button
            onClick={() => {
              setShowNewPlayerModal(true);
            }}
            className="w-full p-4 sm:p-6 bg-gradient-to-br from-violet-500/90 to-fuchsia-600/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl text-left border-b-8 border-fuchsia-700 active:border-b-0 active:translate-y-2 transition-all hover:scale-[1.02] shadow-2xl"
            onMouseEnter={() => speak(t('freePlay') + ". " + t('freePlayDesc'))}
            onFocus={() => speak(t('freePlay') + ". " + t('freePlayDesc'))}
            onMouseLeave={stopSpeaking}
            onBlur={stopSpeaking}
            aria-label={t('freePlay') + " - " + t('freePlayDesc')}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-4xl" aria-hidden="true">🎨</div>
              <div className="flex-1">
                <div className="text-lg sm:text-2xl font-black">{t('freePlay')}</div>
                <div className="text-xs sm:text-sm opacity-80 mt-1">{t('freePlayDesc')}</div>
              </div>
              <Icons.ChevronRight />
            </div>
          </button>

          {/* Tutorial Mode */}
          <button
            onClick={() => setView('tutorials')}
            className="w-full p-4 sm:p-6 bg-gradient-to-br from-blue-500/90 to-indigo-600/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl text-left border-b-8 border-indigo-700 active:border-b-0 active:translate-y-2 transition-all hover:scale-[1.02] shadow-2xl"
            onMouseEnter={() => speak(t('tutorial') + ". " + t('tutorialDesc'))}
            onFocus={() => speak(t('tutorial') + ". " + t('tutorialDesc'))}
            onMouseLeave={stopSpeaking}
            onBlur={stopSpeaking}
            aria-label={t('tutorial') + " - " + t('tutorialDesc')}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-4xl" aria-hidden="true">📚</div>
              <div className="flex-1">
                <div className="text-lg sm:text-2xl font-black">{t('tutorial')}</div>
                <div className="text-xs sm:text-sm opacity-80 mt-1">{t('tutorialDesc')}</div>
              </div>
              <Icons.ChevronRight />
            </div>
          </button>

          {/* Beat Library */}
          <button
            onClick={() => setView('library')}
            className="w-full p-4 sm:p-6 bg-gradient-to-br from-amber-500/90 to-orange-600/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl text-left border-b-8 border-orange-700 active:border-b-0 active:translate-y-2 transition-all hover:scale-[1.02] shadow-2xl"
            onMouseEnter={() => speak(t('beatLibrary') + ". " + t('beatLibraryDesc'))}
            onFocus={() => speak(t('beatLibrary') + ". " + t('beatLibraryDesc'))}
            onMouseLeave={stopSpeaking}
            onBlur={stopSpeaking}
            aria-label={t('beatLibrary') + " - " + t('beatLibraryDesc')}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-4xl" aria-hidden="true">🎵</div>
              <div className="flex-1">
                <div className="text-lg sm:text-2xl font-black">{t('beatLibrary')}</div>
                <div className="text-xs sm:text-sm opacity-80 mt-1">{t('beatLibraryDesc')}</div>
              </div>
              <Icons.ChevronRight />
            </div>
          </button>

          {/* DJ Mode */}
          <button
            onClick={() => {
              AudioEngine.init();
              setPreviousView('modes');
              setView('djmode');
              // Track DJ mode usage for achievement
              setUserStats(prev => ({ ...prev, usedDJMode: true }));
            }}
            className="w-full p-4 sm:p-6 bg-gradient-to-br from-emerald-500/90 to-teal-600/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl text-left border-b-8 border-teal-700 active:border-b-0 active:translate-y-2 transition-all hover:scale-[1.02] shadow-2xl"
            onMouseEnter={() => speak(t('djMode') + ". " + t('djModeDesc'))}
            onFocus={() => speak(t('djMode') + ". " + t('djModeDesc'))}
            onMouseLeave={stopSpeaking}
            onBlur={stopSpeaking}
            aria-label={t('djMode') + " - " + t('djModeDesc')}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-4xl" aria-hidden="true">🎧</div>
              <div className="flex-1">
                <div className="text-lg sm:text-2xl font-black">{t('djMode')}</div>
                <div className="text-xs sm:text-sm opacity-80 mt-1">{t('djModeDesc')}</div>
              </div>
              <Icons.ChevronRight />
            </div>
          </button>
        </div>

        {/* New Player Modal */}
        {showNewPlayerModal && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="new-player-title">
            <div className="bg-gradient-to-br from-violet-900 to-fuchsia-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-white/20 animate-bounce-in">
              <div className="text-center mb-6">
                <div className="text-5xl sm:text-6xl mb-4" aria-hidden="true">🎵</div>
                <h2 id="new-player-title" className="text-2xl sm:text-3xl font-black text-white mb-2">Welcome to Free Play!</h2>
                <p className="text-white/70 text-sm sm:text-base">Are you new to making beats?</p>
              </div>

              <div className="space-y-3">
                {/* New Player - Interactive Tutorial in Studio */}
                <button
                  onClick={() => {
                    AudioEngine.init();
                    const newGrid = {};
                    Object.keys(SOUND_VARIANTS).forEach(key => newGrid[key] = Array(STEPS).fill(false));
                    setGrid(newGrid);
                    setCurrentScenario(DEFAULT_SCENARIO);
                    setTutorialActive(false);
                    setActiveGuide(null);
                    setPreviousView('modes');
                    setShowNewPlayerModal(false);
                    setShowOnboarding(true);
                    setOnboardingStep(0);
                    setView('studio');
                  }}
                  className="w-full p-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl text-white font-bold text-lg hover:scale-[1.02] transition-all border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-3"
                >
                  <span className="text-2xl">✔️</span>
                  <div className="text-left">
                    <div className="font-black">Yes, Show Me How!</div>
                    <div className="text-xs opacity-80">Interactive guide in the studio</div>
                  </div>
                </button>

                {/* Genre Tutorials */}
                <button
                  onClick={() => {
                    setShowNewPlayerModal(false);
                    setView('tutorials');
                  }}
                  className="w-full p-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl text-white font-bold text-lg hover:scale-[1.02] transition-all border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-3"
                >
                  <span className="text-2xl">🎶</span>
                  <div className="text-left">
                    <div className="font-black">Learn Music Genres</div>
                    <div className="text-xs opacity-80">Step-by-step genre tutorials</div>
                  </div>
                </button>

                {/* Experienced - Go to Studio */}
                <button
                  onClick={() => {
                    AudioEngine.init();
                    const newGrid = {};
                    Object.keys(SOUND_VARIANTS).forEach(key => newGrid[key] = Array(STEPS).fill(false));
                    setGrid(newGrid);
                    setCurrentScenario(DEFAULT_SCENARIO);
                    setTutorialActive(false);
                    setActiveGuide(null);
                    setPreviousView('modes');
                    setShowNewPlayerModal(false);
                    setView('studio');
                  }}
                  className="w-full p-4 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-2xl text-white font-bold text-lg hover:scale-[1.02] transition-all border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-3"
                >
                  <span className="text-2xl">🎨</span>
                  <div className="text-left">
                    <div className="font-black">I Know What I'm Doing!</div>
                    <div className="text-xs opacity-80">Jump straight into Free Play</div>
                  </div>
                </button>

                {/* Cancel */}
                <button
                  onClick={() => setShowNewPlayerModal(false)}
                  className="w-full p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white/70 font-bold text-sm transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === 'tutorials') {
    const THEMED_TUTORIALS = [
      {
        name: "🎵 Basics: Happy Beat",
        icon: "🎵",
        desc: "Learn the FUNDAMENTALS - kick, snare, hi-hat, bass. Perfect for beginners!",
        theme: "from-yellow-400 to-orange-500",
        borderColor: "border-orange-600",
        scenarioIndex: 0,
        difficulty: "Beginner",
        concepts: ["Four-on-the-floor", "Backbeat", "Eighth notes"],
      },
      {
        name: "🌙 Lo-Fi & Chill",
        icon: "🌙",
        desc: "Master the art of SPACE and GROOVE. Less is more!",
        theme: "from-slate-500 to-indigo-600",
        borderColor: "border-indigo-700",
        scenarioIndex: 1,
        difficulty: "Beginner",
        concepts: ["Swing feel", "Sparse patterns", "Chord pads"],
      },
      {
        name: "🏠 House Music 101",
        icon: "💿",
        desc: "The classic FOUR-ON-THE-FLOOR and offbeat hi-hats!",
        theme: "from-pink-500 to-purple-600",
        borderColor: "border-purple-700",
        scenarioIndex: 2,
        difficulty: "Beginner",
        concepts: ["Four-on-the-floor", "Offbeat hi-hats", "Synth stabs"],
      },
      {
        name: "🌍 World: Afrobeat",
        icon: "🪘",
        desc: "Learn POLYRHYTHM - multiple rhythms playing together!",
        theme: "from-orange-500 to-red-600",
        borderColor: "border-red-700",
        scenarioIndex: 3,
        difficulty: "Intermediate",
        concepts: ["Syncopation", "Polyrhythm", "World rhythms"],
      },
      {
        name: "🚀 Drum & Bass",
        icon: "⚡",
        desc: "Fast, intense, rolling breaks and heavy bass!",
        theme: "from-indigo-500 to-violet-600",
        borderColor: "border-violet-700",
        scenarioIndex: 4,
        difficulty: "Intermediate",
        concepts: ["Two-step pattern", "Snare rolls", "Rolling bass"],
      },
      {
        name: "👑 Trap Beats",
        icon: "🔥",
        desc: "Hi-hat rolls, heavy 808s, and that BOUNCE!",
        theme: "from-red-600 to-red-900",
        borderColor: "border-red-800",
        scenarioIndex: 5,
        difficulty: "Intermediate",
        concepts: ["Hi-hat rolls", "808 bass", "Sparse kicks"],
      },
      {
        name: "🔥 Reggaeton Dembow",
        icon: "💿",
        desc: "The DEMBOW rhythm that powers Latin hits!",
        theme: "from-yellow-500 to-orange-600",
        borderColor: "border-orange-700",
        scenarioIndex: 6,
        difficulty: "Intermediate",
        concepts: ["Dembow pattern", "Latin rhythm", "Dance groove"],
      },
      {
        name: "🎤 Hip Hop Boom Bap",
        icon: "🎧",
        desc: "Classic hip hop - BOOM (kick) BAP (snare)!",
        theme: "from-amber-600 to-stone-700",
        borderColor: "border-stone-700",
        scenarioIndex: 7,
        difficulty: "Beginner",
        concepts: ["Boom bap", "Swing", "Head-nodding groove"],
      },
      {
        name: "🎸 Rock Drumming",
        icon: "🤘",
        desc: "Simple, powerful, driving ROCK beat!",
        theme: "from-gray-600 to-red-800",
        borderColor: "border-red-900",
        scenarioIndex: 8,
        difficulty: "Beginner",
        concepts: ["Backbeat", "Tom fills", "Steady rhythm"],
      },
      {
        name: "🤖 Techno Hypnosis",
        icon: "🔊",
        desc: "Minimal, hypnotic, REPETITIVE trance state!",
        theme: "from-cyan-500 to-gray-800",
        borderColor: "border-gray-800",
        scenarioIndex: 9,
        difficulty: "Intermediate",
        concepts: ["Minimalism", "Repetition", "Trance rhythm"],
      },
    ];

    return (
      <div className="h-screen w-full text-white flex flex-col overflow-hidden font-sans relative">
        <style>{cssStyles}</style>
        <PixelMusicBackground theme={currentTheme} />
        <div className="relative z-10 px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between border-b border-white/10 bg-black/30 backdrop-blur-sm">
          <button onClick={() => setView('modes')} className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl shadow-lg transition-all active:scale-95"><Icons.ChevronLeft /></button>
          <h2 className="text-xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">📚 TUTORIALS</h2>
          <div className="w-10 sm:w-12"></div>
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-cyan-300/80 text-sm sm:text-lg font-medium">Learn different music styles step by step!</p>
            <p className="text-white/50 text-xs sm:text-sm mt-1">Each tutorial teaches you real music concepts 🎶</p>
          </div>

          {/* Difficulty Legend */}
          <div className="flex justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <span className="text-[10px] sm:text-xs bg-green-500/20 text-green-400 px-2 sm:px-3 py-1 rounded-full">🟢 Beginner</span>
            <span className="text-[10px] sm:text-xs bg-yellow-500/20 text-yellow-400 px-2 sm:px-3 py-1 rounded-full">🟡 Intermediate</span>
          </div>

          {THEMED_TUTORIALS.map((tutorial, index) => {
            const scenario = SCENARIOS[tutorial.scenarioIndex];

            const handleTutorialSelect = () => {
              console.log('Tutorial clicked:', tutorial.name, 'scenarioIndex:', tutorial.scenarioIndex);
              AudioEngine.init();

              const selectedScenario = SCENARIOS[tutorial.scenarioIndex];
              console.log('Selected scenario:', selectedScenario);

              // Clear the grid for step-by-step learning
              const newGrid = {};
              Object.keys(SOUND_VARIANTS).forEach(key => newGrid[key] = Array(STEPS).fill(false));

              // Get all instruments used in the tutorial
              const tutorialInstruments = selectedScenario.tutorial
                .filter(step => step.targetInstrument)
                .map(step => step.targetInstrument);
              const uniqueInstruments = [...new Set(tutorialInstruments)];
              console.log('Instruments:', uniqueInstruments);

              // Update all states
              setGrid(newGrid);
              setCurrentScenario(selectedScenario);
              setTempo(selectedScenario.bpm);
              setIsPlaying(false);
              setActiveInstrumentIds(uniqueInstruments);
              setTutorialActive(true);
              setTutorialStep(0);
              setActiveGuide(null);
              setLockedInstruments({});
              setPreviousView('tutorials');
              setView('studio');
            };

            return (
              <button
                key={tutorial.name}
                onClick={handleTutorialSelect}
                className={`w-full p-3 sm:p-5 bg-gradient-to-br ${tutorial.theme} backdrop-blur-sm rounded-2xl sm:rounded-3xl text-left border-b-6 ${tutorial.borderColor} active:border-b-0 active:translate-y-1 transition-all hover:scale-[1.01] shadow-xl`}
              >
                <div className="flex items-start gap-2 sm:gap-4">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-3xl shrink-0">{tutorial.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <div className="text-sm sm:text-xl font-black">{tutorial.name}</div>
                      <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold ${tutorial.difficulty === 'Beginner' ? 'bg-green-500/50 text-green-100' : 'bg-yellow-500/50 text-yellow-100'}`}>
                        {tutorial.difficulty === 'Beginner' ? '🟢' : '🟡'} {tutorial.difficulty}
                      </span>
                    </div>
                    <div className="text-sm opacity-90 mt-1">{tutorial.desc}</div>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      <span className="inline-block bg-black/20 px-2 py-1 rounded-lg text-xs font-bold">
                        📝 {scenario.tutorial?.length || 5} Steps
                      </span>
                      <span className="inline-block bg-black/20 px-2 py-1 rounded-lg text-xs font-bold">
                        🎵 {scenario.bpm} BPM
                      </span>
                    </div>
                    <div className="mt-2 flex gap-1 flex-wrap">
                      {tutorial.concepts.map((concept, i) => (
                        <span key={i} className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{concept}</span>
                      ))}
                    </div>
                  </div>
                  <Icons.ChevronRight />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === 'library') {
    return (
      <div className="h-screen w-full text-white flex flex-col overflow-hidden font-sans relative">
        <style>{cssStyles}</style>
        <PixelMusicBackground theme={currentTheme} />

        {/* Achievement Notification */}
        <AchievementNotification />

        <div className="relative z-10 px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between border-b border-white/10 bg-black/30 backdrop-blur-sm">
          <button onClick={() => setView('modes')} className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl shadow-lg transition-all active:scale-95"><Icons.ChevronLeft /></button>
          <h2 className="text-xl sm:text-3xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">🎵 BEAT LIBRARY</h2>
          <div className="w-10 sm:w-12"></div>
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-4">
          {BEAT_GUIDES.map((guide, index) => (
            <button
              key={guide.name}
              onClick={() => {
                AudioEngine.init();
                // Load the beat pattern into the grid
                const newGrid = {};
                Object.keys(SOUND_VARIANTS).forEach(key => {
                  newGrid[key] = Array(STEPS).fill(false);
                  if (guide.pattern[key]) {
                    guide.pattern[key].forEach(step => {
                      newGrid[key][step] = true;
                    });
                  }
                });
                setGrid(newGrid);
                // Make sure required instruments are active
                const requiredInsts = Object.keys(guide.pattern).filter(k => guide.pattern[k].length > 0);
                setActiveInstrumentIds(prev => {
                  const newSet = new Set([...prev, ...requiredInsts]);
                  return Array.from(newSet);
                });
                // Clear guide/tutorial locks so user can edit freely
                setActiveGuide(null);
                setTutorialActive(false);
                setCurrentScenario(SCENARIOS[1]);
                setPreviousView('library');
                setView('studio');
              }}
              className="w-full p-5 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl text-left flex items-center gap-4 transition-all border border-white/10 hover:border-white/30 hover:scale-[1.01]"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="text-xl font-black">{guide.name}</div>
                <div className="text-sm opacity-70 mt-1">{guide.desc}</div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {Object.keys(guide.pattern).filter(k => guide.pattern[k].length > 0).map(inst => (
                    <span key={inst} className="text-xs bg-white/20 px-2 py-1 rounded-full capitalize">{inst}</span>
                  ))}
                </div>
              </div>
              <Icons.ChevronRight />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'settings') {
    return (
      <div className="h-screen w-full text-white flex flex-col overflow-hidden font-sans relative">
        <style>{cssStyles}</style>
        <PixelMusicBackground theme={currentTheme} />

        {/* Achievement Notification */}
        <AchievementNotification />

        <div className="relative z-10 px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between border-b border-white/10 bg-black/30 backdrop-blur-sm">
          <button onClick={() => setView('splash')} className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl shadow-lg transition-all active:scale-95" aria-label={t('back')}><Icons.ChevronLeft /></button>
          <h2 className="text-xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">⚙️ {t('settings').toUpperCase()}</h2>
          <div className="w-10 sm:w-12"></div>
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6">
          {/* Volume Control */}
          <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-black mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">🔊</span>
              {t('masterVolume')}
            </h3>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="70"
              className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Background Music Toggle */}
          <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-black mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center">🎵</span>
              {t('backgroundMusic')}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-white/80">Ambient music on menus</span>
              <button
                onClick={() => setBgMusicEnabled(!bgMusicEnabled)}
                className={`w-16 h-8 rounded-full transition-all duration-300 ${bgMusicEnabled ? 'bg-gradient-to-r from-cyan-400 to-purple-500' : 'bg-white/20'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${bgMusicEnabled ? 'translate-x-9' : 'translate-x-1'}`}></div>
              </button>
            </div>
            <p className="text-xs text-white/50 mt-2">Music automatically stops during beat creation and tutorials</p>
          </div>

          {/* Visual Themes */}
          <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-black mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center">🎨</span>
              {t('visualThemes')}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {VISUAL_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setCurrentTheme(theme)}
                  className={`p-3 rounded-2xl bg-gradient-to-br ${theme.primary} hover:scale-105 transition-all flex flex-col items-center gap-2 ${currentTheme.id === theme.id ? 'ring-4 ring-white shadow-lg scale-105' : 'opacity-70 hover:opacity-100'}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    {theme.id === 'ocean' && '🌊'}
                    {theme.id === 'sunset' && '🌦'}
                    {theme.id === 'golden' && '✨'}
                    {theme.id === 'forest' && '🌲'}
                    {theme.id === 'neon' && '🎧'}
                    {theme.id === 'midnight' && '🌙'}
                  </div>
                  <span className="text-xs font-bold">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-3xl p-6 border-2 border-yellow-500/50">
            <h3 className="text-xl font-black mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">♿</span>
              {t('accessibility')}
            </h3>
            <p className="text-sm text-white/70 mb-4">Make the app easier to use for everyone</p>

            <div className="space-y-4">
              {/* Text-to-Speech */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔊</span>
                  <div>
                    <div className="font-bold">{t('textToSpeech')}</div>
                    <div className="text-xs opacity-70">{t('textToSpeechDesc')}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setTextToSpeechEnabled(!textToSpeechEnabled);
                    if (!textToSpeechEnabled) {
                      const utterance = new SpeechSynthesisUtterance('Text to speech enabled. Hover over buttons to hear descriptions.');
                      window.speechSynthesis.speak(utterance);
                    }
                  }}
                  aria-label={textToSpeechEnabled ? 'Disable text to speech' : 'Enable text to speech'}
                  className={`w-16 h-8 rounded-full transition-all duration-300 ${textToSpeechEnabled ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-white/20'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${textToSpeechEnabled ? 'translate-x-9' : 'translate-x-1'}`}></div>
                </button>
              </div>

              {/* High Contrast Mode */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔆</span>
                  <div>
                    <div className="font-bold">{t('highContrast')}</div>
                    <div className="text-xs opacity-70">{t('highContrastDesc')}</div>
                  </div>
                </div>
                <button
                  onClick={() => setHighContrastMode(!highContrastMode)}
                  aria-label={highContrastMode ? 'Disable high contrast mode' : 'Enable high contrast mode'}
                  className={`w-16 h-8 rounded-full transition-all duration-300 ${highContrastMode ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-white/20'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${highContrastMode ? 'translate-x-9' : 'translate-x-1'}`}></div>
                </button>
              </div>

              {/* Large Text Mode */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔤</span>
                  <div>
                    <div className="font-bold">{t('largeText')}</div>
                    <div className="text-xs opacity-70">{t('largeTextDesc')}</div>
                  </div>
                </div>
                <button
                  onClick={() => setLargeTextMode(!largeTextMode)}
                  aria-label={largeTextMode ? 'Disable large text mode' : 'Enable large text mode'}
                  className={`w-16 h-8 rounded-full transition-all duration-300 ${largeTextMode ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-white/20'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${largeTextMode ? 'translate-x-9' : 'translate-x-1'}`}></div>
                </button>
              </div>

              {/* Keyboard Navigation */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⌨️</span>
                  <div>
                    <div className="font-bold">{t('keyboardNav')}</div>
                    <div className="text-xs opacity-70">{t('keyboardNavDesc')}</div>
                  </div>
                </div>
                <button
                  onClick={() => setKeyboardNavMode(!keyboardNavMode)}
                  aria-label={keyboardNavMode ? 'Disable keyboard navigation mode' : 'Enable keyboard navigation mode'}
                  className={`w-16 h-8 rounded-full transition-all duration-300 ${keyboardNavMode ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-white/20'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${keyboardNavMode ? 'translate-x-9' : 'translate-x-1'}`}></div>
                </button>
              </div>

              {/* Voice Control - Hands Free */}
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-400/30">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎙️</span>
                  <div>
                    <div className="font-bold">{t('voiceControl')}</div>
                    <div className="text-xs opacity-70">{t('voiceControlDesc')}</div>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    if (!voiceControlEnabled) {
                      // Request microphone permission first
                      try {
                        await navigator.mediaDevices.getUserMedia({ audio: true });
                        setVoiceControlEnabled(true);
                        const utterance = new SpeechSynthesisUtterance('Microphone enabled. Voice control is now active. Say help to hear available commands.');
                        window.speechSynthesis.speak(utterance);
                      } catch (err) {
                        const utterance = new SpeechSynthesisUtterance('Microphone access denied. Please allow microphone access in your browser to use voice control.');
                        window.speechSynthesis.speak(utterance);
                        alert('🎙️ Microphone access required!\n\nPlease allow microphone access in your browser to use voice control.\n\nClick the microphone icon in your browser\'s address bar to enable it.');
                      }
                    } else {
                      setVoiceControlEnabled(false);
                    }
                  }}
                  aria-label={voiceControlEnabled ? 'Disable voice control' : 'Enable voice control for hands-free use'}
                  className={`w-16 h-8 rounded-full transition-all duration-300 ${voiceControlEnabled ? 'bg-gradient-to-r from-purple-400 to-pink-500' : 'bg-white/20'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${voiceControlEnabled ? 'translate-x-9' : 'translate-x-1'}`}></div>
                </button>
              </div>

              {/* Voice Control Status & Commands */}
              {voiceControlEnabled && (
                <div className="p-4 bg-purple-500/20 rounded-2xl border border-purple-400/30">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                    <span className="font-bold text-sm">{isListening ? '🎤 Listening...' : '🔇 Not listening'}</span>
                  </div>
                  {lastVoiceCommand && (
                    <div className="text-xs opacity-70 mb-3">Last command: "{lastVoiceCommand}"</div>
                  )}
                  <div className="text-xs opacity-80">
                    <div className="font-bold mb-2">🗣️ Say these commands:</div>
                    <div className="grid grid-cols-2 gap-1">
                      <span>• "Play" / "Stop"</span>
                      <span>• "Go home"</span>
                      <span>• "DJ mode"</span>
                      <span>• "Free play"</span>
                      <span>• "Faster" / "Slower"</span>
                      <span>• "Clear"</span>
                      <span>• "Go back"</span>
                      <span>• "Help"</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Language Selector */}
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-400/30">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🌐</span>
                  <div>
                    <div className="font-bold">{t('language')}</div>
                    <div className="text-xs opacity-70">{t('languageDesc')}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(LANGUAGES).map(([code, lang]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setCurrentLanguage(code);
                        localStorage.setItem('rhythmRealm_language', code);
                        if (textToSpeechEnabled) {
                          const utterance = new SpeechSynthesisUtterance(`Language changed to ${lang.name}`);
                          utterance.lang = lang.code;
                          window.speechSynthesis.speak(utterance);
                        }
                      }}
                      className={`p-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${currentLanguage === code
                        ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-black'
                        : 'bg-white/10 hover:bg-white/20'
                        }`}
                      aria-label={`Change language to ${lang.name}`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enable All Accessibility */}
              <button
                onClick={() => {
                  const enableAll = !accessibilityMode;
                  setAccessibilityMode(enableAll);
                  setTextToSpeechEnabled(enableAll);
                  setHighContrastMode(enableAll);
                  setLargeTextMode(enableAll);
                  setKeyboardNavMode(enableAll);
                  setVoiceControlEnabled(enableAll);
                  if (enableAll) {
                    const utterance = new SpeechSynthesisUtterance('All accessibility features enabled including voice control. Say help to hear voice commands.');
                    window.speechSynthesis.speak(utterance);
                  }
                }}
                className={`w-full p-4 rounded-2xl font-bold text-lg transition-all ${accessibilityMode ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-black' : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400'}`}
                aria-label={accessibilityMode ? 'Disable all accessibility features' : 'Enable all accessibility features'}
              >
                {accessibilityMode ? `✔ ${t('allEnabled')}` : `☑️ ${t('enableAll')}`}
              </button>

              {/* Screen Reader Info */}
              <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-400/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">💡</span>
                  <span className="font-bold text-sm">Screen Reader Tips</span>
                </div>
                <ul className="text-xs opacity-80 space-y-1 ml-6">
                  <li>• Use Tab to navigate between buttons</li>
                  <li>• Press Enter or Space to activate</li>
                  <li>• Arrow keys work in grid areas</li>
                  <li>• Escape closes popups and modals</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sound Packs */}
          <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-black mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">🎵</span>
              Sound Packs
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => applySoundPack('classic')}
                className={`w-full p-4 rounded-2xl text-left flex items-center gap-4 transition-all ${activeSoundPack === 'classic' ? 'bg-indigo-500/20 border-2 border-indigo-400 shadow-lg shadow-indigo-500/20' : 'bg-white/10 hover:bg-white/20 border border-white/10'}`}
              >
                <span className="text-2xl">🥁 </span>
                <div className="flex-1">
                  <div className={`font-bold ${activeSoundPack === 'classic' ? 'text-white' : 'text-slate-300'}`}>Classic Kit</div>
                  <div className="text-xs opacity-60">Acoustic drums & piano</div>
                </div>
                {activeSoundPack === 'classic' && <span className="text-indigo-400 font-bold text-xs bg-indigo-500/20 px-2 py-1 rounded-lg">ACTIVE</span>}
              </button>

              <button
                onClick={() => applySoundPack('electronic')}
                className={`w-full p-4 rounded-2xl text-left flex items-center gap-4 transition-all ${activeSoundPack === 'electronic' ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-lg shadow-cyan-500/20' : 'bg-white/10 hover:bg-white/20 border border-white/10'}`}
              >
                <span className="text-2xl">🎹</span>
                <div className="flex-1">
                  <div className={`font-bold ${activeSoundPack === 'electronic' ? 'text-white' : 'text-slate-300'}`}>Electronic</div>
                  <div className="text-xs opacity-60">Synth, 808s & Trap</div>
                </div>
                {activeSoundPack === 'electronic' && <span className="text-cyan-400 font-bold text-xs bg-cyan-500/20 px-2 py-1 rounded-lg">ACTIVE</span>}
              </button>

              <button
                onClick={() => applySoundPack('rock')}
                className={`w-full p-4 rounded-2xl text-left flex items-center gap-4 transition-all ${activeSoundPack === 'rock' ? 'bg-red-500/20 border-2 border-red-400 shadow-lg shadow-red-500/20' : 'bg-white/10 hover:bg-white/20 border border-white/10'}`}
              >
                <span className="text-2xl">🎸</span>
                <div className="flex-1">
                  <div className={`font-bold ${activeSoundPack === 'rock' ? 'text-white' : 'text-slate-300'}`}>Rock Band</div>
                  <div className="text-xs opacity-60">Punchy drums & organ</div>
                </div>
                {activeSoundPack === 'rock' && <span className="text-red-400 font-bold text-xs bg-red-500/20 px-2 py-1 rounded-lg">ACTIVE</span>}
              </button>
            </div>
          </div>

          {/* App Info */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
            <h3 className="text-xl font-black mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl flex items-center justify-center">ℹ️</span>
              {t('about')}
            </h3>
            <div className="space-y-2 text-sm opacity-80">
              <p><strong>{t('appTitle')}</strong> v1.0.0</p>
              <p>A creative music-making experience</p>
              <p className="text-xs opacity-60 mt-4">Made with ❤️ using React & Web Audio API</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- DJ MODE VIEW ---
  if (view === 'djmode') {
    // DJ Mode Preloaded Beats - Basic Patterns
    const DJ_BEATS = [
      { id: 'house', name: 'House', icon: '🏠', bpm: 128, pattern: { kick: [0, 4, 8, 12, 16, 20, 24, 28], snare: [4, 12, 20, 28], hihat: [2, 6, 10, 14, 18, 22, 26, 30] } },
      { id: 'hiphop', name: 'Hip Hop', icon: '🎤', bpm: 90, pattern: { kick: [0, 10, 16, 26], snare: [4, 12, 20, 28], hihat: [0, 4, 8, 12, 16, 20, 24, 28] } },
      { id: 'trap', name: 'Trap', icon: '👑', bpm: 140, pattern: { kick: [0, 14, 16, 30], snare: [4, 12, 20, 28], hihat: [0, 2, 4, 5, 6, 8, 10, 12, 13, 14, 16, 18, 20, 21, 22, 24, 26, 28, 29, 30] } },
      { id: 'techno', name: 'Techno', icon: '🤖', bpm: 130, pattern: { kick: [0, 4, 8, 12, 16, 20, 24, 28], snare: [4, 12, 20, 28], hihat: [2, 6, 10, 14, 18, 22, 26, 30] } },
      { id: 'reggaeton', name: 'Reggaeton', icon: '🔥', bpm: 95, pattern: { kick: [0, 6, 16, 22], snare: [4, 10, 12, 20, 26, 28], hihat: [0, 4, 8, 12, 16, 20, 24, 28] } },
      { id: 'dnb', name: 'Drum & Bass', icon: '⚡', bpm: 170, pattern: { kick: [0, 12, 14, 16, 28, 30], snare: [8, 24], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30] } },
      { id: 'lofi', name: 'Lo-Fi', icon: '🌙', bpm: 80, pattern: { kick: [0, 10, 16, 26], snare: [4, 20], hihat: [0, 4, 8, 12, 16, 20, 24, 28] } },
      { id: 'rock', name: 'Rock', icon: '🎸', bpm: 120, pattern: { kick: [0, 8, 16, 24], snare: [4, 12, 20, 28], hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30] } },
    ];

    // TRENDING MUSIC PRESETS - Full song patterns with multiple instruments
    const DJ_TRACKS = [
      {
        id: 'blinding_lights',
        name: 'Blinding Lights',
        artist: 'The Weeknd Style',
        icon: '🌟',
        bpm: 171,
        genre: 'Synthwave Pop',
        color: 'from-purple-500 to-pink-500',
        // Signature 80s synth-wave with driving beat, arpeggiated synth, punchy snare
        pattern: {
          kick: [0, 4, 8, 12, 16, 20, 24, 28], // Four-on-the-floor driving beat
          snare: [4, 12, 20, 28], // Gated reverb snare on 2 & 4
          hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], // Constant 8th notes
          synth: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], // Signature synth arpeggio running throughout
          bass: [0, 0, 8, 8, 16, 16, 24, 24], // Pulsing octave bass pattern
          keys: [0, 6, 8, 14, 16, 22, 24, 30] // Synth stabs on offbeats
        }
      },
      {
        id: 'bad_guy',
        name: 'Bad Guy',
        artist: 'Billie Eilish Style',
        icon: '😈',
        bpm: 135,
        genre: 'Dark Pop',
        color: 'from-green-400 to-emerald-600',
        // Minimalist, bass-heavy with sparse percussion, signature bouncy bass
        pattern: {
          kick: [0, 3, 8, 11, 16, 19, 24, 27], // Syncopated kick matching the "duh" pattern
          snare: [6, 14, 22, 30], // Offbeat finger snaps
          hihat: [], // Very minimal - the song has almost no hi-hats
          bass: [0, 3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31], // Heavy bouncing bass riff
          synth: [0, 8, 16, 24], // Sparse synth hits
          perc: [2, 6, 10, 14, 18, 22, 26, 30] // Mouth clicks/percussion
        }
      },
      {
        id: 'industry_baby',
        name: 'Industry Baby',
        artist: 'Lil Nas X Style',
        icon: '🏆',
        bpm: 150,
        genre: 'Hip Hop Pop',
        color: 'from-yellow-400 to-orange-500',
        // Marching band inspired with brass hits, hard-hitting trap drums
        pattern: {
          kick: [0, 6, 8, 12, 16, 22, 24, 28], // Trap-style kick with variations
          snare: [4, 12, 20, 28], // Hard snare on 2 & 4
          hihat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], // Rapid hi-hat rolls
          bass: [0, 0, 6, 8, 8, 14, 16, 16, 22, 24, 24, 30], // Sliding 808 bass
          synth: [0, 4, 8, 12, 16, 20, 24, 28], // Brass section stabs
          perc: [4, 5, 12, 13, 20, 21, 28, 29] // Marching snare rolls
        }
      },
      {
        id: 'stay',
        name: 'Stay',
        artist: 'Kid Laroi Style',
        icon: '💖',
        bpm: 170,
        genre: 'Pop/EDM',
        color: 'from-red-400 to-rose-600',
        // High energy with guitar riff, emotional synths, driving drums
        pattern: {
          kick: [0, 4, 8, 12, 16, 20, 24, 28], // Straight four-on-the-floor
          snare: [4, 12, 20, 28], // Punchy snare
          hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], // Driving 8th notes
          synth: [0, 1, 4, 5, 8, 9, 12, 13, 16, 17, 20, 21, 24, 25, 28, 29], // Emotional synth chords pulsing
          bass: [0, 4, 8, 12, 16, 20, 24, 28], // Following the kick
          keys: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30] // Guitar-like strumming pattern
        }
      },
      {
        id: 'heat_waves',
        name: 'Heat Waves',
        artist: 'Glass Animals Style',
        icon: '🌊',
        bpm: 81,
        genre: 'Indie Pop',
        color: 'from-orange-400 to-amber-600',
        // Dreamy, wavy synths, relaxed groove with psychedelic feel
        pattern: {
          kick: [0, 6, 8, 14, 16, 22, 24, 30], // Laid-back syncopated kick
          snare: [8, 24], // Sparse snare on 3 only
          hihat: [4, 12, 20, 28], // Minimal closed hi-hat
          synth: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], // Dreamy wavering synth
          bass: [0, 3, 8, 11, 16, 19, 24, 27], // Groovy bass line
          keys: [0, 8, 16, 24], // Warm pad chords
          perc: [2, 6, 10, 14, 18, 22, 26, 30] // Shaker pattern
        }
      },
      {
        id: 'levitating',
        name: 'Levitating',
        artist: 'Dua Lipa Style',
        icon: '🚀',
        bpm: 103,
        genre: 'Disco Pop',
        color: 'from-violet-400 to-purple-600',
        // Nu-disco with funky bass, four-on-the-floor, string stabs
        pattern: {
          kick: [0, 4, 8, 12, 16, 20, 24, 28], // Classic disco four-on-the-floor
          snare: [4, 12, 20, 28], // Crisp snare
          hihat: [2, 6, 10, 14, 18, 22, 26, 30], // Offbeat disco hi-hats
          bass: [0, 3, 4, 6, 8, 11, 12, 14, 16, 19, 20, 22, 24, 27, 28, 30], // Funky disco bass line
          synth: [0, 4, 8, 12, 16, 20, 24, 28], // String stabs
          keys: [2, 6, 10, 14, 18, 22, 26, 30], // Funky rhythm guitar/keys
          perc: [0, 4, 8, 12, 16, 20, 24, 28] // Handclaps
        }
      },
      {
        id: 'peaches',
        name: 'Peaches',
        artist: 'Justin Bieber Style',
        icon: '🍑',
        bpm: 90,
        genre: 'R&B Pop',
        color: 'from-pink-400 to-rose-500',
        // Smooth R&B with guitar, laid-back drums, mellow vibes
        pattern: {
          kick: [0, 10, 16, 26], // Sparse, laid-back kick
          snare: [8, 24], // Relaxed snare hits
          hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], // Soft hi-hat
          bass: [0, 4, 8, 10, 16, 20, 24, 26], // Smooth bass groove
          keys: [0, 3, 6, 8, 11, 14, 16, 19, 22, 24, 27, 30], // Guitar strumming pattern
          synth: [0, 8, 16, 24] // Mellow pad
        }
      },
      {
        id: 'montero',
        name: 'Montero',
        artist: 'Lil Nas X Style',
        icon: '🎸',
        bpm: 178,
        genre: 'Pop Trap',
        color: 'from-amber-400 to-red-500',
        // Spanish guitar inspired with flamenco rhythm, trap drums
        pattern: {
          kick: [0, 3, 8, 11, 16, 19, 24, 27], // Reggaeton-influenced kick
          snare: [4, 12, 20, 28], // Hard snare
          hihat: [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18, 20, 21, 22, 24, 25, 26, 28, 29, 30], // Rolling hi-hats with gaps
          bass: [0, 3, 6, 8, 11, 14, 16, 19, 22, 24, 27, 30], // Deep 808 following guitar
          synth: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], // Spanish guitar arpeggios
          lead: [0, 8, 16, 24] // Guitar chord stabs
        }
      },
      {
        id: 'save_your_tears',
        name: 'Save Your Tears',
        artist: 'The Weeknd Style',
        icon: '😢',
        bpm: 118,
        genre: 'Synth Pop',
        color: 'from-blue-400 to-indigo-600',
        // 80s inspired with gated drums, atmospheric synths
        pattern: {
          kick: [0, 8, 16, 24], // Half-time feel kick
          snare: [4, 12, 20, 28], // Gated reverb snare
          hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], // Steady closed hi-hat
          synth: [0, 4, 6, 8, 12, 14, 16, 20, 22, 24, 28, 30], // Emotional synth melody
          bass: [0, 4, 8, 12, 16, 20, 24, 28], // Solid bass foundation
          keys: [0, 2, 8, 10, 16, 18, 24, 26] // Atmospheric pad swells
        }
      },
      {
        id: 'drivers_license',
        name: 'Drivers License',
        artist: 'Olivia Rodrigo Style',
        icon: '🚗',
        bpm: 72,
        genre: 'Sad Pop',
        color: 'from-slate-400 to-gray-600',
        // Piano ballad building to emotional climax, sparse production
        pattern: {
          kick: [0, 16], // Very sparse kick, building tension
          snare: [8, 24], // Minimal snare
          hihat: [], // No hi-hat - raw emotional feel
          keys: [0, 2, 4, 8, 10, 12, 16, 18, 20, 24, 26, 28], // Piano arpeggios
          bass: [0, 8, 16, 24], // Sparse bass notes
          synth: [0, 4, 8, 12, 16, 20, 24, 28] // String swells
        }
      },
      {
        id: 'as_it_was',
        name: 'As It Was',
        artist: 'Harry Styles Style',
        icon: '🌈',
        bpm: 174,
        genre: 'Synth Pop',
        color: 'from-cyan-400 to-teal-500',
        // Bright synth-pop with distinctive synth riff, upbeat energy
        pattern: {
          kick: [0, 4, 8, 12, 16, 20, 24, 28], // Driving four-on-the-floor
          snare: [4, 12, 20, 28], // Crisp snare
          hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], // Bright hi-hats
          synth: [0, 3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31], // Signature synth melody riff
          bass: [0, 4, 8, 12, 16, 20, 24, 28], // Following the kick
          keys: [0, 8, 12, 16, 24, 28] // Synth pad accents
        }
      },
      {
        id: 'watermelon_sugar',
        name: 'Watermelon Sugar',
        artist: 'Harry Styles Style',
        icon: '🍉',
        bpm: 95,
        genre: 'Funk Pop',
        color: 'from-green-400 to-lime-500',
        // Funky, groovy with wah guitar, tight drums, summer vibes
        pattern: {
          kick: [0, 6, 8, 14, 16, 22, 24, 30], // Funky syncopated kick
          snare: [4, 12, 20, 28], // Tight snare
          hihat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], // 16th note hi-hats for funky feel
          bass: [0, 3, 6, 8, 11, 14, 16, 19, 22, 24, 27, 30], // Funky bass line
          keys: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], // Wah guitar rhythm
          perc: [4, 12, 20, 28] // Handclaps
        }
      }
    ];

    // Effect Pads
    const EFFECT_PADS = [
      { id: 'airhorn', name: 'Air Horn', icon: '📣', color: 'from-yellow-400 to-orange-500' },
      { id: 'scratch', name: 'Scratch', icon: '💿', color: 'from-cyan-400 to-blue-500' },
      { id: 'siren', name: 'Siren', icon: '🚨', color: 'from-red-400 to-pink-500' },
      { id: 'laser', name: 'Laser', icon: '⚡', color: 'from-purple-400 to-indigo-500' },
      { id: 'bomb', name: 'Bomb Drop', icon: '💣', color: 'from-gray-600 to-gray-800' },
      { id: 'yeah', name: 'Yeah!', icon: '🎤', color: 'from-green-400 to-emerald-500' },
      { id: 'reverse', name: 'Reverse', icon: '🔁', color: 'from-pink-400 to-rose-500' },
      { id: 'buildup', name: 'Build Up', icon: '🚀', color: 'from-amber-400 to-yellow-500' },
    ];

    const triggerDjEffect = (effectId) => {
      AudioEngine.init();
      const t = AudioEngine.ctx.currentTime;

      if (effectId === 'airhorn') {
        const osc = AudioEngine.ctx.createOscillator();
        const gain = AudioEngine.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);
        osc.frequency.setValueAtTime(600, t + 0.1);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.3);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
        osc.connect(gain);
        gain.connect(AudioEngine.masterGain);
        osc.start(t);
        osc.stop(t + 0.5);
      } else if (effectId === 'scratch') {
        const osc = AudioEngine.ctx.createOscillator();
        const gain = AudioEngine.ctx.createGain();
        const noise = AudioEngine.ctx.createBufferSource();
        const noiseBuffer = AudioEngine.ctx.createBuffer(1, AudioEngine.ctx.sampleRate * 0.3, AudioEngine.ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        noise.buffer = noiseBuffer;
        const noiseGain = AudioEngine.ctx.createGain();
        const filter = AudioEngine.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, t);
        filter.frequency.exponentialRampToValueAtTime(3000, t + 0.1);
        filter.frequency.exponentialRampToValueAtTime(500, t + 0.2);
        filter.Q.value = 2;
        noiseGain.gain.setValueAtTime(0.3, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(AudioEngine.masterGain);
        noise.start(t);
        noise.stop(t + 0.3);
      } else if (effectId === 'siren') {
        const osc = AudioEngine.ctx.createOscillator();
        const gain = AudioEngine.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, t);
        for (let i = 0; i < 4; i++) {
          osc.frequency.exponentialRampToValueAtTime(1200, t + i * 0.25 + 0.125);
          osc.frequency.exponentialRampToValueAtTime(600, t + i * 0.25 + 0.25);
        }
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 1);
        osc.connect(gain);
        gain.connect(AudioEngine.masterGain);
        osc.start(t);
        osc.stop(t + 1);
      } else if (effectId === 'laser') {
        const osc = AudioEngine.ctx.createOscillator();
        const gain = AudioEngine.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2000, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.3);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        osc.connect(gain);
        gain.connect(AudioEngine.masterGain);
        osc.start(t);
        osc.stop(t + 0.3);
      } else if (effectId === 'bomb') {
        const osc = AudioEngine.ctx.createOscillator();
        const gain = AudioEngine.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 0.8);
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
        osc.connect(gain);
        gain.connect(AudioEngine.masterGain);
        osc.start(t);
        osc.stop(t + 0.8);
        // Add noise impact
        const noise = AudioEngine.ctx.createBufferSource();
        const noiseBuffer = AudioEngine.ctx.createBuffer(1, AudioEngine.ctx.sampleRate * 0.2, AudioEngine.ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        noise.buffer = noiseBuffer;
        const noiseGain = AudioEngine.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.4, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        noise.connect(noiseGain);
        noiseGain.connect(AudioEngine.masterGain);
        noise.start(t);
        noise.stop(t + 0.2);
      } else if (effectId === 'yeah') {
        const osc = AudioEngine.ctx.createOscillator();
        const gain = AudioEngine.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.2);
        osc.frequency.setValueAtTime(400, t + 0.2);
        osc.frequency.exponentialRampToValueAtTime(350, t + 0.5);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
        osc.connect(gain);
        gain.connect(AudioEngine.masterGain);
        osc.start(t);
        osc.stop(t + 0.5);
      } else if (effectId === 'reverse') {
        const osc = AudioEngine.ctx.createOscillator();
        const gain = AudioEngine.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.exponentialRampToValueAtTime(800, t + 0.4);
        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        osc.connect(gain);
        gain.connect(AudioEngine.masterGain);
        osc.start(t);
        osc.stop(t + 0.4);
      } else if (effectId === 'buildup') {
        const noise = AudioEngine.ctx.createBufferSource();
        const noiseBuffer = AudioEngine.ctx.createBuffer(1, AudioEngine.ctx.sampleRate * 2, AudioEngine.ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        noise.buffer = noiseBuffer;
        const filter = AudioEngine.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(100, t);
        filter.frequency.exponentialRampToValueAtTime(5000, t + 1.5);
        const gain = AudioEngine.ctx.createGain();
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.linearRampToValueAtTime(0.4, t + 1.5);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 2);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(AudioEngine.masterGain);
        noise.start(t);
        noise.stop(t + 2);
      }
    };

    const loadDeckBeat = (deck, beat) => {
      // If same beat is already loaded, unload it (toggle off)
      if (djDecks[deck]?.id === beat.id) {
        unloadDeck(deck);
        return;
      }

      setDjDecks(prev => ({ ...prev, [deck]: beat }));
      setTempo(beat.bpm);
      // Load the pattern into the grid
      const newGrid = {};
      Object.keys(SOUND_VARIANTS).forEach(key => newGrid[key] = Array(STEPS).fill(false));
      Object.entries(beat.pattern).forEach(([inst, steps]) => {
        if (newGrid[inst]) {
          steps.forEach(step => {
            if (step < STEPS) newGrid[inst][step] = true;
          });
        }
      });
      setGrid(newGrid);
      setActiveInstrumentIds(Object.keys(beat.pattern));

      // Auto-advance DJ tutorial
      if (djTutorialActive) {
        if (djTutorialStep === 0 && deck === 'left') {
          setTimeout(() => setDjTutorialStep(1), 500);
        } else if (djTutorialStep === 2 && deck === 'right') {
          setTimeout(() => setDjTutorialStep(3), 500);
        }
      }
    };

    const unloadDeck = (deck) => {
      setDjDecks(prev => ({ ...prev, [deck]: null }));
      setDjLooping(prev => ({ ...prev, [deck]: false }));
      // Clear the grid if no decks are loaded
      const otherDeck = deck === 'left' ? 'right' : 'left';
      if (!djDecks[otherDeck]) {
        const newGrid = {};
        Object.keys(SOUND_VARIANTS).forEach(key => newGrid[key] = Array(STEPS).fill(false));
        setGrid(newGrid);
      }
    };

    // DJ Tutorial Steps
    const DJ_TUTORIAL_STEPS = [
      {
        title: "Welcome to DJ Mode! 🎧",
        text: "Let's learn to mix like a pro! First, load a track on DECK A. Tap any track in the TRENDING TRACKS section above!",
        target: "tracks",
        action: "load_left"
      },
      {
        title: "Great Choice! 🎵",
        text: "Now hit the PLAY button to start the beat! The turntable will spin when playing.",
        target: "play",
        action: "play"
      },
      {
        title: "Load Deck B! 💿",
        text: "Real DJs mix between TWO decks! Load a different track on DECK B using the quick beats below the right turntable.",
        target: "deck_right",
        action: "load_right"
      },
      {
        title: "Try the Crossfader! 🎚️",
        text: "The CROSSFADER blends between Deck A and Deck B. Slide it left for Deck A, right for Deck B!",
        target: "crossfader",
        action: "crossfader"
      },
      {
        title: "FX Pads! 🎛️",
        text: "Tap the FX PADS to trigger sound effects! Try the AIR HORN or SCRATCH - these are classic DJ moves!",
        target: "fx",
        action: "fx"
      },
      {
        title: "Control the BPM! ⚡",
        text: "Use the BPM controls to speed up or slow down the beat. Try to match tempos between decks!",
        target: "bpm",
        action: "bpm"
      },
      {
        title: "Loop It! 🔁",
        text: "Press LOOP on either deck to keep a section repeating. Great for building energy!",
        target: "loop",
        action: "loop"
      },
      {
        title: "You're a DJ Now! 🎉",
        text: "You've learned the basics! Experiment with mixing tracks, effects, and creating your own style. HAVE FUN!",
        target: null,
        action: "complete"
      }
    ];

    const currentDjTutorial = DJ_TUTORIAL_STEPS[djTutorialStep];

    // Handle tutorial progression based on actions
    const handleDjTutorialAction = (action) => {
      if (!djTutorialActive) return;

      if (djTutorialStep === 1 && action === 'play') {
        setTimeout(() => setDjTutorialStep(2), 500);
      } else if (djTutorialStep === 3 && action === 'crossfader') {
        setTimeout(() => setDjTutorialStep(4), 500);
      } else if (djTutorialStep === 4 && action === 'fx') {
        setTimeout(() => setDjTutorialStep(5), 500);
      } else if (djTutorialStep === 5 && action === 'bpm') {
        setTimeout(() => setDjTutorialStep(6), 500);
      } else if (djTutorialStep === 6 && action === 'loop') {
        setTimeout(() => setDjTutorialStep(7), 500);
      }
    };

    return (
      <div className={`h-screen w-full text-white flex flex-col overflow-hidden font-sans relative bg-gradient-to-b from-gray-900 via-slate-900 to-black ${highContrastMode ? 'high-contrast' : ''} ${largeTextMode ? 'large-text' : ''}`} role="main" aria-label="DJ Mode - Live Performance Studio">
        {/* Landscape Mode Hint Overlay */}
        <div className="landscape-hint hidden fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-8 text-center backdrop-blur-xl">
          <div className="text-6xl mb-6 animate-bounce">📱</div>
          <h2 className="text-3xl font-black text-white mb-4">Please Rotate Your Device</h2>
          <p className="text-xl text-slate-400">Rhythm Realm is best experienced in landscape mode for the full studio experience.</p>
          <div className="mt-8 w-16 h-16 border-4 border-slate-600 rounded-xl animate-spin-slow"></div>
        </div>
        <style>{cssStyles}</style>
        <a href="#dj-decks" className="skip-link" onFocus={() => speak('Skip to DJ decks')}>Skip to DJ controls</a>
        <VoiceControlIndicator />

        {/* DJ Tutorial Overlay */}
        {djTutorialActive && currentDjTutorial && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] animate-bounce-in" role="dialog" aria-modal="true" aria-label="DJ Tutorial">
            <div className="bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl p-4 shadow-2xl border-2 border-white/30">
              <div className="flex items-start gap-3">
                <div className="text-3xl animate-bounce" aria-hidden="true">
                  {djTutorialStep === 0 && '👠'}
                  {djTutorialStep === 1 && '▶️'}
                  {djTutorialStep === 2 && '💿'}
                  {djTutorialStep === 3 && '🎚️'}
                  {djTutorialStep === 4 && '🎛️'}
                  {djTutorialStep === 5 && '⚡'}
                  {djTutorialStep === 6 && '🔁'}
                  {djTutorialStep === 7 && '🎉'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                      Step {djTutorialStep + 1}/{DJ_TUTORIAL_STEPS.length}
                    </span>
                    <button
                      onClick={() => setDjTutorialActive(false)}
                      className="text-white/60 hover:text-white text-xs"
                    >
                      Skip ✔️
                    </button>
                  </div>
                  <h3 className="font-black text-lg mb-1">{currentDjTutorial.title}</h3>
                  <p className="text-sm text-white/90 leading-snug">{currentDjTutorial.text}</p>
                  {djTutorialStep === 7 && (
                    <button
                      onClick={() => setDjTutorialActive(false)}
                      className="mt-3 w-full py-2 bg-white text-purple-600 font-bold rounded-xl hover:bg-white/90 transition-all"
                    >
                      Start Mixing! 🎧
                    </button>
                  )}
                </div>
              </div>
            </div>
            {/* Arrow pointing to target */}
            {currentDjTutorial.target && (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-purple-600"></div>
            )}
          </div>
        )}

        {/* DJ Header */}
        <div className="relative z-10 px-4 py-3 flex items-center justify-between border-b border-cyan-500/30 bg-black/60 backdrop-blur-md">
          <button onClick={() => { setIsPlaying(false); setDjTutorialActive(false); setView('modes'); }} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all">
            <Icons.ChevronLeft />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-pulse">🎧</span>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">DJ MODE</h1>
              <div className="text-xs text-cyan-400/70">Live Performance</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setDjTutorialActive(!djTutorialActive); setDjTutorialStep(0); }}
              className={`p-2 rounded-xl transition-all ${djTutorialActive ? 'bg-purple-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
              title="DJ Tutorial"
            >
              <Icons.GradCap />
            </button>
            <div className="bg-black/50 px-3 py-1.5 rounded-lg border border-cyan-500/30">
              <span className="text-cyan-400 font-mono font-bold">{tempo} BPM</span>
            </div>
          </div>
        </div>

        {/* Main DJ Interface */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* TRENDING TRACKS Section */}
          <div className={`bg-gradient-to-r from-purple-900/40 via-slate-800/60 to-cyan-900/40 rounded-2xl p-4 border border-white/20 transition-all ${djTutorialActive && djTutorialStep === 0 ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-black flex items-center gap-2">
                <span className="text-2xl">🔥</span> TRENDING TRACKS
              </h2>
              <span className="text-xs text-white/50">Tap to load • {DJ_TRACKS.length} tracks</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
              {DJ_TRACKS.map(track => (
                <button
                  key={track.id}
                  onClick={() => loadDeckBeat('left', track)}
                  className={`p-2 bg-gradient-to-br ${track.color} rounded-xl text-left transition-all hover:scale-105 active:scale-95 shadow-lg`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{track.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black truncate">{track.name}</div>
                      <div className="text-[9px] opacity-70 truncate">{track.artist}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[8px] bg-black/30 px-1.5 py-0.5 rounded">{track.bpm} BPM</span>
                    <span className="text-[8px] bg-black/30 px-1.5 py-0.5 rounded">{track.genre}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Turntables Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Deck */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
              <div className="text-center mb-3">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Deck A</span>
                <div className="text-lg font-black mt-1">{djDecks.left?.name || 'Empty'}</div>
                {djDecks.left?.artist && <div className="text-xs text-cyan-400/70">{djDecks.left.artist}</div>}
              </div>

              {/* Turntable */}
              <div className="relative w-full aspect-square max-w-[150px] mx-auto mb-3">
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border-4 border-slate-600 shadow-inner flex items-center justify-center ${isPlaying && djDecks.left ? 'animate-spin-slow' : ''}`}
                  style={{ animationDuration: '2s' }}
                >
                  <div className={`w-1/3 h-1/3 rounded-full bg-gradient-to-br ${djDecks.left?.color || 'from-cyan-500 to-blue-600'} flex items-center justify-center text-2xl shadow-lg`}>
                    {djDecks.left?.icon || '💿'}
                  </div>
                  {/* Vinyl grooves */}
                  <div className="absolute inset-4 rounded-full border border-slate-600/50"></div>
                  <div className="absolute inset-8 rounded-full border border-slate-600/30"></div>
                  <div className="absolute inset-12 rounded-full border border-slate-600/20"></div>
                </div>
                {/* Tonearm */}
                <div className={`absolute -right-2 top-0 w-1 h-16 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full origin-top transition-transform ${djDecks.left ? 'rotate-[30deg]' : 'rotate-0'}`}></div>
              </div>

              {/* Deck Controls */}
              <div className={`flex justify-center gap-2 mb-3 transition-all ${djTutorialActive && djTutorialStep === 6 ? 'ring-2 ring-yellow-400 rounded-xl p-1' : ''}`}>
                <button
                  onClick={() => { if (djDecks.left) { setDjLooping(p => ({ ...p, left: !p.left })); handleDjTutorialAction('loop'); } }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${djLooping.left ? 'bg-cyan-500 text-black' : 'bg-slate-700 hover:bg-slate-600'}`}
                >
                  🔁 LOOP
                </button>
                <button
                  onClick={() => djDecks.left && triggerDjEffect('scratch')}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold transition-all"
                >
                  💿 SCRATCH
                </button>
                {djDecks.left && (
                  <button
                    onClick={() => unloadDeck('left')}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-bold transition-all"
                    title="Eject track"
                  >
                    ⏏️ EJECT
                  </button>
                )}
                <button
                  onClick={() => djDecks.left && triggerDjEffect('scratch')}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold transition-all"
                >
                  💿 SCRATCH
                </button>
              </div>

              {/* Quick Beat Selector */}
              <div className="grid grid-cols-2 gap-1.5">
                {DJ_BEATS.slice(0, 4).map(beat => (
                  <button
                    key={beat.id}
                    onClick={() => loadDeckBeat('left', beat)}
                    className={`p-2 rounded-lg text-xs font-bold transition-all ${djDecks.left?.id === beat.id ? 'bg-cyan-500 text-black' : 'bg-slate-700 hover:bg-slate-600'}`}
                  >
                    {beat.icon} {beat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Deck */}
            <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-purple-500/30 shadow-lg shadow-purple-500/10 transition-all ${djTutorialActive && djTutorialStep === 2 ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}>
              <div className="text-center mb-3">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Deck B</span>
                <div className="text-lg font-black mt-1">{djDecks.right?.name || 'Empty'}</div>
                {djDecks.right?.artist && <div className="text-xs text-purple-400/70">{djDecks.right.artist}</div>}
              </div>

              {/* Turntable */}
              <div className="relative w-full aspect-square max-w-[150px] mx-auto mb-3">
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border-4 border-slate-600 shadow-inner flex items-center justify-center ${isPlaying && djDecks.right ? 'animate-spin-slow' : ''}`}
                  style={{ animationDuration: '2s' }}
                >
                  <div className={`w-1/3 h-1/3 rounded-full bg-gradient-to-br ${djDecks.right?.color || 'from-purple-500 to-pink-600'} flex items-center justify-center text-2xl shadow-lg`}>
                    {djDecks.right?.icon || '💿'}
                  </div>
                  <div className="absolute inset-4 rounded-full border border-slate-600/50"></div>
                  <div className="absolute inset-8 rounded-full border border-slate-600/30"></div>
                  <div className="absolute inset-12 rounded-full border border-slate-600/20"></div>
                </div>
                <div className={`absolute -right-2 top-0 w-1 h-16 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full origin-top transition-transform ${djDecks.right ? 'rotate-[30deg]' : 'rotate-0'}`}></div>
              </div>

              {/* Deck Controls */}
              <div className={`flex justify-center gap-2 mb-3 transition-all ${djTutorialActive && djTutorialStep === 6 ? 'ring-2 ring-yellow-400 rounded-xl p-1' : ''}`}>
                <button
                  onClick={() => { if (djDecks.right) { setDjLooping(p => ({ ...p, right: !p.right })); handleDjTutorialAction('loop'); } }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${djLooping.right ? 'bg-purple-500 text-black' : 'bg-slate-700 hover:bg-slate-600'}`}
                >
                  🔁 LOOP
                </button>
                <button
                  onClick={() => djDecks.right && triggerDjEffect('scratch')}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold transition-all"
                >
                  💿 SCRATCH
                </button>
                {djDecks.right && (
                  <button
                    onClick={() => unloadDeck('right')}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-bold transition-all"
                    title="Eject track"
                  >
                    ⏏️ EJECT
                  </button>
                )}
              </div>

              {/* Quick Beat Selector */}
              <div className="grid grid-cols-2 gap-1.5">
                {DJ_BEATS.slice(4, 8).map(beat => (
                  <button
                    key={beat.id}
                    onClick={() => loadDeckBeat('right', beat)}
                    className={`p-2 rounded-lg text-xs font-bold transition-all ${djDecks.right?.id === beat.id ? 'bg-purple-500 text-black' : 'bg-slate-700 hover:bg-slate-600'}`}
                  >
                    {beat.icon} {beat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Crossfader */}
          <div className={`bg-gradient-to-r from-cyan-900/30 via-slate-800 to-purple-900/30 rounded-2xl p-4 border border-white/10 transition-all ${djTutorialActive && djTutorialStep === 3 ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-400">A</span>
              <span className="text-sm font-black text-white/80">CROSSFADER</span>
              <span className="text-xs font-bold text-purple-400">B</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={djCrossfader}
              onChange={(e) => { setDjCrossfader(Number(e.target.value)); handleDjTutorialAction('crossfader'); }}
              className="w-full h-3 bg-gradient-to-r from-cyan-500 via-slate-600 to-purple-500 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${djCrossfader}%, #a855f7 ${djCrossfader}%, #a855f7 100%)`
              }}
            />
          </div>

          {/* Transport & BPM */}
          <div className="flex gap-4">
            {/* Play Controls */}
            <div className={`flex-1 bg-slate-800/80 rounded-2xl p-4 border border-white/10 flex items-center justify-center gap-4 transition-all ${djTutorialActive && djTutorialStep === 1 ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}>
              <button
                onClick={() => setCurrentStep(0)}
                className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center text-xl transition-all"
              >
                ⏮
              </button>
              <button
                onClick={() => { AudioEngine.init(); setIsPlaying(!isPlaying); handleDjTutorialAction('play'); }}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all shadow-lg ${isPlaying ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-green-500 hover:bg-green-600'}`}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                onClick={() => setCurrentStep(0)}
                className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center text-xl transition-all"
              >
                ⏭
              </button>
            </div>

            {/* BPM Control */}
            <div className={`bg-slate-800/80 rounded-2xl p-4 border border-white/10 transition-all ${djTutorialActive && djTutorialStep === 5 ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}>
              <div className="text-xs font-bold text-white/60 mb-2 text-center">BPM</div>
              <div className="flex items-center gap-1">
                <button onClick={() => { setTempo(t => Math.max(60, t - 5)); handleDjTutorialAction('bpm'); }} className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-sm">-5</button>
                <button onClick={() => { setTempo(t => Math.max(60, t - 1)); handleDjTutorialAction('bpm'); }} className="px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded-lg font-bold text-xs">-1</button>
                <div className="w-12 text-center font-mono text-xl font-black text-cyan-400">{tempo}</div>
                <button onClick={() => { setTempo(t => Math.min(200, t + 1)); handleDjTutorialAction('bpm'); }} className="px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded-lg font-bold text-xs">+1</button>
                <button onClick={() => { setTempo(t => Math.min(200, t + 5)); handleDjTutorialAction('bpm'); }} className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-sm">+5</button>
              </div>
            </div>
          </div>

          {/* Effect Pads */}
          <div className={`bg-slate-800/80 rounded-2xl p-4 border border-white/10 transition-all ${djTutorialActive && djTutorialStep === 4 ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}>
            <div className="text-sm font-black text-white/80 mb-3 flex items-center gap-2">
              <span className="text-xl">🎛️</span> FX PADS
            </div>
            <div className="grid grid-cols-4 gap-2">
              {EFFECT_PADS.map(pad => (
                <button
                  key={pad.id}
                  onClick={() => { triggerDjEffect(pad.id); handleDjTutorialAction('fx'); }}
                  className={`p-3 bg-gradient-to-br ${pad.color} rounded-xl text-center transition-all hover:scale-105 active:scale-95 shadow-lg`}
                >
                  <div className="text-2xl mb-1">{pad.icon}</div>
                  <div className="text-[10px] font-bold text-white/90">{pad.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Effects Knobs */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-white/10">
            <div className="text-sm font-black text-white/80 mb-3 flex items-center gap-2">
              <span className="text-xl">🎚️</span> EFFECTS
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { id: 'filter', name: 'Filter', icon: '🌊', color: 'cyan' },
                { id: 'echo', name: 'Echo', icon: '🔊', color: 'purple' },
                { id: 'flanger', name: 'Flanger', icon: '🌀', color: 'pink' },
                { id: 'reverb', name: 'Reverb', icon: '🏺️', color: 'amber' },
              ].map(effect => (
                <div key={effect.id} className="flex flex-col items-center">
                  <div className="text-xl mb-1">{effect.icon}</div>
                  <div
                    className="w-12 h-12 rounded-full bg-slate-700 border-4 border-slate-600 relative cursor-pointer"
                    style={{
                      background: `conic-gradient(from 180deg, ${effect.color === 'cyan' ? '#06b6d4' : effect.color === 'purple' ? '#a855f7' : effect.color === 'pink' ? '#ec4899' : '#f59e0b'} ${djEffects[effect.id]}%, #374151 ${djEffects[effect.id]}%)`
                    }}
                    onClick={() => setDjEffects(p => ({ ...p, [effect.id]: (p[effect.id] + 25) % 125 }))}
                  >
                    <div className="absolute inset-2 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
                      {djEffects[effect.id]}
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-white/60 mt-1">{effect.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Beat Visualizer */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-black text-white/80">🎵 BEAT GRID</span>
              <span className="text-xs font-mono text-cyan-400">Step: {currentStep + 1}/32</span>
            </div>
            <div className="flex gap-0.5">
              {[...Array(32)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-8 rounded transition-all ${i === currentStep
                    ? 'bg-gradient-to-t from-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/50'
                    : i % 4 === 0
                      ? 'bg-slate-600'
                      : 'bg-slate-700'
                    }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Glow Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-500/20 via-purple-500/10 to-transparent pointer-events-none"></div>
      </div>
    );
  }

  // --- STUDIO VIEW ---

  // Raining Music Notes Component
  const RainingNotes = () => {
    const notes = ['♫', '♩', '♪', '🎵', '🎶', '🎹', '🎸', '🥁', '🎤'];
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da', '#fcbad3', '#a8d8ea', '#ff9a9e'];

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl md:text-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-50px',
              color: colors[i % colors.length],
              animation: `note-rain ${3 + Math.random() * 4}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              filter: `drop-shadow(0 0 8px ${colors[i % colors.length]})`,
              opacity: 0.8,
            }}
          >
            {notes[i % notes.length]}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`h-screen w-full ${currentScenario ? currentScenario.bgClass : 'bg-slate-100'} text-slate-800 flex flex-col font-sans select-none transition-colors duration-500 relative ${bassShake ? 'bass-shake' : ''} ${highContrastMode ? 'high-contrast' : ''} ${largeTextMode ? 'large-text' : ''}`} role="main" aria-label="Music Studio - Beat Creation">
      <style>{cssStyles}</style>
      <a href="#beat-grid" className="skip-link" onFocus={() => speak('Skip to beat grid')}>Skip to beat grid</a>
      <VoiceControlIndicator />

      {/* Achievement Notification */}
      <AchievementNotification />

      {/* Raining Notes when playing */}
      {isPlaying && <RainingNotes />}

      {/* HEADER / VISUALS - Smaller on mobile */}
      <div className={`${isMobile ? 'h-32' : 'h-64'} w-full shrink-0 relative z-0 bg-slate-900 overflow-hidden`} aria-hidden="true">
        {currentScenario?.renderScene && currentScenario.renderScene(beatPulse, guideProgress)}

        {/* NAVIGATION */}
        <div className="absolute top-0 left-0 w-full p-2 sm:p-4 flex justify-between items-start z-10">
          <button
            onClick={() => { setIsPlaying(false); setView(previousView || 'splash'); }}
            className="p-2 sm:p-3 bg-white/90 rounded-xl sm:rounded-2xl shadow-lg border-b-4 border-white/50 text-slate-600 hover:scale-105 active:scale-95 transition-all"
            onMouseEnter={() => speak("Go back")}
            onFocus={() => speak("Go back")}
            onMouseLeave={stopSpeaking}
            onBlur={stopSpeaking}
            aria-label="Go back to previous screen"
          ><Icons.ChevronLeft /></button>
          <div className="flex gap-2" role="toolbar" aria-label="Studio controls">
            <button
              onClick={() => { setIsPlaying(false); setView('splash'); }}
              className="p-2 sm:p-3 bg-white/90 rounded-xl sm:rounded-2xl shadow-lg border-b-4 border-white/50 text-slate-600 hover:scale-105 active:scale-95 transition-all"
              onMouseEnter={() => speak("Home")}
              onFocus={() => speak("Home")}
              onMouseLeave={stopSpeaking}
              onBlur={stopSpeaking}
              aria-label="Go to home screen"
            ><Icons.Home /></button>
            <button
              onClick={() => { setTutorialActive(!tutorialActive); setTutorialStep(0); }}
              className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg border-b-4 transition-all ${tutorialActive ? 'bg-indigo-500 text-white border-indigo-700' : 'bg-white/90 border-white/50 text-indigo-500'}`}
              onMouseEnter={() => speak(tutorialActive ? "Turn off tutorial" : "Turn on tutorial guide")}
              onFocus={() => speak(tutorialActive ? "Turn off tutorial" : "Turn on tutorial guide")}
              onMouseLeave={stopSpeaking}
              onBlur={stopSpeaking}
              aria-label={tutorialActive ? "Disable tutorial" : "Enable tutorial"}
              aria-pressed={tutorialActive}
            ><Icons.GradCap /></button>
            <button
              onClick={() => { setShowOnboarding(true); setOnboardingStep(0); }}
              className="p-2 sm:p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl sm:rounded-2xl shadow-lg border-b-4 border-blue-600 text-white hover:scale-105 active:scale-95 transition-all"
              onMouseEnter={() => speak("Open help tutorial")}
              onFocus={() => speak("Open help tutorial")}
              onMouseLeave={stopSpeaking}
              onBlur={stopSpeaking}
              aria-label="Open interactive help tutorial"
              title="Help Tutorial"
            >â“</button>
            <button
              onClick={() => setShowVictory(true)}
              className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg border-b-4 text-white hover:scale-105 active:scale-95 transition-all ${currentScore >= 50 ? 'bg-green-400 border-green-600' : 'bg-slate-400 border-slate-600 cursor-not-allowed'}`}
              disabled={currentScore < 50}
              onMouseEnter={() => speak(currentScore >= 50 ? "Complete and show victory" : "Need 50 percent score to complete")}
              onFocus={() => speak(currentScore >= 50 ? "Complete and show victory" : "Need 50 percent score to complete")}
              onMouseLeave={stopSpeaking}
              onBlur={stopSpeaking}
              aria-label={currentScore >= 50 ? "Complete and show victory screen" : "Victory unavailable - need 50% score"}
            ><Icons.Star /></button>
          </div>
        </div>
      </div>

      {/* Tutorial Overlay - Mobile Responsive */}
      {tutorialActive && currentScenario && currentScenario.tutorial && (
        <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl border-2 border-white animate-bounce-in flex flex-col items-center gap-1 max-w-[90%] sm:max-w-md w-full pointer-events-none">
          <div className="flex items-center gap-2 w-full">
            <div className="text-lg sm:text-2xl animate-bounce">👠</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold uppercase tracking-wider text-[8px] sm:text-[10px] text-indigo-200 mb-0.5 flex flex-wrap items-center gap-1">
                <span className="bg-white/20 px-1.5 py-0.5 rounded-full">Step {tutorialStep + 1}/{currentScenario.tutorial.length}</span>
                {currentScenario.tutorial[tutorialStep].targetInstrument && (
                  <span className="bg-green-500 px-1.5 py-0.5 rounded-full animate-pulse">
                    {currentScenario.tutorial[tutorialStep].targetSteps.filter(s => !grid[currentScenario.tutorial[tutorialStep].targetInstrument][s]).length} left
                  </span>
                )}
              </div>
              <div className="font-bold text-sm sm:text-base leading-tight truncate">{currentScenario.tutorial[tutorialStep].text}</div>
            </div>
          </div>
          {currentScenario.tutorial[tutorialStep].targetInstrument && (
            <div className="w-full bg-white/10 rounded-lg p-2 mt-1">
              <div className="text-[10px] sm:text-xs text-indigo-200 mb-1">Tap <span className="text-yellow-300 font-black">YELLOW</span> squares:</div>
              <div className="flex gap-0.5 flex-wrap justify-center">
                {currentScenario.tutorial[tutorialStep].targetSteps.map(step => (
                  <div
                    key={step}
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all ${grid[currentScenario.tutorial[tutorialStep].targetInstrument]?.[step]
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-400 text-yellow-900 animate-pulse'
                      }`}
                  >
                    {step + 1}
                  </div>
                ))}
              </div>
            </div>
          )}
          {!currentScenario.tutorial[tutorialStep].targetInstrument && (
            <button
              onClick={() => { setTutorialActive(false); setIsPlaying(true); }}
              className="mt-1 bg-green-500 hover:bg-green-400 text-white font-black px-4 py-2 rounded-full text-sm sm:text-base flex items-center gap-2 shadow-lg pointer-events-auto"
            >
              <Icons.Play /> PLAY YOUR BEAT!
            </button>
          )}
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-hidden bg-slate-900 relative z-10 rounded-t-3xl shadow-[0_-20px_40px_rgba(0,0,0,0.3)] -mt-6 flex flex-col">

        {/* Mobile Step Navigation */}
        {isMobile && (
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
            <button
              onClick={() => scrollMobileSteps('left')}
              disabled={mobileStepOffset === 0}
              className={`p-2 rounded-lg ${mobileStepOffset === 0 ? 'opacity-30' : 'bg-slate-700 active:bg-slate-600'}`}
            >
              <Icons.ChevronLeft />
            </button>
            <span className="text-xs text-slate-400 font-bold">
              Steps {mobileStepOffset + 1}-{Math.min(mobileStepOffset + mobileStepsVisible, STEPS)} of {STEPS}
            </span>
            <button
              onClick={() => scrollMobileSteps('right')}
              disabled={mobileStepOffset >= STEPS - mobileStepsVisible}
              className={`p-2 rounded-lg ${mobileStepOffset >= STEPS - mobileStepsVisible ? 'opacity-30' : 'bg-slate-700 active:bg-slate-600'}`}
            >
              <Icons.ChevronRight />
            </button>
          </div>
        )}

        {/* --- COMPOSER GRID --- */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-2 sm:p-4">
          <div className={`${isMobile ? '' : 'min-w-max'} space-y-1 pb-24`}>
            {/* Step indicators - hidden on mobile, clickable to seek */}
            {!isMobile && (
              <div className="flex items-center gap-3 mb-1 p-2">
                <div className="w-[180px] shrink-0 text-xs text-slate-500 text-right pr-2">Click to seek →</div>
                <div className="grid gap-0.5 flex-1 p-1" style={{ gridTemplateColumns: 'repeat(32, minmax(24px, 1fr))' }}>
                  {[...Array(STEPS)].map((_, i) => (
                    <div
                      key={i}
                      onClick={() => seekToStep(i)}
                      className={`h-3 rounded-full cursor-pointer transition-all hover:scale-y-150 ${currentStep === i
                        ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50'
                        : i % 4 === 0
                          ? 'bg-slate-500 hover:bg-slate-400'
                          : 'bg-slate-800 hover:bg-slate-600'
                        } relative`}
                    >
                      {(i % 4 === 0) && <span className="text-[10px] font-bold text-slate-500 absolute -top-4 left-1/2 -translate-x-1/2">{Math.floor(i / 4) + 1}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RENDER ACTIVE INSTRUMENTS */}
            {activeInstrumentIds.map((instKey) => {
              const variantIdx = typeof instrumentConfig[instKey] === 'number' ? instrumentConfig[instKey] : 0;
              const currentVariant = SOUND_VARIANTS[instKey]?.[variantIdx] || SOUND_VARIANTS[instKey]?.[0];
              const instrumentInfo = INSTRUMENTS_DATA.find(i => i.id === instKey);

              let isTutorialTarget = false;
              let notesToClick = [];
              if (tutorialActive && currentScenario && currentScenario.tutorial) {
                const currentTask = currentScenario.tutorial[tutorialStep];
                if (currentTask && currentTask.targetInstrument === instKey) {
                  isTutorialTarget = true;
                  notesToClick = currentTask.targetSteps;
                }
              }

              const rowOpacity = tutorialActive && !isTutorialTarget ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100';

              // Calculate visible steps for mobile
              const visibleSteps = isMobile
                ? [...Array(mobileStepsVisible)].map((_, i) => i + mobileStepOffset)
                : [...Array(STEPS)].map((_, i) => i);

              return (
                <div key={instKey} className={`relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 group rounded-lg p-1.5 sm:p-2 transition-all ${rowOpacity} ${isTutorialTarget ? 'bg-indigo-500/20 ring-2 ring-indigo-400 shadow-lg z-20' : 'hover:bg-slate-800/30'}`}>
                  {isTutorialTarget && !isMobile && <div className="absolute -left-10 top-1/2 -translate-y-1/2 animate-[bounce_1s_infinite] text-3xl z-50 filter drop-shadow-lg">👠</div>}
                  <div className="flex items-center gap-1 w-full sm:w-[180px] shrink-0 relative">
                    {/* Remove Button */}
                    <button
                      onClick={() => removeTrack(instKey)}
                      className={`${isMobile ? '' : 'opacity-0 group-hover:opacity-100'} bg-red-500 hover:bg-red-400 text-white rounded-full w-5 h-5 flex items-center justify-center transition-all z-10 shadow-md shrink-0 text-xs`}
                      title="Remove Track"
                    >
                      <Icons.Minus />
                    </button>

                    <button onClick={() => setShowSoundPicker(showSoundPicker === instKey ? null : instKey)} className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 p-1 pr-2 rounded-lg transition-all border border-slate-700/50 active:scale-95 relative">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-sm shadow-inner ${instrumentInfo.color} text-white`}>{currentVariant.icon}</div>
                      <div className="flex flex-col text-left">
                        <span className="text-[8px] font-black text-slate-500 uppercase leading-tight">{instKey}</span>
                        <span className="text-[9px] font-bold text-slate-300 truncate w-10">{currentVariant.name}</span>
                      </div>
                      <span className="text-[8px] text-slate-500">—¼</span>
                    </button>

                    {/* Sound Variant Picker Popup */}
                    {showSoundPicker === instKey && (
                      <div className="absolute top-full left-0 mt-1 z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 min-w-[200px] animate-bounce-in" onClick={(e) => e.stopPropagation()}>
                        <div className="text-[10px] font-black text-slate-400 uppercase mb-2 px-1">Select Sound for {instKey}</div>
                        <div className="grid grid-cols-2 gap-1">
                          {SOUND_VARIANTS[instKey].map((variant, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setInstrumentConfig(prev => ({ ...prev, [instKey]: idx }));
                                AudioEngine.init();
                                AudioEngine.trigger(variant, 0, soundSettings[instKey] || {});
                                setShowSoundPicker(null);
                              }}
                              className={`flex items-center gap-2 p-2 rounded-lg transition-all text-left ${instrumentConfig[instKey] === idx
                                ? `${instrumentInfo.color} text-white shadow-lg`
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                }`}
                            >
                              <span className="text-lg">{variant.icon}</span>
                              <span className="text-xs font-bold">{variant.name}</span>
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setShowSoundPicker(null)}
                          className="w-full mt-2 p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-400 font-bold"
                        >
                          Close
                        </button>
                      </div>
                    )}

                    {/* Mute Toggle */}
                    <button
                      onClick={() => handleSoundSettingChange(instKey, 'muted', !soundSettings[instKey]?.muted)}
                      className={`w-6 h-6 rounded-md flex items-center justify-center transition-all text-xs ${soundSettings[instKey]?.muted ? 'bg-red-500/90 text-white' : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/50'}`}
                      title={soundSettings[instKey]?.muted ? 'Unmute' : 'Mute'}
                    >
                      {soundSettings[instKey]?.muted ? '🔇' : '🔊'}
                    </button>
                    <button onClick={() => setActiveSoundLab(activeSoundLab === instKey ? null : instKey)} className={`w-6 h-6 rounded-md flex items-center justify-center transition-all text-xs ${activeSoundLab === instKey ? 'bg-indigo-500 text-white' : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/50'}`}><Icons.Sliders /></button>
                    <button onClick={() => smartFill(instKey)} className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center hover:from-indigo-400 hover:to-purple-500 shadow-sm text-xs"><Icons.Wand /></button>
                  </div>

                  {activeSoundLab === instKey && soundSettings[instKey] && (<SoundLab instKey={instKey} config={soundSettings[instKey]} onChange={(k, v) => handleSoundSettingChange(instKey, k, v)} onClose={() => setActiveSoundLab(null)} />)}

                  <div className={`grid gap-0.5 p-1 bg-slate-950/80 rounded-lg border border-slate-800/50 flex-1`} style={{ gridTemplateColumns: `repeat(${isMobile ? mobileStepsVisible : 32}, minmax(24px, 1fr))` }}>
                    {visibleSteps.map((stepIndex) => {
                      const isActive = grid[instKey][stepIndex];
                      const isCurrent = currentStep === stepIndex;
                      const isBeatStart = stepIndex % 4 === 0;

                      const isTargetStep = isTutorialTarget && notesToClick.includes(stepIndex) && !isActive;
                      const isCompletedTarget = isTutorialTarget && notesToClick.includes(stepIndex) && isActive;

                      // Identify premade notes in Game Levels
                      const isPremadeNote = currentScenario?.premadePattern?.[instKey]?.includes(stepIndex);

                      return (
                        <button
                          key={stepIndex}
                          onMouseDown={() => handleMouseDown(instKey, stepIndex)}
                          onMouseEnter={() => handleMouseEnter(instKey, stepIndex)}
                          onTouchStart={(e) => { e.preventDefault(); handleTouchStart(instKey, stepIndex); }}
                          className={`
                                 aspect-square rounded transition-all duration-75 ease-out relative overflow-hidden mobile-step
                                 ${isActive ? `${instrumentInfo.color} shadow-md shadow-current/30 scale-95` : 'bg-slate-700/40 border border-slate-600/30 hover:bg-slate-600/50 hover:border-slate-500/50'}
                                 ${isCurrent ? 'ring-2 ring-cyan-400 z-10 brightness-125' : ''}
                                 ${!isActive && isBeatStart ? 'bg-slate-600/50 border-slate-500/40' : ''} 
                                 ${isTargetStep ? 'bg-yellow-400 border-yellow-500 border-2 shadow-[0_0_15px_rgba(250,204,21,0.8)] z-30' : ''}
                                 ${isCompletedTarget ? 'ring-2 ring-green-400 shadow-[0_0_10px_rgba(74,222,128,0.6)]' : ''}
                                 ${isPremadeNote && isActive ? 'opacity-80 saturate-50 !border-2 !border-slate-400/50' : ''}
                               `}
                               `}
                          style={isTargetStep ? { animation: 'pulse 0.5s ease-in-out infinite' } : {}}
                        >
                          {isTargetStep && (
                            <span className="absolute inset-0 rounded bg-yellow-300 animate-ping opacity-50 pointer-events-none"></span>
                          )}
                          {isTargetStep && (
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-yellow-900 pointer-events-none">!</span>
                          )}
                          {isCompletedTarget && (
                            <span className="absolute inset-0 flex items-center justify-center text-xs pointer-events-none">✔</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* ADD TRACK BUTTON */}
            {activeInstrumentIds.length < 12 && (
              <div className={`${ isMobile ? 'pl-2' : 'ml-[180px] pl-3' } pt - 3`}>
                {!showAddTrackMenu ? (
                  <button
                    onClick={() => setShowAddTrackMenu(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 border-2 border-dashed border-slate-600/50 rounded-lg text-slate-400 hover:text-white hover:border-slate-400 hover:bg-slate-700 transition-all font-bold text-xs active:scale-95"
                  >
                    <Icons.Plus /> ADD TRACK
                  </button>
                ) : (
                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 animate-bounce-in w-full max-w-3xl shadow-2xl">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-white font-black text-sm uppercase tracking-wide">🎵 All Instruments</h4>
                      <button onClick={() => setShowAddTrackMenu(false)} className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-all"><Icons.Close /></button>
                    </div>
                    <p className="text-[10px] text-slate-500 mb-3">Click to add • Green = already added</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {INSTRUMENTS_DATA.map(inst => {
                        const isAdded = activeInstrumentIds.includes(inst.id);
                        const variant = SOUND_VARIANTS[inst.id][0];
                        return (
                          <button
                            key={inst.id}
                            onClick={() => !isAdded && addTrack(inst.id)}
                            disabled={isAdded}
                            className={`flex flex - col items - center gap - 1 p - 3 rounded - xl transition - all text - center ${
                        isAdded
                          ? 'bg-green-500/20 border-2 border-green-500/50 cursor-default'
                          : 'bg-slate-800 border border-slate-700 hover:border-slate-500 hover:bg-slate-700 active:scale-95 cursor-pointer'
                      } `}
                          >
                            <div className={`w - 10 h - 10 rounded - xl ${ inst.color } flex items - center justify - center text - xl shadow - lg ${ isAdded ? 'opacity-60' : '' } `}>
                              {variant.icon}
                            </div>
                            <span className={`text - xs font - bold ${ isAdded ? 'text-green-400' : 'text-slate-300' } `}>{inst.name}</span>
                            {isAdded && <span className="text-[8px] text-green-400 font-bold">✔ ADDED</span>}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between items-center">
                      <span className="text-xs text-slate-500">{activeInstrumentIds.length}/12 tracks added</span>
                      <button
                        onClick={() => setShowAddTrackMenu(false)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-300 transition-all"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seek Bar - Timeline Scrubber */}
      <div className="bg-slate-900 border-t border-slate-700 px-3 sm:px-6 py-2 shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-xs font-mono text-slate-400 w-10 sm:w-12 text-right">
            {Math.floor(currentStep / 4) + 1}:{(currentStep % 4) + 1}
          </span>
          <div
            ref={seekBarRef}
            className="flex-1 h-8 sm:h-10 bg-slate-800 rounded-xl cursor-pointer relative overflow-hidden group touch-none"
            onClick={handleSeekBarInteraction}
            onMouseDown={(e) => { setIsDraggingSeek(true); handleSeekBarInteraction(e); }}
            onMouseMove={(e) => isDraggingSeek && handleSeekBarInteraction(e)}
            onMouseUp={() => setIsDraggingSeek(false)}
            onMouseLeave={() => setIsDraggingSeek(false)}
            onTouchStart={(e) => { setIsDraggingSeek(true); handleSeekBarInteraction(e); }}
            onTouchMove={(e) => isDraggingSeek && handleSeekBarInteraction(e)}
            onTouchEnd={() => setIsDraggingSeek(false)}
          >
            {/* Beat markers */}
            <div className="absolute inset-0 flex">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`flex - 1 border - r border - slate - 700 ${ i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-750' } `}>
                  <span className="text-[8px] sm:text-[10px] text-slate-500 ml-1">{i + 1}</span>
                </div>
              ))}
            </div>
            {/* Progress fill */}
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500/40 to-purple-500/40 transition-all duration-75"
              style={{ width: `${ (currentStep / STEPS) * 100 }% ` }}
            />
            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-lg shadow-cyan-500/50 transition-all duration-75"
              style={{ left: `${ (currentStep / STEPS) * 100 }% ` }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg" />
            </div>
            {/* Hover indicator */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xs font-mono text-slate-400 w-10 sm:w-12">
            {STEPS / 4}:4
          </span>
        </div>
      </div>

      {/* Bottom Control Bar - Mobile Responsive */}
      <div className="h-auto sm:h-24 bg-white border-t-2 border-slate-100 flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 shrink-0 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] px-2 sm:px-4 py-2 sm:py-0 mobile-controls">
        {/* Play/Stop - Always prominent */}
        <div className={`flex items - center ${ isMobile ? 'order-first w-full justify-center mb-2' : '' } gap - 3 sm: gap - 6 bg - slate - 50 px - 3 sm: px - 6 py - 2 rounded - [2rem] border border - slate - 100`}>
          <button onClick={() => {
            AudioEngine.init();
            if (!isPlaying) {
              // Track first play for achievement
              setUserStats(prev => ({ ...prev, hasPlayedBeat: true }));
            }
            setIsPlaying(!isPlaying);
          }} className={`w - 14 h - 14 sm: w - 16 sm: h - 16 rounded - full flex items - center justify - center transition - all duration - 200 transform border - b - 8 active: border - b - 0 active: translate - y - 2 ${ isPlaying ? 'bg-red-500 border-red-700 text-white' : 'bg-green-500 border-green-700 text-white hover:bg-green-400' } `}>{isPlaying ? <Icons.Stop /> : <Icons.Play />}</button>
        </div>
        <Button onClick={clearGrid} variant="secondary" className="w-10 h-10 sm:w-12 sm:h-12 !px-0 !py-2 sm:!py-3 !rounded-xl sm:!rounded-2xl text-slate-400 hover:text-slate-600 flex justify-center items-center"><Icons.Trash /></Button>
        <button onClick={() => setShowSaveModal(true)} className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg hover:scale-105 transition-all border-b-4 border-emerald-600 active:border-b-0 active:translate-y-1" title="Save Beat">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
        </button>
        <button onClick={() => setShowLoadModal(true)} className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg hover:scale-105 transition-all border-b-4 border-indigo-600 active:border-b-0 active:translate-y-1" title="Load Beat">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 002-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
        </button>
        <div className="flex flex-col items-center justify-center bg-slate-50 px-2 sm:px-3 py-1 sm:py-2 rounded-xl sm:rounded-2xl border border-slate-100">
          <span className="text-[8px] sm:text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Tempo</span>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button onClick={() => setTempo(t => Math.max(60, t - 5))} className="px-1 sm:px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 rounded text-[10px] sm:text-xs font-bold text-slate-600">-5</button>
            <button onClick={() => setTempo(t => Math.max(60, t - 1))} className="px-1 sm:px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] sm:text-xs font-bold text-slate-500">-1</button>
            <span className="text-sm sm:text-lg font-black text-slate-700 leading-none w-8 sm:w-10 text-center">{tempo}</span>
            <button onClick={() => setTempo(t => Math.min(200, t + 1))} className="px-1 sm:px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] sm:text-xs font-bold text-slate-500">+1</button>
            <button onClick={() => setTempo(t => Math.min(200, t + 5))} className="px-1 sm:px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 rounded text-[10px] sm:text-xs font-bold text-slate-600">+5</button>
          </div>
        </div>
      </div>

      {/* Save Beat Modal */}
      {showSaveModal && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-bounce-in">
            <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
              </span>
              Save Your Beat
            </h2>
            <input
              type="text"
              placeholder="Enter beat name..."
              value={saveBeatName}
              onChange={(e) => setSaveBeatName(e.target.value)}
              className="w-full p-4 border-2 border-slate-200 rounded-2xl text-lg font-bold text-slate-700 focus:outline-none focus:border-green-400 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowSaveModal(false); setSaveBeatName(''); }}
                className="flex-1 p-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-bold text-slate-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => saveBeat(saveBeatName)}
                className="flex-1 p-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl font-bold text-white hover:scale-[1.02] transition-all shadow-lg"
              >
                💾 Save Beat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Beat Modal */}
      {showLoadModal && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-bounce-in max-h-[80vh] flex flex-col">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 002-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
              </span>
              Load a Beat
            </h2>

            {/* Favorites Filter Toggle */}
            {savedBeats.length > 0 && (
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
                <button
                  onClick={() => setShowFavoritesOnly(false)}
                  className={`px - 4 py - 2 rounded - xl font - bold text - sm transition - all ${ !showFavoritesOnly ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200' } `}
                >
                  All ({savedBeats.length})
                </button>
                <button
                  onClick={() => setShowFavoritesOnly(true)}
                  className={`px - 4 py - 2 rounded - xl font - bold text - sm transition - all flex items - center gap - 1 ${ showFavoritesOnly ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200' } `}
                >
                  ⭐ Favorites ({savedBeats.filter(b => b.favorite).length})
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {savedBeats.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <div className="text-5xl mb-4">🎵</div>
                  <p className="font-bold">No saved beats yet!</p>
                  <p className="text-sm">Create a beat and save it to see it here.</p>
                </div>
              ) : (
                (() => {
                  const beatsToShow = showFavoritesOnly ? savedBeats.filter(b => b.favorite) : savedBeats;
                  if (beatsToShow.length === 0) {
                    return (
                      <div className="text-center py-12 text-slate-400">
                        <div className="text-5xl mb-4">⭐</div>
                        <p className="font-bold">No favorites yet!</p>
                        <p className="text-sm">Tap the star icon on a beat to add it to favorites.</p>
                      </div>
                    );
                  }
                  return beatsToShow.map((beat) => (
                    <div key={beat.id} className={`flex items - center gap - 2 sm: gap - 3 p - 3 sm: p - 4 rounded - 2xl transition - all group ${ beat.favorite ? 'bg-amber-50 border-2 border-amber-200' : 'bg-slate-50 hover:bg-slate-100' } `}>
                      {/* Favorite Toggle */}
                      <button
                        onClick={() => toggleFavorite(beat.id)}
                        className={`p - 2 rounded - xl transition - all ${ beat.favorite ? 'text-amber-500 hover:text-amber-600' : 'text-slate-300 hover:text-amber-400' } `}
                        title={beat.favorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {beat.favorite ? '⭐' : '☆'}
                      </button>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl shrink-0">🎶</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-800 truncate">{beat.name}</div>
                        <div className="text-xs text-slate-400">{beat.date} • {beat.tempo} BPM • {beat.activeInstrumentIds.length} tracks</div>
                      </div>
                      <button
                        onClick={() => loadBeat(beat)}
                        className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-md text-sm"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(beat)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete beat"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  ));
                })()
              )}
            </div>
            <button
              onClick={() => { setShowLoadModal(false); setShowFavoritesOnly(false); }}
              className="w-full p-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-bold text-slate-600 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-bounce-in text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">��️</span>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Delete Beat?</h3>
            <p className="text-slate-500 mb-1">Are you sure you want to delete</p>
            <p className="text-lg font-bold text-slate-800 mb-4">"{deleteConfirm.name}"</p>
            <p className="text-xs text-red-500 mb-6">âš ️ This action cannot be undone!</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 p-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteBeat(deleteConfirm.id);
                  setDeleteConfirm(null);
                }}
                className="flex-1 p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 rounded-xl font-bold text-white transition-all shadow-lg"
              >
                ��️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Onboarding Tutorial */}
      {showOnboarding && (
        <OnboardingTutorial
          step={onboardingStep}
          onNext={() => {
            // Special handling for click-grid step
            if (ONBOARDING_STEPS[onboardingStep]?.action === 'click-grid') {
              // Check if user clicked any cell
              const hasAnyCell = Object.values(grid).some(row => row.some(cell => cell));
              if (hasAnyCell) {
                setOnboardingStep(prev => prev + 1);
              }
            } else {
              setOnboardingStep(prev => prev + 1);
            }
          }}
          onSkip={() => {
            setShowOnboarding(false);
            setOnboardingStep(0);
          }}
          onFinish={() => {
            setShowOnboarding(false);
            setOnboardingStep(0);
          }}
        />
      )}

      {showVictory && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border-8 border-yellow-400 rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl transform scale-100">
            <div className="text-yellow-400 mx-auto mb-6 flex justify-center drop-shadow-lg animate-bounce"><Icons.Trophy /></div>
            <h2 className="text-5xl font-black text-slate-800 mb-2 tracking-tight">YOU DID IT!</h2>
            <p className="text-slate-500 mb-4 font-bold text-xl">
              {currentScore >= 90 ? "PERFECT RHYTHM! 🏆" : currentScore >= 70 ? "GREAT BEAT! 🎵" : "GOOD START! 👍"}
            </p>
            <div className="flex justify-center gap-3 mb-8 text-yellow-400">
              <Icons.Star />
              {currentScore >= 70 && <Icons.Star />}
              {currentScore >= 90 && <Icons.Star />}
            </div>
            {/* Score Details for logged in users */}
            {user && (
              <div className="mb-6 p-4 bg-slate-100 rounded-2xl text-left">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600 font-bold">Score:</span>
                  <span className="text-2xl font-black text-purple-600">+{Math.round(currentScore * 10)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600 font-bold">Accuracy:</span>
                  <span className="text-lg font-bold text-green-600">{Math.round(currentScore)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold">XP Earned:</span>
                  <span className="text-lg font-bold text-amber-600">+{Math.round(currentScore)} XP</span>
                </div>
              </div>
            )}
            {!user && (
              <div className="mb-6 p-4 bg-purple-100 rounded-2xl">
                <p className="text-purple-700 font-bold text-sm mb-2">🔐 Login to save your scores!</p>
                <button
                  onClick={() => { setShowVictory(false); setShowAuthModal(true); }}
                  className="px-4 py-2 bg-purple-500 text-white rounded-xl font-bold text-sm hover:bg-purple-400 transition-all"
                >
                  Login Now
                </button>
              </div>
            )}
            <Button onClick={() => {
              // Save score if logged in and tutorial
              if (user && currentScenario && tutorialActive) {
                saveTutorialScore(currentScenario.id, currentScenario.name, currentScore);
              }
              setShowVictory(false);
              setView('splash');
            }} size="lg" className="w-full">Back to Menu</Button>
          </div>
        </div>
      )}

      {/* Verification Success Modal */}
      {showVerificationModal && (
        <div className="absolute inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border-2 border-green-500/50 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-bounce-in text-center relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>

            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500/50 animate-pulse-slow">
              <span className="text-4xl text-green-400">📧</span>
            </div>

            <h3 className="text-2xl font-black text-white mb-2">Check Your Email!</h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              We've sent a verification link to your email.
              <br /><br />
              Please click the link to activate your account and start making beats!
            </p>

            <button
              onClick={() => setShowVerificationModal(false)}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
            >
              OK, I'll Check It!
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

