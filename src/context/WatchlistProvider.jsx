import { useState, useEffect } from "react";
import watchlistContext from "./watchlistContext.js";

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    const stored = localStorage.getItem("savedWatchlist");   
    return stored ? JSON.parse(stored) : [];   
  });

  useEffect(() => {
    localStorage.setItem("savedWatchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const isInWatchList = (id) => watchlist.find((w) => w.id === id);
  
  
  
  function addToWatchlist(movie) {
    if (isInWatchList(movie.id)) {
      return;
    }
    setWatchlist((prev) => [...prev, movie]);
  }

  function removeFromWatchlist(id) {
    setWatchlist(watchlist.filter((w) => w.id !== id));
  }

  return (
    <watchlistContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchList }}
    >
      {children}
    </watchlistContext.Provider>
  );
}
