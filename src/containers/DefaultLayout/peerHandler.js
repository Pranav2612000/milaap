import React from "react";
import { Button, Input, Row, Col } from "reactstrap";
import Peer from "peerjs";

class PeerHandler extends React.Component {
  constructor() {
    super();
    this.state = {
      selfPeer: new Peer({
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            {
              url: "turn:numb.viagenie.ca",
              credential: "HWeF3pu@u2RfeYD",
              username: "veddandekar6@gmail.com",
            },
          ],
        } /* Sample servers, please use appropriate ones */,
      }),
      remotePeers: new Array(),
      remotePeersID: new Array(),
      calls: new Array(),
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
      self.peerDiscoveryHandler(conn);
    });

    this.state.selfPeer.on("error", function (err) {
      console.log("The following error occured: ", err);
    });
    this.state.selfPeer.on("call", function (call) {
      call.answer();
      call.on("error", (err) => console.log(err));
      call.on("stream", function (stream) {
        self.videoRef.current.srcObject = stream;
      });
      self.setState({
        calls: [...self.state.calls, call],
      });
    });
  };

  shareVideo = () => {
    const self = this;
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 1024, height: 576 },
        audio: true,
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
            }),
          },
          () => {
            self.state.calls.forEach((call) =>
              call.on("error", (err) => console.log(err))
            );
            self.state.calls.forEach((call) =>
              call.on("stream", function (stream) {
                self.videoRef.current.srcObject = stream;
              })
            );
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
        console.log(media);
        self.setState(
          {
            selfScreenStream: media,
            calls: self.state.remotePeers.map((peer) => {
              console.log(peer);
              return self.state.selfPeer.call(peer.peer, media);
            }),
            sharedTo: self.state.remotePeers.map((peer) => {
              return peer.peer;
            }),
          },
          () => {
            console.log(self.state.calls);
            self.state.calls.forEach((call) =>
              call.on("error", (err) => console.log(err))
            );
            self.state.calls.forEach((call) =>
              call.on("stream", function (stream) {
                self.videoRef.current.srcObject = stream;
              })
            );
          }
        );
      });
  };

  peerDiscoveryHandler = (conn) => {
    const self = this;
    conn.on("open", () => {
      conn.on("data", function (data) {
        console.log("Recevied in connect", data);
        let share =
          self.state.selfScreenStream || self.state.selfVideoStream
            ? true
            : false;
        let rcvdPeers = data.split(" ");
        rcvdPeers.forEach((peer) => {
          if (
            peer != "" &&
            !self.state.remotePeersID.includes(peer) &&
            peer != self.state.myID
          ) {
            console.log("PEERID:", peer);
            self.setState(
              {
                remotePeersID: [...self.state.remotePeersID, peer],
              },
              () => {
                console.log(self.state.remotePeersID);
                self.connectToPeer(peer);
              }
            );
            if (share)
              if (!(peer in self.sharedTo)) {
                self.setState({
                  calls: [
                    ...self.state.calls,
                    self.state.selfPeer.call(
                      peer,
                      self.state.selfScreenStream || self.state.selfVideoStream
                    ),
                  ], // Handle both later
                  sharedTo: [...self.sharedTo, peer],
                });
              }
          }
        });
      });
      if (self.state.remotePeers.length != 0) {
        let myPeers = "";
        self.state.remotePeers.forEach((peer) => {
          myPeers += `${peer.peer} `;
        });
        conn.send(myPeers);
      }
    });
    this.setState({
      remotePeers: [...self.state.remotePeers, conn],
      remotePeersID: [...self.state.remotePeersID, conn.peer],
    });
  };

  connectToPeer = (peerID) => {
    const self = this;
    let conn = this.state.selfPeer.connect(peerID);
    this.peerDiscoveryHandler(conn);
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
        {/* {this.state.remotePeer ? ( */}
        <div className="mt-4 text-center">
          <Button className="m-4" color="success" onClick={this.shareScreen}>
            Share screen
          </Button>
          <Button className="m-4" color="info" onClick={this.shareVideo}>
            Share video
          </Button>
        </div>
        {/* ) : ( */}
        <Row className="mt-4 text-center">
          <Col xs={10}>
            <Input onChange={this.inputHandler} />
          </Col>
          <Col xs={2}>
            <Button
              color="secondary"
              onClick={() => self.connectToPeer(self.state.inText)}
            >
              Connect
            </Button>
          </Col>
        </Row>
        {/* )} */}
        <br />
        <video ref={this.videoRef} autoPlay></video>
      </div>
    );
  }
}

export default PeerHandler;
