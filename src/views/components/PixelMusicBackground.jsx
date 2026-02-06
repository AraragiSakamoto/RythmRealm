import React from 'react';
import { VISUAL_THEMES } from '../../utils/themes';

export const PixelMusicBackground = ({ theme = VISUAL_THEMES[4] }) => {
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
      <div className="absolute bottom-32 left-20 text-3xl opacity-25" style={{ color: theme.noteColors[2], imageRendering: 'pixelated', animation: 'float 4s ease-in-out infinite' }}>🥁 </div>
      <div className="absolute bottom-40 right-10 text-4xl opacity-20 animate-bounce" style={{ color: theme.noteColors[3], imageRendering: 'pixelated' }}>🎤</div>

      {/* Corner Decorations - Pixel Style */}
      <div className="absolute top-0 left-0 w-20 h-20 m-4" style={{ borderLeft: `4px solid ${theme.eqColors[0]}80`, borderTop: `4px solid ${theme.eqColors[0]}80` }}></div>
      <div className="absolute top-0 right-0 w-20 h-20 m-4" style={{ borderRight: `4px solid ${theme.eqColors[2]}80`, borderTop: `4px solid ${theme.eqColors[2]}80` }}></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 m-4" style={{ borderLeft: `4px solid ${theme.eqColors[2]}80`, borderBottom: `4px solid ${theme.eqColors[2]}80` }}></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 m-4" style={{ borderRight: `4px solid ${theme.eqColors[0]}80`, borderBottom: `4px solid ${theme.eqColors[0]}80` }}></div>
    </div>
  );
};
