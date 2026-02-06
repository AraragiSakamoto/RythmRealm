import React from 'react';

export default function VoiceControlIndicator({ enabled, isListening, lastCommand }) {
    if (!enabled) return null;
    return (
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
        <div className={`px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all ${isListening ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}>
          <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-white' : 'bg-white/50'}`}></div>
          <span className="text-white font-bold text-sm">{isListening ? '🎤 Listening' : '🔇 Paused'}</span>
        </div>
        {lastCommand && (
          <div className="px-3 py-1 bg-black/80 rounded-full text-white text-xs">
            "{lastCommand}"
          </div>
        )}
      </div>
    );
};
