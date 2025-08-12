import React from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { TbMessageReportFilled } from "react-icons/tb";
import currentUser from '../../currentUser';
import './ReviewActionButton.css';

const ReviewActionButton = ({ review, onEdit, onReport }) => {
  const isOwner = review && review.userId && 
                  (review.userId._id === currentUser._id || review.userId === currentUser._id);

  if (isOwner) {
    return (
      <button className="review-action-btn" onClick={() => onEdit(review)} title="Editar Review">
        <FaPencilAlt />
      </button>
    );
  }
  return (
    <button className="review-action-btn" onClick={() => onReport(review)} title="Denunciar Review">
      <TbMessageReportFilled />
    </button>
  );
};

export default ReviewActionButton;
