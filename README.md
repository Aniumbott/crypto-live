# CryptoLive

A real-time cryptocurrency price dashboard built with React, TypeScript, and Vite. Features live WebSocket updates, a clean modern UI, and production-ready architecture.

## Live Demo

The production version is available at [https://crypto-live-deploy.vercel.app/](https://crypto-live-deploy.vercel.app/)

## Features

- ⚡ **Real-time Updates**: Live price feeds via Binance WebSocket with sub-second latency.
- 📊 **Market Data**: Top cryptocurrencies by market cap with auto-refreshing rankings.
- 🎨 **Modern UI**: Default Dark Mode with optional Light Mode, utilizing a clean Slate/Blue color palette.
- 📱 **Responsive**: Mobile-first design with horizontal scrolling tables.
- ♿ **Accessible**: ARIA labels, keyboard navigation, and screen reader support.
- ⌨️ **Keyboard Navigation**: 
  - `↑` / `↓` to navigate rows.
  - `Enter` to view details.
  - `Escape` to clear selection or close modals.
  - `/` to focus search.
- 📉 **Sparklines**: Visual 7-day price trend indicators.
- ⭐️ **Favorites**: Pin your favorite coins to the top.
- 🚀 **Performance**: 
  - Web Workers for off-main-thread data processing.
  - `tabular-nums` for stable numeric updates.
  - Virtual DOM optimizations for rapid price flashes.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (Slate, Blue, Emerald, Rose palette)
- **Data**: CoinGecko API (Metadata), Binance WebSocket (Live Prices)
- **State**: React Context + Web Workers
- **Build**: Vite with Terser minification

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Aniumbott/crypto-terminal.git
cd crypto-terminal

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Build for Production

```bash
# Type check and build
npm run build

# Preview the build locally
npm run preview
```

## Project Structure

```
crypto-terminal/
├── public/              # Static assets (manifest, icons)
├── src/
│   ├── components/
│   │   ├── common/      # Generic UI components (Toast, Skeleton, etc.)
│   │   ├── layout/      # Layout components (Header, StatusBar)
│   │   ├── modal/       # Coin Detail Modal
│   │   └── table/       # Data table components and Sparklines
│   ├── context/         # React Context (Theme, Toast)
│   ├── hooks/           # Custom hooks (Workers, Search, Sort, Favorites)
│   ├── lib/             # Utilities, Constants, Schemas
│   ├── types/           # TypeScript definitions
│   ├── workers/         # Dedicated Web Worker for WebSocket handling
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Entry point
└── ...config files
```

## Configuration

Create a `.env` file based on `.env.example`:

```env
# API Configuration
VITE_COINGECKO_API_URL=https://api.coingecko.com/api/v3
VITE_BINANCE_WS_URL=wss://stream.binance.com:9443

# Intervals (milliseconds)
VITE_RANKING_REFRESH_INTERVAL=300000
VITE_STATS_INTERVAL=1000
```

## Architecture

### Web Worker Pattern

To ensure the UI remains buttery smooth even during high-volatility market events, all data processing is offloaded:
1.  **Main Thread**: Handles UI rendering and user interaction only.
2.  **Worker Thread**: Manages WebSocket connections, parses incoming binary/JSON data, merges updates with CoinGecko metadata, and computes statistics.

### Performance Optimizations

- **Direct DOM Manipulation**: Price updates bypass the standard React render cycle for specific text nodes to minimize overhead during rapid updates.
- **Tabular Numerals**: CSS font settings prevent layout shifts when numbers change width.
- **Debounced Search**: Filtering logic is optimized for large lists.