import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './chat.css';
import { v4 as uuidv4 } from 'uuid';
import { messaging } from './firebase'; // Adjust path as per your project structure

import notificationSound from './Water Drop Sound Ringtone Download - MobCup.Com.Co.mp3'; // Adjust path to your audio file

let socket;
const Chat = () => {
  const backEndURL = 'http://localhost:5000/';
  
  const [user, setUser] = useState(localStorage.getItem('user') || '');
  const [room, setRoom] = useState(localStorage.getItem('room') || '');
  const [msg, setMsg] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [userColors, setUserColors] = useState({});
  const [isTokenFound, setTokenFound] = useState(false); // State for token found
  const [notificationAudio] = useState(new Audio(notificationSound));
  const messagesEndRef = useRef(null);
  const chatBodyRef = useRef(null);
  const navigate = useNavigate(); 

  const generateUniqueId = () => {
    return uuidv4();
  };

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const name = params.get('name');
    const room = params.get('room');
    let uniqueId = localStorage.getItem('uniqueId');

    // if (!uniqueId) {
    //    uniqueId = generateUniqueId(); // Implement a UUID generator or random ID generator
    //   localStorage.setItem('uniqueId', uniqueId);
    // }


    


    setUser(name);
    setRoom(room);

    socket = io(backEndURL);

    socket.addEventListener("open", (event) => {
      alert("OPEN")

    });


    socket.emit('checkUserExistence', { uniqueId, name, room }, (error, exists) => {
      if (error) {
        alert(error);
      } else if (exists) {
        alert('A user with the same username and room name already exists. Please try again.');
        localStorage.clear('uniqueId');
        navigate('/');
      } else {
        // User doesn't exist, proceed with login
        socket.emit('join', { uniqueId, name, room }, (error) => {
          if (error) {
            alert(error);
          }
        });
      }
    });

  //   socket.emit('checkUserExistence', { uniqueId, name, room }, (error, exists) => {
  //   if (error) {
  //     alert(error);
  //   } else if (exists) {
  //     alert('A user with the same username and room name already exists. Please try again.');
  //     localStorage.clear('uniqueId')
  //     navigate('/');
      
      
  //   } else {
  //     // User doesn't exist, proceed with login
  //     // setUser(name);
  //     // setRoom(room);
  //     // ...
  //     socket.emit('join',{uniqueId,name,room},{error} => {
  //       if(error){
  //         alert(error);
  //     }

  //   });
  //   }
  // });

    // socket.emit('join', { uniqueId,name, room }, (error) => {
    //   if (error) {
    //     alert(error);
    //   }

      
    // });

    socket.on('allMessages', (allMessages) => {
  
      setMessages(allMessages);
      scrollToBottom();

    });

    
    socket.on('message', (message) => {
      

      setMessages(prevMessages => [...prevMessages, message]);

      if (document.hidden && Notification.permission === 'granted') {
        new Notification(`${capitalize(message.user)}:`, {
          body: message.text,
          icon: 'path/to/icon.png', // Optional: Add an icon for the notification
        });
      }

      scrollToBottom();
      playNotificationSound(); // Play sound when message is received
    });

    socket.on('activeUsers', (users) => {
  
      setActiveUsers(users);
    });

    // Request notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Firebase Cloud Messaging setup
    getToken(setTokenFound);

    messaging.onMessage(payload => {
      console.log('Message received:', payload);
      // Handle incoming message here
      playNotificationSound(); // Play sound when message is received
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [backEndURL, room, user]);

 

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (chatBodyRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;
        if (scrollTop + clientHeight < scrollHeight - 100) {
          setShowScrollButton(true);
        } else {
          setShowScrollButton(false);
        }
      }
    };

    const chatBody = chatBodyRef.current;
    chatBody.addEventListener('scroll', handleScroll);

    return () => {
      chatBody.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';

    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const capitalize = (str) => {
    if (typeof str !== 'string' || !str) return "";
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getUserColor = (username) => {
    if (!userColors[username]) {
      const newColor = getRandomColor();
      setUserColors(prevColors => ({
        ...prevColors,
        [username]: newColor,
      }));
      return newColor;
    }
    return userColors[username];
  };

  const playNotificationSound = () => {
    notificationAudio.play().catch(error => {
      console.log('Failed to play notification sound:', error);
    });
  };

  const getToken = (setTokenFound) => {
    messaging.getToken({ vapidKey: 'BMIawWKiULmu_HYAZmQnJ23Ju9r4nSTpSaDNsAV9ljlLwFdWV-WeoniOlZjGwqfP0EeSc2EJ2wwFzoacLfSzH5g' }).then((currentToken) => {
      if (currentToken) {
        console.log('Current token for client:', currentToken);
        setTokenFound(true);
        // Send the token to your server for backend notifications
      } else {
        console.log('No registration token available. Request permission to generate one.');
        setTokenFound(false);
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token:', err);
      setTokenFound(false);
    });
  };

  
const handleLogout = () => {
  const uniqueId = localStorage.getItem('uniqueId');
  socket.emit('logout', { uniqueId }, (error) => {
    if (error) {
      console.error('Logout error:', error);
    } else {
      socket.disconnect();
      setUser("");
      setRoom("");
      setMessages([]);
      setActiveUsers([]);
      setUserColors({});
      setMsg("");
      setTokenFound(false);
      navigate('/'); 
      localStorage.clear();// Navigate to login page
      
    }
  });
};

  return (
    <div className="container mt-4">
      <div className="row chat-window" id="chat_window_1">
        <div className="col-xs-4 col-md-4">
          <p>Active Users</p>
          <ul>
            {activeUsers.map((each, idx) => (
              <li key={idx}>
                {each.name === user ? <strong>{capitalize(each.name)} - Current User</strong> : capitalize(each.name)}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-xs-8 col-md-8">
          <div className="panel panel-default">
            <div className="panel-heading top-bar">
              <div className="col-md-12 col-xs-8">
                <h3 className="panel-title">
                  <span className="glyphicon glyphicon-comment"></span>{capitalize(room)}
                </h3>
                <button className="btn btn-danger btn-sm logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
            <div className="panel-body msg_container_base" id="chat_body" ref={chatBodyRef}>
              {messages.map((message, index) => (
                <div key={index} className={`row msg_container ${message.user === 'admin' ? 'admin_message_container' : message.user === user.toLowerCase() ? 'base_sent' : 'base_receive'}`}>
                  <div className={`col-xs-10 col-md-10 ${message.user === 'admin' ? 'admin-message' : ''}`}>
                    <div className={`messages ${message.user === user.toLowerCase() ? 'msg_sent' : 'msg_receive'}`}>
                      {message.user === 'admin' ? (
                        <p className="admin-message text-center">{message.text}</p>
                      ) : (
                        <>
                          <div className="message-user">
                            <span style={{ color: getUserColor(message.user) }}>{capitalize(message.user)}</span>
                          </div>
                          <p>{message.text}</p>
                          <time>{formatTimestamp(message.timestamp)}</time>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
          {showScrollButton && (
            <button className="scroll-to-bottom" onClick={scrollToBottom}>
              ↓
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
