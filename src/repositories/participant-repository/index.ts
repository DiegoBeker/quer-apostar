import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

async function create(data: Prisma.ParticipantUncheckedCreateInput) {
  return prisma.participant.create({
    data,
  });
}

async function findById(id: number) {
  return prisma.participant.findUnique({
    where: {
      id,
    },
  });
}

async function updateBalance(id: number, balance: number) {
  return prisma.participant.update({
    data: { balance },
    where: {
      id,
    },
  });
}

const participantRepository = {
  create,
  findById,
  updateBalance,
};

export default participantRepository;
