import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import * as action from './redux/loginRedux/loginAction';
import { connect } from 'react-redux';

const ProtectedRoute = (props) => {
  const { component: Component, ...rest } = props;
  const [credentialsValid, setCredentialsValid] = useState(false);
  const [validated, setValidated] = useState(false);
  var token = localStorage.getItem('milaap-auth-token');
  useEffect(() => {
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
    return <Redirect to="/login" />;
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
