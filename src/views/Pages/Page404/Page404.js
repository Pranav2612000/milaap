import React, { Component } from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import logo from '../../../assets/img/brand/logo.png';

class Page404 extends Component {
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <img
              src={logo}
              onClick={() => this.props.history.push('/')}
              style={{ cursor: 'pointer' }}
              height={'220px'}
              width={'300px'}
              alt="milaap"
            />
          </Row>
          <Row className="justify-content-center">
            <Col md="6">
              <div className="clearfix">
                <h1 className="float-left display-3 mr-4" style={{ color: 'white' }}>
                  404
                </h1>
                <h4 className="pt-3">Oops! You're lost.</h4>
                <p className="text-muted float-left">
                  The room you were looking for does not exist!!
                </p>
              </div>
              {/*
              <InputGroup className="input-prepend">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fa fa-search"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  size="16"
                  type="text"
                  placeholder="What are you looking for?"
                />
                <InputGroupAddon addonType="append">
                  <Button color="info">Search</Button>
                </InputGroupAddon>
              </InputGroup>
              */}
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Button onClick={() => this.props.history.push('/')}>
              Take me back
            </Button>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Page404;
