import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
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
              <Link to="/privacy">
                <h5 style={{ color: 'white', textAlign: 'left', marginLeft: '2%' }}>
                  Privacy Policy
                </h5>
              </Link>
            </Col>
            <Col>
              <Link to="/landing">
                <h5 style={{ color: 'white', textAlign: 'center' }}> Home </h5>
              </Link>
            </Col>
            <Col>
              <a
                href="https://forms.gle/WPCZh2JDyNfBTCJ47"
                target="_blank"
                rel="noopener noreferrer">
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
          style={{ overflow: 'hidden', padding: '0px', margin: '0px' }}>
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
                    height={'220px'}
                    width={'320px'}
                    alt="milaap"
                  />
                </CardBody>
                <h1
                  style={{
                    textAlign: 'center',
                    width: '100%',
                    color: 'white'
                  }}>
                  About Us
                </h1>
                <br />
                <h4
                  style={{
                    textAlign: 'justify',
                    width: '100%',
                    color: 'white'
                  }}>
                  Milaap a decentralised video/audio chat/conferencing application,
                  which is designed to work on the edge, with very less interference
                  of the server(i.e. peer to peer connection).
                </h4>
                <br />
                <h5
                  style={{
                    textAlign: 'justify',
                    width: '100%',
                    color: 'white'
                  }}>
                  There are many video calling applications around the globe, but
                  they are mostly server based applications providing maximum load on
                  the server, wherein the audio and video quality decreases with
                  increase in the number of participants. Many don't even support
                  end-to-end encryption. So we decided to develop a one-stop solution
                  for not only addressing all these solution, but to give a seamless
                  experience to the user. It is designed to work efficiently on all
                  platforms.
                </h5>
                <br />
                <h4
                  style={{
                    textAlign: 'center',
                    width: '100%',
                    color: 'white'
                  }}>
                  We are still in out Development Phase. Feel free to contribute{' '}
                  <a
                    href="https://github.com/pranav2612000/milaap"
                    style={{
                      textAlign: 'center',
                      width: '100%',
                      color: ' light grey'
                    }}
                    target="_blank"
                    rel="noopener noreferrer">
                    here
                  </a>
                </h4>
              </Card>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default AboutUs;
