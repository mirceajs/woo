const ExperienceCard = require('../models/experienceCard.model.js');
const ObjectId = require('mongodb').ObjectID;
var Promise = require('promise');
require('mongoose-query-paginate');
// Create and Save a new experienceCard
exports.create = (req, res) => {
    if (!req.body.name) {
        return res.status(400).send({
            message: "Name can not be empty"
        });
    }

    // Create a ExperienceCard
    const experienceCard = new ExperienceCard({
        name: req.body.name,
        cardId:req.body.cardId,
        picture: req.body.picture,
        description: req.body.description,
        location:req.body.location,
        price:req.body.price,
        tags:req.body.tags,
        seq: req.body.seq
    });

    // Save ExperienceCard in the database
    experienceCard.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the ExperienceCard."
            });
        });
};


// Find a single experienceCard with a experienceCardId
exports.findOne = (req, res) => {
    ExperienceCard.findById(req.params.experienceCardId)
        .then(experienceCard => {
            if (!experienceCard) {
                return res.status(404).send({
                    message: "ExperienceCard not found with id " + req.params.experienceCardId
                });
            }
            res.send(experienceCard);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "ExperienceCard not found with id " + req.params.experienceCardId
                });
            }
            return res.status(500).send({
                message: "Error retrieving experienceCard with id " + req.params.experienceCardId
            });
        });
};

// Find all experienceCards with a cardId
exports.findExperienceCardsIn = (req, res) => {
    ExperienceCard.find({ cardId: new ObjectId((req.params.cardId)) }).sort({ seq: 1 })
    .then(experienceCards => {
        if (!experienceCards) {
            return res.status(404).send({
                message: "ExperienceCard not found with id " + req.params.cardId
            });
        }
        res.send(experienceCards);
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "ExperienceCard not found with id " + req.params.cardId
            });
        }
        return res.status(500).send({
            message: "Error retrieving experienceCard with id " + req.params.cardId
        });
    });

};

// Update a experienceCard identified by the experienceCardId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.name) {
        return res.status(400).send({
            message: "ExperienceCard name can not be empty"
        });
    }

    // Find experienceCard and update it with the request body
    ExperienceCard.findByIdAndUpdate(req.params.experienceCardId, {
        name: req.body.name,
        cardId:req.body.cardId,
        picture: req.body.picture,
        description: req.body.description,
        location:req.body.location,
        price:req.body.price,
        tags:req.body.tags
    }, { new: true })
        .then(experienceCard => {
            if (!experienceCard) {
                return res.status(404).send({
                    message: "ExperienceCard not found with id " + req.params.experienceCardId
                });
            }
            res.send(experienceCard);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "ExperienceCard not found with id " + req.params.experienceCardId
                });
            }
            return res.status(500).send({
                message: "Error updating experienceCard with id " + req.params.experienceCardId
            });
        });
};

// Delete a experienceCard with the specified experienceCardId in the request
exports.delete = (req, res) => {
    ExperienceCard.findByIdAndRemove(req.params.experienceCardId)
        .then(experienceCard => {
            if (!experienceCard) {
                return res.status(404).send({
                    message: "ExperienceCard not found with id " + req.params.experienceCardId
                });
            }
            res.send({ message: "ExperienceCard deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "ExperienceCard not found with id " + req.params.experienceCardId
                });
            }
            return res.status(500).send({
                message: "Could not delete experienceCard with id " + req.params.experienceCardId
            });
        });
};