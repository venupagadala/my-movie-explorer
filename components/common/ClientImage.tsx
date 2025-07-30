// components/common/ClientImage.tsx
'use client';

import Image, { ImageProps } from 'next/image';
import React from 'react';

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

/**
 * Generates a placeholder image URL based on desired dimensions.
 * @param width Desired width for the placeholder.
 * @param height Desired height for the placeholder.
 * @returns A URL for a PNG placeholder image.
 */
const getPlaceholderImageUrl = (width?: number | string, height?: number | string): string => {
  const defaultWidth = 500;
  const defaultHeight = 750; // Standard poster aspect ratio

  // Use provided dimensions if available, otherwise fall back to defaults
  const finalWidth = width ? String(width).replace('px', '') : defaultWidth;
  const finalHeight = height ? String(height).replace('px', '') : defaultHeight;

  return `https://placehold.co/png/${finalWidth}x${finalHeight}/1f2937/FFFFFF?text=No+Image`;
};

interface ClientImageProps extends ImageProps {
  // Extends Next.js ImageProps, no custom props added here.
}

/**
 * A wrapper around Next.js's `Image` component that handles image loading errors.
 * If the primary image fails to load, it falls back to a placeholder.
 */
export default function ClientImage(props: ClientImageProps) {
  const [imgSrc, setImgSrc] = React.useState(props.src);
  const [imgAlt, setImgAlt] = React.useState(props.alt);

  /**
   * Updates the image source to a placeholder and alt text if the image fails to load.
   * Calls any original `onError` handler passed via props.
   */
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImgSrc(getPlaceholderImageUrl(props.width, props.height));
    setImgAlt("Image not available");

    props.onError?.(e); // Call original onError if it exists
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
// This component can be used anywhere in the app where a client-side image is needed.
// It will automatically handle image loading errors and provide a fallback placeholder image.