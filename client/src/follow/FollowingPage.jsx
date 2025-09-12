import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFollowing } from './followAPI';
import FollowCard from './FollowCard';
import Header from '../components/Header/Header';
import currentUser from '../currentUser';
import CardWrapper from '../components/Card/Card';
import styles from './FollowingPage.module.css';

const FollowingPage = () => {
  const { userId } = useParams();

  const [followingUsers, setFollowingUsers] = useState([]);
  const [followingMapOfCurrentUser, setFollowingMapOfCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          const [followingData, followingDataOfCurrentUser] = await Promise.all([
            getFollowing(userId),
            getFollowing(currentUser._id)
          ]);
          
          setFollowingUsers(followingData);

          const followingIdMap = followingDataOfCurrentUser.reduce((acc, user) => {
            acc[user._id] = true;
            return acc;
          }, {});
          setFollowingMapOfCurrentUser(followingIdMap);

        } catch (err) {
          console.error("Falha ao carregar dados de 'seguindo':", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [userId]);

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
        <CardWrapper style={{ width: '500px'}}>
          <h2 className={styles.title}>Seguindo</h2>
          <div className={styles.list}>
            {followingUsers.length > 0 ? (
              followingUsers.map((user) => {
                const isFollowedByCurrentUser = !!followingMapOfCurrentUser[user._id];

                return (
                  <FollowCard
                    key={user._id}
                    user={user}
                    initialIsFollowing={isFollowedByCurrentUser}
                  />
                );
              })
            ) : (
              <p>Este usuário não segue ninguém ainda.</p>
            )}
          </div>
        </CardWrapper>
      </div>
    </>
  );
};

export default FollowingPage;