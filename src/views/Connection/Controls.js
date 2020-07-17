import React, { Component } from 'react';
import { AwesomeButtonProgress } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import * as actions from '../../redux/userRedux/userAction';
import { connect } from 'react-redux';
import {
  toggleVideo,
  toggleAudio,
  startCall,
  endCall,
  addScreenShareStream,
  changeCameraFacing,
  stopScreenShare
} from '../Connection/Connect';
import { Container, Row } from 'reactstrap';
import $ from 'jquery';
import './Controls.css';

class Controls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myPeers: [],
      roomName: this.props.roomName,
      isMuted: false,
      isScreenShareOn: false,
      inCall: false,
      isWebcamOn: true,
      facing: 'user',
      addOptionsCalled: false
    };
    this.submitVideoHandler = this.submitVideoHandler.bind(this);
    this.submitScreenHandler = this.submitScreenHandler.bind(this);
    this.endCallHandler = this.endCallHandler.bind(this);
    this.inCallShareHandler = this.inCallShareHandler.bind(this);
    this.changeCamera = this.changeCamera.bind(this);
  }

  componentWillUnmount() {
    this.props.setAudioVideoToInitialState();
    endCall(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.roomName !== prevProps.roomName) {
      this.setState({
        roomName: this.props.roomName,
        inCall: false
      });
      endCall(this);
    }
  }

  changeCamera() {
    if (!this.state.inCall) return;
    const facing = this.state.facing === 'user' ? 'environment' : 'user';
    changeCameraFacing(this, facing);
    this.setState({
      facing: facing
    });
  }
  addOptions = () => {
    const contextOptions = document.getElementById('contextOptions');
    contextOptions.children[0].addEventListener('click', () => {
      this.changeCamera();
    });
    contextOptions.children[0].disabled =
      !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || !this.state.inCall;

    contextOptions.children[1].addEventListener('click', () => {
      this.props.toggleAudio();
      toggleAudio(this);
    });
    contextOptions.children[2].addEventListener('click', () => {
      this.setState({ isWebCamOn: !this.state.isWebCamOn });
      this.props.toggleVideo();
      toggleVideo(this);
    });
    contextOptions.children[3].addEventListener('click', () => {
      this.setState({ inCall: false });
      this.endCallHandler();
    });
  };
  submitVideoHandler() {
    startCall(this, this.state.roomName, 'video');
    if (!this.state.addOptionsCalled) {
      this.setState({
        addOptionsCalled: true
      });
      this.addOptions();
    }
  }

  submitScreenHandler() {
    startCall(this, this.state.roomName, 'screen');
  }
  inCallShareHandler() {
    addScreenShareStream(this);
  }

  endCallHandler() {
    this.props.setAudioVideoToInitialState();
    endCall(this);
  }

  render() {
    const self = this;
    return (
      <Container>
        <br />
        <Row className="justify-content-center text-center">
          <h4>Room: {`${this.props.roomName}`}</h4>
        </Row>
        <br />
        <Row className="justify-content-center text-center">
          <AwesomeButtonProgress
            type="primary"
            size="medium"
            disabled={self.state.inCall}
            action={(element, next) => {
              this.setState({ inCall: true });
              this.submitVideoHandler();
              next();
              //this.joinCall(next);
            }}>
            {/*<i className="icon-screen-desktop icons"></i>*/}
            <span> Join Call</span>
          </AwesomeButtonProgress>
        </Row>
        {/* <Row>
          <AwesomeButtonProgress
            type="primary"
            size="medium"
            disabled={!(self.state.inCall && !self.state.isMuted)}
            action={(element, next) => {
              this.setState({ isMuted: true });
              alert('muting');
              next();
              //this.muteCall();
            }}>
            <span>Mute</span>
          </AwesomeButtonProgress>
          <AwesomeButtonProgress
            type="primary"
            size="medium"
            disabled={!(self.state.isMuted && self.state.inCall)}
            action={(element, next) => {
              this.setState({ isMuted: false });
              alert('unmuting');
              next();
              //this.startScreenShare('screen', next);
            }}>
            <i className="icon-user icons"></i>
            <span>UnMute</span>
          </AwesomeButtonProgress>
          </Row>*/}
        {/* <Row className="justify-content-center text-center">
          <AwesomeButtonProgress
            type="primary"
            size="medium"
            disabled={!(self.state.inCall && !self.state.isWebcamOn)}
            action={(element, next) => {
              this.setState({ isWebcamOn: true });
              this.props.toggleVideo();
              toggleVideo(self);
              next();
            }}>
            <span>Webcam On</span>
          </AwesomeButtonProgress>
          <AwesomeButtonProgress
            type="primary"
            size="medium"
            disabled={!(self.state.isWebcamOn && self.state.inCall)}
            action={(element, next) => {
              this.setState({ isWebcamOn: false });
              this.props.toggleVideo();
              toggleVideo(self);
              next();
            }}>
            <i className="icon-user icons"></i>
            <span>Webcam Off</span>
          </AwesomeButtonProgress>
        </Row> */}
        <Row className="justify-content-center text-center">
          <AwesomeButtonProgress
            type="primary"
            size="medium"
            disabled={!(self.state.inCall && !self.state.isScreenShareOn)}
            action={(element, next) => {
              this.setState({ isScreenShareOn: true });
              this.inCallShareHandler();
              setTimeout(next, 2000);
            }}>
            <i className="icon-screen-desktop icons"></i>
            <span>Share Screen</span>
          </AwesomeButtonProgress>
        </Row>
        <Row className="justify-content-center text-center">
          <AwesomeButtonProgress
            type="primary"
            size="medium"
            disabled={!(self.state.inCall && self.state.isScreenShareOn)}
            action={(element, next) => {
              this.setState({ isScreenShareOn: false });
              stopScreenShare(self);
              setTimeout(next, 2000);
            }}>
            <i className="icon-screen-desktop icons"></i>
            <span>Stop Screen</span>
          </AwesomeButtonProgress>
        </Row>
        <Row className="justify-content-center text-center">
          <AwesomeButtonProgress
            type="primary"
            size="medium"
            // visible={!self.state.calls.length} //use this if we want it completely hidden until needed instead
            disabled={!self.state.inCall}
            action={(element, next) => {
              this.setState({ inCall: false });
              //this.endCall(next);
              this.endCallHandler();
              next();
            }}>
            <i className="icon-call-end icons"></i>
            <span> End Call</span>
          </AwesomeButtonProgress>
        </Row>
        {`${global.config.environment}` == 'development' && (
          <Row className="justify-content-center text-center">
            <AwesomeButtonProgress
              type="primary"
              size="medium"
              disabled={self.state.inCall}
              action={(element, next) => {
                this.submitScreenHandler();
                this.setState({ inCall: true });
                next();
              }}>
              <i className="icon-screen-desktop icons"></i>
              <span>Share Screen</span>
            </AwesomeButtonProgress>
          </Row>
        )}
        <br />
      </Container>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    video: state.userReducer.video,
    audio: state.userReducer.audio,
    username: state.loginReducer.username
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleVideo: () => dispatch(actions.toggleVideo()),
    toggleAudio: () => dispatch(actions.toggleAudio()),
    setAudioVideoToInitialState: () =>
      dispatch(actions.setAudioVideoToInitialState())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Controls);
