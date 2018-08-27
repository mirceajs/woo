const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AdminSchema = mongoose.Schema({
    username:{
		type: String,
		required: true
	},
    password:{
		type: String,
		required: true
	},
}, {
    timestamps: true
});

const Admin = module.exports = mongoose.model('Admin', AdminSchema);

module.exports.comparePassword = function(candidatePassword,hash,callback){
	bcrypt.compare(candidatePassword,hash,(err,isMatch)=>{
		if(err) throw err;
		callback(null,isMatch);
	});
}
module.exports.getUserByUsername = function(username, callback){
	
	const query = {username: username};
	Admin.findOne(query,callback);
}
module.exports.addUser = function(newUser, callback){

	bcrypt.genSalt(10,(err,salt)=>{
		bcrypt.hash(newUser.password,salt,(err,hash)=>{
			if(err) throw err;
			newUser.password = hash;
			newUser.save(callback);
		});
	});
}