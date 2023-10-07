import httpStatus from 'http-status';
import supertest from 'supertest';
import faker from '@faker-js/faker';
import { cleanDb } from '../helpers';
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
});

describe('when body is valid', () => {
  const generateValidBody = (min?: number, max?: number) => ({
    name: faker.name.findName(),
    balance: faker.datatype.number({ min: min || 10000, max: max || 1000000 }),
  });

  it('should respond with status 200 when body is valid', async () => {
    const body = generateValidBody();

    const response = await server.post('/participants').send(body);

    expect(response.status).toBe(httpStatus.CREATED);
  });

  it('should respond with status 200 when balance is not enough', async () => {
    const body = generateValidBody(1, 999);

    const response = await server.post('/participants').send(body);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });
});
