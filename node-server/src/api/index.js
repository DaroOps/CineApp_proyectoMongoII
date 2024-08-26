import TemporaryReservation from "./temporaryReservations/temporaryReservation.model.js";



//import Cinema from './cinemas/cinema.model.js';
// import Actor from './actors/actor.model.js';
// import Theater from './theaters/theater.model.js';

// import mongoose from 'mongoose';

// export const registerModels = () => {
// //   mongoose.model('Theater', Theater);
// };

// // console.log('Registered Models:', mongoose.modelNames());


// proyecto-node-express-moderno/
// │
// ├── src/
// │   ├── config/
// │   │   ├── database.ts
// │   │   ├── express.ts
// │   │   ├── logger.ts
// │   │   └── env.ts
// │   │
// │   ├── api/
// │   │   ├── users/
// │   │   │   ├── user.model.ts
// │   │   │   ├── user.controller.ts
// │   │   │   ├── user.service.ts
// │   │   │   ├── user.validation.ts
// │   │   │   ├── user.routes.ts
// │   │   │   └── user.test.ts
// │   │   │
// │   │   ├── products/
// │   │   │   ├── product.model.ts
// │   │   │   ├── product.controller.ts
// │   │   │   ├── product.service.ts
// │   │   │   ├── product.validation.ts
// │   │   │   ├── product.routes.ts
// │   │   │   └── product.test.ts
// │   │   │
// │   │   └── index.ts
// │   │
// │   ├── middleware/
// │   │   ├── error.middleware.ts
// │   │   ├── auth.middleware.ts
// │   │   └── validation.middleware.ts
// │   │
// │   ├── utils/
// │   │   ├── asyncHandler.ts
// │   │   ├── ApiError.ts
// │   │   └── helpers.ts
// │   │
// │   ├── types/
// │   │   ├── express.d.ts
// │   │   └── environment.d.ts
// │   │
// │   └── app.ts
// │
// ├── tests/
// │   ├── integration/
// │   │   └── api.test.ts
// │   │
// │   └── unit/
// │       └── utils.test.ts
// │
// ├── scripts/
// │   ├── seed.ts
// │   └── generate-api-docs.ts
// │
// ├── public/
// │   ├── css/
// │   ├── js/
// │   └── images/
// │
// ├── views/
// │   └── index.ejs
// │
// ├── docs/
// │   ├── api.md
// │   └── setup.md
// │
// ├── .env
// ├── .env.example
// ├── .eslintrc.js
// ├── .prettierrc
// ├── .gitignore
// ├── nodemon.json
// ├── jest.config.js
// ├── tsconfig.json
// ├── package.json
// └── README.md