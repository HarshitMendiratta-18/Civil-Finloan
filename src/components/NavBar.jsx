import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from 'auth/AuthProvider';
import FlexBetween from './FlexBetween';

export default function NavBar() {
  const { state, setLogout } = useAuthContext();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAuth = Boolean(state.token);

  const handleAuthClick = () => {
    if (isAuth) {
      setLogout();
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="navbar-container">
      <FlexBetween className="navbar-inner">
        {/* Left Side */}
        <div className="navbar-left">
          <Link to="/home" className="navbar-brand">
            Civil Finloan
          </Link>
          <Link to="/aboutUs" className="navbar-link">
            About Us
          </Link>
          
          <div className="navbar-dropdown" ref={dropdownRef}>
            <button 
              className="navbar-dropdown-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              type="button"
            >
              Services <span className="dropdown-arrow">▼</span>
            </button>
            {dropdownOpen && (
              <div className="navbar-dropdown-menu">
                <Link to="/service/SCB" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  Small Scale Business Loans
                </Link>
                <Link to="/service/MR" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  Money Remittance
                </Link>
                <Link to="/service/WM" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  Wealth Management
                </Link>
                <Link to="/service/MF" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  Micro Finance
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="navbar-right">
          <Link to="/emiCalculator" className="navbar-link">
            EMI Calculator
          </Link>
          <Link to="/joinAsMember" className="navbar-link">
            Join as a member
          </Link>
          <Link to="/profile" className="navbar-link">
            Update Profile
          </Link>
          <button onClick={handleAuthClick} className="navbar-auth-btn">
            {isAuth ? 'Logout' : 'Login'}
          </button>
        </div>
      </FlexBetween>
    </header>
  );
}
