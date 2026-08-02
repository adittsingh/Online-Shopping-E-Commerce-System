import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBoxOpen,
  FaTags,
  FaUsers,
  FaClipboardList,
  FaDollarSign,
  FaExclamationTriangle,
} from 'react-icons/fa';
import api from '../../api';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/stats');
        setStats(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchStats();
  }, []);

  if (error) return <Message variant="danger">{error}</Message>;
  if (!stats) return <Loader />;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: <FaUsers />, color: 'primary' },
    { label: 'Total Products', value: stats.totalProducts, icon: <FaBoxOpen />, color: 'info' },
    { label: 'Categories', value: stats.totalCategories, icon: <FaTags />, color: 'warning' },
    { label: 'Total Orders', value: stats.totalOrders, icon: <FaClipboardList />, color: 'secondary' },
    { label: 'Revenue', value: `$${Number(stats.totalRevenue).toFixed(2)}`, icon: <FaDollarSign />, color: 'success' },
  ];

  return (
    <div>
      <h2 className="fw-bold mb-4">Dashboard</h2>
      <div className="row g-3 mb-4">
        {cards.map((c) => (
          <div className="col-6 col-md-4 col-xl-3" key={c.label}>
            <div className={`card bg-${c.color} text-white shadow-sm`}>
              <div className="card-body d-flex align-items-center">
                <div className="fs-1 me-3">{c.icon}</div>
                <div>
                  <div className="fs-4 fw-bold">{c.value}</div>
                  <div className="small opacity-75">{c.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">Recent Orders</div>
            <div className="table-responsive">
              <table className="table table-sm table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-3">
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    stats.recentOrders.map((o) => (
                      <tr key={o._id}>
                        <td>#{o._id.slice(-6).toUpperCase()}</td>
                        <td>{o.user?.name || 'N/A'}</td>
                        <td>${o.totalPrice.toFixed(2)}</td>
                        <td>
                          <span className={`badge bg-${o.isDelivered ? 'success' : o.isPaid ? 'info' : 'secondary'}`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold d-flex align-items-center">
              <FaExclamationTriangle className="text-warning me-2" /> Low Stock
              Products
            </div>
            <div className="card-body">
              {stats.lowStock.length === 0 ? (
                <p className="text-muted mb-0">All products are well stocked.</p>
              ) : (
                stats.lowStock.map((p) => (
                  <div
                    key={p._id}
                    className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2"
                  >
                    <div>
                      <div className="fw-bold">{p.name}</div>
                      <small className="text-muted">${p.price.toFixed(2)}</small>
                    </div>
                    <span
                      className={`badge ${p.countInStock === 0 ? 'bg-danger' : 'bg-warning text-dark'}`}
                    >
                      {p.countInStock} left
                    </span>
                  </div>
                ))
              )}
              <Link
                to="/admin/products"
                className="btn btn-outline-primary btn-sm w-100 mt-2"
              >
                Manage Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
