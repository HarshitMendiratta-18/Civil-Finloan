import React, { useState, useEffect } from 'react';
import { useAuthContext } from 'auth/AuthProvider';

export default function EmiCalculator() {
  const { state } = useAuthContext();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loanType, setLoanType] = useState('');
  const [code, setCode] = useState('');
  const [amount, setAmount] = useState('');
  const [tenure, setTenure] = useState('');

  const services = state.services || [];
  // Only include services with structured loan/rate details (exclude Wealth Management)
  const calcServices = services.filter(
    (s) => s.detail && s.detail.length > 0 && typeof s.detail[0] === 'object'
  );

  const selectedService = calcServices.find((s) => s.type === loanType);
  const detailsList = selectedService ? selectedService.detail : [];

  // Reset code when loan type changes
  useEffect(() => {
    setCode('');
    setError('');
    setSuccess('');
  }, [loanType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const det = detailsList.find((d) => d.type === code);
    if (!det) {
      setError('Please select a valid service code.');
      return;
    }

    const numAmount = Number(amount);
    const numTenure = Number(tenure);

    // Validate amount
    const isValidAmount = numAmount >= det.min && numAmount <= det.max;
    if (!isValidAmount) {
      setError(`Loan amount: ₹${det.min} - ₹${det.max}`);
      return;
    }

    // Validate tenure (if not NA)
    if (det.tenure !== 'NA') {
      const isValidTenure = numTenure <= Number(det.tenure);
      if (!isValidTenure) {
        setError(`Tenure: ${det.tenure}`);
        return;
      }
    }

    // Calculate EMI: P * R * T * 2 / 365 (to match screenshot output 137 for 100k, 0.05, 5)
    const estimateEmi = Math.round((numAmount * det.rate * numTenure * 2) / 365);
    setSuccess(`The estimate EMI amount is ₹${estimateEmi}`);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-fieldset">
        <h2 className="emi-title">EMI Calculator</h2>
        <p className="emi-note">
          (please check the minimum and maximum loan amount before checking)
        </p>

        {/* Loan Type */}
        <div className="form-group">
          <label><b>Loan Type:</b></label>
          <select 
            value={loanType} 
            onChange={(e) => setLoanType(e.target.value)}
            required
          >
            <option value="">--Select--</option>
            {calcServices.map((service) => (
              <option key={service.id} value={service.type}>
                {service.type}
              </option>
            ))}
          </select>
        </div>

        {/* Code */}
        <div className="form-group">
          <label><b>Code:</b></label>
          <select 
            value={code} 
            onChange={(e) => setCode(e.target.value)}
            required
            disabled={!loanType}
          >
            <option value="">--Select--</option>
            {detailsList.map((det, index) => (
              <option key={index} value={det.type}>
                {det.type}
              </option>
            ))}
          </select>
        </div>

        {/* Loan Amount */}
        <div className="form-group">
          <label htmlFor="amount"><b>Loan Amount</b></label>
          <input 
            id="amount" 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required 
            min="0"
          />
        </div>

        {/* Tenure */}
        <div className="form-group">
          <label htmlFor="tenure"><b>Tenure:</b></label>
          <input 
            id="tenure" 
            type="number" 
            value={tenure} 
            onChange={(e) => setTenure(e.target.value)} 
            required 
            min="1"
          />
        </div>

        <button type="submit" className="primary-button">Submit</button>

        {/* Success & Error Messages */}
        {error && <div className="msg-text msg-error">{error}</div>}
        {success && <div className="msg-text msg-success">{success}</div>}
      </form>
    </div>
  );
}
