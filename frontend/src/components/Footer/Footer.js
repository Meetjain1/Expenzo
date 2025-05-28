import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import * as FaIcons from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const location = useLocation();
  
  // Don't show footer on login and register pages with particles background
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  if (isAuthPage) return null;

  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center">
          <Col md={4} className="text-center text-md-start">
            <h5> Meet Jain</h5>
            <p className="mb-0">© {new Date().getFullYear()} All rights reserved</p>
          </Col>
          <Col md={4} className="text-center my-3 my-md-0">
            <div className="footer-logo">E</div>
          </Col>
          <Col md={4} className="text-center text-md-end">
            <div className="social-links">
              <a href="https://github.com/Meetjain1" target="_blank" rel="noopener noreferrer">
                <FaIcons.FaGithub />
              </a>
              <a href="https://twitter.com/Meetjain_100" target="_blank" rel="noopener noreferrer">
                <FaIcons.FaTwitter />
              </a>
              <a href="https://www.linkedin.com/in/meet-jain-413015265" target="_blank" rel="noopener noreferrer">
                <FaIcons.FaLinkedin />
              </a>
              <a href="https://www.instagram.com/m.jain_17" target="_blank" rel="noopener noreferrer">
                <FaIcons.FaInstagram />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 