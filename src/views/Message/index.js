import React from 'react';
import moment from 'moment';
import './Message.css';
import parse from 'html-react-parser';

export default function Message(props) {
  function urlify(text) {
    const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    const urlRegex = new RegExp(expression);
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
  const { data, isMine, startsSequence, endsSequence, showTimestamp } = props;
  const friendlyTimestamp = moment(data.timestamp).format('LLLL');
  return (
    <div
      className={[
        'message',
        `${isMine ? 'mine' : ''}`,
        `${startsSequence ? 'start' : ''}`,
        `${endsSequence ? 'end' : ''}`
      ].join(' ')}>
      {showTimestamp && <div className="timestamp bg-dark">{friendlyTimestamp}</div>}

      <div className="bubble-container">
        <div
          className={['bubble', `${isMine ? 'mine' : ''}`].join(' ')}
          title={friendlyTimestamp}>
          <b>{isMine && data.sender}</b>
          <b className={['sendBy', `${isMine}`].join(' ')}>
            {!isMine && data.sender}
          </b>
          <div>{parse(urlify(data.msg))}</div>
        </div>
      </div>
    </div>
  );
}
