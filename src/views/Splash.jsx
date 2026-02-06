import React from 'react';
import { PixelMusicBackground } from '../components/PixelMusicBackground';
import UserProfileHeader from '../components/UserProfileHeader';
import AchievementNotification from '../components/AchievementNotification';
import VoiceControlIndicator from '../components/VoiceControlIndicator';
import NewPlayerModal from './modals/NewPlayerModal';
import ProfileModal from './modals/ProfileModal';
import AuthModal from './modals/AuthModal';
import LeaderboardModal from './modals/LeaderboardModal';
import AchievementsModal from './modals/AchievementsModal';
import { Icons } from '../components/Icons';
import { GAME_LEVELS } from '../../utils/constants';

export default function Splash({
  user,
  userProfile,
  currentTheme,
  achievementNotification,
  voiceControlEnabled,
  isListening,
  lastVoiceCommand,
  onSetView,
  onLogin,
  onRegister,
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

  return (
    <div className="h-screen w-full text-white flex flex-col items-center justify-center overflow-hidden font-sans relative selection:bg-pink-500 selection:text-white">
      <PixelMusicBackground theme={currentTheme} />
      
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
      
      <AchievementNotification achievement={achievementNotification} />
      <VoiceControlIndicator enabled={voiceControlEnabled} isListening={isListening} lastCommand={lastVoiceCommand} />

      <div className="relative z-10 text-center space-y-8 p-8 max-w-4xl w-full animate-fade-in">
        {/* Logo & Title */}
        <div className="mb-8 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
          <div className="text-8xl sm:text-9xl mb-4 animate-bounce hover:scale-110 transition-transform cursor-default">🎹</div>
          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg p-2">
            RHYTHM<br />REALM
          </h1>
          <p className="text-xl sm:text-2xl text-cyan-200 font-bold tracking-widest uppercase opacity-80">Create • Share • Compete</p>
        </div>

        {/* User Quick Stats (if logged in) */}
        {user && userProfile && (
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-center gap-8 animate-slide-up mx-auto max-w-2xl">
            <div className="text-center">
              <div className="text-2xl font-black text-purple-400">{userProfile.level || 1}</div>
              <div className="text-xs uppercase tracking-wider opacity-70">Level</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-black text-pink-400">{userProfile.total_score?.toLocaleString() || 0}</div>
              <div className="text-xs uppercase tracking-wider opacity-70">XP</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-black text-cyan-400">{Object.values(levelProgress || {}).filter(p => p?.completed).length} / {GAME_LEVELS.length}</div>
              <div className="text-xs uppercase tracking-wider opacity-70">Levels</div>
            </div>
          </div>
        )}

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <button
            /* The parent component handles setting ShowNewPlayerModal */
            onClick={() => setShowNewPlayerModal(true)}
            className="group relative p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 border-b-8 border-pink-800 active:border-b-0 active:translate-y-2 overflow-hidden sm:col-span-2"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 flex items-center justify-center gap-3 text-2xl font-black">
              <span className="text-3xl group-hover:rotate-12 transition-transform">🚀</span>
              START PLAYING
            </span>
          </button>

          <button
            onClick={() => onSetView('modes')}
            className="p-4 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm rounded-xl border-2 border-slate-600 hover:border-cyan-400 transition-all hover:scale-105 active:scale-95 group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎮</div>
            <div className="font-bold text-lg text-white group-hover:text-cyan-400">Game Modes</div>
          </button>

          <button
            onClick={() => onSetView('settings')}
            className="p-4 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm rounded-xl border-2 border-slate-600 hover:border-purple-400 transition-all hover:scale-105 active:scale-95 group"
          >
            <div className="text-3xl mb-2 group-hover:rotate-90 transition-transform duration-500">⚙️</div>
            <div className="font-bold text-lg text-white group-hover:text-purple-400">Settings</div>
          </button>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-0 w-full text-center text-xs text-white/30">
            v1.0.6-MVC • Made with ❤️ by the Google DeepMind Team
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
        userRank={null} // Pass actual rank if available in data
        isLevelMode={false}
      />
      
      <AchievementsModal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        allAchievements={achievementsData || []} // Need to pass achievements data
        loading={achievementsLoading}
        userAchievements={userAchievements}
      />
    </div>
  );
}
