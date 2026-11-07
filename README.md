# emanuele.co

Plain Markdown in, plain HTML out. Built with [Eleventy](https://www.11ty.dev/) and published to GitHub Pages on every push to `main`.

## Write a post

Add a file to `src/posts/`. The file name becomes the address: `src/posts/on-action.md` is published at `emanuele.co/on-action/`.

```markdown
---
title: On Action
date: 2026-11-07
categories: [essays, habits]
---

The text, in Markdown.
```

Categories are the slugs listed in `src/_data/topics.json`. Images and other files go in `src/media/` and are linked as `/media/…`.

Then `git push`. GitHub builds and publishes the site in about a minute.

## Preview locally

```sh
npm install      # once
npm start        # http://localhost:8080, reloads as you edit
```

## Where things are

| | |
|---|---|
| `src/posts/` | posts (Markdown) |
| `src/index.njk` | home page: bio, photo, GitHub graph, recent notes |
| `src/notes.njk` | `/notes/`: every note, by year |
| `src/pages/` | Reading, Reading List, UNcopyright, Work Like Mäd |
| `src/_includes/` | the HTML templates |
| `src/style.css` | all the styling |
| `src/_data/github.js` | fetches the GitHub contribution graph at build time |
| `lib/heatmap.js` | draws that graph as SVG |
| `.github/workflows/deploy.yml` | build and deploy on push, plus a daily rebuild |
| `scripts/import-wordpress.mjs` | one-off import from emanuele.cc; delete once WordPress is gone |
