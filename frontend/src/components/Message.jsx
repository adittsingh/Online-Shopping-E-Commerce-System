import React from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const Message = ({ variant = 'info', children }) => {
  const icons = {
    danger: <FaExclamationCircle className="me-2" />,
    success: <FaCheckCircle className="me-2" />,
    warning: <FaExclamationCircle className="me-2" />,
    info: <FaCheckCircle className="me-2" />,
  };
  return (
    <div className={`alert alert-${variant} d-flex align-items-center`}>
      {icons[variant]} {children}
    </div>
  );
};

export default Message;
