import React, { Component } from 'react';
import * as action from '../../../redux/registerRedux/registerAction';
import {
  Button,
  Card,
  CardBody,
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
import logo from '../../../assets/img/brand/logo.png';
import Notifications from 'react-notification-system-redux';
import { Redirect, Link } from 'react-router-dom';

export class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      repassword: '',
      match: true,
      redirect: false,
      loading: false,
      error: false
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleRepasswordChange = this.handleRepasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate = () => {
    if (this.props.error) this.state.error = true;
    return;
  };
  handleUsernameChange(e) {
    this.setState({
      username: e.target.value
    });
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleRepasswordChange(e) {
    this.setState({
      repassword: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      loading: true,
      error: false
    });
    this.props.register(this.state.username, this.state.password);
  }

  render() {
    return (
      <>
        {this.props.registered === true && (
          <Redirect to={{ pathname: '/login', register: true }} />
        )}
        <div className="app flex-row align-items-center">
          {this.props.notifications && (
            <Notifications notifications={this.props.notifications} />
          )}
          <br />
          <Container>
            <Row
              className="justify-content-center"
              style={{ margin: '0%', height: '15%' }}>
              <Card
                className="text-white bg-transparent d-md-down"
                style={{ width: '59%' }}
                style={{ backgroundColor: 'transparent', border: 0 }}>
                <CardBody
                  className="text-center"
                  style={{ backgroundColor: 'transparent', border: 0 }}>
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
              <Col md="9" lg="7" xl="6">
                <Card className="mx-4">
                  <CardBody className="p-4">
                    <Form onSubmit={this.handleSubmit}>
                      <h1>Register</h1>
                      <p className="text-muted">Create your account</p>
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
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password"
                          autoComplete="new-password"
                          value={this.state.password}
                          onChange={this.handlePasswordChange}
                        />
                      </InputGroup>
                      {this.state.match ? (
                        <></>
                      ) : (
                        <h6 style={{ color: 'red' }}>Passwords Don't Match</h6>
                      )}

                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Repeat password"
                          autoComplete="new-password"
                          value={this.state.repassword}
                          onKeyUp={() =>
                            this.setState({
                              match: this.state.repassword === this.state.password
                            })
                          }
                          onChange={(e) => {
                            this.handleRepasswordChange(e);
                          }}
                        />
                      </InputGroup>

                      {this.state.loading && !this.state.error ? (
                        <Button color="success" block>
                          <Spinner></Spinner>
                        </Button>
                      ) : (
                        <Button color="success" block>
                          Create Account
                        </Button>
                      )}
                    </Form>
                    <center>
                      <p>
                        {' '}
                        Already have an account?<Link to="/login">Login</Link>
                      </p>
                    </center>
                  </CardBody>
                </Card>
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
    registered: state.registerReducer.registered,
    error: state.registerReducer.error,
    notifications: state.notifications
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (user, password) => dispatch(action.register(user, password))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
