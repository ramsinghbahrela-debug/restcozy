-- RestCozy migration 002: open-ended retail categories and size/colour variants.
-- Apply once after 001_initial.sql in a transaction. Requires PostgreSQL.
-- NO migration has been run against a production DB yet.
CREATE TABLE category_attributes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  field_key text NOT NULL CHECK(field_key ~ '^[a-z][a-z0-9_]{0,63}$'),
  label text NOT NULL CHECK(length(trim(label)) BETWEEN 1 AND 100),
  field_type text NOT NULL CHECK(field_type IN ('text','number','boolean','select','multiselect')),
  required boolean NOT NULL DEFAULT false,
  options jsonb NOT NULL DEFAULT '[]'::jsonb CHECK(jsonb_typeof(options) = 'array'),
  sort_order integer NOT NULL DEFAULT 0,
  UNIQUE(category_id,field_key)
);
-- A configurable field is defined per category; values are stored in products.specifications.
CREATE TABLE product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku text NOT NULL UNIQUE,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb CHECK(jsonb_typeof(attributes) = 'object'),
  -- For mattresses: e.g. {"size":"queen","width_cm":152,"length_cm":198,"thickness_cm":15}
  -- For pillows: e.g. {"size":"standard","fill":"fiber"}; furniture can use colour/material.
  mrp_paise bigint NOT NULL CHECK(mrp_paise >= 0),
  selling_price_paise bigint NOT NULL CHECK(selling_price_paise >= 0 AND selling_price_paise <= mrp_paise),
  stock_quantity integer NOT NULL DEFAULT 0 CHECK(stock_quantity >= 0),
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(product_id,id)
);
CREATE INDEX product_variants_product_id_idx ON product_variants(product_id);
CREATE INDEX product_variants_live_idx ON product_variants(product_id,active);
-- Existing carts currently refer to product only; introducing variants here must
-- be followed by a cart/order migration before any real customer checkout.
ALTER TABLE product_images
  ADD COLUMN IF NOT EXISTS image_kind text NOT NULL DEFAULT 'product'
    CHECK (image_kind IN ('product','lifestyle','fabric','cutaway','packaging')),
  ADD COLUMN IF NOT EXISTS source_kind text NOT NULL DEFAULT 'unverified'
    CHECK (source_kind IN ('manufacturer','original_photo','ai_concept','unverified')),
  ADD COLUMN IF NOT EXISTS approved_for_publication boolean NOT NULL DEFAULT false;
CREATE TABLE category_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  object_key text NOT NULL UNIQUE,
  alt_text text NOT NULL DEFAULT '',
  source_kind text NOT NULL DEFAULT 'unverified'
    CHECK (source_kind IN ('manufacturer','original_photo','ai_concept','unverified')),
  approved_for_publication boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0
);
-- Admin rights must be checked server-side. Draft/product approval is separate.
CREATE TABLE content_publication_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  actor_user_id uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  action text NOT NULL CHECK(action IN ('draft_saved','submitted_for_review','approved','published','unpublished')),
  created_at timestamptz NOT NULL DEFAULT now()
);
-- Stock, variant prices and claims must be verified before publication.
