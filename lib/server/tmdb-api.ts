// lib/server/tmdb-api.ts
// This file contains server-side API fetching logic and MUST NOT be imported by client components.
import 'server-only';

// Base URL for TMDB API
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

if (!process.env.TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY is not defined in environment variables. Please check your .env.local file.");
}

const API_KEY = process.env.TMDB_API_KEY;

// Import types from the types file
import { TmdbMediaItem, TmdbMovieDetails, TmdbTvShowDetails, PaginatedResponse } from '../types/tmdb';

// --- NEW INTERFACES FOR VIDEO DATA (Moved from types file as they are specific to API response) ---
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
// --- END NEW INTERFACES ---


/**
 * Generic function to fetch data from TMDB API.
 * Handles API key injection and basic error handling.
 * @param endpoint The TMDB API endpoint (e.g., "/trending/movie/week", "/movie/popular")
 * @param params Optional query parameters
 * @returns Parsed JSON response from the API, including total_pages and total_results
 */
async function fetchFromTmdb(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append("api_key", API_KEY);

  for (const key in params) {
    url.searchParams.append(key, params[key]);
  }

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ status_message: "Unknown error from TMDB" }));
      console.error(`TMDB API Error (${response.status} ${response.statusText}):`, errorData);
      throw new Error(`Failed to fetch data from TMDB: ${errorData.status_message || response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching from TMDB:", error);
    throw error;
  }
}

/**
 * Fetches trending movies for the week.
 * @param page The page number to fetch (defaults to 1)
 * @returns PaginatedResponse<TmdbMediaItem>
 */
export async function getTrendingMovies(page: number = 1): Promise<PaginatedResponse<TmdbMediaItem>> {
  const data = await fetchFromTmdb("/trending/movie/week", { page: String(page) });
  return data;
}

/**
 * Fetches trending TV shows for the week.
 * @param page The page number to fetch (defaults to 1)
 * @returns PaginatedResponse<TmdbMediaItem>
 */
export async function getTrendingTvShows(page: number = 1): Promise<PaginatedResponse<TmdbMediaItem>> {
  const data = await fetchFromTmdb("/trending/tv/week", { page: String(page) });
  return data;
}

/**
 * Fetches movies based on a search query.
 * @param query The search term
 * @param page The page number to fetch (defaults to 1)
 * @returns PaginatedResponse<TmdbMediaItem>
 */
export async function searchMovies(query: string, page: number = 1): Promise<PaginatedResponse<TmdbMediaItem>> {
  if (!query) return { page: 1, results: [], total_pages: 0, total_results: 0 };
  const data = await fetchFromTmdb("/search/movie", { query, page: String(page) });
  return data;
}

/**
 * Fetches TV shows based on a search query.
 * @param query The search term
 * @param page The page number to fetch (defaults to 1)
 * @returns PaginatedResponse<TmdbMediaItem>
 */
export async function searchTvShows(query: string, page: number = 1): Promise<PaginatedResponse<TmdbMediaItem>> {
  if (!query) return { page: 1, results: [], total_pages: 0, total_results: 0 };
  const data = await fetchFromTmdb("/search/tv", { query, page: String(page) });
  return data;
}

/**
 * Fetches details for a specific movie or TV show.
 * @param mediaType "movie" or "tv"
 * @param id The ID of the movie/TV show
 * @returns TmdbMovieDetails or TmdbTvShowDetails
 */
export async function getMediaDetails(mediaType: "movie" | "tv", id: string): Promise<TmdbMovieDetails | TmdbTvShowDetails> {
  if (!mediaType || !id) throw new Error("mediaType and id are required to get media details.");
  const data = await fetchFromTmdb(`/${mediaType}/${id}`);
  return data;
}

/**
 * Fetches videos (trailers, teasers, etc.) for a specific movie or TV show.
 * @param mediaType "movie" or "tv"
 * @param id The ID of the movie/TV show
 * @returns TmdbVideoResponse containing an array of videos
 */
export async function getMediaVideos(mediaType: "movie" | "tv", id: string): Promise<TmdbVideoResponse> {
  if (!mediaType || !id) throw new Error("mediaType and id are required to get media videos.");
  const data = await fetchFromTmdb(`/${mediaType}/${id}/videos`);
  return data;
}

/**
 * Fetches movies that are currently playing in theaters.
 * @param page The page number to fetch (defaults to 1)
 * @returns PaginatedResponse<TmdbMediaItem>
 */
export async function getNowPlayingMovies(page: number = 1): Promise<PaginatedResponse<TmdbMediaItem>> {
  const data = await fetchFromTmdb("/movie/now_playing", { page: String(page) });
  return data;
}

// These functions were added in your previous input. Keeping them for now.
export async function getPopularMovies(page: number = 1): Promise<PaginatedResponse<TmdbMediaItem>> {
  const data = await fetchFromTmdb("/movie/popular", { page: String(page) });
  return data;
}

export async function getPopularTvShows(page: number = 1): Promise<PaginatedResponse<TmdbMediaItem>> {
  const data = await fetchFromTmdb("/tv/popular", { page: String(page) });
  return data;
}

// Optional: Function to get movie genres (for future filtering)
export async function getMovieGenres() {
  const data = await fetchFromTmdb("/genre/movie/list");
  return data.genres;
}

// Optional: Function to get TV genres (for future filtering)
export async function getTvGenres() {
  const data = await fetchFromTmdb("/genre/tv/list");
  return data.genres;
}