import { useState } from "react";
import useDebounce from "../hooks/useDebounce.js";
import { searchContext } from "./searchContext.js";

export function SearchProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [heroSearchVisible, setHeroSearchVisible] = useState(true);

  return (
    <searchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        debouncedSearchTerm,
        showDropdown,
        setShowDropdown,
        heroSearchVisible,
        setHeroSearchVisible,
      }}
    >
      {children}
    </searchContext.Provider>
  );
}
