import React, { useState } from 'react';
import '../stylesheets/FreelancerPayments.css';

const FreelancerPayments = () => {
  const [walletBalance, setWalletBalance] = useState(500); // Starting balance
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'deposit', amount: 500, date: '2025-03-15', description: 'Initial balance' },
  ]);
  const [payments, setPayments] = useState([
    {
      id: 1,
      jobTitle: 'Website Redesign',
      client: 'Acme Corp',
      milestone: 'UI Mockups',
      amount: 300,
      status: 'Pending',
      dueDate: '2025-04-20',
      done: false
    },
    {
      id: 2,
      jobTitle: 'Mobile App',
      client: 'Tech Solutions',
      milestone: 'API Integration',
      amount: 450,
      status: 'Pending',
      dueDate: '2025-04-25',
      done: false
    }
  ]);

  const markAsDone = (id) => {
    setPayments(prev =>
      prev.map(payment =>
        payment.id === id ? { ...payment, done: true } : payment
      )
    );
  };

  const receivePayment = (id) => {
    const payment = payments.find(p => p.id === id);
    if (payment && payment.done && payment.status !== 'Paid') {
      const newBalance = walletBalance + payment.amount;
      setWalletBalance(newBalance);
      
      setTransactions(prev => [
        ...prev,
        {
          id: Date.now(),
          type: 'payment',
          amount: payment.amount,
          date: new Date().toISOString().split('T')[0],
          description: `Payment for ${payment.jobTitle} - ${payment.milestone}`
        }
      ]);
      
      setPayments(prev =>
        prev.map(p =>
          p.id === id ? { ...p, status: 'Paid' } : p
        )
      );
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (amount > walletBalance) {
      alert('Insufficient funds');
      return;
    }

    const newBalance = walletBalance - amount;
    setWalletBalance(newBalance);
    
    setTransactions(prev => [
      ...prev,
      {
        id: Date.now(),
        type: 'withdrawal',
        amount: -amount,
        date: new Date().toISOString().split('T')[0],
        description: 'Withdrawal to bank account'
      }
    ]);
    
    setWithdrawAmount('');
    setShowWithdrawModal(false);
    alert(`Successfully withdrew $${amount.toFixed(2)}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <main className="freelancer-payments-main">
      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="modal-overlay">
          <div className="withdraw-modal">
            <h3>Withdraw Funds</h3>
            <div className="current-balance">Available: ${walletBalance.toFixed(2)}</div>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
            <div className="modal-actions">
              <button onClick={() => setShowWithdrawModal(false)}>Cancel</button>
              <button onClick={handleWithdraw}>Withdraw</button>
            </div>
          </div>
        </div>
      )}

      <header className="freelancer-jobs-header">
        <section className="header-title-area">
          <h1 className="main-title">Freelancer Dashboard</h1>
        </section>
      </header>

      <section className="wallet-section">
        <div className="wallet-card">
          <h3>Your Wallet</h3>
          <div className="wallet-balance">${walletBalance.toFixed(2)}</div>
          <div className="wallet-actions">
            <button 
              className="withdraw-btn"
              onClick={() => setShowWithdrawModal(true)}
            >
              Withdraw Funds
            </button>
          </div>
        </div>

        <div className="transaction-history">
          <h4>Recent Transactions</h4>
          {transactions.length > 0 ? (
            <ul>
              {transactions.slice().reverse().map(transaction => (
                <li key={transaction.id} className={transaction.type}>
                  <div className="transaction-details">
                    <span className="transaction-description">{transaction.description}</span>
                    <span className="transaction-date">{formatDate(transaction.date)}</span>
                  </div>
                  <div className={`transaction-amount ${transaction.type}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No transactions yet</p>
          )}
        </div>
      </section>

      <section className="payments-section">
        <h2>Pending Payments</h2>

        <table className="payments-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Client</th>
              <th>Milestone</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id}>
                <td>{payment.jobTitle}</td>
                <td>{payment.client}</td>
                <td>{payment.milestone}</td>
                <td>${payment.amount.toFixed(2)}</td>
                <td>
                  <span className={`status ${payment.status.toLowerCase()}`}>
                    {payment.status}
                  </span>
                </td>
                <td>{formatDate(payment.dueDate)}</td>
                <td className="actions-cell">
                  {payment.status === 'Pending' && !payment.done && (
                    <button 
                      className="mark-done-btn"
                      onClick={() => markAsDone(payment.id)}
                    >
                      Mark as Done
                    </button>
                  )}
                  {payment.done && payment.status !== 'Paid' && (
                    <button 
                      className="receive-payment-btn"
                      onClick={() => receivePayment(payment.id)}
                    >
                      Receive Payment
                    </button>
                  )}
                  {payment.status === 'Paid' && (
                    <span className="paid-label">Payment Received</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default FreelancerPayments;