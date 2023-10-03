import { Game, Participant } from '@prisma/client';
import { CreateBetParams } from '@/protocols';
import betRepository from '@/repositories/bet-repository';
import gameRepository from '@/repositories/game-repository';
import participantRepository from '@/repositories/participant-repository';

async function createBet(data: CreateBetParams) {
  const { participantId, gameId, amountBet } = data;

  const participant = await participantRepository.findById(participantId);
  const game = await gameRepository.findById(gameId);

  validateBet(participant, game, amountBet);

  const balanceToUpdate = participant.balance - amountBet;
  await participantRepository.updateBalance(participant.id, balanceToUpdate);

  return betRepository.create(data);
}

export default {
  createBet,
};

function validateBet(participant: Participant, game: Game, amountBet: number) {
  if (!participant) throw { name: 'NotFoundError', message: 'Participant does not exist' };
  if (!game) throw { name: 'NotFoundError', message: 'Game does not exist' };
  if (amountBet > participant.balance) throw { name: 'Forbidden', message: 'Balance is not enough' };
  if (game.isFinished) throw { name: 'Forbidden', message: 'Game is finished' };
}
