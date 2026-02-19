import { useEffect, useRef, useState } from "react";

function calculateRMS(buffer: Float32Array): number {
  let sumSquares = 0;
  for (let i = 0; i < buffer.length; i++) {
    sumSquares += buffer[i] * buffer[i];
  }
  return Math.sqrt(sumSquares / buffer.length);
}

function estimateTempo(rmsHistory: number[], sampleRate: number, frameSize: number): number | null {
  if (rmsHistory.length < 2) return null;

  const recentRMS = rmsHistory.slice(-50); 
  const threshold = recentRMS.reduce((a, b) => a + b, 0) / recentRMS.length * 1.2;

  const peaks: number[] = [];
  for (let i = 1; i < rmsHistory.length - 1; i++) {
    if (
      rmsHistory[i] > threshold &&
      rmsHistory[i] > rmsHistory[i - 1] &&
      rmsHistory[i] > rmsHistory[i + 1]
    ) {
      peaks.push(i);
    }
  }

  if (peaks.length < 2) return null;

  const intervals = peaks.slice(1).map((p, i) => p - peaks[i]);

  const minInterval = sampleRate * 60 / 200 / frameSize;
  const maxInterval = sampleRate * 60 / 60 / frameSize;
  const validIntervals = intervals.filter(i => i >= minInterval && i <= maxInterval);
  if (validIntervals.length === 0) return null;

  const avgInterval = validIntervals.reduce((a, b) => a + b, 0) / validIntervals.length;
  const secondsPerBeat = (avgInterval * frameSize) / sampleRate;
  return 60 / secondsPerBeat;
}

export function useAudioAnalysis(audioElement: HTMLAudioElement | null, isPlaying: boolean) {
  const [energy, setEnergy] = useState(0);
  const [tempo, setTempo] = useState<"slow" | "mid" | "fast">("mid");

  // Final results set only once at the end
  const [maxEnergy, setMaxEnergy] = useState(0);
  const [finalTempo, setFinalTempo] = useState<"slow" | "mid" | "fast" | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rmsHistoryRef = useRef<number[]>([]);
  const rafRef = useRef<number | undefined>(undefined);

  const START_DELAY_SECONDS = 1;

useEffect(() => {
  if (!audioElement) return;

  // Only create a new context if it doesn't exist
  if (!audioCtxRef.current) {
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaElementSource(audioElement);

    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 1024;

    audioCtxRef.current = audioCtx;
    analyserRef.current = analyser;
  }

  const analyser = analyserRef.current!;
  const buffer = new Float32Array(analyser.fftSize);

  let currentMaxEnergy = 0;
  let lastTempo: "slow" | "mid" | "fast" | null = null;
  const rmsHistory: number[] = [];

  const analyze = () => {
    analyser.getFloatTimeDomainData(buffer);
    const rms = calculateRMS(buffer);
    rmsHistory.push(rms);
    if (rmsHistory.length > 300) rmsHistory.shift();

    setEnergy(rms);
    if (rms > currentMaxEnergy) currentMaxEnergy = rms;

    const bpm = estimateTempo(rmsHistory, audioCtxRef.current!.sampleRate, analyser.fftSize);
    if (bpm) {
      if (bpm < 90) lastTempo = "slow";
      else if (bpm < 130) lastTempo = "mid";
      else lastTempo = "fast";

      setTempo(lastTempo);
    }

    rafRef.current = requestAnimationFrame(analyze);
  };

  analyze();

  // Final results on ended
  const handleEnded = () => {
    setMaxEnergy(currentMaxEnergy);
    setFinalTempo(lastTempo);
  };

  audioElement.addEventListener("ended", handleEnded);

  return () => {
    cancelAnimationFrame(rafRef.current!);
    audioElement.removeEventListener("ended", handleEnded);
    // Only close context if audio element changes or component unmounts
    if (audioElement.paused || audioElement.ended) {
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
      analyserRef.current = null;
    }
  };
}, [audioElement]);



  return { energy, tempo, maxEnergy, finalTempo };
}
