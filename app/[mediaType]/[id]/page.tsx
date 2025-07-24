// app/[mediaType]/[id]/page.tsx
'use client'; // KEEP THIS DIRECTIVE

import { useState, useEffect } from 'react';
// import Image from 'next/image'; // REMOVE THIS IMPORT
import ClientImage from '@/components/common/ClientImage'; // <--- NEW IMPORT
import { useParams, notFound } from 'next/navigation';
import { FaStar, FaCalendarAlt, FaClock, FaTag, FaInfoCircle } from 'react-icons/fa';
import { TmdbMovieDetails, TmdbTvShowDetails } from '@/lib/types/tmdb'; // Import types only

// Base URL for TMDB images (same as in MediaCard)
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

// This getImageUrl is still needed for constructing the initial src prop
const getImageUrl = (path: string | null | undefined, size: string = 'original') => {
  if (!path) {
    return `https://placehold.co/500x750/1f2937/FFFFFF?text=No+Image`;
  }
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
};

export default function MediaDetailPage() {
  const params = useParams();
  const mediaType = params.mediaType as 'movie' | 'tv';
  const id = params.id as string;

  const [media, setMedia] = useState<TmdbMovieDetails | TmdbTvShowDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mediaType || !id) {
      notFound();
      return;
    }

    const fetchMedia = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/media-details?mediaType=${mediaType}&id=${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch media details from API route');
        }
        const data = await response.json();
        setMedia(data);
      } catch (err: any) {
        console.error("Error fetching media details:", err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [mediaType, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl">Loading details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!media) {
    notFound();
  }

  const title = media.media_type === 'movie' ? (media as TmdbMovieDetails).title : (media as TmdbTvShowDetails).name;
  const posterPath = media.poster_path;
  const backdropPath = media.backdrop_path;
  const overview = media.overview;
  const rating = media.vote_average ? media.vote_average.toFixed(1) : 'N/A';
  const genres = media.genres?.map(g => g.name).join(', ') || 'N/A';

  let releaseInfo = '';
  let durationInfo = '';

  if (media.media_type === 'movie') {
    const movie = media as TmdbMovieDetails;
    releaseInfo = movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A';
    durationInfo = movie.runtime ? `${movie.runtime} mins` : 'N/A';
  } else {
    const tvShow = media as TmdbTvShowDetails;
    releaseInfo = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear().toString() : 'N/A';
    durationInfo = tvShow.number_of_seasons ? `${tvShow.number_of_seasons} seasons` : 'N/A';
    if (tvShow.number_of_episodes) {
      durationInfo += tvShow.number_of_seasons ? `, ${tvShow.number_of_episodes} episodes` : `${tvShow.number_of_episodes} episodes`;
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Backdrop Image */}
      {backdropPath && (
        <div className="absolute inset-0 w-full h-full">
          <ClientImage // <--- USE ClientImage HERE
            src={getImageUrl(backdropPath, 'original')}
            alt={`${title} Backdrop`}
            fill
            sizes="100vw"
            className="object-cover object-center opacity-20"
            priority
            // onError is now handled internally by ClientImage
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>
      )}

      {/* Content Area */}
      <div className="container mx-auto p-4 md:p-8 relative z-10 flex flex-col lg:flex-row items-start lg:items-center py-12 md:py-20">
        {/* Poster Image */}
        <div className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-8 lg:mb-0 lg:mr-10">
          <ClientImage // <--- USE ClientImage HERE
            src={getImageUrl(posterPath, 'w500')}
            alt={`${title} Poster`}
            width={500}
            height={750}
            className="rounded-lg shadow-2xl w-full h-auto object-cover"
            priority
            // onError is now handled internally by ClientImage
          />
        </div>

        {/* Details */}
        <div className="flex-grow">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {title}
          </h1>
          {media.tagline && (
            <p className="text-xl text-gray-400 italic mb-6">"{media.tagline}"</p>
          )}

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

          <h2 className="text-2xl font-bold mb-3 text-gray-200 flex items-center">
            <FaInfoCircle className="mr-2 text-blue-400" />
            Overview
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            {overview || 'No overview available.'}
          </p>

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
        </div>
      </div>
    </div>
  );
}