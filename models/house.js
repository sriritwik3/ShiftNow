const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const HouseSchema = new Schema({
    roomType: String,
    image: String,
    location: String,
    price: Number,
    description: String,
    rating: Number
})

module.exports = mongoose.model('House', HouseSchema);