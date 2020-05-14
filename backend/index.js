const express = require('express'); 
const cors = require('cors');
const { PeerServer } = require('peer');

const connectDB = require('./config/db');
//const rabbitDB = require('./config/rabbit');

const app = express();

connectDB();

const port = process.env.PORT || 5000;
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const userRouter = require('./routes/user.js');
const roomRouter = require('./routes/room.js');


app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(express.urlencoded({ limit: '50mb' }));
app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);
app.use('/api/user', userRouter);
app.use('/api/room', roomRouter);
app.get('/', (req, res) => res.send('Hello World!'));

//While deploying uncomment this line and change peerServer throughout the application to use our peerServer.
//const peerServer = PeerServer({ port: 9000, path: '/peerserver' });
app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
});
