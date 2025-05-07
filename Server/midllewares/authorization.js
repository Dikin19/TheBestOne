const { Cuisine } = require('../models');

const guardAdminOnly = (req, res, next) => { // untuk admin
  try {
    if (req.user.role === 'admin') {
      next()
    } else {
      throw { name: 'Unauthorized', message: 'Forbidden access' }
    }
  } catch (err) {
    next(err)
  }
}


async function authorizationByStaff(req, res, next) {
    try {
      console.log(req.user.id);
  
      const cuisine = await Cuisine.findByPk(req.params.id)
      console.log(req.user.id);

      if (!cuisine) {
        throw { name: 'NotFound', message: `cuisine not found` }
      }

      if(req.user.role === 'admin'){
        return next()
      }

      if (req.user.role === 'staff' && cuisine.authorId !== req.user.id) {
        throw { name: 'Forbidden', message: "You're not authorized" }
      }
  
      next()
    } catch (error) {
      next(error)
    }
  }

  async function authorizationByAdmin(req, res, next) { // untuk admin
    try {
     
      if (req.user.role === 'staff'){
        throw { name: 'Forbidden', message: "You're not admin" }
      }

  
      next()
    } catch (error) {
      next(error)
    }
  }

module.exports = { guardAdminOnly, authorizationByStaff, authorizationByAdmin  };