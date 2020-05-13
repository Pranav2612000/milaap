const router = require('express').Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('config');
const rooms = require('../models/Rooms.model');
const userLogins = require('../models/UserLogin.model');
const users = require('../models/User.model');

router.post('/sendmessage', async(req, res) => {
        const sender = res.body.sender;
        const msg = res.body.msg;
        const roomName = res.body.roomName;
        return; 
});
