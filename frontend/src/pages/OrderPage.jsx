import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaTruck } from 'react-icons/fa';
import api from '../api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { formatINR } from '../utils/format';

const statusBadge = {
  Pending: 'secondary',
  Processing: 'info',
  Shipped: 'warning',
  Delivered: 'success',
  Cancelled: 'danger',
};

const OrderPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const markPaid = async () => {
    setPaying(true);
    try {
      const { data } = await api.put(`/orders/${id}/pay`);
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!order) return <Message variant="info">Order not found.</Message>;

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-4">Order #{order._id.slice(-8).toUpperCase()}</h2>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-3">
            <div className="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
              <span>Status</span>
              <span className={`badge bg-${statusBadge[order.status]}`}>
                {order.status}
              </span>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Order Placed:</span>
                <strong>{new Date(order.createdAt).toLocaleString()}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Payment:</span>
                <strong className={order.isPaid ? 'text-success' : 'text-danger'}>
                  {order.isPaid
                    ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}`
                    : 'Not Paid'}
                </strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery:</span>
                <strong className={order.isDelivered ? 'text-success' : 'text-danger'}>
                  {order.isDelivered
                    ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`
                    : 'Not Delivered'}
                </strong>
              </div>
              {!order.isPaid && order.status !== 'Cancelled' && (
                <button
                  className="btn btn-success w-100 mt-2"
                  onClick={markPaid}
                  disabled={paying}
                >
                  {paying ? <Loader /> : (
                    <>
                      <FaCheckCircle className="me-1" /> Mark as Paid
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="card shadow-sm mb-3">
            <div className="card-header bg-white fw-bold">
              <FaTruck className="me-1" /> Shipping Address
            </div>
            <div className="card-body">
              {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </div>
          </div>
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">Order Items</div>
            <div className="card-body">
              {order.items.map((item) => (
                <div key={item.product} className="d-flex align-items-center mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                  <div className="ms-3 flex-grow-1">
                    <Link
                      to={`/product/${item.product}`}
                      className="fw-bold text-decoration-none text-dark"
                    >
                      {item.name}
                    </Link>
                    <div className="small text-muted">
                      {formatINR(item.price)} x {item.qty}
                    </div>
                  </div>
                  <strong>{formatINR(item.price * item.qty)}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">Summary</div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Items</span>
                <strong>{formatINR(order.itemsPrice)}</strong>
              </div>
              {order.discountAmount > 0 && (
                <>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Voucher Discount</span>
                    <strong className="text-success">
                      -{formatINR(order.discountAmount)}
                    </strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Voucher Code</span>
                    <strong className="voucher-code text-success">
                      {order.voucherCode}
                    </strong>
                  </div>
                </>
              )}
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <strong>
                  {order.shippingPrice === 0
                    ? 'Free'
                    : formatINR(order.shippingPrice)}
                </strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax</span>
                <strong>{formatINR(order.taxPrice)}</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span className="text-primary">
                  {formatINR(order.totalPrice)}
                </span>
              </div>
              <Link to="/orders" className="btn btn-outline-secondary w-100 mt-3">
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
