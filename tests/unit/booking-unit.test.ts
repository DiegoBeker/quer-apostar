import bookingRepository from '../../src/repositories/booking-repository';
import bookingService from '../../src/services/booking-service';
import roomRepository from '../../src/repositories/room-repository';
import { buildEnrollment, buildRoom, buildTicket } from '../factories';
import { buildBooking } from '../factories/booking-factory';
import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { Booking, Room } from '@prisma/client';

describe('Bookings unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Get booking unit tests', () => {
    it('Should return a booking', async () => {
      const mockedBooking = {
        id: 1,
        roomId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Room: {
          id: 1,
          capacity: 2,
          hotelId: 1,
          name: '1202',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      jest.spyOn(bookingRepository, 'getBookingByUserId').mockResolvedValue(mockedBooking);
      const booking = await bookingService.getBooking(1);
      expect(booking).toEqual(mockedBooking);
    });

    it('should return notFoundError when booking is not found', async () => {
      jest.spyOn(bookingRepository, 'getBookingByUserId').mockResolvedValueOnce(null);
      const promise = bookingService.getBooking(1);
      expect(promise).rejects.toEqual(notFoundError());
    });
  });

  describe('Post booking unit tests', () => {
    it('Should return a booking when post is successful', async () => {
      const mockedRoom = buildRoom(1, 1);
      jest.spyOn(roomRepository, 'getRoomById').mockResolvedValueOnce(mockedRoom);
      jest.spyOn(bookingRepository, 'getBookingByRoomId').mockResolvedValueOnce(null);
      const mockedEnrollment = buildEnrollment(1);
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockedEnrollment);
      const mockedTicket = buildTicket(mockedEnrollment.id, true, false, true);
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockedTicket);
      const mockedBooking = buildBooking(1, 1);
      jest.spyOn(bookingRepository, 'bookRoom').mockResolvedValueOnce(mockedBooking);
      const booking = await bookingService.bookRoom(1, 1);
      expect(booking).toEqual(mockedBooking);
    });

    it('should return notFoundError when booking is not found', async () => {
      jest.spyOn(roomRepository, 'getRoomById').mockResolvedValueOnce(null);
      const promise = bookingService.bookRoom(1, 1);
      expect(promise).rejects.toEqual(notFoundError());
    });

    it('should return BookError when room is aleready booked', async () => {
      const mockedRoom = buildRoom(1, 1);
      jest.spyOn(roomRepository, 'getRoomById').mockResolvedValueOnce(mockedRoom);
      const mockedBooking = buildBooking(mockedRoom.id);
      jest.spyOn(bookingRepository, 'getBookingByRoomId').mockResolvedValueOnce(mockedBooking);
      const promise = bookingService.bookRoom(1, 1);
      expect(promise).rejects.toEqual({ name: 'BookingError' });
    });

    it('should return BookError when ticket is remote', async () => {
      const mockedRoom = buildRoom(1, 1);
      jest.spyOn(roomRepository, 'getRoomById').mockResolvedValueOnce(mockedRoom);
      jest.spyOn(bookingRepository, 'getBookingByRoomId').mockResolvedValueOnce(null);
      const mockedEnrollment = buildEnrollment(1);
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockedEnrollment);
      const mockedTicket = buildTicket(mockedEnrollment.id, true, true, false);
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockedTicket);
      const promise = bookingService.bookRoom(1, 1);
      expect(promise).rejects.toEqual({ name: 'BookingError' });
    });

    it('should return BookError when ticket is not paid', async () => {
      const mockedRoom = buildRoom(1, 1);
      jest.spyOn(roomRepository, 'getRoomById').mockResolvedValueOnce(mockedRoom);
      jest.spyOn(bookingRepository, 'getBookingByRoomId').mockResolvedValueOnce(null);
      const mockedEnrollment = buildEnrollment(1);
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockedEnrollment);
      const mockedTicket = buildTicket(mockedEnrollment.id, false, false, true);
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockedTicket);
      const promise = bookingService.bookRoom(1, 1);
      expect(promise).rejects.toEqual({ name: 'BookingError' });
    });

    it('should return BookError when ticket does not include hotel', async () => {
      const mockedRoom = buildRoom(1, 1);
      jest.spyOn(roomRepository, 'getRoomById').mockResolvedValueOnce(mockedRoom);
      jest.spyOn(bookingRepository, 'getBookingByRoomId').mockResolvedValueOnce(null);
      const mockedEnrollment = buildEnrollment(1);
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockedEnrollment);
      const mockedTicket = buildTicket(mockedEnrollment.id, true, false, false);
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockedTicket);
      const promise = bookingService.bookRoom(1, 1);
      expect(promise).rejects.toEqual({ name: 'BookingError' });
    });
  });
});
