import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './ToggleVisibilityButton.module.css';

const ToggleVisibilityButton = ({ review, onToggle }) => {
  const [isToggling, setIsToggling] = useState(false);
  
  const isCurrentlyHidden = review.isHidden;

  const handleToggle = async () => {
    setIsToggling(true);
    await onToggle(review._id);
    setIsToggling(false);
  };

  return (
    <button 
      onClick={handleToggle} 
      disabled={isToggling}
      className={`${styles.toggleButton} ${isCurrentlyHidden ? styles.hidden : styles.visible}`}
      title={isCurrentlyHidden ? 'Reexibir review' : 'Ocultar review'}
    >
      {isToggling ? '...' : (isCurrentlyHidden ? <FaEyeSlash /> : <FaEye />)}
    </button>
  );
};

export default ToggleVisibilityButton;
