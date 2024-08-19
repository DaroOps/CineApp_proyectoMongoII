export class TicketDTO {
    constructor(data) {
      this.screening_id = data.screening_id;
      this.user_id = data.user_id;
      this.seat = {
        theater_id: data.seat.theater_id,
        number: data.seat.number,
        row: data.seat.row
      };
      this.base_price = data.base_price;
      this.final_price = data.final_price;
      this.status = data.status;
      this.purchase_date = data.purchase_date;
    }
}
  
 
export class ReservationRequestDTO {
    constructor(data) {
      this.userId = data.userId;
      this.screeningId = data.screeningId;
      this.selectedSeats = data.selectedSeats;
    }
  }
  
