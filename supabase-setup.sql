-- 1. Tables
create table users (
  id uuid primary key,
  username text unique not null,
  is_admin boolean default false,
  created_at timestamptz default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  price integer default 0,
  stock_quantity integer default 0,
  image_urls jsonb default '[]',
  category text default '',
  created_at timestamptz default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  username text not null,
  items jsonb default '[]',
  total integer default 0,
  phone text default '',
  postal_code text default '',
  address text default '',
  receipt_image text default '',
  status text default 'pending',
  admin_message text default '',
  is_admin_deleted boolean default false,
  created_at timestamptz default now()
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  product_id uuid,
  user_id uuid,
  username text not null,
  text text not null,
  is_pinned boolean default false,
  is_admin_deleted boolean default false,
  created_at timestamptz default now()
);

create table banners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text default '',
  description text default '',
  is_active boolean default true,
  created_at timestamptz default now()
);

create table support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  username text not null,
  subject text not null,
  is_admin_deleted boolean default false,
  created_at timestamptz default now()
);

create table support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid,
  sender text not null,
  text text not null,
  created_at timestamptz default now()
);

-- 2. Row Level Security (allow all for simplicity)
alter table users enable row level security;
alter table products enable row level security;
alter table categories enable row level security;
alter table orders enable row level security;
alter table comments enable row level security;
alter table banners enable row level security;
alter table support_tickets enable row level security;
alter table support_messages enable row level security;

create policy "Allow all" on users for all using (true) with check (true);
create policy "Allow all" on products for all using (true) with check (true);
create policy "Allow all" on categories for all using (true) with check (true);
create policy "Allow all" on orders for all using (true) with check (true);
create policy "Allow all" on comments for all using (true) with check (true);
create policy "Allow all" on banners for all using (true) with check (true);
create policy "Allow all" on support_tickets for all using (true) with check (true);
create policy "Allow all" on support_messages for all using (true) with check (true);

-- 3. Seed data
insert into categories (name) values
  ('ساق بلند'),
  ('اسپرت'),
  ('فانتزی'),
  ('ساق کوتاه'),
  ('زمستانی'),
  ('مجلسی');

insert into products (name, description, price, stock_quantity, image_urls, category) values
  ('جوراب ساق بلند کلاسیک', 'جوراب ساق بلند کلاسیک با کیفیت بالا', 85000, 15, '["https://picsum.photos/seed/sock1/400/400"]', 'ساق بلند'),
  ('جوراب اسپرت ورزشی', 'جوراب اسپرت ورزشی با فناوری جذب رطوبت', 65000, 20, '["https://picsum.photos/seed/sock2/400/400"]', 'اسپرت'),
  ('جوراب طرح دار فانتزی', 'جوراب فانتزی با طرح‌های خاص', 45000, 10, '["https://picsum.photos/seed/sock3/400/400"]', 'فانتزی'),
  ('جوراب ساق کوتاه روزمره', 'جوراب ساق کوتاه سبک و راحت', 35000, 25, '["https://picsum.photos/seed/sock4/400/400"]', 'ساق کوتاه'),
  ('جوراب زمستانی پشمی', 'جوراب زمستانی پشمی فوق‌العاده گرم', 95000, 8, '["https://picsum.photos/seed/sock5/400/400"]', 'زمستانی'),
  ('جوراب مجلسی ابریشمی', 'جوراب مجلسی ابریشمی با ظاهری لوکس', 120000, 5, '["https://picsum.photos/seed/sock6/400/400"]', 'مجلسی');
