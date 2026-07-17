import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from 'auth/AuthProvider';

export default function LoginPage() {
  const { setLogin } = useAuthContext();
  const navigate = useNavigate();
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userID, // backend matches email to userID/user
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Login Successful!! Please wait profile page loading...');
        // Store login session after 3 seconds, then redirect
        setTimeout(() => {
          setLogin({
            user: data.user,
            token: data.token,
          });
          navigate('/profile');
        }, 3000);
      } else {
        setError(data.message || 'Invalid User ID or Password');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleLogin} className="form-fieldset">
        <legend className="form-legend">Login</legend>

        {/* User ID */}
        <div className="form-group">
          <label htmlFor="userId"><b>User ID:</b></label>
          <input 
            id="userId" 
            type="text" 
            value={userID} 
            onChange={(e) => setUserID(e.target.value)} 
            required 
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password"><b>Password:</b></label>
          <input 
            id="password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className="primary-button">Login</button>

        {/* Success/Error Message */}
        {error && <div className="msg-text msg-error">{error}</div>}
        {success && <div className="msg-text msg-success">{success}</div>}
      </form>
    </div>
  );
}
