import { useState, useCallback } from 'react';

// Singleton global de AudioContext para prevenir fugas de memoria o saturación de hardware
let sharedAudioCtx: AudioContext | null = null;

function getSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!sharedAudioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        sharedAudioCtx = new AudioCtx();
      }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

export function useTactileAudio() {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playClick = useCallback(
    (type: 'check' | 'uncheck' | 'pop' | 'tick' | 'wood' | 'snap' | 'chime' = 'check') => {
      if (!soundEnabled) return;
      const ctx = getSharedAudioContext();
      if (!ctx) return;

      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;
        if (type === 'check') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(380, now);
          osc.frequency.exponentialRampToValueAtTime(740, now + 0.055);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
          osc.start(now);
          osc.stop(now + 0.065);
        } else if (type === 'uncheck') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(310, now);
          osc.frequency.exponentialRampToValueAtTime(190, now + 0.05);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
          osc.start(now);
          osc.stop(now + 0.055);
        } else {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(620, now + 0.03);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
          osc.start(now);
          osc.stop(now + 0.035);
        }
      } catch {
        // Silencio en caso de bloqueo de políticas del navegador
      }
    },
    [soundEnabled]
  );

  return { soundEnabled, setSoundEnabled, playClick };
}
