process.env.NODE_ENV = 'test'
process.env.PATHWAY_JWT_SECRET_KEY = "bananas"

const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const models = require("../models")
const server = require("../index")
const tokenHelper = require('./token_helper')
const deleteRecords = require('./seeding_helper').deleteRecords


chai.use(chaiHttp)

describe("Daily_Checkin", () => {
  beforeEach(() => {
                return deleteRecords()
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
  describe('/POST daily_checkin', () => {
    it('Should store a daily_checkin', () => {

      const findUser = models.User.findOne({"where": {name: "Russel"}})

      return findUser.then((user) => {
        return chai.request(server)
             .post("/daily_checkin")
             .set("Authorization", tokenHelper.getValidToken(user.id))
             .send({"wellbeingScore": 50, "date": "2017-07-10T22:22:44+00:00", "medicationTaken": false, "symptoms": ["Sneezing", "Coughing"]})
      }).then((res) => {
        res.should.have.status(200)
        res.body.DailyCheckinsCount.should.equal(1)
        const findDailyCheckin = models.DailyCheckin.findOne({where: {date: Date.parse("2017-07-10T22:22:44+00:00")}, 
                                                              include: models.Symptom})
        return Promise.all([findDailyCheckin, findUser])
      }).then((result) => {
            dailyCheckin = result[0]
            user = result[1]
            dailyCheckin.wellbeingScore.should.equal(50)
            dailyCheckin.medicationTaken.should.be.false
            dailyCheckin.Symptoms.length.should.equal(2)
            dailyCheckin.Symptoms[0].name.should.equal("Sneezing")
            dailyCheckin.Symptoms[1].name.should.equal("Coughing")
      })

      })
    })

  })
