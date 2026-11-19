# RestCozy expandable catalogue and image rollout

## Approved operating model
The website launches with **21 mattress product concepts** but must support **unlimited new categories and products** without source-code editing. Mattress, furniture, chairs, bedsheets, pillows and later collections all live in one shared taxonomy. The existing `categories.parent_id` relation supports nested subcategories; `category_attributes` specifies category-specific admin fields.

### Initial categories and optional subcategories (not yet published)
- Mattresses: Foam, Orthopedic, Memory Foam, Latex, Hybrid, Cooling, Signature
- Furniture: Beds, Chairs, Sofas, Tables, Storage
- Bedding: Bedsheets, Comforters, Mattress Protectors
- Pillows & Cushions: Sleeping Pillows, Support Pillows, Decorative Cushions
All are editable, renameable and reorderable. Do not show empty category pages to customers.

## Product editor
Category → subcategory → name/SKU → description → specifications (foam layers, densities, fabric, benefits, firmness, size & thickness for mattresses; other fields for future categories) → variants with size-specific MRP, selling price, discount and stock → photos → save draft → review → publish. Multiple staff accounts have granular role permissions; published listings update the storefront through the backend. Current site is static and not connected to this flow yet.

## Photography roadmap
Create **one distinctive, camera-realistic concept product photo for each of the 21 initial mattress models**. Maintain consistent photographic art direction from the approved Warm Ivory & Sage concept, but differentiate seams, covers, piping, foam cutaway and background accessories. Use professional, natural-looking home photography, daylight, correct mattress geometry and no invented safety badges or medically guaranteed outcomes.

**AI image disclosure:** Concept images are AI-generated visualizations, *not photographs of the manufactured products*. Until the supplier produces matching items, label them as illustrative; avoid implying that fabric, quilting or thickness in the image is exact.

Recommended variants per product: hero image, clean mattress view, close-up of cover, layer-cutaway only when supported by supplier data. Photos belong to the product and can be replaced by admin at any time.

## Catalogue release safety
21 product models may be shown as explicitly labelled concepts during preview. Do not enable checkout until physical samples, manufacturer BOM, exact densities, cover fabrics, dimension charts, variant prices in INR, inventory, warranty and shipping rules are approved. Keep backend prices in paise; customers see rupee formatting.

## Deployment
Store image object keys, not hardcoded vendor URLs; develop object-storage adapter compatible with AWS S3. Avoid tying images/admin backend to Vercel-specific services. GitHub is canonical; Vercel preview now, AWS later.

## Imagery progress
2026-11-17: Rollout specification created; no new supplier-accurate product photos have been uploaded or connected yet. Image generation and upload still to be completed.

## 2026-11-17 evening milestone
- Warm Ivory & Sage storefront styling implemented in index.html; product visuals still placeholders.
- All 21 concept models now expose Single, Double, Queen, King illustrative size-dependent prices and a variant-aware preview bag. Price multipliers are not manufacturer quotations or live offers.
- Storefront regression tests added. Production checkout remains disabled.
- New photorealistic mattress assets uploaded this session: **0/21**. Do not mark an image complete until a generated file is stored and linked to its specific product.
- Next: add a labelled AI concept photo, then continue image-by-image; connect real category/product/variant admin API to PostgreSQL and secure sessions.

## 2026-11-18 milestone
- Generated **concept image 01 of 21**: photorealistic Warm Ivory & Sage bedroom with ivory quilted mattress and sage piping. Saved as a local artifact `restcozy_sage_mattress_concept_01.webp`. This is an **AI-generated illustration, not a photograph of a manufactured RestCozy mattress**.
- Generated concept count **1/21**. Image uploaded and linked to the storefront: **0/21**. Existing static storefront unchanged.
- Added `apps/api/publishing.mjs` with fail-closed draft/review/publish role gates and manufacturer, specification, variant, shipping and image verification requirements. Automated tests added. No real admin authentication, database persistence or API deployment is claimed.
- Next: upload image 01 to approved storage and attach to the correct product with an illustrative label; implement real session verification and database-backed publication transactions.

## 2026-11-19 milestone
- Generated **concept image 02 of 21**: camera-realistic cream ribbed mattress with muted gold piping on a low oak bed, sage cushions and throw, in a naturally lit bedroom. Local artifact: `a_bright_sunlit_modern_bedroom_product_shot_a_cl.png`. This is AI-generated, not a manufacturer photograph. Generated images total **2/21**; **0/21** images integrated into storefront because a verified image upload/storage path has not yet been configured.
- Closed a publication bypass: `apps/api/catalog.mjs` now rejects direct `active`, `review` and `published` writes even from privileged roles; publishing must occur through a separate verified workflow.
- Added `apps/api/public-catalog.mjs` to project only approved, published products with verified variants and approved images; AI concept image records are explicitly marked `illustrative`.
- Added automated tests for the publication bypass and public catalogue privacy/verification gates.
- These are **backend library functions only**, not a deployed API. No database migrations have been applied, no production admin sessions configured and no live checkout enabled.
- Next: implement verified session provider and transactional PostgreSQL repository, set up S3-compatible image storage and upload both existing concept files with disclosure, then connect public catalogue API to storefront.
