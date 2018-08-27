
module.exports = (app) => {
    const users = require('../controllers/user.controller.js');
    const jwtAuth = require('../core/auth.js');

     // Create a new user
     app.post('/users', users.create);

     // Send user info
     app.post('/getUserWithFB', users.getUserWithFB);

     // Retrieve all users
     app.get('/users', jwtAuth.ensureAuthorized, users.findAll);
 
     // Retrieve a single user with userId
     app.get('/users/:id', users.findOne);

     // Retrieve a single user with facebookId
     app.get('/users/by/facebook/:facebookId', users.findOneByFacebookId);
 
     // Update a user with userId
     app.put('/users/:id', users.update);
 
     // Update a user confirm woo status with userId
     app.put('/users/updateConfirmWoo/:id', users.updateConfirmWoo);
 

     // Update a user status with userId
     app.put('/users/:id/status', users.updateStatus);
 

     // Delete a user with userId
     app.delete('/users/:id', users.delete);
}