import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, title, message, success }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal-content">
        <div className="confirmation-modal-icon">
          {success ? <FaCheckCircle color="#2ecc71" /> : <FaTimesCircle color="#e74c3c" />}
        </div>
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default ConfirmationModal;