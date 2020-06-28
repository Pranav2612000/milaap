import React, { Component } from 'react';
import './Room.css';
import { store } from 'react-notifications-component';
import { connect } from 'react-redux';
import { Container, Row } from 'reactstrap';
import * as action from '../../redux/roomRedux/roomAction';
import * as userAction from '../../redux/userRedux/userAction';
import DefaultAside from '../../containers/DefaultLayout/DefaultAside';
import {
  getMyMediaStream,
  startCall,
  endCall,
  addScreenShareStream,
  toggleVideo
} from '../Connection/Connect';
import video_slash from '../../assets/video_slash.png';
import video from '../../assets/video.webp';
import endcall from '../../assets/endcall.png';
import flip from '../../assets/flip.png';
import mic from '../../assets/mic.png';
class Room extends Component {
  constructor(props) {
    super(props);
    const roomName = props.match.params.roomname;
    console.log(roomName);
    this.state = {
      roomName: roomName
    };
    this.props.enterRoom(roomName);
    //this.startCall = this.startCall.bind(this);
    //this.endCall = this.endCall.bind(this);
    //this.getMyMediaStream = this.getMyMediaStream.bind(this);
    //this.createVideoElement = this.createVideoElement.bind(this);
  }

  /*
  startCall() {
    getMyMediaStream(this, 'video').then((media) => {
      console.log('here');
      var peer = new Peer(true, this.state.myMediaStreamObj, this.state.roomName);
      this.setState({ peer: peer });
      return;
    });
  }
  */
  /*
  endCall() {
    console.log(this.state);
    this.state.myMediaStreamObj.getTracks().forEach((track) => track.stop());
    this.state.peer.peer.destroy();
  }
  */

  componentDidMount() {
    if (window.innerWidth > 985)
      document.getElementsByTagName('body')[0].classList.add('aside-menu-show');
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.roomname !== prevProps.match.params.roomname) {
      this.setState(
        {
          roomName: this.props.match.params.roomname
        },
        () =>
          store.addNotification({
            title: 'Room change',
            message: 'Entered room ' + this.state.roomName,
            type: 'info',
            container: 'top-right',
            animationIn: ['animated', 'fadeIn'],
            animationOut: ['animated', 'fadeOut'],
            dismiss: {
              duration: 3000,
              pauseOnHover: true
            }
          })
      );
      this.props.enterRoom(this.props.match.params.roomname);
    }
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;

  render() {
    return (
      <div class="app-body" id="inner-aside-container">
        <main class="main">
          <h4 className="text-center" style={{ color: 'white', opacity: '0.5' }}>
            Welcome to room: {this.props.match.params.roomname}
          </h4>
          <Container className="room">
            <Row className="d-flex justify-content-center align-items-center m-0 p-0">
              <div
                id="contextOptions"
                style={{
                  display: 'block',
                  padding: '5px',
                  backgroundColor: '#555',
                  marginTop: '10px',
                  borderRadius: '50px',
                  borderWidth: '1px',
                  borderColor: 'transparent'
                }}>
                <button
                  id="end"
                  style={{
                    backgroundColor: 'white',
                    margin: '15px',
                    borderWidth: '1px',
                    borderColor: 'transparent',
                    borderRadius: '50px',
                    padding: '10px'
                  }}>
                  <img src={flip} style={{ height: '2.5em', width: '2.5em' }} />
                </button>
                <button
                  id="end"
                  style={{
                    backgroundColor: this.props.audio ? 'green' : 'red',
                    margin: '15px',
                    borderWidth: '1px',
                    borderColor: 'transparent',
                    borderRadius: '50px',
                    padding: '15px'
                  }}>
                  {/* <img src={mic} style={{ height: '2.5em', width: '2em' }} /> */}
                  {this.props.audio ? (
                    <icon
                      className=" icon-volume-off"
                      style={{ fontSize: '1.4em' }}
                    />
                  ) : (
                    <icon className=" icon-volume-2" style={{ fontSize: '1.4em' }} />
                  )}
                </button>
                <button
                  id="webCam"
                  style={{
                    backgroundColor: this.props.webCam ? 'green' : 'red',
                    margin: '14px',
                    borderWidth: '1px',
                    borderColor: 'transparent',
                    borderRadius: '50px',
                    padding: '10px'
                  }}>
                  {this.props.webCam ? (
                    <img
                      src={video_slash}
                      style={{ height: '2.5em', width: '2.5em' }}
                    />
                  ) : (
                    <img src={video} style={{ height: '2.5em', width: '2.5em' }} />
                  )}
                </button>
                <button
                  id="end"
                  style={{
                    backgroundColor: 'red',
                    margin: '15px',
                    borderWidth: '1px',
                    borderColor: 'transparent',
                    borderRadius: '50px',
                    padding: '10px'
                  }}>
                  <img src={endcall} style={{ height: '2.5em', width: '2.5em' }} />
                </button>
              </div>
            </Row>
            <video id="context" controls autoPlay></video>
            <Row className="m-0 p-0" id="videos"></Row>
            {/*
            <button onClick={this.submitVideoHandler}>Start Call </button>
            <button onClick={this.submitScreenHandler}>Screen Call </button>
            <button onClick={this.endCallHandler}>End Call </button>
            <button onClick={this.inCallShareHandler}>CallScreenShare </button>
            */}
          </Container>
        </main>
        <aside className="aside-menu bg-dark" display="xs">
          <DefaultAside
            roomName={this.props.roomName}
            msgs={this.props.msgs}
            users={this.props.users}
            guests={this.props.guests}
            loading={this.props.loading}
          />
        </aside>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    roomName: state.roomReducer.currentRoom,
    guests: state.roomReducer.guests,
    users: state.roomReducer.users,
    msgs: state.roomReducer.msgs,
    loading: state.roomReducer.loading,
    webCam: state.userReducer.video,
    audio: state.userReducer.audio
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    enterRoom: (room) => dispatch(action.enterRoom(room))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
