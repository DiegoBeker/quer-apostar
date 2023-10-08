import { Game, Participant } from '../../node_modules/prisma/prisma-client';
import { forbiddenError, notFoundError } from '../errors';

export function validateBet(participant: Participant, game: Game, amountBet: number) {
  if (!participant) throw notFoundError('Participant does not exist');
  if (!game) throw notFoundError('Game does not exist');
  if (amountBet > participant.balance) throw forbiddenError('Balance is not Enough');
  if (game.isFinished) throw forbiddenError('Game is finished');
}
