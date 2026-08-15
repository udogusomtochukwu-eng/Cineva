import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSearchResults } from "../services/tmbd.js";
import { useSearch } from "../context/searchContext.js";

export default function SearchDropdown() {
  const { debouncedSearchTerm, showDropdown, setShowDropdown, setSearchTerm } =
    useSearch();
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchResults() {
      if (!debouncedSearchTerm) {
        setSearchResults([]);
        return;
      }
      const result = await getSearchResults(debouncedSearchTerm);
      setSearchResults(result.results);
    }
    fetchResults();
  }, [debouncedSearchTerm]);

  if (!showDropdown || !debouncedSearchTerm || searchResults.length === 0) {
    return null;
  }

  return (
    <div className="top-full right-0 left-0 z-10 absolute bg-noir-card shadow-black/40 shadow-lg mt-2 rounded-xl overflow-hidden text-left">
      {searchResults.slice(0, 5).map((movie) => (
        <div
          className="hover:bg-noir-elevated p-3 text-text-primary text-sm transition duration-200 cursor-pointer"
          key={movie.id}
          onClick={() => {
            navigate(`/movie/${movie.id}`);
            setShowDropdown(false);
            setSearchTerm("");
          }}
        >
          {movie.title}
        </div>
      ))}
    </div>
  );
}
