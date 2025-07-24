

# 🎬 Movie Explorer

[![Live Demo](https://img.shields.io/badge/Live%20Demo-%23000000.svg?style=for-the-badge&logo=firefoxbrowser&logoColor=white)](https://your-deployment-link.com)
[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/venupagadala/my-movie-explorer)

Welcome to **Movie Explorer**, a modern web application for discovering and exploring movies and TV shows! Built with **Next.js**, this app delivers a fast, responsive, and feature-rich browsing experience.

## ✨ Features

- **Dynamic Homepage**: Captivating carousel showcasing "Now Playing" movies  
- **Trending Content**: Browse popular movies and TV shows in a responsive grid  
- **Detailed Pages**: View comprehensive movie/TV details (overview, ratings, genres, etc.)  
- **Search Functionality**: Quickly find movies and TV shows  
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices  
- **Optimized Images**: Leveraging `next/image` for performance  
- **Server-Side Data Fetching**: Faster loads & improved SEO using Next.js server components  

## 📁 Project Structure

```

my-movie-explorer/
├── app/                      # Next.js App Router root
│   ├── api/                  # API Routes for data fetching
│   │   └── media-details/
│   │       └── route.ts
│   ├── \[mediaType]/          # Dynamic routes for movie/TV details
│   │   └── \[id]/page.tsx
│   ├── movie/popular/        # Static routes for movies
│   │   └── page.tsx
│   ├── tv/popular/           # Static routes for TV shows
│   │   └── page.tsx
│   ├── search/page.tsx       # Search results page
│   ├── favicon.png           # Application favicon
│   ├── globals.css           # Global Tailwind CSS styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── components/               # Reusable components
│   ├── common/               # Shared UI components
│   │   ├── ClientImage.tsx
│   │   ├── MediaCard.tsx
│   │   └── MovieCarousel.tsx
│   └── layout/Header.tsx     # Application header
├── lib/                      # Utilities & configs
│   ├── server/tmdb-api.ts    # TMDB API functions
│   └── types/tmdb.ts         # TypeScript types
├── public/                   # Static assets
├── .env.local                # Environment variables
├── next.config.ts            # Next.js configuration
├── package.json              # Project dependencies
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation

````

## 🛠️ Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Swiper.js](https://img.shields.io/badge/swiper.js-%23000000.svg?style=for-the-badge&logo=swiper&logoColor=blue)

### Backend / API
![TMDB](https://img.shields.io/badge/TMDB-01d277?style=for-the-badge&logo=themoviedatabase&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

### Deployment
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=00C7B7)

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/venupagadala/my-movie-explorer.git
   cd my-movie-explorer


2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   * Get a free API key from [TMDB](https://www.themoviedb.org/documentation/api)
   * Create a `.env.local` file in the root directory

     ```bash
     TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
     ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

This app can be easily deployed to **Vercel**, **Netlify**, or any Node.js hosting platform.

To build for production:

```bash
npm run build
```

## 🙏 Acknowledgments

* **Data:** [The Movie Database (TMDB)](https://www.themoviedb.org/)
* **Icons:** [React Icons](https://react-icons.github.io/react-icons/)
* **Carousel:** [Swiper.js](https://swiperjs.com/)
* Built with **Next.js** & **Tailwind CSS**

```


