import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { v4 as uuidv4 } from 'uuid';

const Login = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('isLogged') === 'true') {
            navigate(`/chat?name=${localStorage.getItem('name')}&room=${localStorage.getItem('room')}`);
        }
    }, [navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (name && room) {
            const uniqueId = localStorage.getItem('uniqueId') || uuidv4(); 
            localStorage.setItem('uniqueId', uniqueId);
            localStorage.setItem('name', name);
            localStorage.setItem('room', room);
            localStorage.setItem('isLogged', 'true');
            navigate(`/chat?name=${name}&room=${room}`);
        }
        
    };
    
    
    

    return (
        <div className="container w-25 mt-4">
            <div className="logo">
                <p>Logo</p>
            </div>
            <h1 className="login-h1">Login to your Account</h1>
            <form method="post" onSubmit={handleLogin}>
                <div className="form-group">
                    <input
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Username"
                        required
                        className="form-control form-input"
                        value={name}
                    />
                </div>
                <div className="form-group">
                    <input
                        onChange={(e) => setRoom(e.target.value)}
                        type="text"
                        placeholder="Room"
                        required
                        className="form-control form-input"
                        value={room}
                    />
                </div>
                <button type="submit" className="form-submit">Log In</button>
            </form>
        </div>
    );
};

export default Login;

