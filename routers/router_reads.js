const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const SensorModel = require('../models/sensor');
const ReadModel = require('../models/read');
const { allowNotAuthenticated, allowLogged, allowAdmin } = require("../middlewares/user_middlewares");
const ObjectId = mongoose.Types.ObjectId;
// api get per la visualizzazione del dispositivo
router.get("/:idSensor", allowLogged, (req, resp) => {
    const { idSensor } = req.params;
    let filter = { idSensor: idSensor, idUser:new ObjectId(req.session.user._id)};
    if(req.session.user.level == "admin"){
        delete filter.idUser;
    }

    SensorModel.findOne(filter).then((sensor) => {
        if (sensor) {
            ReadModel.aggregate([
                {$match:{ idSensor: sensor._id }},
                {$project:
                    {
                        "idSensor":"$idSensor",
                        "Timestamp":"$timestamp",
                        "Temperature":"$temperature",
                        "Humidity":"$humidity",
                        "Pressure":"$pressure",
                        "Air Quality":"$gas"
                    }
                }])
                .then((reads) => {
                resp.status(200).send({ reads: reads, msg: '', error: false });
            }).catch(() => {
                resp.status(200).send({ reads: [], msg: '', error: false });
            });
        } else {
            resp.status(404).send({ sensor: null, msg: 'sensor not found', error: true });
        }
    }).catch((err) => {
        resp.status(501).send({ sensor: null, msg: err, error: true });
    })

});
// api post per il salavataggio dei dati dal mqtt broker al database mongodb
router.post("/:idSensor",(req,resp)=>{
    const { idSensor } = req.params;
    const { temperature, humidity, pressure, gas } = req.body;
    SensorModel.findOne({ idSensor: idSensor }).then((sensor) => {
        if (sensor) {
            const newRead = new ReadModel();
            newRead.temperature = temperature;
            newRead.humidity = humidity;
            newRead.pressure = pressure;
            newRead.gas = gas;
            newRead.save();
            resp.send({ msg: 'read saved', error: false });
        } else {
            resp.status(404).send({ sensor: null, msg: 'sensor not found', error: true });
        }
    }).catch((err) => {
        resp.status(501).send({ sensor: null, msg: err, error: true });
    })
});
// api get per ottenere dal database mongodb, il campo cercato per quel id sensore
router.get("/:idSensor/:field", (req, resp) => {
    const { idSensor, field } = req.params;
    SensorModel.findOne({ idSensor: idSensor }).then((sensor) => {
        if (sensor) {
            ReadModel.find({ idSensor: sensor._id }, field).then((reads) => {
                resp.status(200).send({ reads: reads, msg: '', error: false });
            }).catch(() => {
                resp.status(200).send({ reads: [], msg: '', error: false });
            });
        } else {
            resp.status(404).send("sensor not found");
        }
    }).catch(() => {
        resp.status(404).send("sensor not found");
    })
});

module.exports = router;