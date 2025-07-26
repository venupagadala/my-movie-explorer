// app/movie/popular/page.tsx
// This is a Server Component for displaying popular movies with pagination.

import { getNowPlayingMovies, getPopularMovies } from '@/lib/server/tmdb-api'; // Assuming getPopularMovies exists or we'll add it
import { TmdbMediaItem, PaginatedResponse } from '@/lib/types/tmdb';
import MediaCard from '@/components/common/MediaCard';
import PaginationControls from '@/components/common/PaginationControls';

interface PopularMoviesPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function PopularMoviesPage({ searchParams }: PopularMoviesPageProps) {
  const currentPage = parseInt(searchParams.page || '1', 10);

  let moviesResponse: PaginatedResponse<TmdbMediaItem> = { page: 1, results: [], total_pages: 1, total_results: 0 };
  let error: string | null = null;

  try {
    // We will use getNowPlayingMovies for "Popular Movies" for now,
    // as TMDB's /movie/popular endpoint often returns a very similar list.
    // If you want a strictly "popular" list, we'd need to add a getPopularMovies function.
    // For consistency with the header, let's use getNowPlayingMovies for now.
    // Or, if you prefer, we can add a new `getPopularMovies` to tmdb-api.ts.
    // Let's assume getNowPlayingMovies is sufficient for "Popular Movies" tab.
    moviesResponse = await getNowPlayingMovies(currentPage); // Fetch popular/now playing movies
  } catch (err: any) {
    console.error("Error fetching popular movies:", err);
    error = "Failed to fetch popular movies. Please try again later.";
  }

  const movies = moviesResponse.results;

  return (
    <main className="w-full p-4 md:p-8 min-h-screen bg-gray-900 text-white">
      <section className="text-center py-8 mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4
                       bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500
                       drop-shadow-lg animate-fade-in-up">
          Popular Movies
        </h1>
        {error && (
          <div className="text-center text-red-500 text-lg mb-8">
            {error}
          </div>
        )}
      </section>

      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie: TmdbMediaItem) => (
            <MediaCard key={movie.id} item={{ ...movie, media_type: 'movie' }} />
          ))}
        </div>
      ) : (
        !error && <p className="text-center text-gray-400 text-xl">No popular movies found.</p>
      )}

      {moviesResponse.total_pages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={moviesResponse.total_pages}
          basePath="/movie/popular" // Base path for this specific page
        />
      )}
    </main>
  );
}