import React, { useEffect, useState } from "react";
import Compose from "../Compose";
import Toolbar from "../Toolbar";
import ToolbarButton from "../ToolbarButton";
import Message from "../Message";
import moment from "moment";
import axios from "axios";
import socketIOClient from "socket.io-client";
import "./MessageList.css";

const socket = socketIOClient("http://localhost:5000/");


function formatMsgs(tempMsg) {
  let formattedMsgs = [];
  tempMsg.forEach((val, index) => {
    let formattedMsg = {};
    formattedMsg.id = val.id;
    formattedMsg.author = val.sender;
    formattedMsg.message = val.msg;
    formattedMsg.timestamp = new Date().getTime();
    formattedMsgs.push(formattedMsg);
  });
  return formattedMsgs;
}

export default function MessageList(props) {
  var [MY_USER_ID, setID] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastMsgId, setLastMsgId] = useState(0);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user/getUserName", {
        headers: { 'milaap-auth-token': localStorage.getItem('milaap-auth-token') }
      }).then(resp => {
        setID(resp.data.username);

      }).catch(err => {
        console.log(err, "Error in Verifying JWT")
      })

  }, [])


  let getReqData = function () {
    return {
      roomName: props.roomName,
      lastMsgId: lastMsgId,
    };
  };
  const fetchMessages = (reqData = getReqData()) => {
    //var reqData = getReqData();
    console.log("messages : ", messages);
    console.log("reqData : ", reqData);
    axios
      .post("http://localhost:5000/api/room/getmsgs", reqData, {
        headers: { 'milaap-auth-token': localStorage.getItem('milaap-auth-token') }
      })
      .then((res) => {
        console.log(res);
        let tempMsg = res.data.msgs;
        if (tempMsg == undefined) {
          tempMsg = [];
        }
        let tempMsgFormatted = formatMsgs(tempMsg);
        setMessages(tempMsgFormatted);
        //console.log(tempMsgFormatted[tempMsgFormatted.length - 1].id);
        setLastMsgId(
          tempMsgFormatted[tempMsgFormatted.length - 1] === undefined
            ? 0
            : tempMsgFormatted[tempMsgFormatted.length - 1].id
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    //getMessages();
    console.log(lastMsgId);
    if (props.roomName !== "dashboard") fetchMessages();
    socket.on("newMessage", (data) => {
      console.log(data);
      var reqData = getReqData();
      console.log("New Message Arrived");
      reqData.lastMsgId = 0;
      if (props.roomName !== "dashboard") fetchMessages(reqData);
    });
    //If you are on a limited DataPack, Comment this code segment and the one at
    //the end of useEffect function - (the one with return clearInterval...), to
    //prevent unnecessary multiple calls to the server
    /*
    const interval = setInterval(() => {
            let reqData = {
                    roomName: props.roomName,
                    lastMsgId: lastMsgId 
            };
            console.log(reqData);
            axios.post('http://localhost:5000/api/room/getmsgs', reqData)
                  .then(res => {
                          console.log(res);
                          let tempMsg = res.data.msgs;
                          if(tempMsg == undefined) {
                                  tempMsg = [];
                          }
                          let tempMsgFormatted = formatMsgs(tempMsg);
                          console.log(tempMsgFormatted[tempMsgFormatted.length - 1].id);
                          setLastMsgId(tempMsgFormatted[tempMsgFormatted.length - 1].id);
                          let newMsgs = messages.concat(tempMsgFormatted);
                          setMessages(newMsgs);
                  }) .catch(err => {
                          console.log(err);
            });
    }, 10000);
    */

    //Yes this line.
    //return () => clearInterval(interval);
  }, [props.roomName]);
  const renderMessages = () => {
    let i = 0;
    let messageCount = messages.length;
    let tempMessages = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author === MY_USER_ID;
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(
          currentMoment.diff(previousMoment)
        );
        prevBySameAuthor = previous.author === current.author;

        if (prevBySameAuthor && previousDuration.as("hours") < 1) {
          startsSequence = false;
        }

        if (previousDuration.as("hours") < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as("hours") < 1) {
          endsSequence = false;
        }
      }

      tempMessages.push(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />
      );

      // Proceed to the next message.
      i += 1;
    }

    return tempMessages;
  };
  const updateMsg = (msgObject) => {
    let newMsgs = [msgObject];
    let newFormattedMsg = formatMsgs(newMsgs);
    newMsgs = messages.concat(newFormattedMsg);
    setMessages(newMsgs);
    return;
  };

  return (
    <div className="message-list">
      <Toolbar
        title={props.roomName}
        /*
        rightItems={[
          <ToolbarButton key="info" icon="ion-ios-information-circle-outline" />,
          <ToolbarButton key="video" icon="ion-ios-videocam" />,
          <ToolbarButton key="phone" icon="ion-ios-call" />
        ]}
               */
      />

      <div className="message-list-container">{renderMessages()}</div>

      <Compose
        rightItems={[
          <ToolbarButton key="photo" icon="ion-ios-camera" />,
          <ToolbarButton key="image" icon="ion-ios-image" />,
          <ToolbarButton key="audio" icon="ion-ios-mic" />,
          <ToolbarButton key="money" icon="ion-ios-card" />,
          <ToolbarButton key="games" icon="ion-logo-game-controller-b" />,
          <ToolbarButton key="emoji" icon="ion-ios-happy" />,
        ]}
        roomName={props.roomName}
        callback={updateMsg}
      />
    </div>
  );
}
