import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

export async function create(data: Prisma.BetUncheckedCreateInput) {
  return prisma.bet.create({
    data,
  });
}

const betRepository = {
  create,
};

export default betRepository;
