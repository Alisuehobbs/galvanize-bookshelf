var Joi = require('joi');

module.exports = {
    signup: {
        body: {
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          email: Joi.string().required(),
          password: Joi.string().required(),
        }
    }
}
