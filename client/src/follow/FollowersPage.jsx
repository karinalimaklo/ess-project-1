import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import currentUser from '../currentUser';
import { getFollowers, getFollowing } from './followAPI';
import FollowCard from './FollowCard';
import Header from '../components/Header/Header';
import CardWrapper from '../components/Card/Card'; 
import styles from './FollowersPage.module.css';

const FollowersPage = () => {
  const { userId } = useParams();
  const [followers, setFollowers] = useState([]);
  const [followingMap, setFollowingMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [followersData, followingDataOfCurrentUser] = await Promise.all([
          getFollowers(userId),
          getFollowing(currentUser._id)
        ]);
        
        setFollowers(followersData);

        const followingIdMap = followingDataOfCurrentUser.reduce((acc, user) => {
          acc[user._id] = true;
          return acc;
        }, {});
        setFollowingMap(followingIdMap);

      } catch (error) {
        console.error("Falha ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
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
        <CardWrapper style={{ width: '500px' }}>
          <h2 className={styles.title}>Seguidores</h2>
          <div className={styles.list}>
            {followers.length > 0 ? (
              followers.map((user) => {
                const isFollowedByCurrentUser = !!followingMap[user._id];
                
                return (
                  <FollowCard
                    key={user._id}
                    user={user}
                    initialIsFollowing={isFollowedByCurrentUser}
                  />
                );
              })
            ) : (
              <p>Este usuário ainda não tem seguidores.</p>
            )}
          </div>
        </CardWrapper>
      </div>
    </>
  );
};

export default FollowersPage;