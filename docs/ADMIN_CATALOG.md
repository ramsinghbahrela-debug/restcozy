# Admin catalog service milestone — 16 November 2026

The module `apps/api/catalog.mjs` provides **portable, fail-closed business logic** for administrative category, product, discount, and image-metadata writes. Unit tests: `node --test apps/api/catalog.test.mjs`. No runtime dependencies are required.

- Admin calls require a **server-verified** principal with an allowed role and non-disabled account. Client-provided `verified` fields must NEVER be passed directly as principals; only a trusted session verifier can construct them.
- Categories support a hierarchy and reject missing parents and cycles. The eventual PostgreSQL adapter must also lock/validate parent chains in a transaction to prevent races.
- Products use integer INR paise and default to draft; material specifications remain proposed until supplier confirmation.
- Discounts use basis points, explicit enabled state and validated time windows.
- Image metadata accepts JPEG/PNG/WebP/AVIF, limits size to 8 MiB and requires a product-scoped object key. **It does not upload or scan image bytes.** Implement signed uploads and verify the actual stored object before recording metadata.
- Persistence is injected via a repository interface; an actual PostgreSQL adapter, session authentication, API routing, uploads, and production deployment are **not implemented** here.
- No checkout/payment capability has been enabled. Existing Vercel storefront preview remains unchanged.

Next: implement a parameterized PostgreSQL repository, transactional category edits, verified auth provider/session middleware, and secure upload adapter; then deploy a staging API with a live database and integration tests.
