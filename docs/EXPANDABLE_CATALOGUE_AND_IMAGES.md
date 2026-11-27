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

## 2026-11-23 photography milestone
- Generated concept 03: storefront product ID `3`, collection `Comfort`, model `Comfort Premium` (RestCozy). Ivory scallop-pattern quilted top, sage diamond-quilted sides, taupe piping, oak bed and natural daylight. AI-generated illustration, not a verified manufactured product photograph.
- Session artifact: `a_bright_tidy_bedroom_interior_scene_photographed.png` (1536 × 1024). Intended portable asset name: `comfort-premium-03.webp`; this is a proposed name, not an uploaded path. No persistent repository asset verified; local image bytes cannot be passed directly to the connected GitHub write action in this run.
- Generated: **3/21**; uploaded: **0/21** verified; storefront integrated: **0/21** verified. Website/admin task: consume the image only after actual bytes are available in persistent storage and label it illustrative. Next concept: product ID 4, Orthopedic Classic. No storefront or admin code changed.

## 2026-11-24 photography milestone
- Generated concept 04: storefront product ID `4`, collection `Orthopedic`, model `Orthopedic Classic` (RestCozy). Broad rectangular ivory quilting, olive-grey woven-look side panel, double cream piping and teak platform bed in natural daylight. AI-generated illustration, not a verified manufactured product photograph; no material, medical, certification or warranty claims.
- Session artifact: `a_clean_modern_bedroom_interior_scene_shot_in_nat.png` (1536 × 1024). Intended portable asset name: `orthopedic-classic-04.webp` (proposed only). GitHub supports base64 blob creation, but no supported bridge from the generated session file bytes to the connector invocation is available in this run. No persistent asset path verified.
- Generated: **4/21**; uploaded: **0/21** verified; storefront integrated: **0/21** verified. Website/admin handoff: product ID 4, attach only after actual asset storage is verified and retain illustrative disclosure. Next concept: ID 5, Orthopedic Support. No website/admin code or deployment changed.


## 2026-11-25 photography milestone
- Generated concept 05: storefront product ID `5`, collection `Orthopedic`, model `Orthopedic Support`. Ivory angled rib quilting, taupe woven-look sides, sage horizontal accent band and cream piping; natural daylight in a warm neutral bedroom. AI-generated illustration only, not a verified manufactured product photograph. No verified material, certification or warranty claims.
- Session artifact: `a_clean_well_lit_bedroom_interior_scene_viewed_at.png` (1536 × 1024). Proposed portable name: `orthopedic-support-05.webp`. Actual image bytes are not available to the GitHub connector through a supported direct file bridge in this run; no stable uploaded path verified.
- Generated: **5/21**; uploaded: **0/21** verified; storefront integrated: **0/21** verified. Website/admin handoff: product ID 5, integrate only after verifying persistent asset bytes and retain illustrative disclosure. Next: product ID 6 (verify exact catalogue name before generation). No storefront/admin code or deployment changed.


## 2026-11-26 photography milestone
- Generated concept 06: storefront product ID `6`, collection `Orthopedic`, model `Orthopedic Advanced`. Ivory honeycomb quilting, muted olive-grey vertical channel-stitched side panels, beige piping, cane headboard and natural daylight. AI-generated illustrative concept, not a verified manufactured product photograph; no verified material, certification, medical or warranty claims.
- Session artifact: `a_clean_well_lit_bedroom_product_photo_scene_a_m.png` (1536 × 1024). Proposed portable asset name: `orthopedic-advanced-06.webp` (not an uploaded path). GitHub blob creation requires base64 bytes; the image-generation session file is not directly readable by the GitHub connector, and no supported direct binary bridge was established. No persistent asset path verified.
- Generated: **6/21**; uploaded: **0/21** verified; storefront integrated: **0/21** verified. Website/admin handoff: product ID 6, attach only after persistent asset bytes are verified and retain illustrative disclosure. Next concept: ID 7, Memory Foam Cloud. No storefront/admin code or deployment changed.


## 2026-11-27 photography milestone
- Generated concept 07: product ID 7, Memory Foam Cloud. Ivory wave quilting, sage upper trim and beige channel-stitched sides in a naturally lit Indian home bedroom. AI-generated illustration, not a verified manufactured product photograph; no material, medical, certification or warranty claims.
- Session artifact: `a_bright_warm_bedroom_interior_with_a_modern_natu.png` (1536 × 1024). Proposed portable asset name: `memory-foam-cloud-07.webp`. No supported direct bridge from local image bytes to GitHub connector has been established; no persistent project asset verified.
- Generated: **7/21**; uploaded: **0/21** verified; integrated: **0/21** verified. Website/admin handoff: ID 7, attach only once persistent bytes are verified, retaining illustrative disclosure. Next: product ID 8, verify model name before generation. No storefront/admin code or deployment changed.
