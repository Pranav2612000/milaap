const router = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const rooms = require('../models/Rooms.model');
const users = require('../models/User.model');
const io = require('../index');
const auth = require('../middleware/auth');

router.post('/adduser', auth, async (req, res) => {
  const host = req.user.id;
  const { user, roomName } = req.body;

  try {
    // Add roomname to host
    await users.updateOne({ username: host }, { $addToSet: { rooms: roomName } });

    // Add roomname to user
    await users.updateOne({ username: user }, { $addToSet: { rooms: roomName } });

    try {
      const room = await rooms.findOne({ roomName: roomName });
      if (!room) {
        // Create a new room
        room = new rooms({ roomName, users: [host, user] });
        await room.save();
        io.emit('newRoom', req.data);
        return res.status(200).json({ msg: 'Room Created successfully' });
      } else {
        const userArray = room._doc.users;
        if (!userArray) return res.status(400).json({ err: 'Error Creating Room' });

        userArray.push(user);
        room._doc.users = userArray;
        room.markModified('users');
        await room.save();
        io.emit('userJoined', req.body);
        io.emit('newRoom', req.data);
        return res.status(200).json({ msg: 'Room Created successfully' });
      }
    } catch {
      return res.status(400).json({ err: 'Error Creating Room' });
    }
  } catch (error) {
    res.send(error);
  }
});
router.post('/verify', async (req, res) => {
  const token = req.body.headers['milaap-auth-token'];
  if (!token) return res.status(400).json({ res: false });
  try {
    await jwt.verify(token, config.get('jwtSecret'));
    return res.status(200).json({ res: true });
  } catch {
    return res.status(400).json({ res: false });
  }
});
/* Takes an input username and returns a JWT string which encrypts
 * this name. */
router.post('/gettokenfortempuser', async (req, res) => {
  const { name, roomName } = req.body;
  const payload = {
    user: {
      id: name,
      roomName
    }
  };
  try {
    const room = await rooms.findOne({ roomName });
    if (!room) return res.status(400).json({ err: 'Room does not exist' });
    let i = -1;
    let userExists = false;

    //TODO: Check in all registered users, not just for this room.
    room._doc.users = room._doc.users || [];

    room._doc.users.forEach((val, index) => {
      if (val === name) {
        i = index;
        userExists = true;
      }
    });
    if (!userExists) {
      room._doc.guests = room._doc.guests || [];
      room._doc.guests.forEach((val, index) => {
        if (val === name) {
          i = index;
          userExists = true;
        }
      });
    }
    if (!userExists) {
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
      res.status(401).json({ err: 'Username already taken' });
    }
  } catch (err) {
    return res.status(400).json({ err: 'Error. Try again.' });
  }
});

router.post('/getrooms', auth, async (req, res) => {
  const username = req.user.id;
  try {
    const user = await users.findOne({ username: username });
    if (!user) return res.status(201).json({ msg: 'Temporary User' });
    res.status(200).json({ msg: 'Success', rooms: user._doc.rooms });
  } catch (err) {
    return res.status(400).json({ err: 'Error. Try again.' });
  }
});

router.get('/getUserName', auth, async (req, res) => {
  const username = req.user.id;
  res.status(200).json({ username });
});
module.exports = router;
