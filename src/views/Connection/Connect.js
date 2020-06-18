import SimplePeer from 'simple-peer';
export class Peer {
  constructor() {
    this.peer = new SimplePeer({ initiator: true });
    this.peer.on('error', (err) => {
      console.log('errored');
    });
    this.peer.on('close', () => {
      console.log('closed');
    });
    console.log('in constructor');
    this.peer.on('signal', (data) => {
      console.log(data);
      console.log('received signal to be seint');
    });
    this.peer.on('data', (data) => {
      console.log('recvd data from remote peer');
    });
    this.peer.on('connect', (data) => {
      console.log('connected');
    });
    this.peer.on('stream', (data) => {
      console.log('stream received');
    });
  }

  startCall() {
    console.log('starting call');
  }
}
