-- Predefined sizes table (like categories)
create table sizes (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz default now()
);

-- Product-size variants with individual stock
create table product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  size_name text not null,
  stock_quantity integer default 0,
  created_at timestamptz default now(),
  unique(product_id, size_name)
);

-- RLS
alter table sizes enable row level security;
alter table product_sizes enable row level security;
create policy "Allow all" on sizes for all using (true) with check (true);
create policy "Allow all" on product_sizes for all using (true) with check (true);

-- Seed common sock sizes
insert into sizes (name) values
  ('36-39'),
  ('40-43'),
  ('44-47');