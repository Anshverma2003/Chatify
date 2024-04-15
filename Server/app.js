import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8080;

const allowedOrigins = [
  'https://chatify-client-theta.vercel.app/',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('user connected', socket.id);

  socket.on('message', ({ id, data }) => {
    console.log(data);
    socket.to(id).emit('receivedMessage', data);
  });

  socket.on('join-room', (room) => {
    socket.join(room);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
