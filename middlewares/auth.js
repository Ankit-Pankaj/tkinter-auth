const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/variables')
const User = require('../api/user/schema')

const authService = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            res.status(400).json({ error: 'No Authorization Header' });
            return;
        }

        const token = req.headers.authorization.split(" ")[1];
        const payload = await jwt.verify(token, JWT_SECRET);
        if (!payload) {
            res.status(400).json({ error: 'verification failed' });
            return;
        }
        let userPresent =await User.findOne({_id:payload.signDetails.userId});
        if(!userPresent){
            res.status(400).json({error:'Invalid User'})
            return;
        }
        req.body.payload = payload;
        next();

    }
    catch (error) {
        res.status(400).json({ error });
    }
}

module.exports = authService;