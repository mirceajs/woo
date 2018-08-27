const Admin = require('../models/admin.model.js');
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const dbConfig = require('../../config/database.config.js');
const jwt = require('jsonwebtoken');
// Register admin user
exports.register = (req, res) => {
    let newUser = new Admin({
        username:req.body.username,
        password:req.body.password,
    });
        
    var bExists = false;
    Admin.getUserByUsername(newUser.username, (err, user)=>{
        if(err) throw err;
        if(user){
            res.json({success:false,msg:'Username already exists.'});
            bExists = true;
        }
        else{
         
            Admin.addUser(newUser , (err,user) => {
                if(err){
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the Card."
                    });
                }else{
                    res.send(user);
                }
            });
                    
        }
    }); 
}
// Login to admin panel
exports.login = (req, res) => {
    const username = req.body.username;
	const password = req.body.password;

	Admin.getUserByUsername(username, (err, user)=>{
		if(err) throw err;
		if(!user){
			return res.json({success:0,msg:'User not found'});
		}

		Admin.comparePassword(password,user.password,(err,isMatch)=>{
			if(err) throw err;
			if(isMatch){
				const token = jwt.sign(user.toJSON(),dbConfig.secret,{
                    //expiresIn: 604800
                    expiresIn: 86400
				});
				res.json({
					success:true,
                    //token: 'JWT '+token,
                    token: token,
					user:user,
				});
			}else{
				return res.json({success:false,msg:'Wrong Password'});
			}
		});
	});
};

// Change admin credentials
exports.change = (req, res) => {
    const newusername = req.body.username;
    const oldpassword = req.body.oldpassword;
    var newpassword = req.body.newpassword;

    Admin.findById(req.params.id)   // Get admin user with the id
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });            
        }
        Admin.comparePassword(oldpassword,user.password,(err,isMatch)=>{ // Check if the old password is correct
			if(err) throw err;
			if(isMatch){
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newpassword,salt,(err,hash)=>{          // If the password is correct, update the old info
                        if(err) throw err;
                        newpassword = hash;
                        Admin.findByIdAndUpdate(req.params.id, {
                            username: newusername,
                            password: newpassword
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
                                message: "Error chaning credentials with id " + req.params.cardId
                            });
                        });
                    });
                });
				
			}else{
				return res.json({success:false,msg:'Your old password is wrong!'});
			}
		});
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving User with id " + req.params.id
        });
    });
};

