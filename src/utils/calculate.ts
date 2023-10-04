const TAX = 0.3;

export function calculateMultiplier(totalWinnersAmount: number, totalAmonunt: number) {
  const multiplier = (1 / totalWinnersAmount) * totalAmonunt * (1 - TAX);
  return multiplier;
}
