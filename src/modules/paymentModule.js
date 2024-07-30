import { ObjectId } from 'mongodb';
import DbService from '../db/dbConnection.js';
import Client from '../config/mongodb.js';

export default class Payment {
  static instancePayment;
  dbService;

  constructor() {
    if (Payment.instancePayment) {
      return Payment.instancePayment;
    }
    const client = new Client(process.env.ADMIN_USER, process.env.ADMIN_PWD).getClient();
    this.dbService = new DbService(client);
    Payment.instancePayment = this;
  }

  /**
  * Processes a payment for a given ticket and updates the ticket status to 'paid'.
  * It also inserts a new payment record into the 'payments' collection.
  *
  * @param {string} ticketId - The unique identifier of the ticket for which the payment is being processed.
  * @param {object} paymentInfo - The payment information provided by the user.
  *
  * @returns {Promise<object>} - A promise that resolves to the payment object if the payment is successful.
  * If the payment fails, the promise rejects with an error.
  *
  * @throws {Error} - Throws an error if the ticket is not found or if the ticket is already paid.
  */
  async processPayment(ticketId, paymentInfo) {
    const db = await this.dbService.connect();
    const session = await db.client.startSession();

    try {
      const result = await session.withTransaction(async () => {

        const ticket = await db.collection('tickets').findOne(
          { _id: new ObjectId(ticketId) },
          { session }
        );
        if (!ticket) throw new Error('Ticket not found');

        if(ticket.status === "paid"){
          throw new Error('Ticket already paid');
        }

        const payment = {
          ticket_id: new ObjectId(ticketId),
          user_id: ticket.user_id,
          amount: ticket.final_price,
          date: new Date(),
          payment_method: paymentInfo,
          status: 'completed',
          transaction_reference: `TRX${Date.now()}`
        };

        await db.collection('payments').insertOne(payment, { session });
        await db.collection('tickets').updateOne(
          { _id: new ObjectId(ticketId) },
          { $set: { status: 'paid' } },
          { session }
        );
        
        return payment;
      });
      return result;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    } finally {
      await session.endSession();
      await this.dbService.close();
    }
  }

  /**
  * Confirms the purchase of a ticket by checking its existence in the database.
  *
  * @param {string} ticketId - The unique identifier of the ticket to be confirmed.
  *
  * @returns {Promise<boolean>} - A promise that resolves to true if the ticket is found,
  * indicating a successful purchase confirmation. If the ticket is not found, the promise
  * rejects with an error.
  *
  * @throws {Error} - Throws an error if the ticket is not found.
  * 
  * @note This is a dumb function cause don't perform any operation in the database
  * 
  * @deprecated
  */
  async confirmPurchase(ticketId) {
    const db = await this.dbService.connect();
    try {
      const ticket = await db.collection('tickets').findOne({ _id: new ObjectId(ticketId) });
      if (!ticket) throw new Error('Ticket not found');
      console.log(`Purchase confirmed for ticket ${ticketId}`);
      return true;
    } catch (error) {
      console.error('Error confirming purchase:', error);
      throw error;
    } finally {
      await this.dbService.close();
    }
  }

  /**
   * Applies a discount to a ticket based on the provided discount type.
   *
   * @param {string} ticketId - The unique identifier of the ticket to apply the discount to.
   * @param {string} discountType - The type of discount to apply.
   *
   * @returns {Promise<boolean>} - A promise that resolves to true if the discount is successfully applied,
   * indicating that the ticket's price has been updated. If the discount is not found or cannot be applied,
   * the promise resolves to false.
   *
   * @throws {Error} - Throws an error if there is an issue connecting to the database,
   * applying the discount, or closing the database connection.
   *
   * @async
   */
  async applyDiscount(ticketId, discountType) {
    const db = await this.dbService.connect();
    const session = await db.client.startSession();

    try {
      return await session.withTransaction(async () => {
        const discount = await db.collection('discounts').findOne(
          { type: discountType },
          { session }
        );
        if (!discount) throw new Error('Discount not found');

        const ticket = await db.collection('tickets').findOne(
          { _id: new ObjectId(ticketId) },
          { session }
        );
        const discountedPrice = ticket.base_price * (1 - discount.percentage / 100);

        const result = await db.collection('tickets').updateOne(
          { _id: new ObjectId(ticketId) },
          { 
            $set: { 
              final_price: discountedPrice, 
              discount_applied: { type: discountType, percentage: discount.percentage } 
            } 
          },
          { session }
        );

        return result.modifiedCount > 0;
      });
    } catch (error) {
      console.error('Error applying discount:', error);
      throw error;
    } finally {
      await session.endSession();
      await this.dbService.close();
    }
  }

  /**
  * Verifies if a user has a valid VIP card and applies a VIP discount to the ticket if applicable.
  *
  * @param {string} userId - The unique identifier of the user.
  * @param {string} ticketId - The unique identifier of the ticket to apply the discount to.
  *
  * @returns {Promise<boolean>} - A promise that resolves to true if the VIP discount is successfully applied,
  * false if the user doesn't have a valid VIP card or if the discount couldn't be applied.
  *
  * @throws {Error} - Throws an error if there's an issue with database operations or if the VIP discount is not found.
  *
  * @async
  */
  async verifyVIPCardAndApplyDiscount(userId, ticketId) {
    const db = await this.dbService.connect();
    const session = await db.client.startSession();

    try {
      return await session.withTransaction(async () => {
        const user = await db.collection('users').findOne(
          { _id: new ObjectId(userId) },
          { session }
        );
        if (!user || !user.vip_card) return false;

        const isVIPValid = new Date() < new Date(user.vip_card.expiration_date);
        if (!isVIPValid) return false;

        const vipDiscountType = 'VIP';
        const discount = await db.collection('discounts').findOne(
          { type: vipDiscountType },
          { session }
        );
        if (!discount) throw new Error('VIP discount not found');

        const ticket = await db.collection('tickets').findOne(
          { _id: new ObjectId(ticketId) },
          { session }
        );
        const discountedPrice = ticket.base_price * (1 - discount.percentage / 100);

        const result = await db.collection('tickets').updateOne(
          { _id: new ObjectId(ticketId) },
          { 
            $set: { 
              final_price: discountedPrice, 
              discount_applied: { type: vipDiscountType, percentage: discount.percentage } 
            } 
          },
          { session }
        );

        return result.modifiedCount > 0;
      });
    } catch (error) {
      console.error('Error verifying VIP card and applying discount:', error);
      throw error;
    } finally {
      await session.endSession();
      await this.dbService.close();
    }
  }
}