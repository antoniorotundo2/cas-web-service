const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
// definisce lo schema delle misurazioni dal sensore
const Read = new Schema({
    idSensor:{type:Schema.Types.ObjectId,ref:'Sensor'},
    temperature:Number,
    humidity:Number,
    pressure:Number,
    gas:Number,
    //latitude:{type:Number,default:0},
    //longitude:{type:Number,default:0},
    timestamp:{type:Date,default:Date.now}
})
// controllo prima di salvare i dati
// Read.pre('save',(next,boh,etc)=>{
//     console.log(boh);
//     console.log(etc);
//     next();
// })
module.exports = mongoose.model('Read',Read);