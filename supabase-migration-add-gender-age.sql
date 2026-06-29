-- Gender & age section (like categories/sizes)
create table gender_ages (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz default now()
);

alter table gender_ages enable row level security;
create policy "Allow all" on gender_ages for all using (true) with check (true);

-- Seed default values
insert into gender_ages (name) values
  ('مرد'),
  ('زن'),
  ('پسر'),
  ('دختر');
