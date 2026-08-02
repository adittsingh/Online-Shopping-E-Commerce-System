import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaTags,
  FaUsers,
  FaClipboardList,
  FaHome,
} from 'react-icons/fa';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <FaTachometerAlt />, end: true },
  { to: '/admin/products', label: 'Products', icon: <FaBoxOpen /> },
  { to: '/admin/categories', label: 'Categories', icon: <FaTags /> },
  { to: '/admin/users', label: 'Users', icon: <FaUsers /> },
  { to: '/admin/orders', label: 'Orders', icon: <FaClipboardList /> },
];

const AdminLayout = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <aside className="col-md-3 col-lg-2 bg-dark min-vh-100 p-0 admin-sidebar">
          <div className="p-3 text-white fw-bold border-bottom border-secondary">
            Admin Panel
          </div>
          <ul className="nav flex-column p-2">
            {navItems.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `nav-link text-white-50 d-flex align-items-center gap-2 ${
                      isActive ? 'bg-primary active fw-bold text-white' : ''
                    }`
                  }
                >
                  {item.icon} {item.label}
                </NavLink>
              </li>
            ))}
            <li className="nav-item mt-3">
              <Link to="/" className="nav-link text-white-50 d-flex align-items-center gap-2">
                <FaHome /> Back to Store
              </Link>
            </li>
          </ul>
        </aside>
        <main className="col-md-9 col-lg-10 py-4 px-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
