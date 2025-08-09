import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import './AlertModal.css'; 
import Button from '../Button/Button';

const AlertModal = ({ isOpen, onClose, message }) => {
  // O componente não renderiza nada se não estiver aberto
  if (!isOpen) {
    return null;
  }

  return (
    <div className="popup-shadow">

      <div className="popup-box">

        <FaExclamationTriangle className="popup-icon" />
        
        <h2 className="popup-title">{message.title}</h2>
        <p className="popup-body">{message.body}</p>
        <Button onClick={onClose}>
          Voltar para busca
        </Button>
      </div>
    </div>
  );
};

export default AlertModal;