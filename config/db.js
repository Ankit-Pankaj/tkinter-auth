const DB_URL = require('./variables').MONGODB_URL
const mongoose = require('mongoose')
require('dotenv').config({path:'.env'})

const MONGODB_URL = require('./variables').MONGODB_URL

function dbInit(callback){
    mongoose.connect(MONGODB_URL, {useNewUrlParser:true,  useUnifiedTopology:true})
    .then(()=>{
        console.log('MongoDB connected');
        callback();
    })
    .catch(err => console.log(err));
}

module.exports = dbInit;