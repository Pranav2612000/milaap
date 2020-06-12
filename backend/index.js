import debugFactory from 'debug';
const { generalUtils } = require('./utils/general');
const { partySocketHandlers } = require('./sockets/party');
const { userSocketHandlers } = require('./sockets/user');

const { appConfig, routeConfig } = require('./config/index');

const express = require('express');
// const cors = require('cors');
const { PeerServer } = require('peer');
// Socket handlers

// Configuration files
const connectDB = require('./config/db');
const debug = debugFactory('APP:MAIN');
// const rabbitDB = require('./config/rabbit');

const app = express();

connectDB();

const port = process.env.PORT || 5000;
const socketIo = require('socket.io');

appConfig.configureApp(app);

const http = require('http').Server(app);
var io = socketIo(http);
// io.origins("http://localhost:3000")
module.exports = io;

// routeConfig.configureRoutes(app);

io.on('connection', (socket) => {
  // Debug information about user connection
  debug(`User with id ${socket.id} connected`);

  //  Merge all separate eventHandlers into one object
  //  so that the eventHandlers can automatically be matched to corresponding actions
  var eventHandlers = generalUtils.mergeObjectsInArray([
    partySocketHandlers,
    userSocketHandlers
  ]);

  // Bind eventHandlers to corresponding actions
  socket.on('action', (action) => {
    const eventHandler = eventHandlers[action.type];

    // If there is an eventHandler defined for the given actionType
    // -> execute that eventHandler with parameters io, socket and the actions' payload
    if (eventHandler) {
      eventHandler(io, socket, action.payload);
    }
  });

  // When a client disconnects -> remove the clientId from all parties it was connected to
  socket.on('disconnect', () => {
    debug(`User with id ${socket.id} disconnected`);
    userSocketHandlers.WS_TO_SERVER_DISCONNECT_FROM_PARTY(io, socket);
  });
});

const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const userRouter = require('./routes/user.js');
const roomRouter = require('./routes/room.js');

app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);
app.use('/api/user', userRouter);
app.use('/api/room', roomRouter);
app.get('/', (req, res) => res.send('Hello World!'));

// While deploying/local testing uncomment this line and change peerServer throughout the application to use our peerServer.
const peerServer = PeerServer({ port: 9000, path: '/peerserver' });

http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
