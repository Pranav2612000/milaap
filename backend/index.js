const express = require('express'); 
const cors = require('cors');

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

app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
});
