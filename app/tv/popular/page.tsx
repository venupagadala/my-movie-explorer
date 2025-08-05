// app/tv/popular/page.tsx
// This is a Server Component for displaying popular TV shows with pagination.

import { getTrendingTvShows } from '@/lib/server/tmdb-api'; // Using getTrendingTvShows for "Popular TV Shows" for now
import { TmdbMediaItem, PaginatedResponse } from '@/lib/types/tmdb';
import MediaCard from '@/components/common/MediaCard';
import PaginationControls from '@/components/common/PaginationControls';

export default async function PopularTvShowsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt((resolvedParams.page as string) || '1', 10);

  let tvShowsResponse: PaginatedResponse<TmdbMediaItem> = { page: 1, results: [], total_pages: 1, total_results: 0 };
  let error: string | null = null;

  try {
    // We will use getTrendingTvShows for "Popular TV Shows" for now.
    // If you want a strictly "popular" list, we'd need to add a getPopularTvShows function.
    tvShowsResponse = await getTrendingTvShows(currentPage); // Fetch popular/trending TV shows
  } catch (err: any) {
    console.error("Error fetching popular TV shows:", err);
    error = "Failed to fetch popular TV shows. Please try again later.";
  }

  const tvShows = tvShowsResponse.results;

  return (
    <main className="w-full p-4 md:p-8 min-h-screen bg-gray-900 text-white">
      <section className="text-center py-8 mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4
                       bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500
                       drop-shadow-lg animate-fade-in-up pt-5">
          Popular TV Shows
        </h1>
        {error && (
          <div className="text-center text-red-500 text-lg mb-8">
            {error}
          </div>
        )}
      </section>

      {tvShows.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {tvShows.map((tvShow: TmdbMediaItem) => (
            <MediaCard key={tvShow.id} item={{ ...tvShow, media_type: 'tv' }} />
          ))}
        </div>
      ) : (
        !error && <p className="text-center text-gray-400 text-xl">No popular TV shows found.</p>
      )}

      {tvShowsResponse.total_pages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={tvShowsResponse.total_pages}
          basePath="/tv/popular" // Base path for this specific page
        />
      )}
    </main>
  );
}
