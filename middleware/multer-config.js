const multer = require('multer');

// dictionnaire format d'images
const MIME_TYPES = { 
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// definit la destination de l'image ainsi que le nom de l'image, date stamps et extention MIME
const storage = multer.diskStorage({
    destination: (req, file, callback) => { 
        callback(null, 'images');
    },
    filename: (req, file, callback) => { 
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype]; 
        callback(null, name + Date.now() + '.' + extension); 
    }
});
module.exports = multer({ storage: storage}).single('image'); 