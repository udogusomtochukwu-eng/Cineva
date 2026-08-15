import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails } from "../services/tmbd.js";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Star, ArrowLeft } from "lucide-react";
import { useWatchlist } from "../context/watchlistContext.js";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";
const FALLBACK_IMAGE = "https://placehold.co/500x750?text=No+Image";

export default function MovieDetail() {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchList } = useWatchlist();

  useEffect(() => {
    async function fetchMovieDetails() {
      setLoading(true);
      const fetchedMovieDetails = await getMovieDetails(id);
      setMovieDetails(fetchedMovieDetails);
      setLoading(false);
    }
    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-noir-bg min-h-screen text-text-primary">
        Loading...
      </div>
    );
  }
  if (!movieDetails) return null;

  const saved = isInWatchList(movieDetails.id);
  const year = movieDetails.release_date
    ? movieDetails.release_date.slice(0, 4)
    : "—";
  const rating = movieDetails.vote_average
    ? movieDetails.vote_average.toFixed(1)
    : "—";

  return (
    <motion.div
      className="bg-noir-bg pb-6 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop hero */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        <img
          src={
            movieDetails.backdrop_path
              ? `${BACKDROP_BASE_URL}${movieDetails.backdrop_path}`
              : FALLBACK_IMAGE
          }
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir-bg via-noir-bg/70 to-noir-bg/20" />

        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="top-6 left-6 absolute bg-noir-bg/70 hover:bg-noir-elevated p-2 rounded-full transition"
        >
          <ArrowLeft size={20} className="text-text-primary" />
        </button>
      </div>

      {/* Content, pulled up to overlap the backdrop */}
      <div className="relative flex md:flex-row flex-col gap-6 mx-auto -mt-32 px-6 max-w-5xl">
        <img
          src={
            movieDetails.poster_path
              ? `${IMAGE_BASE_URL}${movieDetails.poster_path}`
              : FALLBACK_IMAGE
          }
          alt={movieDetails.title}
          className="shadow-black/50 shadow-lg rounded-xl w-40 md:w-56 h-fit object-contain shrink-0"
        />

        <div className="flex flex-col gap-3 pb-10">
          <h1 className="font-semibold text-text-primary text-3xl md:text-4xl">
            {movieDetails.title || "Untitled Movie"}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-text-secondary text-sm">
            <span>{year}</span>
            <span>•</span>
            <span>
              {movieDetails.runtime ? `${movieDetails.runtime} min` : "—"}
            </span>
            <span className="flex items-center gap-1 ml-1">
              <Star size={14} className="fill-violet-hover text-violet-hover" />
              {rating}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-1">
            {movieDetails.genres?.map((genre) => (
              <span
                key={genre.id}
                className="bg-noir-elevated px-3 py-1 rounded-full text-text-secondary text-xs"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              saved
                ? removeFromWatchlist(movieDetails.id)
                : addToWatchlist(movieDetails)
            }
            className="flex items-center gap-2 bg-violet-primary hover:bg-violet-hover mt-3 px-5 py-2 rounded-full w-fit font-medium text-text-primary transition"
          >
            {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            {saved ? "In Watchlist" : "Add to Watchlist"}
          </button>

          <p className="mt-4 max-w-2xl text-text-secondary leading-relaxed">
            {movieDetails.overview || "No overview available."}
          </p>

          <div className="mt-2">
            <h2 className="mb-1 text-text-secondary text-xs uppercase tracking-wide">
              Production
            </h2>
            <p className="text-text-secondary text-sm">
              {movieDetails.production_companies?.length
                ? movieDetails.production_companies
                    .map((c) => c.name)
                    .join(", ")
                : "No production company information available."}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
