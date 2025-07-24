// components/common/ClientImage.tsx
'use client'; // This component MUST be a Client Component

import Image, { ImageProps } from 'next/image';
import React from 'react';

// Base URL for TMDB images (same as in MediaCard and detail page)
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

const getPlaceholderImageUrl = (size: string = 'w500') => {
  // Use a placeholder that matches the aspect ratio for general images
  // For a 500x750 poster, 2:3 aspect ratio. For a backdrop (e.g., 1280x720), 16:9.
  if (size.includes('w500')) return `https://placehold.co/png/500x750/1f2937/FFFFFF?text=No+Image`;
  if (size.includes('w1280')) return `https://placehold.co/png/1280x720/1f2937/FFFFFF?text=No+Image`;
  return `https://placehold.co/png/500x750/1f2937/FFFFFF?text=No+Image`; // Default fallback
};


interface ClientImageProps extends ImageProps {
  // You can add any custom props here if needed
  // For now, we're just extending ImageProps
}

export default function ClientImage(props: ClientImageProps) {
  const [imgSrc, setImgSrc] = React.useState(props.src);
  const [imgAlt, setImgAlt] = React.useState(props.alt);

  // This onError handler will now only run on the client
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImgSrc(getPlaceholderImageUrl(props.sizes || props.width ? (props.width + 'x' + props.height) : 'w500')); // Try to match placeholder size
    setImgAlt("Image not available");
    // Optionally, you can call the original onError if it was passed
    if (props.onError) {
      props.onError(e);
    }
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={imgAlt}
      onError={handleError}
    />
  );
}