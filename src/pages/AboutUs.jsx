import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <h2>About Us</h2>
      <p>
        Civil-Finloan is a finance management company which is providing the extensive 
        array of services by providing loans to citizens, Money transfer, wealth 
        management and also leading on providing micro loans to agriculture and small 
        businesses in the rural regions.
      </p>
      <button 
        className="primary-button" 
        onClick={() => navigate('/home')}
      >
        Explore Home
      </button>
    </div>
  );
}
