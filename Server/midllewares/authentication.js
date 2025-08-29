const { verifyToken } = require('../helpers/jwt');
const { User } = require('../models');

async function authentication(req, res, next) {
  try {
    // 1. ambil request headers
    const authorization = req.headers.authorization
    console.log(authorization);

    if (!authorization) { // ada isinya ada engga?
      throw { name: "InvalidToken", message: "Invalid token" }
    }
    const tokenRaw = authorization.split(' ')
    console.log(tokenRaw);

    if (tokenRaw[0] !== 'Bearer' || !tokenRaw[1]) {
      throw { name: "InvalidToken", message: "Invalid token" }
    }

    // pastikan token yg diterima itu valid dan ekstraksi data yg ada didalam token
    const payload = verifyToken(tokenRaw[1])
    console.log(payload)

    const user = await User.findOne({
      where: {
        id: payload.id,
        isDeleted: false
      }
    })
    if (!user) {
      throw { name: "InvalidToken", message: "Invalid token" }
    }

    // attach data user nya ke request object
    // untuk dipakai dimiddleware lain atau dicontroller

    req.user = user

    next() // lanjutkan ke proses selanjutnya
  } catch (error) {
    next(error)
  }
}

module.exports = authentication
