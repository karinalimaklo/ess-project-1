import React from "react";
import CardWrapper from "../Card/Card";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import DiscardModal from "../DiscardModal/DiscardModal";

export default function ReviewCard({ review, isAdmin }) {
  return (
    <CardWrapper>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Typography component="legend">{review.musica}</Typography>
        {isAdmin ? (
          <DiscardModal handleDelete={console.log("deletar")} />
        ) : (
          <></>
        )}
      </div>
      <Rating name="read-only" value={review.nota} readOnly />
      <br />
      <br />
      <Typography component="legend">{review.user}</Typography>
    </CardWrapper>
  );
}
