import React from 'react';
import '../Button.css'

export default function Header({ children, handleClick, ...props }) {
  return (
    <button className="review-btn" onClick={handleClick} {...props} >{children}</button>
  );
}
