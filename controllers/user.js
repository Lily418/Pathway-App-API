const express = require('express')
const router = express.Router()
const Joi = require('joi');

const userSchema = Joi.object().keys({
  name: Joi.string().required(),
  dateBeganUsingApp: Joi.date().iso().required()
})

router.post('/', (req, res) => {

  const validationError = Joi.validate(req.body, userSchema)
  
  if(validationError.error) {
    res.status(400).send(validationError.error.details.map((errorDetail) => errorDetail.message))
    return
  }

  const user = req.models.User.build({
    "name" : req.body.name,
    dateBeganUsingApp: Date.parse(req.body.dateBeganUsingApp)
  })

  user.save()
  .then(() => {
    res.status(200).send()
  })
  .catch((error) => {
    res.status(500).send({ error: process.env.NODE_ENV === "development" ? error : "Error Creating User"});
  })
})

module.exports = router
