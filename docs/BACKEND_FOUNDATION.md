# Backend foundation — 15 November 2026

This milestone adds a **portable PostgreSQL schema** and **tested pure pricing/quotation functions**; it does not yet deploy a backend or admin interface.

- `packages/db/001_initial.sql`: category hierarchy, product metadata/specifications, images as storage object keys, percentage discounts, admin role mapping, carts, draft orders, order line snapshots.
- `packages/shared/pricing.mjs`: integer paise calculations, time-bounded discounts in basis points, strict quantity checks, server-side cart quoting that ignores client-supplied prices.
- `packages/shared/pricing.test.mjs`: Node built-in tests, run with `npm test`.
- `.github/workflows/ci.yml`: GitHub Actions test workflow.
- No runtime dependencies required for the shared pricing module.

## Security and correctness constraints

The schema is **not** a deployed or connected database. Do not expose PostgreSQL directly to browsers. Admin authentication must be implemented and tested in a server-side API before editing or upload routes are enabled. Signed object uploads must check authorization, file type and size. The current preview's 21 products are provisional and not seeded here as verified supplier facts.

Before accepting orders: implement verified size/price variants, stock, taxes, shipping, customer addresses, consent, payment sandbox with signed webhook verification and idempotency. Checkout remains disabled until then.

## Local verification

Run `npm test` using Node 20 or newer. PostgreSQL migration execution and rollback are pending a database connection and migration runner. Use AWS-compatible Postgres and object storage abstractions for future deployment.
