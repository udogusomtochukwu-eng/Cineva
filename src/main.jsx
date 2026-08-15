import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { WatchlistProvider } from "./context/WatchlistProvider.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <WatchlistProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </WatchlistProvider>
    </BrowserRouter>
  </StrictMode>,
);
