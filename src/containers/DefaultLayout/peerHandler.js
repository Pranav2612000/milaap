import React from "react";
import {Button, Input, Row, Col} from 'reactstrap';
import Peer from "peerjs";

class PeerHandler extends React.Component {
  constructor() {
    super();
    this.state = {
      selfPeer: new Peer(),
      remotePeer: null,
      inText: null,
    };
    this.videoRef = React.createRef();
  }

  componentWillMount = () => {
    const self = this;
    this.state.selfPeer.on("open", function (id) {
      self.setState({
        myID: id,
      });
    });
    this.state.selfPeer.on("connection", function (conn) {
      self.setState({ remotePeer: conn });
    });
    this.state.selfPeer.on("error", function (err) {
      console.log("The following error occured: ", err);
    });
    this.state.selfPeer.on("call", function (call) {
      self.setState(
        {
          call: call,
        },
        () => {
          call.answer();
          call.on("stream", function (stream) {
            self.videoRef.current.srcObject = stream;
          });
        }
      );
    });
  };

  shareScreen = () => {
    const self = this;
    navigator.mediaDevices
      .getDisplayMedia({
        video: { width: 1024, height: 576 },
        audio: true,
      })
      .then((media) => {
        self.setState(
          {
            call: self.state.selfPeer.call(self.state.remotePeer.peer, media),
          },
          () => {
            this.state.call.on("stream", function (stream) {
              self.videoRef.current.srcObject = stream;
            });
          }
        );
      });
  };

  connectToPeer = () => {
    const self = this;
    this.setState(
      {
        remotePeer: this.state.selfPeer.connect(this.state.inText),
      }
    );
  };

  inputHandler = (e) => {
    this.setState({
      inText: e.target.value,
    });
  };

  render() {
    const self = this;
    return (
      <div>
        <h3>{this.state.myID}</h3>
        {this.state.remotePeer ? (
          <div className="mt-4 text-center">
            <Button className="m-4" color="success" onClick={this.shareScreen}>Share screen</Button>
            <Button className="m-4" color="info" onClick={this.videoCall}>Share video</Button>
          </div>
        ) : (
          <Row className="mt-4 text-center">
          <Col xs={10}><Input onChange={this.inputHandler} /></Col>
          <Col xs={2}><Button color="secondary" onClick={this.connectToPeer}>Connect</Button></Col>
          </Row>
        )}
        <br />
        <video ref={this.videoRef} autoPlay></video>
      </div>
    );
  }
}

export default PeerHandler;
