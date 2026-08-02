import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import api from '../../api';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const statusBadge = {
  Pending: 'secondary',
  Processing: 'info',
  Shipped: 'warning',
  Delivered: 'success',
  Cancelled: 'danger',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailOrder, setDetailOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      setDetailOrder(null);
      await fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const togglePaid = async (order) => {
    try {
      if (order.isPaid) return;
      await api.put(`/orders/${order._id}/pay`);
      setDetailOrder(null);
      await fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className="fw-bold mb-4">Orders</h2>
      {error && (
        <div className="mb-3">
          <Message variant="danger">{error}</Message>
        </div>
      )}
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    No orders yet
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id}>
                    <td className="fw-bold">#{o._id.slice(-8).toUpperCase()}</td>
                    <td>{o.user?.name || 'N/A'}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="fw-bold">${o.totalPrice.toFixed(2)}</td>
                    <td>
                      {o.isPaid ? (
                        <span className="badge bg-success">Paid</span>
                      ) : (
                        <span className="badge bg-danger">Unpaid</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge bg-${statusBadge[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setDetailOrder(o)}
                      >
                        <FaEye className="me-1" /> Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detailOrder && (
        <div className="modal show d-block" tabIndex="-1" onClick={() => setDetailOrder(null)}>
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Order #{detailOrder._id.slice(-8).toUpperCase()}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDetailOrder(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Customer:</strong> {detailOrder.user?.name}{' '}
                    ({detailOrder.user?.email})
                  </div>
                  <div className="col-md-6">
                    <strong>Placed:</strong>{' '}
                    {new Date(detailOrder.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="mb-3">
                  <strong>Shipping:</strong> {detailOrder.shippingAddress.address},{' '}
                  {detailOrder.shippingAddress.city}{' '}
                  {detailOrder.shippingAddress.postalCode},{' '}
                  {detailOrder.shippingAddress.country}
                </div>
                <div className="mb-3">
                  <strong>Payment:</strong> {detailOrder.paymentMethod} -{' '}
                  {detailOrder.isPaid ? 'Paid' : 'Unpaid'}
                </div>
                <h6 className="fw-bold">Items</h6>
                {detailOrder.items.map((item, idx) => (
                  <div key={idx} className="d-flex justify-content-between small mb-1">
                    <span>
                      {item.name} x {item.qty}
                    </span>
                    <strong>${(item.price * item.qty).toFixed(2)}</strong>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Total</span>
                  <span className="fw-bold text-primary">
                    ${detailOrder.totalPrice.toFixed(2)}
                  </span>
                </div>
                <hr />
                <label className="form-label fw-bold">Update Status</label>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(
                    (s) => (
                      <button
                        key={s}
                        className={`btn btn-sm ${
                          detailOrder.status === s
                            ? 'btn-primary'
                            : 'btn-outline-secondary'
                        }`}
                        onClick={() => updateStatus(detailOrder._id, s)}
                      >
                        {s}
                      </button>
                    )
                  )}
                </div>
                {!detailOrder.isPaid && detailOrder.status !== 'Cancelled' && (
                  <button
                    className="btn btn-success"
                    onClick={() => togglePaid(detailOrder)}
                  >
                    Mark as Paid
                  </button>
                )}
                <Link
                  to={`/order/${detailOrder._id}`}
                  className="btn btn-outline-primary ms-2"
                >
                  View Order Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
