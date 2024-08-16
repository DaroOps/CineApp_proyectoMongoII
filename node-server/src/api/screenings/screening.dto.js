export class ScreeningDTO {
    constructor({
        _id,
        cinema,
        
    }) {
        this.cinemas = cinema.map(c => new CinemaDTO(c));
    }
}

// this.screenings = screenings.map(s => new ScreeningCinemaDTO(s));

class CinemaDTO {
    constructor({
      _id,
      name,
      location,
      image_url

    }) {
      this.id = _id;
      this.name = name;
      this.location = location;
      this.image = image_url;
    }
  }