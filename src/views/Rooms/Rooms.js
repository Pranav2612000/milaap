import React, { Component, lazy, Suspense } from 'react';
import './Room.css';
import { store } from 'react-notifications-component';
import { connect } from 'react-redux';
import { Bar, Line } from 'react-chartjs-2';
import {
  Badge,
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Jumbotron,
  Progress,
  Row,
  Table
} from 'reactstrap';
import * as action from '../../redux/roomRedux/roomAction';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import DefaultAside from '../../containers/DefaultLayout/DefaultAside';
import PeerHandler from '../../containers/DefaultLayout/peerHandler';

class Room extends Component {
  constructor(props) {
    super(props);

    const roomName = props.match.params.roomname;
    console.log(roomName);
    this.state = {
      roomName: roomName
    };
    this.props.enterRoom(roomName);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.roomname !== prevProps.match.params.roomname) {
      this.setState(
        {
          roomName: this.props.match.params.roomname
        }

        /*
        () => {
          store.addNotification({
            title: 'Room changed',
            message: `Entered ${this.state.roomName} `,
            type: 'success',
            // insert: "top",
            container: 'top-right',
            animationIn: ['animated', 'fadeIn'],
            animationOut: ['animated', 'fadeOut'],
            dismiss: {
              duration: 3000,
              pauseOnHover: true
            }
          });
        }
        */
      );
      this.props.enterRoom(this.props.match.params.roomname);
    }
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;

  render() {
    console.log(this.props);
    return (
      <div class="app-body" id="inner-aside-container">
        <main class="main">
          <Container className="room">
            <video id="context" controls autoPlay></video>
            {/* <VideoPlayer
              selectedVideo={selectedVideo}
              partyId={this.props.roomName}
              userName={userName}
              videoPlayerIsMuted={videoPlayerIsMuted}
              videoPlayerIsMaximized={videoPlayerIsMaximized}
              videoPlayerIsLoaded={videoPlayerIsLoaded}
              videoProgress={videoProgress}
              userVideoPlayerState={userVideoPlayerState}
              partyVideoPlayerState={partyVideoPlayerState}
              onPlayerStateChange={onPlayerStateChange}
              emitNewPlayerStateToServer={emitNewPlayerStateForPartyToServer}
              setPlayerMutedState={setPlayerMutedState}
              setPlayerProgress={setPlayerProgress}
              setPlayerIsLoadedState={setPlayerIsLoadedState}
              handleMaximizeBtnPressed={handleMaximizeBtnPressed}
            /> */}
            <Row className="m-0 p-0" id="videos"></Row>
          </Container>
        </main>
        <aside className="aside-menu bg-dark" display="md">
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
  console.log(state);
  return {
    roomName: state.roomReducer.currentRoom,
    guests: state.roomReducer.guests,
    users: state.roomReducer.users,
    msgs: state.roomReducer.msgs,
    loading: state.roomReducer.loading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    enterRoom: (room) => dispatch(action.enterRoom(room))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
