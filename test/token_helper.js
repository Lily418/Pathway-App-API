const jwt = require('jwt-simple')

process.env.PATHWAY_JWT_SECRET_KEY = "bananas"


const getValidToken = (userId) => {
  const twentyFourHoursInSeconds = 24 * 60 * 60 * 1000
  const token = jwt.encode({userId: userId, 
                     expires : new Date(new Date().getTime() + twentyFourHoursInSeconds).toISOString() 
              } ,process.env.PATHWAY_JWT_SECRET_KEY)
  return "Bearer " + token
}

const getExpiredToken = (userId) => {
  const token = jwt.encode({userId: userId, 
                     expires : new Date().toISOString() 
              } ,process.env.PATHWAY_JWT_SECRET_KEY)
  return "Bearer " + token
}


module.exports = { getValidToken, getExpiredToken }
