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
