const express = require('express')
const PaymentController = require('../controllers/paymentController')
const authentication = require('../midllewares/authentication')
const upload = require('../midllewares/uploadMiddleware')
const CustController = require('../controllers/custController');

const customer = express.Router()
customer.use(authentication)

// Enhanced Payment Routes
customer.post('/payment/midtrans/initiate', PaymentController.initiateMidtransTrx)
customer.get('/orders', PaymentController.getAllUserOrders) // Get all user orders with pagination
customer.get('/orders/:orderId', PaymentController.getOrderStatus) // Get specific order status
customer.put('/orders/:orderId/cancel', PaymentController.cancelOrder) // Cancel order

// Product Routes
customer.get('/categories', CustController.getCategories)
customer.get('/product', CustController.listProduct)
customer.get('/product/:id', CustController.productById)
customer.get('/product/:id/recomendation', CustController.ByCategoryId)

// Wishlist and Checkout Routes
customer.post('/wishlist', CustController.addToWishlist)
customer.get('/wishlist', CustController.getWishlist)
customer.delete('/wishlist/:productId', CustController.removeFromWishlist)
customer.post('/checkout/whatsapp', CustController.generateWhatsAppCheckout)

// Profile Routes
customer.get('/profile', CustController.Profile)
customer.get('/profile/dummy-avatar', CustController.generateDummyAvatar) // Generate dummy avatar
customer.put('/profile', upload.single('profilePicture'), CustController.updateProfile) // Update profile with file upload
customer.delete('/profile/picture', CustController.deleteProfilePicture) // Delete profile picture
customer.delete('/profile/:id', CustController.deleteById)


module.exports = customer