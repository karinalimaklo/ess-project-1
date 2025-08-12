import React from "react";
import CardWrapper from "../Card/Card";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import DiscardModal from "../DiscardModal/DiscardModal";
import { deleteReview } from "../../services/reviews";
import currentUser from "../../currentUser";
export default function ReviewCard({ review, isAdmin, onDelete }) {
  const handleDelete = async () => {
    await deleteReview(review._id, currentUser._id);
    if (onDelete) onDelete(review._id);
  };
  return (
    <CardWrapper data-cy="review-card">
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Typography component="legend">{review.musica}</Typography>
        {isAdmin ? <DiscardModal handleDelete={handleDelete}/> : <></>}
      </div>
      <Rating name="read-only" value={review.rating} readOnly />
      <br />
      <br />
      <Typography component="legend">{review.artista}</Typography>
    </CardWrapper>
  );
}
