import { CreateBetParams } from '@/protocols';
import betRepository from '@/repositories/bet-repository';
import gameRepository from '@/repositories/game-repository';
import participantRepository from '@/repositories/participant-repository';
import { validateBet } from '@/utils/validateBet';

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
