import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Adjust path as per your project structure

const HomePage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignIn, setIsSignIn] = useState(true);

  const handleSignIn = () => {
    // Implement sign-in logic here (e.g., validate credentials)
    console.log(`Signing in with username: ${username} and password: ${password}`);

    // Navigate to another page on successful sign-in
    navigate('/dashboard');
  };

  const handleSignUp = () => {
    // Implement sign-up logic here (e.g., register new user)
    console.log(`Signing up with username: ${username} and password: ${password}`);

    // Navigate to another page on successful sign-up
    navigate('/dashboard');
  };

  const toggleForm = () => {
    setUsername('');
    setPassword('');
    setIsSignIn(!isSignIn);
  };

  return (
    <div className="container">
      <h1>Welcome to My App</h1>
      <div className="form-container">
        <h2>{isSignIn ? 'Sign In' : 'Sign Up'}</h2>
        <form>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={isSignIn ? handleSignIn : handleSignUp}>
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <p className="toggle-form-link" onClick={toggleForm}>
          {isSignIn ? 'Create an account?' : 'Already have an account? Sign in'}
        </p>
      </div>
    </div>
  );
};

export default HomePage;
