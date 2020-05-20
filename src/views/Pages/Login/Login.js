import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
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
} from "reactstrap";
import withFirebaseAuth from "react-with-firebase-auth";
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "../../../firebaseConfig";
import axios from "axios";
import {auth} from 'firebase'
import './login.scss'

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
var providers =  new firebase.auth.GoogleAuthProvider();

let flag = 0;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      username: "",
      password: "",
      user: "",
      signOut: "",
      // signInWithGoogle,
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleSubmitFireBase = this.handleSubmitFireBase.bind(this);
    this.signInWithGoogle = this.signInWithGoogle.bind(this);

  }




  handleUsernameChange(e) {
    this.setState({
      username: e.target.value,
    });
  }
  
  signInWithGoogle () {
    firebase.auth().signInWithPopup(providers).then( (res) => {
    var user = res.user
    if(user){
      this.setState({
        login : true,
        username : user.displayName
      })
      localStorage.setItem("uname", this.state.username);
    }
    }).catch(function(error){
      console.log(error)
    });
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value,
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    var reqData = {
      username: this.state.username,
      password: this.state.password,
    };
    axios
      .post("http://localhost:5000/api/login", reqData)
      .then((res) => {
        console.log(res);
        this.setState({
          login: true,
        });
        localStorage.setItem("uname", this.state.username);
      })
      .catch((err) => {
        console.log(err);
      });
    return;
  }
  // handleSubmitFireBase(e) {
  //   e.preventDefault();
  //   var reqData = {
  //     username: this.state.username,
  //     password: this.state.password,
  //   };
  //   axios
  //     .post("http://localhost:5000/api/login", reqData)
  //     .then((res) => {
  //       console.log(res);
  //       this.setState({
  //         login: true,
  //       });
  //       localStorage.setItem("uname", this.state.username);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   return;
  // }
  render() {
    if (this.state.login) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
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
                          <Button color="primary" className="px-4">
                            Login
                          </Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">
                            Forgot password?
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                    {/* <Form onSubmit={this.handleSubmitFireBase}> */}
                      <Row>
                        <Col xs="6">
                        {/* <button class="loginBtn loginBtn--google" onClick = {this.signInWithGoogle}>
                              Login with Google
                        </button> */}
                        <div class="google-btn">
                  <div class="google-icon-wrapper">
                  <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                       </div>
                  <button class="btn-text" onClick = {this.signInWithGoogle}>Sign in with google</button>
                  </div>
                        </Col>
                        
                      </Row>
                    
                  </CardBody>
                </Card>
                <Card
                  className="text-white bg-primary py-5 d-md-down-none"
                  style={{ width: "44%" }}
                >
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua.
                      </p>
                      <Link to="/register">
                        <Button
                          color="primary"
                          className="mt-3"
                          active
                          tabIndex={-1}
                        >
                          Register Now!
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
    );
  }
}



export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(Login);

