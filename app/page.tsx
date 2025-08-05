// app/page.tsx
// Server Component: Fetches and renders trending movies, TV shows, and now-playing carousel.

import { getTrendingMovies, getTrendingTvShows, getNowPlayingMovies } from '@/lib/server/tmdb-api';
import { TmdbMediaItem } from '@/lib/types/tmdb';
import MediaCard from '@/components/common/MediaCard';
import MovieCarousel from '@/components/common/MovieCarousel';
import PaginationControls from '@/components/common/PaginationControls';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;

  // Current page values from query params for pagination
  const currentMoviePage = Number(resolvedParams?.moviePage ?? '1');
  const currentTvPage = Number(resolvedParams?.tvPage ?? '1');
  const currentCarouselPage = Number(resolvedParams?.carouselPage ?? '1');

  // Fetch data concurrently
  const [trendingMoviesData, trendingTvShowsData, nowPlayingMoviesData] = await Promise.all([
    getTrendingMovies(currentMoviePage),
    getTrendingTvShows(currentTvPage),
    getNowPlayingMovies(currentCarouselPage),
  ]);

  const trendingMovies = trendingMoviesData.results;
  const trendingTvShows = trendingTvShowsData.results;
  const nowPlayingMovies = nowPlayingMoviesData.results;

  const totalMoviePages = trendingMoviesData.total_pages || 1;
  const totalTvPages = trendingTvShowsData.total_pages || 1;
  const totalCarouselPages = nowPlayingMoviesData.total_pages || 1;

  return (
    <main className="w-full p-4 md:p-8 min-h-screen bg-gray-900 text-white pt-20">
      {/* Now Playing Movies Carousel */}
      <section className="mb-12">
        <MovieCarousel movies={nowPlayingMovies} />
        {/* Uncomment below if carousel pagination is needed */}
        {/*
        <PaginationControls
          currentPage={currentCarouselPage}
          totalPages={totalCarouselPages}
          pageQueryParam="carouselPage"
          scrollToId="carousel-section"
        />
        */}
      </section>

      {/* Trending Movies Section */}
      <section id="trending-movies-section" className="mb-12">
        <h2 className="text-4xl font-bold mb-8 text-center text-blue-300">Trending Movies</h2>
        {trendingMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trendingMovies.map((movie: TmdbMediaItem) => (
              <MediaCard key={movie.id} item={movie} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No trending movies found.</p>
        )}
        <PaginationControls
          currentPage={currentMoviePage}
          totalPages={totalMoviePages}
          pageQueryParam="moviePage"
          scrollToId="trending-movies-section"
        />
      </section>

      {/* Trending TV Shows Section */}
      <section id="trending-tv-shows-section">
        <h2 className="text-4xl font-bold mb-8 text-center text-purple-300">Trending TV Shows</h2>
        {trendingTvShows.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trendingTvShows.map((tvShow: TmdbMediaItem) => (
              <MediaCard key={tvShow.id} item={tvShow} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No trending TV shows found.</p>
        )}
        <PaginationControls
          currentPage={currentTvPage}
          totalPages={totalTvPages}
          pageQueryParam="tvPage"
          scrollToId="trending-tv-shows-section"
        />
      </section>
    </main>
  );
}
