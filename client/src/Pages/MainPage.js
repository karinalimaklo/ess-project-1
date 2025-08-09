import React, { useState } from "react";
import SearchBar from "../components/SearchBar/searchBar";
import SearchResults from "../components/SearchResults/SearchResults";

export default function MainPage() {
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchType, setSearchType] = useState('');

  // função que recebe os dados e o tipo de busca do SearchBar
  const handleSearchResults = (data, type) => {
    setResults(data);
    setSearchType(type);
    setHasSearched(true); // Marca que uma busca foi realizada
  };

    return (
        <div className="App-body">

            <SearchBar onResults={handleSearchResults} />
      
            <SearchResults
                results={results}
                searchType={searchType}
                hasSearched={hasSearched}
            />

        </div>
    );
}
