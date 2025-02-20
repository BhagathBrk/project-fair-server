// steps to define express server
// load .env file contents into process.env

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routes/router')
require('./database/dbConnection')

const pfServer = express()
pfServer.use(cors())
pfServer.use(express.json())
pfServer.use(router)
pfServer.use('/uploads', express.static('./uploads'))

const PORT = 3000 || process.env.PORT

pfServer.listen(PORT, ()=>{
console.log(`pfServer is running on port: ${PORT}`);
    
})

pfServer.get('/',(req, res)=>{
    res.status(200).send('<h1> pfServer started running </h1>')
})

