const Joi = require('joi');


module.exports.houseSchema = Joi.object({
    house: Joi.object({
        roomType: Joi.string().required(),
        parking: Joi.string().required(),
        availability: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().required(),
        location: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})