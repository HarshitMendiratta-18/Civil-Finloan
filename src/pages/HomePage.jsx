import React from 'react';

export default function HomePage() {
  return (
    <div className="home-container">
      {/* Banner */}
      <div 
        className="home-banner" 
        style={{ backgroundImage: `url('/sprouts_banner.png')` }}
      >
        <div className="home-banner-overlay"></div>
        <h1>If you're not making mistakes, then you're not doing anything</h1>
      </div>

      {/* Main Text Content */}
      <div className="home-content">
        <h2>An Hub For Your Finiancial Needs</h2>
        <p>
          We offer the extensive array of services by providing loans to citizens, 
          Money transfer, wealth management and also leading on providing micro loans 
          to agriculture and small businesses in the rural regions.
        </p>
      </div>
    </div>
  );
}
