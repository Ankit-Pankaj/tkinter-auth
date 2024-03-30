const express = require('express');
const cors = require('cors');
var cookieParser = require('cookie-parser')
const session = require('express-session')
const variables = require('./config/variables');
var bodyParser = require('body-parser');
const http = require('http')
const db = require('./config/db')
require('dotenv').config();

const dbInit =require('./config/db');

const app = express();

const server = http.createServer(app);
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors({origin:variables.CLIENT_SERVER, credentials:true}))
app.use(cookieParser("randomSecretKey"))
app.use(session({
    secret:"secret-key",
    resave:false,
    saveUninitialized: false,
}))

dbInit();
const router = express.Router()

const registerTestRoute = require('./api/user/routes');

// REST routes
app.use('/user', registerTestRoute)

const PORT = variables.PORT;
server.listen(PORT, ()=>{
    console.log('server started on port ' + PORT);
})

module.exports= {
    app:app,
    server:server
};

