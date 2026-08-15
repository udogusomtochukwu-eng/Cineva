const apiKey = import.meta.env.VITE_TMDB_API_KEY;

export async function getTrendingMovies(page = 1) {
  const data = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=${page}`,
  );
  if (!data.ok) {
    return `Error fetching data: ${data.status}`;
  }
  const movies = await data.json();
  return movies;
}

export async function getMovieDetails(id) {
  const data = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`,
  );
  if (!data.ok) {
    return `Error fetching data: ${data.status}`;
  }
  const movieDetails = await data.json();
  return movieDetails;
}

export async function getSearchResults(query) {
  const data = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${apiKey}`,
  );
  if (!data.ok) {
    return `Error fetching data: ${data.status}`;
  }
  const result = await data.json();
  return result;
}

export async function getGenres() {
  const data = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`,
  );
  if (!data.ok) {
    return `Error fetching genres: ${data.status}`;
  }
  const result = await data.json();
  return result.genres;
}

export async function getFilteredMovies({ genre, year, rating }, page = 1) {
  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}`;
  if (genre) url += `&with_genres=${genre}`;
  if (year) url += `&primary_release_year=${year}`;
  if (rating) url += `&vote_average.gte=${rating}`;

  const data = await fetch(url);
  if (!data.ok) {
    return `Error fetching data: ${data.status}`;
  }
  const result = await data.json();
  return result;
}

export async function getMoviesByGenres(genreIds, page = 1) {
  const genreString = genreIds.join(",");
  const data = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreString}&page=${page}`,
  );
  if (!data.ok) {
    return `Error fetching data: ${data.status}`;
  }
  const result = await data.json();
  return result;
}
export function getTopGenres(watchlist, count = 2) {
  const genreIds = watchlist.flatMap((movie) => movie.genre_ids);

  const genreCounts = genreIds.reduce((counts, genreId) => {
    if (counts[genreId]) {
      counts[genreId]++;
    } else {
      counts[genreId] = 1;
    }
    return counts;
  }, {});

  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([genreId]) => Number(genreId));

  return topGenres;
}
