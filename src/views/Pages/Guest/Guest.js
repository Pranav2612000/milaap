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

import logo from '../../../assets/img/brand/logo.png';
import * as action from '../../../redux//loginRedux/loginAction';
import Notifications from 'react-notification-system-redux';
import { connect } from 'react-redux';
class Guest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: false,
      name: '',
      room: false,
      roomName: '',
      error: false,
      disabled: false
    };
  }

  componentDidMount() {
    this.setState({ room: this.props.location.room });
    this.setState({ roomName: this.props.location.room });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.loggedIn !== this.props.loggedIn)
      this.setState({ disabled: true });
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

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.roomName);
    if (this.state.roomName == undefined || this.state.roomName == '') {
      alert('Enter a roomname to proceed');
      return;
    }

    /* Get a valid token if user doesn't have one. */
    if (!localStorage.getItem('milaap-auth-token')) {
      console.log('exists');
      var reqData = {
        name: this.state.name,
        roomName: this.state.roomName,
        username: this.state.name
      };
      this.props.getTokenForTempUser(reqData);
      // axios
      //   .post(`${global.config.backendURL}/api/user/gettokenfortempuser`, reqData)
      //   .then((res) => {
      //     localStorage.setItem('milaap-auth-token', res.data.token);
      //     this.setState({
      //       login: true
      //     });
      //     return;
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     this.setState({ error: true });
      //     store.addNotification({
      //       title: 'Invalid Room',
      //       message: 'Room Not Found',
      //       type: 'danger',
      //       container: 'top-right',
      //       animationIn: ['animated', 'fadeIn'],
      //       animationOut: ['animated', 'fadeOut'],
      //       dismiss: {
      //         duration: 3000,
      //         pauseOnHover: true
      //       }
      //     });
      //   });
    } else {
      this.setState({
        login: true
      });
      return;
    }
    return;
  };
  /*
  handleSubmit = (e) => {
    e.preventDefault();
    var reqData = {
      name: this.state.name,
      roomName: this.state.roomName
    };
    axios
      .post('http://localhost:5000/api/room/m', reqData)
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
  */

  render() {
    return (
      /* Add Milaap Logo somewhere on this page. */
      <>
        {console.log(this.state.loggedIn)}
        {this.state.login === true && (
          <Redirect
            to={{
              pathname: `/rooms/${this.state.roomName}`,
              state: this.state.name
            }}
          />
        )}
        {this.props.loggedIn === true && (
          <Redirect
            to={{
              pathname: `/rooms/${this.state.roomName}`,
              state: this.state.name
            }}
          />
        )}
        {this.props.notifications && (
          <Notifications notifications={this.props.notifications} />
        )}
        <div className="app flex-row align-items-center">
          <Container>
            <Row
              className="justify-content-center"
              style={{ margin: '0%', height: '15%' }}>
              <Card
                className="text-white bg-transparent py-5 d-md-down"
                style={{ width: '59%' }}
                style={{ backgroundColor: 'transparent', border: 0 }}>
                <CardBody
                  className="text-center"
                  style={{ backgroundColor: 'transparent', border: 0 }}>
                  <img
                    src={logo}
                    onClick={() => this.props.history.push('landing')}
                    style={{ cursor: 'pointer' }}
                  />
                </CardBody>
              </Card>
            </Row>
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
                              disabled={this.state.disabled}
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
                              onClick={
                                (e) => this.handleSubmit(e)
                                /*
                                localStorage.getItem('milaap-auth-token')
                                  ? this.handleUserAdd(e)
                                  : this.handleSubmit(e)
                                  */
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
const mapStateToProps = (state) => {
  console.log(state);
  return {
    loggedIn: state.loginReducer.loggedIn,
    error: state.loginReducer.error,
    notifications: state.notifications
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTokenForTempUser: (payload) => dispatch(action.getTokenForTempUser(payload))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Guest);
