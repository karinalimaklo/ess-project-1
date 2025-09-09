import React, { useState } from "react";
import ReviewCard from "../ReviewCard/ReviewCard";
import { useEffect } from "react";
import { getAllReviews } from "../../services/reviews";
import Button from "@mui/material/Button"; // import do botão MUI
import currentUser from "../../currentUser"; // import do usuário atual
import ReviewDetailModal from "../../components/Modal/ReviewDetailModal";
import { useNavigate } from "react-router-dom";

const rowSize = 5; // Número de cards por linha

export default function GroupReviewCards() {
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const handleDeleteReview = (id) => {
    setReviews((prev) => prev.filter((review) => review._id !== id));
  };

  const navigate = useNavigate();

  const handleEditClick = (review) => {
    navigate(`/editar-review/${review._id}`, { state: { review } });
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
    <div style={{ minHeight: "20vh", paddingBottom: "5rem", color: "black" }}>
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
                    onClick={(rev) => setSelectedReview(rev)}
                  />
                ))}
            </div>
          ))}
          {!showAll && reviews.length > rowSize && (
            <Button
              variant="outlined"
              onClick={() => setShowAll(true)}
              sx={{
                marginTop: 2,
                alignSelf: "flex-start",
                color: "#fff",
                borderColor: "#fff",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                fontWeight: "bold",
                "&:hover": {
                  color: "#bf1d73",
                  borderColor: "#bf1d73",
                  backgroundColor: "rgba(245, 179, 211, 0.4)",
                },
              }}
            >
              Ver mais
            </Button>
          )}
        </div>
      )}

      <ReviewDetailModal
        isOpen={!!selectedReview}
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
        onEdit={handleEditClick}
        onReport={(rev) => console.log("reportar", rev)}
      />
    </div>
  );
}
