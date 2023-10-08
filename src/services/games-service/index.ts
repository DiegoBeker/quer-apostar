import { forbiddenError, notFoundError } from '@/errors';
import { CreateGameParams, FinishGameParams } from '@/protocols';
import betRepository from '@/repositories/bet-repository';
import gameRepository from '@/repositories/game-repository';
import participantRepository from '@/repositories/participant-repository';

async function createGame(data: CreateGameParams) {
  return gameRepository.create(data);
}

async function finishGame(gameId: number, data: FinishGameParams) {
  const { homeTeamScore, awayTeamScore } = data;

  const game = await gameRepository.findById(gameId);

  if (!game) throw notFoundError('Game does not exist');

  if (game.isFinished) throw forbiddenError('Game is already finished');

  const totalAmount = await betRepository.findTotalAmountById(gameId);

  const totalWinnersAmount = await betRepository.findTotalWinnersAmountById(gameId, homeTeamScore, awayTeamScore);

  await betRepository.processLostBets(gameId, homeTeamScore, awayTeamScore);

  await betRepository.processWinnerBets(gameId, { ...data, totalAmount, totalWinnersAmount });

  await participantRepository.processPaymentToParticipants(gameId);

  const finish = await gameRepository.finishGame(gameId, data);

  return finish;
}

async function findAll() {
  return await gameRepository.findAll();
}

async function findGameById(gameId: number) {
  const game = await gameRepository.findByIdWithBets(gameId);
  if (!game) throw notFoundError('Game does not exist');
  return game;
}

export default {
  createGame,
  finishGame,
  findAll,
  findGameById,
};
