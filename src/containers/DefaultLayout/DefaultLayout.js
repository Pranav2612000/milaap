import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import PeerHandler from './peerHandler';
import ReactNotification, { store } from 'react-notifications-component';
import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppAsideToggler,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav
} from '@coreui/react';
import routes from '../../routes';

const socket = socketIOClient('http://localhost:5000/');
const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));
const InnerHeader = React.lazy(() => import('./InnerHeader'));
function getGroupElements(rooms) {
  const groupElements = [];
  if (rooms === undefined) {
    return {};
  }
  rooms.forEach((item, index) => {
    const groupElem = {};
    groupElem.name = item;
    groupElem.url = '/rooms/' + item;
    groupElem.icon = 'icon-screen-desktop';
    groupElem.state = true;
    groupElements.push(groupElem);
  });
  return groupElements;
}

function getFriendList(active) {
  const activeUsers = [];
  if (active === undefined) {
    return {};
  }
  active.forEach((item, index) => {
    const friend = {};
    friend.name = item;
    // groupElem.url = '/rooms/' + item;
    friend.icon = 'icon-user';
    friend.state = false;
    activeUsers.push(friend);
  });
  return activeUsers;
}

class DefaultLayout extends Component {
  getRooms = () => {
    axios
      .post(
        'http://localhost:5000/api/user/getrooms',
        {},
        {
          headers: {
            'milaap-auth-token': localStorage.getItem('milaap-auth-token')
          }
        }
      )
      .then((res) => {
        // console.log(res);
        var rooms = res.data.rooms;
        const GroupList = getGroupElements(rooms);
        axios
          .post(
            'http://localhost:5000/api/room/getActive',
            {},
            {
              headers: {
                'milaap-auth-token': localStorage.getItem('milaap-auth-token')
              }
            }
          )
          .then((res) => {
            console.log(res);
            var active = res.data.active;
            console.log(active);
            const FriendList = getFriendList(active);
            console.log({ ...GroupList });
            this.setState({
              navigation: {
                items: [
                  {
                    title: true,
                    name: 'Friends',
                    icon: 'icon-puzzle'
                  },
                  ...FriendList,
                  {
                    title: true,
                    name: 'Rooms',
                    icon: 'icon-puzzle',
                    children: [
                      {
                        // title: true,
                        name: 'No Messages Yet.',
                        icon: 'icon-puzzle',
                        badge: {
                          variant: 'info',
                          text: 'Add'
                        },
                        class: ''
                      }
                    ]
                  },
                  ...GroupList
                ]
              }
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  constructor(props) {
    super(props);
    var rooms;
    var friends;
    const FriendList = getFriendList(friends);
    const GroupList = getGroupElements(rooms);
    this.state = {
      userToken: localStorage.getItem('milaap-auth-token'),
      navigation: {
        items: [
          {
            title: true,
            name: 'Friends',
            icon: 'icon-puzzle'
          },
          FriendList,
          {
            title: true,
            name: 'Rooms',
            icon: 'icon-puzzle',
            children: [
              {
                // title: true,
                name: 'No Messages Yet.',
                icon: 'icon-puzzle',
                badge: {
                  variant: 'info',
                  text: 'Add'
                },
                class: ''
              }
            ]
          },
          GroupList
        ]
      }
    };
    if (this.state.userToken === null) {
      return;
    }
    this.getRooms();
    this.state = {
      navigation: {
        items: [
          {
            title: true,
            name: 'Friends',
            icon: 'icon-puzzle'
          },
          FriendList,
          {
            title: true,
            name: 'Rooms',
            icon: 'icon-puzzle',
            children: [
              {
                // title: true,
                name: 'No Messages Yet.',
                icon: 'icon-puzzle',
                badge: {
                  variant: 'info',
                  text: 'Add'
                },
                class: ''
              }
            ]
          },
          GroupList
        ]
      }
    };
    socket.on('newRoom', (data) => {
      console.log('ROOM ADDED');
      console.log(data);
      this.getRooms();
    });
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;

  signOut(e) {
    e.preventDefault();
    localStorage.removeItem('milaap-auth-token');
    this.props.history.push('/login');
  }

  componentDidMount() {
    if (this.props.location.state !== undefined) {
      store.addNotification({
        title: `Hi ${this.props.location.state}`,
        message: 'Welcome to Dashboard',
        type: 'success',
        // insert: "top",
        container: 'top-right',
        animationIn: ['animated', 'fadeIn'],
        animationOut: ['animated', 'fadeOut'],
        dismiss: {
          duration: 3000,
          pauseOnHover: true
        }
      });
    }
  }

  render() {
    if (localStorage.getItem('milaap-auth-token') === null) {
      return <Redirect to="/login" />;
    }
    console.log(this.props);
    return (
      <React.Fragment>
        <div className="app">
          <AppHeader fixed>
            <Suspense fallback={this.loading()}>
              <DefaultHeader onLogout={(e) => this.signOut(e)} />
            </Suspense>
          </AppHeader>
          <div className="app-body">
            <ReactNotification />
            <AppSidebar fixed display="lg">
              <AppSidebarHeader />
              <AppSidebarForm />
              <Suspense>
                <AppSidebarNav
                  navConfig={this.state.navigation}
                  {...this.props}
                  router={router}
                />
              </Suspense>
              <AppSidebarFooter />
              <AppSidebarMinimizer />
            </AppSidebar>
            <main className="main">
              <Container fluid>
                <Suspense fallback={this.loading()}>
                  <Switch>
                    {routes.map((route, idx) => {
                      return route.component ? (
                        <Route
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          render={(props) => <route.component {...props} />}
                        />
                      ) : null;
                    })}
                    <Redirect from="/" to="/dashboard" />
                  </Switch>
                </Suspense>
              </Container>
            </main>
            <Suspense fallback={this.loading()}>
              <aside className="aside-menu" display="md">
                <DefaultAside />
              </aside>
            </Suspense>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default DefaultLayout;
