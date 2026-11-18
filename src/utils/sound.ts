let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctx) {
      audioCtx = new Ctx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export type SoundEffectType = 'correct' | 'incorrect' | 'complete' | 'tick';

export function playSoundEffect(type: SoundEffectType, muted: boolean): void {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'correct') {
      // Celebratory upbeat victory chime (C5 -> E5 -> G5 -> C6 + warm harmonic)
      const melody = [
        { freq: 523.25, delay: 0, dur: 0.16 },
        { freq: 659.25, delay: 0.075, dur: 0.18 },
        { freq: 783.99, delay: 0.15, dur: 0.2 },
        { freq: 1046.5, delay: 0.23, dur: 0.42 },
      ];

      melody.forEach(({ freq, delay, dur }) => {
        const osc = ctx.createOscillator();
        const shimmer = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + delay);

        shimmer.type = 'sine';
        shimmer.frequency.setValueAtTime(freq * 1.5, now + delay);

        const shimmerGain = ctx.createGain();
        shimmerGain.gain.setValueAtTime(0.04, now + delay);
        shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);

        gain.gain.setValueAtTime(0.001, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.22, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);

        osc.connect(gain);
        shimmer.connect(shimmerGain);
        shimmerGain.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        shimmer.start(now + delay);
        osc.stop(now + delay + dur + 0.02);
        shimmer.stop(now + delay + dur + 0.02);
      });
    } else if (type === 'incorrect') {
      // SpongeBob-style comedic "Womp Womp" descending brass/slide-trombone fail sound
      const playWomp = (
        startOffset: number,
        startFreq: number,
        endFreq: number,
        duration: number,
        withVibrato: boolean
      ) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(startFreq, now + startOffset);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + startOffset + duration);

        // Optional comedic wobble on the second long "wooooomp"
        if (withVibrato) {
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(6.5, now + startOffset);
          lfoGain.gain.setValueAtTime(5.5, now + startOffset);
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          lfo.start(now + startOffset);
          lfo.stop(now + startOffset + duration + 0.03);
        }

        // Wah-wah resonant lowpass sweep
        filter.type = 'lowpass';
        filter.Q.setValueAtTime(4.5, now + startOffset);
        filter.frequency.setValueAtTime(1050, now + startOffset);
        filter.frequency.exponentialRampToValueAtTime(240, now + startOffset + duration);

        gain.gain.setValueAtTime(0.001, now + startOffset);
        gain.gain.exponentialRampToValueAtTime(0.24, now + startOffset + 0.03);
        gain.gain.setValueAtTime(0.22, now + startOffset + duration * 0.65);
        gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + startOffset);
        osc.stop(now + startOffset + duration + 0.03);
      };

      // First short "womp"
      playWomp(0, 233.08, 196.0, 0.27, false);
      // Second longer descending "wooooomp"
      playWomp(0.31, 185.0, 130.81, 0.62, true);
    } else if (type === 'complete') {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.001, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.22, now + idx * 0.09 + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.46);
      });
    } else if (type === 'tick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch {
    // Audio playback is optional enhancement
  }
}
