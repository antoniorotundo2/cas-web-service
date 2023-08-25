const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const SensorModel = require('../models/sensor');
const { allowNotAuthenticated, allowLogged, allowAdmin } = require("../middlewares/user_middlewares");
const ObjectId = mongoose.Types.ObjectId;
// api post dove gestisce il caricamento dati del sensore ricevuto dal mqtt-service al database mongodb
router.post("/", allowLogged, (req, resp) => {
    const { idSensor, latitude, longitude } = req.body;
    // verificare se il sensore è già registrato
    SensorModel.exists({ idSensor: idSensor }).then((sensor) => {
        if (sensor) {
            resp.send({ msg: 'sensor exists', error: true });
        } else {
            const newSensor = new SensorModel();
            newSensor.idSensor = idSensor;
            newSensor.latitude = latitude;
            newSensor.longitude = longitude;
            newSensor.idUser = new ObjectId(req.session.user._id);
            newSensor.save();
            resp.send({ msg: 'sensor saved', error: false });
        }
    }).catch((err) => {
        resp.send({ msg: err, error: true });
    });
});
// api delete per gestire la cancellazione del sensore indicato
router.delete("/:idSensor", allowLogged, (req, resp) => {
    const { idSensor } = req.params;
    // verificare se il sensore è già registrato
    SensorModel.deleteOne({ idSensor: idSensor, idUser: new ObjectId(req.session.user._id) }).then(() => {
        resp.send({ msg: 'sensor deleted', error: false });
    }).catch((err) => {
        resp.send({ msg: err, error: true });
    });
});
// api put per aggiornare i dati delle coordinate geografiche per il sensore indicato
router.put("/:idSensor", allowLogged, (req, resp) => {
    const { idSensor } = req.params;
    const { latitude, longitude } = req.body;
    // verificare se il sensore è già registrato
    SensorModel.updateOne({ idSensor: idSensor }, { latitude: latitude, longitude: longitude }).then(() => {
        resp.send({ msg: 'sensor updated', error: false });
    }).catch((err) => {
        resp.send({ msg: err, error: true });
    });
});


// api get per gestire la lettura dei dati delle coordinate geografiche per il sensore corrente
router.get("/", allowLogged, (req, resp) => {
    SensorModel.aggregate([
        {
            $match:{ idUser: new ObjectId(req.session.user._id) }
        },
        {
            $project:{
                "idSensor":"$idSensor",
                "Latitude":"$latitude",
                "Longitude":"$longitude"
            }
        }
    ])
    .then((sensors) => {
        if (sensors) {
            resp.status(200).send({ sensors: sensors, msg: 'sensors found', error: false });
        } else {
            resp.status(404).send({ sensors: null, msg: 'sensors not found', error: true });
        }
    }).catch(() => {
        resp.status(404).send({ sensors: null, msg: 'sensors not found', error: true });
    })
});

router.get("/dashboard",allowLogged, (req, resp) => {
    SensorModel.aggregate([
        { $match : { idUser: new ObjectId(req.session.user._id) }},
        {
            $lookup: {
                //searching collection name
                from: 'reads',
                foreignField: "idSensor",
                localField:"_id",
                //search query with our [searchId] value
                "pipeline":[
                  //searching [searchId] value equals your field [_id]
                  //{"$match": {"_id":"$idUser"}},
                  //projecting only fields you reaaly need, otherwise you will store all - huge data loads
                  {$sort:{"timestamp":-1}},
                  {$limit:1},
                  {"$project":{"timestamp": 1,"temperature": 1, "humidity":1, "pressure":1, "gas":1}}

                ],

                'as': 'lastRead'

              }
        },
        {
            $project:{
                "idSensor":"$idSensor",
                "lastRead":"$lastRead",
                "Latitude":"$latitude",
                "Longitude":"$longitude"
            }
        }
    ]).then((sensors) => {
        if (sensors) {
            
            resp.status(200).send({ sensors: sensors, msg: 'sensors found', error: false });
        } else {
            resp.status(404).send({ sensors: null, msg: 'sensors not found', error: true });
        }
    }).catch((err) => {
        console.log(err);
        resp.status(404).send({ sensors: null, msg: 'sensors not found', error: true });
    })
});

// api get per ricevere tutti i sensori, con i relativi utenti e coordinate geografiche
router.get("/all",allowLogged, allowAdmin, (req, resp) => {
    SensorModel.aggregate([
        { $match : {}},
        {
            $lookup: {
                //searching collection name
                from: 'users',
                foreignField: "_id",
                localField:"idUser",
                //search query with our [searchId] value
                "pipeline":[
                  //searching [searchId] value equals your field [_id]
                  //{"$match": {"_id":"$idUser"}},
                  //projecting only fields you reaaly need, otherwise you will store all - huge data loads
                  {"$project":{"_id": 1, "username":1}}

                ],

                'as': 'userInfo'

              }
        },
        {
            $set : {
                userName : {$getField : { field:"username", input : {$arrayElemAt: ["$userInfo", 0]}}}
            }
        },
        {
            $project:{
                "idSensor":"$idSensor",
                "User":"$userName",
                "Latitude":"$latitude",
                "Longitude":"$longitude"
            }
        }
    ]).then((sensors) => {
        if (sensors) {
            
            resp.status(200).send({ sensors: sensors, msg: 'sensors found', error: false });
        } else {
            resp.status(404).send({ sensors: null, msg: 'sensors not found', error: true });
        }
    }).catch((err) => {
        console.log(err);
        resp.status(404).send({ sensors: null, msg: 'sensors not found', error: true });
    })
});
// api get per trovare il sensore, in base al suo id
router.get("/:idSensor", allowLogged, (req, resp) => {
    const { idSensor } = req.params;
    SensorModel.findOne({ idSensor: idSensor }).then((sensor) => {
        if (sensor) {
            resp.status(200).send({ sensor: sensor, msg: 'sensor found', error: false });
        } else {
            resp.status(404).send({ sensor: null, msg: 'sensor not found', error: true });
        }
    }).catch(() => {
        resp.status(404).send({ sensor: null, msg: 'sensor not found', error: true });
    })
});
// api get per ottenere le informazioni sull'id sensore e delle coordinate geografiche
router.get("/user/:idUser", allowLogged, allowAdmin, (req, resp) => {
    const { idUser } = req.params;
    SensorModel.aggregate([
        {
            $match:{ idUser: new ObjectId(idUser) }
        },
        {
            $project:{
                "idSensor":"$idSensor",
                "Latitude":"$latitude",
                "Longitude":"$longitude"
            }
        }
    ])
    .then((sensors) => {
        if (sensors) {
            resp.status(200).send({ sensors: sensors, msg: 'sensors found', error: false });
        } else {
            resp.status(404).send({ sensors: null, msg: 'sensors not found', error: true });
        }
    }).catch(() => {
        resp.status(404).send({ sensors: null, msg: 'sensors not found', error: true });
    })
});

module.exports = router;