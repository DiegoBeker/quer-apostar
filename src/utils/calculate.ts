const TAX = 0.3;

export function calculateMultiplier(totalWinnersAmount: number, totalAmonunt: number): number {
  if (totalWinnersAmount === 0) {
    return 1;
  } else {
    const multiplier = (1 / totalWinnersAmount) * totalAmonunt * (1 - TAX);
    return multiplier;
  }
}
