const models = require("../models")

const deleteRecords = () => {
  return models.MedicationRecord.destroy({where: {}})
               .then(() => {
                  return models.Medication.destroy({where: {}})
                })
               .then(() => {
                  return models.Symptom.destroy({where: {}})
                })
               .then(() => {
                  return models.DailyCheckin.destroy({where: {}})
                })
               .then(() => {
                 return models.User.destroy({where: {}})
                })
}

module.exports = { deleteRecords }
