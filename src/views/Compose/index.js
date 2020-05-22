import React, { useState } from "react";
import "./Compose.css";
import axios from "axios";

export default function Compose(props) {
  const [msg, setMsg] = useState("");
  async function sendMessage() {
    if (msg === "") return;
    const reqData = {
      msg: msg,
      roomName: props.roomName,
    };
    axios
      .post("http://localhost:5000/api/room/sendmessage",
        reqData,
        {
          headers: { 'milaap-auth-token': localStorage.getItem('milaap-auth-token') }
        }
      )
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
        onKeyDown={e => {
          if (e.keyCode === 13)
            sendMessage();
        }}
        onChange={(e) => {
          setMsg(e.target.value)
        }}
      />
      <button className="compose-button primary" onClick={sendMessage}>
        Send
      </button>

      {props.rightItems}
    </div>
  );
}
