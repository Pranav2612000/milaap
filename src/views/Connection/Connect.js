import { Component } from 'react';
import SimplePeer from 'simple-peer';
import $ from 'jquery';
import socketIOClient, { connect } from 'socket.io-client';
import { store as NotifStore } from 'react-notifications-component';
import axios from 'axios';
import { store } from '../../redux/store';
import * as action from '../../redux/userRedux/userAction';
import setMediaBitrate from './VideoCodecs';

const videoQuality = [
  { width: 1280, height: 720 }, //720p
  { width: 640, height: 360 }, //360p
  { width: 426, height: 240 }, //240p
  { width: 320, height: 180 } //144p
];
var connectedPeers = [];
var myMediaStreamObj = new MediaStream();
var myScreenStreamObj = new MediaStream();
var socket = socketIOClient(`${global.config.backendURL}`, {
  autoConnect: false
});
store.subscribe(getVideoState);
store.subscribe(getAudioState);

function getVideoState() {
  let state = store.getState();
  return state.userReducer.video;
}

function getAudioState() {
  let state = store.getState();
  return state.userReducer.audio;
}

function extractSocketID(element_id) {
  var cut_index = element_id.lastIndexOf('-video');
  if (cut_index == -1) {
    return -1;
  }
  console.log(element_id.slice(0, cut_index));
  return element_id.slice(0, cut_index);
}

function upgradeLocalStreamVideoQuality(stream) {
  try {
    stream.getVideoTracks()[0].applyConstraints(videoQuality[0]);
    return stream;
  } catch (err) {
    console.log(err);
    return;
  }
}

function askToUpgradeStreamVideoQualityById(element_id) {
  var their_id = extractSocketID(element_id);
  if (their_id == -1 || their_id == 'me') {
    return;
  }
  /* search through connected peers to get the appropriate peer. */
  connectedPeers.forEach((val, index) => {
    if (val.their_id == their_id) {
      /* ask the peer for better quality. */
      val.peer.send('i want more');
      console.log('asking for more');
    }
  });
}

function upgradeStreamVideoQuality(Peer) {
  console.log(myMediaStreamObj.getVideoTracks());
  try {
    Peer.peer.replaceTrack(
      myMediaStreamObj.getVideoTracks()[0],
      upgradeLocalStreamVideoQuality(myMediaStreamObj).getVideoTracks()[0],
      myMediaStreamObj
    );
  } catch (err) {
    console.log(err);
  }
}

export function degradeLocalStreamVideoQuality(stream) {
  try {
    if (stream.getVideoTracks().length != 0) {
      stream.getVideoTracks()[0].applyConstraints(videoQuality[3]);
    }
    return stream;
  } catch (err) {
    console.log(err);
  }
}

function askToDegradeStreamVideoQualityById(element_id) {
  var their_id = extractSocketID(element_id);
  if (their_id == -1 || their_id == 'me') {
    return;
  }
  /* search through connected peers to get the appropriate peer. */
  connectedPeers.forEach((val, index) => {
    if (!val.peer.destroyed && val.their_id == their_id) {
      try {
        /* ask the peer for better quality. */
        val.peer.send('reduce quality');
        console.log('request for reducing video quality sent');
      } catch (err) {
        console.log(err);
        console.log('seems like peer has been deleted');
      }
    }
  });
}

function degradeStreamVideoQuality(Peer) {
  try {
    Peer.peer.replaceTrack(
      myMediaStreamObj.getVideoTracks()[0],
      degradeLocalStreamVideoQuality(myMediaStreamObj).getVideoTracks()[0],
      myMediaStreamObj
    );
  } catch (err) {
    console.log(err);
  }
}

function chooseVideoOrScreen(type) {
  var mediaStream;
  if (type == 'video') {
    console.log(myMediaStreamObj);
    mediaStream = degradeLocalStreamVideoQuality(myMediaStreamObj);
  } else if (type == 'screen') {
    mediaStream = myScreenStreamObj;
  } else {
    mediaStream = null;
  }
  console.log(mediaStream);
  return mediaStream;
}

function getSimplePeerConfObj(initiator, stream) {
  return {
    initiator: initiator,
    stream: stream,
    sdpTransform: (sdp) => {
      let newSDP = sdp;
      newSDP = setMediaBitrate(newSDP, 'video', 233);
      newSDP = setMediaBitrate(newSDP, 'audio', 80);
      return newSDP;
    },
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: 'turn:numb.viagenie.ca',
          credential: 'HWeF3pu@u2RfeYD',
          username: 'veddandekar6@gmail.com'
        }
      ]
    }
  };
}

function handleMemberJoined() {
  NotifStore.addNotification({
    title: 'Member entered call',
    message: 'New member joined the call!',
    type: 'success',
    container: 'top-right',
    animationIn: ['animated', 'fadeIn'],
    animationOut: ['animated', 'fadeOut'],
    dismiss: {
      duration: 3000,
      pauseOnHover: true
    }
  });
}

function clearMediaStream(stream) {
  if (!stream) {
    console.log('stream already cleared');
    return;
  }
  stream.getTracks().forEach((track) => {
    track.stop();
  });
  stream.getTracks().forEach((track) => {
    stream.removeTrack(track);
  });
}

export class Peer {
  constructor(stream, room, initiator, their_id, their_name, my_id, type) {
    /* Set default type to video. */
    if (type == null) {
      type = 'video';
    }
    /* save constructor variable */
    this.stream = stream;
    this.room = room;
    this.initiator = initiator;
    this.their_id = their_id;
    this.their_name = their_name;
    this.my_id = my_id;
    this.type = type;

    /* initialize connection variables. */
    this.error = null;
    this.connected = false;
    this.ended = false;
    this.num_retries = 0;

    /* create a new simplepeer object for communication. */
    this.peer = new SimplePeer(getSimplePeerConfObj(initiator, stream));

    /* add event listeners to handle simplepeer communication. */
    this.addEventListenersToPeer(this.peer);
  }

  addEventListenersToPeer(peer) {
    console.log('setting up peer');

    peer.on('error', (err) => {
      this.error = err;
    });

    peer.on('close', (_) => {
      this.close();
    });

    peer.on('signal', (data) => {
      var room = this.room;
      socket.emit('signalling', room, data, this.their_id, this.my_id, (resp) => {
        return;
      });
    });

    peer.on('connect', (data) => {
      this.connected = true;
      handleMemberJoined();
      if (this.initiator == false) {
        /* if I am already sharing screen,share with the newly joined peer. */
        if (myScreenStreamObj.getVideoTracks().length != 0) {
          console.log('sharing screen');
          this.peer.send('sharing screen');
          this.stream_to_be_sent = myScreenStreamObj;
        }
      }
    });

    /* called when stream received. */
    peer.on('stream', (data) => {
      const self = this;
      this.sharing = 0; // Allow others to share screen

      // If screen shared is of type screen, don't add handlers
      if (this.next_stream_type == 'screen') {
        createVideoElement(self, data, self.their_id + '-screen', self.their_name);
        return;
      }

      data.addEventListener('removetrack', (event) => {
        changeStatusOfVideoElement(
          self,
          'video_off',
          data,
          this.their_id + '-video',
          this.their_name
        );
      });

      createVideoElement(
        self,
        data,
        self.their_id + '-' + self.type,
        self.their_name
      );
    });

    /* called on receiving data. */
    peer.on('data', (data) => {
      if (data == 'screen- go ahead') {
        //Handshake complete share screen
        this.peer.addStream(this.stream_to_be_sent);
      }
      if (data == 'stop screen sharing') {
        // clear display of the stopped screen
        deleteVideoElement(this.their_id + '-screen');
      }

      if (data == 'i want more') {
        console.log('no one is ever happy');
        upgradeStreamVideoQuality(this);
      }
      if (data == 'reduce quality') {
        console.log('request for reducing video quality received');
        degradeStreamVideoQuality(this);
      }

      // Allow screen sharing only if currently no-one else wants to. */
      if (this.sharing == 0) {
        if (data == 'sharing screen') {
          this.sharing = 1;
          this.next_stream_type = 'screen';
          this.peer.send('screen- go ahead');
        }
      }
    });
  }

  async close() {
    /* Destroy the current peer and delete its video elements. */
    this.peer.destroy();
    deleteVideoElement(this.their_id + '-video');
    deleteVideoElement(this.their_id + '-screen');

    /* Handles corner cases of num_retries being null. */
    if (this.num_retries == null) {
      return;
    }

    const self = this;

    /* If the call has ended, do not try to reconnect. */
    if (this.ended) {
      this.connected = false;
    } else {
      /* Else try to reconnect. */

      console.log(this.num_retries);

      /* If you have tried reconnecting more than 3 times, do not try
       * again, the remote seems to be down. */
      if (this.num_retries > 3) {
        /* Stop the current streams (if)being streamed. */
        clearMediaStream(self.stream);
        return;
      }
      if (this.type == 'video') {
        /* Reduce quality of current stream. */
        if (!this.stream) {
          return;
        }
        if (this.stream.getVideoTracks().length != 0) {
          this.stream
            .getVideoTracks()[0]
            .applyConstraints(videoQuality[this.num_retries]);
        }

        self.num_retries = self.num_retries + 1;

        /* choose a random time to retry request. */
        var retrytime = Math.floor(Math.random() * 2000) + 1;

        /* create a new peer and add handlers to it. */
        self.peer = new SimplePeer(
          getSimplePeerConfObj(self.initiator, self.stream)
        );
        self.addEventListenersToPeer(self.peer);
      } else if (this.type == 'screen') {
        //this.stream.getVideoTracks()[0].applyConstraints(videoQuality[this.num_retries]);

        self.num_retries = self.num_retries + 1;

        /* choose a random time to retry request. */
        var retrytime = Math.floor(Math.random() * 2000) + 1;

        /* create a new peer and add handlers to it. */
        self.peer = new SimplePeer(
          getSimplePeerConfObj(self.initiator, self.stream)
        );
        self.addEventListenersToPeer(self.peer);
      }
    }
  }
}

export async function toggleVideo(self) {
  var webCam = getVideoState();
  var mic = getAudioState();

  if (!webCam) {
    if (myMediaStreamObj.getVideoTracks().length != 0) {
      connectedPeers.map((eachPeer) => {
        try {
          eachPeer.peer.removeTrack(
            myMediaStreamObj.getVideoTracks()[0],
            myMediaStreamObj
          );
        } catch (err) {
          console.log(err);
          //alert('could not share screen to this peer');
        }
      });

      //Remove locally
      myMediaStreamObj.getVideoTracks()[0].stop();
      myMediaStreamObj.removeTrack(myMediaStreamObj.getVideoTracks()[0]);

      // If both mic and webcam is off then loading stream in video will cause error
      // So pass setNewMediaSource as true to create empty Media source and assign it to video
      let setNewMediaSource = !mic && !webCam ? true : false;
      changeStatusOfVideoElement(
        self,
        'video_off',
        myMediaStreamObj,
        'me' + '-video',
        'ME',
        setNewMediaSource
      );
    }
  } else {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 320, height: 180 },
        audio: false
      })
      .then((stream) => {
        /* We are here means, we are staring video, after stopping it, so add video track to all peers and locally. */
        if (connectedPeers) {
          /* Add to all peers. */
          connectedPeers.map((eachPeer) => {
            try {
              eachPeer.peer.addTrack(stream.getVideoTracks()[0], myMediaStreamObj);
            } catch (err) {
              console.log(err);
              //alert('could not share screen to this peer');
            }
          });
        }
        /* Add locally. */
        myMediaStreamObj.addTrack(stream.getVideoTracks()[0]);
        changeStatusOfVideoElement(
          self,
          'video_on',
          myMediaStreamObj,
          'me' + '-video',
          'ME'
        );
      })
      .catch((err) => {
        NotifStore.addNotification({
          title: 'Permission denied',
          message: 'Browser refused to allow access!',
          type: 'danger',
          container: 'top-right',
          animationIn: ['animated', 'fadeIn'],
          animationOut: ['animated', 'fadeOut'],
          dismiss: {
            duration: 3000,
            pauseOnHover: true
          }
        });
      });
  }
}

export async function toggleAudio(self) {
  var mic = getAudioState();
  /* Remove the current audio track(if exists) locally & from all peers. */
  if (!mic) {
    if (connectedPeers) {
      /* Remove from all peers */
      connectedPeers.map((eachPeer) => {
        try {
          eachPeer.peer.removeTrack(
            myMediaStreamObj.getAudioTracks()[0],
            myMediaStreamObj
          );
        } catch (err) {
          console.log(err);
        }
      });
      /* Remove locally. */
      myMediaStreamObj.getAudioTracks()[0].stop();
      myMediaStreamObj.removeTrack(myMediaStreamObj.getAudioTracks()[0]);
    }
  } else {
    /* We are here means, we are staring audio, after stopping it, so add video track to all peers and locally. */
    navigator.mediaDevices
      .getUserMedia({
        video: false,
        //video: { width: 320, height: 180 },
        audio: mic ? { echoCancellation: true, noiseSuppression: true } : false
      })
      .then((stream) => {
        /* Add to all peers. */
        if (connectedPeers) {
          connectedPeers.map((eachPeer) => {
            try {
              eachPeer.peer.addTrack(stream.getAudioTracks()[0], myMediaStreamObj);
            } catch (err) {
              console.log(err);
              //alert('could not share screen to this peer');
            }
          });
        }
        /* Add locally. */
        myMediaStreamObj.addTrack(stream.getAudioTracks()[0]);

        /* Not sure whether changeStatusOfVideoElement() needs to be called here. */
      })
      .catch((err) => {
        NotifStore.addNotification({
          title: 'Permission denied',
          message: 'Browser refused to allow access!',
          type: 'danger',
          container: 'top-right',
          animationIn: ['animated', 'fadeIn'],
          animationOut: ['animated', 'fadeOut'],
          dismiss: {
            duration: 3000,
            pauseOnHover: true
          }
        });
      });
  }
}

/* Function to meet video of a particular user. */
function muteVideo(self, id) {
  const userStream = document.getElementById(id).srcObject;
  const deets = document.getElementById(id).nextElementSibling;
  if (userStream.getAudioTracks()[0].enabled) {
    userStream.getAudioTracks()[0].enabled = false;
    // userStream.getVideoTracks()[0].enabled = false;
    deets.children[1].classList.remove('icon-volume-2');
    deets.children[1].classList.add('icon-volume-off');
  } else {
    userStream.getAudioTracks()[0].enabled = true;
    // userStream.getVideoTracks()[0].enabled = true;
    deets.children[1].classList.add('icon-volume-2');
    deets.children[1].classList.remove('icon-volume-off');
  }
}

/* Function to create a video screen. */
export function createVideoElement(self, stream, friendtkn, username) {
  /* create elements required. */
  const wrapper = document.createElement('div');
  const video = document.createElement('video');
  const row = document.createElement('div');
  row.classList.add('row', 'video-details');
  const nameTag = document.createElement('div');
  const audioIcon = document.createElement('i');
  const context = document.getElementById('context');
  const contextOptions = document.getElementById('contextOptions');

  /* Add button to mute a user. */
  audioIcon.classList.add('icon-volume-2', 'audio-icon');
  audioIcon.addEventListener('click', () => muteVideo(self, friendtkn));
  if (friendtkn == 'me-video') audioIcon.style.display = 'none';

  /* Add nametag below screen. */
  nameTag.classList.add('name-label');
  nameTag.innerText = username || 'me';

  /* create video element to be added. */
  video.width = '200';
  video.id = friendtkn;
  video.height = '350';
  video.srcObject = stream;
  video.onclick = switchContext;
  video.playsinline = true;
  video.autoplay = true;
  if (video.id == 'me-video') {
    video.muted = 'true';
  }

  /* place elements together to form screen. */
  wrapper.appendChild(video);
  row.appendChild(nameTag);
  row.appendChild(audioIcon);
  wrapper.appendChild(row);
  document.getElementById('videos').appendChild(wrapper);
  contextOptions.style.display = 'inline-flex';

  /* add event handler to bring video to center. */
  if (!context.srcObject) switchContext(document.getElementById(friendtkn));
}

/* function to modify a previously created element. */
function changeStatusOfVideoElement(
  self,
  status,
  stream,
  friendtkn,
  username = null,
  setNewMediaSource = false
) {
  //let video = $('#' + friendtkn);
  if (status == 'video_off') {
    // this works for audio toggling too- name needs to be changed.
    const video = document.getElementById(friendtkn);
    if (!video) {
      return;
    }
    video.srcObject = stream;
    video.poster =
      'https://dummyimage.com/1024x576/2f353a/ffffff.jpg&text=' + username;
    var isPlaying =
      video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2;
    video.playsinline = true;
    video.autoplay = true;

    if (!isPlaying) {
      video.play();
    }
  } else if (status == 'video_on') {
    const video = document.getElementById(friendtkn);
    if (!video) {
      return;
    }
    video.srcObject = stream;
  }
}

/* bring chosen video to center context. */
export function switchContext(e) {
  if (e.target) e = e.target;
  try {
    const context = document.getElementById('context');
    if (e.srcObject == context.srcObject) return;
    const username = e.nextElementSibling.innerText;
    context.style.display = 'inline';
    askToDegradeStreamVideoQualityById(context.className);
    askToUpgradeStreamVideoQualityById(e.id);
    context.poster =
      'https://dummyimage.com/1024x576/2f353a/ffffff.jpg&text=' + username;
    context.srcObject = e.srcObject;
    if (e.id == 'me-video') {
      context.muted = 'true';
    }
    console.log(e.srcObject.getAudioTracks(), e.srcObject.getVideoTracks());
    if (
      e.srcObject.getAudioTracks.length != 0 ||
      e.srcObject.getVideoTracks.length != 0
    ) {
      context.play();
    }
    $('#context').removeClass().addClass(e.id);
  } catch (err) {
    console.log(err);
  }
}

/* function to change camera - not tested extensively. */
export async function changeCameraFacing(self, facing) {
  navigator.mediaDevices
    .getUserMedia({
      video: { facingMode: facing, width: 320, height: 180 },
      audio: { echoCancellation: true, noiseSuppression: true }
    })
    .then((stream) => {
      connectedPeers.map((eachPeer) => {
        eachPeer.peer.replaceTrack(
          myMediaStreamObj.getVideoTracks()[0],
          stream.getVideoTracks()[0],
          myMediaStreamObj
        );
        deleteVideoElement('me' + '-video');
        createVideoElement(self, stream, 'me' + '-video', 'ME');
      });
      myMediaStreamObj.getVideoTracks()[0].stop();
    })
    .catch((err) => {
      NotifStore.addNotification({
        title: 'Permission denied',
        message: 'Browser refused to allow access!',
        type: 'danger',
        container: 'top-right',
        animationIn: ['animated', 'fadeIn'],
        animationOut: ['animated', 'fadeOut'],
        dismiss: {
          duration: 3000,
          pauseOnHover: true
        }
      });
    });
}

/* function to get mediastream by asking for permission from user. */
export async function getMyMediaStream(self, type, quality_index) {
  if (quality_index == null) {
    quality_index = 0;
  }
  if (type === 'screen') {
    // TODO: Add try catch to handle case when user denies access
    await navigator.mediaDevices
      .getDisplayMedia({
        video: { width: 1280, height: 720 },
        audio: true
      })
      .then((media) => {
        myScreenStreamObj = media;

        /* display my stream on screen. */
        createVideoElement(self, media, 'me' + '-screen', 'ME');
        return media;
      })
      .catch((err) => {
        NotifStore.addNotification({
          title: 'Permission denied',
          message: 'Browser refused to allow access!',
          type: 'danger',
          container: 'top-right',
          animationIn: ['animated', 'fadeIn'],
          animationOut: ['animated', 'fadeOut'],
          dismiss: {
            duration: 3000,
            pauseOnHover: true
          }
        });
      });
  } else if (type === 'video') {
    // TODO: Add try catch to handle case when user denies access

    await navigator.mediaDevices
      .getUserMedia({
        video: videoQuality[quality_index],
        audio: { echoCancellation: true, noiseSuppression: true }
      })
      .then((media) => {
        myMediaStreamObj = media;

        /* display my stream on screen. */
        createVideoElement(self, media, 'me' + '-video', 'ME');
        return media;
      })
      .catch((err) => {
        NotifStore.addNotification({
          title: 'Permission denied',
          message: 'Browser refused to allow access!',
          type: 'danger',
          container: 'top-right',
          animationIn: ['animated', 'fadeIn'],
          animationOut: ['animated', 'fadeOut'],
          dismiss: {
            duration: 3000,
            pauseOnHover: true
          }
        });
      });
  }
}

/* function called when startCall butto pressed. */
export function startCall(self, roomName, type) {
  /* Initializations */

  connectedPeers = [];
  myMediaStreamObj = new MediaStream();
  myScreenStreamObj = new MediaStream();

  /* create a socket to handle configuration messages. */
  socket = socketIOClient(`${global.config.backendURL}`, {
    autoConnect: false
  });
  socket.open();
  console.log(socket);
  console.log(socket.id);

  socket.on('connect', () => {
    createConnections(self, roomName, type);
  });

  socket.on('signalling', (data, from_id) => {
    connectedPeers.forEach((val) => {
      if (val.their_id == from_id && !val.destroyed) {
        val.peer.signal(data);
      }
    });
  });
}

/* function to initialize Peers to create connections. */
function createConnections(self, roomName, type) {
  var my_id = socket.id;

  // Go online and get online array from express server.
  var reqData = {
    id: my_id,
    type: 0,
    roomName: roomName
  };
  axios
    .post(`${global.config.backendURL}/api/room/goonlinesimple`, reqData, {
      headers: {
        'milaap-auth-token': localStorage.getItem('milaap-auth-token')
      }
    })
    .then((res) => {
      var onlineArray = res.data.online;
      getMyMediaStream(self, type).then((media) => {
        connectedPeers = [];

        socket.on('startconn', (their_id, their_name) => {
          //FACT: Comment this part to test reconnection.
          //Remove previous connections with their_id
          /*
          connectedPeers.forEach((val, index) => {
            if (val && val.their_id == their_id) {
              val.ended = true;
              val.peer.destroy('Call Ended');
            }
          });
          */
          var my_id = socket.id;

          /* Create a new peer with initiator = false and add it to record. */
          var peer = new Peer(
            chooseVideoOrScreen(type),
            self.state.roomName,
            false,
            their_id,
            their_name,
            my_id,
            type
          );
          connectedPeers.push(peer);
        });

        axios
          .get(`${global.config.backendURL}/api/user/getUserName`, {
            headers: {
              'milaap-auth-token': localStorage.getItem('milaap-auth-token')
            }
          })
          .then((resp) => {
            console.log(onlineArray);

            // Loop through online Array and make connections to online Peers
            onlineArray.forEach((val, index) => {
              // Ignore self;
              if (val.username === resp.data.username /* ignore self*/) {
                return;
              }

              var their_id = onlineArray[index].id;
              var their_name = onlineArray[index].username;
              var my_name = resp.data.username;
              var my_id = socket.id;
              console.log(their_id, my_id, my_name);

              /* emit startconn to create Peer at remote to handle sdp setting up. */
              socket.emit('startconn', their_id, my_id, my_name, (resp) => {
                var my_id = socket.id;
                //var peer = new Peer(true, self.state.myMediaStreamObj, self.state.roomName, true, their_id, my_id);
              });
              var my_id = socket.id;

              /* create a new Peer with initiator = true and add it to record. */
              var peer = new Peer(
                chooseVideoOrScreen(type),
                self.state.roomName,
                true,
                their_id,
                their_name,
                my_id,
                type
              );
              connectedPeers.push(peer);
            });
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

/* function to send request to backend to clean database after ending call. */
function sendRequestToEndCall(self) {
  const reqData = {
    roomName: self.state.roomName
  };
  axios
    .post(`${global.config.backendURL}/api/room/exitstreamsimple`, reqData, {
      headers: {
        'milaap-auth-token': localStorage.getItem('milaap-auth-token')
      }
    })
    .then((res) => {
      console.log('exited');
      return;
    })
    .catch((err) => {
      console.log(err);
      return;
    });
}

/* function called when endcall is pressed. */
export async function endCall(self) {
  await sendRequestToEndCall(self);

  /* Destroy & Clear all connection variables associated with calls. */
  connectedPeers.forEach((val, index) => {
    if (val) {
      val.ended = true;
      val.peer.destroy('Call Ended');
    }
  });
  connectedPeers = [];

  /* clear mediastreams and tracks. */
  clearMediaStream(myMediaStreamObj);
  clearMediaStream(myScreenStreamObj);
  myMediaStreamObj = new MediaStream();
  myScreenStreamObj = new MediaStream();

  /* clear ui. */
  deleteAllVideoElements();

  /* Delete the current socket connection. */
  socket.close();
}

/* function to delete all video elements. */
function deleteAllVideoElements() {
  $('#videos').empty();
  const contextOptions = document.getElementById('contextOptions');
  if (contextOptions) contextOptions.style.display = 'none';
  clearContext();
}

/* function to clear context. */
function clearContext() {
  const context = document.getElementById('context');
  if (context != null) {
    context.src = null;
    context.srcObject = null;
    context.style.display = 'none';
  }
}

/* function to delete a particular video element. */
function deleteVideoElement(id) {
  const video = document.getElementById(id);
  const context = $('#context');
  if (video) {
    video.nextElementSibling.remove();
    video.remove();
  }
  if (context.hasClass(id)) {
    clearContext();
  }
}

/* function called when start screen share button pressed. sends request to share screen to all peers and shares screen when request granted. */
export async function addScreenShareStream(self) {
  getMyMediaStream(self, 'screen').then((media) => {
    connectedPeers.forEach((val, index) => {
      /* send request to share screen to all peers.*/
      if (val.peer && !val.peer.destroyed && val.connected) {
        try {
          val.peer.send('sharing screen');
          val.stream_to_be_sent = myScreenStreamObj;
        } catch (err) {
          console.log(err);
          //alert('could not share screen to this peer');
        }
      }
    });
  });
}

/* function called when stop screen share button pressed. */
export async function stopScreenShare(self) {
  connectedPeers.forEach((val, index) => {
    /* send request to stop screen share to all peers.*/
    if (val.peer && !val.peer.destroyed && val.connected) {
      try {
        val.peer.removeStream(myScreenStreamObj);
        val.peer.send('stop screen sharing');
      } catch (err) {
        console.log(err);
        //alert('could not share screen to this peer');
      }
    }
  });

  /* clear the myScreenStreamObj mediastream locally. */
  clearMediaStream(myScreenStreamObj);
  myScreenStreamObj = new MediaStream();
  deleteVideoElement('me-screen');
}
