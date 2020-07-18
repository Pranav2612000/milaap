import React, { useState } from 'react';
import './Compose.css';
import axios from 'axios';

export default function Compose(props) {
  const [msg, setMsg] = useState('');
  async function sendMessage() {
    // var text = document.getElementById('textMsg').innerHTML;
    // if (text.replace('/\n/g', '') === '') return;
    if (msg === '' || msg.replace(/(\r\n|\n|\r)/gm, '') === '') return;
    const reqData = {
      msg: urlify(msg),
      roomName: props.roomName
    };
    setMsg('');
    axios
      .post(`${global.config.backendURL}/api/room/sendmessage`, reqData, {
        headers: {
          'milaap-auth-token': localStorage.getItem('milaap-auth-token')
        }
      })
      .then((res) => {
        props.callback(res.data.msg);
        setMsg('');
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
      const k = '<a href="' + url + '" style="color: #000000">' + url + '</a>';
      return k;
    });
  }

  const addEmoji = (e) => {
    let emoji = e.native;
    setMsg(msg + emoji);
  };
  return (
    <>
      <div className="compose bg-dark" style={{ borderTop: 'white solid 1px' }}>
        <textarea
          type="text"
          id="textMsg"
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

        <button
          className="compose-button"
          onClick={sendMessage}
          style={{ scale: '1.3' }}>
          <i
            class="fa fa-paper-plane"
            aria-hidden="true"
            style={{ scale: '1.3' }}></i>
        </button>

        {props.rightItems}
      </div>
    </>
  );
}

const styleSheet = {
  inputStyles: {
    borderRadius: '50px',
    backgroundColor: 'white',
    marginRight: '5px',
    borderWidth: '2.5px',
    borderColor: 'black',
    color: 'black',
    fontSize: '1rem'
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
