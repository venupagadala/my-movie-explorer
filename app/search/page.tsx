// app/search/page.tsx
// This is a Server Component. It fetches data based on URL search parameters.

import { searchMovies, searchTvShows } from "@/lib/server/tmdb-api"; // Import server-side API functions
import { TmdbMediaItem } from "@/lib/types/tmdb"; // Import types
import MediaCard from "@/components/common/MediaCard"; // Re-use our MediaCard component

interface SearchPageProps {
  searchParams: {
    query?: string; // Next.js automatically passes URL query parameters here
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const searchQuery = searchParams.query || ""; // Get the search query from the URL, default to empty string
  let movies: TmdbMediaItem[] = [];
  let tvShows: TmdbMediaItem[] = [];
  let error: string | null = null;

  if (searchQuery) {
    // Only perform search if a query exists
    try {
      // Fetch search results for both movies and TV shows in parallel
      [movies, tvShows] = await Promise.all([
        searchMovies(searchQuery),
        searchTvShows(searchQuery),
      ]);
    } catch (err: any) {
      console.error("Error fetching search results:", err);
      error = "Failed to fetch search results. Please try again later.";
    }
  }

  const hasResults = movies.length > 0 || tvShows.length > 0;

  return (
    <main className="w-full p-4 md:p-8 min-h-screen bg-gray-900 text-white">
      <section className="">
        <p
          className="text-2xl md:text-3xl font-extrabold mb-4
               bg-clip-text text-blue-500 bg-gradient-to-r from-blue-400 to-purple-500
               drop-shadow-lg animate-fade-in-up"
        >
          {" "}
          Search Results for "{searchQuery}"
        </p>
        {searchQuery === "" && (
          <p className="text-xl text-gray-400">
            Enter a search term in the header to find movies or TV shows.
          </p>
        )}
      </section>

      {error && (
        <div className="text-center text-red-500 text-lg mb-8">{error}</div>
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
                  // Ensure media_type is correctly set for the MediaCard link
                  <MediaCard
                    key={movie.id}
                    item={{ ...movie, media_type: "movie" }}
                  />
                ))}
              </div>
            </section>
          )}

          {tvShows.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-purple-300">
                TV Shows
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {tvShows.map((tvShow: TmdbMediaItem) => (
                  // Ensure media_type is correctly set for the MediaCard link
                  <MediaCard
                    key={tvShow.id}
                    item={{ ...tvShow, media_type: "tv" }}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
