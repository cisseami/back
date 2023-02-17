const mongoose = require('mongoose'); // importer mongoDB

mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true,
     useUnifiedTopology: true 
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
