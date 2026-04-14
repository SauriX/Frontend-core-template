# Vue Generic Template

## Overview
This repository is a Vue 3 starter template for building web applications with routing, authentication support, localization, and reusable UI components.

## Prerequisites
- Node.js 18 or later
- npm 10 or later

## Install dependencies
```bash
npm install
```

## Development
```bash
npm run dev
```

Open the local development URL shown by Vite to preview the application.

## Build for production
```bash
npm run build
```

## Preview production build
```bash
npm run preview
```

## Environment modes
- `npm run build-dev` — build using development mode
- `npm run build-qa` — build using QA mode
- `npm run qa` — run Vite in QA mode
- `npm run prod` — run Vite in production mode

## Project structure
- `src/main.ts` — application bootstrap
- `src/router/index.ts` — app routing and guards
- `src/core` — authentication and localization infrastructure
- `src/components` — shared UI components
- `src/features` — feature modules and example domain logic
- `src/locales` — translation files
- `src/app/api/agent.ts` — shared API communication layer

## Usage
1. Update configuration values and environment variables as needed.
2. Replace sample views and feature modules with your own application screens.
3. Add or update routes in `src/router/index.ts`.
4. Use `src/app/api/agent.ts` for centralized HTTP requests.
5. Update translation keys in `src/locales/*.json`.

## Notes
This repository is intended as a starting point for a Vue 3 application. Customize the structure and replace example content to fit your project requirements.

3686a8a1-6abf-4d42-a2d8-9f723b6bd82f