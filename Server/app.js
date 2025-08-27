if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const express = require('express')
const cors = require ('cors')
const router = require('./routers')
const errorHandler = require('./midllewares/errorHandler')
const app = express()
// const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use('/', router)

app.use(errorHandler)

// const port = process.env.PORT || 3000
// app.listen(port, () => {
//   console.log(`Server can be run on port ${port}`)
// })

module.exports = app