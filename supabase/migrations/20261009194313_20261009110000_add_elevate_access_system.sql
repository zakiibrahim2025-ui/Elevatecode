/*
# Add Elevate courses, XP rules, and employer access bookings

1. New profile fields
- `profiles.course` stores the learner's selected T Level course.
- `profiles.premium_booked_at` stores the last restricted employer booking time.

2. New tables
- `employer_opportunities` stores the server-owned employer catalogue, required XP, allowed courses, and access tier.
- `employer_bookings` stores each learner's booking history and status.

3. Security
- RLS is enabled on both new tables.
- Learners can read the employer catalogue but cannot modify it.
- Learners can read and cancel their own bookings.
- XP, attendance, eligibility, course matching, duplicate booking prevention, and the 30-day premium cooldown are enforced in database functions.
- Direct profile updates to XP and attendance are revoked so the browser cannot award itself points.

4. Important notes
- Premium cooldown applies across all restricted premium employers for 30 days.
- Ordinary workshops remain available while a premium cooldown is active.
- The functions use the authenticated session identity and do not trust a user-supplied user ID.
*/

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS course text,
  ADD COLUMN IF NOT EXISTS premium_booked_at timestamptz;

CREATE TABLE IF NOT EXISTS employer_opportunities (
  id text PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  industry text NOT NULL,
  allowed_courses text[] NOT NULL,
  xp_required integer NOT NULL CHECK (xp_required >= 0),
  access_tier text NOT NULL CHECK (access_tier IN ('Standard', 'Advanced', 'Premium')),
  is_premium boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS employer_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id text NOT NULL REFERENCES employer_opportunities(id),
  status text NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'cancelled', 'attended')),
  booked_at timestamptz NOT NULL DEFAULT now(),
  cancelled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE employer_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_read_opportunities" ON employer_opportunities;
CREATE POLICY "authenticated_read_opportunities"
ON employer_opportunities FOR SELECT
TO authenticated USING (true);

DROP POLICY IF EXISTS "select_own_bookings" ON employer_bookings;
CREATE POLICY "select_own_bookings"
ON employer_bookings FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_bookings" ON employer_bookings;
CREATE POLICY "insert_own_bookings"
ON employer_bookings FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_bookings" ON employer_bookings;
CREATE POLICY "update_own_bookings"
ON employer_bookings FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_bookings" ON employer_bookings;
CREATE POLICY "delete_own_bookings"
ON employer_bookings FOR DELETE
TO authenticated USING (auth.uid() = user_id);

REVOKE UPDATE ON profiles FROM authenticated;
GRANT UPDATE (full_name, course) ON profiles TO authenticated;

INSERT INTO employer_opportunities (id, name, role, industry, allowed_courses, xp_required, access_tier, is_premium)
VALUES
  ('amazon-cloud', 'Amazon', 'Cloud Technology Workshop', 'Cloud & E-commerce', ARRAY['Digital'], 500, 'Standard', false),
  ('ibm-ai', 'IBM', 'AI & Data Skills Lab', 'Technology', ARRAY['Digital'], 1500, 'Advanced', false),
  ('cisco-networking', 'Cisco', 'Elite Networking Lab', 'Networking', ARRAY['Digital'], 3000, 'Premium', true),
  ('lloyds-finance', 'Lloyds Bank', 'Financial Services Insight Day', 'Finance', ARRAY['Accounting'], 500, 'Standard', false),
  ('deloitte-audit', 'Deloitte', 'Audit & Advisory Challenge', 'Professional Services', ARRAY['Accounting'], 1500, 'Advanced', false),
  ('barclays-finance', 'Barclays', 'Future Finance Sprint', 'Finance', ARRAY['Accounting'], 3000, 'Premium', true),
  ('polymateria-lab', 'Polymateria', 'Materials Science Research Lab', 'Green Science', ARRAY['Lab Science'], 500, 'Standard', false),
  ('nhs-lab', 'NHS', 'Clinical Science Careers Session', 'Healthcare', ARRAY['Lab Science'], 1500, 'Advanced', false),
  ('astrazeneca-lab', 'AstraZeneca', 'Discovery Science Experience', 'Life Sciences', ARRAY['Lab Science'], 3000, 'Premium', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  industry = EXCLUDED.industry,
  allowed_courses = EXCLUDED.allowed_courses,
  xp_required = EXCLUDED.xp_required,
  access_tier = EXCLUDED.access_tier,
  is_premium = EXCLUDED.is_premium;

CREATE OR REPLACE FUNCTION attend_elevate_session(p_session_id text)
RETURNS TABLE (new_points integer, new_attended text[])
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_points integer;
  v_attended text[];
  v_award integer;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  v_award := CASE p_session_id
    WHEN 'm1' THEN 15
    WHEN 'm2' THEN 10
    WHEN 'm3' THEN 20
    WHEN 'm4' THEN 25
    WHEN 'm5' THEN 30
    WHEN 'm6' THEN 35
    WHEN 'm7' THEN 25
    ELSE NULL
  END;

  IF v_award IS NULL THEN RAISE EXCEPTION 'Unknown session'; END IF;

  SELECT points, attended INTO v_points, v_attended
  FROM profiles WHERE id = auth.uid() FOR UPDATE;

  IF v_attended @> ARRAY[p_session_id] THEN
    RETURN QUERY SELECT v_points, v_attended;
    RETURN;
  END IF;

  UPDATE profiles
  SET points = points + v_award,
      attended = array_append(attended, p_session_id)
  WHERE id = auth.uid()
  RETURNING points, attended INTO new_points, new_attended;

  RETURN NEXT;
END;
$$;

CREATE OR REPLACE FUNCTION book_elevate_opportunity(p_opportunity_id text)
RETURNS employer_bookings
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_profile profiles;
  v_opportunity employer_opportunities;
  v_booking employer_bookings;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT * INTO v_profile FROM profiles WHERE id = auth.uid() FOR UPDATE;
  SELECT * INTO v_opportunity FROM employer_opportunities WHERE id = p_opportunity_id;

  IF v_opportunity.id IS NULL THEN RAISE EXCEPTION 'Opportunity unavailable'; END IF;
  IF v_profile.course IS NULL OR NOT (v_profile.course = ANY(v_opportunity.allowed_courses)) THEN RAISE EXCEPTION 'Course not eligible'; END IF;
  IF v_profile.points < v_opportunity.xp_required THEN RAISE EXCEPTION 'More XP required'; END IF;

  IF EXISTS (
    SELECT 1 FROM employer_bookings
    WHERE user_id = auth.uid() AND opportunity_id = p_opportunity_id AND status = 'booked'
  ) THEN RAISE EXCEPTION 'Already booked'; END IF;

  IF v_opportunity.is_premium AND v_profile.premium_booked_at IS NOT NULL
     AND v_profile.premium_booked_at > now() - interval '30 days'
  THEN RAISE EXCEPTION 'Premium cooldown active'; END IF;

  INSERT INTO employer_bookings (user_id, opportunity_id)
  VALUES (auth.uid(), p_opportunity_id)
  RETURNING * INTO v_booking;

  IF v_opportunity.is_premium THEN
    UPDATE profiles SET premium_booked_at = now() WHERE id = auth.uid();
  END IF;

  RETURN v_booking;
END;
$$;

REVOKE EXECUTE ON FUNCTION attend_elevate_session(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION attend_elevate_session(text) TO authenticated;
REVOKE EXECUTE ON FUNCTION book_elevate_opportunity(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION book_elevate_opportunity(text) TO authenticated;

CREATE INDEX IF NOT EXISTS employer_bookings_user_status_idx
  ON employer_bookings (user_id, status);
