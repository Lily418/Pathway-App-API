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
    return req.models.MedicationRecord.findAll({where: { user_id :  req.user.userId}, raw: true})
  })
  .then((medicationRecords) => {
    res.status(200).send({"medicationRecordsDatesStarted" : medicationRecords.map((medicationRecord) => medicationRecord.dateStarted)})
  })
  .catch((error) => {
    res.status(500).send({ error: process.env.NODE_ENV === "development" ? error : "Error Creating Medication Record"});
  })
})

module.exports = router
