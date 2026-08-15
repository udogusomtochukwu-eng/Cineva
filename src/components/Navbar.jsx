import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { useSearch } from "../context/searchContext.js";
import SearchDropdown from "./SearchDropdown.jsx";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navSearchRef = useRef(null);
  const { searchTerm, setSearchTerm, setShowDropdown, heroSearchVisible } =
    useSearch();

  const shouldHideSearch = location.pathname === "/" && heroSearchVisible;

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        navSearchRef.current &&
        !navSearchRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowDropdown]);

  const navLinkClasses = (path) => {
    const isActive = location.pathname === path;
    return `relative pb-1 transition ${
      isActive
        ? "text-violet-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-violet-primary"
        : "text-text-secondary hover:text-text-primary"
    }`;
  };

  return (
    <header className="top-0 z-50 sticky bg-noir-bg/90 backdrop-blur-sm px-6 py-2">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <Link to="/" className="flex items-center gap-1 order-1 shrink-0">
          <img src="/Cineva-logosmall.png" alt="Cineva" className="w-12 h-12" />
          <span className="font-display font-semibold text-text-primary text-xl">
            Cineva
          </span>
        </Link>

        <div
          ref={navSearchRef}
          className={`relative sm:flex-1 order-3 sm:order-2 w-full sm:w-auto sm:max-w-sm transition-all duration-300 ${
            shouldHideSearch
              ? "opacity-0 hidden pointer-events-none"
              : "opacity-100 block "
          }`}
        >
          <Search
            size={16}
            className="top-1/2 left-3 absolute text-text-secondary -translate-y-1/2"
          />
          <input
            className="bg-noir-elevated py-2 pr-4 pl-9 border border-transparent focus:border-violet-primary rounded-full outline-none w-full text-text-primary text-sm transition"
            aria-label="Search for a movie"
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
          />
          {!shouldHideSearch && location.pathname === "/" && <SearchDropdown />}
        </div>
        <nav className="hidden md:flex items-center gap-6 order-2 font-medium shrink-0">
          <Link to="/" className={navLinkClasses("/")}>
            Home
          </Link>
          <Link to="/watchlist" className={navLinkClasses("/watchlist")}>
            Watchlist
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden order-2 text-text-primary shrink-0"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden top-full right-0 left-0 z-20 absolute flex flex-col gap-4 bg-noir-bg shadow-black/40 shadow-lg mt-3 px-6 py-4 border-noir-elevated border-t font-medium text-text-secondary">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-text-primary transition"
          >
            Home
          </Link>
          <Link
            to="/watchlist"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-text-primary transition"
          >
            Watchlist
          </Link>
        </nav>
      )}
    </header>
  );
}
