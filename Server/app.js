if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const express = require('express')
const cors = require ('cors')
const path = require('path')
const router = require('./routers')
const errorHandler = require('./midllewares/errorHandler')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// Serve static files (untuk profile pictures)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/', router)

app.use(errorHandler)

module.exports = app