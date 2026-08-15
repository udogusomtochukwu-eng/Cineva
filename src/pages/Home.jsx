import { useEffect, useState, useRef, useCallback } from "react";
import {
  getTrendingMovies,
  getGenres,
  getFilteredMovies,
  getSearchResults,
} from "../services/tmbd.js";
import MovieCard from "../components/MovieCard.jsx";
import MovieCardSkeleton from "../components/MovieCardSkeleton.jsx";
import { motion } from "framer-motion";
import { useSearch } from "../context/searchContext.js";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useSlowLoading } from "../hooks/useSlowLoading.js";
import Navbar from "../components/Navbar.jsx";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const observerRef = useRef(null);
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [genres, setGenres] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredmovies, setFilteredMovies] = useState([]);
  const hasActiveFilters = selectedGenre || selectedRating || selectedYear;
  const heroRef = useRef(null);
  const heroSearchRef = useRef(null);
  const isSlow = useSlowLoading(loading);
  const {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    showDropdown,
    setShowDropdown,
    setHeroSearchVisible,
  } = useSearch();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeroSearchVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [setHeroSearchVisible]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        heroSearchRef.current &&
        !heroSearchRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowDropdown]);

  const lastMovieRef = useCallback((node) => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observerRef.current.observe(node);
  }, []);

  useEffect(() => {
    if (!debouncedSearchTerm) {
      return;
    }
    async function fetchResults() {
      setLoading(true);
      const result = await getSearchResults(debouncedSearchTerm);
      setSearchResults(result?.results ?? []);
      setLoading(false);
    }
    fetchResults();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    async function fetchMovies() {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      const result = await getTrendingMovies(page);
      setMovies((prevMovies) => {
        const existingIds = new Set(prevMovies.map((m) => m.id));
        const newResults = result.results.filter((r) => !existingIds.has(r.id));
        return [...prevMovies, ...newResults];
      });
      if (page === 1) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
    fetchMovies();
  }, [page]);

  useEffect(() => {
    async function fetchMovieGenres() {
      const fetchedGenres = await getGenres();
      setGenres(fetchedGenres);
    }
    fetchMovieGenres();
  }, []);

  useEffect(() => {
    if (!hasActiveFilters) return;
    async function fetchFilteredMovies() {
      setLoading(true);
      const filteredResult = await getFilteredMovies(
        { genre: selectedGenre, year: selectedYear, rating: selectedRating },
        page,
      );
      setFilteredMovies(filteredResult.results);
      setLoading(false);
    }
    fetchFilteredMovies();
  }, [selectedGenre, selectedYear, selectedRating, page, hasActiveFilters]);

  return (
    <motion.div
      className="bg-noir-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Navbar />
      <section className="px-6 py-16 text-center" ref={heroRef}>
        <h1 className="mb-3 font-display font-semibold text-text-primary text-3xl md:text-4xl">
          Discover your next favorite movie.
        </h1>
        <p className="mb-8 text-text-secondary">
          Search thousands of movies, get personalized picks, and build your
          watchlist.
        </p>

        <div ref={heroSearchRef} className="relative mx-auto w-full max-w-xl">
          <Search
            size={18}
            className="top-1/2 left-4 absolute text-text-secondary -translate-y-1/2"
          />
          <input
            className="bg-noir-elevated py-3 pr-5 pl-12 border border-transparent focus:border-violet-primary rounded-full outline-none w-full text-text-primary transition"
            placeholder="Search"
            aria-label="Search for a movie"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
          />
          {showDropdown && debouncedSearchTerm && searchResults?.length > 0 && (
            <div className="top-full right-0 left-0 z-10 absolute bg-noir-card shadow-black/40 shadow-lg mt-2 rounded-xl overflow-hidden text-left">
              {searchResults.slice(0, 5).map((movie) => (
                <div
                  className="hover:bg-noir-elevated p-3 text-text-primary transition duration-200 cursor-pointer"
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
          )}
        </div>
      </section>

      <div className="flex flex-nowrap justify-center gap-3 px-6 pb-8 overflow-x-auto transition">
        <select
          value={selectedGenre}
          onChange={(e) => {
            setSelectedGenre(e.target.value);
            setSearchTerm("");
          }}
          className="bg-noir-elevated px-2 py-2 border border-transparent focus:border-violet-primary rounded-full outline-none text-text-primary transition"
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Year"
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            setSearchTerm("");
          }}
          className="bg-noir-elevated px-4 py-2 border border-transparent focus:border-violet-primary rounded-full outline-none w-24 text-text-primary placeholder:text-text-secondary transition"
        />

        <input
          type="number"
          placeholder="Rating"
          value={selectedRating}
          onChange={(e) => {
            setSelectedRating(e.target.value);
            setSearchTerm("");
          }}
          className="bg-noir-elevated px-4 py-2 border border-transparent focus:border-violet-primary rounded-full outline-none w-28 text-text-primary placeholder:text-text-secondary transition"
          min="0"
          max="10"
          step="0.1"
        />
      </div>

      {loading ? (
        <>
          <div className="gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-3">
            {Array.from({ length: 16 }).map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))}
          </div>
          {isSlow && (
            <p className="mt-4 text-text-secondary text-sm text-center">
              This is taking longer than usual — check your connection.
            </p>
          )}
        </>
      ) : (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4 px-6">
            <div className="bg-violet-primary rounded-full w-1 h-6" />
            <h2 className="font-semibold text-text-primary text-xl">
              {debouncedSearchTerm
                ? "Search Results"
                : hasActiveFilters
                  ? "Filtered Results"
                  : "Trending This Week"}
            </h2>
          </div>
          {debouncedSearchTerm && searchResults.length === 0 && !loading ? (
            <div className="flex flex-col items-center gap-2 py-20 text-center">
              <p className="text-text-secondary text-lg">
                No results found for "{debouncedSearchTerm}"
              </p>
              <p className="text-text-secondary text-sm">
                Try a different title or check your spelling.
              </p>
            </div>
          ) : hasActiveFilters && filteredmovies.length === 0 && !loading ? (
            <div className="flex flex-col items-center gap-2 py-20 text-center">
              <p className="text-text-secondary text-lg">
                No movies match these filters.
              </p>
              <p className="text-text-secondary text-sm">
                Try adjusting your genre, year, or rating.
              </p>
            </div>
          ) : (
            <div className="gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-6">
              {debouncedSearchTerm
                ? (searchResults ?? []).map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))
                : hasActiveFilters
                  ? filteredmovies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))
                  : movies.map((movie, index) => {
                      if (index === movies.length - 1) {
                        return (
                          <div key={movie.id} ref={lastMovieRef}>
                            <MovieCard movie={movie} />
                          </div>
                        );
                      }
                      return <MovieCard key={movie.id} movie={movie} />;
                    })}
            </div>
          )}

          {loadingMore && (
            <div className="p-4 font-semibold text-xl text-center">
              Loading more movies...
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
export default Home;
