import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Card, CardBody, Container, Row } from 'reactstrap';
import { connect } from 'react-redux';
import logo from '../../assets/img/brand/logo.png';

class Dashboard extends Component {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;

  render() {
    if (this.props.username === false) {
      return <Redirect to="/login" />;
    }
    return (
      <>
        <div className="text-center" style={{ color: 'white', opacity: '0.5' }}>
          <center>
            <br />
            <br />
            <h1>Welcome {`${this.props.username}`}!</h1>
            <br />
            <h1>Distrideo Chat - Dashboard</h1>
            <br />
            <Container>
              <Row
                className="justify-content-center"
                style={{ margin: '0%', height: '25%', padding: '0' }}>
                <Card
                  className="text-white bg-transparent py-5 d-md-down"
                  style={{ width: '80%' }}
                  style={{
                    backgroundColor: 'transparent',
                    border: 0,
                    padding: '0'
                  }}>
                  <CardBody
                    className="text-center"
                    style={{
                      backgroundColor: 'transparent',
                      border: 0,
                      padding: '0'
                    }}>
                    <img
                      src={logo}
                      width={'100%'}
                      height={'100%'}
                      onClick={() => this.props.history.push('dashboard')}
                      style={{ cursor: 'pointer' }}
                    />
                  </CardBody>
                </Card>
              </Row>
            </Container>
            <br />
            <h4>1. To create a room, click on 'Create Room', at the top</h4>
            <br />
            <h4>
              2. To join a room, click on the room to enter, visible on your left
            </h4>
          </center>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  console.log(state);
  return {
    username: state.loginReducer.username
  };
};

export default connect(mapStateToProps)(Dashboard);
