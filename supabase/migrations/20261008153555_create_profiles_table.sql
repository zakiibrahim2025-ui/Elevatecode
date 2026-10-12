/*
# Create profiles table for Elevate student engagement app

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, unique)
  - `full_name` (text, nullable)
  - `points` (integer, default 0 — earned by attending sessions)
  - `attended` (text[], default '{}' — array of meeting IDs the student has attended)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `profiles`.
- Owner-scoped CRUD: each authenticated user can only read/update their own profile row.
- INSERT policy ensures a user can only create their own profile row.

3. Important Notes
- The app has a sign-in/sign-up screen, so policies are scoped to `authenticated`.
- `id` defaults to `auth.uid()` so inserts that omit the id still satisfy the INSERT policy.
- Points and attended are updated via UPDATE policy (not direct column privileges for this app tier).
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  points integer NOT NULL DEFAULT 0,
  attended text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile"
ON profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);
