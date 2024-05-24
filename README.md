![](./public/screenshot.png)

<a href="https://joy-chat.vercel.app">
  <h1 align="center">JoyChat</h1>
</a>

<p align="center">
  An beautiful open-source AI chatbot built with Next.js, the Vercel AI SDK, OpenAI, and Vercel KV.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a> ·
  <a href="#authors"><strong>Authors</strong></a>
</p>
<br/>

## Stacks

- [Next.js](https://nextjs.org) App Router
- [Supabase](https://supabase.com/) for Database
- [Vercel AI SDK](https://sdk.vercel.ai/docs) for streaming chat UI
- Support for OpenAI (default), Anthropic, Cohere, Hugging Face, or custom AI chat models and/or LangChain
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - [Radix UI](https://radix-ui.com) for headless component primitives
- [NextAuth.js](https://github.com/nextauthjs/next-auth) for authentication

## Model Providers

This template ships with OpenAI `gpt-3.5-turbo` as the default. However, you can switch LLM providers to [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), [Hugging Face](https://huggingface.co), or using [LangChain](https://js.langchain.com) with just a few lines of code.

## Deploy Your Own

You can deploy your own version of the Next.js AI Chatbot to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-title=JoyChat&demo-description=A+full-featured%2C+hackable+Next.js+AI+chatbot+built+by+0xinhua&demo-url=https%3A%2F%2Fjoy-chat.vercel.app&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4aVPvWuTmBvzM5cEdRdqeW%2F4234f9baf160f68ffb385a43c3527645%2FCleanShot_2023-06-16_at_17.09.21.png&project-name=Next.js+Chat&repository-name=my-joychat&repository-url=https%3A%2F%2Fgithub.com%2F0xinhua%2Fjoychat&from=templates&skippable-integrations=1&env=OPENAI_API_KEY%2CAUTH_GITHUB_ID%2CAUTH_GITHUB_SECRET%2CAUTH_SECRET&envDescription=How+to+get+these+env+vars&envLink=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-chatbot%2Fblob%2Fmain%2F.env.example&teamCreateStatus=hidden&stores=[{"type":"kv"}])

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000/).

## Creating database instance on Supabase

This [docs](https://supabase.com/docs/guides/getting-started) will assist you in creating and configuring your PostgreSQL database instance on Supabase, enabling your application to interact with it.

Remember to update your environment variables (`SUPABASE_CONNECTION_STRING`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_PUBLIC_ANON_KEY`,) in the `.env` file with the appropriate credentials provided during the supabase database setup.

Table definition and functions use for this project:

```sql
-- 创建 chat_dataset schema
CREATE SCHEMA chat_dataset;

GRANT USAGE ON SCHEMA chat_dataset TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA chat_dataset TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA chat_dataset TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA chat_dataset TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA chat_dataset GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA chat_dataset GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA chat_dataset GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

```

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

```sql
CREATE OR REPLACE FUNCTION get_chat_data(p_user_id uuid, p_chat_id text)
RETURNS TABLE (
  id bigint,
  chat_id text,
  user_id uuid,
  title text,
  path text,
  created_at bigint,
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
    c.messages,
    c.share_path,
    c.updated_at
  FROM chat_dataset.chats c
  WHERE c.user_id = p_user_id AND c.chat_id = p_chat_id;
END;
$$;

```

```sql
CREATE OR REPLACE FUNCTION upsert_chat(
  p_chat_id text,
  p_title text,
  p_user_id uuid,
  p_created_at bigint,
  p_path text,
  p_messages jsonb,
  p_share_path text
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO chat_dataset.chats (chat_id, title, user_id, created_at, path, messages, share_path)
  VALUES (p_chat_id, p_title, p_user_id, p_created_at, p_path, p_messages, p_share_path)
  ON CONFLICT (chat_id) DO UPDATE
  SET 
    title = EXCLUDED.title,
    user_id = EXCLUDED.user_id,
    created_at = EXCLUDED.created_at,
    path = EXCLUDED.path,
    messages = EXCLUDED.messages,
    share_path = EXCLUDED.share_path;
END;
$$;
```

## License

[MIT](https://github.com/0xinhua/joychat?tab=MIT-1-ov-file)
