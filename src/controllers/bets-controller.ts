import { Request, Response } from 'express';
import httpStatus from 'http-status';
import betsService from '@/services/bets-service';

export async function createBet(req: Request, res: Response) {
  const { homeTeamScore, awayTeamScore, amountBet, gameId, participantId } = req.body;

  const bet = await betsService.createBet({ homeTeamScore, awayTeamScore, amountBet, gameId, participantId });
  return res.status(httpStatus.CREATED).send(bet);
}
