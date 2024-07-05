# Supabase Data Storage Configuration

This section will guide you through configuring the `NEXT_PUBLIC_STORAGE_MODE` variable and setting up the necessary SQL configurations for storing chat data either locally or in the cloud using Supabase.

### Storage Mode

You can configure how your chat data is stored by setting the `NEXT_PUBLIC_STORAGE_MODE` environment variable in your `.env` file:

- **local**: This mode saves chat data directly in your browser's local storage.
- **cloud**: This mode syncs chat data to Supabase, a cloud-based PostgreSQL database.

Example:

To use Supabase for cloud storage, change the mode to `"cloud"`:

```env
NEXT_PUBLIC_STORAGE_MODE="cloud"
```

### Setting Up Supabase

To store chat data in Supabase, follow these steps:

1. **Create a Supabase account** and set up a new project by following [this guide](https://supabase.com/docs/guides/getting-started).

2. **Update environment variables** in your `.env` file with the credentials provided by Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
SUPABASE_SERVICE_ROLE_KEY="******"
```

### SQL Configuration

Execute the following SQL commands in the Supabase SQL editor to set up the necessary database schema, tables, and functions:

#### 1. Create Schema and Set Permissions

```sql
-- Create chat_dataset schema
CREATE SCHEMA chat_dataset;

GRANT USAGE ON SCHEMA chat_dataset TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA chat_dataset TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA chat_dataset TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA chat_dataset TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA chat_dataset GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA chat_dataset GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA chat_dataset GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
```

#### 2. Create Chats Table

```sql
CREATE TABLE IF NOT EXISTS
  chat_dataset.chats (
    id bigint generated always as identity,
    chat_id text not null,
    user_id uuid not null,
    title text null,
    path text null,
    created_at bigint null default (
      extract(
        epoch
        from
          current_timestamp
      ) * (1000)::numeric
    ),
    messages jsonb not null,
    share_path text null,
    current_model_name VARCHAR(50),
    updated_at bigint null default (
      extract(
        epoch
        from
          current_timestamp
      ) * (1000)::numeric
    ),
    constraint chats_pkey primary key (id),
    constraint chats_chat_id_key unique (chat_id),
    constraint chats_user_id_fkey foreign key (user_id) references next_auth.users (id)
  ) tablespace pg_default;
```

#### 3. Create Functions

- **Function to Get Chat Data**

```sql
CREATE OR REPLACE FUNCTION chat_dataset.get_chat_data(p_user_id uuid, p_chat_id text)
RETURNS TABLE (
  id bigint,
  chat_id text,
  user_id uuid,
  title text,
  path text,
  created_at bigint,
  current_model_name VARCHAR(50),
  messages jsonb,
  share_path text,
  updated_at bigint
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.chat_id,
    c.user_id,
    c.title,
    c.path,
    c.created_at,
    c.current_model_name,
    c.messages,
    c.share_path,
    c.updated_at
  FROM chat_dataset.chats c
  WHERE c.user_id = p_user_id AND c.chat_id = p_chat_id;
END;
$$;
```

- **Function to Upsert Chat Data**

```sql
CREATE OR REPLACE FUNCTION chat_dataset.upsert_chat(
  p_chat_id text,
  p_title text,
  p_user_id uuid,
  p_created_at bigint,
  p_path text,
  p_messages jsonb,
  p_share_path text,
  p_current_model_name VARCHAR(50)
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO chat_dataset.chats (
    chat_id, title, user_id, created_at, path, messages, share_path, current_model_name
  )
  VALUES (
    p_chat_id, p_title, p_user_id, p_created_at, p_path, p_messages, p_share_path, p_current_model_name
  )
  ON CONFLICT (chat_id) DO UPDATE
  SET 
    title = EXCLUDED.title,
    user_id = EXCLUDED.user_id,
    created_at = EXCLUDED.created_at,
    path = EXCLUDED.path,
    messages = EXCLUDED.messages,
    share_path = EXCLUDED.share_path,
    current_model_name = EXCLUDED.current_model_name;
END;
$$;
```

- **Function to delete user chat**

```sql
CREATE OR REPLACE FUNCTION chat_dataset.delete_chat(user_id UUID, chat_id UUID)
RETURNS TABLE (deleted_chat chat_dataset.chats) AS $$
BEGIN
    RETURN QUERY
    DELETE FROM chat_dataset.chats
    WHERE user_id = user_id AND chat_id = chat_id
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

```

- **Function to get all Chat history**

```sql
-- Execute the following SQL statement in the Supabase SQL Editor to create the function
CREATE OR REPLACE FUNCTION chat_dataset.get_user_chats(p_user_id uuid)
RETURNS TABLE(
  id bigint, 
  chat_id text, 
  user_id uuid, 
  title text, 
  path text, 
  created_at bigint, 
  messages jsonb, 
  share_path text,
  current_model_name VARCHAR(50),
  updated_at bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id, 
    c.chat_id, 
    c.user_id, 
    c.title, 
    c.path, 
    c.created_at, 
    c.messages, 
    c.share_path, 
    c.current_model_name,
    c.updated_at
  FROM chat_dataset.chats c
  WHERE c.user_id = p_user_id
  ORDER BY c.updated_at DESC;
END;
$$ LANGUAGE plpgsql;
```

- **Function to Delete all Chat data**

```sql
CREATE OR REPLACE FUNCTION chat_dataset.delete_user_chats(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  DELETE FROM chat_dataset.chats
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

```

- **Function to get system prompt data**

```sql
CREATE OR REPLACE FUNCTION chat_dataset.get_system_prompt_by_user_id(_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  prompt TEXT,
  created_at BIGINT,
  updated_at BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    sp.id,
    sp.user_id,
    sp.prompt,
    sp.created_at,
    sp.updated_at
  FROM
    chat_dataset.system_prompts sp
  WHERE
    sp.user_id = _user_id;
END;
$$ LANGUAGE plpgsql;

```

- **Function to upsert system prompt data**

```sql
create or replace function chat_dataset.upsert_system_prompt(
  _user_id uuid,
  _prompt text
)
returns void language plpgsql as $$
begin
  -- Try to update the existing record
  update chat_dataset.system_prompts
  set
    prompt = _prompt,
    updated_at = extract(epoch from current_timestamp) * 1000
  where
    user_id = _user_id;

  -- If no rows were updated, insert a new record
  if not found then
    insert into chat_dataset.system_prompts (user_id, prompt, created_at, updated_at)
    values (_user_id, _prompt, extract(epoch from current_timestamp) * 1000, extract(epoch from current_timestamp) * 1000);
  end if;
end;
$$;

```

- **Function to get shared chat data**

```sql
CREATE OR REPLACE FUNCTION chat_dataset.get_shared_chat(chat_id UUID)
RETURNS TABLE (chat_record chat_dataset.chats) AS $$
BEGIN
    RETURN QUERY
    SELECT * 
    FROM chat_dataset.chats
    WHERE chat_id = chat_id;
END;
$$ LANGUAGE plpgsql;

```

- **Function to update shared chat data**

```sql
CREATE OR REPLACE FUNCTION chat_dataset.update_share_path(a_chat_id TEXT, a_user_id UUID, a_share_path TEXT)
RETURNS SETOF chat_dataset.chats AS $$
BEGIN
    RETURN QUERY
    UPDATE chat_dataset.chats
    SET share_path = a_share_path
    WHERE chat_dataset.chats.chat_id = a_chat_id AND chat_dataset.chats.user_id = a_user_id
    RETURNING *;
END;
$$ LANGUAGE plpgsql;
```

By following these steps, you can configure your AI chatbot to store chat data either locally in the browser or in the cloud using Supabase.