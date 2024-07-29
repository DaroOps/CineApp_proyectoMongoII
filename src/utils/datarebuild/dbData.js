

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
          required: [
            'theater_id',
            'number',
            'row'
          ],
          properties: {
            theater_id: {
              bsonType: 'objectId',
              description: 'Must be an ObjectId'
            },
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
      'synopsis'
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
db.theaters.insertOne(
  {
    _id: ObjectId("66a1294d41165c14ebdd4f70"),
    name: "Grand Theater",
    capacity: 200,
    seats: [
      { number: 1, row: "A", type: "standard" },
      { number: 2, row: "A", type: "standard" },
      { number: 3, row: "A", type: "standard" },
      { number: 4, row: "A", type: "standard" },
      { number: 5, row: "A", type: "standard" },
      { number: 6, row: "A", type: "standard" },
      { number: 7, row: "A", type: "standard" },
      { number: 8, row: "A", type: "standard" },
      { number: 9, row: "A", type: "standard" },
      { number: 10, row: "A", type: "standard" },
      { number: 11, row: "A", type: "standard" },
      { number: 12, row: "A", type: "standard" },
      { number: 13, row: "A", type: "standard" },
      { number: 14, row: "A", type: "standard" },
      { number: 15, row: "A", type: "standard" },
      { number: 16, row: "A", type: "standard" },
      { number: 17, row: "A", type: "standard" },
      { number: 18, row: "A", type: "standard" },
      { number: 19, row: "A", type: "standard" },
      { number: 20, row: "A", type: "standard" },
      { number: 21, row: "B", type: "standard" },
      { number: 22, row: "B", type: "standard" },
      { number: 23, row: "B", type: "standard" },
      { number: 24, row: "B", type: "standard" },
      { number: 25, row: "B", type: "standard" },
      { number: 26, row: "B", type: "standard" },
      { number: 27, row: "B", type: "standard" },
      { number: 28, row: "B", type: "standard" },
      { number: 29, row: "B", type: "standard" },
      { number: 30, row: "B", type: "standard" },
      { number: 31, row: "B", type: "standard" },
      { number: 32, row: "B", type: "standard" },
      { number: 33, row: "B", type: "standard" },
      { number: 34, row: "B", type: "standard" },
      { number: 35, row: "B", type: "standard" },
      { number: 36, row: "B", type: "standard" },
      { number: 37, row: "B", type: "standard" },
      { number: 38, row: "B", type: "standard" },
      { number: 39, row: "B", type: "standard" },
      { number: 40, row: "B", type: "standard" },
      { number: 41, row: "C", type: "standard" },
      { number: 42, row: "C", type: "standard" },
      { number: 43, row: "C", type: "standard" },
      { number: 44, row: "C", type: "standard" },
      { number: 45, row: "C", type: "standard" },
      { number: 46, row: "C", type: "standard" },
      { number: 47, row: "C", type: "standard" },
      { number: 48, row: "C", type: "standard" },
      { number: 49, row: "C", type: "standard" },
      { number: 50, row: "C", type: "standard" },
      { number: 51, row: "C", type: "standard" },
      { number: 52, row: "C", type: "standard" },
      { number: 53, row: "C", type: "standard" },
      { number: 54, row: "C", type: "standard" },
      { number: 55, row: "C", type: "standard" },
      { number: 56, row: "C", type: "standard" },
      { number: 57, row: "C", type: "standard" },
      { number: 58, row: "C", type: "standard" },
      { number: 59, row: "C", type: "standard" },
      { number: 60, row: "C", type: "standard" },
      { number: 61, row: "D", type: "standard" },
      { number: 62, row: "D", type: "standard" },
      { number: 63, row: "D", type: "standard" },
      { number: 64, row: "D", type: "standard" },
      { number: 65, row: "D", type: "standard" },
      { number: 66, row: "D", type: "standard" },
      { number: 67, row: "D", type: "standard" },
      { number: 68, row: "D", type: "standard" },
      { number: 69, row: "D", type: "standard" },
      { number: 70, row: "D", type: "standard" },
      { number: 71, row: "D", type: "standard" },
      { number: 72, row: "D", type: "standard" },
      { number: 73, row: "D", type: "standard" },
      { number: 74, row: "D", type: "standard" },
      { number: 75, row: "D", type: "standard" },
      { number: 76, row: "D", type: "standard" },
      { number: 77, row: "D", type: "standard" },
      { number: 78, row: "D", type: "standard" },
      { number: 79, row: "D", type: "standard" },
      { number: 80, row: "D", type: "standard" },
      { number: 81, row: "E", type: "standard" },
      { number: 82, row: "E", type: "standard" },
      { number: 83, row: "E", type: "standard" },
      { number: 84, row: "E", type: "standard" },
      { number: 85, row: "E", type: "standard" },
      { number: 86, row: "E", type: "standard" },
      { number: 87, row: "E", type: "standard" },
      { number: 88, row: "E", type: "standard" },
      { number: 89, row: "E", type: "standard" },
      { number: 90, row: "E", type: "standard" },
      { number: 91, row: "E", type: "standard" },
      { number: 92, row: "E", type: "standard" },
      { number: 93, row: "E", type: "standard" },
      { number: 94, row: "E", type: "standard" },
      { number: 95, row: "E", type: "standard" },
      { number: 96, row: "E", type: "standard" },
      { number: 97, row: "E", type: "standard" },
      { number: 98, row: "E", type: "standard" },
      { number: 99, row: "E", type: "standard" },
      { number: 100, row: "E", type: "standard" },
      { number: 101, row: "F", type: "standard" },
      { number: 102, row: "F", type: "standard" },
      { number: 103, row: "F", type: "standard" },
      { number: 104, row: "F", type: "standard" },
      { number: 105, row: "F", type: "standard" },
      { number: 106, row: "F", type: "standard" },
      { number: 107, row: "F", type: "standard" },
      { number: 108, row: "F", type: "standard" },
      { number: 109, row: "F", type: "standard" },
      { number: 110, row: "F", type: "standard" },
      { number: 111, row: "F", type: "standard" },
      { number: 112, row: "F", type: "standard" },
      { number: 113, row: "F", type: "standard" },
      { number: 114, row: "F", type: "standard" },
      { number: 115, row: "F", type: "standard" },
      { number: 116, row: "F", type: "standard" },
      { number: 117, row: "F", type: "standard" },
      { number: 118, row: "F", type: "standard" },
      { number: 119, row: "F", type: "standard" },
      { number: 120, row: "F", type: "standard" },
      { number: 121, row: "G", type: "standard" },
      { number: 122, row: "G", type: "standard" },
      { number: 123, row: "G", type: "standard" },
      { number: 124, row: "G", type: "standard" },
      { number: 125, row: "G", type: "standard" },
      { number: 126, row: "G", type: "standard" },
      { number: 127, row: "G", type: "standard" },
      { number: 128, row: "G", type: "standard" },
      { number: 129, row: "G", type: "standard" },
      { number: 130, row: "G", type: "standard" },
      { number: 131, row: "G", type: "standard" },
      { number: 132, row: "G", type: "standard" },
      { number: 133, row: "G", type: "standard" },
      { number: 134, row: "G", type: "standard" },
      { number: 135, row: "G", type: "standard" },
      { number: 136, row: "G", type: "standard" },
      { number: 137, row: "G", type: "standard" },
      { number: 138, row: "G", type: "standard" },
      { number: 139, row: "G", type: "standard" },
      { number: 140, row: "G", type: "standard" },
      { number: 141, row: "H", type: "standard" },
      { number: 142, row: "H", type: "standard" },
      { number: 143, row: "H", type: "standard" },
      { number: 144, row: "H", type: "standard" },
      { number: 145, row: "H", type: "standard" },
      { number: 146, row: "H", type: "standard" },
      { number: 147, row: "H", type: "standard" },
      { number: 148, row: "H", type: "standard" },
      { number: 149, row: "H", type: "standard" },
      { number: 150, row: "H", type: "standard" },
      { number: 151, row: "H", type: "standard" },
      { number: 152, row: "H", type: "standard" },
      { number: 153, row: "H", type: "standard" },
      { number: 154, row: "H", type: "standard" },
      { number: 155, row: "H", type: "standard" },
      { number: 156, row: "H", type: "standard" },
      { number: 157, row: "H", type: "standard" },
      { number: 158, row: "H", type: "standard" },
      { number: 159, row: "H", type: "standard" },
      { number: 160, row: "H", type: "standard" },
      { number: 161, row: "I", type: "VIP" },
      { number: 162, row: "I", type: "VIP" },
      { number: 163, row: "I", type: "VIP" },
      { number: 164, row: "I", type: "VIP" },
      { number: 165, row: "I", type: "VIP" },
      { number: 166, row: "I", type: "VIP" },
      { number: 167, row: "I", type: "VIP" },
      { number: 168, row: "I", type: "VIP" },
      { number: 169, row: "I", type: "VIP" },
      { number: 170, row: "I", type: "VIP" },
      { number: 171, row: "I", type: "VIP" },
      { number: 172, row: "I", type: "VIP" },
      { number: 173, row: "I", type: "VIP" },
      { number: 174, row: "I", type: "VIP" },
      { number: 175, row: "I", type: "VIP" },
      { number: 176, row: "I", type: "VIP" },
      { number: 177, row: "I", type: "VIP" },
      { number: 178, row: "I", type: "VIP" },
      { number: 179, row: "I", type: "VIP" },
      { number: 180, row: "I", type: "VIP" },
      { number: 181, row: "J", type: "VIP" },
      { number: 182, row: "J", type: "VIP" },
      { number: 183, row: "J", type: "VIP" },
      { number: 184, row: "J", type: "VIP" },
      { number: 185, row: "J", type: "VIP" },
      { number: 186, row: "J", type: "VIP" },
      { number: 187, row: "J", type: "VIP" },
      { number: 188, row: "J", type: "VIP" },
      { number: 189, row: "J", type: "VIP" },
      { number: 190, row: "J", type: "VIP" },
      { number: 191, row: "J", type: "VIP" },
      { number: 192, row: "J", type: "VIP" },
      { number: 193, row: "J", type: "VIP" },
      { number: 194, row: "J", type: "VIP" },
      { number: 195, row: "J", type: "VIP" },
      { number: 196, row: "J", type: "VIP" },
      { number: 197, row: "J", type: "VIP" },
      { number: 198, row: "J", type: "VIP" },
      { number: 199, row: "J", type: "VIP" },
      { number: 200, row: "J", type: "VIP" }
    ]
  }
 )
    

// Screenings collection
db.screenings.insertMany([
  {
    _id: ObjectId("66a1295d41165c14ebdd4f72"),
    movie_id: ObjectId("66a1293e41165c14ebdd4f6d"),
    theater_id: ObjectId("66a1294d41165c14ebdd4f70"),
    date_time: ISODate("2024-08-01T18:00:00.000Z"),
    base_price: 12.5,
    available_seats: 200,
    occupied_seats: []
  },
  {
    _id: ObjectId("66a1295d41165c14ebdd4f74"),
    movie_id: ObjectId("66a1293e41165c14ebdd4f6f"),
    theater_id: ObjectId("66a1294d41165c14ebdd4f70"),
    date_time: ISODate("2024-08-01T20:00:00.000Z"),
    base_price: 12.5,
    available_seats: 200,
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
    synopsis: "A journey through space and time that challenges the very nature of human existence.",
    screening_times: [
      ISODate("2024-08-01T18:00:00.000Z"),
      ISODate("2024-08-01T21:00:00.000Z"),
      ISODate("2024-08-02T18:00:00.000Z")
    ]
  },
  {
    _id: ObjectId("66a1293e41165c14ebdd4f6e"),
    title: "Love in Paris",
    genre: "Romance",
    duration: 118,
    synopsis: "A heartwarming tale of two strangers who find love in the city of lights.",
    screening_times: [
      ISODate("2024-08-01T19:30:00.000Z"),
      ISODate("2024-08-02T19:30:00.000Z")
    ]
  },
  {
    _id: ObjectId("66a1293e41165c14ebdd4f6f"),
    title: "The Last Stand",
    genre: "Action",
    duration: 135,
    synopsis: "An elite team of heroes must make their last stand against an unstoppable alien invasion.",
    screening_times: [
      ISODate("2024-08-01T20:00:00.000Z"),
      ISODate("2024-08-02T20:00:00.000Z"),
      ISODate("2024-08-03T20:00:00.000Z")
    ]
  },
  {
    _id: ObjectId("66a12bf041165c14ebdd4f7f"),
    title: "Quantum Leap",
    genre: "Sci-Fi Thriller",
    duration: 128,
    synopsis: "A physicist becomes entangled in a time-bending experiment that challenges the fabric of reality.",
    screening_times: [
      ISODate("2024-09-15T19:00:00.000Z"),
      ISODate("2024-09-16T20:30:00.000Z")
    ]
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