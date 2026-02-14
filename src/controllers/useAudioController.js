
import { useEffect, useRef } from 'react';
import AudioEngine from '../utils/AudioEngine';
import { SOUND_VARIANTS } from '../utils/constants';

export const useAudioController = ({
  grid,
  isPlaying,
  tempo,
  activeTracks, // Changed back to activeTracks (objects)
  instrumentConfig,
  soundSettings,
  currentStep,
  setCurrentStep,
  steps = 32
}) => {
  const schedulerRef = useRef(null);
  const nextNoteTimeRef = useRef(0);
  const currentStepRef = useRef(0);
  const isPlayingRef = useRef(false);

  // Refs to access current state in scheduler without re-renders
  const gridRef = useRef(grid);
  const tempoRef = useRef(tempo);
  const activeTracksRef = useRef(activeTracks);
  const instrumentConfigRef = useRef(instrumentConfig);
  const soundSettingsRef = useRef(soundSettings);

  // Keep refs in sync with state
  useEffect(() => { gridRef.current = grid; }, [grid]);
  useEffect(() => { tempoRef.current = tempo; }, [tempo]);
  useEffect(() => { activeTracksRef.current = activeTracks; }, [activeTracks]);
  useEffect(() => { instrumentConfigRef.current = instrumentConfig; }, [instrumentConfig]);
  useEffect(() => { soundSettingsRef.current = soundSettings; }, [soundSettings]);
  
  // Sync isPlayingRef
  useEffect(() => {
    if (isPlaying) {
        if (!isPlayingRef.current) {
            // Start playing
            if (AudioEngine.ctx?.state === 'suspended') {
                AudioEngine.ctx.resume();
            }
            if (!AudioEngine.ctx) AudioEngine.init();
            
            isPlayingRef.current = true;
            // Provide a small buffer to ensure we don't start in the past
            nextNoteTimeRef.current = AudioEngine.ctx.currentTime + 0.1;
            scheduler();
        }
    } else {
        if (isPlayingRef.current) {
            // Stop playing
            isPlayingRef.current = false;
            // No need to cancel RAF here, scheduler will just exit
            // But we should nullify refs if we want to reset
        }
    }
  }, [isPlaying]);

  const scheduleNote = (stepIndex, time) => {
    let notesPlayed = 0;

    if (!activeTracksRef.current) return 0;

    activeTracksRef.current.forEach(track => {
      const { id, type } = track;
      // Grid is keyed by unique ID (e.g. "kick-1")
      if (gridRef.current[id] && gridRef.current[id][stepIndex]) {
        // Instrument Config & Variants are keyed by TYPE (e.g. "kick")
        const variantIndex = instrumentConfigRef.current[type] || 0;
        const variants = SOUND_VARIANTS[type];
        const sound = variants ? variants[variantIndex] : null;

        // Settings might be keyed by ID or Type? Usually by ID for specific track mixing
        const settings = (soundSettingsRef.current && soundSettingsRef.current[id]) || {}; 

        if (sound && (!settings.muted)) {
          AudioEngine.trigger(sound, time, settings);
          notesPlayed++;
        }
      }
    });

    return notesPlayed;
  };

  const nextNote = () => {
      const secondsPerBeat = 60.0 / tempoRef.current;
      const secondsPerStep = secondsPerBeat / 4; // 16th notes
      nextNoteTimeRef.current += secondsPerStep;
      currentStepRef.current = (currentStepRef.current + 1) % steps; 
  };

  const scheduler = () => {
    if (!isPlayingRef.current) return;
    
    const lookahead = 0.1; // How far ahead to schedule (seconds)
    const scheduleAheadTime = 0.1; // How far ahead to look (seconds)
    
    if (!AudioEngine.ctx) return;

    while (nextNoteTimeRef.current < AudioEngine.ctx.currentTime + scheduleAheadTime) {
        scheduleNote(currentStepRef.current, nextNoteTimeRef.current);
        
        // Update UI (draw step)
        const drawnStep = currentStepRef.current;
        if (setCurrentStep) {
             // We use a timeout to sync visual with audio roughly
             const timeUntilNote = nextNoteTimeRef.current - AudioEngine.ctx.currentTime;
             setTimeout(() => {
                 if (isPlayingRef.current) {
                     setCurrentStep(drawnStep);
                 }
             }, Math.max(0, timeUntilNote * 1000));
        }
        
        nextNote();
    }
    schedulerRef.current = requestAnimationFrame(scheduler); // Always schedule next frame unless stopped by isPlaying check at start
  };
  
  // Cleanup
  useEffect(() => {
      return () => {
          if (schedulerRef.current) cancelAnimationFrame(schedulerRef.current);
          isPlayingRef.current = false;
      }
  }, []);

  return {}; 
};
