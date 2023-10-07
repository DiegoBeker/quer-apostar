import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createParticipant() {
  return prisma.participant.create({
    data: {
      name: faker.name.findName(),
      balance: faker.datatype.number({ min: 10000, max: 1000000 }),
    },
  });
}
