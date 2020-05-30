import React, { Component } from 'react';
import { Link, NavLink, Redirect } from 'react-router-dom';
import {
  Badge,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from 'reactstrap';
import PropTypes from 'prop-types';
import axios from 'axios';

import { AppAsideToggler, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import DefaultAside from './DefaultAside';
import logo from '../../assets/img/brand/logo.png';
import sygnet from '../../assets/img/brand/sygnet.svg';

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
    this.toggle = this.toggle.bind(this);
    this.handleFriendChange = this.handleFriendChange.bind(this);
    this.handleRoomNameChange = this.handleRoomNameChange.bind(this);
    this.addFriend = this.addFriend.bind(this);
  }

  componentDidMount() {
    /* To be changed: Use Redux to get username. */
    axios
      .get('http://localhost:5000/api/user/getUserName', {
        headers: {
          'milaap-auth-token': localStorage.getItem('milaap-auth-token')
        }
      })
      .then((resp) => {
        console.log(resp.data.username);
        this.setState({ username: resp.data.username });
      })
      .catch((err) => {
        console.log(err, 'Error in Verifying JWT');
        this.setState({ username: false });
      });
  }

  addFriend() {
    const reqData = {
      user: this.state.friendid,
      roomName: this.state.roomName
    };
    axios
      .post('http://localhost:5000/api/room/createroom', reqData, {
        headers: {
          'milaap-auth-token': localStorage.getItem('milaap-auth-token')
        }
      })
      .then((res) => {
        console.log(res);
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

  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    /* TODO: Use Protected Route component. */
    if (this.state.username === false) {
      return <Redirect to="/login" />;
    }
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 65, height: 55 }}
          minimized={{
            src: sygnet,
            width: 30,
            height: 30
          }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink to="/dashboard" className="nav-link">
              Dashboard
            </NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink to="#" className="nav-link" onClick={this.toggle}>
              Create Room
            </NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          {/* <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-list"></i></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-location-pin"></i></NavLink>
          </NavItem> */}
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle>
              <NavItem>
                <NavLink to="#" className="nav-link">
                  {this.state.username}
                </NavLink>
              </NavItem>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header tag="div" className="text-center">
                <strong>Account</strong>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-bell-o"></i> Updates
                <Badge color="info">42</Badge>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-envelope-o"></i> Messages
                <Badge color="success">42</Badge>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-tasks"></i> Tasks
                <Badge color="danger">42</Badge>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-comments"></i> Comments
                <Badge color="warning">42</Badge>
              </DropdownItem>
              <DropdownItem header tag="div" className="text-center">
                <strong>Settings</strong>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-user"></i> Profile
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-wrench"></i> Settings
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-usd"></i> Payments
                <Badge color="secondary">42</Badge>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-file"></i> Projects
                <Badge color="primary">42</Badge>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>
                <i className="fa fa-shield"></i> Lock Account
              </DropdownItem>
              <DropdownItem onClick={(e) => this.props.onLogout(e)}>
                <i className="fa fa-lock"></i> Logout
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <AppAsideToggler className="d-xs-none" display="xs" />
        </Nav>

        {/* Migrate the Modal to a new file. */}

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Create Room</ModalHeader>
          <ModalBody>
            <Form>
              {/*
              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="icon-user"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  type="text"
                  placeholder="Username"
                  autoComplete="username"
                  value={this.state.friendid}
                  onChange={this.handleFriendChange}
                />
              </InputGroup>
              */}
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
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
