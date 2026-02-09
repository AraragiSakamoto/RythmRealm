
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
import GameModes from './src/views/GameModes';
import TutorialMode from './src/views/TutorialMode';

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

              // 1. Initialize empty grid and tracks list
              const levelTracks = [];
              const newGrid = {};

              // 2. Add tracks from Premade Pattern and populate Grid
              if (level.premadePattern) {
                Object.entries(level.premadePattern).forEach(([type, steps]) => {
                  const trackId = `${type}-1`;
                  // Avoid duplicates if multiple tracks of same type allowed in future, 
                  // but for now 1 per type is safe assumption for levels.
                  if (!levelTracks.find(t => t.id === trackId)) {
                    levelTracks.push({ id: trackId, type });
                  }

                  // Initialize row
                  newGrid[trackId] = Array(32).fill(false);

                  // Set active steps
                  if (Array.isArray(steps)) {
                    steps.forEach(stepIndex => {
                      if (stepIndex >= 0 && stepIndex < 32) {
                        newGrid[trackId][stepIndex] = true;
                      }
                    });
                  }
                });
              }

              // 3. Ensure tracks exist for all Required Instruments (even if empty pattern)
              if (level.requirements?.instruments) {
                level.requirements.instruments.forEach(type => {
                  // Check if we already have a track for this type
                  const existing = levelTracks.find(t => t.type === type);
                  if (!existing) {
                    const trackId = `${type}-1`;
                    levelTracks.push({ id: trackId, type });
                    newGrid[trackId] = Array(32).fill(false);
                  }
                });
              } else if (level.requirements?.mustInclude) {
                // Fallback if 'instruments' array is missing but 'mustInclude' exists
                Object.keys(level.requirements.mustInclude).forEach(type => {
                  const existing = levelTracks.find(t => t.type === type);
                  if (!existing) {
                    const trackId = `${type}-1`;
                    levelTracks.push({ id: trackId, type });
                    newGrid[trackId] = Array(32).fill(false);
                  }
                });
              }

              // 4. Default Fallback
              if (levelTracks.length === 0) {
                ['kick', 'snare', 'hihat'].forEach(type => {
                  const id = `${type}-1`;
                  levelTracks.push({ id, type });
                  newGrid[id] = Array(32).fill(false);
                });
              }

              app.setActiveTracks(levelTracks);
              app.setGrid(newGrid); // Apply the premade pattern to state
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
            onCompleteLevel={(score) => {
              if (app.currentLevel) {
                gameData.completeLevel(app.currentLevel.id, score, 100); // 100 accuracy placeholder
                // Show success success notification or just confetti?
                // For now, let's auto-navigate back after a delay or just let the LevelPlay UI handle the exit
              }
            }}
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
            setCurrentStep={app.setCurrentStep}
            tempo={app.tempo}
            setTempo={app.setTempo}
            instrumentConfig={app.instrumentConfig}
            setInstrumentConfig={app.setInstrumentConfig}
            soundSettings={app.soundSettings}
            setSoundSettings={app.setSoundSettings}
          />
        );

      case 'dj':
        // Helper function for SoundLab changes within DJMode
        const handleSoundLabChange = (trackId, param, value) => {
          app.setInstrumentConfig(prev => ({
            ...prev,
            [trackId]: {
              ...prev[trackId],
              [param]: value
            }
          }));
        };

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

      case 'modes':
        return <GameModes onSetView={app.setView} />;

      case 'tutorial':
        return <TutorialMode onSetView={app.setView} />;


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
