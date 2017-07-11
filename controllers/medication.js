const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  req.models.Medication.findAll({raw: true})
  .then(result => {
    res.status(200).send(result)
  })
})

module.exports = router
