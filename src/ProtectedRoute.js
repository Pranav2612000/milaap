import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import * as action from './redux/loginRedux/loginAction';
import { connect } from 'react-redux';
function getRoomFromLocation(locationString) {
  let room = '';
  const lastslash = locationString.lastIndexOf('/');
  room = locationString.slice(lastslash + 1);
  return room;
}
const ProtectedRoute = (props) => {
  const { component: Component, ...rest } = props;
  const [credentialsValid, setCredentialsValid] = useState(false);
  const [validated, setValidated] = useState(false);
  var token = localStorage.getItem('milaap-auth-token');
  useEffect(() => {
    console.log(props.location);
    const verifyToken = async () => {
      token = localStorage.getItem('milaap-auth-token');
      await axios
        .post(`${global.config.backendURL}/api/user/verify`, {
          headers: { 'milaap-auth-token': token }
        })
        .then((resp) => {
          setCredentialsValid(resp.data.res);
          setValidated(true);
        })
        .catch((err) => {
          //   alert(err);
          setCredentialsValid(false);
          setValidated(true);
        });
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
    if(props.location.pathname == '/') {
      return <Redirect to="/login" />
    }
    var roomName = getRoomFromLocation(props.location.pathname);
    console.log(roomName);
    return <Redirect to={{
                        pathname: "/join",
                        room: roomName,
                        }}
    />;
  } else {
    return <div className="animated fadeIn pt-1 text-center">Loading...</div>;
  }
};
const mapStateToProps = (state) => {
  return {
    loggedIn: state.loginReducer.loggedIn
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(action.logout())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoute);
