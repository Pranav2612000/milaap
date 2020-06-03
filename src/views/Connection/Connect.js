import SimplePeer from 'simple-peer';
import socketIOClient from 'socket.io-client';
const socket = socketIOClient('http://localhost:5000');//will be replaced by an appropriate room.
socket.connect();
socket.on('connect', () => {
  console.log(socket.connected); // true
});
export class Peer {
  constructor() {
    this.peer = new SimplePeer({ initiator: true });
    this.peer.on( 'error', err => {
      console.log('errored');
    });
    this.peer.on('close', () => {
      console.log('closed');
    });
    console.log('in constructor');
    this.peer.on('signal', data => {
      console.log(data);
      socket.emit('signalling', data, (resp) => {
        console.log('reply rcvd');
        console.log(data);
      });
      console.log('received signal to be seint');
    });
    this.peer.on('data', data => {
      console.log('recvd data from remote peer');
    });
    this.peer.on('connect', data => {
      console.log('connected');
    });
    this.peer.on('stream', data => {
      console.log('stream received');
    });
    socket.on('signalling', (data) => {
      console.log(data);
    });
  }

  startCall() {
    console.log('starting call');
  }
}
