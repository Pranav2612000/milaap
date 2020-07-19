import React, { Component } from 'react';
import Compose from '../Compose';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import Message from '../Message';
import moment from 'moment';
import socketIOClient from 'socket.io-client';
import { connect } from 'react-redux';
import './MessageList.css';
import { store } from 'react-notifications-component';
import * as action from '../../redux/messageRedux/messageAction';
import ring from '../../assets/sounds/ring.mp3';
const socket = socketIOClient(`${global.config.backendURL}/`);

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MY_USER_ID: this.props.username,
      messages: this.props.msgs,
      change: false,
      lastMsgId: 0
    };
  }

  componentDidMount() {
    this.setState({
      messages: this.props.msgs
    });
    socket.on('newMessage', (data) => {
      if (
        this.props.roomName !== 'dashboard' &&
        this.props.roomName === data['room'] &&
        this.state.messages !== undefined &&
        this.state.MY_USER_ID !== data['sender']
      )
        this.fetchMessages(true, data);
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.roomName !== this.props.roomName) {
      this.setState({
        messages: this.props.msgs
      });
    }

    const div = document.querySelector('#message-list');
    div.scrollIntoView(false);
    // window.scrollTo(0, document.querySelector('.message-list').scrollHeight);
  }

  formatMsgs(tempMsg, update = false) {
    let formattedMsgs = this.state.messages;
    if (update) formattedMsgs = [];
    tempMsg.forEach((val, index) => {
      let formattedMsg = {};
      formattedMsg.id = val.id;
      formattedMsg.sender = val.sender;
      formattedMsg.msg = val.msg;
      formattedMsg.timestamp = new Date().getTime();
      formattedMsgs.push(formattedMsg);
    });
    return formattedMsgs;
  }

  getReqData = () => {
    // console.clear()
    let messages = this.state.messages;
    return {
      roomName: this.props.roomName,
      lastMsgId:
        messages && messages.length > 0 ? messages[messages.length - 1].id + 1 : -1
    };
  };

  fetchMessages = (change = false, data) => {
    let messages = this.state.messages;
    delete data['room'];
    if (messages && data) {
      const msg = messages;
      msg.push(data);
      this.setState(
        {
          messages: msg
        },
        () => {
          const current = msg[msg.length - 1];
          const isMine = current.sender === this.state.MY_USER_ID;
          if (!isMine) {
            const sound = document.getElementsByClassName('audio-element')[0];
            if (sound.duration > 0 && !sound.paused) {
              sound.pause();
              sound.currentTime = 0;
            }
            sound.play();
            if (this.props.tab !== '2')
              this.props.increaseMessageCount(this.props.roomName);
            store.addNotification({
              title: 'New Message from ' + current.sender,
              message: current.msg,
              type: 'info',
              container: 'top-right',
              animationIn: ['animated', 'fadeIn'],
              animationOut: ['animated', 'fadeOut'],
              dismiss: {
                duration: 3000,
                pauseOnHover: true
              }
            });
          }
        }
      );
    }
    return;
  };

  renderMessages = () => {
    let messages = this.state.messages;
    if (!messages) return;
    let i = 0;
    const messageCount = messages.length;
    const tempMessages = [];
    while (i < messageCount) {
      const previous = messages[i - 1];
      const current = messages[i];
      const next = messages[i + 1];
      const isMine = current.sender === this.state.MY_USER_ID;
      const currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        const previousMoment = moment(previous.timestamp);
        const previousDuration = moment.duration(currentMoment.diff(previousMoment));
        prevBySameAuthor = previous.author === current.author;

        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false;
        }

        if (previousDuration.as('hours') < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        const nextMoment = moment(next.timestamp);
        const nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false;
        }
      }
      if (messageCount === 1) endsSequence = false;
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

  updateMsg = (msgObject) => {
    let newMsgs = [msgObject];
    let newFormattedMsg = this.formatMsgs(newMsgs, true);
    newMsgs = this.state.messages
      ? this.state.messages.concat(newFormattedMsg)
      : newFormattedMsg;
    this.setState({
      messages: newMsgs
    });
  };

  render() {
    return (
      <div
        className="message-list bg-dark"
        style={{ paddingTop: '0px !important', marginTop: '0px !important' }}>
        <audio className="audio-element" style={{ display: 'none' }}>
          <source src={ring}></source>
        </audio>
        <Toolbar
          title={this.props.roomName}
          /*
      rightItems={[
        <ToolbarButton key="info" icon="ion-ios-information-circle-outline" />,
        <ToolbarButton key="video" icon="ion-ios-videocam" />,
        <ToolbarButton key="phone" icon="ion-ios-call" />
      ]}
             */
        />

        <div className="message-list-container bg-dark" id="message-list">
          {this.renderMessages()}
        </div>

        <Compose
          rightItems={[
            <ToolbarButton key="photo" icon="ion-ios-camera" />,
            <ToolbarButton key="image" icon="ion-ios-image" />,
            <ToolbarButton key="audio" icon="ion-ios-mic" />,
            <ToolbarButton key="money" icon="ion-ios-card" />,
            <ToolbarButton key="games" icon="ion-logo-game-controller-b" />,
            <ToolbarButton key="emoji" icon="ion-ios-happy" />
          ]}
          roomName={this.props.roomName}
          callback={this.updateMsg}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  username: state.loginReducer.username,
  count: state.messageReducer.count
});
const mapDispatchToProps = (dispatch) => ({
  increaseMessageCount: (roomName) => dispatch(action.increaseMessageCount(roomName))
});
export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
