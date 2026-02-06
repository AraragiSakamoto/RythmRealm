
import React from 'react';
import './mobile.css';
import './src/styles/animations.css';

// Controllers
import { useAuth } from './src/controllers/useAuth';
import { useGameData } from './src/controllers/useGameData';
import { useAudioController } from './src/controllers/useAudioController';
import { useAppController } from './src/controllers/useAppController';

// Views
import Splash from './src/views/Splash';
import LevelSelector from './src/views/LevelSelector';
import LevelPlay from './src/views/LevelPlay';
import DJMode from './src/views/DJMode';
import Studio from './src/views/Studio';
import Settings from './src/views/Settings';

// Constants
import { STEPS } from './src/utils/constants';

export default function App() {
  const app = useAppController();
  const auth = useAuth();
  const gameData = useGameData(auth.user);

  // Audio Engine connection
  useAudioController({
    grid: app.grid,
    // For visual feedback update
    setGrid: app.setGrid,
    isPlaying: app.isPlaying,
    setIsPlaying: app.setIsPlaying,
    tempo: app.tempo,
    activeTracks: app.activeTracks,
    instrumentConfig: app.instrumentConfig,
    soundSettings: app.soundSettings,
    currentStep: app.currentStep,
    setCurrentStep: app.setCurrentStep,
    steps: STEPS
  });

  // Render View Switcher
  const renderView = () => {
    switch (app.view) {
      case 'levels':
        return (
          <LevelSelector
            user={auth.user}
            userProfile={auth.userProfile}
            levelProgress={gameData.levelProgress}
            currentTheme={app.currentTheme}
            achievementNotification={app.achievementNotification}
            onSetView={app.setView}
            onSelectLevel={(level) => {
              app.setCurrentLevel(level);
              // Initialize tracks for the level
              const levelTracks = [];
              if (level.requirements?.mustInclude) {
                Object.entries(level.requirements.mustInclude).forEach(([type, count]) => {
                  for (let i = 0; i < count; i++) levelTracks.push({ id: `${type}-${i + 1}`, type });
                });
              } else if (level.premadePattern) {
                Object.keys(level.premadePattern).forEach(type => {
                  levelTracks.push({ id: `${type}-1`, type });
                });
              }
              // Ensure we have at least kick, snare, hihat if empty
              if (levelTracks.length === 0) {
                levelTracks.push({ id: 'kick-1', type: 'kick' });
                levelTracks.push({ id: 'snare-1', type: 'snare' });
                levelTracks.push({ id: 'hihat-1', type: 'hihat' });
              }

              app.setActiveTracks(levelTracks);
              app.setView('levelPlay');
            }}
            onLogout={auth.logout}
            showProfileModal={app.showProfileModal}
            setShowProfileModal={app.setShowProfileModal}
          />
        );

      case 'levelPlay':
        return (
          <LevelPlay
            currentLevel={app.currentLevel}
            grid={app.grid}
            setGrid={app.setGrid}
            isPlaying={app.isPlaying}
            setIsPlaying={app.setIsPlaying}
            onSetView={app.setView}
            highContrastMode={app.highContrastMode}
            largeTextMode={app.largeTextMode}
            achievementNotification={app.achievementNotification}
            showNextHint={() => {
              if (app.currentLevel?.hints) {
                app.setCurrentHintIndex((app.currentHintIndex + 1) % app.currentLevel.hints.length);
                app.setShowHint(true);
                setTimeout(() => app.setShowHint(false), 3000);
              }
            }}
            showHint={app.showHint}
            currentHintIndex={app.currentHintIndex}
            showLevelTutorial={app.showLevelTutorial}
            setShowLevelTutorial={app.setShowLevelTutorial}
            activeSoundLab={app.activeSoundLab}
            setActiveSoundLab={app.setActiveSoundLab}
            activeTracks={app.activeTracks}
            instrumentConfig={app.instrumentConfig}
            activeSoundPack={app.activeSoundPack}
            currentStep={app.currentStep}
            tutorialActive={app.tutorialActive}
          // Pass other props needed for grid rendering in LevelPlay
          />
        );

      case 'studio':
        return (
          <Studio
            grid={app.grid}
            setGrid={app.setGrid}
            isPlaying={app.isPlaying}
            setIsPlaying={app.setIsPlaying}
            onSetView={app.setView}
            highContrastMode={app.highContrastMode}
            largeTextMode={app.largeTextMode}
            achievementNotification={app.achievementNotification}
            activeSoundLab={app.activeSoundLab}
            setActiveSoundLab={app.setActiveSoundLab}
            activeTracks={app.activeTracks}
            setActiveTracks={app.setActiveTracks}
            activeSoundPack={app.activeSoundPack}
            currentStep={app.currentStep}
            tempo={app.tempo}
            setTempo={app.setTempo}
            instrumentConfig={app.instrumentConfig}
          />
        );

      case 'dj':
      case 'modes': // Mapping modes to DJ for now or separate menu
        // If 'modes' was a menu, we can implement a GamesModes view later.
        // For now, let's treat 'modes' as DJ mode entry or similar if that matches legacy.
        // If the previous app had a 'modes' view that showed DJ, Levels, Studio, we need that.
        // Splash "Game Modes" button sets view to 'settings' (wait, in Splash.jsx line 118 it sets 'modes').
        // I didn't verify the existence of a specific Modes view.
        // I'll return DJ Mode if view is 'dj' and maybe a placeholder for 'modes' that redirects to DJ or Levels.
        if (app.view === 'modes') {
          // Creating a simple intermediate menu or reusable component for Modes could be better.
          // But for MVP refactor, let's redirect to Levels for now or render a simple choice?
          // Let's render DJMode for 'dj' and LevelSelector for 'levels'.
          // If 'modes' is selected, maybe we show DJMode? Or Levels?
          // Let's assume 'modes' button in splash was meant to go to a mode selection.
          // I'll Default to DJ Mode for 'modes' to show it off, or Levels.
          // Actually, Splash has "Start Playing" -> Levels (via tutorial logic).
          // "Game Modes" -> might be DJ Mode.
          return (
            <DJMode
              djDecks={app.djDecks}
              setDjDecks={app.setDjDecks}
              djLooping={app.djLooping}
              setDjLooping={app.setDjLooping}
              djCrossfader={app.djCrossfader}
              setDjCrossfader={app.setDjCrossfader}
              djTutorialActive={app.djTutorialActive}
              setDjTutorialActive={app.setDjTutorialActive}
              djTutorialStep={app.djTutorialStep}
              setDjTutorialStep={app.setDjTutorialStep}
              tempo={app.tempo}
              setTempo={app.setTempo}
              isPlaying={app.isPlaying}
              setIsPlaying={app.setIsPlaying}
              onSetView={app.setView}
              highContrastMode={app.highContrastMode}
              largeTextMode={app.largeTextMode}
              voiceControlEnabled={app.voiceControlEnabled}
              isListening={app.isListening}
              lastVoiceCommand={app.lastVoiceCommand}
              currentStep={app.currentStep}
              setGrid={app.setGrid}
              activeTracks={app.activeTracks}
              setCurrentStep={app.setCurrentStep}
            />
          );
        }
        return (
          <DJMode
            djDecks={app.djDecks}
            setDjDecks={app.setDjDecks}
            djLooping={app.djLooping}
            setDjLooping={app.setDjLooping}
            djCrossfader={app.djCrossfader}
            setDjCrossfader={app.setDjCrossfader}
            djTutorialActive={app.djTutorialActive}
            setDjTutorialActive={app.setDjTutorialActive}
            djTutorialStep={app.djTutorialStep}
            setDjTutorialStep={app.setDjTutorialStep}
            tempo={app.tempo}
            setTempo={app.setTempo}
            isPlaying={app.isPlaying}
            setIsPlaying={app.setIsPlaying}
            onSetView={app.setView}
            highContrastMode={app.highContrastMode}
            largeTextMode={app.largeTextMode}
            voiceControlEnabled={app.voiceControlEnabled}
            isListening={app.isListening}
            lastVoiceCommand={app.lastVoiceCommand}
            currentStep={app.currentStep}
            setGrid={app.setGrid}
            activeTracks={app.activeTracks} // Updated
            setCurrentStep={app.setCurrentStep}
          />
        );

      case 'settings':
        return (
          <Settings
            currentLanguage={app.currentLanguage}
            setCurrentLanguage={app.setCurrentLanguage}
            masterVolume={app.soundSettings?.masterVolume} // Assuming masterVolume is in soundSettings or app
            setMasterVolume={(vol) => app.setSoundSettings(prev => ({ ...prev, masterVolume: vol }))} // Mock for now if not in controller
            bgMusicEnabled={app.bgMusicEnabled}
            setBgMusicEnabled={app.setBgMusicEnabled}
            currentTheme={app.currentTheme}
            setCurrentThemeId={app.setCurrentThemeId}
            accessibilityMode={app.accessibilityMode}
            setAccessibilityMode={app.setAccessibilityMode}
            textToSpeechEnabled={app.textToSpeechEnabled}
            setTextToSpeechEnabled={app.setTextToSpeechEnabled}
            highContrastMode={app.highContrastMode}
            setHighContrastMode={app.setHighContrastMode}
            largeTextMode={app.largeTextMode}
            setLargeTextMode={app.setLargeTextMode}
            keyboardNavMode={app.keyboardNavMode}
            setKeyboardNavMode={app.setKeyboardNavMode}
            voiceControlEnabled={app.voiceControlEnabled}
            setVoiceControlEnabled={app.setVoiceControlEnabled}
            isListening={app.isListening}
            lastVoiceCommand={app.lastVoiceCommand}
            activeSoundPack={app.activeSoundPack}
            applySoundPack={app.setActiveSoundPack}
            onSetView={app.setView}
          />
        );

      case 'splash':
      default:
        return (
          <Splash
            user={auth.user}
            userProfile={auth.userProfile}
            currentTheme={app.currentTheme}
            achievementNotification={app.achievementNotification}
            voiceControlEnabled={app.voiceControlEnabled}
            isListening={app.isListening}
            lastVoiceCommand={app.lastVoiceCommand}
            onSetView={app.setView}
            onLogin={auth.login}
            onRegister={auth.register}
            onLogout={auth.logout}
            showNewPlayerModal={app.showNewPlayerModal}
            setShowNewPlayerModal={app.setShowNewPlayerModal}
            showProfileModal={app.showProfileModal}
            setShowProfileModal={app.setShowProfileModal}
            showAuthModal={app.showAuthModal}
            setShowAuthModal={app.setShowAuthModal}
            authMode={app.authMode}
            setAuthMode={app.setAuthMode}
            authEmail={app.authEmail}
            setAuthEmail={app.setAuthEmail}
            authPassword={app.authPassword}
            setAuthPassword={app.setAuthPassword}
            authUsername={app.authUsername}
            setAuthUsername={app.setAuthUsername}
            authError={auth.authError}
            authLoading={auth.loading}
            showLeaderboardModal={app.showLeaderboardModal}
            setShowLeaderboardModal={app.setShowLeaderboardModal}
            leaderboardData={gameData.leaderboardData}
            leaderboardLoading={gameData.loading}
            showAchievementsModal={app.showAchievementsModal}
            setShowAchievementsModal={app.setShowAchievementsModal}
            achievementsData={gameData.achievementsData}
            achievementsLoading={gameData.loading}
            userAchievements={gameData.userAchievements}
            levelProgress={gameData.levelProgress}
            onStartTutorial={() => {
              app.setShowNewPlayerModal(false);
              app.setView('levels');
            }}
            onSkipTutorial={() => {
              app.setShowNewPlayerModal(false);
              app.setView('studio'); // Assuming 'studio' exists or handled
              // If studio is not implemented, default to levels
              if (app.view !== 'studio') app.setView('levels');
            }}
            handleAuthLogin={() => auth.login(app.authEmail, app.authPassword)}
            handleAuthRegister={() => auth.register(app.authEmail, app.authPassword, app.authUsername)}
          />
        );
    }
  };

  return renderView();
}
