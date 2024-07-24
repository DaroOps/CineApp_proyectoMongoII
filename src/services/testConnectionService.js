import DbService from '../db/dbConection.js';
import Client from '../config/mongodb.js';

const adminClient = new Client(process.env.ADMIN_USER, process.env.ADMIN_PWD).getClient();
const adminDbService = new DbService(adminClient);

/**
 * This function tests the connection to MongoDB using the provided admin user and password.
 * It connects to the database, lists all collections, and logs the collections' names.
 * If an error occurs during the connection or collection listing process, it logs the error.
 * Finally, it closes the database connection.
 *
 * @returns {Promise<void>} - A promise that resolves when the connection test is completed.
 */
async function testConnection() {
  try {
    const db = await adminDbService.connect();
    const collections = await db.listCollections().toArray();
    console.log('Conexión exitosa a MongoDB');
    console.log('Colecciones en la base de datos:');
    collections.forEach(collection => {
      console.log(` - ${collection.name}`);
    });
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
  } finally {
    await adminDbService.close();
  }
}

testConnection();