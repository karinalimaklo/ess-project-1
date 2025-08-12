import React, { useEffect, useState } from 'react';
import { getReportedUsers } from './moderationAPI';
import UserDetailModal from './UserDetailModal';
import Header from '../components/Header/Header';
import styles from './ModerationPage.module.css';
import currentUser from '../currentUser';

const ModerationPage = () => {
  const [reportedUsers, setReportedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const users = await getReportedUsers();
      setReportedUsers(users);
    } catch (error) {
      console.error("Falha ao carregar usuários reportados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    fetchUsers();
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Header
        onMenuClick={() => console.log("Abrir menu lateral")}
        avatarUrl={currentUser.avatar}
      />
      <div className={styles.pageContent}>
        <div className={styles.cardWrapper}>
          <h2 className={styles.title}>Gerenciar Usuários</h2>
          <div className={styles.userList}>
            <div className={`${styles.userListItem} ${styles.userListItemHeader}`}>
                <span className={styles.userName}>Usuário</span>
                <span className={styles.userStatus}>Status</span>
                <span className={styles.reportCount}>Reports</span>
                <span className={styles.lastReport}>Último Report</span>
            </div>
            {reportedUsers.length > 0 ? (
              reportedUsers.map((user) => (
                <div key={user.userId} className={styles.userListItem} onClick={() => handleUserClick(user)}>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={`${styles.userStatus} ${styles[user.status.toLowerCase()]}`}>{user.status}</span>
                  <span className={styles.reportCount}>{user.reports}</span>
                  <span className={styles.lastReport}>{new Date(user.lastReportDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                </div>
              ))
            ) : (
              <p>Nenhum usuário com denúncias ativas.</p>
            )}
          </div>
        </div>
      </div>
      {selectedUser && (
        <UserDetailModal user={selectedUser} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default ModerationPage;