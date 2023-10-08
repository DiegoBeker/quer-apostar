import { faker } from '@faker-js/faker/locale/pt_BR';
import { prisma } from '@/config';

export async function createParticipant() {
  return prisma.participant.create({
    data: {
      name: faker.person.fullName(),
      balance: faker.datatype.number({ min: 10000, max: 1000000 }),
    },
  });
}
