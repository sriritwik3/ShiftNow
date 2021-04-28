const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');


const HouseSchema = new Schema({
    roomType: String,
    image: String,
    location: String,
    price: Number,
    description: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

HouseSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('House', HouseSchema);