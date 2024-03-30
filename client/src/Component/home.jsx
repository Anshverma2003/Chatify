import React, { useState, useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';

const Home = () => {
    const [id, setId] = useState('');
    const [data, setData] = useState('');
    const [socketId , setSocketId] = useState('');
    const [response , setRespone] = useState([]);
    const socket = useMemo(()=> io('http://localhost:8080'),[]);


    useEffect(() => {

        socket.on('receivedMessage' , (message)=>{
            // console.log(message);
            setRespone(message);
        })

        socket.on('connect', () => {
            console.log('connected', socket.id);
            setSocketId(socket.id);
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        socket.emit('message', { id, data });
        setData('');
        console.log('Form submitted with id:', id, 'and data:', data);
    };

    return (
        <div className="home">
            <h2>Your ID: {socketId} </h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="id">ID:</label>
                    <input type="text" id="id" value={id} onChange={(e) => setId(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="data">Data:</label>
                    <input type="text" id="data" value={data} onChange={(e) => setData(e.target.value)} required />
                </div>
                <button type="submit">Submit</button>
            </form>

            {response && <div className="response">
                <p>{response}</p>
            </div>}
        </div>
    );
};

export default Home;
