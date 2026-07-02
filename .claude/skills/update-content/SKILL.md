---
name: update-content
description: Use for everyday site edits — changing prices or property details, adding press articles, updating projects/pipeline, changing stats, contact info, socials, hero photos, or any Site Settings toggle. Maps each request to the right file.
---

# Update site content

Every routine edit is a small change to one content file. Find the right file, make the minimal
edit, then verify + publish (use the **publish** skill).

## Pines & Ponies (rentals)
| Change | File | Notes |
|---|---|---|
| Price, cleaning fee, min nights, sleeps/beds/baths, pets | `src/pines/properties/<slug>.md` | Booking card + cards update everywhere automatically |
| Amenities, tagline, description | same file | |
| Photos | same file (`cardImage`, `gallery`) | Put new photos in `src/pines/assets/uploads/`; big phone photos are fine (auto-optimized) |
| Remove a property | delete its file | Page, card, footer link, sitemap all disappear |
| Reorder home page cards | `order:` field (1 = first) | |

## Cole's Capital Group (corporate)
| Change | Folder | Fields |
|---|---|---|
| Press article | `src/coles/press/` | title, source, url, order |
| Upcoming project | `src/coles/pipeline/` | title, town, status (e.g. "Delivering 2027"), soft (true = outline badge), note, order |
| Completed project (track record) | `src/coles/projects/` | title, year, category (Residential/Commercial/Hospitality/Development), note |
| Project finished? | delete from pipeline/, add to projects/ | |
| Headline numbers | `src/coles/stats/` | value (e.g. "$22M+"), label, order |
| Portfolio cards | `src/coles/portfolio/` | label, title, blurb, image, order |

## Either site: settings (`src/<site>/_data/site.json`)
- Contact: `email`, `phone` + `phoneHref` (phoneHref is +1 then digits, e.g. `+15183300224`)
- Socials: `social.instagram` / `facebook` (full URLs; empty string hides the link)
- Hero photo: `heroImage` — path like `assets/uploads/hero.jpg` (auto-optimized); empty = default
- Launch toggles: `previewMode` (the corner ribbon), `web3formsKey` (real form delivery),
  `analyticsToken` (Cloudflare Web Analytics)
- Pines only: `launchMode`, `launchBanner`, `launchNote` (the "Opening 2026" messaging)

## Rules
- Never edit files in `dist/` (generated; changes get overwritten).
- Dollar amounts are plain numbers (`rate: 395`, no $ sign).
- Keep John's voice: warm, plain, no marketing fluff.
- Finish every edit with `npm test` + publish, then tell John what changed in one sentence.
