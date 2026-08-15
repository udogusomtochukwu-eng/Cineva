import { createContext, useContext } from "react";

const watchlistContext = createContext();

export function useWatchlist() {
  return useContext(watchlistContext);
}
export default watchlistContext;
