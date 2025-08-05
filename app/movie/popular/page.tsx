import { getPopularMovies } from '@/lib/server/tmdb-api';
import { TmdbMediaItem, PaginatedResponse } from '@/lib/types/tmdb';
import MediaCard from '@/components/common/MediaCard';
import PaginationControls from '@/components/common/PaginationControls';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function PopularMoviesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedParams = await searchParams; // Await because it's a Promise
  const currentPage = Number(resolvedParams?.page ?? '1');

  const popularMoviesData: PaginatedResponse<TmdbMediaItem> = await getPopularMovies(currentPage);
  const popularMovies = popularMoviesData.results;
  const totalPages = popularMoviesData.total_pages;

  return (
    <main className="w-full p-4 md:p-8 min-h-screen bg-gray-900 text-white pt-20">
      <section id="popular-movies-section" className="mb-12 pt-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center
                       bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400
                       drop-shadow-lg animate-fade-in-up">
          Popular Movies
        </h1>

        {popularMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {popularMovies.map((movie: TmdbMediaItem) => (
              <MediaCard key={movie.id} item={movie} />
            ))}
          </div>
        ) : (
          <p className="text-center text-xl text-gray-400">No popular movies found.</p>
        )}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/movie/popular"
          scrollToId="popular-movies-section"
        />
      </section>
    </main>
  );
}
