process.env.NODE_ENV = 'test'
process.env.PATHWAY_JWT_SECRET_KEY = "bananas"

const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const models = require("../models")
const server = require("../index")
const tokenHelper = require('./token_helper')


chai.use(chaiHttp)

describe("Medication", () => {
  beforeEach(() => {
    return models.Medication.destroy({where: {}})
                 .then(() => {
                    models.Medication.bulkCreate([
                      { name: "fluoxetine" },
                      { name: "duloxetine" },
                      { name: "trazodone" }
                    ])
                  })
  })
  describe('/GET medication', () => {
    it('Should get a list of medications', () => {
      return chai.request(server)
                 .get("/medication")
                 .set("Authorization", tokenHelper.getValidToken(1))
                 .then((res) => {
                    res.should.have.status(200)
                    res.body.medications.length.should.equal(3)
                    res.body.medications[0].name.should.equal("fluoxetine")
                    res.body.medications[1].name.should.equal("duloxetine")
                    res.body.medications[2].name.should.equal("trazodone")
                  })
    })

    it('Should return 401 when unauthorised', () => {
      return chai.request(server)
                 .get("/medication")
                 .set("Authorization", tokenHelper.getExpiredToken(1))
                 .catch((error) => {
                    error.response.should.have.status(401)
                    error.response.body.error.should.equal("Token Expired")
                  })
    })
  })
})
