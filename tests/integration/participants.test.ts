import httpStatus from 'http-status';
import supertest from 'supertest';
import { Participant } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { cleanDb } from '../helpers';
import { createParticipant } from '../factories/participant-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('POST /participants', () => {
  it('should respond with status 400 if body is not given', async () => {
    const response = await server.post('/participants');

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 when body is not valid', async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post('/participants').send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe('when body is valid', () => {
    const generateValidBody = (min?: number, max?: number) => ({
      name: faker.person.fullName(),
      balance: faker.number.int({ min: min || 10000, max: max || 1000000 }),
    });

    it('should respond with status 201 when body is valid', async () => {
      const body = generateValidBody();

      const response = await server.post('/participants').send(body);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual<Participant>({
        id: expect.any(Number),
        name: body.name,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        balance: body.balance,
      });
    });

    it('should respond with status 403 when balance is not enough', async () => {
      const body = generateValidBody(1, 999);

      const response = await server.post('/participants').send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
  });
});

describe('GET /participants', () => {
  it('should respond with status 200 when there is no participants', async () => {
    const response = await server.get('/participants');

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual([]);
  });

  it('should respond with status 200 whith participants', async () => {
    const participant = await createParticipant();
    const participant2 = await createParticipant();

    const response = await server.get('/participants');

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toEqual({
      id: participant.id,
      createdAt: participant.createdAt.toISOString(),
      updatedAt: participant.updatedAt.toISOString(),
      name: participant.name,
      balance: participant.balance,
    });
    expect(response.body[1]).toEqual({
      id: participant2.id,
      createdAt: participant2.createdAt.toISOString(),
      updatedAt: participant2.updatedAt.toISOString(),
      name: participant2.name,
      balance: participant2.balance,
    });
  });
});
