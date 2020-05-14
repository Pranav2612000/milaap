const router = require('express').Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('config');
const rooms = require('../models/Rooms.model');
const userLogins = require('../models/UserLogin.model');
const users = require('../models/User.model');
const shortid = require('shortid');

router.post('/sendmessage', async(req, res) => {
        const sender = req.body.sender;
        const msg = req.body.msg;
        const roomName = req.body.roomName;
        const msgObject = {
                msg: msg,
                sender: sender,
                id: shortid.generate(),
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

router.post('/enterroom', async (req, res) => {
        const roomName = req.body.roomName;
        /*
         * Reminder that generating peerId on server side is not a good idea.
                /* We may store previous ids in a room and use them again, but for now creating a
                 * new id every time a user enters a room. //
        */
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

router.post('/exitstream', async(req, res) => {
        const roomName = req.body.roomName;
        const username = req.body.username;
        rooms.findOne({roomName: roomName}, function(err, room) {
                if(err) {
                        return res.status(400).json({err: "Error. Try again."});
                }
                if(!room) {
                        return res.status(400).json({err: "Error. Incorrect roomname."});
                }
                let onlineArray = room._doc.online;
                if(onlineArray == undefined) {
                        return res.status(200).json({msg: "Already exited"});
                }
                var indexToBeDeleted = -1;
                onlineArray.forEach((val, index) => {
                        if(val.username == username) {
                                indexToBeDeleted = index;
                        }
                });
                console.log(indexToBeDeleted);
                if(indexToBeDeleted == -1) {
                        return res.status(200).json({msg: "Already exited"});
                } else {
                        onlineArray.splice(indexToBeDeleted, 1);
                        console.log(onlineArray);
                        room._doc.online = onlineArray;
                        room.markModified('online');
                        //console.log(room);
                        room.save(err => {
                                if(err) {
                                  return res.status(400).json({err: "Error Exiting Video"});
                                } else {
                                  return res.status(200).json({msg: "Room Exited successfully"});
                                }
                        });
                }
        });
});
router.post('/goonline', async (req, res) => {
        const tkn = req.body.tkn;
        const roomName = req.body.roomName;
        const username = req.body.username;
        rooms.findOne({roomName: roomName}, function(err, room) {
                if(err) {
                        return res.status(400).json({err: "Error. Try again."});
                }
                if(!room) {
                        return res.status(400).json({err: "Error. Incorrect roomname."});
                }
                let onlineArray = room.online;
                let onlinePersonObj = {};
                onlinePersonObj.username = username;
                onlinePersonObj.tkn = tkn;

                //First person online
                if(room._doc.online == undefined) {
                        //Update online array and return; 
                        rooms.updateOne({roomName: roomName}, {$addToSet: { online: onlinePersonObj}}, function(err, result) {
                                if(err) {
                                        return res.status(400).json({err: err});
                                } else {
                                        return res.status(200).json({msg: "Waiting for others", connected: 1});
                                }
                        });
                } else {
                        let onlineArray = room._doc.online;
                        var indexOfCurrentUser = -1;
                        onlineArray.forEach((val, index) => {
                                if(val.username == username) {
                                        indexOfCurrentUser = index;
                                }
                        });
                        if(indexOfCurrentUser != -1) {
                                onlineArray[indexOfCurrentUser] = onlinePersonObj;
                                room._doc.online = onlineArray;
                                room.markModified('online');
                                room.save(err => {
                                        if(err) {
                                          return res.status(400).json({err: "Error Connecting"});
                                        } else {
                                                return res.status(200).json({msg: "Waiting for others", connected: onlineArray.length, online: onlineArray});
                                        }
                                });
                        } else {
                                rooms.updateOne({roomName: roomName}, {$addToSet: { online: onlinePersonObj}}, function(err, result) {
                                        if(err) {
                                                return res.status(400).json({err: err});
                                        } else {
                                                return res.status(200).json({msg: "Waiting for others", connected: onlineArray.length + 1, online: onlineArray});
                                        }
                                });
                        }
                }
        });
});
module.exports = router;
