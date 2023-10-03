import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

export async function create(data: Prisma.ParticipantUncheckedCreateInput) {
  return prisma.participant.create({
    data,
  });
}

const participantRepository = {
  create,
};

export default participantRepository;
