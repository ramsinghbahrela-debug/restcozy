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
