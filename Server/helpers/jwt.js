const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

console.log({ JWT_SECRET })

function signToken(payload) {
 return jwt.sign(payload, JWT_SECRET)
}


function verifyToken(token) {
 return jwt.verify(token, JWT_SECRET)
}


module.exports = {
  signToken,
  verifyToken
}
