import React, { useState } from "react";
import "./Navbar.css";
import { FiMenu } from "react-icons/fi";
import contactImg from "/contact.png";
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const handleContactClick = () => {
    if (isHomePage) {
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate("/");
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav className="navbar">
      <RouterLink to="/" className="logoText"><span>M</span>edi<span>M</span>ate.</RouterLink>
      
      <div className="desktopMenu">
        {isHomePage ? (
          <>
            <ScrollLink activeClass='active' to='home' spy={true} smooth={true} offset={-100} duration={500} className="desktopMenuListItem">Home</ScrollLink>
            <ScrollLink activeClass='active' to='features' spy={true} smooth={true} offset={-50} duration={500} className="desktopMenuListItem">Features</ScrollLink>
            <ScrollLink activeClass='active' to='uses' spy={true} smooth={true} offset={-50} duration={500} className="desktopMenuListItem">How to use</ScrollLink>
            <ScrollLink activeClass='active' to='about' spy={true} smooth={true} offset={-80} duration={500} className="desktopMenuListItem">About Us</ScrollLink>
          </>
        ) : (
          <>
            <RouterLink to="/" className="desktopMenuListItem">Home</RouterLink>
          </>
        )}
        <RouterLink 
          to="/chat" 
          className={`desktopMenuListItem ${location.pathname === "/chat" ? "active-route" : ""}`}
        >
          Chat Assistant
        </RouterLink>
        <RouterLink 
          to="/dashboard" 
          className={`desktopMenuListItem ${location.pathname === "/dashboard" ? "active-route" : ""}`}
        >
          Health Dashboard
        </RouterLink>
      </div>

      <button className="desktopMenuBtn" onClick={handleContactClick}>
        <img src={contactImg} className="desktopMenuImg" alt="contact" />Contact Us
      </button>

      <div className="mobMenu" onClick={() => setShowMenu(!showMenu)}><FiMenu /></div>
      <div className="navMenu" style={{ display: showMenu ? 'flex' : 'none' }}>
        {isHomePage ? (
          <>
            <ScrollLink activeClass='active' to='home' spy={true} smooth={true} offset={-100} duration={500} className="listItem" onClick={() => setShowMenu(false)}>Home</ScrollLink>
            <ScrollLink activeClass='active' to='features' spy={true} smooth={true} offset={-50} duration={500} className="listItem" onClick={() => setShowMenu(false)}>Features</ScrollLink>
            <ScrollLink activeClass='active' to='uses' spy={true} smooth={true} offset={-50} duration={500} className="listItem" onClick={() => setShowMenu(false)}>How to use</ScrollLink>
            <ScrollLink activeClass='active' to='about' spy={true} smooth={true} offset={-80} duration={500} className="listItem" onClick={() => setShowMenu(false)}>About Us</ScrollLink>
          </>
        ) : (
          <RouterLink to="/" className="listItem" onClick={() => setShowMenu(false)}>Home</RouterLink>
        )}
        <RouterLink to="/chat" className="listItem" onClick={() => setShowMenu(false)}>Chat Assistant</RouterLink>
        <RouterLink to="/dashboard" className="listItem" onClick={() => setShowMenu(false)}>Health Dashboard</RouterLink>
      </div>
    </nav>
  );
}

export default Navbar;
