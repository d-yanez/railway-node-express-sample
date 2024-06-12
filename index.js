const express = require("express");
const bodyParse = require("body-parser");
const axios = require('axios');

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



  //otra forma de autenticar con api google sheet

// authenticate the service account
  const googleAuth = new google.auth.JWT(
    process.env.CLIENT_EMAIL,
    null,
    process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    'https://www.googleapis.com/auth/spreadsheets'
  );
  //source: https://medium.com/@shkim04/beginner-guide-on-google-sheet-api-for-node-js-4c0b533b071a

  app.get("/read",async (req,res) =>{
    console.log("/read");
    try {
      // google sheet instance
      const sheetInstance = await google.sheets({ version: 'v4', auth: googleAuth});
      // read data in the range in a sheet
      let googleSheetId = "1h04Fl3ilxdDLF_0Yx2rHR_2W1RQu63pm5S_3enkexzI";
      //let googleSheetPage="rev_stock_full"
      let googleSheetPage="test2"
      const infoObjectFromSheet = await sheetInstance.spreadsheets.values.get({
          auth: googleAuth,
          spreadsheetId: googleSheetId,
          range: `${googleSheetPage}!A1:C3`
      });
      
      const valuesFromSheet = infoObjectFromSheet.data.values;
      //for (let i in valuesFromSheet)
      //  console.log(valuesFromSheet[i][0])
      console.log(valuesFromSheet);
    }
    catch(err) {
      console.log("readSheet func() error", err);  
    }

    res.status(200).send({msg:`OK`})
  });



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

    //const data = sheet.getDataRange().getValues();
    //data.forEach(function (row) {
    //  console.log(row)
   // });


    //console.log(registos[0]['sku']);
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

app.get("/update",async (req,res) =>{
  const doc = new GoogleSpreadsheet('1h04Fl3ilxdDLF_0Yx2rHR_2W1RQu63pm5S_3enkexzI');
  //await doc.useServiceAccountAuth(credentials);
  servicePrivateKey = process.env.PRIVATE_KEY;
  await doc.useServiceAccountAuth({
    client_email:process.env.CLIENT_EMAIL,
    private_key:servicePrivateKey.replace(/\\n/g, '\n')
  });
  await doc.loadInfo();

  const sheet =   doc.sheetsByIndex[1];

  sheet.getRange(1,'')
  
  res.status(200).send({msg:`valor: OK`})
});

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
  console.log("titulo:",registos[0].titulo," sku:",req.query.sku);
    //registos.forEach(function (row) {
      //console.log(row.rowNumber)
     // console.log(row.value)
     // return ;
    //});






  const sku_temp = req.query.sku;
  //console.log(registos.getValues())
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
                  caja:registos[i]['id_caja'],
                  obs1:registos[i]['obs_a'],
                  row:i
                });
      }
  }

  console.log("total->",total);
  res.render('../views/index',{registros:registros_temp,sku:sku_temp,total:total});
});


//Buscador por boton viewer

//Resultado de busqueda

app.get("/suggest", async (req,res) =>{

  console.log(process.env.CLIENT_EMAIL);
  const doc = new GoogleSpreadsheet('1h04Fl3ilxdDLF_0Yx2rHR_2W1RQu63pm5S_3enkexzI');
  //await doc.useServiceAccountAuth(credentials);
  servicePrivateKey = process.env.PRIVATE_KEY;
  await doc.useServiceAccountAuth({
    client_email:process.env.CLIENT_EMAIL,
    private_key:servicePrivateKey.replace(/\\n/g, '\n')
  });
  await doc.loadInfo();

  const sheet =   doc.sheetsByIndex[1];//
  //filter in sheet by not traer todo!!!
  const registos = await sheet.getRows();
  // consumir por cada publicacion

  for(let i = 0;i < registos.length; i ++){

    sku = registos[i]['publicacion']
    console.log(`calling by sku ->${sku}`)
    url = `http://localhost:2977/pub?sku=${sku}`
    // GET request for remote image in node.js
    let res = await axios({
      method: 'get',
      url: url,
      responseType: 'json'
    });
    console.log(res.data)
  }


  //console.log(registos);
  res.status(200).send({msg:"Hola!!!"})
});

app.get("/",(req,res) =>{
    res.status(200).send({msg:"Hola!!!"})
});
app.post("/welcome",(req,res)=>{
    const {username} = req.body;
    res.status(200).send({msg:`Hola, ${username}`});
});

app.get("/pub",async (req,res) =>{
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
  console.log(registos[0].titulo);
  const sku_temp = req.query.sku;
  //console.log(registos.getValues())
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
                  caja:registos[i]['id_caja'],
                  row:i
                });
      }
  }

  console.log(total);
  res.status(200).json({data:registros_temp});
});




app.listen(PORT,() =>{
    console.log(`Tu server esta listo en el puerto->${PORT}`)
});


