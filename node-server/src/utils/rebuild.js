import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  try {
    const scriptPath = path.join(__dirname, './datarebuild/dbData.js');
    const outputPath = path.join(__dirname, './datarebuild/tempScript.js');
    
    const scriptContent = await fs.readFile(scriptPath, 'utf8');
    
    await fs.writeFile(outputPath, scriptContent);
    
    console.log("Archivo temporal creado. Ejecutando en el shell de MongoDB...");

    const { stdout, stderr } = await execPromise(`mongosh ${process.env.DB_NAME} ${outputPath}`);
    
    console.log("Salida del script:");
    console.log(stdout);
    
    if (stderr) {
      console.error("Errores durante la ejecución:");
      console.error(stderr);
    }

    // Eliminar el archivo temporal
    await fs.unlink(outputPath);
    console.log("Archivo temporal eliminado.");

  } catch (error) {
    console.error('Error al ejecutar el script:', error);
  }
}

run();