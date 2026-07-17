import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from 'auth/AuthProvider';

export default function ServicePage() {
  const { code } = useParams();
  const { state } = useAuthContext();

  const service = state.services.find(
    (ser) => ser.code.toLowerCase() === code.toLowerCase()
  );

  if (!service) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h3>Loading service details...</h3>
      </div>
    );
  }

  // Check if detail contains strings (like DEMAT, PAN, NPS) or objects
  const isSimpleDetail = service.detail.length > 0 && typeof service.detail[0] === 'string';

  return (
    <div className="service-container">
      <h2>{service.type}</h2>
      <p>{service.description}</p>
      <hr style={{ margin: '20px 0', borderColor: '#e5e5e5' }} />

      {isSimpleDetail ? (
        <ul className="detail-list-simple">
          {service.detail.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        service.detail.map((det, index) => (
          <div key={index} className="detail-section">
            <h3>Type: {det.type}</h3>
            <ul className="detail-list">
              <li>Minimum Amount: ₹ {det.min}</li>
              <li>Maximum Amount: ₹ {det.max}</li>
              <li>Tenure: {det.tenure} (days/month)</li>
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
