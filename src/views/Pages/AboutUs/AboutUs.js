import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Row } from 'reactstrap';
import logo from '../../../assets/img/brand/logo.png';

class AboutUs extends Component {
  render() {
    return (
      <div style={{ overflow: 'hidden', overflowX: 'hidden', overflowY: 'hidden' }}>
        <div style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
          <br />
          <br />
          <Row>
            <Col>
              <h5 style={{ color: 'white', textAlign: 'left', marginLeft: '2%' }}>
                About Us
              </h5>
            </Col>
            <Col>
              <Link to="/landing">
                <h5 style={{ color: 'white', textAlign: 'center' }}> Home </h5>
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
                <h1
                  style={{
                    textAlign: 'center',
                    width: '100%',
                    margin: '14px',
                    color: 'white'
                  }}>
                  About Us
                </h1>
              </Card>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default AboutUs;
