// components/common/ClientCarouselWrapper.tsx
'use client'; // This component MUST be a Client Component

import dynamic from 'next/dynamic';
import { TmdbMediaItem } from '@/lib/types/tmdb'; // Import types

// Dynamically import MovieCarousel ONLY on the client
const MovieCarousel = dynamic(() => import('./MovieCarousel'), {
  ssr: false, // This is now allowed because ClientCarouselWrapper is a Client Component
  loading: () => (
    <div className="h-[500px] md:h-[600px] lg:h-[700px] bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 text-xl">
      Loading Carousel...
    </div>
  ),
});

interface ClientCarouselWrapperProps {
  movies: TmdbMediaItem[];
}

// This component acts as a client-side boundary for the dynamic import
export default function ClientCarouselWrapper({ movies }: ClientCarouselWrapperProps) {
  return <MovieCarousel movies={movies} />;
}