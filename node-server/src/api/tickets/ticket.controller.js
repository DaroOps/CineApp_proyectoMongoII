import TicketService from "./ticket.service.js";

export default class TicketController {
    constructor() {
        this.ticketService = new TicketService();
    }

    reserveTickets = async (req, res) => {
        const { userId, screeningId, selectedSeats } = req.body;
        const reserved_tickets = await this.ticketService.reserveTickets({ userId, screeningId, selectedSeats });

        res.status(200).json(reserved_tickets);
    }

    processPayment = async (req, res) => {
        const { tempReservationId, token } = req.body;
        
        try {
          const result = await this.ticketService.processPayment(tempReservationId, token);
          res.status(200).json(result);
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
    };

    confirmReservation = async (req, res) => { 
        const { tempReservationId } = req.body;
        // console.log("confirmReservation", tempReservationId);
        
        const tickets = await this.ticketService.confirmReservation(tempReservationId);

        res.status(200).json(tickets);
    }

    abortReservation = async (req, res) => { 
        const { tempReservationId } = req.body;
        // console.log("abortReservation", tempReservationId);
        
        const tickets = await this.ticketService.abortReservation(tempReservationId);

        res.status(200).json(tickets);
    }

    getUserTickets = async (req, res) => {
        const userId = req.query.userId;
        const tickets = await this.ticketService.getUserTickets(userId);
          
          res.status(200).json(tickets);
    }
    
      
}