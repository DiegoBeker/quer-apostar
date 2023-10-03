import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';

import {
  createEnrollmentWithAddress,
  createHotel,
  createPayment,
  createRoomWithHotelId,
  createTicket,
  createTicketTypeRemote,
  createTicketTypeWithHotel,
  createUser,
} from '../factories';
import { createBooking } from '../factories/booking-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 200 with booking info', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const createdHotel = await createHotel();

      const createdRoom = await createRoomWithHotelId(createdHotel.id);
      const createdBooking = await createBooking(user.id, createdRoom.id);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        id: createdBooking.id,
        Room: {
          id: createdBooking.Room.id,
          name: createdBooking.Room.name,
          capacity: createdBooking.Room.capacity,
          hotelId: createdHotel.id,
          createdAt: createdBooking.Room.createdAt.toISOString(),
          updatedAt: createdBooking.Room.updatedAt.toISOString(),
        },
      });
    });
    it('should respond with status 404 when user does not have a booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
  });
});

describe('POST/booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 200', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const createdHotel = await createHotel();

      const createdRoom = await createRoomWithHotelId(createdHotel.id);

      const body = { roomId: createdRoom.id };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toHaveProperty('bookingId');
    });
    it('should respond with status 400 when body is invalid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const createdHotel = await createHotel();

      await createRoomWithHotelId(createdHotel.id);

      const body = { roomId: 'somestring' };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 404 when room does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const body = { roomId: faker.datatype.number() };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 when ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const createdHotel = await createHotel();

      const createdRoom = await createRoomWithHotelId(createdHotel.id);

      const body = { roomId: createdRoom.id };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when ticket was not paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);

      const createdHotel = await createHotel();

      const createdRoom = await createRoomWithHotelId(createdHotel.id);

      const body = { roomId: createdRoom.id };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when room is already booked', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const user2 = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const enrollment2 = await createEnrollmentWithAddress(user2);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const ticket2 = await createTicket(enrollment2.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      await createPayment(ticket2.id, ticketType.price);

      const createdHotel = await createHotel();

      const createdRoom = await createRoomWithHotelId(createdHotel.id);

      await createBooking(user2.id, createdRoom.id);

      const body = { roomId: createdRoom.id };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });
  });
});

describe('PUT/booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 200', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const createdHotel = await createHotel();

      const createdRoom = await createRoomWithHotelId(createdHotel.id);
      const createdRoom2 = await createRoomWithHotelId(createdHotel.id);
      const createdBooking = await createBooking(user.id, createdRoom.id);

      const body = { roomId: createdRoom2.id };

      const response = await server
        .put(`/booking/${createdBooking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(body);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toHaveProperty('bookingId');
    });
    it('should respond with status 400 when body is invalid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const createdHotel = await createHotel();

      const createdRoom = await createRoomWithHotelId(createdHotel.id);
      const createdBooking = await createBooking(user.id, createdRoom.id);

      const body = { roomId: 'somestring' };

      const response = await server
        .put(`/booking/${createdBooking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(body);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 404 when room does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const createdHotel = await createHotel();

      const createdRoom = await createRoomWithHotelId(createdHotel.id);
      const createdBooking = await createBooking(user.id, createdRoom.id);

      const body = { roomId: faker.datatype.number({ min: createdRoom.id + 1 }) };

      const response = await server
        .put(`/booking/${createdBooking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(body);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 when room is already booked', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const user2 = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const enrollment2 = await createEnrollmentWithAddress(user2);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const ticket2 = await createTicket(enrollment2.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      await createPayment(ticket2.id, ticketType.price);

      const createdHotel = await createHotel();

      const createdRoom = await createRoomWithHotelId(createdHotel.id);

      const createdBooking = await createBooking(user2.id, createdRoom.id);

      const body = { roomId: createdRoom.id };

      const response = await server
        .put(`/booking/${createdBooking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when user does not have booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const user2 = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const enrollment2 = await createEnrollmentWithAddress(user2);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const ticket2 = await createTicket(enrollment2.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      await createPayment(ticket2.id, ticketType.price);

      const createdHotel = await createHotel();

      const createdRoom = await createRoomWithHotelId(createdHotel.id);
      const createdRoom2 = await createRoomWithHotelId(createdHotel.id);

      const createdBooking = await createBooking(user2.id, createdRoom.id);

      const body = { roomId: createdRoom2.id };

      const response = await server
        .put(`/booking/${createdBooking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });
  });
});
