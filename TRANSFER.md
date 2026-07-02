# Handing the repo to John (ownership transfer checklist)

Goal: John's GitHub account owns this repo outright. He edits via /admin for daily stuff and via
Claude (claude.ai/code connected to his GitHub) for anything bigger. Donny stays a collaborator.

## Order of operations
1. **John creates a GitHub account** (his business email). Send Donny the username.
2. **Rename the repo first** (Settings → General → Rename): `cole-sites` is a good permanent name.
   (Do it at transfer time, not before — renaming changes the GitHub Pages preview URL.)
3. **Transfer** (Settings → General → Danger Zone → Transfer ownership) to John's account.
   John accepts the transfer email.
4. **John adds Donny back as a collaborator** (Settings → Collaborators → add `donnyismail`, Write).
5. **Re-enable Pages on the transferred repo**: Settings → Pages → Source: GitHub Actions.
   Re-run the deploy workflow once (Actions → Build & Deploy → Run workflow).
6. **Update the CMS backend** in BOTH `src/pines/admin/config.yml` and `src/coles/admin/config.yml`:
   `repo: <john-username>/cole-sites`. Commit + push.
7. **CMS login for John**: in John's GitHub → Settings → Developer settings → Fine-grained tokens →
   new token scoped to ONLY this repo, Contents: Read and write. John pastes it into /admin →
   "Sign In Using Access Token". (Token expiry max is 1 year — calendar a renewal.)
8. **Cloudflare Pages** (at launch): connect the Pages projects to the repo under John's GitHub via
   the Cloudflare GitHub App — done from John's Cloudflare account (see SETUP_PRODUCTION.md).
9. **Claude for John**: John signs into claude.ai (or Claude Code) and connects his GitHub repo.
   The repo's CLAUDE.md + .claude/skills make any Claude session competent here: it knows the
   architecture, the quality gates, and the plain-English workflows (add-property, update-content,
   publish, go-live).

## What breaks if steps are skipped
- Skip 5 → pushes stop deploying (Pages source resets on transfer).
- Skip 6 → /admin can't load or save content (points at the old repo path).
- Skip 7 → John can't log into /admin at all.

## After transfer, ownership picture
- Code + content: John's GitHub. Domains + DNS + hosting: John's Cloudflare. Email: John's
  Microsoft 365 (billed via GoDaddy, unchanged). Booking (later): John's OwnerRez.
- Donny: collaborator access only. John can remove anyone, anytime. That's the point.
