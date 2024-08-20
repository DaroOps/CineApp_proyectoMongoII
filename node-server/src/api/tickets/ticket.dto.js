import e from "express";

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
  

 export class MovieListDTO {
    constructor({ _id, title, genre, image_url }) {
      this.id = _id;
      this.title = title;
      this.genre = genre;
      this.img = image_url;
    }
  }
  
export class ScreeningDTO {
    constructor(data) {
      this.id = data.screening._id;
      this.movie = new MovieListDTO(data.screening.movie_id);
      this.price = data.screening.base_price;
      this.dateTime = data.screening.date_time;
      this.cinema = {
        name: data.screening.cinema_id.name,
        location: data.screening.cinema_id.location
      };
      this.type = data.screening.type;
      this.tickets = data.tickets;
      this.total = data.total;
      this.serviceFee = data.serviceFee;
    }
  }
  
export class ReservationDTO {
    constructor(data) {
      this.reservation = data.reservationId;
      this.expirationTime = data.expirationTime;
      this.screening = new ScreeningDTO(data);
    }
  }