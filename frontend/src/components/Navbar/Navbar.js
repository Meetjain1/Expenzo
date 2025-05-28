import React, { useContext } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as BsIcons from 'react-icons/bs';
import * as BiIcons from 'react-icons/bi';
import * as AiIcons from 'react-icons/ai';
import { ThemeContext } from '../../context/ThemeContext';
import './Navbar.css';

const NavbarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const user = JSON.parse(localStorage.getItem('user'));
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="navbar-main" variant={theme}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand">
          <div className="brand-icon">E</div>
          <span className="brand-text">Expenzo</span>
        </Navbar.Brand>

        <Button 
          variant="link" 
          className="theme-toggle d-lg-none" 
          onClick={toggleTheme}
        >
          {theme === 'light' ? <BsIcons.BsMoon size={20} /> : <BsIcons.BsSun size={20} />}
        </Button>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {!isAuthPage && user ? (
              <>
                <Nav.Link as={Link} to="/dashboard">
                  <BiIcons.BiHome /> Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/transactions">
                  <BsIcons.BsListCheck /> All
                </Nav.Link>
                <Nav.Link as={Link} to="/add-transaction">
                  <AiIcons.AiOutlinePlus /> Add New
                </Nav.Link>
                <Nav.Link as={Link} to="/profile">
                  <BiIcons.BiUser /> Profile
                </Nav.Link>
                <Button 
                  variant="link" 
                  className="theme-toggle" 
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? <BsIcons.BsMoon size={20} /> : <BsIcons.BsSun size={20} />}
                </Button>
                <Button 
                  variant="outline-danger" 
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  <BiIcons.BiLogOut /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="link" 
                  className="theme-toggle" 
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? <BsIcons.BsMoon size={20} /> : <BsIcons.BsSun size={20} />}
                </Button>
                {!isAuthPage && (
                  <>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/register" className="signup-btn">
                      Sign Up
                    </Nav.Link>
                  </>
                )}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent; 