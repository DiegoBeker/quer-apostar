import faker from '@faker-js/faker';
import { Booking } from '@prisma/client';
import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
    include: {
      Room: true,
    },
  });
}

export function buildBooking(roomId: number, userId?: number): Booking {
  return {
    id: faker.datatype.number(),
    roomId,
    userId: userId || faker.datatype.number(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
