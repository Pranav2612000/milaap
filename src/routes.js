import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Room = React.lazy(() => import('./views/Rooms/Rooms'));
// const Rooms = import('./views/Rooms/Rooms');

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/rooms/:roomname', exact: true, name: 'Room', component: Room }
];

export default routes;
