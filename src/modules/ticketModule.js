import { ObjectId } from 'mongodb';
import DbService from '../db/dbConnection.js';

export default class Ticket {
  static instanceTicket;
  client;
  dbService;

  constructor(client = null) {
    if (Ticket.instanceTicket) {
      return Ticket.instanceTicket;
    }
    this.client = client.getClient();
    this.dbService = new DbService(this.client);
    Ticket.instanceTicket = this;
  }

  async buyTicket(screeningId, userId, seatInfo) {
    const db = await this.dbService.connect();
    const session = await db.client.startSession();
    try {
      return await session.withTransaction(async () => {
        const screening = await db.collection('screenings').findOne(
          { _id: new ObjectId(screeningId) },
          { session }
        );
        if (!screening) throw new Error('Screening not found');

        if (!this.isSeatAvailable(screening, seatInfo)) {
          throw new Error('Seat not available');
        }

        // Validar si la silla existe
        const theater = await db.collection('theaters').findOne(
          {
            _id: new ObjectId(screening.theater_id),
            seats: {
              $elemMatch: {
                number: parseInt(seatInfo.number),
                row: seatInfo.row
              }
            }
          },
          { session }
        );

        if (!theater) {
          throw new Error(`Invalid seat: Row ${seatInfo.row}, Number ${seatInfo.number} does not exist in the theater`);
        }

        const user = await db.collection('users').findOne(
          { _id: new ObjectId(userId) },
          { session }
        );

        if (!user) {
          throw new Error('User not found');
        }

        const selectedSeat = theater.seats.find(seat => seat.number === parseInt(seatInfo.number) && seat.row === seatInfo.row);

        if (selectedSeat.type === 'VIP' && user.role.type !== 'VIP') {
          throw new Error('User is not VIP and cannot reserve the VIP seat');
        }

        const ticket = {
          screening_id: new ObjectId(screeningId),
          user_id: new ObjectId(userId),
          seat: {
            theater_id: theater._id,
            number: parseInt(seatInfo.number),
            row: seatInfo.row
          },
          base_price: screening.base_price,
          final_price: screening.base_price,
          status: 'reserved',
          purchase_date: new Date(),
          qr_code: "SOME_QRCODE"
        };

        await this.reserveSeat(screeningId, ticket.seat, session);
        const result = await db.collection('tickets').insertOne(ticket, { session });
        return result.insertedId;
      });
    } catch (error) {
      console.error('Error buying ticket:', error);
      throw error;
    } finally {
      await session.endSession();
      await this.dbService.close();
    }
  }

  async checkSeatAvailability(screeningId) {
    const db = await this.dbService.connect();
    try {
      const screening = await db.collection('screenings').findOne(
        { _id: new ObjectId(screeningId) }
      );
      if (!screening) {
        throw new Error('Screening not found');
      } else {
        return {
          availableSeats: screening.available_seats,
          occupiedSeats: screening.occupied_seats || []
        };
      }
    } catch (error) {
      console.error('Error checking seat availability:', error);
      throw error;
    } finally {
      await this.dbService.close();
    }
  }

  isSeatAvailable(screening, seatInfo) {
    return !screening.occupied_seats.some(
      seat => seat.row === seatInfo.row && seat.number === seatInfo.number
    );
  }

  async reserveSeat(screeningId, seatInfo, session) {
    const db = await this.dbService.connect();
    const result = await db.collection('screenings').updateOne(
      { _id: new ObjectId(screeningId) },
      {
        $push: { occupied_seats: seatInfo },
        $inc: { available_seats: -1 }
      },
      { session }
    );
    return result.modifiedCount > 0;
  }

  async cancelSeatReservation(screeningId, seatInfo) {
    const db = await this.dbService.connect();
    try {
      const result = await db.collection('screenings').updateOne(
        { _id: new ObjectId(screeningId) },
        {
          $pull: { occupied_seats: seatInfo },
          $inc: { available_seats: 1 }
        }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error canceling seat reservation:', error);
      throw error;
    } finally {
      await this.dbService.close();
    }
  }
}