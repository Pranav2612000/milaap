import React, { Component } from 'react';
import { store } from 'react-notifications-component';
// import socketIOClient from 'socket.io-client';
import axios from 'axios';
import {
  Button,
  Col,
  Container,
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
  UncontrolledTooltip,
  Jumbotron,
  Row,
  Label
} from 'reactstrap';
import './MemberList.css';
// const socket = socketIOClient(`${global.config.backendURL}/`);

class MemberList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      guests: [],
      newmember: '',
      modal: false
    };
    this.toggle = this.toggle.bind(this);
    this.addMember = this.addMember.bind(this);
    this.handleNewMemberChange = this.handleNewMemberChange.bind(this);
    this.shareLink = this.shareLink.bind(this);
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

  shareLink() {
    const link = document.querySelector('link[rel=canonical]')
      ? document.querySelector('link[rel=canonical]').href
      : document.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: 'Join via Link',
          url: link
        })
        .then(() => {
          console.log('Link Shared!');
        })
        .catch(console.error);
    } else {
      navigator.clipboard
        .writeText(link)
        .then(() => {
          store.addNotification({
            title: 'Link copied',
            message: 'Link copied to clipboard!',
            type: 'info',
            container: 'top-right',
            animationIn: ['animated', 'fadeIn'],
            animationOut: ['animated', 'fadeOut'],
            dismiss: {
              duration: 3000,
              pauseOnHover: true
            }
          });
        })
        .catch(console.log('Sorry try again'));
    }
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
      .post(`${global.config.backendURL}/api/room/addusertoroom`, reqData, {
        headers: {
          'milaap-auth-token': localStorage.getItem('milaap-auth-token')
        }
      })
      .then((res) => {
        console.log(res);
        if (res.status == 200) {
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
            <button type="button" className="btn btn-pill btn-secondary">
              <i
                style={{ cursor: 'pointer' }}
                class="fa fa-user-plus"
                onClick={this.toggle}>
                {' '}
                Invite
              </i>
            </button>
          </Col>
        </Row>
        <h5> Admins </h5>
        <ListGroup flush>
          {this.state.users && this.state.users.length > 0
            ? this.state.users.map((user) => {
                return (
                  <ListGroupItem className="bg-dark" key={Math.random()}>
                    {user}
                  </ListGroupItem>
                );
              })
            : 'No members yet'}
        </ListGroup>
        <br />
        <ListGroup flush>
          <h5> Guests </h5>
          {this.state.guests && this.state.guests.length > 0
            ? this.state.guests.map((user) => {
                return (
                  <ListGroupItem className="bg-dark" key={Math.random()}>
                    {user}
                  </ListGroupItem>
                );
              })
            : 'No guests yet'}
        </ListGroup>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader className="bg-dark" toggle={this.toggle}>
            Add Members
          </ModalHeader>
          <ModalBody className="bg-dark">
            <Form>
              <h4>Existing Members</h4>
              <InputGroup className="ml-2">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText className="bg-dark">
                    <i className="icon-user"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  type="text"
                  className="mr-2 bg-dark text-light"
                  placeholder="Username"
                  autoComplete="username"
                  value={this.state.newmember}
                  onChange={this.handleNewMemberChange}
                />{' '}
                <Button color="primary" onClick={this.addMember}>
                  Add
                </Button>
              </InputGroup>
              <br />
              <h4>Invite Guests</h4>
              <Label>Share the following link with the guest</Label>
              <Jumbotron
                style={{ cursor: 'pointer' }}
                className="p-2 m-2 bg-secondary text-dark"
                id="linkHere"
                onClick={this.shareLink}>
                {document.querySelector('link[rel=canonical]')
                  ? document.querySelector('link[rel=canonical]').href
                  : document.location.href}
              </Jumbotron>
              <UncontrolledTooltip placement="bottom" target="linkHere">
                Click to share
              </UncontrolledTooltip>
            </Form>
          </ModalBody>
          <ModalFooter className="bg-dark">
            <Button color="success" onClick={this.toggle}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

export default MemberList;
