import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import * as BiIcons from 'react-icons/bi';
import './Profile.css';
import config from '../../config/config';

const editProfile = `${config.apiUrl}/api/auth/editProfile`;

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editValues, setEditValues] = useState({
    name: '',
    lastName: '',
    email: '',
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
    } else {
      setUser(userData);
      setEditValues({
        name: userData.name || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
      });
    }
  }, [navigate]);

  const handleEditClick = () => {
    setShowEditModal(true);
    setHasChanges(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues(prev => {
      const newValues = { ...prev, [name]: value };
      const hasChanges = 
        newValues.name !== user.name ||
        newValues.lastName !== user.lastName ||
        newValues.email !== user.email;
      setHasChanges(hasChanges);
      return newValues;
    });
  };

  const handleSubmit = async () => {
    if (!hasChanges) {
      toast.info('No changes detected');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Updating profile for user:', user, 'with values:', editValues);
      const { data } = await axios.put(`${editProfile}/${user._id}`, editValues);
      if (data.success) {
        const updatedUser = { ...user, ...editValues };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        toast.success('Profile updated successfully');
        setShowEditModal(false);
        setHasChanges(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowEditModal(false);
    setEditValues({
      name: user.name || '',
      lastName: user.lastName || '',
      email: user.email || '',
    });
    setHasChanges(false);
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <Card.Body>
          <div className="profile-header">
            <div className="profile-avatar">
              <BiIcons.BiUser />
            </div>
            <h2>Profile</h2>
          </div>

          <div className="profile-info">
            <div className="info-group">
              <label>Name</label>
              <p>{user.name}</p>
            </div>
            <div className="info-group">
              <label>Last Name</label>
              <p>{user.lastName || '-'}</p>
            </div>
            <div className="info-group">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleEditClick}
            className="edit-profile-btn"
          >
            <BiIcons.BiEdit className="me-2" />
            Edit Profile
          </Button>
        </Card.Body>
      </Card>

      <Modal
        show={showEditModal}
        onHide={handleClose}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editValues.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={editValues.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editValues.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className="button-group">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
              className="btn-action btn-cancel"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!hasChanges || isSubmitting}
              className="btn-action btn-save"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile; 