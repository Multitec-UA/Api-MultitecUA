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

app.get('/hello-world', (req, res) => {
    return res.status(200).send('Hello World!');
});

// create
app.post('/api/create', (req, res) => {
    console.log(req.body);
    (async() => {
        try {
            await db.collection('items').doc('/' + req.body.id + '/')
                .create({
                    item: req.body.item
                });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

exports.app = functions.https.onRequest(app);