/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
"use strict";
const axios = require("axios");
const functions = require("firebase-functions");
const {google} = require('googleapis');
const {WebhookClient} = require("dialogflow-fulfillment");
const {Card, Suggestion} = require("dialogflow-fulfillment");
const firebaseAdmin= require("firebase-admin");

const calendarId = "v1plooqmglddptoqjf85im0nmg@group.calendar.google.com"
 const serviceAccount = {
  "type": "service_account",
  "project_id": "botsi-oxrr",
  "private_key_id": "286a9aaa62528636ac082c1cb8fe1edc48a2b833",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDLJwgTo+Xac7Vu\nEECeAKwDHKNUu0SSmsxEQIJ4U1dB6ZTtvh5+nVZruprznZ2eYOLJlExGu3qZecF+\nDkwzB+ZKR70PSMSthdgdaC2yq6TdcG3LjDGYVJAFOplMO47e1pk3BOXAWKumvyZy\nFGmxfJ7t5kLHFHXTS41Q6A3bXp86rabfiZ2wcHXJMhW6mNfCIZECpv4qxOIQl9QW\nvDcxmQov9vieYVs47zO3/NlW6vwbKYd6iIc5dzLUG4ZIXfXRcC5kKnEsF37tuAUP\n8647KSRoGo3C4UwUEK/jvO8jaO8ECttZkAxVDSKconS8D/thxpB34Od0ORbHgE3p\nhgE/0GvRAgMBAAECggEAC4LbLM25LP8odSObnbhZBtYdFSSFVq9JysZC/lFunNAA\n/dWrga4lovYQaKRyNXK09wodplZiNIcXJS7nN28HqAbXmiGb718pp0TrbffW4CtK\nNWHsv35vKLSw0gZ/6nWLefgfkp4Tn9+t7IHmmUV/9ef5ubEZmg7qY366pkb+y8LI\nStmIJaJn+tEvwblvmuTEpKBca6GUbkS1pwhKslqc53DWd9SYt54XMj+Q2wZt/a3a\ne06BwauZq0jInLelI8gN9vTG1Li1YS4ZekFdYEAfC196h5AWl5jw0CWq/451Opor\no/5XdgKZH0YzuP0PUZj0tIGQ9T5liCN5+F0jw0OyYQKBgQD1sIbDH84toMNPsQ7c\nZAHDUqPexe27GDfE6T+a76b25thhVhsB67pEezhLetfwmKqlgyykLDx5pQok5AP4\nFpC/Muc8kt9ohzOzdDt4Tp/pCvMKh8YoDvgd2mjYmCsMzAQMSG2SBDP3V8kq1dd9\nS4FPQfQY8xtvqjCHi0IQ8r+EyQKBgQDTrYYcfg0yQT0iJOTafwQoLO1M9lVWndm0\nit3dmbdkP8vWaulZQJq72v8BkLSz4eqEi3AUz/z3X6NCeS/7xTM2Ctj8uYN/kpHJ\nBLAiySvV41cEc6B0mGEHtPwLbfI9SAbuE9vjhl/UYb7rlFZ1j/YGRYVMmrx3Vpkm\nyd6Xcm7ayQKBgF8rM+hdZ5YREdbKtQD11CD+3+8pKD8y0Fd8KmEvt7MoFGUP34JM\n92gTeujx+rd9y4w1VZN6dyp/nYBQuqDczNDjPOMf2V46EPLQcUDW4+Z3kVFg6ocV\n1VJrCfXsa7CXTnIblCXdbuu+m3P2RXSJTNuQpqcLdHM6r3WxobPC9CDRAoGAVxTO\n1E/i++as0Kwe3ehc/G4nHX9FckGz+zsZtP103bAFGmuXHdmfDmM0fx9Zx5rMEMUQ\nUe+SoO3eSw1x+QCSZcwmoilreIMCqJDeKSFbgD1rYfBzdSPu3u3MtqL/gchs2Wqg\nDkUMjWG82kuHGgwkaUYWZYJOwEWG8dcgVGuGQUkCgYAhiPjtJSBqWJ3ymWex16Yl\n1VJttH8JNm2zxRiJtjfHHiARtL35HXQhgDWpztwQ59jgZDhnlMQxW7wfjKIqkeb+\nFOeEGyVMXnc3oC7C/M+QWl8eab68U61BbSDCVUAXi3wxtbWe6jZaOKalF0ODp3cj\n/qaJrmQZTS1YZy6qhw7Ong==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-7of04@botsi-oxrr.iam.gserviceaccount.com",
  "client_id": "100996580076431011253",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7of04%40botsi-oxrr.iam.gserviceaccount.com"
}; 

 // Set up Google Calendar Service account credentials
 const serviceAccountAuth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: 'https://www.googleapis.com/auth/calendar'
});

const calendar = google.calendar('v3');


const timeZone = 'America/Mexico_City';
const timeZoneOffset = '-06:00';






process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.applicationDefault(),
  databaseURL: "ws://botsi-oxrr-default-rtdb.firebaseio.com/",
}, functions.config().firebase);
const db = firebaseAdmin.firestore();
const sheet = "https://sheet.best/api/sheets/84107fe9-776b-4a9f-972c-2ae133d29243"


exports.dialogflowFirebaseFulfillment =
 functions.https.onRequest((request, response) => {
   const agent = new WebhookClient({request, response});
   console.log("Dialogflow Request headers: " + JSON.stringify(request.headers));
   console.log("Dialogflow Request body: " + JSON.stringify(request.body));
   function welcome(agent) {
     agent.add("Welcome to my agent!");
   }
   function fallback(agent) {
     agent.add("I didn't understand");
     agent.add("I'm sorry, can you try again?");
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




   //Vamos a comenzar con el calendario

   const appointment_type = agent.parameters.AppointmentType
   function makeAppointment (agent) {
     // Calculate appointment start and end datetimes (end = +1hr from start)
     //console.log("Parameters", agent.parameters.date);
     const dateTimeStart = new Date(Date.parse(agent.parameters.date.split('T')[0] + 'T' + agent.parameters.time.split('T')[1].split('-')[0] + timeZoneOffset));
     const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));
     const appointmentTimeString = dateTimeStart.toLocaleString(
       'es',
       { month: 'long', day: 'numeric', hour: 'numeric', timeZone: timeZone }
     );
 
     // Check the availibility of the time, and make an appointment if there is time on the calendar
     return createCalendarEvent(dateTimeStart, dateTimeEnd, appointment_type).then(() => {
       agent.add(`Listo!! te acabo de agendar. ${appointmentTimeString} is fine!.`);
     }).catch(() => {
       agent.add(`Lo siento, esa hora ya está apartada ${appointmentTimeString}.`);
     });
   }




   //Aqui termina la rutina de lcalendario






   function usuarionuevo(agent) {
     agent.add( "Procesando..." );
     const Cliente = agent.parameters["given-name"];
     const Apellido = agent.parameters["last-name"];
     const Empresa = agent.parameters["empresas"];
     const Telefono = agent.parameters["phone-number"];
     const Correo = agent.parameters["email"];
     const Solicitud = agent.parameters["solicitud"];
     agent.add( "Hola " + Cliente + " de la empresa " + Empresa );
     axios.post(sheet, {Cliente, Apellido, Empresa, Telefono, Correo, Solicitud});

     agent.add( "Listo!! " +Cliente+ " tu solicitud de " +Solicitud + " se agregó correctamente" );
     agent.add( "En un momento más te asignaré un ejecutivo para que te dé seguimiento." );
     agent.add("Grabando en Firebase");
     return firebaseAdmin.database().ref("UsuariosDialogFlow").set({
       Nombre: Cliente,
       Apellido: Apellido,
       Empresa,
       Telefono,
       Correo,
       Solicitud,
       id: 1,
     });
   }

   function writeToDb(agent) {
     // Get parameter from Dialogflow with the string to add to the database
     // const databaseEntry = agent.parameters.dato;

     const coleccion = "EntradasDB";
     const documento = agent.parameters["documento"];
     const databaseEntry = agent.parameters["dato"];
     const fecha = agent.parameters["date"];
     const telefono = agent.parameters["phone-number"];
     agent.add(`Listo, grabé del documento "${documento}" en FireStore para la fecha "${fecha}", te mandaremos mas informacion al whatsapp."${telefono}"`);

     // Get the database collection 'dialogflow' and document 'agent' and store
     // the document  {entry: "<value of database entry>"} in the 'agent' document
     const dialogflowAgentRef = db.collection(coleccion).doc(documento);
     return db.runTransaction((t) => {
       t.set(dialogflowAgentRef, {Dato: databaseEntry, Fecha: fecha, Telefono: telefono});
       return Promise.resolve("Write complete");
     }).then((doc) => {
       agent.add(`Listo, grabé "${databaseEntry}" en FireStore para el documento "${documento}", te mandaremos mas informacion al whatsapp."${telefono}"`);
     }).catch((err) => {
       console.log(`Error escribiendo en Firestore: ${err}`);
       agent.add(`Error al escribir "${databaseEntry}" en la base de datos.`);
     });
   }

   function AltaProducto(agent) {
     // Obtener los parametros dese el intent de Dialogflow
     //  const databaseEntry = agent.parameters.dato;

     const coleccion = "Productos";
     const documento = agent.parameters["producto"];
     const categoria = agent.parameters["categoria"];
     const costo = agent.parameters["costo"];
     const plazo = agent.parameters["plazo"];
     const periodicidad = agent.parameters["periodicidad"];


     // Get the database collection 'dialogflow' and document 'agent' and store
     // the document  {entry: "<value of database entry>"} in the 'agent' document
     const dialogflowAgentRef = db.collection(coleccion).doc(documento);
     return db.runTransaction((t) => {
       t.set(dialogflowAgentRef, {Categoria: categoria, Costo: costo, Plazo: plazo, Periodicidad: periodicidad});
       return Promise.resolve("Write complete");
     }).then((doc) => {
       agent.add(`Listo, el producto "${documento}" está ahora en el catálogo, ve al sitio web para darle los arreglos finales "${documento}"`);
     }).catch((err) => {
       console.log(`Error escribiendo en Firestore: ${err}`);
       agent.add(`Error al agregar "${documento}" en la base de datos.`);
     });
     agent.add( "Gracias por interactuar con Botsi, ve a https://alekzen.com/AdminProductos para darle los toques finales." );
   }

   async function CalculaCredito(agent) {
    // Obtener los parametros dese el intent de Dialogflow
    //  const databaseEntry = agent.parameters.dato;

    const coleccion = "Creditos";
    const documento = agent.parameters["cliente"];
    const importe = agent.parameters["importe"];
    const enganche = agent.parameters["enganche"];
    const plazo = agent.parameters["plazo"];
    const tasa = agent.parameters["tasa"];
    const periodicidad = agent.parameters["periodicidad"];
    const whatsapp = agent.parameters["whatsapp"];


    // Get the database collection 'dialogflow' and document 'agent' and store
    // the document  {entry: "<value of database entry>"} in the 'agent' document
    const dialogflowAgentRef = db.collection(coleccion).doc(documento);
    return await db.runTransaction((t) => {
      t.set(dialogflowAgentRef, {Importe: importe, Enganche: enganche, Plazo: plazo, Periodicidad: periodicidad, Tasa: tasa ,Whatsapp : whatsapp});
      return Promise.resolve("Write complete");
    }).then((doc) => {
      agent.add(`Listo, el credito para "${documento}" se ha guardado en la base de datos, puedes revisarlo en https://botsi-oxrr.web.app/admin/CreditosUser/${documento}.`);
    }).catch((err) => {
      console.log(`Error escribiendo en Firestore: ${err}`);
      agent.add(`Error al agregar "${documento}" en la base de datos.`);
    });
    agent.add( "Gracias por interactuar con Botsi, ve a https://alekzen.com/AdminProductos para darle los toques finales." );
  }

  async function octaviolozada(agent) {
    // Obtener los parametros dese el intent de Dialogflow
    //  const databaseEntry = agent.parameters.dato;

    const coleccion = "Octavio";
    //const documento = agent.parameters["cliente"];
    const idea = agent.parameters["idea"];
    // const enganche = agent.parameters["enganche"];
    // const plazo = agent.parameters["plazo"];
    // const tasa = agent.parameters["tasa"];
    // const periodicidad = agent.parameters["periodicidad"];


    // Get the database collection 'dialogflow' and document 'agent' and store
    // the document  {entry: "<value of database entry>"} in the 'agent' document
    const dialogflowAgentRef = db.collection(coleccion).doc();
    return await db.runTransaction((t) => {
      t.set(dialogflowAgentRef, {Ideas: idea });
      return Promise.resolve("Write complete");
    }).then((doc) => {
      agent.add(`Saludos Octavio, tu idea "${idea}" se ha guardado en la base de datos.`);
    }).catch((err) => {
      console.log(`Error escribiendo en Firestore: ${err}`);
      agent.add(`Error al agregar "${documento}" en la base de datos.`);
    });
    agent.add( "Gracias por interactuar con Botsi, ve a https://alekzen.com/AdminProductos para darle los toques finales." );
  }

  async function PublicarBlog(agent) {
    // Obtener los parametros dese el intent de Dialogflow
    //  const databaseEntry = agent.parameters.dato;

    const coleccion = "BlogPosts";
    //const documento = agent.parameters["cliente"];
    const titulo = agent.parameters["titulo"];
    const descripcion = agent.parameters["descripcion"];
    const imagen = 'gs://botsi-oxrr.appspot.com/bot-icon-2883144_640.png'
    // const plazo = agent.parameters["plazo"];
    // const tasa = agent.parameters["tasa"];
    // const periodicidad = agent.parameters["periodicidad"];


    // Get the database collection 'dialogflow' and document 'agent' and store
    // the document  {entry: "<value of database entry>"} in the 'agent' document
    const dialogflowAgentRef = db.collection(coleccion).doc(titulo);
    return await db.runTransaction((t) => {
      t.set(dialogflowAgentRef, {Titulo: titulo, Descripcion: descripcion, Imagen : imagen });
      return Promise.resolve("Write complete");
    }).then((doc) => {
      agent.add(`Saludos Alek, tu idea "${titulo}" se ha guardado en la base de datos.`);
    }).catch((err) => {
      console.log(`Error escribiendo en Firestore: ${err}`);
      agent.add(`Error al agregar "${titulo}" en la base de datos.`);
    });
    agent.add( "Gracias por interactuar con Botsi, ve a https://alekzen.com/AdminProductos para darle los toques finales." );
  }



   // Run the proper function handler based on the matched Dialogflow intent name
   const intentMap = new Map();
   intentMap.set("usuarioNuevo", usuarionuevo);
   intentMap.set("Default Welcome Intent", welcome);
   intentMap.set("Default Fallback Intent", fallback);
   intentMap.set("usuarioNuevo", usuarionuevo);
   intentMap.set("escribeDB", writeToDb);
   intentMap.set("Producto.Alta", AltaProducto);
   intentMap.set("CalculaCredito", CalculaCredito);
   intentMap.set("Octavio.lozada", octaviolozada);
   intentMap.set("PublicarBlog", PublicarBlog);
   intentMap.set('Cita', makeAppointment);


   // intentMap.set('your intent name here', yourFunctionHandler);
   // intentMap.set('your intent name here', googleAssistantHandler);
   agent.handleRequest(intentMap);
 });

 function createCalendarEvent (dateTimeStart, dateTimeEnd, appointment_type) {
  return new Promise((resolve, reject) => {
    calendar.events.list({
      auth: serviceAccountAuth, // List events for time period
      calendarId: calendarId,
      timeMin: dateTimeStart.toISOString(),
      timeMax: dateTimeEnd.toISOString()
    }, (err, calendarResponse) => {
      // Check if there is a event already on the Calendar
      if (err || calendarResponse.data.items.length > 0) {
        reject(err || new Error('hay conflictos con ese horario'));
      } else {
        // Create event for the requested time period
        calendar.events.insert({ auth: serviceAccountAuth,
          calendarId: calendarId,
          resource: {summary: appointment_type +' Appointment', description: appointment_type,
            start: {dateTime: dateTimeStart},
            end: {dateTime: dateTimeEnd}}
        }, (err, event) => {
          err ? reject(err) : resolve(event);
        }
        );
      }
    });
  });
}