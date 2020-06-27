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
class Landing extends Component {
  render() {
    return (
      /* Add Milaap Logo somewhere on this page. */
      <>
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col sm="8">
                <CardGroup style={{ border: 0 }}>
                  <Card
                    className="text-black bg-transparent"
                    style={{ backgroundColor: 'transparent', border: 0 }}>
                    <CardBody>
                      <h1
                        style={{
                          textAlign: 'center',
                          width: '100%',
                          margin: '11px',
                          color: 'white'
                        }}>
                        Distrideo Chat
                      </h1>
                      <p
                        style={{
                          textAlign: 'center',
                          width: '100%',
                          margin: '10px',
                          color: 'white'
                        }}>
                        An attempt to make a self-sustaining conferencing application
                        by India, for the World!
                      </p>
                      <Row
                        className="d-flex justify-content-center align-items-center"
                        style={{ marginTop: '20px' }}>
                        <Col xs="12">
                          <Button
                            color="warning"
                            style={{
                              width: '100%',
                              margin: '10px'
                            }}
                            onClick={() => this.props.history.push('join')}>
                            Join a Meeting
                          </Button>
                        </Col>

                        <Col xs="12">
                          <Button
                            color="secondary"
                            style={{ width: '100%', margin: '10px' }}
                            onClick={() => this.props.history.push('login')}>
                            Sign In
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
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
                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default Landing;
