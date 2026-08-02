import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const Loader = () => (
  <div className="d-flex justify-content-center align-items-center py-5">
    <FaSpinner className="text-primary spin" size={40} />
  </div>
);

export default Loader;
