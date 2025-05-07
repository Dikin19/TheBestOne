const express = require ('express')
const customer = require('./customer')
const CustController = require('../controllers/custController')
const router = express.Router()

router.post('/register', CustController.register)
router.post('/login', CustController.login)
router.post('/google-login', CustController.googleLogin);
router.get('/', (req, res) => {
    res.send('Server is running!');
  });

router.use('/customers', customer)



module.exports = router