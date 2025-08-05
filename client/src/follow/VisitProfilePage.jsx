import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUserProfile, getFollowing, createFollow, deleteFollow } from './followAPI';
import currentUser from './currentUser';
import Header from '../components/Header';
import styles from './VisitProfilePage.module.css';

const VisitProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id === currentUser._id) {
      navigate('/meu-perfil');
      return;
    }
    const fetchData = async () => {
      try {
        const [user, followingListOfCurrentUser] = await Promise.all([
          getUserProfile(id),
          getFollowing(currentUser._id)
        ]);
        setProfileUser(user);
        const isUserFollowed = followingListOfCurrentUser.some(followedUser => followedUser._id === id);
        setIsFollowing(isUserFollowed);
      } catch (err) {
        console.error("Erro ao buscar dados do perfil:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleToggleFollow = async () => {
    try {
      if (isFollowing) {
        await deleteFollow(currentUser._id, profileUser._id);
      } else {
        await createFollow(currentUser._id, profileUser._id);
      }
      setProfileUser(prevUser => ({
        ...prevUser,
        followersCount: isFollowing ? prevUser.followersCount - 1 : prevUser.followersCount + 1
      }));
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Falha ao seguir/deixar de seguir:", error);
      alert("Ocorreu um erro. Tente novamente.");
    }
  };
  
  if (isLoading) return <div>Carregando...</div>;
  if (!profileUser) return <div>Perfil não encontrado.</div>;

  return (
    <div className={styles.profileContainer}>
      <Header
        onMenuClick={() => console.log("Abrir menu lateral")}
        avatarUrl={currentUser.avatar}
      />
      <h2 className={styles.pageTitle}>Visitando Perfil</h2>
      
      <div className={styles.mainInfo}>
        <img src={profileUser.avatar || '/avatar_mateus.png'} alt="Avatar" className={styles.avatar} />
        <p className={styles.name}>{profileUser.name}</p>
        <p className={styles.email}>{profileUser.email}</p>
      </div>

      <div className={styles.followStats}>
        <Link to={`/seguidores/${profileUser._id}`} className={styles.followLink}>
          <span>Seguidores: {profileUser.followersCount}</span>
        </Link>
        |
        <Link to={`/seguindo/${profileUser._id}`} className={styles.followLink}>
          <span>Seguindo: {profileUser.followingCount}</span>
        </Link>
      </div>

      <button onClick={handleToggleFollow} className={styles.actionButton}>
        {isFollowing ? 'Deixar de Seguir' : 'Seguir'}
      </button>

      <div className={styles.reviewsContainer}>
        <h3>Reviews de {profileUser.name}</h3>
      </div>
    </div>
  );
};

export default VisitProfilePage;