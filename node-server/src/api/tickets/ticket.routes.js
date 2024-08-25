import express from "express";
import TicketController from "./ticket.controller.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

const router = express.Router();

const ticketController = new TicketController();

router.post("/reserve", asyncHandler(ticketController.reserveTickets));
router.post("/confirm", asyncHandler(ticketController.confirmReservation));
router.post("/abort", asyncHandler(ticketController.abortReservation));
router.post("/process-payment", asyncHandler(ticketController.processPayment));

export default router;