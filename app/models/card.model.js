const mongoose = require('mongoose');

const CardSchema = mongoose.Schema({
    cardName:String,
    cardPicture:String,
    cardPrice:Number,
    cardTags:String,
    cardDescription:String,
    cardLocation:{},
    cardGender:String,
    cardAgeRangeFrom:Number,
    cardAgeRangeTo:Number,
    cardAgeRestriction:String,
    categoryId:String,
    relationship:String,
    tipTricks:[],
    seq:Number,
}, {
    timestamps: true
});

module.exports = mongoose.model('Card', CardSchema);