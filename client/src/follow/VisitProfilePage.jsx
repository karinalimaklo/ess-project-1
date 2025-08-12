import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUserProfile, getFollowing, createFollow, deleteFollow } from './followAPI';
import currentUser from '../currentUser'; 
import Header from '../components/Header/Header';
import styles from './ProfileLayout.module.css';
import profilePic from '../assets/profilePic.png';
import Button from '../components/Button/Button';
import ReportModal from '../components/Modal/ReportModal';
import { createReport } from '../report/reportAPI';
import ReviewDetailModal from '../components/Modal/ReviewDetailModal';
import StarRating from '../components/StarRating/StarRating';
import ConfirmationModal from '../components/Modal/ConfirmationModal';
import ReviewActionButton from '../components/Button/ReviewActionButton';

const VisitProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userReviews, setUserReviews] = useState([]);
  
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState({ success: true, title: '', message: '' });

  useEffect(() => {
    if (id === currentUser._id) {
      navigate('/meu-perfil');
      return;
    }
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [user, followingList, reviewsRes] = await Promise.all([
          getUserProfile(id),
          getFollowing(currentUser._id),
          fetch(`http://localhost:4000/reviews/user/${id}`)
        ]);
        setProfileUser(user);
        if (user && followingList) {
          setIsFollowing(followingList.some(followed => followed._id === id));
        }
        if (reviewsRes.ok) {
          const allReviews = await reviewsRes.json();
          // --- ALTERAÇÃO AQUI: Filtra as reviews para mostrar apenas as que NÃO estão ocultas ---
          const visibleReviews = allReviews.filter(review => !review.isHidden);
          setUserReviews(visibleReviews);
        }
      } catch (error) {
        console.error("Falha ao carregar dados da página de visita:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [id, navigate]);

  const handleToggleFollow = async () => {
    try {
      if (isFollowing) {
        await deleteFollow(currentUser._id, profileUser._id);
      } else {
        await createFollow(currentUser._id, profileUser._id);
      } 
      setIsFollowing(!isFollowing);
      setProfileUser(prev => ({...prev, followersCount: isFollowing ? prev.followersCount - 1 : prev.followersCount + 1}));
    } catch (error) {
      console.error("Falha ao seguir/deixar de seguir:", error);
    }
  };

  const handleOpenDetailModal = (review) => {
    setSelectedReview(review);
    setIsDetailModalOpen(true);
  };
  
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReview(null);
  };

  const handleOpenReportModal = () => {
    setIsDetailModalOpen(false);
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setSelectedReview(null);
  };

  const handleReportSubmit = async (motivo) => {
    if (!selectedReview) return;
    handleCloseReportModal();
    try {
      await createReport(selectedReview._id, motivo, currentUser._id);
      setConfirmationStatus({ success: true, title: 'Sucesso!', message: 'Sua denúncia foi enviada e será analisada pela nossa equipe.' });
    } catch (error) {
      console.error("Falha ao criar denúncia:", error);
      setConfirmationStatus({ success: false, title: 'Erro!', message: 'Não foi possível enviar sua denúncia. Tente novamente mais tarde.' });
    } finally {
      setIsConfirmationModalOpen(true);
    }
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  if (isLoading) return <div>Carregando...</div>;
  if (!profileUser) return <div>Perfil não encontrado.</div>;

return (
    <>
      <Header avatarUrl={currentUser.avatar} />
      <div className={styles.profileContainer}>
        <div className={styles.mainInfo}>
            <h2 className={styles.pageTitle}>Visitando Perfil</h2>
            <img src={profileUser.avatar || profilePic} alt="Avatar" className={styles.avatar}/>
            <p className={styles.name}>{profileUser.name}</p>
            <p className={styles.email}>{profileUser.email}</p>
            <div className={styles.followStats}>
                <Link to={`/seguidores/${profileUser._id}`} className={styles.followLink}>
                <span>Seguidores: {profileUser.followersCount}</span>
                </Link>
                &nbsp;|&nbsp;
                <Link to={`/seguindo/${profileUser._id}`} className={styles.followLink}>
                <span>Seguindo: {profileUser.followingCount}</span>
                </Link>
            </div>

            <Button handleClick={handleToggleFollow} className={styles.actionButton}>
              {isFollowing ? 'Deixar de Seguir' : 'Seguir'}
            </Button>
        </div>
        <div className={styles.reviewsContainer}>
           <h3 className={styles.reviewsTitle}>Reviews de {profileUser.name}</h3>
          {userReviews.length > 0 ? (
            <ul className={styles.reviewsList}>
              {userReviews.map((review) => (
                <li key={review._id} onClick={() => handleOpenDetailModal(review)} className={styles.reviewItemClickable}>
                  <span className={styles.reviewTitleText}>{review.musica}</span>
                  <div className={styles.reviewRightSide}>
                    <StarRating rating={review.rating} />
                  </div>
                </li>
              ))}
            </ul>
          ) : <p>Nenhuma review cadastrada.</p>}
        </div>
      </div>
      <ReviewDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        review={selectedReview}
        actionButton={
          selectedReview && (
            <ReviewActionButton 
              review={selectedReview} 
              onReport={handleOpenReportModal} 
            />
          )
        }
      />
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={handleCloseReportModal}
        onSubmit={handleReportSubmit}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseConfirmationModal}
        title={confirmationStatus.title}
        message={confirmationStatus.message}
        success={confirmationStatus.success}
      />
    </>
  );
};

export default VisitProfilePage;
