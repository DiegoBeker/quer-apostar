import { Game, Participant } from '@prisma/client';

export function validateBet(participant: Participant, game: Game, amountBet: number) {
  if (!participant) throw { name: 'NotFoundError', message: 'Participant does not exist' };
  if (!game) throw { name: 'NotFoundError', message: 'Game does not exist' };
  if (amountBet > participant.balance) throw { name: 'Forbidden', message: 'Balance is not enough' };
  if (game.isFinished) throw { name: 'Forbidden', message: 'Game is finished' };
}
