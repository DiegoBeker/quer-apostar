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

async function processPaymentToParticipants(gameId: number) {
  await prisma.$queryRaw`
    UPDATE "Participant" 
    SET "balance" = "balance" + (
      SELECT COALESCE(SUM("amountWon"), 0)
      FROM "Bet"
      WHERE "Bet"."participantId" = "Participant"."id"
      AND "Bet"."gameId" = ${gameId}
    )
    WHERE "id" IN (
      SELECT "participantId"
      FROM "Bet"
      WHERE "gameId" = ${gameId}
	    AND "status" = 'WON'
    );
  `;
}

async function findAll() {
  return prisma.participant.findMany({ orderBy: { id: 'asc' } });
}

const participantRepository = {
  create,
  findById,
  updateBalance,
  findAll,
  processPaymentToParticipants,
};

export default participantRepository;
