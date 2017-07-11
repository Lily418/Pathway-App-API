process.env.NODE_ENV = 'test'
process.env.PATHWAY_JWT_SECRET_KEY = "bananas"

const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const models = require("../models")
const server = require("../index")
const tokenHelper = require('./token_helper')


chai.use(chaiHttp)

describe("Medication_Record", () => {
  beforeEach(() => {
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
                 .then(() => {
                    return models.Medication.bulkCreate([
                      { name: "fluoxetine" },
                      { name: "duloxetine" },
                      { name: "trazodone" }
                    ])
                  })
                .then(() => {
                    return models.User.create({
                      "name" : "Russel",
                      dateBeganUsingApp: new Date()
                    }, {
                      "name" : "Ellis",
                      dateBeganUsingApp: new Date()
                    })
                })
  })
  describe('/POST medication_record', () => {
    it('Should store a medication record', () => {

      const findMedication = models.Medication.findOne({"where": {name: "fluoxetine"}})
      const findUser = models.User.findOne({"where": {name: "Russel"}})

      return Promise.all([findMedication, findUser]).then((result) => {
        const medication = result[0]
        const user = result[1]
        return chai.request(server)
             .post("/medication_record")
             .set("Authorization", tokenHelper.getValidToken(user.id))
             .send({"dose": "5mg", "dateStarted": "2017-07-10T22:22:44+00:00", "medicationId": medication.id})
      }).then((res) => {
         res.should.have.status(200)
         res.body.medicationRecordsDatesStarted.length.should.equal(1)
         Date.parse(res.body.medicationRecordsDatesStarted[0]).should.equal(Date.parse("2017-07-10T22:22:44+00:00"))
         const findCreatedMedicationRecord = models.MedicationRecord.findOne({"where": {"dateStarted" : Date.parse("2017-07-10T22:22:44+00:00")}})
         return Promise.all([findCreatedMedicationRecord, findMedication, findUser])
       }).then((result) => {
          const medicationRecord = result[0]
          const medication = result[1]
          const user = result[2]
          medicationRecord.dose.should.equal("5mg")
          medicationRecord.medication_id.should.equal(medication.id)
          medicationRecord.user_id.should.equal(user.id)
      })
    })

    it('Should return the date started of previously created medication records for that user', () => {
      const findMedicationFluoxetine = models.Medication.findOne({"where": {name: "fluoxetine"}})
      const findUser = models.User.findOne({"where": {name: "Russel"}})

      return Promise.all([findMedicationFluoxetine, findUser]).then((result) => {
        const medication = result[0]
        const user = result[1]
        return chai.request(server)
             .post("/medication_record")
             .set("Authorization", tokenHelper.getValidToken(user.id))
             .send({"dose": "5mg", "dateStarted": "2017-07-11T13:35:54+00:00", "medicationId": medication.id})
      }).then(() => {
        return Promise.all([models.Medication.findOne({"where": {name: "duloxetine"}}), findUser])
      }).then((result) => {
        const medicationTwo = result[0]
        const user = result[1]
        return chai.request(server)
             .post("/medication_record")
             .set("Authorization", tokenHelper.getValidToken(user.id))
             .send({"dose": "5mg", "dateStarted": "2017-07-10T22:22:44+00:00", "medicationId": medicationTwo.id})
      }).then((res) => {
        res.should.have.status(200)
        res.body.medicationRecordsDatesStarted.should.be.an("array")
        res.body.medicationRecordsDatesStarted.length.should.equal(2)
        res.body.medicationRecordsDatesStarted.should.include("2017-07-11 13:35:54.000 +00:00")
        res.body.medicationRecordsDatesStarted.should.include("2017-07-10 22:22:44.000 +00:00")
      })
    })
  })
})
