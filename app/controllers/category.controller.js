const Category = require('../models/category.model.js');
var Promise = require('promise');

// Create and Save a new category
exports.create = (req, res) => {
    if (!req.body.categoryName) {
        return res.status(400).send({
            message: "Name can not be empty"
        });
    }

    // Create a Category
    const category = new Category({
        categoryName: req.body.categoryName,
        categoryIcon: req.body.categoryIcon || "Unkown Icon",
        seq: new Date().getTime()
    });

    // Save Category in the database
    category.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Category."
            });
        });
};

// Retrieve and return all categories from the database.
exports.findAll = (req, res) => {
    Category.find().sort({ seq: 1 })
        .then(categories => {
            res.send(categories);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving categories."
            });
        });
};

// Find a single category with a categoryId
exports.findOne = (req, res) => {
    Category.findById(req.params.categoryId)
        .then(category => {
            if (!category) {
                return res.status(404).send({
                    message: "Category not found with id " + req.params.categoryId
                });
            }
            res.send(category);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Category not found with id " + req.params.categoryId
                });
            }
            return res.status(500).send({
                message: "Error retrieving category with id " + req.params.categoryId
            });
        });
};


// Change sequence
exports.changeCategorySequence = (req, res) => {

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
            // Find category and update it with the request body
            Category.findByIdAndUpdate(seqItem.id, {
                seq: seqItem.seq
            }, { new: true })
            .then(category => {
                if (!category) {
                    //logger.error('findByIdAndUpdate error with ', {id:seqItem.id})
                   reject(new Error('Error getting category by '+seqItem.id))                  
                }
                resolve(category)
            }).catch(err => {
                //logger.error('findByIdAndUpdate unexpectd error with '+seqItem.id)                
                reject(err)
            });
        })
        promises.push(new Error('Unexpected error getting category by '+seqItem.id));
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

// Update a category identified by the categoryId in the request
exports.update = (req, res) => {

    // Validate Request
    if (!req.body.categoryName) {
        return res.status(400).send({
            message: "Category name can not be empty"
        });
    }

    // Find category and update it with the request body
    Category.findByIdAndUpdate(req.params.categoryId, {
        categoryName: req.body.categoryName,
        categoryIcon: req.body.categoryIcon || "Unkown Icon"
    }, { new: true })
        .then(category => {
            if (!category) {
                return res.status(404).send({
                    message: "Category not found with id " + req.params.categoryId
                });
            }
            res.send(category);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Category not found with id " + req.params.categoryId
                });
            }
            return res.status(500).send({
                message: "Error updating category with id " + req.params.categoryId
            });
        });
};

// Delete a category with the specified categoryId in the request
exports.delete = (req, res) => {
    Category.findByIdAndRemove(req.params.categoryId)
        .then(category => {
            if (!category) {
                return res.status(404).send({
                    message: "Category not found with id " + req.params.categoryId
                });
            }
            res.send({ message: "Category deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Category not found with id " + req.params.categoryId
                });
            }
            return res.status(500).send({
                message: "Could not delete category with id " + req.params.categoryId
            });
        });
};