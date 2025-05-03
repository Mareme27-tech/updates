import React, { useState } from 'react';
import '../stylesheets/ClientPayments.css';

const ClientPayments = () => {
  const [walletBalance, setWalletBalance] = useState(1250.00);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleAddFundsClick = () => {
    setShowAddFundsModal(true);
    setPaymentSuccess(false);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmountToAdd(value);
    }
  };

  const handleAddFundsSubmit = (e) => {
    e.preventDefault();
    if (!amountToAdd || parseFloat(amountToAdd) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const amount = parseFloat(amountToAdd);
      setWalletBalance(prev => prev + amount);
      setAmountToAdd('');
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setPaymentSuccess(false);
        setShowAddFundsModal(false);
      }, 3000);
    }, 1500);
  };

  const handlePayNow = (amount) => {
    if (walletBalance >= amount) {
      // Simulate payment processing
      setIsProcessing(true);
      setTimeout(() => {
        setWalletBalance(prev => prev - amount);
        setIsProcessing(false);
        alert(`Payment of $${amount} processed successfully!`);
      }, 1000);
    } else {
      alert('Insufficient funds in your wallet. Please add more funds.');
    }
  };

  return (
    <main className="client-payments-main">
      {/* Add Funds Modal */}
      {showAddFundsModal && (
        <div className="modal-overlay">
          <div className="add-funds-modal">
            <button 
              className="close-modal" 
              onClick={() => setShowAddFundsModal(false)}
            >
              &times;
            </button>
            
            {!paymentSuccess ? (
              <>
                <h3>Add Funds to Wallet</h3>
                <form onSubmit={handleAddFundsSubmit}>
                  <div className="form-group">
                    <label htmlFor="amount">Amount ($)</label>
                    <input
                      type="text"
                      id="amount"
                      value={amountToAdd}
                      onChange={handleAmountChange}
                      placeholder="Enter amount"
                    />
                  </div>
                  
                  <div className="current-balance">
                    Current Balance: ${walletBalance.toFixed(2)}
                  </div>
                  
                  <div className="new-balance-preview">
                    {amountToAdd && !isNaN(parseFloat(amountToAdd)) && (
                      <div>
                        New Balance: ${(walletBalance + parseFloat(amountToAdd)).toFixed(2)}
                      </div>
                    )}
                  </div>
                  
                  <button 
                    type="submit" 
                    className="submit-add-funds"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Add Funds'}
                  </button>
                </form>
              </>
            ) : (
              <div className="payment-success">
                <h3>Payment Successful!</h3>
                <p>${amountToAdd} has been added to your wallet.</p>
                <p>Your new balance is ${walletBalance.toFixed(2)}</p>
                <div className="success-checkmark">✓</div>
              </div>
            )}
          </div>
        </div>
      )}

      <header className="client-jobs-header">
        <section className="header-title-area">
          <h1 className="main-title">Jobs for Clients</h1>
        </section>

        <section className="nav_section">
          <nav className="main-nav">
            <ul>
              <li><a href="/client">Home</a></li>
            </ul>
          </nav>
        </section>
      </header>

      <section className="payments-section">
        <div className="payments-header">
          <h2>Payments for Clients</h2>
          <div className="wallet-section">
            <div className="wallet-balance">
              <span className="wallet-label">Wallet Balance:</span>
              <span className="wallet-amount">${walletBalance.toFixed(2)}</span>
            </div>
            <button 
              className="add-funds-btn"
              onClick={handleAddFundsClick}
            >
              Add Funds
            </button>
          </div>
        </div>

        {/* Filters */}
        <section className="filters">
          <input type="text" placeholder="Search by freelancer or job title" />
          <select>
            <option>All</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Overdue</option>
          </select>
          <input type="date" />
          <input type="date" />
          <button>Export CSV</button>
        </section>

        {/* Payments Table */}
        <table className="payments-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Freelancer</th>
              <th>Milestone</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Website Redesign</td>
              <td>Jane Doe</td>
              <td>UI Mockups</td>
              <td>$300</td>
              <td><span className="status pending">Pending</span></td>
              <td>2025-04-20</td>
              <td>
                <button 
                  className="mark-paid-btn"
                  onClick={() => handlePayNow(300)}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
              </td>
            </tr>
            <tr>
              <td>Mobile App Development</td>
              <td>John Smith</td>
              <td>API Integration</td>
              <td>$500</td>
              <td><span className="status paid">Paid</span></td>
              <td>2025-04-15</td>
              <td><button className="view-receipt-btn">View Receipt</button></td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default ClientPayments;