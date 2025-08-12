import React, { useState } from 'react';
import './ReportModal.css';

const ReportModal = ({ isOpen, onClose, onSubmit }) => {
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {
    if (motivo.trim()) {
      onSubmit(motivo);
      setMotivo(''); 
      setError('');
    } else {
      setError('Por favor, descreva o motivo da denúncia.');
    }
  };
  
  const handleClose = () => {
    setMotivo('');
    setError('');
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === 'modal-overlay') {
      handleClose();
    }
  };

  const handleTextChange = (e) => {
    setMotivo(e.target.value);
    if (error) {
      setError('');
    }
  }

  return (
    <div className="modal-overlay" id="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h4>Por favor, descreva o motivo da sua denúncia:</h4>
        <textarea
          value={motivo}
          onChange={handleTextChange}
          placeholder="Ex: A review contém discurso de ódio, atitude negativa, etc."
          rows="4"
        />
        <div className="modal-actions">
          {error && <p className="modal-error">{error}</p>}
          <button className="btn-cancel" onClick={handleClose}>Cancelar</button>
          <button className="btn-submit" onClick={handleSubmit}>Enviar Denúncia</button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;