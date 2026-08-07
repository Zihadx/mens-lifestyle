import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculate(target: number): TimeLeft {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isExpired: diff <= 0,
  };
}

/** Countdown to a fixed target timestamp (ms). Client-only — safe to call with a stable target computed once. */
export function useCountdown(targetTimestamp: number): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculate(targetTimestamp));

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(calculate(targetTimestamp)), 1000);
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  return timeLeft;
}
