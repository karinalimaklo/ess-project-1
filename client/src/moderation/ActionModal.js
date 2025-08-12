import React, { useState, useEffect } from 'react';
import styles from './ActionModal.css'; // Usaremos um CSS dedicado

const ActionModal = ({ isOpen, onClose, onSubmit, actionType }) => {
  const [justificativa, setJustificativa] = useState('');
  const [dias, setDias] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setJustificativa('');
      setDias(1);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const config = {
    warn: { title: 'Enviar Advertência', needsJustificativa: true, justificativaLabel: 'Mensagem de advertência:', buttonText: 'Enviar Advertência' },
    suspend: { title: 'Suspender Usuário', needsJustificativa: true, justificativaLabel: 'Justificativa da suspensão:', needsDays: true, buttonText: 'Suspender Usuário' },
    delete: { title: 'Excluir Usuário', needsJustificativa: true, justificativaLabel: 'Justificativa da exclusão (permanente):', buttonText: 'Confirmar Exclusão' },
    resolve: { title: 'Resolver Caso', message: 'Tem certeza que deseja marcar este caso como resolvido e reativar o usuário?', buttonText: 'Confirmar e Reativar' },
  };

  const currentConfig = config[actionType];

  const handleSubmit = () => {
    if (currentConfig.needsJustificativa && !justificativa.trim()) {
      setError('A justificativa é obrigatória.');
      return;
    }
    onSubmit({ justificativa, dias });
  };

  return (
    <div className="action-modal-overlay" onClick={onClose}>
      <div className="action-modal-content" onClick={e => e.stopPropagation()}>
        <h3>{currentConfig.title}</h3>
        {currentConfig.message && <p>{currentConfig.message}</p>}
        
        {currentConfig.needsDays && (
          <div className="form-group">
            <label>Duração da suspensão (dias):</label>
            <input type="number" value={dias} onChange={e => setDias(Math.max(1, e.target.value))} min="1" />
          </div>
        )}

        {currentConfig.needsJustificativa && (
          <div className="form-group">
            <label>{currentConfig.justificativaLabel}</label>
            <textarea value={justificativa} onChange={e => setJustificativa(e.target.value)} rows="4" />
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        <div className="action-buttons">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className={`btn-confirm ${actionType}`} onClick={handleSubmit}>{currentConfig.buttonText}</button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;