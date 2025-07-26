// app/search/page.tsx
// This is a Server Component. It fetches data based on URL search parameters for query and pagination.

import { searchMovies, searchTvShows } from '@/lib/server/tmdb-api';
import { TmdbMediaItem, PaginatedResponse } from '@/lib/types/tmdb'; // Import PaginatedResponse type
import MediaCard from '@/components/common/MediaCard';
import PaginationControls from '@/components/common/PaginationControls'; // Import new pagination component

interface SearchPageProps {
  searchParams: {
    query?: string;
    page?: string; // Add page parameter for pagination
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const searchQuery = searchParams.query || '';
  const currentPage = parseInt(searchParams.page || '1', 10); // Get current page

  let moviesResponse: PaginatedResponse<TmdbMediaItem> = { page: 1, results: [], total_pages: 1, total_results: 0 };
  let tvShowsResponse: PaginatedResponse<TmdbMediaItem> = { page: 1, results: [], total_pages: 1, total_results: 0 };
  let error: string | null = null;

  if (searchQuery) {
    try {
      // Fetch search results for both movies and TV shows in parallel, passing the current page
      [moviesResponse, tvShowsResponse] = await Promise.all([
        searchMovies(searchQuery, currentPage),
        searchTvShows(searchQuery, currentPage),
      ]);
    } catch (err: any) {
      console.error("Error fetching search results:", err);
      error = "Failed to fetch search results. Please try again later.";
    }
  }

  const movies = moviesResponse.results;
  const tvShows = tvShowsResponse.results;
  const hasResults = movies.length > 0 || tvShows.length > 0;

  // For search page, we'll use the maximum total_pages from both movie and TV searches
  // to ensure the pagination controls cover all possible results.
  const totalPages = Math.max(moviesResponse.total_pages, tvShowsResponse.total_pages);


  return (
    <main className="w-full p-4 md:p-8 min-h-screen bg-gray-900 text-white">
      <section className="text-center py-8 mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4
                       bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500
                       drop-shadow-lg animate-fade-in-up">
          Search Results for "{searchQuery}"
        </h1>
        {searchQuery === '' && (
          <p className="text-xl text-gray-400">Enter a search term in the header to find movies or TV shows.</p>
        )}
      </section>

      {error && (
        <div className="text-center text-red-500 text-lg mb-8">
          {error}
        </div>
      )}

      {searchQuery && !hasResults && !error && (
        <div className="text-center text-gray-400 text-xl mb-8">
          No results found for "{searchQuery}". Try a different search term.
        </div>
      )}

      {hasResults && (
        <>
          {movies.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-blue-300">Movies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {movies.map((movie: TmdbMediaItem) => (
                  <MediaCard key={movie.id} item={{ ...movie, media_type: 'movie' }} />
                ))}
              </div>
            </section>
          )}

          {tvShows.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-purple-300">TV Shows</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {tvShows.map((tvShow: TmdbMediaItem) => (
                  <MediaCard key={tvShow.id} item={{ ...tvShow, media_type: 'tv' }} />
                ))}
              </div>
            </section>
          )}

          {/* Pagination Controls for Search Results */}
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/search" // Base path for the search page
            />
          )}
        </>
      )}
    </main>
  );
}