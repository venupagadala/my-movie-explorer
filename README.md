
# 🎬 Movie Explorer

[![Live Demo](https://img.shields.io/badge/Live%20Demo-%2300ADEF.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://my-movie-explorer-1s25uvcay-venus-projects-53cd17d5.vercel.app/)


Welcome to **Movie Explorer** — a modern web application for discovering and exploring movies and TV shows!  
Built with **Next.js 14** and **Tailwind CSS**, this app delivers a **fast, responsive, and feature-rich** browsing experience.

---

## ✨ Features

- **Dynamic Homepage:** Captivating carousel showcasing “Now Playing” movies.  
- **Trending Content:** Browse popular movies and TV shows in a responsive grid with independent pagination.  
- **Smooth Pagination Scroll:** Seamless navigation that auto-scrolls to the relevant section.  
- **Enhanced Header:** A fixed, semi-transparent header with a frosted glass effect that hides on scroll down and reappears on scroll up.  
- **Detailed Pages:** Comprehensive details (overview, ratings, genres) with official trailers (and a “No trailer available” fallback).  
- **Search Functionality:** Quickly find movies and TV shows.  
- **Fully Responsive:** Optimized for desktop, tablet, and mobile devices.  
- **Optimized Images:** Powered by `next/image` with fallback placeholders for missing images.  
- **Server-Side Rendering:** Faster loads & improved SEO using Next.js server components.

---

## 📁 Project Structure

```bash
my-movie-explorer/
├── app/                      # Next.js App Router root
│   ├── api/                  # API Routes for data fetching
│   │   └── media-details/    # Endpoint for fetching media details and videos
│   │       └── route.ts
│   ├── [mediaType]/[id]/     # Dynamic routes for movie/TV details
│   │   └── page.tsx
│   ├── movie/popular/        # Popular Movies page
│   │   └── page.tsx
│   ├── tv/popular/           # Popular TV Shows page
│   │   └── page.tsx
│   ├── search/page.tsx       # Search results page
│   ├── globals.css           # Tailwind global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── components/               # Reusable UI components
│   ├── common/               # Shared components
│   │   ├── ClientImage.tsx
│   │   ├── MediaCard.tsx
│   │   ├── MovieCarousel.tsx
│   │   └── PaginationControls.tsx
│   └── layout/
│       └── Header.tsx
├── lib/                      # Utilities & configs
│   ├── server/tmdb-api.ts    # Server-side TMDB API functions
│   └── types/tmdb.ts         # TypeScript type definitions
├── public/                   # Static assets
├── .env.local                # Environment variables
├── next.config.ts            # Next.js configuration
├── postcss.config.mjs        # PostCSS config for Tailwind
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies
└── README.md                 # Project documentation
````

---

## 🛠️ Tech Stack

**Frontend:**

* [Next.js](https://nextjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [React Icons](https://react-icons.github.io/react-icons/)
* [Swiper.js](https://swiperjs.com/) (for carousel)

**Backend / API:**

* **Next.js API routes**
* **The Movie Database (TMDB) API**

**Deployment:**

* **Vercel** (recommended) / Netlify / any Node.js hosting

---

## 🚀 Installation & Setup

Clone the repository:

```bash
git clone https://github.com/venupagadala/my-movie-explorer.git
cd my-movie-explorer
```

Install dependencies:

```bash
npm install
```

Set up environment variables:

1. Get a free API key from [TMDB](https://www.themoviedb.org/documentation/api).
2. Create a `.env.local` file in the root directory:

```bash
TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment

Build for production:

```bash
npm run build
```

Deploy easily to [Vercel](https://vercel.com/) or any Node.js hosting platform.

---

## 🔮 Future Enhancements

* **Cast & Crew Listing**: Show main actors and crew on detail pages.
* **Similar Content Recommendations**: Suggest movies/TV shows based on current selections.
* **Genre-Based Browsing**: Filter by categories like Action, Comedy, Drama, etc.
* **User Authentication**: Enable user accounts, watchlists, and favorites.

---

## 🙏 Acknowledgments

* **Data:** [The Movie Database (TMDB)](https://www.themoviedb.org/)
* **Icons:** [React Icons](https://react-icons.github.io/react-icons/)
* **Carousel:** [Swiper.js](https://swiperjs.com/)
* Built with [Next.js](https://nextjs.org/) & [Tailwind CSS](https://tailwindcss.com/)

---

**Author:** [Venu Gopal Reddy Pagadala](https://github.com/venupagadala)
⭐ *If you like this project, consider giving it a star!*


