import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFollowing } from './followAPI';
import FollowCard from './FollowCard';
import Header from '../components/Header';
import currentUser from './currentUser';
import styles from './FollowingPage.module.css';

const FollowingPage = () => {
  const { userId } = useParams();

  const [followingUsers, setFollowingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      getFollowing(userId)
        .then(data => {
          setFollowingUsers(data);
        })
        .catch(err => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [userId]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <Header
        onMenuClick={() => console.log("Abrir menu lateral")}
        avatarUrl={currentUser.avatar}
      />

      <h2 className={styles.title}>Seguindo</h2>
      <div className={styles.list}>
        {followingUsers.length > 0 ? (
          followingUsers.map((user) => (
            <FollowCard
              key={user._id}
              user={user}
              initialIsFollowing={true}
            />
          ))
        ) : (
          <p>Este usuário não segue ninguém ainda.</p>
        )}
      </div>
    </div>
  );
};

export default FollowingPage;