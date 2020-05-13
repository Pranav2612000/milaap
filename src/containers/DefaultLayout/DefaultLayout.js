import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';
import axios from 'axios';

import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
//import navigation from '../../_nav';
// routes config
import routes from '../../routes';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));
function getGroupElements(rooms) {
        let groupElements = [];
        console.log(rooms);
        if(rooms == undefined) {
                return {};
        }
        rooms.forEach((item, index) => {
                let groupElem = {};
                groupElem.name = item;
                groupElem.url = "/rooms/" + item;
                groupElem.icon = 'icon-drop';
                groupElements.push(groupElem);
        });
        return groupElements;
}
class DefaultLayout extends Component {

  constructor(props) {
          super(props);
          let rooms;
          const reqData = {
                  username: localStorage.getItem('uname')
          };
          axios.post('http://localhost:5000/api/user/getrooms',
                  reqData)
                  .then(res => {
                          console.log(res);
                          rooms = res.data.rooms;
                          let PMList = {};
                          let GroupList = getGroupElements(rooms);
                          console.log({...GroupList});
                          this.setState({
                                  navigation: {
                                    items: [
                                      {
                                        title: true,
                                        name: 'PMs',
                                        icon: 'icon-puzzle',
                                      },
                                      PMList,
                                      {
                                        title: true,
                                        name: 'Groups',
                                        icon: 'icon-puzzle',
                                        children: [
                                          {
                                            //title: true,
                                            name: 'No Messages Yet.',
                                            icon: 'icon-puzzle',
                                            badge: {
                                              variant: 'info',
                                              text: 'Add'
                                            },
                                            class: ''
                                          },
                                        ],
                                      },
                                      ...GroupList,
                                    ],
                                  }
                          });
                  }).catch(err => {
                          console.log(err);
                  });
          let PMList = {};
          let GroupList = getGroupElements(rooms);
          this.state = {
                  navigation: {
                    items: [
                      {
                        title: true,
                        name: 'PMs',
                        icon: 'icon-puzzle',
                      },
                      PMList,
                      {
                        title: true,
                        name: 'Groups',
                        icon: 'icon-puzzle',
                        children: [
                          {
                            //title: true,
                            name: 'No Messages Yet.',
                            icon: 'icon-puzzle',
                            badge: {
                              variant: 'info',
                              text: 'Add'
                            },
                            class: ''
                          },
                        ],
                      },
                      GroupList,
                    ],
                  }
          };
  }
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>
  signOut(e) {
    e.preventDefault()
    this.props.history.push('/login')
  }

  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense  fallback={this.loading()}>
            <DefaultHeader onLogout={e=>this.signOut(e)}/>
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
                    <AppSidebarNav navConfig={this.state.navigation} {...this.props} router={ router }/>
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} router={router}/>
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
                        render={props => (
                          <route.component {...props} />
                        )} />
                    ) : (null);
                  })}
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
