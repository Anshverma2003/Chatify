import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const port = process.env.PORT || 8080;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://chatify-client-theta.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    next();
});

const server = createServer(app);
const io = new Server(server);

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
