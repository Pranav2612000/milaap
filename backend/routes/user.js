const router = require('express').Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('config');
const rooms = require('../models/Rooms.model');
const userLogins = require('../models/UserLogin.model');
const users = require('../models/User.model');

router.post('/adduser', async(req, res) => {
        const host = req.body.host;
        const user = req.body.user;
        const roomName = req.body.roomName;
        
        //Add roomname to host
        users.updateOne(
            { username: host },
            { $addToSet: { rooms: roomName } },
            function(err, result) {
              if (err) {
                res.send(err);
                return;
              } else {
                //res.send(result);
              }
            }
        );
        //Add roomname to user
        users.updateOne(
            { username: user },
            { $addToSet: { rooms: roomName } },
            function(err, result) {
              if (err) {
                res.send(err);
                return;
              } else {
                //res.send(result);
              }
            }
        );
        
        //Create and save new room
        var room = new rooms({roomName: roomName, users: [host, user]});
        room.save(err => {
                if(err) {
                  return res.status(400).json({err: "Error Creating Room"});
                } else {
                  return res.status(200).json({msg: "Room Created successfully"});
                }
        });
});

router.post('/getrooms', async (req, res) => {
        const username = req.body.username;
        users.findOne({username: username}, function(err, user) {
                if(err) {
                        return res.status(400).json({err: "Error. Try again."});
                } 
                if(!user) {
                        return res.status(400).json({err: "Error. Try again"});
                }
                console.log({...user});
                res.status(200).json({msg: "Success", rooms: user._doc.rooms});
        });
});

module.exports = router;














