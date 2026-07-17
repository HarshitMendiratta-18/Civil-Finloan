import React, { useState } from 'react';

export default function JoinAsMember() {
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Quick mobile pattern validation
    if (!/^[0-9]{10}$/.test(mobile)) {
      setError('Mobile number must be exactly 10 digits.');
      return;
    }

    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: '', // empty name on initial signup as per db structure
          email: username, // mapping username input to the 'email' payload field in backend
          mobile: Number(mobile),
          password: password,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setSuccess('User added successfully');
        // Clear form
        setUsername('');
        setMobile('');
        setPassword('');
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSignUp} className="form-fieldset">
        <legend className="form-legend">Join as a member</legend>

        {/* Username */}
        <div className="form-group">
          <label htmlFor="username"><b>Username:</b></label>
          <input 
            id="username" 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>

        {/* Mobile No */}
        <div className="form-group">
          <label htmlFor="mobile"><b>Mobile No:</b></label>
          <input 
            id="mobile" 
            type="tel" 
            maxLength={10} 
            value={mobile} 
            onChange={(e) => setMobile(e.target.value)} 
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

        <button type="submit" className="primary-button">Sign Up</button>

        {/* Messages */}
        {error && <div className="msg-text msg-error">{error}</div>}
        {success && <div className="msg-text msg-success">{success}</div>}
      </form>
    </div>
  );
}
