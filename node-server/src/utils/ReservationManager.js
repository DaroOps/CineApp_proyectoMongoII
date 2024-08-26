//TODO: Save reservations in a redis database for retrieve in the case of the server restart

export default class ReservationManager {
    constructor(ticketService) {
      this.ticketService = ticketService;
      this.activeReservations = new Map();
    }
  
    addReservation(reservationId, expirationTime) {
      const timeoutId = setTimeout(async () => {
        await this.ticketService.releaseExpiredReservation(reservationId);
        this.activeReservations.delete(reservationId);
      }, expirationTime - Date.now());
  
      this.activeReservations.set(reservationId, timeoutId);
    }
  
    cancelReservation(reservationId) {
      const timeoutId = this.activeReservations.get(reservationId);
      if (timeoutId) {
        clearTimeout(timeoutId);
        this.activeReservations.delete(reservationId);
      }
    }
  }