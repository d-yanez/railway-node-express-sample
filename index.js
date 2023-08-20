const express = require("express");
const bodyParse = require("body-parser");

const {google} = require("googleapis");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const sheets = google.sheets('v4');
// Credenciales de autenticación. Sigue las instrucciones para obtener tus credenciales.
//const credentials = require('./credentials.json');

const app = express();
const PORT = process.env.PORT || 2977;

app.use(bodyParse.urlencoded({extends:true}));
app.use(bodyParse.json());
app.set('views','./views');
app.set('view engine','pug');


// ID de la hoja de Google Sheets
const spreadsheetId = '1Ga9Mj4qpSnLy54wUv3usADexGsaNZ4fFA9zN0beoTeM';
// Rango de la celda que deseas leer, por ejemplo, 'Sheet1!A1'
const range = 'test!A1';

// Autenticación con las credenciales
//const auth = new google.auth.GoogleAuth({
//    credentials,
//    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
//  });


  // read from inventory
  async function accessDocument(sku) {
    //console.log(process.env.CLIENT_EMAIL)
    const doc = new GoogleSpreadsheet('1h04Fl3ilxdDLF_0Yx2rHR_2W1RQu63pm5S_3enkexzI');
    //await doc.useServiceAccountAuth(credentials);
    await doc.useServiceAccountAuth({
      client_email:process.env.CLIENT_EMAIL,
      private_key:process.env.PRIVATE_KEY
    });
    await doc.loadInfo();

    const sheet =   doc.sheetsByIndex[0];
    const registos = await sheet.getRows();
    //console.log(registos[0]['sku']);
    data = registos[0]['sku'];
    console.log(`sheet.rowCount ->${sheet.rowCount}`);
    console.log(`registos.length ->${registos.length}`);
    //console.log(registos[0]['sku']);
    //console.log(registos[0]['stock_total']);
    let total = 0;
    for(let i = 0;i < registos.length; i ++){
        //if(registos[i]['sku'] === sku){
        if(registos[i]['sku'] === sku){
            console.log(`stock ->${registos[i]['stock_total']} in caja ->${registos[i]['id_caja']} for sku:${sku}`)
            total = total + parseInt(registos[i]['stock_total']);
        }
        //console.log(registos[i]['sku']);
        //console.log(registos[i]['stock_total']);
    }
    console.log(`total stock->${total} para sku->${sku}`);
    //for (let i = 0; i < sheet.rowCount; i++){
        //if 
    //    console.log(`stock ->${registos[i]['stock total']} in caja ->${registos[i]['id caja']} for sku:${sku}`)
    //}


    return  data;

  };

  async function accessDocumentSync(sku) {
    const doc = new GoogleSpreadsheet('1Ga9Mj4qpSnLy54wUv3usADexGsaNZ4fFA9zN0beoTeM');
    //await doc.useServiceAccountAuth(credentials);
    await doc.useServiceAccountAuth({
      client_email:process.env.CLIENT_EMAIL,
      private_key:process.env.PRIVATE_KEY
    });
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const registros = sheet.getRows();

    console.log(sheet.title);

    return {resp:sheet.title};

  };


  app.get("/inventory",(req,res) =>{
    const sku = req.query.sku;
    console.log(`sku->${sku}`)
    let resp_sheet =  accessDocument(sku);

    res.status(200).send({msg:`valor: ${resp_sheet}`})
  });

//routes and add controllers

app.get("/views",async (req,res) =>{
  console.log(process.env.CLIENT_EMAIL);
  const doc = new GoogleSpreadsheet('1h04Fl3ilxdDLF_0Yx2rHR_2W1RQu63pm5S_3enkexzI');
  //await doc.useServiceAccountAuth(credentials);
  servicePrivateKey = process.env.PRIVATE_KEY;
  await doc.useServiceAccountAuth({
    client_email:process.env.CLIENT_EMAIL,
    private_key:servicePrivateKey.replace(/\\n/g, '\n')
  });
  await doc.loadInfo();

  //{
  //  client_email: serviceEmail,
  //  private_key: servicePrivateKey.replace(/\\n/g, '\n'),
  //}

  const sheet =   doc.sheetsByIndex[0];
  //filter in sheet by not traer todo!!!
  const registos = await sheet.getRows();
  const sku_temp = req.query.sku;
  //console.log(`sku->${sku}`)
  registros_temp = [
                    {titulo:registos[0]['titulo'],stock:registos[0]['stock_total']},
                    {titulo:registos[1]['titulo'],stock:registos[1]['stock_total']},
                  ];
  registros_temp = [];    
  let total = 0;  
  for(let i = 0;i < registos.length; i ++){
      //if(registos[i]['sku'] === sku){
      if(registos[i]['sku'] === sku_temp){
          //console.log(`stock ->${registos[i]['stock_total']} in caja ->${registos[i]['id_caja']} for sku:${sku}`)
          total = total + parseInt(registos[i]['stock_total']);
          registros_temp.push({
                  titulo:registos[i]['titulo'],
                  stock:registos[i]['stock_total'],
                  caja:registos[i]['id_caja']
                });
      }
      //console.log(registos[i]['sku']);
      //console.log(registos[i]['stock_total']);
  }


  //renderizar
  //res.render('../views/index',{registos});
  //let total = registros_temp.length;
  console.log(total);
  res.render('../views/index',{registros:registros_temp,sku:sku_temp,total:total});


});


//Buscador por boton viewer

//Resultado de busqueda



app.get("/",(req,res) =>{
    res.status(200).send({msg:"Hola!!!"})
});
app.post("/welcome",(req,res)=>{
    const {username} = req.body;
    res.status(200).send({msg:`Hola, ${username}`});
});
app.listen(PORT,() =>{
    console.log(`Tu server esta listo en el puerto->${PORT}`)
});


