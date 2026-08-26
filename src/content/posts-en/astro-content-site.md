---
title: "Building a Truly Lightweight Content Site with Astro"
summary: "Keep articles in Markdown and interaction in small islands so a content site stays fast without a complicated backend."
publishedAt: 2026-08-18
category: "Development"
tags: ["Astro", "Frontend", "Personal Web"]
featured: true
readingTime: 5
cover: "/images/posts/astro-content-site.png"
ogImage: "/images/og/astro-content-site.png"
coverAlt: "A pixel window showing a static build pipeline"
---

A content blog needs stable article URLs and low maintenance costs. Astro emits static HTML by default, while search and theme controls load only the scripts they need.

## Content collections

Every article is checked against a schema for its title, summary, date, category, and tags. Publishing errors surface during the build instead of after readers encounter them.

## Small interactive islands

Theme switching and Pixelium controls use Vue. Article bodies remain static HTML, keeping the boundary clear.
