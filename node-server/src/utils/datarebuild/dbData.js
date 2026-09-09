

db.createRole({
    role: "admin",
    privileges: [
        { resource: { db: "cinecampus", collection: "" }, actions: [ "find", "insert", "update", "remove", "listCollections" ] },
        { resource: { db: "cinecampus", collection: "users" }, actions: [ "find", "insert", "update", "remove" ] },
        { resource: { db: "cinecampus", collection: "movies" }, actions: [ "find", "insert", "update", "remove" ] },
        { resource: { db: "cinecampus", collection: "screenings" }, actions: [ "find", "insert", "update", "remove" ] },
        { resource: { db: "cinecampus", collection: "theaters" }, actions: [ "find", "insert", "update", "remove" ] },
        { resource: { db: "cinecampus", collection: "tickets" }, actions: [ "find", "insert", "update", "remove" ] },
        { resource: { db: "cinecampus", collection: "payments" }, actions: [ "find", "insert", "update" ] },
        { resource: { db: "cinecampus", collection: "discounts" }, actions: [ "find", "insert", "update", "remove" ] },
  
    ],
    roles: []
})

db.createRole({
    role: "standard",
    privileges: [
        { resource: { db: "cinecampus", collection: "movies" }, actions: [ "find" ] },
        { resource: { db: "cinecampus", collection: "screenings" }, actions: [ "find" ] },
        { resource: { db: "cinecampus", collection: "theaters" }, actions: [ "find" ] },
        { resource: { db: "cinecampus", collection: "tickets" }, actions: [ "find", "insert" ] },
        { resource: { db: "cinecampus", collection: "payments" }, actions: [ "insert" ] },
        { resource: { db: "cinecampus", collection: "users" }, actions: [ "find" ] }
    ],
    roles: []
})

db.createRole({
    role: "VIP",
    privileges: [
        { resource: { db: "cinecampus", collection: "movies" }, actions: [ "find" ] },
        { resource: { db: "cinecampus", collection: "screenings" }, actions: [ "find" ] },
        { resource: { db: "cinecampus", collection: "theaters" }, actions: [ "find" ] },
        { resource: { db: "cinecampus", collection: "tickets" }, actions: [ "find", "insert" ] },
        { resource: { db: "cinecampus", collection: "payments" }, actions: [ "insert" ] },
        { resource: { db: "cinecampus", collection: "users" }, actions: [ "find" ] },
        { resource: { db: "cinecampus", collection: "discounts" }, actions: [ "find" ] }
    ],
    roles: []
})

db.createUser({
  user: "adminUser",
  pwd: "12345", 
  roles: [
    { role: "admin", db: "cinecampus" },
  ]
})

db.createCollection("users")
db.createCollection("tickets")
db.createCollection("theaters")
db.createCollection("screenings")
db.createCollection("payments")
db.createCollection("movies")
db.createCollection("discounts")

db.runCommand({
   collMod: "users",
   validator:{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'name',
      'email',
      'password',
      'role'
    ],
    properties: {
      name: {
        bsonType: 'string',
        description: 'Must be a string and is required'
      },
      email: {
        bsonType: 'string',
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        description: 'Must be a valid email and is required'
      },
      password: {
        bsonType: 'string',
        description: 'Must be a string and is required'
      },
      role: {
        bsonType: 'object',
        required: [
          'type',
          'assignment_date'
        ],
        properties: {
          type: {
            'enum': [
              'admin',
              'standard',
              'VIP'
            ],
            description: 'Must be one of the defined roles'
          },
          assignment_date: {
            bsonType: 'date',
            description: 'Must be a date'
          }
        }
      },
      vip_card: {
        bsonType: 'object',
        required: [
          'card_number',
          'expiration_date',
          'issue_date'
        ],
        properties: {
          card_number: {
            bsonType: 'string',
            description: 'Must be a string'
          },
          expiration_date: {
            bsonType: 'date',
            description: 'Must be a date'
          },
          issue_date: {
            bsonType: 'date',
            description: 'Must be a date'
          }
        }
      },
      purchase_history: {
        bsonType: 'array',
        items: {
          bsonType: 'objectId'
        }
      }
    }
  }
}
   
})

db.runCommand({
   collMod: "tickets",
   validator: 
   {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        'screening_id',
        'user_id',
        'seat',
        'base_price',
        'final_price',
        'status',
        'purchase_date'
      ],
      properties: {
        screening_id: {
          bsonType: 'objectId',
          description: 'Must be an ObjectId and is required'
        },
        user_id: {
          bsonType: 'objectId',
          description: 'Must be an ObjectId and is required'
        },
        seat: {
          bsonType: 'object',
          // La butaca de un ticket es la que el usuario eligio: fila y numero.
          // El theater_id no se repite aqui porque ya lo determina la funcion,
          // y number acepta cualquier tipo numerico porque el driver escribe
          // los numeros de JavaScript como double, no como int.
          required: [
            'number',
            'row'
          ],
          properties: {
            theater_id: {
              bsonType: 'objectId',
              description: 'Optional: the theater the seat belongs to'
            },
            number: {
              bsonType: ['int', 'long', 'double'],
              minimum: 1,
              description: 'Must be a number greater than 0'
            },
            row: {
              bsonType: 'string',
              description: 'Must be a string'
            }
          }
        },
        base_price: {
          bsonType: 'number',
          minimum: 0,
          description: 'Must be a non-negative number and is required'
        },
        discount_applied: {
          bsonType: 'object',
          required: [
            'type',
            'percentage'
          ],
          properties: {
            type: {
              bsonType: 'string',
              description: 'Must be a string'
            },
            percentage: {
              bsonType: 'number',
              minimum: 0,
              maximum: 100,
              description: 'Must be a number between 0 and 100'
            }
          }
        },
        final_price: {
          bsonType: 'number',
          minimum: 0,
          description: 'Must be a non-negative number and is required'
        },
        status: {
          'enum': [
            'reserved',
            'paid',
            'cancelled'
          ],
          description: 'Must be one of the defined statuses and is required'
        },
        purchase_date: {
          bsonType: 'date',
          description: 'Must be a date and is required'
        },
        qr_code: {
          bsonType: 'string',
          description: 'Must be a string'
        }
      }
    }
  }
})

db.runCommand({
   collMod: "theaters",
   validator: {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'name',
      'capacity',
      'seats'
    ],
    properties: {
      name: {
        bsonType: 'string',
        description: 'Must be a string and is required'
      },
      capacity: {
        bsonType: 'int',
        minimum: 1,
        description: 'Must be an integer greater than 0 and is required'
      },
      seats: {
        bsonType: 'array',
        items: {
          bsonType: 'object',
          required: [
            'number',
            'row',
            'type'
          ],
          properties: {
            number: {
              bsonType: 'int',
              minimum: 1,
              description: 'Must be an integer greater than 0'
            },
            row: {
              bsonType: 'string',
              description: 'Must be a string'
            },
            type: {
              'enum': [
                'standard',
                'VIP'
              ],
              description: 'Must be either \'standard\' or \'VIP\''
            }
          }
        }
      }
    }
  }
}		
})

db.runCommand({
   collMod: "screenings",
   validator: {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'movie_id',
      'theater_id',
      'date_time',
      'base_price',
      'available_seats'
    ],
    properties: {
      movie_id: {
        bsonType: 'objectId',
        description: 'Must be an ObjectId and is required'
      },
      theater_id: {
        bsonType: 'objectId',
        description: 'Must be an ObjectId and is required'
      },
      date_time: {
        bsonType: 'date',
        description: 'Must be a date and is required'
      },
      base_price: {
        bsonType: 'number',
        minimum: 0,
        description: 'Must be a non-negative number and is required'
      },
      available_seats: {
        bsonType: 'int',
        minimum: 0,
        description: 'Must be a non-negative integer and is required'
      },
      occupied_seats: {
        bsonType: 'array',
        items: {
          bsonType: 'object',
          required: [
            'number',
            'row'
          ],
          properties: {
            number: {
              bsonType: 'int',
              minimum: 1,
              description: 'Must be an integer greater than 0'
            },
            row: {
              bsonType: 'string',
              description: 'Must be a string'
            }
          }
        }
      }
    }
  }
}
})

db.runCommand({
   collMod: "payments",
   validator: {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'ticket_id',
      'user_id',
      'amount',
      'date',
      'payment_method',
      'status'
    ],
    properties: {
      ticket_id: {
        bsonType: 'objectId',
        description: 'Must be an ObjectId and is required'
      },
      user_id: {
        bsonType: 'objectId',
        description: 'Must be an ObjectId and is required'
      },
      amount: {
        bsonType: 'number',
        minimum: 0,
        description: 'Must be a non-negative number and is required'
      },
      date: {
        bsonType: 'date',
        description: 'Must be a date and is required'
      },
      payment_method: {
        'enum': [
          'credit_card',
          'debit_card',
          'cash',
          'online_payment'
        ],
        description: 'Must be one of the defined payment methods and is required'
      },
      status: {
        'enum': [
          'pending',
          'completed',
          'failed',
          'refunded'
        ],
        description: 'Must be one of the defined statuses and is required'
      },
      transaction_reference: {
        bsonType: 'string',
        description: 'Must be a string'
      }
    }
  }
}
})

db.runCommand({
   collMod: "movies",
   validator: {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'title',
      'genre',
      'duration',
      'synopsis',
      'image_url'
    ],
    properties: {
      title: {
        bsonType: 'string',
        description: 'Must be a string and is required'
      },
      genre: {
        bsonType: 'string',
        description: 'Must be a string and is required'
      },
      duration: {
        bsonType: 'int',
        minimum: 1,
        description: 'Must be an integer greater than 0 and is required'
      },
      synopsis: {
        bsonType: 'string',
        description: 'Must be a string and is required'
      },
      screening_times: {
        bsonType: 'array',
        items: {
          bsonType: 'date'
        },
        description: 'Must be an array of dates'
      },
      image_url: {
        bsonType: 'string',
        description: 'Must be a string and is required'
      }
    }
  }
}
})

db.runCommand({
   collMod: "discounts",
   validator: {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'type',
      'percentage',
      'conditions',
      'start_date',
      'end_date'
    ],
    properties: {
      type: {
        bsonType: 'string',
        description: 'Must be a string and is required'
      },
      percentage: {
        bsonType: 'number',
        minimum: 0,
        maximum: 100,
        description: 'Must be a number between 0 and 100 and is required'
      },
      conditions: {
        bsonType: 'string',
        description: 'Must be a string and is required'
      },
      start_date: {
        bsonType: 'date',
        description: 'Must be a date and is required'
      },
      end_date: {
        bsonType: 'date',
        description: 'Must be a date and is required'
      }
    }
  }
}
   
})

// Theaters collection
// El mapa de butacas del frontend esta dimensionado para diez por fila
// -.seat-map tiene min-width 364px, que es 10 x 31px + 9 huecos de 6px-, asi que
// la sala se genera con esa forma en lugar de escribir las butacas a mano. La
// numeracion sigue siendo corrida, como estaba.
const FILAS_GRAND = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
const BUTACAS_POR_FILA = 10
const asientosGrand = []
FILAS_GRAND.forEach((fila, i) => {
  for (let n = 1; n <= BUTACAS_POR_FILA; n++) {
    asientosGrand.push({
      number: i * BUTACAS_POR_FILA + n,
      row: fila,
      type: fila === FILAS_GRAND[FILAS_GRAND.length - 1] ? "VIP" : "standard"
    })
  }
})

db.theaters.insertOne({
  _id: ObjectId("66a1294d41165c14ebdd4f70"),
  name: "Grand Theater",
  capacity: asientosGrand.length,
  seats: asientosGrand
})
db.screenings.insertMany([
  {
    _id: ObjectId("66a1295d41165c14ebdd4f72"),
    movie_id: ObjectId("66a1293e41165c14ebdd4f6d"),
    theater_id: ObjectId("66a1294d41165c14ebdd4f70"),
    date_time: ISODate("2024-08-01T18:00:00.000Z"),
    base_price: 12.5,
    available_seats: 120,
    occupied_seats: []
  },
  {
    _id: ObjectId("66a1295d41165c14ebdd4f74"),
    movie_id: ObjectId("66a1293e41165c14ebdd4f6f"),
    theater_id: ObjectId("66a1294d41165c14ebdd4f70"),
    date_time: ISODate("2024-08-01T20:00:00.000Z"),
    base_price: 12.5,
    available_seats: 120,
    occupied_seats: []
  }
])

// Movies collection
db.movies.insertMany([
  {
    _id: ObjectId("66a1293e41165c14ebdd4f6d"),
    title: "The Space Odyssey",
    genre: "Sci-Fi",
    duration: 142,
    synopsis: "Eighteen months into a one-way survey of the outer system, the crew of the Meridian picks up a signal that repeats their own transmissions back at them, delayed by three days. Commander Vega wants to turn back; the ship's engineer wants to answer it. As the delay shortens, the crew realises the signal is not an echo but an invitation, and that whatever is sending it has been waiting a very long time for someone to arrive.",
    screening_times: [
      ISODate("2024-08-01T18:00:00.000Z"),
      ISODate("2024-08-01T21:00:00.000Z"),
      ISODate("2024-08-02T18:00:00.000Z")
    ],
    image_url: "/img/posters/space-odyssey.jpg"
  },
  {
    _id: ObjectId("66a1293e41165c14ebdd4f6e"),
    title: "Love in Paris",
    genre: "Romance",
    duration: 118,
    synopsis: "Claire lands in Paris with a return ticket for Sunday and a folder of contracts that will close her family's last bookshop. Mathieu is the notary hired to sign them, and he has never once left the arrondissement he was born in. Over four days of missed appointments, arguments about paperwork and one very long walk along the Seine, both of them start negotiating something neither came to negotiate.",
    screening_times: [
      ISODate("2024-08-01T19:30:00.000Z"),
      ISODate("2024-08-02T19:30:00.000Z")
    ],
    image_url: "/img/posters/love-in-paris.jpg"
  },
  {
    _id: ObjectId("66a1293e41165c14ebdd4f6f"),
    title: "The Last Stand",
    genre: "Action",
    duration: 135,
    synopsis: "The evacuation was supposed to take six hours. Fourteen hours in, Sergeant Vidal is holding a flooded metro station with nine soldiers, a broken radio and two hundred civilians who cannot be moved. The relief column is not coming, the tunnels are filling, and the only way out runs directly through what came down over the city three days ago. What began as a retreat becomes the line nobody is willing to give up.",
    screening_times: [
      ISODate("2024-08-01T20:00:00.000Z"),
      ISODate("2024-08-02T20:00:00.000Z"),
      ISODate("2024-08-03T20:00:00.000Z")
    ],
    image_url: "/img/posters/last-stand.jpg"
  },
  {
    _id: ObjectId("66a12bf041165c14ebdd4f7f"),
    title: "Quantum Leap",
    genre: "Sci-Fi Thriller",
    duration: 128,
    synopsis: "Doctor Halvorsen's experiment was meant to move a single particle four seconds into the past. It moved her instead, and it keeps moving her, a few seconds at a time, always to the same corridor on the same evening. Each loop she learns one more thing about the accident she is walking towards, and each loop she has a little less time to stop it. The physics are sound. That is the worst part.",
    screening_times: [
      ISODate("2024-09-15T19:00:00.000Z"),
      ISODate("2024-09-16T20:30:00.000Z")
    ],
    image_url: "/img/posters/quantum-leap.jpg"
  }
])

// Discounts collection
db.discounts.insertMany([
  {
    _id: ObjectId("66a129ea41165c14ebdd4f7c"),
    type: "VIP",
    percentage: 10,
    conditions: "Must have a valid VIP card",
    start_date: ISODate("2024-01-01T00:00:00.000Z"),
    end_date: ISODate("2024-12-31T00:00:00.000Z")
  },
  {
    _id: ObjectId("66a129ea41165c14ebdd4f7d"),
    type: "Early Bird",
    percentage: 15,
    conditions: "Book at least 7 days in advance",
    start_date: ISODate("2024-01-01T00:00:00.000Z"),
    end_date: ISODate("2024-12-31T00:00:00.000Z")
  },
  {
    _id: ObjectId("66a129ea41165c14ebdd4f7e"),
    type: "Student",
    percentage: 20,
    conditions: "Must present a valid student ID",
    start_date: ISODate("2024-01-01T00:00:00.000Z"),
    end_date: ISODate("2024-12-31T00:00:00.000Z")
  },
  {
    _id: ObjectId("66a12c2041165c14ebdd4f85"),
    type: "Summer Special",
    percentage: 15,
    conditions: "Valid for all screenings between June 1 and August 31",
    start_date: ISODate("2024-06-01T00:00:00.000Z"),
    end_date: ISODate("2024-08-31T00:00:00.000Z")
  }
])
// ===========================================================================
// Cines, sala norte, reparto y cartelera
//
// Lo de arriba deja las peliculas sin reparto y las funciones sin cine, y la
// aplicacion los necesita: MovieDetailDTO construye el detalle a partir de
// `cast` y de los cines de las funciones de la pelicula, asi que sin esto
// GET /api/movies/:id revienta. Ademas solo dos de las cuatro peliculas tenian
// funcion, y la cartelera solo muestra las que tienen.
// ===========================================================================

const CINE_CENTRAL = ObjectId("66a12aaa41165c14ebdd5001")
const CINE_NORTE   = ObjectId("66a12aaa41165c14ebdd5002")

db.cinemas.insertMany([
  {
    _id: CINE_CENTRAL,
    id: "cinecampus-central",
    name: "CineCampus Central",
    location: "Bogota",
    image_url: "/img/cines/central.jpg"
  },
  {
    _id: CINE_NORTE,
    id: "cinecampus-norte",
    name: "CineCampus Norte",
    location: "Medellin",
    image_url: "/img/cines/norte.jpg"
  }
])

// Segunda sala: 120 butacas, la ultima fila VIP. Se generan con un bucle en
// lugar de escribir 120 documentos a mano.
const SALA_NORTE = ObjectId("66a1294d41165c14ebdd4f71")
const filasNorte = ["A", "B", "C", "D", "E", "F", "G", "H"]
const asientosNorte = []
filasNorte.forEach((fila, i) => {
  for (let n = 1; n <= BUTACAS_POR_FILA; n++) {
    asientosNorte.push({
      number: i * BUTACAS_POR_FILA + n,
      row: fila,
      type: fila === "H" ? "VIP" : "standard"
    })
  }
})
db.theaters.insertOne({
  _id: SALA_NORTE,
  name: "Sala Norte",
  capacity: asientosNorte.length,
  seats: asientosNorte
})

const ACTORES = [
  { _id: ObjectId("66a12bbb41165c14ebdd5101"), name: "Elena Ríos",      image_url: "/img/reparto/elena-rios.jpg" },
  { _id: ObjectId("66a12bbb41165c14ebdd5102"), name: "Marcus Vidal",    image_url: "/img/reparto/marcus-vidal.jpg" },
  { _id: ObjectId("66a12bbb41165c14ebdd5103"), name: "Nadia Okonkwo",   image_url: "/img/reparto/nadia-okonkwo.jpg" },
  { _id: ObjectId("66a12bbb41165c14ebdd5104"), name: "Tomás Ferrer",    image_url: "/img/reparto/tomas-ferrer.jpg" },
  { _id: ObjectId("66a12bbb41165c14ebdd5105"), name: "Ingrid Halvorsen", image_url: "/img/reparto/ingrid-halvorsen.jpg" },
  { _id: ObjectId("66a12bbb41165c14ebdd5106"), name: "Julián Ospina",   image_url: "/img/reparto/julian-ospina.jpg" }
]
db.actors.insertMany(ACTORES)

const MOVIE_ODYSSEY = ObjectId("66a1293e41165c14ebdd4f6d")
const MOVIE_PARIS   = ObjectId("66a1293e41165c14ebdd4f6e")
const MOVIE_STAND   = ObjectId("66a1293e41165c14ebdd4f6f")
const MOVIE_QUANTUM = ObjectId("66a12bf041165c14ebdd4f7f")

const REPARTO = [
  { movie: MOVIE_ODYSSEY, cast: [
    { actor_id: ACTORES[0]._id, role: "Comandante Vega" },
    { actor_id: ACTORES[1]._id, role: "Doctor Aalto" },
    { actor_id: ACTORES[2]._id, role: "Ingeniera Sol" }
  ]},
  { movie: MOVIE_PARIS, cast: [
    { actor_id: ACTORES[2]._id, role: "Claire" },
    { actor_id: ACTORES[3]._id, role: "Mathieu" }
  ]},
  { movie: MOVIE_STAND, cast: [
    { actor_id: ACTORES[1]._id, role: "Sargento Vidal" },
    { actor_id: ACTORES[4]._id, role: "Capitana Holm" },
    { actor_id: ACTORES[5]._id, role: "El Cartografo" }
  ]},
  { movie: MOVIE_QUANTUM, cast: [
    { actor_id: ACTORES[4]._id, role: "Doctora Halvorsen" },
    { actor_id: ACTORES[5]._id, role: "Nilo" }
  ]}
]
REPARTO.forEach(r => db.movies.updateOne({ _id: r.movie }, { $set: { cast: r.cast } }))

// Las dos funciones que ya existian no tenian cine: pasan al central. Y sus
// fechas eran de agosto de 2024, asi que se mueven a los proximos dias: una
// cartelera con funciones caducadas no se puede usar.
db.screenings.find({ cinema_id: { $exists: false } }).toArray().forEach((f, i) => {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + i + 1)
  fecha.setHours(i === 0 ? 18 : 20, 0, 0, 0)
  db.screenings.updateOne(
    { _id: f._id },
    { $set: { cinema_id: CINE_CENTRAL, date_time: fecha } }
  )
})

// Cartelera de los proximos siete dias, para que las cuatro peliculas aparezcan
// y las funciones no salgan siempre caducadas.
const PELICULAS = [MOVIE_ODYSSEY, MOVIE_PARIS, MOVIE_STAND, MOVIE_QUANTUM]
const HORAS = [16, 19, 22]
const funciones = []
const horariosPorPelicula = {}

for (let dia = 0; dia < 7; dia++) {
  PELICULAS.forEach((pelicula, i) => {
    const enCentral = (dia + i) % 2 === 0
    const hora = HORAS[(dia + i) % HORAS.length]
    const fecha = new Date()
    fecha.setDate(fecha.getDate() + dia)
    fecha.setHours(hora, 0, 0, 0)

    funciones.push({
      movie_id: pelicula,
      cinema_id: enCentral ? CINE_CENTRAL : CINE_NORTE,
      theater_id: enCentral ? ObjectId("66a1294d41165c14ebdd4f70") : SALA_NORTE,
      date_time: fecha,
      base_price: enCentral ? 12.5 : 10,
      available_seats: enCentral ? asientosGrand.length : asientosNorte.length,
      occupied_seats: []
    })

    horariosPorPelicula[pelicula.toString()] = horariosPorPelicula[pelicula.toString()] || []
    horariosPorPelicula[pelicula.toString()].push(fecha)
  })
}
db.screenings.insertMany(funciones)

// screening_times de cada pelicula al dia, que es lo que pinta el detalle.
Object.keys(horariosPorPelicula).forEach(id => {
  db.movies.updateOne({ _id: ObjectId(id) }, { $set: { screening_times: horariosPorPelicula[id] } })
})

print("cines: " + db.cinemas.countDocuments({}))
print("actores: " + db.actors.countDocuments({}))
print("salas: " + db.theaters.countDocuments({}))
print("funciones: " + db.screenings.countDocuments({}))

// Dos estrenos sin funcion: son los que alimentan /api/movies/v1/coming-soon,
// que lista precisamente las peliculas que todavia no tienen funcion. Sin
// ninguna, la seccion "proximamente" de la portada sale vacia.
db.movies.insertMany([
  {
    _id: ObjectId("66a12bf041165c14ebdd4f80"),
    title: "El Ultimo Andén",
    genre: "Thriller",
    duration: 108,
    synopsis: "Irene has punched tickets on the northern line for eleven years and knows every carriage by the sound it makes. So when a twelfth carriage appears at the back of the 23:40 service, she is the only person on board who understands that it should not exist. The passengers who get on it are polite, ordinary and never get off, and the timetable insists the train has always been this long.",
    screening_times: [],
    image_url: "/img/posters/ultimo-anden.jpg",
    cast: [
      { actor_id: ObjectId("66a12bbb41165c14ebdd5103"), role: "Irene" },
      { actor_id: ObjectId("66a12bbb41165c14ebdd5106"), role: "El maquinista" }
    ]
  },
  {
    _id: ObjectId("66a12bf041165c14ebdd4f81"),
    title: "Marea de Cobre",
    genre: "Drama",
    duration: 124,
    synopsis: "When their father dies, Ada and her sister inherit a copper mine that stopped producing forty years ago and a town that never recovered from it. Ada wants to sell. Her sister has been going down the shaft every night for a month. Between the two of them lies a set of survey maps their father kept hidden, showing tunnels that were dug after the mine was officially sealed, heading somewhere the maps do not name.",
    screening_times: [],
    image_url: "/img/posters/marea-de-cobre.jpg",
    cast: [
      { actor_id: ObjectId("66a12bbb41165c14ebdd5105"), role: "Ada" },
      { actor_id: ObjectId("66a12bbb41165c14ebdd5104"), role: "Bruno" }
    ]
  }
])

print("peliculas totales: " + db.movies.countDocuments({}) + " (en cartelera: " + db.screenings.distinct("movie_id").length + ", proximamente: " + (db.movies.countDocuments({}) - db.screenings.distinct("movie_id").length) + ")")
