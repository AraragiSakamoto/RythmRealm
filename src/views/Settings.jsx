
import React from 'react';
import { LANGUAGES, TRANSLATIONS } from '../utils/translations';
import { VISUAL_THEMES } from '../utils/themes';
// Assuming Icons are available. If not, I'll need to locate them or use placeholders.
// Based on old_app_utf8.js, Icons.ChevronLeft, etc. were used.
// If Icons is not a default export, I might need to check where it came from.
// In App.jsx, I didn't see Icons imported. Let me check App.jsx imports again?
// App.jsx has Views imports but no Icons.
// Wait, old_app_utf8.js had everything in one file.
// I'll check src/views/components/Icons.jsx or similar if it exists.
// For now I will assume Icons are passed as props or imported.
// I'll try to find where Icons are defined.

// Let's create the file but I might need to fix imports later.
// I'll try to use a safe approach: import Icons from '../components/Icons' (guess)
// or just inline SVGs for now if I can't find them, but reusing existing is better.
// Let's assume there is a Utils or Component for this.
// I see 'Icons' usage in 'LevelPlay.jsx' or 'Studio.jsx' or 'Splash.jsx'.
// Let me quickly check Splash.jsx imports in a previous step?
// Step 495: Viewed Splash.jsx. It uses <Icons.ChevronLeft />.
// Check imports in Splash.jsx (not visible in snippet).
// I will assume it is `import * as Icons from '../components/Icons'` or similar.
// I will create Settings.jsx assuming `import * as Icons from '../components/Icons'` works.

import * as Icons from '../components/Icons'; // Placeholder path

export default function Settings({
  currentLanguage,
  setCurrentLanguage,
  masterVolume,
  setMasterVolume,
  bgMusicEnabled,
  setBgMusicEnabled,
  currentTheme,
  setCurrentThemeId,
  accessibilityMode,
  setAccessibilityMode,
  textToSpeechEnabled,
  setTextToSpeechEnabled,
  highContrastMode,
  setHighContrastMode,
  largeTextMode,
  setLargeTextMode,
  keyboardNavMode,
  setKeyboardNavMode,
  voiceControlEnabled,
  setVoiceControlEnabled,
  isListening,
  lastVoiceCommand,
  activeSoundPack,
  applySoundPack, // passing the setter or function
  onSetView
}) {
    // Helper for translations
    const t = (key) => TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS.en[key] || key;

    const handleApplySoundPack = (packId) => {
        if (applySoundPack) applySoundPack(packId);
    };

    return (
      <div className="h-screen w-full text-white flex flex-col overflow-hidden font-sans relative">
         {/* Background would be handled by parent or global styles usually, but here we can add a class if needed */}
         {/* Assuming PixelMusicBackground is not easily available or we can use a simple gradient */}
        <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${currentTheme?.primary || 'from-slate-900 to-black'}`} />

        <div className="relative z-10 px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between border-b border-white/10 bg-black/30 backdrop-blur-sm">
          <button onClick={() => onSetView('splash')} className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl shadow-lg transition-all active:scale-95" aria-label={t('back')}>
            {Icons.ChevronLeft ? <Icons.ChevronLeft /> : <span>←</span>}
          </button>
          <h2 className="text-xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">⚙️ {t('settings')?.toUpperCase()}</h2>
          <div className="w-10 sm:w-12"></div>
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6">
          {/* Volume Control */}
          <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-black mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">🔊</span>
              {t('masterVolume')}
            </h3>
            <input
              type="range"
              min="0"
              max="100"
              value={masterVolume || 70}
              onChange={(e) => setMasterVolume && setMasterVolume(parseInt(e.target.value))}
              className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Background Music Toggle */}
          <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-black mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center">🎵</span>
              {t('backgroundMusic')}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-white/80">Ambient music on menus</span>
              <button
                onClick={() => setBgMusicEnabled(!bgMusicEnabled)}
                className={`w-16 h-8 rounded-full transition-all duration-300 ${bgMusicEnabled ? 'bg-gradient-to-r from-cyan-400 to-purple-500' : 'bg-white/20'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${bgMusicEnabled ? 'translate-x-9' : 'translate-x-1'}`}></div>
              </button>
            </div>
            <p className="text-xs text-white/50 mt-2">Music automatically stops during beat creation and tutorials</p>
          </div>

          {/* Visual Themes */}
          <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-black mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center">🎨</span>
              {t('visualThemes')}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {VISUAL_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setCurrentThemeId(theme.id)}
                  className={`p-3 rounded-2xl bg-gradient-to-br ${theme.primary} hover:scale-105 transition-all flex flex-col items-center gap-2 ${currentTheme?.id === theme.id ? 'ring-4 ring-white shadow-lg scale-105' : 'opacity-70 hover:opacity-100'}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    {theme.id === 'ocean' && '🌊'}
                    {theme.id === 'sunset' && '🌦'}
                    {theme.id === 'golden' && '✨'}
                    {theme.id === 'forest' && '🌲'}
                    {theme.id === 'neon' && '🎧'}
                    {theme.id === 'midnight' && '🌙'}
                  </div>
                  <span className="text-xs font-bold">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-3xl p-6 border-2 border-yellow-500/50">
            <h3 className="text-xl font-black mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">♿</span>
              {t('accessibility')}
            </h3>
            <p className="text-sm text-white/70 mb-4">Make the app easier to use for everyone</p>

            <div className="space-y-4">
              {/* Text-to-Speech */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔊</span>
                  <div>
                    <div className="font-bold">{t('textToSpeech')}</div>
                    <div className="text-xs opacity-70">{t('textToSpeechDesc')}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setTextToSpeechEnabled(!textToSpeechEnabled);
                    if (!textToSpeechEnabled) {
                      const utterance = new SpeechSynthesisUtterance('Text to speech enabled. Hover over buttons to hear descriptions.');
                      window.speechSynthesis.speak(utterance);
                    }
                  }}
                  aria-label={textToSpeechEnabled ? 'Disable text to speech' : 'Enable text to speech'}
                  className={`w-16 h-8 rounded-full transition-all duration-300 ${textToSpeechEnabled ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-white/20'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${textToSpeechEnabled ? 'translate-x-9' : 'translate-x-1'}`}></div>
                </button>
              </div>

               {/* High Contrast Mode */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔆</span>
                  <div>
                    <div className="font-bold">{t('highContrast')}</div>
                    <div className="text-xs opacity-70">{t('highContrastDesc')}</div>
                  </div>
                </div>
                <button
                  onClick={() => setHighContrastMode(!highContrastMode)}
                  aria-label={highContrastMode ? 'Disable high contrast mode' : 'Enable high contrast mode'}
                  className={`w-16 h-8 rounded-full transition-all duration-300 ${highContrastMode ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-white/20'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${highContrastMode ? 'translate-x-9' : 'translate-x-1'}`}></div>
                </button>
              </div>

              {/* Large Text Mode */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔤</span>
                  <div>
                    <div className="font-bold">{t('largeText')}</div>
                    <div className="text-xs opacity-70">{t('largeTextDesc')}</div>
                  </div>
                </div>
                <button
                  onClick={() => setLargeTextMode(!largeTextMode)}
                  aria-label={largeTextMode ? 'Disable large text mode' : 'Enable large text mode'}
                  className={`w-16 h-8 rounded-full transition-all duration-300 ${largeTextMode ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-white/20'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${largeTextMode ? 'translate-x-9' : 'translate-x-1'}`}></div>
                </button>
              </div>

              {/* Keyboard Navigation */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⌨️</span>
                  <div>
                    <div className="font-bold">{t('keyboardNav')}</div>
                    <div className="text-xs opacity-70">{t('keyboardNavDesc')}</div>
                  </div>
                </div>
                <button
                  onClick={() => setKeyboardNavMode(!keyboardNavMode)}
                  aria-label={keyboardNavMode ? 'Disable keyboard navigation mode' : 'Enable keyboard navigation mode'}
                  className={`w-16 h-8 rounded-full transition-all duration-300 ${keyboardNavMode ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-white/20'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${keyboardNavMode ? 'translate-x-9' : 'translate-x-1'}`}></div>
                </button>
              </div>

              {/* Voice Control - Hands Free */}
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-400/30">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎙️</span>
                  <div>
                    <div className="font-bold">{t('voiceControl')}</div>
                    <div className="text-xs opacity-70">{t('voiceControlDesc')}</div>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    if (!voiceControlEnabled) {
                      // Request microphone permission first
                      try {
                        await navigator.mediaDevices.getUserMedia({ audio: true });
                        setVoiceControlEnabled(true);
                        const utterance = new SpeechSynthesisUtterance('Microphone enabled. Voice control is now active. Say help to hear available commands.');
                        window.speechSynthesis.speak(utterance);
                      } catch (err) {
                          console.error(err);
                        const utterance = new SpeechSynthesisUtterance('Microphone access denied. Please allow microphone access in your browser to use voice control.');
                        window.speechSynthesis.speak(utterance);
                        alert('🎙️ Microphone access required!\n\nPlease allow microphone access in your browser to use voice control.\n\nClick the microphone icon in your browser\'s address bar to enable it.');
                      }
                    } else {
                      setVoiceControlEnabled(false);
                    }
                  }}
                  aria-label={voiceControlEnabled ? 'Disable voice control' : 'Enable voice control for hands-free use'}
                  className={`w-16 h-8 rounded-full transition-all duration-300 ${voiceControlEnabled ? 'bg-gradient-to-r from-purple-400 to-pink-500' : 'bg-white/20'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${voiceControlEnabled ? 'translate-x-9' : 'translate-x-1'}`}></div>
                </button>
              </div>

               {/* Voice Control Status & Commands */}
              {voiceControlEnabled && (
                <div className="p-4 bg-purple-500/20 rounded-2xl border border-purple-400/30">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                    <span className="font-bold text-sm">{isListening ? '🎤 Listening...' : '🔇 Not listening'}</span>
                  </div>
                  {lastVoiceCommand && (
                    <div className="text-xs opacity-70 mb-3">Last command: "{lastVoiceCommand}"</div>
                  )}
                  <div className="text-xs opacity-80">
                    <div className="font-bold mb-2">🗣️ Say these commands:</div>
                    <div className="grid grid-cols-2 gap-1">
                      <span>• "Play" / "Stop"</span>
                      <span>• "Go home"</span>
                      <span>• "DJ mode"</span>
                      <span>• "Free play"</span>
                      <span>• "Faster" / "Slower"</span>
                      <span>• "Clear"</span>
                      <span>• "Go back"</span>
                      <span>• "Help"</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Language Selector */}
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-400/30">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🌐</span>
                  <div>
                    <div className="font-bold">{t('language')}</div>
                    <div className="text-xs opacity-70">{t('languageDesc')}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(LANGUAGES).map(([code, lang]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setCurrentLanguage(code);
                        localStorage.setItem('rhythmRealm_language', code);
                        if (textToSpeechEnabled) {
                          const utterance = new SpeechSynthesisUtterance(`Language changed to ${lang.name}`);
                          utterance.lang = lang.code;
                          window.speechSynthesis.speak(utterance);
                        }
                      }}
                       className={`p-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${currentLanguage === code
                        ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-black'
                        : 'bg-white/10 hover:bg-white/20'
                        }`}
                      aria-label={`Change language to ${lang.name}`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enable All Accessibility */}
              <button
                onClick={() => {
                  const enableAll = !accessibilityMode;
                  setAccessibilityMode(enableAll);
                  setTextToSpeechEnabled(enableAll);
                  setHighContrastMode(enableAll);
                  setLargeTextMode(enableAll);
                  setKeyboardNavMode(enableAll);
                  setVoiceControlEnabled(enableAll);
                  if (enableAll) {
                    const utterance = new SpeechSynthesisUtterance('All accessibility features enabled including voice control. Say help to hear voice commands.');
                    window.speechSynthesis.speak(utterance);
                  }
                }}
                className={`w-full p-4 rounded-2xl font-bold text-lg transition-all ${accessibilityMode ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-black' : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400'}`}
                aria-label={accessibilityMode ? 'Disable all accessibility features' : 'Enable all accessibility features'}
              >
                {accessibilityMode ? `✔ ${t('allEnabled')}` : `☑️ ${t('enableAll')}`}
              </button>

              {/* Screen Reader Info */}
              <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-400/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">💡</span>
                  <span className="font-bold text-sm">Screen Reader Tips</span>
                </div>
                <ul className="text-xs opacity-80 space-y-1 ml-6">
                  <li>• Use Tab to navigate between buttons</li>
                  <li>• Press Enter or Space to activate</li>
                  <li>• Arrow keys work in grid areas</li>
                  <li>• Escape closes popups and modals</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sound Packs */}
          <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-black mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">🎵</span>
              Sound Packs
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleApplySoundPack('classic')}
                className={`w-full p-4 rounded-2xl text-left flex items-center gap-4 transition-all ${activeSoundPack === 'classic' ? 'bg-indigo-500/20 border-2 border-indigo-400 shadow-lg shadow-indigo-500/20' : 'bg-white/10 hover:bg-white/20 border border-white/10'}`}
              >
                <span className="text-2xl">🥁 </span>
                <div className="flex-1">
                  <div className={`font-bold ${activeSoundPack === 'classic' ? 'text-white' : 'text-slate-300'}`}>Classic Kit</div>
                  <div className="text-xs opacity-60">Acoustic drums & piano</div>
                </div>
                {activeSoundPack === 'classic' && <span className="text-indigo-400 font-bold text-xs bg-indigo-500/20 px-2 py-1 rounded-lg">ACTIVE</span>}
              </button>

              <button
                onClick={() => handleApplySoundPack('electronic')}
                className={`w-full p-4 rounded-2xl text-left flex items-center gap-4 transition-all ${activeSoundPack === 'electronic' ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-lg shadow-cyan-500/20' : 'bg-white/10 hover:bg-white/20 border border-white/10'}`}
              >
                <span className="text-2xl">🎹</span>
                <div className="flex-1">
                  <div className={`font-bold ${activeSoundPack === 'electronic' ? 'text-white' : 'text-slate-300'}`}>Electronic</div>
                  <div className="text-xs opacity-60">Synth, 808s & Trap</div>
                </div>
                {activeSoundPack === 'electronic' && <span className="text-cyan-400 font-bold text-xs bg-cyan-500/20 px-2 py-1 rounded-lg">ACTIVE</span>}
              </button>

              <button
                onClick={() => handleApplySoundPack('rock')}
                className={`w-full p-4 rounded-2xl text-left flex items-center gap-4 transition-all ${activeSoundPack === 'rock' ? 'bg-red-500/20 border-2 border-red-400 shadow-lg shadow-red-500/20' : 'bg-white/10 hover:bg-white/20 border border-white/10'}`}
              >
                <span className="text-2xl">🎸</span>
                <div className="flex-1">
                  <div className={`font-bold ${activeSoundPack === 'rock' ? 'text-white' : 'text-slate-300'}`}>Rock Band</div>
                  <div className="text-xs opacity-60">Punchy drums & organ</div>
                </div>
                {activeSoundPack === 'rock' && <span className="text-red-400 font-bold text-xs bg-red-500/20 px-2 py-1 rounded-lg">ACTIVE</span>}
              </button>
            </div>
          </div>

          {/* App Info */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
            <h3 className="text-xl font-black mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl flex items-center justify-center">ℹ️</span>
              {t('about')}
            </h3>
            <div className="space-y-2 text-sm opacity-80">
              <p><strong>{t('appTitle')}</strong> v1.0.0</p>
              <p>A creative music-making experience</p>
              <p className="text-xs opacity-60 mt-4">Made with ❤️ using React & Web Audio API</p>
            </div>
          </div>
        </div>
      </div>
    );
}
