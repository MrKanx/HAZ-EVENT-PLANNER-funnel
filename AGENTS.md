# Quick Solutions Funnel

## What Matters

- Vue 3 + Vite 7 + TypeScript + SCSS + Pinia + vue-router.
- `src/App.vue` only renders `<RouterView />`; route flow and SEO live in `src/router/index.ts`.
- Use pnpm only. `package.json` has no lint or test scripts.

## Commands

- `pnpm dev` starts Vite.
- `pnpm build` runs `vue-tsc --build` first, then `vite build`.
- `pnpm type-check` runs `vue-tsc --build`.
- `pnpm format` runs `prettier --write src/`.
- `pnpm preview` runs `vite preview`.

## Repo Quirks

- Prettier is fixed to `semi: false`, `singleQuote: true`, `printWidth: 100`.
- `@` resolves to `./src` in `vite.config.ts`.
- SCSS globals come from `src/styles/colorVariables.module.scss` via Vite `additionalData`.
- `public/_redirects` rewrites all routes to `index.html` for SPA hosting.
- The dev server allows the ngrok host `38828430451a.ngrok-free.app`.
- Font Awesome is loaded from the CDN in `index.html`; use `<i class="fa-solid fa-...">`, not emojis.
- Wistia uses media id `b6nlwwhjb9`.


## Funnel Rules

- Routes are `/`, `/ver-video`, `/agendar`, `/cita-confirmada`, `/sin-espacio`, `/politicas-privacidad`, and `/aviso-legal`.
- `/registro-vsl-tr` aliases `/`.
- Router guards use localStorage TTLs: `os_booked_at` = 3 days, `os_disq_at` = 48 hours.
- Fresh `os_booked_at` forces navigation to `/cita-confirmada`.
- Fresh `os_disq_at` blocks `/agendar` and `/cita-confirmada` to `/sin-espacio`.
- Legal routes stay public.
- `router.afterEach` updates title, description, canonical, OG, and Twitter metadata.

## State and Integrations

- `os_contact` stores the captured lead payload.
- `alu_page_entry` and `os_complete_fired` are sessionStorage markers.
- Booking confirmation arrives via `postMessage(['msgsndr-booking-complete', ...])`.
- Booking iframe height uses `postMessage({ type: 'booking-app', height })`.
- `src/utils/ghl.ts` posts to `VITE_WEBHOOK_REGISTRO` when set, otherwise it uses the hardcoded LeadConnector webhook.


## Content Notes

- Keep Quick Solutions / Jefferson Bazán brand copy intact.
- `src/styles/colorVariables.module.scss` contains many legacy aliases; preserve them unless you are deliberately cleaning up a consuming file.
