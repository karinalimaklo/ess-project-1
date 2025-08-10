import React, { useState } from "react";
import SearchBar from "../components/SearchBar/searchBar";
import SearchResults from "../components/SearchResults/SearchResults";

export default function HomePage() {
  const reviews = [
    { user: "Tulio", musica: "Let Down" },
    { user: "Lira", musica: "Famous" },
  ];
  return (
    <div className="App-body" style={{ background: "white", color: "black" }}>
      {reviews?.length === 0 ? (
        <h1>Ainda não foi cadastrada nenhuma review</h1>
      ) : (
        <div>
          {/* {reviews?.map((review) => {return })} */}

        </div>
      )}
    </div>
  );
}
