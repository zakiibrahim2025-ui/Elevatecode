-- Add pending status and 2-day review period to employer bookings
-- Allow 'pending' and 'approved' in addition to existing statuses

ALTER TABLE employer_bookings
  DROP CONSTRAINT IF EXISTS employer_bookings_status_check;

ALTER TABLE employer_bookings
  ADD CONSTRAINT employer_bookings_status_check
  CHECK (status IN ('pending', 'approved', 'booked', 'cancelled', 'attended'));

ALTER TABLE employer_bookings
  ADD COLUMN IF NOT EXISTS review_due_at timestamptz;

-- Update the book function to set pending status and 2-day review window
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
    WHERE user_id = auth.uid() AND opportunity_id = p_opportunity_id AND status IN ('pending', 'approved', 'booked')
  ) THEN RAISE EXCEPTION 'Already booked'; END IF;

  IF v_opportunity.is_premium AND v_profile.premium_booked_at IS NOT NULL
     AND v_profile.premium_booked_at > now() - interval '30 days'
  THEN RAISE EXCEPTION 'Premium cooldown active'; END IF;

  INSERT INTO employer_bookings (user_id, opportunity_id, status, review_due_at)
  VALUES (auth.uid(), p_opportunity_id, 'pending', now() + interval '2 days')
  RETURNING * INTO v_booking;

  IF v_opportunity.is_premium THEN
    UPDATE profiles SET premium_booked_at = now() WHERE id = auth.uid();
  END IF;

  RETURN v_booking;
END;
$$;

REVOKE EXECUTE ON FUNCTION book_elevate_opportunity(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION book_elevate_opportunity(text) TO authenticated;
