import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
          super(props);
          this.state = {
                  login: false,
                  username: '',
                  password: ''
          };
          this.handleUsernameChange = this.handleUsernameChange.bind(this);
          this.handlePasswordChange = this.handlePasswordChange.bind(this);
          this.handleSubmit = this.handleSubmit.bind(this);
  }
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
  handleSubmit(e) {
          e.preventDefault();
          var reqData = {
                  username: this.state.username,
                  password: this.state.password
          }
          axios.post(
                  'http://localhost:5000/api/login',
                  reqData)
                  .then(res => {
                          console.log(res);
                          this.setState({
                                  login: true
                          });
                          localStorage.setItem('uname', this.state.username);
                  })
                  .catch(err => {
                          console.log(err);
                  });
         return;
  }
  render() {
    if(this.state.login) {
            return <Redirect to="/dashboard"/>
    }
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit = {this.handleSubmit}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Username" autoComplete="username" 
                              value = {this.state.username} onChange={this.handleUsernameChange}/>
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" autoComplete="current-password"
                              value={this.state.password} onChange={this.handlePasswordChange}/>
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4">Login</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
