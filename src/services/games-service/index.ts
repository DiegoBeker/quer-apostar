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

  if (game.isFinished) throw { name: 'Forbidden', message: 'Game is already finished' };

  const totalAmount = await betRepository.findTotalAmountById(gameId);
  const totalWinnersAmount = await betRepository.findTotalWinnersAmountById(gameId, homeTeamScore, awayTeamScore);

  await betRepository.processLostBets(gameId, homeTeamScore, awayTeamScore);

  await betRepository.processWinnerBets(gameId, { ...data, totalAmount, totalWinnersAmount });

  await participantRepository.processPaymentToParticipants(gameId);

  return gameRepository.finishGame(gameId, data);
}

async function findAll() {
  return await gameRepository.findAll();
}

async function findGameById(gameId: number) {
  return await gameRepository.findByIdWithBets(gameId);
}

export default {
  createGame,
  finishGame,
  findAll,
  findGameById,
};
