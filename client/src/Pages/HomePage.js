import React, { useState } from "react";
import ReviewCard from "../components/ReviewCard/ReviewCard";
import useEffect from "react";
import { getAllReviews } from "../services/GetReviews";
import Button from "@mui/material/Button"; // import do botão MUI

export default function HomePage() {
  const [reviews, setReviews] = useState([
    { user: "Tulio", musica: "Let Down", nota: 5 },
    { user: "Lira", musica: "Famous", nota: 4 },
    { user: "Tulio", musica: "Let Down", nota: 5 },
    { user: "Lira", musica: "Famous", nota: 4 },
    { user: "Tulio", musica: "Let Down", nota: 5 },
    { user: "Lira", musica: "Famous", nota: 4 },
  ]);
  const [showAll, setShowAll] = useState(false);

  // useEffect(()=>{
  //   getAllReviews(setReviews);
  // },[])

  const displayedReviews =
    !showAll && reviews.length > 3 ? reviews.slice(0, 3) : reviews;

  return (
    <div className="App-body" style={{ background: "white", color: "black" }}>
      {reviews?.length === 0 ? (
        <h1>Ainda não foi cadastrada nenhuma review</h1>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Array.from({ length: Math.ceil(displayedReviews.length / 3) }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              style={{ display: "flex", flexDirection: "row", gap: 10 }}
            >
              {displayedReviews
                .slice(rowIdx * 3, rowIdx * 3 + 3)
                .map((review, idx) => (
                  <ReviewCard
                    key={rowIdx * 3 + idx}
                    review={review}
                    isAdmin={true}
                  />
                ))}
            </div>
          ))}
          {!showAll && reviews.length > 3 && (
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