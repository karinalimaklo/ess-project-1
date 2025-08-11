import React, { useState } from "react";
import SearchBar from "../components/SearchBar/searchBar";
import SearchResults from "../components/SearchResults/SearchResults";
import ReviewCard from "../components/ReviewCard/ReviewCard";
import useEffect from "react";

export default function HomePage() {
  const [reviews, setReviews] = useState([
    { user: "Tulio", musica: "Let Down", nota: 5 },
    { user: "Lira", musica: "Famous", nota: 4 },
  ]);

  useEffect(()=>{
    getAllReviews(setReviews);
  },[])
  
  return (
    <div className="App-body" style={{ background: "white", color: "black" }}>
      {reviews?.length === 0 ? (
        <h1>Ainda não foi cadastrada nenhuma review</h1>
      ) : (
        <div>
          {reviews?.map((review) => {
            return <ReviewCard review={review} />;
          })}
        </div>
      )}
    </div>
  );
}
