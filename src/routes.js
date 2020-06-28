import React from 'react';
//import Privacy from './views/Pages/Privacy/Privacy';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Room = React.lazy(() => import('./views/Rooms/Rooms'));
// const Rooms = import('./views/Rooms/Rooms');

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/rooms/:roomname', exact: true, name: 'Room', component: Room }
  //{ path: '/privacy', exact: true, name: 'Privacy', component: Privacy }
];

export default routes;
