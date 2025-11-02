// components/Dashboard/StatsCards/StatsCards.js
import React from 'react';

import './StatsCards.css';

const StatsCards = ({ stats }) => {
  const statItems = [
    { key: 'review', label: 'Reading Review', icon: 'fas fa-search', color: 'review' },
    { key: 'checker', label: 'With Checker', icon: 'fas fa-user-check', color: 'checker' },
    { key: 'approved', label: 'Approved', icon: 'fas fa-check', color: 'approved' },
    { key: 'rejected', label: 'Rejected', icon: 'fas fa-times', color: 'rejected' }
  ];

  return (
    <div className="stats-container">
      {statItems.map(item => (
        <div key={item.key} className="stat-card">
          <div className="stat-header">
            <div className="stat-title">{item.label}</div>
            <div className={`stat-icon ${item.color}`}>
              <i className={item.icon}></i>
            </div>
          </div>
          <div className="stat-value">{stats[item.key]}</div>
          <div className="stat-change">+0 from yesterday</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;