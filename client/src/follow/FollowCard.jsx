import React from 'react';
import { useNavigate } from 'react-router-dom';
import currentUser from '../currentUser';
import { createFollow, deleteFollow } from './followAPI';
import styles from './FollowCard.module.css';
import Button from '../components/Button/Button';
import profilePic from '../assets/profilePic.png';

const FollowCard = ({ user, initialIsFollowing }) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = React.useState(initialIsFollowing);

  // --- Métodos Extraídos ---

  /**
   * Lida com a ação de seguir um usuário.
   */
  const followUser = async () => {
    try {
      await createFollow(currentUser._id, user._id);
      setIsFollowing(true);
    } catch (error) {
      console.error("Falha ao seguir o usuário:", error);
      alert("Ocorreu um erro ao tentar seguir. Tente novamente.");
    }
  };

  /**
   * Lida com a ação de deixar de seguir um usuário.
   */
  const unfollowUser = async () => {
    try {
      await deleteFollow(currentUser._id, user._id);
      setIsFollowing(false);
    } catch (error) {
      console.error("Falha ao deixar de seguir o usuário:", error);
      alert("Ocorreu um erro ao tentar deixar de seguir. Tente novamente.");
    }
  };

  /**
   * Alterna entre seguir e deixar de seguir com base no estado atual.
   */
  const handleToggleFollow = () => {
    if (isFollowing) {
      unfollowUser();
    } else {
      followUser();
    }
  };

  /**
   * Navega para a página de perfil do usuário.
   */
  const navigateToProfile = () => {
    navigate(`/perfil/${user._id}`);
  };


  // --- Renderização do Componente ---

  if (!user) return null;

  return (
    <div className={styles.card}>
      <div className={styles.userInfo} onClick={navigateToProfile}>
        <img
          src={user.avatar || profilePic}
          alt="avatar"
          className={styles.avatar}
        />
        <span className={styles.name}>{user.name}</span>
      </div>
      {user._id !== currentUser._id && (
        <Button
          handleClick={handleToggleFollow}
          className={styles.followButton}
        >
          {isFollowing ? 'Deixar de Seguir' : 'Seguir'}
        </Button>
      )}
    </div>
  );
};

export default FollowCard;