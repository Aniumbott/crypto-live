# CryptoLive

A real-time cryptocurrency price dashboard built with React, TypeScript, and Vite. Features live WebSocket updates, beautiful UI, and production-ready architecture.

## Features

- ⚡ **Real-time Updates**: Live price feeds via Binance WebSocket
- 📊 **Market Data**: Top 10 cryptocurrencies by market cap
- 🎨 **Modern UI**: Dark/light theme with smooth animations
- 📱 **Responsive**: Mobile-first design
- ♿ **Accessible**: ARIA labels, keyboard navigation, screen reader support
- ⌨️ **Keyboard Navigation**: Arrow keys to navigate, Enter to select, Escape to clear
- 🔄 **Auto-refresh**: Rankings update every 5 minutes
- 🔔 **Notifications**: Connection status and error toasts
- 📈 **Sparklines**: 7-day price charts
- ⭐ **Favorites**: Mark and track your favorite coins
- 🚀 **Performance**: Web Workers, memoization, optimized builds
- 📱 **PWA Support**: Installable as app with offline support

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate between coin rows |
| `Enter` | Open details for selected coin |
| `Escape` | Clear selection |

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: CSS Variables, CSS Grid/Flexbox
- **Data**: CoinGecko API, Binance WebSocket
- **Build**: Vite with Terser minification
- **Linting**: ESLint with TypeScript rules

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/crypto-terminal.git
cd crypto-terminal

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Build for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
crypto-terminal/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   └── Toast.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── StatusBar.tsx
│   │   └── table/
│   │       ├── CoinRow.tsx
│   │       ├── PriceTable.tsx
│   │       └── Sparkline.tsx
│   ├── context/
│   │   ├── ThemeContext.tsx
│   │   └── ToastContext.tsx
│   ├── hooks/
│   │   └── usePriceWorker.ts
│   ├── lib/
│   │   ├── cn.ts
│   │   ├── constants.ts
│   │   └── formatters.ts
│   ├── styles/
│   │   └── globals.css
│   ├── types/
│   │   ├── coin.ts
│   │   └── worker.ts
│   ├── workers/
│   │   └── price.worker.ts
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## Configuration

Create a `.env` file based on `.env.example`:

```env
# API Configuration
VITE_COINGECKO_API_URL=https://api.coingecko.com/api/v3
VITE_BINANCE_WS_URL=wss://stream.binance.com:9443

# Feature Flags
VITE_ENABLE_ANALYTICS=false

# Intervals (milliseconds)
VITE_RANKING_REFRESH_INTERVAL=300000
VITE_STATS_INTERVAL=1000
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking

## Architecture

### Web Worker Pattern

Price updates are handled in a dedicated Web Worker to prevent blocking the main thread:

- **Main Thread**: UI rendering, user interactions
- **Worker Thread**: API calls, WebSocket connections, price calculations

### State Management

- **Local State**: React hooks for component state
- **Context**: Theme and toast notifications
- **Worker Messages**: Price updates via postMessage API

### Performance Optimizations

- **Memoization**: React.memo for expensive components
- **Direct DOM Updates**: Price changes bypass React for speed
- **Code Splitting**: Manual chunks for better caching
- **Tree Shaking**: Unused code eliminated in build
