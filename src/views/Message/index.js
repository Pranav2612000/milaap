import React from 'react';
import moment from 'moment';
import './Message.css';

export default function Message(props) {
  function urlify(text) {
    const regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})|[a-zA-Z0-9]+\.[^\s]{2,}/gi;
    let currentIndex = 0;
    let match;
    const returnList = [];
    while ((match = regex.exec(text))) {
      returnList.push(text.substring(currentIndex, match.index));
      const url = text.substring(match.index, match.index + match[0].length);
      returnList.push(
        <a
          href={url.includes('http') ? url : `https://${url}`}
          target="_blank"
          style={{ color: '#000000' }}
          rel="noopener noreferrer">
          {url}
        </a>
      );
      currentIndex = match.index + match[0].length;
    }
    returnList.push(text.substring(currentIndex, text.length));
    return returnList;
  }
  const { data, isMine, startsSequence, endsSequence, showTimestamp } = props;
  const friendlyTimestamp = moment(data.timestamp).format('LLLL');
  const classes = [
    'message',
    `${isMine ? 'mine' : ''}`,
    `${startsSequence ? 'start' : ''}`,
    `${endsSequence ? 'end' : ''}`
  ].join(' ');
  return (
    <div className={classes}>
      {showTimestamp && <div className="timestamp bg-dark">{friendlyTimestamp}</div>}

      <div className="bubble-container">
        <div
          className={['bubble', `${isMine ? 'mine' : ''}`].join(' ')}
          title={friendlyTimestamp}>
          <b>{isMine && data.sender}</b>
          <b className={['sendBy', `${isMine}`].join(' ')}>
            {!isMine && data.sender}
          </b>
          <div>{urlify(data.msg)}</div>
        </div>
      </div>
    </div>
  );
}
