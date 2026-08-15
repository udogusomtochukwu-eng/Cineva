import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import { AnimatePresence } from "framer-motion";

export default function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/watchlist" element={<Watchlist />} />
      </Routes>
    </AnimatePresence>
  );
}
