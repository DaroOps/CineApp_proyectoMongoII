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