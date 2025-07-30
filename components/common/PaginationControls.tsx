// components/common/PaginationControls.tsx
'use client'; // This is a Client Component

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  // Optional: A base path if the pagination is for a specific route (e.g., /movie/popular)
  // If not provided, it will use the current pathname.
  basePath?: string;
  // Optional: A query parameter name for the page, defaults to 'page'
  pageQueryParam?: string;
  // NEW: ID of the element to scroll to after pagination
  scrollToId?: string;
}

/**
 * PaginationControls component provides "Previous", "Next", and a range of page number buttons
 * to navigate through paginated content. It updates the URL's query parameters.
 * It also scrolls to a specified element ID after navigation.
 */
export default function PaginationControls({
  currentPage,
  totalPages,
  basePath,
  pageQueryParam = 'page', // Default query param name is 'page'
  scrollToId, // Destructure the new prop
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Memoized function to create a new URL with updated page number
  const createPageURL = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(pageQueryParam, page.toString());
    // Use basePath if provided, otherwise use current pathname
    return `${basePath || pathname}?${params.toString()}`;
  }, [pathname, searchParams, basePath, pageQueryParam]);

  // Function to scroll to the specified element ID
  const scrollToElement = useCallback(() => {
    if (scrollToId) {
      const element = document.getElementById(scrollToId);
      if (element) {
        // Use 'smooth' behavior for a nice animation
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [scrollToId]);

  // Handle navigation to a specific page
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      // Crucial change: Add { scroll: false } to prevent Next.js from
      // automatically scrolling to the top of the page on navigation.
      router.push(createPageURL(page), { scroll: false }); // <--- MODIFIED HERE
      // Then, manually scroll to the desired element
      scrollToElement();
    }
  };

  // If the page loads with a specific scroll ID in the URL, scroll to it
  // This helps if the user navigates directly to a paginated URL (e.g., from a bookmark)
  useEffect(() => {
    // Only scroll if the page query parameter is present and not page 1
    // This avoids scrolling on the initial load of the very first page.
    if (searchParams.get(pageQueryParam) && Number(searchParams.get(pageQueryParam)) > 1) {
      scrollToElement();
    }
  }, [searchParams, pageQueryParam, scrollToElement]);


  // Logic to determine which page numbers to display
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxPagesToShow = 7; // Max number of page buttons to display (including first/last/ellipsis)
    const ellipsis = '...';

    if (totalPages <= maxPagesToShow) {
      // If total pages are few, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Logic for showing a range with ellipsis
      const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2) + 1);
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push(ellipsis);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push(ellipsis);
        }
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const pageNumbersToDisplay = getPageNumbers();

  // Don't render if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-8 mb-4">
      {/* Previous Button */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 bg-gray-700 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md
                   transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Previous page"
      >
        <FaArrowLeft />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Number Buttons */}
      {pageNumbersToDisplay.map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
            {'...'}
          </span>
        ) : (
          <button
            key={page}
            onClick={() => goToPage(Number(page))}
            className={`px-4 py-2 rounded-lg font-semibold shadow-md transition-colors duration-200 cursor-pointer
                        ${Number(page) === currentPage
                          ? 'bg-blue-600 text-white shadow-lg' // Active page style
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'}
                        focus:outline-none focus:ring-2 focus:ring-blue-400`}
            aria-current={Number(page) === currentPage ? 'page' : undefined}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        )
      ))}

      {/* Next Button */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 bg-gray-700 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md
                   transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <FaArrowRight />
      </button>
    </div>
  );
}
