// components/common/MovieCarousel.tsx
'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { TmdbMediaItem } from '@/lib/types/tmdb'; // <--- NEW IMPORT for types
import { FaStar } from 'react-icons/fa';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Base URL for TMDB images
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

const getImageUrl = (path: string | null | undefined, size: string = 'original') => {
  if (!path) {
    return `https://placehold.co/png/1920x1080/1f2937/FFFFFF?text=No+Image`;
  }
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
};

interface MovieCarouselProps {
  movies: TmdbMediaItem[];
}

export default function MovieCarousel({ movies }: MovieCarouselProps) {
  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        No movies available for the carousel.
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-lg shadow-2xl mb-12">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper w-full h-full"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <Link href={`/movie/${movie.id}`} className="block w-full h-full relative">
              <Image
                src={getImageUrl(movie.backdrop_path || movie.poster_path, 'w1280')}
                alt={movie.title || movie.name || 'Movie Poster'}
                fill
                sizes="100vw"
                className="object-cover object-center brightness-50 transition-all duration-500 ease-in-out hover:brightness-75"
                priority
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getImageUrl(null);
                  target.alt = "Image not available";
                }}
              />
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg animate-fade-in-up">
                  {movie.title || movie.name}
                </h2>
                <p className="text-lg md:text-xl text-gray-200 mb-4 max-w-2xl line-clamp-3 drop-shadow-md animate-fade-in-up delay-200">
                  {movie.overview}
                </p>
                <div className="flex items-center text-yellow-400 text-lg md:text-xl mb-4 animate-fade-in-up delay-300">
                  <FaStar className="mr-2" />
                  <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} / 10</span>
                </div>
                <button className="self-start px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-400">
                  View Details
                </button>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}