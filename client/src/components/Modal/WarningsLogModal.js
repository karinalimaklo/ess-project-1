import React from 'react';
import styles from './WarningsLogModal.module.css';

const WarningsLogModal = ({ isOpen, onClose, warnings }) => {
  if (!isOpen) {
    return null;
  }
  
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Histórico de Ações</h3>
        </div>
        <div className={styles.modalBody}>
          {warnings && warnings.length > 0 ? (
            warnings.slice().reverse().map((warning, index) => (
              <div key={index} className={styles.warningItem}>
                <p className={styles.warningMessage}>{warning.mensagem}</p>
                <p className={styles.warningDate}>
                  {new Date(warning.data || warning.date).toLocaleString('pt-BR', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            ))
          ) : (
            <p className={styles.noWarnings}>Nenhuma ação registrada para este usuário.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarningsLogModal;
