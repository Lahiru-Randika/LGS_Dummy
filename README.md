# LGS — Tailwind-only frontend

This project keeps the current LGS React/Vite structure but rewrites the application UI with Tailwind utility classes.

## Run

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Styling rule

The application has **no traditional application CSS files** such as `styles.css` or `publicSite.css`.

The only application stylesheet is:

```text
src/tailwind.css
```

and it only contains:

```css
@import "tailwindcss";
```

UI styling lives directly in JSX/TSX as Tailwind utilities. The Leaflet package still imports `leaflet/dist/leaflet.css` inside `CivicMap.tsx`; that stylesheet belongs to Leaflet and is required for its internal map panes, controls and popups.

## Main routes

- `/` public landing page
- `/about`
- `/services`
- `/news`
- `/contact`
- `/map` public Visigeo/Leaflet map
- `/login`
- `/register`
- `/app` authenticated role dashboard
- `/app/map`
- `/app/requests`

## Tailwind setup

Tailwind CSS 4 is compiled through PostCSS so it can coexist with the Vite version used by this project.

- `tailwindcss`
- `@tailwindcss/postcss`
- `postcss`

The Vite proxy for the real Weddemulle Visigeo GeoJSON files is preserved.
