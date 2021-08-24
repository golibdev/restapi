const express = require('express')
const fileupload = require('express-fileupload')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/db')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors())

app.use(fileupload())

app.use(express.static('public'))

// Registrate routes
app.use('/api/v1/post', require('./routes/blogRoutes'))

connectDB()

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})
