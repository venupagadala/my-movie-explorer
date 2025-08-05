// app/movie/popular/page.tsx
// This is a Server Component.

import { getPopularMovies } from '@/lib/server/tmdb-api';
import { TmdbMediaItem, PaginatedResponse } from '@/lib/types/tmdb';
import MediaCard from '@/components/common/MediaCard';
import PaginationControls from '@/components/common/PaginationControls';

// Removed the PopularMoviesPageProps interface.
// The searchParams type will now be defined directly in the function signature.

/**
 * PopularMoviesPage component fetches and displays a paginated list of popular movies.
 * It is a Server Component, so data fetching happens on the server before rendering.
 */
export default async function PopularMoviesPage({
  searchParams, // Destructure searchParams directly
}: {
  // Define the type for searchParams directly inline
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Get the current page number from the URL search parameters, defaulting to '1'
  const currentPage = Number(searchParams?.page ?? '1');

  // Fetch popular movies data for the current page
  const popularMoviesData: PaginatedResponse<TmdbMediaItem> = await getPopularMovies(currentPage);

  const popularMovies = popularMoviesData.results;
  const totalPages = popularMoviesData.total_pages; // Get total pages from the API response

  return (
    // Main container for the page content.
    // pt-20 added to account for the fixed header, preventing content from being hidden.
    <main className="w-full p-4 md:p-8 min-h-screen bg-gray-900 text-white pt-20">
      <section id="popular-movies-section" className="mb-12"> {/* Added ID for scrolling */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center
                       bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400
                       drop-shadow-lg animate-fade-in-up">
          Popular Movies
        </h1>

        {popularMovies.length > 0 ? (
          // Grid layout for movie cards, responsive across different screen sizes
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {popularMovies.map((movie: TmdbMediaItem) => (
              <MediaCard key={movie.id} item={movie} />
            ))}
          </div>
        ) : (
          // Message displayed if no popular movies are found
          <p className="text-center text-xl text-gray-400">No popular movies found.</p>
        )}

        {/* Pagination Controls for Popular Movies */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/movie/popular" // Explicitly set basePath for this route
          scrollToId="popular-movies-section" // Pass ID to scroll to
        />
      </section>
    </main>
  );
}
