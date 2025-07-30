// lib/server/tmdb-api.ts
// This file contains server-side API fetching logic and MUST NOT be imported by client components.
import 'server-only';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Ensure TMDB_API_KEY is defined in the environment
if (!process.env.TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY is not defined in environment variables. Please check your .env.local file.");
}

const API_KEY = process.env.TMDB_API_KEY;

// Import core TMDB types from the types file
import { TmdbMediaItem, TmdbMovieDetails, TmdbTvShowDetails, PaginatedResponse } from '../types/tmdb';

// --- Interfaces for Video Data ---
// These interfaces define the structure of video objects returned by the TMDB API.
export interface TmdbVideo {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string; // The YouTube video ID
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
// --- End Video Interfaces ---

/**
 * Generic function to fetch data from the TMDB API.
 * Handles API key injection and robust error handling.
 * @param endpoint The TMDB API endpoint (e.g., "/trending/movie/week").
 * @param params Optional query parameters to append to the URL.
 * @returns A Promise that resolves to the parsed JSON response from the API.
 * @throws An Error if the network request fails or the API returns an error status.
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
 * @param page The page number to fetch (defaults to 1).
 * @returns A PaginatedResponse containing trending movie items.
 */
export async function getTrendingMovies(page: number = 1): Promise<PaginatedResponse<TmdbMediaItem>> {
  return fetchFromTmdb("/trending/movie/week", { page: String(page) });
}

/**
 * Fetches trending TV shows for the week.
 * @param page The page number to fetch (defaults to 1).
 * @returns A PaginatedResponse containing trending TV show items.
 */
export async function getTrendingTvShows(page: number = 1): Promise<PaginatedResponse<TmdbMediaItem>> {
  return fetchFromTmdb("/trending/tv/week", { page: String(page) });
}

/**
 * Searches for movies based on a query.
 * @param query The search term.
 * @param page The page number to fetch (defaults to 1).
 * @returns A PaginatedResponse containing matching movie items. Returns an empty response if query is empty.
 */
export async function searchMovies(query: string, page: number = 1): Promise<PaginatedResponse<TmdbMediaItem>> {
  if (!query) return { page: 1, results: [], total_pages: 0, total_results: 0 };
  return fetchFromTmdb("/search/movie", { query, page: String(page) });
}

/**
 * Searches for TV shows based on a query.
 * @param query The search term.
 * @param page The page number to fetch (defaults to 1).
 * @returns A PaginatedResponse containing matching TV show items. Returns an empty response if query is empty.
 */
export async function searchTvShows(query: string, page: number = 1): Promise<PaginatedResponse<TmdbMediaItem>> {
  if (!query) return { page: 1, results: [], total_pages: 0, total_results: 0 };
  return fetchFromTmdb("/search/tv", { query, page: String(page) });
}

/**
 * Fetches detailed information for a specific movie or TV show.
 * @param mediaType The type of media ("movie" or "tv").
 * @param id The ID of the movie or TV show.
 * @returns A Promise that resolves to either TmdbMovieDetails or TmdbTvShowDetails.
 * @throws An Error if mediaType or id are missing.
 */
export async function getMediaDetails(mediaType: "movie" | "tv", id: string): Promise<TmdbMovieDetails | TmdbTvShowDetails> {
  if (!mediaType || !id) throw new Error("mediaType and id are required to get media details.");
  return fetchFromTmdb(`/${mediaType}/${id}`);
}

/**
 * Fetches videos (trailers, teasers, etc.) for a specific movie or TV show.
 * @param mediaType The type of media ("movie" or "tv").
 * @param id The ID of the movie or TV show.
 * @returns A TmdbVideoResponse containing an array of video objects.
 * @throws An Error if mediaType or id are missing.
 */
export async function getMediaVideos(mediaType: "movie" | "tv", id: string): Promise<TmdbVideoResponse> {
  if (!mediaType || !id) throw new Error("mediaType and id are required to get media videos.");
  return fetchFromTmdb(`/${mediaType}/${id}/videos`);
}

/**
 * Fetches movies that are currently playing in theaters.
 * @param page The page number to fetch (defaults to 1).
 * @returns A PaginatedResponse containing now playing movie items.
 */
export async function getNowPlayingMovies(page: number = 1): Promise<PaginatedResponse<TmdbMediaItem>> {
  return fetchFromTmdb("/movie/now_playing", { page: String(page) });
}

/**
 * Fetches popular movies.
 * @param page The page number to fetch (defaults to 1).
 * @returns A PaginatedResponse containing popular movie items.
 */
export async function getPopularMovies(page: number = 1): Promise<PaginatedResponse<TmdbMediaItem>> {
  return fetchFromTmdb("/movie/popular", { page: String(page) });
}

/**
 * Fetches popular TV shows.
 * @param page The page number to fetch (defaults to 1).
 * @returns A PaginatedResponse containing popular TV show items.
 */
export async function getPopularTvShows(page: number = 1): Promise<PaginatedResponse<TmdbMediaItem>> {
  return fetchFromTmdb("/tv/popular", { page: String(page) });
}

/**
 * Fetches a list of movie genres.
 * @returns A Promise that resolves to an array of movie genre objects.
 */
export async function getMovieGenres() {
  const data = await fetchFromTmdb("/genre/movie/list");
  return data.genres;
}

/**
 * Fetches a list of TV show genres.
 * @returns A Promise that resolves to an array of TV show genre objects.
 */
export async function getTvGenres() {
  const data = await fetchFromTmdb("/genre/tv/list");
  return data.genres;
}
