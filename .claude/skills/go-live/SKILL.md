---
name: go-live
description: Use for launch tasks — putting the sites on the real domains, turning off preview mode, enabling real form delivery and analytics, connecting OwnerRez booking, or anything about domains/DNS/email records. The launch-day checklist.
---

# Go live / launch checklist

Full runbook lives in `SETUP_PRODUCTION.md` (hosting, DNS, email records) — read it before domain
or DNS work. This skill is the ordered checklist.

## One-time launch steps
1. **Hosting**: two Cloudflare Pages projects in JOHN's Cloudflare account, both from this repo.
   Build command `npm run build`; output dir `dist/pines` (pinesandponies.com project) and
   `dist/coles` (colescapitalgroup.com project). `_headers` (security/CSP) applies automatically.
2. **Domains**: pinesandponies.com registered at Cloudflare (John's account). colescapitalgroup.com:
   replicate ALL Microsoft email records BEFORE changing nameservers (the full record set is
   documented in SETUP_PRODUCTION.md §follow DNS_MIGRATION notes) — email must keep working through
   the whole move. Site records point at the Pages projects.
3. **Real form delivery**: create a free Web3Forms access key for the owner's email → paste into
   `web3formsKey` in `src/<site>/_data/site.json` (or Site Settings in /admin). Until then the
   Request-to-Book button falls back to a prefilled email (still works).
4. **Analytics**: Cloudflare Web Analytics → copy beacon token → `analyticsToken` in site.json.
5. **Turn off the preview ribbon**: `previewMode: false` in both site.json files.
6. **CMS login**: /admin uses GitHub. Easiest: a fine-grained GitHub personal access token scoped to
   this repo (contents read/write) — John pastes it into Sveltia's "Sign In Using Access Token".
   If the repo was renamed/transferred, update `backend.repo` in BOTH `src/*/admin/config.yml`.
7. Publish (the **publish** skill) and verify both live domains, including `/admin`.

## Later: real-time paid bookings (OwnerRez)
When John's properties are ready to take real reservations:
- OwnerRez account → add properties → connect Airbnb + Vrbo channel manager (two-way sync).
- Replace the booking card in `src/_includes/pines/property.njk` with the OwnerRez widget embed.
- Extend the CSP in `src/pines/headers.njk` with https://secure.ownerreservations.com
  (script/frame/connect/img) — the commented block is already there.
- Furnished Finder never syncs (no API/iCal export) — John blocks those dates by hand. Not a bug.

## Cautions
- Email records are sacred: colescapitalgroup.com runs Microsoft 365 email. Any DNS change must
  preserve the MX/SPF/autodiscover/SRV records exactly. When in doubt, change nothing and check
  SETUP_PRODUCTION.md.
- Never point DNS at anything before the Pages project is built and serving.
