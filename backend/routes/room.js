const router = require('express').Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('config');
const rooms = require('../models/Rooms.model');
const userLogins = require('../models/UserLogin.model');
const users = require('../models/User.model');
const shortid = require('shortid');
var io = require('../index');
const auth = require('../middleware/auth');
const cron = require('cron').CronJob;
//Create a new room
/* TODO: Modify the function rollback changes on failure*/

//Run this function as a chron job every x hours
function cleanDB() {
  const now = new Date();
  // console.log(now);
  rooms.find({ lastreq: { $lt: now } }, (err, room) => {
    room.map((val, index) => {
      const data = val.toObject();
      //Getting the time since last join call by a user in room (in hours)
      let timeSinceLastCall = (now - data.lastreq) / 36e5;
      let clearoutTime = 12; // Set the time (in hours) after which the guest and online array need to be cleaned
      console.log(timeSinceLastCall);
      if (timeSinceLastCall > clearoutTime) {
        rooms.updateOne(
          { roomName: data.roomName },
          { $set: { onlineSimple: [], guests: [] } },
          (err, res) => {
            if (err) console.log(err);
          }
        );
      }
    });
  });
}

//This part runs the CronJob
//Currently runs every 12 hours(1 AM and 1PM)
var job = new cron(
  '0 1,13 * * *',
  function () {
    console.log('Running CronJob');
    cleanDB();
  },
  null,
  true,
  'America/Los_Angeles'
);

job.start();

router.post('/createroom', auth, async (req, res) => {
  const host = req.user.id;
  const roomName = req.body.roomName;
  // cleanDB();
  // Create and save new room
  rooms.findOne({ roomName: roomName }, function (err, room) {
    if (err) {
      return res.status(400).json({ err: 'Error Creating Room' });
    }
    if (!room) {
      // Create a new room
      room = new rooms({
        roomName: roomName,
        users: [host],
        guests: []
      });
      room.save((err) => {
        if (err) {
          return res.status(400).json({ err: 'Error Creating Room' });
        } else {
          console.log(room);
          io.emit('newRoom', req.data);
          // Add roomname to host
          users.updateOne(
            { username: host },
            { $addToSet: { rooms: roomName } },
            function (err, result) {
              if (err) {
                res.send(err);
                return;
              } else {
                console.log('here');
                return res.status(200).json({ msg: 'Room Created successfully' });
              }
            }
          );
        }
      });
    } else {
      // Another room with this name exists.
      res.status(403).json({ msg: 'Another Room with same name already exists' });
      return;
    }
  });
});

router.post('/addusertoroom', auth, async (req, res) => {
  const host = req.user.id;
  const roomName = req.body.roomName;
  const user = req.body.username;
  console.log(user);
  rooms.findOne({ roomName: roomName }, async function (err, room) {
    if (err) {
      return res.status(400).json({ err: 'Error Creating Room' });
    }
    if (!room) {
      return res.status(405).json({ msg: 'Room Not Found' });
    } else {
      await users.findOne({ username: user }, async function (errr, user_found) {
        if (errr) {
          return res.status(400).json({ err: 'Error. Try again.' });
        }
        if (!user_found) {
          return res.status(400).json({ err: "User doesn't exits" });
        }

        //TODO: Check if host has admin access to room.
        await users.updateOne(
          { username: user },
          { $addToSet: { rooms: roomName } },
          function (err, result) {
            if (err) {
              return res.send(err);
            } else {
              console.log('Updated Successfully');
            }
          }
        );

        var userArray = room._doc.users;
        if (userArray === undefined) {
          userArray = [];
        }
        if (userArray.includes(user)) {
          return res.status(400).json({ err: 'User Already has access.' });
        }
        userArray.push(user);
        room.markModified('users');
        room.save((err) => {
          if (err) {
            return res.status(400).json({ err: 'Error Adding user' });
          } else {
            io.emit('userJoined', req.body);
            // io.emit('newRoom', req.data);
            console.log('User Added Successfully');
            return res.status(200).json({ msg: 'User Added successfully' });
          }
        });
      });
    }
  });
});

router.post('/sendmessage', auth, async (req, res) => {
  const sender = req.user.id;
  const msg = req.body.msg;
  const roomName = req.body.roomName;
  console.log('user', req.user);
  rooms.findOne({ roomName: roomName }, function (err, room) {
    if (err) {
      return res.status(400).json({ err: 'Error. Try again.' });
    }
    if (!room) {
      return res.status(400).json({ err: 'Error. Incorrect roomname.' });
    }
    console.log({ ...room });
    let msgArray = room._doc.msgArray;
    let msgObject;
    if (msgArray == undefined) {
      msgArray = [];
      msgObject = {
        msg: msg,
        sender: sender,
        id: 0
      };
    } else {
      msgObject = {
        msg: msg,
        sender: sender,
        id: msgArray[msgArray.length - 1].id + 1
      };
    }
    //Use RabbitMQ for improvements.
    if (msgArray.length > 20) {
      //If number of messages is greater than 20, pop the oldest one.
      //We store only the latest 20 messages for now.

      //msgArray.shift();
      rooms.updateOne({ roomName: roomName }, { $pop: { msgArray: -1 } }, function (
        err,
        result
      ) {
        if (err) {
          res.send(err);
          return;
        } else {
          //res.send(result);
        }
      });
    }
    //msgArray.push(msgObject);
    //Add the new message to the message array everytime irrespective of the number of messages.
    rooms.updateOne(
      { roomName: roomName },
      { $push: { msgArray: msgObject } },
      function (err, result) {
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
    room.save((err) => {
      if (err) {
        return res.status(400).json({ err: 'Error Updating Room' });
      } else {
        //the data being sent will be chnaged later as per requirements
        //console.log('Room and All Messages : ', msgObject, roomName);
        msgObject['room'] = roomName;
        io.emit('newMessage', msgObject);
        return res.status(200).json({ status: 'Success', msg: msgObject });
      }
    });
  });
});

/* Can only enter the room if the room object has this user's id.
 * Returns a complete list of users, currently online users, messages etc.
 * */
router.post('/enterroom', auth, async (req, res) => {
  const roomName = req.body.roomName;
  const username = req.user.id;

  /*
    Also need to send sender id here
  */

  // if (req.user.id === sender) {
  //   console.log("JWT MATCH ERROR")
  //   return res.status(500).json({ msg: 'JWT and SSS_No didnt match!' });
  // }
  /*
         * Reminder that generating peerId on server side is not a good idea.
                /* We may store previous ids in a room and use them again, but for now creating a
                 * new id every time a user enters a room. //
        */
  rooms.findOne({ roomName: roomName }, function (err, room) {
    if (err) {
      return res.status(400).json({ err: 'Error. Try again.' });
    }
    if (!room) {
      return res.status(200).json({ err: 'NOROOM' });
    }
    /* Check if username is in room.users */
    var i = -1;
    var userExists = false;
    if (room._doc.users == undefined) {
      room._doc.users = [];
    }
    room._doc.users.forEach((val, index) => {
      if (val == username) {
        i = index;
        userExists = true;
      }
    });
    if (i == -1) {
      console.log('not found in users.');
    }
    /* Check if username in in room.tempusers. */

    if (userExists == false) {
      if (room._doc.guests == undefined) {
        room._doc.guests = [];
      }
      room._doc.guests.forEach((val, index) => {
        if (val == username) {
          i = index;
          userExists = true;
        }
      });
      if (i == -1) {
        console.log('not found in guests too.');
        /* If uesername not found, add it to temp users. */
        var guestArray = room._doc.guests;
        guestArray.push(username);
        room._doc.guests = guestArray;
        room.markModified('guests');
        room.save((err) => {
          if (err) {
            console.log('Error Adding user');
            return res.status(400).json({ err: 'Error adding user.' });
          } else {
            console.log(room._doc.guests);
            console.log('Guest User Added successfully');
            return res.status(200).json({
              msg: 'Success',
              msgs: room._doc.msgArray,
              users: room._doc.users,
              guests: room._doc.guests
            });
          }
        });
      } else {
        return res.status(200).json({
          msg: 'Success',
          msgs: room._doc.msgArray,
          users: room._doc.users,
          guests: room._doc.guests
        });
      }
    }

    if (userExists) {
      /* If username exits return with all userful info. */
      return res.status(200).json({
        msg: 'Success',
        msgs: room._doc.msgArray,
        users: room._doc.users,
        guests: room._doc.guests
      });
    }
  });
});

router.post('/getActive', auth, async (req, res) => {
  const roomName = req.body.roomName;
  rooms.findOne({ roomName: roomName }, function (err, room) {
    if (err) {
      return res.status(400).json({ err: 'Error. Try again.' });
    }
    if (!room) {
      return res.status(400).json({ err: 'Error. Incorrect roomname.' });
    }
    return res.status(200).json({ msg: 'Success', active: room._doc.online || [] });
  });
});

router.post('/getmsgs', auth, async (req, res) => {
  const roomName = req.body.roomName;
  let lastMsgId = req.body.lastMsgId; // requesting for id 0, should send msg with id 0
  if (lastMsgId == undefined) {
    lastMsgId = 0;
  }
  lastMsgId = parseInt(lastMsgId);
  // console.clear()
  console.log(lastMsgId);
  rooms.findOne({ roomName: roomName }, function (err, room) {
    if (err) {
      return res.status(400).json({ err: 'Error. Try again.' });
    }
    if (!room) {
      return res.status(400).json({ err: 'Error. Incorrect roomname.' });
    }
    let msgArray = room._doc.msgArray;
    if (msgArray == undefined) {
      msgArray = [];
      return res.status(200).json({ msg: 'Success', msgs: msgArray });
    }
    if (lastMsgId === -1) {
      return res.status(200).json({ msg: 'Success', msgs: msgArray });
    }
    // let reqIndex = 0;
    // let i;
    // for (i = 0; i < msgArray.length; i++) {
    //   if (msgArray[i].id >= lastMsgId) {
    //     break;
    //   }
    //   reqIndex++;
    // }
    // let newMsgArray = msgArray.splice(reqIndex);
    return res.status(200).json({ msg: 'Success', msgs: room._doc.msgArray });
    // return res.status(200).json({ msg: "Success", msgs: newMsgArray });
  });
});

router.post('/exitstream', auth, async (req, res) => {
  const roomName = req.body.roomName;
  const username = req.user.id;
  var idToBeDestroyed = [];
  rooms.findOne({ roomName: roomName }, function (err, room) {
    if (err) {
      return res.status(400).json({ err: 'Error. Try again.' });
    }
    if (!room) {
      return res.status(400).json({ err: 'Error. Incorrect roomname.' });
    }
    let onlineArray = room._doc.online;
    if (onlineArray == undefined) {
      onlineArray = [];
      return res.status(200).json({
        msg: 'Already exited',
        online: onlineArray,
        idToBeDestroyed: idToBeDestroyed
      });
    }
    var indicesToBeDeleted = []; // TODO: A peer can be present only 2 times- for audio, video
    //so this can be optimized to stop if we get two elements.
    onlineArray.forEach((val, index) => {
      if (val.username == username) {
        //indexToBeDeleted = index;
        indicesToBeDeleted.unshift(index);
        idToBeDestroyed.unshift(val.tkn);
      }
    });
    console.log(indicesToBeDeleted);
    console.log(onlineArray);
    if (indicesToBeDeleted == []) {
      return res.status(200).json({
        msg: 'Already exited',
        online: onlineArray,
        idToBeDestroyed: idToBeDestroyed
      });
    } else {
      indicesToBeDeleted.forEach((val, index) => {
        onlineArray.splice(val, 1);
        console.log(onlineArray);
      });
      console.log(onlineArray);
      room._doc.online = onlineArray;
      room.markModified('online');
      //console.log(room);
      room.save((err) => {
        if (err) {
          return res.status(400).json({ err: 'Error Exiting Video' });
        } else {
          io.emit('userExit', req.body);
          return res.status(200).json({
            msg: 'Room Exited successfully',
            online: onlineArray,
            idToBeDestroyed: idToBeDestroyed
          });
        }
      });
    }
  });
});

router.post('/goonline', auth, async (req, res) => {
  const tkn = req.body.tkn;
  const roomName = req.body.roomName;
  const username = req.user.id;
  const type = req.body.type;
  console.log(req.body);
  rooms.findOne({ roomName: roomName }, function (err, room) {
    if (err) {
      console.log('error 1');
      return res.status(400).json({ err: 'Error. Try again.' });
    }
    if (!room) {
      console.log('error 2');
      return res.status(400).json({ err: 'Error. Incorrect roomname.' });
    }
    let onlineArray = room.online;
    let onlinePersonObj = {};
    onlinePersonObj.username = username;
    onlinePersonObj.tkn = tkn;
    onlinePersonObj.type = type;
    //First person online
    if (room._doc.online == undefined) {
      //Update online array and return;
      rooms.updateOne(
        { roomName: roomName },
        { $addToSet: { online: onlinePersonObj } },
        function (err, result) {
          if (err) {
            return res.status(400).json({ err: err });
          } else {
            io.emit('userOnline', req.body);
            return res
              .status(200)
              .json({ msg: 'Waiting for others', connected: 1, type: type });
          }
        }
      );
    } else {
      let onlineArray = room._doc.online;
      var indexOfCurrentUser = -1;
      onlineArray.forEach((val, index) => {
        if (val.username == username && val.type == type) {
          indexOfCurrentUser = index;
        }
      });
      if (indexOfCurrentUser != -1) {
        //Return the current entry in array.
        onlineArray[indexOfCurrentUser].tkn = tkn;
        room._doc.online = onlineArray;
        room.markModified('online');
        room.save((err) => {
          if (err) {
            return res.status(400).json({ err: 'Error Exiting Video' });
          } else {
            io.emit('userOnline', req.body);
            return res.status(200).json({
              msg: 'Waiting for others',
              connected: onlineArray.length,
              online: onlineArray,
              changePeer: false,
              peerId: onlineArray[indexOfCurrentUser].tkn,
              type: type
            });
          }
        });
      } else {
        rooms.updateOne(
          { roomName: roomName },
          { $addToSet: { online: onlinePersonObj } },
          function (err, result) {
            if (err) {
              return res.status(400).json({ err: err });
            } else {
              io.emit('userOnline', req.body);
              return res.status(200).json({
                msg: 'Waiting for others',
                connected: onlineArray.length + 1,
                online: onlineArray,
                type: type
              });
            }
          }
        );
      }
    }
  });
});

router.post('/goonlinesimple', auth, async (req, res) => {
  const id = req.body.id;
  const roomName = req.body.roomName;
  const username = req.user.id;
  const type = req.body.type;
  console.log(req.body);
  rooms.findOne({ roomName: roomName }, function (err, room) {
    if (err) {
      console.log('error 1');
      return res.status(400).json({ err: 'Error. Try again.' });
    }
    if (!room) {
      console.log('error 2');
      return res.status(400).json({ err: 'Error. Incorrect roomname.' });
    }
    let onlineArray = room.onlineSimple;
    let onlinePersonObj = {};
    onlinePersonObj.username = username;
    onlinePersonObj.id = id;
    onlinePersonObj.type = type;
    //First person online
    if (room._doc.onlineSimple == undefined) {
      //Update online array and return;
      rooms.updateOne(
        { roomName: roomName },
        {
          $addToSet: { onlineSimple: onlinePersonObj },
          $set: {
            lastreq: new Date()
          }
        },
        function (err, result) {
          if (err) {
            return res.status(400).json({ err: err });
          } else {
            io.emit('userOnline', req.body);
            return res.status(200).json({
              msg: 'Waiting for others',
              connected: 1,
              type: type,
              online: []
            });
          }
        }
      );
    } else {
      let onlineArray = room._doc.onlineSimple;
      var indexOfCurrentUser = -1;
      onlineArray.forEach((val, index) => {
        if (val.username == username && val.type == type) {
          indexOfCurrentUser = index;
        }
      });
      if (indexOfCurrentUser != -1) {
        //Return the current entry in array.
        onlineArray[indexOfCurrentUser].id = id;
        room._doc.onlineSimple = onlineArray;
        room.markModified('onlineSimple');
        room.save((err) => {
          if (err) {
            return res.status(400).json({ err: 'Error Exiting Video' });
          } else {
            io.emit('userOnline', req.body);
            return res.status(200).json({
              msg: 'Waiting for others',
              connected: onlineArray.length,
              online: onlineArray,
              changePeer: false,
              type: type
            });
          }
        });
      } else {
        rooms.updateOne(
          { roomName: roomName },
          {
            $addToSet: {
              onlineSimple: onlinePersonObj
            },
            $set: {
              lastreq: new Date()
            }
          },
          function (err, result) {
            if (err) {
              return res.status(400).json({ err: err });
            } else {
              io.emit('userOnline', req.body);
              return res.status(200).json({
                msg: 'Waiting for others',
                connected: onlineArray.length + 1,
                online: onlineArray,
                type: type
              });
            }
          }
        );
      }
    }
  });
});

router.post('/exitstreamsimple', auth, async (req, res) => {
  const roomName = req.body.roomName;
  const username = req.user.id;
  var idToBeDestroyed = [];
  rooms.findOne({ roomName: roomName }, function (err, room) {
    if (err) {
      return res.status(400).json({ err: 'Error. Try again.' });
    }
    if (!room) {
      return res.status(400).json({ err: 'Error. Incorrect roomname.' });
    }
    let onlineArray = room._doc.onlineSimple;
    if (onlineArray == undefined) {
      onlineArray = [];
      return res.status(200).json({
        msg: 'Already exited',
        online: onlineArray,
        idToBeDestroyed: idToBeDestroyed
      });
    }
    var indicesToBeDeleted = []; // TODO: A peer can be present only 2 times- for audio, video
    //so this can be optimized to stop if we get two elements.
    onlineArray.forEach((val, index) => {
      if (val.username == username) {
        //indexToBeDeleted = index;
        indicesToBeDeleted.unshift(index);
        idToBeDestroyed.unshift(val.tkn);
      }
    });
    console.log(indicesToBeDeleted);
    console.log(onlineArray);
    if (indicesToBeDeleted == []) {
      return res.status(200).json({
        msg: 'Already exited',
        online: onlineArray,
        idToBeDestroyed: idToBeDestroyed
      });
    } else {
      indicesToBeDeleted.forEach((val, index) => {
        onlineArray.splice(val, 1);
        console.log(onlineArray);
      });
      console.log(onlineArray);
      room._doc.onlineSimple = onlineArray;
      room.markModified('onlineSimple');
      //console.log(room);
      room.save((err) => {
        if (err) {
          return res.status(400).json({ err: 'Error Exiting Video' });
        } else {
          io.emit('userExit', req.body);
          return res.status(200).json({
            msg: 'Room Exited successfully',
            online: onlineArray,
            idToBeDestroyed: idToBeDestroyed
          });
        }
      });
    }
  });
});

module.exports = router;
