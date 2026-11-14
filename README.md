# RestCozy — pre-launch storefront

Live preview: https://restcozy-ramsinghbahrela-8686.vercel.app

## Current milestone (14 Nov 2026)
- Responsive beige, cream, brown and gold storefront.
- 21 **provisional** product slots in seven collections; collection filters, search and INR sorting.
- Material concept tags, indicative INR prices and 10% illustrative discounts.
- Browser-local shopping bag with quantity adjustment and total.
- Checkout deliberately disabled; no payment collection or orders.
- Accessible labels, mobile layout, Escape-to-close cart.

## Important: not launch-ready
Product names, descriptions, prices, material claims, mattress photos, warranties and dimensions are **not verified against the actual 21-item supplier catalogue**. Replace before public sales. The logo is a temporary text treatment, not the supplied original artwork. The bag is a local browser preview, not a backend order.

No database, secure admin authentication, product-image upload, category CRUD, payment provider, inventory or server-side checkout has been implemented. Do not treat localStorage as secure admin storage.

## Deployment
GitHub repository: https://github.com/ramsinghbahrela-debug/restcozy
Vercel project: restcozy (team ramsinghbahrela-8686). Initial deployment was uploaded from source files because Vercel's GitHub integration is **not installed**. GitHub pushes do **not** currently trigger automatic deployment. Install/authorize the Vercel GitHub integration and link this repository to enable it.

## Next milestones
1. Import the verified 21-product catalogue and supplier-approved specs, photos and price list.
2. Add Postgres product/category/subcategory schema and server APIs.
3. Add secure administrator login with server-side role authorization, image storage and product/discount CRUD.
4. Implement size/variant selection, inventory, shipping zones, tax, and order management.
5. Add payment integration in test mode, verify webhooks, test checkout end-to-end, then separately approve production activation.

## Local testing
Open `index.html` in a modern browser. There is no build step. Check filtering, price sorting, bag persistence and mobile layout. Automated browser tests are not yet configured.
