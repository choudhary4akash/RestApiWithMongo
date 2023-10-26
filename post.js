const express = require('express')
const data = require('./data.json')
const app = express();
const fs = require('fs')

// Post method to insert data to the json file



app.listen(3000,()=>{
    console.log('Server is running at http://127.0.0.1:3000 ')
})