import React from 'react';
import styles from './Header.module.css';
import { useNavigate } from 'react-router-dom';

export default function Header({ onMenuClick, avatarUrl }) {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.left} onClick={onMenuClick}>
        <div className={styles.menuIcon}>
          <div />
          <div />
          <div />
        </div>
      </div>

      <div className={styles.center} onClick={() => navigate('/')}>
        CIntonia
      </div>

      <div className={styles.right} onClick={() => navigate('/meu-perfil')}>
        <img
          src={avatarUrl}
          alt="Avatar"
          className={styles.avatar}
        />
      </div>
    </header>
  );
}
