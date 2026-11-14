# RestCozy hosting portability and AWS deployment plan

Status: architectural decision (2026-11-14). The current site is a static storefront preview; this document is a design constraint for upcoming backend work, not a claim that AWS infrastructure or secure checkout is already implemented.

## Non-negotiable portability rules
1. Keep **GitHub** as the canonical source of the frontend, backend, infrastructure configuration and database migrations. No business logic may reside only in a Vercel dashboard.
2. Use a **portable web framework**, standard HTTP endpoints and environment variables. Avoid Vercel-specific data APIs, KV, Blob, Edge Config, Cron and proprietary authentication/checkout flows in core business logic.
3. Use **PostgreSQL** for products, collections, categories/subcategories, variants, pricing, discounts, carts, orders and admin roles. Keep versioned migrations in Git. Local development should be possible with Docker Compose.
4. Abstract media storage behind a service interface and store **object keys** in the database, not host-specific absolute URLs. Target Amazon S3 in AWS and allow an S3-compatible provider during preview. Validate mime types, sizes and access; use signed upload URLs and image resizing.
5. Enforce **server-side** permissions: admin accounts via a proven authentication library/provider using secure sessions, CSRF protections as needed, password hashing and role-based authorization. Public users must never call write endpoints successfully.
6. Treat prices as integer **paise** with INR currency, never floating point rupees. Discounts require activation windows, validation and server-side calculation; client display must not be the source of truth.
7. Checkout must calculate totals server-side, prevent tampering, and store idempotent order/payment state. No live payment links, captured cards or untested order placement before a reviewed integration.
8. Secrets exclusively in environment configuration / a secret manager; never commit keys. Include .env.example with safe placeholders.
9. Images and marketing claims for the 21 launch models are provisional pending supplier confirmation. Never present imagined specs as certified facts.
10. Create reproducible CI tests (unit/API/integration), build validation, security checks and backup/restore procedures before switching live sales on.

## Portable target topology

| Concern | Vercel preview / interim | Later AWS |
|---|---|---|
| Frontend | Vercel static/Node hosting | S3 + CloudFront (static), or ECS/Fargate for SSR |
| Backend API | Standard Node HTTP app on deployable host | ECS Fargate + ALB (or App Runner) |
| PostgreSQL | Managed Postgres with migrations | Amazon RDS for PostgreSQL |
| Images | Object storage through provider adapter | Amazon S3 + CloudFront |
| Auth | Standards-based secure backend sessions/provider | Same app + AWS Secrets Manager |
| Jobs | Application-controlled worker / portable queue | EventBridge + SQS / ECS worker |
| Observability | Structured logs + health endpoints | CloudWatch + alarms |
| DNS/TLS | Vercel preview domain | Route 53 / ACM + CloudFront or ALB |
| CI/CD | GitHub Actions | GitHub Actions + OIDC AWS deployment |

## Suggested repository layout (to implement incrementally)

- `apps/storefront/`: customer shopping UI and admin UI.
- `apps/api/`: REST API, auth, catalog, pricing, orders.
- `packages/shared/`: schemas/types/currency helpers.
- `packages/db/`: Postgres schema and migrations.
- `infra/aws/`: infrastructure as code (Terraform or AWS CDK).
- `docker-compose.yml`: local Postgres and supporting services.
- `.github/workflows/`: test and build pipeline; later deploy pipelines.

## AWS migration acceptance checklist

- Production build and test pass without any Vercel-specific runtime.
- Rebuild the API and frontend in containers and run them outside Vercel.
- Migrate database using schema migrations and verified export/import.
- Migrate product photos to S3 while preserving object keys.
- Verify admin access control, catalog, cart, discounts and sandbox checkout against an AWS staging environment.
- Set AWS domain, SSL, backups, least-privilege IAM, monitoring, budgets, WAF and rollback plan.
- After approvals, cut DNS over with a documented rollback; do not turn on payments until verified.

## Development order

1. Preserve and test the existing 21-product storefront preview.
2. Add portable Postgres schema, API contracts, INR paise pricing and API tests.
3. Add secure admin authentication, role controls, product/category/discount editing.
4. Add signed image uploads and object storage adapter.
5. Add durable carts, orders, payment sandbox and end-to-end tests.
6. Implement AWS staging infrastructure and deployment documentation before a production migration.

**Note:** Vercel is a temporary hosting choice, not a data or backend architecture dependency.
