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

