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

  const finishedGame = await gamesService.finishGame(gameId, { homeTeamScore, awayTeamScore });

  return res.status(httpStatus.OK).send(finishedGame);
}

export async function findAllGames(req: Request, res: Response) {
  const games = await gamesService.findAll();
  return res.status(httpStatus.OK).send(games);
}

export async function findGameById(req: Request, res: Response) {
  const gameId = parseInt(req.params.id);
  const game = await gamesService.findGameById(gameId);
  return res.status(httpStatus.OK).send(game);
}
