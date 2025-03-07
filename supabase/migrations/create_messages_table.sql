create table public.messages (
  id uuid default gen_random_uuid() primary key,
  chat_id bigint not null,
  sender_id uuid references auth.users(id),
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_deleted boolean default false,
  media_url text,
  media_type text,
  status text default 'sent'
);

-- Enable RLS
alter table public.messages enable row level security;

-- Create policies
create policy "Users can view messages in their chats" on public.messages
  for select using (true);

create policy "Users can insert messages" on public.messages
  for insert with check (auth.uid() = sender_id);

create policy "Users can update their own messages" on public.messages
  for update using (auth.uid() = sender_id);

-- Create function to update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger handle_updated_at
  before update on public.messages
  for each row
  execute procedure public.handle_updated_at(); 