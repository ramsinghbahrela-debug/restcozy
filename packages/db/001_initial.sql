-- RestCozy PostgreSQL schema v1. Apply through a migration runner in a transaction.
-- Database records are the future source of truth; the current static preview is NOT connected.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 100),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  parent_id uuid REFERENCES categories(id) ON DELETE RESTRICT,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT no_self_parent CHECK (parent_id IS DISTINCT FROM id)
);
-- The admin service must additionally reject deeper category cycles.
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text NOT NULL UNIQUE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  price_paise bigint NOT NULL CHECK (price_paise >= 0),
  currency char(3) NOT NULL DEFAULT 'INR' CHECK (currency = 'INR'),
  specifications jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX products_category_idx ON products(category_id);
CREATE INDEX products_status_idx ON products(status);
CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  object_key text NOT NULL UNIQUE,
  alt_text text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE discounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  percent_bps integer NOT NULL CHECK (percent_bps BETWEEN 0 AND 10000),
  starts_at timestamptz,
  ends_at timestamptz,
  enabled boolean NOT NULL DEFAULT false,
  CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at > starts_at)
);
CREATE INDEX discounts_product_idx ON discounts(product_id);
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('owner','admin','catalog_editor')),
  auth_subject text NOT NULL UNIQUE,
  disabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- Do not expose this table directly to browsers; auth_subject must be verified server-side.
CREATE TABLE carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE cart_items (
  cart_id uuid NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 20),
  PRIMARY KEY(cart_id, product_id)
);
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number bigint GENERATED ALWAYS AS IDENTITY UNIQUE,
  currency char(3) NOT NULL DEFAULT 'INR' CHECK (currency = 'INR'),
  subtotal_paise bigint NOT NULL CHECK (subtotal_paise >= 0),
  shipping_paise bigint NOT NULL DEFAULT 0 CHECK (shipping_paise >= 0),
  tax_paise bigint NOT NULL DEFAULT 0 CHECK (tax_paise >= 0),
  total_paise bigint NOT NULL CHECK (total_paise >= 0),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending_payment','paid','cancelled','refunded')),
  idempotency_key text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  sku_snapshot text NOT NULL,
  name_snapshot text NOT NULL,
  unit_paise bigint NOT NULL CHECK (unit_paise >= 0),
  quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 20)
);
-- Payment capture and order submission are deliberately not implemented.
