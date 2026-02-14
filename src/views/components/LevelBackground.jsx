import React from 'react';

const LevelBackground = ({ renderScene, isPlaying, currentStep, grid = {}, activeTracks = [] }) => {
  // Refs to track instantaneous intensity of each instrument type
  const hitsRef = React.useRef({ kick: 0, snare: 0, hihat: 0, bass: 0, synth: 0, other: 0 });
  // State to pass to the render function
  const [visuals, setVisuals] = React.useState({ kick: 0, snare: 0, hihat: 0, bass: 0, synth: 0, other: 0, pulse: 0 });

  const lastStepRef = React.useRef(currentStep);

  // Detect hits on step change
  React.useEffect(() => {
    if (isPlaying && currentStep !== lastStepRef.current) {
      activeTracks.forEach(track => {
        // Check if this track has a note at the current step
        const trackSteps = grid[track.id];
        if (trackSteps && trackSteps[currentStep]) {
          const type = track.type || 'other';
          // Boost the corresponding visual parameter
          if (type === 'kick') hitsRef.current.kick = 1.0;
          else if (type === 'snare' || type === 'clap') hitsRef.current.snare = 1.0;
          else if (type === 'hihat' || type === 'hat') hitsRef.current.hihat = 1.0;
          else if (type === 'bass' || type === '808') hitsRef.current.bass = 1.0;
          else if (type === 'synth' || type === 'keys' || type === 'lead') hitsRef.current.synth = 1.0;
          else hitsRef.current.other = 1.0;
        }
      });
    }
    lastStepRef.current = currentStep;
  }, [currentStep, isPlaying, grid, activeTracks]);

  React.useEffect(() => {
    let animationFrame;
    const animate = () => {
      if (isPlaying) {
        // Decay all values
        Object.keys(hitsRef.current).forEach(key => {
          hitsRef.current[key] = Math.max(0, hitsRef.current[key] * (key === 'hihat' ? 0.8 : 0.92)); // Hi-hats decay faster
        });

        // Main pulse is driven by Kick + Snare
        const mainPulse = Math.max(hitsRef.current.kick, hitsRef.current.snare, hitsRef.current.bass * 0.8);

        setVisuals({ ...hitsRef.current, pulse: mainPulse });
      } else {
        // Idle Animation
        const now = Date.now();
        const p = (Math.sin(now / 2000) + 1) / 2 * 0.3 + 0.1;
        setVisuals({ kick: 0, snare: 0, hihat: 0, bass: 0, synth: 0, other: 0, pulse: p });
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying]);

  if (!renderScene) return null;
  return (
    <div className="absolute inset-0 z-0 pointer-events-none transition-colors duration-500">
      {renderScene(visuals)}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"></div>
    </div>
  );
};

export default LevelBackground;
