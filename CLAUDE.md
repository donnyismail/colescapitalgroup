# Cole's Capital Group + Pines & Ponies websites

Two production websites in one repo, owned and managed by **John Cole**, who is NOT a developer.
If you are Claude working in this repo: your user is likely John. Talk in plain English, no jargon,
explain what you did in one or two sentences, and never ask him to run terminal commands you can
run yourself.

## The two sites
| Site | Folder | What it is |
|---|---|---|
| Cole's Capital Group | `src/coles/` | Corporate real estate site (colescapitalgroup.com) |
| Pines & Ponies | `src/pines/` | Vacation rental direct-booking site (pinesandponies.com) |

Built with Eleventy (static site generator). All content lives as small Markdown/JSON files, the
design lives in templates. Editing a content file and pushing = the site updates itself.

## Golden rules (do not skip)
1. **Run `npm test` before every push.** It builds both sites and runs unit tests + an SEO/security/
   accessibility audit. If it fails, fix the problem, never delete or weaken a test or the audit to
   make it pass.
2. **Pushing to `main` deploys automatically** (GitHub Actions). There is no separate deploy step.
   After pushing, check the Actions run succeeded and spot-check the live URL.
3. **Never commit secrets** — no API keys, tokens, or passwords in any file. The only "key-like"
   values allowed are the public Web3Forms key and analytics token in `_data/site.json` (those are
   public by design).
4. **Don't weaken security or SEO**: `src/*/headers.njk` (security headers/CSP), the audit
   (`scripts/audit.js`), and the tests (`test/`) protect the sites. Extend them, don't gut them.
5. **Keep changes minimal.** Don't refactor or redesign unless John explicitly asks. Match the
   existing style. The design was approved by John; content changes are routine, design changes
   should be confirmed with him first.
6. Money on the rental site: nightly rates, cleaning fees, min nights all live in the property
   files. The booking math is in `src/pines/assets/booking.js` and is unit-tested; if you change
   pricing logic, update the tests first (they're in `test/booking.test.js`).

## Common jobs (what John usually wants)
| John says | What to do |
|---|---|
| "Add a new rental/cabin" | Use the **add-property** skill. New file in `src/pines/properties/` — only the human fields are needed; titles/SEO auto-generate. |
| "Change a price / min nights / amenities" | Edit that property's file in `src/pines/properties/<slug>.md`. |
| "Add a press article" | New file in `src/coles/press/` (title, source, url, order). |
| "Add/finish a project" | Pipeline (upcoming): `src/coles/pipeline/`. Completed (track record): `src/coles/projects/`. Moving a finished project = delete from pipeline, add to projects with year+category. |
| "Update our numbers" | `src/coles/stats/` (value, label, order). |
| "Change phone/email/socials/hero photo" | `src/<site>/_data/site.json`. |
| "Turn off the preview banner / go live things" | `previewMode`, `web3formsKey`, `analyticsToken`, `heroImage` in `src/<site>/_data/site.json`. |
| "Put this photo on the site" | Save it under `src/<site>/assets/uploads/` and reference the path (e.g. `assets/uploads/dock.jpg`). The build optimizes it automatically — huge phone photos are fine. |
| "Publish it / make it live" | Use the **publish** skill: `npm test` → commit → push → confirm the Actions run + live page. |

## Commands
```
npm ci        # install (first time)
npm test      # build + all tests + audit  (must pass before pushing)
npm run dev   # local preview at localhost:8080
```

## Layout map
- `src/pines/properties/*.md` — one file per rental (name, slug, rate, cleaning, sleeps, beds,
  baths, pets, minNights, order, tagline, cardImage, gallery, amenities, description body).
  SEO fields are optional: canonical/title/description auto-derive (see `properties.11tydata.js`).
- `src/coles/{projects,pipeline,press,portfolio,stats}/*.md` — corporate site content.
- `src/<site>/_data/site.json` — contact info, socials, launch toggles, hero image, form/analytics keys.
- `src/_includes/<site>/` — page templates (design). `src/<site>/assets/styles.css` — design CSS.
- `src/<site>/admin/` — the visual CMS (Sveltia). `config.yml` defines what's editable there.
  **If this repo is renamed or transferred, update `backend.repo` in both admin config.yml files.**
- `scripts/audit.js` — quality gate. `test/booking.test.js` — booking logic tests.
- `JOHN_GUIDE.md` — plain-English owner guide. `SETUP_PRODUCTION.md` — launch/hosting runbook.

## Booking on Pines & Ponies (current state)
"Request to Book" emails John the guest's name/dates/quote (Web3Forms when `web3formsKey` is set,
prefilled email otherwise). Real-time paid booking comes later via OwnerRez — the integration seam
and CSP notes are in `src/pines/headers.njk` and `SETUP_PRODUCTION.md`. Furnished Finder cannot
sync with anything (no API) — that's a Furnished Finder limitation; those dates are managed by hand.
