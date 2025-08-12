import React, { useState } from "react";
import ReviewCard from "../ReviewCard/ReviewCard";
import { useEffect } from "react";
import { getAllReviews } from "../../services/reviews";
import Button from "@mui/material/Button"; // import do botão MUI
import currentUser from "../../currentUser"; // import do usuário atual

const rowSize = 5; // Número de cards por linha

export default function GroupReviewCards() {
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const handleDeleteReview = (id) => {
    setReviews((prev) => prev.filter((review) => review._id !== id));
  };
  useEffect(() => {
    const fetchReviews = async () => {
      const allReviews = await getAllReviews();
      console.log("Reviews fetched:", allReviews);
      if (allReviews) {
        setReviews(allReviews.data);
      }
    };
    fetchReviews();
  }, []);

  const displayedReviews =
    !showAll && reviews.length > rowSize ? reviews.slice(0, rowSize) : reviews;

  return (
    <div
      className="App-body"
      style={{ minHeight: "20vh", paddingBottom: "5rem", color: "black" }}
    >
      {reviews?.length === 0 ? (
        <h1>Ainda não foi cadastrada nenhuma review</h1>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Array.from({
            length: Math.ceil(displayedReviews.length / rowSize),
          }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              style={{ display: "flex", flexDirection: "row", gap: 10 }}
            >
              {displayedReviews
                .slice(rowIdx * rowSize, rowIdx * rowSize + rowSize)
                .map((review, idx) => (
                  <ReviewCard
                    key={rowIdx * rowSize + idx}
                    review={review}
                    isAdmin={currentUser?.isAdmin}
                    onDelete={handleDeleteReview}
                  />
                ))}
            </div>
          ))}
          {!showAll && reviews.length > rowSize && (
            <Button
              variant="outlined"
              onClick={() => setShowAll(true)}
              sx={{ marginTop: 2, alignSelf: "flex-start" }}
            >
              Ver mais
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
