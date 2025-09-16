import React, { useState } from "react";
import SearchBar from "../components/SearchBar/searchBar";
import SearchResults from "../components/SearchResults/SearchResults";
import GroupReviewCards from "../components/GroupReviewCards/GroupReviewCards";
import bgImage from "../assets/background.png";

export default function MainPage() {
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchType, setSearchType] = useState("");

  // função que recebe os dados e o tipo de busca do SearchBar
  const handleSearchResults = (data, type) => {
    setResults(data);
    setSearchType(type);
    setHasSearched(true); // Marca que uma busca foi realizada
  };

  return (
    <div
      className="App-body"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover", // cobre toda a tela
        backgroundPosition: "center", // centraliza
        backgroundRepeat: "no-repeat", // evita repetição
      }}
    >
      <h3>Busca</h3>
      <SearchBar onResults={handleSearchResults} />
      <SearchResults
        results={results}
        searchType={searchType}
        hasSearched={hasSearched}
      />

      <h3>Reviews</h3>
      <GroupReviewCards />
    </div>
  );
}
