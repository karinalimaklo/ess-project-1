import React, { useState } from "react";
import ReviewCard from "../components/ReviewCard/ReviewCard";
import useEffect from "react";
import { getAllReviews } from "../services/GetReviews";

export default function HomePage() {
  const [reviews, setReviews] = useState([
    { user: "Tulio", musica: "Let Down", nota: 5 },
    { user: "Lira", musica: "Famous", nota: 4 },
  ]);

  // useEffect(()=>{
  //   getAllReviews(setReviews);
  // },[])

  return (
    <div className="App-body" style={{ background: "white", color: "black" }}>
      {reviews?.length === 0 ? (
        <h1>Ainda não foi cadastrada nenhuma review</h1>
      ) : (
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          {reviews?.map((review) => {
            return <ReviewCard review={review} isAdmin={true}/>;
          })}
        </div>
      )}
    </div>
  );
}
