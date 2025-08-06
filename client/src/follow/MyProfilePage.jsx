import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import currentUser from './currentUser';
import { getFollowers, getFollowing } from './followAPI';
import Header from '../components/Header';
import styles from './MyProfilePage.module.css';

const MyProfilePage = () => {
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [followersData, followingData] = await Promise.all([
          getFollowers(currentUser._id),
          getFollowing(currentUser._id)
        ]);
        setFollowerCount(followersData.length);
        setFollowingCount(followingData.length);
      } catch (error) {
        console.error("Falha ao buscar contadores:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCounts();
  }, []);

  return (
    <div className={styles.profileContainer}>
      <Header
        onMenuClick={() => console.log("Abrir menu lateral")}
        avatarUrl={currentUser.avatar}
      />

      <h2 className={styles.pageTitle}>Meu Perfil</h2>
      
      <div className={styles.mainInfo}>
        <img src={currentUser.avatar} alt="Avatar" className={styles.avatar} />
        <p className={styles.name}>{currentUser.name}</p>
        <p className={styles.email}>{currentUser.email || 'email.exemplo@provedor.com'}</p>
      </div>

      <div className={styles.followStats}>
        <Link to={`/seguidores/${currentUser._id}`} className={styles.followLink}>
          Seguidores: {isLoading ? '...' : followerCount}
        </Link>
        |
        <Link to={`/seguindo/${currentUser._id}`} className={styles.followLink}>
          Seguindo: {isLoading ? '...' : followingCount}
        </Link>
      </div>

      <div className={styles.reviewsContainer}>
        <h3>Minhas Reviews</h3>
      </div>
    </div>
  );
};

export default MyProfilePage;