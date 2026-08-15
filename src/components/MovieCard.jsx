import { Link } from "react-router-dom";
import { Bookmark, BookmarkCheck, Star } from "lucide-react";
import { useWatchlist } from "../context/watchlistContext.js";

const FALLBACK_IMAGE = "https://placehold.co/500x750?text=No+Image";

function MovieCard({ movie }) {
  const { addToWatchlist, removeFromWatchlist, isInWatchList } = useWatchlist();
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : FALLBACK_IMAGE;
  const saved = isInWatchList(movie.id);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "—";

  return (
    <Link to={`/movie/${movie.id}`}>
      <div className="flex flex-col gap-2 bg-noir-card hover:shadow-lg hover:shadow-violet-primary/20 rounded-xl h-full overflow-hidden transition-shadow duration-300">
        <div className="relative w-full">
          <img
            alt={movie.title || "Movie poster"}
            src={posterUrl}
            onError={(event) => {
              event.target.onerror = null;
              event.target.src = FALLBACK_IMAGE;
            }}
            className="w-full object-cover aspect-square hover:scale-105 transition-transform duration-300"
          />
          <button
            type="button"
            aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
            className="top-2 right-2 absolute bg-noir-bg/70 hover:bg-violet-primary p-2 rounded-full transition"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (saved) {
                removeFromWatchlist(movie.id);
              } else {
                addToWatchlist(movie);
              }
            }}
          >
            {saved ? (
              <BookmarkCheck size={18} className="text-violet-hover" />
            ) : (
              <Bookmark size={18} className="text-text-primary" />
            )}
          </button>
        </div>

        <div className="flex flex-col gap-1 p-3">
          <p className="font-medium text-text-primary text-lg line-clamp-2">
            {movie.title || "Untitled Movie"}
          </p>
          <div className="flex justify-between items-center text-text-secondary text-sm">
            <span>{year}</span>
            <span className="flex items-center gap-1">
              <Star size={14} className="fill-violet-hover text-violet-hover" />
              {rating}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
export default MovieCard;
