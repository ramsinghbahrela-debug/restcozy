# RestCozy product publishing and design requirements

Updated 2026-11-17. Product management features described here are planned unless independently marked implemented.

## Brand direction
- Brand name: **RestCozy** (single word)
- Single official tagline: **Comfort for Every Corner**
- Avoid previous slogans such as “Premium Sleep Solutions,” “Thoughtfully designed comfort India,” and generic AI-like marketing language.
- Visual style: warm white/cream surfaces, soft beige, muted gold accents, friendly typographic hierarchy, natural language, generous whitespace, polished but lived-in retail character. Avoid overly harsh, dark or saturated backgrounds.
- Use the approved sleeping-person RestCozy logo artwork once the source image asset is available in the repo. Do not invent that the current text treatment is the approved logo.

## Admin content model and workflow
1. **Category templates**: admins can create, rename, reorder, hide and delete (when safe) categories; each may have subcategories. Use stable IDs and slugs with collision checks.
2. **Product templates**: product form includes title, SKU, category, subcategory, model name, short/long description, cover fabric, foam layer names/densities/thicknesses, comfort rating, dimensions, thickness, weight, warranty, care, certifications (only verified), suitability, stock, images and SEO details. Support configurable fields per category.
3. **Sizes & variants**: each mattress can have multiple sizes (Single, Double, Queen, King, and custom measurements) and thickness variants, each with price, SKU, inventory and availability. Validate mm/cm/in unit handling.
4. **Pricing & promotions**: INR currency, stored as integer paise; MRP, selling price, optional discount and start/end windows; server-side price calculation and sensible validation.
5. **Media**: multiple photos per product including main, lifestyle, fabric close-up and construction/cutaway, with alt text, sort order, validated file uploads and a portable object storage adapter (later AWS S3).
6. **Publishing**: distinct Draft, Review, Published, Archived states. Only authorized admins can publish. Public API returns **Published** products only. Saving a draft must never make it live. Once published, approved edits should update the storefront through the same database and cache invalidation/revalidation, not manual code changes.
7. **Security**: authenticated admin session, role-based permissions on server, audit trail, safe content sanitization, upload restrictions and CSRF defenses as required. Never expose draft content or database credentials to customer browsers.
8. **Launch seed**: import existing 21 provisional mattresses as drafts until manufacturer specifications, photos, sizes, stock and price are confirmed.

## Implementation milestones
- Next: database-backed admin API and authenticated session, category/product/variant schema, draft/publish workflow.
- Then: admin UI and form templates, image uploads, discount controls and a storefront wired to the public published-product endpoint.
- Then: test responsive styling, release review, order/cart flows and sandbox payments only.

## Portability
Keep product and catalog data in PostgreSQL, media in S3-compatible storage and APIs portable to a standard Node hosting environment. See `docs/AWS_PORTABILITY.md`.
