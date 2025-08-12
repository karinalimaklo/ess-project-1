import React from 'react';
import './StarRating.css';

const StarRating = ({ rating }) => {
  const totalStars = 5;
  const filledStars = Math.round(rating || 0);

  return (
    <div className="star-rating">
      {[...Array(totalStars)].map((_, index) => {
        const starClass = index < filledStars ? 'star filled' : 'star empty';
        return <span key={index} className={starClass}>★</span>;
      })}
    </div>
  );
};

export default StarRating;