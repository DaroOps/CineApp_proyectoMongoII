import DbService from '../db/dbConection.js';
import Client from '../config/mongodb.js';

const adminClient = new Client(process.env.ADMIN_USER, process.env.ADMIN_PWD).getClient();
const adminDbService = new DbService(adminClient);

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