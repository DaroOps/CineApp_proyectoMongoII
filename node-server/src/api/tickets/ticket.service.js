// services/TicketService.js
import mongoose from 'mongoose';
import ReservationManager from '../../utils/ReservationManager.js';
import Ticket from './ticket.model.js';
import { TicketDTO } from './ticket.dto.js';
import { text } from 'express';

export default class TicketService {
  constructor() {
    this.reservationManager = new ReservationManager(this);
  }

  async reserveTickets({userId, screeningId, selectedSeats} ) {
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log(userId, screeningId, selectedSeats);
    
    try {
      const Screening = mongoose.model('Screening');
      const Theater = mongoose.model('Theater');
      const TemporaryReservation = mongoose.model('TemporaryReservation');

      // const allScreenings = await Screening.find({}).session(session).lean();
      const screening = await Screening.findById(screeningId).session(session);
      // console.log('Found screening:', screening);
      // console.log('All screenings:', allScreenings);
      
      if (!screening) {
        throw new Error('Screening not found');
      }

      const theater = await Theater.findById(screening.theater_id).session(session);
      if (!theater) {
        throw new Error('Theater not found');
      }

      this.validateSeats(selectedSeats, theater, screening);

      const expirationTime = new Date(Date.now() + 2 * 60000); // 2 min
      const tempReservation = new TemporaryReservation({
        user_id: userId,
        screening_id: screeningId,
        seats: selectedSeats,
        temporary_reserved_seats: selectedSeats,
        status: 'pending',
        expiration_time: expirationTime
      });

      await tempReservation.save({ session });

      await Screening.updateOne(
        { _id: screeningId },
        { $push: { occupied_seats: { $each: selectedSeats } } },
        { session }
      );

      await session.commitTransaction();
      this.reservationManager.addReservation(tempReservation._id, tempReservation.expiration_time);
      return tempReservation;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    //   const tickets = await this.createTickets(userId, screeningId, selectedSeats, screening, Ticket, session);

    //   screening.occupied_seats.push(...selectedSeats);
    //   await screening.save({ session });

    //   await session.commitTransaction();
    //   return tickets.map(ticket => new TicketDTO(ticket));
    // } catch (error) {
    //   await session.abortTransaction();
    //   throw error;
    // } finally {
    //   session.endSession();
    // }
  }

  validateSeats(selectedSeats, theater, screening) {
    const validSeats = selectedSeats.every(selectedSeat => {
      // Check if the seat exists in the theater
      const seatExists = theater.seats.some(
        theatreSeat => theatreSeat.row === selectedSeat.row && theatreSeat.number === selectedSeat.number
      );
  
      // Check if the seat is not already reserved
      const seatNotReserved = !screening.occupied_seats.some(
        reservedSeat => reservedSeat.row === selectedSeat.row && reservedSeat.number === selectedSeat.number
      );
  
      return seatExists && seatNotReserved;
    });
  
    console.log('Valid seats:', validSeats);
  
    if (!validSeats) {
      throw new Error('Invalid or unavailable seats selected');
    }
  }

  async createTickets(userId, screeningId, selectedSeats, screening, Ticket, session) {
    return Promise.all(selectedSeats.map(async (seat) => {
      const basePrice = screening.base_price;
      const finalPrice = this.calculateFinalPrice(basePrice, seat);

      const ticket = new Ticket({
        screening_id: screeningId,
        user_id: userId,
        seat: {
          theater_id: screening.theater_id,
          number: seat.number,
          row: seat.row
        },
        base_price: basePrice,
        final_price: finalPrice,
        status: 'reserved',
        purchase_date: new Date()
      });

      return ticket.save({ session });
    }));
  }

  calculateFinalPrice(basePrice, seat) {
    // TODO: Implement the logic of prices and discounts
    // For instance:
    // if (seat.isVIP) return basePrice * 1.5;
    return basePrice;
  }

  async confirmReservation(tempReservationId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    //TODO: check if the payment is done before confirming the reservation

    try {
      const TemporaryReservation = mongoose.model('TemporaryReservation');
      const Screening = mongoose.model('Screening');
      const Ticket = mongoose.model('Ticket');
      const User = mongoose.model('User');
  
      const tempReservation = await TemporaryReservation.findById(tempReservationId).session(session);
      if (!tempReservation || tempReservation.status !== 'pending') {
        throw new Error('Invalid or expired reservation');
      }
  
      const screening = await Screening.findById(tempReservation.screening_id).session(session);
      const user = await User.findById(tempReservation.user_id).session(session);
  
      const tickets = await this.createTickets(
        tempReservation.user_id,
        tempReservation.screening_id,
        tempReservation.seats,
        screening,
        Ticket,
        session
      );
  
      tempReservation.status = 'completed';
      this.reservationManager.cancelReservation(tempReservationId);
      await tempReservation.save({ session });
  
      await session.commitTransaction();
      return tickets;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async releaseExpiredReservation() {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const TemporaryReservation = mongoose.model('TemporaryReservation');
      const Screening = mongoose.model('Screening');
  
      const expiredReservations = await TemporaryReservation.find({
        status: 'pending',
        expiration_time: { $lt: new Date() }
      }).session(session);
  
      for (const reservation of expiredReservations) {
        await Screening.updateOne(
          { _id: reservation.screening_id },
          { 
            $pull: { 
              occupied_seats: { 
                $or: reservation.seats.map(seat => ({
                  row: seat.row,
                  number: seat.number
                }))
              } 
            } 
          },
          { session }
        );
  
        reservation.status = 'expired';
        await reservation.save({ session });
      }
  
      await session.commitTransaction();
      console.log(`Released ${expiredReservations.length} expired reservations`);
    } catch (error) {
      await session.abortTransaction();
      console.error('Error releasing expired reservations:', error);
    } finally {
      session.endSession();
    }
  }
}