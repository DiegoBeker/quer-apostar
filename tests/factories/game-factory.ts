import { Game } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { prisma } from '@/config';

export async function createGame(params?: Partial<Game>, isFinished?: boolean) {
  return await prisma.game.create({
    data: {
      homeTeamName: params.homeTeamName || faker.company.name(),
      awayTeamName: params.awayTeamName || faker.company.name(),
      isFinished,
    },
  });
}
