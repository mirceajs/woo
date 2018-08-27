module.exports = (app) => {
    const admin = require('../controllers/admin.controller.js');

    // Register a admin user
     app.post('/admin', admin.register);
    // Log in with admin credential
     app.post('/admin/login', admin.login);
 
    // Change admin credentials
     app.put('/admin/change/:id', admin.change);
}