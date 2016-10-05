var Joi = require('joi');

module.exports = {
    book: {
        body: {
          title: Joi.string().required(),
          author: Joi.string().required(),
          genre: Joi.string().required(),
          description: Joi.string().required(),
          coverUrl: Joi.string().regex(/.com/).required()
        }
    }
}
