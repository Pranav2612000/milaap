import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem
} from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo.png';

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      friendid: '',
      roomName: ''
    };
    /*this.toggle = this.toggle.bind(this);
    this.handleFriendChange = this.handleFriendChange.bind(this);
    this.handleRoomNameChange = this.handleRoomNameChange.bind(this);
    this.addFriend = this.addFriend.bind(this);
    */
  }
  /*
  addFriend() {
    const reqData = {
      user: this.state.friendid,
      roomName: this.state.roomName
    };
    axios
      .post(`${global.config.backendURL}/api/room/createroom`, reqData, {
        headers: {
          'milaap-auth-token': localStorage.getItem('milaap-auth-token')
        }
      })
      .then((res) => {
        this.toggle();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleFriendChange(e) {
    this.setState({
      friendid: e.target.value
    });
  }

  handleRoomNameChange(e) {
    this.setState({
      roomName: e.target.value
    });
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
*/

  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    const showHamburger =
      window.location.href.split('/').pop() !== 'dashboard' ? true : false;
    /* TODO: Use Protected Route component. */
    if (!this.props.username) {
      return <Redirect to="/landing" />; //Choose from landing and login page.
    }
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none bg-dark" display="md" mobile />
        <NavLink to="/dashboard">
          <AppNavbarBrand
            full={{ src: logo, width: 65, height: 55 }}
            minimized={{
              src: logo,
              width: 30,
              height: 30
            }}
          />
        </NavLink>
        <AppSidebarToggler className="d-md-down-none bg-dark" display="lg" />
        <Nav className="d-block d-md-down" navbar>
          {this.props.guests && !this.props.guests.includes(this.props.username) && (
            <NavItem className="ml-0 px-2">
              <NavLink to="/dashboard" className="nav-link">
                <button type="button" className="btn btn-pill btn-secondary">
                  Home
                </button>
              </NavLink>
            </NavItem>
          )}
        </Nav>

        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle style={{ marginRight: '5px' }}>
              <NavItem>
                <NavLink to="#" className="nav-link text-dark">
                  {this.props.username}
                </NavLink>
              </NavItem>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header tag="div" className="text-center">
                <strong>Settings</strong>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-user"></i> Profile
              </DropdownItem>
              <DropdownItem onClick={(e) => this.props.onLogout(e)}>
                <i className="fa fa-lock"></i> Logout
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <AppAsideToggler
            className="d-xs-none bg-dark"
            display="xs"
            style={{ display: showHamburger ? 'block' : 'none' }}
          />
        </Nav>

        {/* Migrate the Modal to a new file. 

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Create Room</ModalHeader>
          <ModalBody>
            <Form>
              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="icon-user"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  type="text"
                  placeholder="Room Name"
                  autoComplete="roomname"
                  value={this.state.roomName}
                  onChange={this.handleRoomNameChange}
                />
              </InputGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addFriend}>
              Add
            </Button>{' '}
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        */}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

const mapStateToProps = (state) => ({
  username: state.loginReducer.username,
  guests: state.roomReducer.guests
});

export default connect(mapStateToProps)(DefaultHeader);
