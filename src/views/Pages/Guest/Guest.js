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
  Row,
  Spinner
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
      disabled: false,
      loading: false
    };
  }

  componentDidMount() {
    console.log(this.props.location);
    if (this.props.location.room) {
      this.setState({ room: this.props.location.room });
      this.setState({ roomName: this.props.location.room });
    }
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
    this.setState({
      loading: true
    });
    console.log(this.state.roomName);
    if (this.state.name == undefined || this.state.name === '') {
      alert('Enter a username to proceed');
      this.setState({
        loading: false
      });
      return;
    }
    if (this.state.roomName == undefined || this.state.roomName == '') {
      alert('Enter a roomname to proceed');
      this.setState({
        loading: false
      });
      return;
    }

    /* Get a valid token if user doesn't have one. */
    if (!global.config.secureStorage.getItem('milaap-auth-token')) {
      console.log('exists');
      var reqData = {
        name: this.state.name,
        roomName: this.state.roomName,
        username: this.state.name
      };
      this.setState({
        loading: true
      });
      this.props.getTokenForTempUser(reqData);
      // axios
      //   .post(`${global.config.backendURL}/api/user/gettokenfortempuser`, reqData)
      //   .then((res) => {
      //     global.config.secureStorage.setItem('milaap-auth-token', res.data.token);
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
        login: true,
        room: this.state.roomName,
        error: false,
        loading: true
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
        global.config.secureStorage.setItem('milaap-auth-token', res.data.token);
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
        {this.state.login === true && (
          <Redirect
            to={{
              pathname: `/rooms/${this.state.roomName}`,
              state: this.state.name
            }}
          />
        )}
        {this.props.loggedIn === true && this.state.room && (
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
        <div className="flex-row align-items-center">
          <br />
          <Container>
            <Row
              className="justify-content-center"
              style={{ margin: '0%', height: '15%' }}>
              <Card
                className="text-white bg-transparent d-md-down"
                style={{ backgroundColor: 'transparent', border: 0 }}>
                <CardBody
                  className="text-center"
                  style={{
                    backgroundColor: 'transparent',
                    border: 0,
                    margin: 0,
                    padding: '0px !important'
                  }}>
                  <img
                    src={logo}
                    onClick={() => this.props.history.push('landing')}
                    style={{ cursor: 'pointer' }}
                    height={'220px'}
                    width={'300px'}
                    alt="milaap"
                  />
                </CardBody>
              </Card>
            </Row>
            <Row className="justify-content-center">
              <Col md="6">
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      <Form>
                        {this.state.room ? (
                          <h2 style={{ alignSelf: 'center' }}>
                            Join Room {this.state.room}
                          </h2>
                        ) : (
                          <h2 style={{ alignSelf: 'center' }}>
                            Join a Meeting Room
                          </h2>
                        )}
                        {global.config.secureStorage.getItem('milaap-auth-token') ? (
                          <></>
                        ) : (
                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>Your Name</InputGroupText>
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
                              <InputGroupText>Room Name</InputGroupText>
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

                        <Row className="justify-content-center">
                          {this.props.loading && !this.props.error ? (
                            <Button color="primary" className="px-4">
                              <Spinner
                                animation={'grow'}
                                variant="primary"></Spinner>
                            </Button>
                          ) : (
                            <Button
                              color="primary"
                              className="px-4"
                              type="submit"
                              onClick={
                                (e) => this.handleSubmit(e)
                                /*
                                global.config.secureStorage.getItem('milaap-auth-token')
                                  ? this.handleUserAdd(e)
                                  : this.handleSubmit(e)
                                  */
                              }>
                              Join
                            </Button>
                          )}
                        </Row>
                        <br />
                        {!this.props.loggedIn && (
                          <>
                            <Row className="justify-content-center">
                              <h2>OR</h2>
                            </Row>
                            <Row className="justify-content-center">
                              <h5>If you already have an account, click Login!</h5>
                            </Row>
                            <Row className="justify-content-center">
                              <Link to="/login">
                                <Button
                                  color="primary"
                                  className="px-4"
                                  active
                                  tabIndex={-1}>
                                  Login
                                </Button>
                              </Link>
                            </Row>
                          </>
                        )}
                      </Form>
                    </CardBody>
                  </Card>
                  {/*<Card
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
                  </Card>*/}
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
    notifications: state.notifications,
    loading: state.loginReducer.loading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTokenForTempUser: (payload) => dispatch(action.getTokenForTempUser(payload))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Guest);
