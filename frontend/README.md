# Figma React Project

A React + TypeScript project converted from Figma components.

## Features

- ⚛️ React 18 with TypeScript
- ⚡ Vite for fast development and building
- 🎨 Tailwind CSS for styling
- 🔧 ESLint for code quality
- 📦 Modern build tooling

## Components

### ImageWithFallback
A robust image component that displays a fallback when the original image fails to load.

**Props:**
- `src`: Image source URL
- `alt`: Alternative text for accessibility
- `className`: CSS classes for styling
- `style`: Inline styles
- All standard HTML img attributes

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Project Structure

```
figma-react-project/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   └── ImageWithFallback.tsx
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles with Tailwind
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── vite.config.ts         # Vite configuration
```

## Development

- The project uses Vite for fast hot-module replacement during development
- TypeScript provides type safety and better developer experience
- Tailwind CSS is configured for utility-first styling
- ESLint helps maintain code quality

## Adding More Components

1. Create new component files in `src/components/`
2. Export them from your components
3. Import and use them in `App.tsx` or other components
4. Follow TypeScript best practices for props and interfaces
