export function categorizeMood(
  maxEnergy: number,
  finalTempo: "slow" | "mid" | "fast"
): "happy" | "confident" | "dreamy" | "calm" | "angry" | "sad" {
  if (maxEnergy >= 0.7) {
    if (finalTempo === "fast") return "angry";
    if (finalTempo === "mid") return "confident";
    if (finalTempo === "slow") return "confident";
  }

  if (maxEnergy >= 0.4) { // medium energy
    if (finalTempo === "fast") return "happy";
    if (finalTempo === "mid") return "dreamy";
    if (finalTempo === "slow") return "calm";
  }

  // low energy: < 0.4
  if (finalTempo === "fast") return "angry";
  if (finalTempo === "mid") return "sad";
  return "calm";
}