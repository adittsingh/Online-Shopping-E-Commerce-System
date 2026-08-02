import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen } from 'react-icons/fa';
import api from '../api';
import Loader from '../components/Loader';
import Message from '../components/Message';

const statusBadge = {
  Pending: 'secondary',
  Processing: 'info',
  Shipped: 'warning',
  Delivered: 'success',
  Cancelled: 'danger',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my');
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-4">
        <FaBoxOpen className="text-primary me-2" /> My Orders
      </h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : orders.length === 0 ? (
        <Message variant="info">
          You have no orders yet.{' '}
          <Link to="/" className="text-primary">
            Start shopping
          </Link>
        </Message>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td className="fw-bold">
                      #{o._id.slice(-8).toUpperCase()}
                    </td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>{o.items.reduce((a, i) => a + i.qty, 0)}</td>
                    <td className="fw-bold">${o.totalPrice.toFixed(2)}</td>
                    <td>
                      <span className={`badge bg-${statusBadge[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td>
                      {o.isPaid ? (
                        <span className="text-success">Paid</span>
                      ) : (
                        <span className="text-danger">Unpaid</span>
                      )}
                    </td>
                    <td>
                      <Link to={`/order/${o._id}`} className="btn btn-sm btn-primary">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
