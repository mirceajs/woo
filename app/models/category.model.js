const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    categoryName:String,
    categoryIcon:String,
    seq:Number,
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);