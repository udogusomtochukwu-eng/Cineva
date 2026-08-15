import { createContext, useContext } from "react";

export const searchContext = createContext();

export function useSearch() {
  return useContext(searchContext);
}
