const express = require('express')
const router = express.Router()
const Joi = require('joi')
const jwt = require('jwt-simple')

const userSchema = Joi.object().keys({
  name: Joi.string().required(),
  dateBeganUsingApp: Joi.date().iso().required()
})

router.post('/', (req, res) => {

  const validationError = Joi.validate(req.body, userSchema)
  
  if(validationError.error) {
    res.status(400).send({"validationError" : validationError.error.details.map((errorDetail) => errorDetail.message)})
    return
  }

  req.models.User.create({
    "name" : req.body.name,
    dateBeganUsingApp: Date.parse(req.body.dateBeganUsingApp)
  })
  .then((savedUser) => {
    const twentyFourHoursInSeconds = 24 * 60 * 60 * 1000
    res.status(200).send({"token" : jwt.encode({
      "userId" : savedUser.id, 
      "expires" : new Date(new Date().getTime() + twentyFourHoursInSeconds).toISOString() 
      }, process.env.PATHWAY_JWT_SECRET_KEY)
    })
  })
  .catch((error) => {
    res.status(500).send({ error: process.env.NODE_ENV === "development" ? error : "Error Creating User"})
  })
})

module.exports = router
