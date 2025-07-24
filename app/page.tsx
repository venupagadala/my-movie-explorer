// app/page.tsx
import { getTrendingMovies, getTrendingTvShows, getNowPlayingMovies } from '@/lib/server/tmdb-api'; // <--- UPDATED IMPORT
import { TmdbMediaItem } from '@/lib/types/tmdb'; // <--- NEW IMPORT for types
import MediaCard from '@/components/common/MediaCard';
import MovieCarousel from '@/components/common/MovieCarousel';

export default async function HomePage() {
  const [trendingMovies, trendingTvShows, nowPlayingMovies] = await Promise.all([
    getTrendingMovies(),
    getTrendingTvShows(),
    getNowPlayingMovies(),
  ]);

  return (
    <main className="w-full p-4 md:p-8 min-h-screen bg-gray-900 text-white">
      <section className="mb-12">
        <MovieCarousel movies={nowPlayingMovies} />
      </section>

      <section className="mb-12">
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
      </section>

      <section>
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
      </section>
    </main>
  );
}