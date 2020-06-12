const router = require('express').Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('config');
const rooms = require('../models/Rooms.model');
const userLogins = require('../models/UserLogin.model');
const users = require('../models/User.model');
var io = require('../index');
const axios = require('axios');
const auth = require('../middleware/auth');
// console.log(io);

router.post('/adduser', auth, async (req, res) => {
  const host = req.user.id;
  const user = req.body.user;
  const roomName = req.body.roomName;

  // Add roomname to host
  users.updateOne({ username: host }, { $addToSet: { rooms: roomName } }, function (
    err,
    result
  ) {
    if (err) {
      res.send(err);
    } else {
      // res.send(result);
    }
  });
  // Add roomname to user
  users.updateOne({ username: user }, { $addToSet: { rooms: roomName } }, function (
    err,
    result
  ) {
    if (err) {
      res.send(err);
    } else {
      //
    }
  });

  // Create and save new room
  rooms.findOne({ roomName: roomName }, function (err, room) {
    if (err) {
      return res.status(400).json({ err: 'Error Creating Room' });
    }
    if (!room) {
      // Create a new room
      room = new rooms({ roomName: roomName, users: [host, user] });
      room.save((err) => {
        if (err) {
          return res.status(400).json({ err: 'Error Creating Room' });
        } else {
          // console.log(room);
          io.emit('newRoom', req.data);
          return res.status(200).json({ msg: 'Room Created successfully' });
        }
      });
    } else {
      var userArray = room._doc.users;
      if (userArray === undefined) {
        return res.status(400).json({ err: 'Error Creating Room' });
      }
      userArray.push(user);
      room._doc.users = userArray;
      room.markModified('users');
      room.save((err) => {
        if (err) {
          return res.status(400).json({ err: 'Error Creating Room' });
        } else {
          io.emit('userJoined', req.body);
          io.emit('newRoom', req.data);
          console.log(room._doc.users);
          return res.status(200).json({ msg: 'Room Created successfully' });
        }
      });
    }
  });
  /*
    var room = new rooms({roomName: roomName, users: [host, user]});
    room.save(err => {
            if(err) {
              return res.status(400).json({err: "Error Creating Room"});
            } else {
              return res.status(200).json({msg: "Room Created successfully"});
            }
    });
    */
});

/* Takes an input username and returns a JWT string which encrypts
 * this name. */
router.post('/gettokenfortempuser', async (req, res) => {
  const name = req.body.name;
  const roomName = req.body.roomName;
  const payload = {
    user: {
      id: name,
      roomName: roomName
    }
  };
  console.log(roomName);
  rooms.findOne({ roomName: roomName }, function (err, room) {
    if (err) {
      return res.status(400).json({ err: 'Error. Try again.' });
    }
    if (!room) {
      return res.status(400).json({ err: 'Room does not exist' });
    } else {
      var i = -1;
      var userExists = false;
      //TODO: Check in all registered users, not just for this room.
      if (room._doc.users == undefined) {
        room._doc.users = [];
      }
      room._doc.users.forEach((val, index) => {
        if (val == name) {
          i = index;
          userExists = true;
        }
      });
      if (i == -1) {
        console.log('not found in users.');
      }
      if (userExists == false) {
        if (room._doc.guests == undefined) {
          room._doc.guests = [];
        }
        console.log(room._doc.guests);
        room._doc.guests.forEach((val, index) => {
          console.log(val);
          if (val == name) {
            i = index;
            userExists = true;
          }
        });
      }
      if (userExists == false) {
        try {
          jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.status(200).json({
                token,
                temp_details: {
                  userId: name
                }
              });
            }
          );
        } catch (e) {
          res.status(400).json({ err: e });
        }
      } else {
        res.status(400).json({ err: 'Username already taken' });
      }
    }
  });
});

router.post('/getrooms', auth, async (req, res) => {
  console.log('HI there');
  const username = req.user.id;
  console.log('getrooms', req.user.id);
  users.findOne({ username: username }, function (err, user) {
    if (err) {
      return res.status(400).json({ err: 'Error. Try again.' });
    }
    if (!user) {
      return res.status(201).json({ msg: 'Temporary User' });
    }
    console.log({ ...user });
    res.status(200).json({ msg: 'Success', rooms: user._doc.rooms });
  });
});

router.get('/getUserName', auth, async (req, res) => {
  const username = req.user.id;
  // console.log(username)
  res.status(200).json({ username: username });
});
module.exports = router;
