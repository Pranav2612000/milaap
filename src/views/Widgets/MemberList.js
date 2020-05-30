import React, { Component, lazy, Suspense } from 'react';
import { store } from 'react-notifications-component';
import { Bar, Line } from 'react-chartjs-2';
import socketIOClient from 'socket.io-client';
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
  ListGroup,
  ListGroupItem,
  Jumbotron,
  Progress,
  Row,
  Spinner,
  Table
} from 'reactstrap';
const socket = socketIOClient('http://localhost:5000/');

class MemberList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      guests: [],
    }
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
      <Container>
        <h3> Members </h3>
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
      </Container>
    );
  }
}

export default MemberList;
