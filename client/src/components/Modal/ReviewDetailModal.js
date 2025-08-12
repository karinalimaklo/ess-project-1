import React from 'react';
import StarRating from '../StarRating/StarRating';
import './ReviewDetailModal.css';

const ReviewDetailModal = ({ isOpen, onClose, review, actionButton }) => {
  if (!isOpen || !review) {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (e.target.id === 'detail-modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="detail-modal-overlay" id="detail-modal-overlay" onClick={handleOverlayClick}>
      <div className="detail-modal-content">
        {actionButton}
        <button className="detail-modal-close-btn" onClick={onClose} title="Fechar">×</button>
        <div className="detail-modal-header">
          <div className="detail-modal-title">
            <h2>{review.musica}</h2>
            <h3>{review.artista}</h3>
            <div className="detail-modal-meta">
              <StarRating rating={review.rating} />
              <span className="detail-modal-date">
                {new Date(review.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
        <div className="detail-modal-body">
          <p>{review.texto}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailModal;
