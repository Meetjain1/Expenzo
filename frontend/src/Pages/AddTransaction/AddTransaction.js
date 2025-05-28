import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import * as BiIcons from 'react-icons/bi';
import * as BsIcons from 'react-icons/bs';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import config from '../../config/config';
import './AddTransaction.css';

const addTransaction = `${config.apiUrl}/api/v1/addTransaction`;

const CATEGORY_ICONS = {
  'Groceries': <BiIcons.BiCart className="category-icon" />,
  'Rent': <BiIcons.BiHome className="category-icon" />,
  'Salary': <FaIcons.FaMoneyBillWave className="category-icon" />,
  'Tip': <BiIcons.BiDollar className="category-icon" />,
  'Food': <BiIcons.BiRestaurant className="category-icon" />,
  'Medical': <FaIcons.FaFirstAid className="category-icon" />,
  'Utilities': <MdIcons.MdElectricBolt className="category-icon" />,
  'Entertainment': <MdIcons.MdLocalMovies className="category-icon" />,
  'Transportation': <MdIcons.MdDirectionsCar className="category-icon" />,
  'Other': <BsIcons.BsThreeDots className="category-icon" />,
};

const AddTransaction = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    title: '',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    transactionType: '',
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (category) => {
    setValues(prev => ({ ...prev, category }));
  };

  const handleTypeSelect = (type) => {
    console.log('Selected transaction type:', type);
    setValues(prev => {
      const newValues = { ...prev, transactionType: type };
      console.log('Updated values:', newValues);
      return newValues;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, amount, category, date, transactionType } = values;
    console.log('Submitting transaction with type:', transactionType);

    if (!title || !amount || !category || !date || !transactionType) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        toast.error('Please login to add transactions');
        navigate('/login');
        return;
      }

      const requestData = {
        ...values,
        userId: user._id,
        transactionType: transactionType.toLowerCase(), // Ensure consistent case
      };
      console.log('Sending request with data:', requestData);

      const { data } = await axios.post(addTransaction, requestData);

      if (data.success) {
        toast.success(data.message || 'Transaction added successfully');
        navigate('/transactions');
      }
    } catch (error) {
      console.error('Add transaction error:', error);
      toast.error(error.response?.data?.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/transactions');
  };

  return (
    <div className="add-transaction-container">
      <div className="add-transaction-card">
        <div className="add-transaction-header">
          <h2>Add New Transaction</h2>
        </div>

        <form onSubmit={handleSubmit} className="add-transaction-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Enter transaction title"
              value={values.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              className="form-control"
              placeholder="Enter amount"
              value={values.amount}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <div className="category-select">
              {Object.entries(CATEGORY_ICONS).map(([category, icon]) => (
                <div
                  key={category}
                  className={`category-option ${values.category === category ? 'selected' : ''}`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {icon}
                  <span className="category-name">{category}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Transaction Type</label>
            <div className="transaction-type-group">
              <div
                className={`transaction-type-option income ${values.transactionType === 'income' ? 'selected' : ''}`}
                onClick={() => handleTypeSelect('income')}
              >
                <BiIcons.BiUpArrowCircle className="transaction-type-icon" />
                Income
              </div>
              <div
                className={`transaction-type-option expense ${values.transactionType === 'expense' ? 'selected' : ''}`}
                onClick={() => handleTypeSelect('expense')}
              >
                <BiIcons.BiDownArrowCircle className="transaction-type-icon" />
                Expense
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              className="form-control"
              value={values.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              name="description"
              className="form-control"
              placeholder="Add a description"
              value={values.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="button-group">
            <button
              type="button"
              className="btn-action btn-cancel"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-action btn-save"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction; 