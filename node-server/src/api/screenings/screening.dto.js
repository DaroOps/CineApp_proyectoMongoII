
export class ScreeningDTO {
    constructor({
      _id,
      movie_id,
      theater_id,
      cinema_id,
      date_time,
      base_price,
      available_seats,
      occupied_seats,
      type
    }) {
      this.id = _id;
      this.movie = movie_id;
      this.theater = theater_id;
      this.cinema = cinema_id;
      this.time = date_time.time;
      this.day = date_time.day;
      this.weekday = date_time.weekday;
      this.price = base_price;
      this.availableSeats = available_seats;
      this.occupiedSeats = occupied_seats;
      this.type = type;
    }
  
    static fromJSON(json) {
      return new ScreeningDTO(json);
    }
  
    toJSON() {
      return {
        id: this.id,
        movie: this.movie,
        theater: this.theater,
        cinema: this.cinema,
        time: this.time,
        day: this.day,
        weekday: this.weekday,
        price: this.price,
        availableSeats: this.availableSeats,
        occupiedSeats: this.occupiedSeats,
        type: this.type
      };
    }
  }


  export class FormatedScreeningDTO {
    constructor({
      _id,
      movie_id,
      theater_id,
      date_time,
      base_price,
      cinema_id,
      type,
      seats
    }) {
      this.id = _id;
      this.movie = movie_id.title;
      this.theater = theater_id.name;
      this.cinema = { name: cinema_id.name, location: cinema_id.location };
      this.time = date_time.time;
      this.day = date_time.day;
      this.weekday = date_time.weekday;
      this.price = base_price;
      this.type = type;
      this.seats = seats;
    }
  
    static fromJSON(json) {
      return new ScreeningDTO(json);
    }
  
    toJSON() {
      return {
        id: this.id,
        movie: this.movie,
        theater: this.theater,
        cinema: this.cinema,
        time: this.time,
        day: this.day,
        weekday: this.weekday,
        price: this.price,
        type: this.type,
        seats: this.seats
      };
    }
  }


