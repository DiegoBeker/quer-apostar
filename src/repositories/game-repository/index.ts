import { Prisma } from '../../../node_modules/prisma/prisma-client';
import { prisma } from '../../config';
import { FinishGameParams } from '../../protocols';

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

async function findByIdWithBets(id: number) {
  return prisma.game.findUnique({
    where: {
      id,
    },
    include: {
      Bet: true,
    },
  });
}

async function finishGame(id: number, data: FinishGameParams) {
  return prisma.game.update({
    data: { ...data, isFinished: true },
    where: {
      id,
    },
  });
}

async function findAll() {
  return await prisma.game.findMany();
}

const gameRepository = {
  create,
  findById,
  finishGame,
  findAll,
  findByIdWithBets,
};

export default gameRepository;
