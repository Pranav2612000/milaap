import React, { useState } from 'react';
import './Compose.css';
import axios from 'axios';

export default function Compose(props) {
  const [msg, setMsg] = useState('');
  async function sendMessage() {
    if (msg === '') return;
    const reqData = {
      msg: msg,
      roomName: props.roomName
    };
    axios
      .post(`${global.config.backendURL}/api/room/sendmessage`, reqData, {
        headers: {
          'milaap-auth-token': localStorage.getItem('milaap-auth-token')
        }
      })
      .then((res) => {
        console.log(res);
        // window.location.reload();
        props.callback(res.data.msg);
        setMsg('');
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className="compose bg-dark">
      <textarea
        type="text"
        className="md-textarea form-control"
        placeholder="Type a message, @name"
        value={msg}
        onKeyDown={(e) => {
          if (e.keyCode === 13) sendMessage();
        }}
        onChange={(e) => {
          setMsg(e.target.value);
        }}
        style={styleSheet.inputStyles}
      />
      <button className="compose-button" onClick={sendMessage}>
        <span className="icon cui-chevron-right"></span>
      </button>

      {props.rightItems}
    </div>
  );
}

const styleSheet = {
  inputStyles: {
    borderRadius: '50px',
    backgroundColor: 'white',
    marginRight: '5px',
    borderWidth: '2.5px',
    borderColor: 'black'
  },
  composeStyles: {
    backgroundColor: 'transparent',
    border: 0,
    position: 'fixed',
    bottom: '5',
    margin: 0,
    padding: 0
  },
  buttonStyles: {
    backgroundColor: 'black'
  }
};
