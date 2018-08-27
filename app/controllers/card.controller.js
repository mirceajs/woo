const Card = require('../models/card.model.js');
const ObjectId = require('mongodb').ObjectID;
var Promise = require('promise');
require('mongoose-query-paginate');
// Create and Save a new card
exports.create = (req, res) => {
    if(!req.body.cardName) {
        return res.status(400).send({
            message: "Name can not be empty"
        });
    }

    // Create a Card
    const card = new Card({
        cardName: req.body.cardName, 
        cardPicture: req.body.cardPicture || "Unkown Picture",
        cardPrice:req.body.cardPrice,
        cardTags:req.body.cardTags,
        cardDescription:req.body.cardDescription,
        cardLocation:req.body.cardLocation,
        cardGender:req.body.cardGender,
        cardAgeRangeFrom:req.body.cardAgeRangeFrom,
        cardAgeRangeTo:req.body.cardAgeRangeTo,
        cardAgeRestriction:req.body.cardAgeRestriction,
        categoryId:req.body.categoryId,
        relationship:req.body.relationship,
        tipTricks:req.body.tipTricks,
        seq: new Date().getTime()
    });

    // Save Card in the database
    card.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Card."
        });
    });
};


// Change sequence
exports.changeCardSequence = (req, res) => {

    // Validate Request
    if (!req.body.seqData || req.body.seqData.length == 0) {
        return res.status(400).send({
            message: "Invalid parameter"
        });
    }

    var promises = [];

    req.body.seqData.map(seqItem => {
        //logger.info('seqItem-id', seqItem.id)
        var newPromise = new Promise((resolve, reject) => {
            // Find card and update it with the request body
            Card.findByIdAndUpdate(seqItem.id, {
                seq: seqItem.seq
            }, { new: true })
            .then(card => {
                if (!card) {                    
                   reject(new Error('Error getting card by '+seqItem.id))                  
                }
                resolve(card)
            }).catch(err => {
                          
                reject(err)
            });
        })
        promises.push(new Error('Unexpected error getting card by '+seqItem.id));
    })

    Promise.all(promises).then(results=>{
        res.send({message: "Successfully changed sequences"});
    })
    .catch(err=>{
        return res.status(404).send({
            message: err.message
        });
    })

};


// Retrieve and return all cards from the database.
exports.findAll = (req, res) => {
    Card.find().sort({ seq: 1 })
    .then(cards => {
        res.send(cards);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving cards."
        });
    });
};

// Find a single card with a cardId
exports.findOne = (req, res) => {
    Card.findById(req.params.cardId)
    .then(card => {
        if(!card) {
            return res.status(404).send({
                message: "Card not found with id " + req.params.cardId
            });            
        }
        res.send(card);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Card not found with id " + req.params.cardId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving card with id " + req.params.cardId
        });
    });
};

// Find all cards with a categoryId
exports.findCardsIn = (req, res) => {
    if (req.query.perPage) {
        var options = {
            perPage: req.query.perPage,
            page   : req.query.page
          };
        var query = Card.find({categoryId: new ObjectId((req.params.categoryId))}).sort({ seq: 1 });
        query.paginate(options, function(err, result) {
            if (err) {
                return res.status(404).send({
                    message: err.message
                });
            }
            else {
                res.send(result);
            }
        });
    }
    else {
        Card.find({categoryId: new ObjectId((req.params.categoryId))}).sort({ seq: 1 })
        .then(cards => {
            if(!cards) {
                return res.status(404).send({
                    message: "Card not found with id " + req.params.categoryId
                });            
            }
            res.send(cards);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Card not found with id " + req.params.categoryId
                });                
            }
            return res.status(500).send({
                message: "Error retrieving card with id " + req.params.categoryId
            });
        });
    }
    
};

// Find all cards with a categoryId and user settings
exports.findCardsInBy = (req, res) => {
        Card.find({categoryId: new ObjectId((req.params.categoryId))}).sort({ seq: 1 })
        .then(cards => {
            if(!cards) {
                return res.status(404).send({
                    message: "Card not found with id " + req.params.categoryId
                });            
            }
            
            res.send(cards);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Card not found with id " + req.params.categoryId
                });                
            }
            return res.status(500).send({
                message: "Error retrieving card with id " + req.params.categoryId
            });
        });
   
    
};

// Update a card identified by the cardId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.cardName) {
        return res.status(400).send({
            message: "Card name can not be empty"
        });
    }

    // Find card and update it with the request body
    Card.findByIdAndUpdate(req.params.cardId, {
        cardName: req.body.cardName, 
        cardPicture: req.body.cardPicture || "Unkown Picture",
        cardPrice:req.body.cardPrice,
        cardTags:req.body.cardTags,
        cardDescription:req.body.cardDescription,
        cardLocation:req.body.cardLocation,
        cardGender:req.body.cardGender,
        cardAgeRangeFrom:req.body.cardAgeRangeFrom,
        cardAgeRangeTo:req.body.cardAgeRangeTo,
        cardAgeRestriction:req.body.cardAgeRestriction,
        categoryId:req.body.categoryId,
        relationship:req.body.relationship,
        tipTricks:req.body.tipTricks
    }, {new: true})
    .then(card => {
        if(!card) {
            return res.status(404).send({
                message: "Card not found with id " + req.params.cardId
            });
        }
        res.send(card);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Card not found with id " + req.params.cardId
            });                
        }
        return res.status(500).send({
            message: "Error updating card with id " + req.params.cardId
        });
    });
};

// Delete a card with the specified cardId in the request
exports.delete = (req, res) => {
    Card.findByIdAndRemove(req.params.cardId)
    .then(card => {
        if(!card) {
            return res.status(404).send({
                message: "Card not found with id " + req.params.cardId
            });
        }
        res.send({message: "Card deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Card not found with id " + req.params.cardId
            });                
        }
        return res.status(500).send({
            message: "Could not delete card with id " + req.params.cardId
        });
    });
};