import React, { useEffect, useState } from 'react';
import { sendWarning, suspendUser, deleteUser, resolveCase, getGroupedReportsByUserId } from './moderationAPI';
import { toggleReviewVisibility } from '../review/reviewAPI';
import styles from './ModerationPage.module.css';
import ActionModal from './ActionModal';
import ToggleVisibilityButton from '../components/Button/ToggleVisibilityButton';
import ConfirmationModal from '../components/Modal/ConfirmationModal';
import WarningsLogModal from '../components/Modal/WarningsLogModal';

const UserDetailModal = ({ user, onClose }) => {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalAction, setModalAction] = useState({ type: null });
  const [expandedReviewId, setExpandedReviewId] = useState(null);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState({ success: true, title: '', message: '', actionType: null });
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const fetchDetails = async () => {
    setIsLoading(true);
    try {
      const allData = await getGroupedReportsByUserId(user.userId);
      setDetails(allData);
    } catch (error) {
      console.error("Falha ao carregar detalhes do usuário:", error);
      setDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [user.userId]);

  const handleToggleExpand = (reviewId) => {
    setExpandedReviewId(currentId => (currentId === reviewId ? null : reviewId));
  };
  
  const handleActionSubmit = async ({ justificativa, dias }) => {
    const { type } = modalAction;
    setModalAction({ type: null });

    const actions = {
      warn: () => sendWarning(user.userId, justificativa),
      suspend: () => suspendUser(user.userId, dias, justificativa),
      delete: () => deleteUser(user.userId, justificativa),
      resolve: () => resolveCase(user.userId),
    };

    try {
      await actions[type]();
      setConfirmationStatus({ success: true, title: 'Sucesso!', message: 'Ação de moderação foi concluída com sucesso.', actionType: type });
    } catch (error) {
      setConfirmationStatus({ success: false, title: 'Erro!', message: error.response?.data?.message || 'Não foi possível completar a ação.', actionType: type });
    } finally {
      setIsConfirmationModalOpen(true);
    }
  };

  const handleToggleVisibility = async (reviewId) => {
    try {
      const updatedReview = await toggleReviewVisibility(reviewId);
      setDetails(currentDetails => {
        const updatedReports = currentDetails.reportsByReview.map(group => {
          if (group.review._id === reviewId) {
            return { ...group, review: updatedReview };
          }
          return group;
        });
        return { ...currentDetails, reportsByReview: updatedReports };
      });
      setConfirmationStatus({ success: true, title: 'Status Alterado', message: `A review foi ${updatedReview.isHidden ? 'ocultada' : 'reexibida'} com sucesso.`, actionType: 'toggleVisibility' });
    } catch (error) {
      console.error("Falha ao alterar visibilidade:", error);
      setConfirmationStatus({ success: false, title: 'Erro!', message: 'Não foi possível alterar a visibilidade da review.', actionType: 'toggleVisibility' });
    } finally {
      setIsConfirmationModalOpen(true);
    }
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    if (confirmationStatus.success && ['warn','suspend','delete','resolve'].includes(confirmationStatus.actionType)) {
      onClose();
    }
  };

  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
          <button onClick={onClose} className={styles.closeButton}>×</button>
          <h3 className={styles.modalTitle}>Detalhes do Usuário</h3>
          {isLoading ? ( <p>Carregando...</p> ) : details && details.userProfile ? (
            <div className={styles.userDetailsContainer}>
              <div className={styles.userInfo}>
                <div className={styles.avatarPlaceholder}></div>
                <p><strong>Usuário:</strong> {details.userProfile.name}</p>
                <p><strong>Email:</strong> {details.userProfile.email}</p>
                <p><strong>Status:</strong> <span className={`${styles.userStatus} ${styles[user.status.toLowerCase()]}`}>{user.status}</span></p>
                <p><strong>Membro desde:</strong> {new Date(details.userProfile.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                <div className={styles.logButtonContainer}>
                  <button className={styles.logButton} onClick={() => setIsLogModalOpen(true)}>
                    Ver Histórico de Ações ({details.userProfile.warnings?.length || 0})
                  </button>
                </div>

                <div className={styles.actions}>
                  <p><strong>Ações disciplinares:</strong></p>
                  <button onClick={() => setModalAction({ type: 'warn' })}>Advertir Usuário</button>
                  <button onClick={() => setModalAction({ type: 'suspend' })}>Suspender Usuário</button>
                  <button onClick={() => setModalAction({ type: 'resolve' })}>Resolver Caso</button>
                  <button className={styles.deleteButton} onClick={() => setModalAction({ type: 'delete' })}>Excluir Usuário</button>
                </div>
              </div>
              <div className={styles.reportsInfo}>
                  <h4>Denúncias Recebidas</h4>
                  <div className={styles.reportsList}>
                      {details.reportsByReview.length > 0 ? details.reportsByReview.map(({ review, reports }) => (
                          <div key={review._id} className={styles.reportGroup}>
                            <div className={styles.reportGroupHeader} onClick={() => handleToggleExpand(review._id)}>
                              <span className={styles.reviewTitle}>Review: "{review.musica}"</span>
                              <div className={styles.headerMeta}>
                                <span className={styles.reportCountBadge}>{reports.length} denúncia(s)</span>
                                <span className={`${styles.chevron} ${expandedReviewId === review._id ? styles.expanded : ''}`}>▼</span>
                              </div>
                            </div>
                            {expandedReviewId === review._id && (
                              <div className={styles.expandedContent}>
                                <div className={styles.reviewContentHeader}>
                                  <p><strong>Texto da Review:</strong> "{review.texto}"</p>
                                  <ToggleVisibilityButton review={review} onToggle={handleToggleVisibility} />
                                </div>
                                <ul>
                                  {reports.map((report, index) => (
                                    <li key={index}>
                                      <strong>{report.reporterName}:</strong> "{report.motivo}"
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                      )) : <p>Nenhuma denúncia encontrada para este usuário.</p>}
                  </div>
              </div>
            </div>
          ) : ( <p>Não foi possível carregar os detalhes.</p> )}
        </div>
      </div>
      <ActionModal
        isOpen={!!modalAction.type && ['warn', 'suspend', 'delete', 'resolve'].includes(modalAction.type)}
        onClose={() => setModalAction({ type: null })}
        onSubmit={handleActionSubmit}
        actionType={modalAction.type}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseConfirmationModal}
        title={confirmationStatus.title}
        message={confirmationStatus.message}
        success={confirmationStatus.success}
      />
      <WarningsLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        warnings={details?.userProfile?.warnings}
      />
    </>
  );
};

export default UserDetailModal;
