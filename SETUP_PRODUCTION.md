# Production setup (dev notes — Donny)

The repo builds two static sites with Eleventy into `dist/` (`dist/pines`, `dist/coles`) and
auto-deploys to GitHub Pages via `.github/workflows/deploy.yml`. That's the live preview today.

For the real client launch on the two domains, do this:

## 1. Hosting: Cloudflare Pages (one project per domain)
Each site is its own Cloudflare Pages project so `_headers`/CSP apply and each gets its own domain.

- **Build command:** `npm run build`
- **Build output directory:** `dist/pines` (for the Pines project) or `dist/coles` (for the Cole's project)
- **Root directory:** repo root
- Add the custom domain in the project (pinesandponies.com / colescapitalgroup.com).
- `_headers` already lives at `dist/<site>/_headers` and is picked up automatically.

Cole's domain (colescapitalgroup.com) is at GoDaddy with Microsoft email — only repoint the
website DNS (CNAME/A) to Cloudflare Pages; leave the MX/email records alone. John registers
pinesandponies.com (point it at Cloudflare too).

## 2. CMS auth: Decap + GitHub OAuth
The admin (`/admin`) uses GitHub as its backend. GitHub OAuth needs a small auth endpoint:

- Easiest: deploy a tiny **Cloudflare Worker OAuth proxy** (e.g. `sterlingwes/decap-proxy` or
  `i40west/netlify-cms-oauth` style worker). Create a GitHub OAuth App:
  - Homepage URL: the site domain
  - Authorization callback URL: the worker's `/callback`
- Put the worker URL in each `admin/config.yml` as `backend.base_url` (+ `auth_endpoint`).
- Give John a GitHub account with write access to the repo (or use a dedicated editor account).
- Local editing without OAuth: `npx decap-server` then open `/admin` (config has `local_backend: true`).

## 3. Images
`eleventy-img` shortcode (`{% image %}`) is wired for local uploads (AVIF/WebP/responsive).
Card/gallery images currently use remote placeholders; when John uploads real photos via the CMS
they land in `assets/uploads` and can be switched to the shortcode for full optimization.

## 4. OwnerRez (Pines bookings)
When properties go live: create OwnerRez account, add properties, connect Airbnb/Vrbo, generate the
Book Now widget, and replace the preview booking card in `property.njk` with the embed. Uncomment the
OwnerRez sources in `dist/pines/_headers` CSP (already documented inline).
