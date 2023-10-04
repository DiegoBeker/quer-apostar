import { Request, Response } from 'express';
import httpStatus from 'http-status';
import gamesService from '@/services/games-service';

export async function createGame(req: Request, res: Response) {
  const { homeTeamName, awayTeamName } = req.body;

  const game = await gamesService.createGame({ homeTeamName, awayTeamName });
  return res.status(httpStatus.CREATED).send(game);
}

export async function finishGame(req: Request, res: Response) {
  const { homeTeamScore, awayTeamScore } = req.body;
  const gameId = parseInt(req.params.id);

  if (isNaN(gameId) || gameId <= 0) throw { name: 'BadRequest', message: 'Id inválido' };

  const finishedGame = await gamesService.finishGame(gameId, { homeTeamScore, awayTeamScore });

  return res.status(httpStatus.OK).send(finishedGame);
}
