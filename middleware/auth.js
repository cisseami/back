const jwt = require('jsonwebtoken'); // token d'autentification de la session utilisateur
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; 
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       const userId = decodedToken.userId; 
       req.auth = {
            userId: userId 
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};