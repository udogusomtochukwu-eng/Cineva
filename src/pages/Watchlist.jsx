import { useWatchlist } from "../context/watchlistContext.js";
import MovieCard from "../components/MovieCard.jsx";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { getTopGenres } from "../services/tmbd.js";
import { getMoviesByGenres } from "../services/tmbd.js";
import { Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useSearch } from "../context/searchContext.js";

export default function Watchlist() {
  const { watchlist } = useWatchlist();
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const { debouncedSearchTerm } = useSearch();
  const filteredWatchlist = debouncedSearchTerm
    ? watchlist.filter((movie) =>
        movie.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      )
    : watchlist;
  const cardRefs = useRef({});
  const dropdownRef = useRef(null);
  const [highlightedId, setHighlightedId] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  function scrollToMovie(id) {
    const el = cardRefs.current[id];

    if (el) {
      setShowSuggestions(false);
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedId(id);
      setTimeout(() => setHighlightedId(null), 2000);
    }
  }

  useEffect(() => {
    setShowSuggestions(Boolean(debouncedSearchTerm));
  }, [debouncedSearchTerm]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function fetchRecommendations() {
      if (watchlist.length === 0) {
        setRecommendedMovies([]);
        return;
      }

      const topGenres = getTopGenres(watchlist);
      const result = await getMoviesByGenres(topGenres);

      const watchlistIds = watchlist.map((movie) => movie.id);
      const filtered = result.results.filter(
        (movie) => !watchlistIds.includes(movie.id),
      );

      setRecommendedMovies(filtered);
    }
    fetchRecommendations();
  }, [watchlist]);

  return (
    <motion.div
      className="relative bg-noir-bg px-6 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Navbar />
      <div className="mb-8">
        <div ref={dropdownRef} className="relative">
          {showSuggestions &&
            debouncedSearchTerm &&
            filteredWatchlist.length > 0 && (
              <div className="top-full right-0 z-40 absolute bg-noir-card shadow-lg mt-3 rounded-xl w-full max-w-sm overflow-hidden">
                {filteredWatchlist.slice(0, 5).map((movie) => (
                  <div
                    key={movie.id}
                    className="hover:bg-noir-elevated p-3 text-text-primary transition duration-200 cursor-pointer"
                    onClick={() => scrollToMovie(movie.id)}
                  >
                    {movie.title}
                  </div>
                ))}
              </div>
            )}
        </div>
        <h1 className="mt-5 font-display font-semibold text-text-primary text-3xl">
          Your Watchlist
        </h1>
        <p className="mt-1 text-text-secondary">
          {watchlist.length} {watchlist.length === 1 ? "movie" : "movies"} saved
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-3 py-24 text-center">
          <Bookmark size={40} className="text-text-secondary" />
          <p className="font-display text-text-secondary text-lg">
            Your watchlist is empty.
          </p>
          <Link
            to="/"
            className="bg-violet-primary hover:bg-violet-hover mt-2 px-5 py-2 rounded-full font-display font-medium text-text-primary transition"
          >
            Discover Movies
          </Link>
        </div>
      ) : (
        <>
          <div className="gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredWatchlist.map((movie) => (
              <div
                key={movie.id}
                ref={(el) => (cardRefs.current[movie.id] = el)}
                className={
                  highlightedId === movie.id
                    ? "ring-2 ring-violet-primary rounded-xl transition"
                    : ""
                }
              >
                <MovieCard key={movie.id} movie={movie} />
              </div>
            ))}
          </div>

          {recommendedMovies.length > 0 && (
            <div className="mt-14">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-violet-primary rounded-full w-1 h-6" />
                <h2 className="font-semibold text-text-primary text-xl">
                  Recommended For You:
                </h2>
              </div>
              <div className="gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {recommendedMovies.slice(0, 8).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
