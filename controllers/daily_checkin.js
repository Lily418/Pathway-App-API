const express = require('express')
const router = express.Router()
const Joi = require('joi');

const dailyCheckInSchema = Joi.object().keys({
    wellbeingScore: Joi.number().integer().min(0).max(100).required(),
    date: Joi.date().iso().required(),
    medicationTaken: Joi.boolean().required(),
    symptoms: Joi.array().items(Joi.string()).required()
})

router.post('/', (req, res) => {

  const validationError = Joi.validate(req.body, dailyCheckInSchema)
  
  if(validationError.error) {
    res.status(400).send({"validationError" : validationError.error.details.map((errorDetail) => errorDetail.message)})
    return
  }

  req.models.DailyCheckin.create({
    "user_id" : req.user.userId,
    "medicationTaken" : req.body.medicationTaken,
    "date" : Date.parse(req.body.date),
    "wellbeingScore" : req.body.wellbeingScore,
    "Symptoms" : req.body.symptoms.map((symptom) => { return {"name" : symptom}})
  }, {
    "include": [ req.models.Symptom ]
  })
  .then(() => {
    return req.models.DailyCheckin.count({where: { user_id :  req.user.userId} })
  })
  .then((dailyCheckCount) => {
    res.status(200).send({"DailyCheckinsCount" : dailyCheckCount})
  })
  .catch((error) => {
    res.status(500).send({ error: process.env.NODE_ENV === "development" ? error : "Error Creating Daily Checkin"});
  })
})

module.exports = router
