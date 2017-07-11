const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const jwt = require('jwt-simple');
const Joi = require('joi')



const models = require("./models");

app.use(bodyParser.json())
app.use((req, res, next) => {
  req.models = models
  next()
})

const tokenSchema = Joi.object().keys({
  userId: Joi.number().integer().required(),
  expires: Joi.date().iso().required()
})

const authenticate = (req, res, next) => {
  const token = jwt.decode(req.header("Authorization").split(" ")[1], process.env.PATHWAY_JWT_SECRET_KEY)

  console.log(token)

  const validationError = Joi.validate(token, tokenSchema)
  
  if(validationError.error) {
    res.status(401).send({"error" : "Invalid Token"})
    return
  }

  if(new Date() > Date.parse(token.expires)) {
    res.status(401).send({"error" : "Token Expired"})
    return
  }

  req.user = token
  next()
}

app.use("/user", require('./controllers/user'))
app.use("/medication", authenticate, require('./controllers/medication'))
app.use("/medication_record", authenticate, require('./controllers/medication_record'))
app.use("/daily_checkin", authenticate, require('./controllers/daily_checkin'))


app.listen(3000, function () {
  console.log('App listening on port 3000')
})
