import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import currentUser from '../currentUser.js';
import { getFollowers, getFollowing } from './followAPI';
import { getReviewsByUser } from '../review/reviewAPI';
import Header from '../components/Header/Header';
import styles from './ProfileLayout.module.css';
import profilePic from '../assets/profilePic.png';
import ReviewDetailModal from '../components/Modal/ReviewDetailModal';
import StarRating from '../components/StarRating/StarRating';

const MyProfilePage = () => {
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userReviews, setUserReviews] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const navigate = useNavigate();

  const handleOpenDetailModal = (review) => {
    if (review.isHidden) return;
    const reviewWithAuthor = {
      ...review,
      userId: {
        _id: currentUser._id,
        name: currentUser.name
      }
    };
    setSelectedReview(reviewWithAuthor);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReview(null);
  };
  
  const handleEditClick = (review) => {
    navigate(`/editar-review/${review._id}`, { state: { review } });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [followersData, followingData, reviewsData] = await Promise.all([
          getFollowers(currentUser._id),
          getFollowing(currentUser._id),
          getReviewsByUser(currentUser._id)
        ]);
        setFollowerCount(followersData.length);
        setFollowingCount(followingData.length);
        setUserReviews(reviewsData);
      } catch (error) {
        console.error("Falha ao buscar dados do perfil:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return <div>A carregar perfil...</div>;
  }

  return (
    <>
      <Header
        onMenuClick={() => console.log("Abrir menu lateral")}
        avatarUrl={currentUser.avatar}
      />
      <div className={styles.profileContainer}>
        <div className={styles.mainInfo}>
          <h2 className={styles.pageTitle}>Meu Perfil</h2>
          <img src={currentUser.avatar || profilePic} alt="Avatar" className={styles.avatar} />
          <p className={styles.name}>{currentUser.name}</p>
          <p className={styles.email}>{currentUser.email}</p>
          <div className={styles.followStats}>
            <Link to={`/seguidores/${currentUser._id}`} className={styles.followLink}>
              Seguidores: {followerCount}
            </Link>
            |
            <Link to={`/seguindo/${currentUser._id}`} className={styles.followLink}>
              Seguindo: {followingCount}
            </Link>
          </div>
        </div>
        <div className={styles.reviewsContainer}>
          <h3 className={styles.reviewsTitle}>Minhas Reviews</h3>
          {userReviews.length > 0 ? (
            <ul className={styles.reviewsList}>
              {userReviews.map((review) => (
                review.isHidden ? (
                  <li key={review._id} className={`${styles.reviewItemClickable} ${styles.reviewItemHidden}`}>
                    <span className={styles.reviewTitleText}>{review.musica}</span>
                    <span className={styles.hiddenReviewMessage}>Oculto para análise</span>
                  </li>
                ) : (
                  <li key={review._id} onClick={() => handleOpenDetailModal(review)} className={styles.reviewItemClickable}>
                    <span className={styles.reviewTitleText}>{review.musica}</span>
                    <div className={styles.reviewRightSide}>
                      <StarRating rating={review.rating} />
                    </div>
                  </li>
                )
              ))}
            </ul>
          ) : <p>Nenhuma review cadastrada.</p>}
        </div>
      </div>
      <ReviewDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        review={selectedReview}
        onEdit={handleEditClick} 
      />
    </>
  );
};

export default MyProfilePage;
