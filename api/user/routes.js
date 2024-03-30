const express = require("express");
const User = require("./schema");
// note: emerladchat stores user details in cookie until window is closed.Once window is closed the session gets expired and cookie gets deleted.
const userController = require('./controller');
const bcrypt = require('bcrypt')
const { JWT_SECRET, CAPTCHA_SECRET } = require('../../config/variables')
const jwt = require('jsonwebtoken');
const authService = require('../../middlewares/auth')
const multer = require('multer')
const path = require('path')
const fs = require('fs');
const { aggregate } = require("./schema");
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();

router.post("/register", async (req, res) => {
    const { email,
        paid,
        name,
        country,
        password } = req.body;

    let query = {};
  
    if (email) {
        query['email'] = email;
    }
    if (String(paid) === 'true' || String(paid) === 'false') {
        query['paid'] = (String(paid) === 'false') ? false : true;
    }
    if (name) {
        query['name'] = name;
    }
    if (country) {
        query['country'] = country;
    }
    if (password) {
        query['password'] = password;
    }

    try {
        let user = await User.create(query);
        const signDetails = {
            userId: user._id,
            email: user.email,
            // temp: user.temp
        }
        const token = jwt.sign({ signDetails }, JWT_SECRET, {
            expiresIn: '1d'
        });
        user = user.toJSON();
        delete user.password;
        user['token'] = token;
        res.status(200).json({ user: user, msg: "User created Succesfully" })
    }
    catch (err) {
        res.status(400).json({ msg: 'Registration failed', err: err.message })
    }
});

// function sendMail(){
//     let transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           type: 'OAuth2',
//           user: process.env.MAIL_USERNAME,
//           pass: process.env.MAIL_PASSWORD,
//           clientId: process.env.OAUTH_CLIENTID,
//           clientSecret: process.env.OAUTH_CLIENT_SECRET,
//           refreshToken: process.env.OAUTH_REFRESH_TOKEN
//         }
//       });
// }


router.post("/captcha", async (req, res) => {
    let server_key = CAPTCHA_SECRET;
    let humanKey = req.body.humanKey;
    let body = {
        secret: req.body.humanKey,
        response: server_key
    }

    try {
        const isHuman = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${server_key}&response=${humanKey}`,
            {},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
                },
            })
            .then((captchaResponse) => {
                res.status(200).json({ data: captchaResponse.data })
            })
            .catch((err) => {
                console.log(err)
            })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ msg: 'captcha failed', err: err.message })
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ msg: 'User Not Found' })
            return;
        }
        const signDetails = {
            email: user.email,
            userId: user._id,
            // temp: user.temp
        }

        // compares provided plane password with saved hashed password
        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ signDetails }, JWT_SECRET, {
                expiresIn: '1d'
            });
            res.json({
                user,
                token,
                message: "create user successfully"
            });
        }
        else {
            res.status(401).json({
                msg: "Password or email is invalid"
            });
        }
    }
    catch (e) {
        console.log('login failed', e)
        res.status(400).json({ msg: 'Login Failed' })
    }

})

// dont expose it on production environment
// router.get('/token', async (req, res) => {
//     let requestHost = req.get('host')
//     if (requestHost !== "localhost:4300") {
//         res.status(400).json({ msg: 'Invalid Endpoint' });
//         return;
//     }


//     let { userId } = req.query;
//     if (!userId) {
//         res.status(400).json({ msg: 'Invalid UserId' });
//         return;
//     }

//     let userFound = await User.findOne({ _id: userId })
//     if (!userFound) {
//         res.status(400).json({ msg: 'user not present' });
//         return;
//     }
//     const signDetails = {
//         userId: userFound._id,
//         email: userFound.email,
//         temp: userFound.temp
//     }

//     const token = jwt.sign({ signDetails }, JWT_SECRET, {
//         expiresIn: '1d'
//     });

//     res.status(200).json({ token })

// })

router.get('/user', authService, async (req, res) => {
    try {
        let aggregateQuery = []
        console.log('#####----ip address----####', req.ip)
        let authorizedUserId = req.body.payload.signDetails.userId;
        let { userId } = req.query;

        let findQuery = {}

        if (userId) {
            findQuery._id = ObjectId(userId);
        }

        let userFound = await User.find(findQuery)
        if (!userFound[0]) {
            res.status(200).json({ success: false, msg: 'User not Found' });
            return;
        }
        res.status(200).json({ success: true, user: userFound[0] });

    } catch (err) {
        res.status(400).json({ msg: 'Server Error', err: err.message });
    }
})

// router.put('/user', authService, async (req, res) => {
//     let updateQuery = {};
//     try {
//         const { username,
//             email,
//             paid,
//             name,
//             country,
//             password } = req.query;
//         let authorizedUserId = req.body.payload.signDetails.userId

//         if (!userId) {
//             res.status(401).json({ success: false, msg: 'Missing userId' });
//             return;
//         }
//         if(userId !== authorizedUserId){
//             res.status(401).json({success:false, msg:'Unauthorized User'});
//             return;
//         }
//         const userFound = await User.findOne({_id:userId});
//         if(!userFound){
//             res.status(401).json({success:false, msg:'User Not found'})
//         }
//         if (username) {
//             userFound.username = username;
//         }
//         if (gender) {
//             userFound.gender= gender;
//         }
//         if (temp||temp===false) {
//             if(temp==='true'|| temp===true){
//                 userFound.temp = true;
//             }
//             if(temp==='false'|| temp===false){
//                 userFound.temp = false;
//             }
//         }
//         if (email) {
//             userFound.email = email;
//         }
//         if(karma){
//             userFound.karma = parseInt(karma);
//         }
//         if(pfp){
//             userFound.pfp = pfp;
//         }
//         updatedUser = await userFound.save();
//         console.log('updated user', updatedUser)
//         res.status(200).json({msg:'user updated', user:updatedUser})

//     } catch (err) {
//         res.status(400).json({ msg: 'Server Error', err: err.message })
//     }
// })

// router.delete('/user', authService, async (req, res) => {
//     let updateQuery = {};
//     try {
//         const {userId, email} = req.body;
//         let authorizedUserId = req.body.payload.signDetails.userId

//         if (!userId) {
//             res.status(401).json({ success: false, msg: 'Missing userId' });
//             return;
//         }
//         if(userId !== authorizedUserId){
//             res.status(401).json({success:false, msg:'Unauthorized User'});
//             return;
//         }
//         const userFound = await User.findOne({_id:userId});
//         if(!userFound){
//             res.status(401).json({success:false, msg:'User Not found'})
//         }

//         deletedUser = await userFound.delete();
//         console.log('deleted user', deletedUser)
//         res.status(200).json({msg:'user deleted', user:deletedUser})

//     } catch (err) {
//         res.status(400).json({ msg: 'Server Error', err: err.message })
//     }
// })


module.exports = router;


/*
        // for permanent user
        username
        emailn
        password
        isTemp :true
        gender:male/female
        karma
    
        // for temp users
        username
        isTemp : false
        gender
        karma
    */
