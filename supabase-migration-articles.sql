-- Articles and Tutorials table
create table articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text default '',
  description text default '',
  video_url text default '',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Enable RLS
alter table articles enable row level security;

create policy "Allow all" on articles for all using (true) with check (true);
