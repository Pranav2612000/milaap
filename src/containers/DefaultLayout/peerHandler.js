import React from 'react';
import { Button, Input, Row, Col, Jumbotron } from 'reactstrap';
import Peer from 'peerjs';
import { store } from 'react-notifications-component';

class PeerHandler extends React.Component {
  constructor() {
    super();
    this.state = {
      selfPeer: new Peer({
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            {
              url: 'turn:numb.viagenie.ca',
              credential: 'HWeF3pu@u2RfeYD',
              username: 'veddandekar6@gmail.com'
            }
          ]
        }
      }),
      remotePeers: new Array(),
      remotePeersID: new Array(),
      calls: new Array(),
      inText: null,
      context: null,
      remoteStreams: [],
      remoteStreamsRef: []
    };
  }

  componentDidUpdate = () => {
    const self = this;
    self.state.remoteStreamsRef.map((ref, i) => {
      ref.current.srcObject = self.state.remoteStreams[i];
    });
  };

  test = () => {
    console.log('test');
  };

  componentWillMount = () => {
    const self = this;
    this.state.selfPeer.on('open', function (id) {
      self.setState({
        myID: id
      });
    });

    this.state.selfPeer.on('connection', function (conn) {
      self.peerDiscoveryHandler(conn);
    });

    this.state.selfPeer.on('error', function (err) {
      console.log('The following error occured: ', err);
    });
    this.state.selfPeer.on('call', function (call) {
      call.answer();
      call.on('error', (err) => console.log(err));
      call.on('stream', function (stream) {
        const ref = React.createRef();
        self.setState({
          remoteStreams: [...self.state.remoteStreams, stream],
          remoteStreamsRef: [...self.state.remoteStreamsRef, ref]
        });
      });
      self.setState({
        calls: [...self.state.calls, call]
      });
    });
  };

  sharelink(id) {
    // alert(id);
    const link = document.querySelector('link[rel=canonical]')
      ? document.querySelector('link[rel=canonical]').href
      : document.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: 'Join via Link',
          url: link
        })
        .then(() => {
          console.log('Link Shared!');
        })
        .catch(console.error);
    } else {
      navigator.clipboard
        .writeText(link)
        .then(() => {
          store.addNotification({
            title: 'Link copied',
            message: 'Link copied to clipboard!',
            type: 'success',
            container: 'top-right',
            animationIn: ['animated', 'fadeIn'],
            animationOut: ['animated', 'fadeOut'],
            dismiss: {
              duration: 3000,
              pauseOnHover: true
            }
          });
        })
        .catch(console.log('Sorry try again'));
    }
  }

  switchContext = (e) => {
    const context = document.getElementById('context');
    context.srcObject = e.target.srcObject;
    context.play();
  };

  shareVideo = () => {
    const self = this;
    if (self.state.selfVideoStream) {
      const tracks = self.state.selfVideoStream.getTracks();
      tracks.forEach(function (track) {
        track.stop();
      });
      self.setState({
        selfVideoStream: null
      });
      return;
    }
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 1024, height: 576 },
        audio: true
      })
      .then((media) => {
        self.setState(
          {
            selfVideoStream: media,
            calls: self.state.remotePeers.map((peer) => {
              return self.state.selfPeer.call(peer.peer, media);
            }),
            sharedTo: self.state.remotePeers.map((peer) => {
              return peer.peer;
            })
          },
          () => {
            self.state.calls.forEach((call) =>
              call.on('error', (err) => console.log(err))
            );
            self.state.calls.forEach((call) =>
              call.on('stream', function (stream) {
                const ref = React.createRef();
                self.setState({
                  remoteStreams: [...self.state.remoteStreams, stream],
                  remoteStreamsRef: [...self.state.remoteStreamsRef, ref]
                });
              })
            );
          }
        );
      });
  };

  shareScreen = () => {
    const self = this;
    if (self.state.selfScreenStream) {
      const tracks = self.state.selfScreenStream.getTracks();
      tracks.forEach(function (track) {
        track.stop();
      });
      self.setState({
        selfScreenStream: null
      });
      return;
    }
    navigator.mediaDevices
      .getDisplayMedia({
        video: { width: 1024, height: 576 },
        audio: true
      })
      .then((media) => {
        self.setState(
          {
            selfScreenStream: media,
            calls: self.state.remotePeers.map((peer) => {
              return self.state.selfPeer.call(peer.peer, media);
            }),
            sharedTo: self.state.remotePeers.map((peer) => {
              return peer.peer;
            })
          },
          () => {
            self.state.calls.forEach((call) =>
              call.on('error', (err) => console.log(err))
            );
            self.state.calls.forEach((call) =>
              call.on('stream', function (stream) {
                const ref = React.createRef();
                self.setState({
                  remoteStreams: [...self.state.remoteStreams, stream],
                  remoteStreamsRef: [...self.state.remoteStreamsRef, ref]
                });
              })
            );
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  peerDiscoveryHandler = (conn) => {
    const self = this;
    conn.on('open', () => {
      conn.on('data', function (data) {
        const share = !!(self.state.selfScreenStream || self.state.selfVideoStream);
        const rcvdPeers = data.split(' ');
        rcvdPeers.forEach((peer) => {
          if (
            peer != '' &&
            !self.state.remotePeersID.includes(peer) &&
            peer != self.state.myID
          ) {
            self.setState(
              {
                remotePeersID: [...self.state.remotePeersID, peer]
              },
              () => {
                self.connectToPeer(peer);
              }
            );
          }
        });
      });
      conn.on('close', () => {
        console.log('Connection closed gracefully');
      });
      if (self.state.remotePeers.length != 0) {
        let myPeers = '';
        self.state.remotePeers.forEach((peer) => {
          myPeers += `${peer.peer} `;
        });
        conn.send(myPeers);
      }
      if (self.state.selfVideoStream || self.state.selfScreenStream) {
        if (!self.state.sharedTo.includes(conn.peer)) {
          self.setState({
            calls: [
              ...self.state.calls,
              self.state.selfPeer.call(
                conn.peer,
                self.state.selfScreenStream || self.state.selfVideoStream
              )
            ], // Handle both later
            sharedTo: [...self.state.sharedTo, conn.peer]
          });
        }
      }
    });
    this.setState({
      remotePeers: [...self.state.remotePeers, conn],
      remotePeersID: [...self.state.remotePeersID, conn.peer]
    });
  };

  connectToPeer = (peerID) => {
    const self = this;
    const conn = this.state.selfPeer.connect(peerID);
    this.peerDiscoveryHandler(conn);
  };

  inputHandler = (e) => {
    this.setState({
      inText: e.target.value
    });
  };

  render() {
    const self = this;
    return (
      <div>
        <h3>{this.state.myID}</h3>
        <Row className="my-4 justify-content-center">
          <Col xs={4}>
            <Input onChange={this.inputHandler} />
          </Col>
          <Col xs={2}>
            <Button
              color="secondary"
              onClick={() => self.connectToPeer(self.state.inText)}>
              Invite
            </Button>
          </Col>
        </Row>
        <div className="mt-4 text-center">
          <Button className="m-4" color="success" onClick={this.shareScreen}>
            {self.state.selfScreenStream ? 'Stop sharing screen' : 'Share screen'}
          </Button>
          <Button className="m-4" color="info" onClick={this.shareVideo}>
            {self.state.selfVideoStream ? 'Stop sharing video' : 'Share video'}
          </Button>

          <Button
            className="m-4"
            color="info"
            onClick={() => this.sharelink(self.state.myID)}>
            Share link
          </Button>
        </div>
        <br />
        <video id="context" autoPlay></video>
        <Jumbotron>
          <Row>
            {self.state.remoteStreamsRef.map((ref) => {
              return (
                <Col key={ref} xs={4} md={3} lg={4}>
                  <video
                    ref={ref}
                    onClick={self.switchContext}
                    width="350"
                    height="200"
                    autoPlay
                  />
                </Col>
              );
            })}
          </Row>
        </Jumbotron>
      </div>
    );
  }
}

export default PeerHandler;
