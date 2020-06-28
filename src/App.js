import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import './App.scss';

//Redux related imports
import { store } from './redux/store';
import { Provider } from 'react-redux';

const loading = () => (
  <div className="animated fadeIn pt-3 text-center">Loading...</div>
);

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));
const Register = React.lazy(() => import('./views/Pages/Register'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));
const Guest = React.lazy(() => import('./views/Pages/Guest/Guest'));
const Landing = React.lazy(() => import('./views/Pages/Landing/Landing'));
const Privacy = React.lazy(() => import('./views/Pages/Privacy/Privacy'));
const AboutUs = React.lazy(() => import('./views/Pages/AboutUs/AboutUs'));

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route
                exact
                path="/landing"
                name="Landing Page"
                render={(props) => <Landing {...props} />}
              />
              <Route
                exact
                path="/login"
                name="Login Page"
                render={(props) => <Login {...props} />}
              />
              <Route
                exact
                path="/privacy"
                name="Privacy Page"
                render={(props) => <Privacy {...props} />}
              />
              <Route
                path="/join"
                name="Guest Login"
                render={(props) => <Guest {...props} />}
              />
              <Route
                path="/about-us"
                name="About Us"
                render={(props) => <AboutUs {...props} />}
              />
              <Route
                exact
                path="/register"
                name="Register Page"
                render={(props) => <Register {...props} />}
              />
              <Route
                exact
                path="/404"
                name="Page 404"
                render={(props) => <Page404 {...props} />}
              />
              <Route
                exact
                path="/500"
                name="Page 500"
                render={(props) => <Page500 {...props} />}
              />
              <Route
                path="/"
                name="Home"
                render={(props) => <DefaultLayout {...props} />}
              />
            </Switch>
          </React.Suspense>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
