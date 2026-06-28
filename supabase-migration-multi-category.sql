UPDATE products SET category = to_jsonb(ARRAY[category::text]);
ALTER TABLE products ALTER COLUMN category DROP DEFAULT;
ALTER TABLE products ALTER COLUMN category TYPE jsonb USING category::jsonb;
ALTER TABLE products ALTER COLUMN category SET DEFAULT '[]'::jsonb;
