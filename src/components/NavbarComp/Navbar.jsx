import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <a href="/">MyLibrary</a>
        </div>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <a href="/" className="navbar-link">Home</a>
          </li>
          <li className="navbar-item">
            <a href="/books" className="navbar-link">Books</a>
          </li>
          <li className="navbar-item">
            <a href="/add-book" className="navbar-link">Add Book</a>
          </li>
          <li className="navbar-item">
            <a href="/orders" className="navbar-link">Orders</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
