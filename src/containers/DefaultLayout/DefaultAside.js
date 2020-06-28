import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { store } from 'react-notifications-component';

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
  console.log(room);
  return room;
}

class DefaultAside extends Component {
  constructor(props) {
    super(props);
    console.log(props);

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

  componentDidMount() {
    console.log('mounting');
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
    console.log(this.props);
    const { children, ...attributes } = this.props;

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
              }}>
              <i className="icon-speech"></i>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classNames({ active: this.state.activeTab === '3' })}
              onClick={() => {
                this.toggle('3');
              }}>
              <i className="icon-settings"></i>
            </NavLink>
          </NavItem>
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
          <TabPane tabId="2" className="p-3 bg-dark overflow-auto" key={this.state.change}>
            <MessageView roomName={this.props.roomName} msgs={this.props.msgs} />
          </TabPane>

          <TabPane tabId="3" className="p-3 bg-dark">
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
          </TabPane>
        </TabContent>
      </React.Fragment>
    );
  }
}

export default withRouter(DefaultAside);
