import React, { useEffect, useState } from 'react';
import '../stylesheets/FreelancerPayments.css';
import { ref, get } from "firebase/database";
import { applications_db } from '../firebaseConfig';

const FreelancerPayments = () => {
  const [payments, setPayments] = useState([]);
  const [wallet, setWallet] = useState(0);

  useEffect(() => {
    const savedWallet = localStorage.getItem("freelancerWallet");
    if (savedWallet) setWallet(parseFloat(savedWallet));

    const fetchAcceptedJobs = async () => {
      const userUID = localStorage.getItem("userUID");
      const acceptedRef = ref(applications_db, 'accepted_applications');

      try {
        const snapshot = await get(acceptedRef);
        const jobList = [];

        if (snapshot.exists()) {
          snapshot.forEach(parentSnap => {
            parentSnap.forEach(jobSnap => {
              const data = jobSnap.val();
              if (data.applicant_userUID === userUID && Array.isArray(data.job_milestones)) {
                data.job_milestones.forEach((milestone, index) => {
                  const id = jobSnap.key + "_ms_" + index;
                  const localStatus = JSON.parse(localStorage.getItem("freelancerDoneMilestones") || "{}")[id];
                  jobList.push({
                    id,
                    jobTitle: data.jobTitle,
                    client: data.clientName || 'Unknown',
                    milestone: milestone.description,
                    amount: milestone.amount,
                    status: localStatus ? 'Done' : milestone.status || 'Pending',
                    dueDate: milestone.dueDate || 'N/A'
                  });
                });
              }
            });
          });
          setPayments(jobList);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchAcceptedJobs();
  }, []);

  const handleMarkDone = (paymentId) => {
    const updatedList = payments.map(p => p.id === paymentId ? { ...p, status: 'Done' } : p);
    setPayments(updatedList);

    const doneList = JSON.parse(localStorage.getItem("freelancerDoneMilestones") || "{}");
    doneList[paymentId] = true;
    localStorage.setItem("freelancerDoneMilestones", JSON.stringify(doneList));
  };

  return (
    <main className="client-payments-main">
      <header className="client-jobs-header">
        <section className="header-title-area">
          <h1 className="main-title">Jobs for Freelancer</h1>
        </section>
        <section className="nav_section">
          <nav className="main-nav">
            <ul>
              <li><a href="/Freelancer">Home</a></li>
            </ul>
          </nav>
        </section>
      </header>

      <section className="payments-section">
        <h2>Payments for Freelancers</h2>

        <section className="wallet-section">
          <h3>Freelancer Wallet</h3>
          <p>Balance: ${wallet.toFixed(2)}</p>
        </section>

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

        <table className="payments-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Client</th>
              <th>Milestone</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id}>
                <td>{payment.jobTitle}</td>
                <td>{payment.client}</td>
                <td>{payment.milestone}</td>
                <td>${payment.amount}</td>
                <td><span className={`status ${payment.status.toLowerCase()}`}>{payment.status}</span></td>
                <td>{payment.dueDate}</td>
                <td>
                  {payment.status !== 'Done' && (
                    <button className="mark-paid-btn" onClick={() => handleMarkDone(payment.id)}>
                      Mark as Done
                    </button>
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
