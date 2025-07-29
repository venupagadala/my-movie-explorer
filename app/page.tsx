// app/page.tsx
// This is a Server Component.

import { getTrendingMovies, getTrendingTvShows, getNowPlayingMovies } from '@/lib/server/tmdb-api';
import { TmdbMediaItem, PaginatedResponse } from '@/lib/types/tmdb';
import MediaCard from '@/components/common/MediaCard';
import MovieCarousel from '@/components/common/MovieCarousel'; // Direct import of the MovieCarousel Client Component
import PaginationControls from '@/components/common/PaginationControls'; // <--- NEW IMPORT: PaginationControls

// Define props for HomePage, including searchParams for potential future pagination on homepage
interface HomePageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

/**
 * HomePage component fetches trending and now playing media data.
 * It is a Server Component, so data fetching happens on the server before rendering.
 */
export default async function HomePage({ searchParams }: HomePageProps) {
  // Get the current page number from the URL search parameters, defaulting to '1'
  // Using Number() and nullish coalescing (??) for robust parsing
  const currentPage = Number(searchParams?.page ?? '1');

  // Fetch data concurrently for efficiency
  const [trendingMoviesData, trendingTvShowsData, nowPlayingMoviesData] = await Promise.all([
    getTrendingMovies(currentPage),   // Fetch trending movies for the current page
    getTrendingTvShows(currentPage),  // Fetch trending TV shows for the current page
    getNowPlayingMovies(currentPage), // Fetch now playing movies for the current page
  ]);

  // Extract results arrays from the paginated responses
  const trendingMovies = trendingMoviesData.results;
  const trendingTvShows = trendingTvShowsData.results;
  const nowPlayingMovies = nowPlayingMoviesData.results;

  // Calculate total pages for pagination.
  // We take the maximum of total_pages from trending movies and TV shows
  // to ensure pagination covers all visible content. Default to 1 if no data.
  const totalPages = Math.max(
    trendingMoviesData.total_pages || 1,
    trendingTvShowsData.total_pages || 1
  );

  return (
    // Main container for the page content.
    // pt-20 added to account for the fixed header, preventing content from being hidden.
    <main className="w-full p-4 md:p-8 min-h-screen bg-gray-900 text-white pt-20">
      {/* Section for the Movie Carousel (Now Playing) */}
      <section className="mb-12">
        {/* MovieCarousel is a Client Component, rendered directly here */}
        <MovieCarousel movies={nowPlayingMovies} />
      </section>

      {/* Section for Trending Movies */}
      <section className="mb-12">
        <h2 className="text-4xl font-bold mb-8 text-center text-blue-300">Trending Movies</h2>
        {trendingMovies.length > 0 ? (
          // Grid layout for movie cards, responsive across different screen sizes
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trendingMovies.map((movie: TmdbMediaItem) => (
              <MediaCard key={movie.id} item={movie} /> // Render individual movie cards
            ))}
          </div>
        ) : (
          // Message displayed if no trending movies are found
          <p className="text-center text-gray-400">No trending movies found.</p>
        )}
        {/* Pagination Controls for Trending Movies */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages} // Pass the calculated totalPages
        />
      </section>

      {/* Section for Trending TV Shows */}
      <section>
        <h2 className="text-4xl font-bold mb-8 text-center text-purple-300">Trending TV Shows</h2>
        {trendingTvShows.length > 0 ? (
          // Grid layout for TV show cards, responsive across different screen sizes
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trendingTvShows.map((tvShow: TmdbMediaItem) => (
              <MediaCard key={tvShow.id} item={tvShow} /> // Render individual TV show cards
            ))}
          </div>
        ) : (
          // Message displayed if no trending TV shows are found
          <p className="text-center text-gray-400">No trending TV shows found.</p>
        )}
        {/* Pagination Controls for Trending TV Shows */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages} // Pass the calculated totalPages
        />
      </section>
    </main>
  );
}
