const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const ObjectID = Schema.ObjectID;
// definisce lo schema dei dati utente
const User = new Schema({
    username:{type:String, require:[true,"Username non può essere vuoto"],index:true, unique:true, match: [/^[a-zA-Z0-9]+$/, 'Username non valida']},
    password:{type:String, require:[true,"Password non può essere vuoto"], match: [/^[a-zA-Z0-9]+$/, 'Password non valida']},
    email:{type:String, require:[true,"Email non può essere vuoto"],index:true, unique:true, match: [/\S+@\S+\.\S+/, 'Email non valida']},
    level:{type:String, default:"user"}
})

module.exports = mongoose.model('User', User);