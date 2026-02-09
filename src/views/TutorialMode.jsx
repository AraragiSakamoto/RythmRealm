import React, { useState, useEffect } from 'react';
import { Icons } from './components/Icons';
import AudioEngine from '../utils/AudioEngine';

export default function TutorialMode({ onSetView }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Rhythm Realm",
      content: "This is where your musical journey begins. We'll teach you the basics of rhythm and how to use the studio.",
      icon: "🎵"
    },
    {
      title: "The Grid",
      content: "Music is divided into steps. In Rhythm Realm, we use a 32-step grid. Each cell represents a moment in time.",
      icon: "▦"
    },
    {
      title: "Instruments",
      content: "Rows represent instruments like Kick, Snare, and Hi-Hats. Clicking a cell activates that instrument at that time.",
      icon: "🥁"
    },
    {
      title: "Tempo (BPM)",
      content: "BPM stands for Beats Per Minute. Higher numbers mean faster music. Experiment with it to find your groove!",
      icon: "⏱️"
    },
    {
      title: "Ready?",
      content: "You are now ready to start creating! Head over to the Studio or try the Campaign levels.",
      icon: "🚀"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      AudioEngine.trigger({ type: 'hihatClosed', freq: 8000 }, 0, { volume: 50 });
    } else {
      onSetView('studio');
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-surface-dark relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-black z-0"></div>
      
      {/* Back Button */}
      <button 
        onClick={() => onSetView('modes')}
        className="absolute top-6 left-6 z-20 p-2 text-white/50 hover:text-white transition-colors"
      >
        <Icons.ChevronLeft className="w-8 h-8" />
      </button>

      <div className="relative z-10 max-w-2xl w-full p-8">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center shadow-2xl">
          <div className="text-8xl mb-8 animate-bounce-slow">
            {steps[step].icon}
          </div>
          
          <h1 className="text-4xl font-display font-bold text-white mb-6">
            {steps[step].title}
          </h1>
          
          <p className="text-xl text-slate-300 leading-relaxed mb-12">
            {steps[step].content}
          </p>
          
          <div className="flex items-center justify-center gap-4">
             {/* Progress Dots */}
             <div className="flex gap-2 mb-8 absolute bottom-20">
                {steps.map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full transition-all ${i === step ? 'bg-neon-cyan scale-125' : 'bg-white/20'}`}></div>
                ))}
             </div>

            <button
              onClick={handleNext}
              className="px-12 py-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full text-white font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(100,200,255,0.4)]"
            >
              {step === steps.length - 1 ? "Start Creating" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
