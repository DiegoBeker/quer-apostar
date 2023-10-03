import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

export async function create(data: Prisma.GameUncheckedCreateInput) {
  return prisma.game.create({
    data,
  });
}

const gameRepository = {
  create,
};

export default gameRepository;
