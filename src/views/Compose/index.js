import React, { useState } from "react";
import "./Compose.css";
import axios from "axios";

export default function Compose(props) {
  const [msg, setMsg] = useState("");
  async function sendMessage() {
    const reqData = {
      sender: localStorage.getItem("uname"),
      msg: msg,
      roomName: props.roomName,
    };
    axios
      .post("http://localhost:5000/api/room/sendmessage", reqData)
      .then((res) => {
        console.log(res);
        //window.location.reload();
        props.callback(res.data.msg);
        setMsg("");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className="compose">
      <input
        type="text"
        className="compose-input"
        placeholder="Type a message, @name"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <button className="compose-button primary" onClick={sendMessage}>
        Send
      </button>

      {props.rightItems}
    </div>
  );
}
