// components/common/MediaCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { TmdbMediaItem } from '@/lib/types/tmdb'; // <--- NEW IMPORT for types
import { FaStar } from 'react-icons/fa';

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

const getImageUrl = (path: string | null | undefined, size: string = 'w342') => {
  if (!path) {
    return `https://placehold.co/png/342x513/1f2937/FFFFFF?text=No+Image`;
  }
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
};

interface MediaCardProps {
  item: TmdbMediaItem;
}

export default function MediaCard({ item }: MediaCardProps) {
  const title = item.media_type === 'movie' ? item.title : item.name;
  const releaseDate = item.media_type === 'movie' ? item.release_date : item.first_air_date;
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
  const linkPath = `/${item.media_type}/${item.id}`;

  return (
    <Link href={linkPath} className="block group">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
        <div className="relative w-full h-72 sm:h-80 md:h-96">
          <Image
            src={getImageUrl(item.poster_path)}
            alt={title || 'Media Poster'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-opacity duration-300 group-hover:opacity-80"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.target as HTMLImageElement;
              target.src = getImageUrl(null);
              target.alt = "Image not available";
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-white truncate mb-1">
            {title}
          </h3>
          <div className="flex items-center text-gray-400 text-sm">
            <FaStar className="text-yellow-400 mr-1" />
            <span>{rating}</span>
            {releaseDate && <span className="ml-3">({new Date(releaseDate).getFullYear()})</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}