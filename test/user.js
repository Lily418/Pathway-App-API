process.env.NODE_ENV = 'test'
process.env.PATHWAY_JWT_SECRET_KEY = "bananas"

const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiDate = require('chai-date')
const should = chai.should()
const models = require("../models")
const server = require("../index")
const jwt = require('jwt-simple')
const deleteRecords = require('./seeding_helper').deleteRecords



chai.use(chaiHttp)
chai.use(chaiDate)

describe("User", () => {
  beforeEach(() => {
    return deleteRecords()
  })
  describe('/POST user', () => {
    it('Should create a new user when given correct input', () => {
      return chai.request(server)
                 .post("/user")
                 .send({"name": "Lily", "dateBeganUsingApp": "2017-07-10T22:22:44+00:00"})
                 .then((res) => {
                    res.should.have.status(200)
                    const token = jwt.decode(res.body.token, process.env.PATHWAY_JWT_SECRET_KEY)
                    Date.parse(token.expires).should.be.tomorrow
                    return models.User.findById(token.userId)
                  }).then((user) => {
                    user.dateBeganUsingApp.getTime().should.equal(Date.parse("2017-07-10T22:22:44+00:00"))
                    user.name.should.equal("Lily")
                  })
    })

    it('Should not accept an invalid date', () => {
      return chai.request(server)
                 .post("/user")
                 .send({"name": "Lily", "dateBeganUsingApp": "NotADate"})
                 .catch((error) => {
                    error.response.should.have.status(400)
                    return models.User.findById(1)
                  }).then((user) => {
                    should.not.exist(user)
                  })
    })
    it('Should not accept a missing name', () => {
      return chai.request(server)
                 .post("/user")
                 .send({"name": "", "dateBeganUsingApp": "2017-07-10T22:22:44+00:00"})
                 .catch((error) => {
                    error.response.should.have.status(400)
                    return models.User.findById(1)
                  }).then((user) => {
                    should.not.exist(user)
                  })
    })
  })
})
