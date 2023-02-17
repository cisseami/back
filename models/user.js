const mongoose = require('mongoose');

// vérification email unique
const uniqueValidator = require('mongoose-unique-validator'); 

// model donnée user
const userSchema = mongoose.Schema({ 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// utilisation du package
userSchema.plugin(uniqueValidator); 

module.exports = mongoose.model('User', userSchema);