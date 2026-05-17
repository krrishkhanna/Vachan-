DO $$
BEGIN
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
