const functions = require('firebase-functions');
let admin = require("firebase-admin");
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({
    origin: true
}));

let serviceAccount = require("./credentials.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://multitecapi.firebaseio.com"
});
const db = admin.firestore();

/**
 * @description
 * Genera una respuesta de "Hello world" para comprobar que el servidor está activo.
 */
app.get('/hello-world', (req, res) => {
    return res.status(200).send('Hello World!');
});

/**
 * @description
 * Crea un miembro a partir de los datos introducidos.
 */
app.post('/api/crear-miembro', (req, res) => {
    console.log(req.body);
    (async () => {
        try {
            await db.collection('miembros').doc('/' + req.body.numero_socio + '/')
                .create(req.body);
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

/**
 * @description
 * Obtiene un miembro a partir de su id.
 */
app.get('/api/get-miembros/:idMiembro', (req, res) => {
    //console.log(req.params.idMiembro);
    let miembros = db.collection('miembros').doc(req.params.idMiembro);
    let getDoc = miembros.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such document!');
                return res.status(500).send(error);
            } else {
                console.log('Document data:', doc.data());
                return res.status(200).send(doc.data());
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
});

/**
 * @description
 * obtiene todos los miembros.
 */
app.get('/api/get-miembros/', (req, res) => {
    let miembros = db.collection('miembros')
    let getDoc = miembros.get()
        .then(snapshot => {
            let miembros_res = [];
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                miembros_res.push(doc.data());
            });
            return res.status(200).send(miembros_res);
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
});

/**
 * @description
 * Actualiza un miembro con los datos introducidos a partir de de su id.
 */
app.put('/api/update-miembro/:idMiembro', (req, res) => {
    (async () => {
        try {
            const document = db.collection('miembros').doc(req.params.idMiembro);
            await document.set(req.body, {
                merge: true
            }).then(doc => {
                return res.status(200).send(doc);
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

/**
 * @description
 * Elimina un miembro a partir de su id.
 */
app.delete('/api/delete-miembro/:idMiembro', (req, res) => {
    (async () => {
        try {
            const document = db.collection('miembros').doc(req.params.idMiembro);
            await document.delete();
            return res.status(200).send('Usuario eliminado');
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

exports.app = functions.https.onRequest(app);