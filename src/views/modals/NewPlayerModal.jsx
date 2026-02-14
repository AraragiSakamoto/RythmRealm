import React from 'react';
import { SCENARIOS, DEFAULT_SCENARIO, SOUND_VARIANTS } from '../../utils/constants';
import AudioEngine from '../../utils/AudioEngine';

export default function NewPlayerModal({ 
  isOpen, 
  onClose, 
  onStartTutorial, 
  onSkipTutorial 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border-2 border-cyan-500/50 rounded-3xl w-full max-w-2xl shadow-2xl shadow-cyan-500/20 animate-bounce-in overflow-hidden">
        <div className="relative p-8 text-center">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-500/20 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
              <span className="text-5xl">👋</span>
            </div>
            
            <h2 className="text-3xl font-black text-white mb-2">Welcome into the Rhythm Realm!</h2>
            <p className="text-cyan-200 text-lg mb-8">How would you like to start your musical journey?</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Beginner - Go to Tutorials */}
              <button
                onClick={onStartTutorial}
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
                onClick={onSkipTutorial}
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
                onClick={onClose}
                className="w-full p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white/70 font-bold text-sm transition-all sm:col-span-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
