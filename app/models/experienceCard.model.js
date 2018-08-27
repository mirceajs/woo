const mongoose = require('mongoose');

const ExperienceCardSchema = mongoose.Schema({
    name:String,
    picture:String,
    description:String,
    cardId:String,
    location:{},
    price:Number,
    tags:String,
    seq:Number,
}, {
    timestamps: true
});

module.exports = mongoose.model('ExperienceCard', ExperienceCardSchema);