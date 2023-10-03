import faker from '@faker-js/faker';
import { Room } from '@prisma/client';
import { prisma } from '@/config';

export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRoomWithHotelId(hotelId: number) {
  return prisma.room.create({
    data: {
      name: '1020',
      capacity: 3,
      hotelId: hotelId,
    },
  });
}

export function buildRoom(roomId: number, hotelId: number): Room {
  return {
    id: roomId,
    name: faker.datatype.string(4),
    capacity: faker.datatype.number(4),
    hotelId: hotelId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
