// components/Sidebar/Sidebar.js
import React from 'react';
import './Sidebar.css';
const Sidebar = ({ sidebarOpen, currentPage, setCurrentPage }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { id: 'applications', label: 'Applications', icon: 'fas fa-file-alt' },
    
  ];

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">Maker Portal</div>
      </div>
      <ul className="nav-menu">
        {menuItems.map(item => (
          <li 
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;