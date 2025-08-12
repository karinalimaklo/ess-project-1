import React from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import './ConfirmationModal.css';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  title, 
  message, 
  success,
  isDeleteConfirmation = false
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal-content">
        <div className="confirmation-modal-icon">
          {isDeleteConfirmation ? (
            <FaExclamationTriangle color="#e67e22" />
          ) : (
            success ? <FaCheckCircle color="#2ecc71" /> : <FaExclamationTriangle color="#e74c3c" />
          )}
        </div>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="confirmation-modal-buttons">
          {isDeleteConfirmation ? (
            <>
              <button onClick={onClose} className="btn-cancel">Cancelar</button>
              <button onClick={onConfirm} className="btn-confirm-danger">Confirmar Exclusão</button>
            </>
          ) : (
            <button onClick={onClose} className="btn-ok">OK</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;