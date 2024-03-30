const dotenv= require('dotenv')
dotenv.config();

const PORT = process.env.PORT;
const SERVER = process.env.SERVER;
const CLIENT_SERVER = process.env.CLIENT_SERVER
const MONGODB_URL = process.env.MONGODB_URL
const TEMP_USER_PASSWORD = process.env.TEMP_USER_PASSWORD
const JWT_SECRET = process.env.JWT_SECRET
const PFP_BASE_URL = process.env.PFP_BASE_URL
const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET

module.exports={
    PORT,
    SERVER,
    CLIENT_SERVER,
    MONGODB_URL,
    TEMP_USER_PASSWORD,
    JWT_SECRET,
    PFP_BASE_URL,
    CAPTCHA_SECRET,
}