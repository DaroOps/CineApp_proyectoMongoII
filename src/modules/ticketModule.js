import { ObjectId } from 'mongodb';
import DbService from '../db/dbConnection.js';

export default class Ticket {
  static instanceTicket;
  client;
  dbService;
  /**
   * Creates a new Ticket instance or returns the existing instance (Singleton pattern).
   * 
   * @param {Object} client - The database client object.
   * @returns {Ticket} The Ticket instance.
   */
  constructor(client = null) {
    if (Ticket.instanceTicket) {
      return Ticket.instanceTicket;
    }
    this.client = client.getClient();
    this.dbService = new DbService(this.client);
    Ticket.instanceTicket = this;
  }

  /**
   * Buys a ticket for a specific screening and reserves the selected seat.
   *
   * @param {string} screeningId - The ID of the screening for which the ticket is being purchased.
   * @param {string} userId - The ID of the user purchasing the ticket.
   * @param {object} seatInfo - The seat information containing the row and number of the selected seat.
   * @param {string} seatInfo.row - The row of the selected seat.
   * @param {number} seatInfo.number - The number of the selected seat.
   *
   * @returns {Promise<ObjectId>} - The ID of the newly created ticket document in the database.
   *
   * @throws {Error} - Throws an error if the screening, seat, user, or VIP status is invalid.
   *
   * @async
   */
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

  /**
  * Checks the availability of seats for a specific screening.
  *
  * @param {string} screeningId - The ID of the screening for which the seat availability is being checked.
  *
  * @returns {Promise<object>} - A promise that resolves to an object containing the number of available seats and the list of occupied seats.
  * - availableSeats: The number of available seats for the screening.
  * - occupiedSeats: An array of objects representing the occupied seats. Each object contains the row and number of the seat.
  *
  * @throws {Error} - Throws an error if the screening is not found.
  *
  * @async
  */
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

  /**
   * Checks if a seat is available for a specific screening.
   *
   * @param {object} screening - The screening object containing the occupied seats.
   * @param {object} seatInfo - The seat information containing the row and number of the selected seat.
   * @param {string} seatInfo.row - The row of the selected seat.
   * @param {number} seatInfo.number - The number of the selected seat.
   *
   * @returns {boolean} - Returns true if the seat is available, false otherwise.
   */
  isSeatAvailable(screening, seatInfo) {
    return !screening.occupied_seats.some(
      seat => seat.row === seatInfo.row && seat.number === seatInfo.number
    );
  }

  /**
   * Reserves a seat for a specific screening.
   *
   * @param {string} screeningId - The ID of the screening for which the seat is being reserved.
   * @param {object} seatInfo - The seat information containing the row and number of the selected seat.
   * @param {string} seatInfo.row - The row of the selected seat.
   * @param {number} seatInfo.number - The number of the selected seat.
   * @param {object} session - The MongoDB session for transactional operations.
   *
   * @returns {Promise<boolean>} - A promise that resolves to true if the seat reservation is successful, false otherwise.
   *
   * @throws {Error} - Throws an error if the database connection fails or if the update operation fails.
   *
   * @async
   */ 
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

  /**
  * Cancels a seat reservation for a specific screening.
  *
  * @param {string} screeningId - The ID of the screening for which the seat reservation is being canceled.
  * @param {object} seatInfo - The seat information containing the row and number of the selected seat.
  * @param {string} seatInfo.row - The row of the selected seat.
  * @param {number} seatInfo.number - The number of the selected seat.
  *
  * @returns {Promise<boolean>} - A promise that resolves to true if the seat cancellation is successful, false otherwise.
  *
  * @throws {Error} - Throws an error if the database connection fails or if the update operation fails.
  *
  * @async
  */
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