// lib/types/tmdb.ts
// This file contains only type definitions and can be safely imported by both server and client components.

export interface TmdbMediaItem {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  media_type: 'movie' | 'tv' | 'person'; // TMDB trending can also return 'person'

  // Conditional properties based on media_type
  title?: string; // For movies
  original_title?: string; // For movies
  release_date?: string; // For movies

  name?: string; // For TV shows
  original_name?: string; // For TV shows
  first_air_date?: string; // For TV shows

  // For 'person' media_type (if we were to handle it, currently we mostly filter for movie/tv)
  gender?: number;
  known_for_department?: string;
  profile_path?: string | null;
  known_for?: TmdbMediaItem[];
}

// Extend TmdbMediaItem for more specific movie details
export interface TmdbMovieDetails extends TmdbMediaItem {
  media_type: 'movie'; // Narrow type for movies
  belongs_to_collection: any | null;
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string | null;
  imdb_id: string | null;
  production_companies: { id: number; logo_path: string | null; name: string; origin_country: string }[];
  production_countries: { iso_3166_1: string; name: string }[];
  revenue: number;
  runtime: number | null;
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  status: string;
  tagline: string | null;
}

// Extend TmdbMediaItem for more specific TV show details
export interface TmdbTvShowDetails extends TmdbMediaItem {
  media_type: 'tv'; // Narrow type for TV shows
  created_by: { id: number; credit_id: string; name: string; gender: number; profile_path: string | null }[];
  episode_run_time: number[];
  genres: { id: number; name: string }[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: any;
  next_episode_to_air: any | null;
  networks: { id: number; logo_path: string | null; name: string; origin_country: string }[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    vote_average: number;
  }[];
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  status: string;
  tagline: string;
  type: string;
}

// Define a common return type for paginated results
export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// INTERFACES FOR VIDEO DATA
export interface TmdbVideo {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string; // This is the YouTube video ID
  site: string; // e.g., "YouTube"
  size: number;
  type: string; // e.g., "Trailer", "Teaser", "Clip"
  official: boolean;
  published_at: string;
  id: string;
}

export interface TmdbVideoResponse {
  id: number;
  results: TmdbVideo[];
}