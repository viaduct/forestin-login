const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')


const config = require('./config')
const app = express()
const port = 4200

app.set('jwt-secret', config.secret)
app.set('view engine','ejs');
app.set('loading','./loading');

app.use(bodyParser.json())
app.use(express.static('public'));
app.use(morgan('dev'))
app.use('/', require('./routers'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

mongoose.connect(config.mongodbUri)
const db = mongoose.connection
db.on('error', console.error)
db.once('open', ()=>{
    console.log('connected to mongodb server')
})
