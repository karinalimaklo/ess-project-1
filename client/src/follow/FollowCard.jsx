import React from 'react';
import { useNavigate } from 'react-router-dom';
import currentUser from './currentUser';
import { createFollow, deleteFollow } from './followAPI'; 
import styles from './FollowCard.module.css';
import Button from '../components/Button/Button';

const FollowCard = ({ user, initialIsFollowing }) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = React.useState(initialIsFollowing);

  const handleToggleFollow = async () => {
    try {
      if (isFollowing) {
        await deleteFollow(currentUser._id, user._id);
      } else {
        await createFollow(currentUser._id, user._id);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Falha ao atualizar o status de 'seguir'", error);
      alert("Ocorreu um erro. Tente novamente.");
    }
  };

  if (!user) return null;

  return (
    <div className={styles.card}>
      <div className={styles.userInfo} onClick={() => navigate(`/perfil/${user._id}`)}>
        <img
          src={user.avatar || '/avatar_mateus.png'}
          alt="avatar"
          className={styles.avatar}
        />
        <span className={styles.name}>{user.name}</span>
      </div>
      {user._id !== currentUser._id && (
        <Button
          handleClick={handleToggleFollow}
          className={styles.followButton}        >
          {isFollowing ? 'Deixar de Seguir' : 'Seguir'}
        </Button>
      )}
    </div>
  );
};

export default FollowCard;