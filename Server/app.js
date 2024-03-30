import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http'

const app = express();
const port = 8080;


const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET" , "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('user connnected' , socket.id);
    socket.on('disconnect' , ()=>{
        console.log('user disConnected' , socket.id);
    })

    socket.on('message' ,({id , data})=>{
        console.log(data);
        io.to(id).emit('receivedMessage' , data);
    })
})

server.listen(port, () => {
    console.log(`Server is running at port ${port}`);
})