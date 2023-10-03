import { Request, Response } from 'express';
import httpStatus from 'http-status';
import gamesService from '@/services/games-service';

export async function createGame(req: Request, res: Response) {
  const { homeTeamName, awayTeamName } = req.body;

  const game = await gamesService.createGame({ homeTeamName, awayTeamName });
  return res.status(httpStatus.CREATED).send(game);
}
