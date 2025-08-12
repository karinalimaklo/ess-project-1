import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SideMenu.module.css';
import logoCintonia from "../../assets/logotipocintonia.png";
import currentUser from '../../currentUser'; 

const SideMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sideMenu} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={styles.closeButton}>
          &times;
        </button>
        <img src={logoCintonia} alt="Cintonia Logo" className={styles.logo} />
        <ul className={styles.menuItems}>
          <li onClick={() => handleNavigate('/meu-perfil')}>Meu Perfil</li>
          {currentUser && currentUser.isAdmin && (
          <li onClick={() => handleNavigate('/moderation')}>Gerenciar User</li>
          )}
          {currentUser && currentUser.isAdmin && (
          <li onClick={() => handleNavigate('/cadastro')}>Cadastrar Musica</li>
          )}
          <li onClick={() => handleNavigate('/notificacoes')}>Notificações</li>
        </ul>
      </div>
    </div>
  );
};

export default SideMenu;