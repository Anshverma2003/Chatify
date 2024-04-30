import React, { useState, useEffect, useMemo } from 'react';
import './home.css'
import { io } from 'socket.io-client';

const Home = () => {
    const [id, setId] = useState('');
    const [data, setData] = useState('');
    const [socketId, setSocketId] = useState('');
    const [response, setRespone] = useState([]);
    const [room, setRoom] = useState('');
    const [roomVisible, setRoomVisible] = useState(false);
    const [singleChat, setSingleChat] = useState(true);

    const socket = useMemo(() => io('https://chatify-x4zs.vercel.app/'), []);


    useEffect(() => {
        socket.on('receivedMessage', (message) => {
            setRespone(prevResponse => [...prevResponse, message]);
        });

        socket.on('connect', () => {
            console.log('connected', socket.id);
            setSocketId(socket.id);
        });

        return () => {
            socket.off('receivedMessage');
            socket.off('connect');
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        socket.emit('message', { id, data });
        setData('');
        console.log('Form submitted with id:', id, 'and data:', data);
    };

    const handleJoinRoom = (e) => {
        e.preventDefault();
        socket.emit('join-room', room);
    }
    const toggleRoomVisibility = () => {
        setRoomVisible(prevState => !prevState);
        setSingleChat(prevState => !prevState)
        setRespone('');
    };


    return (
        <div className="home">

            <button onClick={toggleRoomVisibility}>{roomVisible ? "Single Chat" : "Group Chat"}</button>
            {singleChat && <div>
                <h2>Your ID: {socketId} </h2>
                <form className="chat" onSubmit={handleSubmit}>
                    <label className="to-id" >To: <input type="text" value={id} onChange={(e) => setId(e.target.value)} />

                    </label>
                    <label htmlFor="data" className="input-field">Message:
                        <textarea type="text" id="data" value={data} onChange={(e) => setData(e.target.value)} required />
                    </label>
                    <button className="submit-single-chat" type="submit">Submit</button>

                </form>
            </div>}

            {roomVisible && <div className="room">
                <div className='group-chat'>
                    <form className='room-chat' onSubmit={handleJoinRoom}>
                        <label className="to-id">Join Room:
                            <input type="text" onChange={(e) => { setRoom(e.target.value); setId(e.target.value) }} />
                            <button type="submit" className='join'>Join</button>
                        </label>
                    </form>
                    <form className='chat' onSubmit={handleSubmit}>
                        <label htmlFor="data" className="input-field">Message:
                            <textarea type="text" id="data" value={data} onChange={(e) => setData(e.target.value)} required />
                        </label>
                        <button type="submit" className='submit-group-chat'>Submit</button>
                    </form>
                </div>
            </div>}
            <div className="messages-container">
                {response && response.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
        </div>

    );
};

export default Home;
