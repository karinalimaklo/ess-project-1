import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import logoCintonia from './futuralogo.png'; 
import SideMenu from '../SideMenu/SideMenu';

export default function Header({ avatarUrl }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.left} onClick={() => setIsMenuOpen(true)}>
          <div className={styles.menuIcon}>
            <div />
            <div />
            <div />
          </div>
        </div>

        <div className={styles.center} onClick={() => navigate('/')}>
          <img src={logoCintonia} alt="CIntonia Logo" className={styles.logo} />
        </div>

        <div className={styles.right} onClick={() => navigate('/meu-perfil')}>
          <img
            src={avatarUrl}
            alt="Avatar"
            className={styles.avatar}
          />
        </div>
      </header>

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}