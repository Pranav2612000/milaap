const router = require('express').Router();
const cron = require('cron').CronJob;

const rooms = require('../models/Rooms.model');
const users = require('../models/User.model');
const io = require('../index');
const auth = require('../middleware/auth');

//Create a new room
/* TODO: Modify the function rollback changes on failure*/

//Run this function as a chron job every x hours
const cleanDB = async () => {
  const now = new Date();
  try {
    const room = await rooms.find({ lastreq: { $lt: now } });
    room.map(async (val) => {
      const data = val.toObject();
      const timeSinceLastCall = (now - data.lastreq) / 36e5;
      const clearoutTime = 12; // Set the time (in hours) after which the guest and online array need to be cleaned
      if (timeSinceLastCall > clearoutTime) {
        await rooms.updateOne(
          { roomName: data.roomName },
          { $set: { onlineSimple: [], guests: [] } }
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
};

//This part runs the CronJob
//Currently runs every 12 hours(1 AM and 1PM)
const job = new cron(
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

router.delete('/', auth, async (req, res) => {
  const { id: username } = req.user;
  const { roomName } = req.body;

  try {
    const room = await rooms.findOne({ roomName });
    if (!room) return res.status(404).json({ msg: 'Room does not exist' });

    if (!room.users.includes(username)) {
      return res.status(403).json({ msg: "Don't have access to this feature" });
    }
    await rooms.deleteOne({ roomName });
    res.sendStatus(200);
  } catch (err) {
    return res.status(400).json({ err: 'Error Deleting Room' });
  }
});

router.post('/createroom', auth, async (req, res) => {
  const { id: host } = req.user;
  const { roomName } = req.body;

  // Create and save new room
  try {
    const room = await rooms.findOne({ roomName });
    if (room) {
      res.status(403).json({ msg: 'Another Room with same name already exists' });
      return;
    }

    // Create a new room
    room = new rooms({
      roomName: roomName,
      users: [host],
      guests: []
    });
    await room.save();
    io.emit('newRoom', req.data);
    await users.updateOne({ username: host }, { $addToSet: { rooms: roomName } });
    return res.status(200).json({ msg: 'Room Created successfully' });
  } catch (err) {
    return res.status(400).json({ err: 'Error Creating Room' });
  }
});

router.post('/addusertoroom', auth, async (req, res) => {
  const { roomName, username: user } = req.body;

  try {
    const room = await rooms.findOne({ roomName });
    if (!room) return res.status(405).json({ msg: 'Room Not Found' });

    const userFound = await users.findOne({ username: user });
    if (!userFound) return res.status(400).json({ err: "User doesn't exits" });
    await users.updateOne({ username: user }, { $addToSet: { rooms: roomName } });

    const userArray = room._doc.users || [];

    if (userArray.includes(user)) {
      return res.status(400).json({ err: 'User Already has access.' });
    }
    userArray.push(user);
    room.markModified('users');
    try {
      await room.save();
      io.emit('userJoined', req.body);
      console.log('User Added Successfully');
      return res.status(200).json({ msg: 'User Added successfully' });
    } catch {
      return res.status(400).json({ err: 'Error Adding user' });
    }
  } catch {
    return res.status(400).json({ err: 'Error Creating Room' });
  }
});

router.post('/sendmessage', auth, async (req, res) => {
  const { id: sender } = req.user;
  const { msg, roomName } = req.body;
  try {
    const room = await rooms.findOne({ roomName: roomName });
    if (!room) return res.status(400).json({ err: 'Error. Incorrect roomname.' });

    const msgArray = room._doc.msgArray || [];
    const msgObject = {
      msg: msg,
      sender: sender,
      id: msgArray.length === 0 ? 0 : msgArray[msgArray.length - 1].id + 1
    };

    //Use RabbitMQ for improvements.
    if (msgArray.length > 20) {
      //If number of messages is greater than 20, pop the oldest one.
      //We store only the latest 20 messages for now.
      await rooms.updateOne({ roomName: roomName }, { $pop: { msgArray: -1 } });
    }
    await rooms.updateOne({ roomName }, { $push: { msgArray: msgObject } });
    room._doc.msgArray = msgArray;
    await room.save();
    msgObject['room'] = roomName;
    io.emit('newMessage', msgObject);
    return res.status(200).json({ status: 'Success', msg: msgObject });
  } catch {
    return res.status(400).json({ err: 'Error. Try again.' });
  }
});

/* Can only enter the room if the room object has this user's id.
 * Returns a complete list of users, currently online users, messages etc.
 * */
router.post('/enterroom', auth, async (req, res) => {
  const { roomName } = req.body;
  const { id: username } = req.user;

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
  try {
    const room = await rooms.findOne({ roomName });
    if (!room) return res.status(400).json({ err: 'NOROOM' });

    /* Check if username is in room.users */
    let i = -1;
    let userExists = false;
    room._doc.users = room._doc.users || [];
    room._doc.users.forEach((val, index) => {
      if (val === username) {
        i = index;
        userExists = true;
      }
    });

    /* Check if username in in room.tempusers. */
    if (userExists === false) {
      room._doc.guests = room._doc.guests || [];
      room._doc.guests.forEach((val, index) => {
        if (val === username) {
          i = index;
          userExists = true;
        }
      });
      if (i === -1) {
        /* If uesername not found, add it to temp users. */
        const guestArray = room._doc.guests;
        guestArray.push(username);
        room._doc.guests = guestArray;
        room.markModified('guests');
        try {
          await room.save();
          return res.status(200).json({
            msg: 'Success',
            msgs: room._doc.msgArray,
            users: room._doc.users,
            guests: room._doc.guests
          });
        } catch (err) {
          console.log('Error Adding user');
          return res.status(400).json({ err: 'Error adding user.' });
        }
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
  } catch (error) {
    return res.status(400).json({ err: 'Error. Try again.' });
  }
});

router.post('/getActive', auth, async (req, res) => {
  const { roomName } = req.body;
  try {
    const room = rooms.findOne({ roomName: roomName });
    if (!room) return res.status(400).json({ err: 'Error. Incorrect roomname.' });
    return res.status(200).json({ msg: 'Success', active: room._doc.online || [] });
  } catch {
    return res.status(400).json({ err: 'Error. Try again.' });
  }
});

router.post('/getmsgs', auth, async (req, res) => {
  const { roomName } = req.body;
  let lastMsgId = req.body.lastMsgId || 0; // requesting for id 0, should send msg with id 0
  lastMsgId = parseInt(lastMsgId);

  try {
    const room = rooms.findOne({ roomName: roomName });
    if (!room) return res.status(400).json({ err: 'Error. Incorrect roomname.' });

    let msgArray = room._doc.msgArray;
    if (!msgArray) {
      msgArray = [];
      return res.status(200).json({ msg: 'Success', msgs: msgArray });
    }
    if (lastMsgId === -1) {
      return res.status(200).json({ msg: 'Success', msgs: msgArray });
    }
    return res.status(200).json({ msg: 'Success', msgs: room._doc.msgArray });
  } catch {
    return res.status(400).json({ err: 'Error. Try again.' });
  }
});

router.post('/exitstream', auth, async (req, res) => {
  const { roomName } = req.body;
  const { id: username } = req.user;
  const idToBeDestroyed = [];

  try {
    const room = await rooms.findOne({ roomName });
    if (!room) {
      return res.status(400).json({ err: 'Error. Incorrect roomname.' });
    }
    const onlineArray = room._doc.online || [];
    if (onlineArray.length === 0) {
      return res.status(200).json({
        msg: 'Already exited',
        online: onlineArray,
        idToBeDestroyed
      });
    }
    const indicesToBeDeleted = []; // TODO: A peer can be present only 2 times- for audio, video
    //so this can be optimized to stop if we get two elements.

    onlineArray.forEach((val, index) => {
      if (val.username === username) {
        //indexToBeDeleted = index;
        indicesToBeDeleted.unshift(index);
        idToBeDestroyed.unshift(val.tkn);
      }
    });
    if (indicesToBeDeleted.length === 0) {
      return res.status(200).json({
        msg: 'Already exited',
        online: onlineArray,
        idToBeDestroyed
      });
    } else {
      indicesToBeDeleted.forEach((val) => {
        onlineArray.splice(val, 1);
      });
      room._doc.online = onlineArray;
      room.markModified('online');
      await room.save();
      io.emit('userExit', req.body);
      return res.status(200).json({
        msg: 'Room Exited successfully',
        online: onlineArray,
        idToBeDestroyed: idToBeDestroyed
      });
    }
  } catch {
    return res.status(400).json({ err: 'Error. Try again.' });
  }
});

router.post('/goonline', auth, async (req, res) => {
  const { tkn, roomName, type } = req.body;
  const { id: username } = req.user;

  try {
    const room = await rooms.findOne({ roomName });
    if (!room) return res.status(400).json({ err: 'Error. Incorrect roomname.' });

    const onlineArray = room.online;
    const onlinePersonObj = {
      username,
      tkn,
      type
    };

    //First person online
    if (room.online === undefined) {
      // Update online array and return;
      try {
        await rooms.updateOne(
          { roomName },
          { $addToSet: { online: onlinePersonObj } }
        );
        io.emit('userOnline', req.body);
        return res
          .status(200)
          .json({ msg: 'Waiting for others', connected: 1, type });
      } catch (err) {
        return res.status(400).json({ err: err });
      }
    } else {
      let indexOfCurrentUser = -1;
      onlineArray.forEach((val, index) => {
        if (val.username === username && val.type === type) {
          indexOfCurrentUser = index;
        }
      });
      if (indexOfCurrentUser !== -1) {
        //Return the current entry in array.
        onlineArray[indexOfCurrentUser].tkn = tkn;
        room._doc.online = onlineArray;
        room.markModified('online');
        await room.save();
        io.emit('userOnline', req.body);
        return res.status(200).json({
          msg: 'Waiting for others',
          connected: onlineArray.length,
          online: onlineArray,
          changePeer: false,
          peerId: onlineArray[indexOfCurrentUser].tkn,
          type: type
        });
      } else {
        try {
          await rooms.updateOne(
            { roomName: roomName },
            { $addToSet: { online: onlinePersonObj } }
          );
          io.emit('userOnline', req.body);
          return res.status(200).json({
            msg: 'Waiting for others',
            connected: onlineArray.length + 1,
            online: onlineArray,
            type: type
          });
        } catch (err) {
          return res.status(400).json({ err: err });
        }
      }
    }
  } catch {
    return res.status(400).json({ err: 'Error. Try again.' });
  }
});

router.post('/goonlinesimple', auth, async (req, res) => {
  const { id: username, roomName, type } = req.body;

  try {
    const room = await rooms.findOne({ roomName });
    if (!room) {
      console.log('error 2');
      return res.status(400).json({ err: 'Error. Incorrect roomname.' });
    }
    let onlineArray = room.onlineSimple;
    let onlinePersonObj = { id: username, username, type };

    //First person online
    if (!room._doc.onlineSimple) {
      try {
        await rooms.updateOne(
          { roomName: roomName },
          {
            $addToSet: { onlineSimple: onlinePersonObj },
            $set: {
              lastreq: new Date()
            }
          }
        );
        io.emit('userOnline', req.body);
        return res.status(200).json({
          msg: 'Waiting for others',
          connected: 1,
          type: type,
          online: []
        });
      } catch (err) {
        return res.status(400).json({ err });
      }
      //Update online array and return;
    } else {
      let indexOfCurrentUser = -1;
      onlineArray.forEach((val, index) => {
        if (val.username === username && val.type === type) {
          indexOfCurrentUser = index;
        }
      });
      if (indexOfCurrentUser !== -1) {
        //Return the current entry in array.
        onlineArray[indexOfCurrentUser].id = id;
        room._doc.onlineSimple = onlineArray;
        room.markModified('onlineSimple');
        await room.save();
        io.emit('userOnline', req.body);
        return res.status(200).json({
          msg: 'Waiting for others',
          connected: onlineArray.length,
          online: onlineArray,
          changePeer: false,
          type: type
        });
      } else {
        try {
          await rooms.updateOne(
            { roomName: roomName },
            {
              $addToSet: {
                onlineSimple: onlinePersonObj
              },
              $set: {
                lastreq: new Date()
              }
            }
          );

          io.emit('userOnline', req.body);
          return res.status(200).json({
            msg: 'Waiting for others',
            connected: onlineArray.length + 1,
            online: onlineArray,
            type: type
          });
        } catch (err) {
          return res.status(400).json({ err });
        }
      }
    }
  } catch (error) {
    return res.status(400).json({ err: 'Error. Try again.' });
  }
});

router.post('/exitstreamsimple', auth, async (req, res) => {
  const { roomName } = req.body;
  const { id: username } = req.user;
  const idToBeDestroyed = [];
  try {
    const room = await rooms.findOne({ roomName });
    if (!room) return res.status(400).json({ err: 'Error. Incorrect roomname.' });
    const onlineArray = room._doc.onlineSimple || [];
    if (onlineArray.length === 0) {
      return res.status(200).json({
        msg: 'Already exited',
        online: onlineArray,
        idToBeDestroyed: idToBeDestroyed
      });
    }
    const indicesToBeDeleted = []; // TODO: A peer can be present only 2 times- for audio, video
    //so this can be optimized to stop if we get two elements.
    onlineArray.forEach((val, index) => {
      if (val.username === username) {
        //indexToBeDeleted = index;
        indicesToBeDeleted.unshift(index);
        idToBeDestroyed.unshift(val.tkn);
      }
    });

    if (indicesToBeDeleted.length === 0) {
      return res.status(200).json({
        msg: 'Already exited',
        online: onlineArray,
        idToBeDestroyed: idToBeDestroyed
      });
    } else {
      indicesToBeDeleted.forEach((val) => {
        onlineArray.splice(val, 1);
      });

      room._doc.onlineSimple = onlineArray;
      room.markModified('onlineSimple');
      await room.save();
      io.emit('userExit', req.body);
      return res.status(200).json({
        msg: 'Room Exited successfully',
        online: onlineArray,
        idToBeDestroyed: idToBeDestroyed
      });
    }
  } catch (error) {
    return res.status(400).json({ err: 'Error. Try again.' });
  }
});

module.exports = router;
