const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');
const path = require('path');

// ID de la hoja de Google
const SPREADSHEET_ID = '1h04Fl3ilxdDLF_0Yx2rHR_2W1RQu63pm5S_3enkexzI';

// Cargar las credenciales del archivo JSON descargado de Google Cloud
//const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, 'credentials.json')));

async function getSheetData() {
  const doc = new GoogleSpreadsheet('1h04Fl3ilxdDLF_0Yx2rHR_2W1RQu63pm5S_3enkexzI');

  // Autenticación usando el método useServiceAccountAuth
  //await doc.useServiceAccountAuth({
  //  client_email: credentials.client_email,
  //  private_key: credentials.private_key
  //});

  servicePrivateKey = process.env.PRIVATE_KEY;
  await doc.useServiceAccountAuth({
    client_email:process.env.CLIENT_EMAIL,
    private_key:servicePrivateKey.replace(/\\n/g, '\n')
  });

  // Cargar la hoja de cálculo
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0]; // Accede a la primera hoja de la hoja de cálculo
  const rows = await sheet.getRows(); // Obtiene todas las filas

  // Extraer las columnas SKU, Título, Stock, Ubicación y Observación
  const productos = {};

  rows.forEach(row => {
    const sku = row['sku'];
    const titulo = row['titulo'];
    const stock = row['stock_total'];
    const ubicacion = row['id_caja'];
    const observacion = row['obs_a'];

    if (!productos[sku]) {
      productos[sku] = {
        titulo,
        sku,
        ubicaciones: []
      };
    }

    productos[sku].ubicaciones.push({
      stock,
      ubicacion,
      observacion
    });
  });

  return Object.values(productos);
}

module.exports = getSheetData;
