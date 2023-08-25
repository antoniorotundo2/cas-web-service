const express = require("express");
const app = express();
const http = require('http');
const httpServer = http.createServer(app);
const { Server } = require('socket.io');
const webSocketServer = new Server(httpServer, { cors: { origin: 'http://localhost:3000' } });
const mongoose = require("mongoose");
const SensorModel = require('./models/sensor');
const ReadModel = require('./models/read');
const cors = require('cors');
const session = require("express-session");
const { instrument } = require("@socket.io/admin-ui");
// importo i router definiti per user, sensor e reads
const userRouter = require('./routers/router_user');
const sensorRouter = require('./routers/router_sensor');
const readRouter = require('./routers/router_reads');
// importo mqtt e avvio la connesione al broker mqtt pubblico
const mqtt = require('mqtt');
const clientMqtt = mqtt.connect('mqtt://broker.hivemq.com:1883');
// effettuo la sottoscrizione al topic, contenente le rilevazione in base all'id sensore
const mqttConnect = () => {
    clientMqtt.on('connect', function () {
        clientMqtt.subscribe('cas/sensor', function (err) {
        })
    })

    clientMqtt.on('message', function (topic, message) {
        // message is Buffer
        // parse del messaggio ricevuto dal sensore
        const letturaRicevuta = JSON.parse(message.toString());
        // creo una stanza e indico i valori delle letture
        webSocketServer.to('device:' + letturaRicevuta.id).emit('new-read', {
            idsensor: letturaRicevuta.id,
            temperature: letturaRicevuta.temp,
            pressure: letturaRicevuta.press,
            humidity: letturaRicevuta.hum,
            gas: letturaRicevuta.gas
        })

    })
}
// imposto la durata della sessione dell'utente, mediante la generazione di un cookie
const sessionMiddleware = session({ secret: "cas-secret", saveUninitialized: true, resave: true, cookie: { maxAge: 60 * 60 * 24 * 1000 }, unset: "destroy" });
// mi collego al database mongodb, eseguo il middleware cors con express
mongoose.connect('mongodb://cas-db:27017/cas-db')
    .then(() => {
        app.use(cors({ credentials: true, origin: "http://localhost:3000", methods: ["POST", "GET", "PUT", "DELETE", "HEAD", "OPTIONS"] }));
        app.use(sessionMiddleware);

        webSocketServer.engine.use(sessionMiddleware);

        app.use(express.static("./public"));

        app.use(express.json());

        app.use("/user", userRouter);

        app.use("/sensor", sensorRouter);

        app.use("/reads", readRouter);

        mqttConnect();

        webSocketServer.on('connection', (client) => {
            client.on('join', (idSensor) => {
                client.join('device:' + idSensor);
            });
        });
        // avvio il server node.js alla porta 8080
        httpServer.listen(8080, () => {
            console.log("Server listen on port 8080");
        });
    }).catch((err) => {
        console.log(err);
        process.exit();
    });