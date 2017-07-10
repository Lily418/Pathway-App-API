const express = require('express')
const app = express()
const bodyParser = require('body-parser')


const models = require("./models");

app.use(bodyParser.json())
app.use((req, res, next) => {
  req.models = models
  next()
})

app.use("/user", require('./controllers/user'))



app.listen(3000, function () {
  console.log('App listening on port 3000')
})
