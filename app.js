const express = require('express'); // importer express
const bodyParser = require('body-parser'); // importer bodyparser
const path = require('path');
const helmet = require('helmet'); // protege le headers des vulnerabilités


require('dotenv').config();

const saucesRoutes = require('./routes/sauce'); // importer les routes sauces
const userRoutes = require('./routes/user'); // importer les routes user



const app = express(); 

//CORS : 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


// mongoose connect
require('./mongo');


app.use(bodyParser.json()); 


app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' })); // securiser le header


app.use('/images', express.static(path.join(__dirname, 'images'))); // gestion images de manière statiques
app.use('/api/sauces', saucesRoutes); 
app.use('/api/auth', userRoutes); 
    

// export de l'application
module.exports = app;
