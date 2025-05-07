const express = require ('express')
const PaymentConroller = require('../controllers/paymentController')
const authentication = require('../midllewares/authentication')
const CustController = require('../controllers/custController');

const customer = express.Router()
customer.use(authentication)
// initiate midtranst pertama
customer.post('/payment/midtrans/initiate/',PaymentConroller.initiateMindtransTrx)
customer.get('/product', CustController.listProduct)//
customer.get('/profile',CustController.Profile)
customer.get('/product/:id', CustController.productById)//
customer.get('/product/:id/recomendation', CustController.ByCategoryId)
customer.put('/profile/:id',CustController.updateProfile)
customer.delete('/profile/:id',CustController.deleteById)



module.exports = customer