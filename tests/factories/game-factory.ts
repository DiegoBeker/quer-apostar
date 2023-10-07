import faker from '@faker-js/faker';
import { Game } from '@prisma/client';
import { prisma } from '@/config';

export async function createGame(params?: Partial<Game>) {
  return await prisma.game.create({
    data: {
      homeTeamName: params.homeTeamName || faker.company.companyName(),
      awayTeamName: params.awayTeamName || faker.company.companyName(),
    },
  });
}
