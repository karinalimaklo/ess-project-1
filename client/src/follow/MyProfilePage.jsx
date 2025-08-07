import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import currentUser from './currentUser';
import { getFollowers, getFollowing } from './followAPI';
import Header from '../components/Header';
import styles from './MyProfilePage.module.css';
import { useNavigate} from 'react-router-dom';

const MyProfilePage = () => {
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userReviews, setUserReviews] = useState([]);

  const navigate = useNavigate(); // ✅ Agora está dentro do componente

  const handleClick = (review) => {
    navigate('/editar-review', { state: { review } }); // ✅ Válido agora
  };

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
    
    const fetchUserReviews = async () => {
      try {
        const res = await fetch(`/reviews/user/${currentUser._id}`);
        const data = await res.json();
        setUserReviews(data);
      } catch (error) {
        console.error("Falha ao buscar reviews do usuário:", error);
      }
    };

    fetchCounts();
    fetchUserReviews();
  }, []);

  return (
    <>
      <Header
        onMenuClick={() => console.log("Abrir menu lateral")}
        avatarUrl={currentUser.avatar}
      />
      <div className={styles.profileContainer}>
        <div className={styles.mainInfo}>
          <h2 className={styles.pageTitle}>Meu Perfil</h2>
          <img src={currentUser.avatar} alt="Avatar" className={styles.avatar} />
          <p className={styles.name}>{currentUser.name}</p>
          <p className={styles.email}>{currentUser.email || 'email.exemplo@provedor.com'}</p>
          <div className={styles.followStats}>
            <Link to={`/seguidores/${currentUser._id}`} className={styles.followLink}>
              Seguidores: {isLoading ? '...' : followerCount}
            </Link>
            |
            <Link to={`/seguindo/${currentUser._id}`} className={styles.followLink}>
              Seguindo: {isLoading ? '...' : followingCount}
            </Link>
          </div>
        </div>
        <div className={styles.reviewsContainer}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '18px' }}>Minhas Reviews</h3>
          {userReviews.length === 0 ? (
            <p>Nenhuma review cadastrada.</p>
          ) : (
            <ul>
              {userReviews.map((review) => (
                <li key={review._id} onClick={() => handleClick(review)}>
                  {review.musica}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default MyProfilePage;