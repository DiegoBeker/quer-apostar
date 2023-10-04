import { Prisma } from '@prisma/client';
import { prisma } from '@/config';
import { ProcessWinnersParams, TotalAmountResult } from '@/protocols';
import { calculateMultiplier } from '@/utils/calculate';

export async function create(data: Prisma.BetUncheckedCreateInput) {
  return prisma.bet.create({
    data,
  });
}

async function findTotalAmountById(id: number) {
  const result = await prisma.$queryRaw<TotalAmountResult[]>`
    SELECT COALESCE(SUM("amountBet"), 0) AS "totalAmount"
    FROM "Bet"
    WHERE "gameId" = ${id};
  `;

  const total = parseInt(result[0].totalAmount.toString()) || 0;
  return total;
}

async function findTotalWinnersAmountById(id: number, homeTeamScore: number, awayTeamScore: number) {
  const result = await prisma.$queryRaw<TotalAmountResult[]>`
    SELECT COALESCE(SUM("amountBet"), 0) AS "totalAmount"
    FROM "Bet"
    WHERE "gameId" = ${id} AND "homeTeamScore" = ${homeTeamScore} AND "awayTeamScore" = ${awayTeamScore}
  `;

  const total = parseInt(result[0].totalAmount.toString());
  return total;
}

export async function processLostBets(gameId: number, homeTeamScore: number, awayTeamScore: number) {
  return await prisma.bet.updateMany({
    where: {
      gameId,
      NOT: {
        homeTeamScore,
        awayTeamScore,
      },
    },
    data: {
      status: 'LOST',
      amountWon: 0,
    },
  });
}

export async function processWinnerBets(gameId: number, params: ProcessWinnersParams) {
  const result = await prisma.$queryRaw`
    UPDATE "Bet" 
    SET "status" = 'WON', 
        "amountWon" = FLOOR("amountBet" * ${calculateMultiplier(params.totalWinnersAmount, params.totalAmount)})
    WHERE "gameId"= ${gameId} 
      AND "homeTeamScore" = ${params.homeTeamScore}
      AND "awayTeamScore" = ${params.awayTeamScore}
      AND "status" = 'PENDING'
  `;
  return result;
}

const betRepository = {
  create,
  findTotalAmountById,
  findTotalWinnersAmountById,
  processLostBets,
  processWinnerBets,
};

export default betRepository;
