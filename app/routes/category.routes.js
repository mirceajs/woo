module.exports = (app) => {
    const categories = require('../controllers/category.controller.js');

     // Create a new category
     app.post('/categories', categories.create);

     // Change category sequences
     app.post('/categories/changeSequences', categories.changeCategorySequence);
     
     // Retrieve all categories
     app.get('/categories', categories.findAll);
 
     // Retrieve a single category with categoryId
     app.get('/categories/:categoryId', categories.findOne);
 
     // Update a category with categoryId
     app.put('/categories/:categoryId', categories.update);
 
     // Delete a category with categoryId
     app.delete('/categories/:categoryId', categories.delete);
}