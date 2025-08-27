const express = require('express')
const { runGraniteModel, getModelInfo } = require('../controllers/ibm-granite')
const ProductAnalysisController = require('../controllers/productAnalysisController')
const authentication = require('../midllewares/authentication')

const router = express.Router()

// Existing IBM Granite endpoints
router.post('/run', runGraniteModel)
router.get('/info', getModelInfo)

// New Product Analysis endpoints with IBM Granite
router.use(authentication) // Require authentication for analysis features

// Product Review Generator
router.get('/analysis/review/:id', ProductAnalysisController.generateProductReview)

// Product Performance Analysis
router.get('/analysis/performance/:id', ProductAnalysisController.analyzeProductPerformance)

// Marketing Copy Generator
router.get('/analysis/marketing-copy/:id', ProductAnalysisController.generateMarketingCopy)

// Product Comparison
router.post('/analysis/compare', ProductAnalysisController.compareProducts)

module.exports = router
