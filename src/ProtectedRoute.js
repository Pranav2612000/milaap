import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import * as action from './redux/loginRedux/loginAction';
import { connect } from 'react-redux';
const getRoomFromLocation = (locationString) => {
  let room = '';
  const lastslash = locationString.lastIndexOf('/');
  room = locationString.slice(lastslash + 1);
  return room;
};
const ProtectedRoute = (props) => {
  const { component: Component, ...rest } = props;
  const [credentialsValid, setCredentialsValid] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('milaap-auth-token');
      try {
        const { data } = await axios.post(
          `${global.config.backendURL}/api/user/verify`,
          {
            headers: { 'milaap-auth-token': token }
          }
        );
        setCredentialsValid(data.res);
        setValidated(true);
      } catch {
        setCredentialsValid(false);
        setValidated(true);
      }
    };
    verifyToken();
  }, []);

  if (credentialsValid && validated) {
    return (
      <Route {...rest} render={(props) => <Component {...rest} {...props} />} />
    );
  } else if (!credentialsValid && validated) {
    props.logout();
    localStorage.clear();
    if (props.location.pathname === '/') {
      return <Redirect to="/landing" />;
    }
    const roomName = getRoomFromLocation(props.location.pathname);
    return (
      <Redirect
        to={{
          pathname: '/join',
          room: roomName
        }}
      />
    );
  } else {
    return <div className="animated fadeIn pt-1 text-center">Loading...</div>;
  }
};
const mapStateToProps = (state) => ({
  loggedIn: state.loginReducer.loggedIn
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(action.logout())
});
export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoute);
