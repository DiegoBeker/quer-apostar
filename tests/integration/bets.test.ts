import supertest from 'supertest';
import httpStatus from 'http-status';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { cleanDb } from '../helpers';
import { createParticipant } from '../factories/participant-factory';
import { createGame } from '../factories/game-factory';
import app, { init } from '@/app';
import { prisma } from '@/config';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('POST /bets', () => {
  const generateValidBody = (gameId: number, participantId: number, amountBet?: number) => ({
    homeTeamScore: faker.number.int(8),
    awayTeamScore: faker.number.int(8),
    amountBet: amountBet || 1000,
    gameId,
    participantId,
  });

  it('should respond with status 400 when body is not valid', async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post('/bets').send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 404 when game does not exist', async () => {
    const participant = await createParticipant();
    const fakeGameId = 9999999;
    const body = generateValidBody(fakeGameId, participant.id);
    const response = await server.post('/bets').send(body);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 when participant does not exist', async () => {
    const game = await createGame({ homeTeamName: 'Corinthians', awayTeamName: 'Palmeiras' });
    const fakeId = 9999999;
    const body = generateValidBody(game.id, fakeId);
    const response = await server.post('/bets').send(body);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 403 when balance is not enough for the bet', async () => {
    const game = await createGame({ homeTeamName: 'Corinthians', awayTeamName: 'Palmeiras' });
    const participant = await createParticipant();
    const HIGH_AMOUNT = 5000000;
    const body = generateValidBody(game.id, participant.id, HIGH_AMOUNT);
    const response = await server.post('/bets').send(body);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 403 when game is already finished', async () => {
    const finishedGame = await createGame({ homeTeamName: 'Corinthians', awayTeamName: 'Palmeiras' }, true);
    const participant = await createParticipant();
    const body = generateValidBody(finishedGame.id, participant.id);

    const response = await server.post('/bets').send(body);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 201 when bet is created', async () => {
    const game = await createGame({ homeTeamName: 'Corinthians', awayTeamName: 'Palmeiras' });
    const participant = await createParticipant();
    const body = generateValidBody(game.id, participant.id);

    const response = await server.post('/bets').send(body);

    expect(response.status).toBe(httpStatus.CREATED);
    expect(response.body).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      homeTeamScore: body.homeTeamScore,
      awayTeamScore: body.awayTeamScore,
      amountBet: body.amountBet,
      gameId: game.id,
      participantId: participant.id,
      status: 'PENDING',
      amountWon: null,
    });
    const participantCheck = await prisma.participant.findUnique({ where: { id: participant.id } });

    expect(participantCheck).toEqual({
      id: expect.any(Number),
      name: participant.name,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      balance: participant.balance - body.amountBet,
    });
  });
});
