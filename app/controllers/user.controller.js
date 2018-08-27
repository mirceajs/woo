const User = require('../models/user.model.js');
const ObjectId = require('mongodb').ObjectID;
// Create and Save a new user
exports.create = (req, res) => {
    if(!req.body.name) {
        return res.status(400).send({
            message: "Name can not be empty"
        });
    }

    if(!req.body.email) {
        return res.status(400).send({
            message: "Email can not be empty"
        });
    }

    // Create a User
    User.findOne({email: req.body.email})
    .then(user=>{
        if (user) {
            return res.status(500).send({
                message: "User already exists!"
            });   
        }
        else {
            const user = new User({
                name: req.body.name, 
                email: req.body.email,
                picture:req.body.picture,
                facebookId: req.body.facebookId,
                experiences: req.body.experiences,
                lat:req.body.lat,
                lng:req.body.lng,
                relationship:req.body.relationship,
                discoverGender:req.body.discoverGender,
                discoverAge:req.body.discoverAge,
                ageRestriction:req.body.ageRestriction,
                gender:req.body.gender,
                birthday:req.body.birthday,
                token: req.body.token,
                confirmWoo:req.body.confirmWoo
            });
        
            // Save User in the database
            user.save()
            .then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the User."
                });
            });
        }
    })
    .catch(err=>{
        return res.status(500).send({
            message: err.message
        });
    });
};

// Send user  info
exports.getUserWithFB = (req, res) => {
    if(!req.body.name) {
        return res.status(400).send({
            message: "Name can not be empty"
        });
    }

    if(!req.body.facebookId) {
        return res.status(400).send({
            message: "Facebook id can not be empty"
        });
    }

    if(!req.body.email) {
        return res.status(400).send({
            message: "Email can not be empty"
        });
    }

    User.findOne({email: req.body.email})
    .then(user => {
        if(!user) {
            // Create a User
            const user = new User({
                name: req.body.name, 
                email: req.body.email,
                picture:req.body.picture,
                facebookId: req.body.facebookId,
                experiences: [],
                lat:req.body.lat,
                lng:req.body.lng,
                price:req.body.price,
                relationship:req.body.relationship,
                discoverGender:req.body.discoverGender,
                discoverAge:req.body.discoverAge,
                ageRestriction:req.body.ageRestriction,
                gender:req.body.gender,
                birthday:req.body.birthday,
                token: req.body.token,
                confirmWoo:req.body.confirmWoo
            });

            // Save User in the database
            user.save()
            .then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the User."
                });
            });
        }
        else {
            if (user.blocked) {
                res.status(500).send({
                    message: "User is blocked, please contact administrator."
                });
            }
            else {
                res.send(user);
            }            
        }
    }).catch(err => {       
        return res.status(500).send({
            message: "Error retrieving user with facebookId " + req.params.facebookId
        });
    });
    
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};


// Find a single user with a id
exports.findOne = (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.id
        });
    });
};

// Find a single user with a facebookId
exports.findOneByFacebookId = (req, res) => {
   
    User.findOne({facebookId: req.params.facebookId})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with facebook id " + req.params.facebookId
            });            
        }
        res.send(user);
    }).catch(err => {       
        return res.status(500).send({
            message: "Error retrieving user with facebookId " + req.params.facebookId
        });
    });
};
// Update confirm woo status
exports.updateConfirmWoo = (req, res) => {
    User.findByIdAndUpdate(req.params.id, {
        confirmWoo:req.body.confirmWoo
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }
        console.log(user.confirmWoo);
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.id
        });
    });
}
// Update a user identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.name) {
        return res.status(400).send({
            message: "User name can not be empty"
        });
    }

    // Find user and update it with the request body
    User.findByIdAndUpdate(req.params.id, {
        name: req.body.name, 
        email: req.body.email,
        picture:req.body.picture,
        blocked: req.body.blocked,
        facebookId: req.body.facebookId,
        experiences: req.body.experiences,
        lat:req.body.lat,
        lng:req.body.lng,
        price:req.body.price,
        relationship:req.body.relationship,
        discoverGender:req.body.discoverGender,
        discoverAge:req.body.discoverAge,
        ageRestriction:req.body.ageRestriction,
        gender:req.body.gender,
        birthday:req.body.birthday,
        token: req.body.token,
        confirmWoo:req.body.confirmWoo
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }

        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.id
        });
    });
};

// Update a user identified by the id in the request
exports.updateStatus = (req, res) => {
    // Validate Request
    if(req.body.blocked===undefined) {
        return res.status(400).send({
            message: "User blocked info is empty"
        });
    }

    // Find user and update it with the request body
    User.findByIdAndUpdate(req.params.id, {
        blocked: req.body.blocked
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.id
        });
    });
};

// Delete a user with the specified id in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.id
        });
    });
};