const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name:String,
    email:String,
    facebookId:String,
    experiences:[],
    blocked:{
        type: Boolean,
        default: false
    },
    picture:String,
    lat:Number,
    lng:Number,
    price:Number,
    token:String,
    relationship:Number,
    discoverGender:Number,
    discoverAge:Number,
    ageRestriction:Number,
    gender:Number,
    birthday:String,
    confirmWoo:Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);