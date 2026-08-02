import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-4 text-center">Contact Us</h2>
      <p className="text-center text-muted mb-4">
        Have a question or need help? We'd love to hear from you.
      </p>
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Get in Touch</h5>
              <p className="mb-3">
                <FaMapMarkerAlt className="text-primary me-2" />
                ShopNow HQ, 123 Market Street, Delhi, India
              </p>
              <p className="mb-3">
                <FaPhone className="text-primary me-2" /> +91 98765 43210
              </p>
              <p className="mb-3">
                <FaEnvelope className="text-primary me-2" /> support@shopnow.com
              </p>
            </div>
          </div>
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Business Hours</h5>
              <p className="mb-1">Monday - Friday: 9:00 AM - 8:00 PM</p>
              <p className="mb-1">Saturday: 10:00 AM - 6:00 PM</p>
              <p className="mb-0">Sunday: Closed</p>
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">Send Us a Message</div>
            <div className="card-body">
              {submitted ? (
                <div className="text-center py-5">
                  <FaCheckCircle size={60} className="text-success mb-3" />
                  <h4 className="fw-bold">Message Sent!</h4>
                  <p className="text-muted">
                    Thank you {form.name}. Our team will get back to you within
                    24 hours.
                  </p>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', subject: '', message: '' });
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Subject</label>
                      <input
                        type="text"
                        className="form-control"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Message</label>
                      <textarea
                        className="form-control"
                        rows="5"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary px-4">
                        <FaPaperPlane className="me-2" /> Send Message
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
