import React, { useState, useEffect } from 'react';
import { FaUserCog } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
    setAddress(user?.address || '');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (password !== confirm) {
      setMessage('danger:Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await updateProfile({
        name,
        email,
        phone,
        address,
        ...(password ? { password } : {}),
      });
      setMessage('success:Profile updated successfully');
      setPassword('');
      setConfirm('');
    } catch (err) {
      setMessage(`danger:${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const parseMsg = () => {
    if (!message) return null;
    const [variant, ...rest] = message.split(':');
    return (
      <Message variant={variant}>
        {rest.join(':')}
      </Message>
    );
  };

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-4">
        <FaUserCog className="text-primary me-2" /> My Profile
      </h2>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body text-center py-4">
              <div
                className="bg-primary text-white rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                style={{ width: 90, height: 90, fontSize: 36 }}
              >
                {name.charAt(0).toUpperCase()}
              </div>
              <h5 className="fw-bold mb-1">{name}</h5>
              <p className="text-muted mb-2">{email}</p>
              <span
                className={`badge ${user?.isAdmin ? 'bg-warning text-dark' : 'bg-secondary'}`}
              >
                {user?.isAdmin ? 'Administrator' : 'Customer'}
              </span>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">Edit Profile</div>
            <div className="card-body">
              {parseMsg()}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary mt-4"
                  disabled={loading}
                >
                  {loading ? <Loader /> : 'Update Profile'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
