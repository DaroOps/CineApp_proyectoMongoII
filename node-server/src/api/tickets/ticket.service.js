// services/TicketService.js
import mongoose from 'mongoose';
import Ticket from './ticket.model.js';
import { TicketDTO } from './ticket.dto.js';

export default class TicketService {
  
  async reserveTickets({userId, screeningId, selectedSeats} ) {
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log(userId, screeningId, selectedSeats);
    
    try {
      const Screening = mongoose.model('Screening');
      const Theater = mongoose.model('Theater');
      const Ticket = mongoose.model('Ticket');

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

      const tickets = await this.createTickets(userId, screeningId, selectedSeats, screening, Ticket, session);

      screening.occupied_seats.push(...selectedSeats);
      await screening.save({ session });

      await session.commitTransaction();
      return tickets.map(ticket => new TicketDTO(ticket));
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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
}