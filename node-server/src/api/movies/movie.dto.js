// movie.dto.js

export class MovieListDTO {
    constructor({ _id, title, genre, image_url }) {
        this.id = _id;
        this.title = title;
        this.genre = genre;
        this.img = image_url;
    }
}

export class MovieDetailDTO {
    constructor({ _id, title, genre, duration, synopsis, screening_times, image_url, trailer_url, cast , screenings}) {
        console.log('Received data:', { _id, title, genre, duration, synopsis, image_url, trailer_url, cast, screenings });
        this.id = _id;
        this.title = title;
        this.genre = genre;
        this.duration = duration;
        this.synopsis = synopsis;
        this.screening_times = screening_times;
        this.img = image_url;
        this.trailer = trailer_url;
        this.cast = cast.map(c => new CastMemberDTO(c));
        this.cinemas = screenings.map(s => new CinemaDTO( new ScreeningCinemaDTO(s))) ;
    }
}

export class CastMemberDTO {
    constructor({ actor_id, role }) {
        this.actor = { id: actor_id._id, name: actor_id.name, img: actor_id.image_url };
        this.role = role;
    }
}

// export class ScreeningCinemaDTO {
//     constructor({_id, name,location}){
//             this.id = _id;
//             this.name = name;
//             this.location = location;
//     }
// }

export class ScreeningCinemaDTO {
    constructor({cinema_id}){
            return cinema_id;
    }
}


// export class ScreeningCinemaDTO {
//     constructor({_id, name,location}){
//             this.id = _id;
//             this.name = name;
//             this.location = location;
//     }
// }

export class CinemaDTO {
    constructor({
      _id,
      name,
      location,
      image_url
    }) {
      this.id = _id;
      this.name = name;
      this.location = location;
      this.img = image_url;
    }
}

export class AvailableSeatDTO {
    constructor({ row, number }) {
        this.r = row;
        this.n = number;
    }
}
