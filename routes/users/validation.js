const Joi = require('joi')

const schemaUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.number().required(),
})

const validateUser = async (schema, obj, res, next) => {
  try {
    await schema.validateAsync(obj)
    next()
  } catch (error) {
    res.status(400).json({
      status: 'error',
      code: 400,
      message: 'missing required name field',
    })
  }
}

module.exports.validateUser = async (req, res, next) => {
  return await validateUser(schemaUser, req.body, res, next)
}
