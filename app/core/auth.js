const jwt = require('jsonwebtoken');
const dbConfig = require('../../config/database.config.js');

exports.ensureAuthorized = (req, res, next) => {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token==null) {
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            token = bearerToken;
        }
    }

    if (token!=null) {
        jwt.verify(token, dbConfig.secret, function(err, decoded) {      
            if (err) {
              return res.json({ success: false, message: err.message||'Failed to authenticate token.' });    
            } else {
              // if everything is good, save to request for use in other routes
              req.decoded = decoded;    
              next();
            }
          });
    } else {
        res.send(403).send({
            success: false, 
            message: 'No token provided.'
        });
    }
}