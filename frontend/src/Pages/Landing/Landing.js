import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Landing.css';
import { FaArrowRight } from 'react-icons/fa';

const Landing = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="landing-page">
      <div className="landing-bg-shapes"></div>
      <Container>
        <Row className="align-items-center min-vh-100 justify-content-center">
          <Col md={7} className="d-flex flex-column justify-content-center align-items-start">
            <div className="glass-card p-5 mb-4">
              <h1 className="landing-title">
                The <span className="highlight">Smarter</span><br />
                Expense <span className="highlight">Tracking</span> App
              </h1>
              <p className="subtitle">
                Track your expenses, manage your budget, and achieve your financial goals all in one place.<br />
                Take control of your finances today.
              </p>
              <Link to={user ? "/dashboard" : "/register"}>
                <Button className="cta-button animate-cta">
                  Start Tracking <FaArrowRight className="ms-2" />
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Landing; 