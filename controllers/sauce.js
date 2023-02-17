const Sauce = require('../models/Sauce'); // import du modèle Sauce
const fs = require('fs'); // file systeme  gestionnaire de fichier


// afficher toutes les sauces
exports.getAllSauces = (req, res) => {
    Sauce.find()
        .then( sauces => res.status(200).json(sauces))
        .catch( error => res.status(400).json({ error }))
};


// création de sauce
exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Post saved successfully!' }) })
        .catch((error) => res.status(400).json({ error: error }))
};


// afficher une sauce
exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error: error }))
};




// modification de sauce
exports.modifySauce = (req, res) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
        .catch(() => res.status(400).json({ error }))
};



// supprimer une sauce
exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
                    .catch(error => res.status(400).json({ error }))
            });
        })
        .catch(error => res.status(400).json({ error }))
};




// like et dislike
exports.likeSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.like === 1) {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    res.status(401).json({ error: 'Sauce déja liké' });
                } else {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
                        .then(() => res.status(200).json({ message: 'Like ajouté !' }))
                        .catch(error => res.status(400).json({ error }))
                }
            }
            else if (req.body.like === -1) {
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    res.status(401).json({ error: 'Sauce déja disliké' });
                } else {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
                        .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
                        .catch(error => res.status(400).json({ error }));
                }
            } else {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                        .then(() => { res.status(200).json({ message: 'Like supprimé !' }) })
                        .catch(error => res.status(400).json({ error }));
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                        .then(() => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                        .catch(error => res.status(400).json({ error }));
                }
            }
        })
        .catch(error => res.status(400).json({ error }));
};



