const Joi = require('joi');


module.exports.houseSchema =  Joi.object({
    house: Joi.object({
        roomType: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
    }).required()
});

