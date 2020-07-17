import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { store } from 'react-notifications-component';
import { connect } from 'react-redux';
import * as action from '../../redux/messageRedux/messageAction';
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Container,
  Row
} from 'reactstrap';
import './DefaultLayout.css';
import classNames from 'classnames';
import { AppSwitch } from '@coreui/react';
import MessageView from '../../views/MessageList/index';
import Controls from '../../views/Connection/Controls';
import MemberList from '../../views/Widgets/MemberList';

function getRoomFromLocation(locationString) {
  let room = '';
  const lastslash = locationString.lastIndexOf('/');
  room = locationString.slice(lastslash + 1);
  return room;
}

class DefaultAside extends Component {
  constructor(props) {
    super(props);
    let roomName = getRoomFromLocation(this.props.location.pathname);
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      change: false,
      roomName: roomName,
      roomType: 'Public',
      path: props.location.pathname
    };
    this.getRoomInfo = this.getRoomInfo.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.roomName != prevProps.roomName) {
      this.setState({
        roomName: this.props.roomName,
        path: this.props.location.pathname
      });
    }
  }

  componentDidMount = () => {
    setTimeout(() => {
      if (this.props.roomName === undefined) {
        this.setState({
          invalid: true
        });
        store.addNotification({
          title: `Invalid Room`,
          message: `Entered Room does not exist. Please create a new one.`,
          type: 'danger',
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
    }, 1000);
  };

  changeRoomType = () => {
    this.setState({
      roomType: this.state.roomType === 'Public' ? 'Private' : 'Public'
    });
    store.addNotification({
      title: `Room Type Changed`,
      message: `Changed room type to ${this.state.roomType}`,
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
  };

  getRoomInfo(roomName) {
    console.log('nothing to say.');
    return;
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    if (this.state.invalid === true) {
      return <Redirect to="/dashboard"></Redirect>;
    }
    return (
      <React.Fragment>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classNames({ active: this.state.activeTab === '1' })}
              onClick={() => {
                this.toggle('1');
              }}>
              <i className="icon-list"></i>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classNames({ active: this.state.activeTab === '2' })}
              onClick={() => {
                this.toggle('2');
                this.props.resetMessageCount(this.state.roomName);
              }}>
              <i className="icon-speech"></i>

              <span id="badge" class="badge badge-primary">
                {this.props.count[this.state.roomName] === 0 ||
                this.props.count[this.state.roomName] == undefined
                  ? ''
                  : this.props.count[this.state.roomName]}
              </span>
            </NavLink>
          </NavItem>
          {/* <NavItem>
            <NavLink
              className={classNames({ active: this.state.activeTab === '3' })}
              onClick={() => {
                this.toggle('3');
              }}>
              <i className="icon-settings"></i>
            </NavLink>
          </NavItem> */}
        </Nav>
        <TabContent className="bg-dark" activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Container className="bg-dark">
              <Row>
                <Controls roomName={this.props.roomName} />
                <MemberList
                  users={this.props.users}
                  guests={this.props.guests}
                  roomName={this.props.roomName}
                />
              </Row>
            </Container>
          </TabPane>
          <TabPane
            tabId="2"
            className="p-3 bg-dark overflow-auto"
            key={this.state.change}>
            <MessageView
              roomName={this.props.roomName}
              msgs={this.props.msgs}
              tab={this.state.activeTab}
            />
          </TabPane>

          {/* <TabPane tabId="3" className="p-3 bg-dark">
            <h6>Settings</h6>

            <div className="aside-options">
              <div className="clearfix mt-4">
                <small>
                  <button class="btn btn-dark">Change Room Icon</button>
                </small>
              </div>
              <div>
                <small className="text-muted">Set the Room Icon.</small>
              </div>
            </div>

            <div className="aside-options">
              <div className="clearfix mt-3">
                <small>
                  <button class="btn btn-dark" onClick={this.changeRoomType}>
                    Change Room Type
                  </button>
                </small>
              </div>
              <div>
                <small className="text-muted">
                  Set the active room to Private / Public.
                </small>
              </div>
            </div>

            <div className="aside-options">
              <div className="clearfix mt-3">
                <small>
                  <b>More settings</b>
                </small>
                <AppSwitch
                  className={'float-right'}
                  variant={'pill'}
                  label
                  color={'success'}
                  defaultChecked
                  size={'sm'}
                />
              </div>
            </div>
          </TabPane> */}
        </TabContent>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    count: state.messageReducer.count,
    roomName: state.roomReducer.currentRoom
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    resetMessageCount: (roomName) => dispatch(action.resetMessageCount(roomName))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DefaultAside));
