const router = require('express').Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('config');
const rooms = require('../models/Rooms.model');
const userLogins = require('../models/UserLogin.model');
const users = require('../models/User.model');

router.post('/sendmessage', async(req, res) => {
        const sender = req.body.sender;
        const msg = req.body.msg;
        const roomName = req.body.roomName;
        const msgObject = {
                msg: msg,
                sender: sender,
        };
        rooms.findOne({roomName: roomName}, function(err, room) {
                if(err) {
                        return res.status(400).json({err: "Error. Try again."});
                }
                if(!room) {
                        return res.status(400).json({err: "Error. Incorrect roomname."});
                }
                console.log({...room});
                let msgArray = room._doc.msgArray;

                if(msgArray == undefined) {
                        msgArray = [];
                }
                //Use RabbitMQ for improvements.
                if(msgArray.length > 20) {
                        //msgArray.shift();
                        rooms.updateOne(
                            { roomName: roomName },
                                { $pop: {msgArray: -1} },
                            function(err, result) {
                              if (err) {
                                res.send(err);
                                return;
                              } else {
                                //res.send(result);
                              }
                            }
                        );
                }
                //msgArray.push(msgObject);
                rooms.updateOne(
                    { roomName: roomName },
                        { $push: {msgArray: msgObject}},
                    function(err, result) {
                      if (err) {
                        res.send(err);
                        return;
                      } else {
                        //res.send(result);
                      }
                    }
                );
                room._doc.msgArray = msgArray;
                console.log(room);
                room.save(err => {
                        if(err) {
                          return res.status(400).json({err: "Error Updating Room"});
                        } else {
                          return res.status(200).json({msg: "Room Created successfully"});
                        }
                });
        });
});

router.post('/getmsgs', async (req, res) => {
        const roomName = req.body.roomName;
        rooms.findOne({roomName: roomName}, function(err, room) {
                if(err) {
                        return res.status(400).json({err: "Error. Try again."});
                }
                if(!room) {
                        return res.status(400).json({err: "Error. Incorrect roomname."});
                }
                return res.status(200).json({msg: "Success", msgs: room._doc.msgArray});
        });
});
module.exports = router;
