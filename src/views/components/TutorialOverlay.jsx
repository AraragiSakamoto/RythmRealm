import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';

export default function TutorialOverlay({ onClose }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to the Studio! 🎵",
      text: "This is where you make your own music! Let's show you around.",
      target: null, // Center
      icon: "👋"
    },
    {
      title: "The Grid ⬛",
      text: "Tap these squares to turn sounds ON or OFF. Light them up to make a beat!",
      target: "grid",
      icon: "🎛️"
    },
    {
      title: "Instruments 🥁",
      text: "Click these icons to change sounds. Drums, bass, synths - you pick!",
      target: "instruments",
      icon: "🎸"
    },
    {
      title: "Play Your Beat ▶️",
      text: "Press this big button to hear your creation! Press it again to stop.",
      target: "play",
      icon: "🎶"
    },
    {
      title: "You're Ready! 🌟",
      text: "Have fun making music! Click the '?' if you need help again.",
      target: null,
      icon: "🎉"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const current = steps[step];

  return (
    <div className="absolute inset-0 z-[100] pointer-events-auto flex flex-col items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Tutorial Card */}
      <div className="relative z-10 max-w-md w-full bg-surface-dark border border-neon-cyan/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,240,255,0.2)] animate-bounce-in">
        <div className="flex items-center justify-between mb-4">
          <span className="text-4xl animate-bounce">{current.icon}</span>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-neon-cyan' : 'bg-white/20'}`}
              ></div>
            ))}
          </div>
        </div>

        <h3 className="text-2xl font-display font-bold text-white mb-2">{current.title}</h3>
        <p className="text-slate-300 text-lg leading-relaxed mb-6">
          {current.text}
        </p>

        <div className="flex items-center gap-3">
          {step > 0 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
            >
              Back
            </button>
          )}
          <button 
            onClick={handleNext}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue hover:scale-105 text-black font-black transition-all shadow-lg shadow-neon-cyan/20"
          >
            {step === steps.length - 1 ? "Let's Play! 🚀" : "Next ➡️"}
          </button>
        </div>
      </div>

      {/* Skip Button */}
      <button 
        onClick={onClose}
        className="relative z-10 mt-4 text-white/50 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors"
      >
        Skip Tutorial
      </button>
    </div>
  );
}
