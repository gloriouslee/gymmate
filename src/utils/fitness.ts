import { SetLog, UnitType } from '@/types/gym';

// Calculate Estimated 1 Rep Max using Epley's formula
export function calculateEstimated1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  // Epley formula: 1RM = weight * (1 + reps / 30)
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

// Convert weight between kg and lb
export function convertWeight(valueInKg: number, targetUnit: UnitType): number {
  if (targetUnit === 'lb') {
    return Math.round(valueInKg * 2.20462 * 10) / 10;
  }
  return valueInKg;
}

// Format weight with unit string
export function formatWeight(valueInKg: number, unit: UnitType): string {
  const converted = convertWeight(valueInKg, unit);
  return `${converted} ${unit}`;
}

// Calculate Total Volume (weight * reps) for completed sets
export function calculateSessionVolume(sets: SetLog[]): number {
  return sets
    .filter(s => s.completed)
    .reduce((sum, s) => sum + (s.actualWeight * s.actualReps), 0);
}

// Calculate WHOOP-like Strain score (0.0 - 21.0 scale logarithmic)
export function calculateWorkoutStrain(volume: number, durationSeconds: number, avgRpe: number = 8): number {
  if (durationSeconds < 60 || volume <= 0) return 4.0;
  // Realistic logarithmic formula tuned to 10 - 18 strain for typical gym workouts
  const durationFactor = Math.log10(durationSeconds / 60 + 1) * 4;
  const volumeFactor = Math.log10(volume / 500 + 1) * 3;
  const intensityFactor = (avgRpe / 10) * 3;
  const strain = Math.min(21.0, Math.max(4.0, durationFactor + volumeFactor + intensityFactor));
  return Math.round(strain * 10) / 10;
}

// Format seconds into MM:SS or HH:MM:SS
export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Audio timer chime using Web Audio API (no external sound files required)
export function playRestTimerChime(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    
    // Play dual ascending tone (880Hz -> 1320Hz)
    const now = ctx.currentTime;
    
    // First tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now); // A5
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.15);

    // Second celebratory tone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now + 0.18); // E6
    gain2.gain.setValueAtTime(0.4, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.18);
    osc2.stop(now + 0.5);
  } catch {
    // AudioContext might be blocked until user gesture, safely ignore
  }
}

// Screen Wake Lock API helper
export async function requestWakeLock(): Promise<WakeLockSentinel | null> {
  if (typeof window === 'undefined' || !('wakeLock' in navigator)) return null;
  try {
    const sentinel = await navigator.wakeLock.request('screen');
    return sentinel;
  } catch {
    return null;
  }
}
