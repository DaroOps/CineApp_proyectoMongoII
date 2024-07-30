# CineCampus | Proyecto Mongo II

CineCampus es un sistema de gestión de cine que utiliza MongoDB para manejar usuarios, películas, funciones, reservas y pagos.

## Configuración del proyecto

1. Clonar el repositorio:

```bash
   git clone https://github.com/DaroOps/proyectoMongoII.git
   cd proyectoMongoII
```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Configurar las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

   ```bash
   MONGO_PROTOCOL="mongodb"
   MONGO_HOST="localhost"
   MONGO_PORT="27017,27018,27019"
   REPLICA_SET_NAME="rs"
   DB_NAME="cinecampus"
   
   ROOT_USER=null
   ROOT_PWD=null
   
   DB_ADMIN_USER="adminUser"
   DB_ADMIN_PWD="12345"
   
   VIP_USER="JaneSmith"
   VIP_PWD="12345"
   
   STAN_USER="JhonDoe"
   STAN_PWD="12345"
   ```

   > **IMPORTANTE**: Estas son credenciales de prueba. Para una conexión remota, asegúrate de que la base de datos permita transacciones.

4. Iniciar el ReplicaSet local:

   ```bash
   npm run rs
   ```

   > **NOTA**: `rs` es una dependencia de desarrollo para habilitar transacciones.
   >
   > **PRECAUCIÓN**: Mantén este servicio en segundo plano durante las pruebas. Si se detiene, la información en la base de datos se eliminará permanentemente.

5. Reconstruir la base de datos:

   ```bash
   npm run rebuild
   ```

## Ejecución del proyecto

- Probar la conexión con la base de datos:

  ```
  npm run dev
  ```

- Iniciar las operaciones en la base de datos:

  ```
  npm run main
  ```

## Scripts disponibles

- `npm run dev`: Inicia la prueba de conexión con la base de datos.
- `npm run main`: Inicia el proyecto.
- `npm run rs`: Inicia un "Replica Set" local para desarrollo.
- `npm run rebuild`: Reconstruye la base de datos.

## Flujos de la aplicación

### Flujo estándar (Usuario normal)

1. Creación de usuario estándar:

   ```javascript
   const adminUserClient = new Client(process.env.DB_ADMIN_USER, process.env.DB_ADMIN_PWD);
   const userControllerInstance = new User(adminUserClient);
   
   await userControllerInstance.createUser(
     {
       name: 'JhonDoe',
       email: 'nuevo@ejemplo.com',
       password: '12345',
     },
     'standard'
   );
   ```

```
2. Iniciar sesión como usuario estándar:
   ```javascript
   const standardUserClient = new Client(process.env.STAN_USER, process.env.STAN_PWD);
```

3. Listar películas disponibles:

   ```javascript
   const movieControllerInstance = new Movie(standardUserClient);
   await movieControllerInstance.listMovies();
   ```

4. Ver detalles de una película específica:

   ```javascript
   await movieControllerInstance.getMovieDetails("66a1293e41165c14ebdd4f6d");
   ```

5. Verificar disponibilidad de asientos:

   ```javascript
   const ticketControllerInstance = new Ticket(standardUserClient);
   await ticketControllerInstance.checkSeatAvailability("66a1295d41165c14ebdd4f72");
   ```

6. Comprar un boleto:

   ```javascript
   await ticketControllerInstance.buyTicket("66a1295d41165c14ebdd4f72", "66a7f11fa04382cf46f74960", {theater_id: '66a1294d41165c14ebdd4f70', row: 'A', number: 1});
   ```

   Nota: Un usuario estándar no puede comprar asientos VIP:

   ```javascript
   // Esto fallará para un usuario estándar
   await ticketControllerInstance.buyTicket("66a1295d41165c14ebdd4f72", "66a7f11fa04382cf46f74960", {theater_id: '66a1294d41165c14ebdd4f70', row: 'J', number: 200});
   ```

7. Procesar el pago:

   ```javascript
   const paymentControllerInstance = new Payment(standardUserClient);
   await paymentControllerInstance.processPayment("66a81738f4ffb38b4b597ef0", "cash");
   ```

### Flujo VIP

1. Creación de usuario VIP:

   ```javascript
   const adminUserClient = new Client(process.env.DB_ADMIN_USER, process.env.DB_ADMIN_PWD);
   const userControllerInstance = new User(adminUserClient);
   
   await userControllerInstance.createUser(
     {
       name: 'JaneSmith',
       email: 'JaneSmith@ejemplo.com',
       password: '12345',
     },
     'VIP'
   );
   ```

2. Iniciar sesión como usuario VIP:

   ```javascript
   const vipUserClient = new Client(process.env.VIP_USER, process.env.VIP_PWD);
   ```

3. Listar películas y ver detalles (igual que el usuario estándar):

   ```javascript
   const movieControllerInstance = new Movie(vipUserClient);
   await movieControllerInstance.listMovies();
   await movieControllerInstance.getMovieDetails("66a1293e41165c14ebdd4f6f");
   ```

4. Verificar disponibilidad de asientos:

   ```javascript
   const ticketControllerInstance = new Ticket(vipUserClient);
   await ticketControllerInstance.checkSeatAvailability("66a1295d41165c14ebdd4f74");
   ```

5. Comprar un boleto VIP:

   ```javascript
   await ticketControllerInstance.buyTicket("66a1295d41165c14ebdd4f74", "66a81d3ddbf2c45a8545c8fc", {theater_id: '66a1295d41165c14ebdd4f74', row: 'J', number: 200});
   ```

6. Verificar tarjeta VIP y aplicar descuento:

   ```javascript
   const paymentControllerInstance = new Payment(vipUserClient);
   await paymentControllerInstance.verifyVIPCardAndApplyDiscount("66a81d3ddbf2c45a8545c8fc", "66a8265732a379907791c265");
   ```

   > Nota: Los usuarios VIP pueden comprar tanto asientos estándar como VIP, y reciben descuentos especiales.

7. Procesar el pago:

   ```javascript
   await paymentControllerInstance.processPayment("66a8265732a379907791c265", "cash");
   ```


Para más detalles sobre las funcionalidades específicas, consulta la documentación de cada módulo.



# Documentacion de clases y módulos

# Payment Class Documentation

## Overview

The `Payment` class handles payment processing, discount application, and VIP card verification for a ticket booking system. It uses MongoDB for data storage and implements the Singleton pattern.

## Constructor

### `constructor()`

Initializes the Payment class instance and sets up the database connection.

- Returns: The singleton instance of the Payment class.

## Methods

### `processPayment(ticketId, paymentInfo)`

Processes a payment for a given ticket and updates the ticket status to 'paid'.

- Parameters:
  - `ticketId` (string): The unique identifier of the ticket for which the payment is being processed.
  - `paymentInfo` (object): The payment information provided by the user.
- Returns: A Promise that resolves to the payment object if the payment is successful.
- Throws: An error if the ticket is not found or if the ticket is already paid.

### `confirmPurchase(ticketId)` (Deprecated)

Confirms the purchase of a ticket by checking its existence in the database.

- Parameters:
  - `ticketId` (string): The unique identifier of the ticket to be confirmed.
- Returns: A Promise that resolves to true if the ticket is found.
- Throws: An error if the ticket is not found.
- Note: This function is deprecated and doesn't perform any operations in the database.

### `applyDiscount(ticketId, discountType)`

Applies a discount to a ticket based on the provided discount type.

- Parameters:
  - `ticketId` (string): The unique identifier of the ticket to apply the discount to.
  - `discountType` (string): The type of discount to apply.
- Returns: A Promise that resolves to true if the discount is successfully applied.
- Throws: An error if there's an issue with database operations or if the discount is not found.

### `verifyVIPCardAndApplyDiscount(userId, ticketId)`

Verifies if a user has a valid VIP card and applies a VIP discount to the ticket if applicable.

- Parameters:
  - `userId` (string): The unique identifier of the user.
  - `ticketId` (string): The unique identifier of the ticket to apply the discount to.
- Returns: A Promise that resolves to true if the VIP discount is successfully applied, false otherwise.
- Throws: An error if there's an issue with database operations or if the VIP discount is not found.

# User Class Documentation

## Overview

The `User` class manages user-related operations in the database, including user creation, retrieval, role updates, and VIP card generation. It implements the Singleton pattern for database connection management.

## Constructor

### `constructor(client = null)`

Creates a new User instance or returns the existing instance (Singleton pattern).

- Parameters:
  - `client` (Object): The database client object.
- Returns: The User instance.

## Methods

### `createUser(userData, role)`

Creates a new user in the database.

- Parameters:
  - `userData` (Object): The user's information.
    - `name` (string): The user's name.
    - `email` (string): The user's email.
    - `password` (string): The user's password.
  - `role` (string): The user's role ('standard', 'VIP', or 'admin').
- Returns: A Promise that resolves with a success message if the user is created.
- Throws: An error if the user already exists in the database.

### `getUserDetails(userId)`

Retrieves user details from the database.

- Parameters:
  - `userId` (string): The unique identifier of the user.
- Returns: A Promise that resolves with the user's details if found, or null if not found.
- Throws: An error if there is a problem connecting to the database or executing the query.

### `updateUserRole(userId, newRole)`

Updates the role of a user in the database.

- Parameters:
  - `userId` (string): The unique identifier of the user.
  - `newRole` (string): The new role to assign to the user.
- Returns: A Promise that resolves with true if the user's role is updated successfully, or false if the user is not found.
- Throws: An error if there is a problem connecting to the database or executing the query.

### `listUsers(role = null)`

Retrieves a list of users from the database based on the specified role.

- Parameters:
  - `role` (string, optional): The role to filter users by. If not provided, all users will be returned.
- Returns: A Promise that resolves with an array of user objects.
- Throws: An error if there is a problem connecting to the database or executing the query.

### `generateVIPCard()`

Generates a VIP card object with a unique card number, issue date, and expiration date.

- Returns: An object containing:
  - `card_number` (string): The unique card number.
  - `issue_date` (Date): The date the VIP card was issued.
  - `expiration_date` (Date): The date the VIP card expires.

# Ticket Class Documentation

## Overview

The `Ticket` class manages ticket-related operations in the database, including ticket purchases, seat availability checks, seat reservations, and cancellations. It implements the Singleton pattern for database connection management.

## Constructor

### `constructor(client = null)`

Creates a new Ticket instance or returns the existing instance (Singleton pattern).

- Parameters:
  - `client` (Object): The database client object.
- Returns: The Ticket instance.

## Methods

### `buyTicket(screeningId, userId, seatInfo)`

Buys a ticket for a specific screening and reserves the selected seat.

- Parameters:
  - `screeningId` (string): The ID of the screening for which the ticket is being purchased.
  - `userId` (string): The ID of the user purchasing the ticket.
  - `seatInfo` (object): The seat information containing the row and number of the selected seat.
    - `row` (string): The row of the selected seat.
    - `number` (number): The number of the selected seat.
- Returns: A Promise that resolves to the ID of the newly created ticket document in the database.
- Throws: An error if the screening, seat, user, or VIP status is invalid.

### `checkSeatAvailability(screeningId)`

Checks the availability of seats for a specific screening.

- Parameters:
  - `screeningId` (string): The ID of the screening for which the seat availability is being checked.
- Returns: A Promise that resolves to an object containing:
  - `availableSeats` (number): The number of available seats for the screening.
  - `occupiedSeats` (array): An array of objects representing the occupied seats.
- Throws: An error if the screening is not found.

### `isSeatAvailable(screening, seatInfo)`

Checks if a seat is available for a specific screening.

- Parameters:
  - `screening` (object): The screening object containing the occupied seats.
  - `seatInfo` (object): The seat information containing the row and number of the selected seat.
    - `row` (string): The row of the selected seat.
    - `number` (number): The number of the selected seat.
- Returns: A boolean indicating if the seat is available.

### `reserveSeat(screeningId, seatInfo, session)`

Reserves a seat for a specific screening.

- Parameters:
  - `screeningId` (string): The ID of the screening for which the seat is being reserved.
  - `seatInfo` (object): The seat information containing the row and number of the selected seat.
    - `row` (string): The row of the selected seat.
    - `number` (number): The number of the selected seat.
  - `session` (object): The MongoDB session for transactional operations.
- Returns: A Promise that resolves to true if the seat reservation is successful, false otherwise.
- Throws: An error if the database connection fails or if the update operation fails.

### `cancelSeatReservation(screeningId, seatInfo)`

Cancels a seat reservation for a specific screening.

- Parameters:
  - `screeningId` (string): The ID of the screening for which the seat reservation is being canceled.
  - `seatInfo` (object): The seat information containing the row and number of the selected seat.
    - `row` (string): The row of the selected seat.
    - `number` (number): The number of the selected seat.
- Returns: A Promise that resolves to true if the seat cancellation is successful, false otherwise.
- Throws: An error if the database connection fails or if the update operation fails.

# Movie Class Documentation

## Overview

The `Movie` class provides functionality to interact with movie-related data in a MongoDB database. It follows the Singleton pattern to ensure only one instance of the class is created.

## Constructor

### `constructor(client = null)`

Creates a new Movie instance or returns the existing instance.

- **Parameters:**
  - `client` (Object): The database client object.
- **Returns:** The Movie instance.

## Methods

### `async getMovieDetails(movieId)`

Retrieves the details of a movie from the database.

- **Parameters:**
  - `movieId` (string): The unique identifier of the movie.
- **Returns:** A Promise that resolves to a movie object with the following properties:
  - `_id`: The unique identifier of the movie.
  - `movie_id`: The unique identifier of the movie.
  - `theater_id`: The unique identifier of the theater.
  - `date_time`: The date and time of the screening.
  - `base_price`: The base price of the ticket.
  - `available_seats`: The number of available seats.
  - `occupied_seats`: An array of occupied seat numbers.
- **Throws:** Error if an error occurs while retrieving the movie details.

### `async listMovies()`

Retrieves a list of all movies from the database.

- **Returns:** A Promise that resolves to an array of movie objects. Each movie object contains the following properties:
  - `_id`: The unique identifier of the movie.
  - `title`: The title of the movie.
  - `genre`: The genre of the movie.
  - `duration`: The duration of the movie in minutes.
  - `synopsis`: The synopsis of the movie.
  - `screening_times`: An array of screening times for the movie.
- **Throws:** Error if an error occurs while retrieving the movies.

## Dependencies

- `mongodb`: Used for MongoDB operations.
- `DbService`: A custom service for database connections.

## Usage Example

```javascript
const client = new Client("user", "somepassword"); // Assume this is your database client
const movieInstance = new Movie(client);

// Get movie details
const movieDetails = await movieInstance.getMovieDetails('someMovieId');

// List all movies
const allMovies = await movieInstance.listMovies();
```
> Note: This class uses a Singleton pattern, ensuring that only one instance of the Movie class is created and used throughout the application.