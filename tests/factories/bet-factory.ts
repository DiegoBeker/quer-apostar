import betsService from '@/services/bets-service';
import { CreateBetParams } from '@/protocols';

export async function createBet(
  gameId: number,
  participantId: number,
  amountBet: number,
  homeTeamScore: number,
  awayTeamScore: number,
) {
  const data: CreateBetParams = { participantId, gameId, amountBet, homeTeamScore, awayTeamScore };
  return await betsService.createBet(data);
}
