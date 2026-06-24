interface ScoreParams {
  baseScore: number;
  timeLeft: number;
  speedMultiplier: number;
  comboCount: number;
}

export function calculateScore({
  baseScore,
  timeLeft,
  speedMultiplier,
  comboCount,
}: ScoreParams): number {
  const speedBonus = Math.max(0, timeLeft) * speedMultiplier;
  const comboMultiplier = getComboMultiplier(comboCount);
  return Math.round((baseScore + speedBonus) * comboMultiplier);
}

export function getComboMultiplier(combo: number): number {
  if (combo >= 8) return 2.0;
  if (combo >= 5) return 1.5;
  if (combo >= 3) return 1.2;
  return 1.0;
}
