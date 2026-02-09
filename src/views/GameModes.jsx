import React from 'react';
import { Icons } from './components/Icons';

export default function GameModes({ onSetView }) {
  const modes = [
    {
      id: 'levels',
      title: 'Campaign',
      description: 'Master the rhythm through challenging levels.',
      icon: '🚀',
      color: 'from-blue-600 via-cyan-500 to-teal-400',
      action: () => onSetView('levels')
    },
    {
      id: 'studio',
      title: 'Free Play',
      description: 'Create your own beats in the studio.',
      icon: '🎹',
      color: 'from-purple-600 via-fuchsia-500 to-pink-500',
      action: () => onSetView('studio')
    },
    {
      id: 'dj',
      title: 'DJ Mode',
      description: 'Remix tracks live on the decks.',
      icon: '🎧',
      color: 'from-amber-500 via-orange-500 to-red-500',
      action: () => onSetView('dj')
    },
    {
      id: 'tutorial',
      title: 'Tutorial',
      description: 'Learn the basics of Rhythm Realm.',
      icon: '🎓',
      color: 'from-emerald-500 via-green-500 to-lime-500',
      action: () => onSetView('tutorial')
    }
  ];

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center overflow-hidden font-sans relative bg-surface-dark">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-neon-purple/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-neon-blue/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>

      {/* Header */}
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-4 tracking-tight drop-shadow-2xl">
          GAME <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">MODES</span>
        </h1>
        <p className="text-slate-400 text-lg uppercase tracking-widest font-light">Select your path</p>
      </div>

      {/* Modes Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full px-6">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={mode.action}
            className="group relative h-96 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 bg-white/5 backdrop-blur-sm"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
            
            {/* Content Container */}
            <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center">
              
              {/* Icon */}
              <div className={`text-7xl mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 drop-shadow-lg`}>
                {mode.icon}
              </div>

              {/* Title */}
              <h2 className="text-3xl font-display font-bold text-white mb-3 group-hover:scale-105 transition-transform">
                {mode.title}
              </h2>

              {/* Description */}
              <p className="text-slate-400 group-hover:text-white/90 transition-colors leading-relaxed">
                {mode.description}
              </p>

              {/* Arrow Indicator */}
              <div className="mt-8 px-6 py-2 rounded-full border border-white/20 text-white/50 text-sm font-bold uppercase tracking-wider group-hover:bg-white group-hover:text-black group-hover:border-transparent transition-all">
                Play Now
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => onSetView('splash')}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white border border-white/10 transition-all hover:scale-105 flex items-center gap-2 group"
        >
          <Icons.ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm">Back</span>
        </button>
      </div>
    </div>
  );
}
