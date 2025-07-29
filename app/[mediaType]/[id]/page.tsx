// app/[mediaType]/[id]/page.tsx
'use client'; // This component MUST be a Client Component

import { useState, useEffect } from 'react';
import ClientImage from '@/components/common/ClientImage'; // Custom wrapper for next/image
import { useParams, notFound } from 'next/navigation'; // Hooks for client-side routing
import { FaStar, FaCalendarAlt, FaClock, FaTag, FaInfoCircle, FaPlayCircle } from 'react-icons/fa'; // Icons for visual elements
import { TmdbMovieDetails, TmdbTvShowDetails, TmdbVideo } from '@/lib/types/tmdb'; // Type definitions for TMDB data

// Base URL for TMDB images
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

/**
 * Constructs the full image URL from a TMDB path.
 * Provides a placeholder if no path is available.
 * @param path The partial image path from TMDB.
 * @param size The desired image size (e.g., 'original', 'w500').
 * @returns The full URL to the image or a placeholder.
 */
const getImageUrl = (path: string | null | undefined, size: string = 'original') => {
  if (!path) {
    // Placeholder image with specific dimensions and colors (PNG format to avoid SVG issues)
    return `https://placehold.co/png/500x750/1f2937/FFFFFF?text=No+Image`;
  }
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
};

/**
 * MediaDetailPage component displays detailed information about a movie or TV show.
 * It fetches data from an internal API route and renders it.
 */
export default function MediaDetailPage() {
  // Get dynamic route parameters (mediaType and id) from the URL
  const params = useParams();
  const mediaType = params.mediaType as 'movie' | 'tv';
  const id = params.id as string;

  // State variables to manage fetched media data, videos, loading status, and errors
  const [media, setMedia] = useState<TmdbMovieDetails | TmdbTvShowDetails | null>(null);
  const [videos, setVideos] = useState<TmdbVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to fetch data when mediaType or id changes
  useEffect(() => {
    // If mediaType or id are missing, trigger Next.js notFound page
    if (!mediaType || !id) {
      notFound();
      return;
    }

    const fetchMediaAndVideos = async () => {
      setLoading(true); // Set loading to true before fetching
      setError(null);   // Clear any previous errors

      try {
        // Fetch main media details from our internal Next.js API route
        const mediaResponse = await fetch(`/api/media-details?mediaType=${mediaType}&id=${id}`);
        if (!mediaResponse.ok) {
          const errorData = await mediaResponse.json();
          throw new Error(errorData.error || 'Failed to fetch media details from API route');
        }
        const mediaData = await mediaResponse.json();
        setMedia(mediaData); // Update media state

        // Fetch videos (trailers, teasers) from our internal Next.js API route
        // This call is separate to allow for independent error handling/loading of videos
        const videosResponse = await fetch(`/api/media-details?mediaType=${mediaType}&id=${id}&videos=true`);
        if (!videosResponse.ok) {
          // Log error but don't block page rendering if video fetching fails
          console.error("Failed to fetch videos:", await videosResponse.json());
          setVideos([]); // Ensure videos state is empty if fetch fails
        } else {
          const videosData = await videosResponse.json();
          setVideos(videosData.results || []); // Update videos state with the 'results' array
        }

      } catch (err: any) {
        console.error("Error fetching media details or videos:", err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false); // Set loading to false after fetching (success or error)
      }
    };

    fetchMediaAndVideos(); // Execute the fetch function
  }, [mediaType, id]); // Dependencies: re-run effect if mediaType or id changes

  // Logic to find the most relevant trailer to embed
  // Prioritizes official YouTube trailers, then any YouTube trailer, then any YouTube teaser.
  const mainTrailer = videos.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer' && video.official
  ) || videos.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer'
  ) || videos.find(
    (video) => video.site === 'YouTube' && video.type === 'Teaser'
  );

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl">Loading details...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  // If no media data is available after loading, trigger notFound (should be caught by error state usually)
  if (!media) {
    notFound();
  }

  // Determine common properties for display
  const title = media.media_type === 'movie' ? (media as TmdbMovieDetails).title : (media as TmdbTvShowDetails).name;
  const posterPath = media.poster_path;
  const backdropPath = media.backdrop_path;
  const overview = media.overview;
  const rating = media.vote_average ? media.vote_average.toFixed(1) : 'N/A';
  const genres = media.genres?.map(g => g.name).join(', ') || 'N/A';

  // Determine type-specific properties (release year, duration/seasons)
  let releaseInfo = '';
  let durationInfo = '';

  if (media.media_type === 'movie') {
    const movie = media as TmdbMovieDetails;
    releaseInfo = movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A';
    durationInfo = movie.runtime ? `${movie.runtime} mins` : 'N/A';
  } else { // media.media_type === 'tv'
    const tvShow = media as TmdbTvShowDetails;
    releaseInfo = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear().toString() : 'N/A';
    durationInfo = tvShow.number_of_seasons ? `${tvShow.number_of_seasons} seasons` : 'N/A';
    if (tvShow.number_of_episodes) {
      durationInfo += tvShow.number_of_seasons ? `, ${tvShow.number_of_episodes} episodes` : `${tvShow.number_of_episodes} episodes`;
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Backdrop Image - displayed as a semi-transparent background */}
      {backdropPath && (
        <div className="absolute inset-0 w-full h-full">
          <ClientImage
            src={getImageUrl(backdropPath, 'original')}
            alt={`${title} Backdrop`}
            fill
            sizes="100vw"
            className="object-cover object-center opacity-20" // Darken for readability
            priority // High priority for background image
          />
          {/* Gradient overlay to ensure text readability over the backdrop */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>
      )}

      {/* Main Content Area - positioned above the backdrop */}
      <div className="container mx-auto p-4 md:p-8 relative z-10 flex flex-col lg:flex-row items-start lg:items-center py-12 md:py-20">
        {/* Poster Image Column */}
        <div className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-8 lg:mb-0 lg:mr-10">
          <ClientImage
            src={getImageUrl(posterPath, 'w500')}
            alt={`${title} Poster`}
            width={500}
            height={750}
            className="rounded-lg shadow-2xl w-full h-auto object-cover"
            priority // High priority for main poster
          />
        </div>

        {/* Details Column */}
        <div className="flex-grow">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {title}
          </h1>
          {/* Tagline (if available) */}
          {media.tagline && (
            <p className="text-xl text-gray-400 italic mb-6">"{media.tagline}"</p>
          )}

          {/* Key Info: Rating, Release Year, Duration/Seasons, Genres */}
          <div className="flex flex-wrap items-center text-lg text-gray-300 mb-6 gap-x-6 gap-y-3">
            <span className="flex items-center">
              <FaStar className="text-yellow-400 mr-2" />
              {rating} / 10
            </span>
            <span className="flex items-center">
              <FaCalendarAlt className="text-blue-400 mr-2" />
              {releaseInfo}
            </span>
            <span className="flex items-center">
              <FaClock className="text-green-400 mr-2" />
              {durationInfo}
            </span>
            <span className="flex items-center">
              <FaTag className="text-purple-400 mr-2" />
              {genres}
            </span>
          </div>

          {/* Overview Section */}
          <h2 className="text-2xl font-bold mb-3 text-gray-200 flex items-center">
            <FaInfoCircle className="mr-2 text-blue-400" />
            Overview
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            {overview || 'No overview available.'}
          </p>

          {/* Production Companies (for movies) */}
          {media.media_type === 'movie' && (media as TmdbMovieDetails).production_companies && (media as TmdbMovieDetails).production_companies.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2 text-gray-200">Production Companies:</h3>
              <div className="flex flex-wrap gap-4">
                {(media as TmdbMovieDetails).production_companies.map(company => (
                  <span key={company.id} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
                    {company.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Seasons (for TV shows) */}
          {media.media_type === 'tv' && (media as TmdbTvShowDetails).seasons && (media as TmdbTvShowDetails).seasons.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2 text-gray-200">Seasons:</h3>
              <div className="flex flex-wrap gap-4">
                {(media as TmdbTvShowDetails).seasons.map(season => (
                  <span key={season.id} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
                    Season {season.season_number} ({season.episode_count} episodes)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Trailer Section - Placed at the end of the details column */}
          <div className="mb-8"> {/* Container for trailer or "no trailer" message */}
            <h2 className="text-2xl font-bold mb-4 text-gray-200 flex items-center">
              <FaPlayCircle className="mr-2 text-red-500" />
              Official Trailer
            </h2>
            {mainTrailer ? (
              <div className="relative pt-[56.25%] bg-gray-800 rounded-lg overflow-hidden shadow-xl"> {/* 16:9 Aspect Ratio */}
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${mainTrailer.key}?autoplay=0&controls=1&modestbranding=1&rel=0`}
                  title={`${title} Trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="bg-gray-800 p-6 rounded-lg shadow-inner flex flex-col items-center justify-center text-center h-48">
                <p className="text-xl text-gray-400 mb-2">No official trailer available.</p>
                <p className="text-sm text-gray-500">We're sorry, it looks like there isn't a trailer for this {mediaType === 'movie' ? 'movie' : 'TV show'} on TMDB yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
