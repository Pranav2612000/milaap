const router = require("express").Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const config = require("config");
const rooms = require("../models/Rooms.model");
const userLogins = require("../models/UserLogin.model");
const users = require("../models/User.model");
const shortid = require("shortid");

router.post("/sendmessage", async (req, res) => {
  const sender = req.body.sender;
  const msg = req.body.msg;
  const roomName = req.body.roomName;
  rooms.findOne({ roomName: roomName }, function (err, room) {
    if (err) {
      return res.status(400).json({ err: "Error. Try again." });
    }
    if (!room) {
      return res.status(400).json({ err: "Error. Incorrect roomname." });
    }
    console.log({ ...room });
    let msgArray = room._doc.msgArray;
    let msgObject;
    if (msgArray == undefined) {
      msgArray = [];
      msgObject = {
        msg: msg,
        sender: sender,
        id: 0,
      };
    } else {
      msgObject = {
        msg: msg,
        sender: sender,
        id: msgArray[msgArray.length - 1].id + 1,
      };
    }
    //Use RabbitMQ for improvements.
    if (msgArray.length > 20) {
      //If number of messages is greater than 20, pop the oldest one.
      //We store only the latest 20 messages for now.

      //msgArray.shift();
      rooms.updateOne(
        { roomName: roomName },
        { $pop: { msgArray: -1 } },
        function (err, result) {
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
        return res.status(400).json({ err: "Error Updating Room" });
      } else {
        return res.status(200).json({ status: "Success", msg: msgObject });
      }
    });
  });
});

router.post("/enterroom", async (req, res) => {
  const roomName = req.body.roomName;
  /*
         * Reminder that generating peerId on server side is not a good idea.
                /* We may store previous ids in a room and use them again, but for now creating a
                 * new id every time a user enters a room. //
        */
  rooms.findOne({ roomName: roomName }, function (err, room) {
    if (err) {
      return res.status(400).json({ err: "Error. Try again." });
    }
    if (!room) {
      return res.status(400).json({ err: "Error. Incorrect roomname." });
    }
    return res.status(200).json({ msg: "Success", msgs: room._doc.msgArray });
  });
});

//, inCall: room._doc.online

router.post("/getActive", async (req, res) => {
  const roomName = req.body.roomName;
  rooms.findOne({ roomName: roomName }, function (err, room) {
    if (err) {
      return res.status(400).json({ err: "Error. Try again." });
    }
    if (!room) {
      return res.status(400).json({ err: "Error. Incorrect roomname." });
    }
    return res
      .status(200)
      .json({ msg: "Success", active: room._doc.online || [] });
  });
});

router.post("/getmsgs", async (req, res) => {
  const roomName = req.body.roomName;
  let lastMsgId = req.body.lastMsgId; // requesting for id 0, should send msg with id 0
  if (lastMsgId == undefined) {
    lastMsgId = 0;
  }
  lastMsgId = parseInt(lastMsgId);
  rooms.findOne({ roomName: roomName }, function (err, room) {
    if (err) {
      return res.status(400).json({ err: "Error. Try again." });
    }
    if (!room) {
      return res.status(400).json({ err: "Error. Incorrect roomname." });
    }
    let msgArray = room._doc.msgArray;
    if (msgArray == undefined) {
      msgArray = [];
      return res.status(200).json({ msg: "Success", msgs: msgArray });
    }
    let reqIndex = 0;
    let i;
    for (i = 0; i < msgArray.length; i++) {
      if (msgArray[i].id >= lastMsgId) {
        break;
      }
      reqIndex++;
    }
    let newMsgArray = msgArray.splice(reqIndex);
    //return res.status(200).json({msg: "Success", msgs: room._doc.msgArray});
    return res.status(200).json({ msg: "Success", msgs: newMsgArray });
  });
});

router.post("/exitstream", async (req, res) => {
  const roomName = req.body.roomName;
  const username = req.body.username;
  rooms.findOne({ roomName: roomName }, function (err, room) {
    if (err) {
      return res.status(400).json({ err: "Error. Try again." });
    }
    if (!room) {
      return res.status(400).json({ err: "Error. Incorrect roomname." });
    }
    let onlineArray = room._doc.online;
    if (onlineArray == undefined) {
      onlineArray = [];
      return res
        .status(200)
        .json({ msg: "Already exited", online: onlineArray });
    }
    var indexToBeDeleted = -1;
    onlineArray.forEach((val, index) => {
      if (val.username == username) {
        indexToBeDeleted = index;
      }
    });
    console.log(indexToBeDeleted);
    if (indexToBeDeleted == -1) {
      return res
        .status(200)
        .json({ msg: "Already exited", online: onlineArray });
    } else {
      onlineArray.splice(indexToBeDeleted, 1);
      console.log(onlineArray);
      room._doc.online = onlineArray;
      room.markModified("online");
      //console.log(room);
      room.save((err) => {
        if (err) {
          return res.status(400).json({ err: "Error Exiting Video" });
        } else {
          return res
            .status(200)
            .json({ msg: "Room Exited successfully", online: onlineArray });
        }
      });
    }
  });
});
router.post("/goonline", async (req, res) => {
  const tkn = req.body.tkn;
  const roomName = req.body.roomName;
  const username = req.body.username;
  const type = req.body.type;
  rooms.findOne({ roomName: roomName }, function (err, room) {
    if (err) {
      return res.status(400).json({ err: "Error. Try again." });
    }
    if (!room) {
      return res.status(400).json({ err: "Error. Incorrect roomname." });
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
            return res
              .status(200)
                          .json({ msg: "Waiting for others", connected: 1, type: type});
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
        return res.status(200).json({
          msg: "Waiting for others",
          connected: onlineArray.length,
          online: onlineArray,
          changePeer: true,
          peerId: onlineArray[indexOfCurrentUser].tkn,
          type: type
        });
      } else {
        rooms.updateOne(
          { roomName: roomName },
          { $addToSet: { online: onlinePersonObj } },
          function (err, result) {
            if (err) {
              return res.status(400).json({ err: err });
            } else {
              return res.status(200).json({
                msg: "Waiting for others",
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
module.exports = router;
