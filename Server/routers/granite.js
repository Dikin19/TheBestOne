const express = require('express')
const ProductAnalysisController = require('../controllers/productAnalysisController')
const authentication = require('../midllewares/authentication')

const router = express.Router()

// Product Analysis endpoint with IBM Granite
router.use(authentication) // Require authentication for analysis features

// Product Review Generator - Generate attractive review to interest customers
router.post('/analysis/review/:id', ProductAnalysisController.analyzeProductReviews)

module.exports = router
