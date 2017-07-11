const express = require('express')
const router = express.Router()
const Joi = require('joi');

const medicationRecordSchema = Joi.object().keys({
  dateStarted: Joi.date().iso().required(),
  dose: Joi.string().required(),
  medicationId: Joi.number().integer().required()
})

router.post('/', (req, res) => {

  const validationError = Joi.validate(req.body, medicationRecordSchema)
  
  if(validationError.error) {
    res.status(400).send({"validationError" : validationError.error.details.map((errorDetail) => errorDetail.message)})
    return
  }

  const medicationRecord = req.models.MedicationRecord.build({
    "user_id" : req.user.userId,
    "medication_id" : req.body.medicationId,
    "dateStarted" : Date.parse(req.body.dateStarted),
    "dose" : req.body.dose
  })

  medicationRecord.save()
  .then(() => {
    res.status(200).send()
  })
  .catch((error) => {
    res.status(500).send({ error: process.env.NODE_ENV === "development" ? error : "Error Creating User"});
  })
})

module.exports = router
