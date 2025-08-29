const express = require('express')
const customer = require('./customer')
const granite = require('./granite')
const CustController = require('../controllers/custController')
const PaymentController = require('../controllers/paymentController')
const router = express.Router()

// Public routes
router.post('/register', CustController.register)
router.post('/login', CustController.login)
router.post('/google-login', CustController.googleLogin)

// Midtrans notification webhook (no authentication required)
router.post('/payment/midtrans/notification', PaymentController.handleMidtransNotification)

router.get('/', (req, res) => {
    res.json({
        message: 'TheBestOne API Server - Premium Betta Fish Marketplace',
        version: '2.0.0',
        status: 'running',
        endpoints: {
            auth: ['/register', '/login', '/google-login'],
            customers: '/customers/*',
            payments: '/payment/midtrans/*',
            ai: '/granite/*'
        }
    });
});

// Protected routes
router.use('/customers', customer)
router.use('/granite', granite)

module.exports = router