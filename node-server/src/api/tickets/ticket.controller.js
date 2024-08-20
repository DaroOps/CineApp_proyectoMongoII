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

    confirmReservation = async (req, res) => { 
        const { tempReservationId } = req.body;
        const tickets = await this.ticketService.confirmReservation(tempReservationId);

        res.status(200).json(tickets);
    }
}