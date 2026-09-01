# Tailwind setup

`src/tailwind.css`:

```css
@import "tailwindcss";
```

`postcss.config.mjs`:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

All LGS component and page styling is expressed with Tailwind classes in TSX files.
