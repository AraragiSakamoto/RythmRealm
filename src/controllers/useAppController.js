
import { useState, useRef, useEffect } from 'react';
import { SOUND_VARIANTS, STEPS, DEFAULT_SCENARIO } from '../utils/constants';
import { VISUAL_THEMES } from '../utils/themes';

export const useAppController = () => {
    // Mode Logic
    const [view, setView] = useState('splash');
    const [previousView, setPreviousView] = useState(null);
    const [currentLanguage, setCurrentLanguage] = useState('en');

    // Audio / Visual Settings
    const [activeSoundPack, setActiveSoundPack] = useState('classic');
    const [bgMusicEnabled, setBgMusicEnabled] = useState(true);

    // Game Logic
    const [grid, setGrid] = useState(() => {
        const initialGrid = {};
        // Default tracks: kick-1, snare-1, hihat-1
        initialGrid['kick-1'] = Array(STEPS).fill(false);
        initialGrid['snare-1'] = Array(STEPS).fill(false);
        initialGrid['hihat-1'] = Array(STEPS).fill(false);
        return initialGrid;
    });
    
    // Playback Logic
    const [isPlaying, setIsPlaying] = useState(false);
    const [tempo, setTempo] = useState(120);
    const [currentStep, setCurrentStep] = useState(0);

    // Configuration
    const [activeTracks, setActiveTracks] = useState([
        { id: 'kick-1', type: 'kick' },
        { id: 'snare-1', type: 'snare' },
        { id: 'hihat-1', type: 'hihat' }
    ]);
    const [instrumentConfig, setInstrumentConfig] = useState({
        kick: 0, snare: 0, hihat: 0, tom: 0, clap: 0,
        bass: 0, synth: 0, keys: 0,
        fx: 0, vocal: 0, guitar: 0, perc: 0
    });
    const [soundSettings, setSoundSettings] = useState({}); // Volume, pitch, etc per instrument
    
    // UI State
    const [currentThemeId, setCurrentThemeId] = useState('ocean');
    const currentTheme = VISUAL_THEMES.find(t => t.id === currentThemeId) || VISUAL_THEMES[0];
    
    // Modals
    const [showNewPlayerModal, setShowNewPlayerModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
    const [showAchievementsModal, setShowAchievementsModal] = useState(false);
    const [activeSoundLab, setActiveSoundLab] = useState(null);
    
    // Auth Form State (should be local to AuthModal usually, but was in App)
    const [authMode, setAuthMode] = useState('login');
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authUsername, setAuthUsername] = useState('');

    // Level Logic
    const [currentLevel, setCurrentLevel] = useState(null);
    const [levelComplete, setLevelComplete] = useState(false);
    const [showLevelTutorial, setShowLevelTutorial] = useState(true);
    const [showHint, setShowHint] = useState(false);
    const [currentHintIndex, setCurrentHintIndex] = useState(0);

    // DJ Mode Logic
    const [djDecks, setDjDecks] = useState({ left: null, right: null });
    const [djLooping, setDjLooping] = useState({ left: false, right: false });
    const [djCrossfader, setDjCrossfader] = useState(50);
    const [djTutorialActive, setDjTutorialActive] = useState(false);
    const [djTutorialStep, setDjTutorialStep] = useState(0);

    // Accessibility
    const [voiceControlEnabled, setVoiceControlEnabled] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [lastVoiceCommand, setLastVoiceCommand] = useState(null);
    const [highContrastMode, setHighContrastMode] = useState(false);

    const [largeTextMode, setLargeTextMode] = useState(false);
    const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(false);
    const [keyboardNavMode, setKeyboardNavMode] = useState(false);
    const [accessibilityMode, setAccessibilityMode] = useState(false); // Master toggle
    
    // Achievement Notification
    const [achievementNotification, setAchievementNotification] = useState(null);

    // Navigation Helper
    const handleSetView = (newView) => {
        setPreviousView(view);
        setView(newView);
        setIsPlaying(false);
    };

    return {
        view, setView: handleSetView,
        previousView,
        grid, setGrid,
        isPlaying, setIsPlaying,
        tempo, setTempo,
        currentStep, setCurrentStep,
        activeTracks, setActiveTracks,
        instrumentConfig, setInstrumentConfig,
        soundSettings, setSoundSettings,
        currentTheme, setCurrentThemeId,
        showNewPlayerModal, setShowNewPlayerModal,
        showProfileModal, setShowProfileModal,
        showAuthModal, setShowAuthModal,
        showLeaderboardModal, setShowLeaderboardModal,
        showAchievementsModal, setShowAchievementsModal,
        activeSoundLab, setActiveSoundLab,
        authMode, setAuthMode,
        authEmail, setAuthEmail,
        authPassword, setAuthPassword,
        authUsername, setAuthUsername,
        currentLevel, setCurrentLevel,
        levelComplete, setLevelComplete,
        showLevelTutorial, setShowLevelTutorial,
        showHint, setShowHint,
        currentHintIndex, setCurrentHintIndex,
        djDecks, setDjDecks,
        djLooping, setDjLooping,
        djCrossfader, setDjCrossfader,
        djTutorialActive, setDjTutorialActive,
        djTutorialStep, setDjTutorialStep,
        voiceControlEnabled, setVoiceControlEnabled,
        isListening, setIsListening,
        lastVoiceCommand, setLastVoiceCommand,
        highContrastMode, setHighContrastMode,

        largeTextMode, setLargeTextMode,
        achievementNotification, setAchievementNotification,
        currentLanguage, setCurrentLanguage,
        activeSoundPack, setActiveSoundPack,
        bgMusicEnabled, setBgMusicEnabled,
        textToSpeechEnabled, setTextToSpeechEnabled,
        keyboardNavMode, setKeyboardNavMode,
        accessibilityMode, setAccessibilityMode
    };
};
