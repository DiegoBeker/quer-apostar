import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createBet(gameId: number, participantId: number, amountBet: number) {
  return prisma.bet.create({
    data: {
      homeTeamScore: faker.datatype.number(5),
      awayTeamScore: faker.datatype.number(5),
      amountBet,
      gameId,
      participantId,
    },
  });
}
