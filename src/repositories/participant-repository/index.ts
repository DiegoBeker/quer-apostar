import { Prisma } from '../../../node_modules/prisma/prisma-client';
import { prisma } from '../../config';

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
  const query = `
  UPDATE "Participant" 
    SET "balance" = "balance"::integer + (
      SELECT COALESCE(SUM("amountWon"), 0)
      FROM "Bet"
      WHERE "Bet"."participantId" = "Participant"."id"
      AND "Bet"."gameId" = ${gameId}
    )::integer
    WHERE "id" IN (
      SELECT "participantId"
      FROM "Bet"
      WHERE "gameId" = ${gameId}
	    AND "status" = 'WON'
    );
  `;

  const update = await prisma.$executeRawUnsafe(query);

  return update;
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
