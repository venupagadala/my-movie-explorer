// app/[mediaType]/[id]/page.tsx
'use client'; // This page needs client-side hooks

import { useState, useEffect } from 'react';
import ClientImage from '@/components/common/ClientImage'; 
import { useParams, notFound } from 'next/navigation';
import { FaStar, FaCalendarAlt, FaClock, FaTag, FaInfoCircle, FaPlayCircle } from 'react-icons/fa';
import { TmdbMovieDetails, TmdbTvShowDetails, TmdbVideo } from '@/lib/types/tmdb';

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

// Build full TMDB image URL or return a placeholder
const getImageUrl = (path: string | null | undefined, size: string = 'original') =>
  path ? `${TMDB_IMAGE_BASE_URL}${size}${path}` : `https://placehold.co/png/500x750/1f2937/FFFFFF?text=No+Image`;

export default function MediaDetailPage() {
  const params = useParams();
  const mediaType = params.mediaType as 'movie' | 'tv';
  const id = params.id as string;

  const [media, setMedia] = useState<TmdbMovieDetails | TmdbTvShowDetails | null>(null);
  const [videos, setVideos] = useState<TmdbVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mediaType || !id) {
      notFound();
      return;
    }

    const fetchMediaAndVideos = async () => {
      setLoading(true);
      setError(null);

      try {
        const mediaResponse = await fetch(`/api/media-details?mediaType=${mediaType}&id=${id}`);
        if (!mediaResponse.ok) throw new Error((await mediaResponse.json()).error || 'Failed to fetch media details');
        const mediaData = await mediaResponse.json();
        setMedia(mediaData);

        const videosResponse = await fetch(`/api/media-details?mediaType=${mediaType}&id=${id}&videos=true`);
        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          setVideos(videosData.results || []);
        } else {
          console.error("Failed to fetch videos:", await videosResponse.json());
          setVideos([]);
        }
      } catch (err: any) {
        console.error("Error fetching media details or videos:", err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchMediaAndVideos();
  }, [mediaType, id]);

  // Pick the most relevant trailer
  const mainTrailer =
    videos.find(v => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ||
    videos.find(v => v.site === 'YouTube' && v.type === 'Trailer') ||
    videos.find(v => v.site === 'YouTube' && v.type === 'Teaser');

  if (loading) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <p className="text-xl">Loading details...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <p className="text-xl text-red-500">Error: {error}</p>
    </div>
  );

  if (!media) notFound();

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
      durationInfo += tvShow.number_of_seasons
        ? `, ${tvShow.number_of_episodes} episodes`
        : `${tvShow.number_of_episodes} episodes`;
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Backdrop */}
      {backdropPath && (
        <div className="absolute inset-0 w-full h-full">
          <ClientImage
            src={getImageUrl(backdropPath, 'original')}
            alt={`${title} Backdrop`}
            fill
            sizes="100vw"
            className="object-cover object-center opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto p-4 md:p-8 relative z-10 flex flex-col lg:flex-row items-start lg:items-center py-12 md:py-20">
        {/* Poster */}
        <div className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-8 lg:mb-0 lg:mr-10">
          <ClientImage
            src={getImageUrl(posterPath, 'w500')}
            alt={`${title} Poster`}
            width={500}
            height={750}
            className="rounded-lg shadow-2xl w-full h-auto object-cover"
            priority
          />
        </div>

        {/* Details */}
        <div className="flex-grow">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{title}</h1>
          {media.tagline && <p className="text-xl text-gray-400 italic mb-6">"{media.tagline}"</p>}

          <div className="flex flex-wrap items-center text-lg text-gray-300 mb-6 gap-x-6 gap-y-3">
            <span className="flex items-center"><FaStar className="text-yellow-400 mr-2" />{rating} / 10</span>
            <span className="flex items-center"><FaCalendarAlt className="text-blue-400 mr-2" />{releaseInfo}</span>
            <span className="flex items-center"><FaClock className="text-green-400 mr-2" />{durationInfo}</span>
            <span className="flex items-center"><FaTag className="text-purple-400 mr-2" />{genres}</span>
          </div>

          <h2 className="text-2xl font-bold mb-3 text-gray-200 flex items-center">
            <FaInfoCircle className="mr-2 text-blue-400" />Overview
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">{overview || 'No overview available.'}</p>

          {media.media_type === 'movie' && (media as TmdbMovieDetails).production_companies?.length > 0 && (
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

          {media.media_type === 'tv' && (media as TmdbTvShowDetails).seasons?.length > 0 && (
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

          {/* Trailer */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-200 flex items-center">
              <FaPlayCircle className="mr-2 text-red-500" />Official Trailer
            </h2>
            {mainTrailer ? (
              <div className="relative pt-[56.25%] bg-gray-800 rounded-lg overflow-hidden shadow-xl">
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
                <p className="text-sm text-gray-500">
                  We're sorry, it looks like there isn't a trailer for this {mediaType === 'movie' ? 'movie' : 'TV show'} yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
