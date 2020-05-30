import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap';
import axios from 'axios';
import ReactNotification, { store } from 'react-notifications-component';
class Guest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: false,
      name: '',
      room: false,
      roomName: '',
      error: false
    };
  }

  componentDidMount() {
    this.setState({ room: this.props.location.room });
    this.setState({ roomName: this.props.location.room });
  }

  handlenameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  };

  handleroomNameChange = (e) => {
    this.setState({
      roomName: e.target.value
    });
  };

  handleForgotroomName = (e) => {
    e.preventDefault();
    alert('Work in Progress...');
  };

  handleUserAdd = (e) => {
    e.preventDefault();
    var reqData = {
      name: this.state.name,
      roomName: this.state.roomName,
      temp: localStorage.getItem('milaap-auth-token') !== undefined
    };
    axios
      .post('http://localhost:5000/api/room/addusertoroom', reqData, {
        headers: {
          'milaap-auth-token': localStorage.getItem('milaap-auth-token')
        }
      })
      .then((res) => {
        this.setState({
          login: true
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: true });
        store.addNotification({
          title: 'Invalid Room',
          message: 'Room Not Found',
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
  };
  handleSubmit = (e) => {
    e.preventDefault();
    var reqData = {
      name: this.state.name,
      roomName: this.state.roomName
    };
    axios
      .post('http://localhost:5000/api/user/gettokenfortempuser', reqData)
      .then((res) => {
        localStorage.setItem('milaap-auth-token', res.data.token);
        this.setState({
          login: true
        });
      })
      .catch((err) => {
        console.clear();
        console.log(err);
        this.setState({ error: true });
        store.addNotification({
          title: 'Invalid Room',
          message: 'Room Not Found',
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
  };

  render() {
    return (
      /* Add Milaap Logo somewhere on this page. */
      <>
        {console.log(this.state.login)}
        {this.state.login === true && (
          <Redirect
            to={{
              pathname: `/rooms/${this.state.roomName}`,
              state: this.state.name
            }}
          />
        )}
        {this.state.error && <ReactNotification />}
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col md="8">
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      <Form>
                        {this.state.room ? (
                          <h2>Join Room {this.state.room}</h2>
                        ) : (
                          <h2>Join a Meeting Room</h2>
                        )}
                        {localStorage.getItem('milaap-auth-token') ? (
                          <></>
                        ) : (
                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="icon-user"></i>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              placeholder="Enter Your Name"
                              autoComplete="name"
                              value={this.state.name}
                              onChange={this.handlenameChange}
                            />
                          </InputGroup>
                        )}

                        {this.state.room ? (
                          <></>
                        ) : (
                          <InputGroup className="mb-4">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="icon-drop"></i>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              placeholder="Enter Room Name to Join"
                              value={this.state.roomName}
                              onChange={this.handleroomNameChange}
                            />
                          </InputGroup>
                        )}

                        <Row>
                          <Col xs="6">
                            <Button
                              color="primary"
                              className="px-4"
                              onClick={(e) =>
                                localStorage.getItem('milaap-auth-token')
                                  ? this.handleUserAdd(e)
                                  : this.handleSubmit(e)
                              }>
                              Join
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                  <Card
                    className="text-white bg-primary py-5 d-md-down-none"
                    style={{ width: '44%' }}>
                    <CardBody className="text-center">
                      <div>
                        <h2>Sign In</h2>
                        <p>Have An Account </p>
                        <Link to="/login">
                          <Button
                            color="primary"
                            className="mt-3"
                            active
                            tabIndex={-1}>
                            Login
                          </Button>
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default Guest;
