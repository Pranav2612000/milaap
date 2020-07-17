import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import logo from '../../../assets/img/brand/logo.png';
class Landing extends Component {
  render() {
    return (
      <div style={{ overflow: 'hidden', overflowX: 'hidden', overflowY: 'hidden' }}>
        <div style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
          <br />
          <br />
          <Row>
            <Col>
              <Link to="/privacy">
                <h5 style={{ color: 'white', textAlign: 'left', marginLeft: '2%' }}>
                  Privacy Policy
                </h5>
              </Link>
            </Col>
            <Col>
              <Link to="/about-us">
                <h5 style={{ color: 'white', textAlign: 'center' }}> About Us </h5>
              </Link>
            </Col>
            <Col>
              <a href="https://forms.gle/WPCZh2JDyNfBTCJ47" target="_blank">
                <h5
                  style={{ color: 'white', textAlign: 'right', marginRight: '2%' }}>
                  Report a Bug
                </h5>
              </a>
            </Col>
          </Row>
        </div>
        <div
          className="app flex-row align-items-center"
          style={{ overflow: 'hidden' }}>
          <Container>
            <Row className="justify-content-center">
              <Col sm={2}/>
              <Col sm={4}>
                <CardGroup style={{ border: 0 }}>
                  <Card
                    className="text-black bg-transparent"
                    style={{ backgroundColor: 'transparent', border: 0 }}>
                    <CardBody>
                      <h1
                        style={{
                          textAlign: 'center',
                          width: '100%',
                          margin: '14px',
                          color: 'white'
                        }}>
                        Milaap
                      </h1>
                      <p
                        style={{
                          textAlign: 'center',
                          width: '100%',
                          margin: '12px',
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
                              margin: '14px'
                            }}
                            onClick={() => this.props.history.push('join')}>
                            Join a Meeting
                          </Button>
                        </Col>

                        <Col xs="12">
                          <Button
                            color="secondary"
                            style={{ width: '100%', margin: '14px' }}
                            onClick={() => this.props.history.push('login')}>
                            Sign In / Register
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
              <Col sm={5} className="d-flex justify-content-center align-items-center">
                  <img
                    src={logo}
                    onClick={() => this.props.history.push('landing')}
                    style={{ cursor: 'pointer' }}
                    height={'220px'}
                    width={'320px'}
                    alt="milaap"
                  />
              </Col>
              <Col sm={1}/>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default Landing;
