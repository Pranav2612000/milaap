import React from 'react';
import moment from 'moment';
import './Message.css';

export default function Message(props) {
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

      <div className="bubble-container bg-dark">
        <b>{!isMine && data.author && data.author[0].toUpperCase()}</b>
        <div className="bubble bg-dark" title={friendlyTimestamp}>
          {data.message}
        </div>
        <b>{isMine && data.author && data.author[0].toUpperCase()}</b>
      </div>
    </div>
  );
}
