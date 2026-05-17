-- Check if the RLS is enabled for the database
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements'
  ) THEN
    CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
  END IF;
END
$$;

-- This file contains SQL commands to set up the database tables
-- You can run these commands in the Supabase SQL Editor

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view their own profile'
  ) THEN
    CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);
  END IF;
END
$$;

-- Create saved_articles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.saved_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  article_title TEXT NOT NULL,
  article_data JSONB NOT NULL,
  article_token TEXT,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS saved_articles_user_id_idx ON public.saved_articles(user_id);
CREATE INDEX IF NOT EXISTS saved_articles_article_token_idx ON public.saved_articles(article_token);

-- Set up RLS for saved_articles
ALTER TABLE public.saved_articles ENABLE ROW LEVEL SECURITY;

-- Create policies for saved_articles if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'saved_articles' AND policyname = 'Users can view their own saved articles'
  ) THEN
    CREATE POLICY "Users can view their own saved articles"
    ON public.saved_articles
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'saved_articles' AND policyname = 'Users can insert their own saved articles'
  ) THEN
    CREATE POLICY "Users can insert their own saved articles"
    ON public.saved_articles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'saved_articles' AND policyname = 'Users can delete their own saved articles'
  ) THEN
    CREATE POLICY "Users can delete their own saved articles"
    ON public.saved_articles
    FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Create claims table for anonymous verification logging
CREATE TABLE IF NOT EXISTS public.claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_text TEXT NOT NULL,
  verdict TEXT NOT NULL CHECK (verdict IN ('true', 'false', 'misleading', 'unverifiable')),
  confidence_score NUMERIC(3, 2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  language_detected TEXT NOT NULL,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS claims_created_at_idx ON public.claims(created_at DESC);
CREATE INDEX IF NOT EXISTS claims_verdict_idx ON public.claims(verdict);

ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'claims' AND policyname = 'Anyone can insert claim logs'
  ) THEN
    CREATE POLICY "Anyone can insert claim logs"
    ON public.claims
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'claims' AND policyname = 'Anyone can read claim logs'
  ) THEN
    CREATE POLICY "Anyone can read claim logs"
    ON public.claims
    FOR SELECT
    TO anon, authenticated
    USING (true);
  END IF;
END
$$;

-- Create a function to execute SQL directly
CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE sql_query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to create tables
CREATE OR REPLACE FUNCTION create_tables()
RETURNS VOID AS $$
BEGIN
  -- Create profiles table if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    CREATE TABLE public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      display_name TEXT,
      phone_number TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Users can view their own profile"
      ON public.profiles
      FOR SELECT
      USING (auth.uid() = id);
      
    CREATE POLICY "Users can update their own profile"
      ON public.profiles
      FOR UPDATE
      USING (auth.uid() = id);
      
    CREATE POLICY "Users can insert their own profile"
      ON public.profiles
      FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;

  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'claims') THEN
    CREATE TABLE public.claims (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      claim_text TEXT NOT NULL,
      verdict TEXT NOT NULL CHECK (verdict IN ('true', 'false', 'misleading', 'unverifiable')),
      confidence_score NUMERIC(3, 2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
      language_detected TEXT NOT NULL,
      source_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS claims_created_at_idx ON public.claims(created_at DESC);
    CREATE INDEX IF NOT EXISTS claims_verdict_idx ON public.claims(verdict);

    ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Anyone can insert claim logs"
      ON public.claims
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);

    CREATE POLICY "Anyone can read claim logs"
      ON public.claims
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to ensure tables exist
SELECT create_tables();
