const AudioEngine = {
  ctx: null,
  masterGain: null,
  compressor: null,
  analyser: null,
  ambienceNodes: [],

  init: () => {
    if (typeof window === 'undefined') return;
    if (!AudioEngine.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        AudioEngine.ctx = new AudioContext();
        AudioEngine.masterGain = AudioEngine.ctx.createGain();
        AudioEngine.masterGain.gain.value = 0.7;
        AudioEngine.compressor = AudioEngine.ctx.createDynamicsCompressor();
        AudioEngine.compressor.threshold.value = -20;
        AudioEngine.compressor.knee.value = 10;
        AudioEngine.compressor.ratio.value = 4;
        AudioEngine.compressor.attack.value = 0.003;
        AudioEngine.compressor.release.value = 0.1;
        // Create analyser for waveform visualization
        AudioEngine.analyser = AudioEngine.ctx.createAnalyser();
        AudioEngine.analyser.fftSize = 256;
        AudioEngine.masterGain.connect(AudioEngine.compressor);
        AudioEngine.compressor.connect(AudioEngine.analyser);
        AudioEngine.analyser.connect(AudioEngine.ctx.destination);
      }
    }
    if (AudioEngine.ctx && AudioEngine.ctx.state === 'suspended') {
      AudioEngine.ctx.resume();
    }
  },

  createNoise: (duration) => {
    const bufferSize = AudioEngine.ctx.sampleRate * duration;
    const buffer = AudioEngine.ctx.createBuffer(1, bufferSize, AudioEngine.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  },

  createFilteredNoise: (freq, q, duration, t) => {
    const noise = AudioEngine.ctx.createBufferSource();
    noise.buffer = AudioEngine.createNoise(duration);
    const filter = AudioEngine.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value = q;
    noise.connect(filter);
    return { source: noise, output: filter };
  },

  startAmbience: (type) => { /* simplified */ },
  stopAmbience: () => {
    AudioEngine.ambienceNodes.forEach(node => {
      try { node.stop(); } catch (e) { }
      try { node.disconnect(); } catch (e) { }
    });
    AudioEngine.ambienceNodes = [];
  },

  // Stop all playing sounds by suspending and resuming context
  stopAll: () => {
    if (AudioEngine.ctx) {
      // Suspend immediately stops scheduled sounds
      AudioEngine.ctx.suspend().then(() => {
        // Resume after a tiny delay so new sounds can play
        setTimeout(() => {
          if (AudioEngine.ctx && AudioEngine.ctx.state === 'suspended') {
            AudioEngine.ctx.resume();
          }
        }, 50);
      }).catch(() => { });
    }
  },

  trigger: (variant, time = 0, config = { pitch: 0, chord: null, bend: 0, volume: 100, muted: false, attack: 0, decay: 100, filter: 100, reverb: 0, distortion: 0, pan: 0 }) => {
    // Skip if muted
    if (config.muted) return;

    if (!AudioEngine.ctx || !AudioEngine.masterGain) return;
    const t = time || AudioEngine.ctx.currentTime;
    const pitchMult = Math.pow(2, config.pitch / 12);
    const baseFreq = variant.freq * pitchMult;
    const soundType = variant.type || 'default';

    // Volume multiplier (0-1)
    const volumeMult = (config.volume !== undefined ? config.volume : 100) / 100;

    // Create a volume gain node for this sound
    const volumeGain = AudioEngine.ctx.createGain();
    volumeGain.gain.value = volumeMult;

    // Create panner node
    const panner = AudioEngine.ctx.createStereoPanner();
    panner.pan.value = (config.pan || 0) / 50; // Convert -50 to 50 to -1 to 1

    // Connect: sound -> volumeGain -> panner -> masterGain
    volumeGain.connect(panner);
    panner.connect(AudioEngine.masterGain);

    // === KICK DRUMS ===
    if (soundType.startsWith('kick')) {
      const osc = AudioEngine.ctx.createOscillator();
      const gain = AudioEngine.ctx.createGain();
      osc.type = 'sine';

      // Variables for different kick characters
      let clickFreq = 4000;
      let clickVol = 0.5;
      let clickDecay = 0.02;
      let noiseVol = 0.3;
      let noiseFilterFreq = 200;

      if (soundType === 'kick808') {
        // Classic 808 - DEEP sub bass, long sustain, iconic boom
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
        osc.frequency.exponentialRampToValueAtTime(28, t + 0.6);
        gain.gain.setValueAtTime(1.0, t);
        gain.gain.exponentialRampToValueAtTime(0.7, t + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.9);
        clickFreq = 2500;
        clickVol = 0.3;
        clickDecay = 0.015;
        noiseVol = 0.15;
        noiseFilterFreq = 150;
      } else if (soundType === 'kickPunch') {
        // Punchy kick - TIGHT attack, SHORT decay, snappy
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(65, t + 0.03);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.08);
        gain.gain.setValueAtTime(1.0, t);
        gain.gain.exponentialRampToValueAtTime(0.2, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
        clickFreq = 6000;
        clickVol = 0.8;
        clickDecay = 0.008;
        noiseVol = 0.5;
        noiseFilterFreq = 350;
      } else if (soundType === 'kickSub') {
        // Sub kick - ULTRA deep, long tail, rumbling bass
        osc.frequency.setValueAtTime(80, t);
        osc.frequency.exponentialRampToValueAtTime(32, t + 0.15);
        osc.frequency.exponentialRampToValueAtTime(22, t + 0.5);
        gain.gain.setValueAtTime(1.0, t);
        gain.gain.linearRampToValueAtTime(0.8, t + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 1.2);
        clickFreq = 1500;
        clickVol = 0.15;
        clickDecay = 0.02;
        noiseVol = 0.1;
        noiseFilterFreq = 100;
      } else {
        // Acoustic kick - realistic drum, mid punch, natural resonance
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(85, t + 0.025);
        osc.frequency.exponentialRampToValueAtTime(55, t + 0.12);
        gain.gain.setValueAtTime(0.9, t);
        gain.gain.exponentialRampToValueAtTime(0.35, t + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        clickFreq = 5000;
        clickVol = 0.7;
        clickDecay = 0.012;
        noiseVol = 0.6;
        noiseFilterFreq = 400;
      }

      // Click/attack transient - varies per kick type
      const click = AudioEngine.ctx.createOscillator();
      const clickGain = AudioEngine.ctx.createGain();
      click.type = 'triangle';
      click.frequency.setValueAtTime(clickFreq, t);
      click.frequency.exponentialRampToValueAtTime(150, t + clickDecay);
      clickGain.gain.setValueAtTime(clickVol, t);
      clickGain.gain.exponentialRampToValueAtTime(0.01, t + clickDecay + 0.005);
      click.connect(clickGain);
      clickGain.connect(volumeGain);
      click.start(t);
      click.stop(t + 0.05);

      // Noise for body/thump - varies per kick type
      const noiseBuffer = AudioEngine.ctx.createBuffer(1, AudioEngine.ctx.sampleRate * 0.1, AudioEngine.ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (AudioEngine.ctx.sampleRate * 0.015));
      }
      const noiseSource = AudioEngine.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      const noiseFilter = AudioEngine.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.value = noiseFilterFreq;
      const noiseGainNode = AudioEngine.ctx.createGain();
      noiseGainNode.gain.setValueAtTime(noiseVol, t);
      noiseGainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.06);
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGainNode);
      noiseGainNode.connect(volumeGain);
      noiseSource.start(t);
      noiseSource.stop(t + 0.1);

      osc.connect(gain);
      gain.connect(volumeGain);
      osc.start(t);
      osc.stop(t + 1.5);
    }
    // === SNARE / CLAP ===
    else if (soundType.startsWith('snare') || soundType === 'clap' || soundType === 'rim') {
      const osc = AudioEngine.ctx.createOscillator();
      const oscGain = AudioEngine.ctx.createGain();
      osc.type = 'triangle';

      // Noise component for snare/clap match
      const noise = AudioEngine.ctx.createBufferSource();
      noise.buffer = AudioEngine.createNoise(0.4);
      const noiseFilter = AudioEngine.ctx.createBiquadFilter();
      const noiseGain = AudioEngine.ctx.createGain();

      if (soundType === 'clap') {
        // Multi-trigger noise for clap effect
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = 1500;
        noiseFilter.Q.value = 1;

        // Clap tone
        osc.type = 'triangle';
        osc.frequency.value = 150;
        oscGain.gain.setValueAtTime(0.1, t);
        oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

        // We trigger noise manually 3 times for clap
        // Disconnect main noise graph for custom clap logic
        for (let i = 0; i < 3; i++) {
          const delay = i * 0.012;
          const clapSource = AudioEngine.ctx.createBufferSource();
          clapSource.buffer = noise.buffer;
          const clapFilter = AudioEngine.ctx.createBiquadFilter();
          clapFilter.type = 'bandpass';
          clapFilter.frequency.value = 1500;
          const clapGain = AudioEngine.ctx.createGain();

          clapGain.gain.setValueAtTime(0.6, t + delay);
          clapGain.gain.exponentialRampToValueAtTime(0.01, t + delay + 0.1);

          clapSource.connect(clapFilter);
          clapFilter.connect(clapGain);
          clapGain.connect(volumeGain);
          clapSource.start(t + delay);
          clapSource.stop(t + delay + 0.15);
        }
      }
      else if (soundType === 'rim') {
        osc.frequency.value = baseFreq || 800;
        osc.type = 'square';
        oscGain.gain.setValueAtTime(0.3, t);
        oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
        // Minimal click noise for rim
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 5000;
        noiseGain.gain.setValueAtTime(0.1, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.02);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(volumeGain);
        noise.start(t);
      }
      else {
        // Standard Snare (Crack, Trap, etc)
        // 1. Tonal Body (Oscillator)
        osc.frequency.setValueAtTime(baseFreq || 200, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.15);

        // 2. Snap (Noise) - Using Highpass for crisp sound
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 2000; // Let the highs through

        // Envelope
        oscGain.gain.setValueAtTime(0.5, t);
        oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

        const noiseVol = soundType === 'snareTrap' ? 0.8 : 0.6;
        noiseGain.gain.setValueAtTime(noiseVol, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

        // Connect Noise Graph
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(volumeGain);
        noise.start(t);
      }

      // Connect Tone Graph (except for clap which handles it differently/minimally)
      if (soundType !== 'clap') {
        osc.connect(oscGain);
        oscGain.connect(volumeGain);
        osc.start(t);
        osc.stop(t + 0.4);
      }
    }
    // === HI-HATS / SHAKER ===
    else if (soundType.startsWith('hihat') || soundType === 'shaker') {
      const { source, output } = AudioEngine.createFilteredNoise(
        soundType === 'hihatOpen' ? 6000 : soundType === 'shaker' ? 12000 : 10000,
        soundType === 'hihatClosed' ? 3 : 1.5,
        soundType === 'hihatOpen' ? 0.4 : 0.15,
        t
      );
      const gain = AudioEngine.ctx.createGain();
      const highpass = AudioEngine.ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = soundType === 'hihatPedal' ? 3000 : 7000;
      const duration = soundType === 'hihatOpen' ? 0.35 : soundType === 'shaker' ? 0.1 : 0.06;
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + duration);
      output.connect(highpass);
      highpass.connect(gain);
      gain.connect(volumeGain);
      source.start(t);
      source.stop(t + duration + 0.1);
    }
    // === TOMS / TAIKO ===
    else if (soundType.startsWith('tom') || soundType === 'taiko') {
      const osc = AudioEngine.ctx.createOscillator();
      const gain = AudioEngine.ctx.createGain();
      osc.type = 'sine';
      const freq = soundType === 'tomLow' ? 80 : soundType === 'tomMid' ? 150 : soundType === 'tomHigh' ? 250 : 60;
      osc.frequency.setValueAtTime(freq * pitchMult * 1.5, t);
      osc.frequency.exponentialRampToValueAtTime(freq * pitchMult, t + 0.02);
      osc.frequency.exponentialRampToValueAtTime(freq * pitchMult * 0.7, t + 0.3);
      const vol = soundType === 'taiko' ? 0.8 : 0.6;
      const decay = soundType === 'taiko' ? 0.8 : 0.4;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + decay);
      osc.connect(gain);
      gain.connect(volumeGain);
      osc.start(t);
      osc.stop(t + decay + 0.1);
    }
    // === PERCUSSION ===
    else if (['conga', 'bongo', 'cowbell', 'woodblock'].includes(soundType)) {
      const osc = AudioEngine.ctx.createOscillator();
      const osc2 = AudioEngine.ctx.createOscillator();
      const gain = AudioEngine.ctx.createGain();
      if (soundType === 'cowbell') {
        osc.type = 'square';
        osc2.type = 'square';
        osc.frequency.value = 800 * pitchMult;
        osc2.frequency.value = 540 * pitchMult;
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        osc2.connect(gain);
        osc2.start(t);
        osc2.stop(t + 0.2);
      } else if (soundType === 'woodblock') {
        osc.type = 'sine';
        osc.frequency.value = 1200 * pitchMult;
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
      } else {
        osc.type = 'sine';
        const freq = soundType === 'conga' ? 200 : 350;
        osc.frequency.setValueAtTime(freq * pitchMult * 1.3, t);
        osc.frequency.exponentialRampToValueAtTime(freq * pitchMult, t + 0.02);
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
      }
      osc.connect(gain);
      gain.connect(volumeGain);
      osc.start(t);
      osc.stop(t + 0.3);
    }
    // === BASS ===
    else if (soundType.startsWith('bass')) {
      const notes = [baseFreq];
      if (config.chord === 'maj') { notes.push(baseFreq * 1.2599, baseFreq * 1.4983); }
      else if (config.chord === 'min') { notes.push(baseFreq * 1.1892, baseFreq * 1.4983); }

      // Special handling for Sub Bass - needs to be loud and clean
      if (soundType === 'bassSub') {
        notes.forEach((freq) => {
          const osc = AudioEngine.ctx.createOscillator();
          const osc2 = AudioEngine.ctx.createOscillator();
          const gain = AudioEngine.ctx.createGain();

          // Pure sine waves for deep sub bass
          osc.type = 'sine';
          osc2.type = 'sine';
          osc.frequency.value = freq || 55;
          osc2.frequency.value = (freq || 55) * 2; // Add octave for presence

          // Much louder volume for sub bass
          const vol = 0.7 / notes.length;
          gain.gain.setValueAtTime(vol, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + (variant.decay || 0.5));

          // Connect directly without filter for clean sub
          osc.connect(gain);
          osc2.connect(gain);
          gain.connect(volumeGain);

          osc.start(t);
          osc2.start(t);
          osc.stop(t + 0.7);
          osc2.stop(t + 0.7);
        });
      } else {
        // Other bass types
        notes.forEach((freq) => {
          const osc = AudioEngine.ctx.createOscillator();
          const osc2 = AudioEngine.ctx.createOscillator();
          const gain = AudioEngine.ctx.createGain();
          const filter = AudioEngine.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = soundType === 'bassWobble' ? 400 : 800;
          filter.Q.value = 5;
          if (soundType === 'bassWobble') {
            const lfo = AudioEngine.ctx.createOscillator();
            const lfoGain = AudioEngine.ctx.createGain();
            lfo.frequency.value = 4;
            lfoGain.gain.value = 300;
            lfo.connect(lfoGain);
            lfoGain.connect(filter.frequency);
            lfo.start(t);
            lfo.stop(t + 0.6);
          }
          osc.type = 'sawtooth';
          osc2.type = 'sine';
          osc.frequency.value = freq || 110;
          osc2.frequency.value = freq || 110;
          const vol = 0.6 / notes.length;
          gain.gain.setValueAtTime(vol, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + (variant.decay || 0.3));
          osc.connect(filter);
          osc2.connect(gain);
          filter.connect(gain);
          gain.connect(volumeGain);
          osc.start(t);
          osc2.start(t);
          osc.stop(t + 0.6);
          osc2.stop(t + 0.6);
        });
      }
    }
    // === SYNTHS ===
    else if (soundType.startsWith('synth')) {
      const notes = [baseFreq];
      if (config.chord === 'maj') { notes.push(baseFreq * 1.2599, baseFreq * 1.4983); }
      else if (config.chord === 'min') { notes.push(baseFreq * 1.1892, baseFreq * 1.4983); }
      notes.forEach((freq) => {
        const osc = AudioEngine.ctx.createOscillator();
        const gain = AudioEngine.ctx.createGain();
        const filter = AudioEngine.ctx.createBiquadFilter();
        if (soundType === 'synthPad') {
          osc.type = 'sawtooth';
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(200, t);
          filter.frequency.linearRampToValueAtTime(2000, t + 0.3);
          filter.frequency.linearRampToValueAtTime(800, t + 1.0);
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.4 / notes.length, t + 0.1);
          gain.gain.linearRampToValueAtTime(0.01, t + 1.0);
        } else if (soundType === 'synthPluck') {
          osc.type = 'sawtooth';
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(5000, t);
          filter.frequency.exponentialRampToValueAtTime(500, t + 0.15);
          gain.gain.setValueAtTime(0.5 / notes.length, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        } else if (soundType === 'synthStab') {
          osc.type = 'square';
          filter.type = 'lowpass';
          filter.frequency.value = 2000;
          gain.gain.setValueAtTime(0.45 / notes.length, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        } else {
          osc.type = 'square';
          filter.type = 'lowpass';
          filter.frequency.value = 3000;
          gain.gain.setValueAtTime(0.2 / notes.length, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
        }
        osc.frequency.value = freq;
        if (config.bend > 0) osc.frequency.linearRampToValueAtTime(freq * (1 + config.bend / 50), t + 0.1);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(volumeGain);
        osc.start(t);
        osc.stop(t + 1.2);
      });
    }
    // === KEYS ===
    else if (soundType.startsWith('keys')) {
      const notes = [baseFreq];
      if (config.chord === 'maj') { notes.push(baseFreq * 1.2599, baseFreq * 1.4983); }
      else if (config.chord === 'min') { notes.push(baseFreq * 1.1892, baseFreq * 1.4983); }
      notes.forEach((freq) => {
        const osc = AudioEngine.ctx.createOscillator();
        const osc2 = AudioEngine.ctx.createOscillator();
        const gain = AudioEngine.ctx.createGain();
        if (soundType === 'keysPiano') {
          osc.type = 'triangle';
          osc2.type = 'sine';
          osc2.frequency.value = freq * 2;
          gain.gain.setValueAtTime(0.35 / notes.length, t);
          gain.gain.exponentialRampToValueAtTime(0.15 / notes.length, t + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
        } else if (soundType === 'keysRhodes') {
          osc.type = 'sine';
          osc2.type = 'sine';
          osc2.frequency.value = freq * 3;
          gain.gain.setValueAtTime(0.25 / notes.length, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 1.0);
        } else if (soundType === 'keysOrgan') {
          osc.type = 'sine';
          osc2.type = 'sine';
          osc2.frequency.value = freq * 2;
          gain.gain.setValueAtTime(0.2 / notes.length, t);
          gain.gain.setValueAtTime(0.2 / notes.length, t + 0.4);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
        } else {
          osc.type = 'sine';
          osc2.type = 'sine';
          osc2.frequency.value = freq * 4;
          gain.gain.setValueAtTime(0.2 / notes.length, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 1.2);
        }
        osc.frequency.value = freq;
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(volumeGain);
        osc.start(t);
        osc2.start(t);
        osc.stop(t + 1.5);
        osc2.stop(t + 1.5);
      });
    }
    // === VOX ===
    else if (soundType.startsWith('vox')) {
      const osc = AudioEngine.ctx.createOscillator();
      const gain = AudioEngine.ctx.createGain();
      const filter = AudioEngine.ctx.createBiquadFilter();
      const filter2 = AudioEngine.ctx.createBiquadFilter();
      osc.type = 'sawtooth';
      osc.frequency.value = baseFreq;
      filter.type = 'bandpass';
      filter2.type = 'bandpass';
      filter.Q.value = 10;
      filter2.Q.value = 10;
      if (soundType === 'voxOoh') {
        filter.frequency.value = 400;
        filter2.frequency.value = 800;
      } else if (soundType === 'voxAah') {
        filter.frequency.value = 700;
        filter2.frequency.value = 1200;
      } else if (soundType === 'voxHey') {
        filter.frequency.setValueAtTime(600, t);
        filter.frequency.linearRampToValueAtTime(400, t + 0.1);
        filter2.frequency.value = 2000;
      } else {
        filter.frequency.value = 500;
        filter2.frequency.value = 1500;
        const osc2 = AudioEngine.ctx.createOscillator();
        osc2.type = 'sawtooth';
        osc2.frequency.value = baseFreq * 1.005;
        osc2.connect(filter);
        osc2.start(t);
        osc2.stop(t + 1.0);
      }
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.05);
      gain.gain.linearRampToValueAtTime(0.01, t + (variant.decay || 0.5));
      osc.connect(filter);
      filter.connect(filter2);
      filter2.connect(gain);
      gain.connect(volumeGain);
      osc.start(t);
      osc.stop(t + 1.0);
    }
    // === LEAD ===
    else if (soundType.startsWith('lead')) {
      const notes = [baseFreq];
      if (config.chord === 'maj') { notes.push(baseFreq * 1.2599, baseFreq * 1.4983); }
      else if (config.chord === 'min') { notes.push(baseFreq * 1.1892, baseFreq * 1.4983); }
      notes.forEach((freq) => {
        const osc = AudioEngine.ctx.createOscillator();
        const gain = AudioEngine.ctx.createGain();
        const filter = AudioEngine.ctx.createBiquadFilter();
        if (soundType === 'leadSaw') {
          osc.type = 'sawtooth';
          filter.type = 'lowpass';
          filter.frequency.value = 4000;
        } else if (soundType === 'leadSquare') {
          osc.type = 'square';
          filter.type = 'lowpass';
          filter.frequency.value = 3000;
        } else if (soundType === 'leadPluck') {
          osc.type = 'sawtooth';
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(8000, t);
          filter.frequency.exponentialRampToValueAtTime(500, t + 0.1);
        } else {
          osc.type = 'sawtooth';
          filter.type = 'lowpass';
          filter.frequency.value = 6000;
          filter.Q.value = 5;
        }
        osc.frequency.value = freq;
        if (config.bend > 0) osc.frequency.linearRampToValueAtTime(freq * (1 + config.bend / 30), t + 0.15);
        gain.gain.setValueAtTime(0.2 / notes.length, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + (variant.decay || 0.3));
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(volumeGain);
        osc.start(t);
        osc.stop(t + 0.5);
      });
    }
    // === ORCHESTRA ===
    else if (soundType.startsWith('orch')) {
      const notes = [baseFreq];
      if (config.chord === 'maj') { notes.push(baseFreq * 1.2599, baseFreq * 1.4983); }
      else if (config.chord === 'min') { notes.push(baseFreq * 1.1892, baseFreq * 1.4983); }
      notes.forEach((freq) => {
        const osc = AudioEngine.ctx.createOscillator();
        const osc2 = AudioEngine.ctx.createOscillator();
        const gain = AudioEngine.ctx.createGain();
        const filter = AudioEngine.ctx.createBiquadFilter();
        if (soundType === 'orchStrings') {
          osc.type = 'sawtooth';
          osc2.type = 'sawtooth';
          osc2.frequency.value = freq * 1.003;
          filter.type = 'lowpass';
          filter.frequency.value = 3000;
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.15 / notes.length, t + 0.15);
          gain.gain.linearRampToValueAtTime(0.01, t + 1.0);
        } else if (soundType === 'orchBrass') {
          osc.type = 'sawtooth';
          osc2.type = 'square';
          osc2.frequency.value = freq;
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(500, t);
          filter.frequency.linearRampToValueAtTime(3000, t + 0.1);
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.25 / notes.length, t + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        } else if (soundType === 'orchTimpani') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq * 1.5, t);
          osc.frequency.exponentialRampToValueAtTime(freq, t + 0.05);
          filter.type = 'lowpass';
          filter.frequency.value = 500;
          gain.gain.setValueAtTime(0.6 / notes.length, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
        } else {
          osc.type = 'triangle';
          osc2.type = 'sine';
          osc2.frequency.value = freq * 2;
          filter.type = 'lowpass';
          filter.frequency.value = 4000;
          gain.gain.setValueAtTime(0.25 / notes.length, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
        }
        osc.frequency.value = freq;
        osc.connect(filter);
        if (osc2.frequency.value) {
          osc2.connect(filter);
          osc2.start(t);
          osc2.stop(t + 1.2);
        }
        filter.connect(gain);
        gain.connect(volumeGain);
        osc.start(t);
        osc.stop(t + 1.2);
      });
    }
    // === FX ===
    else if (soundType.startsWith('fx')) {
      const osc = AudioEngine.ctx.createOscillator();
      const gain = AudioEngine.ctx.createGain();
      if (soundType === 'fxRiser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 8, t + 1.5);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.linearRampToValueAtTime(0.4, t + 1.4);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 1.5);
      } else if (soundType === 'fxImpact') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * 4, t);
        osc.frequency.exponentialRampToValueAtTime(20, t + 0.5);
        gain.gain.setValueAtTime(0.8, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
        const { source, output } = AudioEngine.createFilteredNoise(1000, 0.5, 0.3, t);
        const noiseGain = AudioEngine.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.4, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        output.connect(noiseGain);
        noiseGain.connect(volumeGain);
        source.start(t);
        source.stop(t + 0.3);
      } else if (soundType === 'fxLaser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(baseFreq * 2, t);
        osc.frequency.exponentialRampToValueAtTime(baseFreq / 4, t + 0.2);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
      } else {
        osc.type = 'square';
        osc.frequency.setValueAtTime(baseFreq / 2, t);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 2, t + 0.05);
        osc.frequency.exponentialRampToValueAtTime(baseFreq / 2, t + 0.1);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      }
      osc.connect(gain);
      gain.connect(volumeGain);
      osc.start(t);
      osc.stop(t + 1.6);
    }
    // === DEFAULT ===
    else {
      const osc = AudioEngine.ctx.createOscillator();
      const gain = AudioEngine.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = baseFreq;
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
      osc.connect(gain);
      gain.connect(volumeGain);
      osc.start(t);
      osc.stop(t + 0.4);
    }
  }
};

export default AudioEngine;
