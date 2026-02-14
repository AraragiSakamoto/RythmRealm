import React, { useState, useEffect } from 'react';
import UserProfileHeader from './components/UserProfileHeader';
import AchievementNotification from './components/AchievementNotification';
import VoiceControlIndicator from './components/VoiceControlIndicator';
import NewPlayerModal from './modals/NewPlayerModal';
import ProfileModal from './modals/ProfileModal';
import AuthModal from './modals/AuthModal';
import LeaderboardModal from './modals/LeaderboardModal';
import AchievementsModal from './modals/AchievementsModal';
import { GAME_LEVELS } from '../utils/constants';

// Premium animated background component
const NebulaBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden bg-surface-dark">
    <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-neon-purple/20 rounded-full blur-[120px] animate-pulse-slow"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-neon-blue/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
    <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] bg-neon-pink/10 rounded-full blur-[90px] animate-pulse-slow delay-2000"></div>
    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
  </div>
);

export default function Splash({
  user,
  userProfile,
  achievementNotification,
  voiceControlEnabled,
  isListening,
  lastVoiceCommand,
  onSetView,
  onLogout,
  showNewPlayerModal,
  setShowNewPlayerModal,
  showProfileModal,
  setShowProfileModal,
  showAuthModal,
  setShowAuthModal,
  authMode,
  setAuthMode,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authUsername,
  setAuthUsername,
  authError,
  authLoading,
  showLeaderboardModal,
  setShowLeaderboardModal,
  leaderboardData,
  leaderboardLoading,
  showAchievementsModal,
  setShowAchievementsModal,
  achievementsData,
  achievementsLoading,
  userAchievements,
  levelProgress,
  onStartTutorial,
  onSkipTutorial,
  handleAuthLogin,
  handleAuthRegister
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center overflow-hidden font-sans relative selection:bg-neon-pink selection:text-white">
      <NebulaBackground />
      
      <div className="absolute top-0 right-0 p-6 z-20">
        <UserProfileHeader
          user={user}
          userProfile={userProfile}
          onShowLeaderboard={() => setShowLeaderboardModal(true)}
          onShowAchievements={() => setShowAchievementsModal(true)}
          onShowProfile={() => setShowProfileModal(true)}
          onLogout={() => onLogout(true)}
          onLogin={() => {
            setAuthMode('login');
            setShowAuthModal(true);
          }}
        />
      </div>

      <AchievementNotification achievement={achievementNotification} />
      <VoiceControlIndicator enabled={voiceControlEnabled} isListening={isListening} lastCommand={lastVoiceCommand} />

      <div className="relative z-10 text-center flex flex-col items-center justify-center max-w-7xl w-full px-6 animate-fade-in">

        {/* Hero Section */}
        <div
          className="mb-12 relative group"
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
        >
          <div className="relative z-10">
            <h1 className="text-7xl sm:text-9xl font-display font-bold tracking-tighter mb-4 leading-none">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-2xl">
                RHYTHM
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan neon-text">
                REALM
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-400 font-light tracking-[0.2em] uppercase mt-6 max-w-2xl mx-auto border-t border-white/10 pt-6">
              Create • Share • <span className="text-neon-cyan font-medium">Compete</span>
            </p>
          </div>

          {/* Decorative Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-hero-glow blur-[100px] opacity-20 -z-10 rounded-full animate-pulse-slow"></div>
        </div>

        {/* Dynamic Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">

          {/* Play Button - Large */}
          <button
            onClick={() => setShowNewPlayerModal(true)}
            className="md:col-span-3 group relative h-24 sm:h-32 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(46,92,230,0.3)] hover:shadow-[0_0_60px_rgba(46,92,230,0.5)] transition-all duration-500 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-90 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] w-[200%] h-full animate-[shimmer_3s_infinite] translate-x-[-100%]"></div>

            <div className="relative h-full flex items-center justify-between px-10">
              <div className="text-left">
                <div className="text-xs font-bold tracking-widest text-white/80 mb-1">ENTER THE REALM</div>
                <div className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight flex items-center gap-4">
                  START PLAYING <span className="text-3xl sm:text-4xl transition-transform group-hover:translate-x-2">→</span>
                </div>
              </div>
              <div className="text-6xl opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500 rotate-12">
                🎹
              </div>
            </div>
          </button>

          {/* Secondary Actions */}
          <button
            onClick={() => onSetView('modes')}
            className="md:col-span-2 group glass-button p-6 rounded-2xl flex items-center justify-between hover:border-neon-cyan/50 hover:bg-neon-cyan/5"
          >
            <div className="text-left">
              <h3 className="text-2xl font-bold text-white group-hover:text-neon-cyan transition-colors mb-2">Game Modes</h3>
              <p className="text-sm text-slate-400">Campaigns, Arcade & More</p>
            </div>
            <div className="text-4xl grayscale group-hover:grayscale-0 transition-all duration-300 scale-90 group-hover:scale-110">
              🎮
            </div>
          </button>

          <button
            onClick={() => onSetView('settings')}
            className="glass-button p-6 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-neon-purple/50 hover:bg-neon-purple/5 group"
          >
            <div className="text-3xl text-slate-400 group-hover:text-neon-purple group-hover:rotate-90 transition-all duration-500">
              ⚙️
            </div>
            <span className="font-bold text-sm tracking-widest text-slate-300 group-hover:text-white">SETTINGS</span>
          </button>
        </div>

        {/* User Stats Ticker */}
        {user && userProfile && (
          <div className="mt-12 glass-panel rounded-full px-8 py-3 flex items-center gap-8 animate-slide-up">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
              <span className="text-xs font-bold text-slate-300 tracking-wider">ONLINE</span>
            </div>
            <div className="w-px h-4 bg-white/10"></div>
            <div className="text-sm font-medium text-slate-300">
              Lvl <span className="text-neon-purple font-bold text-lg">{userProfile.level || 1}</span>
            </div>
            <div className="w-px h-4 bg-white/10"></div>
            <div className="text-sm font-medium text-slate-300">
              XP <span className="text-neon-pink font-bold text-lg">{userProfile.total_score?.toLocaleString() || 0}</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="absolute bottom-6 w-full text-center">
          <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity cursor-default">
            v1.1.0 • Rhythm Realm Studio
          </p>
        </div>
      </div>

      {/* Modals */}
      <NewPlayerModal 
        isOpen={showNewPlayerModal} 
        onClose={() => setShowNewPlayerModal(false)}
        onStartTutorial={onStartTutorial}
        onSkipTutorial={onSkipTutorial}
      />
      
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        userProfile={userProfile}
        levelProgress={levelProgress}
        onLogout={onLogout}
        onLogin={() => {
            setShowProfileModal(false);
            setAuthMode('login');
            setShowAuthModal(true);
        }}
      />
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        setMode={setAuthMode}
        email={authEmail}
        setEmail={setAuthEmail}
        password={authPassword}
        setPassword={setAuthPassword}
        username={authUsername}
        setUsername={setAuthUsername}
        error={authError}
        loading={authLoading}
        onLogin={handleAuthLogin}
        onRegister={handleAuthRegister}
      />
      
      <LeaderboardModal
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
        title="Global Leaderboard"
        data={leaderboardData}
        loading={leaderboardLoading}
        user={user}
        userRank={null}
        isLevelMode={false}
      />
      
      <AchievementsModal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        allAchievements={achievementsData || []}
        loading={achievementsLoading}
        userAchievements={userAchievements}
      />
    </div>
  );
}
