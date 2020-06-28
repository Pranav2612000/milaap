import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import * as action from '../../../redux/loginRedux/loginAction';
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
import { connect } from 'react-redux';
import ReactNotification, { store } from 'react-notifications-component';
import Notifications from 'react-notification-system-redux';
import logo from '../../../assets/img/brand/logo.png';

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: false,
      username: '',
      password: '',
      error: false,
      fromRegister: false,
      loading: false
    };
  }

  componentDidMount() {
    if (this.props.location.register === true) {
      console.log(this.props.location);
      this.setState({ fromRegister: true });
      store.addNotification({
        title: 'Successfully Registered',
        message: 'Login to your Account',
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
    }
    localStorage.removeItem('milaap-auth-token');
  }

  componentDidUpdate(prevProps) {
    //if(this.props.error
    if (this.props.error) this.state.error = true;
    return;
  }

  handleUsernameChange = (e) => {
    this.setState({
      username: e.target.value
    });
  };

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value
    });
  };

  handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Work in Progress...');
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({
      loading: true,
      error: false
    });

    this.props.login(this.state.username, this.state.password);
    /*
    var reqData = {
      username: this.state.username,
      password: this.state.password
    };
    axios
      .post('http://localhost:5000/api/login', reqData)
      .then((res) => {
        localStorage.setItem('milaap-auth-token', res.data.token);
        this.setState({
          login: true
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: true });
      });
      */
  };

  render() {
    return (
      <>
        {this.props.loggedIn === true && (
          <Redirect
            to={{ pathname: '/dashboard', state: localStorage.getItem('username') }}
          />
        )}
        {/* <ReactNotification /> */}
        {/* {this.state.login && console.log("object")} */}
        {this.state.error && <ReactNotification />}
        {this.props.notifications && (
          <Notifications notifications={this.props.notifications} />
        )}
        <div className="app flex-row align-items-center">
          <ReactNotification />
          <Container>
            <Row
              className="justify-content-center"
              style={{ margin: '0%', height: '15%' }}>
              <Card
                className="text-white bg-transparent py-5 d-md-down"
                style={{ width: '59%', backgroundColor: 'transparent', border: 0 }}>
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
              <Col md="6">
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      <Form onSubmit={this.handleSubmit}>
                        <h1>Login</h1>
                        <p className="text-muted">Sign In to your account</p>
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
                            value={this.state.username}
                            onChange={this.handleUsernameChange}
                          />
                        </InputGroup>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                          />
                        </InputGroup>
                        <Row>
                          <Col xs="6">
                            {this.state.loading && !this.state.error ? (
                              <Button color="primary" className="px-4">
                                <Spinner
                                  animation={'grow'}
                                  variant="primary"></Spinner>
                              </Button>
                            ) : (
                              <Button type="submit" color="primary" className="px-4">
                                Login
                              </Button>
                            )}
                          </Col>
                          <Col xs="6" className="text-right">
                            <Button
                              color="link"
                              className="px-0"
                              onClick={this.handleForgotPassword}>
                              Forgot password?
                            </Button>
                          </Col>
                        </Row>
                        <br />
                        <Row className="justify-content-center">
                          <h2>OR</h2>
                        </Row>
                        <Row className="justify-content-center">
                          <Col>
                            <div>
                              <h1>Sign up</h1>
                              <p>
                                Don't have an account? It takes just 5 secs to create
                                a new one.
                              </p>
                              <Link to="/register">
                                <Button
                                  color="primary"
                                  type="submit"
                                  className="px-4"
                                  active
                                  tabIndex={-1}>
                                  Register Now!
                                </Button>
                              </Link>
                            </div>
                          </Col>
                        </Row>
                        <br />
                        <Row className="justify-content-center">
                          <h2>OR</h2>
                        </Row>
                        <Row className="justify-content-center">
                          <br />
                          <Link to="/join">Join as a Guest?</Link>
                          <br />
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                  {/*<Card
                    className="text-white bg-primary py-5 d-md-down-none"
                    style={{ width: '44%' }}>
                    <CardBody className="text-center">
                      <div>
                        <h2>Sign up</h2>
                        <p>
                          Don't have an account? It takes just 5 secs to create a new
                          one.
                        </p>
                        <Link to="/register">
                          <Button
                            color="primary"
                            className="mt-3"
                            active
                            tabIndex={-1}>
                            Register Now!
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
    loading: state.loading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (user, password) => dispatch(action.login(user, password))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
