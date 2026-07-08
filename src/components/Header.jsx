import React from "react";

function Header({ activePage, setActivePage }) {
  return (
    <header className="header">
      <div className="header-brand">
        <span className="header-logo">◆</span>
        <span className="header-title">UserDesk</span>
      </div>
      <nav className="header-nav">
        <button
          className={activePage === "home" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActivePage("home")}
        >
          Users
        </button>
        <button
          className={activePage === "contact" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActivePage("contact")}
        >
          Contact Us
        </button>
      </nav>
    </header>
  );
}

export default Header;