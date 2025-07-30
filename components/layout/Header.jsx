// components/layout/Header.tsx
'use client'; // This is a Client Component, as it uses hooks and client-side effects

import { useState, useEffect, useRef, useCallback } from 'react'; // React hooks for state, effects, and memoization
import Link from 'next/link'; // Next.js component for client-side navigation
import { useRouter, usePathname } from 'next/navigation'; // Next.js hooks for routing information
import { FaBars, FaTimes, FaSearch, FaFilm, FaTv, FaArrowRight } from 'react-icons/fa'; // React Icons for UI elements

/**
 * Header component provides navigation, search functionality,
 * and a dynamic sticky effect based on scroll direction.
 * It features a semi-transparent background with a backdrop blur.
 */
export default function Header() {
  // State for controlling the visibility of the mobile navigation menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State for controlling the visibility of the search input field
  const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
  // State to store the current value of the search input
  const [searchTerm, setSearchTerm] = useState('');

  // Next.js router instance for programmatic navigation
  const router = useRouter();
  // Next.js pathname hook to get the current route path
  const pathname = usePathname();

  // State for controlling the header's visibility based on scroll
  const [isVisible, setIsVisible] = useState(true); // Header is visible by default
  // State to track the last vertical scroll position
  const [lastScrollY, setLastScrollY] = useState(0);

  // Ref for the search input element to allow programmatic focus
  // Initialized with null, type will be inferred or asserted later when used on client
  const searchInputRef = useRef(null);

  // useEffect hook to handle side effects when the route changes (pathname updates)
  // Ensures that menus/search are closed and header visibility is reset on new page loads
  useEffect(() => {
    setIsMobileMenuOpen(false);      // Close mobile menu
    setIsSearchInputVisible(false);  // Hide search input
    setSearchTerm('');               // Clear search term
    setIsVisible(true);              // Ensure header is visible on a new page load
    setLastScrollY(window.scrollY);  // Reset the last scroll position reference
  }, [pathname]); // Dependency array: this effect runs whenever the pathname changes

  // useCallback memoizes the toggleMobileMenu function.
  // This prevents the function from being re-created on every render,
  // which can be beneficial if passed to memoized child components (though not strictly necessary here).
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev); // Toggle the mobile menu's open/closed state
    if (isSearchInputVisible) { // If the search input is currently visible
      setIsSearchInputVisible(false); // Hide the search input
      setSearchTerm(''); // Clear the search term
    }
  }, [isSearchInputVisible]); // Dependency: re-create this function if isSearchInputVisible changes

  // useCallback memoizes the toggleSearchInput function.
  const toggleSearchInput = useCallback(() => {
    setIsSearchInputVisible(prev => {
      if (!prev) { // If the search input is currently hidden and about to become visible
        // Use setTimeout to allow the DOM to update before attempting to focus
        setTimeout(() => {
          // Check if searchInputRef.current is an HTMLInputElement before calling focus()
          if (
            searchInputRef.current &&
            searchInputRef.current instanceof HTMLInputElement &&
            typeof searchInputRef.current.focus === 'function'
          ) {
            searchInputRef.current.focus();
          }
        }, 100);
        if (isMobileMenuOpen) { // If the mobile menu is open, close it
          setIsMobileMenuOpen(false);
        }
      } else { // If the search input is currently visible and about to hide
        setSearchTerm(''); // Clear the search term
      }
      return !prev; // Toggle the search input's visibility state
    });
  }, [isMobileMenuOpen]); // Dependency: re-create this function if isMobileMenuOpen changes

  // useCallback memoizes the handleSearchSubmit function.
  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault(); // Prevent the default form submission (page reload)
    // Navigate to the search results page. The query parameter is URL-encoded.
    // The search page (app/search/page.tsx) handles displaying results or a "no query" message.
    router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    setIsSearchInputVisible(false); // Hide the search input after submission
    setSearchTerm(''); // Clear the search term
  }, [searchTerm, router]); // Dependencies: re-create if searchTerm or router instance changes

  // useEffect hook to implement the scroll-based header visibility logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY; // Get the current vertical scroll position

      // Apply the hide/show effect only if the user has scrolled past a certain threshold (e.g., 100px)
      // and if neither the mobile menu nor the search input is currently open.
      // This prevents the header from abruptly disappearing while a user is interacting with it.
      if (currentScrollY > 100 && !isMobileMenuOpen && !isSearchInputVisible) {
        if (currentScrollY > lastScrollY) {
          // User is scrolling down: hide the header
          setIsVisible(false);
        } else {
          // User is scrolling up: show the header
          setIsVisible(true);
        }
      } else {
        // If at the top of the page (or threshold not met) or if menus are open, always ensure header is visible
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY); // Update the last scroll position for the next comparison
    };

    // Add the scroll event listener to the window when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts to prevent memory leaks
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, isMobileMenuOpen, isSearchInputVisible]); // Dependencies: re-run effect if these states change

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out
                  ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
                  bg-gray-900/500 backdrop-blur-md shadow-xl`} // <--- MODIFIED: Opacity changed to /50
    >
      <div className="container mx-auto flex justify-between items-center p-4"> {/* Main header content container with consistent padding */}
        {/* Logo/App Title - Links to the homepage */}
        <Link href="/" className="flex items-center space-x-2 text-3xl font-extrabold tracking-tight group">
          {/* Film icon with hover animation */}
          <FaFilm className="text-blue-400 group-hover:scale-110 transition-transform duration-300" />
          {/* App title with gradient text and hover color transition */}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400 group-hover:from-blue-400 group-hover:to-purple-500 transition-colors duration-300">
            Movie Explorer
          </span>
        </Link>

        {/* Desktop Navigation Links and Search Icon */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-lg font-medium hover:text-blue-400 transition-colors duration-200 font-semibold cursor-pointer">
            Home
          </Link>
          <Link href="/movie/popular" className="text-lg font-medium hover:text-blue-400 transition-colors duration-200 font-semibold cursor-pointer">
            Movies
          </Link>
          <Link href="/tv/popular" className="text-lg font-medium hover:text-blue-400 transition-colors duration-200 font-semibold cursor-pointer">
            TV Shows
          </Link>

          {/* Search Icon Button (Desktop) - Toggles search input visibility */}
          <button
            onClick={toggleSearchInput}
            className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
            aria-label="Toggle search input"
          >
            <FaSearch className="text-xl" />
          </button>
        </nav>

        {/* Mobile-specific controls: Search Icon and Mobile Menu Button (Hamburger) */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Search Icon Button (Mobile) - Toggles search input visibility */}
          <button
            onClick={toggleSearchInput}
            className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Toggle search input"
          >
            <FaSearch className="text-xl" />
          </button>
          {/* Mobile Menu Hamburger/Close Icon - Toggles mobile navigation menu */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Search Input Section - Slides down from the header */}
      <div
        className={`absolute left-0 w-full bg-gray-700 shadow-lg overflow-hidden transition-all duration-300 ease-in-out
                    ${isSearchInputVisible ? 'max-h-20 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'}
                    ${isVisible ? 'top-[calc(100%+0px)]' : 'top-0'}`}
      >
        <form onSubmit={handleSearchSubmit} className="container mx-auto px-4 flex items-center space-x-2">
          <div className="relative flex-grow">
            <input
              id="header-search-input"
              ref={searchInputRef} // Attach ref for focusing
              type="text"
              placeholder="Search movies or TV shows..."
              value={searchTerm}
              required // HTML5 validation: input is required
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term state on input change
              className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {/* Explicit "Go" button for submitting the search */}
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

      {/* Mobile Navigation Menu - Slides down from the header */}
      <nav
        className={`md:hidden bg-gray-700 shadow-lg overflow-hidden transition-all duration-300 ease-in-out
                    ${isMobileMenuOpen ? 'max-h-60 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'}
                    ${isVisible ? 'top-[calc(100%+0px)]' : 'top-0'}`}
      >
        <div className="flex flex-col items-center space-y-4">
          <Link href="/" className="text-lg font-medium hover:text-blue-400 transition-colors duration-200" onClick={toggleMobileMenu}>
            Home
          </Link>
          <Link href="/movie/popular" className="text-lg font-medium hover:text-blue-400 transition-colors duration-200" onClick={toggleMobileMenu}>
            Movies
          </Link>
          <Link href="/tv/popular" className="text-lg font-medium hover:text-blue-400 transition-colors duration-200" onClick={toggleMobileMenu}>
            TV Shows
          </Link>
        </div>
      </nav>
    </header>
  );
}
