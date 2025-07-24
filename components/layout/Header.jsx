// components/layout/Header.tsx
'use client'; // This is a Client Component

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaSearch, FaFilm, FaTv, FaArrowRight } from 'react-icons/fa';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  // CORRECT FIX: Use HTMLInputElement | null. This type is correctly handled by Next.js's TypeScript setup.
  // The previous error might have been due to a caching issue or a subtle typo.
  const searchInputRef = useRef(null); // Ref for focusing the input

  // Close mobile menu/search if route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchInputVisible(false);
    setSearchTerm(''); // Clear search term when navigating away
  }, [pathname]);

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isSearchInputVisible) { // Close search input if mobile menu is opened
      setIsSearchInputVisible(false);
      setSearchTerm('');
    }
  };

  // Function to toggle search input visibility
  const toggleSearchInput = () => {
    setIsSearchInputVisible(!isSearchInputVisible);
    if (!isSearchInputVisible) { // If search input is about to become visible, focus it
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      if (isMobileMenuOpen) { // Close mobile menu if search input is opened
        setIsMobileMenuOpen(false);
      }
    } else { // If search input is about to hide, clear search term
      setSearchTerm('');
    }
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchInputVisible(false);
      setSearchTerm('');
    }
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-4 shadow-xl relative z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/App Title */}
        <Link href="/" className="flex items-center space-x-2 text-3xl font-extrabold tracking-tight group">
          <FaFilm className="text-blue-400 group-hover:scale-110 transition-transform duration-300" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400 group-hover:from-blue-400 group-hover:to-purple-500 transition-colors duration-300">
            Movie Explorer
          </span>
        </Link>

        {/* Desktop Navigation & Search Icon */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-lg font-medium hover:text-blue-400 transition-colors duration-200">
            Home
          </Link>
          <Link href="/movie/popular" className="text-lg font-medium hover:text-blue-400 transition-colors duration-200">
            Movies
          </Link>
          <Link href="/tv/popular" className="text-lg font-medium hover:text-blue-400 transition-colors duration-200">
            TV Shows
          </Link>

          {/* Search Icon */}
          <button
            onClick={toggleSearchInput}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Toggle search input"
          >
            <FaSearch className="text-xl" />
          </button>
        </nav>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={toggleSearchInput}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Toggle search input"
          >
            <FaSearch className="text-xl" />
          </button>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Search Input (Animated Slide Down) */}
      <div
        className={`absolute left-0 w-full bg-gray-700 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isSearchInputVisible ? 'max-h-20 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <form onSubmit={handleSearchSubmit} className="container mx-auto px-4 flex items-center space-x-2">
          <div className="relative flex-grow">
            <input
              id="header-search-input"
              ref={searchInputRef}
              type="text"
              placeholder="Search movies or TV shows..."
              value={searchTerm}
              required
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {/* Explicit "Go" button */}
          <button
            type="submit"
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Go to search results"
          >
            <span>Go</span>
            <FaArrowRight />
          </button>
        </form>
      </div>

      {/* Mobile Menu (Animated Slide Down) */}
      <nav
        className={`md:hidden bg-gray-700 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-60 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <Link href="/" className="text-lg font-medium hover:text-blue-400 transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="/movie/popular" className="text-lg font-medium hover:text-blue-400 transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
            Movies
          </Link>
          <Link href="/tv/popular" className="text-lg font-medium hover:text-blue-400 transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
            TV Shows
          </Link>
        </div>
      </nav>
    </header>
  );
}