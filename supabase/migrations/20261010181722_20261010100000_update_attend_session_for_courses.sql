-- Update attend_elevate_session to handle course-specific session IDs
-- Digital: d1-d7, Accounting: a1-a7, Lab Science: l1-l7
-- Daily workshops: daily-digital|date, daily-accounting|date, daily-lab|date

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

  -- Extract base ID for daily workshops (strip the |date suffix)
  v_award := CASE
    WHEN p_session_id LIKE 'd1%' THEN 15
    WHEN p_session_id LIKE 'd2%' THEN 10
    WHEN p_session_id LIKE 'd3%' THEN 20
    WHEN p_session_id LIKE 'd4%' THEN 25
    WHEN p_session_id LIKE 'd5%' THEN 30
    WHEN p_session_id LIKE 'd6%' THEN 35
    WHEN p_session_id LIKE 'd7%' THEN 25
    WHEN p_session_id LIKE 'a1%' THEN 15
    WHEN p_session_id LIKE 'a2%' THEN 10
    WHEN p_session_id LIKE 'a3%' THEN 20
    WHEN p_session_id LIKE 'a4%' THEN 25
    WHEN p_session_id LIKE 'a5%' THEN 30
    WHEN p_session_id LIKE 'a6%' THEN 35
    WHEN p_session_id LIKE 'a7%' THEN 25
    WHEN p_session_id LIKE 'l1%' THEN 15
    WHEN p_session_id LIKE 'l2%' THEN 10
    WHEN p_session_id LIKE 'l3%' THEN 20
    WHEN p_session_id LIKE 'l4%' THEN 25
    WHEN p_session_id LIKE 'l5%' THEN 30
    WHEN p_session_id LIKE 'l6%' THEN 35
    WHEN p_session_id LIKE 'l7%' THEN 25
    WHEN p_session_id LIKE 'daily-%' THEN 18
    WHEN p_session_id = 'm1' THEN 15
    WHEN p_session_id = 'm2' THEN 10
    WHEN p_session_id = 'm3' THEN 20
    WHEN p_session_id = 'm4' THEN 25
    WHEN p_session_id = 'm5' THEN 30
    WHEN p_session_id = 'm6' THEN 35
    WHEN p_session_id = 'm7' THEN 25
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

REVOKE EXECUTE ON FUNCTION attend_elevate_session(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION attend_elevate_session(text) TO authenticated;
