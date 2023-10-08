import httpStatus from 'http-status';
import supertest from 'supertest';
import { Game } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { cleanDb } from '../helpers';
import { createGame } from '../factories/game-factory';
import { createParticipant } from '../factories/participant-factory';
import { createBet } from '../factories/bet-factory';
import app, { init } from '@/app';
import { calculateMultiplier } from '@/utils/calculate';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('POST /games', () => {
  it('should respond with status 400 if body is not given', async () => {
    const response = await server.post('/games');

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 when body is not valid', async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post('/games').send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe('when body is valid', () => {
    const generateValidBody = () => ({
      homeTeamName: faker.company.name(),
      awayTeamName: faker.company.name(),
    });

    it('should respond with status 201 when body is valid', async () => {
      const body = generateValidBody();

      const response = await server.post('/games').send(body);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual<Game>({
        id: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        homeTeamName: body.homeTeamName,
        awayTeamName: body.awayTeamName,
        homeTeamScore: 0,
        awayTeamScore: 0,
        isFinished: false,
      });
    });
  });
});

describe('POST /games/:id/finish', () => {
  it('should respond with status 400 if param id is invalid', async () => {
    const response = await server.post('/games/invalid/finish');

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 if param id is invalid', async () => {
    const response = await server.post('/games/0/finish');

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 when body is not valid', async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post('/games/1/finish').send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe('when body is valid', () => {
    const generateValidBody = (homeTeamScore?: number, awayTeamScore?: number) => ({
      homeTeamScore: homeTeamScore || faker.datatype.number(8),
      awayTeamScore: awayTeamScore || faker.datatype.number(8),
    });

    it('should respond with status 404 when game does not exist', async () => {
      const body = generateValidBody();

      const response = await server.post('/games/9999/finish').send(body);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 when game is already finished', async () => {
      const body = generateValidBody();
      const createdGame: Game = await createGame({ homeTeamName: 'Corinthians', awayTeamName: 'Palmeiras' });

      await server.post(`/games/${createdGame.id}/finish`).send(body);
      const response = await server.post(`/games/${createdGame.id}/finish`).send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 200 when body is valid', async () => {
      const body = generateValidBody();
      const createdGame: Game = await createGame({ homeTeamName: 'Corinthians', awayTeamName: 'Palmeiras' });

      const response = await server.post(`/games/${createdGame.id}/finish`).send(body);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: createdGame.id,
        createdAt: createdGame.createdAt.toISOString(),
        updatedAt: expect.any(String),
        homeTeamName: createdGame.homeTeamName,
        awayTeamName: createdGame.awayTeamName,
        homeTeamScore: body.homeTeamScore,
        awayTeamScore: body.awayTeamScore,
        isFinished: true,
      });
    });
    it('should respond with status 200 when body is valid', async () => {
      const game: Game = await createGame({ homeTeamName: 'Corinthians', awayTeamName: 'Palmeiras' });
      const participant = await createParticipant();
      const participant1 = await createParticipant();
      const participant2 = await createParticipant();

      await createBet(game.id, participant.id, 1000, 1, 1);
      await createBet(game.id, participant1.id, 2000, 1, 1);
      const bet2 = await createBet(game.id, participant2.id, 3000, 2, 1);
      const body = generateValidBody(bet2.homeTeamScore, bet2.awayTeamScore);

      const response = await server.post(`/games/${game.id}/finish`).send(body);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: game.id,
        createdAt: game.createdAt.toISOString(),
        updatedAt: expect.any(String),
        homeTeamName: game.homeTeamName,
        awayTeamName: game.awayTeamName,
        homeTeamScore: body.homeTeamScore,
        awayTeamScore: body.awayTeamScore,
        isFinished: true,
      });
      const totalBetAmount = 6000;
      const totalWinnersAmount = 3000;
      const multiplier = calculateMultiplier(totalWinnersAmount, totalBetAmount);

      const response2 = await server.get('/participants');

      expect(response2.status).toBe(httpStatus.OK);
      expect(response2.body[0]).toEqual({
        id: participant.id,
        createdAt: participant.createdAt.toISOString(),
        updatedAt: expect.any(String),
        name: participant.name,
        balance: participant.balance - 1000,
      });
      expect(response2.body[1]).toEqual({
        id: participant1.id,
        createdAt: participant1.createdAt.toISOString(),
        updatedAt: expect.any(String),
        name: participant1.name,
        balance: participant1.balance - 2000,
      });
      expect(response2.body[2]).toEqual({
        id: participant2.id,
        createdAt: participant2.createdAt.toISOString(),
        updatedAt: expect.any(String),
        name: participant2.name,
        balance: participant2.balance - 3000 + 3000 * multiplier,
      });
    });
  });
});

describe('GET /games', () => {
  it('should respond with status 200 when there is no games', async () => {
    const response = await server.get('/games');

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual([]);
  });

  it('should respond with status 200 with games', async () => {
    const createdGame: Game = await createGame({ homeTeamName: 'Corinthians', awayTeamName: 'Palmeiras' });
    const createdGame2: Game = await createGame({ homeTeamName: 'Flamengo', awayTeamName: 'Vasco' });

    const response = await server.get('/games');

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toEqual({
      id: createdGame.id,
      createdAt: createdGame.createdAt.toISOString(),
      updatedAt: createdGame.updatedAt.toISOString(),
      homeTeamName: createdGame.homeTeamName,
      awayTeamName: createdGame.awayTeamName,
      homeTeamScore: 0,
      awayTeamScore: 0,
      isFinished: false,
    });
    expect(response.body[1]).toEqual({
      id: createdGame2.id,
      createdAt: createdGame2.createdAt.toISOString(),
      updatedAt: createdGame2.updatedAt.toISOString(),
      homeTeamName: createdGame2.homeTeamName,
      awayTeamName: createdGame2.awayTeamName,
      homeTeamScore: 0,
      awayTeamScore: 0,
      isFinished: false,
    });
  });
});

describe('GET /games/:id', () => {
  it('should respond with status 404 when game does not exist', async () => {
    const response = await server.get('/games/99999');

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 200 with a game with bets', async () => {
    const game = await createGame({ homeTeamName: 'Corinthians', awayTeamName: 'Palmeiras' });
    const participant = await createParticipant();
    const bet = await createBet(game.id, participant.id, 1000, 1, 1);

    const response = await server.get(`/games/${game.id}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual({
      id: game.id,
      createdAt: game.createdAt.toISOString(),
      updatedAt: game.updatedAt.toISOString(),
      homeTeamName: game.homeTeamName,
      awayTeamName: game.awayTeamName,
      homeTeamScore: 0,
      awayTeamScore: 0,
      isFinished: false,
      Bet: [
        {
          id: bet.id,
          createdAt: bet.createdAt.toISOString(),
          updatedAt: bet.updatedAt.toISOString(),
          homeTeamScore: bet.homeTeamScore,
          awayTeamScore: bet.awayTeamScore,
          amountBet: bet.amountBet,
          gameId: game.id,
          participantId: participant.id,
          status: 'PENDING',
          amountWon: null,
        },
      ],
    });
  });
});
