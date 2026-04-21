# Guppy - Personal Website

AI Product Manager personal website built with a minimalist tech aesthetic. Particle network animation, typewriter effect, dual-language support (ZH/EN), and light/dark theme switching.

## Live

`https://Guppy608.github.io/guppy-resume`

## Stack

- HTML5 + CSS3 (CSS custom properties, Grid, Flexbox)
- Vanilla JavaScript (Canvas particle animation, IntersectionObserver)
- Google Fonts: Inter + JetBrains Mono

## Structure

```
├── index.html          # Main page
├── css/
│   └── style.css       # Design system & responsive styles
├── js/
│   └── script.js       # Particles, typewriter, theme/lang toggle
├── images/
│   └── avatar.png      # Avatar
└── README.md
```

## Features

- **Particle network** — Canvas-based animation in hero section, mouse-interactive
- **Typewriter** — Job title typed out on load, re-triggers on language switch
- **Dual language** — ZH/EN toggle with localStorage persistence
- **Dark mode** — CSS variable-based theme, toggle button + `Ctrl/Cmd+D`
- **Numbered sections** — `01.` `02.` ... with monospace font
- **Code-style labels** — `{ product }` `{ algo }` `{ industry }` card icons
- **Skill proficiency bars** — CSS `--skill-level` variable, animated on hover
- **Rotating avatar ring** — `conic-gradient` border with 8s rotation
- **Staggered scroll animation** — IntersectionObserver with cascading delays

## Local Development

```bash
python -m http.server 8000
# or
npx serve .
```

## Deploy to GitHub Pages

1. Push to GitHub
2. Settings > Pages > Source: Deploy from branch `main` / `/ (root)`
3. Wait for build, visit `https://<username>.github.io/<repo>`

## Customize

- **Colors** — Edit CSS variables in `:root` block of `style.css`
- **Content** — Edit `data-zh` / `data-en` attributes in `index.html`
- **Typing title** — Edit `titles` object in `script.js`
