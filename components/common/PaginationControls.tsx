// components/common/PaginationControls.tsx
'use client'; // This is a Client Component
import React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { FaAngleLeft, FaAngleRight, FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6'; // Using Fa6 for more modern icons

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  // `basePath` is the route without query params, e.g., '/', '/search', '/movie/popular'
  basePath: string;
}

export default function PaginationControls({ currentPage, totalPages, basePath }: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine if we are on the search page to preserve the 'query' parameter
  const isSearchPage = basePath === '/search';
  const currentSearchQuery = isSearchPage ? searchParams.get('query') : null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    if (isSearchPage && currentSearchQuery) {
      params.set('query', currentSearchQuery);
    }
    return `${basePath}?${params.toString()}`;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(createPageUrl(newPage));
    }
  };

  // Determine which page numbers to show around the current page
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    const maxPagesToShow = 5; // Number of page buttons to display directly

    if (totalPages <= maxPagesToShow + 2) { // If total pages are few, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Pages around current page
      let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxPagesToShow / 2));

      // Adjust start/end if near boundaries
      if (currentPage < Math.ceil(maxPagesToShow / 2) + 1) {
        endPage = maxPagesToShow;
      } else if (currentPage > totalPages - Math.floor(maxPagesToShow / 2)) {
        startPage = totalPages - maxPagesToShow + 1;
      }

      if (startPage > 2) {
        pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) { // Only add last page if there's more than one page total
        pages.push(totalPages);
      }
    }
    return pages;
  };


  return (
    <div className="flex justify-center items-center space-x-2 py-8 text-white">
      {/* First Page */}
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md bg-gray-700 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        aria-label="Go to first page"
      >
        <FaAnglesLeft />
      </button>

      {/* Previous Page */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md bg-gray-700 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        aria-label="Go to previous page"
      >
        <FaAngleLeft />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {typeof page === 'number' ? (
            <button
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${
                currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              aria-current={currentPage === page ? 'page' : undefined}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          ) : (
            <span className="px-2 py-2 text-gray-400">...</span>
          )}
        </React.Fragment>
      ))}

      {/* Next Page */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md bg-gray-700 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        aria-label="Go to next page"
      >
        <FaAngleRight />
      </button>

      {/* Last Page */}
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md bg-gray-700 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        aria-label="Go to last page"
      >
        <FaAnglesRight />
      </button>
    </div>
  );
}