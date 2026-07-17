import React, { useState } from 'react';
import { useAuthContext } from 'auth/AuthProvider';

export default function Profile() {
  const { state, setLogin } = useAuthContext();
  const user = state.user || {};

  const [mobile, setMobile] = useState(user.mobile || '');
  const [password, setPassword] = useState(user.password || '');
  const [fullName, setFullName] = useState(user.fullName || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!/^[0-9]{10}$/.test(mobile)) {
      setError('Mobile number must be exactly 10 digits.');
      return;
    }

    try {
      const response = await fetch('/api/v1/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({
          id: user.id,
          fullName: fullName,
          mobile: Number(mobile),
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Profile Updated Successfully!!');
        setLogin({
          user: data.user,
          token: data.token,
        });
      } else {
        setError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleUpdate} className="form-fieldset">
        {/* Username (Disabled) */}
        <div className="form-group">
          <label htmlFor="username"><b>Username:</b></label>
          <input 
            id="username" 
            type="text" 
            value={user.userID || ''} 
            disabled 
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

        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="fullname"><b>Full Name:</b></label>
          <input 
            id="fullname" 
            type="text" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className="primary-button">Update</button>

        {/* Messages */}
        {error && <div className="msg-text msg-error">{error}</div>}
        {success && <div className="msg-text msg-success">{success}</div>}
      </form>
    </div>
  );
}
