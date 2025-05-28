import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import "./home.css";
import { getTransactions } from "../../utils/ApiRequest";
import axios from "axios";
import Spinner from "../../components/Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import * as BiIcons from 'react-icons/bi';
import * as BsIcons from 'react-icons/bs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const handleDateChange = ([start, end]) => {
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    const avatarFunc = async () => {
      if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user);

        if (user.isAvatarImageSet === false || user.avatarImage === "") {
          navigate("/setAvatar");
        }
        setRefresh(true);
      } else {
        navigate("/login");
      }
    };

    avatarFunc();
  }, [navigate]);

  const handleChangeFrequency = (e) => {
    setFrequency(e.target.value);
  };

  const handleSetType = (e) => {
    setType(e.target.value);
  };

  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("7");
  };

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?._id) {
          navigate("/login");
          return;
        }
        
        const { data } = await axios.post(getTransactions, {
          userId: user._id,
          frequency: frequency,
          startDate: startDate,
          endDate: endDate,
          type: type,
        });
  
        setTransactions(data.transactions);
        calculateTotals(data.transactions);
  
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTransactions();
  }, [refresh, frequency, endDate, type, startDate, navigate]);

  const calculateTotals = (transactions) => {
    let income = 0;
    let expense = 0;

    transactions.forEach((transaction) => {
      if (transaction.transactionType === "income") {
        income += transaction.amount;
      } else if (transaction.transactionType === "expense") {
        expense += transaction.amount;
      }
    });

    setTotalIncome(income);
    setTotalExpense(expense);
  };

  const categoryData = () => {
    const categories = {};
    transactions.forEach((transaction) => {
      if (transaction.transactionType === "expense") {
        categories[transaction.category] = (categories[transaction.category] || 0) + transaction.amount;
      }
    });

    return {
      labels: Object.keys(categories),
      datasets: [
        {
          data: Object.values(categories),
          backgroundColor: [
            '#6366f1',
            '#22c55e',
            '#ef4444',
            '#f59e0b',
            '#3b82f6',
            '#ec4899',
            '#8b5cf6',
          ],
        },
      ],
    };
  };

  const timelineData = () => {
    const dates = {};
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      if (!dates[date]) {
        dates[date] = { income: 0, expense: 0 };
      }
      if (transaction.transactionType === "income") {
        dates[date].income += transaction.amount;
      } else if (transaction.transactionType === "expense") {
        dates[date].expense += transaction.amount;
      }
    });

    return {
      labels: Object.keys(dates),
      datasets: [
        {
          label: 'Income',
          data: Object.values(dates).map(d => d.income),
          borderColor: '#22c55e',
          tension: 0.4,
        },
        {
          label: 'Expense',
          data: Object.values(dates).map(d => d.expense),
          borderColor: '#ef4444',
          tension: 0.4,
        },
      ],
    };
  };

  return (
    <div className="home-container">
      {loading ? (
        <Spinner />
      ) : (
        <Container className="mt-4">
          <Row>
            <Col md={3} className="filters-sidebar">
              <div className="filters-section">
                <h4>Filters</h4>
                <Form.Group className="mb-4">
                  <Form.Label>Select Frequency</Form.Label>
                  <Form.Select
                    name="frequency"
                    value={frequency}
                    onChange={handleChangeFrequency}
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
                    name="type"
                    value={type}
                    onChange={handleSetType}
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
              <Container className="dashboard-container">
                <Row className="summary-cards g-4">
                  <Col md={3}>
                    <Card className="summary-card">
                      <Card.Body>
                        <div className="summary-icon total">
                          <BiIcons.BiWallet />
                        </div>
                        <h3>Total Transactions</h3>
                        <h2>{transactions.length}</h2>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="summary-card">
                      <Card.Body>
                        <div className="summary-icon income">
                          <BiIcons.BiUpArrowCircle />
                        </div>
                        <h3>Total Income</h3>
                        <h2>₹{totalIncome}</h2>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="summary-card">
                      <Card.Body>
                        <div className="summary-icon expense">
                          <BiIcons.BiDownArrowCircle />
                        </div>
                        <h3>Total Expense</h3>
                        <h2>₹{totalExpense}</h2>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="summary-card">
                      <Card.Body>
                        <div className="summary-icon balance">
                          <BsIcons.BsCashStack />
                        </div>
                        <h3>Balance</h3>
                        <h2>₹{totalIncome - totalExpense}</h2>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row className="mt-5 g-4">
                  <Col lg={8}>
                    <Card className="chart-card">
                      <Card.Body>
                        <h3>Income vs Expense Timeline</h3>
                        {transactions.length > 0 && (
                          <Line
                            data={timelineData()}
                            options={{
                              responsive: true,
                              plugins: {
                                legend: {
                                  position: 'top',
                                },
                              },
                              scales: {
                                y: {
                                  beginAtZero: true,
                                },
                              },
                            }}
                          />
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={4}>
                    <Card className="chart-card">
                      <Card.Body>
                        <h3>Expense by Category</h3>
                        {transactions.length > 0 && (
                          <Doughnut
                            data={categoryData()}
                            options={{
                              responsive: true,
                              plugins: {
                                legend: {
                                  position: 'bottom',
                                },
                              },
                            }}
                          />
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default Home;
