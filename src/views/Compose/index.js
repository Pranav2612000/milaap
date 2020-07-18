import React, { useState } from 'react';
import './Compose.css';
import axios from 'axios';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import { Modal } from 'reactstrap';

export default function Compose(props) {
  const [msg, setMsg] = useState('');
  const [toggle, setToggle] = useState(false);
  const [type, setType] = useState('');

  async function sendMessage() {
    setToggle(!toggle);

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
      const k =
        '<a href="' +
        url +
        '" style="color: #000000" target="_blank">' +
        url +
        '</a>';
      return k;
    });
  }

  function stoggle() {
    // console.log(toggle);
    setToggle(!toggle);
    setType(type === '' ? '-relative' : '');
  }

  const addEmoji = (e) => {
    let emoji = e.native;
    setMsg(msg + emoji);
  };
  return (
    <>
      <div className={`compose bg-dark`} style={{ borderTop: 'white solid 1px' }}>
        <div className="d-flex row bg-dark">
          <div className="d-flex col">
            <button
              className="emoji-button"
              onClick={stoggle}
              style={{ scale: '1.3' }}>
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                class="bi bi-emoji-smile"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                />
                <path
                  fill-rule="evenodd"
                  d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683z"
                />
                <path d="M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
              </svg>
            </button>
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
          {toggle && (
            <div className="d-flex col justify-content-center emoji">
              <Picker
                onSelect={addEmoji}
                theme="dark"
                title=""
                emojiSize={24}></Picker>
            </div>
          )}
        </div>
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
