const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const mysql = require('mysql');

// Entity functions (add, remove, get users)
const { addUsers, removeUser, getUser, getRoomUsers } = require('./entity');

// Instances
const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } });

// Create connection to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'SIva', // Replace with your MySQL username
    password: 'Kaidranzer10', // Replace with your MySQL password
    database: 'chat_app'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// ENDPOINTS
app.get('/', (req, res) => {
    res.json("API is working");
});

// Socket.io event handling
io.on('connection', (socket) => {
    console.log("User Connected");

    // Handle join event
    socket.on('join', ({ name, room }, callBack) => {
        const { user, error } = addUsers({ id: socket.id, name, room });

        if (error) {
            callBack(error);
            return;
        }

        socket.join(user.room);
        socket.emit('message', { user: 'admin', text: `Welcome ${user.name}` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined` });

        // Fetch existing messages from the database
        db.query('SELECT * FROM messages WHERE room = ?', [user.room], (err, messages) => {
            if (err) {
                console.error('Error fetching messages:', err);
                return;
            }

            // Send the past messages to the user who just joined
            const formattedMessages = messages.map(msg => ({ user: msg.user, text: msg.message, timestamp: msg.timestamp }));
            socket.emit('allMessages', formattedMessages);
        });

        // Emit activeUsers event to all clients in the room
        io.to(user.room).emit('activeUsers', getRoomUsers(user.room));
    });

    // Handle sendMsg event
    socket.on('sendMsg', (message, callBack) => {
        const user = getUser(socket.id);
        if (user) {
            const msg = { user: user.name, room: user.room, message, timestamp: new Date() };

            // Save message to the database
            db.query('INSERT INTO messages SET ?', msg, (err, result) => {
                if (err) {
                    console.error('Error saving message:', err);
                    callBack('Error saving message');
                    return;
                }
                io.to(user.room).emit('message', { user: user.name, text: message, timestamp: msg.timestamp });
            });
        }
        callBack();
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
        console.log("User disconnected");
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left` });
            // Emit activeUsers event to all clients in the room after user leaves
            io.to(user.room).emit('activeUsers', getRoomUsers(user.room));
        }
    });
});

// Run Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
