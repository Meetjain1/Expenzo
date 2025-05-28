import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import * as BiIcons from 'react-icons/bi';
import * as BsIcons from 'react-icons/bs';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './Transactions.css';

const host = "http://localhost:8080";
const getTransactions = `${host}/api/v1/getTransaction`;
const updateTransaction = `${host}/api/v1/updateTransaction`;
const deleteTransaction = `${host}/api/v1/deleteTransaction`;

const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editValues, setEditValues] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    transactionType: '',
    date: '',
  });
  const [hasChanges, setHasChanges] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        toast.error('User not found, please login again.');
        navigate('/login');
        return;
      }
      const { data } = await axios.post(getTransactions, {
        userId: user._id,
        frequency,
        type,
        startDate,
        endDate,
      });
      setTransactions(data.transactions);
    } catch (error) {
      toast.error('Failed to fetch transactions');
    }
  }, [frequency, type, startDate, endDate, navigate]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
    } else {
      fetchTransactions();
    }
  }, [navigate, fetchTransactions]);

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setEditValues({
      title: transaction.title,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      transactionType: transaction.transactionType,
      date: transaction.date.split('T')[0],
    });
    setShowEditModal(true);
    setHasChanges(false);
  };

  const handleDeleteClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteModal(true);
  };

  const handleEditSubmit = async () => {
    if (!hasChanges) {
      toast.info('No changes detected');
      return;
    }

    try {
      const { data } = await axios.put(`${updateTransaction}/${selectedTransaction._id}`, editValues);
      if (data.success) {
        toast.success('Transaction updated successfully');
        setShowEditModal(false);
        fetchTransactions();
      }
    } catch (error) {
      toast.error('Failed to update transaction');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const { data } = await axios.post(`${deleteTransaction}/${selectedTransaction._id}`, {
        userId: user._id,
      });
      if (data.success) {
        toast.success('Transaction deleted successfully');
        setShowDeleteModal(false);
        fetchTransactions();
      }
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues(prev => {
      const newValues = { ...prev, [name]: value };
      const hasChanges = Object.keys(newValues).some(key => 
        String(newValues[key]) !== String(selectedTransaction[key])
      );
      setHasChanges(hasChanges);
      return newValues;
    });
  };

  const handleDateChange = ([start, end]) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("7");
  };

  return (
    <div className="transactions-container">
      <Container>
        <Row>
          <Col md={3}>
            <div className="filters-section">
              <h4>Filters</h4>
              <Form.Group className="mb-4">
                <Form.Label>Select Frequency</Form.Label>
                <Form.Select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="7">Last Week</option>
                  <option value="30">Last Month</option>
                  <option value="365">Last Year</option>
                  <option value="custom">Custom</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </Form.Select>
              </Form.Group>

              {frequency === 'custom' && (
                <Form.Group className="mb-4">
                  <Form.Label>Date Range</Form.Label>
                  <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={handleDateChange}
                    className="form-control"
                    placeholderText="Select date range"
                  />
                </Form.Group>
              )}

              <Button variant="primary" onClick={handleReset} className="w-100">
                Reset Filters
              </Button>
            </div>
          </Col>

          <Col md={9}>
            <Card className="transactions-card">
              <Card.Body>
                <div className="transactions-header">
                  <h2 className="transactions-title">Transactions</h2>
                </div>

                <Table hover responsive className="table-borderless">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction._id}>
                        <td data-label="Date">{new Date(transaction.date).toLocaleDateString()}</td>
                        <td data-label="Title">{transaction.title}</td>
                        <td data-label="Category">{transaction.category}</td>
                        <td data-label="Amount">₹{transaction.amount}</td>
                        <td data-label="Type">
                          <span className={`transaction-type ${transaction.transactionType === 'income' ? 'income' : 'expense'}`}>
                            {transaction.transactionType === 'income' ? 'Income' : 'Expense'}
                          </span>
                        </td>
                        <td data-label="Actions">
                          <div className="action-buttons">
                            <Button
                              variant="link"
                              className="btn-icon btn-edit"
                              onClick={() => handleEditClick(transaction)}
                            >
                              <BiIcons.BiEdit />
                            </Button>
                            <Button
                              variant="link"
                              className="btn-icon btn-delete"
                              onClick={() => handleDeleteClick(transaction)}
                            >
                              <BsIcons.BsTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        style={{ color: 'var(--text-color)' }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editValues.title}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={editValues.amount}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={editValues.category}
                onChange={handleInputChange}
              >
                <option value="">Choose...</option>
                <option value="Groceries">Groceries</option>
                <option value="Rent">Rent</option>
                <option value="Salary">Salary</option>
                <option value="Tip">Tip</option>
                <option value="Food">Food</option>
                <option value="Medical">Medical</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transportation">Transportation</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editValues.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Transaction Type</Form.Label>
              <Form.Select
                name="transactionType"
                value={editValues.transactionType}
                onChange={handleInputChange}
              >
                <option value="">Choose...</option>
                <option value="credit">Income</option>
                <option value="expense">Expense</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={editValues.date}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className="button-group">
            <Button
              variant="secondary"
              onClick={() => setShowEditModal(false)}
              className="btn-action btn-cancel"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEditSubmit}
              disabled={!hasChanges}
              className="btn-action btn-save"
            >
              Save Changes
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this transaction?
        </Modal.Body>
        <Modal.Footer>
          <div className="button-group">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              className="btn-action btn-cancel"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              className="btn-action btn-save"
            >
              Delete
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Transactions; 