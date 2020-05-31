import React, { Component, lazy, Suspense } from 'react';
import { store } from 'react-notifications-component';
import { Bar, Line } from 'react-chartjs-2';
import socketIOClient from 'socket.io-client';
import axios from "axios";
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
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Jumbotron,
  Progress,
  Row,
  Spinner,
  Table
} from 'reactstrap';
import './MemberList.css';
const socket = socketIOClient('http://localhost:5000/');

class MemberList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      guests: [],
      newmember: '',
      modal: false,
    }
    this.toggle = this.toggle.bind(this);
    this.addMember = this.addMember.bind(this);
    this.handleNewMemberChange = this.handleNewMemberChange.bind(this);
    /*
    socket.on('userJoined', (data) => {
      if (this.state.roomName !== 'dashboard') {
        // YET TO BE TESTED
        this.getActive();
      }
    });
    socket.on('userOnline', (data) => {
      if (this.state.roomName !== 'dashboard') this.getActive();
    });
    socket.on('userExit', (data) => {
      if (this.state.roomName !== 'dashboard') this.getActive();
    });
    */
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  addMember() {
    const reqData = {
      username: this.state.newmember,
      roomName: this.props.roomName
    };
    console.log(reqData);
    axios
      .post('http://localhost:5000/api/room/addusertoroom', reqData, {
        headers: {
          'milaap-auth-token': localStorage.getItem('milaap-auth-token')
        }
      })
      .then((res) => {
        console.log(res);
        if(res.status == 200) {
          this.toggle();
          this.setState({
            users: [...this.state.users, reqData.username]
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleNewMemberChange(e) {
    this.setState({
      newmember: e.target.value
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.users !== prevProps.users) {
      this.setState({
        users: this.props.users
      });
    }
    if (this.props.guests !== prevProps.guests) {
      this.setState({
        guests: this.props.guests
      });
    }
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;

  render() {
    return (
      <Container id="memberlist">
        <Row>
          <Col>
            <h3> Members </h3>
          </Col>
          <Col>
            <button class="btn-danger" onClick={this.toggle}>
              <i class="fa fa-user-plus"></i>
            </button>
          </Col>
        </Row>
        <h5> Admins </h5>
        <ListGroup flush>
          {this.state.users && this.state.users.length > 0
            ? this.state.users.map((user) => {
                return (
                  <ListGroupItem key={Math.random()}>
                    {user}
                  </ListGroupItem>
                );
              })
              : 'No members yet'}
        </ListGroup>
        <br/>
        <ListGroup flush>
          <h5> Guests </h5>
          {this.state.guests && this.state.guests.length > 0
            ? this.state.guests.map((user) => {
                return (
                  <ListGroupItem key={Math.random()}>
                    {user}
                  </ListGroupItem>
                );
              })
              : 'No guests yet'}
        </ListGroup>

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
        >
          <ModalHeader toggle={this.toggle}>Add Members</ModalHeader>
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
                  placeholder="Username"
                  autoComplete="username"
                  value={this.state.newmember}
                  onChange={this.handleNewMemberChange}
                />
              </InputGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addMember}>
              Add
            </Button>{' '}
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

export default MemberList;
