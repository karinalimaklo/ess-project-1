import React from 'react';
import './Card.css'

export default function CardWrapper({ children, ...props }) {
  return (
    <div className="card-wrapper" {...props}>{children}</div>
  );
}
