import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

async function create(data: Prisma.GameUncheckedCreateInput) {
  return prisma.game.create({
    data,
  });
}

async function findById(id: number) {
  return prisma.game.findUnique({
    where: {
      id,
    },
  });
}

const gameRepository = {
  create,
  findById,
};

export default gameRepository;
