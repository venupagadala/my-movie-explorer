// app/page.tsx
// This is a Server Component. It fetches data based on URL search parameters for pagination.

import { getTrendingMovies, getTrendingTvShows, getNowPlayingMovies } from '@/lib/server/tmdb-api';
import { TmdbMediaItem, PaginatedResponse } from '@/lib/types/tmdb'; // Import PaginatedResponse type
import MediaCard from '@/components/common/MediaCard';
import MovieCarousel from '@/components/common/MovieCarousel';
import PaginationControls from '@/components/common/PaginationControls'; // Import new pagination component

interface HomePageProps {
  searchParams: {
    page?: string; // Next.js automatically passes URL query parameters here
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  // Get the current page number from the URL, default to 1
  const currentPage = parseInt(searchParams.page || '1', 10);

  let trendingMoviesResponse: PaginatedResponse<TmdbMediaItem> = { page: 1, results: [], total_pages: 1, total_results: 0 };
  let trendingTvShowsResponse: PaginatedResponse<TmdbMediaItem> = { page: 1, results: [], total_pages: 1, total_results: 0 };
  let nowPlayingMoviesResponse: PaginatedResponse<TmdbMediaItem> = { page: 1, results: [], total_pages: 1, total_results: 0 };

  try {
    // Fetch data in parallel, passing the current page
    // Note: Carousel movies are usually not paginated in this way,
    // but we'll include it for consistency in fetching if needed.
    [trendingMoviesResponse, trendingTvShowsResponse, nowPlayingMoviesResponse] = await Promise.all([
      getTrendingMovies(currentPage),
      getTrendingTvShows(currentPage),
      getNowPlayingMovies(1), // Carousel usually shows first page only
    ]);
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    // You might want to display a user-friendly error message on the page
  }

  const trendingMovies = trendingMoviesResponse.results;
  const trendingTvShows = trendingTvShowsResponse.results;
  const nowPlayingMovies = nowPlayingMoviesResponse.results;

  // For homepage, we'll primarily paginate the Trending Movies and TV Shows.
  // Let's use the total_pages from trending movies for the pagination control,
  // or you could have separate controls for movies and TV shows.
  // For simplicity, we'll use trending movies' total pages as the overall page count.
  const totalPagesForTrending = Math.max(
    trendingMoviesResponse.total_pages,
    trendingTvShowsResponse.total_pages
  );

  return (
    <main className="w-full p-4 md:p-8 min-h-screen bg-gray-900 text-white">
      {/* Carousel Section */}
      <section className="mb-12">
        <MovieCarousel movies={nowPlayingMovies} />
      </section>

      {/* Trending Movies Section */}
      <section className="mb-12">
        <h2 className="text-4xl font-bold mb-8 text-center text-blue-300">Trending Movies</h2>
        {trendingMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trendingMovies.map((movie: TmdbMediaItem) => (
              <MediaCard key={movie.id} item={{ ...movie, media_type: 'movie' }} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No trending movies found.</p>
        )}
        {/* Pagination Controls for Trending Movies */}
        {trendingMoviesResponse.total_pages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={trendingMoviesResponse.total_pages} // Use movie specific total pages
            basePath="/" // Base path for the homepage
          />
        )}
      </section>

      {/* Trending TV Shows Section */}
      <section>
        <h2 className="text-4xl font-bold mb-8 text-center text-purple-300">Trending TV Shows</h2>
        {trendingTvShows.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trendingTvShows.map((tvShow: TmdbMediaItem) => (
              <MediaCard key={tvShow.id} item={{ ...tvShow, media_type: 'tv' }} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No trending TV shows found.</p>
        )}
        {/* Pagination Controls for Trending TV Shows */}
        {trendingTvShowsResponse.total_pages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={trendingTvShowsResponse.total_pages} // Use TV specific total pages
            basePath="/" // Base path for the homepage
          />
        )}
      </section>
    </main>
  );
}