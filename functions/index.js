// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
const axios = require('axios');
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const firebaseAdmin= require('firebase-admin');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

firebaseAdmin.initializeApp({
credential: firebaseAdmin.credential.applicationDefault(),
  databaseURL: 'ws://botsi-oxrr-default-rtdb.firebaseio.com/',
},functions.config().firebase);
const db = firebaseAdmin.firestore();





exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  function usuarionuevo(agent){
    agent.add( "Procesando..." );
        let Cliente = agent.parameters["given-name"];
    let Apellido = agent.parameters["last-name"];
    let Empresa = agent.parameters["empresas"];
    let Telefono = agent.parameters["phone-number"];
    let Correo = agent.parameters["email"];
    let Solicitud = agent.parameters["solicitud"];
agent.add( "Hola " + Cliente + " de la empresa " + Empresa ); 
axios.post('https://sheet.best/api/sheets/84107fe9-776b-4a9f-972c-2ae133d29243',{Cliente,Apellido,Empresa,Telefono,Correo,Solicitud});
       
        agent.add( "Listo!! " +Cliente+ " tu solicitud de " +Solicitud + " se agregó correctamente" );
    agent.add( "En un momento más te asignaré un ejecutivo para que te dé seguimiento." );
  agent.add ("Grabando en Firebase"); 
    return firebaseAdmin.database().ref('UsuariosDialogFlow').set({
    Nombre: Cliente,
      Apellido : Apellido,
      Empresa,
      Telefono,
      Correo,
      Solicitud,
      id: 1
    });
  
  }
  
    function writeToDb (agent) {
    // Get parameter from Dialogflow with the string to add to the database
    //const databaseEntry = agent.parameters.dato;
      
      const coleccion = "EntradasDB";
      const documento = agent.parameters["documento"];
      let databaseEntry = agent.parameters["dato"];
      let fecha = agent.parameters["date"];
      let telefono = agent.parameters["phone-number"];
       agent.add(`Listo, grabé del documento "${documento}" en FireStore para la fecha "${fecha}", te mandaremos mas informacion al whatsapp."${telefono}"`);

    // Get the database collection 'dialogflow' and document 'agent' and store
    // the document  {entry: "<value of database entry>"} in the 'agent' document
    const dialogflowAgentRef = db.collection(coleccion).doc(documento);
    return db.runTransaction(t => {
      t.set(dialogflowAgentRef, {Dato: databaseEntry ,Fecha: fecha, Telefono: telefono});
      return Promise.resolve('Write complete');
    }).then(doc => {
      agent.add(`Listo, grabé "${databaseEntry}" en FireStore para el documento "${documento}", te mandaremos mas informacion al whatsapp."${telefono}"`);
    }).catch(err => {
      console.log(`Error escribiendo en Firestore: ${err}`);
      agent.add(`Error al escribir "${databaseEntry}" en la base de datos.`);
    });
  }
  
  function AltaProducto (agent) {
    // Obtener los parametros dese el intent de Dialogflow
    const databaseEntry = agent.parameters.dato;
      
      const coleccion = "Productos";
      const documento = agent.parameters["producto"];
      let categoria = agent.parameters["categoria"];
      let costo = agent.parameters["costo"];
      let plazo = agent.parameters["plazo"];
      

    // Get the database collection 'dialogflow' and document 'agent' and store
    // the document  {entry: "<value of database entry>"} in the 'agent' document
    const dialogflowAgentRef = db.collection(coleccion).doc(documento);
    return db.runTransaction(t => {
      t.set(dialogflowAgentRef, {Categoria: categoria,Costo: costo, Plazo:plazo});
      return Promise.resolve('Write complete');
    }).then(doc => {
      agent.add(`Listo, el producto "${documento}" está ahora en el catálogo, ve al sitio web para darle los arreghlos finales "${documento}", te mandaremos mas informacion al whatsapp."${telefono}"`);
    }).catch(err => {
      console.log(`Error escribiendo en Firestore: ${err}`);
      agent.add(`Error al agregar "${documento}" en la base de datos.`);
    });
  }
  
  
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('usuarioNuevo', usuarionuevo);
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('usuarioNuevo', usuarionuevo);
  intentMap.set('escribeDB', writeToDb);
  intentMap.set('Producto.Alta', AltaProducto);
  
  
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
