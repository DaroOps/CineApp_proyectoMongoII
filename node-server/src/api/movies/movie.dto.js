// movie.dto.js

class MovieListDTO {
    constructor({ _id, title, genre, image_url }) {
        this.id = _id;
        this.t = title;
        this.g = genre;
        this.img = image_url;
    }
}

class MovieDetailDTO {
    constructor({ _id, title, genre, duration, synopsis, screening_times, image_url, trailer_url, cast }) {
        this.id = _id;
        this.t = title;
        this.g = genre;
        this.d = duration;
        this.s = synopsis;
        this.st = screening_times;
        this.img = image_url;
        this.tr = trailer_url;
        this.c = cast.map(c => new CastMemberDTO(c));
    }
}

class CastMemberDTO {
    constructor({ actor_id, role }) {
        this.a = { id: actor_id._id, n: actor_id.name };
        this.r = role;
    }
}

class AvailableSeatDTO {
    constructor({ row, number }) {
        this.r = row;
        this.n = number;
    }
}

export default {
    MovieListDTO,
    MovieDetailDTO,
    CastMemberDTO,
    AvailableSeatDTO
};