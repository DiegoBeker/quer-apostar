import faker from '@faker-js/faker';
import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';

export async function createTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: faker.datatype.boolean(),
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}

export async function createTicketTypeRemote() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: true,
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createTicketTypeWithHotel() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: true,
    },
  });
}

export function buildTicketTypeRemote(ticketTypeId?: number): TicketType {
  return {
    id: ticketTypeId || faker.datatype.number(),
    includesHotel: false,
    isRemote: true,
    price: faker.datatype.number(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: faker.datatype.string(10),
  };
}

export function buildTicketTypePresential(includesHotel: boolean, ticketTypeId?: number): TicketType {
  return {
    id: ticketTypeId || faker.datatype.number(),
    includesHotel,
    isRemote: false,
    price: faker.datatype.number(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: faker.datatype.string(10),
  };
}

export function buildTicket(
  enrollmentId: number,
  isPaid?: boolean,
  isRemote?: boolean,
  includesHotel?: boolean,
): Ticket & { TicketType: TicketType } {
  const id = faker.datatype.number();
  return {
    id: faker.datatype.number(),
    enrollmentId,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: isPaid ? 'PAID' : 'RESERVED',
    ticketTypeId: id,
    TicketType: isRemote ? buildTicketTypeRemote(id) : buildTicketTypePresential(includesHotel, id),
  };
}
