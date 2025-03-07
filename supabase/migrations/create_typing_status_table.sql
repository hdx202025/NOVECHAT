create table public.typing_status (
  id uuid default gen_random_uuid() primary key,
  chat_id bigint not null,
  user_id uuid references auth.users(id),
  is_typing boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(chat_id, user_id)
);

-- Enable RLS
alter table public.typing_status enable row level security;

-- Create policies
create policy "Users can view typing status in their chats" on public.typing_status
  for select using (true);

create policy "Users can update their own typing status" on public.typing_status
  for all using (auth.uid() = user_id);

-- Create function to update updated_at
create or replace function public.handle_typing_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger handle_typing_updated_at
  before update on public.typing_status
  for each row
  execute procedure public.handle_typing_updated_at(); 