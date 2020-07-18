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

      <div className="bubble-container">
        <b className={['sendBy', `${isMine}`].join(' ')}>{!isMine && data.sender}</b>
        <div
          className={['bubble', `${isMine ? 'mine' : ''}`].join(' ')}
          title={friendlyTimestamp}>
          {/* {data.msg} */}
          <div dangerouslySetInnerHTML={{ __html: data.msg }} />
        </div>
        <b>{isMine && data.sender}</b>
      </div>
    </div>
  );
}
