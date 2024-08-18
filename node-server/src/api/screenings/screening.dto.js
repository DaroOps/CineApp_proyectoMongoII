export class ScreeningDTO {
    constructor({_id, movie_id ,theater_id, date_time, base_price, available_seats, ocupied_seats}) {
        console.log('Received data:', { _id, movie_id ,theater_id, date_time, base_price, available_seats, ocupied_seats });
          
        this.id = _id;
        this.movie = movie_id;
        this.theater = theater_id;
        this.time = date_time.time;
        this.day = date_time.day;
        this.weekday = date_time.weekday;
        this.price = base_price;
        this.available_seats = available_seats;
        this.ocupied_seats = ocupied_seats;
    }
}


