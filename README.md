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

Claro, aquí tienes un apartado genérico para la clase `Client` que puedes insertar en la documentación de cada clase:

## Client Class

La clase `Client` se utiliza para gestionar las conexiones a la base de datos MongoDB. Proporciona un método para crear una nueva instancia de `MongoClient` con la URI y las opciones de conexión configuradas.


### Descripción del Constructor

- **Constructor:**
  - `constructor(user = null, pwd = null)`
    - **Parámetros:**
      - `user` (string, opcional): El nombre de usuario para autenticar con MongoDB.
      - `pwd` (string, opcional): La contraseña para autenticar con MongoDB.
    - **Devuelve:** Una instancia de la clase Client.

- **Métodos:**
  - `getClient()`
    - **Descripción:** Crea una nueva instancia de MongoClient con la URI y las opciones de conexión configuradas.
    - **Devuelve:** Una nueva instancia de MongoClient.
    - **Lanza:** Un error si no se puede crear la instancia de MongoClient.

---

Puedes insertar esta sección antes del constructor de cada clase (`User`, `Ticket`, `Movie`) para proporcionar una descripción general del `Client` utilizado en tu aplicación.

# Documentación de la Clase Payment

## Visión General

La clase `Payment` maneja el procesamiento de pagos, la aplicación de descuentos y la verificación de tarjetas VIP para un sistema de reservas de entradas. Utiliza MongoDB para el almacenamiento de datos e implementa el patrón Singleton.

## Constructor

### `constructor()`

Inicializa la instancia de la clase Payment y configura la conexión a la base de datos.

- Devuelve: La instancia única de la clase Payment.

## Métodos

### `processPayment(ticketId, paymentInfo)`

Procesa un pago para un boleto específico y actualiza el estado del boleto a 'paid' (pagado).

- Parámetros:
  - `ticketId` (string): El identificador único del boleto para el que se está procesando el pago.
  - `paymentInfo` (object): La información de pago proporcionada por el usuario.
- Devuelve: Una Promesa que se resuelve en el objeto de pago si el pago es exitoso.
- Lanza: Un error si no se encuentra el boleto o si el boleto ya está pagado.

### `confirmPurchase(ticketId)` (Desaprobado)

Confirma la compra de un boleto verificando su existencia en la base de datos.

- Parámetros:
  - `ticketId` (string): El identificador único del boleto a confirmar.
- Devuelve: Una Promesa que se resuelve en true si se encuentra el boleto.
- Lanza: Un error si no se encuentra el boleto.
- Nota: Esta función está desaprobada y no realiza operaciones en la base de datos.

### `applyDiscount(ticketId, discountType)`

Aplica un descuento a un boleto basado en el tipo de descuento proporcionado.

- Parámetros:
  - `ticketId` (string): El identificador único del boleto al que se aplica el descuento.
  - `discountType` (string): El tipo de descuento a aplicar.
- Devuelve: Una Promesa que se resuelve en true si el descuento se aplica con éxito.
- Lanza: Un error si hay un problema con las operaciones de la base de datos o si no se encuentra el descuento.

### `verifyVIPCardAndApplyDiscount(userId, ticketId)`

Verifica si un usuario tiene una tarjeta VIP válida y aplica un descuento VIP al boleto si es aplicable.

- Parámetros:
  - `userId` (string): El identificador único del usuario.
  - `ticketId` (string): El identificador único del boleto al que se aplica el descuento.
- Devuelve: Una Promesa que se resuelve en true si el descuento VIP se aplica con éxito, false de lo contrario.
-

 Lanza: Un error si hay un problema con las operaciones de la base de datos o si no se encuentra la tarjeta VIP.


> Esta clase proporciona una gestión completa de pagos y descuentos para un sistema de reservas de entradas, integrando funcionalidades críticas como la verificación de tarjetas VIP

# Documentación de la Clase User

## Descripción General

La clase `User` gestiona las operaciones relacionadas con los usuarios en la base de datos, incluyendo la creación, recuperación, actualización de roles y generación de tarjetas VIP. Implementa el patrón Singleton para la gestión de la conexión a la base de datos.

## Constructor

### `constructor(client = null)`

Crea una nueva instancia de User o devuelve la instancia existente (patrón Singleton).

- Parámetros:
  - `client` (Objeto): El objeto cliente de la base de datos.
- Devuelve: La instancia de User.

## Métodos

### `createUser(userData, role)`

Crea un nuevo usuario en la base de datos.

- Parámetros:
  - `userData` (Objeto): La información del usuario.
    - `name` (string): El nombre del usuario.
    - `email` (string): El correo electrónico del usuario.
    - `password` (string): La contraseña del usuario.
  - `role` (string): El rol del usuario ('standard', 'VIP' o 'admin').
- Devuelve: Una Promesa que se resuelve con un mensaje de éxito si el usuario es creado.
- Lanza: Un error si el usuario ya existe en la base de datos.

### `getUserDetails(userId)`

Recupera los detalles de un usuario de la base de datos.

- Parámetros:
  - `userId` (string): El identificador único del usuario.
- Devuelve: Una Promesa que se resuelve con los detalles del usuario si se encuentra, o null si no se encuentra.
- Lanza: Un error si hay un problema al conectar con la base de datos o al ejecutar la consulta.

### `updateUserRole(userId, newRole)`

Actualiza el rol de un usuario en la base de datos.

- Parámetros:
  - `userId` (string): El identificador único del usuario.
  - `newRole` (string): El nuevo rol para asignar al usuario.
- Devuelve: Una Promesa que se resuelve con true si el rol del usuario se actualiza correctamente, o false si no se encuentra el usuario.
- Lanza: Un error si hay un problema al conectar con la base de datos o al ejecutar la consulta.

### `listUsers(role = null)`

Recupera una lista de usuarios de la base de datos según el rol especificado.

- Parámetros:
  - `role` (string, opcional): El rol por el que filtrar los usuarios. Si no se proporciona, se devolverán todos los usuarios.
- Devuelve: Una Promesa que se resuelve con un array de objetos de usuario.
- Lanza: Un error si hay un problema al conectar con la base de datos o al ejecutar la consulta.

### `generateVIPCard()`

Genera un objeto de tarjeta VIP con un número de tarjeta único, fecha de emisión y fecha de expiración.

- Devuelve: Un objeto que contiene:
  - `card_number` (string): El número único de la tarjeta.
  - `issue_date` (Date): La fecha en que se emitió la tarjeta VIP.
  - `expiration_date` (Date): La fecha en que expira la tarjeta VIP.

# Documentación de la Clase Ticket

## Descripción General

La clase `Ticket` gestiona las operaciones relacionadas con los boletos en la base de datos, incluyendo la compra de boletos, verificación de disponibilidad de asientos, reservación de asientos y cancelaciones. Implementa el patrón Singleton para la gestión de la conexión a la base de datos.

## Constructor

### `constructor(client = null)`

Crea una nueva instancia de Ticket o devuelve la instancia existente (patrón Singleton).

- Parámetros:
  - `client` (Objeto): El objeto cliente de la base de datos.
- Devuelve: La instancia de Ticket.

## Métodos

### `buyTicket(screeningId, userId, seatInfo)`

Compra un boleto para una proyección específica y reserva el asiento seleccionado.

- Parámetros:
  - `screeningId` (string): El ID de la proyección para la cual se está comprando el boleto.
  - `userId` (string): El ID del usuario que compra el boleto.
  - `seatInfo` (objeto): La información del asiento que contiene la fila y el número del asiento seleccionado.
    - `row` (string): La fila del asiento seleccionado.
    - `number` (número): El número del asiento seleccionado.
- Devuelve: Una Promesa que se resuelve con el ID del documento del boleto recién creado en la base de datos.
- Lanza: Un error si la proyección, asiento, usuario o estado VIP no es válido.

### `checkSeatAvailability(screeningId)`

Verifica la disponibilidad de asientos para una proyección específica.

- Parámetros:
  - `screeningId` (string): El ID de la proyección para la cual se está verificando la disponibilidad de asientos.
- Devuelve: Una Promesa que se resuelve con un objeto que contiene:
  - `availableSeats` (número): El número de asientos disponibles para la proyección.
  - `occupiedSeats` (array): Un array de objetos que representan los asientos ocupados.
- Lanza: Un error si no se encuentra la proyección.

### `isSeatAvailable(screening, seatInfo)`

Verifica si un asiento está disponible para una proyección específica.

- Parámetros:
  - `screening` (objeto): El objeto de la proyección que contiene los asientos ocupados.
  - `seatInfo` (objeto): La información del asiento que contiene la fila y el número del asiento seleccionado.
    - `row` (string): La fila del asiento seleccionado.
    - `number` (número): El número del asiento seleccionado.
- Devuelve: Un booleano que indica si el asiento está disponible.

### `reserveSeat(screeningId, seatInfo, session)`

Reserva un asiento para una proyección específica.

- Parámetros:
  - `screeningId` (string): El ID de la proyección para la cual se está reservando el asiento.
  - `seatInfo` (objeto): La información del asiento que contiene la fila y el número del asiento seleccionado.
    - `row` (string): La fila del asiento seleccionado.
    - `number` (número): El número del asiento seleccionado.
  - `session` (objeto): La sesión de MongoDB para operaciones transaccionales.
- Devuelve: Una Promesa que se resuelve con true si la reservación del asiento es exitosa, false de lo contrario.
- Lanza: Un error si la conexión a la base de datos falla o si la operación de actualización falla.

### `cancelSeatReservation(screeningId, seatInfo)`

Cancela una reservación de asiento para una proyección específica.

- Parámetros:
  - `screeningId` (string): El ID de la proyección para la cual se está cancelando la reservación del asiento.
  - `seatInfo` (objeto): La información del asiento que contiene la fila y el número del asiento seleccionado.
    - `row` (string): La fila del asiento seleccionado.
    - `number` (número): El número del asiento seleccionado.
- Devuelve: Una Promesa que se resuelve con true si la cancelación de la reservación del asiento es exitosa, false de lo contrario.
- Lanza: Un error si la conexión a la base de datos falla o si la operación de actualización falla.

# Documentación de la Clase Movie

## Descripción General

La clase `Movie` proporciona funcionalidad para interactuar con los datos relacionados con las películas en una base de datos MongoDB. Sigue el patrón Singleton para asegurar que solo se cree una instancia de la clase.

## Constructor

### `constructor(client = null)`

Crea una nueva instancia de Movie o devuelve la instancia existente.

- **Parámetros:**
  - `client` (Objeto): El objeto cliente de la base de datos.

- **Devuelve:** La instancia de Movie.

## Métodos

### `async getMovieDetails(movieId)`

Recupera los detalles de una película de la base de datos.

- **Parámetros:**
  - `movieId` (string): El identificador único de la película.
- **Devuelve:** Una Promesa que se resuelve a un objeto película con las siguientes propiedades:
  - `_id`: El identificador único de la película.
  - `movie_id`: El identificador único de la película.
  - `theater_id`: El identificador único del teatro.
  - `date_time`: La fecha y hora de la proyección.
  - `base_price`: El precio base del boleto.
  - `available_seats`: El número de asientos disponibles.
  - `occupied_seats`: Un array de números de asientos ocupados.
- **Lanza:** Un error si ocurre un error al recuperar los detalles de la película.

### `async listMovies()`

Recupera una lista de todas las películas de la base de datos.

- **Devuelve:** Una Promesa que se resuelve a un array de objetos película. Cada objeto película contiene las siguientes propiedades:
  - `_id`: El identificador único de la película.
  - `title`: El título de la película.
  - `genre`: El género de la película.
  - `duration`: La duración de la película en minutos.
  - `synopsis`: La sinopsis de la película.
  - `screening_times`: Un array de horarios de proyección para la película.
- **Lanza:** Un error si ocurre un error al recuperar las películas.

## Dependencias

- `mongodb`: Utilizado para operaciones con MongoDB.
- `DbService`: Un servicio personalizado para conexiones a la base de datos.

> Nota: Esta clase utiliza un patrón Singleton, asegurando que solo se cree y utilice una instancia de la clase Movie en toda la aplicación.