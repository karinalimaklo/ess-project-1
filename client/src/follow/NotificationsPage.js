import React, { useEffect, useState } from 'react';
// 1. Importa a função existente do moderationAPI
import { getGroupedReportsByUserId } from '../moderation/moderationAPI';
import currentUser from '../currentUser';
import Header from '../components/Header/Header';
import CardWrapper from '../components/Card/Card';
import styles from './NotificationsPage.module.css';

const NotificationsPage = () => {
  const [warnings, setWarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWarnings = async () => {
      if (!currentUser) return;
      setIsLoading(true);
      try {
        const responseData = await getGroupedReportsByUserId(currentUser._id);
        if (responseData && responseData.userProfile && responseData.userProfile.warnings) {
          setWarnings(responseData.userProfile.warnings);
        }
      } catch (error) {
        console.error("Falha ao carregar notificações:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWarnings();
  }, []);

  return (
    <>
      <Header
        onMenuClick={() => console.log("Abrir menu lateral")}
        avatarUrl={currentUser.avatar}
      />
      <div className={styles.pageContainer}>
        <CardWrapper style={{ width: '100%', maxWidth: '700px' }}>
          <h2 className={styles.title}>Minhas Notificações</h2>
          <div className={styles.notificationList}>
            {isLoading ? (
              <p>A carregar...</p>
            ) : warnings.length > 0 ? (
              warnings.slice().reverse().map((warning, index) => (
                <div key={index} className={styles.notificationItem}>
                  <div className={styles.icon}>🔔</div>
                  <div className={styles.content}>
                    <p className={styles.message}>{warning.mensagem}</p>
                    <p className={styles.date}>
                      {new Date(warning.data || warning.date).toLocaleString('pt-BR', {
                        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noNotifications}>Você não tem nenhuma notificação.</p>
            )}
          </div>
        </CardWrapper>
      </div>
    </>
  );
};

export default NotificationsPage;
