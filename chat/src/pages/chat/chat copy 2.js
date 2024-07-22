import React, { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';
import './chat.css';

let socket;
const Chat = () => {
  const backEndURL = 'http://localhost:5000/';
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");
  const [msg, setMsg] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null); // Reference to the last message element

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const name = params.get('name');
    const room = params.get('room');

    setUser(name);
    setRoom(room);

    socket = io(backEndURL);

    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    socket.on('allMessages', (allMessages) => {
      setMessages(allMessages);
      scrollToBottom();
    });

    socket.on('message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
      scrollToBottom();
    });

    socket.on('activeUsers', (users) => {
      setActiveUsers(users);
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [backEndURL, room, user]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (msg.trim()) {
      socket.emit('sendMsg', msg, () => {
        setMsg(""); // Reset input field after sending message
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container mt-4">
      <div className="row chat-window" id="chat_window_1">
        <div className="col-xs-4 col-md-4">
          <p>Active Users</p>
          <ul>
            {activeUsers.map((each, idx) => (
              <li key={idx} style={{ color: each.color }}>{each.name}</li>
            ))}
          </ul>
        </div>
        <div className="col-xs-8 col-md-8">
          <div className="panel panel-default">
            <div className="panel-heading top-bar">
              <div className="col-md-12 col-xs-8">
                <h3 className="panel-title">
                  <span className="glyphicon glyphicon-comment"></span>{room}
                </h3>
              </div>
            </div>
            <div className="panel-body msg_container_base" id="chat_body">
              {messages.map((message, index) => (
                <div key={index} className={`row msg_container ${message.user === user.toLowerCase() ? 'base_sent' : 'base_receive'}`}>
                  <div className="col-xs-10 col-md-10">
                    <div className={`messages ${message.user === user.toLowerCase() ? 'msg_sent' : 'msg_receive'}`}>
                      <p><strong>{message.user === user.toLowerCase() ? 'You' : message.user}</strong>: {message.text}</p>
                      <time>{formatTimestamp(message.timestamp)}</time>
                    </div>
                  </div>
                </div>
              ))}
              {/* Reference to the last message element */}
              <div ref={messagesEndRef}></div>
            </div>
            <div className="panel-footer">
              <div className="input-group">
                <input
                  id="btn-input"
                  type="text"
                  value={msg}
                  onKeyPress={(event) => event.key === 'Enter' ? sendMessage(event) : null}
                  onChange={(event) => setMsg(event.target.value)}
                  className="form-control input-sm chat_input"
                  placeholder="Write your message here..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatTimestamp = (timestamp) => {
  if (!(timestamp instanceof Date) || isNaN(timestamp)) {
    return ''; // Return empty string if timestamp is invalid
  }

  const istTimestamp = new Date(timestamp);
  istTimestamp.setHours(istTimestamp.getHours() + 5);
  istTimestamp.setMinutes(istTimestamp.getMinutes() + 30);

  let hours = istTimestamp.getHours();
  const minutes = istTimestamp.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  const formattedDate = istTimestamp.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });

  return `${formattedDate}, ${formattedTime}`;
};

export default Chat;
